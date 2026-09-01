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
          { id: 'why-vibezcheck', title: 'Why VibezCheck?', level: 2 },
          { id: 'core-philosophy', title: 'Core Philosophy', level: 2 },
          { id: 'architecture', title: '0ms Latency Architecture', level: 2 },
          { id: 'installation', title: 'Installation', level: 2 },
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
* **🆓 Zero-Config Local Mode**: Works 100% free in development with zero Stripe account required.
* **💳 1-Line Stripe Monetization**: Auto-provisions Stripe customers and sends metered billing events out of the box.

---

## 0ms Latency Architecture

Traditional proxies sit in the middle of network requests, adding 50–200ms latency. \`vibezcheck\` operates directly inside your Node.js / Next.js process by wrapping the async stream generator:

\`\`\`
Client Request ──► Next.js API Route ──► LLM Provider (OpenAI / Anthropic)
                         │
                         ├── Stream Chunks (0ms passthrough) ──► Browser
                         └── Upon Stream Finish Chunk ────────► Stripe Meter + React Telemetry
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
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, customer = 'demo@example.com' } = await req.json();

  // ⚡ 1-Line Declarative Metering
  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer,
      onUsage: (event) => {
        console.log(\`⚡ [vibezcheck] Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD.toFixed(6)}\`);
      },
    }),
    messages,
  }).toTextStreamResponse();
}
\`\`\`

---

## 3. Add React Chat Component

Use \`useVibezChat\` in \`app/page.tsx\` to stream responses and sync session telemetry:

\`\`\`tsx
'use client';
import { VibezSessionProvider, useVibezChat, VibezSessionWidget } from 'vibezcheck/react';

function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
    model: 'gpt-4o-mini',
  });

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4 mb-6">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <strong>{m.role === 'user' ? 'You' : 'AI'}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-black text-white rounded-lg">
          Send
        </button>
      </form>

      {/* Floating live token counter & cost widget */}
      <VibezSessionWidget theme="light" position="bottom-right" />
    </main>
  );
}

export default function App() {
  return (
    <VibezSessionProvider>
      <Chat />
    </VibezSessionProvider>
  );
}
\`\`\`
`,
      },
      {
        slug: 'cli',
        title: 'CLI Scaffolder',
        description: 'Scaffold new projects, inspect prices, and run health diagnostics.',
        category: 'Getting Started',
        headings: [
          { id: 'npx-vibezcheck-init', title: 'npx vibezcheck init', level: 2 },
          { id: 'npx-vibezcheck-prices', title: 'npx vibezcheck prices', level: 2 },
          { id: 'npx-vibezcheck-doctor', title: 'npx vibezcheck doctor', level: 2 },
        ],
        content: `
# CLI Scaffolder (\`npx vibezcheck\`)

The \`vibezcheck\` CLI lets you scaffold projects, inspect official model rates, and test environment readiness in seconds.

---

## 1. Project Setup Wizard

\`\`\`bash
npx vibezcheck init
\`\`\`

* Detects Next.js App Router, Pages Router, or Node projects.
* Automatically creates \`.env.local\` with your AI Gateway and Stripe configuration.
* Generates a working streaming route (\`app/api/chat/route.ts\`).

---

## 2. Model Pricing Inspector

\`\`\`bash
npx vibezcheck prices
\`\`\`

Prints an ASCII table of official prices (per 1M tokens) across 50+ models from OpenAI, Anthropic, Google, DeepSeek, Mistral, and Groq.

---

## 3. System Diagnostics

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
  }).toTextStreamResponse();
}
\`\`\`
`,
      },
      {
        slug: 'reasoning-tokens',
        title: 'Thinking & Reasoning Tokens',
        description: 'Accurately extract and bill hidden reasoning tokens across modern frontier models.',
        badge: 'New',
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
    "inputUSD": 0.000715,
    "outputUSD": 0.010560,
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

    // 🛡️ Circuit Breaker 1: Hard cost ceiling per call
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

---

## How It Works

1. During stream generation, \`vibezcheck\` calculates accumulating token counts and real-time USD costs.
2. If the threshold is crossed, \`vibezcheck\` halts execution immediately, preventing further provider token spend and alerting your backend.
`,
      },
    ],
  },
  {
    id: 'react-suite',
    title: 'React Suite',
    items: [
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

---

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| \`theme\` | \`'light' \| 'dark' \| 'auto'\` | \`'auto'\` | Visual theme |
| \`position\` | \`'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'\` | \`'bottom-right'\` | Screen corner anchor |
| \`collapsed\` | \`boolean\` | \`false\` | Initial collapsed state |
| \`showCost\` | \`boolean\` | \`true\` | Display USD cost metric |
| \`showTokens\` | \`boolean\` | \`true\` | Display total token metric |
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
          { id: 'props', title: 'Component Props', level: 2 },
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
    title: 'Stripe & Billing',
    items: [
      {
        slug: 'customer-provisioning',
        title: 'Customer Provisioning',
        description: 'Auto-create and manage Stripe customers in 1 line of code.',
        category: 'Stripe & Billing',
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

// 1. Auto-Provision Customer
const customer = await vz.customers.getOrCreate({
  email: 'alex@company.com',
  name: 'Alex Rivera',
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
          { id: 'custom-models', title: 'Registering Custom Models', level: 2 },
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
