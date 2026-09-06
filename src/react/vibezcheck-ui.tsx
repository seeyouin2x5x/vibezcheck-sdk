import React, { useState, useMemo, useEffect } from 'react';
import type { UsageEvent } from '../types';

export interface VibezCheckProps {
  /** Messages array from AI SDK useChat() — automatically aggregates tokens & costs */
  messages?: any[];
  /** Array of raw UsageEvents (if using event-driven telemetry) */
  events?: UsageEvent[];
  /** Target model for local rate calculations (default: 'gpt-4o') */
  model?: string;
  /** Developer profit margin multiplier (default: 1.25 for +25% margin) */
  margin?: number;
  /** Manual total cost override in USD */
  totalCostUSD?: number;
  /** Manual total tokens override */
  totalTokens?: number;
  /** Remaining customer credit balance in USD */
  remainingBalanceUSD?: number;
  /** Screen position (default: 'bottom-center') */
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center';
  /** Color theme (default: 'dark') */
  theme?: 'dark' | 'light' | 'auto';
  /** Force dev mode banner on/off (defaults to auto-detect) */
  devMode?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Callback triggered when user clicks '+ Top Up Credits' */
  onTopUp?: () => void;
  /** Callback fired whenever cost or token counts update */
  onCostUpdate?: (summary: {
    totalCostUSD: number;
    wholesaleUSD: number;
    profitUSD: number;
    totalTokens: number;
    isDevMode: boolean;
  }) => void;
}

// Built-in fallback rate cards per 1M tokens for local Zero-DB Dev Mode
const DEV_RATES: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-7-sonnet': { input: 3.0, output: 15.0 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'deepseek-chat': { input: 0.14, output: 0.28 },
  default: { input: 2.0, output: 8.0 },
};

/**
 * ✦ <VibezCheck /> (from 'vibezcheck/ui' or 'vibezcheck/react')
 *
 * The 1-Line Token Meter & Financial HUD.
 * Works 100% out of the box in local dev mode with ZERO database and ZERO Stripe setup.
 * Computes exact tokens, wholesale provider costs, profit margins, and customer bills.
 */
