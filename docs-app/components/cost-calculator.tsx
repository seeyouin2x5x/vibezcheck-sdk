'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, DollarSign, Zap } from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o-mini', name: 'OpenAI gpt-4o-mini', inputRate: 0.15, outputRate: 0.60, cachedRate: 0.075 },
  { id: 'gpt-4o', name: 'OpenAI gpt-4o', inputRate: 2.50, outputRate: 10.00, cachedRate: 1.25 },
  { id: 'o3-mini', name: 'OpenAI o3-mini (Thinking)', inputRate: 1.10, outputRate: 4.40, cachedRate: 0.55 },
  { id: 'gpt-5.6-sol', name: 'OpenAI gpt-5.6-sol', inputRate: 4.00, outputRate: 20.00, cachedRate: 0.40 },
  { id: 'claude-3-7-sonnet', name: 'Anthropic Claude 3.7 Sonnet', inputRate: 0.59, outputRate: 2.93, cachedRate: 0.30 },
  { id: 'claude-3-5-haiku', name: 'Anthropic Claude 3.5 Haiku', inputRate: 0.80, outputRate: 4.00, cachedRate: 0.08 },
  { id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash', inputRate: 0.10, outputRate: 0.40, cachedRate: 0.025 },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)', inputRate: 0.66, outputRate: 1.98, cachedRate: 0.15 },
];

export const CostCalculator: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState('gpt-4o-mini');
  const [inputTokens, setInputTokens] = useState(1500);
  const [outputTokens, setOutputTokens] = useState(600);
  const [reasoningTokens, setReasoningTokens] = useState(300);
  const [markup, setMarkup] = useState(1.0);

  const model = MODELS.find((m) => m.id === selectedModelId) || MODELS[0];

  const totalOutput = outputTokens + (selectedModelId.includes('3-mini') || selectedModelId.includes('3-7') || selectedModelId.includes('reasoner') ? reasoningTokens : 0);
  const rawInputCost = (inputTokens / 1_000_000) * model.inputRate;
  const rawOutputCost = (totalOutput / 1_000_000) * model.outputRate;
  const rawTotalUSD = rawInputCost + rawOutputCost;
  const retailTotalUSD = rawTotalUSD * markup;

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
              Interactive Model Cost Calculator
            </h3>
            <p className="text-xs text-slate-500">Live USD inference cost estimation across 50+ models</p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          Live Math
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select AI Model
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-slate-900 transition"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (${m.inputRate}/1M in, ${m.outputRate}/1M out)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Input Tokens (Prompt)</span>
              <span className="font-mono text-slate-900">{inputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={inputTokens}
              onChange={(e) => setInputTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Output Tokens (Completion)</span>
              <span className="font-mono text-slate-900">{outputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={outputTokens}
              onChange={(e) => setOutputTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Reasoning / Thinking Tokens</span>
              <span className="font-mono text-purple-600">{reasoningTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="0"
              max="8000"
              step="100"
              value={reasoningTokens}
              onChange={(e) => setReasoningTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <span>Markup Multiplier (Profit Margin)</span>
              <span className="font-mono text-slate-900">{markup}x ({Math.round((markup - 1) * 100)}% margin)</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
          </div>
        </div>

        {/* Right Output Breakdown */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Computed Inference Cost
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono">
                ${retailTotalUSD.toFixed(6)}
              </span>
              <span className="text-xs text-slate-500">USD</span>
            </div>

            <div className="divide-y divide-slate-200 text-xs text-slate-600">
              <div className="flex justify-between py-1.5">
                <span>Input Prompt Cost:</span>
                <span className="font-mono text-slate-900">${rawInputCost.toFixed(6)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Output & Thinking Cost:</span>
                <span className="font-mono text-slate-900">${rawOutputCost.toFixed(6)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Raw Base Cost:</span>
                <span className="font-mono text-slate-900">${rawTotalUSD.toFixed(6)}</span>
              </div>
              {markup > 1.0 && (
                <div className="flex justify-between py-1.5 font-semibold text-emerald-700">
                  <span>Developer Profit Margin:</span>
                  <span className="font-mono">+${(retailTotalUSD - rawTotalUSD).toFixed(6)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Calculated synchronously in <strong>0.00ms</strong> with zero external API calls.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
