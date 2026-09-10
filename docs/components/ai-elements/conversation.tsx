'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, Loader2 } from 'lucide-react';

export interface ConversationProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

/**
 * ✦ <Conversation /> (AI Elements)
 * Auto-scrolling conversational container with scroll-to-bottom trigger.
 */
export function Conversation({
  children,
  isLoading = false,
  className = '',
}: ConversationProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [children, isLoading]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full space-y-1"
      >
        {children}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 py-3 px-2 text-xs text-slate-500 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
            <span>AI Router streaming response...</span>
          </div>
        )}

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-2 right-4 p-2 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-md text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition cursor-pointer z-20"
          title="Scroll to latest"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
