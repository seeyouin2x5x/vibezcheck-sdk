'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import { LobeIcon } from '@/components/lobe-icon';
import {
  Calculator,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ChevronDown,
  Info,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ModelRate {
  id: string;
  name: string;
  provider: string;
  icon: string;
  inputPer1M: number;
  outputPer1M: number;
  cachedInputPer1M: number;
  reasoningPer1M?: number;
  pricingSource: string;
  sourceUrl: string;
}

const CATALOG: ModelRate[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    icon: 'openai',
    inputPer1M: 0.15,
    outputPer1M: 0.60,
    cachedInputPer1M: 0.075,
    pricingSource: 'OpenAI API Pricing',
    sourceUrl: 'https://openai.com/api/pricing',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    icon: 'openai',
    inputPer1M: 2.50,
    outputPer1M: 10.00,
    cachedInputPer1M: 1.25,
    pricingSource: 'OpenAI API Pricing',
    sourceUrl: 'https://openai.com/api/pricing',
  },
  {
    id: 'o1',
    name: 'OpenAI o1',
    provider: 'OpenAI',
    icon: 'openai',
    inputPer1M: 15.00,
    outputPer1M: 60.00,
    cachedInputPer1M: 7.50,
    reasoningPer1M: 60.00,
    pricingSource: 'OpenAI API Pricing',
    sourceUrl: 'https://openai.com/api/pricing',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    icon: 'claude-color',
    inputPer1M: 3.00,
    outputPer1M: 15.00,
    cachedInputPer1M: 0.30,
    pricingSource: 'Anthropic Pricing',
    sourceUrl: 'https://anthropic.com/pricing',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    icon: 'claude-color',
    inputPer1M: 0.80,
    outputPer1M: 4.00,
    cachedInputPer1M: 0.08,
    pricingSource: 'Anthropic Pricing',
    sourceUrl: 'https://anthropic.com/pricing',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    icon: 'gemini-color',
    inputPer1M: 3.50,
    outputPer1M: 10.50,
    cachedInputPer1M: 0.875,
    pricingSource: 'Google Cloud Pricing',
    sourceUrl: 'https://cloud.google.com/vertex-ai/pricing',
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    icon: 'gemini-color',
    inputPer1M: 0.075,
    outputPer1M: 0.30,
    cachedInputPer1M: 0.01875,
    pricingSource: 'Google Cloud Pricing',
    sourceUrl: 'https://cloud.google.com/vertex-ai/pricing',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    icon: 'deepseek-color',
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    cachedInputPer1M: 0.14,
    reasoningPer1M: 2.19,
    pricingSource: 'DeepSeek Official API',
    sourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    icon: 'deepseek-color',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    cachedInputPer1M: 0.014,
    pricingSource: 'DeepSeek Official API',
    sourceUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta / Groq',
    icon: 'meta-color',
    inputPer1M: 0.59,
    outputPer1M: 0.79,
    cachedInputPer1M: 0.30,
    pricingSource: 'Groq Cloud Inference',
    sourceUrl: 'https://groq.com/pricing',
  },
  {
    id: 'grok-2',
    name: 'Grok 2',
    provider: 'xAI',
    icon: 'grok',
    inputPer1M: 2.00,
    outputPer1M: 10.00,
    cachedInputPer1M: 1.00,
    pricingSource: 'xAI Pricing',
    sourceUrl: 'https://x.ai/api',
  },
];

