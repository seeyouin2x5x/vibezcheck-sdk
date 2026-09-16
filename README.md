# ✦ VibezCheck

> **Track AI token spend, protect agent loops, and bill users in real time. Setup in 1 line.**  
> Zero external dependencies (`dependencies: {}`). 0ms added latency. Works completely offline.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-139%20Passed-brightgreen.svg)]()
[![Latency](https://img.shields.io/badge/Latency-0ms%20Added-orange.svg)]()
[![Dependencies](https://img.shields.io/badge/Dependencies-0%20External-success.svg)]()

---

## ⚡ The 1-Line Setup

**1. On your server:** wrap any model to track spending, add profit margin, and set safety fuses:
```typescript
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'usr_123',
  pricing: { margin: 1.3 }, // +30% profit margin
  maxCostPerCallUSD: 0.50,  // Auto-stops runaway calls at $0.50
});
```

**2. On your frontend:** drop in the HUD component to display real-time usage:
```tsx
import { VibezCheck } from 'vibezcheck/ui';

<VibezCheck messages={messages} />
```

---

## 📦 Features & Simplest Usage Examples

### 1. 1-Line Model Metering (Vercel AI SDK)
Wrap existing provider models or use declarative string model identifiers with 0ms added latency:
```typescript
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

// Option A: Wrap an existing provider instance
const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini')),
  prompt: 'Summarize quantum computing in 3 sentences.',
});

// Option B: Declarative string model identifier
const { text } = await generateText({
  model: vibezcheck('openai/gpt-4o-mini'),
  prompt: 'Explain general relativity.',
});
```

---

### 2. Customer Identification & Session Metadata
Attach user IDs, agent threads, and custom billing tags without extra database lookups:
```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'user_alex@example.com',  // User ID, email, or Stripe Customer ID
  threadId: 'agent_thread_4920',      // Conversation or workflow thread ID
  metadata: { plan: 'pro', team: 'ai-ops' },
});
```

---

### 3. Monetization & Profit Margins (Markups)
Turn wholesale LLM expenses into profitable revenue with automatic markups:
```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  pricing: {
    margin: 1.25, // 25% profit margin applied to billed cost
  },
});
```

---

### 4. Circuit Breakers (Runaway Loop & Cost Protection)
Prevent infinite agent loops and accidental multi-hundred-dollar API bills with pre-flight and in-flight circuit breakers:
```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  maxCostPerCallUSD: 0.25, // Auto-terminates if call exceeds $0.25
  maxTokensPerCall: 4000,  // Auto-terminates if prompt + completion exceeds 4,000 tokens
});
```

---

### 5. Floating React Spending HUD (`<VibezCheck />`)
A zero-prop floating financial HUD and expandable card that displays real-time tokens and costs directly from your `useChat()` messages array:
```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { VibezCheck } from 'vibezcheck/ui'; // or 'vibezcheck/react'

export default function ChatView() {
  const { messages } = useChat();

  return (
    <div>
      {/* Your chat UI */}
      <VibezCheck messages={messages} />
    </div>
  );
}
```
* **⇅ Unit Swap**: Click to toggle between **Dollar Cost** (`$0.0028`) and **Tokens** (`1,420 tok`).
* **Multi-Model Breakdown**: Automatically displays per-model spend splits when conversations route across multiple models.
* **Customer Privacy by Default**: Wholesale developer costs and margin formulas remain private unless explicitly enabled.

---

### 6. Per-Message Turn Micro-Receipt (`<VibezReceipt />`)
Display an elegant micro-badge showing token count, cost, model, and latency below each assistant message:
```tsx
import { VibezReceipt } from 'vibezcheck/ui';

// Inside your assistant message bubble
{message.role === 'assistant' && (
  <div className="flex justify-end mt-2">
    <VibezReceipt message={message} />
  </div>
)}
// Renders: ✦ $0.0001 · 31 tok · gpt-4o-mini
```

---

### 7. Supabase Database Sink
Persist usage records directly into your Supabase database in the background without slowing down the inference stream:
```typescript
import { createClient } from '@supabase/supabase-js';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'usr_alex',
  database: vibezcheck.supabase(supabase), // Inserts to default 'vibez_usage' table
});
```

---

### 8. Extensible DIY Database Adapter (Drizzle, Kysely, MongoDB, ClickHouse)
Plug in any custom database, ORM, or logging service with a simple 1-line callback:
```typescript
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'usr_alex',
  database: vibezcheck.database(async (event) => {
    // Custom sink: Drizzle, Kysely, Mongo, Prisma, or custom webhook
    await db.insert(usageEvents).values({
      customerId: event.customerId,
      model: event.model,
      tokens: event.usage.totalTokens,
      costUSD: event.cost.totalUSD,
    });
  }),
});
```

---

### 9. Metronome Usage-Based Billing Ingestion
Directly stream usage records to Metronome's `/v1/ingest` API using native zero-dependency HTTP requests:
```typescript
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'cust_metronome_456',
  database: vibezcheck.metronome({
    apiKey: process.env.METRONOME_API_KEY!,
  }),
});
```

---

### 10. Offline Pricing Engine & Dynamic Rate Sync
Compute token costs synchronously in 0ms using bundled offline catalogs (700+ models) or optionally sync dynamic upstream rates:
```typescript
import { vibezcheck } from 'vibezcheck';

// Synchronous 0ms offline calculation (works without internet)
const rates = vibezcheck.getModelPricing('gpt-4o-mini');
// { inputPer1M: 0.15, outputPer1M: 0.60 }

const cost = vibezcheck.calculateCost('gpt-4o-mini', {
  promptTokens: 1000,
  completionTokens: 500,
});
console.log(cost.totalUSD); // $0.00045

// Optional: refresh rates dynamically in the background
await vibezcheck.syncPricing();       // Sync Stripe Metronome rates
await vibezcheck.syncVercelGateway();  // Sync Vercel AI Gateway 260+ models
```

---

### 11. Autonomous Agent Governance & Tool Ceilings
Enforce a hard budget ceiling over multi-step agent loops and bill for tool invocations:
```typescript
import { vibezcheck } from 'vibezcheck';

const session = vibezcheck.session({
  customer: 'usr_agent_runner',
  sessionBudgetUSD: 1.00, // Hard ceiling for entire multi-turn workflow
});

// Bill for tool executions
const tools = session.tools(myTools, {
  web_search: { costUSD: 0.01 },
  code_interpreter: { costUSD: 0.05 },
});
```

---

### 12. Serverless Lifecycle Spooling & Manual Flush
VibezCheck automatically hooks into `globalThis.after()` on Next.js / Vercel and `globalThis.waitUntil()` on Cloudflare Workers so logging never delays stream delivery. You can also explicitly flush before process termination:
```typescript
import { vibezcheck } from 'vibezcheck';

// Guarantees all queued usage telemetry is written before worker teardown
await vibezcheck.flush();
```

---

### 13. Native Non-AI-SDK Streams (OpenAI, Anthropic, Gemini)
Meter raw SDK streams outside the Vercel AI SDK with 0ms added latency:
```typescript
import OpenAI from 'openai';
import { vibezcheck } from 'vibezcheck';

const openai = new OpenAI();
const client = vibezcheck.create();

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Hello!' }],
  stream: true,
  stream_options: { include_usage: true },
});

// Meter stream in real time
const meteredStream = client.wrapStream(stream, {
  model: 'gpt-4o-mini',
  onUsage: (event) => {
    console.log(`Billed: $${event.cost.totalUSD} for ${event.usage.totalTokens} tokens`);
  },
});
```

---

### 14. CLI Diagnostics & Starter Scaffolding
Inspect your codebase for unmetered LLM endpoints or scaffold complete starter templates:
```bash
# Scan project routes for unmetered AI SDK calls
npx vibezcheck audit

# Scaffold starter projects (Next.js App Router, minimal scripts, etc.)
npx vibezcheck examples
```

---

## 🚀 Complete Next.js App Router Example

### Server Route (`app/api/chat/route.ts`)
```typescript
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com',
      pricing: { margin: 1.3 }, // +30% margin
      maxCostPerCallUSD: 0.50,  // Circuit breaker
    }),
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  return vibezcheck.toResponse(result);
}
```

### Frontend Client (`app/page.tsx`)
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
    <div className="flex flex-col w-full max-w-lg py-20 mx-auto px-4 min-h-screen">
      <div className="flex-1 space-y-4 mb-28">
        {messages.map((message) => (
          <div key={message.id} className="p-4 rounded-xl border">
            <div>{message.content}</div>
            {message.role === 'assistant' && (
              <div className="mt-2 flex justify-end">
                <VibezReceipt message={message} />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage({ text: input }); setInput(''); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type prompt..." />
      </form>

      <VibezCheck messages={messages} />
    </div>
  );
}
```

---

## 🛡️ Core Guarantees & Philosophy

* **Zero Added Latency (0ms)**: Calculations happen in-memory synchronously. Telemetry and database writes occur asynchronously via non-blocking lifecycles.
* **Pure Zero Runtime Dependencies (`dependencies: {}`)**: Completely self-contained engine. Peer dependencies (`ai`, `@ai-sdk/provider`, `openai`, `react`) are purely optional.
* **Airbag Failure Isolation**: Database or remote sync outages will never crash user-facing AI chat streams.
* **Offline-First Resilience**: All rate calculations work immediately with bundled catalogs even with zero network access.

---

## 🔒 Privacy & Zero Data Retention (ZDR)

VibezCheck is architected with strict Zero Data Retention:
* **Zero Prompt / Completion Storage**: VibezCheck never stores, logs, inspects, or retains user prompts or AI completions. All data passing through the library stays strictly in your own process memory.
* **No Proxy Intermediaries**: VibezCheck is an in-process SDK wrapper, not a proxy service. Your API calls travel directly from your application to OpenAI, Anthropic, or Google with zero third-party intermediaries.
* **Zero Phone-Home Telemetry**: Pure self-contained engine (`dependencies: {}`) with zero telemetry calls home to external analytics servers.
* **Open Standards**: Fully aligned with leading privacy-first infrastructure like [OpenRouter Data Collection](https://openrouter.ai/docs/guides/privacy/data-collection), [Provider Logging](https://openrouter.ai/docs/guides/privacy/provider-logging), and [Zero Data Retention (ZDR)](https://openrouter.ai/docs/guides/features/zdr).

---

## 📄 License

MIT © [VibezCheck](https://vibezcheck.xyz)
