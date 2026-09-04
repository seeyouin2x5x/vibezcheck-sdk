'use client';

import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';
import { Sparkles, CreditCard, Bot, User, ArrowUp, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [balanceUSD, setBalanceUSD] = useState<number>(10.0);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      customerId: 'alex@example.com',
    },
  });

  const handleTopUp = async () => {
    try {
      setIsTopUpLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: 'alex@example.com', amountUSD: 10 }),
      });
      const data = await res.json();
      if (data.url) {
        if (data.simulated) {
          setBalanceUSD((prev) => prev + 10);
          setTopUpSuccess(true);
          setTimeout(() => setTopUpSuccess(false), 4000);
        } else {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const samplePrompts = [
    'Explain quantum computing in 2 punchy sentences.',
    'Write a TypeScript function to parse JSON safely.',
    'How does VibezCheck achieve 0ms added stream latency?',
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto px-4 py-6">
      {/* Navigation Header */}
      <header className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D4FF32] flex items-center justify-center shadow-sm text-black font-black text-lg">
            ✦
          </div>
          <div>
            <h1 className="font-bold text-lg text-stone-900 leading-tight">VibezAI SaaS</h1>
            <p className="text-xs text-stone-500 font-medium">Next.js 15 • 0ms Metering • Stripe Billing</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Credit Balance Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-500 font-medium text-xs">Balance:</span>
            <span className="font-semibold text-stone-800">${balanceUSD.toFixed(2)}</span>
          </div>

          {/* Top Up Button */}
          <button
            onClick={handleTopUp}
            disabled={isTopUpLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
          >
            <CreditCard className="w-3.5 h-3.5" />
            {isTopUpLoading ? 'Connecting...' : 'Top Up $10'}
          </button>
        </div>
      </header>

      {/* Top-up notification */}
      {topUpSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simulated Stripe Top-Up successful! Added <strong>+$10.00</strong> to your demo balance.</span>
        </div>
      )}

      {/* Chat Scroll Area */}
      <main className="flex-1 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="py-16 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 text-stone-800 border border-stone-200">
              <Sparkles className="w-8 h-8 text-stone-700" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-stone-900">Experience 0ms Metered Streaming</h2>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Every response streams in real time with zero reverse-proxy buffering. Look for the Electric Lime 
                micro-receipt below each message.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleInputChange({ target: { value: prompt } } as any);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 transition-all text-left shadow-2xs"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[85%]">
                {message.role !== 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#D4FF32] text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                    ✦
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-stone-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {message.content}
                </div>
              </div>

              {/* Verified Micro-Receipt for Assistant Messages */}
              {message.role === 'assistant' && (
                <div className="ml-9 mt-1.5">
                  <VibezReceipt message={message} />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-stone-400 text-xs ml-1">
            <span className="w-2 h-2 rounded-full bg-[#D4FF32] animate-ping" />
            <span>Streaming tokens with 0ms added latency...</span>
          </div>
        )}
      </main>

      {/* Chat Input Bar */}
      <footer className="sticky bottom-4 pt-2 bg-[#fafaf9]/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything (e.g. Generate a marketing plan)..."
            className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 placeholder:text-stone-400 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-black hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-black text-white rounded-xl transition-all active:scale-95 shadow-2xs"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-stone-400 px-2 pt-2">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Auto $0.50 runaway safety fuse active
          </span>
          <span>1.5x profit margin applied on Stripe</span>
        </div>
      </footer>

      {/* Floating Speedometer Token Counter */}
      <VibezSessionWidget position="bottom-right" theme="light" />
    </div>
  );
}
