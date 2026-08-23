import type { ModelPricingRates } from '../types';

/**
 * Built-in Registry of Model Pricing (USD per 1 Million Tokens)
 * Sourced from official 2026 provider pricing tables.
 */
export const MODEL_PRICING_TABLE: Record<string, ModelPricingRates> = {
  // --- OpenAI ---
  'gpt-5.6-sol': { inputPer1M: 4.0, outputPer1M: 20.0, cachedInputPer1M: 0.4 },
  'gpt-5.6-terra': { inputPer1M: 2.0, outputPer1M: 12.0, cachedInputPer1M: 0.2 },
  'gpt-5.6-luna': { inputPer1M: 0.2, outputPer1M: 1.2, cachedInputPer1M: 0.02 },
  'gpt-5': { inputPer1M: 4.0, outputPer1M: 20.0, cachedInputPer1M: 0.4 },
  'gpt-5-mini': { inputPer1M: 0.2, outputPer1M: 1.2, cachedInputPer1M: 0.02 },
  'o1': { inputPer1M: 15.0, outputPer1M: 60.0, cachedInputPer1M: 7.5 },
  'o1-mini': { inputPer1M: 1.1, outputPer1M: 4.4, cachedInputPer1M: 0.55 },
  'o3': { inputPer1M: 15.0, outputPer1M: 60.0, cachedInputPer1M: 7.5 },
  'o3-mini': { inputPer1M: 1.1, outputPer1M: 4.4, cachedInputPer1M: 0.55 },
  'gpt-4o': { inputPer1M: 2.5, outputPer1M: 10.0, cachedInputPer1M: 1.25 },
  'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.6, cachedInputPer1M: 0.075 },
  'gpt-4.1': { inputPer1M: 2.0, outputPer1M: 8.0, cachedInputPer1M: 1.0 },
  'gpt-4.1-nano': { inputPer1M: 0.1, outputPer1M: 0.4, cachedInputPer1M: 0.05 },
  'text-embedding-3-small': { inputPer1M: 0.02, outputPer1M: 0.0 },
  'text-embedding-3-large': { inputPer1M: 0.13, outputPer1M: 0.0 },

  // --- Anthropic ---
  'claude-3-7-sonnet': { inputPer1M: 0.59, outputPer1M: 2.93, cachedInputPer1M: 0.3 },
  'claude-sonnet-5': { inputPer1M: 2.0, outputPer1M: 10.0, cachedInputPer1M: 0.3 },
  'claude-3-5-sonnet': { inputPer1M: 3.0, outputPer1M: 15.0, cachedInputPer1M: 0.3 },
  'claude-3-5-haiku': { inputPer1M: 0.8, outputPer1M: 4.0, cachedInputPer1M: 0.08 },
  'haiku-4.5': { inputPer1M: 1.0, outputPer1M: 5.0, cachedInputPer1M: 0.1 },
  'claude-opus-5': { inputPer1M: 5.0, outputPer1M: 25.0, cachedInputPer1M: 1.5 },
  'claude-3-opus': { inputPer1M: 15.0, outputPer1M: 75.0, cachedInputPer1M: 1.5 },

  // --- Google Gemini ---
  'gemini-3.7-flash': { inputPer1M: 0.75, outputPer1M: 3.75, cachedInputPer1M: 0.18 },
  'gemini-3.1-pro': { inputPer1M: 2.0, outputPer1M: 12.0, cachedInputPer1M: 0.5 },
  'gemini-3.5-flash': { inputPer1M: 1.5, outputPer1M: 9.0, cachedInputPer1M: 0.38 },
  'gemini-3.1-flash-lite': { inputPer1M: 0.25, outputPer1M: 1.5, cachedInputPer1M: 0.06 },
  'gemini-2.0-flash': { inputPer1M: 0.1, outputPer1M: 0.4, cachedInputPer1M: 0.025 },
  'gemini-1.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0, cachedInputPer1M: 0.3125 },
  'gemini-1.5-flash': { inputPer1M: 0.075, outputPer1M: 0.3, cachedInputPer1M: 0.01875 },

  // --- xAI Grok ---
  'grok-4.6': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'grok-2': { inputPer1M: 2.0, outputPer1M: 10.0 },
  'grok-2-vision': { inputPer1M: 2.0, outputPer1M: 10.0 },
  'grok-beta': { inputPer1M: 5.0, outputPer1M: 15.0 },

  // --- Mistral ---
  'mistral-large-3': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'mistral-large-latest': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'codestral-latest': { inputPer1M: 0.3, outputPer1M: 0.9 },
  'mistral-small-latest': { inputPer1M: 0.2, outputPer1M: 0.6 },
  'ministral-8b-latest': { inputPer1M: 0.1, outputPer1M: 0.1 },

  // --- Groq LPUs ---
  'llama-3.3-70b-versatile': { inputPer1M: 0.59, outputPer1M: 0.79 },
  'llama-3.1-8b-instant': { inputPer1M: 0.05, outputPer1M: 0.08 },
  'deepseek-r1-distill-llama-70b': { inputPer1M: 0.75, outputPer1M: 0.99 },
  'qwen-2.5-32b': { inputPer1M: 0.29, outputPer1M: 0.39 },

  // --- DeepSeek ---
  'deepseek-v4-pro': { inputPer1M: 0.66, outputPer1M: 1.98, cachedInputPer1M: 0.15 },
  'deepseek-v4-flash': { inputPer1M: 0.22, outputPer1M: 0.66, cachedInputPer1M: 0.05 },
  'deepseek-chat': { inputPer1M: 0.22, outputPer1M: 0.66, cachedInputPer1M: 0.05 },
  'deepseek-reasoner': { inputPer1M: 0.66, outputPer1M: 1.98, cachedInputPer1M: 0.15 },

  // --- Cohere ---
  'command-r-plus': { inputPer1M: 2.5, outputPer1M: 10.0 },
  'command-r': { inputPer1M: 0.15, outputPer1M: 0.6 },
};

