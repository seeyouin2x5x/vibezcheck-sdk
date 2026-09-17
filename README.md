# ✦ VibezCheck

Know what every AI request costs.  
The cost layer for AI applications.

VibezCheck measures AI usage in real dollars — per request, customer, feature, model, or agent session.

```text
AI request → tokens → provider cost → customer economics
```

```bash
npm install vibezcheck
```

---

## Why VibezCheck?

Tokens are useful for engineers.  
Dollars are useful for businesses.

AI providers bill you in tokens.

Your users buy:
- messages
- documents
- agent runs
- API calls
- credits
- subscriptions

VibezCheck connects the two.

```text
What your user does
       ↓
   AI usage
       ↓
 Provider cost
       ↓
Customer economics
```

Without a metering layer, you know what your users are doing — but not necessarily what each action costs you.

---

## ⚡ Quick Start

### Vercel AI SDK

Wrap an existing model:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

const result = streamText({
  model: vibezcheck(openai('gpt-4o-mini'), {
    customer: 'user_123',
    maxCostPerCallUSD: 0.50,
  }),
  prompt: 'Summarize quantum computing in three sentences.',
});
```

That's it.

VibezCheck can now calculate the request's usage and provider cost while the request runs.

**Example:**
> `✦ $0.0028 · 1,420 tok · gpt-4o-mini`

- No VibezCheck proxy.
- No required database.
- No required cloud account.

---

## 💰 Measure

VibezCheck gives your application an economic view of AI usage.

### Request cost

```typescript
const cost = vibezcheck.calculateCost('gpt-4o-mini', {
  promptTokens: 1240,
  completionTokens: 150,
});
console.log(cost.totalUSD);
// 0.000276
```

### Customer attribution

```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'user_123',
  threadId: 'thread_456',
  metadata: {
    plan: 'pro',
    feature: 'document-analysis',
  },
});
```

Track usage by:
- customer
- organization
- feature
- thread
- model
- agent session

---

## 🛡️ Control

AI agents can make multiple calls before a workflow finishes.  
Put a ceiling on them.

### Per-request limits

```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  maxCostPerCallUSD: 0.25,
  maxTokensPerCall: 4000,
});
```

### Agent session budgets

```typescript
const session = vibezcheck.session({
  customer: 'tenant_123',
  sessionBudgetUSD: 2.00,
});
```

The entire workflow gets a hard spending ceiling.

### Tool costs

```typescript
const tools = session.tools(agentTools, {
  web_search: {
    costUSD: 0.01,
  },
  code_interpreter: {
    costUSD: 0.05,
  },
});
```

Now you can account for:

```text
LLM usage + Tool usage = Agent cost
```

---

## 💳 Monetize

Your provider cost can become part of your application's pricing model.

```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'user_123',
  pricing: {
    markup: 1.3,
  },
});
```

A 1.3x markup means:

```text
Provider cost   $1.00
Customer price  $1.30
─────────────────────
Markup            30%
```

This lets you build products where AI usage can map directly to:
- credits
- usage limits
- customer pricing
- subscriptions
- metered billing

---

## 🧾 AI Cost Receipts

Show users the cost of individual AI responses.

```tsx
import { VibezReceipt } from 'vibezcheck/ui';

{message.role === 'assistant' && (
  <VibezReceipt message={message} />
)}
```

**Example:**
> `✦ $0.0001 · 31 tok · gpt-4o-mini`

For complete conversations, use the spending HUD:

```tsx
import { VibezCheck } from 'vibezcheck/ui';

<VibezCheck messages={messages} />
```

The HUD can show:

```text
┌─────────────────────────┐
│ AI Usage                │
│                         │
│ $0.0248                 │
│ 12,420 tokens           │
│                         │
│ gpt-4o-mini     $0.0182 │
│ gpt-4o          $0.0066 │
└─────────────────────────┘
```

---

## 🔌 Native Provider Streams

VibezCheck also works outside the Vercel AI SDK.

```typescript
import OpenAI from 'openai';
import { vibezcheck } from 'vibezcheck';

