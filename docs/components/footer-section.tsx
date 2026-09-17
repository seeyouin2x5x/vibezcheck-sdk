'use client';

import React from 'react';
import Link from 'next/link';

export function FooterSection() {
  return (
    <div className="w-full">
      {/* 44. Final CTA */}
      <section id="install" className="w-full max-w-5xl mx-auto px-4 py-20 scroll-mt-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center border border-zinc-800 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ship AI without guessing the bill.
          </h2>
          <div className="flex justify-center pt-2">
            <Link
              href="/docs?section=quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition"
            >
              Start measuring →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-zinc-800/80 py-12 text-xs text-slate-500 dark:text-zinc-500">
        <div className="max-w-5xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              VibezCheck
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-zinc-400">
              <a href="#demo" className="hover:text-slate-950 dark:hover:text-white transition">Product</a>
              <Link href="/docs" className="hover:text-slate-950 dark:hover:text-white transition">Docs</Link>
              <Link href="/docs?section=tutorial" className="hover:text-slate-950 dark:hover:text-white transition">Examples</Link>
              <Link href="/releases" className="hover:text-slate-950 dark:hover:text-white transition">Changelog</Link>
              <a href="mailto:yt@vibezcheck.app" className="hover:text-slate-950 dark:hover:text-white transition">yt@vibezcheck.app</a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-zinc-500">
            <div>
              VibezCheck is the cost and usage layer for AI products.
            </div>
            <div className="font-medium">
              Know what your AI users cost you. · Make AI economics predictable.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
