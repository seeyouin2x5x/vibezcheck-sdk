'use client';

import React, { useState } from 'react';
import { useChat } from 'ai/react';
import { VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';
import { Sparkles, CreditCard, ArrowUp, Zap, ShieldCheck, Building2, User, Cpu, Percent } from 'lucide-react';

interface TenantProfile {
  id: string;
  name: string;
  email: string;
  orgId: string;
  orgName: string;
  plan: 'free' | 'pro' | 'enterprise';
  tier: string;
  role: string;
  badge: string;
}

const TENANT_PROFILES: TenantProfile[] = [
  {
    id: 'usr_alex_acme',
    name: 'Alex Rivera',
    email: 'alex@acme.com',
    orgId: 'org_acme_corp',
    orgName: 'Acme Corp',
    plan: 'enterprise',
    tier: 'enterprise-seat',
    role: 'Lead Architect',
    badge: 'Enterprise (Acme Corp)',
  },
  {
    id: 'usr_sarah_bolt',
    name: 'Sarah Chen',
    email: 'sarah@bolt.io',
    orgId: 'org_bolt_inc',
    orgName: 'Bolt AI',
    plan: 'pro',
    tier: 'pro-team',
    role: 'Fullstack Dev',
    badge: 'Pro Team (Bolt AI)',
  },
  {
    id: 'usr_demo_solo',
    name: 'Demo Hacker',
    email: 'solo@vibezcheck.dev',
    orgId: 'org_personal',
    orgName: 'Personal Sandbox',
    plan: 'free',
    tier: 'free-tier',
    role: 'Founder',
    badge: 'Free Sandbox',
  },
];

const AVAILABLE_MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: 'Fast, $0.15/1M input' },
  { id: 'gpt-4o', label: 'GPT-4o Flagship', desc: 'Deep reasoning, $2.50/1M input' },
];

export default function Home() {
  const [balanceUSD, setBalanceUSD] = useState<number>(10.0);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [activeProfile, setActiveProfile] = useState<TenantProfile>(TENANT_PROFILES[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [marginMultiplier, setMarginMultiplier] = useState<number>(1.5);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      user: {
        id: activeProfile.id,
        email: activeProfile.email,
        name: activeProfile.name,
        orgId: activeProfile.orgId,
        orgName: activeProfile.orgName,
        plan: activeProfile.plan,
        tier: activeProfile.tier,
        role: activeProfile.role,
      },
      modelName: selectedModel,
      margin: marginMultiplier,
    },
  });

  const handleTopUp = async () => {
    try {
      setIsTopUpLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: activeProfile.email, amountUSD: 10 }),
      });
      const data = await res.json();
      if (data.url) {
        if (data.simulated) {
          setBalanceUSD((prev) => prev + 10);
          setTopUpSuccess(true);
          setTimeout(() => setTopUpSuccess(false), 4000);
        } else {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const samplePrompts = [
    'Explain quantum computing in 2 punchy sentences.',
    'Write a TypeScript function to calculate B2B customer margins.',
    'How does VibezCheck achieve 0ms added stream latency?',
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto px-4 py-6">
      {/* Navigation Header */}
      <header className="flex items-center justify-between pb-6 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4FF32] flex items-center justify-center shadow-xs text-black font-black text-xl">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-stone-900 leading-tight">VibezAI SaaS</h1>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-[10px] font-semibold text-stone-600 border border-stone-200">
                v0.4.2
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">Next.js 15 • 0ms Metering • Stripe Multi-Tenant</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Credit Balance Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-500 font-medium text-xs">Balance:</span>
            <span className="font-bold text-stone-800">${balanceUSD.toFixed(2)}</span>
          </div>

          {/* Top Up Button */}
          <button
            onClick={handleTopUp}
            disabled={isTopUpLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            {isTopUpLoading ? 'Connecting...' : 'Top Up $10'}
          </button>
        </div>
      </header>

      {/* Control Bar: Multi-Tenant & Model Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 border-b border-stone-100">
        {/* B2B Tenant Selector */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-stone-700" /> Multi-Tenant Org
          </label>
          <select
            value={activeProfile.id}
            onChange={(e) => {
              const found = TENANT_PROFILES.find((p) => p.id === e.target.value);
              if (found) setActiveProfile(found);
            }}
            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            {TENANT_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.badge} ({p.role})
              </option>
            ))}
          </select>
        </div>

        {/* Model Switcher */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-stone-700" /> Model Engine
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} ({m.desc})
              </option>
            ))}
          </select>
        </div>

        {/* Profit Margin Multiplier */}
        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
            <Percent className="w-3 h-3 text-stone-700" /> Margin Multiplier
          </label>
          <select
            value={marginMultiplier}
            onChange={(e) => setMarginMultiplier(Number(e.target.value))}
            className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
          >
            <option value={1.0}>1.0x (Wholesale / At-Cost)</option>
            <option value={1.3}>1.3x (30% Profit Margin)</option>
            <option value={1.5}>1.5x (50% Profit Margin - Default)</option>
            <option value={2.0}>2.0x (100% Markup)</option>
          </select>
        </div>
      </div>

      {/* Top-up notification */}
      {topUpSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Simulated Stripe Top-Up successful! Added <strong>+$10.00</strong> to <strong>{activeProfile.email}</strong>.</span>
        </div>
      )}

      {/* Chat Scroll Area */}
      <main className="flex-1 py-8 space-y-6">
        {messages.length === 0 ? (
          <div className="py-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#D4FF32]/20 border border-[#D4FF32] text-black">
              <Sparkles className="w-8 h-8 text-stone-900" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-stone-900">0ms Metered Streaming with Stripe</h2>
              <p className="text-stone-500 text-sm max-w-md mx-auto">
                Every response streams with zero reverse-proxy overhead. Meter events with customer & org metadata are flushed asynchronously.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto pt-2">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleInputChange({ target: { value: prompt } } as any);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 transition-all text-left shadow-2xs cursor-pointer hover:border-stone-400"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2.5 max-w-[85%]">
                {message.role !== 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-[#D4FF32] text-black font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                    ✦
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-stone-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  {message.content}
                </div>
              </div>

              {/* Verified Micro-Receipt for Assistant Messages */}
              {message.role === 'assistant' && (
                <div className="ml-9 mt-1.5">
                  <VibezReceipt message={message} />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-stone-400 text-xs ml-1">
            <span className="w-2 h-2 rounded-full bg-[#D4FF32] animate-ping" />
            <span>Streaming tokens directly to client with 0ms added latency...</span>
          </div>
        )}
      </main>

      {/* Chat Input Bar */}
      <footer className="sticky bottom-4 pt-2 bg-[#fafaf9]/90 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder={`Ask ${selectedModel} as ${activeProfile.name}...`}
            className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-white border border-stone-200 text-stone-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 placeholder:text-stone-400 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-black hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-black text-white rounded-xl transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-stone-500 px-2 pt-2">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto $0.50 runaway safety fuse active
          </span>
          <span className="font-medium">
            Active Tenant: <strong className="text-stone-800">{activeProfile.orgId}</strong> • {marginMultiplier}x Margin
          </span>
        </div>
      </footer>

      {/* Floating Speedometer Token Counter */}
      <VibezSessionWidget position="bottom-right" theme="light" />
    </div>
  );
}
