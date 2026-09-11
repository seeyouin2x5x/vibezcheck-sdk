'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { VibezReceipt } from '@/components/vibez-meter';
import {
  Sparkles,
  Layers,
  ArrowLeft,
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ExternalLink
} from 'lucide-react';

const MODEL_RATES: Record<string, { input: number; output: number; cached: number; name: string }> = {
  'gpt-6-astra': { input: 3.00, output: 12.00, cached: 0.75, name: 'OpenAI GPT-6 Astra' },
  'claude-3-7-sonnet': { input: 3.00, output: 15.00, cached: 0.30, name: 'Anthropic Claude 3.7 Sonnet' },
  'magistral-small-latest': { input: 0.50, output: 1.50, cached: 0.10, name: 'Mistral Magistral Small' },
  'deepseek-v4.1-flash': { input: 0.20, output: 0.60, cached: 0.05, name: 'DeepSeek v4.1 Flash' },
};

export default function ArtifactsDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Interactive Simulator State
  const [selectedModel, setSelectedModel] = useState<string>('gpt-6-astra');
  const [margin, setMargin] = useState<number>(1.30);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [inputTokens, setInputTokens] = useState<number>(1200);
  const [outputTokens, setOutputTokens] = useState<number>(340);
  const [cachedTokens, setCachedTokens] = useState<number>(850);
  const [activeTab, setActiveTab] = useState<'preview' | 'react' | 'html'>('preview');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Streaming ticker simulation
  useEffect(() => {
    let interval: any;
    if (isStreaming) {
      interval = setInterval(() => {
        setOutputTokens((prev) => prev + Math.floor(Math.random() * 60) + 15);
      }, 140);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Financial calculations
  const rate = MODEL_RATES[selectedModel];
  const regularInput = Math.max(0, inputTokens - cachedTokens);
  const wholesaleUSD = ((regularInput * rate.input) + (cachedTokens * rate.cached) + (outputTokens * rate.output)) / 1_000_000;
  const noCacheWholesaleUSD = ((inputTokens * rate.input) + (outputTokens * rate.output)) / 1_000_000;
  const cacheDiscountUSD = Math.max(0, noCacheWholesaleUSD - wholesaleUSD);
  const billedUSD = wholesaleUSD * margin;
  const profitUSD = billedUSD - wholesaleUSD;
  const totalTokens = inputTokens + outputTokens;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-24 space-y-12">
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Documentation
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
              ● Generative UI & Artifacts
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
              v0.5.5
            </span>
          </div>
        </div>

        {/* Page Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Generative UI
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
            Rendering VibezCheck UI in AI Artifacts
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Modern AI apps don&apos;t just stream plain text anymore. They produce rich, interactive artifacts—such as live dashboards, code sandboxes, and interactive widgets. Learn how to render VibezCheck token counters, micro-receipt badges, and customer wallet HUDs directly inside AI artifacts with zero added latency.
          </p>
        </header>

        {/* What are Artifacts Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-emerald-500" />
            What is Generative UI in AI Artifacts?
          </h3>
          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            In platforms like <strong>Claude Artifacts</strong>, <strong>ChatGPT Canvas</strong>, <strong>Google Antigravity</strong>, and <strong>v0</strong>, the assistant generates isolated UI components that run in a side pane or inline frame. 
            By dropping VibezCheck components into these artifacts, you provide immediate cost transparency and financial metering to your end users:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">1. MICRO-RECEIPTS</span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                A featherweight badge pinned to each generated artifact displaying token count, wholesale price, and model name.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 block">2. MARGIN VISIBILITY</span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Automatically calculate and display customer retail bills based on your custom profit markup multiplier (e.g. 1.30x).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">3. SAFETY FUSES</span>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Visual indicators that trip and safely halt execution when an autonomous agent reaches its predefined budget limit.
              </p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SANDBOX SECTION */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Live Interactive Artifact Sandbox
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Interact with the live VibezCheck UI below to see real-time token accumulation and cost calculations:
              </p>
            </div>

            {/* Sandbox Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'preview' ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                Live Preview
              </button>
              <button
                onClick={() => setActiveTab('react')}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'react' ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                React Component
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'html' ? 'bg-white dark:bg-zinc-800 text-slate-950 dark:text-white shadow-xs font-semibold' : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'}`}
              >
                HTML / Iframe Spec
              </button>
            </div>
          </div>

          {/* Sandbox Body */}
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
            
            {activeTab === 'preview' && (
              <div className="p-6 space-y-6">
                {/* Control Toolbar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
                  {/* Model Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 uppercase">
                      Select Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {Object.entries(MODEL_RATES).map(([id, info]) => (
                        <option key={id} value={id}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Margin Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-slate-500 dark:text-zinc-400 uppercase">Profit Margin</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {margin.toFixed(2)}x (+{Math.round((margin - 1) * 100)}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="2.0"
                      step="0.05"
                      value={margin}
                      onChange={(e) => setMargin(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  {/* Stream Simulation Button */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 uppercase">
                      Stream Controls
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsStreaming(!isStreaming)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          isStreaming
                            ? 'bg-amber-500 hover:bg-amber-600 text-black'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-black'
                        }`}
                      >
                        {isStreaming ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            Pause Stream
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            Simulate Stream
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsStreaming(false);
                          setOutputTokens(340);
                        }}
                        title="Reset token counts"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Chat Message Artifact Representation */}
                <div className="p-5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                        ✦
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        AI Output in Artifact Sandbox
                      </span>
                      {isStreaming && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Streaming deltas...
                        </span>
                      )}
                    </div>

                    {/* RENDERED VIBEZRECEIPT COMPONENT */}
                    <VibezReceipt
                      model={selectedModel}
                      tokens={totalTokens}
                      costUSD={billedUSD}
                      variant="pill"
                    />
                  </div>

                  {/* Message Content */}
                  <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 font-sans text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                    &quot;When rendering UI within AI artifacts, the host iframe requires ultra-lightweight components that do not cause layout thrashing. VibezCheck delivers a zero-latency micro-receipt that mounts in sub-millisecond time and provides users with complete transparency over prompt cache savings and retail charges.&quot;
                  </div>
                </div>

                {/* Real-Time Financial Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 block">
                      Wholesale Cost
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
                      ${wholesaleUSD.toFixed(6)}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">
                      Raw API rate
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 block">
                      Billed (Stripe)
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums block">
                      ${billedUSD.toFixed(6)}
                    </span>
                    <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 block">
                      With {margin.toFixed(2)}x margin
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 block">
                      Net Profit
                    </span>
                    <span className="text-base font-bold font-mono text-cyan-600 dark:text-cyan-400 tabular-nums block">
                      ${profitUSD.toFixed(6)}
                    </span>
                    <span className="text-[10px] text-cyan-600/80 dark:text-cyan-400/80 block">
                      Your business income
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-zinc-400 block">
                      Cache Discount
                    </span>
                    <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums block">
                      ${cacheDiscountUSD.toFixed(6)}
                    </span>
                    <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 block">
                      Saved from KV cache
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'react' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Next.js App Router / React Implementation
                  </span>
                  <button
                    onClick={() => copyToClipboard(`import { VibezReceipt, VibezCheck } from 'vibezcheck/react';

export function ArtifactMessage({ message }) {
  return (
    <div className="space-y-2 p-4 border rounded-xl">
      <p>{message.content}</p>
      
      {/* Renders the micro-badge cleanly inside your artifact */}
      <VibezReceipt 
        message={message} 
        variant="pill" 
      />
    </div>
  );
}`, 'react-code')}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {copiedCode === 'react-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Code
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{`import { VibezReceipt, VibezCheck } from 'vibezcheck/react';

export function ArtifactMessage({ message }) {
  return (
    <div className="space-y-2 p-4 border rounded-xl">
      <p>{message.content}</p>
      
      {/* Renders the micro-badge cleanly inside your artifact */}
      <VibezReceipt 
        message={message} 
        variant="pill" 
      />
    </div>
  );
}`}</code>
                </pre>
              </div>
            )}

            {activeTab === 'html' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    Standalone HTML / Iframe Artifact Boilerplate
                  </span>
                  <button
                    onClick={() => copyToClipboard(`<!-- Include allowlisted Tailwind stylesheet -->
<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>

<!-- Self-Contained VibezReceipt Micro-Badge Container -->
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]">
  <span class="text-emerald-500 font-bold">✦</span>
  <span class="font-semibold tabular-nums">$0.0032</span>
  <span class="text-[var(--muted-foreground)]">·</span>
  <span class="text-[var(--muted-foreground)]">1,250 tok</span>
  <span class="text-[var(--muted-foreground)]">·</span>
  <span class="text-[var(--muted-foreground)]">gpt-6-astra</span>
</div>`, 'html-code')}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {copiedCode === 'html-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Code
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-900 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{`<!-- Include allowlisted Tailwind stylesheet -->
<script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>

<!-- Self-Contained VibezReceipt Micro-Badge Container -->
<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]">
  <span class="text-emerald-500 font-bold">✦</span>
  <span class="font-semibold tabular-nums">$0.0032</span>
  <span class="text-[var(--muted-foreground)]">·</span>
  <span class="text-[var(--muted-foreground)]">1,250 tok</span>
  <span class="text-[var(--muted-foreground)]">·</span>
  <span class="text-[var(--muted-foreground)]">gpt-6-astra</span>
</div>`}</code>
                </pre>
              </div>
            )}

          </div>
        </section>

        {/* Integration Instructions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            How It Works in Production
          </h2>

          <div className="space-y-3">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  1. Automatic Annotation Transmission
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  When your backend route wraps the AI model with <code className="font-mono text-emerald-600 dark:text-emerald-400">vibezcheck(model)</code>, token usage and cost metrics are automatically appended as stream annotations to the client without adding proxy latency.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  2. Dynamic Theming via CSS Tokens
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  The component automatically adopts semantic theme tokens (<code className="font-mono text-slate-700 dark:text-zinc-300">--card</code>, <code className="font-mono text-slate-700 dark:text-zinc-300">--border</code>, <code className="font-mono text-slate-700 dark:text-zinc-300">--foreground</code>), rendering seamlessly in both light mode and dark mode.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  3. Built-In Runaway Circuit Breaker
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  If an autonomous agent script inside an artifact gets caught in an infinite loop, VibezCheck trips the circuit breaker before the bill escalates, freezing execution and alerting the user.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick CTA Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-zinc-950 text-white border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Ready to Scaffold?
            </span>
            <span className="text-xs font-mono text-zinc-400">v0.5.5</span>
          </div>

          <h3 className="text-xl font-bold">Try the Next.js SaaS Starter with Artifacts Pre-Configured</h3>
          <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
            Get complete source code with customer wallets, Stripe Checkout, and live &lt;VibezReceipt /&gt; components in one command:
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 flex-1 select-all">
              $ npx vibezcheck example nextjs-saas-starter ./my-ai-saas
            </div>
            <Link
              href="/docs?section=tutorial"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
            >
              Interactive Tutorial
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/docs"
            className="text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            ← Back to Docs Home
          </Link>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            VibezCheck v0.5.5 • Open Source MIT
          </span>
        </div>
      </main>
    </div>
  );
}
