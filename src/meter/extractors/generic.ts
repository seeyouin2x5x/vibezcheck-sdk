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
    let inputTokens = 0;
    let outputTokens = 0;
    let reasoningTokens = 0;
    let cachedTokens = 0;

    if (typeof usage.inputTokens === 'object' && usage.inputTokens !== null) {
      inputTokens = usage.inputTokens.total ?? usage.inputTokens.noCache ?? 0;
      cachedTokens = usage.inputTokens.cacheRead ?? 0;
    } else if (typeof usage.promptTokens === 'number') {
      inputTokens = usage.promptTokens;
    } else if (typeof usage.inputTokens === 'number') {
      inputTokens = usage.inputTokens;
    } else {
      inputTokens =
        usage.prompt_tokens ??
        usage.input_tokens ??
        usage.promptTokenCount ??
        usage.prompt_eval_count ??
        0;
    }

    if (typeof usage.outputTokens === 'object' && usage.outputTokens !== null) {
      outputTokens = usage.outputTokens.total ?? usage.outputTokens.text ?? 0;
      reasoningTokens = usage.outputTokens.reasoning ?? 0;
    } else if (typeof usage.completionTokens === 'number') {
      outputTokens = usage.completionTokens;
    } else if (typeof usage.outputTokens === 'number') {
      outputTokens = usage.outputTokens;
    } else {
      outputTokens =
        usage.completion_tokens ??
        usage.output_tokens ??
        usage.candidatesTokenCount ??
        usage.eval_count ??
        0;
    }

    if (!reasoningTokens) {
      reasoningTokens =
        usage.reasoning_tokens ??
        usage.thoughtsTokenCount ??
        usage.completion_tokens_details?.reasoning_tokens ??
        0;
    }

    if (!cachedTokens) {
      cachedTokens =
        usage.prompt_tokens_details?.cached_tokens ??
        usage.cached_tokens ??
        usage.cachedContentTokenCount ??
        0;
    }

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
