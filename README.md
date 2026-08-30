# ⚡ vibezcheck

> **The 1-line Stripe Billing & Token Metering engine for LLMs.**  
> Track tokens, compute real-time dollar costs, and bill customers with 0ms added latency.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 Why vibezcheck?

* **⚡ 0ms Added Latency**: Streams pass straight through to the browser with zero buffering.
* **🧠 Reasoning & Thinking Token Aware**: Accurately tracks hidden reasoning tokens in GPT-5, o1/o3, Claude 3.7 Thinking, and Gemini 3.7 Thoughts.
* **💰 Built-in Cost Engine**: Calculates exact USD inference costs out of the box with prompt caching discounts.
* **🆓 Zero-Config Local Mode**: Works 100% free in development with no Stripe account needed.
* **💳 1-Line Stripe Billing**: Turn an AI prototype into a live, revenue-generating SaaS in 1 line of code.

---

## 📦 Installation

```bash
npm install vibezcheck stripe
# or
pnpm add vibezcheck stripe
```

---

## 🎯 The 2 Core Features

---

### Feature 1: Local Token & Cost Tracking (Free / No Stripe Required)

Use this in development or when you want real-time token and USD cost analytics without billing users:

#### 💻 Code:
```typescript
// app/api/chat/route.ts
import { createMeter } from 'vibezcheck/meter';
import OpenAI from 'openai';

const openai = new OpenAI();

// 1. Create a meter (no Stripe key required!)
const meter = createMeter({
  onUsage: (event) => {
    console.log(`[vibezcheck] 📊 Model: ${event.model}`);
    console.log(`Tokens: ${event.usage.totalTokens} (Input: ${event.usage.inputTokens}, Output: ${event.usage.outputTokens}, Reasoning: ${event.usage.reasoningTokens ?? 0})`);
    console.log(`Inference Cost: $${event.cost.totalUSD.toFixed(6)} USD\n`);
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
    stream_options: { include_usage: true },
  });

  // 2. Wrap stream - passes chunks directly to user with 0ms added delay
  return new Response(meter.wrapStream(stream));
}
```

#### 🌐 What the Frontend receives:
```http
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Transfer-Encoding: chunked

Quantum computing uses qubits to perform complex calculations exponentially faster...
```

#### 🖥️ What your Terminal logs:
```
[vibezcheck] 📊 Model: openai/gpt-4o
Tokens: 1,420 (Input: 800, Output: 620, Reasoning: 0)
Inference Cost: $0.008200 USD
```

---

### Feature 2: 1-Line Stripe Billing with Vercel AI SDK (`withBilling`)

Use this when you are ready to charge users and protect your margins from heavy reasoning models (GPT-5, Claude 3.7 Thinking):

#### 💻 Code:
```typescript
// app/api/chat/route.ts
import { withBilling } from 'vibezcheck';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages, userEmail } = await req.json();

  // 1-line wrapper: extracts reasoning tokens & logs meter events to Stripe!
  const result = streamText({
    model: withBilling(openai('gpt-5.6-sol'), {
      customer: userEmail, // e.g. "alex@example.com"
      stripeApiKey: process.env.STRIPE_SECRET_KEY,
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
```

#### 🌐 What the Frontend receives:
Compatible with Vercel's `useChat()` React hook:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
x-vercel-ai-data-stream: v1

0:"Here is the "
0:"solution step by step..."
d:{"finishReason":"stop","usage":{"promptTokens":1200,"completionTokens":450,"reasoningTokens":350}}
```

#### 💳 What Stripe receives in the background:
1. **Customer Created/Resolved**: Customer `alex@example.com` is automatically created (`cus_Q871xyz`).
2. **Meter Event Dispatched to Stripe Billing**:
```json
{
  "event_name": "token-billing-tokens",
  "timestamp": "2026-08-23T10:12:00.000Z",
  "payload": {
    "stripe_customer_id": "cus_Q871xyz",
    "value": "800",
    "model": "openai/gpt-5.6-sol",
    "token_type": "output",
    "is_reasoning": "true"
  }
}
```
3. **Invoice Updated**: Stripe increments Alex's monthly usage bill or deducts \$0.016 from their prepaid credit balance.

---

### Also works with Claude 3.7 Sonnet Extended Thinking

```typescript
import { createMeter } from 'vibezcheck/meter';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const meter = createMeter({ apiKey: process.env.STRIPE_SECRET_KEY });

export async function handleThinkingPrompt(prompt: string, customerId: string) {
  const stream = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 4000,
    thinking: { type: 'enabled', budget_tokens: 2000 },
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  // Automatically captures Claude 3.7 thinking tokens and sends to Stripe:
  return meter.wrapStream(stream, { customerId });
}
```

#### 💳 Stripe Meter Event output for Thinking Tokens:
```json
{
  "event_name": "token-billing-tokens",
  "payload": {
    "stripe_customer_id": "cus_Q871xyz",
    "value": "1840",
    "model": "anthropic/claude-3-7-sonnet",
    "token_type": "output_thinking"
  }
}
```

---

## ⚛️ React & React Native Session Tracking (`vibezcheck/react`)

Track live session tokens and dollar costs directly on the client side with **zero database required**:

### 1. Wrap your chat app with `<VibezSessionProvider>`:
```tsx
import { VibezSessionProvider, VibezSessionWidget } from 'vibezcheck/react';

export default function App() {
  return (
    <VibezSessionProvider persist="sessionStorage">
      <ChatInterface />

      {/* Drop-in floating pill widget showing live session tokens & cost */}
      <VibezSessionWidget position="bottom-right" showReasoning theme="dark" />
    </VibezSessionProvider>
  );
}
```

### 2. Auto-hook into Vercel AI SDK (`useChat`):
```tsx
import { useChat } from 'ai/react';
import { useVibezSession, VibezSessionBadge } from 'vibezcheck/react';

export function ChatInterface() {
  const { recordTurn, sessionUsage, sessionCost } = useVibezSession();

  const { messages, input, handleSubmit } = useChat({
    onFinish: (message, { usage }) => {
      // 1 line: accumulates tokens & calculates real-time USD costs in React state
      recordTurn({ model: 'gpt-5.6-sol', usage });
    },
  });

  return (
    <div>
      <header className="flex justify-between items-center">
        <h2>AI Assistant</h2>
        <VibezSessionBadge showTokens showCost />
      </header>

      <MessagesList messages={messages} />
    </div>
  );
}
```

---

## 💰 Built-in Model Pricing Registry

`vibezcheck` ships with default rates for all active frontier models:

```typescript
import { calculateCost } from 'vibezcheck/pricing';

const cost = calculateCost({
  model: 'claude-3-7-sonnet',
  inputTokens: 2000,
  outputTokens: 800,
  reasoningTokens: 1200, // thinking tokens
});

console.log(cost);
```

#### 🖥️ Response:
```json
{
  "inputCostUSD": 0.00118,
  "outputCostUSD": 0.002344,
  "reasoningCostUSD": 0.003516,
  "totalCostUSD": 0.007040,
  "currency": "USD"
}
```

---

## 📄 License

MIT © [vibezcheck.xyz](https://vibezcheck.xyz)
