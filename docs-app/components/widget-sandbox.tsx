'use client';

import React, { useState } from 'react';
import { VibezSessionProvider, VibezSessionWidget, VibezBillingModal } from 'vibezcheck/react';
import { Eye, CreditCard, ShieldAlert } from 'lucide-react';

export const WidgetSandbox: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [modalOpen, setModalOpen] = useState(false);

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
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Test Paywall Modal</span>
          </button>
        </div>
      </div>

      <div className="p-6 relative min-h-[220px] flex items-center justify-center bg-slate-100/50">
        <VibezSessionProvider>
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800">
              Live Session Telemetry Preview
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              Look at the bottom-right corner of this sandbox card to inspect the real-time floating <code className="text-indigo-600 font-mono">&lt;VibezSessionWidget /&gt;</code>!
            </p>
          </div>

          <VibezSessionWidget
            theme={theme}
            position="bottom-right"
          />

          <VibezBillingModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            notice={{
              status: 'limit_reached',
              tokensUsed: 150000,
              costUSD: 5.00,
              message: 'Free credit quota reached ($5.00 limit). Top up now to continue streaming!',
            }}
            theme={theme}
            testMode={true}
            onSuccess={() => {
              alert('Simulated Stripe Top-Up Successful!');
              setModalOpen(false);
            }}
          />
        </VibezSessionProvider>
      </div>
    </div>
  );
};
