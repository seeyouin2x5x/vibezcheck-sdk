# ✦ VibezAI — Next.js 15 AI SaaS Starter Template

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fseeyouin2x5x%2Fvibezcheck-sdk%2Ftree%2Fmain%2Fexamples%2Fnextjs-saas-starter&env=OPENAI_API_KEY,STRIPE_SECRET_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY&envDescription=API%20Keys%20for%20OpenAI%20and%20Stripe&project-name=vibezcheck-ai-saas)
[![npm version](https://img.shields.io/npm/v/vibezcheck?color=D4FF32&label=vibezcheck)](https://www.npmjs.com/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

The production-ready, zero-friction Next.js 15 AI SaaS template with **1-line Stripe Billing and Token Metering** with **0ms added latency**.

---

## ⚡ Key Features

* **0ms Added Streaming Latency**: Uses in-process web stream transformation with zero proxy lag.
* **1-Line Declarative Metering**: Wrap your model in `vibezcheck(openai('gpt-4o-mini'), { customer })`.
* **Automatic $0.50 Safety Fuse**: Built-in circuit breaker halts runaway client loops before you wake up to a massive OpenAI bill.
* **1-Line 50% Profit Margins**: Pass `{ pricing: { margin: 1.5 } }` to automatically mark up provider costs on Stripe.
* **Stripe Checkout Credit Top-Ups**: Pre-wired Stripe Checkout endpoint for credit packs or metered billing.
* **`<VibezReceipt />` Micro-Badges**: Drop-in micro-badge for chat bubbles displaying tokens, reasoning thoughts, and verified dollar cost.
* **`<VibezSessionWidget />`**: Floating real-time token and dollar session counter.
* **100% Free Local Vibe Mode**: Works locally out of the box with zero Stripe account required.

---

## 🚀 Quickstart

### 1. Clone or Deploy to Vercel

Click the **Deploy with Vercel** button above, or clone locally:

```bash
git clone https://github.com/seeyouin2x5x/vibezcheck-sdk.git
cd vibezcheck-sdk/examples/nextjs-saas-starter
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your API keys:
```env
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...              # Optional for local test mode
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install & Run Dev Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Architecture: The 1-Line Route

Here is the entire server-side billing implementation in `app/api/chat/route.ts`:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId = 'alex@example.com' } = await req.json();

  const result = streamText({
    // ⚡ 1-Line Declarative Model Metering
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: customerId,
      pricing: { margin: 1.5 }, // Cost + 50% profit margin
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## 🌿 Run the Codebase Audit

Check this project (or any Next.js app) for unmetered AI routes with the sub-100ms kind scanner:

```bash
npx vibezcheck audit
```

Output:
```
✦ vibezcheck audit (28ms)
  ✓ All AI routes are metered with $0.50 safety fuses.
  Your wallet is protected. You're good to ship.
```

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
