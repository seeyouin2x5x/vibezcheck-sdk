# ✦ VibezCheck

> **The 1-Line Token Meter & Real-Time Billing Engine for AI.**  
> Track tokens, compute real-time micro-costs, set profit margins, and bill customers with **0ms added latency** across Vercel AI SDK (v4, v5, v6, v7) and native LLM SDKs.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-94%20Passed-brightgreen.svg)]()
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

## ⚡ What's New in v0.5.6

* **🪄 Zero-Prop Client UIs**: `<VibezReceipt message={message} />` and `<VibezCheck messages={messages} />` auto-derive model slugs, exact tokens, dollar micro-costs, profit margins (`+30% Margin`), and latency straight from the telemetry stream. No manual `model`, `margin`, or `cost` props required.
* **📡 Universal Stream Injector (`vibezcheck.toResponse`)**: Intercepts AI SDK stream completion chunks to attach verified telemetry (`data-vibezcheck` & `message-metadata` SSE for v5/v6/v7, or `2:[{...}]` annotations for v4) with **0ms TTFB overhead**.
* **🛡️ Zero Context Window Pollution**: Telemetry travels out-of-band. When AI SDK's `convertToModelMessages(messages)` prepares future conversation turns, metadata parts are automatically omitted—keeping your LLM context pure and preventing runaway token loops.
* **🎨 Scoped Zero-Config Styling**: Built-in inline fallback styles guarantee that receipts and HUD components look polished out-of-the-box, even if your Tailwind configuration ignores `node_modules`.

---

## 🚀 Key Features

* **⚡ 0ms Added Latency**: Direct transparent proxy stream; no external server redirects, no pre-buffering, and zero impact on first-token response time.
* **🛡️ Built-in $0.50 Circuit Breaker**: Auto-trips if an agent or query exceeds the safety fuse box, preventing infinite loops and surprise $1,000 bills.
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
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // Wrap any provider (OpenAI, Anthropic, Google, DeepSeek, etc.)
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'cus_alex',      // Stripe customer ID or user email
      pricing: { margin: 1.3 },   // +30% profit margin
      maxCostPerCallUSD: 0.50,    // Safety fuse box ($0.50 cap)
    }),
    messages,
  });

  // ✦ Universal telemetry stream injector (works with v4, v5, v6, and v7)
  return vibezcheck.toResponse(result);
}
```

### 2. Frontend Client (`app/page.tsx`)

Render message bubbles with `<VibezReceipt />` and float the aggregated `<VibezCheck />` HUD:

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <main className="flex flex-col w-full max-w-lg py-20 mx-auto px-4 min-h-screen">
      <div className="flex-1 space-y-4 mb-24">
        {messages.map((message) => (
          <div key={message.id} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>

            {/* Display message content */}
            <div className="text-sm whitespace-pre-wrap">
              {message.parts
                ? message.parts.map((part, i) => (part.type === 'text' ? part.text : null))
                : message.content}
            </div>

            {/* ✦ Zero-Prop Micro-Receipt: auto-derives tokens, micro-cost, model, & latency */}
            {message.role === 'assistant' && (
              <div className="mt-2 flex justify-end">
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
        <div className="max-w-lg mx-auto">
          <input
            className="w-full p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
            value={input}
            placeholder="Ask something..."
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </form>

      {/* ✦ Zero-Prop Financial HUD: aggregated conversation tokens, cost, & active model */}
      <VibezCheck messages={messages} />
    </main>
  );
}
```

---

## 🧩 Zero-Prop Client Components

Import from either `vibezcheck/ui` or `vibezcheck/react`:

### 1. `<VibezReceipt />` (Per-Message Micro-Badge)

Displays verified tokens, cost in USD, model slug, and latency under individual assistant messages.

```tsx
<VibezReceipt message={message} />
```

* **Zero Required Props**: Reads telemetry from `message.parts` (`data-vibezcheck`), `message.annotations`, and `message.metadata`.
* **Variants**: `variant="pill"` (default), `variant="minimal"`, or `variant="card"`.
* **Scoped Styling**: Ships with inline fallback styling so it never breaks even without Tailwind CSS.

### 2. `<VibezCheck />` (Global Conversation HUD)

Floating pill and expandable popover showing real-time conversation metrics.

```tsx
<VibezCheck messages={messages} />
```

* **Aggregated Metrics**: Automatically sums input, output, and reasoning tokens across all messages.
* **Auto-Derived Model & Margin**: Displays the active model badge (e.g. `gpt-4o-mini`) and configured markup (e.g. `+30% Margin`).
* **Optional Top-Up**: Pass `onTopUp={() => openBillingModal()}` to display an integrated credit top-up button.

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

  // Recommended: pass result directly
  return vibezcheck.toResponse(result);

  // Or wrap custom UI message stream responses:
  // return vibezcheck.toResponse(
  //   createUIMessageStreamResponse({
  //     stream: toUIMessageStream({ stream: result.stream }),
  //   })
  // );
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
