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
}

export const VibezReceipt: React.FC<VibezReceiptProps> = ({
  message,
  model = 'ai-model',
  tokens,
  reasoningTokens,
  costUSD,
  latencyMs,
  variant = 'minimal',
  className = '',
}) => {
  // Extract usage/cost data from message annotations or meta if available
  let resolvedTokens = tokens;
  let resolvedReasoning = reasoningTokens;
  let resolvedCost = costUSD;
  let resolvedModel = model;
  let resolvedLatency = latencyMs;

  if (message?.annotations && Array.isArray(message.annotations)) {
    for (const ann of message.annotations) {
      if (ann && typeof ann === 'object') {
        if (ann.type === 'vibezcheck' || ann.usage || ann.cost) {
          resolvedTokens = resolvedTokens ?? ann.usage?.totalTokens;
          resolvedReasoning = resolvedReasoning ?? ann.usage?.reasoningTokens;
          resolvedCost = resolvedCost ?? ann.cost?.totalUSD ?? ann.cost;
          resolvedModel = resolvedModel === 'ai-model' ? (ann.model || resolvedModel) : resolvedModel;
          resolvedLatency = resolvedLatency ?? ann.latencyMs;
        }
      }
    }
  }

  // Format token numbers cleanly (e.g. 1,420 or 12.4k)
  const formatTokens = (num?: number) => {
    if (num === undefined) return null;
    if (num >= 10000) return `${(num / 1000).toFixed(1)}k tokens`;
    return `${num.toLocaleString()} tokens`;
  };

  // Format cost cleanly (e.g. $0.00021)
  const formatCost = (cost?: number) => {
    if (cost === undefined) return null;
    if (cost < 0.0001) return `<$0.0001`;
    if (cost < 0.01) return `$${cost.toFixed(4)}`;
    return `$${cost.toFixed(3)}`;
  };

  // Shorten model identifier (e.g. 'openai/gpt-4o-mini' -> 'gpt-4o-mini')
  const cleanModel = resolvedModel.includes('/') ? resolvedModel.split('/')[1] : resolvedModel;

  return (
    <div
      className={`inline-flex items-center gap-2 py-1 px-2.5 rounded-lg text-[11px] font-mono select-none transition-colors duration-150 ${
        variant === 'pill'
          ? 'bg-slate-900 text-slate-200 border border-slate-800 shadow-xs'
          : variant === 'card'
          ? 'bg-cream-50 text-slate-700 border border-slate-200/80 shadow-2xs'
          : 'bg-slate-50 hover:bg-slate-100/80 text-slate-600 border border-slate-200/70'
      } ${className}`}
    >
      {/* Electric Lime Sparkle Icon */}
      <div className="flex items-center justify-center shrink-0">
        <svg
          className="h-3 w-3 text-lime-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="2.5" fill="#D4FF32" />
        </svg>
      </div>

      {/* Model Name */}
      <span className="font-semibold text-slate-800">{cleanModel}</span>

      {/* Token count */}
      {resolvedTokens !== undefined && (
        <>
          <span className="text-slate-300">•</span>
          <span>{formatTokens(resolvedTokens)}</span>
        </>
      )}

      {/* Reasoning tokens indicator if applicable */}
      {resolvedReasoning !== undefined && resolvedReasoning > 0 && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-stripe-indigo font-medium">{resolvedReasoning} thought tokens</span>
        </>
      )}

      {/* Cost in USD */}
      {resolvedCost !== undefined && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-600 font-semibold">{formatCost(resolvedCost)}</span>
        </>
      )}

      {/* Latency if supplied */}
      {resolvedLatency !== undefined && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400">{resolvedLatency}ms</span>
        </>
      )}

      {/* Verified Badge */}
      <span className="text-slate-300">•</span>
      <span className="text-[10px] text-slate-400 font-sans font-medium">Verified by VibezCheck</span>
    </div>
  );
};
