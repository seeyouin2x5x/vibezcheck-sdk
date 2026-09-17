'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { AiSdkShowcase } from '@/components/ai-sdk-showcase';
import { DefinitionSection } from '@/components/definition-section';
import {
  TheProblemSection,
  MeasureSection,
  ControlSection,
  MonetizeSection,
  QuickStartSection,
  BeforeAfterSection,
  TechnicalTrustSection,
  FaqAeoSection,
} from '@/components/seo-sections';
import { FooterSection } from '@/components/footer-section';
import { Copy, Check } from 'lucide-react';

export default function Home() {
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);
  const [audienceTab, setAudienceTab] = useState<'humans' | 'agents' | 'calculator'>('humans');
  const [providerPkg, setProviderPkg] = useState<string>('@ai-sdk/anthropic');
  const [coreSdkPkg, setCoreSdkPkg] = useState<string>('@anthropic-ai/sdk');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'agents' || tab === 'humans' || tab === 'calculator') {
        setAudienceTab(tab);
      }
    }
  }, []);

  const [cmdTab, setCmdTab] = useState<'install' | 'init' | 'ai-sdk'>('install');
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'bun'>('npm');

  const currentCommand = useMemo(() => {
    if (cmdTab === 'init') {
      if (pkgManager === 'pnpm') return 'pnpm dlx vibezcheck init';
      if (pkgManager === 'bun') return 'bunx vibezcheck init';
      return 'npx vibezcheck init';
    }
    if (cmdTab === 'install') {
      if (pkgManager === 'npm') return 'npm install vibezcheck';
      return `${pkgManager} add vibezcheck`;
    }
    // ai-sdk
    if (pkgManager === 'npm') return `npm install ai ${providerPkg} vibezcheck`;
    return `${pkgManager} add ai ${providerPkg} vibezcheck`;
  }, [cmdTab, pkgManager, providerPkg]);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-[#0c0d10] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Section 1 — Hero (Spec Sections 4.1 & 54) */}
        <section className="text-center max-w-2xl mx-auto mt-6 mb-8 space-y-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            ✦ VIBEZCHECK · THE COST LAYER FOR AI APPLICATIONS
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50 leading-[1.08]">
            Know what every AI request costs.
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-normal max-w-xl mx-auto">
            Measure AI usage in real dollars, control runaway AI spending, and connect model costs to customers, features, and revenue.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs?section=quickstart"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white text-slate-950 text-sm font-semibold hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Get started →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition cursor-pointer"
            >
              Read the docs →
            </Link>
            <Link
              href="/llm-cost-calculator"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 text-sm font-medium transition cursor-pointer"
            >
              Cost Calculator
            </Link>
          </div>

          {/* Hero Proof Line */}
          <div className="pt-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
            TypeScript · 0 runtime dependencies · No proxy required · Offline-capable pricing
          </div>

          {/* Section 4.2: First Crawlable Paragraph (SSR Normal HTML Text for Search & AEO) */}
          <div className="mt-4 p-4 rounded-xl bg-slate-100/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed text-left sm:text-center">
            <strong>VibezCheck is a TypeScript SDK for AI cost monitoring and LLM usage metering.</strong> It calculates the provider cost of AI model requests from usage data, attributes spending to customers and features, and helps applications control AI spending with request and agent budgets.
          </div>

          {/* Core Economic Flow Diagram & Concrete Output (Spec Section 4.3 & 54) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">AI request</span>
              <span>→</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">usage</span>
              <span>→</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">provider cost</span>
              <span>→</span>
              <span className="text-slate-800 dark:text-zinc-200 font-semibold">customer economics</span>
            </div>
            <div className="hidden sm:inline text-slate-300 dark:text-zinc-700">|</div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
              ✦ $0.0028 · 1,420 tok · gpt-4o-mini
            </div>
          </div>
        </section>

        {/* Unified Command Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs text-xs mb-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCmdTab('install')}
              className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                cmdTab === 'install'
                  ? 'border border-slate-900/80 dark:border-zinc-600 font-semibold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-zinc-800'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              npm install
            </button>
            <button
              onClick={() => setCmdTab('init')}
              className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                cmdTab === 'init'
                  ? 'border border-slate-900/80 dark:border-zinc-600 font-semibold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-zinc-800'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              CLI Init
            </button>
            <button
              onClick={() => setCmdTab('ai-sdk')}
              className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                cmdTab === 'ai-sdk'
                  ? 'border border-slate-900/80 dark:border-zinc-600 font-semibold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-zinc-800'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              + AI SDK
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono border-l border-slate-200 dark:border-zinc-800 pl-3">
            {(['npm', 'pnpm', 'bun'] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => setPkgManager(pm)}
                className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                  pkgManager === pm
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {pm}
              </button>
            ))}
          </div>

          <div
            onClick={handleCopyCmd}
            className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-700 dark:text-zinc-300 cursor-pointer hover:text-slate-950 dark:hover:text-white transition group"
          >
            <span className="text-slate-400 dark:text-zinc-500">$</span>
            <span className="font-semibold">{currentCommand}</span>
            {copiedCmd ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 ml-1" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 group-hover:text-slate-700 dark:group-hover:text-zinc-200 ml-1 transition" />
            )}
          </div>
        </div>

        {/* Centerpiece Interactive Demo Sandbox + Scrolling Models Marquee */}
        <div id="demo" className="w-full scroll-mt-20">
          <AiSdkShowcase
            audienceTab={audienceTab}
            onAudienceChange={setAudienceTab}
            onProviderPkgChange={setProviderPkg}
            onCorePkgChange={setCoreSdkPkg}
          />
        </div>
      </div>

      {/* What VibezCheck Is — and Is Not */}
      <DefinitionSection />

      {/* Section 2 — The Problem (Spec Section 5.2) */}
      <TheProblemSection />

      {/* Section 3 — Measure (Spec Section 5.3) */}
      <MeasureSection />

      {/* Section 4 — Control (Spec Section 5.4) */}
      <ControlSection />

      {/* Section 5 — Monetize (Spec Section 5.5) */}
      <MonetizeSection />

      {/* Section 6 — Quick Start (Spec Section 6) */}
      <QuickStartSection />

      {/* Section 7 — Before / After (Spec Section 7) */}
      <BeforeAfterSection />

      {/* Section 8 — Social Proof / Technical Trust (Spec Section 8) */}
      <TechnicalTrustSection />

      {/* Section 9 — FAQ (Visible AEO Block with 13 Exact Questions, Spec Section 9) */}
      <FaqAeoSection />

      {/* Section 10 — Final CTA & Footer (Spec Sections 42 & 43) */}
      <FooterSection />
    </main>
  );
}
