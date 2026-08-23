import { calculateCost, getModelPricing, registerModelPricing } from '../src/pricing';

describe('Pricing Registry & Cost Calculator', () => {
  it('should return correct pricing for GPT-5.6 Sol', () => {
    const rates = getModelPricing('gpt-5.6-sol');
    expect(rates.inputPer1M).toBe(4.0);
    expect(rates.outputPer1M).toBe(20.0);
    expect(rates.cachedInputPer1M).toBe(0.4);
  });

  it('should normalize model names with provider prefixes and date suffixes', () => {
    const ratesA = getModelPricing('openai/gpt-4o-2024-08-06');
    expect(ratesA.inputPer1M).toBe(2.5);
    expect(ratesA.outputPer1M).toBe(10.0);

    const ratesB = getModelPricing('anthropic/claude-3-7-sonnet-20250219');
    expect(ratesB.inputPer1M).toBe(0.59);
    expect(ratesB.outputPer1M).toBe(2.93);
  });

  it('should calculate inference costs correctly without cache', () => {
    // 1,000,000 input tokens ($2.50) + 500,000 output tokens ($5.00) = $7.50
    const cost = calculateCost({
      model: 'gpt-4o',
      inputTokens: 1_000_000,
      outputTokens: 500_000,
    });

    expect(cost.inputCostUSD).toBe(2.5);
    expect(cost.outputCostUSD).toBe(5.0);
    expect(cost.totalUSD).toBe(7.5);
    expect(cost.currency).toBe('USD');
  });

  it('should calculate cache discounts for prompt caching', () => {
    // 1,000,000 input tokens where 500,000 were cached (at $1.25/1M instead of $2.50/1M)
    // regular 500k = $1.25, cached 500k = $0.625 -> total input = $1.875
    const cost = calculateCost({
      model: 'gpt-4o',
      inputTokens: 1_000_000,
      cachedTokens: 500_000,
      outputTokens: 0,
    });

    expect(cost.inputCostUSD).toBe(1.875);
    expect(cost.cachedDiscountUSD).toBe(0.625);
    expect(cost.totalUSD).toBe(1.875);
  });

  it('should apply retail markup multipliers', () => {
    const cost = calculateCost({
      model: 'gpt-4o-mini',
      inputTokens: 1_000_000, // $0.15
      outputTokens: 1_000_000, // $0.60
      markupMultiplier: 1.5, // 50% markup -> total = $0.75 * 1.5 = $1.125
    });

    expect(cost.totalUSD).toBe(0.75);
    expect(cost.retailUSD).toBe(1.125);
  });

  it('should allow custom model pricing registration', () => {
    registerModelPricing('my-custom-fine-tune', {
      inputPer1M: 5.0,
      outputPer1M: 15.0,
    });

    const cost = calculateCost({
      model: 'my-custom-fine-tune',
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
    });

    expect(cost.totalUSD).toBe(20.0);
  });
});
