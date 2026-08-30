import type { TokenUsage, InferenceCost } from '../types';

/**
 * Record of a single message/completion turn in an active chat session
 */
export interface SessionTurnRecord {
  id: string;
  timestamp: string;
  model: string;
  usage: TokenUsage;
  cost: InferenceCost;
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Aggregated live session state
 */
export interface SessionState {
  /** Unique session ID (e.g. chat conversation ID) */
  sessionId: string;
  /** Total number of interaction turns in this session */
  turnCount: number;
  /** Total tokens accumulated across all turns in this session */
  sessionUsage: TokenUsage;
  /** Total cost accumulated in this session */
  sessionCost: InferenceCost;
  /** Model-by-model breakdown of tokens and costs in this session */
  byModel: Record<
    string,
    {
      turns: number;
      usage: TokenUsage;
      cost: InferenceCost;
    }
  >;
  /** Complete turn history for this session */
  history: SessionTurnRecord[];
}

/**
 * Storage adapter options for client-side persistence
 */
export type SessionPersistenceMode = 'memory' | 'sessionStorage' | 'localStorage' | 'custom';

export interface CustomStorageAdapter {
  getItem: (key: string) => string | null | Promise<string | null>;
  setItem: (key: string, value: string) => void | Promise<void>;
  removeItem: (key: string) => void | Promise<void>;
}

/**
 * Configuration options for VibezSessionProvider
 */
export interface VibezSessionProviderProps {
  children: React.ReactNode;
  /** Session ID (defaults to auto-generated UUID/timestamp) */
  sessionId?: string;
  /** Client-side persistence mode (default: 'memory') */
  persist?: SessionPersistenceMode;
  /** Custom storage adapter (e.g. AsyncStorage for React Native) */
  storage?: CustomStorageAdapter;
  /** Storage key prefix (default: 'vibez_session_') */
  storageKey?: string;
  /** Markup multiplier for client retail cost displays (e.g. 1.3 for 30% margin) */
  markupMultiplier?: number;
  /** Callback fired whenever a turn is recorded */
  onTurnRecorded?: (turn: SessionTurnRecord, sessionState: SessionState) => void;
}

/**
 * Interface returned by useVibezSession hook
 */
export interface VibezSessionContextValue extends SessionState {
  /** Record a completed turn from useChat, streamText, or native API */
  recordTurn: (params: {
    model: string;
    usage: {
      promptTokens?: number;
      completionTokens?: number;
      inputTokens?: number;
      outputTokens?: number;
      totalTokens?: number;
      reasoningTokens?: number;
      cachedTokens?: number;
      cacheWriteTokens?: number;
      completionTokensDetails?: { reasoning_tokens?: number };
      promptTokensDetails?: { cached_tokens?: number };
    };
    metadata?: Record<string, string | number | boolean>;
  }) => SessionTurnRecord;
  /** Reset session state (e.g. when user clicks "New Chat") */
  resetSession: (newSessionId?: string) => void;
}

/**
 * Props for the drop-in <VibezSessionWidget />
 */
export interface VibezSessionWidgetProps {
  /** Screen position for floating placement */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'inline';
  /** Show USD dollar cost (default: true) */
  showCost?: boolean;
  /** Show token counts (default: true) */
  showTokens?: boolean;
  /** Show reasoning/thinking tokens breakdown (default: true) */
  showReasoning?: boolean;
  /** Color theme (default: 'auto') */
  theme?: 'dark' | 'light' | 'auto';
  /** Custom container CSS class (for Web) */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * Props for the compact <VibezSessionBadge />
 */
export interface VibezSessionBadgeProps {
  /** Show USD dollar cost (default: true) */
  showCost?: boolean;
  /** Show token count (default: true) */
  showTokens?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}
