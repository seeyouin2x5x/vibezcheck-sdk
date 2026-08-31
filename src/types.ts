import type Stripe from 'stripe';

/**
 * Known supported model identifiers with full IDE autocomplete
 */
export type SupportedOpenAIModel =
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'openai/o1'
  | 'openai/o1-mini'
  | 'openai/o3'
  | 'openai/o3-mini'
  | 'openai/gpt-5'
  | 'openai/gpt-5-mini'
  | 'openai/gpt-5.6-sol'
  | 'openai/gpt-5.6-terra'
  | 'openai/gpt-5.6-luna'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'o1'
  | 'o1-mini'
  | 'o3'
  | 'o3-mini'
  | 'gpt-5'
  | 'gpt-5-mini'
  | 'gpt-5.6-sol'
  | 'gpt-5.6-terra'
  | 'gpt-5.6-luna';

export type SupportedAnthropicModel =
  | 'anthropic/claude-3-7-sonnet'
  | 'anthropic/claude-3-5-sonnet'
  | 'anthropic/claude-3-5-haiku'
  | 'anthropic/claude-opus-5'
  | 'anthropic/haiku-4.5'
  | 'claude-3-7-sonnet'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-opus-5'
  | 'haiku-4.5';

export type SupportedGoogleModel =
  | 'google/gemini-2.0-flash'
  | 'google/gemini-1.5-pro'
  | 'google/gemini-3.7-flash'
  | 'google/gemini-3.1-pro'
  | 'gemini-2.0-flash'
  | 'gemini-1.5-pro'
  | 'gemini-3.7-flash'
  | 'gemini-3.1-pro';

export type SupportedDeepSeekModel =
  | 'deepseek/deepseek-chat'
  | 'deepseek/deepseek-reasoner'
  | 'deepseek/deepseek-v4-pro'
  | 'deepseek-chat'
  | 'deepseek-reasoner'
  | 'deepseek-v4-pro';

export type KnownModel =
  | SupportedOpenAIModel
  | SupportedAnthropicModel
  | SupportedGoogleModel
  | SupportedDeepSeekModel;

/**
 * Union of all known model IDs with loose string fallback for custom / future models
 */
export type SupportedModel = KnownModel | (string & {});

/**
 * Detailed token usage breakdown
 */
export interface TokenUsage {
  /** Input/Prompt tokens */
  inputTokens: number;
  /** Total output/completion tokens (including reasoning) */
  outputTokens: number;
  /** Total tokens (input + output) */
  totalTokens: number;
  /** Hidden reasoning / thinking tokens (e.g. o1/o3/GPT-5, Claude 3.7 Thinking, Gemini 3.7 Thoughts) */
  reasoningTokens?: number;
  /** Visible output tokens (outputTokens - reasoningTokens) */
  visibleOutputTokens?: number;
  /** Cached input tokens read from KV cache / prompt cache */
  cachedTokens?: number;
  /** Cache write / creation tokens */
  cacheWriteTokens?: number;
}

/**
 * Calculated inference cost breakdown
 */
export interface InferenceCost {
  /** Cost for standard input prompt tokens in USD */
  inputCostUSD: number;
  /** Cost for output completion tokens in USD */
  outputCostUSD: number;
  /** Cost for reasoning/thinking tokens in USD (if applicable) */
  reasoningCostUSD?: number;
  /** Savings from prompt caching in USD */
  cachedDiscountUSD?: number;
  /** Total computed base inference cost in USD */
  totalUSD: number;
  /** Retail price after developer markup (if markup applied) */
  retailUSD?: number;
  /** Currency (defaults to 'USD') */
  currency: string;
}

/**
 * Full usage event emitted upon completion of an LLM call or stream
 */
