/**
 * Example 3: Native OpenAI Stream with Zero-Latency Tracking
 */

import { wrapStream } from '../src/meter';
import OpenAI from 'openai';

const openai = new OpenAI();

async function runChatStream(userPrompt: string, customerId: string) {
  const stream = await openai.chat.completions.create({
    model: 'o3-mini',
    messages: [{ role: 'user', content: userPrompt }],
    stream: true,
    stream_options: { include_usage: true },
  });

  // Wrap stream with VibezCheck
  const meteredStream = wrapStream(stream, {
    customerId,
    onUsage: (event) => {
      console.log(`\n[Stream Completed] Tracked ${event.usage.totalTokens} tokens for customer ${customerId}`);
    },
  });

  // Iterate chunks with 0ms added delay
  for await (const chunk of meteredStream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

if (require.main === module && process.env.OPENAI_API_KEY) {
  runChatStream('Explain the theory of relativity simply.', 'cus_demo_123').catch(console.error);
}
