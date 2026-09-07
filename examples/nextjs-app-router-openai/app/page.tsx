'use client';

import { useChat } from 'ai/react';
import { VibezCheck } from 'vibezcheck/ui';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="flex flex-col w-full max-w-xl py-16 mx-auto px-4 min-h-screen">
      <header className="mb-6 border-b pb-4 dark:border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span>AI SDK Next.js App Router</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 font-mono">
            + VibezCheck
          </span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Official Vercel AI SDK tutorial with real-time Zero-DB Dev Mode token & dollar metering.
        </p>
      </header>

      {/* Messages list */}
      <div className="flex-1 space-y-4 mb-24">
        {messages.length === 0 && (
          <div className="text-center py-12 text-sm text-slate-400">
            Send a message to see real-time token metering and profit margins in action.
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 ml-8'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mr-8 shadow-sm'
            }`}
          >
            <div className="font-semibold text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
              {m.role === 'user' ? 'You' : 'OpenAI GPT-4o'}
            </div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>

      {/* Fixed bottom chat input form */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-12 left-0 right-0 max-w-xl mx-auto px-4 flex gap-2"
      >
        <input
          className="flex-1 p-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Say something to OpenAI..."
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
        >
          Send
        </button>
      </form>

      {/* ✦ 1-Line Financial HUD: Zero Database & Zero Stripe required in Dev Mode */}
      <VibezCheck messages={messages} model="gpt-4o" margin={1.3} position="bottom-center" />
    </main>
  );
}
