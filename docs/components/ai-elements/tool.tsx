'use client';

import React, { useState } from 'react';
import { Wrench, CheckCircle2, Loader2, ChevronDown, ChevronRight } from 'lucide-react';

export interface ToolCallProps {
  name: string;
  args?: Record<string, any>;
  result?: any;
  status?: 'running' | 'completed' | 'error';
  className?: string;
}

/**
 * ✦ <Tool /> (AI Elements)
 * Renders agentic tool invocations, inputs, and execution feedback.
 */
export function Tool({
  name,
  args,
  result,
  status = 'completed',
  className = '',
}: ToolCallProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-xs transition-all overflow-hidden my-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/50 transition cursor-pointer select-none"
      >
        <div className="flex items-center gap-2">
          {status === 'running' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
          <span className="font-mono font-medium text-slate-800 dark:text-zinc-200">
            {name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
            {status}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[10px]">{isOpen ? 'Hide' : 'Details'}</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-3.5 py-2.5 border-t border-slate-200 dark:border-zinc-800 space-y-2 font-mono text-[11px]">
          {args && (
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Arguments:</div>
              <pre className="p-2 rounded bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 overflow-x-auto text-slate-700 dark:text-zinc-300">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {result && (
            <div>
              <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Result:</div>
              <pre className="p-2 rounded bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 overflow-x-auto text-emerald-600 dark:text-emerald-400">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
