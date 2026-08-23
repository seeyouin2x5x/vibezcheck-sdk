import Stripe from 'stripe';
import type {
  MeterOptions,
  StreamWrapOptions,
  RecordUsageOptions,
  UsageEvent,
  UsageSummary,
  CustomerParam,
} from '../types';
import { MeterBatcher } from './batcher';
import { detectAndExtractUsage } from './extractors';
import { calculateUsageCost } from '../pricing/calculator';
import { wrapUniversalStream } from './stream';

export class VibezMeter {
  private batcher: MeterBatcher;
  private stripeClient?: Stripe;
  private markupMultiplier?: number;

  constructor(options: MeterOptions = {}) {
    this.markupMultiplier = options.markupMultiplier;

    // Initialize Stripe client if apiKey or stripe instance is provided
    if (options.stripe) {
      this.stripeClient = options.stripe;
    } else if (options.apiKey || process.env.STRIPE_SECRET_KEY) {
      const key = options.apiKey || process.env.STRIPE_SECRET_KEY!;
      this.stripeClient = new Stripe(key, {
        appInfo: {
          name: 'vibezcheck',
          version: '0.1.0',
          url: 'https://vibezcheck.xyz',
        },
      });
    }

    this.batcher = new MeterBatcher({
      ...options,
      stripe: this.stripeClient,
    });
  }

  /**
   * Track token usage from a non-streaming response object (OpenAI, Anthropic, Gemini, etc.)
   */
  public trackUsage(
    response: any,
    options: {
      customer?: CustomerParam;
      customerId?: string;
      model?: string;
      provider?: string;
      metadata?: Record<string, string | number | boolean>;
    } = {}
  ): UsageEvent | null {
    const extracted = detectAndExtractUsage(response, options.model, options.provider);
    if (!extracted) {
      return null;
    }

    const model = options.model || extracted.model;
    const cost = calculateUsageCost(model, extracted.usage, this.markupMultiplier);
    const customerId =
      typeof options.customer === 'string'
        ? options.customer
        : options.customer?.id || options.customerId;

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      model,
      provider: extracted.provider,
      usage: extracted.usage,
      cost,
      customerId,
      metadata: options.metadata,
    };

    this.batcher.enqueue(event);
    return event;
  }

  /**
   * Wrap any LLM stream (OpenAI, Anthropic, Gemini) with zero added latency
   */
  public wrapStream<T>(stream: T, options: StreamWrapOptions = {}): T {
    return wrapUniversalStream(stream, options, (event) => {
      this.batcher.enqueue(event);
    });
  }

  /**
   * Directly record token usage manually
   */
  public recordUsage(options: RecordUsageOptions): UsageEvent {
    const inputTokens = options.inputTokens ?? 0;
    const outputTokens = options.outputTokens ?? 0;
    const reasoningTokens = options.reasoningTokens;
    const cachedTokens = options.cachedTokens;

    const usage = {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      reasoningTokens,
      visibleOutputTokens:
        reasoningTokens !== undefined ? Math.max(0, outputTokens - reasoningTokens) : outputTokens,
      cachedTokens,
    };

    const cost = calculateUsageCost(options.model, usage, this.markupMultiplier);
    const customerId =
      typeof options.customer === 'string'
        ? options.customer
        : options.customer?.id || options.customerId;

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      model: options.model,
      provider: options.provider || 'custom',
      usage,
      cost,
      customerId,
      metadata: options.metadata,
    };

    this.batcher.enqueue(event);
    return event;
  }

  /**
   * Flush pending events to Stripe (vital for Serverless & Edge environments)
   */
  public async flush(): Promise<void> {
    await this.batcher.flush();
  }

  /**
   * Get in-memory aggregated usage statistics
   */
  public getUsageSummary(): UsageSummary {
    return this.batcher.getSummary();
  }

  /**
   * Reset in-memory ledger
   */
  public resetSummary(): void {
    this.batcher.resetLedger();
  }
}

/**
 * Factory function to create a VibezMeter instance
 */
export function createMeter(options: MeterOptions = {}): VibezMeter {
  return new VibezMeter(options);
}
