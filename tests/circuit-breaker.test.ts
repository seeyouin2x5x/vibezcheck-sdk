import { withBilling } from '../src/ai-sdk/with-billing';
import { VibezCircuitBreakerError } from '../src/types';

describe('Agent Circuit Breakers', () => {
  const createMockModel = (usage: { promptTokens: number; completionTokens: number }) => ({
    modelId: 'gpt-4o',
    provider: 'openai',
    specificationVersion: 'v2',
    doGenerate: async () => ({
      text: 'Mock response',
      usage,
    }),
  });

  it('should trip circuit breaker when cost exceeds maxCostPerCallUSD', async () => {
    let budgetEvent: any = null;

    // gpt-4o: 100k input ($0.25) + 100k output ($1.00) = $1.25
    const model = createMockModel({ promptTokens: 100_000, completionTokens: 100_000 });

    const metered = withBilling(model as any, {
      maxCostPerCallUSD: 0.50, // $0.50 ceiling
      onBudgetExceeded: (event) => {
        budgetEvent = event;
      },
    });

    await (metered as any).doGenerate();

    expect(budgetEvent).not.toBeNull();
    expect(budgetEvent.reason).toBe('cost_per_call_exceeded');
    expect(budgetEvent.limit).toBe(0.50);
    expect(budgetEvent.current).toBeGreaterThan(0.50);
  });

  it('should throw VibezCircuitBreakerError when throwOnBudgetExceeded is true', async () => {
    // 50,000 tokens exceeds 10,000 max tokens limit
    const model = createMockModel({ promptTokens: 30_000, completionTokens: 20_000 });

    const metered = withBilling(model as any, {
      maxTokensPerCall: 10_000,
      throwOnBudgetExceeded: true,
    });

    await expect((metered as any).doGenerate()).rejects.toThrow(VibezCircuitBreakerError);
  });

  it('should NOT trip circuit breaker when usage is within limits', async () => {
    let budgetTripped = false;

    // 100 tokens ($0.00025) is well within $1.00 limit
    const model = createMockModel({ promptTokens: 50, completionTokens: 50 });

    const metered = withBilling(model as any, {
      maxCostPerCallUSD: 1.00,
      maxTokensPerCall: 10_000,
      onBudgetExceeded: () => {
        budgetTripped = true;
      },
    });

    await (metered as any).doGenerate();

    expect(budgetTripped).toBe(false);
  });
});
