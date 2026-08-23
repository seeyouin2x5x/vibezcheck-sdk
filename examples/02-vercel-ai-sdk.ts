/**
 * Example 2: 1-Line withBilling with Vercel AI SDK
 * Demonstrates Next.js App Router route pattern
 */

import { withBilling } from '../src/ai-sdk';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function handleNextJsChatRoute(req: Request) {
  const { messages, userEmail } = await req.json();

  // 1. Wrap model in 1 line
  const model = withBilling(openai('gpt-5.6-sol'), {
    customer: userEmail,
    stripeApiKey: process.env.STRIPE_SECRET_KEY,
    onUsage: (event) => {
      console.log(`[Usage Telemetry] ${event.model} -> ${event.usage.totalTokens} tokens ($${event.cost.totalUSD.toFixed(4)})`);
    },
  });

  // 2. Stream response to client
  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
