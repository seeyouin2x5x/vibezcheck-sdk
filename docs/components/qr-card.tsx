'use client';

import React from 'react';
import { QrCode } from 'lucide-react';

export function QrCard() {
  return (
    <div className="fixed bottom-6 right-6 z-30 hidden md:flex flex-col items-center p-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur select-none hover:shadow-xl transition group">
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center p-1.5 border border-slate-200 dark:border-slate-700">
        <QrCode className="w-full h-full text-slate-800 dark:text-slate-200 group-hover:scale-105 transition" />
      </div>
      <span className="mt-1.5 text-[9px] font-medium text-slate-500 dark:text-slate-400 text-center leading-tight">
        Scan to login<br />or signup
      </span>
    </div>
  );
}
