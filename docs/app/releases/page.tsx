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
  Terminal,
  Layers
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
              v0.5.5
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
            Release 0.5.5: Instant Starter Templates via npx, OpenRouter + Stripe Synergy & Piggy-Bank Budget Protection
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
            Building production AI software should not require hours of manual boilerplate or fear of runaway API bills. Version 0.5.5 introduces instant project scaffolding with <span className="font-semibold text-slate-900 dark:text-zinc-200">npx vibezcheck examples</span>, seamless OpenRouter-to-Stripe token billing, and piggy-bank safety fuses to safeguard developer profit margins.
          </p>
        </header>

        {/* Hero Banner (OpenRouter + Stripe Synergy with Piggy Bank Illustration) */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl bg-black mb-12 group">
          <img
            src="/release-v055.jpg"
            alt="VibezCheck 0.5.5 Artwork: OpenRouter and Stripe Integration with Piggy-Bank Budget Discipline"
            className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-300 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
            <span>Visual Concept: OpenRouter Model Routing + Stripe Metering Synergy with Piggy-Bank Discipline</span>
            <span className="hidden sm:inline text-zinc-400">VibezCheck 0.5.5</span>
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
              Version 0.5.5 bridges the gap between rapid prototyping and bulletproof commercial monetization:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold mb-1">01. NPX SCAFFOLDER</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Scaffold complete Next.js AI SaaS starters and scripts with a single command.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold mb-1">02. OPENROUTER + STRIPE</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Route 300+ models dynamically and meter usage straight to Stripe with custom margins.</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-700/50">
                <span className="block text-xs font-mono text-amber-600 dark:text-amber-400 font-bold mb-1">03. PIGGY-BANK GUARD</span>
                <span className="text-xs text-slate-600 dark:text-zinc-300">Hard-limit spending per request and per customer to prevent runaway invoice spikes.</span>
              </div>
            </div>
          </div>

          {/* Section 1: npx vibezcheck examples */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Terminal className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                1. One-Line Project Scaffolding with npx
              </h2>
            </div>
            
            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              Developers no longer need to manually configure Next.js App Router endpoints, Stripe meter webhooks, or wallet balances. Everything is pre-wired and ready to run with the new CLI scaffolder:
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-zinc-200 font-mono text-xs space-y-2 border border-slate-800 shadow-inner">
              <div className="text-zinc-500"># Explore the official template catalog</div>
              <div className="text-emerald-400">$ npx vibezcheck examples --list</div>
              <div className="text-zinc-500 pt-2"># Scaffold the production Next.js 15 AI SaaS Starter</div>
              <div className="text-cyan-400">$ npx vibezcheck example nextjs-saas-starter ./my-ai-saas</div>
              <div className="text-zinc-500 pt-2"># Download standalone zero-dependency scripts</div>
              <div className="text-amber-400">$ npx vibezcheck example 01-local-cost-meter</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Next.js 15 AI SaaS Starter</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Complete with customer prepaid wallets, Stripe Checkout sessions, &lt;VibezReceipt /&gt; badges, automatic profit markups, and synced 2026 models.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 space-y-2">
                <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Autonomous Reasoning Agent Loop</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Demonstrates multistep thinking loops, handling reasoning deltas with empty tool checks, and safety circuit breakers configured at $0.50 cutoff.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: OpenRouter + Stripe Synergy */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                2. OpenRouter Flexibility Meets Stripe Financial Infrastructure
              </h2>
            </div>

            <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
              OpenRouter gives developers unified access to hundreds of frontier and open-weight models with instant fallback routing. VibezCheck connects OpenRouter directly to Stripe:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <Coins className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Unified Multi-Model Rate Card</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    VibezCheck automatically extracts wholesale token rates from OpenRouter response headers and maps them directly to your Stripe Meter billing events.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <TrendingUp className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Guaranteed Profit Margin</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Specify your markup multiplier (e.g. <code className="font-mono text-cyan-600 dark:text-cyan-400">margin: 1.30</code> for 30% profit). Your customers are charged retail price while you retain predictable profit on every token stream.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Piggy-Bank Budget Discipline</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Prevent surprise cloud bills. If an agent script gets caught in an infinite self-prompting loop or a user exceeds their prepaid balance, VibezCheck triggers an immediate, graceful stream disconnect.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Upgrade Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-zinc-950 text-white border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                Instant Upgrade
              </span>
              <span className="text-xs font-mono text-zinc-400">v0.5.5 • 100% Backward Compatible</span>
            </div>

            <h3 className="text-xl font-bold">Try the official templates right now</h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Run one command to test the new templates or update your existing project in seconds:
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <div className="px-4 py-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-emerald-400 flex-1 select-all">
                $ npx vibezcheck examples --list
              </div>
              <Link
                href="/docs?section=tutorial"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
              >
                Explore Interactive Docs
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
            VibezCheck v0.5.5 • Open Source MIT
          </span>
        </div>
      </main>
    </div>
  );
}
