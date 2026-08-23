import type Stripe from 'stripe';
import type { UsageEvent, UsageSummary, MeterOptions } from '../types';

export class MeterBatcher {
  private queue: UsageEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;
  private readonly maxBatchSize: number;
  private readonly flushIntervalMs: number;
  private readonly stripeClient?: Stripe;
  private readonly eventName: string;
  private readonly onUsageCallback?: (event: UsageEvent) => void | Promise<void>;
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
    this.stripeClient = options.stripe;
    this.eventName = options.eventName || 'token-billing-tokens';
    this.maxBatchSize = options.batching?.maxBatchSize ?? 50;
    this.flushIntervalMs = options.batching?.flushIntervalMs ?? 50;
    this.onUsageCallback = options.onUsage;
    this.onErrorCallback = options.onError;
    this.debug = options.debug ?? false;
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

    // 3. If no Stripe client is configured, we're done (local mode)
    if (!this.stripeClient) {
      if (this.debug) {
        console.log(
          `[vibezcheck:local] 📊 ${event.model} | Tokens: ${event.usage.totalTokens} | Cost: $${event.cost.totalUSD.toFixed(6)}`
        );
      }
      return;
    }

    // 4. Queue for Stripe dispatch
    this.queue.push(event);

    if (this.queue.length >= this.maxBatchSize) {
      this.flush().catch((err) => {
        if (this.debug) console.error('[vibezcheck] Batch flush error:', err);
      });
    } else if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.flush().catch((err) => {
          if (this.debug) console.error('[vibezcheck] Debounce flush error:', err);
        });
      }, this.flushIntervalMs);
    }
  }

  /**
   * Immediately flush all queued events to Stripe
   */
  public async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0 || !this.stripeClient || this.isFlushing) {
      return;
    }

    this.isFlushing = true;
    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      await this.sendEventsToStripe(eventsToSend);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (this.debug) {
        console.error('[vibezcheck] Failed to send meter events to Stripe:', err);
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
   * Sends events to Stripe Billing Meter Events API
   */
  private async sendEventsToStripe(events: UsageEvent[]): Promise<void> {
    if (!this.stripeClient) return;

    for (const event of events) {
      const customerId = event.customerId;
      if (!customerId) {
        // Skip events without customer attribution for Stripe billing
        continue;
      }

      const timestamp = event.timestamp || new Date().toISOString();
      const model = `${event.provider}/${event.model}`;

      // 1. Send Input Tokens Meter Event
      if (event.usage.inputTokens > 0) {
        try {
          await this.stripeClient.v2.billing.meterEvents.create({
            event_name: this.eventName,
            timestamp,
            payload: {
              stripe_customer_id: customerId,
              value: event.usage.inputTokens.toString(),
              model,
              token_type: 'input',
              cached_tokens: (event.usage.cachedTokens ?? 0).toString(),
              ...(event.metadata ? (event.metadata as any) : {}),
            },
          });
        } catch (e) {
          if (this.debug) console.warn('[vibezcheck] Input meter event error:', e);
        }
      }

      // 2. Send Output Tokens Meter Event
      if (event.usage.outputTokens > 0) {
        try {
          await this.stripeClient.v2.billing.meterEvents.create({
            event_name: this.eventName,
            timestamp,
            payload: {
              stripe_customer_id: customerId,
              value: event.usage.outputTokens.toString(),
              model,
              token_type: 'output',
              reasoning_tokens: (event.usage.reasoningTokens ?? 0).toString(),
              visible_tokens: (event.usage.visibleOutputTokens ?? event.usage.outputTokens).toString(),
              ...(event.metadata ? (event.metadata as any) : {}),
            },
          });
        } catch (e) {
          if (this.debug) console.warn('[vibezcheck] Output meter event error:', e);
        }
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
