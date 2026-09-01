'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showBadge = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Hand-drawn Sparkle Icon with Electric Lime Pill */}
      <div className="relative flex items-center justify-center">
        <div className="h-8 w-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs group-hover:bg-stripe-dark transition duration-200 relative overflow-hidden">
          {/* Subtle lime glow */}
          <div className="absolute inset-0 bg-lime-400/20 opacity-0 group-hover:opacity-100 transition duration-300" />
          
          {/* Hand-drawn whimsical Sparkle SVG */}
          <svg
            className="h-4 w-4 text-lime-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            <circle cx="12" cy="12" r="3" fill="#D4FF32" stroke="#0B0C10" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-extrabold text-base tracking-tight text-slate-950 font-sans">
          vibezcheck
        </span>

        {showBadge && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-lime-100 text-slate-950 border border-lime-300">
            v0.3.0
          </span>
        )}
      </div>
    </div>
  );
};
