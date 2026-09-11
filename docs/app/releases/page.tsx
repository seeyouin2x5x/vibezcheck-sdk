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
  Coins
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
              v0.5.4
            </span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 mb-10">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            <span>Product & AI Infrastructure</span>
            <span>•</span>
            <span>September 11, 2026</span>
            <span>•</span>
            <span>4 Min Read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Release 0.5.4: Unbreakable Reasoning Streams, Smarter Agent Memory & 2026 Models
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            When modern AI agents tackle complex challenges—analyzing code, drafting legal briefs, or running autonomous workflows—they don&apos;t just spit out words. They <span className="font-semibold text-slate-900 dark:text-zinc-200">think step-by-step</span>. Version 0.5.4 ensures thinking thoughts are never interrupted, structured token meters never fail, and humans never face surprise invoices.
          </p>
        </header>

        {/* Hero Banner (Generated with Nano Banana) */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl bg-black mb-12 group">
          <img
            src="/release-v054.jpg"
            alt="VibezCheck 0.5.4 Architectural Artwork: AI Agent Hub and Synchronized Billing Shields"
            className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <span>Visual Concept: Autonomous AI Hub & Token Synchronization</span>
            <span className="hidden sm:inline text-zinc-400">Rendered via Nano Banana Studio</span>
          </div>
        </div>

        {/* Article Body */}
        <article className="space-y-12">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              The Big Picture in Plain English
            </h3>
            <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-4">
              AI infrastructure is going through its biggest leap forward: models now carry their own internal deliberation processes, and providers send usage data in detailed nested cards instead of single flat numbers. 
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">01. STREAM RESILIENCE</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Reasoning streams flow unhindered without premature cut-offs.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-1">02. MULTI-PART TOKENS</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Automatic unwrapping for cache reads, writes, and thinking tokens.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">03. 2026 MODELS SYNC</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Wholesale pricing tables synced for GPT-6 Astra, Magistral & DeepSeek v4.1.</span>
              </div>
            </div>
          </div>

          {/* Section: Benefits for AI Agents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                1. What This Means for Autonomous AI Agents
              </h2>
            </div>
            
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              When an agent solves hard problems—like executing a multistep code refactor or searching clinical literature—it relies on uninterrupted internal thinking. Here is how version 0.5.4 empowers agents:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unbroken Stream of Consciousness</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Certain high-speed providers (Groq, xAI, Moonshot) transmit empty tool check signals during reasoning steps. VibezCheck 0.5.4 recognizes these patterns immediately, ensuring thinking steps aren&apos;t accidentally severed.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero Agent Crash on Token Cards</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  The upstream AI SDK specification transitioned token metrics from plain numbers to nested records. VibezCheck unpacks these without breaking, eliminating &quot;NaN&quot; computation dead-ends.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant Model Routing</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Agents can switch dynamically between <code className="font-mono text-emerald-600 dark:text-emerald-400">magistral-small-latest</code>, <code className="font-mono text-emerald-600 dark:text-emerald-400">gpt-6-astra</code>, or fast router gateways without manual configuration updates.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sub-Millisecond Overhead</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Token counting and cost estimation occur completely off the critical request loop. Agents respond at maximum speed with zero added response lag.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Benefits for Humans & App Builders */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Coins className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                2. What This Means for Humans & Developers
              </h2>
            </div>

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              If you build software, charge customers, or manage company AI budgets, predictable financial guardrails are non-negotiable:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Zero Surprise Bills with Deep Cache Discounts</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Modern models offer 50% to 90% cost reductions when reusing cached prompts. VibezCheck accurately deducts cache discounts before charging customer balances, giving your users fair, transparent pricing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <TrendingUp className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Automatic Profit Margin Protection</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Set a simple markup (e.g., <code className="font-mono text-cyan-600 dark:text-cyan-400">margin: 1.25</code> for 25% profit). VibezCheck tracks the true wholesale API cost in real-time, adds your margin, and passes the retail charge to Stripe without spreadsheets.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Runaway Loop Circuit Breaker</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    If an autonomous script gets caught in an infinite self-prompting loop, VibezCheck triggers a clean cutoff the exact instant a customer&apos;s budget ceiling or safe spending limit is touched.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Supported 2026 Models Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-purple-500" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  New 2026 Models Synced in 0.5.4
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
                100% Upstream Wholesale Rates
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono">
                    <th className="py-3 px-4 font-semibold">Model Identifier</th>
                    <th className="py-3 px-4 font-semibold">Provider / Family</th>
                    <th className="py-3 px-4 font-semibold">Input / 1M</th>
                    <th className="py-3 px-4 font-semibold">Output / 1M</th>
                    <th className="py-3 px-4 font-semibold">Cache Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-mono">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">gpt-6-astra</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">OpenAI Next-Gen</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$3.00</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$12.00</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">$0.75 (75% off)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">magistral-small-latest</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">Mistral Reasoning</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.50</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$1.50</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">$0.10 (80% off)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">magistral-medium-latest</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">Mistral Frontier</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$2.00</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$6.00</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">$0.40 (80% off)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">deepseek-v4.1-flash</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">DeepSeek High-Speed</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.20</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.60</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">$0.05 (75% off)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">mercury-2.5</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">Gateway Fast Router</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.25</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400">$0.75</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">$0.05 (80% off)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Upgrade Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-zinc-950 text-white border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Instant 10-Second Upgrade
              </span>
              <span className="text-xs font-mono text-zinc-400">100% Backward Compatible</span>
            </div>

            <h3 className="text-xl font-bold">Ready to empower your agents?</h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              No code rewrites required. Upgrading to version 0.5.4 brings all thinking protections and model catalogs straight to your existing setup.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 flex-1 select-all">
                $ npm install vibezcheck@latest
              </div>
              <Link
                href="/docs?section=tutorial"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
              >
                Try Interactive Tutorial
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
            VibezCheck v0.5.4 • Open Source MIT
          </span>
        </div>
      </main>
    </div>
  );
}
