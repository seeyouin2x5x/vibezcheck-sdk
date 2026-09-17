'use client';

import React from 'react';

export function DefinitionSection() {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          What VibezCheck Is — and Is Not
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
        {/* VibezCheck is */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pb-2 border-b border-emerald-500/20">
            VibezCheck is
          </div>
          <ul className="space-y-3 text-sm text-slate-900 dark:text-zinc-100 font-medium">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>An AI usage metering layer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>A request-level cost calculator.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>A customer/feature cost attribution layer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>A spend-control layer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>A usage-billing bridge.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>A developer-first NPM SDK.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold select-none">✓</span>
              <span>Eventually, AI unit-economics infrastructure.</span>
            </li>
          </ul>
        </div>

        {/* VibezCheck is not primarily */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 pb-2 border-b border-slate-200 dark:border-zinc-800">
            VibezCheck is not primarily
          </div>
          <ul className="space-y-3 text-sm text-slate-500 dark:text-zinc-400">
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A generic LLM observability dashboard.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A token counter.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A logging platform.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A prompt database.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A Stripe wrapper.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A model router.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-slate-300 dark:text-zinc-600 select-none">–</span>
              <span>A generic AI monitoring product.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
