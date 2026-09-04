# ⚡ vibezcheck

> **Give your AI app a financial mind.**  
> The declarative 1-line Stripe Billing and Token Metering engine for LLMs. Measure tokens, compute real-time dollar costs, and bill customers with **0ms added latency**.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg)](https://npmjs.org/package/vibezcheck)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fseeyouin2x5x%2Fvibezcheck-sdk%2Ftree%2Fmain%2Fexamples%2Fnextjs-saas-starter&env=OPENAI_API_KEY,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=API%20Keys%20for%20OpenAI%20and%20Stripe&project-name=vibezcheck-ai-saas)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-36%20Passed-brightgreen.svg)]()

---

> 🚀 **Want a ready-to-ship template?** Fork our [1-Click Next.js 15 AI SaaS Starter](https://github.com/seeyouin2x5x/vibezcheck-sdk/tree/main/examples/nextjs-saas-starter) with Stripe Checkout, `<VibezReceipt />`, and `<VibezSessionWidget />` pre-configured.

## 🍌 The Electric Meter for Artificial Intelligence

When you turn on the lights in your bedroom, your electric meter spins. When users prompt your AI, **VibezCheck** is the smart meter that counts every word and hidden thought — converting it into pennies with Stripe so your app actually looks out for your margins.

### 🛡️ Sane Defaults (Zero Configuration Required)
* **⚡ 0ms Added Latency**: Streams pass directly to your user's browser with zero intermediate proxy buffering.
* **🛡️ Default $0.50 Fuse Box**: Automatically prevents runaway loops without requiring manual ceilings.
* **🛟 In-Flight Abort Trapper**: Captures and bills partial tokens even if a user closes their browser tab mid-stream.
* **🏷️ Automatic 85% Prompt Cache Discounts**: Detects cache hits on Claude 3.7, GPT-4o, and DeepSeek and passes real savings through.
* **🚀 Serverless Lifecycle Protection**: Seamlessly keeps serverless containers alive until telemetry is acknowledged.
* **💰 1-Line Profit Margins**: Turn wholesale provider costs into guaranteed net profit with `pricing: { margin: 1.5 }`.
* **💳 Prepaid & Postpaid**: Choose between monthly metered invoices or zero-debt credit wallets.
* **🧠 Reasoning Token Aware**: Captures hidden thinking tokens in o3-mini and Claude 3.7 Thinking.
* **🆓 Free Vibe Mode**: Works 100% out of the box in local development with no Stripe account required.

---

## 📦 Installation

```bash
npm install vibezcheck ai @ai-sdk/openai stripe
```

---

## ⚡ 1. The 60-Second Quickstart

### Backend API Route (`app/api/chat/route.ts`)
```typescript
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, userEmail = 'alex@company.com' } = await req.json();

  return streamText({
    // ⚡ 1 Line. All 6 sane defaults run automatically.
    model: vibezcheck('openai/gpt-4o-mini', { customer: userEmail }),
    messages,
  }).toDataStreamResponse();
}
```

### Frontend Chat UI (`app/page.tsx`)
```tsx
'use client';
import { useVibezChat, VibezReceipt, VibezSessionWidget } from 'vibezcheck/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useVibezChat();

  return (
    <main className="max-w-xl mx-auto py-10 px-4 space-y-6">
      {/* 1. Floating live token & dollar counter */}
      <VibezSessionWidget position="bottom-right" />

      {/* 2. Messages with micro-receipts */}
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
        <button type="submit" className="px-5 py-2 rounded-xl bg-slate-950 text-white font-bold text-sm">
          Send
        </button>
      </form>
    </main>
  );
}
```

---

## 🛠️ Real-World Implementation Patterns

### Pattern A: 50% Profit Margin Engine
Turn wholesale provider costs into guaranteed net profit:

```typescript
model: vibezcheck('openai/gpt-4o-mini', {
  customer: 'sarah@acme.com',
  pricing: {
    margin: 1.5,           // 👈 Cost + 50% margin automatically billed to Stripe!
    minimumChargeUSD: 0.01, // 👈 Minimum charge 1 cent per question
  },
})
```

---

### Pattern B: Prepaid Credit Wallets (Zero Debt Risk)
User pre-purchases $10; stream cleanly halts when balance hits $0 without invoice debt:

```typescript
model: vibezcheck('openai/gpt-4o-mini', {
  customer: 'alex@gmail.com',
  billing: {
    mode: 'prepaid', // 👈 Deducts from prepaid credit balance in real time
  },
  // Gracefully downshift when credits run low instead of crashing
  fallbackModelOnBudget: 'openai/gpt-4o-mini',
})
```

---

### Pattern C: Frontier Reasoning Models (Claude 3.7 & o3-mini)
Automatically extracts hidden thinking tokens and applies 85% prompt cache discounts:

```typescript
model: vibezcheck('anthropic/claude-3-7-sonnet', {
  customer: 'alex@company.com',
  maxCostPerCallUSD: 0.75, // Extended ceiling for multi-minute deep reasoning
})
```

---

### Pattern D: Unified Agent Tool Call Metering
Bill external tools (web searches, scrapers, Python sandboxes) and LLM streams into one invoice:

```typescript
// app/api/agent/route.ts
import { generateText, tool } from 'ai';
import { vibezcheck } from 'vibezcheck';
import { z } from 'zod';

export async function POST(req: Request) {
  const { prompt, customer = 'alex@company.com' } = await req.json();

  // Create unified customer session
  const session = vibezcheck.session({ customer });

  const result = await generateText({
    model: session.model('openai/gpt-4o-mini'),
    tools: {
      searchGoogle: tool({
        description: 'Live Google Search',
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          // ⚡ Bill non-LLM tool execution ($0.01) into the same customer balance
          await session.trackTool('google_search', { costUSD: 0.01 });
          return `Search results for: ${query}`;
        },
      }),
    },
    prompt,
  });

  return Response.json(result);
}
```

---

### Pattern E: Brand-New Model (1-Line Inline Rate Card)
Use newly released or fine-tuned models with zero wait for package updates:

```typescript
model: vibezcheck('deepseek/deepseek-r2', {
  rate: { in: 0.20, out: 0.80 }, // $0.20/M in, $0.80/M out
})
```

---

## 🎨 React UI Suite (`vibezcheck/react`)

* **`useVibezChat`**: 1-hook drop-in chat streaming with live session cost sync.
* **`<VibezReceipt />`**: Micro-badge rendered below assistant responses (*"⚡ gpt-4o-mini • 342 tokens • $0.0005 • Verified by VibezCheck"*).
* **`<VibezSessionWidget />`**: Floating live token & dollar speedometer in the screen corner.
* **`<VibezBillingModal />`**: Drop-in 1-click Stripe Checkout top-up modal.

---

## 🌿 Codebase Token Leak Scanner (`npx vibezcheck audit`)

Audit your project in under 50ms for unmetered AI endpoints and missing runaway loop fuses:

```bash
npx vibezcheck audit
```

* **Kind & Minimalist**: Zero heavy AST dependencies; outputs calm clarity instead of intimidating lint errors.
* **Safe `--fix`**: Automatically wraps raw provider calls in `vibezcheck()` with `.bak` backups.
* **GitHub Actions Ready**: Run `npx vibezcheck audit --ci` to fail PRs that accidentally introduce unmetered routes.

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.app)
