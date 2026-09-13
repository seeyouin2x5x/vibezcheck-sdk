# ✦ VibezCheck

> **Track AI token spend and bill users in real time. Setup in 1 line.**  
> No database needed. No added latency.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-95%20Passed-brightgreen.svg)]()
[![Latency](https://img.shields.io/badge/Latency-0ms%20Added-orange.svg)]()

---

### The 1-Line Setup

**1. On your server:** wrap your model to track spending and set a profit margin
```typescript
const model = vibezcheck(openai('gpt-4o-mini'), { pricing: { margin: 1.3 } });
```

**2. On your frontend:** drop in the component to see spendings in real time
```tsx
<VibezCheck messages={messages} />
```

That’s it. You get real-time token tracking, live dollar costs, runaway loop protection, and a sleek spending HUD.

---

## What VibezCheck does for you

When you build an AI app, chatbot, or agent:

* **👀 See spending in real time**: You and your users can see the exact cost (e.g. `$0.0014`) and token count for every turn as it streams in.
* **🛡️ Never get a surprise $500 bill**: A built-in `$0.50` circuit breaker stops runaway prompts or infinite agent loops automatically before they drain your credit card.
* **💰 Turn costs into profit**: Add `pricing: { margin: 1.3 }` to mark up wholesale API prices by 30%. You make money on every message without writing custom billing code.
* **🤖 Works with multiple models**: If a conversation uses GPT-4o-mini, Claude 3.5, or Gemini, VibezCheck automatically breaks down the spending per model.
* **🆓 Zero database required**: Test locally on `localhost:3000` with zero database tables and zero Stripe keys. It runs straight in memory.
* **⚡ 0ms added latency**: Streaming is direct and transparent. Spending telemetry attaches cleanly at the very end of the stream without delaying first-token response time.
* **🧹 Clean context window**: Telemetry stays out of your prompts. When messages get sent back to the model on the next turn, telemetry is automatically stripped so you never waste tokens.

---

## 60-Second Example (Next.js App Router)

### 1. Server Route (`app/api/chat/route.ts`)

```typescript
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // ✦ 1 Line: track costs, add 30% profit margin, and set $0.50 runaway safety fuse
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com',
      pricing: { margin: 1.3 },
      maxCostPerCallUSD: 0.50,
    }),
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  // Sends the stream with verified spending telemetry attached
  return vibezcheck.toResponse(result);
}
```

### 2. Frontend Client (`app/page.tsx`)

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export default function Chat() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <main className="max-w-lg mx-auto py-12 px-4">
      <div className="space-y-4 mb-24">
        {messages.map((m) => (
          <div key={m.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 mb-1">{m.role === 'user' ? 'You' : 'AI'}</p>
            <p className="text-sm whitespace-pre-wrap">{m.content}</p>

            {/* ✦ 1 Line: Micro-receipt under each assistant message */}
            {m.role === 'assistant' && (
              <div className="mt-2 flex justify-end">
                <VibezReceipt message={m} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ✦ 1 Line: Floating HUD showing spending in real time */}
      <VibezCheck messages={messages} />
    </main>
  );
}
```

---

## The UI Components (Zero Props Needed)

Import from `vibezcheck/ui` or `vibezcheck/react`:

### 1. `<VibezCheck messages={messages} />`

A floating financial HUD and expandable card:
* **⇅ Unit Swap**: Click the `⇅` icon to switch between **Dollar Cost** (`$0.0028`) and **Tokens** (`1,420 tok`).
* **Session vs Turn**: Switch between `[Session]` (total conversation spend) and `[Latest Turn]` (last reply).
* **Multi-Model Breakdown**: If you use multiple models in one chat, it shows the exact split for each model.
* **Customer Privacy by Default**: End-users only see their billed cost. Your wholesale costs and profit margins are hidden by default.

```tsx
<VibezCheck
  messages={messages}
  remainingBalanceUSD={10.00}
  onTopUp={(amount) => console.log('User wants to top up credits:', amount)}
/>
```

### 2. `<VibezReceipt message={message} />`

A small, elegant badge under each assistant message:
```tsx
<VibezReceipt message={message} />
// Renders: ✦ $0.0001 · 31 tok · gpt-4o-mini
```

---

## Multi-Model Sessions (Automatic Breakdown)

If your app routes between different models (e.g. `gpt-4o-mini` for quick chat and `claude-3-5-sonnet` for coding):

VibezCheck automatically detects every model used and lists them in the HUD:
* `gpt-4o-mini (1 turn)`: 31 tok · $0.0001
* `claude-3-5-sonnet (1 turn)`: 420 tok · $0.0068

Click any model to see its specific spending.

---

## Need Stripe Billing? (Optional)

When you want to charge real money, VibezCheck has built-in Stripe helpers:

* **Prepaid Credits**: Let users buy credit balance with Stripe Checkout (`BillingHelper.createTopUpSession`).
* **Customer API Keys**: Issue `vz_live_...` keys saved in Stripe customer metadata (`ApiKeyAuth`).
* **Agent Session Ceilings**: Limit a multi-step agent to a hard $1.00 budget with `AgentSession`.

---

## 📦 Installation

```bash
npm install vibezcheck ai @ai-sdk/openai @ai-sdk/react stripe
```

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
