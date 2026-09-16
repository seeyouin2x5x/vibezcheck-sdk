'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Header } from '@/components/header';
import { AiSdkShowcase } from '@/components/ai-sdk-showcase';
import { Conversation, Message } from '@/components/ai-elements';
import { VibezReceipt } from '@/components/vibez-meter';
import {
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Database,
  Layers,
  ArrowRight,
  ExternalLink,
  Wallet,
  TrendingUp,
  Cpu,
  LifeBuoy,
  Lock,
  Server,
  Code2,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Terminal,
} from 'lucide-react';

export default function Home() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  });

  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [audienceTab, setAudienceTab] = useState<'humans' | 'agents'>('humans');
  const [providerPkg, setProviderPkg] = useState<string>('@ai-sdk/anthropic');
  const [packageManager, setPackageManager] = useState<'pnpm' | 'npm' | 'bun'>('pnpm');
  const [cmdMode, setCmdMode] = useState<'init' | 'install' | 'ai-sdk'>('init');

  // Interactive sections state
  const [contrastMode, setContrastMode] = useState<'with' | 'without'>('with');
  const [activeSinkTab, setActiveSinkTab] = useState<'supabase' | 'postgres' | 'sqlite' | 'custom'>('supabase');
  const [receiptVariant, setReceiptVariant] = useState<'pill' | 'minimal' | 'card'>('pill');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'agents' || tab === 'humans') {
        setAudienceTab(tab);
      }
    }
  }, []);

  const getInstallCommand = () => {
    if (cmdMode === 'init') {
      return 'npx vibezcheck init';
    }
    const prefix = packageManager === 'pnpm' ? 'pnpm add' : packageManager === 'npm' ? 'npm install' : 'bun add';
    if (cmdMode === 'install') {
      return `${prefix} vibezcheck`;
    }
    return `${prefix} ai @ai-sdk/openai vibezcheck`;
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(getInstallCommand());
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-[#fafafa] dark:bg-[#0c0c0e] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 pt-20 pb-28">
        {/* =========================================================================
            1. HERO SECTION
        ========================================================================= */}
        <section className="text-center max-w-3xl mx-auto mt-4 mb-3 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="/releases"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 text-[11px] font-medium text-slate-700 dark:text-zinc-300 transition shadow-2xs cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>v0.5.10 Released</span>
              <span className="text-slate-400 dark:text-zinc-500">·</span>
              <span className="text-slate-500 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-white transition">0ms Added Latency · Zero Dependencies</span>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="/docs?section=privacy"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition shadow-2xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Zero Data Retention (ZDR)</span>
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            The Electric Meter for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 dark:from-emerald-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              AI Apps & Autonomous Agents
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Meter every token, sever runaway agent loops with automatic circuit breakers, collect +30% margins with Stripe, and plug into your own database.
          </p>

          {/* Quick links pill row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <a
              href="/docs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition shadow-sm"
            >
              <span>Explore Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/releases"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition shadow-xs"
            >
              <span>v0.5.10 Notes</span>
            </a>
            <a
              href="/docs?section=tutorial"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition shadow-xs"
            >
              <span>5-Min Tutorial</span>
            </a>
            <a
              href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

        {/* =========================================================================
            2. AUDIENCE SELECTOR & DUAL-COMMAND PILL
        ========================================================================= */}
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
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl sm:rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            {/* Mode selection */}
            <div className="flex items-center bg-slate-100 dark:bg-zinc-950 rounded-full p-0.5 text-[10px] font-medium text-slate-600 dark:text-zinc-400">
              <button
                onClick={() => setCmdMode('init')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  cmdMode === 'init'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CLI Starter
              </button>
              <button
                onClick={() => setCmdMode('install')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  cmdMode === 'install'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Core SDK
              </button>
              <button
                onClick={() => setCmdMode('ai-sdk')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  cmdMode === 'ai-sdk'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-bold shadow-2xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                + AI SDK
              </button>
            </div>

            {/* Package Manager selection (when not npx) */}
            {cmdMode !== 'init' && (
              <div className="flex items-center bg-slate-100 dark:bg-zinc-950 rounded-full p-0.5 text-[9px] font-mono text-slate-500 dark:text-zinc-500">
                {(['pnpm', 'npm', 'bun'] as const).map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                      packageManager === pm
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'hover:text-slate-900 dark:hover:text-zinc-300'
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            )}

            {/* Click to copy command */}
            <div
              onClick={handleCopyCmd}
              className="flex items-center gap-2 px-3 py-1 text-xs font-mono text-slate-700 dark:text-zinc-300 cursor-pointer hover:text-slate-950 dark:hover:text-white transition group select-none"
              title="Click to copy command"
            >
              <span className="text-slate-400 dark:text-zinc-500">$</span>
              <span>{getInstallCommand()}</span>
              {copiedCmd ? (
                <Check className="w-3.5 h-3.5 text-emerald-500 ml-1" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-300 ml-1 transition" />
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. INTERACTIVE AI SDK PLAYGROUND
        ========================================================================= */}
        <div className="w-full">
          <AiSdkShowcase
            audienceTab={audienceTab}
            onAudienceChange={setAudienceTab}
            onProviderPkgChange={setProviderPkg}
          />
        </div>

        {/* Optional Live Conversation Thread */}
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

        {/* =========================================================================
            4. CORE PILLARS GRID (Engineered for Production AI in v0.5.10)
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-mono font-semibold">
              ARCHITECTURE & CAPABILITIES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Scale, Speed, and Zero Lock-in
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Everything you need to meter, protect, and monetize production AI applications without adding infrastructure complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Pillar 1: 0ms Added Latency */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 mb-3.5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>0ms Added Latency</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  Non-blocking
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Telemetry streams through asynchronous microtasks. Your Time-To-First-Token (TTFT) and throughput remain 100% identical to bare provider calls.
              </p>
            </div>

            {/* Pillar 2: Zero Dependencies */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 mb-3.5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>Zero Runtime Dependencies</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  &lt; 15 KB
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Zero heavy ORMs, zero native bindings. Deploy seamlessly to Next.js Serverless, AWS Lambda, Cloudflare Workers, Edge runtimes, or Node.js.
              </p>
            </div>

            {/* Pillar 3: Zero Data Retention (ZDR) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-500/10 text-teal-500 mb-3.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>100% Zero Data Retention</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold">
                  ZDR
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                We measure token numbers and model IDs, never user prompts or generated texts. No conversations or PII ever leave your application boundaries.
              </p>
            </div>

            {/* Pillar 4: Decoupled Database Sinks */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 mb-3.5">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>Decoupled Storage Sinks</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                  BYOD
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Bring your own database. Plug directly into Supabase, PostgreSQL, SQLite, or webhooks using clean <code className="text-indigo-600 dark:text-indigo-400 font-mono">onRecordUsage</code> callbacks.
              </p>
            </div>

            {/* Pillar 5: Runaway Circuit Breakers */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500 mb-3.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>Runaway Circuit Breakers</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">
                  Safety Fuse
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Autonomous agents can enter recursive tool loops. Set hard dollar tripwires ($0.50, $2.00) to sever runaway streams before racking up surprise bills.
              </p>
            </div>

            {/* Pillar 6: Client Disconnect Shield & Spooling */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-700 transition">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-500/10 text-purple-500 mb-3.5">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                <span>Disconnect Shield & Spooling</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
                  Serverless
                </span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                When users close tabs mid-stream, VibezCheck catches the abort signal, saves the partial tokens generated, and spools them cleanly via <code className="text-purple-600 dark:text-purple-400 font-mono">meter.flush()</code>.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. THE OUTCOME CONTRAST (With vs Without VibezCheck)
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold mb-2">
                FINANCIAL & OPERATIONAL AUDIT
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                The Outcome Contrast: With vs. Without VibezCheck
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
                See how a few lines of lightweight middleware prevent unexpected losses and unlock scalable monetization.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 shadow-xs self-start md:self-auto">
              <button
                onClick={() => setContrastMode('without')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  contrastMode === 'without'
                    ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Without VibezCheck (Vulnerable)</span>
              </button>
              <button
                onClick={() => setContrastMode('with')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  contrastMode === 'with'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>With VibezCheck (Protected)</span>
              </button>
            </div>
          </div>

          {/* Outcome Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scenario 1: Recursive Agent Loop */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              contrastMode === 'with'
                ? 'bg-emerald-950/10 border-emerald-500/30 dark:bg-emerald-950/20'
                : 'bg-rose-950/10 border-rose-500/30 dark:bg-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">1. Runaway Agent Loop</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  contrastMode === 'with'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {contrastMode === 'with' ? 'Circuit Breaker Armed ($0.50)' : 'Uncapped Infinite Loop'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-3">
                {contrastMode === 'with'
                  ? 'Agent entered recursive scraping loop. Execution severed automatically at step 3 when crossing $0.50 threshold. Total cost capped at $0.5002.'
                  : 'Agent entered circular API redirection. Ran 48 consecutive iterations overnight without supervision. Bill accrued: $48.50+ on developer API key.'}
              </p>
              <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Financial Risk:</span>
                <span className={`font-bold ${contrastMode === 'with' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {contrastMode === 'with' ? '$0.50 Hard Cap (Zero surprise)' : '$48.50 - $200+ Runaway'}
                </span>
              </div>
            </div>

            {/* Scenario 2: Mid-Stream Client Disconnect */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              contrastMode === 'with'
                ? 'bg-emerald-950/10 border-emerald-500/30 dark:bg-emerald-950/20'
                : 'bg-rose-950/10 border-rose-500/30 dark:bg-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔌</span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">2. Mid-Stream Tab Closure</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  contrastMode === 'with'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {contrastMode === 'with' ? 'Abort Shield Active' : 'Unmetered Revenue Loss'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-3">
                {contrastMode === 'with'
                  ? 'User closed browser after receiving 142 tokens of a 2,000 token essay. VibezCheck caught the abort signal, saved 142 tokens to database, and billed the customer.'
                  : 'User closed browser mid-stream. Standard route handler threw unhandled abort error; partial stream discarded from memory. Provider charged you $0.04, customer was billed $0.'}
              </p>
              <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Leakage:</span>
                <span className={`font-bold ${contrastMode === 'with' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {contrastMode === 'with' ? '0% Token Leakage' : '15-25% Unbilled Server Costs'}
                </span>
              </div>
            </div>

            {/* Scenario 3: Monetization & Profit Margin */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              contrastMode === 'with'
                ? 'bg-emerald-950/10 border-emerald-500/30 dark:bg-emerald-950/20'
                : 'bg-rose-950/10 border-rose-500/30 dark:bg-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📈</span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">3. Profit Markup & Stripe Billing</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  contrastMode === 'with'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {contrastMode === 'with' ? '+30% Automated Margin' : 'Flat-Rate Subsidy'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-3">
                {contrastMode === 'with'
                  ? 'Raw model cost is multiplied by 1.30x. Customer prepaid wallet is verified before execution and deducted in real time. Developer earns guaranteed margin on every generation.'
                  : 'Flat $20/month subscription. Heavy power users make 4,000 reasoning requests/month costing $85 in API fees, turning profitable accounts into net financial losses.'}
              </p>
              <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Unit Economics:</span>
                <span className={`font-bold ${contrastMode === 'with' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {contrastMode === 'with' ? 'Guaranteed +30% Net Profit' : 'Negative Margin Risk'}
                </span>
              </div>
            </div>

            {/* Scenario 4: Privacy & Zero Data Retention */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              contrastMode === 'with'
                ? 'bg-emerald-950/10 border-emerald-500/30 dark:bg-emerald-950/20'
                : 'bg-rose-950/10 border-rose-500/30 dark:bg-rose-950/20'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white">4. Privacy & Data Ownership</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  contrastMode === 'with'
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                }`}>
                  {contrastMode === 'with' ? '100% ZDR In-Memory' : 'Third-Party Proxy Logging'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed mb-3">
                {contrastMode === 'with'
                  ? 'All telemetry is computed locally in your process memory. Prompts and outputs are never stored, transmitted, or logged. Complete compliance with HIPAA and GDPR.'
                  : 'Traditional proxy gateways route all user conversations through third-party servers, storing raw conversation transcripts, PII, and company secrets on remote disks.'}
              </p>
              <div className="flex justify-between items-center text-[11px] font-mono pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
                <span className="text-slate-500 dark:text-zinc-400">Compliance:</span>
                <span className={`font-bold ${contrastMode === 'with' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {contrastMode === 'with' ? 'Enterprise Ready (ZDR)' : 'Data Leakage Exposure'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. DECOUPLED DATABASE SINKS (Bring Your Own Database)
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[11px] font-mono font-semibold">
              DECOUPLED SINKS IN V0.5.10
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bring Your Own Database. No Lock-in.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              We eliminated all hard dependencies on Prisma and raw SQL. Hook into Supabase, PostgreSQL, SQLite, or webhooks in 4 lines of code.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
            {/* Sinks Tabs */}
            <div className="flex items-center border-b border-slate-200 dark:border-zinc-800 px-4 py-2 bg-slate-50/70 dark:bg-zinc-950/60 gap-2 overflow-x-auto">
              {[
                { id: 'supabase', label: 'Supabase (Recommended)', badge: 'Cloud DB' },
                { id: 'postgres', label: 'PostgreSQL (pg / neon)', badge: 'SQL' },
                { id: 'sqlite', label: 'SQLite / Turso', badge: 'Embedded' },
                { id: 'custom', label: 'Webhook / In-Memory', badge: 'Custom' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSinkTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeSinkTab === tab.id
                      ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold shadow-2xs border border-slate-200/80 dark:border-zinc-700'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-200/60 dark:bg-zinc-700/60 text-slate-600 dark:text-zinc-300">
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Code Body */}
            <div className="p-5 font-mono text-xs overflow-x-auto leading-relaxed bg-slate-900 text-zinc-100">
              {activeSinkTab === 'supabase' && (
                <pre className="text-emerald-300">
                  {`import { vibezCheck } from 'vibezcheck';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const meter = vibezCheck({
  userId: 'usr_live_84920',
  maxCostUSD: 0.50, // Hard circuit breaker
  marginMultiplier: 1.30, // +30% developer profit margin
  onRecordUsage: async (event) => {
    // ✦ Automatically persists usage to your Supabase project
    await supabase.from('ai_usage_events').insert({
      user_id: event.userId,
      model: event.model,
      total_tokens: event.totalTokens,
      cost_usd: event.costUSD,
      latency_ms: event.latencyMs,
      created_at: new Date().toISOString(),
    });
  },
});`}
                </pre>
              )}

              {activeSinkTab === 'postgres' && (
                <pre className="text-sky-300">
                  {`import { vibezCheck } from 'vibezcheck';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const meter = vibezCheck({
  userId: 'usr_live_84920',
  onRecordUsage: async (event) => {
    await pool.query(
      \`INSERT INTO ai_telemetry (user_id, model, tokens, cost_usd, latency_ms)
       VALUES ($1, $2, $3, $4, $5)\`,
      [event.userId, event.model, event.totalTokens, event.costUSD, event.latencyMs]
    );
  },
});`}
                </pre>
              )}

              {activeSinkTab === 'sqlite' && (
                <pre className="text-amber-300">
                  {`import { vibezCheck } from 'vibezcheck';
import Database from 'better-sqlite3';

const db = new Database('./telemetry.db');

export const meter = vibezCheck({
  userId: 'usr_live_84920',
  onRecordUsage: async (event) => {
    db.prepare(\`
      INSERT INTO usage_ledger (user_id, model, tokens, cost_usd)
      VALUES (?, ?, ?, ?)
    \`).run(event.userId, event.model, event.totalTokens, event.costUSD);
  },
});`}
                </pre>
              )}

              {activeSinkTab === 'custom' && (
                <pre className="text-purple-300">
                  {`import { vibezCheck } from 'vibezcheck';

export const meter = vibezCheck({
  userId: 'usr_live_84920',
  onRecordUsage: async (event) => {
    // ✦ Send directly to your DataDog, Segment, or analytics webhook
    await fetch('https://api.your-company.com/v1/ai-telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  },
  onCircuitBreaker: async (alert) => {
    // Notify on Slack or PagerDuty
    console.warn('Circuit breaker tripped for', alert.userId, alert.costUSD);
  },
});`}
                </pre>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. HOW IT WORKS IN 3 LINES OF CODE
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
                SEAMLESS INTEGRATION
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Wrap Any Stream in 3 Lines of Code
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                VibezCheck wraps Vercel AI SDK <code className="text-emerald-600 dark:text-emerald-400 font-mono">streamText()</code>, LangChain, or vanilla fetch streams. No proxy re-routing, no API key handoff, zero architecture rewrite.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Works out of the box with Next.js 14/15 App Router & Pages Router</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Supports streaming tool calls, reasoning tokens, and structured outputs</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automatically handles client disconnects & serverless flushes</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href="/docs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>Read full integration guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0f172a] text-zinc-100 rounded-2xl border border-slate-800 p-5 font-mono text-xs shadow-lg overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-[11px] text-slate-400">
                <span>app/api/chat/route.ts</span>
                <span className="text-emerald-400 font-sans font-semibold">Next.js App Router</span>
              </div>
              <pre className="text-slate-300 leading-relaxed">
                <span className="text-purple-400">import</span> {'{ vibezCheck }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;vibezcheck&apos;</span>;{'\n'}
                <span className="text-purple-400">import</span> {'{ streamText }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;ai&apos;</span>;{'\n'}
                <span className="text-purple-400">import</span> {'{ openai }'} <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;@ai-sdk/openai&apos;</span>;{'\n\n'}
                <span className="text-purple-400">export async function</span> <span className="text-blue-400">POST</span>(req: Request) {'{\n'}
                {'  '}<span className="text-purple-400">const</span> {'{ messages, userId }'} = <span className="text-purple-400">await</span> req.<span className="text-blue-400">json</span>();{'\n\n'}
                {'  '}<span className="text-slate-500">// 1. Initialize meter with safety fuses and optional margin</span>{'\n'}
                {'  '}<span className="text-purple-400">const</span> meter = <span className="text-blue-400">vibezCheck</span>({'{'}{'\n'}
                {'    '}userId,{'\n'}
                {'    '}maxCostUSD: <span className="text-amber-400">0.50</span>, <span className="text-slate-500">// Trip wire kills runaway loops</span>{'\n'}
                {'    '}marginMultiplier: <span className="text-amber-400">1.30</span>, <span className="text-slate-500">// +30% profit markup</span>{'\n'}
                {'  '}{'}'});{'\n\n'}
                {'  '}<span className="text-slate-500">// 2. Wrap the AI SDK stream with 0ms added latency</span>{'\n'}
                {'  '}<span className="text-purple-400">return</span> meter.<span className="text-blue-400">wrapStream</span>({'\n'}
                {'    '}<span className="text-blue-400">streamText</span>({'{'}{'\n'}
                {'      '}model: <span className="text-blue-400">openai</span>(<span className="text-emerald-400">&apos;gpt-4o-mini&apos;</span>),{'\n'}
                {'      '}messages,{'\n'}
                {'    '}{'}'}){'\n'}
                {'  '});{'\n'}
                {'}'}
              </pre>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. CLIENT-SIDE UI COMPONENTS (<VibezReceipt /> & HUD)
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-mono font-semibold">
              DEVELOPER & USER TRUST
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Drop-In UI Micro-Badges & Receipts
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Give your users absolute billing transparency. Render real-time token receipts and cost badges with one line of React.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Interactive demo card 1: GPT-4o Mini */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">OpenAI Response</span>
                  <span className="text-[10px] font-mono text-slate-400">Chat Message</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mb-4">
                  &ldquo;Quantum computing leverages superposition and entanglement to solve complex mathematical problems exponentially faster than binary systems.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <VibezReceipt
                  model="openai/gpt-4o-mini"
                  tokens={138}
                  costUSD={0.00069}
                  latencyMs={110}
                  variant={receiptVariant}
                />
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Billed: $0.0009
                </span>
              </div>
            </div>

            {/* Interactive demo card 2: Claude 3.5 Sonnet */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Claude 3.5 Sonnet</span>
                  <span className="text-[10px] font-mono text-slate-400">Complex Reasoning</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mb-4">
                  &ldquo;Entanglement is nature&apos;s way of preserving joint states across space-time coordinates without electromagnetic signal propagation.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <VibezReceipt
                  model="anthropic/claude-3-5-sonnet"
                  tokens={214}
                  costUSD={0.0032}
                  latencyMs={185}
                  variant={receiptVariant}
                />
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Billed: $0.0042
                </span>
              </div>
            </div>

            {/* Interactive demo card 3: DeepSeek R1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">DeepSeek R1</span>
                  <span className="text-[10px] font-mono text-slate-400">Chain-of-Thought</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed mb-4">
                  &ldquo;P contains problems solvable in polynomial time; NP contains those verifiable in polynomial time. P vs NP remains open.&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                <VibezReceipt
                  model="deepseek/deepseek-r1"
                  tokens={182}
                  reasoningTokens={64}
                  costUSD={0.00045}
                  latencyMs={165}
                  variant={receiptVariant}
                />
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Billed: $0.0006
                </span>
              </div>
            </div>
          </div>

          {/* Variant Controls */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-xs text-slate-500 dark:text-zinc-400">Receipt Style:</span>
            {(['pill', 'minimal', 'card'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setReceiptVariant(v)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer capitalize ${
                  receiptVariant === v
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                    : 'bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* =========================================================================
            9. ZERO DATA RETENTION (ZDR) TRUST SECTION
        ========================================================================= */}
        <section className="w-full mt-24">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0b0f19] text-white border border-slate-800 relative overflow-hidden shadow-xl">
            {/* Background glowing orb */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Zero Data Retention Guarantee</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                Your Users&apos; Conversations Belong to You
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Unlike observability proxies that intercept, log, and store your customers&apos; private prompts and confidential model completions on third-party servers, VibezCheck operates with <strong>strict Zero Data Retention (ZDR)</strong>.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-bold font-mono text-emerald-400">0</div>
                  <div className="text-[11px] text-slate-400 mt-1">Prompts Stored</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-bold font-mono text-emerald-400">0</div>
                  <div className="text-[11px] text-slate-400 mt-1">Completions Stored</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-bold font-mono text-emerald-400">0</div>
                  <div className="text-[11px] text-slate-400 mt-1">Third-Party Egress</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xl font-bold font-mono text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-400 mt-1">In-Memory Telemetry</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/docs?section=privacy"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
                >
                  <span>Read Privacy & ZDR Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/docs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition"
                >
                  <span>Explore Security Standards</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            10. SUPPORTED PROVIDERS GRID
        ========================================================================= */}
        <section className="w-full mt-24 text-center">
          <div className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-6">
            Works with Any Model Provider & AI Framework
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { name: 'OpenAI', badge: 'GPT-4o & o3' },
              { name: 'Anthropic', badge: 'Claude 3.5' },
              { name: 'Google Gemini', badge: 'Gemini 2.5' },
              { name: 'xAI Grok', badge: 'Grok 4.6' },
              { name: 'DeepSeek', badge: 'DeepSeek R1' },
              { name: 'Meta Llama', badge: 'Llama 3.3' },
              { name: 'ElevenLabs', badge: 'Audio Multilingual' },
              { name: 'Whisper', badge: 'Audio Transcription' },
              { name: 'Luma AI', badge: 'Dream Machine Video' },
              { name: 'OpenRouter', badge: '200+ Models' },
            ].map((p) => (
              <div
                key={p.name}
                className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-800 dark:text-zinc-200 shadow-2xs flex items-center gap-2"
              >
                <span>{p.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            11. CALL TO ACTION BANNER
        ========================================================================= */}
        <section className="w-full mt-24 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-100 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-800 max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Stop Guessing Your AI Costs.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto">
              Add token metering, financial circuit breakers, and decoupled database storage in less than 5 minutes.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/docs"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div
                onClick={handleCopyCmd}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-mono text-xs cursor-pointer hover:border-slate-300 dark:hover:border-zinc-600 transition flex items-center gap-2"
              >
                <span>npx vibezcheck init</span>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =========================================================================
          12. COMPREHENSIVE FOOTER
      ========================================================================= */}
      <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-[#0c0c0e]/80 backdrop-blur-sm py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          {/* Col 1 */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Documentation</div>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <li><a href="/docs?section=quickstart" className="hover:text-slate-900 dark:hover:text-white transition">Quickstart</a></li>
              <li><a href="/docs?section=database" className="hover:text-slate-900 dark:hover:text-white transition">Supabase & Database Adapters</a></li>
              <li><a href="/docs?section=serverless" className="hover:text-slate-900 dark:hover:text-white transition">Serverless Spooling</a></li>
              <li><a href="/docs?section=wallets" className="hover:text-slate-900 dark:hover:text-white transition">Stripe Wallets & Top-ups</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Safety & Reliability</div>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <li><a href="/docs?section=circuit-breaker" className="hover:text-slate-900 dark:hover:text-white transition">Circuit Breakers</a></li>
              <li><a href="/docs?section=disconnects" className="hover:text-slate-900 dark:hover:text-white transition">Disconnect Shield</a></li>
              <li><a href="/docs?section=hud" className="hover:text-slate-900 dark:hover:text-white transition">Financial HUD & Receipts</a></li>
              <li><a href="/docs?section=privacy" className="hover:text-slate-900 dark:hover:text-white transition">Zero Data Retention (ZDR)</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-sm">Releases & Code</div>
            <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
              <li><a href="/releases" className="hover:text-slate-900 dark:hover:text-white transition">v0.5.10 Release Notes</a></li>
              <li><a href="https://github.com/seeyouin2x5x/vibezcheck-sdk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition">GitHub Repository</a></li>
              <li><a href="https://www.npmjs.com/package/vibezcheck" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition">NPM Registry</a></li>
              <li><a href="/docs?section=cli" className="hover:text-slate-900 dark:hover:text-white transition">CLI Suite</a></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white text-sm">VibezCheck Meter</div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
              Open-source, zero-dependency token telemetry and monetization middleware for modern AI applications.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-3 h-3" />
              <span>100% ZDR Verified</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500 gap-3">
          <div>© {new Date().getFullYear()} VibezCheck. Released under the MIT License.</div>
          <div className="flex items-center gap-4">
            <a href="/docs?section=privacy" className="hover:underline">Privacy Policy</a>
            <a href="/docs?section=faq" className="hover:underline">FAQ</a>
            <a href="https://github.com/seeyouin2x5x/vibezcheck-sdk" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
