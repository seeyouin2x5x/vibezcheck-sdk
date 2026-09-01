'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';
import { TableOfContents } from '../components/toc';
import { CodeBlock } from '../components/code-block';
import { CostCalculator } from '../components/cost-calculator';
import { WidgetSandbox } from '../components/widget-sandbox';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Cpu, BookOpen } from 'lucide-react';
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

          {/* Hero Heading */}
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              <Sparkles className="h-3 w-3 text-indigo-600" />
              <span>v0.3.0 Release</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
              Overview
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              The declarative, 1-line Stripe Billing and Token Metering engine for LLMs and the Vercel AI SDK. Track tokens, extract reasoning thoughts, compute USD costs, and bill customers with <strong>0ms added latency</strong>.
            </p>
          </div>

          {/* Step-by-Step Tutorial Callout Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-purple-50/50 border border-indigo-100/80 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  New to VibezCheck? Build your first app in 5 minutes
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step tutorial from empty folder to full metered streaming chat.
                </p>
              </div>
            </div>

            <Link
              href="/docs/tutorial"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition shrink-0 shadow-xs"
            >
              <span>Start Tutorial</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <h4 className="font-semibold text-sm text-slate-900">0ms Added Latency</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Streams pass straight to browser with zero proxy delay or middleware buffering.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center">
                <Cpu className="h-4 w-4 text-purple-400" />
              </div>
              <h4 className="font-semibold text-sm text-slate-900">Reasoning Token Aware</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Accurately bills hidden thinking tokens in GPT-5, o3-mini, Claude 3.7, and DeepSeek R1.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="font-semibold text-sm text-slate-900">Agent Circuit Breakers</h4>
              <p className="text-xs text-slate-500 leading-normal">
                Automatic budget guardrails (<code className="text-[11px] font-mono">maxCostPerCallUSD</code>) prevent runaway loops.
              </p>
            </div>
          </div>

          {/* 1-Line Example */}
          <section className="space-y-4 my-10" id="why-vibezcheck">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              The 1-Line Standard
            </h2>
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
  }).toTextStreamResponse();
}`}
            />
          </section>

          {/* Interactive Calculator Section */}
          <section className="space-y-4 my-10" id="core-philosophy">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Live Token & Cost Economics
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Test token pricing across models and configure profit margins in real time:
            </p>

            <CostCalculator />
          </section>

          {/* Interactive Component Sandbox Section */}
          <section className="space-y-4 my-10" id="architecture">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Zero-Database React Suite
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Real-time client telemetry and paywalls without requiring any backend database queries:
            </p>

            <WidgetSandbox />
          </section>

          {/* Quickstart CTA Banner */}
          <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-10">
            <div className="space-y-1">
              <h3 className="font-bold text-base">Ready to start metering?</h3>
              <p className="text-xs text-slate-400">
                Install the SDK or run the 10-second setup wizard in your terminal.
              </p>
            </div>

            <Link
              href="/docs/tutorial"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-slate-100 transition shrink-0"
            >
              <span>5-Minute Tutorial</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </main>

        {/* Right Table of Contents */}
        <TableOfContents headings={overviewDoc.headings} />
      </div>
    </div>
  );
}
