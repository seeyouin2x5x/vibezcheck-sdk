'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp,
  Boxes,
  Lock,
  Compass,
  Coins,
  Database,
  Layers,
  Server
} from 'lucide-react';

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
              ● Latest Release
            </span>
            <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
              v0.5.10
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <span>Product & AI Infrastructure</span>
            <span>•</span>
            <span>September 16, 2026</span>
            <span>•</span>
            <span>5 Min Read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Release 0.5.10: Decoupled Database Sinks, Universal DIY Adapters & Serverless Spooling
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Modern AI applications need fast, dependable financial metering without being locked into heavy ORMs or risking dropped usage events in serverless environments. Version <span className="font-semibold text-slate-900 dark:text-zinc-200">0.5.10</span> introduces decoupled database sinks, the pluggable DIY <code className="font-mono text-emerald-600 dark:text-emerald-400">createDatabaseAdapter</code>, native Metronome ingestion, zero-drop serverless lifecycle spooling, and standardized <code className="font-mono text-emerald-600 dark:text-emerald-400">&lt;VibezCheck /&gt;</code> UI components.
          </p>
        </header>

        {/* Article Body */}
        <article className="space-y-12">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              What Was Shipped in v0.5.10 at a Glance
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
              We eliminated tight ORM couplings to keep the core library 100% self-contained (<code className="font-mono text-xs">dependencies: &#123;&#125;</code>) while giving developers unlimited flexibility to store billing records anywhere.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">01. DECOUPLED SINKS</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Supabase native, universal DIY adapter for Drizzle/Kysely, and Metronome billing.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-1">02. SERVERLESS SPOOLING</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Zero dropped events with globalThis.after(), waitUntil(), and vibezcheck.flush().</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">03. &lt;VibezCheck /&gt; HUD</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Standardized primary HUD component with zero props and multi-model breakdowns.</span>
              </div>
            </div>
          </div>

          {/* Section 1: Decoupled Database Sinks */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                1. Streamlined Database Sinks & Universal DIY Adapters
              </h2>
            </div>
            
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              Earlier versions bundled heavy ORM schema definitions. In 0.5.10, we removed hard-coded Prisma and raw SQL couplings, establishing an unopinionated, pluggable sink model:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>First-Party Supabase</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Pass your Supabase client directly. Automatically spools usage rows to <code className="font-mono text-emerald-600 dark:text-emerald-400">vibez_usage</code> or custom tables with optional balance verification.
                </p>
                <div className="pt-2 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                  <code>vibezcheck.supabase(client)</code>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Universal DIY Adapter</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Connect Drizzle, Kysely, MongoDB, ClickHouse, or webhooks using a single asynchronous callback. Fully isolated so database errors never disrupt inference.
                </p>
                <div className="pt-2 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                  <code>vibezcheck.database(async fn)</code>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Metronome Ingestion</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Send usage data directly to Metronome’s <code className="font-mono text-purple-600 dark:text-purple-400">/v1/ingest</code> endpoint with zero third-party dependencies using native HTTP fetch.
                </p>
                <div className="pt-2 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                  <code>vibezcheck.metronome(&#123; apiKey &#125;)</code>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Serverless Spooling */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Server className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                2. Serverless Lifecycle Spooling (Zero Dropped Events)
              </h2>
            </div>

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              Serverless workers (Next.js App Router on Vercel, AWS Lambda, Cloudflare Workers) terminate immediately after streaming the final token. VibezCheck 0.5.10 guarantees zero dropped events:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <Zap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Native Lifecycle Hooks (after &amp; waitUntil)</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    VibezCheck automatically binds to <code className="font-mono text-emerald-600 dark:text-emerald-400">globalThis.after()</code> on Next.js/Vercel and <code className="font-mono text-emerald-600 dark:text-emerald-400">globalThis.waitUntil()</code> on Cloudflare Workers, keeping execution alive off the user-critical path until all queued events are persisted.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Explicit vibezcheck.flush() Guarantee</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    For standalone workers, microservices, or scheduled jobs, calling <code className="font-mono text-cyan-600 dark:text-cyan-400">await vibezcheck.flush()</code> drains all active batch queues synchronously before the process terminates.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Standardized UI Component */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                3. Standardized &lt;VibezCheck /&gt; React HUD
              </h2>
            </div>

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              The primary telemetry component is now cleanly named <code className="font-mono text-purple-600 dark:text-purple-400">&lt;VibezCheck /&gt;</code> (with <code className="font-mono text-xs">&lt;VibezCheckHUD /&gt;</code> preserved as an alias for complete backward compatibility):
            </p>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-3">
              <div className="font-mono text-xs text-slate-800 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-950 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 overflow-x-auto">
                <code>import &#123; VibezCheck, VibezReceipt &#125; from &apos;vibezcheck/ui&apos;;<br /><br />
                &lt;VibezCheck messages=&#123;messages&#125; /&gt;</code>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 dark:text-zinc-400">
                <div>• <strong>Zero Props Required</strong>: Automatically aggregates tokens &amp; costs directly from AI SDK <code className="font-mono">messages</code>.</div>
                <div>• <strong>Unit Toggling</strong>: Users can click to switch between Dollar Cost (<code className="font-mono">$0.0028</code>) and Tokens (<code className="font-mono">1,420 tok</code>).</div>
                <div>• <strong>Multi-Model Splits</strong>: Shows clear breakdowns if a conversation uses multiple models.</div>
                <div>• <strong>Customer Privacy</strong>: Wholesale developer margins remain hidden from end-users by default.</div>
              </div>
            </div>
          </section>

          {/* Section 4: 700+ Offline Pricing Catalog */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-amber-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Bundled 700+ Models with Dynamic Sync
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                0ms Offline Calculations
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
              Every package release comes pre-bundled with exact rates for over 700 models across OpenAI, Anthropic, Google Gemini, DeepSeek, Meta Llama, Mistral, and AWS Bedrock. Plus, non-blocking background sync automatically ingests the latest rate cards from Vercel AI Gateway and Stripe Metronome.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono">
                    <th className="py-3 px-4 font-semibold">Model Identifier</th>
                    <th className="py-3 px-4 font-semibold">Provider / Family</th>
                    <th className="py-3 px-4 font-semibold">Input / 1M</th>
                    <th className="py-3 px-4 font-semibold">Output / 1M</th>
                    <th className="py-3 px-4 font-semibold">Latency / Overhead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-mono">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">gpt-4o-mini</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">OpenAI</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.15</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.60</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">0ms (In-Memory)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">claude-3-7-sonnet</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">Anthropic</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$3.00</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$15.00</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">0ms (In-Memory)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">gemini-2.0-flash</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">Google</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.10</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.40</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">0ms (In-Memory)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">deepseek-r1</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">DeepSeek</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.55</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$2.19</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">0ms (In-Memory)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Upgrade Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-zinc-950 text-white border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Instant Upgrade to v0.5.10
              </span>
              <span className="text-xs font-mono text-zinc-400">100% Backward Compatible</span>
            </div>

            <h3 className="text-xl font-bold">Ready to ship production AI billing?</h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Upgrade in seconds. Zero runtime dependencies added, all previous adapters and components remain fully functional with deprecation-free aliases.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 flex-1 select-all">
                $ npm install vibezcheck@latest
              </div>
              <Link
                href="/docs?section=database"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
              >
                View Database Sinks
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/docs"
            className="text-xs font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            Explore Documentation
          </Link>
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            VibezCheck v0.5.10 • Open Source MIT
          </span>
        </div>
      </main>
    </div>
  );
}
