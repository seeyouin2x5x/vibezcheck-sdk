'use client';

import React, { useState } from 'react';

export interface VibezBillingNotice {
  status?: 'requires_payment' | 'limit_reached' | 'upgrade_required';
  customerId?: string;
  customerEmail?: string;
  checkoutUrl?: string;
  tokensUsed?: number;
  costUSD?: number;
  message?: string;
}

export interface VibezBillingModalProps {
  notice?: VibezBillingNotice | null;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  theme?: 'light' | 'dark';
  testMode?: boolean;
}

// Inline pure SVG Icons to ensure zero external runtime dependencies
const CreditCardIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
    <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ZapIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
    <polyline points="12 5 19 12 12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Intuitive React Modal for Stripe Top-Up, Card Registration & Paywall
 */
export const VibezBillingModal: React.FC<VibezBillingModalProps> = ({
  notice,
  isOpen: explicitIsOpen,
  onClose,
  onSuccess,
  theme = 'light',
  testMode = true,
}) => {
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('starter');

  const isVisible = explicitIsOpen !== undefined ? explicitIsOpen : Boolean(notice);

  if (!isVisible) return null;

  const handleSimulatePayment = async () => {
    setLoading(true);
    if (notice?.checkoutUrl) {
      window.location.href = notice.checkoutUrl;
      return;
    }

    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccessState(true);

    setTimeout(() => {
      setSuccessState(false);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    }, 1500);
  };

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border transition-all overflow-hidden ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}
      >
        {/* Top Accent Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <CloseIcon />
          </button>
        )}

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <CreditCardIcon />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-tight">
                  {notice?.status === 'limit_reached' ? 'Token Limit Reached' : 'Add Billing Credits'}
                </h3>
                {testMode && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Stripe Sandbox
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {notice?.message || 'Top up your account to continue streaming AI tokens.'}
              </p>
            </div>
          </div>

          {/* Usage Metrics Banner */}
          {(notice?.tokensUsed || notice?.costUSD) && (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800 border-slate-700'
              }`}
            >
              <div>
                <span className="text-slate-400">Tokens Metered:</span>{' '}
                <strong className="text-slate-800 font-semibold">
                  {notice.tokensUsed?.toLocaleString() || 0}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Cost:</span>{' '}
                <strong className="text-indigo-600 font-semibold">
                  ${notice.costUSD?.toFixed(4) || '0.0000'} USD
                </strong>
              </div>
            </div>
          )}

          {/* Tier Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Select Top-Up Option
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlan('starter')}
                className={`p-3 rounded-xl border text-left transition relative ${
                  selectedPlan === 'starter'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : isLight
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-slate-800 bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">$5.00 Top-Up</div>
                <div className="text-[11px] text-slate-500 mt-0.5">500k AI Tokens</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan('pro')}
                className={`p-3 rounded-xl border text-left transition relative ${
                  selectedPlan === 'pro'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : isLight
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-slate-800 bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">$20.00 Pro</div>
                <div className="text-[11px] text-slate-500 mt-0.5">2.5M AI Tokens</div>
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={loading || successState}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition"
          >
            {loading ? (
              <span>Processing Stripe Sandbox Checkout...</span>
            ) : successState ? (
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckIcon /> Credits Added Successfully!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Checkout with Stripe</span>
                <ArrowRightIcon />
              </span>
            )}
          </button>

          {/* Footer Security Badges */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <ShieldCheckIcon />
              <span>Stripe v2 Meter Events</span>
            </div>
            <div className="flex items-center gap-1">
              <ZapIcon />
              <span>Zero Latency Telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
