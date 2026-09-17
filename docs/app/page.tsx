'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { AiSdkShowcase } from '@/components/ai-sdk-showcase';
import { DefinitionSection } from '@/components/definition-section';
import { ProblemSection } from '@/components/problem-section';
import { PrimitivesSection } from '@/components/primitives-section';
import { MonetizationSection } from '@/components/monetization-section';
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

  const [cmdTab, setCmdTab] = useState<'cli' | 'core' | 'ai-sdk'>('core');
  const [pkgManager, setPkgManager] = useState<'pnpm' | 'npm' | 'bun'>('pnpm');

  const currentCommand = useMemo(() => {
    if (cmdTab === 'cli') {
      if (pkgManager === 'pnpm') return 'pnpm dlx vibezcheck init';
      if (pkgManager === 'bun') return 'bunx vibezcheck init';
      return 'npx vibezcheck init';
    }
    if (cmdTab === 'core') {
      if (pkgManager === 'npm') return `npm i ${coreSdkPkg} vibezcheck`;
      return `${pkgManager} add ${coreSdkPkg} vibezcheck`;
    }
    // ai-sdk
    if (pkgManager === 'npm') return `npm i ai ${providerPkg} vibezcheck`;
    return `${pkgManager} add ai ${providerPkg} vibezcheck`;
  }, [cmdTab, pkgManager, coreSdkPkg, providerPkg]);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(currentCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-[#fbfbfd] dark:bg-[#0c0d10] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Section 1 — Hero */}
        <section className="text-center max-w-2xl mx-auto mt-6 mb-10 space-y-5">
          {/* Trust line */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-xs font-mono text-slate-600 dark:text-zinc-400">
            Local metering · Async reporting · Zero prompt retention
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50 leading-[1.1]">
            Know What Your AI Users Cost You.
          </h1>

          {/* Copy */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed font-normal max-w-xl mx-auto">
            Track the real cost of every AI request, prevent runaway usage, and charge users based on actual consumption.
          </p>

          {/* Supporting statement */}
          <div className="pt-1 space-y-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-lg mx-auto">
            <div className="font-semibold text-slate-800 dark:text-zinc-200">
              AI usage is becoming a line item. Treat it like one.
            </div>
            <p>Every message, agent run, document, and tool call has a cost.</p>
            <p>VibezCheck turns raw AI usage into something your business can measure, control, and monetize.</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href="/docs?section=quickstart"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Start measuring →
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 text-sm font-medium transition cursor-pointer"
            >
              View demo →
            </a>
          </div>
        </section>

        {/* Unified Command Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs text-xs mb-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCmdTab('cli')}
              className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                cmdTab === 'cli'
                  ? 'border border-slate-900/80 dark:border-zinc-600 font-semibold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-zinc-800'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              CLI Starter
            </button>
            <button
              onClick={() => setCmdTab('core')}
              className={`px-3 py-1 rounded-full transition cursor-pointer text-xs ${
                cmdTab === 'core'
                  ? 'border border-slate-900/80 dark:border-zinc-600 font-semibold text-slate-900 dark:text-white bg-slate-100/90 dark:bg-zinc-800'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              Core SDK
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
            {(['pnpm', 'npm', 'bun'] as const).map((pm) => (
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

        {/* Section 2 — Interactive Demo (The Bold Centerpiece) */}
        <div id="demo" className="w-full scroll-mt-20">
          <AiSdkShowcase
            audienceTab={audienceTab}
            onAudienceChange={setAudienceTab}
            onProviderPkgChange={setProviderPkg}
            onCorePkgChange={setCoreSdkPkg}
            cmdTab={cmdTab}
          />
        </div>
      </div>

      {/* 3. What VibezCheck Is — and Is Not */}
      <DefinitionSection />

      {/* 24. Problem Section */}
      <ProblemSection />

      {/* 25. Three Core Product Sections (Meter, Protect, Bill) */}
      <PrimitivesSection />

      {/* 27. Stripe Section */}
      <MonetizationSection />

      {/* 44. Final CTA & Footer */}
      <FooterSection />
    </main>
  );
}
