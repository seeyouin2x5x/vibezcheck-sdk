# ✦ VibezCheck

> **Monetize AI in 2 lines of code. Turn wholesale LLM costs into retail profit with 0ms added latency.**

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-95%20Passed-brightgreen.svg)]()
[![Latency](https://img.shields.io/badge/Latency-0ms%20Added-orange.svg)]()

---

## 💸 Stop Subsidizing Your Users' AI Usage

Building an AI SaaS is fun until your first OpenAI bill lands. 

Setting up token meters, real-time rate cards, database ledgers, Stripe usage records, and custom frontend billing widgets takes **2+ weeks of tedious engineering**.

**VibezCheck replaces all of it with 2 lines of code:**
1. **Server**: Wrap your model with automated billing, retail profit margins, and a runaway circuit breaker.
2. **Client**: Drop in an interactive, Aztec-inspired Web3 fintech HUD.

---

### The 2-Line Integration

```typescript
// 1. Server (app/api/chat/route.ts): Wrap model & stream telemetry
const model = vibezcheck(openai('gpt-4o-mini'), { customer: 'cus_alex', pricing: { margin: 1.3 } });
return vibezcheck.toResponse(result);

// 2. Client (app/page.tsx): Drop in financial HUD & per-message receipts
<VibezReceipt message={message} />
<VibezCheck messages={messages} />
```

---

## 💎 The Developer Value Proposition

| What You Get | The Outcome & ROI |
| :--- | :--- |
| **💰 Instant Retail Profits** | Set `pricing: { margin: 1.3 }` to automatically mark up wholesale LLM tokens by **+30%**. You earn profit on every query. |
| **🛡️ Runaway Circuit Breaker** | Built-in `$0.50` safety fuse box. If an agent hits an infinite loop or prompt injection, it auto-trips before your credit card gets charged $500. |
| **⚡ 0ms Added Latency** | Transparent proxy stream. Telemetry injects out-of-band at stream completion. Your first-token latency (TTFB) is 100% untouched. |
| **🎨 Zero-Config Fintech HUD** | A gorgeous, Aztec Web3-inspired financial card with interactive **USD ⇄ Token unit toggle (`⇅`)**, preset pills (`[$5] [$10] [$25] [Max]`), and dark/light modes out of the box. |
| **🤖 Multi-Model Distribution** | Routing between GPT-4o, Claude 3.5, and Gemini? Automatically breaks down tokens and costs by model with zero extra code. |
| **🆓 Zero-DB Dev Mode** | Develop on `localhost:3000` with **zero database tables** and **zero Stripe keys**. It just works in local memory. |
| **🧹 Zero Context Bloat** | Telemetry travels out-of-band. When AI SDK's `convertToModelMessages(messages)` prepares future turns, metadata is stripped—never wasting tokens on future requests. |

---

## ⚡ 60-Second Quickstart (Next.js App Router)

### 1. Install

```bash
npm install vibezcheck ai @ai-sdk/openai @ai-sdk/react stripe
```

### 2. Backend Route (`app/api/chat/route.ts`)

```typescript
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // ✦ 1-Line Billing: +30% profit margin & $0.50 runaway protection
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com', // Stripe customer ID or user email
      pricing: { margin: 1.3 },         // Wholesale cost + 30% markup
      maxCostPerCallUSD: 0.50,          // Safety fuse box
    }),
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  // Transmits verified tokens & costs with 0ms added latency
  return vibezcheck.toResponse(result);
}
```

### 3. Frontend Client (`app/page.tsx`)

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <main className="max-w-lg mx-auto py-20 px-4 min-h-screen">
      <div className="space-y-4 mb-24">
        {messages.map((message) => (
          <div key={message.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs text-zinc-400 font-semibold mb-1">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {message.parts
                ? message.parts.map((p, i) => (p.type === 'text' ? p.text : null))
                : message.content}
            </div>

            {/* ✦ Micro-Receipt: auto-derives tokens, micro-cost, model, & latency */}
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
        <input
          className="w-full max-w-lg mx-auto block p-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

      {/* ✦ Aztec Fintech HUD: aggregates tokens & costs with multi-model distribution */}
      <VibezCheck
        messages={messages}
        remainingBalanceUSD={14.50}
        onTopUp={(amount) => console.log('Top up credits:', amount)}
      />
    </main>
  );
}
```

---

## 🧩 UI Components: Zero Props Required

Import from `vibezcheck/ui` or `vibezcheck/react`:

### 1. `<VibezCheck />` (Fintech HUD)

A floating pill launcher and expandable card displaying conversation metrics:

* **⇅ Unit Swap**: Click `⇅` to toggle between **Dollar Cost** (`$0.0028 USD`) and **Token Count** (`1,420 tok`).
* **Session vs Turn**: Switch between `[Session]` (conversation total) and `[Latest Turn]` (last response).
* **Preset Pills**: Click `[$5]`, `[$10]`, `[$25]`, or `[Max]` to trigger pre-filled credit top-ups.
* **Privacy by Default**: Developer wholesale API costs and profit margins are **strictly hidden** from end-users. (Pass `showMargin={true}` or `showWholesale={true}` in admin dashboards).

```tsx
<VibezCheck
  messages={messages}
  remainingBalanceUSD={25.00}
  onTopUp={(amount) => triggerStripeCheckout(amount)}
/>
```

### 2. `<VibezReceipt />` (Per-Message Micro-Badge)

Displays verified tokens, cost in USD, model slug, and latency under assistant messages:

```tsx
<VibezReceipt message={message} />
// => ✦ <$0.0001 · 31 tok · gpt-4o-mini
```

---

## 🤖 Multi-Model Sessions (Automatic Split)

If your app routes queries across multiple models (e.g. `gpt-4o-mini` for chat and `claude-3-5-sonnet` for code generation), `<VibezCheck />` automatically groups and displays the split:

* **Header**: Shows `2 models` active.
* **Breakdown**:
  * `gpt-4o-mini (1 turn)`: 31 tok · $0.0001 (7%)
  * `claude-3-5-sonnet (1 turn)`: 420 tok · $0.0068 (93%)
* Click any model in the list to filter the hero metrics to that specific model.

---

## 💳 Commercial SaaS Add-ons

### 1. Stripe Prepaid Credit Top-Ups (`BillingHelper`)

```typescript
import { BillingHelper } from 'vibezcheck';

const billing = new BillingHelper({ apiKey: process.env.STRIPE_SECRET_KEY });

// Customer buys $20 in AI usage credits
const checkoutUrl = await billing.createTopUpSession({
  customerId: 'cus_123',
  amountCents: 2000,
  returnUrl: 'https://myapp.com/dashboard',
});
```

### 2. Customer API Keys (`ApiKeyAuth`)

Issue customer API keys (`vz_live_...`) backed by Stripe customer metadata—zero database needed:

```typescript
import { ApiKeyAuth } from 'vibezcheck';
import Stripe from 'stripe';

const auth = new ApiKeyAuth(new Stripe(process.env.STRIPE_SECRET_KEY!));

// Generate customer key
const { apiKey } = await auth.createKey({ customerId: 'cus_123', name: 'Worker Key' });
// => "vz_live_9f83b2..."
```

### 3. Agent Session Budgets (`AgentSession`)

Set a hard $1.00 session ceiling across models, Python sandboxes, and web scrapers:

```typescript
import { AgentSession, wrapTool } from 'vibezcheck';

const session = new AgentSession({
  customer: 'cus_alex',
  sessionBudgetUSD: 1.00, // Hard stop for entire agent run
});
```

---

## 🔄 Drop-In Replacement for `@stripe/ai-sdk`

Migrating from `@stripe/ai-sdk` or `@stripe/token-meter`? Swap imports with 100% API compatibility:

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

Audit your codebase in CI/CD to detect unmetered AI endpoints before shipping to production:

```bash
npx vibezcheck audit --ci
```

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
