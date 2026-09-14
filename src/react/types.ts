import type React from 'react';
import type { UsageEvent } from '../types';
import type { ModelUsageDetail, ToolUsageDetail, VibezCheckProps } from './vibezcheck-ui';
import type { VibezReceiptProps } from './receipt';

export type { ModelUsageDetail, ToolUsageDetail, VibezCheckProps, VibezReceiptProps };

/**
 * Options for the reactive useVibez() hook
 */
export interface UseVibezOptions {
  /** Target model for local fallback rate calculations (default: 'gpt-4o') */
  model?: string;
  /** Developer profit margin multiplier (default: 1.25 for +25% margin) */
  margin?: number;
  /** Array of raw UsageEvents (if using event-driven telemetry) */
  events?: UsageEvent[];
  /** Optional tool rate card in USD (e.g. { web_search: 0.01 }) */
  toolCosts?: Record<string, number>;
  /** Manual total cost override in USD */
  totalCostUSD?: number;
  /** Manual total tokens override */
  totalTokens?: number;
}

/**
 * Reactive financial state returned by useVibez(messages)
 */
export interface UseVibezResult {
  /** Total billed cost across all turns in USD */
  totalCostUSD: number;
  /** Total wholesale cost from the AI provider in USD */
  wholesaleUSD: number;
  /** Net profit in USD (totalCostUSD - wholesaleUSD) */
  profitUSD: number;
  /** Computed profit margin percentage (e.g. 25 for +25%) */
  marginPercent: number;
  /** Total tokens accumulated across all turns */
  totalTokens: number;
  /** Total prompt/input tokens accumulated */
  promptTokens: number;
  /** Total completion/output tokens accumulated */
  completionTokens: number;
  /** Total cached input tokens */
  cachedTokens: number;
  /** Total reasoning/thinking tokens */
  reasoningTokens: number;
  /** Multi-model breakdown mapping model names to their usage details */
  byModel: Record<string, ModelUsageDetail>;
  /** Multi-tool breakdown mapping tool names to their usage details */
  byTool: Record<string, ToolUsageDetail>;
  /** Total billed cost for tool calls in USD */
  toolCostUSD: number;
  /** Total number of tool calls executed */
  toolCallCount: number;
  /** Total number of assistant response turns */
  turnCount: number;
  /** Active or primary model detected from the conversation */
  activeModel?: string;
  /** Whether verified server telemetry was received */
  hasServerTelemetry: boolean;
  /** Telemetry metrics from the latest turn */
  latestTurn: {
    model?: string;
    billedUSD: number;
    wholesaleUSD: number;
    tokens: number;
    promptTokens: number;
    completionTokens: number;
  };
}

