'use client';

import React from 'react';

export interface VibezReceiptProps {
  /** Chat message object from Vercel AI SDK or custom chat state */
  message?: {
    id?: string;
    role?: string;
    content?: string;
    annotations?: any[];
    [key: string]: any;
  };
  /** Explicit model name override */
  model?: string;
  /** Explicit total tokens override */
  tokens?: number;
  /** Explicit reasoning tokens override */
  reasoningTokens?: number;
  /** Explicit cost in USD override */
  costUSD?: number;
  /** Latency in milliseconds */
  latencyMs?: number;
  /** Style variant */
  variant?: 'minimal' | 'pill' | 'card';
  /** Custom CSS class names */
  className?: string;
  /** Hide model slug for ultra-compact card layouts */
  compact?: boolean;
}

/**
 * Normalizes verbose model identifiers into clean, human-readable slugs.
 * E.g. "anthropic('claude-opus-4.8')" -> "claude-opus"
 * "openai('gpt-4o-mini')" -> "gpt-4o-mini"
 */
function cleanModelName(raw?: string): string | undefined {
  if (!raw || raw === 'ai-model') return undefined;
  const match = raw.match(/\(['"]?([^'"]+)['"]?\)/);
  let name = match ? match[1] : raw;
  name = name.replace(/^(openai|anthropic|google|xai|elevenlabs|deepseek|luma)\//, '');
  return name;
}

export const VibezReceipt: React.FC<VibezReceiptProps> = ({
  message,
  model,
  tokens,
  reasoningTokens,
  costUSD,
  latencyMs,
  variant = 'pill',
  className = '',
  compact = false,
}) => {
  let resolvedTokens = tokens;
  let resolvedReasoning = reasoningTokens;
  let resolvedCost = costUSD;
  let resolvedModel = model;
  let resolvedLatency = latencyMs;

  if (message?.annotations && Array.isArray(message.annotations)) {
    for (const ann of message.annotations) {
      if (ann && typeof ann === 'object') {
        if (ann.type === 'vibezcheck' || ann.usage || ann.cost || ann.tokens || ann.costUSD) {
          resolvedTokens = resolvedTokens ?? ann.usage?.totalTokens ?? ann.tokens;
          resolvedReasoning = resolvedReasoning ?? ann.usage?.reasoningTokens ?? ann.reasoningTokens;
          resolvedCost = resolvedCost ?? ann.cost?.totalUSD ?? ann.costUSD ?? (typeof ann.cost === 'number' ? ann.cost : undefined);
          resolvedModel = resolvedModel ?? ann.model;
          resolvedLatency = resolvedLatency ?? ann.latencyMs;
        }
      }
    }
  }

  // Fallback token estimation from content length
  if (resolvedTokens === undefined && typeof message?.content === 'string') {
    resolvedTokens = Math.max(1, Math.ceil(message.content.length / 3.8));
  }

  if (resolvedTokens === undefined && resolvedCost === undefined) {
    return null;
  }

  const formatCost = (cost?: number) => {
    if (cost === undefined) return null;
    if (cost < 0.0001) return `<$0.0001`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(3)}`;
  };

  const shortModel = cleanModelName(resolvedModel);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10.5px] select-none transition-colors border max-w-full truncate bg-zinc-100/90 hover:bg-zinc-100 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/70 ${className}`}
      title={
        resolvedModel
          ? `Verified by VibezCheck | Model: ${resolvedModel} | ${resolvedTokens ?? 0} tokens`
          : 'Verified by VibezCheck'
      }
    >
      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0">✦</span>
      {resolvedCost !== undefined && (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {formatCost(resolvedCost)}
        </span>
      )}
      {resolvedCost !== undefined && resolvedTokens !== undefined && (
        <span className="text-zinc-300 dark:text-zinc-600 shrink-0">·</span>
      )}
      {resolvedTokens !== undefined && (
        <span className="text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
          {resolvedTokens.toLocaleString()} tok
        </span>
      )}
      {!compact && shortModel && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600 shrink-0">·</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] truncate max-w-[85px]">
            {shortModel}
          </span>
        </>
      )}
      {resolvedLatency !== undefined && resolvedLatency > 0 && !compact && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600 shrink-0">·</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] shrink-0">
            {resolvedLatency}ms
          </span>
        </>
      )}
    </div>
  );
};

export default VibezReceipt;
