export const dynamic = 'force-static';

export async function GET() {
  const content = `# vibezcheck Documentation (for AI Agents, Cursor, Windsurf & LLMs)

> vibezcheck is the declarative 1-line Stripe Billing and Token Metering engine for LLMs and the Vercel AI SDK. It tracks tokens, extracts reasoning tokens, computes real-time dollar costs, bills customers in Stripe, and protects against runaway loops with 0ms added latency.

## Package Info
- **Package Name**: \`vibezcheck\` (v0.4.2)
- **Subpaths**: \`vibezcheck\`, \`vibezcheck/meter\`, \`vibezcheck/pricing\`, \`vibezcheck/billing\`, \`vibezcheck/customers\`, \`vibezcheck/react\`
- **CLI Commands**: \`npx vibezcheck audit\` | \`npx vibezcheck init\` | \`npx vibezcheck prices\` | \`npx vibezcheck doctor\`

---

## 1. Single-Turn Generation (\`generateText\`)
\`\`\`typescript
import { generateText } from 'ai';
import { vibezcheck } from 'vibezcheck';

const { text, usage } = await generateText({
  model: vibezcheck('openai/gpt-4o-mini', {
    customer: 'user@example.com', // Auto-creates or matches Stripe customer
    pricing: { margin: 1.5 },     // 50% profit margin
    maxCostPerCallUSD: 0.50,      // Default runaway loop fuse
  }),
  prompt: 'Summarize quantum computing in 2 sentences.',
});
\`\`\`

---

## 2. Streaming Route with Rich Customer Metadata & Supabase
\`\`\`typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  const { messages, user } = await req.json();

  return streamText({
    model: vibezcheck('openai/gpt-4o-mini', {
      customer: {
        id: user.stripeCustomerId,
        userId: user.id,
        email: user.email,
        orgId: user.organizationId,
        plan: 'pro',
      },
      pricing: { margin: 1.4 },
      database: supabase, // 0ms background auto-save to \`vibez_usage\` table
    }),
    messages,
  }).toDataStreamResponse();
}
\`\`\`

---

## 3. Codebase Audit Scanner
\`\`\`bash
# Audit project for unmetered AI endpoints (< 40ms)
npx vibezcheck audit

# Auto-wrap unmetered endpoints with safety backups
npx vibezcheck audit --fix
\`\`\`

---

## 4. React Client Telemetry & Micro-Badge (\`vibezcheck/react\`)
\`\`\`tsx
'use client';
import { VibezSessionProvider, useVibezChat, VibezSessionWidget, VibezReceipt } from 'vibezcheck/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useVibezChat({
    model: 'gpt-4o-mini',
  });

  return (
    <div className="p-6">
      {messages.map(m => (
        <div key={m.id}>
          <p>{m.role}: {m.content}</p>
          {m.role === 'assistant' && <VibezReceipt message={m} />}
        </div>
      ))}
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

## 5. Pluggable Payment Gateways (Stripe & Polar)
\`\`\`typescript
// Polar.sh provider
model: vibezcheck('gpt-4o', {
  customer: user.id,
  billing: { provider: 'polar' },
})

// Custom internal wallet
model: vibezcheck('gpt-4o', {
  customer: user.id,
  billing: {
    charge: async (costUSD, event) => {
      await wallet.deduct(event.customerId, costUSD);
    },
  },
})
\`\`\`
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
