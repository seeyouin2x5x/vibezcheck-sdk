'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { ChatboxTutorial } from '@/components/chatbox-tutorial';
import { VibezReceipt } from '@/components/vibez-meter';
import {
  Zap,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Terminal,
  LifeBuoy,
  BookOpen,
  Check,
  Copy,
  ChevronRight,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Code2,
} from 'lucide-react';

interface DocItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
}

const DOC_NAV: { category: string; items: DocItem[] }[] = [
  {
    category: 'Getting Started',
    items: [
      {
        id: 'overview',
        title: 'Overview',
        category: 'Getting Started',
        badge: 'Start here',
        description: 'What is VibezCheck and how does it work in plain English?',
      },
      {
        id: 'tutorial',
        title: 'Chatbox Tutorial',
        category: 'Getting Started',
        badge: 'Interactive',
        description: 'Interactive conversational walkthrough to build and monetize your AI app.',
      },
      {
        id: 'quickstart',
        title: 'Quickstart',
        category: 'Getting Started',
        description: 'Add token metering to an existing Next.js project in 3 steps.',
      },
      {
        id: 'cli',
        title: 'CLI Suite (npx vibezcheck)',
        category: 'Getting Started',
        badge: 'New',
        description: 'Scaffold starters, scan for cost leaks, and check prices in your terminal.',
      },
    ],
  },
  {
    category: 'Core Features',
    items: [
      {
        id: 'safety',
        title: 'Safety Switch (Cost Protection)',
        category: 'Core Features',
        badge: 'Essential',
        description: 'Prevent runaway loops and surprise $500 bills with an automatic circuit breaker.',
      },
      {
        id: 'margins',
        title: 'Profit Markup',
        category: 'Core Features',
        description: 'Automatically charge customers 20% to 100% above wholesale AI costs.',
      },
      {
        id: 'wallets',
        title: 'Customer Wallets & Stripe',
        category: 'Core Features',
        description: 'Let users buy prepaid credit packs or debit cents directly via Stripe.',
      },
      {
        id: 'disconnects',
        title: 'Disconnect Protection',
        category: 'Core Features',
        description: 'Capture and bill partial questions even if a customer closes their browser.',
      },
    ],
  },
  {
    category: 'UI & Artifacts',
    items: [
      {
        id: 'artifacts',
        title: 'Rendering UI in Artifacts',
        category: 'UI & Artifacts',
        badge: 'Interactive',
        description: 'Render real-time cost meters, token receipts, and wallet HUDs directly inside AI chat artifacts.',
      },
    ],
  },
  {
    category: 'Reference',
    items: [
      {
        id: 'pricing',
        title: 'Model Pricing Directory',
        category: 'Reference',
        description: 'Official token prices for OpenAI, Anthropic, Gemini, and DeepSeek.',
      },
      {
        id: 'faq',
        title: 'Plain English FAQ',
        category: 'Reference',
        description: 'Simple answers to common questions with zero developer jargon.',
      },
    ],
  },
];

