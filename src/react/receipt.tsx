'use client';

import React from 'react';

export interface VibezReceiptProps {
  /** Chat message object from Vercel AI SDK (v4, v5, v6, v7) or custom chat state */
  message?: {
    id?: string;
    role?: string;
    content?: string;
    annotations?: any[];
    parts?: any[];
    metadata?: any;
    providerMetadata?: any;
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
  /** Custom inline styles */
  style?: React.CSSProperties;
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
  name = name.replace(/^(openai|anthropic|google|xai|elevenlabs|deepseek|luma|mistral|groq)\//, '');
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
  style,
  compact = false,
}) => {
  let resolvedTokens = tokens;
  let resolvedReasoning = reasoningTokens;
  let resolvedCost = costUSD;
  let resolvedModel = model;
  let resolvedLatency = latencyMs;

  const inspectItem = (item: any) => {
    if (!item || typeof item !== 'object') return;
    const target =
      item.vibez ||
      (item.type === 'vibezcheck' || item.type === 'data-vibezcheck'
        ? item
        : item.cost || item.usage || item.tokens || item.costUSD
        ? item
        : null);

    if (!target) return;

    if (resolvedTokens === undefined) {
      resolvedTokens = target.usage?.totalTokens ?? target.totalTokens ?? target.tokens;
    }
    if (resolvedReasoning === undefined) {
      resolvedReasoning = target.usage?.reasoningTokens ?? target.reasoningTokens;
    }
    if (resolvedCost === undefined) {
      const c = target.cost;
      if (typeof c === 'number') {
        resolvedCost = c;
      } else if (c && typeof c === 'object') {
        resolvedCost = c.billedUSD ?? c.totalUSD ?? c.costUSD;
      } else if (typeof target.costUSD === 'number') {
        resolvedCost = target.costUSD;
      }
    }
    if (resolvedModel === undefined) {
      resolvedModel = target.model;
    }
    if (resolvedLatency === undefined) {
      resolvedLatency = target.latencyMs;
    }
  };

  let toolCallCount = 0;
  const toolCallNames: string[] = [];

  // 1. AI SDK v4 Message Annotations
  if (message?.annotations && Array.isArray(message.annotations)) {
    for (const ann of message.annotations) {
      inspectItem(ann);
    }
  }

  // 2. AI SDK v5/v6/v7 Message Parts (data-vibezcheck, data, custom, providerMetadata, tool-call)
  if (message?.parts && Array.isArray(message.parts)) {
    for (const part of message.parts) {
      if (part?.type === 'tool-call' || part?.type === 'tool-invocation') {
        toolCallCount++;
        const toolName = part.toolName || part.toolInvocation?.toolName;
        if (toolName && !toolCallNames.includes(toolName)) {
          toolCallNames.push(toolName);
        }
      } else if (part?.type === 'data-vibezcheck' && part.data) {
        inspectItem(part.data);
      } else if ((part?.type === 'data' || part?.type === 'custom') && part.data) {
        inspectItem(part.data);
      } else if (part?.providerMetadata?.vibezcheck) {
        inspectItem(part.providerMetadata.vibezcheck);
      }
    }
  }

  // 3. AI SDK v5/v6/v7 Message Metadata
  if (message?.metadata?.vibezcheck) {
    inspectItem(message.metadata.vibezcheck);
  } else if (message?.metadata && (message.metadata.cost || message.metadata.usage)) {
    inspectItem(message.metadata);
  }

  // 4. Message Direct Provider Metadata
  if (message?.providerMetadata?.vibezcheck) {
    inspectItem(message.providerMetadata.vibezcheck);
  }

  // Fallback token estimation from content text or text parts
  if (resolvedTokens === undefined) {
    let text = '';
    if (typeof message?.content === 'string') {
      text = message.content;
    } else if (Array.isArray(message?.parts)) {
      text = message.parts
        .filter((p: any) => p?.type === 'text' && typeof p.text === 'string')
        .map((p: any) => p.text)
        .join(' ');
    }
    if (text) {
      resolvedTokens = Math.max(1, Math.ceil(text.length / 3.8));
    }
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

  // Standalone inline CSS fallback guarantees crisp rendering with or without Tailwind
  const fallbackStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '0.375rem',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    fontSize: '10.5px',
    lineHeight: '1.2',
    userSelect: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    maxWidth: '100%',
    verticalAlign: 'middle',
    ...style,
  };

  return (
    <div
      className={`vibez-receipt inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10.5px] select-none transition-colors border max-w-full truncate bg-zinc-100/90 hover:bg-zinc-100 text-zinc-700 border-zinc-200/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700/70 ${className}`}
      style={fallbackStyle}
      title={
        resolvedModel
          ? `Verified by VibezCheck | Model: ${resolvedModel} | ${resolvedTokens ?? 0} tokens`
          : 'Verified by VibezCheck'
      }
    >
      <span
        className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] shrink-0"
        style={{ color: '#059669', fontWeight: 'bold' }}
      >
        ✦
      </span>
      {resolvedCost !== undefined && (
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
          {formatCost(resolvedCost)}
        </span>
      )}
      {resolvedCost !== undefined && resolvedTokens !== undefined && (
        <span className="text-zinc-300 dark:text-zinc-600 shrink-0 opacity-60">·</span>
      )}
      {resolvedTokens !== undefined && (
        <span className="text-zinc-500 dark:text-zinc-400 tabular-nums shrink-0">
          {resolvedTokens.toLocaleString()} tok
        </span>
      )}
      {!compact && shortModel && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600 shrink-0 opacity-60">·</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] truncate max-w-[95px]">
            {shortModel}
          </span>
        </>
      )}
      {toolCallCount > 0 && !compact && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600 shrink-0 opacity-60">·</span>
          <span
            className="text-amber-600 dark:text-amber-400 text-[10px] shrink-0"
            title={toolCallNames.length > 0 ? `Tools: ${toolCallNames.join(', ')}` : undefined}
          >
            {`${toolCallCount} ${toolCallCount === 1 ? 'tool' : 'tools'}`}
          </span>
        </>
      )}
      {resolvedLatency !== undefined && resolvedLatency > 0 && !compact && (
        <>
          <span className="text-zinc-300 dark:text-zinc-600 shrink-0 opacity-60">·</span>
          <span className="text-zinc-400 dark:text-zinc-500 text-[10px] shrink-0">
            {resolvedLatency}ms
          </span>
        </>
      )}
    </div>
  );
};

export default VibezReceipt;
