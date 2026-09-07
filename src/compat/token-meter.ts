/**
 * 100% Drop-In Replacement for @stripe/token-meter
 * Metering for native OpenAI, Anthropic, and Google Gemini SDKs
 */

import { VibezMeter } from '../meter/client';
import { calculateUsageCost } from '../pricing/calculator';

export interface TokenMeterConfig {
  eventName?: string;
}

export type TokenMeterCustomer = string | { customer?: string; customerId?: string };

export interface TokenMeter {
  trackUsage(response: any, customer: TokenMeterCustomer): void;
  track(response: any, customer: TokenMeterCustomer): void;
  trackUsageStreamOpenAI<T>(stream: T, customer: TokenMeterCustomer): T;
  trackUsageStreamAnthropic<T>(stream: T, customer: TokenMeterCustomer): T;
  trackUsageStreamGemini<T>(stream: T, customer: TokenMeterCustomer, modelName?: string): T;
  trackUsageStreamDeepSeek<T>(stream: T, customer: TokenMeterCustomer, modelName?: string): T;
  trackUsageStreamGroq<T>(stream: T, customer: TokenMeterCustomer, modelName?: string): T;
  trackUsageStreamMistral<T>(stream: T, customer: TokenMeterCustomer, modelName?: string): T;
  trackUsageStream<T>(stream: T, customer: TokenMeterCustomer, options?: { model?: string; provider?: string }): T;
}

