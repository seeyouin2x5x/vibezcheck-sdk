'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import { SearchModal } from './search-modal';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent));
    // Detect current theme or preference
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark) || document.documentElement.classList.contains('dark');
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
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
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md transition-colors">
      {/* Brand Navigation */}
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-slate-900 dark:text-white">
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
            <span>VibezCheck</span>
          </div>
        </a>

        {/* Links per Spec v2 Section 22 */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <a href="/#demo" className="hover:text-slate-950 dark:hover:text-white transition">
            Product
          </a>
          <a href="/docs" className="hover:text-slate-950 dark:hover:text-white transition">
            Docs
          </a>
          <a href="/docs?section=tutorial" className="hover:text-slate-950 dark:hover:text-white transition">
            Examples
          </a>
          <a href="/releases" className="hover:text-slate-950 dark:hover:text-white transition">
            Changelog
          </a>
          <a href="mailto:yt@vibezcheck.app" className="hover:text-slate-950 dark:hover:text-white transition">
            Contact
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

        {/* Contact Link */}
        <a
          href="mailto:yt@vibezcheck.app"
          className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white transition"
        >
          <span>yt@vibezcheck.app</span>
        </a>

        {/* Primary CTA Button */}
        <a
          href="/docs?section=quickstart"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-900 text-xs font-semibold transition shadow-xs cursor-pointer"
        >
          <span>Start measuring</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Global Command / Ctrl+K Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} isMac={isMac} />
    </header>
  );
}
