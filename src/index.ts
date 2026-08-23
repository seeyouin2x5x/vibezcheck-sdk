import Stripe from 'stripe';
import type { MeterOptions, StreamWrapOptions, CustomerParam } from './types';
import { VibezMeter, createMeter } from './meter/client';
import { calculateCost } from './pricing/calculator';
import { withBilling, meteredModel } from './ai-sdk/with-billing';
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
   * 1-Line Universal Stream Responder for API Routes (Next.js, Express, Hono)
   */
  public async stream(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    customer?: CustomerParam;
    temperature?: number;
  }): Promise<Response> {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI();

    const responseStream = await openai.chat.completions.create({
      model: params.model,
      messages: params.messages as any,
      stream: true,
      stream_options: { include_usage: true },
      temperature: params.temperature,
    });

    const meteredStream = this.wrapStream(responseStream, {
      customer: params.customer,
      model: params.model,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of meteredStream) {
            const text = (chunk as any).choices?.[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
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
 * vibezcheck factory alias
 */
export const vibezcheck = createVibezCheck;

/**
 * vibescheck alias (tolerates spelling difference)
 */
export const vibescheck = createVibezCheck;

/**
 * Singleton instance initialized with process.env
 */
export const vibez = createVibezCheck();

/**
 * Singleton alias
 */
export const vibes = vibez;
