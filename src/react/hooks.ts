import { useContext } from 'react';
import { VibezSessionContext } from './context';
import type { VibezSessionContextValue } from './types';

/**
 * Hook to access live session usage, cost totals, and turn recorder
 *
 * @example
 * ```tsx
 * const { sessionUsage, sessionCost, recordTurn, resetSession } = useVibezSession();
 *
 * // Inside useChat onFinish:
 * onFinish: (message, { usage }) => {
 *   recordTurn({ model: 'gpt-5.6-sol', usage });
 * }
 * ```
 */
export function useVibezSession(): VibezSessionContextValue {
  const context = useContext(VibezSessionContext);

  if (!context) {
    throw new Error(
      '[vibezcheck/react] useVibezSession must be used within a <VibezSessionProvider>.'
    );
  }

  return context;
}

/**
 * Convenient alias
 */
export const useVibez = useVibezSession;