/**
 * Dynamic in-memory registry allowing runtime custom price registration
 */
const customPricingRegistry: Record<string, ModelPricingRates> = {};

/**
 * Normalize model identifier to match pricing table keys
 */
export function normalizeModelKey(rawModel: string): string {
  if (!rawModel) return 'unknown';

  let model = rawModel.toLowerCase().trim();

  // Strip provider prefix if present (e.g. 'openai/gpt-4o' -> 'gpt-4o')
  if (model.includes('/')) {
    model = model.split('/')[1] || model;
  }

  // Remove date suffixes like -20240307 or -20250219
  model = model.replace(/-\d{8}$/, '');
  model = model.replace(/-\d{4}-\d{2}-\d{2}$/, '');

  return model;
}

/**
 * Retrieve pricing rates for a given model
 */
export function getModelPricing(modelName: string): ModelPricingRates {
  const normalized = normalizeModelKey(modelName);

  // Check custom registry first
  if (customPricingRegistry[normalized]) {
    return customPricingRegistry[normalized];
  }
  if (customPricingRegistry[modelName]) {
    return customPricingRegistry[modelName];
  }

  // Check built-in table
  if (MODEL_PRICING_TABLE[normalized]) {
    return MODEL_PRICING_TABLE[normalized];
  }
  if (MODEL_PRICING_TABLE[modelName]) {
    return MODEL_PRICING_TABLE[modelName];
  }

  // Fallback defaults for unknown models (conservative estimates: $1.00 in, $3.00 out)
  return {
    inputPer1M: 1.0,
    outputPer1M: 3.0,
    cachedInputPer1M: 0.5,
  };
}

/**
 * Register or override pricing rates for a custom model
 */
export function registerModelPricing(modelName: string, rates: ModelPricingRates): void {
  const normalized = normalizeModelKey(modelName);
  customPricingRegistry[normalized] = rates;
  customPricingRegistry[modelName] = rates;
}
