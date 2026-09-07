import type { CustomerParam, UsageEvent, ToolMeterOptions } from '../types';
import { withBilling, type WithBillingOptions } from './with-billing';
import { calculateCost } from '../pricing/calculator';
import { createMeter, VibezMeter } from '../meter/client';

export interface VibezCheckModelOptions extends WithBillingOptions {
  /** OpenAI / Anthropic / AI Gateway API Key override */
  apiKey?: string;
  /** AI Gateway / Provider Base URL override */
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
 * Supports:
 * - Direct instances: `vibezcheck(openai('gpt-4o'))`, `vibezcheck(anthropic('claude-3-7-sonnet'))`
 * - String identifiers: `vibezcheck('openai/gpt-4o-mini')`, `vibezcheck('anthropic/claude-3-5-sonnet')`, `vibezcheck('gpt-4o')`
 * - Vercel AI SDK primitives: `generateText`, `streamText`, `generateObject`, `streamObject`
 *
 * @example
 * ```typescript
 * import { streamText } from 'ai';
 * import { openai } from '@ai-sdk/openai';
 * import { anthropic } from '@ai-sdk/anthropic';
 * import { vibezcheck } from 'vibezcheck';
 *
 * // 1. Pass wrapped OpenAI instance:
 * const result = streamText({
 *   model: vibezcheck(openai('gpt-4o-mini'), { customer: 'alex@example.com' }),
 *   messages,
 * });
 *
 * // 2. Pass wrapped Anthropic instance:
 * const result2 = streamText({
 *   model: vibezcheck(anthropic('claude-3-7-sonnet'), { customer: 'alex@example.com' }),
 *   messages,
 * });
 *
 * // 3. Use 1-line string identifier:
 * const result3 = streamText({
 *   model: vibezcheck('openai/gpt-4o-mini', { customer: 'alex@example.com' }),
 *   messages,
 * });
 * ```
 */
export function createVibezModel(
  modelOrId: any,
  options: VibezCheckModelOptions = {}
): any {
  // If an existing LanguageModel instance is passed (from openai(), anthropic(), etc.), wrap directly
  if (typeof modelOrId === 'object' && modelOrId !== null) {
    return withBilling(modelOrId, options);
  }

  // If a string model identifier is passed (e.g. "openai/gpt-4o-mini", "anthropic/claude-3-7-sonnet", or "gpt-4o-mini")
  if (typeof modelOrId === 'string') {
    const rawId = modelOrId;
    let providerName = 'openai';
    let cleanModelId = rawId;

    if (rawId.includes('/')) {
      const parts = rawId.split('/');
      providerName = parts[0].toLowerCase();
      cleanModelId = parts.slice(1).join('/');
    } else if (rawId.startsWith('claude-')) {
      providerName = 'anthropic';
    } else if (rawId.startsWith('gemini-')) {
      providerName = 'google';
    } else if (rawId.startsWith('deepseek-')) {
      providerName = 'deepseek';
    } else if (rawId.startsWith('grok-')) {
      providerName = 'xai';
    } else if (
      rawId.startsWith('mistral-') ||
      rawId.startsWith('codestral-') ||
      rawId.startsWith('ministral-') ||
      rawId.startsWith('open-mistral') ||
      rawId.startsWith('open-mixtral')
    ) {
      providerName = 'mistral';
    } else if (
      rawId.startsWith('llama-') ||
      rawId.startsWith('mixtral-') ||
      rawId.startsWith('gemma') ||
      rawId.startsWith('qwen-')
    ) {
      providerName = 'groq';
    } else if (rawId.startsWith('command-')) {
      providerName = 'cohere';
    }

    const apiKey =
      options.apiKey ||
      process.env.AI_GATEWAY_API_KEY ||
      (providerName === 'anthropic' ? process.env.ANTHROPIC_API_KEY : undefined) ||
      (providerName === 'google' ? process.env.GOOGLE_GENERATIVE_AI_API_KEY : undefined) ||
      (providerName === 'mistral' ? process.env.MISTRAL_API_KEY : undefined) ||
      (providerName === 'groq' ? process.env.GROQ_API_KEY : undefined) ||
      (providerName === 'deepseek' ? process.env.DEEPSEEK_API_KEY : undefined) ||
      (providerName === 'xai' ? process.env.XAI_API_KEY : undefined) ||
      (providerName === 'cohere' ? process.env.COHERE_API_KEY : undefined) ||
      process.env.OPENAI_API_KEY;

    const baseURL =
      options.baseURL ||
      process.env.AI_GATEWAY_BASE_URL ||
      (providerName === 'openai' ? 'https://api.openai.com/v1' : undefined);

    let baseModelInstance: any = null;

    try {
      if (providerName === 'openai' || providerName === 'gateway' || !providerName) {
        const mod = require('@ai-sdk/openai');
        const factory = mod.createOpenAI || mod.openai || mod.default?.createOpenAI || mod.default?.openai;
        if (typeof factory === 'function') {
          if (mod.createOpenAI) {
            const provider = factory({ apiKey, baseURL });
            baseModelInstance = provider(cleanModelId);
          } else {
            baseModelInstance = factory(cleanModelId);
          }
        }
      } else if (providerName === 'anthropic') {
        const mod = require('@ai-sdk/anthropic');
        const factory = mod.createAnthropic || mod.anthropic || mod.default?.createAnthropic || mod.default?.anthropic;
        if (typeof factory === 'function') {
          if (mod.createAnthropic) {
            const provider = factory({ apiKey, baseURL });
            baseModelInstance = provider(cleanModelId);
          } else {
            baseModelInstance = factory(cleanModelId);
          }
        }
      } else if (providerName === 'google') {
        const mod = require('@ai-sdk/google');
        const factory = mod.createGoogleGenerativeAI || mod.google || mod.default?.createGoogleGenerativeAI || mod.default?.google;
        if (typeof factory === 'function') {
          if (mod.createGoogleGenerativeAI) {
            const provider = factory({ apiKey, baseURL });
            baseModelInstance = provider(cleanModelId);
          } else {
            baseModelInstance = factory(cleanModelId);
          }
        }
      } else if (providerName === 'mistral') {
        const mod = require('@ai-sdk/mistral');
        const factory = mod.createMistral || mod.mistral || mod.default?.createMistral || mod.default?.mistral;
        if (typeof factory === 'function') {
          baseModelInstance = mod.createMistral ? factory({ apiKey, baseURL })(cleanModelId) : factory(cleanModelId);
        }
      } else if (providerName === 'groq') {
        const mod = require('@ai-sdk/groq');
        const factory = mod.createGroq || mod.groq || mod.default?.createGroq || mod.default?.groq;
        if (typeof factory === 'function') {
          baseModelInstance = mod.createGroq ? factory({ apiKey, baseURL })(cleanModelId) : factory(cleanModelId);
        }
      } else if (providerName === 'deepseek') {
        const mod = require('@ai-sdk/deepseek');
        const factory = mod.createDeepSeek || mod.deepseek || mod.default?.createDeepSeek || mod.default?.deepseek;
        if (typeof factory === 'function') {
          baseModelInstance = mod.createDeepSeek ? factory({ apiKey, baseURL })(cleanModelId) : factory(cleanModelId);
        }
      } else if (providerName === 'xai') {
        const mod = require('@ai-sdk/xai');
        const factory = mod.createXai || mod.xai || mod.default?.createXai || mod.default?.xai;
        if (typeof factory === 'function') {
          baseModelInstance = mod.createXai ? factory({ apiKey, baseURL })(cleanModelId) : factory(cleanModelId);
        }
      } else if (providerName === 'cohere') {
        const mod = require('@ai-sdk/cohere');
        const factory = mod.createCohere || mod.cohere || mod.default?.createCohere || mod.default?.cohere;
        if (typeof factory === 'function') {
          baseModelInstance = mod.createCohere ? factory({ apiKey, baseURL })(cleanModelId) : factory(cleanModelId);
        }
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