const openai = new OpenAI();
const client = vibezcheck.create();

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: 'Hello!',
    },
  ],
  stream: true,
  stream_options: {
    include_usage: true,
  },
});

const meteredStream = client.wrapStream(stream, {
  model: 'gpt-4o-mini',
  customer: 'user_123',
  onUsage: (event) => {
    console.log(
      `Cost: $${event.cost.totalUSD} (${event.usage.totalTokens} tokens)`
    );
  },
});
```

Use VibezCheck with native provider streams without routing requests through a VibezCheck gateway.

---

## 💵 Offline Pricing Engine

VibezCheck includes a bundled pricing catalog so known model costs can be calculated locally.

```typescript
const rates = vibezcheck.getModelPricing('gpt-4o-mini');
console.log(rates);
// { inputPer1M: 0.15, outputPer1M: 0.60 }
```

Calculate costs synchronously:

```typescript
const cost = vibezcheck.calculateCost('gpt-4o-mini', {
  promptTokens: 1000,
  completionTokens: 500,
});
console.log(cost.totalUSD);
// 0.00045
```

Optional pricing synchronization:

```typescript
await vibezcheck.syncPricing();
await vibezcheck.syncVercelGateway();
```

---

## 📊 700+ Model Pricing Catalog

VibezCheck ships with pricing information for hundreds of models and providers.

| Provider | Examples |
|---|---|
| **OpenAI** | GPT-4o, GPT-4o-mini, o1, o3-mini |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude 3 Opus |
| **Google** | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |
| **DeepSeek** | DeepSeek R1, DeepSeek V3 |
| **Meta / Groq** | Llama 3.3 70B, Llama 3.1 8B |
| **Mistral** | Mistral Large, Codestral, Pixtral |
| **Gateways / Cloud** | AWS Bedrock, Azure OpenAI, OpenRouter, Vercel AI Gateway |

Pricing is bundled locally for offline calculations and can optionally be refreshed.

---

## 🗄️ Store Usage Events

VibezCheck does not require a database.  
When you want persistence, attach a sink.

### Supabase

```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'user_123',
  database: vibezcheck.supabase(supabase),
});
```

### Custom database

Use your existing infrastructure:

```typescript
const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'user_123',
  database: vibezcheck.database(async (event) => {
    await db.insert(usageEvents).values({
      customerId: event.customerId,
      model: event.model,
      tokens: event.usage.totalTokens,
      costUSD: event.cost.totalUSD,
    });
  }),
});
```

Use your own:
- PostgreSQL
- Supabase
- Drizzle
- Prisma
- MongoDB
- ClickHouse
- webhooks
- analytics systems

---

## 💳 Billing Integrations

Usage events can be connected to billing systems such as Stripe or Metronome.

For example:

```typescript
const model = vibezcheck('openai/gpt-4o-mini', {
  customer: 'cus_123',
  database: vibezcheck.database(async (event) => {
    // Send event to your billing system
    await recordBillableUsage({
      customerId: event.customerId,
      costUSD: event.cost.totalUSD,
    });
  }),
});
```

VibezCheck gives you the usage event.  
You decide how that usage becomes revenue.

---

## 🧠 AI Agents

Agentic applications need more than token tracking.  
They need economic boundaries.

```typescript
const session = vibezcheck.session({
  customer: 'enterprise_123',
  sessionBudgetUSD: 5.00,
});

const tools = session.tools(agentTools, {
  web_search: {
    costUSD: 0.01,
  },
  code_interpreter: {
    costUSD: 0.05,
  },
});

const result = await runAutonomousWorkflow({
  model: session.model('gpt-4o'),
  tools,
});
```

VibezCheck can track:

```text
Model calls + Tool calls + Multiple turns
                  ↓
          Total agent cost
