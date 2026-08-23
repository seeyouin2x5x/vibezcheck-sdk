import type { TokenUsage } from '../../types';

export interface ExtractedUsage {
  model: string;
  provider: string;
  usage: TokenUsage;
}

/**
 * Extracts token usage from OpenAI synchronous responses (ChatCompletion, Responses, Embeddings)
 */
export function extractOpenAIResponseUsage(response: any): ExtractedUsage | null {
  if (!response || typeof response !== 'object') return null;

  // 1. Standard OpenAI ChatCompletion
  if ('choices' in response && 'usage' in response && response.usage) {
    const rawUsage = response.usage;
    const model = response.model || 'gpt-4o';

    const inputTokens = rawUsage.prompt_tokens ?? 0;
    const outputTokens = rawUsage.completion_tokens ?? 0;
    const reasoningTokens = rawUsage.completion_tokens_details?.reasoning_tokens ?? 0;
    const cachedTokens = rawUsage.prompt_tokens_details?.cached_tokens ?? 0;

    return {
      model,
      provider: 'openai',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
        visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
      },
    };
  }

  // 2. OpenAI Embeddings Response
  if ('data' in response && 'usage' in response && response.usage && 'model' in response) {
    const rawUsage = response.usage;
    const inputTokens = rawUsage.prompt_tokens ?? 0;

    return {
      model: response.model || 'text-embedding-3-small',
      provider: 'openai',
      usage: {
        inputTokens,
        outputTokens: 0,
        totalTokens: inputTokens,
      },
    };
  }

  // 3. OpenAI Responses API (New standard)
  if ('status' in response && 'usage' in response && response.usage) {
    const rawUsage = response.usage;
    const model = response.model || 'gpt-5.6-sol';

    const inputTokens = rawUsage.input_tokens ?? rawUsage.prompt_tokens ?? 0;
    const outputTokens = rawUsage.output_tokens ?? rawUsage.completion_tokens ?? 0;
    const reasoningTokens =
      rawUsage.output_token_details?.reasoning_tokens ??
      rawUsage.completion_tokens_details?.reasoning_tokens ??
      0;
    const cachedTokens =
      rawUsage.input_token_details?.cached_tokens ??
      rawUsage.prompt_tokens_details?.cached_tokens ??
      0;

    return {
      model,
      provider: 'openai',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
        visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
      },
    };
  }

  return null;
}

/**
 * Extracts token usage from an individual OpenAI stream chunk or stream accumulator
 */
export function inspectOpenAIStreamChunk(chunk: any): {
  model?: string;
  usage?: TokenUsage;
} {
  if (!chunk || typeof chunk !== 'object') return {};

  const model = chunk.model;

  // Final chunk with usage object (when stream_options: { include_usage: true })
  if (chunk.usage) {
    const rawUsage = chunk.usage;
    const inputTokens = rawUsage.prompt_tokens ?? rawUsage.input_tokens ?? 0;
    const outputTokens = rawUsage.completion_tokens ?? rawUsage.output_tokens ?? 0;
    const reasoningTokens =
      rawUsage.completion_tokens_details?.reasoning_tokens ??
      rawUsage.output_token_details?.reasoning_tokens ??
      0;
    const cachedTokens =
      rawUsage.prompt_tokens_details?.cached_tokens ??
      rawUsage.input_token_details?.cached_tokens ??
      0;

    return {
      model,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
        visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
      },
    };
  }

  // Response API stream event (response.completed or response.done)
  if (chunk.type === 'response.completed' || chunk.type === 'response.done') {
    if (chunk.response?.usage) {
      const rawUsage = chunk.response.usage;
      const inputTokens = rawUsage.input_tokens ?? 0;
      const outputTokens = rawUsage.output_tokens ?? 0;
      const reasoningTokens = rawUsage.output_token_details?.reasoning_tokens ?? 0;
      const cachedTokens = rawUsage.input_token_details?.cached_tokens ?? 0;

      return {
        model: chunk.response.model || model,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: inputTokens + outputTokens,
          reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
          visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
          cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
        },
      };
    }
  }

  return { model };
}
