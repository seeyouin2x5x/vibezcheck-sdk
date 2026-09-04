import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages, customerId = 'demo@example.com' } = await req.json();

  // ⚡ 1-Line Declarative Model Metering
  // - 0ms added streaming latency
  // - Automatic $0.50 runaway safety fuse
  // - Automatic 85% prompt cache discount
  // - 1.5x Margin multiplier (Cost + 50% profit margin)
  const result = streamText({
    model: vibezcheck(openai('gpt-4o-mini'), {
      customer: customerId,
      pricing: {
        margin: 1.5,
        minimumChargeUSD: 0.001,
      },
      onUsage: (event) => {
        console.log(
          `⚡ [vibezcheck] Tokens: ${event.usage.totalTokens} | USD: $${event.cost.totalUSD.toFixed(6)}`
        );
      },
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
