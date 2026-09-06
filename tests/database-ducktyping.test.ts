import { withBilling } from '../src/ai-sdk/with-billing';

describe('VibezCheck v0.4.2 — Duck-Typed Database & Pluggable Providers', () => {
  const createMockModel = (options: {
    usage?: any;
    chunks?: any[];
  } = {}) => {
    return {
      modelId: 'openai/gpt-4o-mini',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v1',
      doStream: jest.fn().mockImplementation(async () => {
        const stream = new ReadableStream({
          start(controller) {
            const chunks = options.chunks || [
              { type: 'text-delta', textDelta: 'Hello ' },
              { type: 'reasoning', textDelta: 'Thinking about tokens...' },
              { type: 'text-delta', textDelta: 'world!' },
              {
                type: 'finish',
                usage: options.usage || {
                  promptTokens: 100,
                  completionTokens: 50,
                  promptTokensDetails: { cachedTokens: 80 },
                },
              },
            ];
            for (const chunk of chunks) {
              controller.enqueue(chunk);
            }
            controller.close();
          },
        });
        return { stream };
      }),
      doGenerate: jest.fn().mockImplementation(async () => {
        return {
          text: 'Hello world',
          usage: options.usage || {
            promptTokens: 100,
            completionTokens: 50,
          },
        };
      }),
    };
  };

  test('1. Auto-detects and inserts into Supabase duck-typed client (.from())', async () => {
    const insertedRows: any[] = [];
    const mockSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockImplementation(async (row) => {
          insertedRows.push(row);
          return { data: row, error: null };
        }),
      }),
    };

    const model = createMockModel();
    const metered = withBilling(model, {
      customer: 'alex@acme.com',
      database: mockSupabase,
    });

    const { stream } = await metered.doStream({ prompt: 'test' });
    const reader = stream.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockSupabase.from).toHaveBeenCalledWith('vibez_usage');
    expect(insertedRows.length).toBe(1);
    expect(insertedRows[0].customer_id).toBe('alex@acme.com');
    expect(insertedRows[0].model).toBe('openai/gpt-4o-mini');
    expect(insertedRows[0].input_tokens).toBe(100);
    expect(insertedRows[0].output_tokens).toBe(50);
    expect(insertedRows[0].cost_usd).toBeGreaterThan(0);
  });

  test('2. Executes 1-line callback function for custom database/loggers', async () => {
    const capturedEvents: any[] = [];
    const customDbCallback = jest.fn((event) => {
      capturedEvents.push(event);
    });

    const model = createMockModel();
    const metered = withBilling(model, {
      customer: 'sarah@startup.io',
      database: customDbCallback,
    });

    const { stream } = await metered.doStream({ prompt: 'test' });
    const reader = stream.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(customDbCallback).toHaveBeenCalled();
    expect(capturedEvents.length).toBe(1);
    expect(capturedEvents[0].customerId).toBe('sarah@startup.io');
    expect(capturedEvents[0].usage.totalTokens).toBe(150);
  });

  test('3. Executes custom payment charge handler in background', async () => {
    const charges: { costUSD: number; customerId: string }[] = [];
    const mockCharge = jest.fn(async (costUSD, event) => {
      charges.push({ costUSD, customerId: event.customerId });
    });

    const model = createMockModel();
    const metered = withBilling(model, {
      customer: 'wallet_user_99',
      billing: {
        charge: mockCharge,
      },
    });

    const { stream } = await metered.doStream({ prompt: 'test' });
    const reader = stream.getReader();
    while (true) {
      const { done } = await reader.read();
      if (done) break;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(mockCharge).toHaveBeenCalled();
    expect(charges.length).toBe(1);
    expect(charges[0].customerId).toBe('wallet_user_99');
    expect(charges[0].costUSD).toBeGreaterThan(0);
  });

  test('4. Airbag Error Isolation: Database throws error -> User stream completes safely in 0ms', async () => {
    const failingSupabase = {
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error('Supabase database connection timeout 504')),
      }),
    };

    const model = createMockModel();
    const metered = withBilling(model, {
      customer: 'resilient_user',
      database: failingSupabase,
    });

    const { stream } = await metered.doStream({ prompt: 'test' });
    const reader = stream.getReader();
    const receivedChunks: any[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedChunks.push(value);
    }

    expect(receivedChunks.length).toBe(4);
    expect(failingSupabase.from).toHaveBeenCalled();
  });
});
