'use client';

import React from 'react';

export function PrimitivesSection() {
  return (
    <section id="primitives" className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Meter · Protect · Bill
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Three core product primitives
        </p>
      </div>

      {/* Unified Triptych Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121418] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:border-zinc-800 dark:divide-zinc-800">
          {/* Meter */}
          <div className="p-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
                Meter
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-3 mb-2 leading-snug">
                Know exactly what every AI request costs.
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">
                Real-time usage and cost measurement. Measure AI consumption at request level.
              </p>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mb-2">
                Track, where available:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                <li>· Input tokens</li>
                <li>· Output tokens</li>
                <li>· Total tokens</li>
                <li>· Cached tokens</li>
                <li>· Reasoning tokens / provider-specific usage</li>
                <li>· Model & Provider</li>
                <li>· Request ID</li>
                <li>· User/customer & Feature</li>
                <li>· Session & Organization/project</li>
                <li>· Latency & Streaming usage</li>
                <li>· Calculated cost</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
              &ldquo;Know exactly what every AI request costs.&rdquo;
            </div>
          </div>

          {/* Protect */}
          <div className="p-7 flex flex-col justify-between space-y-6 bg-slate-50/30 dark:bg-zinc-900/10">
            <div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
                Protect
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-3 mb-2 leading-snug">
                Keep AI spend under control.
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">
                Budgets, alerts, limits, and fallbacks. Prevent uncontrolled AI spending.
              </p>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mb-2">
                Support:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                <li>· Per-user limits</li>
                <li>· Per-customer limits</li>
                <li>· Project limits</li>
                <li>· Daily budgets</li>
                <li>· Monthly budgets</li>
                <li>· Token limits</li>
                <li>· Request limits</li>
                <li>· Spend alerts</li>
                <li>· Hard stops</li>
                <li>· Fallback behavior</li>
                <li>· Model restrictions</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
              &ldquo;Never let one user or feature turn into an uncontrolled AI bill.&rdquo;
            </div>
          </div>

          {/* Bill */}
          <div className="p-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
                Bill
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-50 mt-3 mb-2 leading-snug">
                Turn AI consumption into revenue.
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mb-5 leading-relaxed">
                Map usage to pricing and send billable usage to Stripe or another billing system.
              </p>
              <div className="text-[11px] font-semibold text-slate-400 dark:text-zinc-500 mb-2">
                Possible billable units:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-zinc-300">
                <li>· AI request</li>
                <li>· Token</li>
                <li>· Agent run</li>
                <li>· Document</li>
                <li>· Image</li>
                <li>· Voice minute</li>
                <li>· Tool call</li>
                <li>· Custom application unit</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-indigo-700 dark:text-indigo-400 font-medium">
              &ldquo;Turn AI consumption into usage-based revenue.&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
