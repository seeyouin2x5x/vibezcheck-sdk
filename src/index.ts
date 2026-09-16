import type { MeterOptions, StreamWrapOptions, CustomerParam } from './types';
import { VibezMeter, createMeter } from './meter/client';
import { calculateCost, calculateUsageCost, getModelPricing, registerModelPricing, syncPricingManifest, triggerBackgroundSync, syncVercelGateway, triggerVercelGatewaySync, VERCEL_GATEWAY_MODELS_URL } from './pricing';
import { withBilling, meteredModel } from './ai-sdk/with-billing';
import { toResponse } from './ai-sdk/to-response';
import { toVibezDataStream, toVibezDataStreamResponse } from './ai-sdk/data-stream';
import { createVibezModel, createVibezSession, type VibezCheckModelOptions } from './ai-sdk/declarative';
import { vibezcheckMiddleware } from './ai-sdk/middleware';
import { AgentSession, createAgentSession } from './billing/session';
import { wrapTool, instrumentToolKit, createTools } from './billing/tools';
import { isBudgetExceeded, stopWhenBudgetExceeded } from './billing/stop-condition';
import { createAgent } from './billing/agent';
import {
  createSupabaseAdapter,
  createDatabaseAdapter,
  createMetronomeAdapter,
} from './database';

export * from './types';
export * from './meter';
export * from './pricing';
export * from './ai-sdk';
export * from './customers';
export * from './billing';
export * from './database';
export { vibezcheckMiddleware } from './ai-sdk/middleware';


/**
 * VibezCheck Unified Client Configuration
 */
export interface VibezCheckConfig extends MeterOptions {}

/**
 * VibezCheck Unified Client Instance
 */
export class VibezCheckClient {
  public meter: VibezMeter;

  constructor(config: VibezCheckConfig = {}) {
    this.meter = new VibezMeter(config);
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
vibezcheck.calculateUsageCost = calculateUsageCost;
vibezcheck.getModelPricing = getModelPricing;
vibezcheck.registerModelPricing = registerModelPricing;
vibezcheck.create = createVibezCheck;
vibezcheck.withBilling = withBilling;
vibezcheck.createMeter = createMeter;
vibezcheck.session = createAgentSession;
vibezcheck.Session = AgentSession;
vibezcheck.wrapTool = wrapTool;
vibezcheck.tool = wrapTool;
vibezcheck.instrumentToolKit = instrumentToolKit;
vibezcheck.tools = createTools;
vibezcheck.agent = createAgent;
vibezcheck.stopWhen = isBudgetExceeded;
vibezcheck.middleware = vibezcheckMiddleware;
vibezcheck.toResponse = toResponse;
vibezcheck.toDataStream = toVibezDataStream;
vibezcheck.toVibezDataStream = toVibezDataStream;
vibezcheck.toDataStreamResponse = toVibezDataStreamResponse;
vibezcheck.supabase = createSupabaseAdapter;
vibezcheck.database = createDatabaseAdapter;
vibezcheck.createDatabaseAdapter = createDatabaseAdapter;
vibezcheck.metronome = createMetronomeAdapter;
vibezcheck.createMetronomeAdapter = createMetronomeAdapter;
vibezcheck.syncPricing = syncPricingManifest;
vibezcheck.syncPricingManifest = syncPricingManifest;
vibezcheck.triggerBackgroundSync = triggerBackgroundSync;
vibezcheck.syncVercelGateway = syncVercelGateway;
vibezcheck.syncVercel = syncVercelGateway;
vibezcheck.triggerVercelGatewaySync = triggerVercelGatewaySync;
vibezcheck.VERCEL_GATEWAY_MODELS_URL = VERCEL_GATEWAY_MODELS_URL;
vibezcheck.flush = () => vibez.flush();

/**
 * Singleton client instance
 */
export const vibez = new VibezCheckClient();
