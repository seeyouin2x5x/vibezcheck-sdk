import React from 'react';
import { useVibezSession } from './hooks';
import type { VibezSessionBadgeProps } from './types';

/**
 * Compact inline badge for chat input bars, headers, or navbars
 */
export const VibezSessionBadge: React.FC<VibezSessionBadgeProps> = ({
  showCost = true,
  showTokens = true,
  className,
  style,
}) => {
  const { sessionUsage, sessionCost } = useVibezSession();

  const formatTokens = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        fontSize: '11px',
        fontWeight: 500,
        borderRadius: '9999px',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        color: '#8b5cf6',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        ...style,
      }}
    >
      <span>⚡</span>
      {showTokens && <span>{formatTokens(sessionUsage.totalTokens)} tok</span>}
      {showCost && <span>(${sessionCost.totalUSD.toFixed(4)})</span>}
    </span>
  );
};
