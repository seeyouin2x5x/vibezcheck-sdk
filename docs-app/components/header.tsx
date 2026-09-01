'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Github, Sparkles, Menu, X, ExternalLink, Bot } from 'lucide-react';
import { SearchModal } from './search-modal';

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, mobileMenuOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile Menu + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm group-hover:bg-black transition">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  vibezcheck
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v0.3.0
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Trigger (Resend Style) */}
          <div className="flex-1 max-w-md hidden sm:block">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-400 transition"
            >
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search documentation...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] font-medium bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Agentic llms.txt link */}
            <Link
              href="/llms.txt"
              target="_blank"
              title="Agentic Standard Context for LLMs & AI Scrapers"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition font-mono text-[11px]"
            >
              <Bot className="h-3 w-3" />
              <span>llms.txt</span>
            </Link>

            {/* Studio Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <span>VibeLand Studio</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/seeyouin2x5x/vibezcheck-sdk"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
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
