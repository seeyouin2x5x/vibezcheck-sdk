'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <div className="flex flex-col w-full max-w-lg py-20 mx-auto px-4 min-h-screen">
      <div className="flex-1 space-y-4 mb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-2xl border ${
              message.role === 'user'
                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 ml-12'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 mr-12'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>

            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.parts
                ? message.parts.map((part, index) => {
                    switch (part.type) {
                      case 'text':
                        return <span key={index}>{part.text}</span>;
                      default:
                        return null;
                    }
                  })
                : message.content}
            </div>

            {/* ✦ Zero-Prop Micro-Receipt: auto-derives tokens, micro-cost, model, & latency */}
            {message.role === 'assistant' && (
              <div className="mt-3 flex justify-end">
                <VibezReceipt message={message} />
              </div>
            )}
          </div>
        ))}

        {status === 'streaming' && (
          <div className="text-xs text-zinc-400 italic">Assistant is typing...</div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            className="flex-1 p-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Type your message..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={status === 'streaming' || !input.trim()}
            className="px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </form>

      {/* ✦ Zero-Prop Financial HUD: conversation totals, model tag, profit margin pill */}
      <VibezCheck messages={messages} />
    </div>
  );
}
