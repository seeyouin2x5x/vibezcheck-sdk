import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // ⚡ 1 Line: Wraps OpenAI with automatic token metering, $0.50 circuit breaker, and 30% profit margin
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: 'user_alex@example.com', // Pass user email or Stripe customer ID
      pricing: { margin: 1.3 },         // Wholesale cost + 30% profit margin
      maxCostPerCallUSD: 0.50,          // Safety fuse box ($0.50 cap)
    }),
    instructions: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
  });

  // ✦ Universal telemetry stream injector (works with v4, v5, v6, and v7)
  return vibezcheck.toResponse(result);
}
