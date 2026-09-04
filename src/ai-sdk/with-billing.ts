import type {
  CustomerParam,
  UsageEvent,
  CircuitBreakerOptions,
  BudgetExceededEvent,
  BillingConfig,
  PricingConfig,
  InlineRateConfig,
} from '../types';
import { VibezCircuitBreakerError } from '../types';
import { createMeter, VibezMeter } from '../meter/client';
import { calculateUsageCost } from '../pricing/calculator';

export interface WithBillingOptions extends CircuitBreakerOptions {
  /** Customer email, user ID, or Stripe customer ID */
  customer?: CustomerParam;
  /** Direct Stripe customer ID */
  customerId?: string;
  /** Billing mode configuration (postpaid vs prepaid) */
  billing?: BillingConfig;
  /** Profit margin & minimum charge configuration */
  pricing?: PricingConfig;
  /** 1-line inline pricing rate card */
  rate?: InlineRateConfig;
  /** Whether to capture tokens if the client aborts or closes tab mid-stream (default: true) */
  captureOnAbort?: boolean;
  /** Execution runtime environment (default: 'auto') */
  runtime?: 'auto' | 'serverless' | 'edge' | 'node';
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
 * Sane Defaults Built-In:
 * - $0.50 safety ceiling per call (overridable)
 * - Automatic in-flight token capture on abort
 * - Automatic prompt caching discount parsing
 * - Serverless lifecycle preservation
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

  // Sane Default: $0.50 circuit breaker ceiling unless explicitly disabled or configured
  const maxCostPerCall = options.maxCostPerCallUSD !== undefined ? options.maxCostPerCallUSD : 0.50;
  const captureOnAbort = options.captureOnAbort !== false; // Default: true

  // Helper to safely schedule serverless flushes
  const scheduleFlush = () => {
    try {
      const flushPromise = meter.flush();
      // Next.js 15+ after() or Cloudflare Workers waitUntil()
      if (typeof globalThis !== 'undefined') {
        const g = globalThis as any;
        if (typeof g.after === 'function') {
          g.after(() => flushPromise);
          return;
        }
      }
    } catch {
      // Fallback in environments without after()
    }
  };

  // Helper to record usage and enforce circuit breakers
  const handleUsage = (rawUsage: any, extraMeta?: Record<string, any>) => {
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

    // Calculate cost with profit margin & minimum charge & custom rates
    const cost = calculateUsageCost(modelId, usage, {
      markupMultiplier: options.pricing?.margin,
      minimumChargeUSD: options.pricing?.minimumChargeUSD,
      customRate: options.rate,
    });

    // 🛡️ Agent Circuit Breakers Check ($0.50 default safety fuse)
    if (maxCostPerCall > 0 && maxCostPerCall !== Infinity && cost.totalUSD > maxCostPerCall) {
      const budgetEvent: BudgetExceededEvent = {
        reason: 'cost_per_call_exceeded',
        limit: maxCostPerCall,
        current: cost.totalUSD,
        model: modelId,
        customerId,
        message: `[vibezcheck] Circuit Breaker tripped: Call cost ($${cost.totalUSD.toFixed(4)}) exceeded budget ceiling ($${maxCostPerCall.toFixed(4)}).`,
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
      metadata: {
        ...options.metadata,
        ...extraMeta,
        billingMode: options.billing?.mode || 'postpaid',
      },
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
      metadata: event.metadata,
    });

    if (options.onUsage) {
      options.onUsage(event);
    }

    scheduleFlush();
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
          let streamCompleted = false;
          let accumulatedChars = 0;

          // Estimate input prompt tokens from args if available
          let estimatedInputTokens = 0;
          try {
            if (args[0]?.prompt) {
              const str = typeof args[0].prompt === 'string' ? args[0].prompt : JSON.stringify(args[0].prompt);
              estimatedInputTokens = Math.ceil(str.length / 4);
            }
          } catch {}

          // In-flight abort signal listener
          const abortSignal = args[0]?.abortSignal;
          if (abortSignal && captureOnAbort) {
            abortSignal.addEventListener(
              'abort',
              () => {
                if (!streamCompleted && accumulatedChars > 0) {
                  streamCompleted = true;
                  const estimatedOutputTokens = Math.ceil(accumulatedChars / 3.8);
                  handleUsage(
                    {
                      inputTokens: estimatedInputTokens,
                      outputTokens: estimatedOutputTokens,
                    },
                    { aborted: true, partial: true }
                  );
                }
              },
              { once: true }
            );
          }

          // Wrap stream to capture tokens upon finish chunk or abort
          const transformStream = new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk);

              if (chunk.type === 'text-delta' && chunk.textDelta) {
                accumulatedChars += chunk.textDelta.length;
              }

              // AI SDK stream finish chunk containing exact provider usage
              if (chunk.type === 'finish' && chunk.usage) {
                streamCompleted = true;
                handleUsage(chunk.usage);
              }
            },
            flush() {
              // If stream ended without finish chunk (e.g. cancelled/aborted), record partial tokens
              if (!streamCompleted && captureOnAbort && accumulatedChars > 0) {
                streamCompleted = true;
                const estimatedOutputTokens = Math.ceil(accumulatedChars / 3.8);
                handleUsage(
                  {
                    inputTokens: estimatedInputTokens,
                    outputTokens: estimatedOutputTokens,
                  },
                  { aborted: true, partial: true }
                );
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
