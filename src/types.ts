import type Stripe from 'stripe';

/**
 * Known supported model identifiers with full IDE autocomplete
 */
export type SupportedOpenAIModel =
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'openai/gpt-4.5-preview'
  | 'openai/gpt-4.1'
  | 'openai/gpt-4.1-nano'
  | 'openai/gpt-4-turbo'
  | 'openai/gpt-4'
  | 'openai/gpt-3.5-turbo'
  | 'openai/o1'
  | 'openai/o1-mini'
  | 'openai/o3'
  | 'openai/o3-mini'
  | 'openai/gpt-5'
  | 'openai/gpt-5-mini'
  | 'openai/gpt-5.6-sol'
  | 'openai/gpt-5.6-terra'
  | 'openai/gpt-5.6-luna'
  | 'openai/text-embedding-3-small'
  | 'openai/text-embedding-3-large'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4.5-preview'
  | 'gpt-4.5'
  | 'gpt-4.1'
  | 'gpt-4.1-nano'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
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
  | 'anthropic/claude-3-opus'
  | 'anthropic/claude-3-haiku'
  | 'anthropic/claude-2.1'
  | 'anthropic/claude-2.0'
  | 'anthropic/claude-opus-5'
  | 'anthropic/haiku-4.5'
  | 'claude-3-7-sonnet'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-3-opus'
  | 'claude-3-haiku'
  | 'claude-2.1'
  | 'claude-2.0'
  | 'claude-opus-5'
  | 'haiku-4.5';

export type SupportedGoogleModel =
  | 'google/gemini-2.5-pro'
  | 'google/gemini-2.5-flash'
  | 'google/gemini-2.0-flash'
  | 'google/gemini-2.0-flash-lite'
  | 'google/gemini-2.0-pro'
  | 'google/gemini-1.5-pro'
  | 'google/gemini-1.5-flash'
  | 'google/gemini-1.5-flash-8b'
  | 'google/gemini-1.0-pro'
  | 'google/gemini-3.7-flash'
  | 'google/gemini-3.1-pro'
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-flash-lite'
  | 'gemini-2.0-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-flash-8b'
  | 'gemini-1.0-pro'
  | 'gemini-3.7-flash'
  | 'gemini-3.1-pro';

export type SupportedDeepSeekModel =
  | 'deepseek/deepseek-chat'
  | 'deepseek/deepseek-reasoner'
  | 'deepseek/deepseek-v3'
  | 'deepseek/deepseek-r1'
  | 'deepseek/deepseek-v4-pro'
  | 'deepseek-chat'
  | 'deepseek-reasoner'
  | 'deepseek-v3'
  | 'deepseek-r1'
  | 'deepseek-v4-pro';

export type SupportedXAIModel =
  | 'xai/grok-3'
  | 'xai/grok-3-mini'
  | 'xai/grok-2'
  | 'xai/grok-2-vision'
  | 'xai/grok-beta'
  | 'grok-3'
  | 'grok-3-mini'
  | 'grok-2'
  | 'grok-2-vision'
  | 'grok-beta';

export type SupportedMistralModel =
  | 'mistral/mistral-large-latest'
  | 'mistral/codestral-latest'
  | 'mistral/mistral-small-latest'
  | 'mistral/ministral-8b-latest'
  | 'mistral-large-latest'
  | 'codestral-latest'
  | 'mistral-small-latest'
  | 'ministral-8b-latest';

export type SupportedGroqModel =
  | 'groq/llama-3.3-70b-versatile'
  | 'groq/llama-3.1-70b-versatile'
  | 'groq/llama-3.1-8b-instant'
  | 'groq/deepseek-r1-distill-llama-70b'
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'deepseek-r1-distill-llama-70b';

export type SupportedCohereModel =
  | 'cohere/command-r-plus'
  | 'cohere/command-r'
  | 'command-r-plus'
  | 'command-r';

export type KnownModel =
  | SupportedOpenAIModel
  | SupportedAnthropicModel
  | SupportedGoogleModel
  | SupportedDeepSeekModel
  | SupportedXAIModel
  | SupportedMistralModel
  | SupportedGroqModel
  | SupportedCohereModel;

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
  /** Alias for cachedDiscountUSD */
  savingsUSD?: number;
  /** Total computed base inference cost in USD */
  totalUSD: number;
  /** Wholesale provider cost in USD */
  wholesaleTotalUSD?: number;
  /** Alias for wholesaleTotalUSD */
  wholesaleUSD?: number;
  /** Amount billed to customer in USD */
  billedUSD?: number;
  /** Net developer profit in USD */
  profitUSD?: number;
  /** Retail price after developer markup (if markup applied) */
  retailUSD?: number;
  /** Currency (defaults to 'USD') */
  currency: string;
}

/**
 * Structured Customer Information with rich metadata, multi-tenancy & billing attributes
 */
