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
import { normalizeCustomer } from '../customers/helpers';

export class VibezMeter {
  private batcher: MeterBatcher;
  private markupMultiplier?: number;

  constructor(options: MeterOptions = {}) {
    this.markupMultiplier = options.pricing?.margin ?? options.pricing?.markup ?? options.markupMultiplier;
    this.batcher = new MeterBatcher(options);
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
    const normalized = normalizeCustomer(options.customer, options.customerId);

    const mergedMeta = {
      ...normalized.customerMetadata,
      ...options.metadata,
    };

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      model,
      provider: extracted.provider,
      usage: extracted.usage,
      cost,
      customerId: normalized.customerId,
      customerEmail: normalized.customerEmail,
      customer: normalized.customerObj,
      metadata: mergedMeta,
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
  public recordUsage(options: RecordUsageOptions & { customer?: CustomerParam }): UsageEvent {
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
    const normalized = normalizeCustomer(options.customer, options.customerId);

    const mergedMeta = {
      ...normalized.customerMetadata,
      ...options.metadata,
    };

    const event: UsageEvent = {
      timestamp: new Date().toISOString(),
      model: options.model,
      provider: options.provider || 'custom',
      usage,
      cost,
      customerId: normalized.customerId,
      customerEmail: normalized.customerEmail,
      customer: normalized.customerObj,
      metadata: mergedMeta,
    };

    this.batcher.enqueue(event);
    return event;
  }

  /**
   * Flush pending events (vital for Serverless & Edge environments)
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
