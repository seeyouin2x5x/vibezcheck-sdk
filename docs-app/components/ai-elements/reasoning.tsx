'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Brain, Sparkles } from 'lucide-react';

export interface ReasoningProps {
  children?: React.ReactNode;
  content?: string;
  durationMs?: number;
  tokens?: number;
  isStreaming?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * ✦ <Reasoning /> (AI Elements)
 * Collapsible thought process accordion for reasoning & extended thinking models.
 */
export function Reasoning({
  children,
  content,
  durationMs,
  tokens,
  isStreaming = false,
  defaultOpen = false,
  className = '',
}: ReasoningProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const text = content || (typeof children === 'string' ? children : '');

  if (!text && !isStreaming) return null;

  return (
    <div
      className={`rounded-xl border border-indigo-200/60 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs transition-all overflow-hidden mb-2.5 ${className}`}
    >
      {/* Accordion Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 transition cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 font-medium">
          <Brain className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse text-purple-500' : 'text-indigo-500'}`} />
          <span>
            {isStreaming ? 'Thinking in progress...' : 'Thought process'}
          </span>
          {durationMs && (
            <span className="text-[10px] text-indigo-500/80 font-mono">
              ({(durationMs / 1000).toFixed(1)}s)
            </span>
          )}
          {tokens && (
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono">
              • {tokens} thinking tokens
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-indigo-400">
          <span className="text-[10px]">{isOpen ? 'Hide' : 'Show'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-3.5 py-2.5 border-t border-indigo-200/50 dark:border-indigo-900/40 text-slate-600 dark:text-zinc-300 font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
          {text || children}
          {isStreaming && (
            <span className="inline-block w-1.5 h-3 ml-1 bg-purple-500 animate-pulse" />
          )}
        </div>
      )}
    </div>
  );
}
