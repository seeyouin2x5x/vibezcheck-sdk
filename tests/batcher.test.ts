import { MeterBatcher } from '../src/meter/batcher';
import type { UsageEvent } from '../src/types';

describe('MeterBatcher & Local Ledger', () => {
  it('should maintain accurate in-memory ledger stats without Stripe', () => {
    let firedEvent: UsageEvent | null = null;
    const batcher = new MeterBatcher({
      onUsage: (event) => {
        firedEvent = event;
      },
    });

    const event1: UsageEvent = {
      timestamp: new Date().toISOString(),
      model: 'gpt-4o',
      provider: 'openai',
      usage: { inputTokens: 100, outputTokens: 200, totalTokens: 300, reasoningTokens: 50 },
      cost: { inputCostUSD: 0.00025, outputCostUSD: 0.002, totalUSD: 0.00225, currency: 'USD' },
    };

    const event2: UsageEvent = {
      timestamp: new Date().toISOString(),
      model: 'claude-3-7-sonnet',
      provider: 'anthropic',
      usage: { inputTokens: 50, outputTokens: 50, totalTokens: 100 },
      cost: { inputCostUSD: 0.00003, outputCostUSD: 0.00015, totalUSD: 0.00018, currency: 'USD' },
    };

    batcher.enqueue(event1);
    expect(firedEvent).toEqual(event1);

    batcher.enqueue(event2);
    expect(firedEvent).toEqual(event2);

    const summary = batcher.getSummary();
    expect(summary.totalRequests).toBe(2);
    expect(summary.totalTokens).toBe(400);
    expect(summary.totalInputTokens).toBe(150);
    expect(summary.totalOutputTokens).toBe(250);
    expect(summary.totalReasoningTokens).toBe(50);
    expect(summary.byModel['gpt-4o'].requests).toBe(1);
    expect(summary.byModel['claude-3-7-sonnet'].requests).toBe(1);
  });

  it('should flush batches to Stripe client when present', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ id: 'me_123' });
    const mockStripe: any = {
      v2: {
        billing: {
          meterEvents: {
            create: mockCreate,
          },
        },
      },
    };

    const batcher = new MeterBatcher({
      stripe: mockStripe,
      batching: { maxBatchSize: 10, flushIntervalMs: 1000 },
    });

    const event: UsageEvent = {
      timestamp: '2026-08-23T10:00:00.000Z',
      model: 'gpt-4o',
      provider: 'openai',
      customerId: 'cus_client_1',
      usage: { inputTokens: 500, outputTokens: 800, totalTokens: 1300 },
      cost: { inputCostUSD: 0.00125, outputCostUSD: 0.008, totalUSD: 0.00925, currency: 'USD' },
    };

    batcher.enqueue(event);
    await batcher.flush();

    expect(mockCreate).toHaveBeenCalledTimes(2); // 1 input event, 1 output event
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        event_name: 'token-billing-tokens',
        payload: expect.objectContaining({
          stripe_customer_id: 'cus_client_1',
          value: '500',
          token_type: 'input',
        }),
      })
    );
  });
});
