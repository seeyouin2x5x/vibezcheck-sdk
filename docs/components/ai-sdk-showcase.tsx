'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Copy,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CreditCard,
  Calculator as CalcIcon,
  ShieldCheck,
  Bot,
  RotateCcw,
  ShieldAlert,
  Search,
  Terminal,
  Database,
  Zap,
  TrendingUp,
} from 'lucide-react';
import {
  Sandbox,
  SandboxHeader,
  SandboxBody,
  SandboxEditor,
  SandboxPreview,
} from './ai-elements/sandbox';
import { VibezReceipt } from '@/components/vibez-meter';
import { LobeIcon } from './lobe-icon';
import { ModelsMarquee } from './models-marquee';

export type ShowcaseTab =
  | 'chatbot'
  | 'tools-session'
  | 'spend-limit'
  | 'database'
  | 'stripe-metronome'
  | 'calculator';

export interface AiSdkShowcaseProps {
  audienceTab?: 'humans' | 'agents' | 'calculator';
  onAudienceChange?: (tab: 'humans' | 'agents' | 'calculator') => void;
  onProviderPkgChange?: (pkg: string) => void;
  onCorePkgChange?: (pkg: string) => void;
  cmdTab?: 'cli' | 'core' | 'ai-sdk' | 'install' | 'init';
}

export interface ModelPreset {
  id: string;
  name: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'xAI';
  coreSdkPkg: string;
  providerPkg: string;
  providerFn: string;
  modelString: string;
  modelId: string;
  badge: string;
  iconName: string;
  inputPer1M: number;
  outputPer1M: number;
  cachedInputPer1M?: number;
  tokens: number;
  costUSD: number;
  latencyMs: number;
}

export interface CompanyInfo {
  id: string;
  name: 'OpenAI' | 'Anthropic' | 'Google' | 'DeepSeek' | 'xAI';
  iconName: string;
  defaultModelId: string;
}

export const COMPANIES: CompanyInfo[] = [
  { id: 'openai', name: 'OpenAI', iconName: 'openai', defaultModelId: 'gpt-5.6-sol' },
  { id: 'anthropic', name: 'Anthropic', iconName: 'anthropic', defaultModelId: 'claude-3-7-sonnet' },
  { id: 'google', name: 'Google', iconName: 'google-color', defaultModelId: 'gemini-3.7-flash' },
  { id: 'deepseek', name: 'DeepSeek', iconName: 'deepseek-color', defaultModelId: 'deepseek-v4-pro' },
  { id: 'xai', name: 'xAI', iconName: 'grok', defaultModelId: 'grok-4.6' },
];

export function getCompanyIcon(provider: string): string {
  const p = provider.toLowerCase();
  if (p.includes('openai')) return 'openai';
  if (p.includes('anthropic')) return 'anthropic';
  if (p.includes('google')) return 'google-color';
  if (p.includes('deepseek')) return 'deepseek-color';
  if (p.includes('xai') || p.includes('grok')) return 'grok';
  return 'lobehub';
}

/**
 * Registry of Models & Rates sourced directly from akwaba/src/pricing/table.ts
 */
export const PRESETS: ModelPreset[] = [
  // --- OpenAI (Modern & Reasoning) ---
  {
    id: 'gpt-5.6-sol',
    name: 'GPT-5.6 Sol',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-5.6-sol',
    modelId: 'gpt-5.6-sol',
    badge: 'Sol',
    iconName: 'openai',
    inputPer1M: 4.0,
    outputPer1M: 20.0,
    cachedInputPer1M: 0.4,
    tokens: 150,
    costUSD: 0.0014,
    latencyMs: 110,
  },
  {
    id: 'gpt-5.6-terra',
    name: 'GPT-5.6 Terra',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-5.6-terra',
    modelId: 'gpt-5.6-terra',
    badge: 'Terra',
    iconName: 'openai',
    inputPer1M: 2.0,
    outputPer1M: 12.0,
    cachedInputPer1M: 0.2,
    tokens: 145,
    costUSD: 0.0008,
    latencyMs: 105,
  },
  {
    id: 'gpt-5.6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-5.6-luna',
    modelId: 'gpt-5.6-luna',
    badge: 'Luna',
    iconName: 'openai',
    inputPer1M: 0.2,
    outputPer1M: 1.2,
    cachedInputPer1M: 0.02,
    tokens: 140,
    costUSD: 0.00008,
    latencyMs: 75,
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-5',
    modelId: 'gpt-5',
    badge: 'GPT-5',
    iconName: 'openai',
    inputPer1M: 4.0,
    outputPer1M: 20.0,
    cachedInputPer1M: 0.4,
    tokens: 160,
    costUSD: 0.0015,
    latencyMs: 120,
  },
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-5-mini',
    modelId: 'gpt-5-mini',
    badge: 'Mini',
    iconName: 'openai',
    inputPer1M: 0.2,
    outputPer1M: 1.2,
    cachedInputPer1M: 0.02,
    tokens: 135,
    costUSD: 0.000075,
    latencyMs: 80,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-4o',
    modelId: 'gpt-4o',
    badge: '4o',
    iconName: 'openai',
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    cachedInputPer1M: 1.25,
    tokens: 140,
    costUSD: 0.00075,
    latencyMs: 115,
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-4o-mini',
    modelId: 'gpt-4o-mini',
    badge: 'Mini',
    iconName: 'openai',
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    cachedInputPer1M: 0.075,
    tokens: 138,
    costUSD: 0.000045,
    latencyMs: 85,
  },
  {
    id: 'o3-mini',
    name: 'o3-mini',
    provider: 'OpenAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/o3-mini',
    modelId: 'o3-mini',
    badge: 'o3',
    iconName: 'openai',
    inputPer1M: 1.1,
    outputPer1M: 4.4,
    cachedInputPer1M: 0.55,
    tokens: 180,
    costUSD: 0.00043,
    latencyMs: 165,
  },

  // --- Anthropic (Modern & Extended Thinking) ---
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-3-7-sonnet',
    modelId: 'claude-3-7-sonnet',
    badge: '3.7',
    iconName: 'claude-color',
    inputPer1M: 0.59,
    outputPer1M: 2.93,
    cachedInputPer1M: 0.3,
    tokens: 154,
    costUSD: 0.00021,
    latencyMs: 140,
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-sonnet-5',
    modelId: 'claude-sonnet-5',
    badge: 'Sonnet 5',
    iconName: 'claude-color',
    inputPer1M: 2.0,
    outputPer1M: 10.0,
    cachedInputPer1M: 0.3,
    tokens: 155,
    costUSD: 0.0007,
    latencyMs: 130,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-3-5-sonnet',
    modelId: 'claude-3-5-sonnet',
    badge: 'Sonnet',
    iconName: 'claude-color',
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    cachedInputPer1M: 0.3,
    tokens: 150,
    costUSD: 0.00105,
    latencyMs: 135,
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-3-5-haiku',
    modelId: 'claude-3-5-haiku',
    badge: 'Haiku',
    iconName: 'claude-color',
    inputPer1M: 0.8,
    outputPer1M: 4.0,
    cachedInputPer1M: 0.08,
    tokens: 130,
    costUSD: 0.00024,
    latencyMs: 65,
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-opus-5',
    modelId: 'claude-opus-5',
    badge: 'Opus 5',
    iconName: 'claude-color',
    inputPer1M: 5.0,
    outputPer1M: 25.0,
    cachedInputPer1M: 1.5,
    tokens: 165,
    costUSD: 0.00175,
    latencyMs: 160,
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    coreSdkPkg: '@anthropic-ai/sdk',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-3-opus',
    modelId: 'claude-3-opus',
    badge: 'Opus',
    iconName: 'claude-color',
    inputPer1M: 15.0,
    outputPer1M: 75.0,
    cachedInputPer1M: 1.5,
    tokens: 160,
    costUSD: 0.00585,
    latencyMs: 180,
  },

  // --- Google Gemini (Modern & Thoughts) ---
  {
    id: 'gemini-3.7-flash',
    name: 'Gemini 3.7 Flash',
    provider: 'Google',
    coreSdkPkg: '@google/genai',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-3.7-flash',
    modelId: 'gemini-3.7-flash',
    badge: '3.7',
    iconName: 'gemini-color',
    inputPer1M: 0.75,
    outputPer1M: 3.75,
    cachedInputPer1M: 0.18,
    tokens: 150,
    costUSD: 0.00026,
    latencyMs: 80,
  },
  {
    id: 'gemini-3.5-flash',
    name: 'Gemini 3.5 Flash',
    provider: 'Google',
    coreSdkPkg: '@google/genai',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-3.5-flash',
    modelId: 'gemini-3.5-flash',
    badge: '3.5',
    iconName: 'gemini-color',
    inputPer1M: 1.5,
    outputPer1M: 9.0,
    cachedInputPer1M: 0.38,
    tokens: 150,
    costUSD: 0.0006,
    latencyMs: 85,
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    coreSdkPkg: '@google/genai',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-2.5-flash',
    modelId: 'gemini-2.5-flash',
    badge: '2.5',
    iconName: 'gemini-color',
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    cachedInputPer1M: 0.0375,
    tokens: 148,
    costUSD: 0.000045,
    latencyMs: 85,
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    coreSdkPkg: '@google/genai',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-2.0-flash',
    modelId: 'gemini-2.0-flash',
    badge: '2.0',
    iconName: 'gemini-color',
    inputPer1M: 0.1,
    outputPer1M: 0.4,
    cachedInputPer1M: 0.025,
    tokens: 145,
    costUSD: 0.000030,
    latencyMs: 70,
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    coreSdkPkg: '@google/genai',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-1.5-pro',
    modelId: 'gemini-1.5-pro',
    badge: 'Pro',
    iconName: 'gemini-color',
    inputPer1M: 1.25,
    outputPer1M: 5.0,
    cachedInputPer1M: 0.3125,
    tokens: 155,
    costUSD: 0.00039,
    latencyMs: 130,
  },

  // --- DeepSeek ---
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/deepseek',
    providerFn: 'deepseek',
    modelString: 'deepseek/deepseek-v4-pro',
    modelId: 'deepseek-v4-pro',
    badge: 'V4 Pro',
    iconName: 'deepseek-color',
    inputPer1M: 0.66,
    outputPer1M: 1.98,
    cachedInputPer1M: 0.15,
    tokens: 160,
    costUSD: 0.00017,
    latencyMs: 140,
  },
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash',
    provider: 'DeepSeek',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/deepseek',
    providerFn: 'deepseek',
    modelString: 'deepseek/deepseek-v4-flash',
    modelId: 'deepseek-v4-flash',
    badge: 'V4 Flash',
    iconName: 'deepseek-color',
    inputPer1M: 0.22,
    outputPer1M: 0.66,
    cachedInputPer1M: 0.05,
    tokens: 145,
    costUSD: 0.000055,
    latencyMs: 90,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/deepseek',
    providerFn: 'deepseek',
    modelString: 'deepseek/deepseek-r1',
    modelId: 'deepseek-r1',
    badge: 'R1',
    iconName: 'deepseek-color',
    inputPer1M: 0.55,
    outputPer1M: 2.19,
    cachedInputPer1M: 0.14,
    tokens: 182,
    costUSD: 0.000165,
    latencyMs: 165,
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/deepseek',
    providerFn: 'deepseek',
    modelString: 'deepseek/deepseek-v3',
    modelId: 'deepseek-v3',
    badge: 'V3',
    iconName: 'deepseek-color',
    inputPer1M: 0.14,
    outputPer1M: 0.28,
    cachedInputPer1M: 0.014,
    tokens: 145,
    costUSD: 0.000035,
    latencyMs: 90,
  },

  // --- xAI Grok ---
  {
    id: 'grok-4.6',
    name: 'xAI Grok 4.6',
    provider: 'xAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/xai',
    providerFn: 'xai',
    modelString: 'xai/grok-4.6',
    modelId: 'grok-4.6',
    badge: '4.6',
    iconName: 'grok',
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    tokens: 155,
    costUSD: 0.00105,
    latencyMs: 110,
  },
  {
    id: 'grok-3',
    name: 'xAI Grok 3',
    provider: 'xAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/xai',
    providerFn: 'xai',
    modelString: 'xai/grok-3',
    modelId: 'grok-3',
    badge: '𝕏3',
    iconName: 'grok',
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    tokens: 150,
    costUSD: 0.00105,
    latencyMs: 115,
  },
  {
    id: 'grok-2',
    name: 'xAI Grok 2',
    provider: 'xAI',
    coreSdkPkg: 'openai',
    providerPkg: '@ai-sdk/xai',
    providerFn: 'xai',
    modelString: 'xai/grok-2',
    modelId: 'grok-2',
    badge: '𝕏2',
    iconName: 'grok',
    inputPer1M: 2.0,
    outputPer1M: 10.0,
    tokens: 142,
    costUSD: 0.0007,
    latencyMs: 98,
  },
];

