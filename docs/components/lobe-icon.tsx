'use client';

import React from 'react';

// Set of monochrome icons that need inversion in dark mode (black in light, white in dark)
const MONOCHROME_ICONS = new Set([
  'openai',
  'openai.svg',
  'grok',
  'grok.svg',
  'xai',
  'xai.svg',
  'anthropic',
  'anthropic.svg',
  'elevenlabs',
  'elevenlabs.svg',
  'vercel',
  'vercel.svg',
]);

export interface LobeIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name: string;
  size?: number | string;
  className?: string;
  alt?: string;
}

export function LobeIcon({
  name,
  size = 18,
  className = '',
  alt,
  ...props
}: LobeIconProps) {
  const cleanName = name.endsWith('.svg') ? name.slice(0, -4) : name;
  const isMonochrome = MONOCHROME_ICONS.has(cleanName) || MONOCHROME_ICONS.has(`${cleanName}.svg`);
  const src = `/icons/${cleanName}.svg`;

  return (
    <img
      src={src}
      alt={alt || `${cleanName} logo`}
      width={size}
      height={size}
      className={`inline-block select-none shrink-0 object-contain transition-transform ${
        isMonochrome ? 'dark:invert dark:brightness-125' : ''
      } ${className}`}
      loading="lazy"
      {...props}
    />
  );
}
