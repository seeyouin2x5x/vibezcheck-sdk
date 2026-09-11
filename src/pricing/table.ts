import type { ModelPricingRates } from '../types';

/**
 * Built-in Registry of Model Pricing (USD per 1 Million Tokens)
 * Sourced from official 2026 provider pricing tables.
 */
export const MODEL_PRICING_TABLE: Record<string, ModelPricingRates> = {
  // --- OpenAI (Modern & Reasoning) ---
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
  'gpt-4.5': { inputPer1M: 75.0, outputPer1M: 150.0, cachedInputPer1M: 37.5 },
  'gpt-4.5-preview': { inputPer1M: 75.0, outputPer1M: 150.0, cachedInputPer1M: 37.5 },
  'chatgpt-4o-latest': { inputPer1M: 5.0, outputPer1M: 15.0 },
  'gpt-4.1': { inputPer1M: 2.0, outputPer1M: 8.0, cachedInputPer1M: 1.0 },
  'gpt-4.1-nano': { inputPer1M: 0.1, outputPer1M: 0.4, cachedInputPer1M: 0.05 },
  'gpt-6-astra': { inputPer1M: 5.0, outputPer1M: 25.0, cachedInputPer1M: 0.5 },
  'gpt-6-astra-fast': { inputPer1M: 3.0, outputPer1M: 15.0, cachedInputPer1M: 0.3 },
  'gpt-image-2.5-flare': { inputPer1M: 0.0, outputPer1M: 0.04 },
  'gpt-image-2.5-sunburst': { inputPer1M: 0.0, outputPer1M: 0.08 },

  // --- OpenAI (Legacy & Backward Compatibility) ---
  'gpt-4-turbo': { inputPer1M: 10.0, outputPer1M: 30.0, cachedInputPer1M: 5.0 },
  'gpt-4-turbo-preview': { inputPer1M: 10.0, outputPer1M: 30.0, cachedInputPer1M: 5.0 },
  'gpt-4': { inputPer1M: 30.0, outputPer1M: 60.0 },
  'gpt-4-32k': { inputPer1M: 60.0, outputPer1M: 120.0 },
  'gpt-3.5-turbo': { inputPer1M: 0.5, outputPer1M: 1.5 },
  'gpt-3.5-turbo-16k': { inputPer1M: 3.0, outputPer1M: 4.0 },
  'text-embedding-3-small': { inputPer1M: 0.02, outputPer1M: 0.0 },
  'text-embedding-3-large': { inputPer1M: 0.13, outputPer1M: 0.0 },
  'text-embedding-ada-002': { inputPer1M: 0.10, outputPer1M: 0.0 },

  // --- Anthropic (Modern & Extended Thinking) ---
  'claude-3-7-sonnet': { inputPer1M: 0.59, outputPer1M: 2.93, cachedInputPer1M: 0.3 },
  'claude-sonnet-5': { inputPer1M: 2.0, outputPer1M: 10.0, cachedInputPer1M: 0.3 },
  'claude-3-5-sonnet': { inputPer1M: 3.0, outputPer1M: 15.0, cachedInputPer1M: 0.3 },
  'claude-3-5-haiku': { inputPer1M: 0.8, outputPer1M: 4.0, cachedInputPer1M: 0.08 },
  'haiku-4.5': { inputPer1M: 1.0, outputPer1M: 5.0, cachedInputPer1M: 0.1 },
  'claude-opus-5': { inputPer1M: 5.0, outputPer1M: 25.0, cachedInputPer1M: 1.5 },
  'claude-3-opus': { inputPer1M: 15.0, outputPer1M: 75.0, cachedInputPer1M: 1.5 },

  // --- Anthropic (Legacy & Backward Compatibility) ---
  'claude-3-sonnet': { inputPer1M: 3.0, outputPer1M: 15.0, cachedInputPer1M: 0.3 },
  'claude-3-haiku': { inputPer1M: 0.25, outputPer1M: 1.25, cachedInputPer1M: 0.025 },
  'claude-2.1': { inputPer1M: 8.0, outputPer1M: 24.0 },
  'claude-2.0': { inputPer1M: 8.0, outputPer1M: 24.0 },
  'claude-instant-1.2': { inputPer1M: 1.63, outputPer1M: 5.51 },

  // --- Google Gemini (Modern & Thoughts) ---
  'gemini-3.7-flash': { inputPer1M: 0.75, outputPer1M: 3.75, cachedInputPer1M: 0.18 },
  'gemini-3.1-pro': { inputPer1M: 2.0, outputPer1M: 12.0, cachedInputPer1M: 0.5 },
  'gemini-3.5-flash': { inputPer1M: 1.5, outputPer1M: 9.0, cachedInputPer1M: 0.38 },
  'gemini-3.1-flash-lite': { inputPer1M: 0.25, outputPer1M: 1.5, cachedInputPer1M: 0.06 },
  'gemini-2.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0, cachedInputPer1M: 0.3125 },
  'gemini-2.5-flash': { inputPer1M: 0.15, outputPer1M: 0.6, cachedInputPer1M: 0.0375 },
  'gemini-2.0-flash': { inputPer1M: 0.1, outputPer1M: 0.4, cachedInputPer1M: 0.025 },
  'gemini-2.0-flash-lite': { inputPer1M: 0.075, outputPer1M: 0.3, cachedInputPer1M: 0.01875 },
  'gemini-2.0-pro': { inputPer1M: 1.25, outputPer1M: 5.0, cachedInputPer1M: 0.3125 },

  // --- Google Gemini (Legacy & Backward Compatibility) ---
  'gemini-1.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0, cachedInputPer1M: 0.3125 },
  'gemini-1.5-flash': { inputPer1M: 0.075, outputPer1M: 0.3, cachedInputPer1M: 0.01875 },
  'gemini-1.5-flash-8b': { inputPer1M: 0.0375, outputPer1M: 0.15, cachedInputPer1M: 0.009375 },
  'gemini-1.0-pro': { inputPer1M: 0.5, outputPer1M: 1.5 },

  // --- xAI Grok ---
  'grok-4.6': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'grok-3': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'grok-3-mini': { inputPer1M: 0.3, outputPer1M: 1.5 },
  'grok-2': { inputPer1M: 2.0, outputPer1M: 10.0 },
  'grok-2-vision': { inputPer1M: 2.0, outputPer1M: 10.0 },
  'grok-beta': { inputPer1M: 5.0, outputPer1M: 15.0 },

  // --- Mistral ---
  'mistral-large-3': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'mistral-large-latest': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'mistral-large-2411': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'codestral-latest': { inputPer1M: 0.3, outputPer1M: 0.9 },
  'mistral-medium-latest': { inputPer1M: 2.7, outputPer1M: 8.1 },
  'mistral-medium-3-5': { inputPer1M: 2.0, outputPer1M: 6.0, cachedInputPer1M: 0.4 },
  'mistral-medium-2604': { inputPer1M: 2.0, outputPer1M: 6.0, cachedInputPer1M: 0.4 },
  'magistral-small-latest': { inputPer1M: 0.5, outputPer1M: 1.5, cachedInputPer1M: 0.1 },
  'magistral-medium-latest': { inputPer1M: 2.0, outputPer1M: 6.0, cachedInputPer1M: 0.4 },
  'mistral-small-latest': { inputPer1M: 0.2, outputPer1M: 0.6 },
  'mistral-small-2603': { inputPer1M: 0.2, outputPer1M: 0.6, cachedInputPer1M: 0.05 },
  'mistral-vibe-cli-fast': { inputPer1M: 0.2, outputPer1M: 0.6, cachedInputPer1M: 0.05 },
  'mistral-vibe-cli-latest': { inputPer1M: 0.2, outputPer1M: 0.6, cachedInputPer1M: 0.05 },
  'codestral-2508': { inputPer1M: 0.3, outputPer1M: 0.9, cachedInputPer1M: 0.08 },
  'codestral-embed': { inputPer1M: 0.1, outputPer1M: 0.0 },
  'mistral-embed-2312': { inputPer1M: 0.1, outputPer1M: 0.0 },
  'zai-glm-5-2': { inputPer1M: 0.6, outputPer1M: 2.2, cachedInputPer1M: 0.15 },
  'glm-5-2': { inputPer1M: 0.6, outputPer1M: 2.2, cachedInputPer1M: 0.15 },
  'labs-leanstral-1-5': { inputPer1M: 0.2, outputPer1M: 0.6, cachedInputPer1M: 0.05 },
  'ministral-8b-latest': { inputPer1M: 0.1, outputPer1M: 0.1 },
  'ministral-3b-latest': { inputPer1M: 0.04, outputPer1M: 0.04 },
  'open-mistral-7b': { inputPer1M: 0.2, outputPer1M: 0.2 },
  'open-mixtral-8x7b': { inputPer1M: 0.7, outputPer1M: 0.7 },
  'open-mixtral-8x22b': { inputPer1M: 2.0, outputPer1M: 6.0 },

  // --- Groq & Meta Llama LPUs ---
  'llama-3.3-70b-versatile': { inputPer1M: 0.59, outputPer1M: 0.79 },
  'llama-3.1-405b': { inputPer1M: 3.0, outputPer1M: 3.0 },
  'llama-3.1-70b-versatile': { inputPer1M: 0.59, outputPer1M: 0.79 },
  'llama-3.1-8b-instant': { inputPer1M: 0.05, outputPer1M: 0.08 },
  'llama-3.2-1b-preview': { inputPer1M: 0.04, outputPer1M: 0.04 },
  'llama-3.2-3b-preview': { inputPer1M: 0.06, outputPer1M: 0.06 },
  'llama-3.2-11b-vision': { inputPer1M: 0.18, outputPer1M: 0.18 },
  'llama-3.2-90b-vision': { inputPer1M: 0.90, outputPer1M: 0.90 },
  'deepseek-r1-distill-llama-70b': { inputPer1M: 0.75, outputPer1M: 0.99 },
  'deepseek-r1-distill-qwen-32b': { inputPer1M: 0.49, outputPer1M: 0.49 },
  'qwen-2.5-32b': { inputPer1M: 0.29, outputPer1M: 0.39 },
  'qwen-2.5-72b': { inputPer1M: 0.35, outputPer1M: 0.40 },
  'mixtral-8x7b-32768': { inputPer1M: 0.24, outputPer1M: 0.24 },
  'gemma2-9b-it': { inputPer1M: 0.20, outputPer1M: 0.20 },

  // --- DeepSeek ---
  'deepseek-v4-pro': { inputPer1M: 0.66, outputPer1M: 1.98, cachedInputPer1M: 0.15 },
  'deepseek-v4.1-flash': { inputPer1M: 0.20, outputPer1M: 0.60, cachedInputPer1M: 0.05 },
  'deepseek-v4-flash': { inputPer1M: 0.22, outputPer1M: 0.66, cachedInputPer1M: 0.05 },
  'deepseek-v3': { inputPer1M: 0.14, outputPer1M: 0.28, cachedInputPer1M: 0.014 },
  'deepseek-chat': { inputPer1M: 0.14, outputPer1M: 0.28, cachedInputPer1M: 0.014 },
  'deepseek-r1': { inputPer1M: 0.55, outputPer1M: 2.19, cachedInputPer1M: 0.14 },
  'deepseek-reasoner': { inputPer1M: 0.55, outputPer1M: 2.19, cachedInputPer1M: 0.14 },

  // --- Gateway, Inception & InclusionAI Models ---
  'mercury-2.5': { inputPer1M: 0.25, outputPer1M: 0.75, cachedInputPer1M: 0.05 },
  'mercury-2': { inputPer1M: 0.25, outputPer1M: 0.75, cachedInputPer1M: 0.05 },
  'ling-3.0-flash-sante': { inputPer1M: 0.15, outputPer1M: 0.45, cachedInputPer1M: 0.03 },
  'ling-3.0-flash': { inputPer1M: 0.15, outputPer1M: 0.45, cachedInputPer1M: 0.03 },

  // --- Cohere ---
  'command-r-plus': { inputPer1M: 2.5, outputPer1M: 10.0 },
  'command-r': { inputPer1M: 0.15, outputPer1M: 0.6 },
  'command': { inputPer1M: 1.0, outputPer1M: 2.0 },
  'command-light': { inputPer1M: 0.3, outputPer1M: 0.6 },
  'embed-english-v3.0': { inputPer1M: 0.10, outputPer1M: 0.0 },

  // --- Perplexity ---
  'sonar': { inputPer1M: 1.0, outputPer1M: 1.0 },
  'sonar-pro': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'sonar-reasoning': { inputPer1M: 1.0, outputPer1M: 5.0 },
  'sonar-reasoning-pro': { inputPer1M: 2.0, outputPer1M: 8.0 },
};