export interface UseCaseData {
  id: ShowcaseTab;
  tabTitle: string;
  chipLabel: string;
  badge: string;
  prompt: string;
  getAiResponse: (
    preset: ModelPreset,
    vibezCheckEnabled: boolean,
    marginMultiplier: string
  ) => string;
  interactiveTip: string;
}

export const USE_CASES: Record<ShowcaseTab, UseCaseData> = {
  chatbot: {
    id: 'chatbot',
    tabTitle: 'Chatbot',
    chipLabel: '⚡ 0ms Metering',
    badge: 'Zero Latency (ZDR)',
    prompt: 'How do I stream LLM tokens and get real-time cost telemetry without adding network latency?',
    getAiResponse: (preset, enabled) =>
      enabled
        ? `VibezCheck meters every chunk offline using a local tokenizer index — 0ms added network latency! Notice the live receipt badge below showing exact wholesale cost ($${preset.costUSD.toFixed(5)}) and token count (${preset.tokens} tokens).`
        : `⚠️ Warning: VibezCheck FinOps knob is OFF! The request is running completely unmetered with zero cost tracking, no token counting, and no budget safeguards.`,
    interactiveTip: '💡 Try toggling the VibezCheck switch in the top-right header to see unmetered behavior.',
  },
  'tools-session': {
    id: 'tools-session',
    tabTitle: 'Tools & Sessions',
    chipLabel: '🛠️ Tools & $2 Budget',
    badge: 'sessionBudgetUSD: $2.00',
    prompt: 'Run an autonomous research workflow with webSearch and calculator within my $2.00 budget.',
    getAiResponse: (preset, enabled) =>
      enabled
        ? `Dispatched agent tools: webSearch ($0.01) and calculator ($0.005). Total session spend is $${(preset.costUSD + 0.015).toFixed(5)} / $2.00 limit. The session wrapper guarantees your multi-turn agent never overspends.`
        : `⚠️ Unmetered agent execution: Tool calls and recursive loops are firing without a session budget ceiling. High risk of runaway token consumption!`,
    interactiveTip: '💡 Inspect the Tool Call Latency card below to view per-tool pricing ($0.01 / $0.005) and cumulative spend.',
  },
  'spend-limit': {
    id: 'spend-limit',
    tabTitle: 'Spend Limit',
    chipLabel: '🛡️ $0.50 Circuit Breaker',
    badge: 'maxCostPerCallUSD: $0.50',
    prompt: 'What stops this model from getting caught in an infinite loop or racking up a $50 bill?',
    getAiResponse: (preset, enabled) =>
      enabled
        ? `Our maxCostPerCallUSD: 0.50 circuit breaker is armed. If recursive loops exceed $0.50 or 4,000 tokens, VibezCheck instantly aborts the stream with a CircuitBreakerError to protect your wallet.`
        : `⚠️ Circuit breaker is disabled! In an infinite loop, this agent will continue running until provider rate limits or your credit card limit is hit.`,
    interactiveTip: '💡 Click "Simulate Runaway Loop" below to watch the circuit breaker trip in real time!',
  },
  database: {
    id: 'database',
    tabTitle: 'Database',
    chipLabel: '🗄️ Supabase Ledger',
    badge: 'vibezcheck.supabase()',
    prompt: 'Where does my customer usage data go without slowing down the hot streaming path?',
    getAiResponse: (preset, enabled) =>
      enabled
        ? `Usage events are asynchronously flushed straight to your Supabase vibez_usage table. Your streaming responses remain lightning fast while your balance ledger stays perfectly synchronized.`
        : `⚠️ Database ledger inactive: Usage is not logged to Supabase. Billing reconciliation cannot be performed.`,
    interactiveTip: '💡 Click "Simulate Request" below to deduct wholesale cost from the live Supabase ledger.',
  },
  'stripe-metronome': {
    id: 'stripe-metronome',
    tabTitle: 'Stripe & Metronome',
    chipLabel: '💳 Metronome Margin',
    badge: 'pricing: { margin }',
    prompt: 'How do I charge my customers with a profit margin and bill them through Metronome?',
    getAiResponse: (preset, enabled, marginMultiplier) =>
      enabled
        ? `With pricing: { margin: ${marginMultiplier} }, wholesale cost ($${preset.costUSD.toFixed(5)}) is marked up to $${(preset.costUSD * Number(marginMultiplier)).toFixed(5)} retail and emitted directly to Metronome /v1/ingest.`
        : `⚠️ Billing integration offline: No Metronome events emitted. Margins cannot be applied.`,
    interactiveTip: '💡 Drag the profit margin slider below to see wholesale vs retail pricing adjust live.',
  },
  calculator: {
    id: 'calculator',
    tabTitle: 'Calculator',
    chipLabel: '🧮 Cost Calculator',
    badge: 'tokenCost() • Nano Math',
    prompt: 'How do I calculate nano-dollar token costs and profit margins before deploying to production?',
    getAiResponse: (preset, enabled, marginMultiplier) =>
      enabled
        ? `Using VibezCheck's exact BigInt nano-precision pricing engine, ${preset.name} costs $${preset.costUSD.toFixed(5)} wholesale. With a ${marginMultiplier}x customer margin, retail price is marked up and logged to Metronome.`
        : `⚠️ FinOps calculation offline: Enable VibezCheck to calculate live wholesale vs retail pricing.`,
    interactiveTip: '💡 Use the retro handheld calculator and sliders below to dial in instruction, prompt, and completion tokens.',
  },
};

type TokenType = 'kw' | 'fn' | 'str' | 'var' | 'num' | 'comment' | 'plain';
interface CodeToken {
  type: TokenType;
  text: string;
}
interface CodeLine {
  num: number;
  tokens: CodeToken[];
}

