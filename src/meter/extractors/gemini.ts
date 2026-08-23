import type { TokenUsage } from '../../types';
import type { ExtractedUsage } from './openai';

/**
 * Extracts token usage from Google Gemini API response or chunk
 */
export function extractGeminiResponseUsage(
  response: any,
  fallbackModel: string = 'gemini-3.7-flash'
): ExtractedUsage | null {
  if (!response || typeof response !== 'object') return null;

  // Gemini returns usageMetadata on response or GenerateContentResult
  const usageMetadata = response.usageMetadata || response.response?.usageMetadata;

  if (usageMetadata) {
    const inputTokens = usageMetadata.promptTokenCount ?? 0;
    const baseOutputTokens = usageMetadata.candidatesTokenCount ?? 0;
    const thoughtsTokenCount =
      usageMetadata.thoughtsTokenCount ?? (usageMetadata as any).reasoningTokenCount ?? 0;
    const cachedTokens = usageMetadata.cachedContentTokenCount ?? 0;

    const totalOutput = baseOutputTokens + thoughtsTokenCount;
    const model = response.model || response.response?.model || fallbackModel;

    return {
      model,
      provider: 'google',
      usage: {
        inputTokens,
        outputTokens: totalOutput,
        totalTokens: inputTokens + totalOutput,
        reasoningTokens: thoughtsTokenCount > 0 ? thoughtsTokenCount : undefined,
        visibleOutputTokens: baseOutputTokens,
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
      },
    };
  }

  return null;
}
