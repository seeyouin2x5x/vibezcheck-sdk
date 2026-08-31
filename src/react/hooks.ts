import { useContext, useState, useCallback, useRef } from 'react';
import { VibezSessionContext } from './context';
import type { VibezSessionContextValue } from './types';

/**
 * Hook to access live session usage, cost totals, and turn recorder
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

export const useVibez = useVibezSession;

export interface VibezChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  annotations?: Array<{ type: string; reasoning?: string; [key: string]: any }>;
  createdAt?: Date;
}

export interface UseVibezChatOptions {
  api?: string;
  model?: string;
  customer?: string;
  body?: Record<string, any>;
  initialMessages?: VibezChatMessage[];
  onFinish?: (message: VibezChatMessage, usage: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Declarative, 1-line Chat Streaming Hook with automatic VibezCheck session tracking.
 *
 * @example
 * ```tsx
 * const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
 *   model: 'gpt-4o-mini',
 *   customer: 'alex@example.com',
 * });
 * ```
 */
export function useVibezChat(options: UseVibezChatOptions = {}) {
  const {
    api = '/api/chat',
    model = 'gpt-4o-mini',
    customer = 'anonymous',
    body = {},
    initialMessages = [],
    onFinish,
    onError,
  } = options;

  const session = useContext(VibezSessionContext);

  const [messages, setMessages] = useState<VibezChatMessage[]>(initialMessages);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const append = useCallback(
    async (userMessage: VibezChatMessage) => {
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsLoading(true);

      const assistantId = 'msg_' + Math.random().toString(36).substring(2, 9);
      let assistantContent = '';
      let detectedReasoning = '';
      let detectedUsage = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        reasoningTokens: 0,
      };

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          createdAt: new Date(),
        },
      ]);

      try {
        abortControllerRef.current = new AbortController();

        const res = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            model,
            customer,
            ...body,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error! status: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No stream body available');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            if (line.startsWith('0:')) {
              try {
                assistantContent += JSON.parse(line.substring(2));
              } catch {
                assistantContent += line.substring(2).replace(/^"|"$/g, '');
              }
            } else if (line.startsWith('d:')) {
              try {
                const data = JSON.parse(line.substring(2));
                if (data.usage) {
                  detectedUsage = {
                    promptTokens: data.usage.promptTokens ?? 0,
                    completionTokens: data.usage.completionTokens ?? 0,
                    totalTokens:
                      (data.usage.promptTokens ?? 0) + (data.usage.completionTokens ?? 0),
                    reasoningTokens: data.usage.reasoningTokens ?? 0,
                  };
                }
              } catch {
                // ignore
              }
            } else if (line.startsWith('e:') || line.startsWith('g:')) {
              try {
                detectedReasoning += JSON.parse(line.substring(2));
              } catch {
                detectedReasoning += line.substring(2);
              }
            } else if (!line.startsWith('f:') && !line.startsWith('2:')) {
              assistantContent += line;
            }

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: assistantContent,
                      annotations: detectedReasoning
                        ? [{ type: 'reasoning', reasoning: detectedReasoning }]
                        : undefined,
                    }
                  : msg
              )
            );
          }
        }

        if (detectedUsage.promptTokens === 0 && detectedUsage.completionTokens === 0) {
          const promptWords = updatedMessages.reduce(
            (acc, m) => acc + m.content.split(/\s+/).length,
            0
          );
          const outputWords = assistantContent.split(/\s+/).length;
          detectedUsage = {
            promptTokens: Math.ceil(promptWords * 1.3),
            completionTokens: Math.ceil(outputWords * 1.3),
            totalTokens: Math.ceil((promptWords + outputWords) * 1.3),
            reasoningTokens: detectedReasoning
              ? Math.ceil(detectedReasoning.split(/\s+/).length * 1.3)
              : 0,
          };
        }

        // Automatically record turn into VibezSessionContext
        if (session) {
          session.recordTurn({
            model,
            usage: detectedUsage,
          });
        }

        const finalMsg: VibezChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: assistantContent,
          annotations: detectedReasoning
            ? [{ type: 'reasoning', reasoning: detectedReasoning }]
            : undefined,
          createdAt: new Date(),
        };

        if (onFinish) {
          onFinish(finalMsg, detectedUsage);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.error('[useVibezChat Error]', err);
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [api, model, customer, body, messages, session, onFinish, onError]
  );

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg: VibezChatMessage = {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        role: 'user',
        content: input.trim(),
        createdAt: new Date(),
      };

      setInput('');
      append(userMsg);
    },
    [input, isLoading, append]
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    append,
  };
}
