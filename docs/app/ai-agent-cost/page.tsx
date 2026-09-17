import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import {
  Bot,
  ShieldAlert,
  Layers,
  Wrench,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Agent Cost Tracking & Spending Limits | VibezCheck',
  description:
    'Track, monitor, and limit cumulative AI agent costs across multi-turn LLM reasoning loops, tool executions, and API calls with in-process circuit breakers.',
  alternates: {
    canonical: 'https://vibezcheck.app/ai-agent-cost',
  },
  openGraph: {
    title: 'AI Agent Cost Tracking & Spending Limits | VibezCheck',
    description:
      'Track cumulative multi-turn costs across model invocations and external tools. Protect applications against runaway agent loops.',
    url: 'https://vibezcheck.app/ai-agent-cost',
  },
};

const FAQ_ITEMS = [
  {
    q: 'How much does an AI agent run cost?',
    a: 'A typical multi-turn AI agent task costs between $0.02 and $0.50 depending on the underlying model and tool calls. A 6-step agent using GPT-4o-mini might cost under $0.01, whereas the same agent using frontier reasoning models like OpenAI o1 or Claude 3.5 Sonnet with web browsing can quickly reach $0.30 to $1.20 per completed goal.',
  },
  {
    q: 'How do you stop an AI agent loop?',
    a: 'VibezCheck enforces hard session spending caps using an in-process circuit breaker (AgentSession). Before each model inference or tool call, the cumulative session expense is evaluated. If the budget is exceeded, VibezCheck immediately interrupts execution and throws a VibezCircuitBreakerError, preventing runaway billing.',
  },
  {
    q: 'Can I track external tool costs alongside LLM token costs?',
    a: 'Yes. Autonomous agents frequently invoke paid APIs, web search scrapers, and sandbox containers. VibezCheck provides session.trackTool() and session.tools() to attach fixed or dynamic dollar costs to tool executions, unifying token costs and API costs into one single session ledger.',
  },
  {
    q: 'Does VibezCheck work with Vercel AI SDK, LangChain, and custom agent runtimes?',
    a: 'Yes. VibezCheck provides first-class wrappers for Vercel AI SDK streamText/generateText tools, as well as a standalone AgentSession class that can be instrumented into any custom TypeScript loop, LangChain runnable, or state machine.',
  },
];

export default function AiAgentCostPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#0c0d10] text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <article className="flex-1 max-w-4xl mx-auto px-4 pt-28 pb-20 w-full space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300">Home</Link>
          <span>/</span>
          <span className="text-emerald-400">AI Agent Cost</span>
        </nav>

        {/* Hero & Opening AEO Answer (Spec Section 13) */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            MULTI-TURN AI COST INTELLIGENCE
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Track and control AI agent costs.
          </h1>
          {/* Opening Direct Answer Box */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sm sm:text-base text-zinc-200 leading-relaxed">
            <strong className="text-white">AI agent costs</strong> are the cumulative expenses incurred across multiple model invocations, tool executions, vector searches, and reasoning steps required to fulfill a single task. Unlike single-turn chatbots, agents can make dozens of iterative LLM calls in a loop. VibezCheck tracks agent sessions end-to-end, attributing costs across all turns and enforcing session-level spending limits.
          </div>
        </header>

        {/* Visual Workflow Diagram */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Agent Lifecycle Economics
          </h2>
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs overflow-x-auto text-zinc-300">
            <div className="flex flex-wrap items-center gap-2 text-zinc-400">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-semibold">User Goal</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">LLM Reasoning (Turn 1)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400">Tool Execution ($0.01)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">LLM Evaluation (Turn 2)</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">Total Session Cost</span>
            </div>
          </div>
        </section>

        {/* Why Agent Costs Spiral */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Why agent costs spiral out of control</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Recursive Reasoning Loops',
                desc: 'When an agent fails a tool call or misinterprets an API response, it may retry 10 to 50 times in an automatic feedback loop without human intervention.',
              },
              {
                title: 'Quadratic Context Accumulation',
                desc: 'Each consecutive step carries previous messages, scratchpad thoughts, and JSON payloads. Prompt tokens scale exponentially with every turn.',
              },
              {
                title: 'Unmetered External Tools',
                desc: 'Web scrapers, headless browsers, code execution sandboxes, and vector searches have external costs that are invisible to raw LLM token meters.',
              },
              {
                title: 'No Session-Wide Circuit Breaker',
                desc: 'Traditional per-request timeouts do not stop multi-request workflows from quietly consuming $20.00+ on a single customer action.',
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                <div className="font-semibold text-sm text-white">{item.title}</div>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-turn Code Example (Spec Section 13) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              End-to-End Agent Tracking with Budget Fuses
            </h2>
            <span className="text-xs font-mono text-emerald-400">TypeScript / AI SDK</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre className="text-zinc-300">
{`import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

// 1. Create a bounded session with a hard budget fuse
const session = vibezcheck.session({
  customer: 'enterprise_tenant_9',
  sessionBudgetUSD: 0.50, // Interrupts task if cumulative cost reaches $0.50
});

// 2. Bind the language model to the session budget
const model = session.model('gpt-4o');

// 3. Instrument tools with cost attribution
const tools = session.tools({
  webSearch: {
    description: 'Search the live web',
    costUSD: 0.01,
    execute: async ({ query }) => fetchSearchResults(query),
  },
  executeCode: {
    description: 'Run Python script in isolated Docker sandbox',
    costUSD: 0.03,
    execute: async ({ code }) => runInSandbox(code),
  },
});

// 4. Run multi-turn agent execution with automatic fuse box protection
const result = streamText({
  model,
  tools,
  maxSteps: 8,
  prompt: 'Research electric vehicle subsidy changes and synthesize findings',
});

// If the agent attempts a turn that exceeds $0.50, VibezCheck throws
// VibezCircuitBreakerError before the next inference or tool executes.

console.log('Session Cost:', session.getCurrentCostUSD());
console.log('Total Tokens:', session.getTotalTokens());`}
            </pre>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                <h3 className="text-sm font-semibold text-white">{item.q}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-zinc-900 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Protect your autonomous agents against runaway spend</h3>
            <p className="text-xs text-zinc-400">
              Install the zero-latency TypeScript SDK and add session budgets in under 3 minutes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/llm-cost-calculator"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
            >
              Cost Calculator
            </Link>
            <Link
              href="/docs?section=agent-budgeting"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Agent Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
