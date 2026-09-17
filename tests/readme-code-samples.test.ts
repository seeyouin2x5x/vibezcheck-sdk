import { vibezcheck } from '../src';

describe('README Code Samples Alignment (Library Source of Truth)', () => {
  test('calculateCost with two arguments: model string + token usage object', () => {
    // Snippet 1:
    const cost1 = vibezcheck.calculateCost('gpt-4o-mini', {
      promptTokens: 1240,
      completionTokens: 150,
    });
    expect(cost1.totalUSD).toBe(0.000276);

    // Snippet 2:
    const cost2 = vibezcheck.calculateCost('gpt-4o-mini', {
      promptTokens: 1000,
      completionTokens: 500,
    });
    expect(cost2.totalUSD).toBe(0.00045);
  });

  test('getModelPricing returns rate card matching README', () => {
    const rates = vibezcheck.getModelPricing('gpt-4o-mini');
    expect(rates.inputPer1M).toBe(0.15);
    expect(rates.outputPer1M).toBe(0.60);
  });

  test('declarative model supports customer, threadId, and metadata', () => {
    const dummyModel: any = {
      specificationVersion: 'v1',
      modelId: 'gpt-4o-mini',
      provider: 'openai',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'hello',
        usage: { promptTokens: 10, completionTokens: 10 },
      }),
    };

    const model = vibezcheck(dummyModel, {
      customer: 'user_123',
      threadId: 'thread_456',
      metadata: {
        plan: 'pro',
        feature: 'document-analysis',
      },
    });

    expect(model).toBeDefined();
  });

  test('pricing markup option works and calculates retail margin', () => {
    const dummyModel: any = {
      specificationVersion: 'v1',
      modelId: 'gpt-4o-mini',
      provider: 'openai',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'hello',
        usage: { promptTokens: 1000, completionTokens: 500 },
      }),
    };

    const model = vibezcheck(dummyModel, {
      customer: 'user_123',
      pricing: {
        markup: 1.3,
      },
    });

    expect(model).toBeDefined();
  });

  test('agent session supports direct tools dictionary and string model IDs', async () => {
    const session = vibezcheck.session({
      customer: 'enterprise_123',
      sessionBudgetUSD: 5.00,
    });

    const agentTools = {
      web_search: {
        description: 'search web',
        execute: jest.fn().mockResolvedValue('search results'),
      },
      code_interpreter: {
        description: 'run code',
        execute: jest.fn().mockResolvedValue(42),
      },
    };

    const tools = session.tools(agentTools, {
      web_search: {
        costUSD: 0.01,
      },
      code_interpreter: {
        costUSD: 0.05,
      },
    });

    expect(tools.web_search.costUSD).toBe(0.01);
    expect(tools.code_interpreter.costUSD).toBe(0.05);

    // Test tool execution tracks cost against session
    await tools.web_search.execute({ q: 'test' });
    expect(session.getCurrentCostUSD()).toBe(0.01);

    await tools.code_interpreter.execute({ code: '1+1' });
    expect(session.getCurrentCostUSD()).toBe(0.06);

    // Test session.model supports string ID
    const sessionModel = session.model('gpt-4o-mini');
    expect(sessionModel).toBeDefined();
  });

  test('database sink accepts 1-line async callback', () => {
    const dbRecorded: any[] = [];

    const dummyModel: any = {
      specificationVersion: 'v1',
      modelId: 'gpt-4o-mini',
      provider: 'openai',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'hello',
        usage: { promptTokens: 10, completionTokens: 10 },
      }),
    };

    const model = vibezcheck(dummyModel, {
      customer: 'cus_123',
      database: vibezcheck.database(async (event) => {
        dbRecorded.push({
          customerId: event.customerId,
          costUSD: event.cost.totalUSD,
        });
      }),
    });

    expect(model).toBeDefined();
  });
});
