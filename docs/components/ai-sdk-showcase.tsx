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
  Volume2,
  CreditCard,
  ShieldCheck,
  Percent,
  LifeBuoy,
  Bot,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Search,
  BarChart2,
  Terminal,
  AlertTriangle,
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

export type CapabilityTab = 'chatbot' | 'text' | 'image' | 'speech' | 'transcription' | 'video';

export type AgentRecipeTab = 'stripe' | 'circuit-breaker' | 'margin' | 'abort' | 'session';

export interface AiSdkShowcaseProps {
  audienceTab?: 'humans' | 'agents';
  onAudienceChange?: (tab: 'humans' | 'agents') => void;
  onProviderPkgChange?: (pkg: string) => void;
}

export type RuntimeEngine = 'gateway' | 'provider' | 'custom';

export interface AgentRecipeConfig {
  id: AgentRecipeTab;
  name: string;
  badge: string;
  iconName: string;
  prompt: string;
  getOutput: (providerName: string, modelId: string) => string;
}

export const AGENT_RECIPES: Record<AgentRecipeTab, AgentRecipeConfig> = {
  stripe: {
    id: 'stripe',
    name: 'Customer Wallet',
    badge: 'Stripe',
    iconName: 'stripe',
    prompt: 'Audit infrastructure expenditure for customer cus_live_94x19K and itemize anomalies.',
    getOutput: (provider, model) =>
      `Reconciliation complete via ${provider} (${model}): Analyzed 1,420 infrastructure events for cus_live_94x19K. Identified 2 anomalies: egress spike (+38%) in us-east-1 and an orphaned GPU cluster ($142/mo). All usage metered in real time against customer balance.`,
  },
  'circuit-breaker': {
    id: 'circuit-breaker',
    name: 'Safety Switch',
    badge: 'Safety',
    iconName: 'shield',
    prompt: 'Autonomous agent: recursively crawl web endpoints to index API schemas.',
    getOutput: (provider, model) =>
      `Recursive agent reasoning loop initialized with ${provider} (${model}). Loop #1 indexed root sitemap. Loop #2 discovered circular redirect loop... Execution severed immediately by VibezCheck circuit breaker at the $0.50 trip wire.`,
  },
  margin: {
    id: 'margin',
    name: 'Profit Markup',
    badge: 'Margin',
    iconName: 'percent',
    prompt: 'Generate enterprise competitor benchmark matrix across pricing and latency.',
    getOutput: (provider, model) =>
      `Benchmark synthesized via ${provider} (${model}): Generated competitive analysis matrix across 5 industry providers. Unit economics and SLAs calculated with zero added latency.`,
  },
  abort: {
    id: 'abort',
    name: 'Disconnect Shield',
    badge: 'Abort',
    iconName: 'life-buoy',
    prompt: 'Generate comprehensive 50-page technical architecture blueprint.',
    getOutput: (provider, model) =>
      `Architecture Blueprint via ${provider} (${model}): Section 1.1 Core Ingestion Engine with partitioned consumer streams... [Stream severed by client disconnect after 142 tokens — all partial tokens captured & billed]`,
  },
  session: {
    id: 'session',
    name: 'Spending Limit',
    badge: 'Session',
    iconName: 'bot',
    prompt: 'Research market trends and compile financial charts within $2 budget.',
    getOutput: (provider, model) =>
      `Orchestrated 3 autonomous tool invocations (webSearchTool, dataAnalysisTool, codeExecutionTool) with ${provider} (${model}) under a unified $2.00 session budget. All tool steps executed within cap.`,
  },
};

interface ModelPreset {
  id: string;
  name: string;
  provider: string;
  providerPkg: string;
  providerFn: string;
  modelString: string;
  modelId: string;
  badge: string;
  iconName: string;
  prompt: string;
  output: string;
  tokens: number;
  costUSD: number;
  latencyMs: number;
}

const PRESETS: ModelPreset[] = [
  {
    id: 'anthropic-opus',
    name: 'Anthropic Claude Opus',
    provider: 'Anthropic',
    providerPkg: '@ai-sdk/anthropic',
    providerFn: 'anthropic',
    modelString: 'anthropic/claude-opus-4.8',
    modelId: 'claude-opus-4.8',
    badge: 'AI',
    iconName: 'claude-color',
    prompt: 'Explain the concept of quantum entanglement.',
    output:
      'Quantum entanglement is when two particles become linked so that measuring one instantly affects the other, no matter the distance between them.',
    tokens: 154,
    costUSD: 0.00185,
    latencyMs: 142,
  },
  {
    id: 'xai-grok',
    name: 'xAI Grok 4.6',
    provider: 'xAI',
    providerPkg: '@ai-sdk/xai',
    providerFn: 'xai',
    modelString: 'xai/grok-4.6',
    modelId: 'grok-4.6',
    badge: '𝕏',
    iconName: 'grok',
    prompt: 'Explain the concept of quantum entanglement.',
    output:
      "Entanglement is nature's way of keeping a secret between two particles. Once entangled, observing one instantly reveals information about the other — no signal needed, no matter how far apart they are.",
    tokens: 142,
    costUSD: 0.00085,
    latencyMs: 98,
  },
  {
    id: 'openai-gpt4o',
    name: 'OpenAI GPT-4o Mini',
    provider: 'OpenAI',
    providerPkg: '@ai-sdk/openai',
    providerFn: 'openai',
    modelString: 'openai/gpt-4o-mini',
    modelId: 'gpt-4o-mini',
    badge: 'GPT',
    iconName: 'openai',
    prompt: 'Explain the concept of quantum entanglement.',
    output:
      'Quantum computing leverages superposition and entanglement to solve complex mathematical problems exponentially faster than traditional binary systems.',
    tokens: 138,
    costUSD: 0.00069,
    latencyMs: 110,
  },
  {
    id: 'google-gemini',
    name: 'Google Gemini 2.5',
    provider: 'Google',
    providerPkg: '@ai-sdk/google',
    providerFn: 'google',
    modelString: 'google/gemini-2.5-flash',
    modelId: 'gemini-2.5-flash',
    badge: '✦',
    iconName: 'gemini-color',
    prompt: 'Explain the concept of quantum entanglement.',
    output:
      'Wave-particle duality describes how light exhibits wave interference patterns while simultaneously transferring energy in discrete quantum packets called photons.',
    tokens: 148,
    costUSD: 0.00032,
    latencyMs: 85,
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    providerPkg: '@ai-sdk/deepseek',
    providerFn: 'deepseek',
    modelString: 'deepseek/deepseek-r1',
    modelId: 'deepseek-r1',
    badge: 'DS',
    iconName: 'deepseek-color',
    prompt: 'Explain the concept of quantum entanglement.',
    output:
      'P contains problems whose solutions can be calculated in polynomial time, while NP contains problems whose solutions can be verified in polynomial time.',
    tokens: 182,
    costUSD: 0.00045,
    latencyMs: 165,
  },
];