export function VibezCheck({
  messages,
  events,
  model = 'gpt-4o',
  margin = 1.25,
  totalCostUSD: manualCost,
  totalTokens: manualTokens,
  remainingBalanceUSD,
  position = 'bottom-center',
  theme = 'dark',
  devMode,
  className = '',
  onTopUp,
  onCostUpdate,
}: VibezCheckProps) {
  const [isOpen, setIsOpen] = useState(false);

  const normalizedModel = useMemo(() => {
    const clean = model.toLowerCase().replace(/^(openai|anthropic|google)\//, '');
    return Object.keys(DEV_RATES).find((k) => clean.includes(k)) || 'default';
  }, [model]);

  // Aggregation Engine: Auto-extracts from server telemetry or falls back to Zero-DB token math
  const stats = useMemo(() => {
    let hasServerTelemetry = false;
    let wholesaleUSD = 0;
    let billedUSD = manualCost ?? 0;
    let totalTokens = manualTokens ?? 0;
    let promptTokens = 0;
    let completionTokens = 0;
    let cachedTokens = 0;
    let reasoningTokens = 0;
    let turns = 0;

    // 1. Check explicit raw events
    if (events && events.length > 0) {
      hasServerTelemetry = true;
      for (const ev of events) {
        billedUSD += ev.cost?.retailUSD ?? ev.cost?.billedUSD ?? ev.cost?.totalUSD ?? 0;
        wholesaleUSD += ev.cost?.wholesaleTotalUSD ?? ev.cost?.totalUSD ?? 0;
        totalTokens += ev.usage?.totalTokens ?? 0;
        promptTokens += ev.usage?.inputTokens ?? 0;
        completionTokens += ev.usage?.outputTokens ?? 0;
        cachedTokens += ev.usage?.cachedTokens ?? 0;
        reasoningTokens += ev.usage?.reasoningTokens ?? 0;
        turns++;
      }
    }

    // 2. Scan conversation messages
    if (messages && messages.length > 0) {
      for (const msg of messages) {
        turns++;
        let eventFound: UsageEvent | null = null;

        // Check annotations (AI SDK 4 & 5)
        if (Array.isArray(msg.annotations)) {
          for (const ann of msg.annotations) {
            if (ann && (ann.cost || ann.usage || ann.vibez)) {
              eventFound = ann.vibez || ann;
              break;
            }
          }
        }

        // Check parts (AI SDK 5)
        if (!eventFound && Array.isArray(msg.parts)) {
          for (const part of msg.parts) {
            if (part && (part.type === 'data' || part.type === 'custom') && part.data?.vibez) {
              eventFound = part.data.vibez;
              break;
            }
          }
        }

        if (eventFound) {
          hasServerTelemetry = true;
          billedUSD += eventFound.cost?.retailUSD ?? eventFound.cost?.billedUSD ?? eventFound.cost?.totalUSD ?? 0;
          wholesaleUSD += eventFound.cost?.wholesaleTotalUSD ?? eventFound.cost?.totalUSD ?? 0;
          totalTokens += eventFound.usage?.totalTokens ?? 0;
          promptTokens += eventFound.usage?.inputTokens ?? 0;
          completionTokens += eventFound.usage?.outputTokens ?? 0;
          cachedTokens += eventFound.usage?.cachedTokens ?? 0;
          reasoningTokens += eventFound.usage?.reasoningTokens ?? 0;
        } else {
          // Zero-DB Dev Mode: Extract text content and calculate character-token approximation
          let text = '';
          if (typeof msg.content === 'string') {
            text = msg.content;
          } else if (Array.isArray(msg.parts)) {
            text = msg.parts
              .filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join(' ');
          }

          const estimatedTok = Math.ceil(text.length / 3.8);
          if (msg.role === 'user') {
            promptTokens += estimatedTok;
          } else if (msg.role === 'assistant') {
            completionTokens += estimatedTok;
          } else {
            promptTokens += estimatedTok;
          }
          totalTokens += estimatedTok;
        }
      }

      // If no server annotations found, compute local Dev Mode pricing
      if (!hasServerTelemetry && totalTokens > 0) {
        const rates = DEV_RATES[normalizedModel] || DEV_RATES.default;
        wholesaleUSD = (promptTokens * rates.input + completionTokens * rates.output) / 1_000_000;
        billedUSD = wholesaleUSD * margin;
      }
    }

    const profitUSD = Math.max(0, billedUSD - wholesaleUSD);
    const isDev = devMode !== undefined ? devMode : !hasServerTelemetry;

    return {
      wholesaleUSD,
      billedUSD,
      profitUSD,
      totalTokens,
      promptTokens,
      completionTokens,
      cachedTokens,
      reasoningTokens,
      turns,
      isDevMode: isDev,
    };
  }, [messages, events, manualCost, manualTokens, normalizedModel, margin, devMode]);

  // Fire onCostUpdate callback whenever numbers change
  useEffect(() => {
    if (onCostUpdate) {
      onCostUpdate({
        totalCostUSD: stats.billedUSD,
        wholesaleUSD: stats.wholesaleUSD,
        profitUSD: stats.profitUSD,
        totalTokens: stats.totalTokens,
        isDevMode: stats.isDevMode,
      });
    }
  }, [stats.billedUSD, stats.totalTokens, stats.isDevMode, onCostUpdate]);

  const isDark = theme === 'dark' || theme === 'auto';

  const positionStyles: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
    switch (position) {
      case 'bottom-center':
        return { ...base, bottom: '24px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: '24px', right: '24px' };
      case 'bottom-left':
        return { ...base, bottom: '24px', left: '24px' };
      case 'top-center':
        return { ...base, top: '24px', left: '50%', transform: 'translateX(-50%)' };
      default:
        return { ...base, bottom: '24px', left: '50%', transform: 'translateX(-50%)' };
    }
  }, [position]);

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div style={positionStyles} className={`vibezcheck-ui-root font-sans text-xs select-none ${className}`}>
      {/* Expanded HUD Card */}
      {isOpen && (
        <div
          style={{
            background: isDark ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
          className="mb-3 p-4 rounded-2xl border shadow-2xl w-84 space-y-3.5 transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-2 border-slate-700/50">
            <div className="flex items-center gap-2">
              <span className="text-lime-400 font-bold text-sm">✦</span>
              <span className="font-semibold tracking-wide uppercase text-[11px] text-lime-400">
                VibezCheck Financial Meter
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer transition"
            >
              ✕
            </button>
          </div>

          {/* Dev Mode Banner (Zero Database Guarantee) */}
          {stats.isDevMode ? (
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2 text-[10px] text-amber-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Zero-DB Dev Mode (Simulated Bill)
              </span>
              <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                +{Math.round((margin - 1) * 100)}% Margin
              </span>
            </div>
          ) : (
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2 text-[10px] text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live Stripe Usage Meter Active</span>
            </div>
          )}

          {/* Financial Breakdown (Wholesale vs Billed vs Net Profit) */}
          <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/40 space-y-2 text-[11px]">
            <div className="flex justify-between items-center text-slate-400">
              <span>Provider Cost (Wholesale):</span>
              <span className="font-mono text-slate-300">${stats.wholesaleUSD.toFixed(4)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Your Profit (+{Math.round((margin - 1) * 100)}%):</span>
              <span className="font-mono text-lime-400 font-medium">+${stats.profitUSD.toFixed(4)}</span>
            </div>

            <div className="border-t border-slate-700/60 pt-1.5 flex justify-between items-center font-bold">
              <span className="text-white">Customer Billed Total:</span>
              <span className="font-mono text-lime-400 text-sm">${stats.billedUSD.toFixed(4)}</span>
            </div>
          </div>

          {/* Token Breakdown */}
          <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Prompt Tokens:</span>
              <span className="font-mono text-slate-200">{formatTokens(stats.promptTokens)}</span>
            </div>
            {stats.cachedTokens > 0 && (
              <div className="flex justify-between text-[10px] text-lime-300">
                <span>↳ Cache Savings (85% off):</span>
                <span className="font-mono">-{formatTokens(stats.cachedTokens)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Completion Tokens:</span>
              <span className="font-mono text-slate-200">{formatTokens(stats.completionTokens)}</span>
            </div>
            {stats.reasoningTokens > 0 && (
              <div className="flex justify-between text-[10px] text-purple-300">
                <span>↳ Thinking / Reasoning:</span>
                <span className="font-mono">{formatTokens(stats.reasoningTokens)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-700/50 pt-1 font-semibold text-slate-300">
              <span>Total Tokens:</span>
              <span className="font-mono text-white">{formatTokens(stats.totalTokens)}</span>
            </div>
          </div>

          {/* Balance & Top Up Action */}
          {typeof remainingBalanceUSD === 'number' && (
            <div className="flex justify-between items-center text-[11px] px-1">
              <span className="text-slate-400">Remaining Balance:</span>
              <span
                className={`font-mono font-bold ${
                  remainingBalanceUSD < 1 ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                ${remainingBalanceUSD.toFixed(2)}
              </span>
            </div>
          )}

          {onTopUp && (
            <button
              onClick={onTopUp}
              className="w-full py-2 px-3 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-semibold text-xs transition cursor-pointer shadow-md active:scale-98"
            >
              + Add / Top Up Credits
            </button>
          )}

          {stats.isDevMode && (
            <p className="text-[9px] text-slate-500 text-center leading-tight">
              Zero-DB Dev Mode: Running in local memory without database or Stripe dependencies.
            </p>
          )}
        </div>
      )}

      {/* Floating Bottom Pill */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.90)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          color: isDark ? '#f8fafc' : '#0f172a',
        }}
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
      >
        <span className="text-lime-400 font-bold text-xs animate-pulse">✦</span>
        <span className="font-mono font-semibold text-lime-400 text-xs">
          ${stats.billedUSD.toFixed(4)}
        </span>
        <span className="text-slate-500">•</span>
        <span className="font-mono text-slate-300 text-xs">
          {formatTokens(stats.totalTokens)} tok
        </span>
        {stats.isDevMode && (
          <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 py-0.2 rounded">
            DEV
          </span>
        )}
        <span className="text-[10px] text-slate-400 ml-0.5">{isOpen ? '▼' : '▲'}</span>
      </div>
    </div>
  );
}

export const VibezPill = VibezCheck;
export default VibezCheck;
