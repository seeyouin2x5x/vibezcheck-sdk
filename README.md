# ✦ VibezCheck

> **The 1-Line Token Meter & Real-Time Billing Engine for AI.**  
> Track tokens, compute real-time micro-costs, set profit margins, and bill customers with **0ms added latency** across Vercel AI SDK (v4, v5, v6, v7) and native LLM SDKs.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-95%20Passed-brightgreen.svg)]()
[![Latency](https://img.shields.io/badge/Latency-0ms%20Added-orange.svg)]()

---

### The 2-Line Promise

```typescript
// 1. Server: Wrap your model with billing & inject telemetry into stream
const model = vibezcheck('openai/gpt-4o-mini', { customer: 'cus_alex', pricing: { margin: 1.3 } });
return vibezcheck.toResponse(result);

// 2. Client: Drop in zero-prop financial HUD & micro-receipts
<VibezReceipt message={message} />
<VibezCheck messages={messages} />
```

---

## ⚡ What's New in v0.5.8

* **🎨 Aztec Web3 Fintech Redesign**: Complete aesthetic overhaul inspired by modern Web3 luxury cards. Features warm creamy surfaces (`rounded-[28px]`), obsidian dark mode, preset pills (`[$5] [$10] [$25] [Max]`), and a segmented `[Session | Latest Turn]` capsule switcher.
* **⇅ Interactive USD ⇄ Token Unit Toggle**: Click the `⇅` icon or the hero number to seamlessly flip the primary display between **Dollar Cost** (`$0.0028 USD`) and **Token Count** (`1,420 Tokens`).
* **🤖 Multi-Model Session Breakdown**: Automatically detects when different models are used across the session (e.g., routing between `gpt-4o-mini`, `claude-3-5-sonnet`, and `gemini-1.5-flash`). Displays a clean **Model Distribution** split with exact tokens, percentage, and cost per model.
* **🎯 100% Precise Token Counting**: Completely eliminates prompt double-counting. Server-reported tokens from OpenAI/Anthropic/Gemini are authoritative, guaranteeing 1:1 parity between message badges and the global HUD.
* **🛡️ Wholesale & Margin Privacy by Default**: End-users and customers see **zero wholesale API costs and zero profit margins** by default. Developers can opt-in using `showMargin={true}` and `showWholesale={true}`.
* **📡 Universal Stream Injector (`vibezcheck.toResponse`)**: Attaches verified telemetry (`data-vibezcheck` & `message-metadata` SSE for v5/v6/v7, or `2:[{...}]` for v4) with **0ms TTFB overhead**.
* **🧹 Clean Context Window**: Telemetry travels out-of-band. When AI SDK's `convertToModelMessages(messages)` prepares future turns, metadata is stripped—preventing context bloat and token waste.

---

## 🚀 Key Features

* **⚡ 0ms Added Latency**: Direct transparent proxy stream; no external server redirects, no pre-buffering, and zero impact on first-token response time.
* **🛡️ Built-in $0.50 Circuit Breaker**: Auto-trips if an agent or query exceeds the safety fuse box, preventing infinite loops and runaway bills.
* **🛟 In-Flight Abort Trapper**: Accurately meters and debits tokens even if the client closes their laptop lid or navigates away mid-stream.
* **🪙 BigInt Nano-USD Precision**: Sub-cent financial math ($1 = $10^9$ Nano-USD) eliminating IEEE 754 floating-point drift.
* **💰 1-Line Profit Margins**: Turn wholesale API costs into retail revenue with `pricing: { margin: 1.3 }` (+30% markup).
* **🆓 Zero-DB Dev Mode**: Run locally on `localhost:3000` with NO database and NO Stripe keys required.
* **💳 Pluggable SaaS Billing**: Credit wallets, top-ups, checkout sessions, customer portal, and user API keys (`vz_live_...`).
* **🤖 Multi-Tool Agent Sessions**: Cumulative session budgets across multiple LLM steps, Python sandboxes, and web scrapers.
* **🔄 100% Drop-In Polyfills**: Direct replacement for `@stripe/ai-sdk/meter`, `@stripe/ai-sdk/provider`, and `@stripe/token-meter`.

---

## 📦 Installation

```bash
npm install vibezcheck ai @ai-sdk/openai @ai-sdk/react stripe
```

---

## ⚡ 1-Minute Quickstart: Next.js App Router

### 1. Server Route (`app/api/chat/route.ts`)

Wrap any model with `vibezcheck()`, and return the response using `vibezcheck.toResponse()`:

```typescript
import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Wrap any provider (OpenAI, Anthropic, Google, DeepSeek, etc.)
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'cus_alex',      // Stripe customer ID or user email
      pricing: { margin: 1.3 },   // +30% profit margin
      maxCostPerCallUSD: 0.50,    // Safety fuse box ($0.50 cap)
    }),
    instructions: 'You are a helpful and concise AI assistant.',
    messages: await convertToModelMessages(messages),
  });

  // ✦ Universal telemetry stream injector (works with v4, v5, v6, and v7)
  return vibezcheck.toResponse(result);
}
```

### 2. Frontend Client (`app/page.tsx`)

Render message bubbles with `<VibezReceipt />` and float the interactive `<VibezCheck />` HUD:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <main className="flex flex-col w-full max-w-lg py-20 mx-auto px-4 min-h-screen">
      <div className="flex-1 space-y-4 mb-24">
        {messages.map((message) => (
          <div key={message.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>

            {/* Display message content */}
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {message.parts
                ? message.parts.map((part, i) => (part.type === 'text' ? part.text : null))
                : message.content}
            </div>

            {/* ✦ Zero-Prop Micro-Receipt: auto-derives tokens, micro-cost, model, & latency */}
            {message.role === 'assistant' && (
              <div className="mt-3 flex justify-end">
                <VibezReceipt message={message} />
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md"
      >
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            className="flex-1 p-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
            value={input}
            placeholder="Ask something..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={status === 'streaming' || !input.trim()}
            className="px-5 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold rounded-xl"
          >
            Send
          </button>
        </div>
      </form>

      {/* ✦ Aztec Fintech HUD: aggregates tokens & costs with multi-model breakdown */}
      <VibezCheck
        messages={messages}
        remainingBalanceUSD={14.50}
        onTopUp={(amount) => console.log('Top up requested:', amount)}
      />
    </main>
  );
}
```

---

## 🧩 Client Components & Controls

Import from either `vibezcheck/ui` or `vibezcheck/react`:

### 1. `<VibezCheck />` (Aztec Fintech HUD)

Floating pill launcher and expandable Web3 card showing real-time financial metrics.

```tsx
<VibezCheck
  messages={messages}
  remainingBalanceUSD={25.00}
  showMargin={false}      // Default: false (hides profit margin from customers)
  showWholesale={false}   // Default: false (hides wholesale API costs from customers)
  onTopUp={(amount) => triggerCheckout(amount)}
/>
```

#### Interactive Features:
* **⇅ Unit Swap**: Click the `⇅` button to toggle the hero between **Dollar Cost** and **Tokens**.
* **Segmented Controls**: Switch between `[Session]` (conversation total) and `[Latest Turn]` (last response).
* **Preset Pills**: Click `[$5]`, `[$10]`, `[$25]`, or `[Max]` to trigger pre-filled credit top-ups.
* **Multi-Model Distribution**: If you route between multiple models, an automatic **"By Model"** breakdown appears with exact token counts, cost splits, and turn counts per model.
* **Privacy by Default**: Developer wholesale prices and margins remain completely hidden from end-users.

### 2. `<VibezReceipt />` (Per-Message Micro-Badge)

Displays verified tokens, cost in USD, model slug, and latency under individual assistant messages.

```tsx
<VibezReceipt message={message} />
```

* **Zero Required Props**: Reads telemetry from `message.parts` (`data-vibezcheck`), `message.annotations`, and `message.metadata`.
* **Variants**: `variant="pill"` (default), `variant="minimal"`, or `variant="card"`.
* **Scoped Styling**: Self-contained inline fallback styling so it looks gorgeous even without Tailwind CSS.

---

## 🤖 Multi-Model Session Support

When building agentic routers or multi-step reasoning agents that use multiple models in a single chat:

```typescript
// Turn 1: Quick classification
const fastResult = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), { customer }),
  messages,
});

// Turn 2: Complex deep reasoning
const deepResult = streamText({
  model: vibezcheck(anthropic('claude-3-5-sonnet'), { customer }),
  messages,
});
```

`<VibezCheck />` automatically aggregates both:
* **Header & Pill**: Shows `2 models` active.
* **Token Breakdown**: Displays a clean breakdown:
  * `gpt-4o-mini (1 turn)`: 31 tok · $0.0001
  * `claude-3-5-sonnet (1 turn)`: 420 tok · $0.0068
* Click any model in the list to filter the hero metrics to that specific model!

---

## 🔄 Multi-Version Vercel AI SDK Compatibility

`vibezcheck` provides seamless compatibility across every major generation of the Vercel AI SDK:

### AI SDK v5, v6 & v7 (UI Message Stream)

```typescript
import { createUIMessageStreamResponse, toUIMessageStream, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), { customer: 'cus_123' }),
    messages,
  });

  return vibezcheck.toResponse(result);
}
```

### AI SDK v4 (Data Stream Protocol)

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: vibezcheck(openai('gpt-4o'), { customer: 'cus_123' }),
    messages,
  });

  // Automatically emits 2:[{"type":"vibezcheck", ...}] data stream annotations
  return vibezcheck.toResponse(result);
}
```