export interface CustomerInfo {
  /** Internal user ID or Stripe customer ID ('cus_xxx', 'usr_123') */
  id?: string;
  /** Explicit user ID */
  userId?: string;
  /** Customer email */
  email?: string;
  /** Customer full name or business display name */
  name?: string;
  /** Phone number */
  phone?: string;
  /** Multi-tenant Organization or Company ID */
  orgId?: string;
  /** Organization / Company name */
  orgName?: string;
  /** Multi-tenant Organization ID alias */
  organizationId?: string;
  /** Team / Workspace identifier */
  teamId?: string;
  /** Workspace identifier alias */
  workspaceId?: string;
  /** User Role within organization (e.g. 'admin', 'member', 'owner') */
  role?: string;
  /** Subscription Plan name (e.g. 'free', 'starter', 'pro', 'enterprise') */
  plan?: string;
  /** Billing Tier (e.g. 'tier_1', 'growth', 'unlimited') */
  tier?: string;
  /** Billing currency (defaults to 'usd') */
  currency?: string;
  /** Current prepaid credit balance in USD */
  balanceUSD?: number;
  /** Flexible custom metadata (key-value attributes) */
  metadata?: Record<string, string | number | boolean | null>;
  /** Arbitrary extra developer fields */
  [key: string]: any;
}

/**
 * Customer identification parameter: can be a string ('cus_xxx' or 'user@example.com') or a rich structured object
 */
export type CustomerParam = string | CustomerInfo;

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
  /** Full customer profile snapshot if provided */
  customer?: CustomerInfo;
  /** Custom developer metadata (e.g. userId, orgId, feature, session) */
  metadata?: Record<string, string | number | boolean>;
}

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
  /** Maximum allowed USD cost for a single generation or stream (default: 0.50) */
  maxCostPerCallUSD?: number;
  /** Cumulative budget limit for customer/session in USD (e.g. 5.00) */
  maxBudgetUSD?: number;
  /** Hard ceiling on total tokens per generation (e.g. 10000) */
  maxTokensPerCall?: number;
  /** Model to gracefully fall back to if budget limit is exceeded instead of hard erroring */
  fallbackModelOnBudget?: string;
  /** Callback fired when circuit breaker trips */
  onBudgetExceeded?: (event: BudgetExceededEvent) => void | Promise<void>;
  /** Whether to throw a VibezCircuitBreakerError if limit exceeded (default: false) */
  throwOnBudgetExceeded?: boolean;
}

/**
 * Pluggable Database / Storage Adapter Interface
 */
export interface DatabaseAdapter {
  name: string;
  save: (event: UsageEvent) => Promise<void> | void;
  getBalance?: (customerId: string) => Promise<number | undefined>;
}

/**
 * Pluggable Payment Provider Interface
 */
export interface PaymentProvider {
  name: string;
  charge?: (costUSD: number, event: UsageEvent) => Promise<void> | void;
  checkBalance?: (customerId: string) => Promise<{ ok: boolean; balanceUSD?: number }>;
}

/**
 * Billing Configuration (Universal Auto-Debit, Postpaid metered invoice vs Prepaid credit wallet, Pluggable Providers)
 */
export interface BillingConfig {
  /** 'postpaid' = Invoiced at month's end; 'prepaid' = Deducted from credit wallet, locks at $0 */
  mode?: 'postpaid' | 'prepaid';
  /** Available prepaid credit balance in USD */
  balanceUSD?: number;
  /** Action when balance is low: 'warn' logs/sends event, 'throw' throws CreditExhaustedError */
  onLowBalance?: 'warn' | 'throw';
  /** Payment Provider Gateway (default: 'stripe') */
  provider?: 'stripe' | 'polar' | 'lemonsqueezy' | 'paystack' | PaymentProvider;
  /** Custom charge handler for internal credit wallets / bespoke payment logic */
  charge?: (costUSD: number, event: UsageEvent) => Promise<void> | void;
}

/**
 * Profit Pricing & Markup Configuration
 */
export interface PricingConfig {
  /** Profit margin multiplier (e.g. 1.5 = Cost + 50% profit margin automatically added) */
  margin?: number;
  /** Minimum charge in USD for any single call (e.g. 0.01 = at least 1 cent) */
  minimumChargeUSD?: number;
}

/**
 * Inline Rate Card Configuration for 1-line custom/newly released model pricing
 */
export interface InlineRateConfig {
  /** Input tokens price per 1 Million tokens in USD */
  in: number;
  /** Output tokens price per 1 Million tokens in USD */
  out?: number;
  output?: number;
  /** Reasoning/thinking tokens price per 1 Million tokens in USD (optional) */
  reasoning?: number;
  /** Cached input tokens price per 1 Million tokens in USD (optional) */
  cached?: number;
}

/**
 * Non-LLM Tool execution metering options
 */
export interface ToolMeterOptions {
  /** Fixed cost in USD for this tool execution (e.g. 0.01 for search, 0.04 for image) */
  costUSD: number;
  /** Customer identifier to attribute tool cost to */
  customer?: CustomerParam;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
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
  /** Pricing options including profit margin and minimum charge */
  pricing?: PricingConfig;
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
  /** Billing mode configuration (postpaid vs prepaid) */
  billing?: BillingConfig;
  /** Profit margin & minimum charge configuration */
  pricing?: PricingConfig;
  /** 1-line inline pricing rate card */
  rate?: InlineRateConfig;
  /** Whether to capture tokens if the client aborts or closes tab mid-stream (default: true) */
  captureOnAbort?: boolean;
  /** Execution runtime environment (default: 'auto') */
  runtime?: 'auto' | 'serverless' | 'edge' | 'node';
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
