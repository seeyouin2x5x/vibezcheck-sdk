'use client';

import React from 'react';

export interface SandboxProps {
  children?: React.ReactNode;
  className?: string;
}

export function Sandbox({ children, className = '' }: SandboxProps) {
  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0e0e12] shadow-xl overflow-hidden transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

export interface SandboxHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function SandboxHeader({ children, className = '' }: SandboxHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 border-b border-slate-200/80 dark:border-zinc-800/80 bg-slate-100/60 dark:bg-[#131318] select-none ${className}`}
    >
      {children}
    </div>
  );
}

export interface SandboxBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export function SandboxBody({ children, className = '' }: SandboxBodyProps) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80 dark:divide-zinc-800/80 items-stretch h-[470px] max-h-[470px] min-h-[470px] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export interface SandboxEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export function SandboxEditor({ children, className = '' }: SandboxEditorProps) {
  return (
    <div
      className={`lg:col-span-7 flex flex-col min-w-0 h-full bg-[#0e0e11] overflow-y-auto overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}

export interface SandboxPreviewProps {
  children?: React.ReactNode;
  className?: string;
}

export function SandboxPreview({ children, className = '' }: SandboxPreviewProps) {
  return (
    <div
      className={`lg:col-span-5 flex flex-col justify-between p-4 bg-slate-50/70 dark:bg-[#111115] min-w-0 h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}

