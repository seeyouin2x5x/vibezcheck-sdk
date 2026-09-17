import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { FooterSection } from '@/components/footer-section';
import {
  CreditCard,
  Percent,
  Coins,
  ShieldCheck,
  TrendingUp,
  Layers,
  ArrowRight,
  CheckCircle2,
  Receipt,
  Scale,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Usage-Based Billing Infrastructure | VibezCheck',
  description:
    'Connect LLM token usage to customer billing. Enforce margins, track customer balances, and export metered AI usage events to Stripe, Lago, or Metronome.',
  alternates: {
    canonical: 'https://vibezcheck.app/ai-usage-based-billing',
  },
  openGraph: {
    title: 'AI Usage-Based Billing Infrastructure | VibezCheck',
    description:
      'Turn raw AI requests into customer invoices and guaranteed gross margins with in-process metering.',
    url: 'https://vibezcheck.app/ai-usage-based-billing',
  },
};

const FAQ_ITEMS = [
  {
    q: 'Is VibezCheck a payment processor or merchant of record?',
    a: 'No. VibezCheck is the metering, pricing, and margin intelligence engine that runs in your application code. It computes costs and customer retail pricing at micro-cent resolution, then dispatches usage events into your existing billing provider (such as Stripe, Metronome, Lago, or your PostgreSQL database).',
  },
  {
    q: 'How do I guarantee positive gross margins on AI features?',
    a: 'By using VibezCheck pricing rules with markup multipliers (e.g. markupMultiplier: 1.4 for a 40% markup) or fixed fee markups. VibezCheck calculates provider cost and customer billed price simultaneously, ensuring that every request generates your required margin.',
  },
  {
    q: 'Can I enforce prepaid credit balances before generating AI output?',
    a: 'Yes. You can verify the customer credit balance before the call, set maxCostPerCallUSD or sessionBudgetUSD to the remaining balance, and halt execution automatically before unbacked tokens are consumed.',
  },
  {
    q: 'Can I export usage events directly to Stripe Metered Billing?',
    a: 'Yes. In the onUsage callback or database adapter, you can pass event.cost.retailUSD or event.usage.totalTokens directly to Stripe Meter Events API (stripe.billing.meterEvents.create).',
  },
];

export default function AiUsageBasedBillingPage() {
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
    <main className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-[#0c0d10] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <article className="flex-1 max-w-4xl mx-auto px-4 pt-28 pb-20 w-full space-y-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs font-mono text-slate-500 dark:text-zinc-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-zinc-300">Home</Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400">AI Usage-Based Billing</span>
        </nav>

        {/* Hero & Opening AEO Answer (Spec Section 15) */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
            REVENUE & MONETIZATION
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-tight">
            Connect AI usage to customer billing.
          </h1>
          {/* Direct Answer Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-sm sm:text-base text-slate-700 dark:text-zinc-200 leading-relaxed shadow-xs">
            <strong className="text-slate-950 dark:text-white">AI usage-based billing</strong> charges end customers based on the computational cost or token volume of their AI interactions. VibezCheck bridges the gap between raw provider costs (OpenAI, Anthropic, Google) and customer pricing models—such as marked-up pass-through, prepaid credit balances, or tiered feature quotas.
          </div>
        </header>

        {/* The AI Billing Architecture */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            The AI Billing Pipeline
          </h2>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800/80 font-mono text-xs overflow-x-auto text-slate-800 dark:text-zinc-300 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-zinc-400">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-950 dark:text-white font-semibold">AI Request</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400">VibezCheck Meter</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400">Markup / Credits</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400">Usage Event</span>
              <span>→</span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold">Stripe / Customer Invoice</span>
            </div>
          </div>
        </section>

        {/* Pricing Models Supported */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Common AI Pricing & Monetization Models
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-semibold text-sm text-slate-950 dark:text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Cost-Plus Margin Markup</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Pass through provider inference costs with an automatic multiplier (e.g. 1.35x for 35% margin), ensuring every request is profitable.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-semibold text-sm text-slate-950 dark:text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Prepaid Credit Wallets</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Users buy token or dollar credit packs upfront. VibezCheck decrements balances in real time and halts requests when credits reach zero.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 space-y-2 shadow-2xs">
              <div className="font-semibold text-sm text-slate-950 dark:text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Subscription Tier Quotas</span>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Include a monthly AI allowance ($15 included compute), then bill overages automatically via Stripe Metered Billing.
              </p>
            </div>
          </div>
        </section>

        {/* Code Example: Pricing Rules and Stripe Metering */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Markup Rules & Billing Integration
            </h2>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">TypeScript / AI SDK</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0d0e12] border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-sm">
            <pre className="text-zinc-300">
{`import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Configure model with custom retail margin markup
const result = streamText({
  model: vibezcheck('openai/gpt-4o', {
    customer: 'cus_stripe_12345',
    pricing: {
      markupMultiplier: 1.35, // 35% margin on top of provider rates
      minCostPerCallUSD: 0.002, // Minimum fee per call
    },
    onUsage: async (event) => {
      // event.cost.totalUSD  -> Provider Cost (e.g. $0.00240)
      // event.cost.retailUSD -> Customer Billed Price (e.g. $0.00324)

      // Send to Stripe Metered Billing
      await stripe.billing.meterEvents.create({
        event_name: 'ai_inference_cost_microcents',
        payload: {
          stripe_customer_id: event.customerId,
          value: Math.round(event.cost.retailUSD * 100_000), // micro-cents
        },
      });
    },
  }),
  prompt: 'Generate an executive summary for this 20-page document',
});`}
            </pre>
          </div>
        </section>

        {/* Clear Boundary: VibezCheck vs Merchant of Record */}
        <section className="space-y-4 p-7 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <span>Metering engine, not a merchant of record</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 space-y-3 leading-relaxed">
            <p>
              VibezCheck does not sit between your customers and your bank account. You retain 100% control over your tax compliance, merchant accounts, and invoicing platform.
            </p>
            <p>
              VibezCheck provides the essential missing link: the high-resolution, model-aware computational meter that transforms tokens into verified dollars so your billing stack can bill accurately.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="p-5 rounded-xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 space-y-2 shadow-2xs">
                <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{item.q}</h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/40 dark:to-zinc-900 border border-emerald-500/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Monetize your AI product with guaranteed margins</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400">
              Calculate retail prices, export to Stripe, and stop subsidizing user compute.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/llm-cost-calculator"
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-medium transition border border-slate-200 dark:border-zinc-700"
            >
              Cost Calculator
            </Link>
            <Link
              href="/docs?section=usage-based-billing"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white dark:text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Billing Documentation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>

      <FooterSection />
    </main>
  );
}