---

## 🛡️ Context Window Hygiene: How It Works

A frequent hazard in LLM streaming is "telemetry leakage"—where usage data sent to the client gets accidentally included in subsequent conversation turns, causing runaway context growth and unnecessary token costs.

VibezCheck prevents this by design:
1. **Server Injection**: `vibezcheck.toResponse` injects telemetry out-of-band right before stream completion (`data-vibezcheck` and `message-metadata` SSE events).
2. **Client Ingestion**: `<VibezReceipt />` and `<VibezCheck />` extract telemetry from message parts without mutating textual content.
3. **Next Request**: When `convertToModelMessages(messages)` runs on subsequent requests, the AI SDK automatically discards transient metadata and data parts. **Zero telemetry tokens are sent to the LLM.**

---

## 💳 Commercial SaaS Billing

### 1. Stripe Top-Up Sessions (`BillingHelper`)

Allow users to purchase pre-paid AI credits with Stripe Checkout:

```typescript
import { BillingHelper } from 'vibezcheck';

const billing = new BillingHelper({ apiKey: process.env.STRIPE_SECRET_KEY });

export async function POST(req: Request) {
  const { customerId } = await req.json();

  const checkoutUrl = await billing.createTopUpSession({
    customerId,
    amountCents: 2000, // $20.00
    returnUrl: 'https://myapp.com/dashboard',
  });

  return Response.json({ url: checkoutUrl });
}
```

