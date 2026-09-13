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
  /**
   * Whether to display developer wholesale API costs.
   * Default: false (hidden from end-users)
   */
  showWholesale?: boolean;
  /**
   * Whether to display developer profit margin percentage and net profit.
   * Default: false (hidden from end-users)
   */
  showMargin?: boolean;
  /** Manual total cost override in USD */
  totalCostUSD?: number;
  /** Manual total tokens override */
  totalTokens?: number;
  /** Remaining customer credit balance in USD */
  remainingBalanceUSD?: number;
  /** Screen position (default: 'bottom-left') */
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  /** Color theme (default: 'auto') */
  theme?: 'dark' | 'light' | 'auto';
  /** Force dev mode banner on/off (defaults to auto-detect) */
  devMode?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Custom header title (default: 'Session Usage') */
  title?: string;
  /** Callback triggered when user clicks 'Top Up' button or preset amount pills */
  onTopUp?: (amount?: number) => void;
  /** Callback fired whenever cost or token counts update */
  onCostUpdate?: (summary: {
    totalCostUSD: number;
    wholesaleUSD: number;
    profitUSD: number;
    totalTokens: number;
    isDevMode: boolean;
  }) => void;
  /** Whether popover is initially open (default: false) */
  defaultOpen?: boolean;
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

