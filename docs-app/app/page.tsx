'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { TableOfContents } from '../components/toc';
import { CodeBlock } from '../components/code-block';
import { CostCalculator } from '../components/cost-calculator';
import { WidgetSandbox } from '../components/widget-sandbox';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Cpu, BookOpen, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react';
import { getDocItemBySlug } from '../lib/docs-data';

export default function DocsHomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const overviewDoc = getDocItemBySlug('overview')!;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Center Main Content */}
        <main className="flex-1 min-w-0 px-6 py-8 sm:px-10 lg:px-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
            <span>Documentation</span>
            <span>/</span>
            <span className="text-slate-900">Getting Started</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Overview</span>
          </div>

          {/* Outcomes Hero Section with Electric Lime Highlighter Accent */}
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-100 border border-slate-200/80 text-xs font-semibold text-slate-800">
              <span className="h-2 w-2 rounded-full bg-lime-400 border border-slate-900" />
              <span>v0.3.0 Public Release</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
              Give your AI app a{' '}
              <span className="relative inline-block px-1.5">
                <span className="relative z-10 text-slate-950">financial mind</span>
                <span className="absolute inset-x-0 bottom-1.5 h-4 bg-lime-400 -z-0 rounded-xs transform -rotate-1" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              The declarative 1-line Stripe Billing and Token Metering engine for LLMs that actually{' '}
              <mark className="bg-lime-300 text-slate-950 font-semibold px-1 py-0.5 rounded-xs">
                looks out for your margins
              </mark>
              . Track tokens, extract reasoning thoughts, and bill customers with <strong>0ms added latency</strong>.
            </p>
          </div>

          {/* 5-Minute Tutorial Callout Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-cream-100/80 border border-slate-200/80 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-stripe-indigo text-white flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  New to VibezCheck? Build your first app in 5 minutes
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Step-by-step tutorial: from an empty folder to a full metered streaming chat.
                </p>
              </div>
            </div>

            <Link
              href="/docs/tutorial"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 text-white hover:bg-stripe-indigo text-xs font-semibold transition shrink-0 shadow-sm"
            >
              <span>Start Tutorial</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Outcome Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
            <div className="p-5 rounded-2xl bg-cream-50/70 border border-slate-200/80 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-stripe-dark text-white flex items-center justify-center">
                <Zap className="h-4 w-4 text-lime-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-950">0ms Added Latency</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Streams pass directly to your user's browser with zero intermediate proxy buffering delay.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50/70 border border-slate-200/80 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-stripe-dark text-white flex items-center justify-center">
                <Cpu className="h-4 w-4 text-stripe-cyan" />
              </div>
              <h4 className="font-bold text-sm text-slate-950">Reasoning Token Aware</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Accurately captures hidden thinking tokens in GPT-5, o3-mini, and Claude 3.7 to protect margins.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-cream-50/70 border border-slate-200/80 space-y-2.5">
              <div className="h-9 w-9 rounded-xl bg-stripe-dark text-white flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-lime-400" />
              </div>
              <h4 className="font-bold text-sm text-slate-950">Circuit Breaker Safety</h4>
              <p className="text-xs text-slate-600 leading-normal">
                Automatic budget guardrails halt runaway recursive loops before draining your bank account.
              </p>
            </div>
          </div>

          {/* The 1-Line Standard Code Section */}
          <section className="space-y-4 my-12" id="why-vibezcheck">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-100 text-slate-900 border border-lime-300">
                Declarative API
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                The 1-Line Standard
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wrap any model string or provider instance directly into your Vercel AI SDK call:
            </p>

            <CodeBlock
              filename="app/api/chat/route.ts"
              language="typescript"
              code={`import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customer = 'alex@example.com' } = await req.json();

  // ⚡ 1-Line Declarative Model Metering
  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer, // Auto-provisions Stripe customer
      maxCostPerCallUSD: 0.20, // Guardrail ceiling
      onUsage: (event) => {
        console.log(\`⚡ [vibezcheck] Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD.toFixed(6)}\`);
      },
    }),
    messages,
  }).toDataStreamResponse();
}`}
            />
          </section>

          {/* Interactive Calculator Section */}
          <section className="space-y-4 my-12" id="core-philosophy">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stripe-indigo/10 text-stripe-indigo border border-stripe-indigo/20">
                Live Simulator
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Live Token & Cost Economics
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Test token pricing across models and configure profit margins in real time:
            </p>

            <CostCalculator />
          </section>

          {/* Interactive Component Sandbox Section */}
          <section className="space-y-4 my-12" id="architecture">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream-200 text-slate-800">
                Zero-Database React Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Client Telemetry & In-App Paywalls
              </h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time client telemetry and top-up paywalls without requiring any backend database queries:
            </p>

            <WidgetSandbox />
          </section>

          {/* Next Guide Navigation Card */}
          <div className="my-12 pt-8 border-t border-slate-200/80">
            <Link
              href="/docs/tutorial"
              className="group flex items-center justify-between p-6 rounded-3xl border border-stripe-indigo/30 bg-gradient-to-r from-cream-50 via-white to-indigo-50/30 hover:border-stripe-indigo hover:shadow-lg transition duration-200"
            >
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-200 text-slate-950 border border-lime-300">
                  Next Guide
                </span>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-stripe-indigo transition">
                  5-Minute Step-by-Step Tutorial →
                </h3>
                <p className="text-xs text-slate-500">
                  Learn how to build and monetize your first AI app from scratch.
                </p>
              </div>

              <div className="h-10 w-10 rounded-2xl bg-stripe-indigo text-white flex items-center justify-center shrink-0 group-hover:translate-x-1 transition duration-150 shadow-sm">
                <ArrowRight className="h-5 w-5" />
              </div>
            </Link>
          </div>
        </main>

        {/* Right Table of Contents */}
        <TableOfContents headings={overviewDoc.headings} />
      </div>
    </div>
  );
}
