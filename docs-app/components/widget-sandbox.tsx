'use client';

import React, { useState } from 'react';
import { Eye, CreditCard, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';

export const WidgetSandbox: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);
  const [tokens, setTokens] = useState(1450);
  const [cost, setCost] = useState(0.0042);
  const [turns, setTurns] = useState(3);

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50 text-xs">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <Eye className="h-4 w-4 text-slate-500" />
          <span>Interactive Component Sandbox</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition"
          >
            Theme: <span className="font-semibold">{theme}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Test Paywall Modal</span>
          </button>
        </div>
      </div>

      <div className="p-6 relative min-h-[260px] flex flex-col items-center justify-center bg-slate-100/50">
        <div className="text-center space-y-2 mb-4">
          <p className="text-sm font-semibold text-slate-800">
            Live Session Telemetry Preview
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Look at the floating card below to inspect the real-time <code className="text-indigo-600 font-mono">&lt;VibezSessionWidget /&gt;</code>!
          </p>
        </div>

        {/* Floating Preview Widget (Clean Theme) */}
        <div
          className={`rounded-2xl border p-4 shadow-lg transition duration-200 max-w-xs w-full ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                ⚡
              </div>
              <span className="text-xs font-bold tracking-tight">Active Session</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
              {turns} turns
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
              <div className="text-[10px] text-slate-400 font-medium">Session Cost</div>
              <div className="font-mono font-bold text-sm text-emerald-500 mt-0.5">
                ${cost.toFixed(4)}
              </div>
            </div>

            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
              <div className="text-[10px] text-slate-400 font-medium">Tokens Used</div>
              <div className="font-mono font-bold text-sm mt-0.5">
                {tokens.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Paywall Top-Up Modal Preview */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm">
                    💳
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Credit Quota Reached</h4>
                    <p className="text-[11px] text-slate-400">Free inference limit reached ($5.00 limit)</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-800 dark:text-amber-300">
                You have used <strong>150,000 tokens ($5.00 USD)</strong>. Select a top-up credit pack to continue streaming.
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    alert('Simulated Stripe Top-Up: $5.00 Starter Pack added!');
                    setModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-xs font-semibold text-indigo-900 transition"
                >
                  <span>$5.00 Starter (500k Tokens)</span>
                  <span className="text-indigo-600 font-mono">1-Click Top-Up →</span>
                </button>

                <button
                  onClick={() => {
                    alert('Simulated Stripe Top-Up: $20.00 Pro Pack added!');
                    setModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition"
                >
                  <span>$20.00 Pro (2.5M Tokens)</span>
                  <span className="text-slate-600 font-mono">1-Click Top-Up →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
