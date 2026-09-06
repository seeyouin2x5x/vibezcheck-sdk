/**
 * 100% Drop-In Replacement for @stripe/token-meter
 * Metering for native OpenAI, Anthropic, and Google Gemini SDKs
 */

import { VibezMeter } from '../meter/client';
import { calculateUsageCost } from '../pricing/calculator';

export interface TokenMeterConfig {
  eventName?: string;
}

export interface TokenMeter {
  trackUsage(response: any, stripeCustomerId: string): void;
  trackUsageStreamOpenAI<T>(stream: T, stripeCustomerId: string): T;
  trackUsageStreamAnthropic<T>(stream: T, stripeCustomerId: string): T;
  trackUsageStreamGemini<T>(stream: T, stripeCustomerId: string, modelName: string): T;
}

export function createTokenMeter(
  stripeApiKey: string,
  config: TokenMeterConfig = {}
): TokenMeter {
  const meter = new VibezMeter({
    apiKey: stripeApiKey,
    eventName: config.eventName,
  });

  return {
    trackUsage(response: any, stripeCustomerId: string): void {
      if (!response) return;
      meter.trackUsage(response, { customer: stripeCustomerId });
    },

    trackUsageStreamOpenAI<T>(stream: any, stripeCustomerId: string): T {
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

      const originalIterator = stream[Symbol.asyncIterator].bind(stream);
      let capturedUsage: any = null;
      let capturedModel = 'gpt-4o';

      const wrappedAsyncGenerator = async function* () {
        try {
          for await (const chunk of originalIterator()) {
            if (chunk.model) {
              capturedModel = chunk.model;
            }
            if (chunk.usage) {
              capturedUsage = chunk.usage;
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
              reasoningTokens: capturedUsage.completion_tokens_details?.reasoning_tokens ?? 0,
              cachedTokens: capturedUsage.prompt_tokens_details?.cached_tokens ?? 0,
              customer: stripeCustomerId,
            });
          }
        }
      };

      return wrappedAsyncGenerator() as unknown as T;
    },

    trackUsageStreamAnthropic<T>(stream: any, stripeCustomerId: string): T {
      if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
        return stream;
      }

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

    trackUsageStreamGemini<T>(streamResult: any, stripeCustomerId: string, modelName: string): T {
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
              outputTokens: (lastUsageMetadata.candidatesTokenCount ?? 0) + (lastUsageMetadata.thoughtsTokenCount ?? 0),
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
  };
}

export default createTokenMeter;
