'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Cpu,
  Users,
  Radio,
  ShieldAlert,
  Sliders,
  Scale,
  Wrench,
  TrendingUp,
  Coins,
  Share2,
  PieChart,
  Check,
  Copy,
  ChevronDown,
} from 'lucide-react';

/**
 * Section 2 — The Problem (Spec Section 5.2)
 */
export function TheProblemSection() {
  return (
    <section id="problem" className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Tokens are useful for engineers. Dollars are useful for businesses.
        </h2>
        <div className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 space-y-2 leading-relaxed">
          <p>
            AI providers bill applications using model-specific usage units such as input tokens, output tokens, cached tokens, and reasoning usage.
          </p>
          <p className="font-semibold text-slate-900 dark:text-zinc-200">
            Users do not buy tokens.
          </p>
          <p>
            They buy messages, documents, agent runs, API calls, credits, and subscriptions.
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
            VibezCheck connects the product action to the provider cost.
          </p>
        </div>
      </div>

      {/* Economic Flow Diagram */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          {[
            { step: '1', title: 'User Action', desc: 'Message, doc, run' },
            { step: '2', title: 'AI Usage', desc: 'Tokens & tool calls' },
            { step: '3', title: 'Provider Cost', desc: 'Calculated micro-dollars' },
            { step: '4', title: 'Customer Economics', desc: 'Margin, credits, billing' },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.step}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 w-full sm:w-auto flex-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-slate-900 dark:text-zinc-100">{item.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">{item.desc}</div>
                </div>
              </div>
              {idx < arr.length - 1 && (
                <span className="text-slate-300 dark:text-zinc-600 font-mono text-sm hidden sm:inline">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Section 3 — Measure (Spec Section 5.3)
 */
export function MeasureSection() {
  return (
    <section id="measure" className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          Measure
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Measure every AI request in dollars.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
          Know what an individual request, customer, feature, model, document, or agent session costs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <DollarSign className="w-4 h-4" />
            <span>Request Cost</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Calculate provider cost from model usage in-process using BigInt nano-cent rate cards for 700+ models.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Token Usage</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Break down prompt, completion, cached, and reasoning usage where supported by the provider response.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Users className="w-4 h-4" />
            <span>Customer Attribution</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Attach customer, organization, feature, and thread identifiers to every request and generation.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Radio className="w-4 h-4" />
            <span>Streaming</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Meter streaming responses in real time without routing traffic through an external VibezCheck proxy.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 4 — Control (Spec Section 5.4)
 */
export function ControlSection() {
  return (
    <section id="control" className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
          Control
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Put a ceiling on AI spending.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
          Agent workflows can make multiple model and tool calls before a user sees the result. VibezCheck lets developers enforce request-level and session-level spending boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Per-Request Limits</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Stop unusually expensive calls using <code className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded">maxCostPerCallUSD</code>.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Sliders className="w-4 h-4" />
            <span>Token Limits</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Set maximum token ceilings per generation to keep prompt expansion within bounded limits.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Scale className="w-4 h-4" />
            <span>Agent Budgets</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Create hard spending ceilings for multi-step agent workflows via <code className="text-xs font-mono bg-slate-100 dark:bg-zinc-800 px-1 py-0.5 rounded">sessionBudgetUSD</code>.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Wrench className="w-4 h-4" />
            <span>Tool Costs</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Account for external tool execution (web search, sandboxes, code interpreters) inside agent economics.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 5 — Monetize (Spec Section 5.5)
 */
export function MonetizeSection() {
  return (
    <section id="monetize" className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
          Monetize
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Connect AI costs to your pricing.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
          Once your application knows the provider cost of a request, you can use that usage event inside your own pricing and billing system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Markup / Pricing Rules</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Apply a markup multiplier (e.g. 1.30×) to wholesale provider cost to ensure profitable customer retail pricing.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Coins className="w-4 h-4" />
            <span>Credits</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Map usage and dollar consumption directly to customer credits, token pools, or feature quotas.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Share2 className="w-4 h-4" />
            <span>Usage Events</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Emit structured economic usage events asynchronously to Stripe, Metronome, Supabase, or custom queues.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <PieChart className="w-4 h-4" />
            <span>Customer Economics</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Understand the cost behind every plan, enterprise tenant, product feature, and account in real time.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 6 — Quick Start (Spec Section 6)
 */
export function QuickStartSection() {
  const [copied, setCopied] = useState(false);
  const codeString = `import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: 'user_123',
    maxCostPerCallUSD: 0.50,
  }),
  prompt: 'Summarize quantum computing in three sentences.',
});`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          One line to start metering.
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400">
          Wrap the model you already use. VibezCheck runs in your application and exposes the usage and cost of the request.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-[#0d0e12] overflow-hidden shadow-xl text-left">
        <div className="flex items-center justify-between px-4 py-3 bg-[#16181f] border-b border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2">app/api/chat/route.ts</span>
          </div>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-5 font-mono text-xs sm:text-sm text-zinc-200 overflow-x-auto leading-relaxed">
          <code>{codeString}</code>
        </pre>

        {/* Concrete Output Example */}
        <div className="px-5 py-3.5 bg-zinc-950/80 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
            <span>✦ $0.000276</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">1,390 tok</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400">gpt-4o-mini</span>
          </div>
          <Link
            href="/docs?section=quickstart"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Read the 5-minute quickstart →
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Section 7 — Before / After (Spec Section 7)
 */
export function BeforeAfterSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Your application already knows the response. Now let it know the cost.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Before */}
        <div className="rounded-2xl border border-red-500/20 bg-red-950/10 dark:bg-red-950/20 p-5 space-y-3 font-mono text-xs">
          <div className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-[11px]">
            Without Metering (Before)
          </div>
          <pre className="text-slate-800 dark:text-zinc-300 leading-relaxed overflow-x-auto">
{`const result = await generateText({
  model: openai('gpt-4o-mini'),
  prompt,
});

// You have the response.
// What did it cost?
// Which customer generated it?
// Did an agent exceed its budget?`}
          </pre>
        </div>

        {/* After */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20 p-5 space-y-3 font-mono text-xs">
          <div className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            With VibezCheck (After)
          </div>
          <pre className="text-slate-800 dark:text-zinc-200 leading-relaxed overflow-x-auto">
{`const result = await generateText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: user.id,
    maxCostPerCallUSD: 0.50,
  }),
  prompt,
});

// Real dollar cost calculated.
// Attributed to customer.
// Hard ceiling enforced.`}
          </pre>
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-slate-500 dark:text-zinc-400 font-mono">
        Usage + cost + attribution + protection in the application path.
      </div>
    </section>
  );
}

/**
 * Section 8 — Social Proof / Technical Trust (Spec Section 8)
 */
export function TechnicalTrustSection() {
  const points = [
    { title: 'Built for TypeScript', desc: 'First-class type inference with zero type assertions' },
    { title: '0 Runtime Dependencies', desc: 'Core library has 0 external node_modules bloat' },
    { title: 'Vercel AI SDK Support', desc: 'Wraps streamText, generateText, and tool calls' },
    { title: 'Native Stream Support', desc: 'Handles OpenAI, Anthropic, Gemini streams in-process' },
    { title: 'Offline Pricing Catalog', desc: 'Bundled BigInt rate cards for 700+ frontier models' },
    { title: 'MIT Licensed', desc: 'Free, open source, and self-contained in your repo' },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Built for Production Engineering
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
          Technical specifications designed for zero risk and clean integration
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {points.map((p) => (
          <div
            key={p.title}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-1.5"
          >
            <div className="font-semibold text-xs text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{p.title}</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-zinc-400 leading-normal">
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Section 9 — Homepage FAQ (AEO Block with 13 Exact Questions, Spec Section 9)
 */
export const HOMEPAGE_FAQS = [
  {
    q: 'What is VibezCheck?',
    a: 'VibezCheck is a TypeScript SDK for AI cost monitoring and LLM usage metering. It calculates the provider cost of AI model requests from usage data and lets applications attribute, control, and report AI spending.',
  },
  {
    q: 'How do I track LLM costs?',
    a: 'Wrap the model or provider stream you already use with VibezCheck. VibezCheck reads the returned usage data, applies model pricing, and calculates the provider cost in dollars.',
  },
  {
    q: 'Does VibezCheck proxy AI requests?',
    a: 'No. VibezCheck is designed to run inside your application and does not require model traffic to be routed through a VibezCheck proxy.',
  },
  {
    q: 'Does VibezCheck add a network hop?',
    a: 'No additional VibezCheck network hop is required. Cost calculation runs in-process, while optional reporting can be handled asynchronously.',
  },
  {
    q: 'Can VibezCheck track OpenAI costs?',
    a: 'Yes. VibezCheck supports OpenAI usage through the Vercel AI SDK and can meter native OpenAI streaming responses when usage information is available.',
  },
  {
    q: 'Can VibezCheck track Anthropic or Gemini costs?',
    a: 'Yes, provided the integration returns the usage information required for the model and pricing calculation. VibezCheck also includes provider/model pricing data for supported models.',
  },
  {
    q: 'Can VibezCheck track AI agent costs?',
    a: 'Yes. VibezCheck can create a session budget for a multi-step workflow and attach explicit costs to tool executions.',
  },
  {
    q: 'Can I set a maximum AI spend per request?',
    a: 'Yes. VibezCheck supports request-level limits such as maxCostPerCallUSD and token ceilings such as maxTokensPerCall where supported by the integration.',
  },
  {
    q: 'Can VibezCheck calculate AI costs offline?',
    a: 'Yes. The bundled pricing catalog allows supported model costs to be calculated locally without requiring an external pricing request.',
  },
  {
    q: 'Does VibezCheck store prompts?',
    a: 'VibezCheck does not need prompts or completions to be stored in order to calculate usage and cost. Applications control what is persisted through optional sinks and adapters.',
  },
  {
    q: 'Can VibezCheck connect to my database?',
    a: 'Yes. VibezCheck can write usage events through built-in integrations or a custom database callback.',
  },
  {
    q: 'Can VibezCheck be used for usage-based billing?',
    a: 'Yes. VibezCheck can produce usage and cost events that an application can send to Stripe, Metronome, a database, or a custom billing system.',
  },
  {
    q: 'Does VibezCheck have runtime dependencies?',
    a: 'The core package is designed with zero external runtime dependencies. Provider SDKs, React, and database clients are optional integrations.',
  },
];

export function FaqAeoSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Structured Data for FAQPage (Spec Section 36)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOMEPAGE_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
          Answers & Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          Direct, verifiable answers to common technical and economic questions.
        </p>
      </div>

      <div className="space-y-3">
        {HOMEPAGE_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.q}
              className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-zinc-800/40 transition select-none"
              >
                <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-emerald-500' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 border-t border-slate-100 dark:border-zinc-800/80 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
