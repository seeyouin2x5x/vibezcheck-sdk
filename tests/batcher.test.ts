import { MeterBatcher } from '../src/meter/batcher';
import type { UsageEvent } from '../src/types';

describe('MeterBatcher & Local Ledger', () => {
  it('should maintain accurate in-memory ledger stats', () => {
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

  it('should flush batches to onBatch callback when configured', async () => {
    const batchedEvents: UsageEvent[][] = [];
    const batcher = new MeterBatcher({
      onBatch: async (events) => {
        batchedEvents.push(events);
      },
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

    expect(batchedEvents).toHaveLength(1);
    expect(batchedEvents[0]).toHaveLength(1);
    expect(batchedEvents[0][0].customerId).toBe('cus_client_1');
    expect(batchedEvents[0][0].usage.totalTokens).toBe(1300);
  });

  describe('Serverless Lifecycle Spooling', () => {
    const originalEnv = { ...process.env };
    const originalAfter = (globalThis as any).after;
    const originalWaitUntil = (globalThis as any).waitUntil;

    afterEach(() => {
      process.env = { ...originalEnv };
      if (originalAfter !== undefined) {
        (globalThis as any).after = originalAfter;
      } else {
        delete (globalThis as any).after;
      }
      if (originalWaitUntil !== undefined) {
        (globalThis as any).waitUntil = originalWaitUntil;
      } else {
        delete (globalThis as any).waitUntil;
      }
    });

    it('should detect serverless environment flags', () => {
      const { isServerlessEnvironment } = require('../src/meter/batcher');
      process.env.VERCEL = '1';
      expect(isServerlessEnvironment()).toBe(true);

      delete process.env.VERCEL;
      process.env.AWS_LAMBDA_FUNCTION_NAME = 'my-metered-fn';
      expect(isServerlessEnvironment()).toBe(true);

      delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    });

    it('should automatically register flush with globalThis.after() in Next.js 15+', async () => {
      const afterCallbacks: Array<() => any> = [];
      (globalThis as any).after = jest.fn((cb: () => any) => {
        afterCallbacks.push(cb);
      });

      const flushed: UsageEvent[][] = [];
      const batcher = new MeterBatcher({
        onBatch: async (events) => {
          flushed.push(events);
        },
      });

      batcher.enqueue({
        timestamp: new Date().toISOString(),
        model: 'gpt-4o-mini',
        provider: 'openai',
        usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
        cost: { inputCostUSD: 0.000001, outputCostUSD: 0.000012, totalUSD: 0.000013, currency: 'USD' },
      });

      expect((globalThis as any).after).toHaveBeenCalled();
      expect(flushed.length).toBe(0); // Queued, waiting for after()

      // Execute after callback
      await Promise.all(afterCallbacks.map((cb) => cb()));

      expect(flushed.length).toBe(1);
      expect(flushed[0][0].model).toBe('gpt-4o-mini');
    });

    it('should automatically register flush with globalThis.waitUntil() in Cloudflare / Vercel Edge', async () => {
      const waitUntilPromises: Array<Promise<any>> = [];
      (globalThis as any).waitUntil = jest.fn((p: Promise<any>) => {
        waitUntilPromises.push(p);
      });

      const flushed: UsageEvent[][] = [];
      const batcher = new MeterBatcher({
        onBatch: async (events) => {
          flushed.push(events);
        },
      });

      batcher.enqueue({
        timestamp: new Date().toISOString(),
        model: 'claude-3-5-sonnet',
        provider: 'anthropic',
        usage: { inputTokens: 50, outputTokens: 50, totalTokens: 100 },
        cost: { inputCostUSD: 0.00015, outputCostUSD: 0.00075, totalUSD: 0.0009, currency: 'USD' },
      });

      expect((globalThis as any).waitUntil).toHaveBeenCalled();

      await Promise.all(waitUntilPromises);

      expect(flushed.length).toBe(1);
      expect(flushed[0][0].model).toBe('claude-3-5-sonnet');
    });

    it('should auto-flush immediately in serverless environments if no runtime hooks are present', async () => {
      process.env.AWS_LAMBDA_FUNCTION_NAME = 'test-lambda';
      delete (globalThis as any).after;
      delete (globalThis as any).waitUntil;

      const flushed: UsageEvent[][] = [];
      const batcher = new MeterBatcher({
        onBatch: async (events) => {
          flushed.push(events);
        },
      });

      batcher.enqueue({
        timestamp: new Date().toISOString(),
        model: 'deepseek-chat',
        provider: 'deepseek',
        usage: { inputTokens: 100, outputTokens: 100, totalTokens: 200 },
        cost: { inputCostUSD: 0.00001, outputCostUSD: 0.00002, totalUSD: 0.00003, currency: 'USD' },
      });

      // Allow microtask cycle to complete
      await new Promise((r) => setTimeout(r, 10));

      expect(flushed.length).toBe(1);
      expect(flushed[0][0].model).toBe('deepseek-chat');
    });
  });
});