const MODEL_PRICES = [
  { model: 'gpt-4o', provider: 'OpenAI', input: 2.50, output: 10.00, reasoning: 10.00, speed: 'Fast' },
  { model: 'gpt-4o-mini', provider: 'OpenAI', input: 0.15, output: 0.60, reasoning: 0.60, speed: 'Ultra-Fast' },
  { model: 'o3-mini', provider: 'OpenAI', input: 1.10, output: 4.40, reasoning: 4.40, speed: 'Thinking' },
  { model: 'claude-3-7-sonnet', provider: 'Anthropic', input: 3.00, output: 15.00, reasoning: 15.00, speed: 'Deep Reasoning' },
  { model: 'claude-3-5-haiku', provider: 'Anthropic', input: 0.80, output: 4.00, reasoning: 4.00, speed: 'Instant' },
  { model: 'gemini-2.0-flash', provider: 'Google', input: 0.10, output: 0.40, reasoning: 0.40, speed: 'Realtime' },
  { model: 'deepseek-r1', provider: 'DeepSeek', input: 0.55, output: 2.19, reasoning: 2.19, speed: 'Open Reasoning' },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Margin Calculator state
  const [marginMultiplier, setMarginMultiplier] = useState<number>(1.3);
  const wholesaleCost = 0.0020;
  const billedCost = wholesaleCost * marginMultiplier;
  const profit = billedCost - wholesaleCost;

  // Interactive Safety Switch simulation state
  const [safetyCap, setSafetyCap] = useState<number>(0.50);
  const [tutorialMode, setTutorialMode] = useState<'chat' | 'code'>('chat');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const section = params.get('section') || params.get('tab') || params.get('topic');
      if (section) {
        setActiveTab(section);
      }
    }
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] dark:bg-[#0c0c0e] text-slate-900 dark:text-zinc-100 transition-colors">
      <Header />

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 pt-20 pb-28 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-6 pt-4">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-hidden focus:border-slate-400 dark:focus:border-zinc-600 transition"
            />
          </div>

          {/* Nav Categories */}
          <nav className="space-y-6">
            {DOC_NAV.map((group) => {
              const filteredItems = group.items.filter(
                (item) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.category} className="space-y-1.5">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-2">
                    {group.category}
                  </h3>
                  <div className="space-y-0.5">
                    {filteredItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            if (typeof window !== 'undefined') {
                              const url = new URL(window.location.href);
                              url.searchParams.set('section', item.id);
                              window.history.pushState({}, '', url);
                            }
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                            isActive
                              ? 'bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold'
                              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900/60 hover:text-slate-900 dark:hover:text-zinc-200'
                          }`}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-700/60 text-slate-600 dark:text-zinc-300 font-normal">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Quick Command Card */}
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
              Quick Setup
            </span>
            <div
              onClick={() => copyToClipboard('npx vibezcheck init', 'sidebar-cmd')}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-950 font-mono text-[11px] text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-800 cursor-pointer hover:border-slate-400 transition"
            >
              <span>$ npx vibezcheck init</span>
              {copiedCode === 'sidebar-cmd' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-snug">
              Sets up a full Stripe AI project on your computer in 30 seconds.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pt-4 max-w-3xl space-y-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-500/10 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/20 text-xs font-medium mb-3">
                  <Zap className="w-3 h-3" />
                  Plain English Guide
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  What is VibezCheck?
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  VibezCheck is the smart electric meter for Artificial Intelligence. Just like an electric meter on your wall measures how much power your appliances use, VibezCheck measures every word an AI reads or writes, calculates the exact cost in pennies, and lets you bill your users with Stripe.
                </p>
              </div>

              {/* Analogy Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  The Mobile Phone Data Analogy
                </div>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  Think of AI usage just like your cell phone plan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      1. Words In (Input)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      When a user asks a question, the AI reads their prompt. Like downloading an email.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      2. Words Out (Output)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      When the AI answers, every word produced has a cost. Like uploading a video.
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
                      3. VibezCheck Meter
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      Instantly turns that data into cents (e.g. $0.0014) and charges the user’s wallet.
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Pillars in Plain English */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Why you need it for your AI apps
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      Charge Users with Stripe
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Instead of eating the OpenAI or Anthropic invoice yourself, bill your customers per question or let them top up a $10 prepaid credit balance.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Automatic Safety Switch
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      If an AI gets stuck in an infinite loop or someone sends a crazy prompt, it automatically shuts off at $0.50 so your credit card never gets drained.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      Built-in Profit Markup
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Set a profit margin (e.g. +30%). If OpenAI charges you $0.01 for an answer, VibezCheck charges the user $0.013, locking in your profit margin.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Instant Stream (Zero Lag)
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      No extra servers or slow middlemen. The AI words stream into the browser at full speed with 0ms added delay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next step button */}
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('tutorial')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs shadow-sm hover:opacity-90 transition cursor-pointer"
                >
                  <span>Start the 5-Minute Tutorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CHATBOX TUTORIAL */}
          {activeTab === 'tutorial' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header with Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-medium mb-2">
                    <MessageSquare className="w-3 h-3" />
                    Interactive Chatbox Tutorial
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    5-Minute Interactive Tutorial
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 leading-relaxed">
                    A live conversational tutor that walks you through token metering, profit margins, and Stripe card billing.
                  </p>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center p-1 bg-slate-200/70 dark:bg-zinc-900 border border-slate-300/80 dark:border-zinc-800 rounded-full text-xs font-medium self-start sm:self-auto shrink-0 shadow-2xs">
                  <button
                    onClick={() => setTutorialMode('chat')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                      tutorialMode === 'chat'
                        ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chatbox</span>
                  </button>
                  <button
                    onClick={() => setTutorialMode('code')}
                    className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                      tutorialMode === 'code'
                        ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code Cards</span>
                  </button>
                </div>
              </div>

              {/* View 1: Interactive Chatbox Tutorial (Primary) */}
              {tutorialMode === 'chat' ? (
                <div className="space-y-3">
                  <ChatboxTutorial />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400 px-1 pt-1">
                    <span>💡 Tip: You can click the step chips inside the chat or type any custom question.</span>
                    <button
                      onClick={() => setTutorialMode('code')}
                      className="text-slate-800 dark:text-zinc-200 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <span>Switch to static code view</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* View 2: Static Step Cards */
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                        1
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Create your project with 1 terminal command
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Open your computer terminal and run this single command. It sets up a complete working Next.js app with VibezCheck and Stripe ready to go:
                    </p>
                    <div className="relative group">
                      <pre className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto">
                        <code>npx vibezcheck init my-ai-app</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard('npx vibezcheck init my-ai-app', 'tut-step1')}
                        className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        {copiedCode === 'tut-step1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                        2
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Add your API Keys (.env.local)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Inside your new folder, open <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px]">.env.local</code> and paste your keys:
                    </p>
                    <div className="relative group">
                      <pre className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto">
{`# AI Provider (OpenAI or Anthropic)
OPENAI_API_KEY=sk-...

# Stripe Account (leave blank to run in free test mode!)
STRIPE_SECRET_KEY=sk_test_...`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`OPENAI_API_KEY=sk-...\nSTRIPE_SECRET_KEY=sk_test_...`, 'tut-step2')}
                        className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        {copiedCode === 'tut-step2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                        3
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        The 1-Line AI Route (app/api/chat/route.ts)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Notice how simple this is. Wrap your model in <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px]">vibezcheck()</code> and specify customer info, profit margin, and safety switch:
                    </p>
                    <div className="relative group">
                      <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId = 'cus_123' } = await req.json();

  // ⚡ 1-Line Metering & Billing
  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: customerId,              // Customer to bill in Stripe
      pricing: { margin: 1.30 },         // Keep 30% profit markup
      safety: { maxCostPerCallUSD: 0.50 } // Emergency switch cuts off at $0.50
    }),
    messages,
  });

  return result.toDataStreamResponse();
}`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`import { streamText } from 'ai';\nimport { openai } from '@ai-sdk/openai';\nimport { vibezcheck } from 'vibezcheck';\n\nexport async function POST(req: Request) {\n  const { messages, customerId = 'cus_123' } = await req.json();\n\n  const result = streamText({\n    model: vibezcheck(openai('gpt-4o-mini'), {\n      customer: customerId,\n      pricing: { margin: 1.30 },\n      safety: { maxCostPerCallUSD: 0.50 }\n    }),\n    messages,\n  });\n\n  return result.toDataStreamResponse();\n}`, 'tut-step3')}
                        className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        {copiedCode === 'tut-step3' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                        4
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Drop the Live Receipt into your UI
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      In your chat page, add <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px]">&lt;VibezReceipt /&gt;</code> under each AI response. It automatically shows tokens, speed, and real-time cents:
                    </p>
                    <div className="relative group">
                      <pre className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto">
{`import { VibezReceipt } from 'vibezcheck/react';

// Inside your chat message loop:
{message.role === 'assistant' && (
  <VibezReceipt message={message} />
)}`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`import { VibezReceipt } from 'vibezcheck/react';\n\n{message.role === 'assistant' && (\n  <VibezReceipt message={message} />\n)}`, 'tut-step4')}
                        className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                      >
                        {copiedCode === 'tut-step4' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold">
                        ✓
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Run your app and test it!
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Run <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px]">pnpm dev</code> and open <a href="http://localhost:3000" className="text-blue-500 underline" target="_blank" rel="noreferrer">http://localhost:3000</a>. Type a question and watch your live price tag appear instantly!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAFETY SWITCH */}
          {activeTab === 'safety' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium mb-3">
                  <ShieldCheck className="w-3 h-3" />
                  Cost Protection
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Safety Switch (Cost Protection)
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Protect your business and bank account from accidental runaway bills.
                </p>
              </div>

              {/* Problem explanation */}
              <div className="p-5 rounded-2xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-red-600 dark:red-400">
                  <AlertTriangle className="w-4 h-4" />
                  The Problem: Infinite AI Loops
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  When an AI agent runs autonomously—calling search tools, writing files, or analyzing data—it can easily get stuck in a recursive loop asking itself questions. Without a safety switch, a single bugged query can rack up $200 to $800 in API costs in under 10 minutes.
                </p>
              </div>

              {/* Interactive Safety Slider */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    Interactive Safety Cap Tester
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    Max Spend: ${safetyCap.toFixed(2)} USD
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.10"
                    max="2.00"
                    step="0.05"
                    value={safetyCap}
                    onChange={(e) => setSafetyCap(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>$0.10 (Strict)</span>
                    <span>$0.50 (Recommended)</span>
                    <span>$2.00 (Generous)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  💡 <strong>How it works:</strong> If a stream crosses <strong>${safetyCap.toFixed(2)}</strong>, VibezCheck severs the connection immediately, logs the trace, and saves you from paying a cent more.
                </div>
              </div>

              {/* Code snippet */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add to your code in 1 line
                </h3>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto">
{`const model = vibezcheck(openai('gpt-4o'), {
  safety: {
    maxCostPerCallUSD: ${safetyCap.toFixed(2)}, // Auto-kill runaway loops
  },
});`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`const model = vibezcheck(openai('gpt-4o'), {\n  safety: {\n    maxCostPerCallUSD: ${safetyCap.toFixed(2)},\n  },\n});`, 'safety-code')}
                    className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'safety-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFIT MARGINS */}
          {activeTab === 'margins' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium mb-3">
                  <TrendingUp className="w-3 h-3" />
                  Monetization
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Profit Markup: Earn on Every Question
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Sell AI features profitably without writing complex accounting equations.
                </p>
              </div>

              {/* Interactive Margin Splitter */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Your Profit Markup Multiplier
                  </span>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
                    +{Math.round((marginMultiplier - 1) * 100)}% Profit ({marginMultiplier.toFixed(2)}x)
                  </span>
                </div>

                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.05"
                  value={marginMultiplier}
                  onChange={(e) => setMarginMultiplier(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                {/* Visual Proportional Split Bar */}
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-zinc-950 overflow-hidden flex border border-slate-200 dark:border-zinc-800">
                    <div
                      style={{ width: `${(1 / marginMultiplier) * 100}%` }}
                      className="bg-slate-400 dark:bg-zinc-600 h-full transition-all duration-300"
                    />
                    <div
                      style={{ width: `${(1 - 1 / marginMultiplier) * 100}%` }}
                      className="bg-purple-500 h-full transition-all duration-300"
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500 dark:text-zinc-400">
                      Wholesale Cost: ${wholesaleCost.toFixed(4)}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      Your Profit: +${profit.toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-zinc-400">
                    Customer is billed:
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    ${billedCost.toFixed(4)} USD
                  </span>
                </div>
              </div>

              {/* Code */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add to your code in 1 line
                </h3>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto">
{`const model = vibezcheck(openai('gpt-4o'), {
  pricing: {
    margin: ${marginMultiplier.toFixed(2)}, // +${Math.round((marginMultiplier - 1) * 100)}% markup added to customer ledger
  },
});`}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(`const model = vibezcheck(openai('gpt-4o'), {\n  pricing: {\n    margin: ${marginMultiplier.toFixed(2)},\n  },\n});`, 'margin-code')}
                    className="absolute right-2.5 top-2.5 p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'margin-code' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLI SUITE */}
          {activeTab === 'cli' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-medium mb-3">
                  <Terminal className="w-3 h-3" />
                  Terminal Tools
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  VibezCheck CLI Suite
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Handy commands to inspect your codebase for money leaks, scaffold new routes, and view live model prices.
                </p>
              </div>

              {/* Command 1: init */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white">
                      npx vibezcheck init
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Setup Wizard</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npx vibezcheck init', 'cli-init')}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'cli-init' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Interactive wizard that detects your Next.js project, creates your <code className="font-mono">.env.local</code> with test keys, and generates your metered <code className="font-mono">app/api/chat/route.ts</code> file.
                </p>
              </div>

              {/* Command 2: audit */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white">
                      npx vibezcheck audit
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Codebase Scanner</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npx vibezcheck audit', 'cli-audit')}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'cli-audit' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Scans your project in &lt;40ms to check if you have any unprotected AI routes that could accidentally drain your bank account. Run with <code className="font-mono">--fix</code> to automatically wrap them.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 font-mono text-[11px] text-slate-600 dark:text-zinc-400">
                  $ npx vibezcheck audit --fix
                </div>
              </div>

              {/* Command 3: prices */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white">
                      npx vibezcheck prices
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Pricing Registry</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npx vibezcheck prices', 'cli-prices')}
                    className="p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'cli-prices' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Prints an up-to-date table in your terminal showing exact costs per 1,000,000 words across 50+ models.
                </p>
              </div>
            </div>
          )}

          {/* TAB: RENDERING UI IN ARTIFACTS */}
          {activeTab === 'artifacts' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Generative UI &amp; Artifacts
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Rendering VibezCheck UI in AI Artifacts
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Learn how to embed live token counters, micro-receipt badges, and customer wallet HUDs directly inside interactive AI artifacts (Claude Artifacts, ChatGPT Canvas, Google Antigravity, and isolated web iframes).
                </p>
              </div>

              {/* Live Interactive Sandbox Component */}
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      Live Artifact Micro-Badge Preview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      The featherweight &lt;VibezReceipt /&gt; badge mounts in sub-millisecond time inside your artifact container:
                    </p>
                  </div>
                  <Link
                    href="/docs/artifacts"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                  >
                    Dedicated Page
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {/* Simulated Chat Message with Micro-Badge */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200/80 dark:border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Assistant Response in Side Pane
                    </span>
                    <VibezReceipt
                      model="gpt-6-astra"
                      tokens={1420}
                      costUSD={0.0036}
                      variant="pill"
                    />
                  </div>
                  <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 font-sans leading-relaxed">
                    &quot;Interactive artifacts allow users to inspect calculations and code side-by-side. VibezCheck renders continuous usage metrics directly alongside each turn without UI lag.&quot;
                  </div>
                </div>

                {/* Integration Guide Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                      REACT / NEXT.JS
                    </span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Import <code className="font-mono text-emerald-600 dark:text-emerald-400">&lt;VibezReceipt message=&#123;m&#125; /&gt;</code> directly from <code className="font-mono">vibezcheck/react</code> into your AI message thread.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 block">
                      STANDALONE IFRAME / HTML
                    </span>
                    <p className="text-xs text-slate-600 dark:text-zinc-400">
                      Use the allowlisted Tailwind script and semantic tokens (<code className="font-mono">--card</code>, <code className="font-mono">--foreground</code>) for isolated sandboxes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Drop-In Next.js Component
                  </h4>
                  <button
                    onClick={() => copyToClipboard(`import { VibezReceipt } from 'vibezcheck/react';

export function ChatTurn({ message }) {
  return (
    <div className="space-y-2">
      <p>{message.content}</p>
      {message.role === 'assistant' && (
        <VibezReceipt message={message} variant="pill" />
      )}
    </div>
  );
}`, 'artifact-react-code')}
                    className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {copiedCode === 'artifact-react-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Code
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{`import { VibezReceipt } from 'vibezcheck/react';

export function ChatTurn({ message }) {
  return (
    <div className="space-y-2">
      <p>{message.content}</p>
      {message.role === 'assistant' && (
        <VibezReceipt message={message} variant="pill" />
      )}
    </div>
  );
}`}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: MODEL PRICING TABLE */}
          {activeTab === 'pricing' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 dark:bg-zinc-500/20 text-slate-700 dark:text-zinc-300 border border-slate-500/20 text-xs font-medium mb-3">
                  <DollarSign className="w-3 h-3" />
                  Official Registry
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Model Pricing Directory
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Official provider rates automatically calibrated into VibezCheck. All prices listed in USD per 1 Million tokens (~750,000 words).
                </p>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 font-mono text-[11px] text-slate-500 dark:text-zinc-400">
                      <tr>
                        <th className="p-3.5">Model</th>
                        <th className="p-3.5">Provider</th>
                        <th className="p-3.5">Input / 1M</th>
                        <th className="p-3.5">Output / 1M</th>
                        <th className="p-3.5">Thinking / 1M</th>
                        <th className="p-3.5">Speed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono">
                      {MODEL_PRICES.map((m) => (
                        <tr key={m.model} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition">
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {m.model}
                          </td>
                          <td className="p-3.5 text-slate-500 dark:text-zinc-400">
                            {m.provider}
                          </td>
                          <td className="p-3.5 text-slate-700 dark:text-zinc-300">
                            ${m.input.toFixed(2)}
                          </td>
                          <td className="p-3.5 text-slate-700 dark:text-zinc-300">
                            ${m.output.toFixed(2)}
                          </td>
                          <td className="p-3.5 text-purple-600 dark:text-purple-400">
                            ${m.reasoning.toFixed(2)}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-[10px] text-slate-600 dark:text-zinc-300">
                              {m.speed}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: FAQ */}
          {(activeTab === 'faq' || activeTab === 'quickstart' || activeTab === 'wallets' || activeTab === 'disconnects') && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Clear, human answers to common questions about metering and billing.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Does VibezCheck slow down my AI streaming answers?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    No. VibezCheck adds <strong>0ms latency</strong>. It does not route your traffic through intermediate proxy servers. It counts the words directly in memory as they stream out of your own server.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Do I need a paid Stripe account to test locally?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    No. If you don't enter a Stripe key, VibezCheck runs in <strong>Free Local Mode</strong>. It simulates all wallet balances, charges, and receipts locally so you can build and test with zero setup.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    What happens if a user closes their tab mid-sentence?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    With our Disconnect Protection, VibezCheck immediately catches the partial word count up to the millisecond they disconnected, ensuring your ledger is accurate and you aren't stuck paying for orphaned tokens.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
