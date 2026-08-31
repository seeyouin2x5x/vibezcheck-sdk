import type {
  CustomerParam,
  UsageEvent,
  CircuitBreakerOptions,
  BudgetExceededEvent,
} from '../types';
import { VibezCircuitBreakerError } from '../types';
import { createMeter, VibezMeter } from '../meter/client';
import { calculateUsageCost } from '../pricing/calculator';

export interface WithBillingOptions extends CircuitBreakerOptions {
  /** Customer email, user ID, or Stripe customer ID */
  customer?: CustomerParam;
  /** Direct Stripe customer ID */
  customerId?: string;
  /** Stripe API Key override (uses STRIPE_SECRET_KEY env by default) */
  stripeApiKey?: string;
  /** Existing VibezMeter instance (optional) */
  meter?: VibezMeter;
  /** Custom meter event name */
  eventName?: string;
  /** Usage callback fired upon generation/stream completion */
  onUsage?: (event: UsageEvent) => void | Promise<void>;
  /** Custom developer metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Wraps any Vercel AI SDK LanguageModel (v2 or v3) with automated Stripe billing, token metering, and agent circuit breakers.
 *
 * @param model - The Vercel AI SDK language model instance (e.g. openai('gpt-5.6-sol'), anthropic('claude-3-7-sonnet'))
 * @param options - Billing & customer configuration
 * @returns Decorated LanguageModel that automatically meters tokens, sends Stripe meter events, and enforces budget guardrails
 */
export function withBilling<T extends object>(model: T, options: WithBillingOptions = {}): T {
  if (!model || typeof model !== 'object') {
    return model;
  }

  const meter =
    options.meter ||
    createMeter({
      apiKey: options.stripeApiKey,
      eventName: options.eventName,
    });

  const customerId =
    typeof options.customer === 'string'
      ? options.customer
      : options.customer?.id || options.customerId;

  const modelId = (model as any).modelId || 'unknown-model';
  const provider = (model as any).provider?.replace(/^@ai-sdk\//, '') || 'ai-sdk';

  // Helper to record usage and enforce circuit breakers
  const handleUsage = (rawUsage: any) => {
    if (!rawUsage) return;

    const inputTokens = rawUsage.promptTokens ?? rawUsage.inputTokens ?? 0;
    const outputTokens = rawUsage.completionTokens ?? rawUsage.outputTokens ?? 0;
    const reasoningTokens =
      rawUsage.reasoningTokens ??
      rawUsage.completionTokensDetails?.reasoningTokens ??
      rawUsage.outputTokenDetails?.reasoningTokens ??
      0;
    const cachedTokens =
      rawUsage.promptTokensDetails?.cachedTokens ??
      rawUsage.inputTokenDetails?.cachedTokens ??
      0;

    const usage = {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
      visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
      cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
    };

    const cost = calculateUsageCost(modelId, usage);

    // 🛡️ Agent Circuit Breakers Check
    if (options.maxCostPerCallUSD && cost.totalUSD > options.maxCostPerCallUSD) {
      const budgetEvent: BudgetExceededEvent = {
        reason: 'cost_per_call_exceeded',
        limit: options.maxCostPerCallUSD,
        current: cost.totalUSD,
        model: modelId,
        customerId,
        message: `[vibezcheck] Circuit Breaker tripped: Call cost ($${cost.totalUSD.toFixed(4)}) exceeded maxCostPerCallUSD threshold ($${options.maxCostPerCallUSD.toFixed(4)}).`,
      };

      if (options.onBudgetExceeded) {
        options.onBudgetExceeded(budgetEvent);
      }

      if (options.throwOnBudgetExceeded) {
        throw new VibezCircuitBreakerError(budgetEvent);
      }
    }

    if (options.maxTokensPerCall && usage.totalTokens > options.maxTokensPerCall) {
      const budgetEvent: BudgetExceededEvent = {
        reason: 'max_tokens_exceeded',
        limit: options.maxTokensPerCall,
        current: usage.totalTokens,
        model: modelId,
        customerId,
        message: `[vibezcheck] Circuit Breaker tripped: Token count (${usage.totalTokens}) exceeded maxTokensPerCall limit (${options.maxTokensPerCall}).`,
      };

      if (options.onBudgetExceeded) {
        options.onBudgetExceeded(budgetEvent);
      }

      if (options.throwOnBudgetExceeded) {
        throw new VibezCircuitBreakerError(budgetEvent);
      }
    }

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      model: modelId,
      provider,
      usage,
      cost,
      customerId,
      metadata: options.metadata,
    };

    // Record via meter batcher
    meter.recordUsage({
      model: modelId,
      provider,
      inputTokens,
      outputTokens,
      reasoningTokens: usage.reasoningTokens,
      cachedTokens: usage.cachedTokens,
      customerId,
      metadata: options.metadata,
    });

    if (options.onUsage) {
      options.onUsage(event);
    }
  };

  // Proxy to intercept LanguageModel calls
  const handler: ProxyHandler<any> = {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);

      // Intercept doStream (Vercel AI SDK v1/v2/v3)
      if (prop === 'doStream' && typeof originalValue === 'function') {
        return async function (...args: any[]) {
          const result = await originalValue.apply(target, args);
          if (!result || !result.stream) {
            return result;
          }

          const originalStream = result.stream;

          // Wrap stream to capture tokens upon finish chunk
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk);

              // AI SDK v1/v2/v3 stream finish chunk containing usage
              if (chunk.type === 'finish' && chunk.usage) {
                handleUsage(chunk.usage);
              }
            },
          });

          return {
            ...result,
            stream: originalStream.pipeThrough(transformStream),
          };
        };
      }

      // Intercept doGenerate (Vercel AI SDK v1/v2/v3)
      if (prop === 'doGenerate' && typeof originalValue === 'function') {
        return async function (...args: any[]) {
          const result = await originalValue.apply(target, args);
          if (result && result.usage) {
            handleUsage(result.usage);
          }
          return result;
        };
      }

      return originalValue;
    },
  };

  return new Proxy(model, handler);
}

/**
 * Convenient alias for withBilling
 */
export const meteredModel = withBilling;
