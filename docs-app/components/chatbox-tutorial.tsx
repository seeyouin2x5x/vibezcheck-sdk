'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Zap,
  ArrowRight,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { VibezReceipt } from '@/components/vibez-meter';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  step?: number;
  codeSnippet?: { title: string; code: string; lang?: string };
  interactiveDemo?: 'receipt' | 'wallet' | 'safety';
  receiptData?: { model: string; tokens: number; costUSD: number; latencyMs: number };
  chips?: { label: string; action: string }[];
}

const TUTORIAL_STEPS: Record<number, {
  title: string;
  message: string;
  codeSnippet?: { title: string; code: string };
  interactiveDemo?: 'receipt' | 'wallet' | 'safety';
  receiptData?: { model: string; tokens: number; costUSD: number; latencyMs: number };
  nextChips: { label: string; action: string }[];
}> = {
  1: {
    title: 'Step 1: Scaffold your project',
    message: "Let's create your AI project with one single terminal command. This sets up a fresh Next.js app with VibezCheck and Stripe pre-configured:",
    codeSnippet: {
      title: 'Terminal Command',
      code: 'npx vibezcheck init my-ai-app',
    },
    nextChips: [
      { label: 'Next: Step 2 (Connect Keys) →', action: 'step_2' },
      { label: 'Why npx vibezcheck init?', action: 'why_init' },
    ],
  },
  2: {
    title: 'Step 2: Connect your API keys',
    message: "Open your new project's `.env.local` file. You only need an AI provider key (like OpenAI). Stripe is 100% optional for development—if you leave it empty, VibezCheck runs in free local simulation mode:",
    codeSnippet: {
      title: '.env.local',
      code: `# AI Provider Key
OPENAI_API_KEY=sk-...

# Stripe Account (leave empty to test free locally!)
STRIPE_SECRET_KEY=sk_test_...`,
    },
    nextChips: [
      { label: 'Next: Step 3 (The 1-Line Route) →', action: 'step_3' },
      { label: 'Can I use Anthropic Claude?', action: 'ask_claude' },
    ],
  },
  3: {
    title: 'Step 3: The 1-line AI route',
    message: "Now open `app/api/chat/route.ts`. All you do is wrap your model in `vibezcheck()`. Notice the 3 plain settings: who to bill (`customer`), your profit markup (`margin: 1.30` = +30% profit), and your emergency safety switch (`$0.50`):",
    codeSnippet: {
      title: 'app/api/chat/route.ts',
      code: `import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId = 'cus_123' } = await req.json();

  // ⚡ 1-Line Metering, Margin & Safety
  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: customerId,              // Who gets billed
      pricing: { margin: 1.30 },         // +30% profit markup
      safety: { maxCostPerCallUSD: 0.50 } // Emergency shutoff at 50¢
    }),
    messages,
  });

  return result.toDataStreamResponse();
}`,
    },
    nextChips: [
      { label: 'Next: Step 4 (See the Live Receipt) →', action: 'step_4' },
      { label: 'How does margin work?', action: 'ask_margin' },
    ],
  },
  4: {
    title: 'Step 4: The live micro-receipt in React',
    message: "Under each assistant message in your UI, drop in `<VibezReceipt message={message} />`. Here is an actual live receipt generated right now for a sample question:",
    interactiveDemo: 'receipt',
    receiptData: {
      model: 'gpt-4o-mini',
      tokens: 148,
      costUSD: 0.00022,
      latencyMs: 165,
    },
    codeSnippet: {
      title: 'app/page.tsx',
      code: `import { VibezReceipt } from 'vibezcheck/react';

// Inside your message rendering loop:
{message.role === 'assistant' && (
  <VibezReceipt message={message} />
)}`,
    },
    nextChips: [
      { label: 'Next: Step 5 (Test Stripe Top-Up) →', action: 'step_5' },
      { label: 'Test another live question', action: 'simulate_question' },
    ],
  },
  5: {
    title: 'Step 5: Test customer credit top-up',
    message: "You can charge customers per question or let them buy prepaid credit packs (e.g. $10). Try clicking the button below to test a live top-up simulation:",
    interactiveDemo: 'wallet',
    nextChips: [
      { label: 'Test Safety Switch ($0.50 cutoff) →', action: 'simulate_safety' },
      { label: 'Restart Tutorial ↺', action: 'step_1' },
    ],
  },
};

