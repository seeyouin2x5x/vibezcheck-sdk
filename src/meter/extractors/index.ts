import type { ExtractedUsage } from './openai';
import { extractOpenAIResponseUsage } from './openai';
import { extractAnthropicResponseUsage } from './anthropic';
import { extractGeminiResponseUsage } from './gemini';
import { extractGenericResponseUsage } from './generic';

export * from './openai';
export * from './anthropic';
export * from './gemini';
export * from './generic';

/**
 * Universal polymorphic response detector
 */
export function detectAndExtractUsage(
  response: any,
  fallbackModel?: string,
  fallbackProvider?: string
): ExtractedUsage | null {
  if (!response || typeof response !== 'object') return null;

  // 1. Try OpenAI
  const openaiResult = extractOpenAIResponseUsage(response);
  if (openaiResult) return openaiResult;

  // 2. Try Anthropic
  const anthropicResult = extractAnthropicResponseUsage(response);
  if (anthropicResult) return anthropicResult;

  // 3. Try Gemini
  const geminiResult = extractGeminiResponseUsage(response, fallbackModel);
  if (geminiResult) return geminiResult;

  // 4. Try Generic
  const genericResult = extractGenericResponseUsage(response, fallbackModel, fallbackProvider);
  if (genericResult) return genericResult;

  return null;
}
