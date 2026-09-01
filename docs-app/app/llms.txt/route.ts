export const dynamic = 'force-static';

export async function GET() {
  const content = `# vibezcheck Documentation (for AI Agents, Cursor, Windsurf & LLMs)

> vibezcheck is the declarative 1-line Stripe Billing and Token Metering engine for LLMs and the Vercel AI SDK. It tracks tokens, extracts reasoning tokens, computes real-time dollar costs, bills customers in Stripe, and protects against runaway loops with 0ms added latency.

## Package Info
- **Package Name**: \`vibezcheck\`
- **Subpaths**: \`vibezcheck\`, \`vibezcheck/meter\`, \`vibezcheck/pricing\`, \`vibezcheck/billing\`, \`vibezcheck/customers\`, \`vibezcheck/react\`
- **CLI Commands**: \`npx vibezcheck init\` | \`npx vibezcheck prices\` | \`npx vibezcheck doctor\`

---

## 1. Single-Turn Generation (\`generateText\`)
\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const { text, usage } = await generateText({
  model: vibezcheck('openai/gpt-4o-mini', {
    customer: 'user@example.com', // Auto-creates or matches Stripe customer
    maxCostPerCallUSD: 0.20,      // Circuit breaker: aborts if call exceeds $0.20
  }),
  prompt: 'Summarize quantum computing in 2 sentences.',
});
\`\`\`

---

## 2. Streaming Route Handler (\`streamText\`)
\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export async function POST(req: Request) {
  const { messages, customer = 'anonymous' } = await req.json();

  return streamText({
    model: vibezcheck('gpt-4o-mini', {
      customer,
      onUsage: (event) => {
        console.log(\`Tokens: \${event.usage.totalTokens} | Cost: $\${event.cost.totalUSD}\`);
      },
    }),
    messages,
  }).toTextStreamResponse();
}
\`\`\`

---

## 3. Direct Provider Connection (\`createOpenAI\`)
\`\`\`typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const openai = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

const model = vibezcheck(openai('gpt-4o-mini'), {
  customer: 'alex@company.com',
});
\`\`\`

---

## 4. React Client Telemetry & Hooks (\`vibezcheck/react\`)
\`\`\`tsx
'use client';
import { VibezSessionProvider, useVibezChat, VibezSessionWidget, VibezBillingModal } from 'vibezcheck/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
    model: 'gpt-4o-mini',
  });

  return (
    <div className="p-6">
      {messages.map(m => <div key={m.id}>{m.role}: {m.content}</div>)}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
      <VibezSessionWidget theme="light" position="bottom-right" />
    </div>
  );
}
\`\`\`

---

## 5. Agent Circuit Breakers & Budget Ceilings
\`\`\`typescript
const model = vibezcheck('openai/o3-mini', {
  customer: 'agent_runner_1',
  maxCostPerCallUSD: 0.50,
  maxTokensPerCall: 20000,
  throwOnBudgetExceeded: true,
});
\`\`\`

---

## 6. Stripe Customer Provisioning in 1 Line
\`\`\`typescript
import { vibezcheck } from 'vibezcheck';

const vz = vibezcheck();
const customer = await vz.customers.getOrCreate({
  email: 'alex@company.com',
  name: 'Alex Rivera',
});
const checkoutUrl = await vz.billing.createCheckoutSession({
  customerId: customer.id,
  priceId: 'price_metered_tokens',
  returnUrl: 'https://myapp.com',
});
\`\`\`

## Supported Model IDs
\`gpt-4o\`, \`gpt-4o-mini\`, \`o1\`, \`o1-mini\`, \`o3-mini\`, \`gpt-5.6-sol\`, \`claude-3-7-sonnet\`, \`claude-3-5-sonnet\`, \`claude-3-5-haiku\`, \`gemini-2.0-flash\`, \`gemini-1.5-pro\`, \`deepseek-chat\`, \`deepseek-reasoner\`.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
