import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import {
  DollarSign,
  Users,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Cost Monitoring for Developers | VibezCheck',
  description:
    'Monitor AI request costs in real dollars. Track LLM usage by customer, model, feature, and agent session without routing requests through a third-party proxy.',
  alternates: {
    canonical: 'https://vibezcheck.app/ai-cost-monitoring',
  },
  openGraph: {
    title: 'AI Cost Monitoring for Developers | VibezCheck',
    description:
      'Monitor AI request costs in real dollars. Track LLM usage by customer, model, feature, and agent session in-process.',
    url: 'https://vibezcheck.app/ai-cost-monitoring',
  },
};

export default function AiCostMonitoringPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#0c0d10] text-zinc-100">
      <Header />

      <article className="flex-1 max-w-4xl mx-auto px-4 pt-28 pb-20 w-full space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-zinc-300">Home</Link>
          <span>/</span>
          <span className="text-emerald-400">AI Cost Monitoring</span>
        </nav>

        {/* Hero & Opening AEO Answer (Spec Section 10) */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            IN-PROCESS AI FINOPS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI cost monitoring that runs inside your application.
          </h1>
          {/* Opening AEO Answer Box */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sm sm:text-base text-zinc-200 leading-relaxed">
            <strong className="text-white">AI cost monitoring</strong> is the process of measuring the provider cost of AI model requests and associating that cost with the application action that caused it. VibezCheck provides this measurement in-process for TypeScript applications.
          </div>
        </header>

        {/* What AI Cost Monitoring Should Tell You */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            What AI cost monitoring should tell you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { q: 'What did this request cost?', a: 'Calculate exact micro-dollar provider cost from prompt, completion, cached, and reasoning usage.' },
              { q: 'Which model generated the cost?', a: 'Track spending across GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek R1, and local models.' },
              { q: 'Which customer caused it?', a: 'Attribute usage directly to user IDs, enterprise workspaces, and billing accounts.' },
              { q: 'Which feature caused it?', a: 'Tag telemetry by featureId (e.g. smart-search, summary-v2, chat, code-review).' },
              { q: 'How much did this agent session spend?', a: 'Measure cumulative multi-turn costs across recursive agent loops and tool calls.' },
              { q: 'Can the request exceed its budget?', a: 'Enforce hard caps in the execution path before costs spiral into unexpected cloud invoices.' },
            ].map((item) => (
              <div key={item.q} className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                <div className="font-semibold text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{item.q}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Token Counts Are Not Enough */}
        <section className="space-y-4 p-7 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <span>Why token counts are not enough</span>
          </h2>
          <div className="text-xs sm:text-sm text-zinc-300 space-y-3 leading-relaxed">
            <p>
              Token counts are raw engineering units. A million tokens of DeepSeek R1 cost $0.55, while a million output tokens of OpenAI o1 cost $60.00.
            </p>
            <p>
              Furthermore, modern providers introduce complex rate structures: prompt cache discounts (50% to 90% cheaper), reasoning tokens billed at output rates, and multimodal tokens. Without model-aware financial math, raw token counters cannot tell you whether a user interaction was profitable or bankrupting.
            </p>
            <div className="pt-2 font-mono text-xs text-emerald-400">
              VibezCheck translates tokens + model rates + discounts → real dollars.
            </div>
          </div>
        </section>

        {/* Track Cost by Customer */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Track cost by customer & tenant</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Attach identifiers in the application path. Every telemetry event carries full organizational context for granular ledger reporting:
          </p>

          <div className="rounded-xl border border-zinc-800 bg-[#0d0e12] overflow-hidden p-5 font-mono text-xs text-zinc-200 leading-relaxed">
            <pre>
{`import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: 'tenant_enterprise_42',
    organization: 'acme_corp',
    featureId: 'smart_contracts_audit',
    threadId: 'session_8921_abc',
    maxCostPerCallUSD: 0.25,
  }),
  prompt: contractText,
});`}
            </pre>
          </div>
        </section>

        {/* Control Runaway Spend */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Control runaway spend</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Autonomous agents and recursive tool loops can generate hundreds of API requests in seconds. VibezCheck stops runaway loops with in-process limits like <code className="font-mono text-xs bg-zinc-800 px-1 py-0.5 rounded text-amber-300">maxCostPerCallUSD</code> and multi-step session ceilings:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="font-bold text-sm text-white">Request-Level Fuse</div>
              <p className="text-xs text-zinc-400">
                Instantly terminates model calls that exceed your allocated dollar ceiling.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="font-bold text-sm text-white">Agent Session Budget</div>
              <p className="text-xs text-zinc-400">
                Tracks cumulative spend across model and tool invocations with a hard stop.
              </p>
            </div>
          </div>
        </section>

        {/* Connect Cost to Billing */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Connect cost to billing</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Once your application measures provider cost, you can feed those events into Stripe, Metronome, or your billing database to monetize AI usage.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/ai-usage-based-billing"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>Explore AI usage-based billing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-zinc-600">·</span>
            <Link
              href="/llm-cost-calculator"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              <span>Try LLM Cost Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-zinc-800 space-y-4">
          <h3 className="text-2xl font-bold text-white">
            Start measuring AI cost today
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            One line to wrap your model. Zero added latency. Zero proxy hop.
          </p>
          <div className="pt-2">
            <Link
              href="/docs?section=quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 text-sm font-bold hover:bg-slate-100 transition shadow-xs"
            >
              Start measuring AI cost →
            </Link>
          </div>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
