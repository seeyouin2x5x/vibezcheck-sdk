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
  /** Color theme (default: 'auto') */
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
  'claude-opus': { input: 15.0, output: 75.0 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'deepseek-chat': { input: 0.14, output: 0.28 },
  default: { input: 2.0, output: 8.0 },
};

/**
 * ✦ <VibezCheck /> (from 'vibezcheck/ui' or 'vibezcheck/react')
 *
 * The 1-Line Financial Meter HUD & Floating Badge.
 * Works 100% out of the box in local dev mode with ZERO database and ZERO Stripe setup.
 * Dynamically adapts to Light and Dark mode, with clean typography and zero odd colors.
 */
export function VibezCheck({
  messages,
  events,
  model = 'gpt-4o',
  margin = 1.25,
  totalCostUSD: manualCost,
  totalTokens: manualTokens,
  remainingBalanceUSD,
  position = 'bottom-left',
  theme = 'auto',
  devMode,
  className = '',
  onTopUp,
  onCostUpdate,
}: VibezCheckProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkDoc, setIsDarkDoc] = useState(false);

  // Dynamic Theme Observer: Reacts to dark/light toggle immediately
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const checkTheme = () => {
      setIsDarkDoc(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'class') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const isDark = theme === 'dark' ? true : theme === 'light' ? false : isDarkDoc;

  const normalizedModel = useMemo(() => {
    const clean = model.toLowerCase().replace(/^(openai|anthropic|google)\//, '');
    return Object.keys(DEV_RATES).find((k) => clean.includes(k)) || 'default';
  }, [model]);

  // Aggregation Engine
  const stats = useMemo(() => {
    let hasServerTelemetry = false;
    let wholesaleUSD = 0;
    let billedUSD = manualCost ?? 0;
    let totalTokens = manualTokens ?? 0;
    let promptTokens = 0;
    let completionTokens = 0;
    let cachedTokens = 0;
    let reasoningTokens = 0;

    if (events && events.length > 0) {
      hasServerTelemetry = true;
      for (const ev of events) {
        billedUSD += ev.cost?.billedUSD ?? 0;
        wholesaleUSD += ev.cost?.wholesaleTotalUSD ?? ev.cost?.billedUSD ?? 0;
        totalTokens += ev.usage?.totalTokens ?? 0;
        promptTokens += ev.usage?.inputTokens ?? 0;
        completionTokens += ev.usage?.outputTokens ?? 0;
        cachedTokens += ev.usage?.cachedTokens ?? 0;
        reasoningTokens += ev.usage?.reasoningTokens ?? 0;
      }
    }

    if (messages && messages.length > 0) {
      for (const msg of messages) {
        let eventFound: UsageEvent | null = null;

        if (Array.isArray(msg.annotations)) {
          for (const ann of msg.annotations) {
            if (ann && (ann.cost || ann.usage || ann.vibez)) {
              eventFound = ann.vibez || ann;
              break;
            }
          }
        }

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
          billedUSD += eventFound.cost?.billedUSD ?? 0;
          wholesaleUSD += eventFound.cost?.wholesaleTotalUSD ?? eventFound.cost?.billedUSD ?? 0;
          totalTokens += eventFound.usage?.totalTokens ?? 0;
          promptTokens += eventFound.usage?.inputTokens ?? 0;
          completionTokens += eventFound.usage?.outputTokens ?? 0;
          cachedTokens += eventFound.usage?.cachedTokens ?? 0;
          reasoningTokens += eventFound.usage?.reasoningTokens ?? 0;
        } else {
          let text = '';
          if (typeof msg.content === 'string') {
            text = msg.content;
          } else if (Array.isArray(msg.parts)) {
            text = msg.parts
              .filter((p: any) => p.type === 'text')
              .map((p: any) => p.text)
              .join(' ');
          }

          if (text) {
            const charCount = text.length;
            const approxTokens = Math.max(1, Math.ceil(charCount / 3.8));
            if (msg.role === 'user') {
              promptTokens += approxTokens;
            } else {
              completionTokens += approxTokens;
            }
            totalTokens += approxTokens;
          }
        }
      }

      if (!hasServerTelemetry && (promptTokens > 0 || completionTokens > 0)) {
        const rates = DEV_RATES[normalizedModel] || DEV_RATES.default;
        wholesaleUSD =
          (promptTokens / 1_000_000) * rates.input +
          (completionTokens / 1_000_000) * rates.output;
        billedUSD = wholesaleUSD * margin;
      }
    }

    const profitUSD = Math.max(0, billedUSD - wholesaleUSD);
    const isDevMode = devMode !== undefined ? devMode : !hasServerTelemetry;

    return {
      wholesaleUSD,
      billedUSD,
      profitUSD,
      totalTokens,
      promptTokens,
      completionTokens,
      cachedTokens,
      reasoningTokens,
      isDevMode,
    };
  }, [events, messages, manualCost, manualTokens, normalizedModel, margin, devMode]);

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

  const positionStyles: React.CSSProperties = useMemo(() => {
    const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
    switch (position) {
      case 'bottom-center':
        return { ...base, bottom: '20px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-center':
        return { ...base, top: '20px', left: '50%', transform: 'translateX(-50%)' };
      default:
        return { ...base, bottom: '20px', left: '20px' };
    }
  }, [position]);

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div style={positionStyles} className={`vibezcheck-ui-root vibezcheck-root font-sans select-none ${className}`}>
      {/* Attached Popover Card */}
      {isOpen && (
        <div
          className={`mb-2.5 p-4 rounded-xl border shadow-2xl w-[320px] space-y-3 transition-all animate-in fade-in slide-in-from-bottom-2 ${
            isDark
              ? 'bg-zinc-900/98 border-zinc-800 text-zinc-100 shadow-zinc-950/60'
              : 'bg-white/98 border-zinc-200 text-zinc-900 shadow-zinc-900/10'
          }`}
          style={{ backdropFilter: 'blur(16px)' }}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-zinc-800' : 'border-zinc-100'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs">✦</span>
              <span className="font-semibold text-xs tracking-tight">VibezCheck</span>
              <span
                className={`text-[9.5px] font-mono px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}
              >
                Financial Meter
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`text-xs p-1 rounded transition ${
                isDark
                  ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100'
              }`}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Customer Billed Hero Card */}
          <div
            className={`rounded-lg p-3 space-y-2 border ${
              isDark
                ? 'bg-zinc-800/40 border-zinc-800/90'
                : 'bg-zinc-50/90 border-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] uppercase font-semibold tracking-wider ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                Customer Billed Total
              </span>
              <span
                className={`text-[9.5px] font-mono font-medium px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                }`}
              >
                +{Math.round((margin - 1) * 100)}% Margin
              </span>
            </div>

            <div
              className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              ${stats.billedUSD.toFixed(4)}
            </div>

            <div
              className={`grid grid-cols-2 gap-2 pt-1 border-t text-xs ${
                isDark ? 'border-zinc-800' : 'border-zinc-200/60'
              }`}
            >
              <div>
                <span className={`block text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Provider Wholesale:
                </span>
                <span className={`font-mono text-[11px] ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  ${stats.wholesaleUSD.toFixed(4)}
                </span>
              </div>
              <div className="text-right">
                <span className={`block text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Net Profit:
                </span>
                <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  +${stats.profitUSD.toFixed(4)}
                </span>
              </div>
            </div>
          </div>

          {/* Token Breakdown Card */}
          <div
            className={`rounded-lg p-3 space-y-1.5 text-xs border ${
              isDark
                ? 'bg-zinc-800/20 border-zinc-800/80'
                : 'bg-zinc-50/50 border-zinc-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Prompt Tokens:</span>
              <span className={`font-mono tabular-nums ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {formatTokens(stats.promptTokens)}
              </span>
            </div>
            {stats.cachedTokens > 0 && (
              <div className="flex justify-between items-center text-[10.5px] text-emerald-600 dark:text-emerald-400">
                <span>↳ Cache Savings (85% off):</span>
                <span className="font-mono tabular-nums">-{formatTokens(stats.cachedTokens)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Completion Tokens:</span>
              <span className={`font-mono tabular-nums ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {formatTokens(stats.completionTokens)}
              </span>
            </div>
            {stats.reasoningTokens > 0 && (
              <div className="flex justify-between items-center text-[10.5px] text-zinc-500 dark:text-zinc-400">
                <span>↳ Reasoning / Thinking:</span>
                <span className="font-mono tabular-nums">{formatTokens(stats.reasoningTokens)}</span>
              </div>
            )}
            <div
              className={`flex justify-between items-center pt-1.5 border-t font-semibold ${
                isDark ? 'border-zinc-800 text-zinc-100' : 'border-zinc-200/60 text-zinc-900'
              }`}
            >
              <span>Total Tokens:</span>
              <span className="font-mono tabular-nums">{formatTokens(stats.totalTokens)}</span>
            </div>
          </div>

          {/* Remaining Balance & Top Up Action */}
          {typeof remainingBalanceUSD === 'number' && (
            <div className="flex justify-between items-center text-xs px-1">
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>Remaining Balance:</span>
              <span
                className={`font-mono font-semibold tabular-nums ${
                  remainingBalanceUSD < 1 ? 'text-amber-500' : isDark ? 'text-zinc-200' : 'text-zinc-800'
                }`}
              >
                ${remainingBalanceUSD.toFixed(2)}
              </span>
            </div>
          )}

          {onTopUp && (
            <button
              onClick={onTopUp}
              className={`w-full py-1.5 px-3 rounded-lg font-medium text-xs transition cursor-pointer shadow-sm active:scale-98 ${
                isDark
                  ? 'bg-zinc-100 hover:bg-white text-zinc-900'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              + Add / Top Up Credits
            </button>
          )}

          {/* Environment Footer */}
          <div className="flex items-center gap-2 pt-0.5 text-[10px]">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>
              {stats.isDevMode
                ? 'Zero-DB Dev Mode · Running in local memory'
                : 'Live Stripe Usage Meter Active'}
            </span>
          </div>
        </div>
      )}

      {/* Floating Bottom Pill */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-lg cursor-pointer transition-all select-none hover:scale-[1.02] active:scale-[0.98] ${
          isDark
            ? 'bg-zinc-900/95 hover:bg-zinc-850 text-zinc-100 border-zinc-800 shadow-zinc-950/40 hover:border-zinc-700'
            : 'bg-white/95 hover:bg-zinc-50 text-zinc-900 border-zinc-200 shadow-zinc-900/5 hover:border-zinc-300'
        }`}
        style={{ backdropFilter: 'blur(12px)' }}
        title="Click to open VibezCheck Financial Meter"
      >
        <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs shrink-0">✦</span>
        <span
          className={`font-mono font-medium text-xs tabular-nums ${
            isDark ? 'text-zinc-100' : 'text-zinc-900'
          }`}
        >
          ${stats.billedUSD.toFixed(4)}
        </span>
        <span className={isDark ? 'text-zinc-700' : 'text-zinc-300'}>·</span>
        <span
          className={`font-mono text-xs tabular-nums ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          {formatTokens(stats.totalTokens)} tok
        </span>
        {stats.isDevMode && (
          <span
            className={`text-[9px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.2 rounded border ${
              isDark
                ? 'bg-zinc-800 text-zinc-400 border-zinc-700/60'
                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
            }`}
          >
            DEV
          </span>
        )}
        <svg
          className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ml-0.5 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

export const VibezPill = VibezCheck;
export default VibezCheck;