```

---

## 🏗️ Production Characteristics

### Zero runtime dependencies
`dependencies: {}`  
The core library does not require an external runtime dependency.  
Provider SDKs, React, and database clients are optional integrations.

### No network proxy
Model requests continue directly between your application and the provider.  
VibezCheck runs inside your application.

### No prompt storage by default
VibezCheck does not need to store prompts or model completions to calculate usage and cost.  
Your application controls what gets persisted through optional database adapters.

### Failure isolation
Telemetry and database reporting should not become a dependency of the user-facing AI response.  
VibezCheck supports asynchronous reporting through serverless lifecycle mechanisms such as:
- Next.js / Vercel `globalThis.after()`
- Cloudflare Workers `waitUntil()`

### Offline capable
The bundled pricing catalog allows cost calculations without requiring an external network request.

---

## 🔄 How It Works

```text
Your Application
       │
       ▼
┌──────────────────┐
│   AI Provider    │
│ OpenAI / Claude  │
│  Gemini / etc.   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   VibezCheck     │
│                  │
│     Usage        │
│     Cost         │
│  Attribution     │
│     Limits       │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
Application  Async sinks
 economics   DB / billing / analytics
```

The important part:  
Your model traffic stays in your application path.  
VibezCheck adds the economic layer around it.

---

## 🧩 Supported Integrations

### AI SDKs
- Vercel AI SDK
- OpenAI
- Anthropic
- Gemini
- Native streaming APIs

### Storage
- Supabase
- Custom database adapters
- PostgreSQL
- Drizzle
- Prisma
- MongoDB
- ClickHouse

### Billing
- Stripe
- Metronome
- Custom billing systems

### UI
- React
- `<VibezReceipt />`
- `<VibezCheck />`

---

## 🔍 CLI

Audit your project for potentially unmetered AI calls:

```bash
npx vibezcheck audit
```

Generate starter examples:

```bash
npx vibezcheck examples
```

---

## 🚀 Complete Example

A typical AI chat application can look like this:

```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, userId } = await req.json();

  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: userId,
      pricing: {
        markup: 1.3,
      },
      maxCostPerCallUSD: 0.50,
    }),
    messages,
  });

  return vibezcheck.toResponse(result);
}
```

Your application now has:
- ✓ Model usage
- ✓ Dollar cost
- ✓ Customer attribution
- ✓ Pricing / markup
- ✓ Per-request protection
- ✓ Streaming support

---

## 🎯 The Economic Layer for AI

AI applications are becoming more autonomous.  
More messages.  
More context.  
More tool calls.  
More model calls.  
More cost.

VibezCheck gives your application a way to understand that cost at the point where the AI request happens.

```text
       MEASURE
          │
    ┌─────┴─────┐
    │           │
 tokens      dollars
    │           │
    └─────┬─────┘
          │
       CONTROL
  budgets / limits
          │
      MONETIZE
  pricing / billing
```

**Know what every AI request costs.**

---

## Roadmap

### Current
- Request-level cost metering
- 700+ model pricing catalog
- Streaming support
- Customer attribution
- Circuit breakers
- Agent session budgets
- Tool cost tracking
- React usage UI
- Database sinks

### Next
- Persistent cost history
- Per-customer budgets
- Spend alerts
- Cost anomaly detection
- Native billing integrations
- Unit economics analytics

---

## Contributing

Contributions are welcome.

```bash
pnpm install
pnpm test
pnpm typecheck
```

To update model pricing:  
`src/pricing/catalog.ts`

Please ensure tests pass and no unnecessary runtime dependencies are introduced.

---

## License

MIT © VibezCheck  
[Website](https://vibezcheck.xyz/) · [npm](https://www.npmjs.com/package/vibezcheck)  
Contact: [yt@vibezcheck.app](mailto:yt@vibezcheck.app)
