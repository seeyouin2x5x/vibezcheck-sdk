'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { ChatboxTutorial } from '@/components/chatbox-tutorial';
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
  Bot,
  Cpu,
  FileText,
  Database,
  Server,
  Settings,
  Globe,
  Download,
  Filter,
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
    category: 'Developer Tools & Agents',
    items: [
      {
        id: 'devtools',
        title: 'Cursor, Claude Code & VSCode',
        category: 'Developer Tools & Agents',
        badge: 'AI Rules',
        description: 'Rule files and context for Cursor (.cursorrules), Claude Code (CLAUDE.md), Windsurf, and Copilot.',
      },
      {
        id: 'llms-txt',
        title: 'llms.txt & AEO Standard',
        category: 'Developer Tools & Agents',
        badge: 'llmstxt.org',
        description: 'Machine-readable documentation for Perplexity, ChatGPT Search, Cursor, and AI agents.',
      },
    ],
  },
  {
    category: 'Core Features',
    items: [
      {
        id: 'database',
        title: 'Database Sinks & DIY Adapters',
        category: 'Core Features',
        badge: 'v0.5.10',
        description: 'Store AI usage events in Supabase, custom ORMs (Drizzle, Kysely), or Metronome billing without latency.',
      },
      {
        id: 'serverless',
        title: 'Serverless Spooling & Flush',
        category: 'Core Features',
        badge: 'Zero Drops',
        description: 'Background event batching with globalThis.after(), waitUntil(), and vibezcheck.flush().',
      },
      {
        id: 'hud',
        title: 'Floating Telemetry HUD (<VibezCheck />)',
        category: 'Core Features',
        badge: 'React UI',
        description: 'Zero-prop client component displaying live USD costs, token splits, and multi-model breakdowns.',
      },
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
    category: 'Security & Privacy',
    items: [
      {
        id: 'privacy',
        title: 'Zero Data Retention (ZDR)',
        category: 'Security & Privacy',
        badge: 'Zero Storage',
        description: 'How VibezCheck guarantees 100% prompt privacy, zero server-side storage, and direct-to-provider execution.',
      },
    ],
  },
  {
    category: 'Reference',
    items: [
      {
        id: 'api-reference',
        title: 'Library API Reference',
        category: 'Reference',
        badge: 'v0.5.10',
        description: 'TypeScript signatures for vibezcheck(), tools, sessions, database adapters, and UI components.',
      },
      {
        id: 'pricing',
        title: 'Model Pricing Directory',
        category: 'Reference',
        description: 'Official token prices for OpenAI, Anthropic, Gemini, DeepSeek, and 700+ models.',
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
  { model: 'gpt-4o', provider: 'OpenAI', input: 2.50, cached: 1.25, output: 10.00, reasoning: 10.00, context: '128k', speed: 'Fast' },
  { model: 'gpt-4o-mini', provider: 'OpenAI', input: 0.15, cached: 0.075, output: 0.60, reasoning: 0.60, context: '128k', speed: 'Ultra-Fast' },
  { model: 'o3-mini', provider: 'OpenAI', input: 1.10, cached: 0.55, output: 4.40, reasoning: 4.40, context: '200k', speed: 'Thinking' },
  { model: 'o1', provider: 'OpenAI', input: 15.00, cached: 7.50, output: 60.00, reasoning: 60.00, context: '200k', speed: 'Deep Reasoning' },
  { model: 'gpt-4.5-preview', provider: 'OpenAI', input: 75.00, cached: 37.50, output: 150.00, reasoning: 150.00, context: '128k', speed: 'Frontier' },
  { model: 'claude-3-7-sonnet', provider: 'Anthropic', input: 3.00, cached: 0.30, output: 15.00, reasoning: 15.00, context: '200k', speed: 'Deep Reasoning' },
  { model: 'claude-3-5-sonnet', provider: 'Anthropic', input: 3.00, cached: 0.30, output: 15.00, reasoning: 15.00, context: '200k', speed: 'Fast' },
  { model: 'claude-3-5-haiku', provider: 'Anthropic', input: 0.80, cached: 0.08, output: 4.00, reasoning: 4.00, context: '200k', speed: 'Instant' },
  { model: 'gemini-2.0-flash', provider: 'Google', input: 0.10, cached: 0.025, output: 0.40, reasoning: 0.40, context: '1M', speed: 'Realtime' },
  { model: 'gemini-2.0-flash-thinking', provider: 'Google', input: 0.10, cached: 0.025, output: 0.40, reasoning: 0.40, context: '1M', speed: 'Reasoning' },
  { model: 'gemini-1.5-pro', provider: 'Google', input: 1.25, cached: 0.31, output: 5.00, reasoning: 5.00, context: '2M', speed: 'Deep Context' },
  { model: 'deepseek-r1', provider: 'DeepSeek', input: 0.55, cached: 0.14, output: 2.19, reasoning: 2.19, context: '64k', speed: 'Open Reasoning' },
  { model: 'deepseek-v3', provider: 'DeepSeek', input: 0.14, cached: 0.014, output: 0.28, reasoning: 0.28, context: '64k', speed: 'Cost Killer' },
  { model: 'mistral-large-2411', provider: 'Mistral', input: 2.00, cached: 0.50, output: 6.00, reasoning: 6.00, context: '128k', speed: 'Enterprise' },
  { model: 'llama-3.3-70b-instruct', provider: 'Meta / Groq', input: 0.59, cached: 0.30, output: 0.79, reasoning: 0.79, context: '128k', speed: '300 tok/s' },
  { model: 'qwen-2.5-72b-instruct', provider: 'Alibaba', input: 0.35, cached: 0.20, output: 0.40, reasoning: 0.40, context: '128k', speed: 'Fast' },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Developer Tools tab selection
  const [devToolTab, setDevToolTab] = useState<'cursor' | 'claude' | 'vscode' | 'windsurf' | 'mcp'>('cursor');

  // Pricing Directory filter state
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const [pricingSearch, setPricingSearch] = useState<string>('');

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

  const filteredModels = MODEL_PRICES.filter((m) => {
    const matchesProvider =
      pricingFilter === 'all' || m.provider.toLowerCase().includes(pricingFilter.toLowerCase());
    const matchesSearch =
      m.model.toLowerCase().includes(pricingSearch.toLowerCase()) ||
      m.provider.toLowerCase().includes(pricingSearch.toLowerCase()) ||
      m.speed.toLowerCase().includes(pricingSearch.toLowerCase());
    return matchesProvider && matchesSearch;
  });

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

          {/* TAB: DATABASE SINKS */}
          {activeTab === 'database' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium mb-3">
                  <Zap className="w-3 h-3" />
                  Decoupled Storage (v0.5.10)
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Database Sinks &amp; Universal DIY Adapters
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Persist usage telemetry into Supabase, custom databases (Drizzle, Kysely, Mongo, ClickHouse), or Metronome with 0ms added latency on your user stream.
                </p>
              </div>

              {/* 1. Supabase Adapter */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                      vibezcheck.supabase(client)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">First-Party Supabase Sink</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Automatically inserts rows into the default <code className="font-mono text-emerald-600 dark:text-emerald-400">vibez_usage</code> table. Completely isolated so database latency never blocks token streaming.
                </p>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`import { createClient } from '@supabase/supabase-js';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'usr_123',
  database: vibezcheck.supabase(supabase), // Automatically spools to 'vibez_usage'
});`}
                  </pre>
                </div>
              </div>

              {/* 2. Universal DIY Adapter */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/40">
                      vibezcheck.database(async fn)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Universal DIY Adapter (Drizzle, Kysely, Mongo)</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Plug in any database, ORM, or logging pipeline using a simple 1-line callback. Runs inside background life-cycles so database hiccups never crash user chats.
                </p>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'usr_123',
  database: vibezcheck.database(async (event) => {
    // Custom sink: Drizzle, Kysely, Mongo, Prisma, or webhook
    await db.insert(aiUsageLogs).values({
      customerId: event.customerId,
      model: event.model,
      tokens: event.usage.totalTokens,
      costUSD: event.cost.totalUSD,
    });
  }),
});`}
                  </pre>
                </div>
              </div>

              {/* 3. Metronome Billing */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40">
                      vibezcheck.metronome(&#123; apiKey &#125;)
                    </span>
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Metronome Usage Billing</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Directly ingests token usage into Metronome's <code className="font-mono text-purple-600 dark:text-purple-400">/v1/ingest</code> API via zero-dependency native fetch.
                </p>
                <div className="relative group">
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'cust_metronome_456',
  database: vibezcheck.metronome({
    apiKey: process.env.METRONOME_API_KEY!,
  }),
});`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SERVERLESS SPOOLING */}
          {activeTab === 'serverless' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-xs font-medium mb-3">
                  <Zap className="w-3 h-3" />
                  Reliability Guarantee
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Serverless Lifecycle Spooling (Zero Dropped Events)
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  How VibezCheck batches and delivers usage telemetry in ephemeral serverless environments (Vercel, AWS Lambda, Cloudflare Workers) with zero added latency on streaming responses.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    1. Automatic Next.js / Vercel after() Hook
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    VibezCheck automatically detects <code className="font-mono text-emerald-600 dark:text-emerald-400">globalThis.after()</code> in Next.js 15+ App Router. The HTTP response stream finishes instantly for your user, and database writes execute cleanly in the post-response lifecycle without execution timeouts.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    2. Cloudflare Workers waitUntil() Hook
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    In edge environments, background batching automatically leverages <code className="font-mono text-cyan-600 dark:text-cyan-400">globalThis.waitUntil()</code> to keep edge isolates alive until pending metering batches are flushed.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    3. Explicit Manual Flush: vibezcheck.flush()
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    In scheduled cron jobs or standalone scripts, call <code className="font-mono text-purple-600 dark:text-purple-400">await vibezcheck.flush()</code> to synchronously drain all active batch queues before process exit:
                  </p>
                  <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`import { vibezcheck } from 'vibezcheck';

// Guarantees all queued usage telemetry is written before worker teardown
await vibezcheck.flush();`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FLOATING HUD (<VibezCheck />) */}
          {activeTab === 'hud' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Client UI Components
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Floating Telemetry HUD (&lt;VibezCheck /&gt;)
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  A zero-prop floating financial HUD and expandable card that displays real-time tokens and costs directly from your <code className="font-mono text-xs">useChat()</code> messages array.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  1-Line Client Integration
                </h3>
                <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`'use client';

import { useChat } from '@ai-sdk/react';
import { VibezCheck, VibezReceipt } from 'vibezcheck/ui';

export default function ChatView() {
  const { messages } = useChat();

  return (
    <div>
      {/* Your chat UI */}
      <VibezCheck messages={messages} />
    </div>
  );
}`}
                </pre>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 dark:text-zinc-400">
                  <div>• <strong>⇅ Unit Swap</strong>: Click to toggle between Dollar Cost (<code className="font-mono">$0.0028</code>) and Tokens (<code className="font-mono">1,420 tok</code>).</div>
                  <div>• <strong>Multi-Model Breakdown</strong>: Displays exact splits when conversations route across multiple models.</div>
                  <div>• <strong>Customer Privacy</strong>: Wholesale developer costs and margin formulas remain private unless explicitly enabled.</div>
                  <div>• <strong>Micro-Receipt</strong>: Add <code className="font-mono">&lt;VibezReceipt message=&#123;message&#125; /&gt;</code> under each assistant bubble for clean per-turn badges.</div>
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

          {/* TAB: QUICKSTART */}
          {activeTab === 'quickstart' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-500/10 dark:bg-lime-500/20 text-lime-700 dark:text-lime-300 border border-lime-500/20 text-xs font-medium mb-3">
                  <Zap className="w-3 h-3" />
                  3-Step Setup
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Quickstart: 1-Line AI Token Metering
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Add token tracking, profit margins, and spend receipts to an existing Next.js AI SDK project in under 2 minutes.
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                    1
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Install VibezCheck &amp; AI SDK
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Zero external dependencies (<code className="font-mono text-[11px]">dependencies: &#123;&#125;</code>) ensures zero bloat in your production bundles:
                </p>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 font-mono text-xs text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800">
                  <span>npm install vibezcheck ai @ai-sdk/openai</span>
                  <button
                    onClick={() => copyToClipboard('npm install vibezcheck ai @ai-sdk/openai', 'qs-step1')}
                    className="p-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
                  >
                    {copiedCode === 'qs-step1' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
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
                    Wrap your model in app/api/chat/route.ts
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Wrap any model with <code className="font-mono text-[11px]">vibezcheck(model)</code> and transmit via <code className="font-mono text-[11px]">vibezcheck.toResponse(result)</code>:
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // ✦ 1 Line: track costs, add 30% profit margin, set $0.50 safety cap
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com',
      pricing: { margin: 1.30 }, // +30% profit margin
      maxCostPerCallUSD: 0.50,   // Circuit breaker auto-stop
    }),
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  return vibezcheck.toResponse(result);
}`}
                </pre>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                    3
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Add &lt;VibezCheck /&gt; and &lt;VibezReceipt /&gt; to your UI
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Drop the financial HUD and micro-receipt badges directly into your chat view:
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`'use client';

import { useChat } from '@ai-sdk/react';
import { VibezCheck, VibezReceipt } from 'vibezcheck/ui';

export default function ChatView() {
  const { messages } = useChat();

  return (
    <div className="max-w-xl mx-auto py-10">
      {/* Message stream */}
      {messages.map((m) => (
        <div key={m.id} className="p-4 rounded-xl border mb-3">
          <div>{m.content}</div>
          {m.role === 'assistant' && (
            <div className="mt-2 flex justify-end">
              <VibezReceipt message={m} />
            </div>
          )}
        </div>
      ))}

      {/* ✦ 1 Line: Floating HUD showing live tokens and spending */}
      <VibezCheck messages={messages} />
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: WALLETS */}
          {activeTab === 'wallets' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-medium mb-3">
                  <CreditCard className="w-3 h-3" />
                  Prepaid Credits &amp; Stripe
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Customer Wallets &amp; Stripe Monetization
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  The mobile data plan model for AI: let users top up a $10 credit balance and debit pennies as they chat.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    How Wallets Work
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Users prepay for usage (e.g. $10.00). Each AI completion deducts exact wholesale costs plus your profit markup (e.g. -$0.0024). When the balance reaches $0.00, calls pause gracefully until a top-up.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Free Local Simulation Mode
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    No Stripe account needed to build and test locally. Without API credentials, VibezCheck tracks balances, customer credit deductions, and receipts in local memory with zero setup.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Frontend Wallet Top-Up Callback
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Pass your remaining balance and top-up handler directly to <code className="font-mono text-[11px]">&lt;VibezCheck /&gt;</code>:
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-slate-800 dark:text-zinc-200 overflow-x-auto leading-relaxed">
{`<VibezCheck
  messages={messages}
  remainingBalanceUSD={10.00}
  onTopUp={(amount) => {
    // Redirect to your Stripe Checkout route
    window.location.href = '/api/checkout?amount=' + amount;
  }}
/>`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB: DISCONNECTS */}
          {activeTab === 'disconnects' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-xs font-medium mb-3">
                  <ShieldCheck className="w-3 h-3" />
                  Stream Resiliency
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Disconnect Protection (Partial Token Recovery)
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Capture and record partial usage even if a customer closes their browser tab or loses network connectivity mid-stream.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    The Problem with Unprotected Streams
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    If an LLM writes a 2,000-word response and the user closes the tab at word 1,200, naive trackers lose the stream entirely. Upstream AI providers still invoice you for those 1,200 words, leaving developers with unbilled expenses.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    How VibezCheck Catches Every Token
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    VibezCheck instruments response streams with native <code className="font-mono text-emerald-600 dark:text-emerald-400">AbortSignal</code> listeners. The instant an interruption occurs, it computes the exact tokens delivered up to that millisecond, calculates the fractional dollar cost, and flushes the record to your database via serverless background lifecycles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 dark:bg-zinc-500/20 text-slate-700 dark:text-zinc-300 border border-slate-500/20 text-xs font-medium mb-3">
                  <LifeBuoy className="w-3 h-3" />
                  Plain English
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Clear, human answers to common questions about metering, billing, and privacy.
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
                    What databases and ORMs are supported?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    In v0.5.10, we provide first-party support for <strong>Supabase</strong> (<code className="font-mono text-emerald-600 dark:text-emerald-400">vibezcheck.supabase</code>), <strong>Metronome Billing</strong> (<code className="font-mono text-purple-600 dark:text-purple-400">vibezcheck.metronome</code>), and a universal DIY adapter (<code className="font-mono text-cyan-600 dark:text-cyan-400">vibezcheck.database</code>) that lets you connect Drizzle, Kysely, MongoDB, ClickHouse, or custom webhooks with a 1-line callback.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Does VibezCheck store my prompts or users' messages?
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Never. VibezCheck operates with strict <strong>Zero Data Retention (ZDR)</strong>. We only track numeric token counts, model names, and computed costs in local RAM. User prompts, completions, and keys never leave your process and are never sent to VibezCheck servers.
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
          {/* TAB: PRIVACY & ZERO DATA RETENTION (ZDR) */}
          {activeTab === 'privacy' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium mb-3">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Zero Data Retention (ZDR) Policy
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Privacy, Security &amp; Zero Data Retention
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  We believe privacy in AI is non-negotiable. VibezCheck is architected from the ground up so that your user prompts, model completions, and private application context never touch our servers.
                </p>
              </div>

              {/* 3 Core Privacy Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>0 Prompt Retention</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    VibezCheck does not store, log, inspect, or retain user prompts or completions. All data passing through the library stays strictly in your own runtime memory.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                    <span>No Proxy Intermediaries</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Unlike proxy relays, VibezCheck is an in-process SDK wrapper. Your API calls travel directly from your server to OpenAI, Anthropic, or Google with zero third-party hops.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>0 Phone-Home Telemetry</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    The library contains zero external dependencies (<code className="font-mono text-[11px]">dependencies: &#123;&#125;</code>) and makes zero background telemetry requests to VibezCheck.
                  </p>
                </div>
              </div>

              {/* Data Collection Transparency Table */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Data Collection Breakdown: What We Measure vs. What We NEVER Touch
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Following the standards set by privacy-first infrastructure like OpenRouter, here is the transparent breakdown of our data handling:
                </p>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono">
                        <th className="py-3 px-4 font-semibold">Data Category</th>
                        <th className="py-3 px-4 font-semibold">VibezCheck Handling</th>
                        <th className="py-3 px-4 font-semibold">Where It Lives</th>
                        <th className="py-3 px-4 font-semibold">Retention Policy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          Prompt &amp; Completion Text
                        </td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                          ✕ NEVER collected, inspected, or stored
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                          Direct to AI Provider
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                          0-Day (Zero Retention)
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          Token Counts (Prompt/Completion)
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-zinc-300">
                          ✓ Measured locally in runtime memory
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                          Your Server / Local RAM
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-zinc-400">
                          Ephemeral (Request Lifetime)
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          Calculated Costs &amp; Model IDs
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-zinc-300">
                          ✓ Computed synchronously with bundled offline catalog
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                          Your Private Database Sink
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-zinc-400">
                          Controlled by Developer
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                          API Keys (OpenAI, Anthropic, Gemini)
                        </td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400 font-medium">
                          ✕ NEVER stored or transmitted
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">
                          Your Environment Variables
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                          Zero Access
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upstream Provider Policies & External References */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Upstream Provider Policies &amp; Industry Standards
                  </h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  VibezCheck complies with and complements leading industry privacy frameworks. For teams requiring strict regulatory compliance (HIPAA, SOC2, GDPR), we recommend pairing VibezCheck with Zero Data Retention agreements from upstream providers:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <a
                    href="https://openrouter.ai/docs/guides/privacy/data-collection"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-slate-400 dark:hover:border-zinc-600 transition group"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Data Collection</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      Learn how modern AI routers handle data collection boundaries.
                    </p>
                  </a>

                  <a
                    href="https://openrouter.ai/docs/guides/privacy/provider-logging"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-slate-400 dark:hover:border-zinc-600 transition group"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Provider Logging</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      Inspect upstream provider retention periods and model training rules.
                    </p>
                  </a>

                  <a
                    href="https://openrouter.ai/docs/guides/features/zdr"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 hover:border-slate-400 dark:hover:border-zinc-600 transition group"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Zero Data Retention</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      Enforce strict 0-day retention policies across all AI inferences.
                    </p>
                  </a>
                </div>
              </div>

              {/* Developer & Customer Confidentiality in the UI */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Customer Privacy Mode Built-In</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  When you render <code className="font-mono text-emerald-600 dark:text-emerald-400">&lt;VibezCheck /&gt;</code> in your frontend, developer wholesale costs and profit margin multipliers are automatically hidden from end-users. Customers only see their transparent billed cost and token count, protecting your proprietary business formulas.
                </p>
              </div>
            </div>
          )}

          {/* TAB: DEVELOPER TOOLS & AGENT RULES */}
          {activeTab === 'devtools' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/20 text-xs font-medium mb-3">
                  <Bot className="w-3.5 h-3.5" />
                  Coding Agents &amp; IDE Rules
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Developer Tools, Agent Rules &amp; MCP
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Equip Cursor, Claude Code, Windsurf, GitHub Copilot, and custom agentic frameworks with exact instructions. These rules guarantee your AI code editors generate zero-latency, profit-metered routes with proper safety circuit breakers.
                </p>
              </div>

              {/* Tool Selection Tabs */}
              <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                {[
                  { id: 'cursor', label: 'Cursor (.cursorrules)', icon: FileCode },
                  { id: 'claude', label: 'Claude Code (CLAUDE.md)', icon: Terminal },
                  { id: 'vscode', label: 'VS Code & Copilot', icon: Code2 },
                  { id: 'windsurf', label: 'Windsurf (.windsurfrules)', icon: Sparkles },
                  { id: 'mcp', label: 'Model Context Protocol (MCP)', icon: Cpu },
                ].map((tool) => {
                  const Icon = tool.icon;
                  const isSelected = devToolTab === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setDevToolTab(tool.id as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                          : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{tool.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* CURSOR CONTENT */}
              {devToolTab === 'cursor' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-violet-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          .cursorrules (Project Root)
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `# VibezCheck Rules for Cursor AI\n\nYou are an expert full-stack AI engineer building with VibezCheck and the Vercel AI SDK.\n\n## Core Principles\n1. ZERO PROXY LATENCY: VibezCheck is an in-process SDK wrapper, NOT an HTTP proxy. Never introduce intermediary proxy URLs or 3rd-party relays.\n2. DECLARATIVE MODEL: Wrap models using \`vibezcheck(model, options)\` directly in \`streamText\` or \`generateText\`.\n3. DISCONNECT PROTECTION: Always return responses using \`vibezcheck.toDataStreamResponse(result)\` so interrupted client streams are metered accurately.\n4. SAFETY SWITCH: Always include a safety budget cap (\`budgetUSD\` or \`vibezcheck.stopWhen({ budgetUSD })\`) to prevent infinite recursion bills.\n5. DATABASE SINKS: Use \`vibezcheck.supabase(client)\` or \`vibezcheck.database(async (event) => ...)\` for non-blocking asynchronous event logging.\n6. SERVERLESS FLUSH: In Edge/Serverless runtimes, call \`vibezcheck.flush()\` inside \`globalThis.after()\` or Next.js \`waitUntil()\`.\n7. CLIENT TELEMETRY: Render \`<VibezReceipt />\` or \`<VibezCheck />\` from \`vibezcheck/ui\` for live user-facing telemetry without leaking developer margins.\n\n## Example Route Pattern\n\`\`\`typescript\nimport { streamText } from 'ai';\nimport { openai } from '@ai-sdk/openai';\nimport { vibezcheck } from 'vibezcheck';\n\nexport async function POST(req: Request) {\n  const { messages, customerId } = await req.json();\n\n  const result = streamText({\n    model: vibezcheck(openai('gpt-4o-mini'), {\n      customer: customerId,\n      budgetUSD: 0.10,\n      marginMultiplier: 1.30,\n    }),\n    messages,\n  });\n\n  return vibezcheck.toDataStreamResponse(result);\n}\n\`\`\``,
                            'cursor-rules-copy'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                      >
                        {copiedCode === 'cursor-rules-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy .cursorrules</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`# VibezCheck Rules for Cursor AI

You are an expert full-stack AI engineer building with VibezCheck and the Vercel AI SDK.

## Core Principles
1. ZERO PROXY LATENCY: VibezCheck is an in-process SDK wrapper, NOT an HTTP proxy. Never introduce intermediary proxy URLs or 3rd-party relays.
2. DECLARATIVE MODEL: Wrap models using vibezcheck(model, options) directly in streamText or generateText.
3. DISCONNECT PROTECTION: Always return responses using vibezcheck.toDataStreamResponse(result) so interrupted client streams are metered accurately.
4. SAFETY SWITCH: Always include a safety budget cap (budgetUSD or vibezcheck.stopWhen({ budgetUSD })) to prevent infinite recursion bills.
5. DATABASE SINKS: Use vibezcheck.supabase(client) or vibezcheck.database(async (event) => ...) for non-blocking asynchronous event logging.
6. SERVERLESS FLUSH: In Edge/Serverless runtimes, call vibezcheck.flush() inside globalThis.after() or Next.js waitUntil().
7. CLIENT TELEMETRY: Render <VibezReceipt /> or <VibezCheck /> from vibezcheck/ui for live user-facing telemetry without leaking developer margins.`}
                    </pre>
                  </div>

                  {/* Add Docs to Cursor feature */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-500/5 to-cyan-500/5 border border-violet-500/20 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      <span>Add Live VibezCheck Context via Cursor @Docs</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      You can index the entire VibezCheck library into Cursor with zero hallucination risk.
                    </p>
                    <ol className="list-decimal list-inside text-xs text-slate-600 dark:text-zinc-400 space-y-1.5 pl-1">
                      <li>Open Cursor Settings <kbd className="font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-[10px]">Cmd + ,</kbd> &rarr; <strong>Features</strong> &rarr; <strong>Docs</strong></li>
                      <li>Click <strong>Add new doc</strong></li>
                      <li>Prefix / URL: <code className="font-mono text-violet-600 dark:text-violet-400 font-semibold">https://vibezcheck.com/llms.txt</code></li>
                      <li>Name: <code className="font-mono">VibezCheck</code></li>
                      <li>Now in any Cursor chat, type <code className="font-mono bg-violet-500/10 text-violet-600 dark:text-violet-300 px-1 py-0.5 rounded">@VibezCheck</code> to retrieve exact library signatures!</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* CLAUDE CODE CONTENT */}
              {devToolTab === 'claude' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-amber-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          CLAUDE.md (Project Root for Claude Code CLI)
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `# VibezCheck Guidelines for Claude Code\n\n## Project Commands\n- Setup starter: \`npx vibezcheck init\`\n- Scan cost leaks: \`npx vibezcheck scan\`\n- Check prices: \`npx vibezcheck pricing [model]\`\n- Build: \`pnpm build\`\n- Test: \`pnpm test\`\n\n## Architecture Rules\n- SDK Type: In-process token instrumentation (0ms latency, zero third-party proxy relays).\n- Token Pricing: Bundled offline catalog (\`akwaba/src/pricing\`). No external network requests needed for cost calculation.\n- Streaming Routes: Wrap models with \`vibezcheck(model, { customer, budgetUSD, marginMultiplier })\`.\n- Disconnect Safety: Instrument with \`vibezcheck.toDataStreamResponse(result)\` to meter partial completions when users close tabs.\n- Serverless Flushing: In Edge/Serverless environments, batch usage with \`waitUntil(vibezcheck.flush())\` or \`globalThis.after(() => vibezcheck.flush())\`.\n- UI Components: Use \`<VibezReceipt />\` or \`<VibezCheck />\` from \`vibezcheck/ui\` for frontend billing telemetry.`,
                            'claude-md-copy'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                      >
                        {copiedCode === 'claude-md-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy CLAUDE.md</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`# VibezCheck Guidelines for Claude Code

## Project Commands
- Setup starter: npx vibezcheck init
- Scan cost leaks: npx vibezcheck scan
- Check prices: npx vibezcheck pricing [model]
- Build: pnpm build
- Test: pnpm test

## Architecture Rules
- SDK Type: In-process token instrumentation (0ms latency, zero third-party proxy relays).
- Token Pricing: Bundled offline catalog (akwaba/src/pricing). No external network requests needed for cost calculation.
- Streaming Routes: Wrap models with vibezcheck(model, { customer, budgetUSD, marginMultiplier }).
- Disconnect Safety: Instrument with vibezcheck.toDataStreamResponse(result) to meter partial completions when users close tabs.
- Serverless Flushing: In Edge/Serverless environments, batch usage with waitUntil(vibezcheck.flush()) or globalThis.after(() => vibezcheck.flush()).
- UI Components: Use <VibezReceipt /> or <VibezCheck /> from vibezcheck/ui for frontend billing telemetry.`}
                    </pre>
                  </div>
                </div>
              )}

              {/* VS CODE & COPILOT CONTENT */}
              {devToolTab === 'vscode' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-blue-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          .github/copilot-instructions.md
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `# GitHub Copilot Instructions for VibezCheck\n\nWhen writing AI endpoints in Next.js:\n- Always meter LLM calls using the \`vibezcheck\` package.\n- Never route calls through HTTP proxies; VibezCheck runs directly in-process.\n- Include cost circuit breakers with \`budgetUSD: 0.10\` to safeguard against infinite loops.\n- When wrapping streaming responses, use \`vibezcheck.toDataStreamResponse(result)\`.\n- Import UI widgets like \`<VibezReceipt />\` from \`vibezcheck/ui\`.`,
                            'copilot-md-copy'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                      >
                        {copiedCode === 'copilot-md-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Copilot Rules</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`# GitHub Copilot Instructions for VibezCheck

When writing AI endpoints in Next.js:
- Always meter LLM calls using the \`vibezcheck\` package.
- Never route calls through HTTP proxies; VibezCheck runs directly in-process.
- Include cost circuit breakers with \`budgetUSD: 0.10\` to safeguard against infinite loops.
- When wrapping streaming responses, use \`vibezcheck.toDataStreamResponse(result)\`.
- Import UI widgets like \`<VibezReceipt />\` from \`vibezcheck/ui\`.`}
                    </pre>
                  </div>
                </div>
              )}

              {/* WINDSURF CONTENT */}
              {devToolTab === 'windsurf' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          .windsurfrules (Codeium Windsurf Cascade)
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `# Windsurf Cascade Rules for VibezCheck\n\n- Package: \`vibezcheck\` (v0.5.10)\n- Core method: \`vibezcheck(model, { customer, budgetUSD, marginMultiplier })\`\n- Architecture: Zero-latency in-memory telemetry, offline pricing catalog, direct upstream API calls.\n- Sinks: \`vibezcheck.supabase(supabaseClient)\`, \`vibezcheck.database(async (event) => ...)\`\n- Flush: \`vibezcheck.flush()\` in Next.js Edge/Serverless lifecycles.`,
                            'windsurf-rules-copy'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                      >
                        {copiedCode === 'windsurf-rules-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy .windsurfrules</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`# Windsurf Cascade Rules for VibezCheck

- Package: vibezcheck (v0.5.10)
- Core method: vibezcheck(model, { customer, budgetUSD, marginMultiplier })
- Architecture: Zero-latency in-memory telemetry, offline pricing catalog, direct upstream API calls.
- Sinks: vibezcheck.supabase(supabaseClient), vibezcheck.database(async (event) => ...)
- Flush: vibezcheck.flush() in Next.js Edge/Serverless lifecycles.`}
                    </pre>
                  </div>
                </div>
              )}

              {/* MCP CONTENT */}
              {devToolTab === 'mcp' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          Model Context Protocol (MCP) Server Config
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `{\n  "mcpServers": {\n    "vibezcheck": {\n      "command": "npx",\n      "args": ["-y", "vibezcheck", "mcp"]\n    }\n  }\n}`,
                            'mcp-copy'
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                      >
                        {copiedCode === 'mcp-copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy MCP Config</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                      Add this configuration to your Claude Desktop config (<code className="font-mono text-[11px]">claude_desktop_config.json</code>) or Cursor MCP settings to allow your AI assistant to query live model token prices and calculate costs on the fly.
                    </p>

                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`{
  "mcpServers": {
    "vibezcheck": {
      "command": "npx",
      "args": ["-y", "vibezcheck", "mcp"]
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LLMS.TXT & AEO STANDARD */}
          {activeTab === 'llms-txt' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-xs font-medium mb-3">
                  <Globe className="w-3.5 h-3.5" />
                  Answer Engine Optimization (AEO)
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  llms.txt Standard &amp; AI Search Optimization
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  VibezCheck is fully compliant with the <strong>llms.txt</strong> open specification (proposed by llmstxt.org). We serve concise, clean Markdown context specifically engineered for search engines like Perplexity, ChatGPT Search, Claude, and developer coding agents.
                </p>
              </div>

              {/* Endpoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      /llms.txt
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                      Curated Index
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Lightweight, structured overview with core concepts, quickstarts, API signatures, and deep links. Optimized for fast agent context injection.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live /llms.txt</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard('curl -s https://vibezcheck.com/llms.txt', 'curl-llms')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-slate-400 text-xs font-mono text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                    >
                      {copiedCode === 'curl-llms' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy curl</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      /llms-full.txt
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      Complete Knowledge
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                    Single-file un-truncated documentation containing the complete SDK reference, pricing table, recipes, and database adapters for frontier reasoning models.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href="/llms-full.txt"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View /llms-full.txt</span>
                    </a>
                    <button
                      onClick={() => copyToClipboard('curl -s https://vibezcheck.com/llms-full.txt', 'curl-full')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-slate-400 text-xs font-mono text-slate-700 dark:text-zinc-300 transition cursor-pointer"
                    >
                      {copiedCode === 'curl-full' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Copy curl</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Why AEO Matters: Standard HTML vs. Clean llms.txt
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono">
                        <th className="py-3 px-4 font-semibold">Metric</th>
                        <th className="py-3 px-4 font-semibold">Scraped HTML Pages</th>
                        <th className="py-3 px-4 font-semibold">VibezCheck /llms.txt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Context Size</td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400">80KB – 250KB (bloated DOM, scripts)</td>
                        <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">3KB – 45KB pure Markdown (90% reduction)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">Hallucination Rate</td>
                        <td className="py-3 px-4 text-red-600 dark:text-red-400">High (parses cookie banners, outdated blogs)</td>
                        <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">0% (Strictly grounded in v0.5.10 library types)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">AI Search Grounding</td>
                        <td className="py-3 px-4 text-slate-500 dark:text-zinc-400">Inconsistent citations across web crawls</td>
                        <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">Deterministic grounding for Perplexity &amp; ChatGPT</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MODEL PRICING DIRECTORY */}
          {activeTab === 'pricing' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-medium mb-3">
                  <DollarSign className="w-3.5 h-3.5" />
                  700+ Models Catalog
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Model Pricing Directory
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Real-time wholesale token prices across OpenAI, Anthropic, Google, DeepSeek, and open-source models. VibezCheck packages this entire pricing catalog offline into the library for <strong>0ms calculation latency</strong>.
                </p>
              </div>

              {/* Filter & Search Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search models (e.g. gpt-4o, claude, deepseek)..."
                      value={pricingSearch}
                      onChange={(e) => setPricingSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg focus:outline-hidden focus:border-slate-400 dark:focus:border-zinc-600 transition"
                    />
                  </div>
                </div>

                {/* Provider Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Mistral', 'Meta / Groq', 'Alibaba'].map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setPricingFilter(prov)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        pricingFilter === prov
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                          : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-400'
                      }`}
                    >
                      {prov === 'all' ? 'All Providers' : prov}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 font-mono">
                      <th className="py-3 px-4 font-semibold">Model</th>
                      <th className="py-3 px-4 font-semibold">Provider</th>
                      <th className="py-3 px-4 font-semibold">Input / 1M</th>
                      <th className="py-3 px-4 font-semibold">Prompt Cache / 1M</th>
                      <th className="py-3 px-4 font-semibold">Output / 1M</th>
                      <th className="py-3 px-4 font-semibold">Reasoning / 1M</th>
                      <th className="py-3 px-4 font-semibold">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {filteredModels.map((m) => (
                      <tr key={m.model} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-slate-900 dark:text-white">
                              {m.model}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                              {m.speed}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-zinc-400">
                          {m.provider}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                          \${m.input.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                          \${m.cached?.toFixed(3) || (m.input * 0.5).toFixed(3)}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">
                          \${m.output.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-purple-600 dark:text-purple-400">
                          \${m.reasoning.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500 dark:text-zinc-400">
                          {m.context}
                        </td>
                      </tr>
                    ))}
                    {filteredModels.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
                          No models found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Zero Network Cost Callout */}
              <div className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Offline Pricing Engine (0ms Lookups)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Unlike APIs that require making a network call to fetch prices for each request, VibezCheck compiles pricing manifests locally into your application bundle. When calculating tokens via <code className="font-mono text-amber-600 dark:text-amber-400">vibezcheck.calculateCost()</code>, math runs synchronously in memory with zero network delay.
                </p>
              </div>
            </div>
          )}

          {/* TAB: LIBRARY API REFERENCE (SOURCE OF TRUTH) */}
          {activeTab === 'api-reference' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-medium mb-3">
                  <Code2 className="w-3.5 h-3.5" />
                  Source of Truth (v0.5.10)
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Library API Reference
                </h1>
                <p className="text-base text-slate-600 dark:text-zinc-300 mt-2 leading-relaxed">
                  Complete TypeScript signatures and parameters directly matching <code className="font-mono text-blue-600 dark:text-blue-400">akwaba/src/index.ts</code>.
                </p>
              </div>

              {/* Method 1: vibezcheck(model, options) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck(modelOrId, options?)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300">
                    Vercel AI SDK Wrapper
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Declarative model resolver for Vercel AI SDK <code className="font-mono text-[11px]">streamText</code> and <code className="font-mono text-[11px]">generateText</code>. Accepts either a string model ID or an existing LanguageModel instance.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: 'user_123',
    budgetUSD: 0.15,          // Circuit breaker limit
    marginMultiplier: 1.30,   // Charge customer 30% profit markup
    onCost: (cost) => {
      console.log('Wholesale:', cost.wholesaleCostUSD, 'Billed:', cost.billedCostUSD);
    },
  }),
  messages,
});`}
                </pre>
              </div>

              {/* Method 2: vibezcheck.wrapStream(stream, options) */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck.wrapStream(stream, options?)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                    Raw SDK Stream Wrapper
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Instruments raw response streams from the official OpenAI, Anthropic, or Google SDKs directly in-memory with 0ms latency.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
  stream: true,
});

// Pass native stream through zero-latency word meter
return vibezcheck.wrapStream(stream, {
  customer: 'user_123',
  model: 'gpt-4o',
});`}
                </pre>
              </div>

              {/* Method 3: vibezcheck.tool & vibezcheck.tools */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck.tool(tool, costUSD)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300">
                    Agent Tool Billing
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Instruments an AI tool with an execution cost. Every time the model executes the tool, the fixed cost is debited from the session budget and customer wallet.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`import { tool } from 'ai';
import { z } from 'zod';
import { vibezcheck } from 'vibezcheck';

const webSearch = vibezcheck.tool(
  tool({
    description: 'Search the live web',
    parameters: z.object({ query: z.string() }),
    execute: async ({ query }) => fetchSearchResults(query),
  }),
  0.02 // Debits $0.02 per search execution
);`}
                </pre>
              </div>

              {/* Method 4: vibezcheck.session & vibezcheck.stopWhen */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck.session(&#123; budgetUSD, customerId &#125;)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    Agent Loop Circuit Breaker
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Creates an <code className="font-mono text-[11px]">AgentSession</code> to track cumulative token usage and tool invocation costs across multi-turn agent execution loops.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`const session = vibezcheck.session({
  customerId: 'cust_abc',
  budgetUSD: 0.50, // Hard ceiling for entire multi-step task
});

const result = streamText({
  model: vibezcheck('gpt-4o-mini', { session }),
  tools: { webSearch },
  stopWhen: vibezcheck.stopWhen({ session, budgetUSD: 0.50 }),
});`}
                </pre>
              </div>

              {/* Method 5: vibezcheck.supabase & vibezcheck.database */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck.supabase() &amp; vibezcheck.database()
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
                    Database Sinks
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Asynchronous database adapters for logging usage events without adding latency to the client stream.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`// 1. First-party Supabase Adapter
vibezcheck.supabase(supabaseClient, {
  table: 'ai_usage_events',
  autoDebitWallet: true,
});

// 2. Universal DIY Adapter (Drizzle, Kysely, Prisma, Webhooks)
vibezcheck.database(async (event) => {
  await db.insert(aiUsageEvents).values({
    customerId: event.customerId,
    model: event.model,
    promptTokens: event.promptTokens,
    completionTokens: event.completionTokens,
    costUSD: event.billedCostUSD,
  });
});`}
                </pre>
              </div>

              {/* Method 6: Serverless Flush */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    vibezcheck.flush()
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    Serverless Lifecycle
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Flushes all in-memory usage events and batched database writes before a serverless function terminates.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`// Inside Next.js App Router (Node.js or Edge runtime)
globalThis.after(() => {
  vibezcheck.flush();
});

// Or using Next.js waitUntil
waitUntil(vibezcheck.flush());`}
                </pre>
              </div>

              {/* Frontend Components: <VibezReceipt /> & <VibezCheck /> */}
              <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    &lt;VibezReceipt /&gt; &amp; &lt;VibezCheck /&gt;
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    React UI Components
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Drop-in React micro-components for displaying telemetry, token splits, and live cost receipts in chat boxes or agent workflows.
                </p>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export function ChatMessage({ message }) {
  return (
    <div>
      <p>{message.content}</p>
      {/* Renders inline micro-badge: "$0.0014 · 120 tok · gpt-4o-mini" */}
      <VibezReceipt
        costUSD={message.costUSD}
        tokens={message.tokens}
        model={message.model}
      />
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
