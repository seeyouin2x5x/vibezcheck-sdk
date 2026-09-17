# VibezCheck

Know what every AI request costs.

VibezCheck is a lightweight TypeScript library for measuring
AI usage and calculating the real dollar cost of model requests.

[![npm version](https://img.shields.io/npm/v/vibezcheck.svg?color=cb3837)](https://npmjs.org/package/vibezcheck)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Latency](https://img.shields.io/badge/Latency-0ms%20Added-orange.svg)]()
[![Dependencies](https://img.shields.io/badge/Dependencies-0%20Runtime-success.svg)]()

---

## Why

Tokens are useful for engineers.  
Dollars are useful for businesses.

VibezCheck connects:

```text
AI request → usage → cost
```

Without a metering layer, AI pricing and product economics are disconnected:
- **What users do**: Messages, documents, autonomous agents, voice, images, tool calls.
- **What you pay for**: Input tokens, output tokens, context cache hits, reasoning tokens, retries.
- **What the business needs**: Cost per customer, spend limits, margin, revenue.

VibezCheck connects the two with in-process, zero-latency calculation.

---

## Install

```bash
npm install vibezcheck
```

Or using your package manager of choice:

```bash
pnpm add vibezcheck
# or
bun add vibezcheck
```

---

## Quick start

### 1. Vercel AI SDK (1 Line)

Wrap any model to track request costs, customer attribution, and spend caps:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: 'user_123',
    pricing: { margin: 1.3 }, // +30% retail profit margin
    maxCostPerCallUSD: 0.50,  // Auto-terminates runaway calls at $0.50
  }),
  prompt: 'Summarize quantum computing in three sentences.',
});
```

### 2. Native Provider Streams (OpenAI, Anthropic, Gemini)

Meter raw streaming responses outside the Vercel AI SDK with 0ms added latency:

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

const meteredStream = client.wrapStream(stream, {
  model: 'gpt-4o-mini',
  customer: 'user_123',
  onUsage: (event) => {
    console.log(`Cost: $${event.cost.totalUSD} (${event.usage.totalTokens} tokens)`);
  },
});
```

### 3. Synchronous Cost Calculation (Offline)

Compute the exact dollar cost of any token usage synchronously:

```typescript
import { vibezcheck } from 'vibezcheck';

const cost = vibezcheck.calculateCost('gpt-4o-mini', {
  promptTokens: 1240,
  completionTokens: 150,
});

console.log(cost.totalUSD); // $0.000276
```

---

## What you get

- **Request-level AI cost**: Exact dollar cost calculated in-process per model request.
- **Token usage**: Full breakdown of prompt, completion, cached reads, and reasoning tokens.
- **Streaming support**: Real-time stream interception without buffering or delaying chunk delivery.
- **Model pricing**: Pre-bundled rate cards for 700+ models, with optional dynamic sync.
- **Customer attribution**: Tag usage with `customer`, `organization`, `featureId`, or `threadId`.
- **Circuit breakers**: Prevent runaway agent loops with `maxCostPerCallUSD` and `maxTokensPerCall`.
- **Profit margins**: Apply retail markups (e.g. `margin: 1.4` for 40% gross margin) to billed costs.
- **Database sinks**: Built-in background sinks for Supabase, Metronome, and custom DIY adapters (Drizzle, Prisma, MongoDB).
- **React UI widgets**: Optional drop-in `<VibezReceipt />` micro-badge and `<VibezCheck />` financial HUD from `vibezcheck/ui`.

---

## Built for production

- **Lightweight**: Zero external runtime dependencies (`dependencies: {}`). Clean, tree-shakeable ESM/CJS exports.
- **Developer-first**: Wraps directly around your existing AI SDK or model client in a single line of code.
- **No prompt storage by default**: 100% Zero Data Retention (ZDR). User prompts and model completions remain strictly in your application memory and are never logged or transmitted.
- **Zero latency overhead**: In-process math executes synchronously during streaming.
- **Airbag failure isolation**: Database or telemetry reporting errors run asynchronously in non-blocking lifecycles (`globalThis.after()` / `waitUntil()`) and will never crash user-facing streams.
- **Offline resilience**: Rates and calculations work immediately in air-gapped environments without external internet calls.

---

## Supported models

Pre-bundled pricing catalog across 700+ foundation models, inference providers, and runtimes:

| Provider | Supported Models |
|---|---|
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, o3-mini, GPT-4-turbo, text-embedding-3 |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| **Google** | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| **DeepSeek** | DeepSeek R1, DeepSeek V3 |
| **Groq / Meta** | Llama 3.3 70B, Llama 3.1 8B, Llama 3.1 405B |
| **Mistral AI** | Mistral Large 2, Codestral, Pixtral |
| **Cloud Gateways** | AWS Bedrock, Azure OpenAI, OpenRouter, Vercel AI Gateway |

