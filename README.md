# ✦ VibezCheck

> **The 1-Line Token Meter & Real-Time Billing Engine for AI.**  
> Track tokens, compute real-time dollar costs, set profit margins, and bill customers with **0ms added latency**.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-62%20Passed-brightgreen.svg)]()

---

### The 2-Line Promise

```typescript
// 1. Server: Wrap your model with automated billing
const model = vibezcheck('openai/gpt-4o', { customer: 'cus_alex' });

// 2. Client: Drop in the financial HUD
<VibezCheck messages={messages} />
```

---

## 🚀 Features

* **⚡ 0ms Added Latency**: Direct transparent proxy stream; no external server redirects or buffering.
* **🛡️ Built-in $0.50 Circuit Breaker**: Prevents infinite loops and runaway bills automatically.
* **🛟 In-Flight Abort Trapper**: Catches and bills tokens even if the customer closes their tab mid-stream.
* **🪙 BigInt Nano-USD Precision**: Sub-cent financial math ($1 = $10^9$ Nano-USD) eliminating IEEE 754 float drift.
* **💰 1-Line Profit Margins**: Turn wholesale API costs into retail profits with `pricing: { margin: 1.5 }` (+50% profit).
* **🆓 Zero-DB Dev Mode**: Run locally on `localhost:3000` with NO database and NO Stripe keys required.
* **💳 Pluggable SaaS Billing**: Top-ups, checkout sessions, customer portal, and user API keys (`vz_live_...`).
* **🤖 Multi-Tool Agent Sessions**: Cumulative session budgets across models, Python sandboxes, and web scrapers.
* **🔄 100% Drop-In Polyfills**: Direct replacement for `@stripe/ai-sdk/meter`, `@stripe/ai-sdk/provider`, and `@stripe/token-meter`.

---

## 📦 Installation

```bash
npm install vibezcheck ai @ai-sdk/openai stripe
```

---

## ⚡ Quickstart: Zero-DB Dev Mode to Production

### 1. Next.js 15 API Route (`app/api/chat/route.ts`)

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // Wrap any AI SDK model or use string identifier
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com', // Stripe customer ID or user email
      pricing: { margin: 1.3 },         // +30% profit margin
      maxCostPerCallUSD: 0.50,          // Safety fuse box
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. Frontend React Client (`app/page.tsx`)

```tsx
'use client';
import { useChat } from 'ai/react';
import { VibezCheck } from 'vibezcheck/ui';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
            <strong>{m.role}: </strong>
            <span>{m.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Send
        </button>
      </form>

      {/* ✦ 1-Line HUD: Works with zero database & zero Stripe in Dev Mode */}
      <VibezCheck messages={messages} model="gpt-4o-mini" margin={1.3} />
    </main>
  );
}
```

---

## 💳 Commercial SaaS Use Cases

### 1. Credit Wallet Top-Ups & Checkout (`BillingHelper`)

```typescript
import { BillingHelper } from 'vibezcheck';

const billing = new BillingHelper({ apiKey: process.env.STRIPE_SECRET_KEY });

// Customer purchases $20 in AI usage credits
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
  name: 'Production Worker Key',
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

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
