# ⚡ vibezcheck

> **The Declarative 1-Line Stripe Billing & Token Metering Engine for LLMs.**  
> Track tokens, compute real-time USD costs, and bill customers with 0ms added latency across any LLM provider.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)

---

## 🚀 Why vibezcheck?

* **⚡ 0ms Added Latency**: Streams pass straight through to the browser with zero buffering or middleware delay.
* **🧠 Thinking & Reasoning Token Aware**: Accurately extracts hidden reasoning tokens in GPT-5, o1/o3-mini, Claude 3.7 Thinking, and Gemini 2.0 Flash Thinking.
* **💰 Built-in Cost Calculation**: Real-time USD inference pricing out of the box with prompt caching discounts.
* **🆓 Zero-Config Local Mode**: Works 100% free in development with no database or Stripe account required.
* **💳 1-Line Stripe Billing**: Turn an AI prototype into a revenue-generating SaaS with autonomous customer provisioning and meter events.
* **⚛️ React & React Native Ready**: Live floating widgets, badges, and checkout paywall modals (`<VibezBillingModal />`).

---

## 📦 Installation

```bash
npm install vibezcheck stripe
# or
pnpm add vibezcheck stripe
```

---

## ⚡ 1. Declarative Vercel AI SDK Integration

`vibezcheck` wraps any model string or provider instance into a fully compliant Vercel AI SDK model:

### A. Single-Turn Generation (`generateText` & Server Actions)
```typescript
import { generateText } from "ai";
import { vibezcheck } from "vibezcheck";

const { text, usage } = await generateText({
  model: vibezcheck("openai/gpt-4o-mini", {
    customer: "alex@example.com", // Auto-creates or matches Stripe customer
  }),
  prompt: "What is love?",
});
```

### B. Streaming AI Route (`streamText`)
```typescript
// app/api/chat/route.ts
import { streamText } from "ai";
import { vibezcheck } from "vibezcheck";

export async function POST(req: Request) {
  const { messages } = await req.json();

  return streamText({
    model: vibezcheck("gpt-4o-mini", { customer: "alex@example.com" }),
    messages,
  }).toTextStreamResponse();
}
```

### C. Direct `createOpenAI` Connection
You can pass custom OpenAI / Gateway instances directly into `vibezcheck()`:
```typescript
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { vibezcheck } from "vibezcheck";

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: "https://ai-gateway.vercel.sh/v1", // Vercel AI Gateway or Cloudflare
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  return streamText({
    model: vibezcheck(openai("gpt-4o-mini"), { customer: "alex@example.com" }),
    messages,
  }).toTextStreamResponse();
}
```

---

## ⚛️ 2. Declarative React UI & Hooks (`vibezcheck/react`)

### A. 1-Line Streaming Chat Hook (`useVibezChat`)
Automatically connects to your API route and syncs tokens, reasoning thoughts, and costs with the session widget:

```tsx
'use client';
import { useVibezChat, VibezSessionWidget, VibezBillingModal } from 'vibezcheck/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
    model: 'gpt-4o-mini',
    customer: 'alex@example.com',
  });

  return (
    <main className="p-6 max-w-3xl mx-auto">
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask..." />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>

      {/* Live Token & Dollar Tracker Widget */}
      <VibezSessionWidget theme="light" position="bottom-right" />
    </main>
  );
}
```

### B. Autonomous Paywall & Top-Up Modal (`<VibezBillingModal />`)
Pops up an in-app Stripe Checkout modal whenever a customer reaches their credit limit:

```tsx
<VibezBillingModal
  isOpen={limitReached}
  onClose={() => setLimitReached(false)}
  notice={{
    status: 'limit_reached',
    tokensUsed: 150000,
    costUSD: 5.00,
    message: 'Free credit limit reached. Top up to keep streaming!',
  }}
  theme="light"
  testMode={true} // Supports Stripe Sandbox testing
/>
```

---

## 💳 3. Stripe Sandbox & Customer Provisioning

### A. Auto Customer Provisioning in 1 Line:
```typescript
import { vibezcheck } from "vibezcheck";

const vz = vibezcheck();

// Automatically finds existing customer by email or creates a new one in Stripe
const customer = await vz.customers.getOrCreate({
  email: "alex@company.com",
  name: "Alex Rivera",
});
console.log(customer.id); // "cus_R3K7h9Qv..."
```

### B. 1-Line Stripe Checkout Session:
```typescript
const checkoutUrl = await vz.billing.createCheckoutSession({
  customerId: customer.id,
  priceId: "price_metered_tokens", // Your Stripe metered price ID
  returnUrl: "https://myapp.com/dashboard",
});
```

---

## 📊 Live Telemetry Payload Structure

Every inference event emitted by `onUsage` captures complete token and cost economics:

```json
{
  "timestamp": "2026-08-31T11:00:00.000Z",
  "model": "openai/gpt-4o-mini",
  "provider": "openai",
  "customerId": "cus_R3K7h9Qv",
  "usage": {
    "inputTokens": 850,
    "outputTokens": 420,
    "totalTokens": 1270,
    "reasoningTokens": 280,
    "cachedTokens": 500
  },
  "cost": {
    "inputUSD": 0.000127,
    "outputUSD": 0.000252,
    "totalUSD": 0.000379
  }
}
```

---

## 📜 Supported Models (Auto-Priced)

| Model Family | Examples | Reasoning Aware | Caching Discounts |
| :--- | :--- | :---: | :---: |
| **OpenAI** | `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini`, `gpt-5.6-sol` | ✅ | ✅ |
| **Anthropic** | `claude-3-7-sonnet`, `claude-3-5-sonnet`, `claude-3-5-haiku` | ✅ | ✅ |
| **Google** | `gemini-2.0-flash`, `gemini-1.5-pro` | ✅ | ✅ |
| **DeepSeek** | `deepseek-chat`, `deepseek-reasoner` | ✅ | ✅ |
| **Custom** | Register any custom model with `registerModelPricing()` | ✅ | ✅ |

---

## 📄 License

MIT © [seeyouin2x5x](https://github.com/seeyouin2x5x)
