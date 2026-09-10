'use client';

import React, { useRef, useEffect } from 'react';
import { Plus, Mic, ArrowUp, Square } from 'lucide-react';

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  onVoiceToggle?: () => void;
  isVoiceActive?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * ✦ <PromptInput /> (AI Elements)
 * Intelligent prompt input with actions, speech dictation, and streaming abort.
 */
export function PromptInput({
  value,
  onChange,
  onSubmit,
  onStop,
  isLoading = false,
  placeholder = 'Ask anything or send a command to the router...',
  onVoiceToggle,
  isVoiceActive = false,
  children,
  className = '',
}: PromptInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      if (onStop) onStop();
      return;
    }
    if (!value.trim()) return;
    onSubmit(e);
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200/90 dark:border-zinc-800 bg-white/95 dark:bg-[#111115]/95 backdrop-blur-xl p-2.5 shadow-xl transition-all ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 px-2">
        {/* Plus Action Trigger */}
        <button
          type="button"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer shrink-0"
          title="Add context or tool"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none py-1"
        />

        {/* Voice Trigger */}
        <button
          type="button"
          onClick={onVoiceToggle}
          className={`p-1.5 rounded-full transition cursor-pointer shrink-0 ${
            isVoiceActive
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 animate-pulse'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
          title="Voice mode"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Submit or Stop Button */}
        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition cursor-pointer shrink-0"
            title="Stop streaming"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          value.trim() && (
            <button
              type="submit"
              className="p-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
              title="Send prompt"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </form>

      {/* Children: e.g. quick-action chips */}
      {children}
    </div>
  );
}
