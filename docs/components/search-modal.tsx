'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  Shield,
  Sliders,
  Wallet,
  FileText,
  Zap,
  Terminal,
  Coins,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: 'Tutorial' | 'Feature' | 'Docs' | 'CLI' | 'Models';
  href: string;
  iconName: 'sparkles' | 'shield' | 'sliders' | 'wallet' | 'fileText' | 'zap' | 'terminal' | 'coins';
  keywords: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'tutorial',
    title: '5-Minute Chatbox Tutorial',
    description: 'Conversational step-by-step interactive tutor with live receipts & wallet top-ups',
    category: 'Tutorial',
    href: '/docs?section=tutorial',
    iconName: 'sparkles',
    keywords: ['tutorial', 'interactive', 'chatbox', 'tutor', 'learn', 'start', 'guide', 'walkthrough', 'step', 'milestone'],
  },
  {
    id: 'safety',
    title: 'Runaway Loop Safety Switch',
    description: 'Automatic tripwire that cuts off infinite agent loops before they drain credits',
    category: 'Feature',
    href: '/docs#safety',
    iconName: 'shield',
    keywords: ['safety', 'switch', 'circuit breaker', 'tripwire', 'loop', 'infinite', 'protection', 'cutoff', 'runaway', 'fuse'],
  },
  {
    id: 'markup',
    title: 'Profit Margin & Markup Split',
    description: 'Visual split bar showing wholesale model cost, developer profit, and customer price',
    category: 'Feature',
    href: '/docs#markup',
    iconName: 'sliders',
    keywords: ['margin', 'markup', 'profit', 'pricing', 'split', 'wholesale', 'bill', 'stripe', 'earnings', 'revenue'],
  },
  {
    id: 'wallet',
    title: 'Customer Wallets & Top-Ups',
    description: 'Mobile-data style pre-funded balances with instant top-up simulation',
    category: 'Feature',
    href: '/docs?section=tutorial',
    iconName: 'wallet',
    keywords: ['wallet', 'top up', 'balance', 'prepaid', 'credits', 'customer', 'quota', 'mobile data'],
  },
  {
    id: 'receipt',
    title: 'Live Micro-Receipts (<VibezReceipt />)',
    description: 'Transparent per-message cost receipts rendered directly under assistant responses',
    category: 'Docs',
    href: '/docs#quickstart',
    iconName: 'fileText',
    keywords: ['receipt', 'micro receipt', 'badge', 'cost', 'tokens', 'transparent', 'message', 'component', 'ui'],
  },
  {
    id: 'quickstart',
    title: '1-Line Route Setup (Quickstart)',
    description: 'Wrap OpenAI, Anthropic, or Gemini streaming routes with vibezcheck()',
    category: 'Docs',
    href: '/docs#quickstart',
    iconName: 'zap',
    keywords: ['quickstart', 'route', 'integration', 'streamtext', 'ai sdk', 'wrap', '1 line', 'code', 'api'],
  },
  {
    id: 'cli-init',
    title: 'Setup Wizard ($ npx vibezcheck init)',
    description: 'Scaffold a production-ready AI billing route in seconds without developer jargon',
    category: 'CLI',
    href: '/docs?section=cli',
    iconName: 'terminal',
    keywords: ['init', 'cli', 'wizard', 'npx', 'setup', 'scaffold', 'terminal', 'command'],
  },
  {
    id: 'cli-audit',
    title: 'Codebase Scanner ($ npx vibezcheck audit)',
    description: 'Scan your repository for unmetered AI endpoints and auto-patch them with safety fuses',
    category: 'CLI',
    href: '/docs?section=cli',
    iconName: 'terminal',
    keywords: ['audit', 'scan', 'scanner', 'unmetered', 'endpoints', 'cli', 'fix', 'terminal'],
  },
  {
    id: 'models',
    title: 'Real-Time Model Pricing Directory',
    description: 'Wholesale token rates across GPT-4o, Claude 3.7, Gemini 2.0, Grok, DeepSeek',
    category: 'Models',
    href: '/docs#models',
    iconName: 'coins',
    keywords: ['models', 'pricing', 'rates', 'gpt-4o', 'claude', 'gemini', 'deepseek', 'grok', 'tokens', 'cost', 'wholesale'],
  },
  {
    id: 'showcase',
    title: 'Interactive Copilot Showcase',
    description: 'Test live token metering with docked fintech bar and floating financial HUD',
    category: 'Feature',
    href: '/',
    iconName: 'sparkles',
    keywords: ['showcase', 'copilot', 'home', 'chat', 'live', 'demo', 'hud', 'pill', 'dock'],
  },
  {
    id: 'overview',
    title: 'Documentation Overview',
    description: 'Why VibezCheck exists: the mobile data package model for AI applications',
    category: 'Docs',
    href: '/docs',
    iconName: 'fileText',
    keywords: ['overview', 'docs', 'philosophy', 'why', 'concept', 'mobile data', 'analogy'],
  },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMac?: boolean;
}

export function SearchModal({ isOpen, onClose, isMac = true }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter items
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS;
    return SEARCH_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKw = item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCat || matchKw;
    });
  }, [query]);

  // Reset selectedIndex when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0));
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.href);
    if (item.href.includes('#')) {
      const hash = item.href.split('#')[1];
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const renderIcon = (name: SearchItem['iconName']) => {
    const cls = 'w-4 h-4';
    switch (name) {
      case 'sparkles':
        return <Sparkles className={cls} />;
      case 'shield':
        return <Shield className={cls} />;
      case 'sliders':
        return <Sliders className={cls} />;
      case 'wallet':
        return <Wallet className={cls} />;
      case 'fileText':
        return <FileText className={cls} />;
      case 'zap':
        return <Zap className={cls} />;
      case 'terminal':
        return <Terminal className={cls} />;
      case 'coins':
        return <Coins className={cls} />;
      default:
        return <FileText className={cls} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#121216] rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 select-none"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search guides, tutorial, safety switch, CLI, models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Category Filters when empty */}
        {!query && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/30 dark:bg-zinc-900/10 text-[11px] text-zinc-400 overflow-x-auto">
            <span className="shrink-0">Suggestions:</span>
            {['Tutorial', 'Safety Switch', 'Profit Markup', 'CLI Suite', 'Model Rates'].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition text-[11px] shrink-0 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="max-h-84 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-zinc-400">
                No results found for &ldquo;<span className="font-semibold text-zinc-700 dark:text-zinc-300">{query}</span>&rdquo;
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">Try searching for &quot;tutorial&quot;, &quot;safety&quot;, or &quot;cli&quot;.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-300 dark:ring-zinc-700'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-850/60 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700'
                    }`}
                  >
                    {renderIcon(item.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold truncate">{item.title}</span>
                      <span
                        className={`text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                          item.category === 'Tutorial'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : item.category === 'Feature'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                            : item.category === 'CLI'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                            : item.category === 'Models'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 shrink-0 mt-2 transition ${
                      isSelected ? 'text-zinc-900 dark:text-white translate-x-0.5' : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">↑</kbd>
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="font-mono text-[10px] px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono">
            <span>Toggle:</span>
            <kbd className="px-1 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
