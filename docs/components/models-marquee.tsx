'use client';

import React from 'react';
import { LobeIcon } from './lobe-icon';

export interface ModelMarqueeItem {
  id: string;
  name: string;
  provider: string;
  icon: string;
  rate?: string;
  category?: string;
}

const ROW_1_MODELS: ModelMarqueeItem[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', icon: 'openai', rate: '$2.50/1M' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: 'claude-color', rate: '$3.00/1M' },
  { id: 'gemini-1-5-pro', name: 'Gemini 1.5 Pro', provider: 'Google DeepMind', icon: 'gemini-color', rate: '$3.50/1M' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', provider: 'DeepSeek', icon: 'deepseek-color', rate: '$0.55/1M' },
  { id: 'grok-2', name: 'Grok 2 Beta', provider: 'xAI', icon: 'grok', rate: '$2.00/1M' },
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B', provider: 'Meta', icon: 'meta-color', rate: '$0.35/1M' },
  { id: 'mistral-large-2', name: 'Mistral Large 2', provider: 'Mistral AI', icon: 'mistral-color', rate: '$2.00/1M' },
  { id: 'o1', name: 'OpenAI o1', provider: 'OpenAI', icon: 'openai', rate: '$15.00/1M' },
  { id: 'qwen-2-5-72b', name: 'Qwen 2.5 72B', provider: 'Alibaba Cloud', icon: 'qwen-color', rate: '$0.40/1M' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere', icon: 'cohere-color', rate: '$2.50/1M' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', icon: 'claude-color', rate: '$0.80/1M' },
  { id: 'gemini-1-5-flash', name: 'Gemini 1.5 Flash', provider: 'Google DeepMind', icon: 'gemini-color', rate: '$0.075/1M' },
  { id: 'kimi-moonshot', name: 'Kimi Moonshot', provider: 'Moonshot AI', icon: 'kimi-color', rate: '$1.00/1M' },
  { id: 'minimax-01', name: 'MiniMax-01', provider: 'MiniMax', icon: 'minimax-color', rate: '$0.20/1M' },
];

const ROW_2_PROVIDERS: ModelMarqueeItem[] = [
  { id: 'groq', name: 'Groq LPU', provider: 'Inference Engine', icon: 'groq', rate: '500 tok/s' },
  { id: 'bedrock', name: 'AWS Bedrock', provider: 'Amazon Web Services', icon: 'bedrock-color', rate: 'Cloud Host' },
  { id: 'azureai', name: 'Azure OpenAI', provider: 'Microsoft Azure', icon: 'azureai-color', rate: 'Enterprise' },
  { id: 'cerebras', name: 'Cerebras Fast', provider: 'Wafer-Scale AI', icon: 'cerebras-color', rate: '1,800 tok/s' },
  { id: 'perplexity', name: 'Sonar Online', provider: 'Perplexity AI', icon: 'perplexity-color', rate: 'Live Search' },
  { id: 'together', name: 'Together AI', provider: 'Inference Host', icon: 'together-color', rate: 'Serverless' },
  { id: 'fireworks', name: 'Fireworks AI', provider: 'Inference Host', icon: 'fireworks-color', rate: 'Fast Spec' },
  { id: 'deepinfra', name: 'DeepInfra', provider: 'Pay-per-token', icon: 'deepinfra-color', rate: 'Microtasks' },
  { id: 'huggingface', name: 'Hugging Face', provider: 'Endpoints / TGI', icon: 'huggingface-color', rate: 'Open Source' },
  { id: 'flux', name: 'FLUX.1 Pro', provider: 'Black Forest Labs', icon: 'flux', rate: 'Image Gen' },
  { id: 'elevenlabs', name: 'ElevenLabs v2.5', provider: 'Audio & Speech', icon: 'elevenlabs', rate: 'Audio AI' },
  { id: 'dalle', name: 'DALL-E 3 HD', provider: 'OpenAI Multimodal', icon: 'dalle-color', rate: 'Image Gen' },
  { id: 'openrouter', name: 'OpenRouter', provider: 'Unified Gateway', icon: 'openrouter-color', rate: '700+ Rates' },
  { id: 'ollama', name: 'Ollama Local', provider: 'Local Runtime', icon: 'ollama', rate: 'Local Host' },
];

export interface ModelsMarqueeProps {
  onSelectModelName?: (modelName: string) => void;
  className?: string;
}

export function ModelsMarquee({ onSelectModelName, className = '' }: ModelsMarqueeProps) {
  return (
    <div className={`w-full overflow-hidden relative py-3 select-none ${className}`}>
      {/* Marquee Container with Left and Right Gradient Fade Edges */}
      <div className="relative w-full space-y-2.5">
        {/* Left Fade Gradient Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#f8fafc] dark:from-[#090d16] to-transparent z-10" />

        {/* Right Fade Gradient Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#f8fafc] dark:from-[#090d16] to-transparent z-10" />

        {/* ✦ Row 1: Frontier Models & Providers (Moving naturally from right) */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-left flex items-center gap-6 sm:gap-8">
            {/* First sequence */}
            {ROW_1_MODELS.map((item) => (
              <button
                key={`row1-a-${item.id}`}
                type="button"
                onClick={() => onSelectModelName?.(item.name)}
                className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer shrink-0 text-left select-none"
                title={`Select ${item.name} (${item.provider})`}
              >
                <LobeIcon name={item.icon} size={22} alt={item.name} className="shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-medium text-xs text-slate-700 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  · {item.provider}
                </span>
              </button>
            ))}

            {/* Seamless Duplicate Sequence for Infinite Loop */}
            {ROW_1_MODELS.map((item) => (
              <button
                key={`row1-b-${item.id}`}
                type="button"
                onClick={() => onSelectModelName?.(item.name)}
                className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer shrink-0 text-left select-none"
                title={`Select ${item.name} (${item.provider})`}
              >
                <LobeIcon name={item.icon} size={22} alt={item.name} className="shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-medium text-xs text-slate-700 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  · {item.provider}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ✦ Row 2: Inference Engines, Cloud Hosts & Multimodal Models */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right flex items-center gap-6 sm:gap-8">
            {/* First sequence */}
            {ROW_2_PROVIDERS.map((item) => (
              <button
                key={`row2-a-${item.id}`}
                type="button"
                onClick={() => onSelectModelName?.(item.name)}
                className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer shrink-0 text-left select-none"
                title={`Select ${item.name} (${item.provider})`}
              >
                <LobeIcon name={item.icon} size={22} alt={item.name} className="shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-medium text-xs text-slate-700 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  · {item.provider}
                </span>
              </button>
            ))}

            {/* Seamless Duplicate Sequence for Infinite Loop */}
            {ROW_2_PROVIDERS.map((item) => (
              <button
                key={`row2-b-${item.id}`}
                type="button"
                onClick={() => onSelectModelName?.(item.name)}
                className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 transition cursor-pointer shrink-0 text-left select-none"
                title={`Select ${item.name} (${item.provider})`}
              >
                <LobeIcon name={item.icon} size={22} alt={item.name} className="shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-medium text-xs text-slate-700 dark:text-zinc-300 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
                  {item.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono whitespace-nowrap">
                  · {item.provider}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
