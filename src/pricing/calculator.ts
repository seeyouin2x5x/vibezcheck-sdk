import type { InferenceCost, TokenUsage } from '../types';
import { getModelPricing } from './table';

export interface CalculateCostParams {
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedTokens?: number;
  cacheWriteTokens?: number;
  markupMultiplier?: number;
}

/**
 * Calculates exact inference cost for an LLM call or usage breakdown in USD.
 */
export function calculateCost(params: CalculateCostParams): InferenceCost {
  const rates = getModelPricing(params.model);

  const inputTokens = params.inputTokens ?? 0;
  const outputTokens = params.outputTokens ?? 0;
  const reasoningTokens = params.reasoningTokens ?? 0;
  const cachedTokens = params.cachedTokens ?? 0;

  // Regular input tokens (minus any cached tokens)
  const regularInputTokens = Math.max(0, inputTokens - cachedTokens);

  // Input costs
  const regularInputCost = (regularInputTokens / 1_000_000) * rates.inputPer1M;
  const cachedRate = rates.cachedInputPer1M ?? rates.inputPer1M * 0.5;
  const cachedInputCost = (cachedTokens / 1_000_000) * cachedRate;
  const inputCostUSD = regularInputCost + cachedInputCost;

  // Output costs (reasoning tokens are billed as output tokens in standard APIs)
  const outputCostUSD = (outputTokens / 1_000_000) * rates.outputPer1M;

  // Reasoning breakdown cost
  const reasoningRate = rates.reasoningPer1M ?? rates.outputPer1M;
  const reasoningCostUSD = (reasoningTokens / 1_000_000) * reasoningRate;

  // Cache savings discount
  const standardCacheCost = (cachedTokens / 1_000_000) * rates.inputPer1M;
  const cachedDiscountUSD = Math.max(0, standardCacheCost - cachedInputCost);

  // Total base cost
  const totalUSD = inputCostUSD + outputCostUSD;

  // Retail price calculation (if markup multiplier provided)
  const markup = params.markupMultiplier ?? 1.0;
  const retailUSD = markup !== 1.0 ? totalUSD * markup : undefined;

  return {
    inputCostUSD: Number(inputCostUSD.toFixed(8)),
    outputCostUSD: Number(outputCostUSD.toFixed(8)),
    reasoningCostUSD: reasoningTokens > 0 ? Number(reasoningCostUSD.toFixed(8)) : undefined,
    cachedDiscountUSD: cachedTokens > 0 ? Number(cachedDiscountUSD.toFixed(8)) : undefined,
    totalUSD: Number(totalUSD.toFixed(8)),
    retailUSD: retailUSD ? Number(retailUSD.toFixed(8)) : undefined,
    currency: rates.currency || 'USD',
  };
}

/**
 * Calculates cost directly from a TokenUsage object
 */
export function calculateUsageCost(
  model: string,
  usage: TokenUsage,
  markupMultiplier?: number
): InferenceCost {
  return calculateCost({
    model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    reasoningTokens: usage.reasoningTokens,
    cachedTokens: usage.cachedTokens,
    cacheWriteTokens: usage.cacheWriteTokens,
    markupMultiplier,
  });
}
