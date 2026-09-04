---
name: vibezcheck
description: >-
  The official VibezCheck skill for metering LLMs and Stripe usage-based billing with 0ms added latency.
  Use when creating, modifying, or auditing AI streaming routes, adding token cost metering, setting profit margins,
  preventing runaway AI loops with safety circuit breakers, or dropping in <VibezReceipt /> micro-badges.
---

# VibezCheck: 0ms LLM Token Metering & Stripe Billing

> **The Electric Meter for Artificial Intelligence.**  
> `vibezcheck` is the declarative, 1-line Stripe Billing and Token Metering engine for LLMs. It tracks tokens, extracts hidden reasoning thoughts, calculates real-time USD costs, and bills customers with **0ms added streaming latency**.

---

## When to Activate This Skill

Activate this skill whenever you are:
* **Writing or Modifying AI Routes**: Building API endpoints using Vercel AI SDK (`streamText`, `generateText`, `streamObject`, `generateObject`) or native OpenAI / Anthropic SDKs.
* **Auditing Codebases**: Finding unmetered AI endpoints or runaway loop vulnerabilities in Next.js or Node repos using `npx vibezcheck audit`.
* **Adding Usage Billing**: Monetizing LLM features, setting profit margins (e.g. Cost + 50%), or implementing prepaid/postpaid billing.
* **Preventing Runaway Costs**: Configuring safety circuit breakers (default `$0.50` fuse box) to stop runaway loops.
* **Building Chat Interfaces**: Adding verified micro-receipts (`<VibezReceipt />`) or live session counters (`<VibezSessionWidget />`).

---

## 🛡️ Sane Defaults (Zero-Config Engine)

VibezCheck enforces **6 Sane Defaults** that are active automatically without boilerplate:
1. **0ms In-Process Wrapper**: Intercepts `LanguageModelV1` streams in-memory with zero remote proxy latency.
2. **Default $0.50 Fuse Ceiling**: Halts runaway loops automatically without requiring manual ceilings.
3. **In-Flight Abort Trapper**: Traps and bills partial output tokens if a user closes their browser tab mid-stream.
4. **Automatic 85% Prompt Cache Discounts**: Automatically detects cache hits on Claude 3.7, GPT-4o, and DeepSeek.
5. **Serverless Lifecycle Protection**: Enqueues telemetry flushes into Next.js 15 `after()` or Cloudflare `waitUntil()`.
6. **Free Local Vibe Mode**: Works 100% in local development without needing a Stripe account.

---

## ⚡ Quick Start: 1-Line Declarative Metering

Wrap any model in `vibezcheck(...)`:

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customerId = 'user_123' } = await req.json();

  const result = streamText({
    // ⚡ 1-Line Zero-Latency Metering
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: customerId,
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
```

---

## 🛠️ Core Workflows & Code Patterns

### 1. Codebase Token Leak Audit (`npx vibezcheck audit`)
To inspect any Next.js or Node project for unmetered AI routes:
```bash
# Interactive audit scan (< 40ms)
npx vibezcheck audit

# Automatically wrap unmetered routes with safety backups
npx vibezcheck audit --fix

# Run in CI/CD pipeline (exits 1 on unmetered routes)
npx vibezcheck audit --ci
```

---

### 2. Monetization & Guaranteed Profit Margins
Turn raw wholesale provider costs into guaranteed net profit on Stripe:

```typescript
model: vibezcheck('openai/gpt-4o-mini', {
  customer: 'alex@company.com',
  pricing: {
    margin: 1.5,           // Cost + 50% profit margin
    minimumChargeUSD: 0.01 // $0.01 minimum floor per call
  },
})
```

---

### 3. Prepaid vs. Postpaid Dual Modes
* **Postpaid (Default)**: Invoices customer on Stripe at the end of the billing cycle.
* **Prepaid**: Deducts from a prepaid credit balance in real time with 0ms latency.

```typescript
// Prepaid mode with real-time balance guard
model: vibezcheck('anthropic/claude-3-5-haiku', {
  customer: 'user_456',
  billing: {
    mode: 'prepaid',
    balanceUSD: 5.00,
    onLowBalance: 'throw', // Throws 402 Payment Required if balance empty
  },
})
```

---

### 4. Overriding Circuit Breaker Safety Fuse
The default ceiling is `$0.50` per call. To customize or disable for heavy batch jobs:

```typescript
// For long research reports or high-token batch jobs:
model: vibezcheck('openai/o3-mini', {
  customer: 'user_enterprise',
  maxCostPerCallUSD: 5.00, // Custom $5.00 ceiling
  // maxCostPerCallUSD: Infinity, // Disable ceiling completely
})
```

---

### 5. Unified Agent Tool Call Metering
Bill both LLM tokens and external tools (web search, sandboxes, scrapers) into the same customer balance:

```typescript
import { vibezcheck } from 'vibezcheck';
import { tool } from 'ai';
import { z } from 'zod';

const session = vibezcheck.session({ customer: 'alex@company.com' });

const result = streamText({
  model: session.model('openai/gpt-4o-mini'),
  tools: {
    webSearch: tool({
      description: 'Search the web',
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        // Track external API call cost ($0.01) into user's bill
        await session.trackTool('web_search', { costUSD: 0.01 });
        return `Results for ${query}...`;
      },
    }),
  },
  prompt,
});
```

---

### 6. React Frontend Suite (`vibezcheck/react`)

#### Drop-In Micro-Badge (`<VibezReceipt />`)
Renders the Electric Lime sparkle `✦`, token counts, reasoning tokens, exact dollar cost, and latency below assistant chat bubbles:

```tsx
import { VibezReceipt } from 'vibezcheck/react';

export function ChatBubble({ message }) {
  return (
    <div className="message-container">
      <div className="bubble">{message.content}</div>
      {message.role === 'assistant' && (
        <VibezReceipt message={message} />
      )}
    </div>
  );
}
```

#### Floating Speedometer Widget (`<VibezSessionWidget />`)
```tsx
import { VibezSessionProvider, VibezSessionWidget } from 'vibezcheck/react';

export default function Layout({ children }) {
  return (
    <VibezSessionProvider>
      {children}
      <VibezSessionWidget position="bottom-right" theme="light" />
    </VibezSessionProvider>
  );
}
```

---

## 🚫 Common Pitfalls & Anti-Patterns

1. **Do NOT Put Reverse Proxies in Front**:
   * *Anti-Pattern*: Routing OpenAI requests through a remote third-party URL proxy adds 50–200ms latency.
   * *The VibezCheck Way*: `vibezcheck()` wraps `LanguageModelV1` inside your existing Node process with **0ms added latency**.

2. **Do NOT Manually Calculate Token Costs**:
   * *Anti-Pattern*: Writing manual `tokens * 0.000002` formulas with floating point drift.
   * *The VibezCheck Way*: VibezCheck uses BigInt nano-precision math, automatic cache discounts, and reasoning token extraction.

3. **Do NOT Leave AI Routes Unmetered in Production**:
   * Run `npx vibezcheck audit` before deploying to catch exposed routes.
