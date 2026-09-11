/**
 * Example 3: Native OpenAI Stream with Zero-Latency Tracking
 */

import { wrapStream } from 'vibezcheck/meter';
import OpenAI from 'openai';

const openai = new OpenAI();

async function runChatStream(userPrompt: string, customerParam: any) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: userPrompt }],
    stream: true,
    stream_options: { include_usage: true },
  });

  // Wrap stream with VibezCheck & customer metadata
  const meteredStream = wrapStream(stream, {
    customer: customerParam,
    pricing: { margin: 1.25 },
    onUsage: (event) => {
      console.log(`\n[Stream Completed] Tracked ${event.usage.totalTokens} tokens for customer ${event.customerId || event.customer?.email}`);
      console.log(`Wholesale: $${event.cost.wholesaleUSD.toFixed(6)} | Billed: $${event.cost.totalUSD.toFixed(6)}`);
    },
  });

  // Iterate chunks with 0ms added delay
  for await (const chunk of meteredStream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

if (require.main === module && process.env.OPENAI_API_KEY) {
  runChatStream('Explain the theory of relativity simply in 2 sentences.', {
    email: 'alex@acme.com',
    orgId: 'org_acme',
    plan: 'pro'
  }).catch(console.error);
}