function tokenizeTypeScript(code: string): CodeLine[] {
  const lines = code.trim().split('\n');
  return lines.map((line, idx) => {
    const tokens: CodeToken[] = [];
    const tokenRegex =
      /(\/\/.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b(?:import|export|from|const|let|var|async|await|function|return|new|if|else|typeof|as)\b)|(\b\d+(?:\.\d+)?\b)|([a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\())|([a-zA-Z_$][a-zA-Z0-9_$]*)|(\s+|[^\s\w'"`]+)/g;

    let match: RegExpExecArray | null;
    let safety = 0;
    while ((match = tokenRegex.exec(line)) !== null && safety++ < 1000) {
      if (match[0].length === 0) {
        tokenRegex.lastIndex++;
        continue;
      }
      if (match[1]) {
        tokens.push({ type: 'comment', text: match[1] });
      } else if (match[2]) {
        tokens.push({ type: 'str', text: match[2] });
      } else if (match[3]) {
        tokens.push({ type: 'kw', text: match[3] });
      } else if (match[4]) {
        tokens.push({ type: 'num', text: match[4] });
      } else if (match[5]) {
        tokens.push({ type: 'fn', text: match[5] });
      } else if (match[6]) {
        tokens.push({ type: 'var', text: match[6] });
      } else if (match[7]) {
        tokens.push({ type: 'plain', text: match[7] });
      }
    }

    if (tokens.length === 0) {
      tokens.push({ type: 'plain', text: line || '' });
    }

    return { num: idx + 1, tokens };
  });
}

export function AiSdkShowcase({
  audienceTab = 'humans',
  onAudienceChange,
  onProviderPkgChange,
  onCorePkgChange,
  cmdTab = 'core',
}: AiSdkShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>('chatbot');
  const [presetIndex, setPresetIndex] = useState<number>(0); // GPT-5.6 Sol default
  const [copied, setCopied] = useState<boolean>(false);
  const [vibezCheckEnabled, setVibezCheckEnabled] = useState<boolean>(true);

  // FinOps Interactive States
  const [marginPercent, setMarginPercent] = useState<number>(30);
  const marginMultiplier = (1 + marginPercent / 100).toFixed(2);
  const [metronomeEvents, setMetronomeEvents] = useState<number>(1);
  const [metronomeSyncing, setMetronomeSyncing] = useState<boolean>(false);
  const [lastTxnId, setLastTxnId] = useState<string>('txn_live_84920a');

  // Supabase Interactive Ledger States
  const [supabaseBalance, setSupabaseBalance] = useState<number>(25.0);
  const [supabaseRows, setSupabaseRows] = useState<
    Array<{ id: string; customerId: string; model: string; tokens: number; costUSD: number; time: string }>
  >([
    {
      id: 'row_948a',
      customerId: 'cust_supa_99',
      model: 'gpt-5.6-sol',
      tokens: 840,
      costUSD: 0.00168,
      time: 'Just now',
    },
  ]);
  const [supabaseSyncing, setSupabaseSyncing] = useState<boolean>(false);

  // Agent Session & Safety Fuse States
  const [fuseTripped, setFuseTripped] = useState<boolean>(true);
  const [isSimulatingLoop, setIsSimulatingLoop] = useState<boolean>(false);
  const [simulatedCost, setSimulatedCost] = useState<number>(0.5002);
  const [simulatedStep, setSimulatedStep] = useState<number>(3);

  // ✦ Pasted Prompt Evaluation States (Instructions, Input, Output)
  const [evalInstructions, setEvalInstructions] = useState<string>(
    'You are an expert AI software architect. Analyze requirements and implement modular, high-performance TypeScript components.'
  );
  const [evalInput, setEvalInput] = useState<string>(
    'How do I implement real-time token metering and usage-based Stripe billing for my AI streaming route?'
  );
  const [evalOutput, setEvalOutput] = useState<string>(
    'Use VibezCheck to wrap your AI SDK stream. It meters tokens with 0ms added latency, enforces cost fuses, and dispatches usage to Metronome or Supabase.'
  );

  const estimateTokens = (text: string): number => {
    if (!text || text.trim().length === 0) return 0;
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round((chars / 4 + words * 1.33) / 2));
  };

  // ✦ Handheld Retro Calculator States (Synced with prompt textareas & sliders)
  const [calcInstTokens, setCalcInstTokens] = useState<number>(350);
  const [calcInTokens, setCalcInTokens] = useState<number>(1200);
  const [calcOutTokens, setCalcOutTokens] = useState<number>(450);
  const [calcDisplayMode, setCalcDisplayMode] = useState<'usd' | 'tokens'>('usd');
  const [calcFocusedField, setCalcFocusedField] = useState<'inst' | 'in' | 'out'>('in');

  const handleInstructionsChange = (val: string) => {
    setEvalInstructions(val);
    setCalcInstTokens(estimateTokens(val));
  };

  const handleInputChange = (val: string) => {
    setEvalInput(val);
    setCalcInTokens(estimateTokens(val));
  };

  const handleOutputChange = (val: string) => {
    setEvalOutput(val);
    setCalcOutTokens(estimateTokens(val));
  };

  const handleLoadSamplePrompt = () => {
    const inst = 'You are an expert AI software architect. Analyze requirements and implement modular, high-performance TypeScript components.';
    const input = 'How do I implement real-time token metering and usage-based Stripe billing for my AI streaming route?';
    const output = 'Use VibezCheck to wrap your AI SDK stream. It meters tokens with 0ms added latency, enforces cost fuses, and dispatches usage to Metronome or Supabase.';
    setEvalInstructions(inst);
    setEvalInput(input);
    setEvalOutput(output);
    setCalcInstTokens(estimateTokens(inst));
    setCalcInTokens(estimateTokens(input));
    setCalcOutTokens(estimateTokens(output));
  };

  const handleClearPrompt = () => {
    setEvalInstructions('');
    setEvalInput('');
    setEvalOutput('');
    setCalcInstTokens(0);
    setCalcInTokens(0);
    setCalcOutTokens(0);
  };

  const currentPreset = PRESETS[presetIndex] || PRESETS[0];
  const currentUseCase = USE_CASES[activeTab] || USE_CASES.chatbot;

  // Company switching helpers
  const handlePrevCompany = () => {
    const currentCompIdx = COMPANIES.findIndex(
      (c) => c.name.toLowerCase() === currentPreset.provider.toLowerCase()
    );
    const nextCompIdx = currentCompIdx <= 0 ? COMPANIES.length - 1 : currentCompIdx - 1;
    const targetCompany = COMPANIES[nextCompIdx];
    const modelIdx = PRESETS.findIndex((p) => p.id === targetCompany.defaultModelId);
    if (modelIdx !== -1) {
      setPresetIndex(modelIdx);
    } else {
      const fallbackIdx = PRESETS.findIndex(
        (p) => p.provider.toLowerCase() === targetCompany.name.toLowerCase()
      );
      if (fallbackIdx !== -1) setPresetIndex(fallbackIdx);
    }
  };

  const handleNextCompany = () => {
    const currentCompIdx = COMPANIES.findIndex(
      (c) => c.name.toLowerCase() === currentPreset.provider.toLowerCase()
    );
    const nextCompIdx = currentCompIdx >= COMPANIES.length - 1 ? 0 : currentCompIdx + 1;
    const targetCompany = COMPANIES[nextCompIdx];
    const modelIdx = PRESETS.findIndex((p) => p.id === targetCompany.defaultModelId);
    if (modelIdx !== -1) {
      setPresetIndex(modelIdx);
    } else {
      const fallbackIdx = PRESETS.findIndex(
        (p) => p.provider.toLowerCase() === targetCompany.name.toLowerCase()
      );
      if (fallbackIdx !== -1) setPresetIndex(fallbackIdx);
    }
  };

  const handleSelectCompany = (companyName: string) => {
    const targetCompany = COMPANIES.find(
      (c) => c.name.toLowerCase() === companyName.toLowerCase()
    );
    if (!targetCompany) return;
    const modelIdx = PRESETS.findIndex((p) => p.id === targetCompany.defaultModelId);
    if (modelIdx !== -1) {
      setPresetIndex(modelIdx);
    } else {
      const fallbackIdx = PRESETS.findIndex(
        (p) => p.provider.toLowerCase() === targetCompany.name.toLowerCase()
      );
      if (fallbackIdx !== -1) setPresetIndex(fallbackIdx);
    }
  };

  const handlePrevModel = () => {
    setPresetIndex((prev) => (prev === 0 ? PRESETS.length - 1 : prev - 1));
  };

  const handleNextModel = () => {
    setPresetIndex((prev) => (prev === PRESETS.length - 1 ? 0 : prev + 1));
  };

  const handleSelectModelFromMarquee = (modelName: string) => {
    const q = modelName.toLowerCase();
    const foundIdx = PRESETS.findIndex(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.modelId.toLowerCase().includes(q) ||
        q.includes(p.name.toLowerCase()) ||
        q.includes(p.provider.toLowerCase())
    );
    if (foundIdx !== -1) {
      setPresetIndex(foundIdx);
    }
  };

  // Sync with parent audience selector knob
  useEffect(() => {
    if (audienceTab === 'calculator') {
      setActiveTab('calculator');
    } else if (audienceTab === 'humans') {
      if (activeTab === 'calculator') {
        setActiveTab('chatbot');
      }
    } else if (audienceTab === 'agents') {
      if (activeTab === 'chatbot' || activeTab === 'calculator') {
        setActiveTab('tools-session');
      }
    }
  }, [audienceTab]);

  // Sync provider and core packages to parent
  useEffect(() => {
    onProviderPkgChange?.(currentPreset.providerPkg);
    onCorePkgChange?.(currentPreset.coreSdkPkg);
  }, [currentPreset, onProviderPkgChange, onCorePkgChange]);

  const handleTabChange = (tab: ShowcaseTab) => {
    setActiveTab(tab);
    if (tab === 'calculator') {
      onAudienceChange?.('calculator');
    } else if (tab === 'chatbot') {
      onAudienceChange?.('humans');
    } else {
      onAudienceChange?.('agents');
    }
  };

  const handleSimulateMetronome = () => {
    if (metronomeSyncing) return;
    setMetronomeSyncing(true);
    const newTxn = `txn_live_${Math.random().toString(36).slice(2, 8)}`;
    setTimeout(() => {
      setLastTxnId(newTxn);
      setMetronomeEvents((prev) => prev + 1);
      setMetronomeSyncing(false);
    }, 400);
  };

  const handleSimulateSupabase = () => {
    if (supabaseSyncing) return;
    setSupabaseSyncing(true);
    const cost = currentPreset.costUSD;
    setTimeout(() => {
      setSupabaseBalance((prev) => Math.max(0, Number((prev - cost).toFixed(5))));
      const newRow = {
        id: `row_${Math.random().toString(36).slice(2, 6)}`,
        customerId: 'cust_supa_99',
        model: currentPreset.modelId,
        tokens: currentPreset.tokens,
        costUSD: cost,
        time: 'Just now',
      };
      setSupabaseRows((prev) => [newRow, ...prev.slice(0, 2)]);
      setSupabaseSyncing(false);
    }, 350);
  };

  const handleSimulateLoop = () => {
    if (isSimulatingLoop) return;
    setIsSimulatingLoop(true);
    setSimulatedStep(1);
    setSimulatedCost(0.0008);
    setFuseTripped(false);

    setTimeout(() => {
      setSimulatedStep(2);
      setSimulatedCost(0.0034);

      setTimeout(() => {
        setSimulatedStep(3);
        if (vibezCheckEnabled) {
          setSimulatedCost(0.5002);
          setFuseTripped(true);
          setIsSimulatingLoop(false);
        } else {
          setTimeout(() => {
            setSimulatedStep(6);
            setSimulatedCost(12.45);
            setTimeout(() => {
              setSimulatedStep(14);
              setSimulatedCost(48.502);
              setIsSimulatingLoop(false);
            }, 350);
          }, 350);
        }
      }, 450);
    }, 450);
  };

  // Exact BigInt Nano-Precision Financial Math for Calculator
  const calcTotalTok = calcInstTokens + calcInTokens + calcOutTokens;
  const { calcWholesaleUSD, calcRetailUSD, calcProfitUSD } = useMemo(() => {
    const totalInputTok = BigInt(calcInstTokens + calcInTokens);
    const totalOutputTok = BigInt(calcOutTokens);

    const rateInputNano = BigInt(Math.round((currentPreset.inputPer1M ?? 1.0) * 1_000));
    const rateOutputNano = BigInt(Math.round((currentPreset.outputPer1M ?? 5.0) * 1_000));

    const inputCostNano = totalInputTok * rateInputNano;
    const outputCostNano = totalOutputTok * rateOutputNano;
    const wholesaleNano = inputCostNano + outputCostNano;

    const markupMultiplierNano = BigInt(Math.round((1 + marginPercent / 100) * 1_000));
    const retailNano = (wholesaleNano * markupMultiplierNano) / 1_000n;
    const profitNano = retailNano > wholesaleNano ? retailNano - wholesaleNano : 0n;

    return {
      calcWholesaleUSD: Number(wholesaleNano) / 1_000_000_000,
      calcRetailUSD: Number(retailNano) / 1_000_000_000,
      calcProfitUSD: Number(profitNano) / 1_000_000_000,
    };
  }, [calcInstTokens, calcInTokens, calcOutTokens, currentPreset, marginPercent]);

  // Keypad click handlers
  const handleKeypadDigit = (digit: string) => {
    if (calcFocusedField === 'inst') {
      const cur = calcInstTokens.toString();
      const next = cur === '0' ? digit : cur + digit;
      setCalcInstTokens(Math.min(10000, parseInt(next, 10) || 0));
    } else if (calcFocusedField === 'in') {
      const cur = calcInTokens.toString();
      const next = cur === '0' ? digit : cur + digit;
      setCalcInTokens(Math.min(50000, parseInt(next, 10) || 0));
    } else {
      const cur = calcOutTokens.toString();
      const next = cur === '0' ? digit : cur + digit;
      setCalcOutTokens(Math.min(10000, parseInt(next, 10) || 0));
    }
  };

  const handleKeypadClear = () => {
    handleClearPrompt();
  };

  const handleKeypadReset = () => {
    handleLoadSamplePrompt();
  };

  // Generate harmonized code snippet using official vibezcheck library signatures
  const rawCodeString = useMemo(() => {
    const { provider, modelId, providerPkg, providerFn } = currentPreset;

    if (!vibezCheckEnabled) {
      if (cmdTab === 'core') {
        if (provider === 'Anthropic') {
          return `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// WARNING: Running unmetered! No token counting or safety fuse enabled.
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = await anthropic.messages.create({
    model: '${modelId}',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  return new Response(stream);
}`;
        }
        if (provider === 'Google') {
          return `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();

// WARNING: Running unmetered! No token counting or safety fuse enabled.
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const stream = await ai.models.generateContentStream({
    model: '${modelId}',
    contents: prompt,
  });

  return new Response(stream);
}`;
        }
        return `import OpenAI from 'openai';

const openai = new OpenAI();

// WARNING: Running unmetered! No token counting or safety fuse enabled.
export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: '${modelId}',
    stream: true,
    messages,
  });

  return new Response(stream);
}`;
      }
      return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';

// WARNING: Running unmetered! No token counting or safety fuse enabled.
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: ${providerFn}('${modelId}'),
    messages,
  });

  return result.toDataStreamResponse();
}`;
    }

    // ✦ Harmonized Core SDK Code: Multi-provider support (Anthropic, Google, OpenAI, xAI, DeepSeek)
    if (cmdTab === 'core') {
      const toolCommentBlock = `// 1. Define custom tool with execution logic
const searchTool = {
  description: 'Search documentation or live web',
  execute: async (query: string) => fetchResults(query),
};

`;

      // Anthropic
      if (provider === 'Anthropic') {
        let imports = `import Anthropic from '@anthropic-ai/sdk';
import { vibez } from 'vibezcheck';

const anthropic = new Anthropic();
`;
        if (activeTab === 'tools-session') imports += `\n${toolCommentBlock}`;
        if (activeTab === 'database') {
          imports = `import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { vibez, vibezcheck } from 'vibezcheck';

const anthropic = new Anthropic();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
`;
        }
        if (activeTab === 'stripe-metronome' || activeTab === 'calculator') {
          imports = `import Anthropic from '@anthropic-ai/sdk';
import { vibez, vibezcheck } from 'vibezcheck';

const anthropic = new Anthropic();
`;
        }

        let body = `export async function POST(req: Request) {
  const { prompt, customerId } = await req.json();

  const stream = await anthropic.messages.create({
    model: '${modelId}',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });\n\n`;

        if (activeTab === 'chatbot') {
          body += `  // Meter stream in real time with 0ms added latency
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
  });`;
        } else if (activeTab === 'tools-session') {
          body += `  // Enforce session budget ceiling ($2.00) over multi-turn workflow
  const session = vibez.session({
    customer: customerId,
    sessionBudgetUSD: 2.00, // Hard ceiling across all turns & tool calls
  });

  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    session,
    // Meter tool invocation ($0.01) and trace execution latency
    tools: {
      webSearch: vibez.tool(searchTool, 0.01),
    },
  });`;
        } else if (activeTab === 'spend-limit') {
          body += `  // Pre-flight and in-flight circuit breakers
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    maxCostPerCallUSD: 0.50, // Auto-terminates runaway calls at $0.50
    maxTokensPerCall: 4000,  // Safety ceiling on tokens
  });`;
        } else if (activeTab === 'database') {
          body += `  // Persist usage records directly to Supabase in background
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    database: vibezcheck.supabase(supabase),
  });`;
        } else {
          // stripe-metronome & calculator
          body += `  // Retail pricing markup (+${marginPercent}%) and Metronome /v1/ingest dispatch
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    pricing: { margin: ${marginMultiplier} }, // +${marginPercent}% developer profit margin
    database: vibezcheck.metronome({
      apiKey: process.env.METRONOME_API_KEY!,
    }),
  });`;
        }

        body += `\n\n  return new Response(meteredStream);\n}`;
        return imports + '\n' + body;
      }

      // Google Gemini
      if (provider === 'Google') {
        let imports = `import { GoogleGenAI } from '@google/genai';
