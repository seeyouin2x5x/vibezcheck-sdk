'use client';

import React from 'react';

export const DeveloperDeskIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[200px] flex items-center justify-center p-4 select-none">
      <svg
        viewBox="0 0 320 240"
        className="w-full h-auto max-w-[300px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floating lime sticky notes */}
        <g>
          <rect x="25" y="20" width="45" height="35" rx="6" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <line x1="33" y1="30" x2="60" y2="30" stroke="#090A0F" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="33" y1="38" x2="52" y2="38" stroke="#090A0F" strokeWidth="1.8" strokeLinecap="round" />

          {/* Dotted paper airplane path */}
          <path
            d="M55 40 Q110 15 170 45 T220 50"
            stroke="#090A0F"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />

          {/* Paper airplane doodle */}
          <g transform="translate(165, 20) rotate(15)">
            <path d="M0 10 L22 0 L15 22 L11 13 Z" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2" strokeLinejoin="round" />
            <path d="M22 0 L11 13" stroke="#090A0F" strokeWidth="1.8" />
          </g>
        </g>

        {/* Multi-Monitor Setup */}
        <g stroke="#090A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Large Center Monitor */}
          <rect x="175" y="65" width="80" height="60" rx="6" fill="#090A0F" />
          {/* Screen Content */}
          <rect x="180" y="70" width="70" height="50" rx="3" fill="#12141A" />
          {/* Code lines in screen */}
          <line x1="186" y1="78" x2="220" y2="78" stroke="#D4FF32" strokeWidth="2" />
          <line x1="186" y1="86" x2="235" y2="86" stroke="#635BFF" strokeWidth="2" />
          <line x1="186" y1="94" x2="210" y2="94" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="186" y1="102" x2="225" y2="102" stroke="#635BFF" strokeWidth="2" />
          {/* Monitor Stand */}
          <line x1="215" y1="125" x2="215" y2="140" />
          <line x1="200" y1="140" x2="230" y2="140" />

          {/* Secondary Top Right Monitor */}
          <rect x="245" y="35" width="55" height="40" rx="5" fill="#090A0F" />
          <rect x="250" y="40" width="45" height="30" rx="2" fill="#12141A" />
          <circle cx="272" cy="55" r="7" stroke="#D4FF32" strokeWidth="2" fill="none" />
          <line x1="272" y1="55" x2="276" y2="52" stroke="#D4FF32" strokeWidth="1.5" />

          {/* Desk Surface */}
          <line x1="140" y1="145" x2="310" y2="145" strokeWidth="3" />
        </g>

        {/* Developer Character Silhouette (Matching user illustration) */}
        <g stroke="#090A0F" strokeLinecap="round" strokeLinejoin="round">
          {/* Yellow/Lime Shirt Developer */}
          {/* Head */}
          <circle cx="280" cy="115" r="14" fill="#090A0F" stroke="#090A0F" strokeWidth="2" />
          <circle cx="288" cy="115" r="12" fill="#F4EFE6" stroke="#090A0F" strokeWidth="2" />
          {/* Hair doodle */}
          <path d="M280 103 Q288 98 296 106" stroke="#090A0F" strokeWidth="2.5" />

          {/* Torso & Lime Shirt */}
          <path d="M275 130 Q270 145 265 170 L285 170 Q290 145 295 130 Z" fill="#D4FF32" stroke="#090A0F" strokeWidth="2.5" />

          {/* Arms reaching to keyboard */}
          <path d="M272 140 Q250 143 235 142" stroke="#090A0F" strokeWidth="3" />
          <path d="M282 142 Q260 148 240 144" stroke="#090A0F" strokeWidth="2.5" />

          {/* Legs & Chair */}
          <line x1="270" y1="170" x2="265" y2="205" stroke="#090A0F" strokeWidth="3" />
          <line x1="265" y1="205" x2="250" y2="205" stroke="#090A0F" strokeWidth="3.5" />
          {/* Office Chair Base */}
          <line x1="285" y1="170" x2="285" y2="195" stroke="#090A0F" strokeWidth="2.5" />
          <line x1="270" y1="195" x2="300" y2="195" stroke="#090A0F" strokeWidth="3" />
          <circle cx="270" cy="205" r="3" fill="#090A0F" />
          <circle cx="300" cy="205" r="3" fill="#090A0F" />
        </g>
      </svg>
    </div>
  );
};
