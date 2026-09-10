import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { vibezcheck } from 'vibezcheck';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // If live OpenAI key is configured, stream via official AI SDK + VibezCheck meter
  if (process.env.OPENAI_API_KEY) {
    try {
      const result = streamText({
        model: vibezcheck(openai('gpt-4o-mini'), {
          customer: 'demo_user@vibezcheck.xyz',
          pricing: { margin: 1.25 },
          maxCostPerCallUSD: 0.50,
        }),
        messages,
      });

      return result.toDataStreamResponse();
    } catch (err: any) {
      console.warn('[Chat Route] OpenAI error, falling back to local simulation:', err?.message || err);
    }
  }

  // Graceful local simulated AI router response (works with zero keys)
  const lastMsg = messages[messages.length - 1];
  const userText = typeof lastMsg?.content === 'string'
    ? lastMsg.content
    : Array.isArray(lastMsg?.parts)
    ? lastMsg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join(' ')
    : 'Help with payments';

  let reply = '';
  const lower = userText.toLowerCase();

  if (lower.includes('transfer') || lower.includes('send') || lower.includes('$')) {
    reply = `Transfer of funds initiated via AI Router. Transaction details verified and token metering recorded. Billed customer account with 0ms added latency.`;
  } else if (lower.includes('credit') || lower.includes('buy')) {
    reply = `Credit top-up requested. VibezCheck checkout session can be generated instantly via Stripe. Remaining balance: $147.00 USD.`;
  } else if (lower.includes('balance')) {
    reply = `Current wallet balance is $147.00 USD (equivalent to ~1.47M tokens at wholesale rate). Margin profit locked in at +25%.`;
  } else {
    reply = `Received your router command: "${userText}". All inference tokens are automatically tracked by VibezCheck with zero database overhead in Dev Mode.`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = reply.split(' ');
      for (const word of words) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(word + ' ')}\n`));
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      const promptTok = Math.ceil(userText.length / 3.8) + 12;
      const compTok = Math.ceil(reply.length / 3.8);
      controller.enqueue(
        encoder.encode(
          `d:{"usage":{"promptTokens":${promptTok},"completionTokens":${compTok},"totalTokens":${promptTok + compTok}}}\n`
        )
      );
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'x-vercel-ai-data-stream': 'v1',
    },
  });
}
