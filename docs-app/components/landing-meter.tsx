'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, ShieldCheck, Zap, Bot, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  provider: string;
  inputPerMillion: number;
  outputPerMillion: number;
  hasReasoning: boolean;
}

const MODELS: ModelOption[] = [
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o-mini', provider: 'OpenAI', inputPerMillion: 0.15, outputPerMillion: 0.60, hasReasoning: false },
  { id: 'anthropic/claude-3-7-sonnet', name: 'Claude 3.7 Sonnet (Hybrid)', provider: 'Anthropic', inputPerMillion: 3.00, outputPerMillion: 15.00, hasReasoning: true },
  { id: 'openai/o3-mini', name: 'o3-mini (High Reasoning)', provider: 'OpenAI', inputPerMillion: 1.10, outputPerMillion: 4.40, hasReasoning: true },
  { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', inputPerMillion: 0.075, outputPerMillion: 0.30, hasReasoning: false },
];

export const LandingMeter: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODELS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [tokens, setTokens] = useState({ input: 32, reasoning: 0, output: 145 });
  const [totalCost, setTotalCost] = useState(0.000091);
  const [needleAngle, setNeedleAngle] = useState(35);
  const [completed, setCompleted] = useState(false);

  const simulateRun = () => {
    setIsSimulating(true);
    setCompleted(false);

    // Randomize token counts
    const inputTokens = Math.floor(Math.random() * 40) + 25;
    const reasoningTokens = selectedModel.hasReasoning ? Math.floor(Math.random() * 200) + 120 : 0;
    const outputTokens = Math.floor(Math.random() * 180) + 90;

    let currentInput = 0;
    let currentReasoning = 0;
    let currentOutput = 0;

    const interval = setInterval(() => {
      let done = true;

      if (currentInput < inputTokens) {
        currentInput = Math.min(currentInput + 5, inputTokens);
        done = false;
      }
      if (currentReasoning < reasoningTokens) {
        currentReasoning = Math.min(currentReasoning + 15, reasoningTokens);
        done = false;
      }
      if (currentOutput < outputTokens) {
        currentOutput = Math.min(currentOutput + 12, outputTokens);
        done = false;
      }

      setTokens({ input: currentInput, reasoning: currentReasoning, output: currentOutput });

      // Calculate cost
      const totalTokensCount = currentInput + currentReasoning + currentOutput;
      const cost =
        (currentInput * selectedModel.inputPerMillion +
          (currentReasoning + currentOutput) * selectedModel.outputPerMillion) /
        1_000_000;
      setTotalCost(cost);

      // Meter needle dynamic angle (0 to 140 deg)
      const ratio = Math.min(totalTokensCount / 400, 1);
      setNeedleAngle(20 + ratio * 120);

      if (done) {
        clearInterval(interval);
        setIsSimulating(false);
        setCompleted(true);
      }
    }, 40);
  };

  useEffect(() => {
    simulateRun();
  }, [selectedModel]);

  return (
    <div className="w-full rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-cream-50/50 to-cream-100/40 p-6 sm:p-8 shadow-xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-lime-400 border border-slate-900 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Live AI Smart Meter
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
            See the digital meter spin in real time
          </h3>
        </div>

        {/* Model Selector Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedModel.id === model.id
                  ? 'bg-stripe-dark text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Meter Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
        {/* Left: Digital Speedometer Meter Visual */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
          {/* Subtle electric lime ambient glow */}
          <div className="absolute -top-10 -right-10 h-36 w-36 bg-lime-300/30 rounded-full blur-2xl pointer-events-none" />

          {/* Speedometer Arc / Gauge */}
          <div className="relative w-48 h-28 flex items-end justify-center">
            {/* Gauge Background Track */}
            <div className="absolute inset-0 rounded-t-full border-[10px] border-slate-100 border-b-0" />
            {/* Gauge Active Fill */}
            <div
              className="absolute inset-0 rounded-t-full border-[10px] border-lime-400 border-b-0 transition-all duration-150"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            />

            {/* Gauge Needle */}
            <div
              className="absolute bottom-0 left-1/2 h-20 w-1.5 bg-slate-950 origin-bottom transform -translate-x-1/2 rounded-full transition-transform duration-200"
              style={{ transform: `translateX(-50%) rotate(${needleAngle - 80}deg)` }}
            >
              <div className="h-3 w-3 rounded-full bg-stripe-indigo absolute -top-1.5 -left-[3px] shadow-sm" />
            </div>

            {/* Pivot Center Hub */}
            <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center z-10 border-2 border-white shadow-sm">
              <Zap className="h-3 w-3 text-lime-400" />
            </div>
          </div>

          {/* Live Meter Readout */}
          <div className="mt-4 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-mono">
              ${totalCost.toFixed(6)}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Exact Call Cost • Calculated in 0.00ms
            </span>
          </div>

          {/* Simulate Action Button */}
          <button
            onClick={simulateRun}
            disabled={isSimulating}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-stripe-indigo text-white text-xs font-bold transition shadow-md disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Measuring Tokens...' : 'Prompt AI & Spin Meter'}</span>
          </button>
        </div>

        {/* Right: Breakdown & Stripe Ticket */}
        <div className="lg:col-span-6 space-y-4">
          {/* Token Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Input</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {tokens.input}
              </div>
              <span className="text-[10px] text-slate-500">Prompt words</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs relative">
              <span className="text-[10px] font-bold text-stripe-indigo uppercase flex items-center gap-1">
                <span>Reasoning</span>
                {selectedModel.hasReasoning && (
                  <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                )}
              </span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {tokens.reasoning}
              </div>
              <span className="text-[10px] text-slate-500">Hidden thoughts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Output</span>
              <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                {tokens.output}
              </div>
              <span className="text-[10px] text-slate-500">AI answer</span>
            </div>
          </div>

          {/* Stripe Telemetry Event Box */}
          <div className="p-4 rounded-2xl bg-[#090a0f] border border-slate-800 text-slate-200 text-xs font-mono space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-semibold">Stripe Meter Event</span>
              </div>
              <span className="text-emerald-400 font-bold">200 OK • 0ms</span>
            </div>

            <div className="text-slate-300 space-y-1 text-[11px] leading-relaxed">
              <div>
                <span className="text-slate-500">customer:</span>{' '}
                <span className="text-sky-300">"alex@company.com"</span>
              </div>
              <div>
                <span className="text-slate-500">model:</span>{' '}
                <span className="text-emerald-300">"{selectedModel.id}"</span>
              </div>
              <div>
                <span className="text-slate-500">tokens:</span>{' '}
                <span className="text-amber-300">{tokens.input + tokens.reasoning + tokens.output}</span>{' '}
                <span className="text-slate-500">({tokens.reasoning} reasoning)</span>
              </div>
              <div>
                <span className="text-slate-500">billed_usd:</span>{' '}
                <span className="text-lime-400 font-bold">${totalCost.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Outcome Guarantee */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-lime-100/60 p-3 rounded-xl border border-lime-300/80">
            <ShieldCheck className="h-4 w-4 text-slate-900 shrink-0" />
            <span>
              <strong>Bank Account Safe:</strong> If a runaway prompt exceeds your budget ceiling, VibezCheck halts the stream automatically.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
