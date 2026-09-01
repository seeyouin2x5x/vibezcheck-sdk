'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '../components/header';
import { LandingMeter } from '../components/landing-meter';
import { CostCalculator } from '../components/cost-calculator';
import { WidgetSandbox } from '../components/widget-sandbox';
import { CodeBlock } from '../components/code-block';
import { EyeGuardianIllustration } from '../components/illustrations/eye-guardian';
import { DeveloperDeskIllustration } from '../components/illustrations/developer-desk';
import { TokenCoinsIllustration } from '../components/illustrations/token-coins';
import { BrandLogo } from '../components/brand-logo';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Check,
  Copy,
  Terminal,
  HelpCircle,
  Lock,
  RefreshCw,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install vibezcheck ai @ai-sdk/openai stripe');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  // Structured Data for Google SEO & AI Search Engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'VibezCheck',
        url: 'https://docs.vibezcheck.app',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
        description:
          'The declarative Stripe token billing and smart metering engine for AI applications with 0ms latency and reasoning token support.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is VibezCheck in simple terms?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'VibezCheck is the smart electric meter for Artificial Intelligence. Just like an electric meter spins when you turn on the lights in your bedroom, VibezCheck counts every token and thinking thought when someone asks your AI a question, converting it into exact pennies with Stripe.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does VibezCheck slow down my AI streaming responses?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. VibezCheck operates with 0ms added latency. It wraps your model stream directly using non-blocking asynchronous hooks without routing traffic through intermediate proxy servers.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are reasoning tokens and why do they matter?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Reasoning models like OpenAI o3-mini and Claude 3.7 generate invisible thinking tokens before producing their final output text. VibezCheck captures these hidden reasoning tokens to ensure your profit margins remain 100% accurate.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />

      {/* Hero Section (Apple / Stripe High-Impact Tone) */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-lime-200/40 via-indigo-100/30 to-amber-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-8">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-100/90 border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-lime-400 border border-slate-900 animate-pulse" />
            <span>The Electric Meter for AI</span>
            <span className="text-slate-400">•</span>
            <span className="text-stripe-indigo font-bold">v0.3.0 Public Release</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.1] max-w-4xl mx-auto">
            Give your AI app a{' '}
            <span className="relative inline-block px-2">
              <span className="relative z-10 text-slate-950">financial mind.</span>
              <span className="absolute inset-x-0 bottom-2 sm:bottom-3 h-4 sm:h-6 bg-lime-400 -z-0 rounded-xs transform -rotate-1" />
            </span>
          </h1>

          {/* Sub-headline (10-year-old approachable clarity) */}
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            When you turn on the lights in your bedroom, your electric meter spins. When users prompt your AI,{' '}
            <strong className="text-slate-900 font-semibold">VibezCheck</strong> is the smart meter that counts every word and hidden thought — converting it into pennies with Stripe so your app{' '}
            <mark className="bg-lime-300 text-slate-950 font-semibold px-1 py-0.5 rounded-xs">
              actually looks out for your margins
            </mark>
            .
          </p>

          {/* CTA Buttons Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/docs/tutorial"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-950 hover:bg-stripe-indigo text-white text-sm font-bold shadow-lg hover:shadow-indigo-500/20 transition-all duration-200"
            >
              <span>Start 5-Minute Tutorial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs/overview"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cream-100 hover:bg-cream-200/80 border border-slate-200/90 text-slate-800 text-sm font-semibold transition"
            >
              <span>Explore Documentation</span>
            </Link>
          </div>

          {/* 1-Click Install Command Box */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleCopyInstall}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 font-mono text-xs text-slate-700 transition shadow-2xs group"
            >
              <Terminal className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900" />
              <span>npm install vibezcheck ai @ai-sdk/openai stripe</span>
              <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-500 group-hover:text-slate-900">
                {copiedInstall ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Hero Visual Doodled Feature Card + Live Speedometer */}
        <div className="max-w-6xl mx-auto px-6 mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* The Eye Guardian Character Card */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-cream-100/80 border border-slate-200/80 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
              {/* Floating Lime Sticky Note */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-lime-400 text-slate-950 font-bold text-[10px] border border-slate-900 shadow-2xs transform -rotate-3">
                Looks out for you! 👁️
              </div>

              <div className="w-full h-48 flex items-center justify-center mt-2">
                <EyeGuardianIllustration />
              </div>

              <h3 className="font-bold text-base text-slate-950 mt-2">The Multi-Eye Guardian</h3>
              <p className="text-xs text-slate-600 mt-1 leading-normal">
                Tirelessly monitoring every prompt, token, and reasoning thought across all models.
              </p>
            </div>

            {/* Interactive Live Speedometer Card */}
            <div className="lg:col-span-8">
              <LandingMeter />
            </div>
          </div>
        </div>
      </section>

      {/* "Explain Like I'm 10" — 3-Step Illustrated Story */}
      <section className="py-20 bg-cream-50/50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-lime-100 text-slate-900 border border-lime-300">
              How It Works in Plain English
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Even a 10-year-old can understand it.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Building AI apps is hard. Counting tokens and charging users shouldn't be. Here is what happens in 3 simple steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 Card: The Question */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6 group hover:border-slate-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">The Question</span>
                </div>

                <div className="h-28 flex items-center justify-center overflow-hidden">
                  <DeveloperDeskIllustration />
                </div>

                <h3 className="text-lg font-bold text-slate-950">Someone asks the AI a question</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Your user sends a message like "Write a bedtime story". Every word they type uses a small drop of computer energy called <strong>tokens</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-cream-100/70 border border-slate-200/60 text-xs font-mono text-slate-700">
                💬 "Explain black holes..."
              </div>
            </div>

            {/* Step 2 Card: The Smart Meter */}
            <div className="p-6 rounded-3xl bg-white border border-lime-300/80 shadow-xs flex flex-col justify-between space-y-6 relative group hover:border-lime-400 transition bg-gradient-to-b from-white to-lime-50/20">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-full bg-lime-400 text-slate-950 border border-slate-900 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <span className="text-[11px] font-bold text-slate-900">The Smart Meter</span>
                </div>

                <div className="h-28 flex items-center justify-center overflow-hidden">
                  <EyeGuardianIllustration />
                </div>

                <h3 className="text-lg font-bold text-slate-950">VibezCheck counts every thought</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Like a digital speedometer, VibezCheck sits right next to the AI, counting regular words AND invisible thinking thoughts with <strong>0.00ms delay</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 text-lime-400 border border-slate-800 text-xs font-mono flex items-center justify-between">
                <span>Tokens: 384</span>
                <span className="text-white font-bold">$0.000576</span>
              </div>
            </div>

            {/* Step 3 Card: The Payment */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6 group hover:border-stripe-indigo/40 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="h-8 w-8 rounded-full bg-stripe-indigo text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <span className="text-[11px] font-semibold text-stripe-indigo">The Payment</span>
                </div>

                <div className="h-28 flex items-center justify-center overflow-hidden">
                  <TokenCoinsIllustration />
                </div>

                <h3 className="text-lg font-bold text-slate-950">The cash register rings</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  VibezCheck tells Stripe to collect the exact pennies from the user. You get paid for every question, and your bank account is 100% protected.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-cream-100/70 border border-slate-200/60 text-xs font-mono text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Stripe Charged: $0.000576</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Showcase (Apple Style) */}
      <section className="py-20 max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-stripe-indigo/10 text-stripe-indigo border border-stripe-indigo/20">
            Real Outcomes
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950">
            Why founders sleep peacefully.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Four powerful guarantees engineered so you never worry about AI infrastructure costs again.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Outcome 1: Runaway Loops Shield */}
          <div className="p-8 rounded-3xl bg-cream-50/70 border border-slate-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-lime-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Never wake up to a $10,000 bill</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                If an autonomous AI agent enters an infinite loop or a rogue user spams prompts, VibezCheck's automated <strong>circuit breaker</strong> instantly aborts the call the moment it crosses your budget ceiling.
              </p>
            </div>

            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center">
              <EyeGuardianIllustration />
            </div>
          </div>

          {/* Outcome 2: Stripe Cash Register */}
          <div className="p-8 rounded-3xl bg-cream-50/70 border border-slate-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-stripe-indigo text-white flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950">Monetize in 60 seconds with Stripe</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero database tables. Zero backend cron jobs. VibezCheck automatically provisions customer records in Stripe and emits metered usage events directly from your API route.
              </p>
            </div>

            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center">
              <TokenCoinsIllustration />
            </div>
          </div>
        </div>

        {/* 2 Smaller Outcome Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-lime-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-950">0ms Stream Latency Overhead</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faster than a blink. Streams pass directly to your user's browser without going through intermediate cloud proxies.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-4">
            <div className="h-10 w-10 rounded-2xl bg-stripe-dark text-white flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5 text-stripe-cyan" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-950">Reasoning Token Awareness</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Captures hidden thinking tokens in GPT-5, o3-mini, and Claude 3.7 so you never lose 80% profit margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 1-Line Code Standard */}
      <section className="py-20 bg-cream-100/50 border-y border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-8 text-center">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-lime-100 text-slate-900 border border-lime-300">
              Declarative Simplicity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Literally 1 line of code.
            </h2>
            <p className="text-sm text-slate-600">
              Wrap your model string inside <code className="px-2 py-0.5 rounded-md bg-white border font-mono font-bold">vibezcheck()</code> and you're ready for production.
            </p>
          </div>

          <div className="text-left max-w-3xl mx-auto">
            <CodeBlock
              filename="app/api/chat/route.ts"
              language="typescript"
              code={`import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customer = 'alex@example.com' } = await req.json();

  // ⚡ 1-Line Model Meter
  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer,
      maxCostPerCallUSD: 0.10, // Safety budget ceiling
      onUsage: (event) => {
        console.log(\`✅ Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD.toFixed(6)}\`);
      },
    }),
    messages,
  }).toDataStreamResponse();
}`}
            />
          </div>
        </div>
      </section>

      {/* Before vs. After Comparison Table (Apple Style) */}
      <section className="py-20 max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Before VibezCheck vs. With VibezCheck
          </h2>
          <p className="text-sm text-slate-600">
            See why developers are replacing custom database loggers with 1 declarative line.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 shadow-xs bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-cream-100/70 font-semibold text-slate-900">
              <tr>
                <th className="px-6 py-4 text-left font-bold">Capability</th>
                <th className="px-6 py-4 text-left font-medium text-slate-500">Without VibezCheck</th>
                <th className="px-6 py-4 text-left font-bold text-slate-950 bg-lime-50/70 border-l border-lime-200">
                  ⚡ With VibezCheck
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">Setup Complexity</td>
                <td className="px-6 py-4 text-slate-500">PostgreSQL tables, Redis queues, cron jobs</td>
                <td className="px-6 py-4 font-bold text-slate-950 bg-lime-50/40 border-l border-lime-200">
                  1-Line Model Wrapper
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">Streaming Latency</td>
                <td className="px-6 py-4 text-slate-500">300ms–800ms buffering proxy delays</td>
                <td className="px-6 py-4 font-bold text-emerald-600 bg-lime-50/40 border-l border-lime-200">
                  0ms Added Latency (Direct)
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">Reasoning Tokens</td>
                <td className="px-6 py-4 text-slate-500">Missed (Causes 80% loss in margins)</td>
                <td className="px-6 py-4 font-bold text-slate-950 bg-lime-50/40 border-l border-lime-200">
                  100% Captured & Metered
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">Runaway Loop Safety</td>
                <td className="px-6 py-4 text-slate-500">Manual API rate limits or none</td>
                <td className="px-6 py-4 font-bold text-slate-950 bg-lime-50/40 border-l border-lime-200">
                  Autonomous Circuit Breakers
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4 font-bold text-slate-900">Client Paywalls</td>
                <td className="px-6 py-4 text-slate-500">Custom React modal & webhook synchronization</td>
                <td className="px-6 py-4 font-bold text-slate-950 bg-lime-50/40 border-l border-lime-200">
                  Drop-in {'<VibezBillingModal />'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Simulators Section */}
      <section className="py-20 bg-cream-50/50 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cream-200 text-slate-800">
              Interactive Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Test your profit margins live.
            </h2>
            <p className="text-sm text-slate-600">
              Calculate exact token margins across GPT-4o, Claude 3.7, o3-mini, and Gemini.
            </p>
          </div>

          <CostCalculator />
        </div>
      </section>

      {/* FAQ Section (Google Rich Results & AI Friendly) */}
      <section className="py-20 max-w-4xl mx-auto px-6 sm:px-8 space-y-12" id="faq">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Everything you need to know.
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="font-bold text-base text-slate-950">
              What is VibezCheck in simple terms?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              VibezCheck is the smart electric meter for AI apps. Just like the electric meter outside your house measures the power you consume and bills you each month, VibezCheck measures the exact tokens and reasoning thoughts your AI generates, calculates costs, and collects payments via Stripe.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="font-bold text-base text-slate-950">
              Does VibezCheck slow down my AI streaming responses?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. VibezCheck adds <strong>0ms of stream latency</strong>. Rather than routing your traffic through remote proxy servers, VibezCheck wraps the model directly using asynchronous lifecycle hooks inside your existing serverless functions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="font-bold text-base text-slate-950">
              Do I need a Stripe account for local development?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No. VibezCheck works 100% out of the box in local development without needing any Stripe API keys. It will calculate exact token costs, track sessions, and log telemetry locally for free.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <h3 className="font-bold text-base text-slate-950">
              How does VibezCheck handle reasoning models like o3-mini and Claude 3.7?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reasoning models generate hidden thinking tokens that are not shown in the final output text. VibezCheck inspects the provider's token usage headers to extract reasoning tokens and prices them accurately according to current provider rate cards.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action (Apple Style) */}
      <section className="py-20 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-slate-950 to-slate-900 text-white space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle electric lime highlight inside dark card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-lime-400 text-slate-950">
            Start Today
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to give your AI app a financial mind?
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Take the 5-minute beginner tutorial and build your first metered, Stripe-connected AI app today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/docs/tutorial"
              className="px-8 py-4 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm transition shadow-lg"
            >
              Start 5-Minute Tutorial →
            </Link>

            <Link
              href="/docs/overview"
              className="px-6 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition border border-slate-700"
            >
              Read the Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 px-6 sm:px-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <BrandLogo showBadge={false} />
            <span className="text-slate-400">|</span>
            <span>The Electric Meter for AI</span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <Link href="/docs/overview" className="hover:text-slate-950 transition">
              Docs
            </Link>
            <Link href="/docs/tutorial" className="hover:text-slate-950 transition">
              Tutorial
            </Link>
            <Link href="/llms.txt" className="hover:text-slate-950 transition">
              llms.txt
            </Link>
            <a
              href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-950 transition"
            >
              GitHub
            </a>
          </div>

          <p>© 2026 VibezCheck. Built for the agentic web.</p>
        </div>
      </footer>
    </div>
  );
}