import { vibez } from 'vibezcheck';

const ai = new GoogleGenAI();
`;
        if (activeTab === 'tools-session') imports += `\n${toolCommentBlock}`;
        if (activeTab === 'database') {
          imports = `import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { vibez, vibezcheck } from 'vibezcheck';

const ai = new GoogleGenAI();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
`;
        }
        if (activeTab === 'stripe-metronome' || activeTab === 'calculator') {
          imports = `import { GoogleGenAI } from '@google/genai';
import { vibez, vibezcheck } from 'vibezcheck';

const ai = new GoogleGenAI();
`;
        }

        let body = `export async function POST(req: Request) {
  const { prompt, customerId } = await req.json();

  const stream = await ai.models.generateContentStream({
    model: '${modelId}',
    contents: prompt,
  });\n\n`;

        if (activeTab === 'chatbot') {
          body += `  // Meter stream in real time with 0ms added latency
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
  });`;
        } else if (activeTab === 'tools-session') {
          body += `  // Enforce session budget ceiling ($2.00) over multi-turn workflow
  const session = vibez.session({
    customer: customerId,
    sessionBudgetUSD: 2.00,
  });

  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    session,
    tools: {
      webSearch: vibez.tool(searchTool, 0.01),
    },
  });`;
        } else if (activeTab === 'spend-limit') {
          body += `  // Pre-flight and in-flight circuit breakers
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    maxCostPerCallUSD: 0.50,
    maxTokensPerCall: 4000,
  });`;
        } else if (activeTab === 'database') {
          body += `  // Persist usage records directly to Supabase in background
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    database: vibezcheck.supabase(supabase),
  });`;
        } else {
          body += `  // Retail pricing markup (+${marginPercent}%) and Metronome /v1/ingest dispatch
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    pricing: { margin: ${marginMultiplier} },
    database: vibezcheck.metronome({
      apiKey: process.env.METRONOME_API_KEY!,
    }),
  });`;
        }

        body += `\n\n  return new Response(meteredStream);\n}`;
        return imports + '\n' + body;
      }

      // OpenAI, xAI, DeepSeek
      let imports = `import OpenAI from 'openai';