export function AiSdkShowcase({
  audienceTab = 'humans',
  onAudienceChange,
  onProviderPkgChange,
}: AiSdkShowcaseProps) {
  const [activeTab, setActiveTab] = useState<CapabilityTab>('chatbot');
  const [activeAgentTab, setActiveAgentTab] = useState<AgentRecipeTab>('stripe');
  const [presetIndex, setPresetIndex] = useState<number>(0);
  const [runtime, setRuntime] = useState<RuntimeEngine>('provider');
  const [copied, setCopied] = useState<boolean>(false);
  const [vibezCheckEnabled, setVibezCheckEnabled] = useState<boolean>(true);

  // Interactive demo states for agent recipes
  const [stripeCredits, setStripeCredits] = useState<number>(15.0);
  const [topUpSuccess, setTopUpSuccess] = useState<boolean>(false);
  const [fuseTripped, setFuseTripped] = useState<boolean>(true);
  const [marginPercent, setMarginPercent] = useState<number>(30);
  const [abortSimulated, setAbortSimulated] = useState<boolean>(true);
  const [isSimulatingLoop, setIsSimulatingLoop] = useState<boolean>(false);
  const [simulatedCost, setSimulatedCost] = useState<number>(0.5002);
  const [simulatedStep, setSimulatedStep] = useState<number>(3);

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

  const handleTopUpCredits = () => {
    setTopUpSuccess(true);
    let target = stripeCredits + 10;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setStripeCredits((prev) => Math.min(target, Number((prev + 1).toFixed(2))));
      if (step >= 10) {
        clearInterval(interval);
        setStripeCredits(target);
      }
    }, 35);
    setTimeout(() => setTopUpSuccess(false), 2500);
  };

  const currentPreset = PRESETS[presetIndex];

  const handlePrev = () => {
    setPresetIndex((prev) => (prev === 0 ? PRESETS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setPresetIndex((prev) => (prev === PRESETS.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    onProviderPkgChange?.(currentPreset.providerPkg);
  }, [currentPreset, onProviderPkgChange]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const vibez = params.get('vibez');
      if (vibez === 'false' || vibez === '0') {
        setVibezCheckEnabled(false);
      }
      const agentTab = params.get('agentTab');
      if (agentTab && ['stripe', 'circuit-breaker', 'margin', 'abort', 'session'].includes(agentTab)) {
        setActiveAgentTab(agentTab as AgentRecipeTab);
      }
      const modelIdx = params.get('modelIndex');
      if (modelIdx !== null && !isNaN(Number(modelIdx))) {
        setPresetIndex(Number(modelIdx));
      }
    }
  }, []);

  // Active Tab & Model Configuration: guarantees 100% synchronization across:
  // 1. Export code in editor
  // 2. Card at the bottom of the preview
  // 3. "Run it with" dropdown and brand icon
  const currentTabConfig = useMemo(() => {
    if (audienceTab === 'agents') {
      if (activeAgentTab === 'stripe') {
        return {
          provider: currentPreset.provider,
          providerFn: currentPreset.providerFn,
          providerPkg: currentPreset.providerPkg,
          modelId: currentPreset.modelId,
          modelString: currentPreset.modelString,
          iconName: currentPreset.iconName,
          latencyMs: currentPreset.latencyMs,
          tokens: currentPreset.tokens,
          costUSD: currentPreset.costUSD,
          hasModelCycle: true,
        };
      }
      if (activeAgentTab === 'circuit-breaker') {
        return {
          provider: currentPreset.provider,
          providerFn: currentPreset.providerFn,
          providerPkg: currentPreset.providerPkg,
          modelId: currentPreset.modelId,
          modelString: currentPreset.modelString,
          iconName: currentPreset.iconName,
          latencyMs: Math.round(currentPreset.latencyMs * 2.5),
          tokens: 25000,
          costUSD: 0.5,
          hasModelCycle: true,
        };
      }
      if (activeAgentTab === 'margin') {
        return {
          provider: currentPreset.provider,
          providerFn: currentPreset.providerFn,
          providerPkg: currentPreset.providerPkg,
          modelId: currentPreset.modelId,
          modelString: currentPreset.modelString,
          iconName: currentPreset.iconName,
          latencyMs: currentPreset.latencyMs,
          tokens: currentPreset.tokens,
          costUSD: currentPreset.costUSD * (1 + marginPercent / 100),
          hasModelCycle: true,
        };
      }
      if (activeAgentTab === 'abort') {
        const partialTokens = 142;
        const partialCost = (currentPreset.costUSD / Math.max(1, currentPreset.tokens)) * partialTokens;
        return {
          provider: currentPreset.provider,
          providerFn: currentPreset.providerFn,
          providerPkg: currentPreset.providerPkg,
          modelId: currentPreset.modelId,
          modelString: currentPreset.modelString,
          iconName: currentPreset.iconName,
          latencyMs: 95,
          tokens: partialTokens,
          costUSD: partialCost,
          hasModelCycle: true,
        };
      }
      // session
      return {
        provider: currentPreset.provider,
        providerFn: currentPreset.providerFn,
        providerPkg: currentPreset.providerPkg,
        modelId: currentPreset.modelId,
        modelString: currentPreset.modelString,
        iconName: currentPreset.iconName,
        latencyMs: currentPreset.latencyMs,
        tokens: 2510,
        costUSD: 0.00502,
        hasModelCycle: true,
      };
    }

    if (activeTab === 'chatbot' || activeTab === 'text') {
      return {
        provider: currentPreset.provider,
        providerFn: currentPreset.providerFn,
        providerPkg: currentPreset.providerPkg,
        modelId: currentPreset.modelId,
        modelString: currentPreset.modelString,
        iconName: currentPreset.iconName,
        latencyMs: currentPreset.latencyMs,
        tokens: currentPreset.tokens,
        costUSD: currentPreset.costUSD,
        hasModelCycle: true,
      };
    }
    if (activeTab === 'image') {
      return {
        provider: 'xAI',
        providerFn: 'xai',
        providerPkg: '@ai-sdk/xai',
        modelId: 'grok-imagine-image',
        modelString: 'xai/grok-imagine-image',
        iconName: 'grok',
        latencyMs: 850,
        tokens: 1000,
        costUSD: 0.04,
        hasModelCycle: false,
      };
    }
    if (activeTab === 'speech') {
      return {
        provider: 'ElevenLabs',
        providerFn: 'elevenlabs',
        providerPkg: '@ai-sdk/elevenlabs',
        modelId: 'elevenlabs/multilingual-v2',
        modelString: 'elevenlabs/multilingual-v2',
        iconName: 'elevenlabs',
        latencyMs: 320,
        tokens: 56,
        costUSD: 0.0035,
        hasModelCycle: false,
      };
    }
    if (activeTab === 'transcription') {
      return {
        provider: 'OpenAI',
        providerFn: 'openai',
        providerPkg: '@ai-sdk/openai',
        modelId: 'whisper-1',
        modelString: 'openai/whisper-1',
        iconName: 'openai',
        latencyMs: 410,
        tokens: 240,
        costUSD: 0.006,
        hasModelCycle: false,
      };
    }
    // video
    return {
      provider: 'Luma AI',
      providerFn: 'luma',
      providerPkg: '@ai-sdk/luma',
      modelId: 'ray-2',
      modelString: 'luma/ray-2',
      iconName: 'luma-color',
      latencyMs: 2400,
      tokens: 5000,
      costUSD: 0.25,
      hasModelCycle: false,
    };
  }, [audienceTab, activeTab, activeAgentTab, currentPreset, marginPercent]);

  // Generate exact code lines with syntax highlight tags matching provider and custom examples
  const codeLines = useMemo(() => {
    type Token = { type: 'kw' | 'fn' | 'str' | 'var' | 'num' | 'comment' | 'plain'; text: string };
    type Line = { num: number; tokens: Token[] };
    const lines: Line[] = [];
    let lineNum = 1;
    const addLine = (tokens: Token[]) => {
      lines.push({ num: lineNum++, tokens });
    };

    if (audienceTab === 'agents') {
      if (activeAgentTab === 'stripe') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'ai'" },
          { type: 'plain', text: ';' },
        ]);
        if (runtime === 'provider') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
            { type: 'plain', text: ';' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'your-custom-provider'" },
            { type: 'plain', text: ';' },
          ]);
        }
        if (vibezCheckEnabled) {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'vibezcheck'" },
            { type: 'plain', text: ';' },
          ]);
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' ' },
            { type: 'var', text: 'Stripe' },
            { type: 'plain', text: ' ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'stripe'" },
            { type: 'plain', text: ';' },
          ]);
          addLine([{ type: 'plain', text: '' }]);
          addLine([
            { type: 'kw', text: 'const' },
            { type: 'plain', text: ' ' },
            { type: 'var', text: 'stripe' },
            { type: 'plain', text: ' = ' },
            { type: 'kw', text: 'new' },
            { type: 'plain', text: ' ' },
            { type: 'fn', text: 'Stripe' },
            { type: 'plain', text: '(' },
            { type: 'var', text: 'process' },
            { type: 'plain', text: '.' },
            { type: 'var', text: 'env' },
            { type: 'plain', text: '.' },
            { type: 'var', text: 'STRIPE_SECRET_KEY' },
            { type: 'plain', text: '!);' },
          ]);
        }
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// Deduct AI usage from Stripe Customer wallet in real-time' },
        ]);
        addLine([
          { type: 'kw', text: 'export' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'async' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'function' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'POST' },
          { type: 'plain', text: '(' },
          { type: 'var', text: 'req' },
          { type: 'plain', text: ': ' },
          { type: 'var', text: 'Request' },
          { type: 'plain', text: ') {' },
        ]);
        addLine([
          { type: 'plain', text: '  ' },
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' { ' },
          { type: 'var', text: 'customerId' },
          { type: 'plain', text: ' } = ' },
          { type: 'kw', text: 'await' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'req' },
          { type: 'plain', text: '.' },
          { type: 'fn', text: 'json' },
          { type: 'plain', text: '();' },
        ]);
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'plain', text: '  ' },
          { type: 'kw', text: 'return' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: '({' },
        ]);
        if (vibezCheckEnabled) {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '), {' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '), {' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ', {' },
            ]);
          }
          addLine([
            { type: 'plain', text: '      stripe: {' },
          ]);
          addLine([
            { type: 'plain', text: '        client: ' },
            { type: 'var', text: 'stripe' },
            { type: 'plain', text: ',' },
          ]);
          addLine([
            { type: 'plain', text: '        customerId,' },
          ]);
          addLine([
            { type: 'plain', text: '        meterEvent: ' },
            { type: 'str', text: "'ai_tokens_consumed'" },
            { type: 'plain', text: ',' },
          ]);
          addLine([
            { type: 'plain', text: '      },' },
          ]);
          addLine([
            { type: 'plain', text: '    }),' },
          ]);
        } else {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '),' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '),' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ',' },
            ]);
          }
        }
        addLine([
          { type: 'plain', text: '    prompt: ' },
          { type: 'str', text: `'${AGENT_RECIPES.stripe.prompt}'` },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '  }).' },
          { type: 'fn', text: 'toDataStreamResponse' },
          { type: 'plain', text: '();' },
        ]);
        addLine([
          { type: 'plain', text: '}' },
        ]);
        return lines;
      }

      if (activeAgentTab === 'circuit-breaker') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'ai'" },
          { type: 'plain', text: ';' },
        ]);
        if (runtime === 'provider') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
            { type: 'plain', text: ';' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'your-custom-provider'" },
            { type: 'plain', text: ';' },
          ]);
        }
        if (vibezCheckEnabled) {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'vibezcheck'" },
            { type: 'plain', text: ';' },
          ]);
        }
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// Safety Circuit Breaker: sever connection if call exceeds $0.50' },
        ]);
        addLine([
          { type: 'kw', text: 'export' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'async' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'function' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'POST' },
          { type: 'plain', text: '(' },
          { type: 'var', text: 'req' },
          { type: 'plain', text: ': ' },
          { type: 'var', text: 'Request' },
          { type: 'plain', text: ') {' },
        ]);
        addLine([
          { type: 'plain', text: '  ' },
          { type: 'kw', text: 'return' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: '({' },
        ]);
        if (vibezCheckEnabled) {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '), {' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '), {' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ', {' },
            ]);
          }
          addLine([
            { type: 'plain', text: '      maxCostPerCallUSD: ' },
            { type: 'num', text: '0.50' },
            { type: 'plain', text: ',' },
          ]);
          addLine([
            { type: 'plain', text: '      onLimitReached: ({ ' },
            { type: 'var', text: 'totalCostUSD' },
            { type: 'plain', text: ', ' },
            { type: 'fn', text: 'abort' },
            { type: 'plain', text: ' }) => {' },
          ]);
          addLine([
            { type: 'plain', text: '        ' },
            { type: 'var', text: 'console' },
            { type: 'plain', text: '.' },
            { type: 'fn', text: 'warn' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '`[VibezCheck] Trip wire hit: $${totalCostUSD}`' },
            { type: 'plain', text: ');' },
          ]);
          addLine([
            { type: 'plain', text: '        ' },
            { type: 'fn', text: 'abort' },
            { type: 'plain', text: '(); ' },
            { type: 'comment', text: '// Instantly aborts LLM execution' },
          ]);
          addLine([
            { type: 'plain', text: '      },' },
          ]);
          addLine([
            { type: 'plain', text: '    }),' },
          ]);
        } else {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '),' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '),' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ',' },
            ]);
          }
        }
        addLine([
          { type: 'plain', text: '    prompt: ' },
          { type: 'str', text: `'${AGENT_RECIPES['circuit-breaker'].prompt}'` },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '  }).' },
          { type: 'fn', text: 'toTextStreamResponse' },
          { type: 'plain', text: '();' },
        ]);
        addLine([
          { type: 'plain', text: '}' },
        ]);
        return lines;
      }

      if (activeAgentTab === 'margin') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'generateText' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'ai'" },
          { type: 'plain', text: ';' },
        ]);
        if (runtime === 'provider') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
            { type: 'plain', text: ';' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'your-custom-provider'" },
            { type: 'plain', text: ';' },
          ]);
        }
        if (vibezCheckEnabled) {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'vibezcheck'" },
            { type: 'plain', text: ';' },
          ]);
        }
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: `// Automatically adds +${marginPercent}% gross margin to raw model wholesale cost` },
        ]);
        addLine([
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' { ' },
          { type: 'var', text: 'text' },
          { type: 'plain', text: ', ' },
          { type: 'var', text: 'usage' },
          { type: 'plain', text: ' } = ' },
          { type: 'kw', text: 'await' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'generateText' },
          { type: 'plain', text: '({' },
        ]);
        if (vibezCheckEnabled) {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '), {' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '), {' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ', {' },
            ]);
          }
          addLine([
            { type: 'plain', text: '    pricing: {' },
          ]);
          addLine([
            { type: 'plain', text: '      margin: ' },
            { type: 'num', text: (1 + marginPercent / 100).toFixed(2) },
            { type: 'plain', text: ', ' },
            { type: 'comment', text: `// +${marginPercent}% markup` },
          ]);
          addLine([
            { type: 'plain', text: '      roundTo: ' },
            { type: 'num', text: '5' },
            { type: 'plain', text: ',' },
          ]);
          addLine([
            { type: 'plain', text: '    },' },
          ]);
          addLine([
            { type: 'plain', text: '  }),' },
          ]);
        } else {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '),' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '),' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '  model: ' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ',' },
            ]);
          }
        }
        addLine([
          { type: 'plain', text: '  prompt: ' },
          { type: 'str', text: `'${AGENT_RECIPES.margin.prompt}'` },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '});' },
        ]);
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// You pocket the spread between raw cost & billed amount' },
        ]);
        addLine([
          { type: 'var', text: 'console' },
          { type: 'plain', text: '.' },
          { type: 'fn', text: 'log' },
          { type: 'plain', text: '(' },
          { type: 'str', text: '`Wholesale: $${usage.rawCostUSD} -> Billed: $${usage.billedCostUSD}`' },
          { type: 'plain', text: ');' },
        ]);
        return lines;
      }

      if (activeAgentTab === 'abort') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'ai'" },
          { type: 'plain', text: ';' },
        ]);
        if (runtime === 'provider') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
            { type: 'plain', text: ';' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'your-custom-provider'" },
            { type: 'plain', text: ';' },
          ]);
        }
        if (vibezCheckEnabled) {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'vibezcheck'" },
            { type: 'plain', text: ';' },
          ]);
        }
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// Captures partial tokens even if client drops connection' },
        ]);
        addLine([
          { type: 'kw', text: 'export' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'async' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'function' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'POST' },
          { type: 'plain', text: '(' },
          { type: 'var', text: 'req' },
          { type: 'plain', text: ': ' },
          { type: 'var', text: 'Request' },
          { type: 'plain', text: ') {' },
        ]);
        addLine([
          { type: 'plain', text: '  ' },
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'controller' },
          { type: 'plain', text: ' = ' },
          { type: 'kw', text: 'new' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'AbortController' },
          { type: 'plain', text: '();' },
        ]);
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'plain', text: '  ' },
          { type: 'kw', text: 'return' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'streamText' },
          { type: 'plain', text: '({' },
        ]);
        if (vibezCheckEnabled) {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '), {' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '), {' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'vibezcheck' },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ', {' },
            ]);
          }
          addLine([
            { type: 'plain', text: '      captureOnAbort: ' },
            { type: 'kw', text: 'true' },
            { type: 'plain', text: ',' },
          ]);
          addLine([
            { type: 'plain', text: '      onAbort: ({ ' },
            { type: 'var', text: 'partialTokens' },
            { type: 'plain', text: ', ' },
            { type: 'var', text: 'accruedCostUSD' },
            { type: 'plain', text: ' }) => {' },
          ]);
          addLine([
            { type: 'plain', text: '        ' },
            { type: 'fn', text: 'recordUsage' },
            { type: 'plain', text: '({ ' },
            { type: 'var', text: 'partialTokens' },
            { type: 'plain', text: ', ' },
            { type: 'var', text: 'accruedCostUSD' },
            { type: 'plain', text: ' });' },
          ]);
          addLine([
            { type: 'plain', text: '      },' },
          ]);
          addLine([
            { type: 'plain', text: '    }),' },
          ]);
        } else {
          if (runtime === 'provider') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: currentTabConfig.providerFn },
              { type: 'plain', text: '(' },
              { type: 'str', text: `'${currentTabConfig.modelId}'` },
              { type: 'plain', text: '),' },
            ]);
          } else if (runtime === 'custom') {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'fn', text: 'yourProvider' },
              { type: 'plain', text: '(' },
              { type: 'str', text: "'your-model-id'" },
              { type: 'plain', text: '),' },
            ]);
          } else {
            addLine([
              { type: 'plain', text: '    model: ' },
              { type: 'str', text: `'${currentTabConfig.modelString}'` },
              { type: 'plain', text: ',' },
            ]);
          }
        }
        addLine([
          { type: 'plain', text: '    abortSignal: ' },
          { type: 'var', text: 'controller' },
          { type: 'plain', text: '.' },
          { type: 'var', text: 'signal' },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '    prompt: ' },
          { type: 'str', text: `'${AGENT_RECIPES.abort.prompt}'` },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '  }).' },
          { type: 'fn', text: 'toDataStreamResponse' },
          { type: 'plain', text: '();' },
        ]);
        addLine([
          { type: 'plain', text: '}' },
        ]);
        return lines;
      }

      if (activeAgentTab === 'session') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'VibezSession' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
        if (runtime === 'provider') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
            { type: 'plain', text: ';' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'kw', text: 'import' },
            { type: 'plain', text: ' { ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: ' } ' },
            { type: 'kw', text: 'from' },
            { type: 'str', text: " 'your-custom-provider'" },
            { type: 'plain', text: ';' },
          ]);
        }
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// Multi-turn agent session capped at $2.00 hard budget' },
        ]);
        addLine([
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'session' },
          { type: 'plain', text: ' = ' },
          { type: 'kw', text: 'new' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'VibezSession' },
          { type: 'plain', text: '({' },
        ]);
        addLine([
          { type: 'plain', text: '  budgetUSD: ' },
          { type: 'num', text: '2.00' },
          { type: 'plain', text: ',' },
        ]);
        addLine([
          { type: 'plain', text: '  onBudgetExceeded: ({ ' },
          { type: 'var', text: 'sessionCostUSD' },
          { type: 'plain', text: ' }) => {' },
        ]);
        addLine([
          { type: 'plain', text: '    ' },
          { type: 'kw', text: 'throw' },
          { type: 'plain', text: ' ' },
          { type: 'kw', text: 'new' },
          { type: 'plain', text: ' ' },
          { type: 'fn', text: 'Error' },
          { type: 'plain', text: '(' },
          { type: 'str', text: '`Agent depleted budget: $${sessionCostUSD}`' },
          { type: 'plain', text: ');' },
        ]);
        addLine([
          { type: 'plain', text: '  },' },
        ]);
        addLine([
          { type: 'plain', text: '});' },
        ]);
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'comment', text: '// Multiple tool steps share the same unified spending pool' },
        ]);
        const modelExpr =
          runtime === 'custom'
            ? 'yourProvider("your-model-id")'
            : runtime === 'gateway'
            ? `"${currentTabConfig.modelString}"`
            : `${currentTabConfig.providerFn}("${currentTabConfig.modelId}")`;
        addLine([
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'step1' },
          { type: 'plain', text: ' = ' },
          { type: 'kw', text: 'await' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'session' },
          { type: 'plain', text: '.' },
          { type: 'fn', text: 'run' },
          { type: 'plain', text: '(' },
          { type: 'fn', text: modelExpr },
          { type: 'plain', text: ', ' },
          { type: 'var', text: 'webSearchTool' },
          { type: 'plain', text: ');' },
        ]);
        addLine([
          { type: 'kw', text: 'const' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'step2' },
          { type: 'plain', text: ' = ' },
          { type: 'kw', text: 'await' },
          { type: 'plain', text: ' ' },
          { type: 'var', text: 'session' },
          { type: 'plain', text: '.' },
          { type: 'fn', text: 'run' },
          { type: 'plain', text: '(' },
          { type: 'fn', text: modelExpr },
          { type: 'plain', text: ', ' },
          { type: 'var', text: 'codeExecTool' },
          { type: 'plain', text: ');' },
        ]);
        addLine([{ type: 'plain', text: '' }]);
        addLine([
          { type: 'var', text: 'console' },
          { type: 'plain', text: '.' },
          { type: 'fn', text: 'log' },
          { type: 'plain', text: '(' },
          { type: 'str', text: "'Remaining: $'" },
          { type: 'plain', text: ' + ' },
          { type: 'var', text: 'session' },
          { type: 'plain', text: '.' },
          { type: 'var', text: 'remainingUSD' },
          { type: 'plain', text: ');' },
        ]);
        return lines;
      }
    }

    if (activeTab === 'chatbot') {
      // Condensed import to save lines & ensure static container sizing
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'streamText' },
        { type: 'plain', text: ', ' },
        { type: 'fn', text: 'toUIMessageStream' },
        { type: 'plain', text: ', ' },
        { type: 'fn', text: 'createUIMessageStreamResponse' },
        { type: 'plain', text: ', ' },
        { type: 'fn', text: 'convertToModelMessages' },
        { type: 'plain', text: ', ' },
        { type: 'var', text: 'UIMessage' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'ai'" },
        { type: 'plain', text: ';' },
      ]);

      // Provider import matching currentTabConfig
      if (runtime === 'provider') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: currentTabConfig.providerFn },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: ` "${currentTabConfig.providerPkg}"` },
          { type: 'plain', text: ';' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: ' "your-custom-provider"' },
          { type: 'plain', text: ';' },
        ]);
      }

      // VibezCheck import (if enabled)
      if (vibezCheckEnabled) {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
      }

      addLine([{ type: 'plain', text: '' }]);

      // Comment: // Allow streaming responses up to 30 seconds
      addLine([
        { type: 'comment', text: '// Allow streaming responses up to 30 seconds' },
      ]);

      // export const maxDuration = 30;
      addLine([
        { type: 'kw', text: 'export' },
        { type: 'plain', text: ' ' },
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' ' },
        { type: 'var', text: 'maxDuration' },
        { type: 'plain', text: ' = ' },
        { type: 'num', text: '30' },
        { type: 'plain', text: ';' },
      ]);

      addLine([{ type: 'plain', text: '' }]);

      // export async function POST(req: Request) {
      addLine([
        { type: 'kw', text: 'export' },
        { type: 'plain', text: ' ' },
        { type: 'kw', text: 'async' },
        { type: 'plain', text: ' ' },
        { type: 'kw', text: 'function' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'POST' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'req' },
        { type: 'plain', text: ': ' },
        { type: 'var', text: 'Request' },
        { type: 'plain', text: ') {' },
      ]);

      //   const { messages }: { messages: UIMessage[] } = await req.json();
      addLine([
        { type: 'plain', text: '  ' },
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' { ' },
        { type: 'var', text: 'messages' },
        { type: 'plain', text: ' }: { ' },
        { type: 'var', text: 'messages' },
        { type: 'plain', text: ': ' },
        { type: 'var', text: 'UIMessage' },
        { type: 'plain', text: '[] } = ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'var', text: 'req' },
        { type: 'plain', text: '.' },
        { type: 'fn', text: 'json' },
        { type: 'plain', text: '();' },
      ]);

      addLine([{ type: 'plain', text: '' }]);

      //   const result = streamText({
      addLine([
        { type: 'plain', text: '  ' },
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' ' },
        { type: 'var', text: 'result' },
        { type: 'plain', text: ' = ' },
        { type: 'fn', text: 'streamText' },
        { type: 'plain', text: '({' },
      ]);

      // Model line matching currentTabConfig
      if (vibezCheckEnabled) {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: '(' },
            { type: 'str', text: `"${currentTabConfig.modelId}"` },
            { type: 'plain', text: '), { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"your-model-id"' },
            { type: 'plain', text: '), { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'str', text: `"${currentTabConfig.modelString}"` },
            { type: 'plain', text: ', { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        }
      } else {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: '(' },
            { type: 'str', text: `"${currentTabConfig.modelId}"` },
            { type: 'plain', text: '),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"your-model-id"' },
            { type: 'plain', text: '),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '    model: ' },
            { type: 'str', text: `"${currentTabConfig.modelString}"` },
            { type: 'plain', text: ',' },
          ]);
        }
      }

      // instructions: 'You are a helpful assistant.',
      addLine([
        { type: 'plain', text: '    instructions: ' },
        { type: 'str', text: "'You are a helpful assistant.'" },
        { type: 'plain', text: ',' },
      ]);

      // messages: await convertToModelMessages(messages),
      addLine([
        { type: 'plain', text: '    messages: ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'convertToModelMessages' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'messages' },
        { type: 'plain', text: '), ' },
      ]);

      //   });
      addLine([{ type: 'plain', text: '  });' }]);

      addLine([{ type: 'plain', text: '' }]);

      //   return createUIMessageStreamResponse({
      addLine([
        { type: 'plain', text: '  ' },
        { type: 'kw', text: 'return' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'createUIMessageStreamResponse' },
        { type: 'plain', text: '({' },
      ]);

      //     stream: toUIMessageStream({ stream: result.stream }),
      addLine([
        { type: 'plain', text: '    stream: ' },
        { type: 'fn', text: 'toUIMessageStream' },
        { type: 'plain', text: '({ stream: ' },
        { type: 'var', text: 'result' },
        { type: 'plain', text: '.' },
        { type: 'var', text: 'stream' },
        { type: 'plain', text: ' }),' },
      ]);

      //   });
      addLine([{ type: 'plain', text: '  });' }]);

      // }
      addLine([{ type: 'plain', text: '}' }]);

      return lines;
    }

    if (activeTab === 'text') {
      // 1. AI import
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'generateText' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'ai'" },
        { type: 'plain', text: ';' },
      ]);

      // 2. Provider import (omitted if gateway)
      if (runtime === 'provider') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: currentTabConfig.providerFn },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: ` '${currentTabConfig.providerPkg}'` },
          { type: 'plain', text: ';' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'your-custom-provider'" },
          { type: 'plain', text: ';' },
        ]);
      }

      // 3. Vibezcheck import (if enabled)
      if (vibezCheckEnabled) {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
      }

      addLine([{ type: 'plain', text: '' }]);

      // 4. Invocation
      addLine([
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' { ' },
        { type: 'var', text: 'text' },
        { type: 'plain', text: ' } = ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'generateText' },
        { type: 'plain', text: '({' },
      ]);

      // 5. Model line matching currentTabConfig
      if (vibezCheckEnabled) {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: '(' },
            { type: 'str', text: `'${currentTabConfig.modelId}'` },
            { type: 'plain', text: '), { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'str', text: `"${currentTabConfig.modelString}"` },
            { type: 'plain', text: ', { customer: ' },
            { type: 'str', text: "'alex@example.com'" },
            { type: 'plain', text: ', pricing: { margin: ' },
            { type: 'num', text: '1.25' },
            { type: 'plain', text: ' } }),' },
          ]);
        }
      } else {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: currentTabConfig.providerFn },
            { type: 'plain', text: '(' },
            { type: 'str', text: `'${currentTabConfig.modelId}'` },
            { type: 'plain', text: '),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'str', text: `"${currentTabConfig.modelString}"` },
            { type: 'plain', text: ',' },
          ]);
        }
      }

      // 6. Prompt
      addLine([
        { type: 'plain', text: '  prompt: ' },
        { type: 'str', text: `'${currentPreset.prompt}'` },
        { type: 'plain', text: ',' },
      ]);
      addLine([{ type: 'plain', text: '});' }]);
      addLine([{ type: 'plain', text: '' }]);

      // 7. Console log
      addLine([
        { type: 'var', text: 'console' },
        { type: 'plain', text: '.' },
        { type: 'fn', text: 'log' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'text' },
        { type: 'plain', text: ');' },
      ]);

      return lines;
    }

    if (activeTab === 'image') {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'generateImage' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'ai'" },
        { type: 'plain', text: ';' },
      ]);

      if (runtime === 'provider') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'xai' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " '@ai-sdk/xai'" },
          { type: 'plain', text: ';' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'your-custom-provider'" },
          { type: 'plain', text: ';' },
        ]);
      }

      if (vibezCheckEnabled) {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
      }

      addLine([{ type: 'plain', text: '' }]);

      addLine([
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' { ' },
        { type: 'var', text: 'image' },
        { type: 'plain', text: ' } = ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'generateImage' },
        { type: 'plain', text: '({' },
      ]);

      if (vibezCheckEnabled) {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'xai' },
            { type: 'plain', text: '.' },
            { type: 'fn', text: 'image' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'grok-imagine-image'" },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.04' },
            { type: 'plain', text: ' }),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '.' },
            { type: 'fn', text: 'image' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.04' },
            { type: 'plain', text: ' }),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"xai/grok-imagine-image"' },
            { type: 'plain', text: ', { fixedPriceUSD: ' },
            { type: 'num', text: '0.04' },
            { type: 'plain', text: ' }),' },
          ]);
        }
      } else {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'xai' },
            { type: 'plain', text: '.' },
            { type: 'fn', text: 'image' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'grok-imagine-image'" },
            { type: 'plain', text: '), ' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '.' },
            { type: 'fn', text: 'image' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), ' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'str', text: '"xai/grok-imagine-image"' },
            { type: 'plain', text: ',' },
          ]);
        }
      }

      addLine([
        { type: 'plain', text: '  prompt: ' },
        { type: 'str', text: "'A teddy bear wearing a black hat hiking in the mountains'" },
        { type: 'plain', text: ',' },
      ]);
      addLine([{ type: 'plain', text: '});' }]);
      addLine([{ type: 'plain', text: '' }]);
      addLine([
        { type: 'var', text: 'console' },
        { type: 'plain', text: '.' },
        { type: 'fn', text: 'log' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'image' },
        { type: 'plain', text: '.' },
        { type: 'var', text: 'base64' },
        { type: 'plain', text: ');' },
      ]);

      return lines;
    }

    if (activeTab === 'speech') {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'generateSpeech' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'ai'" },
        { type: 'plain', text: ';' },
      ]);

      if (runtime === 'provider') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'elevenlabs' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " '@ai-sdk/elevenlabs'" },
          { type: 'plain', text: ';' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'your-custom-provider'" },
          { type: 'plain', text: ';' },
        ]);
      }

      if (vibezCheckEnabled) {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
      }

      addLine([{ type: 'plain', text: '' }]);

      addLine([
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' { ' },
        { type: 'var', text: 'audio' },
        { type: 'plain', text: ' } = ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'generateSpeech' },
        { type: 'plain', text: '({' },
      ]);

      if (vibezCheckEnabled) {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'elevenlabs' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"elevenlabs/multilingual-v2"' },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.0035' },
            { type: 'plain', text: ' }),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.0035' },
            { type: 'plain', text: ' }),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"elevenlabs/multilingual-v2"' },
            { type: 'plain', text: ', { fixedPriceUSD: ' },
            { type: 'num', text: '0.0035' },
            { type: 'plain', text: ' }),' },
          ]);
        }
      } else {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'elevenlabs' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"elevenlabs/multilingual-v2"' },
            { type: 'plain', text: '), ' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), ' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'str', text: '"elevenlabs/multilingual-v2"' },
            { type: 'plain', text: ',' },
          ]);
        }
      }

      addLine([
        { type: 'plain', text: '  text: ' },
        { type: 'str', text: "'Welcome to the Next.js AI SDK.'" },
        { type: 'plain', text: ',' },
      ]);
      addLine([{ type: 'plain', text: '});' }]);
      addLine([{ type: 'plain', text: '' }]);
      addLine([
        { type: 'var', text: 'console' },
        { type: 'plain', text: '.' },
        { type: 'fn', text: 'log' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'audio' },
        { type: 'plain', text: ');' },
      ]);

      return lines;
    }

    if (activeTab === 'transcription') {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'transcribe' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'ai'" },
        { type: 'plain', text: ';' },
      ]);

      if (runtime === 'provider') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'openai' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " '@ai-sdk/openai'" },
          { type: 'plain', text: ';' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'your-custom-provider'" },
          { type: 'plain', text: ';' },
        ]);
      }

      if (vibezCheckEnabled) {
        addLine([
          { type: 'kw', text: 'import' },
          { type: 'plain', text: ' { ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: ' } ' },
          { type: 'kw', text: 'from' },
          { type: 'str', text: " 'vibezcheck'" },
          { type: 'plain', text: ';' },
        ]);
      }

      addLine([{ type: 'plain', text: '' }]);

      addLine([
        { type: 'kw', text: 'const' },
        { type: 'plain', text: ' { ' },
        { type: 'var', text: 'text' },
        { type: 'plain', text: ' } = ' },
        { type: 'kw', text: 'await' },
        { type: 'plain', text: ' ' },
        { type: 'fn', text: 'transcribe' },
        { type: 'plain', text: '({' },
      ]);

      if (vibezCheckEnabled) {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'openai' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"openai/whisper-1"' },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.006' },
            { type: 'plain', text: ' }),' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), { fixedPriceUSD: ' },
            { type: 'num', text: '0.006' },
            { type: 'plain', text: ' }),' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'vibezcheck' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"openai/whisper-1"' },
            { type: 'plain', text: ', { fixedPriceUSD: ' },
            { type: 'num', text: '0.006' },
            { type: 'plain', text: ' }),' },
          ]);
        }
      } else {
        if (runtime === 'provider') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'openai' },
            { type: 'plain', text: '(' },
            { type: 'str', text: '"openai/whisper-1"' },
            { type: 'plain', text: '), ' },
          ]);
        } else if (runtime === 'custom') {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'fn', text: 'yourProvider' },
            { type: 'plain', text: '(' },
            { type: 'str', text: "'your-model-id'" },
            { type: 'plain', text: '), ' },
          ]);
        } else {
          addLine([
            { type: 'plain', text: '  model: ' },
            { type: 'str', text: '"openai/whisper-1"' },
            { type: 'plain', text: ',' },
          ]);
        }
      }

      addLine([
        { type: 'plain', text: '  audio: ' },
        { type: 'var', text: 'audioBuffer' },
        { type: 'plain', text: ',' },
      ]);
      addLine([{ type: 'plain', text: '});' }]);
      addLine([{ type: 'plain', text: '' }]);
      addLine([
        { type: 'var', text: 'console' },
        { type: 'plain', text: '.' },
        { type: 'fn', text: 'log' },
        { type: 'plain', text: '(' },
        { type: 'var', text: 'text' },
        { type: 'plain', text: ');' },
      ]);

      return lines;
    }

    // Video
    addLine([
      { type: 'kw', text: 'import' },
      { type: 'plain', text: ' { ' },
      { type: 'fn', text: 'generateVideo' },
      { type: 'plain', text: ' } ' },
      { type: 'kw', text: 'from' },
      { type: 'str', text: " 'ai'" },
      { type: 'plain', text: ';' },
    ]);

    if (runtime === 'provider') {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'luma' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " '@ai-sdk/luma'" },
        { type: 'plain', text: ';' },
      ]);
    } else if (runtime === 'custom') {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'yourProvider' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'your-custom-provider'" },
        { type: 'plain', text: ';' },
      ]);
    }

    if (vibezCheckEnabled) {
      addLine([
        { type: 'kw', text: 'import' },
        { type: 'plain', text: ' { ' },
        { type: 'fn', text: 'vibezcheck' },
        { type: 'plain', text: ' } ' },
        { type: 'kw', text: 'from' },
        { type: 'str', text: " 'vibezcheck'" },
        { type: 'plain', text: ';' },
      ]);
    }

    addLine([{ type: 'plain', text: '' }]);

    addLine([
      { type: 'kw', text: 'const' },
      { type: 'plain', text: ' { ' },
      { type: 'var', text: 'video' },
      { type: 'plain', text: ' } = ' },
      { type: 'kw', text: 'await' },
      { type: 'plain', text: ' ' },
      { type: 'fn', text: 'generateVideo' },
      { type: 'plain', text: '({' },
    ]);

    if (vibezCheckEnabled) {
      if (runtime === 'provider') {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: '(' },
          { type: 'fn', text: 'luma' },
          { type: 'plain', text: '(' },
          { type: 'str', text: '"luma/ray-2"' },
          { type: 'plain', text: '), { fixedPriceUSD: ' },
          { type: 'num', text: '0.25' },
          { type: 'plain', text: ' }),' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: '(' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: '(' },
          { type: 'str', text: "'your-model-id'" },
          { type: 'plain', text: '), { fixedPriceUSD: ' },
          { type: 'num', text: '0.25' },
          { type: 'plain', text: ' }),' },
        ]);
      } else {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'fn', text: 'vibezcheck' },
          { type: 'plain', text: '(' },
          { type: 'str', text: '"luma/ray-2"' },
          { type: 'plain', text: ', { fixedPriceUSD: ' },
          { type: 'num', text: '0.25' },
          { type: 'plain', text: ' }),' },
        ]);
      }
    } else {
      if (runtime === 'provider') {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'fn', text: 'luma' },
          { type: 'plain', text: '(' },
          { type: 'str', text: '"luma/ray-2"' },
          { type: 'plain', text: '), ' },
        ]);
      } else if (runtime === 'custom') {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'fn', text: 'yourProvider' },
          { type: 'plain', text: '(' },
          { type: 'str', text: "'your-model-id'" },
          { type: 'plain', text: '), ' },
        ]);
      } else {
        addLine([
          { type: 'plain', text: '  model: ' },
          { type: 'str', text: '"luma/ray-2"' },
          { type: 'plain', text: ',' },
        ]);
      }
    }

    addLine([
      { type: 'plain', text: '  prompt: ' },
      { type: 'str', text: "'Drone shot of futuristic solar-powered cyberpunk city at dusk'" },
      { type: 'plain', text: ',' },
    ]);
    addLine([{ type: 'plain', text: '});' }]);
    addLine([{ type: 'plain', text: '' }]);
    addLine([
      { type: 'var', text: 'console' },
      { type: 'plain', text: '.' },
      { type: 'fn', text: 'log' },
      { type: 'plain', text: '(' },
      { type: 'var', text: 'video' },
      { type: 'plain', text: '.' },
      { type: 'var', text: 'url' },
      { type: 'plain', text: ');' },
    ]);

    return lines;
  }, [audienceTab, activeAgentTab, activeTab, vibezCheckEnabled, runtime, currentPreset, marginPercent, currentTabConfig]);

  const rawCodeString = useMemo(() => {
    return codeLines
      .map((line) => line.tokens.map((t) => t.text).join(''))
      .join('\n');
  }, [codeLines]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const billedAmount = (currentPreset.costUSD * 1.25).toFixed(5);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4 select-none">
      {/* ✦ Top Tab Controls Row Matching Screenshot */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        {/* Capability Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-zinc-900/90 border border-slate-300/80 dark:border-zinc-800 rounded-xl overflow-x-auto no-scrollbar shadow-xs">
          {audienceTab === 'agents' ? (
            <>
              <button
                onClick={() => setActiveAgentTab('stripe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeAgentTab === 'stripe'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Customer Wallet</span>
              </button>

              <button
                onClick={() => setActiveAgentTab('circuit-breaker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeAgentTab === 'circuit-breaker'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Safety Switch</span>
              </button>

              <button
                onClick={() => setActiveAgentTab('margin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeAgentTab === 'margin'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Percent className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Profit Markup</span>
              </button>

              <button
                onClick={() => setActiveAgentTab('abort')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeAgentTab === 'abort'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                <span>Disconnect Shield</span>
              </button>

              <button
                onClick={() => setActiveAgentTab('session')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeAgentTab === 'session'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                <span>Spending Limit</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('chatbot')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'chatbot'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="openai" size={13} />
                <span>Chatbot</span>
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="claude-color" size={13} />
                <span>Text Generation</span>
              </button>

              <button
                onClick={() => setActiveTab('image')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'image'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="grok" size={13} />
                <span>Image Generation</span>
              </button>

              <button
                onClick={() => setActiveTab('speech')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'speech'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="elevenlabs" size={13} />
                <span>Speech</span>
              </button>

              <button
                onClick={() => setActiveTab('transcription')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'transcription'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="openai" size={13} />
                <span>Transcription</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'video'
                    ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <LobeIcon name="luma-color" size={13} />
                <span>Video Generation</span>
              </button>
            </>
          )}
        </div>

        {/* ✦ Left / Right Model Cycle Controls: < [ Brand Icon ] > Matching Screenshot */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-zinc-900/90 border border-slate-300/80 dark:border-zinc-800 rounded-xl p-1 shadow-xs">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous model"
            className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Model Icon / Badge Indicator with official LobeIcon logo */}
          <div
            title={`${currentTabConfig.provider} (${currentTabConfig.modelString})`}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 shadow-xs cursor-pointer overflow-hidden p-1 hover:scale-105 transition"
          >
            <LobeIcon name={currentTabConfig.iconName} size={15} alt={currentTabConfig.provider} />
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next model"
            className="p-1.5 rounded-lg text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ✦ AI Elements <Sandbox /> Container */}
      <Sandbox>
        {/* Sandbox Header */}
        <SandboxHeader>
          {/* Traffic Light Window Dots + Dev Mode Pill */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />

            {/* ✦ Dev Mode Pill */}
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

          {/* Header Controls: Improved VibezCheck Badge + Run It With Dropdown + Copy */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* ✦ Improved VibezCheck Badge with Smooth Toggle Switch */}
            <button
              type="button"
              onClick={() => setVibezCheckEnabled(!vibezCheckEnabled)}
              className={`group flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer select-none ${
                vibezCheckEnabled
                  ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-2xs hover:bg-emerald-500/15'
                  : 'bg-slate-100/90 dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-700 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
              title="Toggle VibezCheck token & cost metering"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles
                  className={`w-3 h-3 transition-transform ${
                    vibezCheckEnabled
                      ? 'text-emerald-500 dark:text-emerald-400 rotate-12 scale-110'
                      : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <span className="text-[11px] font-semibold tracking-tight">VibezCheck</span>
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

            {/* Run it with [ Provider ∨ ] Dropdown with Brand Logo */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-sans hidden sm:inline">
                Run it with
              </span>
              <div className="relative flex items-center">
                <div className="absolute left-2.5 pointer-events-none flex items-center">
                  <LobeIcon
                    name={
                      runtime === 'custom'
                        ? 'lobehub'
                        : runtime === 'gateway'
                        ? 'vercel'
                        : currentTabConfig.iconName
                    }
                    size={14}
                  />
                </div>
                <select
                  value={runtime}
                  onChange={(e) => setRuntime(e.target.value as RuntimeEngine)}
                  className="appearance-none bg-white dark:bg-[#1c1c22] border border-slate-300 dark:border-zinc-700 hover:border-slate-500 dark:hover:border-zinc-500 text-slate-800 dark:text-white text-xs font-sans py-1 pl-7 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
                >
                  <option value="provider">{currentTabConfig.provider}</option>
                  <option value="custom">Custom Provider</option>
                  <option value="gateway">AI Gateway</option>
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

        {/* Sandbox Body: Code Editor + Live Preview (Console Drawer Removed) */}
        <SandboxBody>
          {/* Left: Code Editor Window (No bottom console bar) */}
          <SandboxEditor>
            <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-zinc-200 flex-1 bg-[#0e0e11]">
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
          </SandboxEditor>

          {/* Right: Sandbox Live Execution Preview */}
          <SandboxPreview>
            <div className="space-y-3">
              {/* User Prompt Bubble (White bubble with tail) */}
              <div className="flex justify-end">
                <div className="relative bg-white text-zinc-950 rounded-2xl rounded-br-xs px-4 py-3 text-xs font-medium max-w-[95%] shadow-sm leading-relaxed">
                  {audienceTab === 'agents'
                    ? AGENT_RECIPES[activeAgentTab].prompt
                    : activeTab === 'image'
                    ? 'A teddy bear wearing a black hat hiking in the mountains'
                    : activeTab === 'chatbot'
                    ? 'How do I stream multi-turn chatbot messages with the AI SDK?'
                    : currentPreset.prompt}
                </div>
              </div>

              {/* ✦ Agent Developer Recipe Previews (Visible when audienceTab === 'agents') */}
              {audienceTab === 'agents' && (
                <>
                  {/* Stripe Billing Preview */}
                  {activeAgentTab === 'stripe' && (
                    <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                      {/* Provider & Recipe Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <LobeIcon name={currentTabConfig.iconName} className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {currentTabConfig.provider}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {runtime === 'custom' ? 'custom-model' : currentTabConfig.modelId}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          cus_live_94x19K
                        </span>
                      </div>

                      {/* AI Assistant Response Output */}
                      <p className="leading-relaxed">
                        {AGENT_RECIPES.stripe.getOutput(currentTabConfig.provider, currentTabConfig.modelId)}
                      </p>

                      {/* VibezCheck Telemetry & Prepaid Wallet (Only when enabled) */}
                      {vibezCheckEnabled ? (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          {/* Prepaid Wallet Balance */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400">
                                Customer Prepaid Balance
                              </div>
                              <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 transition-all">
                                ${stripeCredits.toFixed(2)}{' '}
                                <span className="text-xs font-normal text-slate-500">USD</span>
                              </div>
                            </div>
                            <button
                              onClick={handleTopUpCredits}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <span>+ Add $10</span>
                            </button>
                          </div>

                          {topUpSuccess && (
                            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in duration-200">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Customer balance credited (+10.00 USD)</span>
                            </div>
                          )}

                          {/* Meter Event Telemetry */}
                          <div className="space-y-1.5 font-mono text-[11px] pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-zinc-400">Meter Event:</span>
                              <span className="text-slate-800 dark:text-zinc-200">ai_tokens_consumed</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-zinc-400">Reported Usage:</span>
                              <span className="text-slate-800 dark:text-zinc-200">
                                {currentPreset.tokens} tokens (-${currentPreset.costUSD.toFixed(5)} USD)
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500 dark:text-zinc-400">Sync Status:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Auto-synced (200 OK)
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                            <VibezReceipt
                              model={
                                runtime === 'custom'
                                  ? 'your-model-id'
                                  : runtime === 'provider'
                                  ? currentTabConfig.modelId
                                  : currentTabConfig.modelString
                              }
                              tokens={currentPreset.tokens}
                              costUSD={currentPreset.costUSD}
                              latencyMs={currentTabConfig.latencyMs}
                              variant="pill"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Unmonitored State when VibezCheck is OFF */
                        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-slate-800 dark:text-zinc-200 space-y-2 font-mono text-[11px]">
                            <div className="flex items-center justify-between pb-1 border-b border-rose-500/10">
                              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>Unmetered Stream Pipeline</span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                                Unmonitored
                              </span>
                            </div>
                            <div className="space-y-1 text-slate-600 dark:text-zinc-400">
                              <div className="flex items-center justify-between">
                                <span>Customer Ledger:</span>
                                <span className="text-rose-600 dark:text-rose-400 font-semibold">Not Linked</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Stripe Usage Events:</span>
                                <span className="text-rose-600 dark:text-rose-400 font-semibold">0 emitted</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Net Gross Margin:</span>
                                <span className="text-slate-500 dark:text-zinc-500">+0.0% (Wholesale Cost)</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setVibezCheckEnabled(true)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Arm VibezCheck (Link Stripe & +30% Margin)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Circuit Breaker Preview */}
                  {activeAgentTab === 'circuit-breaker' && (
                    <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                      {/* Provider & Recipe Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <LobeIcon name={currentTabConfig.iconName} className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {currentTabConfig.provider}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {runtime === 'custom' ? 'custom-model' : currentTabConfig.modelId}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1 ${
                          vibezCheckEnabled
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          <ShieldAlert className="w-3 h-3" />
                          {vibezCheckEnabled ? 'Trip Limit: $0.50 USD' : 'Failsafe: Disabled'}
                        </span>
                      </div>

                      {/* AI Assistant Response Output */}
                      <p className="leading-relaxed">
                        {AGENT_RECIPES['circuit-breaker'].getOutput(currentTabConfig.provider, currentTabConfig.modelId)}
                      </p>

                      {/* Circuit Breaker Telemetry & Interactive Simulation */}
                      {vibezCheckEnabled ? (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          {/* Execution Trace */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2 font-mono text-[11px]">
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                              Recursive Execution Trace
                            </div>

                            {/* Animated Limit Gauge */}
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, Math.max(5, (simulatedCost / 0.50) * 100))}%`,
                                }}
                              />
                            </div>

                            <div className="space-y-1 pt-0.5">
                              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                <span>Loop #1: Plan & schemas</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ $0.0008</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                                <span>Loop #2: Tool invoke retry</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ $0.0034</span>
                              </div>
                              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                                <span>{isSimulatingLoop ? `Loop #${simulatedStep}: Reasoning step` : 'Loop #3: Trip threshold hit'}</span>
                                <span>${simulatedCost.toFixed(4)} [Capped]</span>
                              </div>
                            </div>
                          </div>

                          {/* Trip Alert Banner */}
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 space-y-1">
                            <div className="flex items-center justify-between font-mono font-semibold text-[11px]">
                              <span className="flex items-center gap-1.5">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                Circuit Breaker Engaged
                              </span>
                              <span className="text-xs font-mono">${simulatedCost.toFixed(4)} USD</span>
                            </div>
                            <p className="text-[11px] leading-normal text-amber-700 dark:text-amber-400">
                              Stream terminated automatically at threshold. $45.00+ runaway bill prevented.
                            </p>
                          </div>

                          {/* Controls */}
                          <div className="flex items-center justify-between pt-1">
                            <button
                              onClick={handleSimulateLoop}
                              disabled={isSimulatingLoop}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-medium text-[11px] transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <RotateCcw className={`w-3 h-3 ${isSimulatingLoop ? 'animate-spin' : ''}`} />
                              <span>{isSimulatingLoop ? 'Simulating Trace...' : 'Simulate Runaway Loop'}</span>
                            </button>

                            <VibezReceipt
                              model={
                                runtime === 'custom'
                                  ? 'your-model-id'
                                  : runtime === 'provider'
                                  ? currentTabConfig.modelId
                                  : currentTabConfig.modelString
                              }
                              tokens={25000}
                              costUSD={0.50}
                              latencyMs={currentTabConfig.latencyMs}
                              variant="pill"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Circuit Breaker Disabled State */
                        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200 font-mono text-[11px]">
                          <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-slate-800 dark:text-zinc-200 space-y-2">
                            <div className="flex items-center justify-between pb-1 border-b border-rose-500/10">
                              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>No Runaway Failsafe Armed</span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium">
                                Uncapped
                              </span>
                            </div>

                            {/* Simulated Uncapped Gauge */}
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: isSimulatingLoop ? `${Math.min(100, (simulatedCost / 50) * 100)}%` : '75%',
                                }}
                              />
                            </div>

                            <div className="space-y-1 text-slate-600 dark:text-zinc-400">
                              <div className="flex items-center justify-between">
                                <span>Simulated Exposure:</span>
                                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                  {isSimulatingLoop ? `$${simulatedCost.toFixed(2)} USD` : '$48.50+ surprise bill'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Loop Severity:</span>
                                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                  {isSimulatingLoop ? `Loop #${simulatedStep} (Spinning)` : 'Unbounded recursion'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleSimulateLoop}
                              disabled={isSimulatingLoop}
                              className="px-2.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium text-[11px] transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <RotateCcw className={`w-3 h-3 ${isSimulatingLoop ? 'animate-spin' : ''}`} />
                              <span>{isSimulatingLoop ? 'Spurting Tokens...' : 'Test Runaway'}</span>
                            </button>
                            <button
                              onClick={() => setVibezCheckEnabled(true)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Arm Failsafe ($0.50 Limit)</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Profit Margins Preview */}
                  {activeAgentTab === 'margin' && (
                    <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                      {/* Provider & Recipe Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <LobeIcon name={currentTabConfig.iconName} className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {currentTabConfig.provider}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {runtime === 'custom' ? 'custom-model' : currentTabConfig.modelId}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1 ${
                          vibezCheckEnabled
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}>
                          <Percent className="w-3 h-3" />
                          {vibezCheckEnabled ? `+${marginPercent}% Net Markup` : '+0% Margin (Raw Cost)'}
                        </span>
                      </div>

                      {/* AI Assistant Response Output */}
                      <p className="leading-relaxed">
                        {AGENT_RECIPES.margin.getOutput(currentTabConfig.provider, currentTabConfig.modelId)}
                      </p>

                      {/* Profit Margins Controls & Breakdown */}
                      {vibezCheckEnabled ? (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          {/* Interactive Margin Slider */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between font-mono text-[11px]">
                              <span className="text-slate-600 dark:text-zinc-400">Adjust Net Profit Margin:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                                +{marginPercent}%
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
                              <span>+10% (High Volume)</span>
                              <span>+50% (Standard)</span>
                              <span>+100% (Premium)</span>
                            </div>
                          </div>

                          {/* Financial Split with Animated Visual Proportion Bar */}
                          <div className="space-y-2 font-mono text-[11px] pt-1">
                            <div className="w-full bg-slate-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                              <div
                                className="bg-slate-400 dark:bg-zinc-500 h-2 transition-all duration-200"
                                style={{ width: `${Math.round((100 / (100 + marginPercent)) * 100)}%` }}
                              />
                              <div
                                className="bg-emerald-500 h-2 transition-all duration-200"
                                style={{ width: `${Math.round((marginPercent / (100 + marginPercent)) * 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500" />
                                Wholesale Cost: ${currentPreset.costUSD.toFixed(5)}
                              </span>
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Your Profit: +${((currentPreset.costUSD * marginPercent) / 100).toFixed(5)}
                              </span>
                            </div>

                            <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-zinc-800/80">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-zinc-400">Wholesale Expense:</span>
                                <span className="text-slate-700 dark:text-zinc-300">
                                  ${currentPreset.costUSD.toFixed(5)} USD ({currentPreset.tokens} tok)
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-zinc-400">Developer Profit:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  +${((currentPreset.costUSD * marginPercent) / 100).toFixed(5)} USD
                                </span>
                              </div>
                              <div className="flex items-center justify-between border-t border-dashed border-slate-200 dark:border-zinc-800 pt-1.5 font-bold">
                                <span className="text-slate-900 dark:text-white">Customer Invoiced:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                                  ${(currentPreset.costUSD * (1 + marginPercent / 100)).toFixed(5)} USD
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                            <VibezReceipt
                              model={
                                runtime === 'custom'
                                  ? 'your-model-id'
                                  : runtime === 'provider'
                                  ? currentTabConfig.modelId
                                  : currentTabConfig.modelString
                              }
                              tokens={currentPreset.tokens}
                              costUSD={currentPreset.costUSD * (1 + marginPercent / 100)}
                              latencyMs={currentTabConfig.latencyMs}
                              variant="pill"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Zero Margin Unmonitored State */
                        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200 font-mono text-[11px]">
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-slate-600 dark:text-zinc-400">
                            <div className="flex items-center justify-between text-slate-800 dark:text-zinc-200 font-semibold pb-1 border-b border-slate-200 dark:border-zinc-800">
                              <span>Pricing Model: Pass-Through</span>
                              <span className="text-slate-400">0% Margin</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Raw Wholesale:</span>
                              <span>${currentPreset.costUSD.toFixed(5)} USD</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Developer Markup:</span>
                              <span className="text-rose-500">+$0.00000 (No markup)</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 pt-1 font-semibold text-slate-800 dark:text-zinc-200">
                              <span>Customer Charged:</span>
                              <span>${currentPreset.costUSD.toFixed(5)} USD</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setVibezCheckEnabled(true)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Percent className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Configure Developer Profit Margin (+30%)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Abort Protection Preview */}
                  {activeAgentTab === 'abort' && (
                    <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                      {/* Provider & Recipe Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <LobeIcon name={currentTabConfig.iconName} className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {currentTabConfig.provider}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {runtime === 'custom' ? 'custom-model' : currentTabConfig.modelId}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1 ${
                          vibezCheckEnabled
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          <LifeBuoy className="w-3 h-3" />
                          {vibezCheckEnabled ? 'captureOnAbort: active' : 'captureOnAbort: disabled'}
                        </span>
                      </div>

                      {/* AI Assistant Response Output */}
                      <p className="leading-relaxed">
                        {AGENT_RECIPES.abort.getOutput(currentTabConfig.provider, currentTabConfig.modelId)}
                      </p>

                      {/* Abort Protection Scenario & Telemetry */}
                      {vibezCheckEnabled ? (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          {/* Scenario Box */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                              Stream Interruption Simulation
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-normal">
                              Client disconnected {currentPreset.tokens} tokens into a 4,000 token stream. VibezCheck flushed metrics synchronously before socket close.
                            </p>
                            <div className="space-y-1 font-mono text-[11px] pt-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-zinc-400">Tokens Streamed:</span>
                                <span className="font-semibold text-slate-800 dark:text-zinc-200">
                                  {currentPreset.tokens} tokens
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-zinc-400">Unbilled Waste:</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                  0 tokens (100% saved)
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-zinc-400">Accrued Cost Captured:</span>
                                <span className="text-slate-800 dark:text-zinc-200">
                                  ${currentPreset.costUSD.toFixed(5)} USD
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300 flex items-center gap-2 text-[11px] font-mono">
                            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                            <span>Partial tokens recorded to DB before socket closure</span>
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                            <VibezReceipt
                              model={
                                runtime === 'custom'
                                  ? 'your-model-id'
                                  : runtime === 'provider'
                                  ? currentTabConfig.modelId
                                  : currentTabConfig.modelString
                              }
                              tokens={currentPreset.tokens}
                              costUSD={currentPreset.costUSD}
                              latencyMs={Math.round(currentTabConfig.latencyMs * 0.6)}
                              variant="pill"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Unprotected Abort State */
                        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200 font-mono text-[11px]">
                          <div className="p-3 rounded-xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 text-slate-800 dark:text-zinc-200 space-y-1.5">
                            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-semibold pb-1 border-b border-rose-500/10">
                              <span>In-Flight Disconnect Result</span>
                              <span>Compute Lost</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                              <span>Tokens Emitted:</span>
                              <span>{currentPreset.tokens} tokens</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                              <span>Provider Invoiced:</span>
                              <span>${currentPreset.costUSD.toFixed(5)} USD</span>
                            </div>
                            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-semibold border-t border-rose-500/10 pt-1">
                              <span>Customer Billed:</span>
                              <span>$0.00000 USD (100% loss)</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setVibezCheckEnabled(true)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <LifeBuoy className="w-3.5 h-3.5 text-sky-400" />
                            <span>Enable Abort Capture (0% Waste)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Multi-Tool Session Budget Preview */}
                  {activeAgentTab === 'session' && (
                    <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs animate-in fade-in duration-200">
                      {/* Provider & Recipe Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                          <LobeIcon name={currentTabConfig.iconName} className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">
                            {currentTabConfig.provider}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                            {runtime === 'custom' ? 'custom-model' : currentTabConfig.modelId}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-medium flex items-center gap-1">
                          <Bot className="w-3 h-3 text-purple-500" />
                          Budget: $2.000 USD
                        </span>
                      </div>

                      {/* AI Assistant Response Output */}
                      <p className="leading-relaxed">
                        {AGENT_RECIPES.session.getOutput(currentTabConfig.provider, currentTabConfig.modelId)}
                      </p>

                      {/* Multi-Tool Session Budget Breakdown & Telemetry */}
                      {vibezCheckEnabled ? (
                        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200">
                          {/* Spending Progress */}
                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between font-mono text-[11px]">
                              <span className="text-slate-500 dark:text-zinc-400">Total Spent:</span>
                              <span className="font-bold text-slate-900 dark:text-white">
                                ${(currentPreset.costUSD * 3.4).toFixed(5)}{' '}
                                <span className="font-normal text-slate-400">/ $2.00000 USD</span>
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(100, Math.max(3, ((currentPreset.costUSD * 3.4) / 2) * 100)).toFixed(1)}%`,
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                              <span>
                                {(((currentPreset.costUSD * 3.4) / 2) * 100).toFixed(2)}% used
                              </span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {(100 - ((currentPreset.costUSD * 3.4) / 2) * 100).toFixed(2)}% remaining
                              </span>
                            </div>
                          </div>

                          {/* Tool Breakdown */}
                          <div className="space-y-1.5 font-mono text-[11px] pt-1">
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                <Search className="w-3 h-3 text-purple-400" /> webSearchTool
                              </span>
                              <span>
                                {Math.round(currentPreset.tokens * 0.8)} tok • ${(currentPreset.costUSD * 0.8).toFixed(5)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                <BarChart2 className="w-3 h-3 text-purple-400" /> dataAnalysisTool
                              </span>
                              <span>
                                {Math.round(currentPreset.tokens * 1.1)} tok • ${(currentPreset.costUSD * 1.1).toFixed(5)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 dark:text-zinc-400">
                              <span className="flex items-center gap-1.5">
                                <Terminal className="w-3 h-3 text-purple-400" /> codeExecutionTool
                              </span>
                              <span>
                                {Math.round(currentPreset.tokens * 1.5)} tok • ${(currentPreset.costUSD * 1.5).toFixed(5)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 dark:border-zinc-800/80">
                            <VibezReceipt
                              model={
                                runtime === 'custom'
                                  ? 'your-model-id'
                                  : runtime === 'provider'
                                  ? currentTabConfig.modelId
                                  : currentTabConfig.modelString
                              }
                              tokens={Math.round(currentPreset.tokens * 3.4)}
                              costUSD={currentPreset.costUSD * 3.4}
                              latencyMs={currentTabConfig.latencyMs}
                              variant="pill"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Unbudgeted State */
                        <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800/80 animate-in fade-in duration-200 font-mono text-[11px]">
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-slate-600 dark:text-zinc-400">
                            <div className="flex items-center justify-between text-slate-800 dark:text-zinc-200 font-semibold pb-1 border-b border-slate-200 dark:border-zinc-800">
                              <span>Session Budgeting</span>
                              <span className="text-rose-500">Unrestricted</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Tool Invocation Cap:</span>
                              <span className="text-rose-500 font-semibold">None (Autonomous)</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Aggregated Session Spend:</span>
                              <span className="text-slate-500 dark:text-zinc-500">Unmetered across tools</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setVibezCheckEnabled(true)}
                            className="w-full py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-medium text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Bot className="w-3.5 h-3.5 text-purple-400" />
                            <span>Set Unified Session Budget ($2.00)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ✦ Human Consumer Previews (Visible when audienceTab === 'humans') */}
              {audienceTab !== 'agents' && (
                <>
                  {/* Chatbot Output Preview */}
                  {activeTab === 'chatbot' && (
                <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>instructions: "You are a helpful assistant."</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      streaming UI
                    </span>
                  </div>

                  <p>
                    Streaming uses UI message streams (<code className="text-pink-500 dark:text-pink-400 font-mono text-[11px]">toUIMessageStream</code>) to send text chunks as they are generated by the model directly into your React client with zero lag.
                  </p>

                  {/* ✦ VibezCheck Stats & Amount Section (Visible ONLY when VibezCheck is toggled ON) */}
                  {vibezCheckEnabled && (
                    <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Tokens Measured:</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          185 tokens
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Wholesale Cost:</span>
                        <span className="text-slate-700 dark:text-zinc-300 font-medium">
                          $0.00028 USD
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Developer Margin:</span>
                        <span className="text-lime-600 dark:text-lime-400 font-semibold">
                          +25% (+$0.00007)
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono border-t border-dashed border-slate-200 dark:border-zinc-800 pt-1.5 font-bold">
                        <span className="text-slate-900 dark:text-white">Billed Amount:</span>
                        <span className="text-lime-600 dark:text-lime-400 text-xs">
                          $0.00035 USD
                        </span>
                      </div>

                      <div className="pt-1">
                        <VibezReceipt
                          model={
                            runtime === 'custom'
                              ? 'your-model-id'
                              : runtime === 'provider'
                              ? currentTabConfig.modelId
                              : currentTabConfig.modelString
                          }
                          tokens={185}
                          costUSD={0.00035}
                          latencyMs={currentTabConfig.latencyMs}
                          variant="pill"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assistant Output Content */}
              {activeTab === 'text' && (
                <div className="bg-white dark:bg-[#18181f] border border-slate-200/90 dark:border-zinc-800 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 dark:text-zinc-200 leading-relaxed space-y-3 shadow-xs">
                  <p>{currentPreset.output}</p>

                  {/* ✦ VibezCheck Stats & Amount Section (Visible ONLY when VibezCheck is toggled ON) */}
                  {vibezCheckEnabled && (
                    <div className="pt-3 border-t border-slate-200 dark:border-zinc-800/80 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Tokens Measured:</span>
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">
                          {currentPreset.tokens} tokens
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Wholesale Cost:</span>
                        <span className="text-slate-700 dark:text-zinc-300 font-medium">
                          ${currentPreset.costUSD.toFixed(5)} USD
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 dark:text-zinc-400">Developer Margin:</span>
                        <span className="text-lime-600 dark:text-lime-400 font-semibold">
                          +25% (+${(currentPreset.costUSD * 0.25).toFixed(5)})
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono border-t border-dashed border-slate-200 dark:border-zinc-800 pt-1.5 font-bold">
                        <span className="text-slate-900 dark:text-white">Billed Amount:</span>
                        <span className="text-lime-600 dark:text-lime-400 text-xs">
                          ${billedAmount} USD
                        </span>
                      </div>

                      <div className="pt-1">
                        <VibezReceipt
                          model={
                            runtime === 'custom'
                              ? 'your-model-id'
                              : runtime === 'provider'
                              ? currentTabConfig.modelId
                              : currentTabConfig.modelString
                          }
                          tokens={currentTabConfig.tokens}
                          costUSD={currentTabConfig.costUSD * 1.25}
                          latencyMs={currentTabConfig.latencyMs}
                          variant="pill"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image Output Preview */}
              {activeTab === 'image' && (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-md group">
                    <img
                      src="https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=800&auto=format&fit=crop&q=80"
                      alt="Teddy bear hiking in mountains"
                      className="w-full h-44 object-cover group-hover:scale-105 transition duration-500"
                    />
                    {vibezCheckEnabled && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <VibezReceipt
                          model={
                            runtime === 'custom'
                              ? 'your-model-id'
                              : currentTabConfig.modelString
                          }
                          tokens={1000}
                          costUSD={0.04}
                          variant="pill"
                        />
                      </div>
                    )}
                  </div>
                  {vibezCheckEnabled && (
                    <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-mono flex items-center justify-between">
                      <span className="text-slate-500 dark:text-zinc-400">Fixed Image Fee:</span>
                      <span className="text-lime-600 dark:text-lime-400 font-bold">$0.04000 USD</span>
                    </div>
                  )}
                </div>
              )}

              {/* Speech Output Preview */}
              {activeTab === 'speech' && (
                <div className="bg-white dark:bg-[#18181f] border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center p-1.5 border border-slate-200 dark:border-zinc-700">
                      <LobeIcon name="elevenlabs" size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <span>elevenlabs/multilingual-v2</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-zinc-500">2.4 seconds • 48kHz audio</div>
                    </div>
                  </div>

                  {vibezCheckEnabled && (
                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                      <VibezReceipt
                        model={
                          runtime === 'custom'
                            ? 'your-model-id'
                            : currentTabConfig.modelString
                        }
                        tokens={56}
                        costUSD={0.0035}
                        variant="pill"
                      />
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'transcription' || activeTab === 'video') && (
                <div className="bg-white dark:bg-[#18181f] border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <LobeIcon
                      name={activeTab === 'transcription' ? 'openai' : 'luma-color'}
                      size={16}
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                      {activeTab === 'transcription' ? 'openai/whisper-1' : 'luma/ray-2'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-zinc-300">
                    {activeTab === 'transcription'
                      ? '“Audio stream transcription finalized with 99.4% accuracy.”'
                      : '1080p 60fps neural video rendering complete.'}
                  </p>

                  {vibezCheckEnabled && (
                    <div className="pt-2 border-t border-slate-200 dark:border-zinc-800">
                      <VibezReceipt
                        model={
                          runtime === 'custom'
                            ? 'your-model-id'
                            : currentTabConfig.modelString
                        }
                        tokens={activeTab === 'transcription' ? 240 : 5000}
                        costUSD={activeTab === 'transcription' ? 0.006 : 0.25}
                        variant="pill"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Model & Latency indicator matching currentTabConfig */}
        <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-500">
          <span className="inline-flex items-center gap-1.5 font-mono">
                <LobeIcon
                  name={
                    runtime === 'custom'
                      ? 'lobehub'
                      : runtime === 'gateway'
                      ? 'vercel'
                      : currentTabConfig.iconName
                  }
                  size={14}
                />
                <span>
                  Model:{' '}
                  {runtime === 'custom'
                    ? activeTab === 'image'
                      ? 'yourProvider.image("your-model-id")'
                      : 'yourProvider("your-model-id")'
                    : runtime === 'gateway'
                    ? `"${currentTabConfig.modelString}"`
                    : activeTab === 'image'
                    ? `${currentTabConfig.providerFn}.image("${currentTabConfig.modelId}")`
                    : `${currentTabConfig.providerFn}("${currentTabConfig.modelId}")`}
                </span>
              </span>
              <span className="font-mono text-[10px]">{currentTabConfig.latencyMs}ms latency</span>
            </div>
          </SandboxPreview>
        </SandboxBody>
      </Sandbox>

      {/* ✦ Bottom Link (Matching Screenshot "See all supported LLM models ↗") */}
      <div className="mt-4 flex justify-center">
        <a
          href="https://ai-sdk.dev/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition font-medium"
        >
          <span>See all</span>
          <span className="font-semibold text-slate-800 dark:text-zinc-200 hover:underline">supported LLM models</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
