import type { InferenceCost, TokenUsage, InlineRateConfig, ModelPricingRates } from '../types';
import { getModelPricing } from './table';

export interface CalculateCostParams {
  model: string;
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedTokens?: number;
  cacheWriteTokens?: number;
  markupMultiplier?: number;
  minimumChargeUSD?: number;
  customRate?: InlineRateConfig;
}

/**
 * Calculates exact inference cost for an LLM call or usage breakdown in USD.
 */
export function calculateCost(params: CalculateCostParams): InferenceCost {
  let rates: ModelPricingRates;

  if (params.customRate) {
    const outRate = params.customRate.out ?? params.customRate.output ?? 0;
    rates = {
      inputPer1M: params.customRate.in,
      outputPer1M: outRate,
      reasoningPer1M: params.customRate.reasoning ?? outRate,
      cachedInputPer1M: params.customRate.cached ?? params.customRate.in * 0.15,
      currency: 'USD',
    };
  } else {
    rates = getModelPricing(params.model);
  }

  const inputTokens = params.inputTokens ?? 0;
  const outputTokens = params.outputTokens ?? 0;
  const reasoningTokens = params.reasoningTokens ?? 0;
  const cachedTokens = params.cachedTokens ?? 0;

  // Regular input tokens (minus any cached tokens)
  const regularInputTokens = Math.max(0, inputTokens - cachedTokens);

  // Input costs
  const regularInputCost = (regularInputTokens / 1_000_000) * rates.inputPer1M;
  const cachedRate = rates.cachedInputPer1M ?? rates.inputPer1M * 0.15; // 85% discount default for cached
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
  let totalUSD = inputCostUSD + outputCostUSD;

  // Retail price calculation (if markup multiplier provided)
  const markup = params.markupMultiplier ?? 1.0;
  let retailUSD: number | undefined = undefined;

  if (markup !== 1.0 || params.minimumChargeUSD !== undefined) {
    retailUSD = totalUSD * markup;
    if (params.minimumChargeUSD !== undefined && retailUSD < params.minimumChargeUSD) {
      retailUSD = params.minimumChargeUSD;
    }
  }

  return {
    inputCostUSD: Number(inputCostUSD.toFixed(8)),
    outputCostUSD: Number(outputCostUSD.toFixed(8)),
    reasoningCostUSD: reasoningTokens > 0 ? Number(reasoningCostUSD.toFixed(8)) : undefined,
    cachedDiscountUSD: cachedTokens > 0 ? Number(cachedDiscountUSD.toFixed(8)) : undefined,
    totalUSD: Number(totalUSD.toFixed(8)),
    retailUSD: retailUSD !== undefined ? Number(retailUSD.toFixed(8)) : undefined,
    currency: rates.currency || 'USD',
  };
}

/**
 * Calculates cost directly from a TokenUsage object
 */
export function calculateUsageCost(
  model: string,
  usage: TokenUsage,
  optionsOrMarkup?: number | { markupMultiplier?: number; minimumChargeUSD?: number; customRate?: InlineRateConfig }
): InferenceCost {
  const options =
    typeof optionsOrMarkup === 'number'
      ? { markupMultiplier: optionsOrMarkup }
      : optionsOrMarkup || {};

  return calculateCost({
    model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    reasoningTokens: usage.reasoningTokens,
    cachedTokens: usage.cachedTokens,
    cacheWriteTokens: usage.cacheWriteTokens,
    markupMultiplier: options.markupMultiplier,
    minimumChargeUSD: options.minimumChargeUSD,
    customRate: options.customRate,
  });
}
