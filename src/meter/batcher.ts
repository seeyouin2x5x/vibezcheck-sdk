import type { UsageEvent, UsageSummary, MeterOptions } from '../types';

/**
 * Detects whether the current runtime is a serverless environment
 * (AWS Lambda, Vercel Serverless, Cloudflare Workers/Pages, Netlify, Deno Deploy, Next.js)
 */
export function isServerlessEnvironment(): boolean {
  if (typeof process !== 'undefined' && process.env) {
    if (
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.NETLIFY ||
      process.env.DENO_DEPLOYMENT_ID ||
      process.env.CF_PAGES ||
      process.env.NEXT_RUNTIME
    ) {
      return true;
    }
  }
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as any;
    if (g.EdgeRuntime || g.WebSocketPair) {
      return true;
    }
  }
  return false;
}

const activeBatchers = new Set<MeterBatcher>();
let exitListenerAttached = false;

function ensureExitListener() {
  if (exitListenerAttached) return;
  if (typeof process !== 'undefined' && typeof process.once === 'function') {
    try {
      process.once('beforeExit', () => {
        for (const batcher of activeBatchers) {
          batcher.flush().catch(() => {});
        }
      });
      exitListenerAttached = true;
    } catch {
      // Fallback for restricted sandboxes
    }
  }
}

export class MeterBatcher {
  private queue: UsageEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;
  private readonly maxBatchSize: number;
  private readonly flushIntervalMs: number;
  private readonly isExplicitFlushInterval: boolean;
  private readonly onUsageCallback?: (event: UsageEvent) => void | Promise<void>;
  private readonly onBatchCallback?: (events: UsageEvent[]) => void | Promise<void>;
  private readonly onErrorCallback?: (error: Error, events: UsageEvent[]) => void;
  private readonly debug: boolean;

  // In-memory ledger for local stats
  private totalRequests = 0;
  private totalTokens = 0;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private totalReasoningTokens = 0;
  private totalCostUSD = 0;
  private byModel: Record<string, { requests: number; tokens: number; costUSD: number }> = {};

  constructor(options: MeterOptions = {}) {
    this.maxBatchSize = options.batching?.maxBatchSize ?? 50;
    this.flushIntervalMs = options.batching?.flushIntervalMs ?? 50;
    this.isExplicitFlushInterval = options.batching?.flushIntervalMs !== undefined;
    this.onUsageCallback = options.onUsage;
    this.onBatchCallback = options.onBatch;
    this.onErrorCallback = options.onError;
    this.debug = options.debug ?? false;

    activeBatchers.add(this);
    ensureExitListener();
  }

  /**
   * Enqueue a usage event for batch dispatching
   */
  public enqueue(event: UsageEvent): void {
    // 1. Update in-memory local ledger
    this.recordInLedger(event);

    // 2. Fire onUsage hook immediately
    if (this.onUsageCallback) {
      try {
        const res = this.onUsageCallback(event);
        if (res instanceof Promise) {
          res.catch((err) => {
            if (this.debug) console.error('[vibezcheck] Error in onUsage callback:', err);
          });
        }
      } catch (err) {
        if (this.debug) console.error('[vibezcheck] Error in onUsage callback:', err);
      }
    }

    // 3. If no onBatch handler is configured, we run in immediate local mode
    if (!this.onBatchCallback) {
      if (this.debug) {
        console.log(
          `[vibezcheck:local] 📊 ${event.model} | Tokens: ${event.usage.totalTokens} | Cost: $${event.cost.totalUSD.toFixed(6)}`
        );
      }
      return;
    }

    // 4. Queue for batch dispatch
    this.queue.push(event);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush().catch((err) => {
        if (this.debug) console.error('[vibezcheck] Batch flush error:', err);
      });
      return;
    }

    // 5. Serverless Lifecycle Spooling: Auto-register with after() or waitUntil()
    if (typeof globalThis !== 'undefined') {
      const g = globalThis as any;
      if (typeof g.after === 'function') {
        g.after(() => this.flush().catch(() => {}));
        return;
      }
      if (typeof g.waitUntil === 'function') {
        g.waitUntil(this.flush().catch(() => {}));
        return;
      }
    }

    // In serverless environments where timers are frozen on response, auto-flush immediately unless explicit interval given
    if (isServerlessEnvironment() && !this.isExplicitFlushInterval) {
      this.flush().catch((err) => {
        if (this.debug) console.error('[vibezcheck] Serverless auto-flush error:', err);
      });
      return;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.flush().catch((err) => {
          if (this.debug) console.error('[vibezcheck] Debounce flush error:', err);
        });
      }, this.flushIntervalMs);
    }
  }

  /**
   * Immediately flush all queued events
   */
  public async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0 || !this.onBatchCallback || this.isFlushing) {
      return;
    }

    this.isFlushing = true;
    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      await this.onBatchCallback(eventsToSend);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (this.debug) {
        console.error('[vibezcheck] Failed to flush meter event batch:', err);
      }
      if (this.onErrorCallback) {
        this.onErrorCallback(err, eventsToSend);
      }
    } finally {
      this.isFlushing = false;
      // If new items were queued while flushing, trigger another flush
      if (this.queue.length > 0) {
        this.flush().catch(() => {});
      }
    }
  }

  /**
   * Updates internal in-memory ledger
   */
  private recordInLedger(event: UsageEvent): void {
    this.totalRequests += 1;
    this.totalTokens += event.usage.totalTokens;
    this.totalInputTokens += event.usage.inputTokens;
    this.totalOutputTokens += event.usage.outputTokens;
    this.totalReasoningTokens += event.usage.reasoningTokens ?? 0;
    this.totalCostUSD += event.cost.totalUSD;

    const modelKey = event.model;
    if (!this.byModel[modelKey]) {
      this.byModel[modelKey] = { requests: 0, tokens: 0, costUSD: 0 };
    }
    this.byModel[modelKey].requests += 1;
    this.byModel[modelKey].tokens += event.usage.totalTokens;
    this.byModel[modelKey].costUSD += event.cost.totalUSD;
  }

  /**
   * Get in-memory usage summary
   */
  public getSummary(): UsageSummary {
    return {
      totalRequests: this.totalRequests,
      totalTokens: this.totalTokens,
      totalInputTokens: this.totalInputTokens,
      totalOutputTokens: this.totalOutputTokens,
      totalReasoningTokens: this.totalReasoningTokens,
      totalCostUSD: Number(this.totalCostUSD.toFixed(6)),
      byModel: { ...this.byModel },
    };
  }

  /**
   * Reset in-memory ledger
   */
  public resetLedger(): void {
    this.totalRequests = 0;
    this.totalTokens = 0;
    this.totalInputTokens = 0;
    this.totalOutputTokens = 0;
    this.totalReasoningTokens = 0;
    this.totalCostUSD = 0;
    this.byModel = {};
  }
}
