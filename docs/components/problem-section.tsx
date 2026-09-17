'use client';

import React from 'react';

export function ProblemSection() {
  return (
    <section id="problem" className="w-full max-w-4xl mx-auto px-4 py-24 scroll-mt-20">
      {/* Heading & Central Customer Pain */}
      <div className="max-w-2xl mx-auto text-center mb-14 space-y-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          AI pricing is easy. AI economics aren&apos;t.
        </h2>
        <p className="text-base text-slate-600 dark:text-zinc-400 font-normal">
          &ldquo;I do not know whether my AI product is profitable at scale.&rdquo;
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
          VibezCheck turns low-level provider usage into business-level economics.
        </p>
      </div>

      {/* The Translation Ledger: A unified architectural slab */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121418] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-zinc-800">
          {/* Column 1: What users do */}
          <div className="p-7 space-y-5">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              What users do
            </div>
            <ul className="space-y-3 text-sm text-slate-800 dark:text-zinc-200">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Messages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Documents</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Agents</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Voice</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Images</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Tool calls</span>
              </li>
            </ul>
          </div>

          {/* Column 2: What you pay for */}
          <div className="p-7 space-y-5 bg-slate-50/40 dark:bg-zinc-900/20">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              What you pay for
            </div>
            <ul className="space-y-3 text-sm text-slate-800 dark:text-zinc-200">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Input tokens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Output tokens</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Model</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Context</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Retries</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
                <span>Tool usage</span>
              </li>
            </ul>
          </div>

          {/* Column 3: What the business needs */}
          <div className="p-7 space-y-5">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              What the business needs
            </div>
            <ul className="space-y-3 text-sm text-slate-800 dark:text-zinc-200">
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Cost</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Budget</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Margin</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Revenue</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet bridge conclusion bar */}
        <div className="px-7 py-4 bg-slate-50 dark:bg-zinc-900/60 border-t border-slate-200 dark:border-zinc-800 text-center">
          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
            VibezCheck connects the two.
          </p>
        </div>
      </div>
    </section>
  );
}