To sync the latest upstream rate cards dynamically:

```typescript
await vibezcheck.syncPricing();
await vibezcheck.syncVercelGateway();
```

---

## How it works

```text
Your application
      |
      +---- AI provider (OpenAI / Anthropic / Gemini)
      |
      +---- VibezCheck meter (in-process, 0ms latency)
                |
                +---- Cost calculation (micro-cents)
                +---- Spend limits & circuit breakers
                +---- Usage attribution (customer / feature)
                +---- Async reporting (Stripe / DB / Metronome)
```

1. **Direct Connection**: Your application communicates directly with model providers without routing through third-party proxy gateways.
2. **In-Process Metering**: VibezCheck measures tokens, cache discounts, and reasoning rates synchronously in your runtime memory.
3. **Async Non-Blocking Reporting**: Telemetry events dispatch asynchronously using serverless hooks (`globalThis.after()`, `waitUntil()`), preserving uninterrupted streaming performance.

---

## Examples

### AI chatbot

Meter chat routes and display cost receipts on assistant responses:

**Server route (`app/api/chat/route.ts`):**
```typescript
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex',
      pricing: { margin: 1.25 }, // 25% profit margin
      maxCostPerCallUSD: 0.10,   // $0.10 cap per message
    }),
    messages: await convertToModelMessages(messages),
  });

  return vibezcheck.toResponse(result);
}
```

**Client component (`components/chat.tsx`):**
```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { VibezReceipt, VibezCheck } from 'vibezcheck/ui';

export function Chat() {
  const { messages } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <p>{m.content}</p>
          {m.role === 'assistant' && <VibezReceipt message={m} />}
        </div>
      ))}
      <VibezCheck messages={messages} />
    </div>
  );
}
```

---

### AI agent

Enforce a session-wide budget cap over multi-turn agent loops and bill for tool invocations:

```typescript
import { vibezcheck } from 'vibezcheck';

// Initialize agent session with hard spend cap
const session = vibezcheck.session({
  customer: 'tenant_enterprise_99',
  sessionBudgetUSD: 2.00, // Terminate if total agent loop exceeds $2.00
});

// Attach pricing to agent tools
const tools = session.tools(agentTools, {
  web_search: { costUSD: 0.01 },
  code_interpreter: { costUSD: 0.05 },
});

// Run agent loop with automatic circuit breaker
const result = await runAutonomousWorkflow({
  model: session.model('gpt-4o'),
  tools,
});
```

---

### Document processing

Track per-document parsing, embedding, and summarization costs:

```typescript
import { vibezcheck } from 'vibezcheck';

export async function processDocument(docId: string, text: string, customerId: string) {
  const client = vibezcheck.create();

  // Track embedding cost
  const embeddingResponse = await generateEmbeddings(text);
  client.track(embeddingResponse, {
    customer: customerId,
    model: 'text-embedding-3-small',
  });

  // Track summarization cost
  const summaryResponse = await summarizeText(text);
  client.track(summaryResponse, {
    customer: customerId,
    model: 'gpt-4o-mini',
  });

  const summary = client.getUsageSummary();
  console.log(`Document ${docId} processed for $${summary.totalCostUSD}`);
  await client.flush();
}
```

---

### Usage-based billing

Send billable usage events directly to Stripe Meters or Metronome:

```typescript
import { vibezcheck } from 'vibezcheck';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const model = vibezcheck('openai/gpt-4o-mini', {
  customer: 'cus_stripe_12345',
  pricing: { margin: 1.5 }, // 50% target gross contribution margin
  database: vibezcheck.database(async (event) => {
    // Send billable event to Stripe Meters
    await stripe.billing.meterEvents.create({
      event_name: 'ai_compute_units',
      payload: {
        value: Math.round(event.cost.totalUSD * 100).toString(), // Billed cents
        stripe_customer_id: event.customerId,
      },
    });
  }),
});
```

---

## Roadmap

- **V0 (Current)**: Lightweight in-process NPM library with 700+ model pricing catalog, circuit breakers, and streaming support.
- **V1**: Cloud cost history, customer attribution, and multi-project environments.
- **V2**: Advanced per-customer budgets, soft spend alerts, and Slack/webhook notifications.
- **V3**: Unit economics analytics, gross contribution tracking, and runaway anomaly detection.
- **V4**: Native usage billing bridges (Stripe Billing, Lago, Metronome).

---

## Contributing

Contributions are welcome!
- To add or update model pricing rates: see `src/pricing/catalog.ts`.
- To run tests: `pnpm test`
- To check types: `pnpm typecheck`

Please ensure all tests pass and no external runtime dependencies are introduced.

---

## License

MIT © [VibezCheck](https://vibezcheck.xyz)  
Contact: [yt@vibezcheck.app](mailto:yt@vibezcheck.app)
