import React, { useState } from 'react';
import { useVibezSession } from './hooks';
import type { VibezSessionWidgetProps } from './types';

export const VibezSessionWidget: React.FC<VibezSessionWidgetProps> = ({
  position = 'bottom-right',
  showCost = true,
  showTokens = true,
  showReasoning = true,
  theme = 'auto',
  className,
  style,
}) => {
  const { sessionUsage, sessionCost, turnCount, byModel } = useVibezSession();
  const [expanded, setExpanded] = useState(false);

  // If no turns yet and 0 tokens, render minimal idle pill
  const hasUsage = sessionUsage.totalTokens > 0;

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  const colors = {
    bg: isDark ? '#171717' : '#ffffff',
    text: isDark ? '#f5f5f5' : '#171717',
    subtext: isDark ? '#a3a3a3' : '#737373',
    border: isDark ? '#262626' : '#e5e5e5',
    accent: '#8b5cf6',
    reasoningBg: isDark ? '#2e1065' : '#f3e8ff',
    reasoningText: isDark ? '#c084fc' : '#7c3aed',
  };

  const getPositionStyles = (): React.CSSProperties => {
    if (position === 'inline') return {};
    const base: React.CSSProperties = { position: 'fixed', zIndex: 9999 };
    switch (position) {
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      default:
        return base;
    }
  };

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div
      className={className}
      style={{
        ...getPositionStyles(),
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '13px',
        ...style,
      }}
    >
      {/* Main Pill Button */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: colors.bg,
          color: colors.text,
          border: `1px solid ${colors.border}`,
          borderRadius: '9999px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ color: colors.accent, fontWeight: 'bold' }}>⚡</span>

        {showTokens && (
          <span style={{ fontWeight: 600 }}>
            {formatTokens(sessionUsage.totalTokens)} tokens
          </span>
        )}

        {showCost && (
          <span style={{ color: colors.subtext }}>
            (${sessionCost.totalUSD.toFixed(4)})
          </span>
        )}

        {showReasoning && sessionUsage.reasoningTokens! > 0 && (
          <span
            style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: colors.reasoningBg,
              color: colors.reasoningText,
              fontWeight: 500,
            }}
          >
            🧠 {formatTokens(sessionUsage.reasoningTokens!)}
          </span>
        )}

        <span style={{ color: colors.subtext, fontSize: '10px' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded Breakdown Popover */}
      {expanded && (
        <div
          style={{
            marginTop: '8px',
            padding: '14px',
            backgroundColor: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            width: '260px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 600,
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <span>Live Session Usage</span>
            <span style={{ color: colors.subtext }}>{turnCount} turns</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.subtext }}>Prompt Input:</span>
              <span>{sessionUsage.inputTokens.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: colors.subtext }}>Output Tokens:</span>
              <span>{sessionUsage.outputTokens.toLocaleString()}</span>
            </div>

            {sessionUsage.reasoningTokens! > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.reasoningText }}>
                <span>🧠 Thinking Tokens:</span>
                <span>{sessionUsage.reasoningTokens!.toLocaleString()}</span>
              </div>
            )}

            {sessionUsage.cachedTokens! > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                <span>⚡ Cached Tokens:</span>
                <span>{sessionUsage.cachedTokens!.toLocaleString()}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 600,
                marginTop: '6px',
                paddingTop: '6px',
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <span>Session Cost:</span>
              <span>${sessionCost.totalUSD.toFixed(5)} {sessionCost.currency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
