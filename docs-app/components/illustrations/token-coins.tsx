'use client';

import React from 'react';

export const TokenCoinsIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[180px] flex items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 240 180"
        className="w-full h-auto max-w-[220px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floating Percentage Badge */}
        <g transform="translate(140, 20)">
          <path d="M0 15 L20 0 L15 12 Z" fill="#D4FF32" stroke="#090A0F" strokeWidth="1.5" />
          <text x="10" y="25" fontFamily="monospace" fontSize="24" fontWeight="bold" fill="#090A0F">
            %
          </text>
        </g>

        {/* Hand-Drawn Coin Stack (from user illustration) */}
        <g stroke="#090A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Coin 1: Topmost */}
          <ellipse cx="85" cy="55" rx="32" ry="12" fill="#FAF8F5" />
          {/* Coin 1 Side */}
          <path d="M53 55 v8 c0 6.6 14.3 12 32 12 s32 -5.4 32 -12 v-8" fill="#FAF8F5" />

          {/* Coin 2 */}
          <path d="M53 67 v8 c0 6.6 14.3 12 32 12 s32 -5.4 32 -12 v-8" fill="#F4EFE6" />

          {/* Coin 3 */}
          <path d="M53 79 v8 c0 6.6 14.3 12 32 12 s32 -5.4 32 -12 v-8" fill="#FAF8F5" />

          {/* Coin 4 */}
          <path d="M53 91 v8 c0 6.6 14.3 12 32 12 s32 -5.4 32 -12 v-8" fill="#F4EFE6" />

          {/* Coin 5: Base */}
          <path d="M53 103 v10 c0 6.6 14.3 12 32 12 s32 -5.4 32 -12 v-10" fill="#D4FF32" />
        </g>

        {/* Big Star Coin Leaning (from user illustration) */}
        <g stroke="#090A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="130" cy="110" rx="26" ry="26" fill="#D4FF32" />
          {/* Star symbol inside coin */}
          <path
            d="M130 92 L134 104 L146 104 L136 111 L140 123 L130 115 L120 123 L124 111 L114 104 L126 104 Z"
            fill="#FAF8F5"
            stroke="#090A0F"
            strokeWidth="2"
          />
        </g>

        {/* Little Sparkles around coins */}
        <g stroke="#090A0F" strokeWidth="1.8">
          <path d="M165 60 L170 68 L178 72 L170 76 L165 84 L160 76 L152 72 L160 68 Z" fill="#D4FF32" />
          <circle cx="45" cy="45" r="2.5" fill="#090A0F" />
          <circle cx="175" cy="120" r="2" fill="#090A0F" />
        </g>
      </svg>
    </div>
  );
};
