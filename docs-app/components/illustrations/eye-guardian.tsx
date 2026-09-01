'use client';

import React, { useState } from 'react';

export const EyeGuardianIllustration: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-full min-h-[220px] flex items-center justify-center p-4 select-none cursor-pointer group"
    >
      {/* Hand-Drawn Doodle SVG matching user illustration */}
      <svg
        viewBox="0 0 320 240"
        className="w-full h-auto max-w-[300px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Network Connection Lines and Nodes */}
        <g stroke="#090A0F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer constellation branches */}
          <line x1="80" y1="90" x2="45" y2="120" strokeDasharray="3 3" />
          <line x1="45" y1="120" x2="65" y2="175" />
          <line x1="65" y1="175" x2="110" y2="190" />
          <line x1="160" y1="120" x2="80" y2="90" />
          <line x1="160" y1="120" x2="120" y2="55" />
          <line x1="160" y1="120" x2="205" y2="60" />
          <line x1="160" y1="120" x2="245" y2="110" />
          <line x1="160" y1="120" x2="215" y2="185" />
          <line x1="160" y1="120" x2="110" y2="190" />

          {/* Dotted flourish lines */}
          <path d="M225 185 Q260 200 275 190" strokeDasharray="2 3" />
          <path d="M45 120 Q30 145 25 170" strokeDasharray="2 3" />
          <path d="M120 55 Q135 30 155 35" strokeDasharray="2 3" />
        </g>

        {/* Small Connector Ink Dots */}
        <circle cx="45" cy="120" r="3.5" fill="#090A0F" />
        <circle cx="65" cy="175" r="4.5" fill="#090A0F" />
        <circle cx="275" cy="190" r="3" fill="#090A0F" />
        <circle cx="25" cy="170" r="3" fill="#090A0F" />
        <circle cx="155" cy="35" r="3" fill="#090A0F" />

        {/* Outer Eye 1: Top Left */}
        <g className="transition-transform duration-300 transform group-hover:-translate-y-1">
          <ellipse cx="120" cy="55" rx="18" ry="14" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '124' : '120'} cy="55" r="7" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '125' : '121'} cy="55" r="3.5" fill="#090A0F" />
          <circle cx={hovered ? '126' : '122'} cy="53" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Outer Eye 2: Top Right */}
        <g className="transition-transform duration-300 transform group-hover:translate-x-1">
          <ellipse cx="205" cy="60" rx="16" ry="13" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '208' : '205'} cy="60" r="6" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '209' : '205'} cy="60" r="3" fill="#090A0F" />
          <circle cx={hovered ? '210' : '206'} cy="58" r="1" fill="#FFFFFF" />
        </g>

        {/* Outer Eye 3: Left */}
        <g className="transition-transform duration-300 transform group-hover:-translate-x-1">
          <ellipse cx="80" cy="90" rx="19" ry="15" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '76' : '80'} cy="90" r="7.5" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '75' : '80'} cy="90" r="3.8" fill="#090A0F" />
          <circle cx={hovered ? '76' : '81'} cy="88" r="1.3" fill="#FFFFFF" />
        </g>

        {/* Outer Eye 4: Right */}
        <g className="transition-transform duration-300 transform group-hover:translate-x-1">
          <ellipse cx="245" cy="110" rx="20" ry="16" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '249' : '245'} cy="110" r="8" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '250' : '245'} cy="110" r="4" fill="#090A0F" />
          <circle cx={hovered ? '251' : '246'} cy="108" r="1.4" fill="#FFFFFF" />
        </g>

        {/* Outer Eye 5: Bottom Left */}
        <g className="transition-transform duration-300 transform group-hover:translate-y-1">
          <ellipse cx="110" cy="190" rx="18" ry="14" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '108' : '110'} cy="190" r="7" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '107' : '110'} cy="190" r="3.5" fill="#090A0F" />
          <circle cx={hovered ? '108' : '111'} cy="188" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Outer Eye 6: Bottom Right */}
        <g className="transition-transform duration-300 transform group-hover:translate-y-1">
          <ellipse cx="215" cy="185" rx="16" ry="13" fill="#FFFFFF" stroke="#090A0F" strokeWidth="2.5" />
          <circle cx={hovered ? '218' : '215'} cy="185" r="6" fill="#D4FF32" stroke="#090A0F" strokeWidth="2" />
          <circle cx={hovered ? '219' : '215'} cy="185" r="3" fill="#090A0F" />
          <circle cx={hovered ? '220' : '216'} cy="183" r="1" fill="#FFFFFF" />
        </g>

        {/* THE BIG CENTRAL EYE GUARDIAN (Main Character) */}
        <g className="transition-transform duration-300 transform group-hover:scale-105 origin-center">
          {/* Outer glow ring */}
          <ellipse cx="160" cy="120" rx="46" ry="36" fill="#F4EFE6" stroke="#090A0F" strokeWidth="3" />
          
          {/* Electric Lime Iris */}
          <circle
            cx={hovered ? '164' : '160'}
            cy="120"
            r="20"
            fill="#D4FF32"
            stroke="#090A0F"
            strokeWidth="2.5"
            className="transition-all duration-200"
          />

          {/* Deep Ink Pupil */}
          <circle
            cx={hovered ? '166' : '160'}
            cy="120"
            r="10"
            fill="#090A0F"
            className="transition-all duration-200"
          />

          {/* Sparkle Glint / Reflection */}
          <circle cx={hovered ? '168' : '163'} cy="116" r="3.5" fill="#FFFFFF" />
          <circle cx={hovered ? '164' : '158'} cy="123" r="1.8" fill="#FFFFFF" />
        </g>

        {/* Little whimsical doodle sparkles around the guardian */}
        <g stroke="#090A0F" strokeWidth="1.8" strokeLinecap="round">
          <path d="M280 65 L285 75 L295 80 L285 85 L280 95 L275 85 L265 80 L275 75 Z" fill="#D4FF32" />
          <path d="M35 55 L38 62 L45 65 L38 68 L35 75 L32 68 L25 65 L32 62 Z" fill="#D4FF32" />
          <circle cx="295" cy="140" r="2" fill="#090A0F" />
          <circle cx="25" cy="100" r="2.5" fill="#090A0F" />
          <circle cx="160" cy="225" r="2.5" fill="#090A0F" />
        </g>
      </svg>
    </div>
  );
};
