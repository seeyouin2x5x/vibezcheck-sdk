'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Github, Sparkles, Menu, X, ExternalLink, Bot } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { SearchModal } from './search-modal';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, mobileMenuOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu + Minimalist Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <Link href="/" className="hover:opacity-90 transition">
              <BrandLogo />
            </Link>
          </div>

          {/* Center: Search Trigger */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-cream-50 hover:bg-cream-100/80 border border-slate-200/80 text-xs text-slate-500 transition shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search documentation, models, hooks...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] font-medium bg-white px-1.5 py-0.5 rounded-md border border-slate-200 text-slate-500 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Agentic llms.txt link */}
            <Link
              href="/llms.txt"
              target="_blank"
              title="Agentic Standard Context for LLMs & AI Scrapers"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stripe-indigo/10 text-stripe-indigo border border-stripe-indigo/20 hover:bg-stripe-indigo/15 transition font-mono text-[11px] font-semibold"
            >
              <Bot className="h-3 w-3" />
              <span>llms.txt</span>
            </Link>

            {/* Studio Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-cream-100 transition"
            >
              <span>VibeLand Studio</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-cream-100 rounded-lg transition"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