### 2. Customer API Keys (`ApiKeyAuth`)

Issue customer API keys (`vz_live_...`) backed by Stripe customer metadata—zero database required:

```typescript
import { ApiKeyAuth } from 'vibezcheck';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const auth = new ApiKeyAuth(stripe);

// 1. Generate key for customer
const { apiKey } = await auth.createKey({
  customerId: 'cus_123',
  name: 'Production Key',
});
// => "vz_live_9f83b2..."

// 2. Authenticate API requests in middleware
export async function middleware(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  const verification = await auth.verifyKey(token);

  if (!verification.valid) {
    return new Response('Unauthorized', { status: 401 });
  }

  // verification.customerId is verified against Stripe!
}
```

### 3. Multi-Tool Agent Sessions (`AgentSession`)

Set a hard $1.00 session budget across multiple LLM steps and external tools:

```typescript
import { AgentSession, wrapTool } from 'vibezcheck';
import { openai } from '@ai-sdk/openai';

const session = new AgentSession({
  customer: 'cus_agent_user',
  sessionBudgetUSD: 1.00, // Hard ceiling for entire session
});

// Wrap external tools with financial tracking
const webSearchTool = wrapTool({
  name: 'web_search',
  costUSD: 0.01,
  execute: async ({ query }) => fetchSearch(query),
});

// Run LLM model bound to this session
const sessionModel = session.model(openai('gpt-4o'));
```

---

## 🔄 100% Drop-In Compatibility with `@stripe/ai-sdk`

If you are migrating from `@stripe/ai-sdk` or `@stripe/token-meter`, swap your imports:

```typescript
// Replace: import { meteredModel } from '@stripe/ai-sdk/meter';
import { meteredModel } from 'vibezcheck/stripe/meter';

// Replace: import { stripe } from '@stripe/ai-sdk/provider';
import { stripe } from 'vibezcheck/stripe/provider';

// Replace: import { createTokenMeter } from '@stripe/token-meter';
import { createTokenMeter } from 'vibezcheck/stripe/token-meter';
```

---

## 🛡️ Route Auditor CLI

Audit your codebase to detect unmetered AI endpoints before shipping to production:

```bash
npx vibezcheck audit
```

### CI/CD Mode
Fail the build if unmetered AI routes are detected:
```bash
npx vibezcheck audit --ci
```

---

## 📂 Examples

* **[Next.js App Router + OpenAI](examples/nextjs-app-router-openai)**: Modern AI SDK App Router implementation with 1-line token metering and `<VibezCheck />`.
* **[Next.js 15 AI SaaS Starter](examples/nextjs-saas-starter)**: Complete SaaS template with Stripe Checkout, Top-Up Modal, and `<VibezReceipt />`.
* **[Local Cost Meter](examples/01-local-cost-meter.ts)**: Offline micro-transaction calculations with BigInt Nano-USD precision.
* **[Native OpenAI Streaming](examples/03-native-openai-stream.ts)**: Zero-latency stream wrapper for the official `openai` Node SDK.
* **[Claude 3.7 Reasoning Tokens](examples/04-claude-thinking.ts)**: Tracking hidden thought tokens with Anthropic SDK.

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
