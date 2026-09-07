import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    // ⚡ 1 Line: Wraps OpenAI with automatic token metering, $0.50 circuit breaker, and 30% profit margin
    model: vibezcheck(openai('gpt-4o'), {
      customer: 'user_alex@example.com', // Pass user email or Stripe customer ID
      pricing: { margin: 1.3 },         // Wholesale cost + 30% profit margin
      maxCostPerCallUSD: 0.50,          // Safety fuse box
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