import { vibez } from 'vibezcheck';

const openai = new OpenAI();
`;
      if (activeTab === 'tools-session') imports += `\n${toolCommentBlock}`;
      if (activeTab === 'database') {
        imports = `import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { vibez, vibezcheck } from 'vibezcheck';

const openai = new OpenAI();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
`;
      }
      if (activeTab === 'stripe-metronome' || activeTab === 'calculator') {
        imports = `import OpenAI from 'openai';
import { vibez, vibezcheck } from 'vibezcheck';

const openai = new OpenAI();
`;
      }

      let body = `export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  const stream = await openai.chat.completions.create({
    model: '${modelId}',
    stream: true,
    messages,
  });\n\n`;

      if (activeTab === 'chatbot') {
        body += `  // Meter stream in real time with 0ms added latency
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
  });`;
      } else if (activeTab === 'tools-session') {
        body += `  // Enforce session budget ceiling ($2.00) over multi-turn workflow
  const session = vibez.session({
    customer: customerId,
    sessionBudgetUSD: 2.00,
  });

  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    session,
    tools: {
      webSearch: vibez.tool(searchTool, 0.01),
    },
  });`;
      } else if (activeTab === 'spend-limit') {
        body += `  // Pre-flight and in-flight circuit breakers
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    maxCostPerCallUSD: 0.50,
    maxTokensPerCall: 4000,
  });`;
      } else if (activeTab === 'database') {
        body += `  // Persist usage records directly to Supabase in background
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    database: vibezcheck.supabase(supabase),
  });`;
      } else {
        body += `  // Retail pricing markup (+${marginPercent}%) and Metronome /v1/ingest dispatch
  const meteredStream = vibez.wrapStream(stream, {
    model: '${modelId}',
    customer: customerId,
    pricing: { margin: ${marginMultiplier} }, // +${marginPercent}% developer profit margin
    database: vibezcheck.metronome({
      apiKey: process.env.METRONOME_API_KEY!,
    }),
  });`;
      }

      body += `\n\n  return new Response(meteredStream);\n}`;
      return imports + '\n' + body;
    }

    // ✦ Harmonized AI SDK Code
    if (activeTab === 'chatbot') {
      return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  const result = streamText({
    model: vibezcheck(${providerFn}('${modelId}'), {
      customer: customerId,
    }),
    messages,
  });

  return vibezcheck.toResponse(result);
}`;
    }

    if (activeTab === 'tools-session') {
      return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';
import { vibezcheck } from 'vibezcheck';

// 1. Define custom tools with execution logic
const searchTool = {
  description: 'Search documentation or live web',
  parameters: { query: 'string' },
  execute: async ({ query }: { query: string }) => fetchWebResults(query),
};

const calcTool = {
  description: 'Calculate financial metrics & ratios',
  parameters: { expression: 'string' },
  execute: async ({ expression }: { expression: string }) => evalMath(expression),
};

export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  // 2. Enforce session budget ceiling ($2.00) over multi-turn workflow
  const session = vibezcheck.session({
    customer: customerId,
    sessionBudgetUSD: 2.00, // Hard ceiling across all turns & tool calls
  });

  const result = streamText({
    model: session.model(${providerFn}('${modelId}')),
    messages,
    // 3. Wrap tools with vibezcheck.tool() to meter invocation costs & trace latency
    tools: {
      webSearch: vibezcheck.tool(searchTool, 0.01),
      calculator: vibezcheck.tool(calcTool, 0.005),
    },
  });

  return vibezcheck.toResponse(result);
}`;
    }

    if (activeTab === 'spend-limit') {
      return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  const result = streamText({
    model: vibezcheck(${providerFn}('${modelId}'), {
      customer: customerId,
      maxCostPerCallUSD: 0.50, // Auto-terminates runaway calls at $0.50
      maxTokensPerCall: 4000,  // Safety ceiling on tokens
    }),
    messages,
  });

  return vibezcheck.toResponse(result);
}`;
    }

    if (activeTab === 'database') {
      return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';
import { createClient } from '@supabase/supabase-js';
import { vibezcheck } from 'vibezcheck';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  const result = streamText({
    model: vibezcheck(${providerFn}('${modelId}'), {
      customer: customerId,
      database: vibezcheck.supabase(supabase), // Inserts to default 'vibez_usage' table
    }),
    messages,
  });

  return vibezcheck.toResponse(result);
}`;
    }

    // stripe-metronome & calculator
    return `import { streamText } from 'ai';
