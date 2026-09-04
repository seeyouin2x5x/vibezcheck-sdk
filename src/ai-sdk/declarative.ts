import type { CustomerParam, UsageEvent, ToolMeterOptions } from '../types';
import { withBilling, type WithBillingOptions } from './with-billing';
import { calculateCost } from '../pricing/calculator';
import { createMeter, VibezMeter } from '../meter/client';

export interface VibezCheckModelOptions extends WithBillingOptions {
  /** OpenAI / AI Gateway API Key override */
  apiKey?: string;
  /** AI Gateway / OpenAI Base URL override */
  baseURL?: string;
}

export interface VibezSessionOptions {
  customer?: CustomerParam;
  stripeApiKey?: string;
  pricing?: WithBillingOptions['pricing'];
  billing?: WithBillingOptions['billing'];
  metadata?: Record<string, string | number | boolean>;
}

export interface VibezSession {
  /** Creates a metered model bound to this session customer */
  model: (modelOrId: any, options?: VibezCheckModelOptions) => any;
  /** Tracks a non-LLM tool execution cost (e.g. search, scraper, image gen) */
  trackTool: (name: string, options: { costUSD: number; metadata?: Record<string, any> }) => Promise<void>;
  /** Underlying meter instance */
  meter: VibezMeter;
}

/**
 * Creates or resolves an AI SDK compatible LanguageModel with built-in VibezCheck billing & metering.
 *
 * @example
 * ```typescript
 * import { generateText, streamText } from 'ai';
 * import { vibezcheck } from 'vibezcheck';
 *
 * // 1. Declarative string model identifier:
 * const { text } = await generateText({
 *   model: vibezcheck('openai/gpt-4o-mini', { customer: 'alex@example.com' }),
 *   prompt: 'What is love?',
 * });
 *
 * // 2. Works with all Vercel AI SDK primitives (streamText, generateObject, streamObject):
 * const result = streamText({
 *   model: vibezcheck('gpt-4o', {
 *     customer: 'alex@example.com',
 *     pricing: { margin: 1.5 }, // 50% profit margin
 *   }),
 *   messages,
 * });
 * ```
 */
export function createVibezModel(
  modelOrId: any,
  options: VibezCheckModelOptions = {}
): any {
  // If an existing LanguageModel instance is passed, wrap directly
  if (typeof modelOrId === 'object' && modelOrId !== null) {
    return withBilling(modelOrId, options);
  }

  // If a string model identifier is passed (e.g. "openai/gpt-4o-mini" or "gpt-4o-mini")
  if (typeof modelOrId === 'string') {
    const rawId = modelOrId;
    let providerName = 'openai';
    let cleanModelId = rawId;

    if (rawId.includes('/')) {
      const parts = rawId.split('/');
      providerName = parts[0].toLowerCase();
      cleanModelId = parts.slice(1).join('/');
    }

    const apiKey =
      options.apiKey ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.ANTHROPIC_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const baseURL =
      options.baseURL ||
      process.env.AI_GATEWAY_BASE_URL ||
      (providerName === 'openai' ? 'https://api.openai.com/v1' : undefined);

    let baseModelInstance: any = null;

    try {
      if (providerName === 'openai' || providerName === 'gateway' || !providerName) {
        // Try dynamic import or require of @ai-sdk/openai
        const { createOpenAI } = require('@ai-sdk/openai');
        const openaiProvider = createOpenAI({ apiKey, baseURL });
        baseModelInstance = openaiProvider(cleanModelId);
      } else if (providerName === 'anthropic') {
        const { createAnthropic } = require('@ai-sdk/anthropic');
        const anthropicProvider = createAnthropic({ apiKey, baseURL });
        baseModelInstance = anthropicProvider(cleanModelId);
      } else if (providerName === 'google') {
        const { createGoogleGenerativeAI } = require('@ai-sdk/google');
        const googleProvider = createGoogleGenerativeAI({ apiKey, baseURL });
        baseModelInstance = googleProvider(cleanModelId);
      }
    } catch {
      // Fallback object implementing LanguageModel shape if provider package not installed
      baseModelInstance = {
        specificationVersion: 'v2',
        provider: providerName,
        modelId: cleanModelId,
      };
    }

    if (!baseModelInstance) {
      baseModelInstance = {
        specificationVersion: 'v2',
        provider: providerName,
        modelId: cleanModelId,
      };
    }

    return withBilling(baseModelInstance, options);
  }

  return modelOrId;
}

/**
 * Creates a scoped session for unified multi-call and tool tracking.
 */
export function createVibezSession(sessionOptions: VibezSessionOptions = {}): VibezSession {
  const meter = createMeter({
    apiKey: sessionOptions.stripeApiKey,
  });

  const customerId =
    typeof sessionOptions.customer === 'string'
      ? sessionOptions.customer
      : sessionOptions.customer?.id;

  return {
    meter,
    model: (modelOrId: any, callOptions: VibezCheckModelOptions = {}) => {
      return createVibezModel(modelOrId, {
        customer: sessionOptions.customer,
        pricing: sessionOptions.pricing,
        billing: sessionOptions.billing,
        meter,
        metadata: {
          ...sessionOptions.metadata,
          ...callOptions.metadata,
        },
        ...callOptions,
      });
    },
    trackTool: async (name: string, { costUSD, metadata }: { costUSD: number; metadata?: Record<string, any> }) => {
      // Record non-LLM tool usage as a custom usage event
      const event: UsageEvent = {
        timestamp: new Date().toISOString(),
        model: `tool:${name}`,
        provider: 'tool',
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
        cost: {
          inputCostUSD: 0,
          outputCostUSD: costUSD,
          totalUSD: costUSD,
          currency: 'USD',
        },
        customerId,
        metadata: {
          ...sessionOptions.metadata,
          ...metadata,
          tool: name,
        },
      };

      meter.recordUsage({
        model: `tool:${name}`,
        provider: 'tool',
        inputTokens: 0,
        outputTokens: 0,
        customerId,
        metadata: event.metadata,
      });

      await meter.flush();
    },
  };
}

// Attach session helper to createVibezModel function
export const vibezcheck: typeof createVibezModel & {
  session: typeof createVibezSession;
} = Object.assign(createVibezModel, {
  session: createVibezSession,
});