export interface UsageEvent {
  /** Unique ID for the event */
  id?: string;
  /** Timestamp ISO string */
  timestamp: string;
  /** Model name (e.g. 'gpt-5.6-sol', 'claude-3-7-sonnet') */
  model: string;
  /** Provider (e.g. 'openai', 'anthropic', 'google', 'mistral', 'groq', 'deepseek', 'generic') */
  provider: string;
  /** Token breakdown */
  usage: TokenUsage;
  /** Computed cost */
  cost: InferenceCost;
  /** Customer ID (Stripe customer ID, internal userId, or anonymous) */
  customerId?: string;
  /** Optional customer email */
  customerEmail?: string;
  /** Custom developer metadata (e.g. userId, orgId, feature, session) */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Customer identification parameter: can be a string ('cus_xxx' or 'user@example.com') or an object
 */
export type CustomerParam =
  | string
  | {
      id?: string;
      userId?: string;
      email?: string;
      name?: string;
      metadata?: Record<string, string>;
    };

/**
 * Event emitted when a circuit breaker budget or token limit is reached
 */
export interface BudgetExceededEvent {
  reason: 'cost_per_call_exceeded' | 'total_budget_exceeded' | 'max_tokens_exceeded';
  limit: number;
  current: number;
  model: string;
  customerId?: string;
  message: string;
}

/**
 * Error thrown when an Agent Circuit Breaker trips
 */
export class VibezCircuitBreakerError extends Error {
  public readonly event: BudgetExceededEvent;

  constructor(event: BudgetExceededEvent) {
    super(event.message);
    this.name = 'VibezCircuitBreakerError';
    this.event = event;
  }
}

/**
 * Circuit Breaker / Budget Guardrail Configuration
 */
export interface CircuitBreakerOptions {
  /** Maximum allowed USD cost for a single generation or stream (e.g. 0.50) */
  maxCostPerCallUSD?: number;
  /** Cumulative budget limit for customer/session in USD (e.g. 5.00) */
  maxBudgetUSD?: number;
  /** Hard ceiling on total tokens per generation (e.g. 10000) */
  maxTokensPerCall?: number;
  /** Callback fired when circuit breaker trips */
  onBudgetExceeded?: (event: BudgetExceededEvent) => void | Promise<void>;
  /** Whether to throw a VibezCircuitBreakerError if limit exceeded (default: false) */
  throwOnBudgetExceeded?: boolean;
}

/**
 * Configuration options for the VibezCheck Meter
 */
export interface MeterOptions extends CircuitBreakerOptions {
  /** Stripe API Key (sk_* or rk_*). If omitted, runs in local telemetry/free mode */
  apiKey?: string;
  /** Existing Stripe SDK instance (optional) */
  stripe?: Stripe;
  /** Default Stripe Meter Event Name (default: 'token-billing-tokens') */
  eventName?: string;
  /** Batching options to optimize Stripe API calls */
  batching?: {
    /** Max events per batch (default: 50) */
    maxBatchSize?: number;
    /** Flush interval in milliseconds (default: 50ms) */
    flushIntervalMs?: number;
  };
  /** Callback fired whenever usage is extracted (works with or without Stripe) */
  onUsage?: (event: UsageEvent) => void | Promise<void>;
  /** Error handler callback */
  onError?: (error: Error, events: UsageEvent[]) => void;
  /** Markup multiplier for retail price calculations (e.g. 1.3 for 30% profit) */
  markupMultiplier?: number;
  /** Enable debug console logging (default: false) */
  debug?: boolean;
}

/**
 * Stream wrap options
 */
export interface StreamWrapOptions extends CircuitBreakerOptions {
  /** Customer identifier or email or object */
  customer?: CustomerParam;
  /** Direct customer ID string */
  customerId?: string;
  /** Model override if not automatically detectable */
  model?: string;
  /** Provider override if not automatically detectable */
  provider?: string;
  /** Custom metadata attached to the usage event */
  metadata?: Record<string, string | number | boolean>;
  /** Custom usage callback for this specific stream */
  onUsage?: (event: UsageEvent) => void | Promise<void>;
}

/**
 * Direct usage recording options
 */
export interface RecordUsageOptions {
  model: string;
  provider?: string;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens?: number;
  cachedTokens?: number;
  customer?: CustomerParam;
  customerId?: string;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Model Pricing Rates (per 1 Million Tokens in USD)
 */
export interface ModelPricingRates {
  inputPer1M: number;
  outputPer1M: number;
  cachedInputPer1M?: number;
  reasoningPer1M?: number;
  cacheWritePer1M?: number;
  currency?: string;
}

/**
 * Aggregated Usage Summary
 */
export interface UsageSummary {
  totalRequests: number;
  totalTokens: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalReasoningTokens: number;
  totalCostUSD: number;
  byModel: Record<
    string,
    {
      requests: number;
      tokens: number;
      costUSD: number;
    }
  >;
}
