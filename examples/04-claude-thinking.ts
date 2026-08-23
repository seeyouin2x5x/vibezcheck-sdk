/**
 * Example 4: Claude 3.7 Sonnet Extended Thinking Stream
 */

import { wrapStream } from '../src/meter';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function runThinkingPrompt(prompt: string, customerId: string) {
  const stream = await anthropic.messages.create({
    model: 'claude-3-7-sonnet-20250219',
    max_tokens: 4000,
    thinking: { type: 'enabled', budget_tokens: 2000 },
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  });

  const meteredStream = wrapStream(stream, {
    customerId,
    provider: 'anthropic',
    onUsage: (event) => {
      console.log(`\n[Claude Stream Finished]`);
      console.log(`Input Tokens: ${event.usage.inputTokens}`);
      console.log(`Output Tokens: ${event.usage.outputTokens}`);
      console.log(`Thinking Tokens: ${event.usage.reasoningTokens}`);
      console.log(`Total Cost: $${event.cost.totalUSD.toFixed(6)} USD`);
    },
  });

  for await (const event of meteredStream) {
    if (event.type === 'content_block_delta' && (event.delta as any).text) {
      process.stdout.write((event.delta as any).text);
    }
  }
}

if (require.main === module && process.env.ANTHROPIC_API_KEY) {
  runThinkingPrompt('Solve this riddle step by step: What has roots as nobody sees, is taller than trees...', 'cus_anthropic_123').catch(console.error);
}
