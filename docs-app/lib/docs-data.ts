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
        description: 'Learn how vibezcheck makes AI token metering and Stripe billing as easy as 1 line of code.',
        category: 'Getting Started',
        headings: [
          { id: 'what-is-vibezcheck', title: 'What is VibezCheck?', level: 2 },
          { id: 'how-it-works', title: 'How It Works (The Mobile Data Analogy)', level: 2 },
          { id: 'why-it-matters', title: 'Why You Need It', level: 2 },
          { id: 'zero-latency', title: '0ms Added Latency Guarantee', level: 2 },
        ],
        content: `
# Overview

> **vibezcheck** is the simplest way to add Stripe billing and token metering to any AI app. You write 1 line of code, and vibezcheck tracks prompt tokens, calculates dollar costs in real time, and sends usage to Stripe with **zero added latency**.

## What is VibezCheck?

When you build an AI app using models like GPT-4o, Claude 3.7, or Gemini, AI providers charge you for every token your users generate. 

If you want to charge your users for their AI usage or give them a monthly credit budget, you normally have to:
1. Set up a database and table schemas to log every token.
2. Build custom webhook listeners and background queues.
3. Buffer AI streams in intermediate proxies (which slows down response time).

**vibezcheck replaces all of that with a single line of code.**

## How It Works (The Mobile Data Analogy)

Think of AI tokens like **mobile phone data (gigabytes)**:
* Every time your user sends a prompt, they consume a small amount of data (input tokens).
* When the AI writes a response, it generates output data (output tokens).
* **vibezcheck acts like a digital speedometer:** it measures the exact token count, converts it into real dollars (e.g. $0.0015), and syncs it with your Stripe account automatically.

## Why You Need It

* **⚡ Zero Latency Overhead**: Streams pass directly from OpenAI/Anthropic to the user's browser with 0ms buffering delay.
* **🧠 Reasoning Token Aware**: Accurately tracks hidden thinking tokens in GPT-5, o3-mini, and Claude 3.7 that traditional counters miss.
* **🛡️ Runaway Loop Protection**: Built-in circuit breakers halt runaway AI loops before they drain your bank account.
* **💳 Instant Monetization**: Automatically provisions Stripe customers and sends metered billing events without writing backend cron jobs.
* **🆓 100% Free in Local Development**: Works out of the box with zero Stripe keys required for local testing.
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

## Step 1: Create Your Next.js App

Open your terminal and create a new Next.js application:

\`\`\`bash
npx create-next-app@latest my-ai-app --typescript --tailwind --app --eslint
cd my-ai-app
\`\`\`

## Step 2: Install VibezCheck

Install \`vibezcheck\` along with the Vercel AI SDK:

\`\`\`bash
npm install vibezcheck ai @ai-sdk/openai stripe
\`\`\`

## Step 3: Build the Metered AI Route

Create a new file at \`app/api/chat/route.ts\`. This is where the AI streams responses and vibezcheck counts tokens:

\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, customer = 'demo@example.com' } = await req.json();

  // ⚡ 1-Line Model Meter with Sane Defaults ($0.50 fuse, abort trapper, 0ms lag)
  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer,
      pricing: {
        margin: 1.5, // 50% profit margin automatically added!
      },
      onUsage: (event) => {
        console.log(\`✅ Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD.toFixed(6)}\`);
      },
    }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`

## Step 4: Connect the React Chat & Counter

