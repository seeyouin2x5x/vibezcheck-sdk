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
 * BigInt Nano-Precision Financial Math Engine
 * 1 USD = 1,000,000,000 Nano-USD (10^9)
 * 1 token at $1.00 / 1M = $0.000001 = 1,000 Nano-USD
 * Prevents IEEE 754 floating point precision drift on micro-transactions.
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

  const inputTokens = BigInt(Math.max(0, params.inputTokens ?? 0));
  const outputTokens = BigInt(Math.max(0, params.outputTokens ?? 0));
  const reasoningTokens = BigInt(Math.max(0, params.reasoningTokens ?? 0));
  const cachedTokens = BigInt(Math.max(0, params.cachedTokens ?? 0));

  // Regular input tokens (minus any cached tokens)
  const regularInputTokens = inputTokens > cachedTokens ? inputTokens - cachedTokens : 0n;

  // Convert rate per 1M tokens to integer nano-dollars per single token (rate * 1,000)
  // Using 10^9 nano-precision
  const rateInputNano = BigInt(Math.round(rates.inputPer1M * 1_000));
  const cachedPer1M = rates.cachedInputPer1M ?? rates.inputPer1M * 0.15;
  const rateCachedNano = BigInt(Math.round(cachedPer1M * 1_000));
  const rateOutputNano = BigInt(Math.round(rates.outputPer1M * 1_000));
  const reasoningPer1M = rates.reasoningPer1M ?? rates.outputPer1M;
  const rateReasoningNano = BigInt(Math.round(reasoningPer1M * 1_000));

  // Compute component nano costs
  const regularInputCostNano = regularInputTokens * rateInputNano;
  const cachedInputCostNano = cachedTokens * rateCachedNano;
  const inputCostNano = regularInputCostNano + cachedInputCostNano;
  const outputCostNano = outputTokens * rateOutputNano;
  const reasoningCostNano = reasoningTokens * rateReasoningNano;

  // Prompt cache savings discount
  const standardCacheCostNano = cachedTokens * rateInputNano;
  const cachedDiscountNano =
    standardCacheCostNano > cachedInputCostNano ? standardCacheCostNano - cachedInputCostNano : 0n;

  // Total wholesale cost
  const wholesaleNano = inputCostNano + outputCostNano;

  // Retail calculation
  const markup = params.markupMultiplier ?? 1.0;
  let billedNano = wholesaleNano;
  let hasRetail = false;

  if (markup !== 1.0 || params.minimumChargeUSD !== undefined) {
    hasRetail = true;
    const markupMultiplierNano = BigInt(Math.round(markup * 1_000));
    billedNano = (wholesaleNano * markupMultiplierNano) / 1_000n;

    if (params.minimumChargeUSD !== undefined && params.minimumChargeUSD > 0) {
      const minChargeNano = BigInt(Math.round(params.minimumChargeUSD * 1_000_000_000));
      if (billedNano < minChargeNano) {
        billedNano = minChargeNano;
      }
    }
  }

  const inputCostUSD = Number(inputCostNano) / 1_000_000_000;
  const outputCostUSD = Number(outputCostNano) / 1_000_000_000;
  const reasoningCostUSD = Number(reasoningCostNano) / 1_000_000_000;
  const cachedDiscountUSD = Number(cachedDiscountNano) / 1_000_000_000;
  const totalUSD = Number(wholesaleNano) / 1_000_000_000;
  const wholesaleTotalUSD = totalUSD;
  const billedUSD = Number(billedNano) / 1_000_000_000;
  const profitUSD = Math.max(0, billedUSD - wholesaleTotalUSD);
  const retailUSD = hasRetail ? billedUSD : undefined;

  return {
    inputCostUSD: Number(inputCostUSD.toFixed(8)),
    outputCostUSD: Number(outputCostUSD.toFixed(8)),
    reasoningCostUSD: reasoningTokens > 0n ? Number(reasoningCostUSD.toFixed(8)) : undefined,
    cachedDiscountUSD: cachedTokens > 0n ? Number(cachedDiscountUSD.toFixed(8)) : undefined,
    savingsUSD: cachedTokens > 0n ? Number(cachedDiscountUSD.toFixed(8)) : undefined,
    totalUSD: Number(totalUSD.toFixed(8)),
    wholesaleTotalUSD: Number(wholesaleTotalUSD.toFixed(8)),
    wholesaleUSD: Number(wholesaleTotalUSD.toFixed(8)),
    billedUSD: Number(billedUSD.toFixed(8)),
    profitUSD: Number(profitUSD.toFixed(8)),
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
