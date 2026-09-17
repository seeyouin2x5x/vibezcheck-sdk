'use client';

import React from 'react';

export function ArchitectureSection() {
  return (
    <section id="architecture" className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Your AI request shouldn&apos;t wait for billing infrastructure.
        </h2>
        <blockquote className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
          Meter locally. Report asynchronously.
        </blockquote>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          Metering should not unnecessarily block the AI request.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visual 1: Application -> AI Provider & VibezCheck meter */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
            Architecture
          </div>
          <pre className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
{`Your application
      |
      +---- AI provider
      |
      +---- VibezCheck meter
                |
                +---- Cost
                +---- Limits
                +---- Usage
                +---- Billing`}
          </pre>
        </div>

        {/* Visual 2: Request -> AI provider & VibezCheck meter -> async reporting */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-200 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-4 pb-2 border-b border-slate-100 dark:border-zinc-800">
            Preferred Behavior
          </div>
          <pre className="text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
{`Request
  ├──→ AI provider
  └──→ VibezCheck meter
             ↓
        usage/cost event
             ↓
        async reporting`}
          </pre>
        </div>
      </div>
    </section>
  );
}
