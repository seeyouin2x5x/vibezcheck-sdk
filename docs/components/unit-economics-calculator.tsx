'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export function UnitEconomicsCalculator() {
  const [mau, setMau] = useState<number>(1000);
  const [requestsPerUser, setRequestsPerUser] = useState<number>(50);
  const [avgInputTokens, setAvgInputTokens] = useState<number>(1200);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(300);
  const [model, setModel] = useState<string>('gpt-4o');
  const [customerPrice, setCustomerPrice] = useState<number>(21);

  const modelPricing: Record<string, { name: string; inputPerM: number; outputPerM: number }> = {
    'gpt-4o': { name: 'GPT-4o', inputPerM: 2.50, outputPerM: 10.00 },
    'claude-3-5-sonnet': { name: 'Claude 3.5 Sonnet', inputPerM: 3.00, outputPerM: 15.00 },
    'deepseek-r1': { name: 'DeepSeek R1', inputPerM: 0.55, outputPerM: 2.19 },
    'gemini-1-5-flash': { name: 'Gemini 1.5 Flash', inputPerM: 0.075, outputPerM: 0.30 },
  };

  const results = useMemo(() => {
    const totalRequests = mau * requestsPerUser;
    const totalInput = totalRequests * avgInputTokens;
    const totalOutput = totalRequests * avgOutputTokens;
    const rates = modelPricing[model] ?? modelPricing['gpt-4o'];
    const estimatedAiCost = (totalInput / 1_000_000) * rates.inputPerM + (totalOutput / 1_000_000) * rates.outputPerM;
    const customerRevenue = mau * customerPrice;
    const aiCostRatio = customerRevenue > 0 ? (estimatedAiCost / customerRevenue) * 100 : 0;
    const contribution = customerRevenue - estimatedAiCost;

    return {
      estimatedAiCost,
      customerRevenue,
      aiCostRatio,
      contribution,
    };
  }, [mau, requestsPerUser, avgInputTokens, avgOutputTokens, model, customerPrice]);

  return (
    <section id="calculator" className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Did this AI feature make money?
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400">
          The calculator should answer a business question, not merely perform token arithmetic.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 pb-2 border-b border-slate-100 dark:border-zinc-800">
              Inputs
            </div>

            {/* Monthly active users */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <span>Monthly active users</span>
                <span className="font-mono">{mau.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={mau}
                onChange={(e) => setMau(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* AI requests/user */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <span>AI requests/user</span>
                <span className="font-mono">{requestsPerUser}</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={requestsPerUser}
                onChange={(e) => setRequestsPerUser(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Average input tokens */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <span>Average input tokens</span>
                <span className="font-mono">{avgInputTokens.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={avgInputTokens}
                onChange={(e) => setAvgInputTokens(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Average output tokens */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-zinc-300">
                <span>Average output tokens</span>
                <span className="font-mono">{avgOutputTokens.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Model & Customer price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200"
                >
                  {Object.entries(modelPricing).map(([key, item]) => (
                    <option key={key} value={key}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">Customer price ($/mo)</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={customerPrice}
                  onChange={(e) => setCustomerPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-200 dark:border-zinc-800">
                Outputs
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-baseline border-b border-slate-200/80 dark:border-zinc-800 pb-2">
                  <span className="text-slate-600 dark:text-zinc-400 text-xs">Estimated AI cost</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${results.estimatedAiCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                  </span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/80 dark:border-zinc-800 pb-2">
                  <span className="text-slate-600 dark:text-zinc-400 text-xs">Customer revenue</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${results.customerRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                  </span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-200/80 dark:border-zinc-800 pb-2">
                  <span className="text-slate-600 dark:text-zinc-400 text-xs">AI cost ratio</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {results.aiCostRatio.toFixed(0)}%
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-slate-900 dark:text-white font-bold text-xs">Contribution</span>
                  <span className={`font-extrabold text-base ${results.contribution >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    ${results.contribution.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-zinc-800">
              <Link
                href="/docs?section=quickstart"
                className="w-full block py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-semibold text-xs text-center hover:opacity-90 transition"
              >
                See what your AI economics look like.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