function cleanModelName(raw?: string): string | undefined {
  if (!raw || raw === 'ai-model' || raw === 'default') return undefined;
  const match = raw.match(/\(['"]?([^'"]+)['"]?\)/);
  let name = match ? match[1] : raw;
  name = name.replace(/^(openai|anthropic|google|xai|elevenlabs|deepseek|luma|mistral|groq)\//, '');
  return name;
}

/**
 * ✦ <VibezCheck /> (from 'vibezcheck/ui' or 'vibezcheck/react')
 *
 * An ultra-modern, interactive fintech AI financial HUD inspired by Aztec Web3 design.
 * Features:
 * - Huge hero typography with interactive USD ⇄ Token unit toggle (⇅)
 * - Segmented Session ⇄ Latest Turn pill switcher
 * - Interactive preset pills ([$5] [$10] [$25] [Max])
 * - Hidden wholesale pricing and margin by default (controlled via showWholesale & showMargin props)
 * - Soft creamy ivory card with rounded-3xl corners and vibrant orchid action buttons
 */
export function VibezCheck({
  messages,
  events,
  model = 'gpt-4o',
  margin = 1.25,
  showWholesale = false,
  showMargin = false,
  totalCostUSD: manualCost,
  totalTokens: manualTokens,
  remainingBalanceUSD,
  position = 'bottom-left',
  theme = 'auto',
  devMode,
  className = '',
  title = 'Session Usage',
  onTopUp,
  onCostUpdate,
  defaultOpen,
}: VibezCheckProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? false);
  const [isDarkDoc, setIsDarkDoc] = useState(false);

  // Interactive UI states
  const [heroUnit, setHeroUnit] = useState<'usd' | 'tokens'>('usd');
  const [activeTab, setActiveTab] = useState<'session' | 'turn'>('session');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(true);

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
    let detectedModel: string | undefined = undefined;

    // Latest turn specific telemetry
    let latestBilledUSD = 0;
    let latestWholesaleUSD = 0;
    let latestTokens = 0;
    let latestPromptTokens = 0;
    let latestCompletionTokens = 0;

    if (events && events.length > 0) {
      hasServerTelemetry = true;
      for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const evBilled = ev.cost?.billedUSD ?? ev.cost?.totalUSD ?? 0;
        const evWholesale = ev.cost?.wholesaleTotalUSD ?? ev.cost?.wholesaleUSD ?? ev.cost?.billedUSD ?? 0;
        const evTokens = ev.usage?.totalTokens ?? 0;
        const evPrompt = ev.usage?.inputTokens ?? 0;
        const evComp = ev.usage?.outputTokens ?? 0;

        billedUSD += evBilled;
        wholesaleUSD += evWholesale;
        totalTokens += evTokens;
        promptTokens += evPrompt;
        completionTokens += evComp;
        cachedTokens += ev.usage?.cachedTokens ?? 0;
        reasoningTokens += ev.usage?.reasoningTokens ?? 0;

        if (ev.model && !detectedModel) {
          detectedModel = ev.model;
        }

        if (i === events.length - 1) {
          latestBilledUSD = evBilled;
          latestWholesaleUSD = evWholesale;
          latestTokens = evTokens;
          latestPromptTokens = evPrompt;
          latestCompletionTokens = evComp;
        }
      }
    }

    if (messages && messages.length > 0) {
      for (let mIdx = 0; mIdx < messages.length; mIdx++) {
        const msg = messages[mIdx];
        let eventFound: any = null;

        // 1. AI SDK v4 Message Annotations
        if (Array.isArray(msg.annotations)) {
          for (const ann of msg.annotations) {
            if (ann && (ann.cost || ann.usage || ann.vibez || ann.type === 'vibezcheck')) {
              eventFound = ann.vibez || ann;
              break;
            }
          }
        }

        // 2. AI SDK v5/v6/v7 Message Parts
        if (!eventFound && Array.isArray(msg.parts)) {
          for (const part of msg.parts) {
            if (part?.type === 'data-vibezcheck' && part.data) {
              eventFound = part.data;
              break;
            } else if ((part?.type === 'data' || part?.type === 'custom') && (part.data?.vibez || part.data?.cost || part.data?.usage)) {
              eventFound = part.data.vibez || part.data;
              break;
            } else if (part?.providerMetadata?.vibezcheck) {
              eventFound = part.providerMetadata.vibezcheck;
              break;
            }
          }
        }

        // 3. AI SDK v5/v6/v7 Message Metadata
        if (!eventFound && msg.metadata?.vibezcheck) {
          eventFound = msg.metadata.vibezcheck;
        } else if (!eventFound && msg.metadata && (msg.metadata.cost || msg.metadata.usage)) {
          eventFound = msg.metadata;
        }

        // 4. Direct Provider Metadata
        if (!eventFound && msg.providerMetadata?.vibezcheck) {
          eventFound = msg.providerMetadata.vibezcheck;
        }

        if (eventFound) {
          hasServerTelemetry = true;
          const costVal = eventFound.cost;
          let msgBilled = 0;
          let msgWholesale = 0;
          if (typeof costVal === 'number') {
            msgBilled = costVal;
            msgWholesale = costVal;
          } else if (costVal && typeof costVal === 'object') {
            msgBilled = costVal.billedUSD ?? costVal.totalUSD ?? costVal.costUSD ?? 0;
            msgWholesale = costVal.wholesaleUSD ?? costVal.wholesaleTotalUSD ?? costVal.billedUSD ?? costVal.totalUSD ?? 0;
          } else if (typeof eventFound.costUSD === 'number') {
            msgBilled = eventFound.costUSD;
            msgWholesale = eventFound.costUSD;
          }

          const msgTok = eventFound.usage?.totalTokens ?? eventFound.tokens ?? 0;
          const msgPrompt = eventFound.usage?.inputTokens ?? eventFound.promptTokens ?? 0;
          const msgComp = eventFound.usage?.outputTokens ?? eventFound.completionTokens ?? 0;

          billedUSD += msgBilled;
          wholesaleUSD += msgWholesale;
          totalTokens += msgTok;
          promptTokens += msgPrompt;
          completionTokens += msgComp;
          cachedTokens += eventFound.usage?.cachedTokens ?? 0;
          reasoningTokens += eventFound.usage?.reasoningTokens ?? 0;

          if (eventFound.model && !detectedModel) {
            detectedModel = eventFound.model;
          }

          if (msg.role === 'assistant') {
            latestBilledUSD = msgBilled;
            latestWholesaleUSD = msgWholesale;
            latestTokens = msgTok;
            latestPromptTokens = msgPrompt;
            latestCompletionTokens = msgComp;
          }
        } else {
          let text = '';
          if (typeof msg.content === 'string') {
            text = msg.content;
          } else if (Array.isArray(msg.parts)) {
            text = msg.parts
              .filter((p: any) => p?.type === 'text' && typeof p.text === 'string')
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
              latestCompletionTokens = approxTokens;
              latestTokens = approxTokens;
            }
            totalTokens += approxTokens;
          }
        }
      }

      if (!hasServerTelemetry && (promptTokens > 0 || completionTokens > 0)) {
        const activeModel = detectedModel || model || 'gpt-4o';
        const clean = activeModel.toLowerCase().replace(/^(openai|anthropic|google|xai|deepseek|mistral|groq)\//, '');
        const rateKey = Object.keys(DEV_RATES).find((k) => clean.includes(k)) || 'default';
        const rates = DEV_RATES[rateKey] || DEV_RATES.default;
        wholesaleUSD =
          (promptTokens / 1_000_000) * rates.input +
          (completionTokens / 1_000_000) * rates.output;
        billedUSD = wholesaleUSD * margin;

        latestWholesaleUSD = (latestCompletionTokens / 1_000_000) * rates.output;
        latestBilledUSD = latestWholesaleUSD * margin;
      }
    }

    const profitUSD = Math.max(0, billedUSD - wholesaleUSD);
    const isDevMode = devMode !== undefined ? devMode : !hasServerTelemetry;

    let derivedMargin: number | undefined = undefined;
    if (hasServerTelemetry && wholesaleUSD > 0) {
      derivedMargin = billedUSD / wholesaleUSD;
    }

    const effectiveMarginPercent =
      derivedMargin !== undefined && (margin === undefined || margin === 1.25)
        ? Math.round((derivedMargin - 1) * 100)
        : Math.round((margin - 1) * 100);

    return {
      wholesaleUSD,
      billedUSD,
      profitUSD,
      totalTokens,
      promptTokens,
      completionTokens,
      cachedTokens,
      reasoningTokens,
      latestBilledUSD,
      latestWholesaleUSD,
      latestTokens,
      latestPromptTokens,
      latestCompletionTokens,
      isDevMode,
      detectedModel,
      derivedMargin,
      effectiveMarginPercent,
    };
  }, [events, messages, manualCost, manualTokens, model, margin, devMode]);

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
        return { ...base, bottom: '24px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: '24px', right: '24px' };
      case 'bottom-left':
        return { ...base, bottom: '24px', left: '24px' };
      case 'top-center':
        return { ...base, top: '24px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
        return { ...base, top: '24px', right: '24px' };
      case 'top-left':
        return { ...base, top: '24px', left: '24px' };
      default:
        return { ...base, bottom: '24px', left: '24px' };
    }
  }, [position]);

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  // Active view values based on activeTab (session vs latest turn)
  const displayCostUSD = activeTab === 'turn' && stats.latestBilledUSD > 0 ? stats.latestBilledUSD : stats.billedUSD;
  const displayTokens = activeTab === 'turn' && stats.latestTokens > 0 ? stats.latestTokens : stats.totalTokens;

  // Preset Top-Up Options (like 25%, 50%, 75%, Max in the Aztec crypto UI)
  const presets = [
    { label: '$5', value: 5 },
    { label: '$10', value: 10 },
    { label: '$25', value: 25 },
    { label: 'Max', value: 100 },
  ];

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    if (onTopUp) {
      onTopUp(amount);
    }
  };

  // Theme palettes matching the Aztec reference image
  const colors = {
    cardBg: isDark ? '#191622' : '#FAF8F5',
    innerBg: isDark ? '#231F30' : '#F2EFE9',
    border: isDark ? 'rgba(255, 255, 255, 0.08)' : '#EAE6DF',
    textPrimary: isDark ? '#F5F3F8' : '#1C1917',
    textSecondary: isDark ? '#9E97A9' : '#78716C',
    textMuted: isDark ? '#6B6577' : '#A8A29E',
    accentPink: '#EC4899',
    accentPillBg: isDark ? 'rgba(236, 72, 153, 0.15)' : '#FDF2F8',
    accentPillText: isDark ? '#F472B6' : '#BE185D',
    chipBg: isDark ? '#282435' : '#EFECE6',
    pillTrack: isDark ? '#13111A' : '#221F28',
    activePill: isDark ? '#322B42' : '#FFFFFF',
    activePillText: isDark ? '#FFFFFF' : '#1C1917',
  };

  return (
    <div
      style={positionStyles}
      className={`vibezcheck-ui-root vibezcheck-root font-sans select-none ${className}`}
    >
      {/* Attached Popover Card (Direct Aztec Card Inspiration) */}
      {isOpen && (
        <div
          className="vibezcheck-popover-card mb-3 transition-all animate-in fade-in slide-in-from-bottom-3"
          style={{
            width: '340px',
            backgroundColor: colors.cardBg,
            borderRadius: '28px',
            border: `1px solid ${colors.border}`,
            padding: '20px',
            boxShadow: isDark
              ? '0 28px 60px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.06)'
              : '0 24px 50px -12px rgba(28, 25, 23, 0.12), 0 4px 16px rgba(0, 0, 0, 0.03)',
            color: colors.textPrimary,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Header Row (like "Request Withdrawal" & "Balance: 539.21 Aztec") */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  color: colors.accentPink,
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                ✦
              </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  letterSpacing: '-0.01em',
                  color: colors.textPrimary,
                }}
              >
                {title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: colors.chipBg,
                  color: colors.textSecondary,
                  fontSize: '11px',
                  fontWeight: 500,
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ color: colors.textMuted }}>Balance</span>
                <span style={{ fontWeight: 600, color: colors.textPrimary }}>
                  {typeof remainingBalanceUSD === 'number'
                    ? `$${remainingBalanceUSD.toFixed(2)}`
                    : stats.detectedModel
                    ? cleanModelName(stats.detectedModel)
                    : '539.21 Credits'}
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '2px 6px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Interactive Mode Pills & Segmented Switch (like Stake | Redeem and 25% 50% 75% Max) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              gap: '6px',
            }}
          >
            {/* Segmented Session ⇄ Turn Pill Switcher */}
            <div
              style={{
                backgroundColor: colors.pillTrack,
                padding: '3px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => setActiveTab('session')}
                style={{
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: activeTab === 'session' ? 600 : 500,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'session' ? colors.activePill : 'transparent',
                  color: activeTab === 'session' ? colors.activePillText : colors.textMuted,
                  transition: 'all 0.15s ease',
                  boxShadow: activeTab === 'session' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Session
              </button>
              <button
                onClick={() => setActiveTab('turn')}
                style={{
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: activeTab === 'turn' ? 600 : 500,
                  cursor: 'pointer',
                  backgroundColor: activeTab === 'turn' ? colors.activePill : 'transparent',
                  color: activeTab === 'turn' ? colors.activePillText : colors.textMuted,
                  transition: 'all 0.15s ease',
                  boxShadow: activeTab === 'turn' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Latest Turn
              </button>
            </div>

            {/* Quick Top-Up / Filter Preset Pills (Aztec style: 25%, 50%, 75%, Max) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePresetClick(preset.value)}
                  style={{
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '4px 7px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: selectedPreset === preset.value ? colors.accentPink : colors.accentPillBg,
                    color: selectedPreset === preset.value ? '#FFFFFF' : colors.accentPillText,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Huge Hero Metric Display (Direct Aztec Inspiration: 134.80 Aztec / $ 70.10 ⇅) */}
          <div style={{ marginBottom: '18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div
                onClick={() => setHeroUnit(heroUnit === 'usd' ? 'tokens' : 'usd')}
                title="Click to toggle between USD and Token view"
                style={{
                  fontSize: '34px',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                  cursor: 'pointer',
                  lineHeight: 1.1,
                  color: colors.textPrimary,
                }}
              >
                {heroUnit === 'usd' ? `$${displayCostUSD.toFixed(4)}` : formatTokens(displayTokens)}
              </div>

              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.textSecondary,
                  letterSpacing: '0.02em',
                }}
              >
                {heroUnit === 'usd' ? 'USD' : 'Tokens'}
              </div>
            </div>

            {/* Secondary conversion row with interactive swap icon (⇅) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '4px',
                color: colors.textSecondary,
                fontSize: '12px',
              }}
            >
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {heroUnit === 'usd'
                  ? `≈ ${formatTokens(displayTokens)} tokens`
                  : `≈ $${displayCostUSD.toFixed(4)} USD`}
              </span>

              <button
                onClick={() => setHeroUnit(heroUnit === 'usd' ? 'tokens' : 'usd')}
                title="Swap primary unit"
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '2px 4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'color 0.15s ease',
                }}
              >
                ⇅
              </button>
            </div>
          </div>

          {/* Inner Nested Surface (Aztec: "You will receive ... 128.06 Aztec") */}
          <div
            style={{
              backgroundColor: colors.innerBg,
              borderRadius: '20px',
              padding: '16px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: colors.textSecondary,
                }}
              >
                Token Breakdown
              </span>

              {/* Mini toggle switch for detailed breakdown */}
              <div
                onClick={() => setDetailsExpanded(!detailsExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  color: colors.textMuted,
                }}
              >
                <span>Live View</span>
                <div
                  style={{
                    width: '26px',
                    height: '14px',
                    backgroundColor: detailsExpanded ? colors.accentPink : colors.border,
                    borderRadius: '9999px',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: detailsExpanded ? '14px' : '2px',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Inner primary metric */}
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                fontVariantNumeric: 'tabular-nums',
                color: colors.textPrimary,
                marginBottom: '10px',
              }}
            >
              {formatTokens(displayTokens)}
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: colors.textSecondary,
                  marginLeft: '6px',
                }}
              >
                tok
              </span>
            </div>

            {/* Granular token metrics */}
            {detailsExpanded && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  fontSize: '11px',
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textMuted }}>Prompt / Input:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: colors.textPrimary }}>
                    {formatTokens(stats.promptTokens)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textMuted }}>Completion / Output:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: colors.textPrimary }}>
                    {formatTokens(stats.completionTokens)}
                  </span>
                </div>
                {stats.reasoningTokens > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textMuted }}>↳ Reasoning Tokens:</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: colors.accentPink }}>
                      {formatTokens(stats.reasoningTokens)}
                    </span>
                  </div>
                )}
                {stats.cachedTokens > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10B981' }}>
                    <span>↳ Cache Discount:</span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      -{formatTokens(stats.cachedTokens)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OPTIONAL DEVELOPER WHOLESALE & MARGIN SECTION (Hidden by default!) */}
          {(showWholesale || showMargin) && (
            <div
              style={{
                backgroundColor: isDark ? 'rgba(236, 72, 153, 0.08)' : '#FDF2F8',
                border: `1px solid ${isDark ? 'rgba(236, 72, 153, 0.2)' : '#FCE7F3'}`,
                borderRadius: '16px',
                padding: '12px',
                marginBottom: '14px',
                fontSize: '11px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <span style={{ fontWeight: 600, color: colors.accentPillText }}>
                  Developer Economics
                </span>
                {showMargin && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: colors.accentPillBg,
                      color: colors.accentPillText,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      border: `1px solid ${isDark ? 'rgba(236, 72, 153, 0.3)' : '#FBCFE8'}`,
                    }}
                  >
                    {`+${stats.effectiveMarginPercent}% Margin`}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                {showWholesale && (
                  <div>
                    <span style={{ display: 'block', fontSize: '10px', color: colors.textMuted }}>
                      Wholesale API:
                    </span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: colors.textPrimary }}>
                      ${stats.wholesaleUSD.toFixed(4)}
                    </span>
                  </div>
                )}
                {showMargin && (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: colors.textMuted }}>
                      Net Retail Profit:
                    </span>
                    <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: '#10B981' }}>
                      +${stats.profitUSD.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Row (Aztec: Exchange Rate & "Withdraw ▶" button) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '4px',
            }}
          >
            <div style={{ fontSize: '10.5px', color: colors.textMuted, lineHeight: 1.3 }}>
              <div>
                Model: <span style={{ color: colors.textSecondary, fontWeight: 500 }}>{cleanModelName(stats.detectedModel) || model}</span>
              </div>
              <div style={{ fontSize: '9.5px' }}>
                {stats.isDevMode ? 'Dev Mode · Local Zero-DB' : 'Stripe Meter Active'}
              </div>
            </div>

            {/* Vibrant Orchid / Magenta Action Button (Aztec "Withdraw ▶" button) */}
            {onTopUp && (
              <button
                onClick={() => onTopUp(selectedPreset || undefined)}
                style={{
                  backgroundColor: colors.accentPink,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '9px 18px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
                  transition: 'transform 0.15s ease, opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <span>Top Up</span>
                <span style={{ fontSize: '10px' }}>▶</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Launcher Pill (Matches the same Aztec luxury design) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="vibezcheck-floating-pill"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.cardBg,
          color: colors.textPrimary,
          boxShadow: isDark
            ? '0 12px 30px -8px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 12px 28px -8px rgba(28, 25, 23, 0.1), 0 2px 8px rgba(0, 0, 0, 0.03)',
          cursor: 'pointer',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        title="Click to toggle VibezCheck Financial Meter"
      >
        <span style={{ color: colors.accentPink, fontWeight: 700, fontSize: '12px' }}>✦</span>
        <span
          style={{
            fontWeight: 600,
            fontSize: '12px',
            fontVariantNumeric: 'tabular-nums',
            color: colors.textPrimary,
          }}
        >
          {`$${stats.billedUSD.toFixed(4)}`}
        </span>
        <span style={{ color: colors.textMuted }}>·</span>
        <span
          style={{
            fontSize: '12px',
            color: colors.textSecondary,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {`${formatTokens(stats.totalTokens)} tok`}
        </span>
        {stats.detectedModel && (
          <>
            <span style={{ color: colors.textMuted }}>·</span>
            <span
              style={{
                fontSize: '11px',
                color: colors.textSecondary,
                maxWidth: '85px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {cleanModelName(stats.detectedModel)}
            </span>
          </>
        )}
        {stats.isDevMode && (
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              padding: '1px 5px',
              borderRadius: '9999px',
              backgroundColor: isDark ? '#2D283A' : '#EFECE6',
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
            }}
          >
            DEV
          </span>
        )}
        <svg
          style={{
            width: '12px',
            height: '12px',
            color: colors.textMuted,
            marginLeft: '2px',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
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
