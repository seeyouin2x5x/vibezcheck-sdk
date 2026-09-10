'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, User } from 'lucide-react';
import { VibezReceipt } from '@/components/vibez-meter';

export interface MessageProps {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  annotations?: any[];
  tokens?: number;
  costUSD?: number;
  latencyMs?: number;
  isStreaming?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * ✦ <Message /> (AI Elements)
 * Composable message component following shadcn/ui and AI Elements conventions.
 */
export function Message({
  id,
  role,
  content,
  reasoning,
  annotations,
  tokens,
  costUSD,
  latencyMs,
  isStreaming = false,
  children,
  className = '',
}: MessageProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const isUser = role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Resolved token count from props or annotations
  const resolvedTokens =
    tokens ??
    (() => {
      const annList = (annotations as any[]) || [];
      const annWithUsage = annList.find((a: any) => a && typeof a === 'object' && a.usage?.totalTokens);
      if (annWithUsage?.usage?.totalTokens) return annWithUsage.usage.totalTokens;
      return Math.max(1, Math.ceil((content || '').length / 3.8));
    })();

  return (
    <div
      className={`group relative flex gap-3 py-3 px-1 transition-colors ${
        isUser ? 'justify-end' : 'justify-start'
      } ${className}`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Message Bubble & Content */}
      <div className={`max-w-[85%] md:max-w-[78%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Header Name & Timestamp */}
        <div className={`flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {isUser ? 'You' : 'AI Router'}
          </span>
        </div>

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-tr-xs shadow-md font-medium'
              : 'bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 text-slate-800 dark:text-zinc-100 rounded-tl-xs shadow-xs'
          }`}
        >
          {/* Main text content */}
          <div className="whitespace-pre-wrap">{content}</div>

          {/* Optional children (e.g. tools or custom widgets) */}
          {children}
        </div>

        {/* Assistant Bottom Receipt & Copy Action */}
        {!isUser && (
          <div className="flex items-center justify-between gap-3 pt-0.5 px-1">
            {/* VibezReceipt Micro-Badge */}
            <VibezReceipt
              tokens={resolvedTokens}
              costUSD={costUSD}
              latencyMs={latencyMs}
              variant="pill"
            />

            {/* Quick Copy Button */}
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-zinc-800"
              title="Copy response"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center text-xs shrink-0 shadow-xs mt-0.5">
          <User className="w-3.5 h-3.5" />
        </div>
      )}
    </div>
  );
}
