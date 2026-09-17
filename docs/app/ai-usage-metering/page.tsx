import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import {
  Activity,
  Layers,
  Database,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Radio,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Usage Metering SDK for TypeScript | VibezCheck',
  description:
    'High-throughput AI usage metering SDK for TypeScript. Convert token telemetry into dollar costs with zero latency overhead and customer attribution.',
  alternates: {
    canonical: 'https://vibezcheck.app/ai-usage-metering',
  },
  openGraph: {
    title: 'AI Usage Metering SDK for TypeScript | VibezCheck',
    description:
      'Meter AI requests, tokens, and dollar costs at the application layer with 0ms added latency.',
    url: 'https://vibezcheck.app/ai-usage-metering',
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is AI usage metering?',
    a: 'AI usage metering is the automated measurement of computational resources consumed by AI requests—including prompt tokens, completion tokens, prompt cache discounts, and external tool calls—denominated in both token units and real dollar costs.',
  },
  {
    q: 'How does in-process metering compare to an AI proxy or gateway?',
    a: 'An AI proxy sits between your server and the LLM provider, adding a network hop (often 30ms to 150ms+ of latency), creating a single point of operational failure, and requiring you to share provider API keys. VibezCheck operates in-process inside your TypeScript runtime, inspecting native stream chunks with 0ms network latency and zero credential sharing.',
  },
  {
    q: 'How does VibezCheck handle prompt caching and reasoning tokens?',
    a: 'VibezCheck reads raw provider usage objects (including OpenAI cached_tokens/completion_tokens_details and Anthropic cache_read_input_tokens). It applies accurate cache discounts (typically 50% to 90% cheaper) and rates reasoning tokens according to provider tier cards.',
  },
  {
    q: 'What database adapters are supported out of the box?',
    a: 'VibezCheck provides built-in adapters for Supabase (createSupabaseAdapter), Metronome (createMetronomeAdapter), and custom Postgres/SQL storage via createDatabaseAdapter. You can also listen to events directly via the onUsage callback.',
  },
];

export default function AiUsageMeteringPage() {
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
          <span className="text-emerald-400">AI Usage Metering</span>
        </nav>

        {/* Hero & Opening AEO Answer (Spec Section 14) */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400">
            APPLICATION-LAYER TELEMETRY
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI usage metering for applications.
          </h1>
          {/* Direct Answer Box */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-sm sm:text-base text-zinc-200 leading-relaxed">
            <strong className="text-white">AI usage metering</strong> is the process of capturing, aggregating, and pricing the computational resources—specifically prompt, completion, cached tokens, and tool calls—consumed by AI workloads. VibezCheck meters AI usage at the application layer with zero network latency, producing immutable usage events for billing and observability.
          </div>
        </header>

        {/* Token Metering vs Dollar Metering */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Token Metering vs. Dollar Metering
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Raw Token Metering</div>
              <div className="text-lg font-bold text-zinc-300">Counts tokens, misses economics</div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Raw tokens cannot be added together across different models. 100k tokens of GPT-4o-mini is $0.015, while 100k tokens of Claude 3.5 Sonnet is $0.30, and 100k reasoning tokens of o1 is $6.00. Token counts alone leave finance and product teams blind.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Dollar-Denominated Metering</div>
              <div className="text-lg font-bold text-white">Translates usage into business metrics</div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                VibezCheck calculates exact micro-dollar provider cost and customer retail price at runtime. Usage events are immediately compatible with invoicing engines, database ledgers, customer balances, and margin analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Metering Dimensions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Multi-Dimensional Telemetry Dimensions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Per-Request Metering</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Captures prompt, completion, reasoning, and cached tokens per invocation with sub-millisecond precision.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Per-Customer Attribution</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Binds requests to user IDs, organizations, enterprise workspaces, and subscription tier plans.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Per-Feature Tagging</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Tag telemetry by feature (e.g. smart-search, code-generation, auto-summary) to track feature-level unit economics.
              </p>
            </div>
          </div>
        </section>

        {/* Code Example: Telemetry Pipeline */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Application-Layer Metering in 1 Line
            </h2>
            <span className="text-xs font-mono text-emerald-400">Zero Proxy Overhead</span>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre className="text-zinc-300">
{`import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

// Wrap any Vercel AI SDK model with rich customer & feature metadata
const result = streamText({
  model: vibezcheck('anthropic/claude-3-5-sonnet', {
    customer: {
      id: 'org_acme_corp',
      plan: 'enterprise_annual',
    },
    metadata: {
      feature: 'document_intelligence',
      environment: 'production',
    },
    onUsage: async (event) => {
      // Non-blocking telemetry event emitted as soon as stream concludes
      console.log('Provider Cost: $' + event.cost.totalUSD);
      console.log('Prompt Tokens: ' + event.usage.promptTokens);
      console.log('Cached Tokens: ' + event.usage.cachedPromptTokens);

      // Persist to your database or billing platform
      await db.aiUsageEvents.insert({
        customerId: event.customerId,
        model: event.model,
        costUSD: event.cost.totalUSD,
        tokens: event.usage.totalTokens,
        timestamp: new Date(event.timestamp),
      });
    },
  }),
  prompt: 'Analyze this balance sheet and identify key capital expenditures',
});`}
            </pre>
          </div>
        </section>

        {/* Architecture Comparison: In-Process vs Proxy */}
        <section className="space-y-4 p-7 rounded-2xl bg-zinc-900/70 border border-zinc-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span>Why in-process metering wins for production</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-300 pt-2">
            <div className="space-y-2">
              <div className="font-bold text-white text-sm">VibezCheck (In-Process Engine)</div>
              <ul className="space-y-1.5 text-zinc-400 list-disc list-inside">
                <li>0ms added network latency</li>
                <li>No third-party proxy point of failure</li>
                <li>Provider credentials stay safely in your environment</li>
                <li>Runs natively in Node, Bun, and Edge functions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-zinc-400 text-sm">Traditional API Proxy Gateways</div>
              <ul className="space-y-1.5 text-zinc-500 list-disc list-inside">
                <li>Adds 30ms – 150ms network hop on every request</li>
                <li>Proxy downtime takes down your entire AI application</li>
                <li>Requires handing master API keys to an external vendor</li>
                <li>Regional routing and egress bandwidth costs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
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
            <h3 className="text-lg font-bold text-white">Meter your application usage today</h3>
            <p className="text-xs text-zinc-400">
              Zero network latency. Sub-cent accuracy. Instant customer attribution.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/ai-cost-monitoring"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
            >
              Cost Monitoring
            </Link>
            <Link
              href="/docs?section=quickstart"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
