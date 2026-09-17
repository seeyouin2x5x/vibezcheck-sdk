'use client';

import React from 'react';

export function ArchetypesSection() {
  return (
    <section id="archetypes" className="w-full max-w-5xl mx-auto px-4 py-20 border-t border-slate-200/80 dark:border-zinc-800/80 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          Customer Examples
        </h2>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
          AI SaaS · AI Agent · Document AI · AI Voice · Developer API
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI SaaS */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs font-mono text-xs text-slate-800 dark:text-zinc-200">
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-white mb-3">
            AI SaaS
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
            <li>Cost per customer</li>
            <li>Margin by plan</li>
            <li>Budget by account</li>
          </ul>
        </div>

        {/* AI Agent */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs font-mono text-xs text-slate-800 dark:text-zinc-200">
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-white mb-3">
            AI Agent
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
            <li>Cost per run</li>
            <li>Model calls</li>
            <li>Tool calls</li>
            <li>Retries</li>
            <li>Total run cost</li>
          </ul>
        </div>

        {/* Document AI */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs font-mono text-xs text-slate-800 dark:text-zinc-200">
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-white mb-3">
            Document AI
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
            <li>Cost/document</li>
            <li>Pages processed</li>
            <li>Customer price</li>
            <li>Contribution/document</li>
          </ul>
        </div>

        {/* AI Voice */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs font-mono text-xs text-slate-800 dark:text-zinc-200">
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-white mb-3">
            AI Voice
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
            <li>Minutes</li>
            <li>Model usage</li>
            <li>Cost/minute</li>
            <li>Customer charge</li>
          </ul>
        </div>

        {/* Developer API */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs font-mono text-xs text-slate-800 dark:text-zinc-200 sm:col-span-2 lg:col-span-2">
          <div className="text-xs font-bold font-sans text-slate-900 dark:text-white mb-3">
            Developer API
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-zinc-400">
            <li>Cost/request</li>
            <li>Customer usage</li>
            <li>Usage pricing</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
