'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, ExternalLink, ChevronDown } from 'lucide-react';
import { SearchModal } from './search-modal';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Control or Command + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md transition-colors">
      {/* Brand Navigation */}
      <div className="flex items-center gap-6">
        <a href="/" className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-1.5 font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span>VibezCheck</span>
            <span className="text-slate-300 dark:text-zinc-600">/</span>
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
              meter
            </span>
          </div>
        </a>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <a href="/" className="hover:text-slate-950 dark:hover:text-white transition">
            Showcase
          </a>
          <a href="/docs" className="hover:text-slate-950 dark:hover:text-white transition">
            Docs & Guides
          </a>
          <a href="/docs?section=tutorial" className="hover:text-slate-950 dark:hover:text-white transition">
            5-Min Tutorial
          </a>
          <a href="/releases" className="hover:text-slate-950 dark:hover:text-white transition text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            v0.5.4 Notes
          </a>
          <a href="/docs?section=cli" className="hover:text-slate-950 dark:hover:text-white transition">
            CLI Suite
          </a>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search documentation"
          className="sm:hidden p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Search Bar Pill with working Ctrl / Cmd + K */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          title={`Search documentation and commands (${isMac ? '⌘K' : 'Ctrl+K'})`}
          aria-label={`Search documentation (${isMac ? '⌘K' : 'Ctrl+K'})`}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100/90 hover:bg-slate-200/90 dark:bg-zinc-900/90 dark:hover:bg-zinc-800/90 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition cursor-pointer select-none active:scale-98"
        >
          <Search className="w-3 h-3 text-slate-400 dark:text-zinc-400" />
          <span>Search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 shadow-2xs">
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>

        {/* ✦ Dev Mode Pill */}
        {/* <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 text-xs shadow-2xs select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px] font-medium text-slate-700 dark:text-zinc-200">
            dev mode
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            testnet
          </span>
        </div> */}

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>
      </div>

      {/* Global Command / Ctrl+K Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} isMac={isMac} />
    </header>
  );
}
