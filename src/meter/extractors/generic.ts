import type { TokenUsage } from '../../types';
import type { ExtractedUsage } from './openai';

/**
 * Extracts token usage from generic LLM provider objects (DeepSeek, Groq, Mistral, Ollama, Cohere, Together)
 */
export function extractGenericResponseUsage(
  response: any,
  fallbackModel: string = 'generic-llm',
  fallbackProvider: string = 'generic'
): ExtractedUsage | null {
  if (!response || typeof response !== 'object') return null;

  // Check common usage property locations
  const usage = response.usage || response.token_usage || response.usageMetadata;

  if (usage) {
    const inputTokens =
      usage.prompt_tokens ??
      usage.input_tokens ??
      usage.promptTokenCount ??
      usage.prompt_eval_count ??
      0;
    const outputTokens =
      usage.completion_tokens ??
      usage.output_tokens ??
      usage.candidatesTokenCount ??
      usage.eval_count ??
      0;
    const reasoningTokens =
      usage.reasoning_tokens ??
      usage.thoughtsTokenCount ??
      usage.completion_tokens_details?.reasoning_tokens ??
      0;
    const cachedTokens =
      usage.prompt_tokens_details?.cached_tokens ??
      usage.cached_tokens ??
      usage.cachedContentTokenCount ??
      0;

    const model = response.model || fallbackModel;
    const provider = response.provider || fallbackProvider;

    return {
      model,
      provider,
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