/**
 * Common model alias map to normalize nicknames, shorthands, and legacy IDs
 */
export const MODEL_ALIASES: Record<string, string> = {
  // OpenAI Shorthands & Aliases
  'gpt4': 'gpt-4',
  'gpt4o': 'gpt-4o',
  'gpt-4-preview': 'gpt-4-turbo',
  'gpt-4-0125-preview': 'gpt-4-turbo',
  'gpt-4-1106-preview': 'gpt-4-turbo',
  'gpt-3.5': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-0125': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-1106': 'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k-0613': 'gpt-3.5-turbo-16k',

  // Anthropic Shorthands
  'sonnet': 'claude-3-5-sonnet',
  'sonnet-3.7': 'claude-3-7-sonnet',
  'sonnet-3.5': 'claude-3-5-sonnet',
  'haiku': 'claude-3-5-haiku',
  'haiku-3.5': 'claude-3-5-haiku',
  'opus': 'claude-3-opus',
  'claude-2': 'claude-2.0',
  'claude-instant': 'claude-instant-1.2',

  // DeepSeek Shorthands
  'r1': 'deepseek-r1',
  'v3': 'deepseek-v3',

  // Gemini Shorthands
  'flash': 'gemini-2.0-flash',
  'pro': 'gemini-1.5-pro',

  // Meta / Groq Shorthands
  'llama-3.3-70b': 'llama-3.3-70b-versatile',
  'llama-3.1-70b': 'llama-3.1-70b-versatile',
  'llama-3.1-8b': 'llama-3.1-8b-instant',
  'llama-3-70b': 'llama-3.1-70b-versatile',
  'llama-3-8b': 'llama-3.1-8b-instant',

  // Mistral Shorthands
  'codestral': 'codestral-latest',
  'mistral-large': 'mistral-large-latest',
  'mistral-small': 'mistral-small-latest',
  'magistral': 'magistral-small-latest',
  'magistral-small': 'magistral-small-latest',
  'magistral-medium': 'magistral-medium-latest',
  'mistral-3.5': 'mistral-medium-3-5',
  'mistral-medium-3.5': 'mistral-medium-3-5',
  'gpt-image-2.5': 'gpt-image-2.5-flare',
  'gpt-image-sunburst': 'gpt-image-2.5-sunburst',
  'gpt-image-flare': 'gpt-image-2.5-flare',
};

