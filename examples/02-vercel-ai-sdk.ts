/**
 * Example 2: 1-Line vibezcheck with Vercel AI SDK
 * Demonstrates Next.js App Router route pattern with B2B Multi-Tenancy & Margins
 */

import { vibezcheck } from '../src';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function handleNextJsChatRoute(req: Request) {
  const { messages, user } = await req.json();

  // 1. Wrap model in 1 line with B2B Multi-Tenant Metadata & 1.5x Margin
  const model = vibezcheck(openai('gpt-4o'), {
    customer: {
      userId: user?.id || 'usr_123',
      email: user?.email || 'alex@acme.com',
      orgId: user?.orgId || 'org_acme',
      plan: 'enterprise',
      role: 'engineer',
    },
    pricing: {
      margin: 1.5, // 50% profit margin
      minimumChargeUSD: 0.001,
    },
    safety: {
      maxCostPerCallUSD: 0.50, // Runaway safety fuse
    },
    onUsage: (event) => {
      console.log(`[Usage Telemetry] ${event.model} -> ${event.usage.totalTokens} tokens ($${event.cost.totalUSD.toFixed(6)}) | Org: ${event.customer?.orgId}`);
    },
  });

  // 2. Stream response with 0ms added latency
  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
