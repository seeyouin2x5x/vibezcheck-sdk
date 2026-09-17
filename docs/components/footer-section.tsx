'use client';

import React from 'react';
import Link from 'next/link';

export function FooterSection() {
  return (
    <div className="w-full">
      {/* Spec Section 43: Recommended Homepage Final CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 py-20 scroll-mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 dark:bg-zinc-900/90 text-white text-center border border-slate-800 dark:border-zinc-800 shadow-2xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Know the cost before it becomes the bill.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 dark:text-zinc-400 max-w-lg mx-auto">
            Add AI cost metering to the stack you already use.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs?section=quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition shadow-xs"
            >
              Get started with VibezCheck →
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 dark:bg-zinc-800 text-white font-medium text-sm hover:bg-slate-700 dark:hover:bg-zinc-700 border border-slate-700 dark:border-zinc-700 transition"
            >
              Read the docs →
            </Link>
          </div>
        </div>
      </section>

      {/* Spec Section 42: Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-zinc-800/80 py-16 text-xs text-slate-500 dark:text-zinc-500 bg-slate-50/50 dark:bg-[#08090c]/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-950 dark:text-white">
                <svg
                  className="w-4 h-4 fill-current text-emerald-500"
                  viewBox="0 0 76 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span>VibezCheck</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                The cost layer for AI applications.
              </p>
              <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 pt-2">
                © 2026 VibezCheck · MIT License
              </div>
              <div>
                <a
                  href="mailto:yt@vibezcheck.app"
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  yt@vibezcheck.app
                </a>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-2.5">
              <div className="font-semibold text-slate-900 dark:text-zinc-200 text-xs">Product</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/ai-cost-monitoring" className="hover:text-slate-950 dark:hover:text-white transition">
                    AI Cost Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/ai-usage-metering" className="hover:text-slate-950 dark:hover:text-white transition">
                    AI Usage Metering
                  </Link>
                </li>
                <li>
                  <Link href="/ai-agent-cost" className="hover:text-slate-950 dark:hover:text-white transition">
                    AI Agent Costs
                  </Link>
                </li>
                <li>
                  <Link href="/ai-usage-based-billing" className="hover:text-slate-950 dark:hover:text-white transition">
                    Usage-Based Billing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Developers */}
            <div className="space-y-2.5">
              <div className="font-semibold text-slate-900 dark:text-zinc-200 text-xs">Developers</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/docs" className="hover:text-slate-950 dark:hover:text-white transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs?section=quickstart" className="hover:text-slate-950 dark:hover:text-white transition">
                    Quickstart
                  </Link>
                </li>
                <li>
                  <a href="/#demo" className="hover:text-slate-950 dark:hover:text-white transition">
                    700+ Models Sandbox
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.npmjs.com/package/vibezcheck"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-950 dark:hover:text-white transition"
                  >
                    npm Package ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-950 dark:hover:text-white transition"
                  >
                    GitHub ↗
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-2.5">
              <div className="font-semibold text-slate-900 dark:text-zinc-200 text-xs">Resources</div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/llm-cost-calculator" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                    LLM Cost Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/docs?section=tutorial" className="hover:text-slate-950 dark:hover:text-white transition">
                    Guides & Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/releases" className="hover:text-slate-950 dark:hover:text-white transition">
                    Changelog
                  </Link>
                </li>
                <li>
                  <a href="/llms.txt" className="font-mono text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                    llms.txt
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-zinc-500">
            <div>
              Know what every AI request costs. The cost layer for AI applications.
            </div>
            <div>
              Local in-process metering · No proxy hop · Offline pricing catalog
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