export function createTokenMeter(
  stripeApiKey?: string,
  config: TokenMeterConfig = {}
): TokenMeter {
  const apiKey = stripeApiKey || (typeof process !== 'undefined' ? (process.env?.STRIPE_SECRET_KEY || process.env?.STRIPE_API_KEY) : undefined);
  const meter = new VibezMeter({
    apiKey,
    eventName: config.eventName,
  });

  const resolveCustomer = (cust: TokenMeterCustomer): string => {
    if (typeof cust === 'string') return cust;
    return cust.customerId || cust.customer || 'unknown-customer';
  };

  return {
    trackUsage(response: any, customer: TokenMeterCustomer): void {
      if (!response) return;
      const customerId = resolveCustomer(customer);
      meter.trackUsage(response, { customer: customerId });
    },

    track(response: any, customer: TokenMeterCustomer): void {
      if (!response) return;
      const customerId = resolveCustomer(customer);
      meter.trackUsage(response, { customer: customerId });
    },

    trackUsageStreamOpenAI<T>(stream: any, customer: TokenMeterCustomer): T {
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const stripeCustomerId = resolveCustomer(customer);
      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = 'gpt-4o';

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.model) {
              capturedModel = chunk.model;
            }
            if (chunk.usage || chunk.token_usage) {
              capturedUsage = chunk.usage || chunk.token_usage;
            }
            yield chunk;
          }
        } finally {
          if (capturedUsage) {
            meter.recordUsage({
              model: capturedModel,
              provider: 'openai',
              inputTokens: capturedUsage.prompt_tokens ?? capturedUsage.inputTokens ?? 0,
              outputTokens: capturedUsage.completion_tokens ?? capturedUsage.outputTokens ?? 0,
              reasoningTokens:
                capturedUsage.completion_tokens_details?.reasoning_tokens ??
                capturedUsage.output_token_details?.reasoning_tokens ??
                0,
              cachedTokens:
                capturedUsage.prompt_tokens_details?.cached_tokens ??
                capturedUsage.input_token_details?.cached_tokens ??
                0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamAnthropic<T>(stream: any, customer: TokenMeterCustomer): T {
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const stripeCustomerId = resolveCustomer(customer);
      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = 'claude-3-5-sonnet';

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.type === 'message_start' && chunk.message?.model) {
              capturedModel = chunk.message.model;
              if (chunk.message.usage) {
                capturedUsage = { ...capturedUsage, ...chunk.message.usage };
              }
            } else if (chunk.type === 'message_delta' && chunk.usage) {
              capturedUsage = { ...capturedUsage, ...chunk.usage };
            }
            yield chunk;
          }
        } finally {
          if (capturedUsage) {
            meter.recordUsage({
              model: capturedModel,
              provider: 'anthropic',
              inputTokens: capturedUsage.input_tokens ?? 0,
              outputTokens: capturedUsage.output_tokens ?? 0,
              cachedTokens: capturedUsage.cache_read_input_tokens ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamGemini<T>(streamResult: any, customer: TokenMeterCustomer, modelName: string = 'gemini-2.0-flash'): T {
      const stripeCustomerId = resolveCustomer(customer);
      const originalStream = streamResult?.stream || streamResult;
      if (!originalStream || typeof originalStream[Symbol.asyncIterator] !== 'function') {
        return streamResult;
      }

      const wrappedAsyncGenerator = async function* () {
        let lastUsageMetadata: any = null;

        try {
          for await (const chunk of originalStream) {
            if (chunk.usageMetadata) {
              lastUsageMetadata = chunk.usageMetadata;
            }
            yield chunk;
          }
        } finally {
          if (lastUsageMetadata) {
            meter.recordUsage({
              model: modelName,
              provider: 'google',
              inputTokens: lastUsageMetadata.promptTokenCount ?? 0,
              outputTokens:
                (lastUsageMetadata.candidatesTokenCount ?? 0) +
                (lastUsageMetadata.thoughtsTokenCount ?? 0),
              reasoningTokens: lastUsageMetadata.thoughtsTokenCount ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      if (streamResult && streamResult.stream) {
        return {
          ...streamResult,
          stream: wrappedAsyncGenerator(),
        } as T;
      }

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamDeepSeek<T>(stream: any, customer: TokenMeterCustomer, modelName: string = 'deepseek-chat'): T {
      const stripeCustomerId = resolveCustomer(customer);
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = modelName;

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.model) capturedModel = chunk.model;
            if (chunk.usage) capturedUsage = chunk.usage;
            yield chunk;
          }
        } finally {
          if (capturedUsage) {
            meter.recordUsage({
              model: capturedModel,
              provider: 'deepseek',
              inputTokens: capturedUsage.prompt_tokens ?? capturedUsage.inputTokens ?? 0,
              outputTokens: capturedUsage.completion_tokens ?? capturedUsage.outputTokens ?? 0,
              reasoningTokens: capturedUsage.completion_tokens_details?.reasoning_tokens ?? 0,
              cachedTokens: capturedUsage.prompt_cache_hit_tokens ?? capturedUsage.prompt_tokens_details?.cached_tokens ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamGroq<T>(stream: any, customer: TokenMeterCustomer, modelName: string = 'llama-3.3-70b-versatile'): T {
      const stripeCustomerId = resolveCustomer(customer);
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = modelName;

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.model) capturedModel = chunk.model;
            if (chunk.usage || chunk.x_groq?.usage) {
              capturedUsage = chunk.usage || chunk.x_groq?.usage;
            }
            yield chunk;
          }
        } finally {
          if (capturedUsage) {
            meter.recordUsage({
              model: capturedModel,
              provider: 'groq',
              inputTokens: capturedUsage.prompt_tokens ?? 0,
              outputTokens: capturedUsage.completion_tokens ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamMistral<T>(stream: any, customer: TokenMeterCustomer, modelName: string = 'mistral-large-latest'): T {
      const stripeCustomerId = resolveCustomer(customer);
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = modelName;

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.model) capturedModel = chunk.model;
            if (chunk.usage) capturedUsage = chunk.usage;
            yield chunk;
          }
        } finally {
          if (capturedUsage) {
            meter.recordUsage({
              model: capturedModel,
              provider: 'mistral',
              inputTokens: capturedUsage.prompt_tokens ?? 0,
              outputTokens: capturedUsage.completion_tokens ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStream<T>(stream: T, customer: TokenMeterCustomer, options: { model?: string; provider?: string } = {}): T {
      const stripeCustomerId = resolveCustomer(customer);
      return meter.wrapStream(stream, {
        customer: stripeCustomerId,
        model: options.model,
        provider: options.provider,
      });
    },
  };
}

export default createTokenMeter;
