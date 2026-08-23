import type { CustomerParam, UsageEvent } from '../types';
import { createMeter, VibezMeter } from '../meter/client';
import { calculateUsageCost } from '../pricing/calculator';

export interface WithBillingOptions {
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
 * Wraps any Vercel AI SDK LanguageModel (v2 or v3) with automated Stripe billing and token metering.
 *
 * @param model - The Vercel AI SDK language model instance (e.g. openai('gpt-5.6-sol'), anthropic('claude-3-7-sonnet'))
 * @param options - Billing & customer configuration
 * @returns Decorated LanguageModel that automatically meters tokens and sends Stripe meter events
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

  // Helper to record usage
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

  // Create a Proxy around the LanguageModel to intercept doGenerate and doStream
  return new Proxy(model, {
    get(target, prop, receiver) {
      const originalValue = Reflect.get(target, prop, receiver);

      // 1. Intercept doGenerate (synchronous generation)
      if (prop === 'doGenerate' && typeof originalValue === 'function') {
        return async function (...args: any[]) {
          const result = await originalValue.apply(target, args);
          if (result && result.usage) {
            handleUsage(result.usage);
          }
          return result;
        };
      }

      // 2. Intercept doStream (streaming generation)
      if (prop === 'doStream' && typeof originalValue === 'function') {
        return async function (...args: any[]) {
          const result = await originalValue.apply(target, args);
          if (!result || !result.stream) {
            return result;
          }

          const originalStream = result.stream;

          // If stream is a standard Web ReadableStream
          if (typeof (originalStream as any).getReader === 'function') {
            const reader = (originalStream as any).getReader();
            const transformedStream = new ReadableStream({
              async start(controller) {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                      controller.close();
                      break;
                    }

                    // Inspect stream chunks for 'finish' usage
                    if (value && typeof value === 'object') {
                      if (value.type === 'finish' && value.usage) {
                        handleUsage(value.usage);
                      }
                    }

                    controller.enqueue(value);
                  }
                } catch (err) {
                  controller.error(err);
                }
              },
            });

            return {
              ...result,
              stream: transformedStream,
            };
          }

          // If stream is an AsyncIterable
          if (Symbol.asyncIterator in originalStream) {
            const wrappedAsyncIterable = {
              async *[Symbol.asyncIterator]() {
                for await (const chunk of originalStream) {
                  if (chunk && typeof chunk === 'object') {
                    if (chunk.type === 'finish' && chunk.usage) {
                      handleUsage(chunk.usage);
                    }
                  }
                  yield chunk;
                }
              },
            };

            return {
              ...result,
              stream: wrappedAsyncIterable,
            };
          }

          return result;
        };
      }

      return originalValue;
    },
  });
}

/**
 * Alias for withBilling
 */
export const meteredModel = withBilling;