import { ${providerFn} } from '${providerPkg}';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId } = await req.json();

  // Meter stream with dynamic retail margin & nano-precision calculations
  const result = streamText({
    model: vibezcheck(${providerFn}('${modelId}'), {
      customer: customerId,
      pricing: { margin: ${marginMultiplier} }, // +${marginPercent}% profit margin
      maxCostPerCallUSD: 0.50, // Safety circuit breaker
      database: vibezcheck.metronome({
        apiKey: process.env.METRONOME_API_KEY!,
      }),
    }),
    messages,
  });

  return vibezcheck.toResponse(result);
}`;
  }, [cmdTab, currentPreset, vibezCheckEnabled, activeTab, marginPercent, marginMultiplier]);

  const codeLines = useMemo(() => {
    return tokenizeTypeScript(rawCodeString);
  }, [rawCodeString]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const calculatedCostUSD =
    activeTab === 'stripe-metronome' || activeTab === 'calculator'
      ? currentPreset.costUSD * (1 + marginPercent / 100)
      : currentPreset.costUSD;

  const currentCompanyIcon = getCompanyIcon(currentPreset.provider);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4">
      {/* ✦ Capability Bar: Chatbot + Model Company Logo next to it + Tools + Spend + DB + Stripe */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-zinc-900/90 border border-slate-300/80 dark:border-zinc-800 rounded-xl overflow-x-auto no-scrollbar shadow-xs">
          {/* 1. Chatbot Tab */}
          <button
            onClick={() => handleTabChange('chatbot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chatbot'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-500" />
            <span>Chatbot</span>
          </button>

          {/* Model Company Selector next to Chatbot (OpenAI, Anthropic, Google, DeepSeek, xAI) */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/70 dark:bg-zinc-800/80 border border-slate-300/60 dark:border-zinc-700/60 shadow-2xs">
            <button
              onClick={handlePrevCompany}
              aria-label="Previous provider"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer"
              title="Previous provider company"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer select-none">
                <LobeIcon name={currentCompanyIcon} size={15} alt={currentPreset.provider} />
                <select
                  value={currentPreset.provider}
                  onChange={(e) => handleSelectCompany(e.target.value)}
                  className="appearance-none bg-transparent text-slate-800 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer focus:outline-none pr-3.5 py-0.5"
                  title="Switch AI Company"
                >
                  {COMPANIES.map((c) => (
                    <option
                      key={c.id}
                      value={c.name}
                      className="bg-white dark:bg-[#18181f] text-slate-900 dark:text-white text-xs font-normal"
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleNextCompany}
              aria-label="Next provider"
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-zinc-700/60 transition cursor-pointer"
              title="Next provider company"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Harmonized Divider */}
          <div className="w-[1px] h-4 bg-slate-300 dark:bg-zinc-700 mx-0.5" />

          {/* 2. Tools & Sessions */}
          <button
            onClick={() => handleTabChange('tools-session')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tools-session'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-500" />
            <span>Tools & Sessions</span>
          </button>

          {/* 3. Spend Limit */}
          <button
            onClick={() => handleTabChange('spend-limit')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'spend-limit'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Spend Limit</span>
          </button>

          {/* 4. Database */}
          <button
            onClick={() => handleTabChange('database')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Database</span>
          </button>

          {/* 5. Stripe & Metronome */}
          <button
            onClick={() => handleTabChange('stripe-metronome')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stripe-metronome'
                ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
            <span>Stripe & Metronome</span>
          </button>
        </div>
      </div>

      {/* ✦ AI Elements <Sandbox /> Container with Warning Blink if Knob isn't green */}
      <Sandbox
        className={`transition-all duration-300 ${
          !vibezCheckEnabled
            ? 'ring-2 ring-amber-500/90 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.35)] animate-pulse'
            : 'border-slate-200/90 dark:border-zinc-800/90'
        }`}
      >
        {/* Blinking Warning Strip when knob isn't green */}
        {!vibezCheckEnabled && (
          <div className="bg-amber-500/15 dark:bg-amber-950/50 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 font-medium animate-pulse">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>
                <strong>Warning:</strong> VibezCheck FinOps knob is <strong>OFF</strong> (not green). AI requests are running unmetered with zero cost safety fuses!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setVibezCheckEnabled(true)}
              className="px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>Turn ON (Green)</span>
            </button>
          </div>
        )}

        {/* Sandbox Header */}
        <SandboxHeader>
          {/* Traffic Light Window Dots + Dev Mode Pill */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />

            {/* Dev Mode Pill */}
            <div className="ml-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-zinc-800/80 border border-slate-300/80 dark:border-zinc-700/80 text-[11px] font-mono text-slate-700 dark:text-zinc-300 select-none shadow-2xs">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">dev mode</span>
              <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-slate-300/80 dark:bg-zinc-700/80 text-slate-600 dark:text-zinc-400 font-bold">
                sandbox
              </span>
            </div>
          </div>

          {/* Header Controls: VibezCheck Badge + Run It With Model Dropdown + Copy */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* VibezCheck Toggle Switch */}
            <button
              type="button"
              onClick={() => setVibezCheckEnabled(!vibezCheckEnabled)}
              className={`group flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none ${
                vibezCheckEnabled
                  ? 'bg-slate-100/90 dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-700'
                  : 'bg-amber-500/15 dark:bg-amber-950/30 border-amber-500/50 text-amber-800 dark:text-amber-300 animate-pulse'
              }`}
              title="Toggle VibezCheck token & cost metering"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles
                  className={`w-3.5 h-3.5 transition-transform ${
                    vibezCheckEnabled
                      ? 'text-slate-500 dark:text-zinc-400'
                      : 'text-amber-500 dark:text-amber-400'
                  }`}
                />
                <span className="text-[11px] font-semibold tracking-tight text-slate-800 dark:text-zinc-200">
                  VibezCheck
                </span>
              </div>

              {/* Micro switch pill */}
              <div
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  vibezCheckEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    vibezCheckEnabled ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>

            {/* Run it with [ Model Version ▾ ] Dropdown with Model Icon */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans hidden sm:inline">
                Run it with
              </span>
              <div className="relative flex items-center">
                <div className="absolute left-2.5 pointer-events-none flex items-center">
                  <LobeIcon name={currentPreset.iconName} size={14} />
                </div>
                <select
                  value={presetIndex}
                  onChange={(e) => setPresetIndex(parseInt(e.target.value, 10))}
                  className="appearance-none bg-white dark:bg-[#1c1c22] border border-slate-300 dark:border-zinc-700 hover:border-slate-500 dark:hover:border-zinc-500 text-slate-800 dark:text-white text-xs font-sans py-1 pl-7 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-400 transition max-w-[210px] truncate"
                >
                  {COMPANIES.map((comp) => {
                    const compModels = PRESETS.map((p, idx) => ({ ...p, originalIdx: idx })).filter(
                      (p) => p.provider.toLowerCase() === comp.name.toLowerCase()
                    );
                    if (compModels.length === 0) return null;
                    return (
                      <optgroup
                        key={comp.id}
                        label={comp.name}
                        className="bg-white dark:bg-[#18181f] text-slate-900 dark:text-white font-semibold"
                      >
                        {compModels.map((m) => (
                          <option
                            key={m.id}
                            value={m.originalIdx}
                            className="font-normal font-sans bg-white dark:bg-[#18181f] text-slate-900 dark:text-white"
                          >
                            {m.name} (${m.inputPer1M.toFixed(2)}/1M in · ${m.outputPer1M.toFixed(2)}/1M out)
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Copy snippet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </SandboxHeader>

        {/* Sandbox Body: Code Editor + Live Preview */}
        <SandboxBody>
          {/* Left: Code Editor Window */}
          <SandboxEditor className="relative h-full overflow-hidden">
            {/* The underlying code editor - blurred when in calculator mode */}
            <div
              className={`p-5 font-mono text-[13px] leading-relaxed overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-zinc-200 flex-1 bg-[#0e0e11] transition-all duration-300 ${
                activeTab === 'calculator'
                  ? 'filter blur-[7px] opacity-20 select-none pointer-events-none'
                  : ''
              }`}
            >
              <pre className="space-y-1">
                {codeLines.map((line) => (
                  <div key={line.num} className="flex items-start">
                    <span className="w-6 text-right pr-4 text-zinc-600 select-none text-xs">
                      {line.num}
                    </span>
                    <span className="flex-1">
                      {line.tokens.map((tok, idx) => {
                        if (tok.type === 'kw') {
                          return (
                            <span key={idx} className="text-[#ff5588] font-medium">
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.type === 'fn') {
                          return (
                            <span key={idx} className="text-[#c084fc]">
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.type === 'str') {
                          return (
                            <span key={idx} className="text-[#f59e0b]">
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.type === 'var') {
                          return (
                            <span key={idx} className="text-[#38bdf8]">
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.type === 'num') {
                          return (
                            <span key={idx} className="text-[#4ade80]">
                              {tok.text}
                            </span>
                          );
                        }
                        if (tok.type === 'comment') {
                          return (
                            <span key={idx} className="text-zinc-500 italic">
                              {tok.text}
                            </span>
                          );
                        }
                        return (
                          <span key={idx} className="text-zinc-200">
                            {tok.text}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                ))}
              </pre>
            </div>

            {/* Blurred Code Overlay: Prompt Text Evaluator + Sliders + Breakdown Cards */}
            {activeTab === 'calculator' && (
              <div className="absolute inset-0 z-10 p-4 sm:p-5 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-zinc-950/85 backdrop-blur-md flex flex-col justify-between gap-3 text-zinc-100 animate-in fade-in duration-200">
                {/* Header with Title & Action Buttons */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <CalcIcon className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        Prompt & Token Evaluator
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                          Live Costing
                        </span>
                      </h4>
                      <p className="text-[10px] text-zinc-400">
                        Paste instructions, input & output to evaluate exact tokens and costs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleLoadSamplePrompt}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white text-[10px] font-medium transition cursor-pointer"
                      title="Load sample prompt"
                    >
                      Sample
                    </button>
                    <button
                      type="button"
                      onClick={handleClearPrompt}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white text-[10px] font-medium transition cursor-pointer"
                      title="Clear prompt fields"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* 3 Textareas: Instructions, Input, Output */}
                <div className="space-y-2.5">
                  {/* 1. Instructions / System Prompt */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-indigo-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        Instructions (System Prompt)
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-zinc-500">{evalInstructions.length} chars</span>
                        <span className="px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold">
                          {calcInstTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={evalInstructions}
                      onChange={(e) => handleInstructionsChange(e.target.value)}
                      placeholder="Paste system instructions or system prompt..."
                      className="w-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-lg p-2 text-xs text-zinc-200 placeholder-zinc-500 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={calcInstTokens}
                        onChange={(e) => setCalcInstTokens(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        title="Fine-tune instruction tokens"
                      />
                    </div>
                  </div>

                  {/* 2. User Input / Prompt */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-sky-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        Input (User Prompt / Messages)
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-zinc-500">{evalInput.length} chars</span>
                        <span className="px-1.5 py-0.2 rounded bg-sky-950/80 border border-sky-800/60 text-sky-300 font-bold">
                          {calcInTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={evalInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Paste user prompt or messages..."
                      className="w-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus:border-sky-500 rounded-lg p-2 text-xs text-zinc-200 placeholder-zinc-500 font-sans focus:outline-none focus:ring-1 focus:ring-sky-500 transition resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={16000}
                        step={100}
                        value={calcInTokens}
                        onChange={(e) => setCalcInTokens(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        title="Fine-tune input tokens"
                      />
                    </div>
                  </div>

                  {/* 3. Model Output / Completion */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Output (Model Completion)
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-zinc-500">{evalOutput.length} chars</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 font-bold">
                          {calcOutTokens.toLocaleString()} tokens
                        </span>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={evalOutput}
                      onChange={(e) => handleOutputChange(e.target.value)}
                      placeholder="Paste model output or completion..."
                      className="w-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 focus:border-emerald-500 rounded-lg p-2 text-xs text-zinc-200 placeholder-zinc-500 font-sans focus:outline-none focus:ring-1 focus:ring-emerald-500 transition resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={calcOutTokens}
                        onChange={(e) => setCalcOutTokens(parseInt(e.target.value, 10))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        title="Fine-tune output tokens"
                      />
                    </div>
                  </div>
                </div>

                {/* Metronome Customer Margin Slider (Moved to blurred code area) */}
                <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-zinc-300 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Metronome Customer Margin:</span>
                    </span>
                    <span className="font-bold text-indigo-400">
                      +{marginPercent}% ({marginMultiplier}x)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>0% (Wholesale)</span>
                    <span>+30% (Standard)</span>
                    <span>+100% (2x)</span>
                  </div>
                </div>

                {/* Wholesale vs Retail Breakdown Cards (Moved to blurred code area) */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 space-y-0.5">
                    <span className="text-[10px] text-zinc-400 block">Wholesale Cost</span>
                    <p className="font-mono text-xs font-bold text-white truncate">
                      ${calcWholesaleUSD.toFixed(5)}
                    </p>
                    <span className="text-[9px] text-zinc-500 block">Paid to Provider</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-800/50 space-y-0.5">
                    <span className="text-[10px] text-indigo-400 block font-medium">Billed Retail</span>
                    <p className="font-mono text-xs font-bold text-indigo-200 truncate">
                      ${calcRetailUSD.toFixed(5)}
                    </p>
                    <span className="text-[9px] text-indigo-400/80 block">Metronome Ingest</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-0.5">
                    <span className="text-[10px] text-emerald-400 block font-medium">Gross Profit</span>
                    <p className="font-mono text-xs font-bold text-emerald-300 truncate">
                      +${calcProfitUSD.toFixed(5)}
                    </p>
                    <span className="text-[9px] text-emerald-400/80 block">+{marginPercent}% Spread</span>
                  </div>
                </div>
              </div>
            )}
          </SandboxEditor>

          {/* Right: Sandbox Live Execution Preview */}
          <SandboxPreview>
            {activeTab === 'calculator' ? (
              /* ✦ Dedicated Retro Calculator in Sandbox Preview */
              <div className="flex flex-col justify-between h-full space-y-3 font-sans animate-in fade-in duration-200">
                {/* Handheld Retro Calculator (Braun ET66 Aesthetic) */}
                <div className="my-auto">
                  <div className="bg-[#18181b] border-2 border-zinc-700/80 rounded-[26px] p-3.5 shadow-xl select-none mx-auto max-w-[270px]">
                    {/* Bezel Title */}
                    <div className="flex items-center justify-between px-1 mb-2 text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                      <span>VIBEZ-88 NANO</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        0ms LATENCY
                      </span>
                    </div>

                    {/* Warm Beige Vintage LCD Screen */}
                    <div className="bg-[#ded8c4] border-2 border-[#b5ad98] rounded-[14px] p-2.5 mb-3 shadow-inner text-[#1a201a]">
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#525a52] uppercase font-bold tracking-wider mb-0.5">
                        <span>{currentPreset.provider}</span>
                        <span>{calcDisplayMode === 'usd' ? 'USD RATE' : 'TOTAL TOK'}</span>
                      </div>

                      {/* Main Amount */}
                      <div className="font-mono font-black text-2xl text-right tracking-tight text-[#161a16] truncate py-0.5">
                        {calcDisplayMode === 'usd' ? (
                          calcWholesaleUSD < 0.01 ? (
                            `$${calcWholesaleUSD.toFixed(6)}`
                          ) : (
                            `$${calcWholesaleUSD.toFixed(4)}`
                          )
                        ) : (
                          calcTotalTok.toLocaleString()
                        )}
                      </div>

                      {/* Formula Subline */}
                      <div className="text-[10px] font-mono text-[#4b554b] text-right font-semibold truncate border-t border-[#c5beaa] pt-1">
                        {calcInstTokens} ins + {calcInTokens} in + {calcOutTokens} out = {calcTotalTok} tok
                      </div>
                    </div>

                    {/* Tactile Circular Buttons */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {/* Row 1: Function Keys (Grey) */}
                      <button
                        type="button"
                        onClick={handleKeypadClear}
                        className="w-9 h-9 rounded-full bg-[#52525b] hover:bg-[#5f5f69] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="All Clear"
                      >
                        AC
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcDisplayMode(calcDisplayMode === 'usd' ? 'tokens' : 'usd')}
                        className="w-9 h-9 rounded-full bg-[#52525b] hover:bg-[#5f5f69] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Toggle USD / Tokens"
                      >
                        +/-
                      </button>
                      <button
                        type="button"
                        onClick={() => setMarginPercent((prev) => (prev === 30 ? 50 : prev === 50 ? 0 : 30))}
                        className="w-9 h-9 rounded-full bg-[#52525b] hover:bg-[#5f5f69] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Cycle Margin (0%, 30%, 50%)"
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcFocusedField('inst')}
                        className={`w-9 h-9 rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer ${
                          calcFocusedField === 'inst'
                            ? 'bg-indigo-600 ring-2 ring-white'
                            : 'bg-[#4b6b94] hover:bg-[#5578a3] active:scale-95'
                        }`}
                        title="Focus Instruction Tokens"
                      >
                        INS
                      </button>

                      {/* Row 2: 7, 8, 9 + IN */}
                      {['7', '8', '9'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleKeypadDigit(d)}
                          className="w-9 h-9 rounded-full bg-[#dc4c45] hover:bg-[#e65750] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setCalcFocusedField('in')}
                        className={`w-9 h-9 rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer ${
                          calcFocusedField === 'in'
                            ? 'bg-indigo-600 ring-2 ring-white'
                            : 'bg-[#4b6b94] hover:bg-[#5578a3] active:scale-95'
                        }`}
                        title="Focus Input Tokens"
                      >
                        IN
                      </button>

                      {/* Row 3: 4, 5, 6 + OUT */}
                      {['4', '5', '6'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleKeypadDigit(d)}
                          className="w-9 h-9 rounded-full bg-[#dc4c45] hover:bg-[#e65750] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setCalcFocusedField('out')}
                        className={`w-9 h-9 rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer ${
                          calcFocusedField === 'out'
                            ? 'bg-indigo-600 ring-2 ring-white'
                            : 'bg-[#4b6b94] hover:bg-[#5578a3] active:scale-95'
                        }`}
                        title="Focus Output Tokens"
                      >
                        OUT
                      </button>

                      {/* Row 4: 1, 2, 3 + CLR */}
                      {['1', '2', '3'].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => handleKeypadDigit(d)}
                          className="w-9 h-9 rounded-full bg-[#dc4c45] hover:bg-[#e65750] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        >
                          {d}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          if (calcFocusedField === 'inst') setCalcInstTokens(0);
                          if (calcFocusedField === 'in') setCalcInTokens(0);
                          if (calcFocusedField === 'out') setCalcOutTokens(0);
                        }}
                        className="w-9 h-9 rounded-full bg-[#4b6b94] hover:bg-[#5578a3] active:scale-95 text-white font-mono text-[10px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Zero focused field"
                      >
                        CLR
                      </button>

                      {/* Row 5: 0, RST, NEXT */}
                      <button
                        type="button"
                        onClick={() => handleKeypadDigit('0')}
                        className="w-9 h-9 rounded-full bg-[#dc4c45] hover:bg-[#e65750] active:scale-95 text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                      >
                        0
                      </button>
                      <button
                        type="button"
                        onClick={handleKeypadReset}
                        className="w-9 h-9 rounded-full bg-[#52525b] hover:bg-[#5f5f69] active:scale-95 text-white font-mono text-[9px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer"
                        title="Reset standard values"
                      >
                        RST
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (calcFocusedField === 'inst') setCalcFocusedField('in');
                          else if (calcFocusedField === 'in') setCalcFocusedField('out');
                          else setCalcFocusedField('inst');
                        }}
                        className="col-span-2 h-9 rounded-full bg-[#4b6b94] hover:bg-[#5578a3] active:scale-95 text-white font-mono text-[10px] font-bold flex items-center justify-center transition shadow-sm cursor-pointer gap-1"
                        title="Cycle focus (Instruction ➔ Input ➔ Output)"
                      >
                        <span>NEXT ➔</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Model & Latency indicator */}
                <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
                  <span className="inline-flex items-center gap-1.5">
                    <LobeIcon name={currentPreset.iconName} size={14} />
                    <span>Rate: ${currentPreset.inputPer1M.toFixed(2)}/1M in · ${currentPreset.outputPer1M.toFixed(2)}/1M out</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">0ms latency</span>
                </div>
              </div>
            ) : (
              /* All other tabs: Chatbot, Tools & Sessions, Spend Limit, Database, Stripe & Metronome */
              <div className="space-y-3.5">
                {/* Quick Scenario Use Case Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 mr-0.5">
                    Scenario:
                  </span>
                  {(Object.keys(USE_CASES) as ShowcaseTab[]).map((tabKey) => {
                    const uc = USE_CASES[tabKey];
                    const isActive = activeTab === tabKey;
                    return (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() => handleTabChange(tabKey)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer flex items-center gap-1 shrink-0 ${
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-2xs'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{uc.chipLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {/* User Prompt Bubble with Contextual Question */}
                <div className="flex justify-end">
                  <div className="relative bg-slate-100/90 dark:bg-zinc-800/90 text-slate-900 dark:text-zinc-100 rounded-2xl rounded-br-xs px-4 py-2.5 text-xs font-medium max-w-[95%] shadow-xs leading-relaxed border border-slate-200/90 dark:border-zinc-700/80">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Use Case • {currentUseCase.tabTitle}</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-mono border border-slate-200/60 dark:border-zinc-800">
                        {currentUseCase.badge}
                      </span>
                    </div>
                    <p className="text-slate-900 dark:text-zinc-100">
                      {currentUseCase.prompt}
                    </p>
                  </div>
                </div>

                {/* Chatbot Output Card (ALWAYS VISIBLE across other tabs) */}
                <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <LobeIcon name={currentPreset.iconName} className="w-3.5 h-3.5" />
                      <span className="font-semibold text-slate-900 dark:text-white text-xs">
                        {currentPreset.provider}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                        {currentPreset.modelId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Metered locally · Reported async</span>
                    </div>
                  </div>

                  {/* Streaming Guided Output */}
                  <p className="leading-relaxed">
                    {currentUseCase.getAiResponse(currentPreset, vibezCheckEnabled, marginMultiplier)}
                  </p>

                  {/* Unit Economics Breakdown per Spec v2 Section 23 */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800/80 font-mono text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-sans font-semibold block">
                        AI Cost
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        \${calculatedCostUSD.toFixed(4)}
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200 dark:border-zinc-800 pl-2">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-sans font-semibold block">
                        Customer Charge
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        \${(calculatedCostUSD * Number(marginMultiplier)).toFixed(4)}
                      </span>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-200 dark:border-zinc-800 pl-2">
                      <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-sans font-semibold block">
                        Contribution
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        +\${(calculatedCostUSD * (Number(marginMultiplier) - 1)).toFixed(4)}
                      </span>
                    </div>
                  </div>

                  {/* Business Status Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      ✓ Within spend limit
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                      ✓ Metered
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20">
                      ✓ Billable
                    </span>
                  </div>

                  {/* Token Measurement & Receipt */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-[11px] font-mono">
                    <span className="text-slate-500 dark:text-zinc-400">
                      {currentPreset.tokens} tokens • {currentPreset.latencyMs}ms TTFT
                    </span>
                    <VibezReceipt
                      model={currentPreset.modelId}
                      tokens={currentPreset.tokens}
                      costUSD={calculatedCostUSD}
                      latencyMs={currentPreset.latencyMs}
                      variant="pill"
                    />
                  </div>
                </div>

                {/* Tab 1: Chatbot Telemetry HUD */}
                {activeTab === 'chatbot' && (
                  <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200 font-mono text-[11px]">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-zinc-800/80 font-sans">
                      <div className="flex items-center gap-2">
                        <Bot className="w-3.5 h-3.5 text-sky-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          Streaming Token & Cost Inspection
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-medium">
                        Zero Retention (ZDR)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800/70 space-y-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">Wholesale Unit Cost</span>
                        <p className="font-bold text-slate-900 dark:text-white text-xs">${currentPreset.costUSD.toFixed(5)} USD</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800/70 space-y-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400">Added Latency</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">0.00ms (Offline Index)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Tools & Sessions */}
                {activeTab === 'tools-session' && (
                  <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-purple-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          Agent Session & Tool Call Latency
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-medium">
                        sessionBudgetUSD: $2.00
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-slate-700 dark:text-zinc-300 p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60">
                        <span className="flex items-center gap-1.5">
                          <Search className="w-3 h-3 text-purple-500" />
                          <span>webSearch (searchTool)</span>
                        </span>
                        <span>42ms • {Math.round(currentPreset.tokens * 0.4)} tok • $0.01000 USD</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-zinc-300 p-2 rounded-lg bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-purple-500" />
                          <span>calculator (calcTool)</span>
                        </span>
                        <span>12ms • {Math.round(currentPreset.tokens * 0.2)} tok • $0.00500 USD</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-500 dark:text-zinc-400">
                      <span>Aggregated Workflow Spend:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        ${(currentPreset.costUSD + 0.015).toFixed(5)} / $2.00000 USD
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Spend Limit */}
                {activeTab === 'spend-limit' && (
                  <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          Circuit Breaker (maxCostPerCallUSD)
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-medium">
                        Trip Wire: $0.500 USD
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-500 dark:text-zinc-400">Current Loop Spend:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          ${simulatedCost.toFixed(4)} <span className="font-normal text-slate-400">/ $0.5000 USD</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(3, (simulatedCost / 0.5) * 100)).toFixed(1)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                        <span>{Math.min(100, (simulatedCost / 0.5) * 100).toFixed(1)}% limit reached</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Auto-terminates runaway loops</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateLoop}
                      disabled={isSimulatingLoop}
                      className="w-full py-1.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className={`w-3 h-3 ${isSimulatingLoop ? 'animate-spin' : ''}`} />
                      <span>{isSimulatingLoop ? 'Spurting Tokens...' : 'Simulate Runaway Loop (Severed at $0.50)'}</span>
                    </button>
                  </div>
                )}

                {/* Tab 4: Database */}
                {activeTab === 'database' && (
                  <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          vibezcheck.supabase(supabase)
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        Table: public.vibez_usage
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500 dark:text-zinc-400">Customer Wallet Balance:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        ${supabaseBalance.toFixed(4)} USD
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 dark:border-zinc-800 overflow-hidden bg-slate-50/70 dark:bg-zinc-900/70 font-mono text-[10px]">
                      <div className="grid grid-cols-12 gap-1 px-2.5 py-1.5 bg-slate-200/50 dark:bg-zinc-800/60 font-semibold text-slate-600 dark:text-zinc-400 border-b border-slate-200/60 dark:border-zinc-800/60">
                        <span className="col-span-3">row_id</span>
                        <span className="col-span-3">customer</span>
                        <span className="col-span-2">tokens</span>
                        <span className="col-span-2">cost</span>
                        <span className="col-span-2 text-right">status</span>
                      </div>
                      <div className="divide-y divide-slate-200/50 dark:divide-zinc-800/50">
                        {supabaseRows.map((row) => (
                          <div
                            key={row.id}
                            className="grid grid-cols-12 gap-1 px-2.5 py-1.5 items-center hover:bg-emerald-500/5 transition"
                          >
                            <span className="col-span-3 text-slate-700 dark:text-zinc-300">{row.id}</span>
                            <span className="col-span-3 text-indigo-600 dark:text-indigo-400">{row.customerId}</span>
                            <span className="col-span-2 text-slate-600 dark:text-zinc-400">{row.tokens}</span>
                            <span className="col-span-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                              ${row.costUSD.toFixed(4)}
                            </span>
                            <span className="col-span-2 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                              201 OK
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateSupabase}
                      disabled={supabaseSyncing}
                      className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Database className="w-3 h-3" />
                      <span>{supabaseSyncing ? 'Writing SQL...' : 'Debit Customer Wallet in SQL Ledger'}</span>
                    </button>
                  </div>
                )}

                {/* Tab 5: Stripe & Metronome */}
                {activeTab === 'stripe-metronome' && (
                  <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          pricing: &#123; margin: {marginMultiplier} &#125; & vibezcheck.metronome()
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        +{marginPercent}% Profit Markup
                      </span>
                    </div>

                    {/* Margin Slider */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-slate-600 dark:text-zinc-400">Profit Margin Multiplier:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          margin: {marginMultiplier} (+{marginPercent}%)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={marginPercent}
                        onChange={(e) => setMarginPercent(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                        <span>1.10 (+10%)</span>
                        <span>1.30 (+30% Standard)</span>
                        <span>2.00 (+100% Premium)</span>
                      </div>
                    </div>

                    {/* Metronome Ingestion Stream Box */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-1.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-zinc-800/60">
                        <span className="text-slate-500 dark:text-zinc-400">Metronome Event:</span>
                        <span className="text-slate-800 dark:text-zinc-200 font-bold">{lastTxnId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">API Sink:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">POST /v1/ingest</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-zinc-400">Billed to Customer:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          ${calculatedCostUSD.toFixed(5)} USD
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateMetronome}
                      disabled={metronomeSyncing}
                      className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Zap className={`w-3 h-3 ${metronomeSyncing ? 'animate-spin' : ''}`} />
                      <span>{metronomeSyncing ? 'Dispatching Event...' : 'Simulate Metronome Ingest (Event #' + metronomeEvents + ')'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Model & Latency indicator matching currentPreset */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5 font-mono">
                <LobeIcon name={currentPreset.iconName} size={14} />
                <span>
                  Model: {currentPreset.providerFn}("{currentPreset.modelId}")
                </span>
              </span>
              <span className="font-mono text-[10px]">{currentPreset.latencyMs}ms latency</span>
            </div>
          </SandboxPreview>
        </SandboxBody>
      </Sandbox>

      {/* ✦ Supported Models & Providers Marquee */}
      <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-semibold">
              Supported Models & Inference Providers (700+)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            Click any model to inspect live rates in sandbox
          </span>
        </div>
        <ModelsMarquee onSelectModelName={handleSelectModelFromMarquee} />
      </div>
    </section>
  );
}
