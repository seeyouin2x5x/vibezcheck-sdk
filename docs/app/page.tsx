'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Header } from '@/components/header';
import { StickyChat } from '@/components/sticky-chat';
import { QrCard } from '@/components/qr-card';
import { AiSdkShowcase } from '@/components/ai-sdk-showcase';
import { Conversation, Message } from '@/components/ai-elements';
import { VibezCheck } from '@/components/vibez-meter';
import { Copy, Check } from 'lucide-react';

export default function Home() {
  const { messages, append, isLoading, stop } = useChat({
    api: '/api/chat',
  });

  const [input, setInput] = useState<string>('');
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [audienceTab, setAudienceTab] = useState<'humans' | 'agents'>('humans');
  const [providerPkg, setProviderPkg] = useState<string>('@ai-sdk/anthropic');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'agents' || tab === 'humans') {
        setAudienceTab(tab);
      }
    }
  }, []);

  const handleSendPrompt = (text: string) => {
    if (!text.trim() || isLoading) return;
    append({ role: 'user', content: text });
    setInput('');
  };

  const [cmdMode, setCmdMode] = useState<'init' | 'install'>('init');

  const currentCommand =
    cmdMode === 'init'
      ? 'npx vibezcheck init'
      : audienceTab === 'humans'
      ? `pnpm add ai ${providerPkg} vibezcheck`
      : `pnpm add vibezcheck stripe ${providerPkg}`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-[#fafafa] dark:bg-[#0c0c0e] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-4 pt-20 pb-40">
        {/* Hero Section (Non-technical plain English) */}
        <div className="text-center max-w-2xl mx-auto mt-4 mb-2 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-medium text-slate-600 dark:text-zinc-300 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>0ms Added Latency · Stripe Metering · Automatic Safety Fuse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            The Electric Meter for AI Apps
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Measure every token, calculate exact real-time costs, and bill customers with Stripe.
          </p>
        </div>

        {/* ✦ Audience Selector & Dual-Command Pill */}
        <div className="flex flex-col items-center gap-3 mt-4 mb-4">
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 rounded-full text-xs font-medium shadow-2xs">
            <button
              onClick={() => setAudienceTab('humans')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                audienceTab === 'humans'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Interactive Models
            </button>
            <button
              onClick={() => setAudienceTab('agents')}
              className={`px-3 py-1 rounded-full transition cursor-pointer ${
                audienceTab === 'agents'
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              Stripe & Cost Protection
            </button>
          </div>

          {/* Dynamic Command Pill with Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="flex items-center bg-slate-100 dark:bg-zinc-950 rounded-full p-0.5 text-[10px] font-medium text-slate-600 dark:text-zinc-400">
              <button
                onClick={() => setCmdMode('init')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  cmdMode === 'init'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Quick Starter
              </button>
              <button
                onClick={() => setCmdMode('install')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  cmdMode === 'install'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Install
              </button>
            </div>

            <div
              onClick={handleCopyCmd}
              className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-slate-700 dark:text-zinc-300 cursor-pointer hover:text-slate-950 dark:hover:text-white transition group"
            >
              <span className="text-slate-400 dark:text-zinc-500">$</span>
              <span>{currentCommand}</span>
              {copiedCmd ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 ml-1 transition" />
              )}
            </div>
          </div>
        </div>

        {/* ✦ Interactive AI SDK Playground (Matching ai-sdk.dev & screenshot) */}
        <AiSdkShowcase
          audienceTab={audienceTab}
          onAudienceChange={setAudienceTab}
          onProviderPkgChange={setProviderPkg}
        />

        {/* ✦ Live Conversation Thread powered by AI Elements (<Conversation /> & <Message />) */}
        {messages.length > 0 && (
          <div className="w-full max-w-3xl space-y-4 pt-10 border-t border-slate-200 dark:border-zinc-800/80 mt-10">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Live Router Session
              </span>
              <span className="text-xs text-lime-600 dark:text-lime-400 font-mono">
                {messages.length} message{messages.length > 1 ? 's' : ''}
              </span>
            </div>

            <Conversation isLoading={isLoading}>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  id={message.id}
                  role={message.role as any}
                  content={message.content}
                  annotations={message.annotations as any}
                />
              ))}
            </Conversation>
          </div>
        )}
      </div>

      {/* ✦ 1-Line Token Meter & Financial HUD: Docked in bottom-left */}
      {/* <VibezCheck messages={messages} position="bottom-left" /> */}

      {/* Bottom Right QR Card (Matching Screenshot) */}
      {/* <QrCard /> */}

      {/* Sticky Bottom Chat Input Bar with AI Elements PromptInput */}
      {/* <StickyChat
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onStop={stop}
        onSubmit={() => handleSendPrompt(input)}
        onChipClick={(prompt: string) => handleSendPrompt(prompt)}
      /> */}
    </main>
  );
}
