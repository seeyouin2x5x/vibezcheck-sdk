import { isBudgetExceeded, stopWhenBudgetExceeded } from '../src/billing/stop-condition';

describe('AI SDK v7 Loop Budgeting (isBudgetExceeded StopCondition)', () => {
  it('should return false when cumulative cost is below budget ceiling', async () => {
    const stopCondition = isBudgetExceeded(0.50, {
      model: 'gpt-4o-mini',
    });

    const mockSteps = [
      {
        response: { modelId: 'gpt-4o-mini' },
        usage: {
          promptTokens: 100,
          completionTokens: 50,
        },
      },
      {
        response: { modelId: 'gpt-4o-mini' },
        usage: {
          promptTokens: 200,
          completionTokens: 100,
        },
      },
    ];

    const shouldStop = await stopCondition({ steps: mockSteps });
    expect(shouldStop).toBe(false);
  });

  it('should return true and fire callback when cumulative cost crosses budget ceiling', async () => {
    let callbackFired = false;
    let details: any = null;

    const stopCondition = isBudgetExceeded(0.0001, {
      model: 'gpt-4o',
      onBudgetExceeded: (info) => {
        callbackFired = true;
        details = info;
      },
    });

    const mockSteps = [
      {
        response: { modelId: 'gpt-4o' },
        usage: {
          promptTokens: 1500,
          completionTokens: 800,
        },
      },
    ];

    const shouldStop = await stopCondition({ steps: mockSteps });
    expect(shouldStop).toBe(true);
    expect(callbackFired).toBe(true);
    expect(details.budgetUSD).toBe(0.0001);
    expect(details.currentCostUSD).toBeGreaterThan(0.0001);
    expect(details.stepCount).toBe(1);
  });

  it('should parse modern LanguageModelV4 structured tokens and cached reads', async () => {
    const stopCondition = isBudgetExceeded(0.001, {
      model: 'claude-3-5-sonnet',
      margin: 1.3,
    });

    const mockV4Steps = [
      {
        response: { modelId: 'claude-3-5-sonnet' },
        usage: {
          inputTokens: {
            total: 2000,
            noCache: 1000,
            cacheRead: 1000,
            cacheWrite: 0,
          },
          outputTokens: {
            total: 500,
            text: 350,
            reasoning: 150,
          },
        },
      },
    ];

    const shouldStop = await stopCondition({ steps: mockV4Steps });
    expect(typeof shouldStop).toBe('boolean');
    expect(shouldStop).toBe(true); // $0.001 limit easily crossed by 2500 tokens of Sonnet
  });

  it('should account for tool execution costs in steps', async () => {
    const stopCondition = isBudgetExceeded(0.02, {
      toolCosts: {
        expensive_search: 0.015,
        quick_lookup: 0.002,
      },
    });

    // Step 1: quick_lookup ($0.002) + small token cost -> below $0.02
    const step1 = [
      {
        response: { modelId: 'gpt-4o-mini' },
        usage: { promptTokens: 50, completionTokens: 10 },
        toolCalls: [{ toolName: 'quick_lookup' }],
      },
    ];
    expect(await stopCondition({ steps: step1 })).toBe(false);

    // Step 2: add expensive_search ($0.015) -> total > $0.017 -> still under $0.02
    const step2 = [
      ...step1,
      {
        response: { modelId: 'gpt-4o-mini' },
        usage: { promptTokens: 50, completionTokens: 10 },
        toolCalls: [{ toolName: 'expensive_search' }],
      },
    ];
    expect(await stopCondition({ steps: step2 })).toBe(false);

    // Step 3: second expensive_search ($0.015) -> total > $0.032 -> crosses $0.02!
    const step3 = [
      ...step2,
      {
        response: { modelId: 'gpt-4o-mini' },
        usage: { promptTokens: 50, completionTokens: 10 },
        toolCalls: [{ toolName: 'expensive_search' }],
      },
    ];
    expect(await stopCondition({ steps: step3 })).toBe(true);
  });
});
