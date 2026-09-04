import { withBilling } from '../src/ai-sdk/with-billing';
import { vibezcheck } from '../src/index';
import type { UsageEvent } from '../src/types';

describe('Monetization & Sane Defaults', () => {
  it('should apply profit margin and minimumChargeUSD to retailUSD', async () => {
    let capturedEvent: UsageEvent | null = null;

    const mockModel = {
      modelId: 'gpt-4o-mini',
      provider: 'openai',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'Hello',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
        },
      }),
    };

    const metered = withBilling(mockModel, {
      customer: 'cus_test',
      pricing: {
        margin: 1.5, // 50% profit margin
        minimumChargeUSD: 0.01, // 1 cent minimum
      },
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    await (metered as any).doGenerate({ prompt: 'test' });

    expect(capturedEvent).not.toBeNull();
    // Raw cost is less than 1 cent, so retailUSD should be clamped to minimumChargeUSD of 0.01
    expect(capturedEvent!.cost.retailUSD).toBe(0.01);
  });

  it('should calculate cost with inline rate override', async () => {
    let capturedEvent: UsageEvent | null = null;

    const mockModel = {
      modelId: 'custom-fine-tuned-model',
      provider: 'custom',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'Custom output',
        usage: {
          promptTokens: 1_000_000, // 1M tokens
          completionTokens: 1_000_000,
        },
      }),
    };

    const metered = withBilling(mockModel, {
      customer: 'cus_custom',
      rate: {
        in: 0.20,  // $0.20 per 1M input
        out: 0.80, // $0.80 per 1M output
      },
      maxCostPerCallUSD: Infinity, // Disable default $0.50 fuse for this 2M token test
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    await (metered as any).doGenerate({ prompt: 'test' });

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.cost.inputCostUSD).toBe(0.20);
    expect(capturedEvent!.cost.outputCostUSD).toBe(0.80);
    expect(capturedEvent!.cost.totalUSD).toBe(1.00);
  });

  it('should trip the default $0.50 circuit breaker on expensive call when throwOnBudgetExceeded is true', async () => {
    const mockExpensiveModel = {
      modelId: 'o1',
      provider: 'openai',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'Deep thinking output',
        usage: {
          promptTokens: 50_000,
          completionTokens: 20_000, // $15/M in, $60/M out -> $0.75 + $1.20 = $1.95 > $0.50 default!
        },
      }),
    };

    const metered = withBilling(mockExpensiveModel, {
      throwOnBudgetExceeded: true,
    });

    await expect((metered as any).doGenerate({ prompt: 'solve world hunger' })).rejects.toThrow(
      /Circuit Breaker tripped/
    );
  });

  it('should meter non-LLM tool calls using vibezcheck.session', async () => {
    const session = vibezcheck.session({ customer: 'alex@company.com' });
    expect(typeof session.trackTool).toBe('function');
    expect(typeof session.model).toBe('function');

    // Tracking a tool should execute cleanly without error
    await expect(session.trackTool('web_search', { costUSD: 0.01 })).resolves.toBeUndefined();
  });
});
