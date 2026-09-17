'use client';

import React from 'react';
import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
          Proposed Monetization Model
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 italic">
          The following prices are initial hypotheses, not fixed pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Free */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Free
            </div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mb-2">
              $0
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mb-4">
              Best for developers evaluating VibezCheck.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <li>· Local metering</li>
              <li>· Model pricing</li>
              <li>· Streaming support</li>
              <li>· Cost calculation</li>
              <li>· Basic SDK</li>
              <li>· No account required</li>
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/docs?section=quickstart"
              className="block w-full py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>

        {/* Pro */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Pro
            </div>
            <div className="text-sm font-semibold text-slate-400 dark:text-zinc-500 mb-1">
              Example:
            </div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mb-4">
              $29<span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/month</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <li>· Cloud cost history</li>
              <li>· Customer attribution</li>
              <li>· Multiple projects</li>
              <li>· Basic budgets</li>
              <li>· Alerts</li>
              <li>· Longer history</li>
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/docs?section=quickstart"
              className="block w-full py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>

        {/* Startup */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-emerald-500 shadow-xs relative">
          <div>
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Startup
            </div>
            <div className="text-sm font-semibold text-slate-400 dark:text-zinc-500 mb-1">
              Example:
            </div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mb-4">
              $99<span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/month</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400 font-medium">
              <li>· Teams</li>
              <li>· Higher event volume</li>
              <li>· Advanced budgets</li>
              <li>· Spend controls</li>
              <li>· Usage analytics</li>
              <li>· Stripe integration</li>
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/docs?section=quickstart"
              className="block w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold text-center transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>

        {/* Growth */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Growth
            </div>
            <div className="text-sm font-semibold text-slate-400 dark:text-zinc-500 mb-1">
              Example:
            </div>
            <div className="text-2xl font-extrabold text-slate-950 dark:text-white mb-4">
              $299+<span className="text-xs font-normal text-slate-400 dark:text-zinc-500">/month</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <li>· Higher event volume</li>
              <li>· Advanced analytics</li>
              <li>· Margin analysis</li>
              <li>· Anomaly detection</li>
              <li>· Priority support</li>
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/docs?section=quickstart"
              className="block w-full py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>

        {/* Enterprise */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
          <div>
            <div className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Enterprise
            </div>
            <div className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
              Custom pricing for:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-400">
              <li>· SSO</li>
              <li>· Advanced security</li>
              <li>· Private deployment where supported</li>
              <li>· Custom retention</li>
              <li>· Data residency requirements</li>
              <li>· SLA</li>
              <li>· Enterprise support</li>
            </ul>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <Link
              href="/docs?section=quickstart"
              className="block w-full py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