/**
 * Dynamic in-memory registry allowing runtime custom price registration
 */
const customPricingRegistry: Record<string, ModelPricingRates> = {};

/**
 * Normalize model identifier to match pricing table keys:
 * - Strips AWS Bedrock prefixes (e.g. 'anthropic.claude-3-5-sonnet-20241022-v2:0' -> 'claude-3-5-sonnet')
 * - Strips provider prefixes (e.g. 'openai/gpt-4o' -> 'gpt-4o', 'deepseek/deepseek-r1' -> 'deepseek-r1')
 * - Strips date suffixes (e.g. '-20240307', '-20250219')
 * - Resolves shorthands and aliases
 */
export function normalizeModelKey(rawModel: string): string {
  if (!rawModel) return 'unknown';

  let model = rawModel.toLowerCase().trim();

  // Strip AWS Bedrock model prefix (e.g. 'us.anthropic.claude-3-5-sonnet...', 'meta.llama3-...')
  model = model.replace(/^[a-z0-9_-]+\.(anthropic|meta|amazon|cohere|mistral|ai21)\./i, '');
  model = model.replace(/^(anthropic|meta|amazon|cohere|mistral|ai21)\./i, '');

  // Strip AWS Bedrock version suffix (e.g. '-v1:0', '-v2:0', ':0')
  model = model.replace(/-v\d+(:\d+)?$/, '');
  model = model.replace(/:\d+$/, '');

  // Strip provider prefix if present (e.g. 'openai/gpt-4o' -> 'gpt-4o', 'meta-llama/llama-3.3-70b-instruct' -> 'llama-3.3-70b-instruct')
  if (model.includes('/')) {
    model = model.split('/').slice(1).join('/');
  }

  // Remove trailing version/mode tags (e.g. ':latest', ':free', ':beta')
  model = model.replace(/:(latest|free|beta)$/, '');

  // Remove date suffixes like -20240307 or -20250219 or -2024-08-06
  model = model.replace(/-\d{8}$/, '');
  model = model.replace(/-\d{4}-\d{2}-\d{2}$/, '');

  // Normalize Bedrock Meta format (e.g. llama3-1-70b -> llama-3.1-70b)
  model = model.replace(/llama(\d+)-(\d+)-/g, 'llama-$1.$2-');
  model = model.replace(/llama(\d+)\.(\d+)-/g, 'llama-$1.$2-');

  // Check aliases before fine-tuning
  if (MODEL_ALIASES[model]) {
    return MODEL_ALIASES[model];
  }

  // Remove common modifier suffixes if not directly matching table
  if (!MODEL_PRICING_TABLE[model]) {
    const withoutInstruct = model.replace(/-(instruct|chat|preview)$/, '');
    if (MODEL_PRICING_TABLE[withoutInstruct]) {
      return withoutInstruct;
    }
    if (MODEL_ALIASES[withoutInstruct]) {
      return MODEL_ALIASES[withoutInstruct];
    }
  }

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

  // Check built-in table with normalized key
  if (MODEL_PRICING_TABLE[normalized]) {
    return MODEL_PRICING_TABLE[normalized];
  }
  // Check built-in table with direct key
  if (MODEL_PRICING_TABLE[modelName]) {
    return MODEL_PRICING_TABLE[modelName];
  }

  // Check alias table fallback
  const alias = MODEL_ALIASES[modelName.toLowerCase().trim()];
  if (alias && MODEL_PRICING_TABLE[alias]) {
    return MODEL_PRICING_TABLE[alias];
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
