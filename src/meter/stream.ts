import type { UsageEvent, StreamWrapOptions } from '../types';
import { inspectOpenAIStreamChunk } from './extractors/openai';
import { AnthropicStreamAccumulator } from './extractors/anthropic';
import { extractGeminiResponseUsage } from './extractors/gemini';
import { calculateUsageCost } from '../pricing/calculator';

export type UsageDispatchedCallback = (event: UsageEvent) => void;

/**
 * Wraps an OpenAI async iterable stream to capture usage at stream conclusion
 */
export function wrapOpenAIStream<T extends AsyncIterable<any>>(
  stream: T,
  options: StreamWrapOptions,
  onComplete: UsageDispatchedCallback
): T {
  let detectedModel = options.model || 'gpt-4o';
  let finalUsage: any = null;

  const wrappedAsyncIterable = {
    async *[Symbol.asyncIterator]() {
      try {
        for await (const chunk of stream) {
          const inspected = inspectOpenAIStreamChunk(chunk);
          if (inspected.model) {
            detectedModel = inspected.model;
          }
          if (inspected.usage) {
            finalUsage = inspected.usage;
          }
          yield chunk;
        }
      } finally {
        if (finalUsage) {
          const cost = calculateUsageCost(detectedModel, finalUsage);
          const customerId =
            typeof options.customer === 'string'
              ? options.customer
              : options.customer?.id || options.customerId;

          const event: UsageEvent = {
            timestamp: new Date().toISOString(),
            model: detectedModel,
            provider: 'openai',
            usage: finalUsage,
            cost,
            customerId,
            metadata: options.metadata,
          };

          onComplete(event);
          if (options.onUsage) {
            options.onUsage(event);
          }
        }
      }
    },
  };

  return wrappedAsyncIterable as unknown as T;
}

/**
 * Wraps an Anthropic message stream to accumulate message_start and message_delta usage
 */
export function wrapAnthropicStream<T extends AsyncIterable<any>>(
  stream: T,
  options: StreamWrapOptions,
  onComplete: UsageDispatchedCallback
): T {
  const accumulator = new AnthropicStreamAccumulator();

  const wrappedAsyncIterable = {
    async *[Symbol.asyncIterator]() {
      try {
        for await (const event of stream) {
          accumulator.processEvent(event);
          yield event;
        }
      } finally {
        const extracted = accumulator.getUsage();
        const model = options.model || extracted.model;
        const cost = calculateUsageCost(model, extracted.usage);
        const customerId =
          typeof options.customer === 'string'
            ? options.customer
            : options.customer?.id || options.customerId;

        const usageEvent: UsageEvent = {
          timestamp: new Date().toISOString(),
          model,
          provider: 'anthropic',
          usage: extracted.usage,
          cost,
          customerId,
          metadata: options.metadata,
        };

        onComplete(usageEvent);
        if (options.onUsage) {
          options.onUsage(usageEvent);
        }
      }
    },
  };

  return wrappedAsyncIterable as unknown as T;
}

/**
 * Wraps a Google Gemini GenerateContentStreamResult
 */
export function wrapGeminiStream(
  result: any,
  options: StreamWrapOptions,
  onComplete: UsageDispatchedCallback
): any {
  if (!result || !result.stream) return result;

  const originalStream = result.stream;
  const model = options.model || 'gemini-3.7-flash';
  let lastChunkWithUsage: any = null;

  const wrappedStream = (async function* () {
    try {
      for await (const chunk of originalStream) {
        if (chunk.usageMetadata) {
          lastChunkWithUsage = chunk;
        }
        yield chunk;
      }
    } finally {
      if (lastChunkWithUsage) {
        const extracted = extractGeminiResponseUsage(lastChunkWithUsage, model);
        if (extracted) {
          const cost = calculateUsageCost(extracted.model, extracted.usage);
          const customerId =
            typeof options.customer === 'string'
              ? options.customer
              : options.customer?.id || options.customerId;

          const event: UsageEvent = {
            timestamp: new Date().toISOString(),
            model: extracted.model,
            provider: 'google',
            usage: extracted.usage,
            cost,
            customerId,
            metadata: options.metadata,
          };

          onComplete(event);
          if (options.onUsage) {
            options.onUsage(event);
          }
        }
      }
    }
  })();

  return {
    ...result,
    stream: wrappedStream,
  };
}

/**
 * Universal Stream Wrapper
 */
export function wrapUniversalStream<T>(
  stream: T,
  options: StreamWrapOptions = {},
  onComplete: UsageDispatchedCallback
): T {
  if (!stream || typeof stream !== 'object') return stream;

  // 1. Check Gemini stream
  if ('stream' in stream && 'response' in stream) {
    return wrapGeminiStream(stream, options, onComplete);
  }

  // 2. Check if stream is an AsyncIterable
  if (Symbol.asyncIterator in stream) {
    // If provider is explicitly anthropic or stream looks like anthropic events
    if (options.provider === 'anthropic') {
      return wrapAnthropicStream(stream as any, options, onComplete);
    }
    // Default to OpenAI stream wrapper which detects usage chunks polymorphically
    return wrapOpenAIStream(stream as any, options, onComplete);
  }

  return stream;
}
