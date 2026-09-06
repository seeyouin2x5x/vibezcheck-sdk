export interface DocSection {
  id: string;
  title: string;
  badge?: string;
  items: DocItem[];
}

export interface DocItem {
  slug: string;
  title: string;
  description: string;
  badge?: string;
  category: string;
  content: string;
  headings: { id: string; title: string; level: number }[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    items: [
      {
        slug: 'overview',
        title: 'Overview',
        description: 'The 1-line Stripe Billing and Token Metering engine for LLMs.',
        category: 'Getting Started',
        headings: [
          { id: 'why-vibezcheck', title: 'The 1-Line Standard', level: 2 },
          { id: 'core-philosophy', title: 'Live Cost Economics', level: 2 },
          { id: 'architecture', title: 'React Suite & Receipts', level: 2 },
        ],
        content: `
# Overview

> **vibezcheck** is the declarative, 1-line Stripe Billing and Token Metering engine for LLMs. It tracks tokens, extracts reasoning tokens, computes real-time USD costs, and bills customers with **0ms added latency**.

---

## Why VibezCheck?

Building AI applications with usage-based billing traditionally requires spinning up relational databases, writing complex webhook queues, and buffering stream chunks which slows down response speeds.

**vibezcheck eliminates all that friction:**
* **⚡ 0ms Added Stream Latency**: Passthrough Web Stream transformation with zero middleware buffering.
* **🧠 Thinking & Reasoning Aware**: Extracts and bills hidden reasoning tokens in GPT-5, o1/o3-mini, Claude 3.7 Thinking, and DeepSeek R1.
* **💰 Real-Time USD Cost Engine**: Automatically converts raw token counts into exact dollar amounts with prompt caching discounts.
* **🏢 B2B Multi-Tenancy**: Track usage by organization, team, workspace, user role, and subscription plan.
* **🗄️ Duck-Typed Databases**: Direct auto-save to Supabase (\`database: supabase\`) with zero blast radius.
* **💳 Pluggable Providers**: Works seamlessly with Stripe, Polar, or custom in-house wallets.
* **🆓 Zero-Config Local Mode**: Works 100% free in development with zero Stripe account required.

---

## How It Works (The Mobile Data Analogy)

Think of AI tokens like **mobile phone data (gigabytes)**:
* Every time your user sends a prompt, they consume input data (input tokens).
* When the AI writes a response, it generates output data (output tokens).
* **vibezcheck acts like a digital speedometer:** it measures the exact token count, converts it into real dollars (e.g. $0.0015), and syncs it with your Stripe account automatically.

---

## 0ms Latency Architecture

Traditional proxies sit in the middle of network requests, adding 50–200ms latency. \`vibezcheck\` operates directly inside your Node.js / Next.js process by wrapping the async stream generator:

\`\`\`
Client Request ──► Next.js API Route ──► LLM Provider (OpenAI / Anthropic)
                         │
                         ├── Stream Chunks (0ms passthrough) ──► Browser
                         └── Upon Stream Finish Chunk ────────► Stripe Meter / Supabase / React Telemetry
\`\`\`

---

## Installation

Install \`vibezcheck\` and \`stripe\` in your project:

\`\`\`bash
npm install vibezcheck stripe
# or
pnpm add vibezcheck stripe
\`\`\`
`,
      },
      {
        slug: 'tutorial',
        title: '5-Minute Step-by-Step Tutorial',
        description: 'A complete beginner-friendly tutorial to build and monetize your first AI app from scratch.',
        badge: 'Beginner',
        category: 'Getting Started',
        headings: [
          { id: 'step-1-create-project', title: 'Step 1: Create Your Next.js App', level: 2 },
          { id: 'step-2-install-sdk', title: 'Step 2: Install VibezCheck', level: 2 },
          { id: 'step-3-create-api', title: 'Step 3: Build the Metered AI Route', level: 2 },
          { id: 'step-4-create-ui', title: 'Step 4: Connect the React Chat & Counter', level: 2 },
          { id: 'step-5-test-app', title: 'Step 5: Run and Test Locally', level: 2 },
        ],
        content: `
# 5-Minute Step-by-Step Tutorial

Follow this step-by-step guide to build a fully functional, metered AI chat application with real-time cost tracking and Stripe paywalls.

---

## Step 1: Create Your Next.js App

Open your terminal and create a new Next.js application:

\`\`\`bash
npx create-next-app@latest my-ai-app --typescript --tailwind --app --eslint
cd my-ai-app
\`\`\`

---

## Step 2: Install VibezCheck

Install \`vibezcheck\` along with the Vercel AI SDK and Stripe:

\`\`\`bash
npm install vibezcheck ai @ai-sdk/openai stripe
\`\`\`

---

## Step 3: Build the Metered AI Route

Create a new file at \`app/api/chat/route.ts\`:

\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, user = { id: 'usr_demo_1', email: 'demo@example.com', orgId: 'org_acme' } } = await req.json();

  // ⚡ 1-Line Declarative Model Metering
  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: {
        userId: user.id,
        email: user.email,
        orgId: user.orgId,
        plan: 'pro',
      },
      pricing: { margin: 1.5 }, // 50% profit margin
      safety: { maxCostPerCallUSD: 0.50 }, // Runaway safety circuit breaker
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
\`\`\`

---

## Step 4: Connect the React Chat & Micro-Receipt

In your \`app/page.tsx\`:

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';
import { VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">My Metered AI App</h1>

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded-xl border bg-white">
            <p className="text-sm">{m.content}</p>
            {m.role === 'assistant' && (
              <div className="mt-2">
                <VibezReceipt message={m} />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 p-2 border rounded-xl text-sm"
        />
        <button disabled={isLoading} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold">
          Send
        </button>
      </form>

      <VibezSessionWidget position="bottom-right" theme="light" />
    </div>
  );
}
\`\`\`

---

## Step 5: Run and Test Locally

Add your OpenAI API key to \`.env.local\`:

\`\`\`bash
OPENAI_API_KEY=sk-...
\`\`\`

Start the app:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) and send a message. You will see the **Electric Lime** receipt showing exact tokens and dollar cost with zero added delay!
`,
      },
      {
        slug: 'quickstart',
        title: 'Next.js Quickstart',
        description: 'Start metering LLM streams in Next.js App Router in under 30 seconds.',
        badge: 'Popular',
        category: 'Getting Started',
        headings: [
          { id: 'step-1-install', title: '1. Install Package', level: 2 },
          { id: 'step-2-route', title: '2. Create API Route', level: 2 },
          { id: 'step-3-client', title: '3. Add React Chat Hook', level: 2 },
          { id: 'step-4-widget', title: '4. Add Floating Widget', level: 2 },
        ],
        content: `
# Next.js Quickstart

Get real-time token tracking and Stripe billing live in your Next.js application in 4 easy steps.

---

## 1. Install Package

\`\`\`bash
npm install vibezcheck ai @ai-sdk/openai stripe
\`\`\`

---

## 2. Create Declarative API Route

Create a route handler in \`app/api/chat/route.ts\`:

\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, user } = await req.json();

  // ⚡ 1-Line Declarative Metering
  return streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: {
        id: user.stripeCustomerId,
        userId: user.id,
        email: user.email,
        orgId: user.organizationId,
        plan: 'pro',
      },
      pricing: { margin: 1.4 },   // 40% profit margin
      database: supabase,         // Auto-persists token receipts with 0ms latency
    }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`

---

## 3. Add React Chat Component

Use \`useChat\` or \`useVibezChat\` in \`app/page.tsx\` to stream responses and sync session telemetry:

\`\`\`tsx
'use client';
import { useChat } from 'ai/react';
import { VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-4 mb-6">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <p className="text-slate-900 text-sm">{m.content}</p>
            {m.role === 'assistant' && <VibezReceipt message={m} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2 border rounded-xl text-sm"
        />
        <button type="submit" disabled={isLoading} className="px-5 py-2 bg-black text-white font-bold rounded-xl text-sm">
          Send
        </button>
      </form>

      {/* Floating live token counter & cost speedometer */}
      <VibezSessionWidget theme="light" position="bottom-right" />
    </main>
  );
}
\`\`\`
`,
      },
      {
        slug: 'cli',
        title: 'CLI Suite & Audit',
        description: 'Scan projects for unmetered AI leaks, scaffold routes, and inspect model prices.',
        badge: 'New Audit',
        category: 'Getting Started',
        headings: [
          { id: 'npx-vibezcheck-audit', title: 'npx vibezcheck audit (Codebase Scanner)', level: 2 },
          { id: 'npx-vibezcheck-init', title: 'npx vibezcheck init', level: 2 },
          { id: 'npx-vibezcheck-prices', title: 'npx vibezcheck prices', level: 2 },
          { id: 'npx-vibezcheck-doctor', title: 'npx vibezcheck doctor', level: 2 },
        ],
        content: `
# CLI Suite & Audit (\`npx vibezcheck\`)

The \`vibezcheck\` CLI provides a kind, zero-overhead toolkit to safeguard your credit card, scaffold new AI routes, and inspect real-time model rates.

---

## 1. Codebase Token Leak Scanner (\`npx vibezcheck audit\`)

A kind, sub-40ms audit scanner that inspects your Next.js (\`app/api\`, \`pages/api\`) and Node routes for unmetered LLM calls and missing runaway loop circuit breakers.

\`\`\`bash
npx vibezcheck audit
\`\`\`

### The "Kind" Philosophy:
* **⚡ Zero-Overhead (< 40ms)**: Zero heavy AST dependencies like Babel or TypeScript compiler; pure native Node.js scanning.
* **🛡️ Runaway Fuse Verification**: Verifies that every route has the default \`$0.50\` safety circuit breaker active.
* **Non-Condescending Output**: If everything is protected, prints a calm 2-line confirmation. If unmetered routes exist, shows the exact 1-line before/after diff with line numbers.
* **Non-Destructive Auto-Fix**: Run with \`--fix\` to automatically wrap raw calls in \`vibezcheck()\` with automatic \`.bak\` safety backups.
* **GitHub Actions CI/CD**: Run with \`--ci\` to prevent PRs from introducing unmetered public routes into production.

\`\`\`bash
# Automatically patch all unmetered routes with safety backups
npx vibezcheck audit --fix

# Run in CI/CD pipeline (exits 1 if unmetered routes detected)
npx vibezcheck audit --ci

# Output JSON for custom internal dashboards
npx vibezcheck audit --json
\`\`\`

---

## 2. Project Setup Wizard (\`npx vibezcheck init\`)

\`\`\`bash
npx vibezcheck init
\`\`\`

* Detects Next.js App Router, Pages Router, or Node projects.
* Automatically creates \`.env.local\` with your AI Gateway and Stripe configuration.
* Generates a working streaming route (\`app/api/chat/route.ts\`).

---

## 3. Model Pricing Inspector (\`npx vibezcheck prices\`)

\`\`\`bash
npx vibezcheck prices
\`\`\`

Prints an ASCII table of official prices (per 1M tokens) across 50+ models from OpenAI, Anthropic, Google, DeepSeek, Mistral, and Groq.

---

## 4. System Diagnostics (\`npx vibezcheck doctor\`)

\`\`\`bash
npx vibezcheck doctor
\`\`\`

Checks your Node.js version, detects environment keys (\`STRIPE_SECRET_KEY\`, \`AI_GATEWAY_API_KEY\`), and verifies metering connectivity.
`,
      },
    ],
  },
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    items: [
      {
        slug: 'declarative-api',
        title: 'Declarative 1-Line API',
        description: 'Universal model wrapper supporting string IDs, provider instances, and gateways.',
        category: 'Core Concepts',
        headings: [
          { id: 'syntax', title: '1-Line Syntax', level: 2 },
          { id: 'primitives', title: 'Vercel AI SDK Primitives', level: 2 },
          { id: 'custom-providers', title: 'Custom Provider Instances', level: 2 },
        ],
        content: `
# Declarative 1-Line API

The \`vibezcheck(model, options)\` function acts as a universal decorator for any AI model.

---

## 1-Line Syntax

You can pass a string model identifier or any Vercel AI SDK language model instance:

\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const { text } = await generateText({
  model: vibezcheck('openai/gpt-4o-mini', {
    customer: 'user@example.com',
  }),
  prompt: 'What is love?',
});
\`\`\`

---

## Vercel AI SDK Primitives

\`vibezcheck\` is 100% compatible with all Vercel AI SDK primitives:
* \`generateText({ model, prompt })\`
* \`streamText({ model, messages })\`
* \`generateObject({ model, schema, prompt })\`
* \`streamObject({ model, schema, prompt })\`
* Tool calls & function executions

---

## Custom Provider Instances (\`createOpenAI\`)

If you configure custom headers, organizations, or gateways in \`createOpenAI\`, pass the instance directly:

\`\`\`typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  return streamText({
    model: vibezcheck(openai('gpt-4o-mini'), { customer: 'alex@company.com' }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`
`,
      },
      {
        slug: 'customer-metadata',
        title: 'B2B Multi-Tenancy & Metadata',
        description: 'Track and bill usage across organizations, teams, plans, and custom developer attributes.',
        badge: 'New in v0.4.2',
        category: 'Core Concepts',
        headings: [
          { id: 'structured-customer', title: 'Structured Customer Object', level: 2 },
          { id: 'metadata-flow', title: 'How Metadata Flows', level: 2 },
          { id: 'stripe-sync', title: 'Stripe Customer Metadata Sync', level: 2 },
        ],
        content: `
# B2B Multi-Tenancy & Customer Metadata

In modern SaaS applications, usage is attributed not just to a single email, but across multi-tenant organizations, team workspaces, user roles, and subscription tiers.

---

## Structured Customer Object

You can pass a rich structured customer object directly into \`vibezcheck()\`:

\`\`\`typescript
const result = streamText({
  model: vibezcheck('openai/gpt-4o', {
    customer: {
      id: 'cus_stripe_888',          // Stripe Customer ID or internal userId
      userId: 'usr_founder_01',      // Explicit internal user ID
      email: 'alex@acme.corp',       // Customer email
      name: 'Alex Developer',        // Customer display name
      phone: '+15551234567',         // Customer phone
      orgId: 'org_acme_enterprise',  // Multi-tenant Org ID
      orgName: 'Acme Corp',          // Company name
      teamId: 'team_ai_agents',      // Team / Workspace ID
      role: 'admin',                 // User role (admin, member, owner)
      plan: 'scale',                 // Subscription plan (starter, scale, enterprise)
      tier: 'unlimited',             // Billing tier
      metadata: {                    // Custom arbitrary key-values
        region: 'eu-central-1',
        cost_center: 90210,
        department: 'R&D',
        feature_flag_beta: true,
      },
    },
    database: supabase,
    pricing: { margin: 1.4 },
  }),
  messages,
});
\`\`\`

---

## How Metadata Flows

1. **\`UsageEvent\` Snapshot**: \`event.customer\` retains the full customer profile snapshot.
2. **Database Sink**: Automatically mapped to columns and merged into the JSONB \`metadata\` column in Supabase / PostgreSQL.
3. **Stripe Sync**: Automatically populated in Stripe Customer metadata (\`vibez_user_id\`, \`org_id\`, \`team_id\`, \`plan\`, \`tier\`, \`role\`).

---

## Stripe Customer Metadata Sync

\`\`\`typescript
import { createCustomerManager } from 'vibezcheck';

const manager = createCustomerManager();

// Automatically provisions Stripe customer with all metadata
const { customer } = await manager.getOrCreate({
  userId: 'usr_777',
  email: 'cto@acme.ai',
  name: 'John Doe',
  orgId: 'org_acme',
  plan: 'growth',
  metadata: { seats: 25 },
});

// Update customer metadata when user changes plans
await manager.updateCustomer(customer.id, {
  plan: 'enterprise',
  metadata: { seats: 100 },
});
\`\`\`
`,
      },
      {
        slug: 'profit-margins',
        title: 'Profit Margins & Sane Defaults',
        description: 'Turn wholesale provider costs into guaranteed net profit with zero configuration.',
        badge: 'New in v0.4.2',
        category: 'Core Concepts',
        headings: [
          { id: 'the-margin-engine', title: '1-Line Profit Margin Engine', level: 2 },
          { id: 'the-sane-defaults', title: 'The 6 Sane Defaults', level: 2 },
          { id: 'minimum-charge', title: 'Minimum Charge Floor', level: 2 },
          { id: 'inline-rate-cards', title: '1-Line Inline Rate Cards', level: 2 },
        ],
        content: `
# Profit Margins & Sane Defaults

> *"Don't just show me what OpenAI charges me. Make sure I pocket a 50% profit margin on every single question."*

---

## 1-Line Profit Margin Engine

By default, billing tools calculate raw wholesale provider costs. VibezCheck lets you declare your desired profit margin in one line:

\`\`\`typescript
model: vibezcheck('openai/gpt-4o-mini', {
  customer: 'sarah@acme.com',
  pricing: {
    margin: 1.5,           // 👈 Automatically adds a 50% profit margin!
    minimumChargeUSD: 0.01, // 👈 Minimum charge 1 cent per question
  },
})
\`\`\`

When this runs:
* **OpenAI Wholesale Cost:** \$0.0020
* **Billed to Customer:** \$0.0030 (via Stripe)
* **Net Profit:** \$0.0010 (50% margin)

---

## The 6 Sane Defaults (Active by Default)

When you write \`vibezcheck('model')\`, six critical protections are **active automatically**:

1. **🛡️ $0.50 Safety Fuse Box**: Automatically prevents runaway loops without requiring manual ceilings.
2. **🛟 In-Flight Abort Trapper**: Captures and bills partial tokens even if a user closes their browser tab mid-stream.
3. **🏷️ Automatic 85% Cache Discounts**: Passes real prompt caching savings through to preserve true margins.
4. **🚀 Serverless Lifecycle Protection**: Automatically enqueues flushes via \`after()\` or \`waitUntil()\` so containers never freeze mid-billing.
5. **🔒 Zero Double-Billing**: Generates deterministic SHA-256 idempotency keys on every network event.
6. **🟢 Free Local Vibe Mode**: Works locally with zero Stripe keys without crashing.

---

## Minimum Charge Floor

Use \`minimumChargeUSD\` to round up tiny fractions of a cent so every interaction covers your payment processing minimums:

\`\`\`typescript
pricing: {
  minimumChargeUSD: 0.01 // Every call is at least 1¢
}
\`\`\`

---

## 1-Line Inline Rate Cards

Define custom pricing for newly released, private, or fine-tuned models with zero wait for package updates:

\`\`\`typescript
model: vibezcheck('deepseek/deepseek-r2-preview', {
  rate: {
    in: 0.20,   // $0.20 per 1M input tokens
    out: 0.80,  // $0.80 per 1M output tokens
  },
})
\`\`\`
`,
      },
      {
        slug: 'database-sinks',
        title: 'Duck-Typed Database Sinks',
        description: 'Auto-persist usage receipts to Supabase or PostgreSQL with 0ms added latency.',
        badge: 'New in v0.4.2',
        category: 'Core Concepts',
        headings: [
          { id: 'supabase-direct', title: '1-Line Supabase Integration', level: 2 },
          { id: 'zero-blast-radius', title: 'Zero Blast Radius Protection', level: 2 },
          { id: 'sql-schema', title: 'PostgreSQL & Supabase Table Schema', level: 2 },
        ],
        content: `
# Duck-Typed Database Sinks (Supabase & PostgreSQL)

Save full token breakdown and USD costs into your database with **Zero Added Latency** and **Zero Blast Radius**.

---

## 1-Line Supabase Integration

Simply pass your initialized Supabase client:

\`\`\`typescript
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  return streamText({
    model: vibezcheck('openai/gpt-4o', {
      customer: userId,
      database: supabase, // 👈 Auto-inserts to \`vibez_usage\` table in background
    }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`

---

## Custom Table or Callback

\`\`\`typescript
// Custom table name:
database: { client: supabase, table: 'custom_ai_usage' }

// Or inline callback:
database: async (event) => {
  await db.insert(event);
}
\`\`\`

---

## Zero Blast Radius Protection

All database writes are executed inside isolated background microtasks (\`after()\` / \`waitUntil()\`). If your database experiences a connection timeout or network hiccup, **the user's streaming response is never interrupted**.

---

## PostgreSQL & Supabase Table Schema

\`\`\`sql
CREATE TABLE IF NOT EXISTS vibez_usage (
  id BIGSERIAL PRIMARY KEY,
  customer_id TEXT,
  user_id TEXT,
  model TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'openai',
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cached_tokens INTEGER,
  reasoning_tokens INTEGER,
  cost_usd NUMERIC(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_vibez_usage_customer ON vibez_usage(customer_id);
CREATE INDEX IF NOT EXISTS idx_vibez_usage_created ON vibez_usage(created_at DESC);
\`\`\`
`,
      },
      {
        slug: 'prepaid-postpaid',
        title: 'Prepaid vs. Postpaid Billing',
        description: 'Choose between monthly metered invoices and zero-debt credit wallets with 1 line.',
        category: 'Core Concepts',
        headings: [
          { id: 'the-difference', title: 'Which Model Should You Choose?', level: 2 },
          { id: 'prepaid-mode', title: 'Setting Up Prepaid Credit Wallets', level: 2 },
          { id: 'postpaid-mode', title: 'Setting Up Postpaid Invoices', level: 2 },
        ],
        content: `
# Prepaid vs. Postpaid Billing

VibezCheck supports both billing paradigms with a single configuration toggle:

---

## Which Model Should You Choose?

| Model | Best For | How It Works | Financial Risk |
| :--- | :--- | :--- | :--- |
| **Postpaid** | B2B SaaS, enterprise contracts, internal tools | Monthly metered invoice sent at cycle end. | Possible card decline at month end. |
| **Prepaid** | B2C apps, public signups, self-serve tools | Users buy a \$10 credit pack upfront; deducts in real time; locks at \$0. | **Zero risk.** You get cash before they use 1 token. |

---

## Setting Up Prepaid Credit Wallets

\`\`\`typescript
model: vibezcheck('openai/gpt-4o-mini', {
  customer: 'alex@gmail.com',
  billing: {
    mode: 'prepaid', // 👈 Real-time deduction; locks cleanly at $0
  },
  // Gracefully switch to eco-mode when balance is low:
  fallbackModelOnBudget: 'openai/gpt-4o-mini',
})
\`\`\`

---

## Setting Up Postpaid Invoices

\`\`\`typescript
model: vibezcheck('openai/gpt-4o', {
  customer: 'org_acme_corp',
  billing: {
    mode: 'postpaid', // 👈 Standard Stripe Metered Billing invoice
  },
})
\`\`\`
`,
      },
      {
        slug: 'agent-tools',
        title: 'Agentic Tool Call Metering',
        description: 'Meter external tools (web search, scrapers, sandboxes) and prompts into one invoice.',
        category: 'Core Concepts',
        headings: [
          { id: 'the-agent-problem', title: 'The Multi-Step Agent Problem', level: 2 },
          { id: 'session-envelope', title: 'Using vibezcheck.session()', level: 2 },
        ],
        content: `
# Agentic Tool Call Metering

Autonomous AI agents do more than stream text—they search the web, scrape websites, and run Python sandboxes.

---

## The Multi-Step Agent Problem

A single user request might use \$0.001 in LLM tokens, but execute:
* 1 Google Search (\$0.010)
* 1 Web Scraper (\$0.005)
* 1 Python Sandbox execution (\$0.020)

Total real cost: **\$0.036**. If you only meter the LLM tokens, you lose money on the tools.

---

## Using vibezcheck.session()

Create a scoped customer session to bill prompts and tools together into one customer balance:

\`\`\`typescript
import { generateText, tool } from 'ai';
import { vibezcheck } from 'vibezcheck';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt, customer = 'alex@company.com' } = await req.json();

  // ⚡ 1. Create a unified customer session
  const session = vibezcheck.session({ customer });

  const result = await generateText({
    model: session.model('openai/gpt-4o-mini'),
    tools: {
      searchWeb: tool({
        description: 'Live Google Web Search',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          // ⚡ 2. Bill external tool cost ($0.01) into the same balance
          await session.trackTool('google_search', { costUSD: 0.01 });
          return \`Results for: \${query}\`;
        },
      }),
    },
    prompt,
  });

  return Response.json(result);
}
\`\`\`
`,
      },
      {
        slug: 'reasoning-tokens',
        title: 'Thinking & Reasoning Tokens',
        description: 'Accurately extract and bill hidden reasoning tokens across modern frontier models.',
        badge: 'Essential',
        category: 'Core Concepts',
        headings: [
          { id: 'the-problem', title: 'The Hidden Token Problem', level: 2 },
          { id: 'supported-models', title: 'Supported Reasoning Models', level: 2 },
          { id: 'pricing-breakdown', title: 'Pricing Breakdown Payload', level: 2 },
        ],
        content: `
# Thinking & Reasoning Tokens

Modern reasoning models (OpenAI o1/o3-mini, GPT-5, Claude 3.7 Thinking, DeepSeek R1) generate hundreds or thousands of internal **reasoning/thinking tokens** that are invisible in the final text response but billed by providers at full output rates.

---

## The Hidden Token Problem

If you only count visible output text, a prompt generating 20 words with 4,000 reasoning tokens will cost $0.05 while your meter reports $0.0001—wiping out your profit margins.

\`vibezcheck\` automatically intercepts and extracts hidden reasoning tokens from provider stream details:

\`\`\`json
{
  "usage": {
    "inputTokens": 650,
    "outputTokens": 2400,
    "totalTokens": 3050,
    "reasoningTokens": 2200,
    "visibleOutputTokens": 200
  },
  "cost": {
    "inputCostUSD": 0.000715,
    "outputCostUSD": 0.010560,
    "reasoningCostUSD": 0.009680,
    "totalUSD": 0.011275
  }
}
\`\`\`

---

## Supported Models
* **OpenAI**: \`o1\`, \`o1-mini\`, \`o3\`, \`o3-mini\`, \`gpt-5.6-sol\`
* **Anthropic**: \`claude-3-7-sonnet\` (with Extended Thinking)
* **DeepSeek**: \`deepseek-reasoner\` (R1)
* **Google**: \`gemini-2.0-flash\` (Thinking experimental)
`,
      },
      {
        slug: 'circuit-breakers',
        title: 'Agent Circuit Breakers',
        description: 'Autonomous budget guardrails to protect against runaway recursive loops.',
        badge: 'Safety',
        category: 'Core Concepts',
        headings: [
          { id: 'why-circuit-breakers', title: 'Why Circuit Breakers?', level: 2 },
          { id: 'configuration', title: 'Configuration Options', level: 2 },
          { id: 'trip-handling', title: 'Handling Tripped Budgets', level: 2 },
        ],
        content: `
# Agent Circuit Breakers

When building autonomous agents (loops, multi-step tool calls, subagents), unexpected infinite loops can drain hundreds of dollars in minutes. 

\`vibezcheck\` includes built-in **Agent Circuit Breakers** that enforce hard financial ceilings at the inference layer.

---

## Configuration Options

\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const result = await generateText({
  model: vibezcheck('openai/gpt-4o', {
    customer: 'agent_runner_1',

    // 🛡️ Circuit Breaker 1: Hard cost ceiling per call (default: $0.50)
    maxCostPerCallUSD: 0.50,

    // 🛡️ Circuit Breaker 2: Token limit ceiling
    maxTokensPerCall: 15_000,

    // 🛡️ Circuit Breaker 3: Custom Trip Handler
    onBudgetExceeded: (event) => {
      console.warn(\`⚠️ Circuit Breaker Tripped: \${event.message}\`);
    },

    // 🛡️ Optional: Throw VibezCircuitBreakerError
    throwOnBudgetExceeded: true,
  }),
  prompt: 'Execute deep search over 500 documents...',
});
\`\`\`
`,
      },
    ],
  },
  {
    id: 'react-suite',
    title: 'React Suite',
    items: [
      {
        slug: 'receipt',
        title: '<VibezReceipt />',
        description: 'Drop-in micro-badge for assistant chat bubbles showing verified token counts and costs.',
        badge: 'New',
        category: 'React Suite',
        headings: [
          { id: 'receipt-overview', title: 'Overview', level: 2 },
          { id: 'receipt-usage', title: 'Adding to Assistant Messages', level: 2 },
          { id: 'receipt-props', title: 'Available Props', level: 2 },
        ],
        content: `
# \`<VibezReceipt />\`

A clean, verified micro-badge rendered directly below AI assistant responses. It gives your users radical transparency into the compute power, reasoning time, and exact cost of their answer.

---

## Adding to Assistant Messages

\`\`\`tsx
import { useChat } from 'ai/react';
import { VibezReceipt } from 'vibezcheck/react';

export default function Chat() {
  const { messages } = useChat();

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200">
          <p className="text-slate-900 text-sm">{m.content}</p>

          {/* ⚡ Micro-Receipt on assistant responses */}
          {m.role === 'assistant' && (
            <VibezReceipt
              message={m}
              variant="minimal"
            />
          )}
        </div>
      ))}
    </div>
  );
}
\`\`\`

---

## Available Props

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| \`message\` | \`object\` | \`undefined\` | AI SDK message object with usage annotations |
| \`model\` | \`string\` | \`'ai-model'\` | Explicit model name override |
| \`tokens\` | \`number\` | \`undefined\` | Explicit token count override |
| \`costUSD\` | \`number\` | \`undefined\` | Explicit cost in USD override |
| \`reasoningTokens\` | \`number\` | \`undefined\` | Hidden thinking tokens count |
| \`latencyMs\` | \`number\` | \`undefined\` | Latency in milliseconds |
| \`variant\` | \`'minimal' | 'pill' | 'card'\` | \`'minimal'\` | Visual style variant |
`,
      },
      {
        slug: 'session-widget',
        title: '<VibezSessionWidget />',
        description: 'Floating live token and dollar counter widget with zero database lag.',
        category: 'React Suite',
        headings: [
          { id: 'usage', title: 'Usage', level: 2 },
          { id: 'props', title: 'Component Props', level: 2 },
          { id: 'theming', title: 'Theming (Light & Dark)', level: 2 },
        ],
        content: `
# \`<VibezSessionWidget />\`

A floating real-time telemetry card that displays active session tokens, USD inference cost, and multi-turn request counts.

---

## Usage

\`\`\`tsx
'use client';
import { VibezSessionProvider, VibezSessionWidget } from 'vibezcheck/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VibezSessionProvider>
      {children}
      {/* Floating telemetry widget */}
      <VibezSessionWidget theme="light" position="bottom-right" />
    </VibezSessionProvider>
  );
}
\`\`\`
`,
      },
      {
        slug: 'billing-modal',
        title: '<VibezBillingModal />',
        description: 'In-app credit top-up and paywall modal with 0 external icon dependencies.',
        category: 'React Suite',
        headings: [
          { id: 'overview', title: 'Overview', level: 2 },
          { id: 'code-example', title: 'Code Example', level: 2 },
        ],
        content: `
# \`<VibezBillingModal />\`

An interactive in-app top-up modal that slides in whenever a customer reaches their credit limit or token budget.

---

## Code Example

\`\`\`tsx
'use client';
import { useState } from 'react';
import { VibezBillingModal } from 'vibezcheck/react';

export function TopUpDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Top-Up Modal</button>

      <VibezBillingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notice={{
          status: 'limit_reached',
          tokensUsed: 150000,
          costUSD: 5.00,
          message: 'Free credit quota reached. Add credits to keep streaming!',
        }}
        theme="light"
        testMode={true}
        onTopUp={async (amount) => {
          console.log(\`User selected $\${amount} top-up\`);
        }}
      />
    </div>
  );
}
\`\`\`
`,
      },
    ],
  },
  {
    id: 'stripe-billing',
    title: 'Stripe & Providers',
    items: [
      {
        slug: 'customer-provisioning',
        title: 'Customer Provisioning',
        description: 'Auto-create and manage Stripe customers in 1 line of code.',
        category: 'Stripe & Providers',
        headings: [
          { id: 'get-or-create', title: 'vz.customers.getOrCreate()', level: 2 },
          { id: 'checkout-urls', title: '1-Line Checkout Sessions', level: 2 },
        ],
        content: `
# Customer Provisioning

\`vibezcheck\` eliminates the need to manually query Stripe or sync customer records to a database.

---

## \`vz.customers.getOrCreate()\`

Automatically retrieves existing Stripe customers by email or provisions a new \`cus_test_...\` record with in-memory caching:

\`\`\`typescript
import { vibezcheck } from 'vibezcheck';

const vz = vibezcheck();

// 1. Auto-Provision Customer with rich metadata
const { customer } = await vz.customers.getOrCreate({
  userId: 'usr_123',
  email: 'alex@company.com',
  name: 'Alex Rivera',
  orgId: 'org_acme',
  plan: 'pro',
});
console.log(customer.id); // "cus_R3K7h9Qv..."

// 2. Generate Stripe Checkout Session URL
const checkoutUrl = await vz.billing.createCheckoutSession({
  customerId: customer.id,
  priceId: 'price_metered_tokens',
  returnUrl: 'https://myapp.com/dashboard',
});
\`\`\`
`,
      },
      {
        slug: 'payment-gateways',
        title: 'Pluggable Payment Gateways',
        description: 'Switch between Stripe, Polar.sh, and custom internal wallets.',
        badge: 'New in v0.4.2',
        category: 'Stripe & Providers',
        headings: [
          { id: 'polar-provider', title: 'Polar.sh Gateway', level: 2 },
          { id: 'custom-wallets', title: 'Custom In-House Wallets', level: 2 },
        ],
        content: `
# Pluggable Payment Gateways (Stripe, Polar & Custom Wallets)

VibezCheck is gateway-agnostic. You can bill customers via Stripe, Polar.sh, or your custom internal coin wallet.

---

## Polar.sh Gateway

\`\`\`typescript
model: vibezcheck('gpt-4o', {
  customer: user.id,
  billing: { provider: 'polar' },
})
\`\`\`

---

## Custom In-House Wallets

\`\`\`typescript
model: vibezcheck('gpt-4o', {
  customer: user.id,
  billing: {
    charge: async (costUSD, event) => {
      await userWallet.deduct(event.customerId, costUSD);
    },
  },
})
\`\`\`
`,
      },
    ],
  },
  {
    id: 'pricing-models',
    title: 'Pricing & Models',
    items: [
      {
        slug: 'model-table',
        title: 'Model Pricing Table',
        description: 'Official pricing rates, cache discounts, and reasoning token rates across 50+ models.',
        category: 'Pricing & Models',
        headings: [
          { id: 'pricing-table', title: 'Official Rate Table (USD / 1M Tokens)', level: 2 },
        ],
        content: `
# Model Pricing Table

Rates are updated per **1 Million Tokens** with automatic prompt cache discounts:

| Model Provider | Model ID | Input / 1M | Output / 1M | Cached Input / 1M |
| :--- | :--- | :---: | :---: | :---: |
| **OpenAI** | \`gpt-4o-mini\` | \$0.150 | \$0.600 | \$0.075 |
| **OpenAI** | \`gpt-4o\` | \$2.500 | \$10.000 | \$1.250 |
| **OpenAI** | \`o3-mini\` / \`o1\` | \$1.100 | \$4.400 | \$0.550 |
| **OpenAI** | \`gpt-5.6-sol\` | \$4.000 | \$20.000 | \$0.400 |
| **Anthropic** | \`claude-3-7-sonnet\` | \$0.590 | \$2.930 | \$0.300 |
| **Anthropic** | \`claude-3-5-sonnet\` | \$3.000 | \$15.000 | \$0.300 |
| **Anthropic** | \`claude-3-5-haiku\` | \$0.800 | \$4.000 | \$0.080 |
| **Google** | \`gemini-2.0-flash\` | \$0.100 | \$0.400 | \$0.025 |
| **Google** | \`gemini-1.5-pro\` | \$1.250 | \$5.000 | \$0.313 |
| **DeepSeek** | \`deepseek-chat\` | \$0.220 | \$0.660 | \$0.050 |
| **DeepSeek** | \`deepseek-reasoner\` | \$0.660 | \$1.980 | \$0.150 |
`,
      },
    ],
  },
];

export function getAllDocItems(): DocItem[] {
  return DOC_SECTIONS.flatMap((s) => s.items);
}

export function getDocItemBySlug(slug: string): DocItem | undefined {
  const items = getAllDocItems();
  return items.find((i) => i.slug === slug);
}