export function ChatboxTutorial() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      text: "Hey! I'm your interactive VibezCheck tutor. In 5 quick steps, I'll walk you through setting up token metering, profit margins, and Stripe billing. Click Step 1 below to start!",
      chips: [
        { label: 'Start Step 1: Scaffold Project ($ npx vibezcheck init)', action: 'step_1' },
        { label: 'What is VibezCheck in simple words?', action: 'what_is_it' },
      ],
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive wallet demo state inside the chatbox
  const [walletBalance, setWalletBalance] = useState<number>(0.00);
  const [isTopUpLoading, setIsTopUpLoading] = useState<boolean>(false);
  const [topUpSuccess, setTopUpSuccess] = useState<boolean>(false);

  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeAction = (action: string) => {
    if (action.startsWith('step_')) {
      const stepNum = parseInt(action.split('_')[1], 10);
      setCurrentStep(stepNum);
      const stepData = TUTORIAL_STEPS[stepNum];
      if (stepData) {
        setMessages((prev) => [
          ...prev,
          {
            id: `user-step-${stepNum}-${Date.now()}`,
            role: 'user',
            text: `Show me ${stepData.title}`,
          },
          {
            id: `assistant-step-${stepNum}-${Date.now()}`,
            role: 'assistant',
            step: stepNum,
            text: stepData.message,
            codeSnippet: stepData.codeSnippet,
            interactiveDemo: stepData.interactiveDemo,
            receiptData: stepData.receiptData,
            chips: stepData.nextChips,
          },
        ]);
      }
      return;
    }

    // Specific interactive queries
    if (action === 'what_is_it') {
      setMessages((prev) => [
        ...prev,
        { id: `user-q-${Date.now()}`, role: 'user', text: 'What is VibezCheck in simple words?' },
        {
          id: `assistant-a-${Date.now()}`,
          role: 'assistant',
          text: "Think of VibezCheck like a digital speedometer for AI. When someone talks to your AI, it measures every word, calculates the exact cost in pennies, adds your profit markup (e.g. +30%), and charges their Stripe wallet—with zero delay.",
          chips: [{ label: 'Ready to build: Step 1 ($ npx vibezcheck init)', action: 'step_1' }],
        },
      ]);
      return;
    }

    if (action === 'why_init') {
      setMessages((prev) => [
        ...prev,
        { id: `user-q-${Date.now()}`, role: 'user', text: 'Why use npx vibezcheck init?' },
        {
          id: `assistant-a-${Date.now()}`,
          role: 'assistant',
          text: "Because it sets up everything for you in 30 seconds! It detects your project, creates your .env.local file, and builds a working /api/chat route with safety fuses and Stripe metering already turned on.",
          chips: [{ label: 'Next: Step 2 (Connect Keys) →', action: 'step_2' }],
        },
      ]);
      return;
    }

    if (action === 'ask_claude') {
      setMessages((prev) => [
        ...prev,
        { id: `user-q-${Date.now()}`, role: 'user', text: 'Can I use Anthropic Claude or other models?' },
        {
          id: `assistant-a-${Date.now()}`,
          role: 'assistant',
          text: "Yes! VibezCheck works universally with Anthropic Claude 3.7 (including thinking tokens), Google Gemini 2.0, DeepSeek R1, Groq, and OpenAI. Just pass `anthropic('claude-3-7-sonnet')` into vibezcheck().",
          chips: [{ label: 'Continue to Step 3 →', action: 'step_3' }],
        },
      ]);
      return;
    }

    if (action === 'ask_margin') {
      setMessages((prev) => [
        ...prev,
        { id: `user-q-${Date.now()}`, role: 'user', text: 'How does the profit margin work?' },
        {
          id: `assistant-a-${Date.now()}`,
          role: 'assistant',
          text: "Setting `margin: 1.30` means whatever OpenAI charges you (wholesale), you charge the user wholesale + 30%. If an answer costs $0.010, the user's Stripe wallet is debited $0.013. You keep the 30% profit on every call.",
          chips: [{ label: 'Next: Step 4 (Live Price Tag) →', action: 'step_4' }],
        },
      ]);
      return;
    }

    if (action === 'simulate_question') {
      const randomTokens = Math.floor(Math.random() * 120) + 80;
      const cost = (randomTokens * 0.0000015);
      setMessages((prev) => [
        ...prev,
        { id: `user-sim-${Date.now()}`, role: 'user', text: 'Explain gravity in 1 sentence.' },
        {
          id: `assistant-sim-${Date.now()}`,
          role: 'assistant',
          text: "Gravity is the curvature of spacetime caused by mass and energy, pulling objects toward one another.",
          interactiveDemo: 'receipt',
          receiptData: {
            model: 'gpt-4o-mini',
            tokens: randomTokens,
            costUSD: cost,
            latencyMs: 145,
          },
          chips: [{ label: 'Next: Step 5 (Test Stripe Top-Up) →', action: 'step_5' }],
        },
      ]);
      return;
    }

    if (action === 'simulate_safety') {
      setMessages((prev) => [
        ...prev,
        { id: `user-safety-${Date.now()}`, role: 'user', text: 'Simulate a runaway agent loop' },
        {
          id: `assistant-safety-${Date.now()}`,
          role: 'assistant',
          text: "🚨 Autonomous agent entered infinite loop (Loop 1: $0.0008, Loop 2: $0.0034, Loop 3: $0.5002).\n\n⚡ [VibezCheck Failsafe]: Execution severed immediately at the $0.50 threshold. Cost capped! Your credit card was protected.",
          chips: [
            { label: 'Start over ↺', action: 'step_1' },
            { label: 'View Model Prices', action: 'view_prices' },
          ],
        },
      ]);
      return;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text: userText },
    ]);

    // Intelligent plain-English assistant response
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = '';
      let nextChips = [
        { label: 'Step 1: Scaffold Project', action: 'step_1' },
        { label: 'Step 3: 1-Line Route', action: 'step_3' },
      ];

      if (lower.includes('cost') || lower.includes('price') || lower.includes('charge')) {
        reply = "VibezCheck tracks exact token prices per model in real-time. For example, GPT-4o-mini costs $0.15 per 1M input words and $0.60 per 1M output words. You can add a profit markup like `margin: 1.30` to keep 30% profit.";
        nextChips = [{ label: 'Try Step 3 (The 1-Line Route)', action: 'step_3' }];
      } else if (lower.includes('stripe') || lower.includes('card') || lower.includes('payment')) {
        reply = "You can link any customer's Stripe Customer ID in 1 line. VibezCheck emits Stripe Meter Events or debits prepaid wallets in real-time. For local development, it runs in free testnet mode with zero Stripe keys required!";
        nextChips = [{ label: 'Test Step 5 (Stripe Top-Up)', action: 'step_5' }];
      } else if (lower.includes('loop') || lower.includes('safety') || lower.includes('bill')) {
        reply = "Our automatic Safety Switch stops runaway loops before they hurt your wallet! Setting `safety: { maxCostPerCallUSD: 0.50 }` cuts the connection the moment a query hits 50 cents.";
        nextChips = [{ label: 'Simulate Safety Switch', action: 'simulate_safety' }];
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('start')) {
        reply = "Hello! I'm here to show you how to monetize and protect your AI apps. Would you like to start with Step 1?";
        nextChips = [{ label: 'Step 1: Scaffold Project', action: 'step_1' }];
      } else {
        reply = `Got it! With VibezCheck, you can meter "${userText}" with 0ms delay, charge users with Stripe, and protect your credit card with automatic safety switches. Let's walk through the setup!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: reply,
          chips: nextChips,
        },
      ]);
    }, 400);
  };

  const handleSimulateTopUp = () => {
    if (isTopUpLoading) return;
    setIsTopUpLoading(true);
    let current = walletBalance;
    const target = current + 10.0;
    const interval = setInterval(() => {
      current += 1.25;
      if (current >= target) {
        clearInterval(interval);
        setWalletBalance(target);
        setIsTopUpLoading(false);
        setTopUpSuccess(true);
      } else {
        setWalletBalance(current);
      }
    }, 45);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col h-[640px]">
      {/* Tutorial Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              VibezCheck Interactive Tutor
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400">
              {currentStep > 0 ? `Step ${currentStep} of 5 Completed` : 'Guided Interactive Setup'}
            </span>
          </div>
        </div>

        {/* Progress Bar & Reset Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => executeAction(`step_${step}`)}
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition cursor-pointer ${
                  currentStep >= step
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-300'
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentStep(0);
              setMessages([
                {
                  id: 'init',
                  role: 'assistant',
                  text: "Tutorial reset! I'm ready when you are. Click Step 1 to begin:",
                  chips: [{ label: 'Start Step 1: Scaffold ($ npx vibezcheck init)', action: 'step_1' }],
                },
              ]);
            }}
            title="Reset tutorial"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            } space-y-2 animate-fadeIn`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed ${
                m.role === 'user'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-tr-xs font-medium'
                  : 'bg-slate-100/90 dark:bg-zinc-800/90 text-slate-800 dark:text-zinc-200 rounded-tl-xs border border-slate-200/80 dark:border-zinc-700/60 shadow-2xs'
              }`}
            >
              {m.step && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 font-mono text-[10px] font-bold text-slate-900 dark:text-white mb-2 shadow-2xs">
                  <span>STEP {m.step} / 5</span>
                </div>
              )}
              <p className="whitespace-pre-line">{m.text}</p>

              {/* Code Snippet if present */}
              {m.codeSnippet && (
                <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-950 text-zinc-100 font-mono text-[11px]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-zinc-800 text-[10px] text-zinc-400">
                    <span>{m.codeSnippet.title}</span>
                    <button
                      onClick={() => handleCopyCode(m.codeSnippet!.code, m.id)}
                      className="flex items-center gap-1 hover:text-white transition cursor-pointer"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-zinc-200">
                    <code>{m.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Interactive Demo: Live Receipt Preview */}
              {m.interactiveDemo === 'receipt' && m.receiptData && (
                <div className="mt-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400 pb-1 border-b border-slate-100 dark:border-zinc-800">
                    <span>LIVE DEMO RECEIPT</span>
                    <span className="text-emerald-600 dark:text-emerald-400">✓ 0ms added latency</span>
                  </div>
                  <VibezReceipt
                    model={m.receiptData.model}
                    tokens={m.receiptData.tokens}
                    costUSD={m.receiptData.costUSD}
                    latencyMs={m.receiptData.latencyMs}
                    variant="pill"
                  />
                </div>
              )}

              {/* Interactive Demo: Wallet Top-Up */}
              {m.interactiveDemo === 'wallet' && (
                <div className="mt-3 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                      Customer Wallet Balance:
                    </span>
                    <span
                      className={`font-mono text-sm font-bold transition-colors ${
                        topUpSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      ${walletBalance.toFixed(2)} USD
                    </span>
                  </div>

                  <button
                    onClick={handleSimulateTopUp}
                    disabled={isTopUpLoading}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs active:scale-98"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{isTopUpLoading ? 'Processing with Stripe...' : 'Top Up +$10.00 Credits'}</span>
                  </button>

                  {topUpSuccess && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block text-center">
                      ✓ Stripe Checkout verified: +$10.00 credits added to user balance!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Chips */}
            {m.chips && m.chips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {m.chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => executeAction(chip.action)}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-[11px] font-medium shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Prompt Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950/60 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or type 'Step 1'..."
          className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-hidden focus:border-slate-400 dark:focus:border-zinc-600 transition"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-40 transition cursor-pointer hover:opacity-90"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
