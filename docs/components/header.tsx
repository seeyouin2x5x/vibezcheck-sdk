'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import { SearchModal } from './search-modal';

export function Header() {
  const [isDark, setIsDark] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'product' | 'developers' | 'resources' | null>(null);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent));
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0d10]/80 backdrop-blur-md transition-colors">
      {/* Brand Navigation */}
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            <svg
              className="w-4 h-4 fill-current text-emerald-500"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span>VibezCheck</span>
          </div>
        </a>

        {/* Links per Spec Section 41 */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-zinc-400">
          {/* Product Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMenu('product')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white transition py-1 cursor-pointer">
              <span>Product</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeMenu === 'product' && (
              <div className="absolute top-full left-0 w-56 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-1">
                <a
                  href="/ai-cost-monitoring"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition"
                >
                  <div className="font-semibold text-xs text-slate-950 dark:text-white">AI Cost Monitoring</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Request & customer cost layer</div>
                </a>
                <a
                  href="/ai-usage-metering"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition"
                >
                  <div className="font-semibold text-xs text-slate-950 dark:text-white">AI Usage Metering</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Token tracking & events</div>
                </a>
                <a
                  href="/ai-agent-cost"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition"
                >
                  <div className="font-semibold text-xs text-slate-950 dark:text-white">AI Agent Costs</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Session budgets & tool limits</div>
                </a>
                <a
                  href="/ai-usage-based-billing"
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition"
                >
                  <div className="font-semibold text-xs text-slate-950 dark:text-white">Usage-Based Billing</div>
                  <div className="text-[11px] text-slate-500 dark:text-zinc-400">Stripe & Metronome bridge</div>
                </a>
              </div>
            )}
          </div>

          {/* Developers Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMenu('developers')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white transition py-1 cursor-pointer">
              <span>Developers</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeMenu === 'developers' && (
              <div className="absolute top-full left-0 w-48 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-1">
                <a
                  href="/docs"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  Documentation
                </a>
                <a
                  href="/docs?section=quickstart"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  Quickstart
                </a>
                <a
                  href="/#demo"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  700+ Models Sandbox
                </a>
                <a
                  href="https://www.npmjs.com/package/vibezcheck"
                  target="_blank"
                  rel="noreferrer"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  npm Package ↗
                </a>
                <a
                  href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
                  target="_blank"
                  rel="noreferrer"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  GitHub Repository ↗
                </a>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveMenu('resources')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button className="flex items-center gap-1 hover:text-slate-950 dark:hover:text-white transition py-1 cursor-pointer">
              <span>Resources</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {activeMenu === 'resources' && (
              <div className="absolute top-full left-0 w-48 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl space-y-1">
                <a
                  href="/llm-cost-calculator"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  LLM Cost Calculator
                </a>
                <a
                  href="/docs?section=tutorial"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  Guides & Tutorials
                </a>
                <a
                  href="/releases"
                  className="block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs text-slate-800 dark:text-zinc-200"
                >
                  Changelog
                </a>
              </div>
            )}
          </div>

          {/* Direct Calculator Link */}
          <a
            href="/llm-cost-calculator"
            className="hover:text-emerald-500 transition text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            Calculator
          </a>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar Pill with working Ctrl / Cmd + K */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          title={`Search documentation and commands (${isMac ? '⌘K' : 'Ctrl+K'})`}
          aria-label={`Search documentation (${isMac ? '⌘K' : 'Ctrl+K'})`}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/90 hover:bg-slate-200/90 dark:bg-zinc-900/90 dark:hover:bg-zinc-800/90 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition cursor-pointer select-none active:scale-98"
        >
          <Search className="w-3 h-3 text-slate-400 dark:text-zinc-400" />
          <span>Search...</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 shadow-2xs">
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition cursor-pointer shadow-2xs"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* Primary CTA Button */}
        <a
          href="/docs?section=quickstart"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-900 text-xs font-semibold transition shadow-xs cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Global Command / Ctrl+K Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} isMac={isMac} />
    </header>
  );
}