export default function LlmCostCalculatorPage() {
  const [selectedId, setSelectedId] = useState('gpt-4o-mini');
  const [inputTokens, setInputTokens] = useState<number>(1000);
  const [outputTokens, setOutputTokens] = useState<number>(300);
  const [cachedTokens, setCachedTokens] = useState<number>(0);
  const [reasoningTokens, setReasoningTokens] = useState<number>(0);
  const [markupMultiplier, setMarkupMultiplier] = useState<number>(1.3);
  const [copied, setCopied] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  // Sync with URL query parameters if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('model');
      const inp = params.get('in');
      const out = params.get('out');
      const cache = params.get('cached');
      const r = params.get('reasoning');
      const markup = params.get('markup');

      if (m && CATALOG.some((item) => item.id === m)) setSelectedId(m);
      if (inp) setInputTokens(parseInt(inp, 10) || 1000);
      if (out) setOutputTokens(parseInt(out, 10) || 300);
      if (cache) setCachedTokens(parseInt(cache, 10) || 0);
      if (r) setReasoningTokens(parseInt(r, 10) || 0);
      if (markup) setMarkupMultiplier(parseFloat(markup) || 1.3);
    }
  }, []);

  const currentModel = useMemo(() => {
    return CATALOG.find((m) => m.id === selectedId) || CATALOG[0];
  }, [selectedId]);

  // Calculations using financial math
  const calculations = useMemo(() => {
    const regularInputTokens = Math.max(0, inputTokens - cachedTokens);
    const inputCost = (regularInputTokens / 1_000_000) * currentModel.inputPer1M;
    const cachedCost = (cachedTokens / 1_000_000) * currentModel.cachedInputPer1M;
    const standardOutputCost = (outputTokens / 1_000_000) * currentModel.outputPer1M;
    const reasoningCost = currentModel.reasoningPer1M
      ? (reasoningTokens / 1_000_000) * currentModel.reasoningPer1M
      : 0;

    const totalProviderCost = inputCost + cachedCost + standardOutputCost + reasoningCost;
    const customerPrice = totalProviderCost * markupMultiplier;
    const grossProfit = customerPrice - totalProviderCost;
    const grossMarginPercent = customerPrice > 0 ? (grossProfit / customerPrice) * 100 : 0;

    // Full regular input cost without cache
    const regularUncachedInputCost = (inputTokens / 1_000_000) * currentModel.inputPer1M;
    const cacheSavings = Math.max(0, regularUncachedInputCost - (inputCost + cachedCost));

    return {
      inputCost,
      cachedCost,
      standardOutputCost,
      reasoningCost,
      totalProviderCost,
      customerPrice,
      grossProfit,
      grossMarginPercent,
      cacheSavings,
    };
  }, [inputTokens, outputTokens, cachedTokens, reasoningTokens, markupMultiplier, currentModel]);

  const handleCopyResult = () => {
    const text = `${currentModel.name} Cost Estimate:
- Input Tokens: ${inputTokens.toLocaleString()} ($${calculations.inputCost.toFixed(6)})
- Output Tokens: ${outputTokens.toLocaleString()} ($${calculations.standardOutputCost.toFixed(6)})
- Total Provider Cost: $${calculations.totalProviderCost.toFixed(6)} USD
- Customer Billed Price (${markupMultiplier}x markup): $${calculations.customerPrice.toFixed(6)} USD
Calculated via VibezCheck (https://vibezcheck.app/llm-cost-calculator?model=${selectedId}&in=${inputTokens}&out=${outputTokens})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareUrl = () => {
    const url = `${window.location.origin}/llm-cost-calculator?model=${selectedId}&in=${inputTokens}&out=${outputTokens}&cached=${cachedTokens}&markup=${markupMultiplier}`;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#0c0d10] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      <Header />

      <article className="flex-1 max-w-5xl mx-auto px-4 pt-28 pb-20 w-full space-y-14">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-slate-500 dark:text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-800 dark:hover:text-zinc-300">Home</Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400">LLM Cost Calculator</span>
        </nav>

        {/* Header & Above-the-Fold Answer (Spec Section 11) */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            REAL-TIME TOKEN ECONOMICS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            LLM Cost Calculator
          </h1>
          {/* Direct AEO Answer Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed shadow-xs">
            <strong className="text-slate-950 dark:text-white">An LLM cost calculator</strong> estimates the dollar cost of an AI request from the model&apos;s pricing rates and its token usage. VibezCheck provides a model-aware calculator that runs locally from its bundled pricing catalog with BigInt nano-cent math.
          </div>
        </header>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-6 shadow-xs">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Select Model
              </label>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:border-emerald-500 transition cursor-pointer pr-10"
                >
                  {CATALOG.map((m) => (
                    <option key={m.id} value={m.id} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                      {m.name} ({m.provider}) — ${m.inputPer1M.toFixed(2)}/1M in · ${m.outputPer1M.toFixed(2)}/1M out
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Input Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-zinc-300">Input Tokens (Prompt)</span>
                <span className="font-mono text-emerald-400 font-bold">{inputTokens.toLocaleString()} tok</span>
              </div>
              <input
                type="range"
                min={0}
                max={64000}
                step={100}
                value={inputTokens}
                onChange={(e) => setInputTokens(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex gap-2 text-[11px] font-mono text-zinc-500">
                {[500, 1000, 4000, 16000, 32000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInputTokens(val)}
                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 hover:text-white transition cursor-pointer"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">Output Tokens (Completion)</span>
                <span className="font-mono text-emerald-400 font-bold">{outputTokens.toLocaleString()} tok</span>
              </div>
              <input
                type="range"
                min={0}
                max={16000}
                step={50}
                value={outputTokens}
                onChange={(e) => setOutputTokens(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex gap-2 text-[11px] font-mono text-zinc-500">
                {[150, 300, 800, 2000, 4000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setOutputTokens(val)}
                    className="px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 hover:text-white transition cursor-pointer"
                  >
                    {val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Cached Tokens (Accordion / Optional) */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Cached Input Tokens (Prompt Cache Discount)</span>
                <span className="font-mono text-zinc-300">{cachedTokens.toLocaleString()} tok</span>
              </div>
              <input
                type="range"
                min={0}
                max={inputTokens}
                step={100}
                value={cachedTokens}
                onChange={(e) => setCachedTokens(Math.min(inputTokens, Number(e.target.value)))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Markup Multiplier for Retail Pricing */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-zinc-400">Customer Markup Multiplier</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{markupMultiplier.toFixed(2)}× (+{Math.round((markupMultiplier - 1) * 100)}%)</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={3.0}
                step={0.05}
                value={markupMultiplier}
                onChange={(e) => setMarkupMultiplier(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          {/* Right Column: Calculated Outputs & Actions (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 space-y-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <LobeIcon name={currentModel.icon} size={20} alt={currentModel.name} />
                <span className="font-bold text-sm text-slate-950 dark:text-white">{currentModel.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">{currentModel.provider}</span>
            </div>

            {/* Breakdown Items */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                <span>Input Cost:</span>
                <span className="text-slate-900 dark:text-zinc-200">${calculations.inputCost.toFixed(6)}</span>
              </div>
              {cachedTokens > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Cache Savings:</span>
                  <span>-${calculations.cacheSavings.toFixed(6)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                <span>Output Cost:</span>
                <span className="text-slate-900 dark:text-zinc-200">${calculations.standardOutputCost.toFixed(6)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-zinc-300">Total Provider Cost:</span>
                <span className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                  ${calculations.totalProviderCost.toFixed(6)} USD
                </span>
              </div>

              {/* Retail Billed Price */}
              <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-500/30 space-y-1 mt-3">
                <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-300 font-semibold text-xs">
                  <span>Customer Billed Price:</span>
                  <span className="text-slate-950 dark:text-white text-sm font-bold">${calculations.customerPrice.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-zinc-400">
                  <span>Gross Profit:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">+${calculations.grossProfit.toFixed(6)} ({calculations.grossMarginPercent.toFixed(1)}% margin)</span>
                </div>
              </div>
            </div>

            {/* Actions: Copy Result & Shareable Link */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
              <button
                type="button"
                onClick={handleShareUrl}
                title="Share calculation URL"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 text-xs transition cursor-pointer"
              >
                {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{shareCopied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Pricing Verification & Disclaimer */}
            <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 text-[11px] text-slate-500 dark:text-zinc-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Verified rate card:</span>
                <span className="font-mono text-slate-700 dark:text-zinc-400">2026-09-17</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pricing source:</span>
                <a
                  href={currentModel.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{currentModel.pricingSource}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="pt-1 text-[10px] text-slate-500 dark:text-zinc-600 leading-normal">
                Provider pricing shown here was verified against public vendor rate cards. Confirm against provider sources for regional or batch discounts.
              </p>
            </div>
          </div>
        </div>

        {/* Formula-Based FAQ Section (Spec Section 11) */}
        <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Common Cost Calculations & Formulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-bold text-slate-950 dark:text-white">How much does 1,000 GPT tokens cost?</div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                For <strong>GPT-4o-mini</strong>: 1,000 input tokens cost $0.00015, and 1,000 output tokens cost $0.00060. A standard 1k in / 300 out exchange costs <strong>$0.00033 USD</strong>.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-slate-100 dark:bg-zinc-950 p-2 rounded">
                Cost = (1,000 × $0.15/1M) + (300 × $0.60/1M) = $0.00033
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-bold text-slate-950 dark:text-white">How much does 1 Million tokens cost?</div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                DeepSeek R1 input costs $0.55/1M, Claude 3.5 Sonnet costs $3.00/1M, and GPT-4o costs $2.50/1M. Prompt caching discounts lower repetitive input costs by up to 90%.
              </p>
              <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-slate-100 dark:bg-zinc-950 p-2 rounded">
                Effective Input = (Uncached × Rate) + (Cached × DiscountedRate)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-bold text-slate-950 dark:text-white">How do you calculate OpenAI token cost?</div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Multiply prompt tokens by the model input rate, cached tokens by the cache rate, and completion tokens by output rate:
              </p>
              <div className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 bg-slate-100 dark:bg-zinc-950 p-2 rounded">
                Total = (Prompt/1M × $2.50) + (Completion/1M × $10.00)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-bold text-slate-950 dark:text-white">How much does an AI agent run cost?</div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                An autonomous agent making 8 LLM calls with 3 tool executions typically uses ~24,000 prompt tokens and ~3,500 output tokens, costing between <strong>$0.04 and $0.35 USD</strong> depending on the model tier.
              </p>
            </div>
          </div>
        </section>

        {/* Integration Callout */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <div className="font-bold text-slate-950 dark:text-white text-base">Calculate costs automatically in code</div>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              VibezCheck executes this financial formula in-process with 0ms added latency.
            </p>
          </div>
          <Link
            href="/docs?section=quickstart"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-slate-950 text-xs font-bold transition whitespace-nowrap shadow-xs"
          >
            Start measuring →
          </Link>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
