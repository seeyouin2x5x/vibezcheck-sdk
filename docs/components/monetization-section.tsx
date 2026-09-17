'use client';

import React from 'react';

export function MonetizationSection() {
  return (
    <section id="monetization" className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-zinc-50">
          Turn AI usage into revenue.
        </h2>
        <blockquote className="text-base text-slate-700 dark:text-zinc-300 font-medium">
          VibezCheck is not the billing system. It makes AI usage billable.
        </blockquote>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Stripe is a monetization integration, not the definition of the company.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121418] overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-zinc-800">
          {/* Flow visual (Left 5 cols) */}
          <div className="md:col-span-5 p-7 space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              Billing flow
            </div>
            <div className="font-mono text-xs text-slate-700 dark:text-zinc-300 leading-relaxed py-2">
              <pre className="font-mono text-xs">
{`AI request
    ↓
VibezCheck
    ↓
Usage event
    ↓
Pricing rule
    ↓
Stripe meter / billing
    ↓
Customer invoice`}
              </pre>
            </div>
          </div>

          {/* Potential billing models (Right 7 cols) */}
          <div className="md:col-span-7 p-7 space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
              Potential billing models
            </div>
            <div className="space-y-4 text-xs">
              <div className="pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                <div className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-0.5">Usage-based</div>
                <div className="text-slate-600 dark:text-zinc-400">Charge per AI action.</div>
              </div>
              <div className="pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                <div className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-0.5">Token-based</div>
                <div className="text-slate-600 dark:text-zinc-400">Charge by measured token usage.</div>
              </div>
              <div className="pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                <div className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-0.5">Credits</div>
                <div className="text-slate-600 dark:text-zinc-400">Customer purchases AI credits.</div>
              </div>
              <div className="pb-3 border-b border-slate-100 dark:border-zinc-800/60">
                <div className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-0.5">Subscription + usage</div>
                <div className="text-slate-600 dark:text-zinc-400">Base subscription plus AI consumption.</div>
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-zinc-100 mb-0.5">Prepaid wallet</div>
                <div className="text-slate-600 dark:text-zinc-400">Consumption decrements a customer balance.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
