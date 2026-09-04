import Stripe from 'stripe';
import type { MeterOptions, StreamWrapOptions, CustomerParam } from './types';
import { VibezMeter, createMeter } from './meter/client';
import { calculateCost, getModelPricing, registerModelPricing } from './pricing';
import { withBilling, meteredModel } from './ai-sdk/with-billing';
import { createVibezModel, createVibezSession, type VibezCheckModelOptions } from './ai-sdk/declarative';
import { CustomerManager, createCustomerManager } from './customers/manager';
import { ApiKeyAuth, createApiKeyAuth, extractAuthToken } from './auth';
import { BillingHelper, createBillingHelper } from './billing/sessions';

export * from './types';
export * from './meter';
export * from './pricing';
export * from './ai-sdk';
export * from './customers';
export * from './auth';
export * from './billing';

/**
 * VibezCheck Unified Client Configuration
 */
export interface VibezCheckConfig extends MeterOptions {
  /** Auto-initialize CustomerManager (default: true if Stripe key present) */
  autoCustomers?: boolean;
}

/**
 * VibezCheck Unified Client Instance
 */
export class VibezCheckClient {
  public meter: VibezMeter;
  public customers?: CustomerManager;
  public auth?: ApiKeyAuth;
  public billing?: BillingHelper;
  private stripeClient?: Stripe;

  constructor(config: VibezCheckConfig = {}) {
    const apiKey = config.apiKey || process.env.STRIPE_SECRET_KEY;
    if (apiKey) {
      this.stripeClient = config.stripe || new Stripe(apiKey);
    }

    this.meter = new VibezMeter({
      ...config,
      stripe: this.stripeClient,
    });

    if (this.stripeClient) {
      this.customers = new CustomerManager({ stripe: this.stripeClient });
      this.auth = new ApiKeyAuth(this.stripeClient);
      this.billing = new BillingHelper({ stripe: this.stripeClient });
    }
  }

  /**
   * 1-Line Zero-Latency Stream Wrapper for OpenAI, Anthropic, Gemini, etc.
   */
  public wrapStream<T>(stream: T, options?: StreamWrapOptions): T {
    return this.meter.wrapStream(stream, options);
  }

  /**
   * Track token usage from a non-streaming response object
   */
  public track(response: any, options?: { customer?: CustomerParam; model?: string }) {
    return this.meter.trackUsage(response, options);
  }

  /**
   * 1-Line Wrapper for Vercel AI SDK LanguageModel
   */
  public withBilling<T extends object>(model: T, options?: { customer?: CustomerParam }) {
    return withBilling(model, {
      ...options,
      meter: this.meter,
    });
  }

  /**
   * Declarative model resolver for Vercel AI SDK
   */
  public model(modelOrId: any, options?: VibezCheckModelOptions): any {
    return createVibezModel(modelOrId, {
      ...options,
      meter: this.meter,
    });
  }

  /**
   * Flush pending meter events (vital for serverless runtimes)
   */
  public async flush(): Promise<void> {
    await this.meter.flush();
  }

  /**
   * In-memory usage statistics
   */
  public getUsageSummary() {
    return this.meter.getUsageSummary();
  }
}

/**
 * Factory to create VibezCheck client
 */
export function createVibezCheck(config: VibezCheckConfig = {}): VibezCheckClient {
  return new VibezCheckClient(config);
}

/**
 * Declarative 1-line factory & model resolver for Vercel AI SDK
 *
 * @example
 * ```typescript
 * import { generateText, streamText } from 'ai';
 * import { vibezcheck } from 'vibezcheck';
 *
 * // 1. Use string model identifier:
 * const { text } = await generateText({
 *   model: vibezcheck('openai/gpt-4o-mini', { customer: 'alex@example.com' }),
 *   prompt: 'What is love?',
 * });
 *
 * // 2. Use with streamText:
 * const result = streamText({
 *   model: vibezcheck('gpt-4o-mini', { customer: 'alex@example.com' }),
 *   messages,
 * });
 *
 * // 3. Wrap existing model instance:
 * const result = streamText({
 *   model: vibezcheck(openai('gpt-4o-mini'), { customer: 'alex@example.com' }),
 *   messages,
 * });
 * ```
 */
export function vibezcheck(
  modelOrId: any,
  options?: VibezCheckModelOptions
): any;
export function vibezcheck(config?: VibezCheckConfig): VibezCheckClient;
export function vibezcheck(
  firstArg?: any,
  secondArg?: any
): any {
  if (typeof firstArg === 'string' || (firstArg && (firstArg.specificationVersion || firstArg.doGenerate || firstArg.doStream))) {
    return createVibezModel(firstArg, secondArg);
  }
  return new VibezCheckClient(firstArg || {});
}

// Attach static helper utilities to vibezcheck function
vibezcheck.calculateCost = calculateCost;
vibezcheck.getModelPricing = getModelPricing;
vibezcheck.registerModelPricing = registerModelPricing;
vibezcheck.create = createVibezCheck;
vibezcheck.withBilling = withBilling;
vibezcheck.createMeter = createMeter;
vibezcheck.session = createVibezSession;

/**
 * Singleton client instance
 */
export const vibez = new VibezCheckClient();

/**
 * Aliases for developer typing convenience
 */
export const vibescheck = vibezcheck;
export const vibes = vibez;
