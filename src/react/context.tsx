import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type {
  SessionState,
  SessionTurnRecord,
  VibezSessionProviderProps,
  VibezSessionContextValue,
} from './types';
import type { TokenUsage, InferenceCost } from '../types';
import { calculateUsageCost } from '../pricing/calculator';

const INITIAL_USAGE: TokenUsage = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  reasoningTokens: 0,
  visibleOutputTokens: 0,
  cachedTokens: 0,
};

const INITIAL_COST: InferenceCost = {
  inputCostUSD: 0,
  outputCostUSD: 0,
  reasoningCostUSD: 0,
  cachedDiscountUSD: 0,
  totalUSD: 0,
  currency: 'USD',
};

export const VibezSessionContext = createContext<VibezSessionContextValue | null>(null);

function generateId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
}

export const VibezSessionProvider: React.FC<VibezSessionProviderProps> = ({
  children,
  sessionId: customSessionId,
  persist = 'memory',
  storage,
  storageKey = 'vibez_session_',
  markupMultiplier,
  onTurnRecorded,
}) => {
  const [sessionId, setSessionId] = useState<string>(() => customSessionId || generateId());
  const [turnCount, setTurnCount] = useState<number>(0);
  const [sessionUsage, setSessionUsage] = useState<TokenUsage>(INITIAL_USAGE);
  const [sessionCost, setSessionCost] = useState<InferenceCost>(INITIAL_COST);
  const [byModel, setByModel] = useState<SessionState['byModel']>({});
  const [history, setHistory] = useState<SessionTurnRecord[]>([]);

  const fullStorageKey = useMemo(() => `${storageKey}${sessionId}`, [storageKey, sessionId]);

  // 1. Load persisted state on mount (if persist is enabled)
  useEffect(() => {
    if (persist === 'memory') return;

    try {
      if (persist === 'sessionStorage' && typeof window !== 'undefined' && window.sessionStorage) {
        const data = window.sessionStorage.getItem(fullStorageKey);
        if (data) {
          const parsed: SessionState = JSON.parse(data);
          setTurnCount(parsed.turnCount);
          setSessionUsage(parsed.sessionUsage);
          setSessionCost(parsed.sessionCost);
          setByModel(parsed.byModel);
          setHistory(parsed.history);
        }
      } else if (persist === 'localStorage' && typeof window !== 'undefined' && window.localStorage) {
        const data = window.localStorage.getItem(fullStorageKey);
        if (data) {
          const parsed: SessionState = JSON.parse(data);
          setTurnCount(parsed.turnCount);
          setSessionUsage(parsed.sessionUsage);
          setSessionCost(parsed.sessionCost);
          setByModel(parsed.byModel);
          setHistory(parsed.history);
        }
      } else if (persist === 'custom' && storage) {
        const res = storage.getItem(fullStorageKey);
        if (res instanceof Promise) {
          res.then((data) => {
            if (data) {
              const parsed: SessionState = JSON.parse(data);
              setTurnCount(parsed.turnCount);
              setSessionUsage(parsed.sessionUsage);
              setSessionCost(parsed.sessionCost);
              setByModel(parsed.byModel);
              setHistory(parsed.history);
            }
          });
        } else if (res) {
          const parsed: SessionState = JSON.parse(res);
          setTurnCount(parsed.turnCount);
          setSessionUsage(parsed.sessionUsage);
          setSessionCost(parsed.sessionCost);
          setByModel(parsed.byModel);
          setHistory(parsed.history);
        }
      }
    } catch {
      // Ignore storage parse errors
    }
  }, [persist, fullStorageKey, storage]);

  // Helper to persist state
  const saveState = useCallback(
    (newState: SessionState) => {
      if (persist === 'memory') return;

      try {
        const json = JSON.stringify(newState);
        if (persist === 'sessionStorage' && typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(fullStorageKey, json);
        } else if (persist === 'localStorage' && typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(fullStorageKey, json);
        } else if (persist === 'custom' && storage) {
          storage.setItem(fullStorageKey, json);
        }
      } catch {
        // Ignore storage write errors
      }
    },
    [persist, fullStorageKey, storage]
  );

  /**
   * Record a completed chat turn and update live session totals
   */
  const recordTurn = useCallback<VibezSessionContextValue['recordTurn']>(
    ({ model, usage: rawUsage, metadata }) => {
      const inputTokens = rawUsage.promptTokens ?? rawUsage.inputTokens ?? 0;
      const outputTokens = rawUsage.completionTokens ?? rawUsage.outputTokens ?? 0;
      const reasoningTokens =
        rawUsage.reasoningTokens ?? rawUsage.completionTokensDetails?.reasoning_tokens ?? 0;
      const cachedTokens =
        rawUsage.cachedTokens ?? rawUsage.promptTokensDetails?.cached_tokens ?? 0;
      const cacheWriteTokens = rawUsage.cacheWriteTokens ?? 0;

      const turnUsage: TokenUsage = {
        inputTokens,
        outputTokens,
        totalTokens: rawUsage.totalTokens ?? inputTokens + outputTokens,
        reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
        visibleOutputTokens: Math.max(0, outputTokens - reasoningTokens),
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
        cacheWriteTokens: cacheWriteTokens > 0 ? cacheWriteTokens : undefined,
      };

      const turnCost = calculateUsageCost(model, turnUsage, markupMultiplier);

      const record: SessionTurnRecord = {
        id: 'turn_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36),
        timestamp: new Date().toISOString(),
        model,
        usage: turnUsage,
        cost: turnCost,
        metadata,
      };

      // 1. Update Turn Count
      const newTurnCount = turnCount + 1;
      setTurnCount(newTurnCount);

      // 2. Update Aggregated Session Usage
      const newUsage: TokenUsage = {
        inputTokens: sessionUsage.inputTokens + inputTokens,
        outputTokens: sessionUsage.outputTokens + outputTokens,
        totalTokens: sessionUsage.totalTokens + turnUsage.totalTokens,
        reasoningTokens: (sessionUsage.reasoningTokens ?? 0) + (turnUsage.reasoningTokens ?? 0),
        visibleOutputTokens:
          (sessionUsage.visibleOutputTokens ?? 0) + (turnUsage.visibleOutputTokens ?? outputTokens),
        cachedTokens: (sessionUsage.cachedTokens ?? 0) + (turnUsage.cachedTokens ?? 0),
        cacheWriteTokens: (sessionUsage.cacheWriteTokens ?? 0) + (turnUsage.cacheWriteTokens ?? 0),
      };
      setSessionUsage(newUsage);

      // 3. Update Aggregated Session Cost
      const newCost: InferenceCost = {
        inputCostUSD: Number((sessionCost.inputCostUSD + turnCost.inputCostUSD).toFixed(6)),
        outputCostUSD: Number((sessionCost.outputCostUSD + turnCost.outputCostUSD).toFixed(6)),
        reasoningCostUSD:
          turnCost.reasoningCostUSD !== undefined || sessionCost.reasoningCostUSD !== undefined
            ? Number(
                (
                  (sessionCost.reasoningCostUSD ?? 0) + (turnCost.reasoningCostUSD ?? 0)
                ).toFixed(6)
              )
            : undefined,
        cachedDiscountUSD:
          turnCost.cachedDiscountUSD !== undefined || sessionCost.cachedDiscountUSD !== undefined
            ? Number(
                (
                  (sessionCost.cachedDiscountUSD ?? 0) + (turnCost.cachedDiscountUSD ?? 0)
                ).toFixed(6)
              )
            : undefined,
        totalUSD: Number((sessionCost.totalUSD + turnCost.totalUSD).toFixed(6)),
        retailUSD:
          turnCost.retailUSD !== undefined || sessionCost.retailUSD !== undefined
            ? Number(((sessionCost.retailUSD ?? 0) + (turnCost.retailUSD ?? 0)).toFixed(6))
            : undefined,
        currency: turnCost.currency || 'USD',
      };
      setSessionCost(newCost);

      // 4. Update By-Model Breakdown
      const prevModelStats = byModel[model] || {
        turns: 0,
        usage: { ...INITIAL_USAGE },
        cost: { ...INITIAL_COST },
      };

      const newModelStats = {
        turns: prevModelStats.turns + 1,
        usage: {
          inputTokens: prevModelStats.usage.inputTokens + inputTokens,
          outputTokens: prevModelStats.usage.outputTokens + outputTokens,
          totalTokens: prevModelStats.usage.totalTokens + turnUsage.totalTokens,
          reasoningTokens:
            (prevModelStats.usage.reasoningTokens ?? 0) + (turnUsage.reasoningTokens ?? 0),
          visibleOutputTokens:
            (prevModelStats.usage.visibleOutputTokens ?? 0) +
            (turnUsage.visibleOutputTokens ?? outputTokens),
          cachedTokens: (prevModelStats.usage.cachedTokens ?? 0) + (turnUsage.cachedTokens ?? 0),
        },
        cost: {
          inputCostUSD: Number(
            (prevModelStats.cost.inputCostUSD + turnCost.inputCostUSD).toFixed(6)
          ),
          outputCostUSD: Number(
            (prevModelStats.cost.outputCostUSD + turnCost.outputCostUSD).toFixed(6)
          ),
          totalUSD: Number((prevModelStats.cost.totalUSD + turnCost.totalUSD).toFixed(6)),
          currency: turnCost.currency || 'USD',
        },
      };

      const newByModel = {
        ...byModel,
        [model]: newModelStats,
      };
      setByModel(newByModel);

      // 5. Update History
      const newHistory = [...history, record];
      setHistory(newHistory);

      const updatedState: SessionState = {
        sessionId,
        turnCount: newTurnCount,
        sessionUsage: newUsage,
        sessionCost: newCost,
        byModel: newByModel,
        history: newHistory,
      };

      saveState(updatedState);

      if (onTurnRecorded) {
        onTurnRecorded(record, updatedState);
      }

      return record;
    },
    [
      turnCount,
      sessionUsage,
      sessionCost,
      byModel,
      history,
      sessionId,
      markupMultiplier,
      onTurnRecorded,
      saveState,
    ]
  );

  /**
   * Reset session state
   */
  const resetSession = useCallback(
    (newSessionId?: string) => {
      const nextId = newSessionId || generateId();
      setSessionId(nextId);
      setTurnCount(0);
      setSessionUsage(INITIAL_USAGE);
      setSessionCost(INITIAL_COST);
      setByModel({});
      setHistory([]);

      if (persist === 'sessionStorage' && typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(fullStorageKey);
      } else if (
        persist === 'localStorage' &&
        typeof window !== 'undefined' &&
        window.localStorage
      ) {
        window.localStorage.removeItem(fullStorageKey);
      } else if (persist === 'custom' && storage) {
        storage.removeItem(fullStorageKey);
      }
    },
    [persist, fullStorageKey, storage]
  );

  const value: VibezSessionContextValue = useMemo(
    () => ({
      sessionId,
      turnCount,
      sessionUsage,
      sessionCost,
      byModel,
      history,
      recordTurn,
      resetSession,
    }),
    [sessionId, turnCount, sessionUsage, sessionCost, byModel, history, recordTurn, resetSession]
  );

  return <VibezSessionContext.Provider value={value}>{children}</VibezSessionContext.Provider>;
};