Open \`app/page.tsx\` and paste this simple 1-hook chat interface with live receipt:

\`\`\`tsx
// app/page.tsx
'use client';
import { useVibezChat, VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
    api: '/api/chat',
    customer: 'demo@example.com',
  });

  return (
    <main className="max-w-xl mx-auto py-10 px-4 space-y-6">
      {/* 1. Floating live token & dollar counter */}
      <VibezSessionWidget position="bottom-right" />

      {/* 2. Messages List with verified AI receipts */}
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200">
            <p className="text-slate-900 text-sm">{m.content}</p>

            {/* Micro-Receipt under assistant answers */}
            {m.role === 'assistant' && <VibezReceipt message={m} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold text-sm"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </main>
  );
}
\`\`\`

## Step 5: Run and Test Locally

Start your development server on port 3002:

\`\`\`bash
npm run dev -- -p 3002
\`\`\`

Visit \`http://localhost:3002\` and ask a question. Notice how the speedometer counts tokens and displays the micro-receipt with zero latency!
`,
      },
      {
        slug: 'quickstart',
        title: 'Quickstart Guide',
        description: 'Fast 3-minute setup guide to add VibezCheck to an existing project.',
        category: 'Getting Started',
        headings: [
          { id: 'quick-install', title: '1. Install Package', level: 2 },
          { id: 'quick-route', title: '2. Wrap Model in API Route', level: 2 },
          { id: 'quick-client', title: '3. Add Telemetry Hook', level: 2 },
        ],
        content: `
# Quickstart Guide

Add VibezCheck to any existing Next.js application in less than 3 minutes.

## 1. Install Package

\`\`\`bash
npm install vibezcheck ai @ai-sdk/openai stripe
\`\`\`

## 2. Wrap Model in API Route

\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, userEmail = 'user@example.com' } = await req.json();

  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', { customer: userEmail }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`

## 3. Add Telemetry Hook

\`\`\`tsx
// app/page.tsx
'use client';
import { useVibezChat, VibezSessionWidget } from 'vibezcheck/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useVibezChat();

  return (
    <div>
      <VibezSessionWidget />
      {/* Your chat messages and input form */}
    </div>
  );
}
\`\`\`
`,
      },
      {
        slug: 'cli',
        title: 'CLI Scaffolder',
        description: 'Command line tools for project initialization and rate inspection.',
        category: 'Getting Started',
        headings: [
          { id: 'cli-init', title: 'npx vibezcheck init', level: 2 },
          { id: 'cli-prices', title: 'npx vibezcheck prices', level: 2 },
          { id: 'cli-doctor', title: 'npx vibezcheck doctor', level: 2 },
        ],
        content: `
# CLI Scaffolder

VibezCheck includes helpful terminal commands to initialize templates, inspect live rate cards, and verify your environment.

## npx vibezcheck init

Scaffolds a production-ready Next.js + Stripe AI template in seconds:

\`\`\`bash
npx vibezcheck init
\`\`\`

## npx vibezcheck prices

Displays current provider token rates, reasoning multipliers, and cache discounts in your terminal:

\`\`\`bash
npx vibezcheck prices
\`\`\`

## npx vibezcheck doctor

Verifies Node.js version, environment keys (\`STRIPE_SECRET_KEY\`), and tests connectivity:

\`\`\`bash
npx vibezcheck doctor
\`\`\`
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
        description: 'Universal wrapper supporting string model IDs, provider instances, and inline rate cards.',
        category: 'Core Concepts',
        headings: [
          { id: 'string-identifiers', title: 'Using String Model IDs', level: 2 },
          { id: 'provider-instances', title: 'Using Custom Provider Instances', level: 2 },
          { id: 'inline-rates', title: 'Inline Custom Rates (Zero Wait for npm)', level: 2 },
          { id: 'ai-primitives', title: 'Compatibility with AI Primitives', level: 2 },
        ],
        content: `
# Declarative 1-Line API

The core philosophy of \`vibezcheck\` is **zero friction**: you should never have to rewrite your AI logic or switch to a proprietary SDK.

## Using String Model IDs

Pass any supported model identifier as a string:

\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const { text } = await generateText({
  model: vibezcheck('openai/gpt-4o-mini', { customer: 'user@example.com' }),
  prompt: 'Explain photosynthesis in 1 sentence.',
});
\`\`\`

## Using Custom Provider Instances

If you have custom gateway endpoints, base URLs, or organization headers, pass your provider instance directly:

\`\`\`typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'alex@company.com',
});
\`\`\`

## Inline Custom Rates (Zero Wait for npm)

When a brand-new model launches today, pass its pricing inline with zero wait for package updates:

\`\`\`typescript
model: vibezcheck('deepseek/deepseek-r2-preview', {
  rate: { in: 0.20, out: 0.80 }, // $0.20/M in, $0.80/M out
})
\`\`\`

## Compatibility with AI Primitives

\`vibezcheck\` works seamlessly with every Vercel AI SDK method:
* \`generateText()\` — Single-turn text generation
* \`streamText()\` — Multi-turn streaming responses
* \`generateObject()\` — Structured JSON generation with Zod
* \`streamObject()\` — Streaming structured JSON
* Function calls & multi-step tool loops
`,
      },
      {
        slug: 'profit-margins',
        title: 'Profit Margins & Sane Defaults',
        description: 'Turn wholesale provider costs into guaranteed net profit with zero configuration.',
        badge: 'New',
        category: 'Core Concepts',
        headings: [
          { id: 'the-margin-engine', title: '1-Line Profit Margin Engine', level: 2 },
          { id: 'the-sane-defaults', title: 'The 6 Sane Defaults', level: 2 },
          { id: 'minimum-charge', title: 'Minimum Charge Floor', level: 2 },
        ],
        content: `
# Profit Margins & Sane Defaults

> *"Don't just show me what OpenAI charges me. Make sure I pocket a 50% profit margin on every single question."*

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

## The 6 Sane Defaults (Active by Default)

When you write \`vibezcheck('model')\`, six critical protections are **active automatically**:

1. **🛡️ $0.50 Safety Fuse Box**: Automatically prevents runaway loops without requiring manual ceilings.
2. **🛟 In-Flight Abort Trapper**: Captures and bills partial tokens even if a user closes their browser tab mid-stream.
3. **🏷️ Automatic 85% Cache Discounts**: Passes real prompt caching savings through to preserve true margins.
4. **🚀 Serverless Lifecycle Protection**: Automatically enqueues flushes via \`after()\` or \`waitUntil()\` so containers never freeze mid-billing.
5. **🔒 Zero Double-Billing**: Generates deterministic SHA-256 idempotency keys on every network event.
6. **🟢 Free Local Vibe Mode**: Works locally with zero Stripe keys without crashing.

## Minimum Charge Floor

Use \`minimumChargeUSD\` to round up tiny fractions of a cent so every interaction covers your payment processing minimums:

\`\`\`typescript
pricing: {
  minimumChargeUSD: 0.01 // Every call is at least 1¢
}
\`\`\`
`,
      },
      {
        slug: 'prepaid-postpaid',
        title: 'Prepaid vs. Postpaid Billing',
        description: 'Choose between monthly metered invoices and zero-debt credit wallets with 1 line.',
        badge: 'New',
        category: 'Core Concepts',
        headings: [
          { id: 'the-difference', title: 'Which Model Should You Choose?', level: 2 },
          { id: 'prepaid-mode', title: 'Setting Up Prepaid Credit Wallets', level: 2 },
          { id: 'postpaid-mode', title: 'Setting Up Postpaid Invoices', level: 2 },
        ],
        content: `
# Prepaid vs. Postpaid Billing

VibezCheck supports both billing paradigms with a single configuration toggle:

## Which Model Should You Choose?

| Model | Best For | How It Works | Financial Risk |
| :--- | :--- | :--- | :--- |
| **Postpaid** | B2B SaaS, enterprise contracts, internal tools | Monthly metered invoice sent at cycle end. | Possible card decline at month end. |
| **Prepaid** | B2C apps, public signups, self-serve tools | Users buy a \$10 credit pack upfront; deducts in real time; locks at \$0. | **Zero risk.** You get cash before they use 1 token. |

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
        badge: 'New',
        category: 'Core Concepts',
        headings: [
          { id: 'the-agent-problem', title: 'The Multi-Step Agent Problem', level: 2 },
          { id: 'session-envelope', title: 'Using vibezcheck.session()', level: 2 },
        ],
        content: `
# Agentic Tool Call Metering

Autonomous AI agents do more than stream text—they search the web, scrape websites, and run Python sandboxes.

## The Multi-Step Agent Problem

A single user request might use \$0.001 in LLM tokens, but execute:
* 1 Google Search (\$0.010)
* 1 Web Scraper (\$0.005)
* 1 Python Sandbox execution (\$0.020)

Total real cost: **\$0.036**. If you only meter the LLM tokens, you lose money on the tools.

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
        description: 'Understand how hidden reasoning tokens work and why they must be billed accurately.',
        badge: 'Essential',
        category: 'Core Concepts',
        headings: [
          { id: 'the-reasoning-problem', title: 'The Hidden Token Problem Explained', level: 2 },
          { id: 'how-vibezcheck-solves-it', title: 'How VibezCheck Solves It', level: 2 },
          { id: 'supported-reasoning-models', title: 'Supported Reasoning Models', level: 2 },
        ],
        content: `
# Thinking & Reasoning Tokens

Modern frontier models like OpenAI o1, o3-mini, GPT-5, and Claude 3.7 Thinking do internal "chain of thought" reasoning before writing their final answer.

## The Hidden Token Problem Explained

Here is an example of what happens during a reasoning call:
1. You ask: *"Write a Python script to balance a binary tree."*
2. The AI thinks for 5 seconds, generating **3,500 internal reasoning tokens**.
3. The AI outputs **150 visible words** of Python code.

If your billing system only counts the 150 visible output words, you might charge your user **$0.0001**, but OpenAI charges you **$0.0154**! If you do this at scale, you will lose significant money.

## How VibezCheck Solves It

\`vibezcheck\` automatically inspects provider chunk details, extracts hidden reasoning tokens, and calculates the exact combined cost:

\`\`\`json
{
  "usage": {
    "inputTokens": 450,
    "outputTokens": 2800,
    "totalTokens": 3250,
    "reasoningTokens": 2500,
    "visibleOutputTokens": 300
  },
  "cost": {
    "inputUSD": 0.000495,
    "outputUSD": 0.012320,
    "reasoningCostUSD": 0.011000,
    "totalUSD": 0.012815
  }
}
\`\`\`

## Supported Reasoning Models

* **OpenAI**: \`o1\`, \`o1-mini\`, \`o3\`, \`o3-mini\`, \`gpt-5.6-sol\`
* **Anthropic**: \`claude-3-7-sonnet\` (with Extended Thinking)
* **DeepSeek**: \`deepseek-reasoner\` (DeepSeek R1)
* **Google**: \`gemini-2.0-flash\` (Thinking)
`,
      },
      {
        slug: 'circuit-breakers',
        title: 'Agent Circuit Breakers',
        description: 'Set hard financial budget ceilings to prevent runaway recursive loops.',
        badge: 'Safety',
        category: 'Core Concepts',
        headings: [
          { id: 'what-are-circuit-breakers', title: 'What is an AI Circuit Breaker?', level: 2 },
          { id: 'how-to-configure', title: 'How to Set Up Budget Ceilings', level: 2 },
          { id: 'event-handling', title: 'Handling Tripped Events Gracefully', level: 2 },
        ],
        content: `
# Agent Circuit Breakers

When building AI agents that call tools or execute multi-step recursive loops, a small bug can cause an infinite loop that burns through hundreds of dollars in minutes.

## What is an AI Circuit Breaker?

Just like an electrical circuit breaker trips when a wire gets overloaded, a **VibezCheck Circuit Breaker** monitors your active inference call and halts execution immediately if your cost or token limit is reached.

By default, every VibezCheck call includes a **$0.50 safety ceiling** out of the box.

## How to Set Up Budget Ceilings

\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const result = await generateText({
  model: vibezcheck('openai/gpt-4o', {
    customer: 'agent_task_102',

    // 🛡️ Ceilings:
    maxCostPerCallUSD: 0.25,  // Stop if call exceeds $0.25
    maxTokensPerCall: 10_000, // Stop if call exceeds 10,000 tokens

    // 🛡️ Action:
    onBudgetExceeded: (event) => {
      console.warn(\`⚠️ Safety Trip: \${event.message}\`);
    },
    throwOnBudgetExceeded: true, // Throws VibezCircuitBreakerError
  }),
  prompt: 'Search across 500 documents and summarize findings...',
});
\`\`\`

## Handling Tripped Events Gracefully

When a budget ceiling is reached, \`vibezcheck\` safely closes the stream, fires the \`onBudgetExceeded\` callback, and prevents any additional provider API token charges.
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

## Adding to Assistant Messages

\`\`\`tsx
import { useVibezChat, VibezReceipt } from 'vibezcheck/react';

export default function Chat() {
  const { messages } = useVibezChat();

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

## Available Props

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| \`message\` | \`object\` | \`undefined\` | AI SDK message object with usage annotations |
| \`model\` | \`string\` | \`'ai-model'\` | Explicit model name override |
| \`tokens\` | \`number\` | \`undefined\` | Explicit token count override |
| \`costUSD\` | \`number\` | \`undefined\` | Explicit cost in USD override |
| \`reasoningTokens\` | \`number\` | \`undefined\` | Hidden thinking tokens count |
| \`latencyMs\` | \`number\` | \`undefined\` | Latency in milliseconds |
| \`variant\` | \`'minimal' \| 'pill' \| 'card'\` | \`'minimal'\` | Visual style variant |
`,
      },
      {
        slug: 'session-widget',
        title: '<VibezSessionWidget />',
        description: 'Floating real-time session counter widget with zero database lag.',
        category: 'React Suite',
        headings: [
          { id: 'widget-overview', title: 'Overview', level: 2 },
          { id: 'widget-usage', title: 'Adding to Your App', level: 2 },
          { id: 'widget-props', title: 'Available Props', level: 2 },
        ],
        content: `
# \`<VibezSessionWidget />\`

A lightweight, floating telemetry badge that shows your users their live token usage, dollar spend, and multi-turn message counts in real time.

## Adding to Your App

\`\`\`tsx
'use client';
import { VibezSessionProvider, VibezSessionWidget } from 'vibezcheck/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <VibezSessionProvider>
      {children}
      {/* Floating telemetry widget in bottom right */}
      <VibezSessionWidget theme="light" position="bottom-right" />
    </VibezSessionProvider>
  );
}
\`\`\`

## Available Props

| Prop | Type | Default | Description |
| :--- | :--- | :---: | :--- |
| \`theme\` | \`'light' \| 'dark' \| 'auto'\` | \`'auto'\` | Visual color theme |
| \`position\` | \`'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'\` | \`'bottom-right'\` | Corner placement |
| \`showCost\` | \`boolean\` | \`true\` | Display USD dollar cost |
| \`showTokens\` | \`boolean\` | \`true\` | Display total token count |
`,
      },
      {
        slug: 'billing-modal',
        title: '<VibezBillingModal />',
        description: 'In-app credit top-up and paywall modal with zero external dependencies.',
        category: 'React Suite',
        headings: [
          { id: 'modal-overview', title: 'Overview', level: 2 },
          { id: 'modal-code', title: 'Code Example', level: 2 },
        ],
        content: `
# \`<VibezBillingModal />\`

An elegant paywall and credit top-up modal that slides in when a user exhausts their free credits or reaches their usage quota.

## Code Example

\`\`\`tsx
'use client';
import { useState } from 'react';
import { VibezBillingModal } from 'vibezcheck/react';

export function TopUpDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Add Credits</button>

      <VibezBillingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        notice={{
          status: 'limit_reached',
          tokensUsed: 150000,
          costUSD: 5.00,
          message: 'Free credit quota reached ($5.00 limit). Top up now to continue streaming!',
        }}
        theme="light"
        testMode={true}
        onSuccess={() => {
          console.log('Top up successful!');
          setModalOpen(false);
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
        description: 'Auto-create and manage Stripe customers and Checkout URLs in 1 line.',
        category: 'Stripe & Billing',
        headings: [
          { id: 'auto-customer', title: '1-Line Customer Matching', level: 2 },
          { id: 'checkout-session', title: 'Creating Checkout Sessions', level: 2 },
        ],
        content: `
# Customer Provisioning

\`vibezcheck\` makes it effortless to link your app users to Stripe customer accounts without setting up custom database tables.

## 1-Line Customer Matching

When you pass an email or user ID to \`customer\`, vibezcheck automatically looks up or provisions a Stripe customer record:

\`\`\`typescript
import { vibezcheck } from 'vibezcheck';

const vz = vibezcheck();

// Provision or match Stripe customer
const customer = await vz.customers.getOrCreate({
  email: 'alex@company.com',
  name: 'Alex Rivera',
});

console.log(customer.id); // "cus_test_abc123"
\`\`\`

## Creating Checkout Sessions

Send users to a hosted Stripe Checkout page to add credits or subscribe to a metered plan:

\`\`\`typescript
const checkoutUrl = await vz.billing.createCheckoutSession({
  customerId: customer.id,
  priceId: 'price_metered_tokens',
  returnUrl: 'https://vibezcheck.app/dashboard',
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
          { id: 'rate-table', title: 'Official Rates (USD per 1M Tokens)', level: 2 },
        ],
        content: `
# Model Pricing Table

Rates are calculated synchronously per **1 Million Tokens** with prompt caching discounts:

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
