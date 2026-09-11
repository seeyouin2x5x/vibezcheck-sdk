/**
 * Example 5: Autonomous Reasoning Agent Loop with Circuit Breaker
 * Demonstrates:
 * - Handling reasoning streams (where deltas carry empty tool calls)
 * - Safe runaway circuit breaker ($0.50 cutoff)
 * - Structured token cards (LanguageModelV4Usage compatibility)
 */

import { vibezcheck } from 'vibezcheck';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function runReasoningAgent(prompt: string, userEmail: string) {
  console.log(`\n🤖 Starting Autonomous Reasoning Agent for: ${userEmail}`);

  // 1-Line Model Protection with Safety Circuit Breaker & Profit Margin
  const protectedModel = vibezcheck(openai('gpt-4o'), {
    customer: {
      email: userEmail,
      plan: 'pro-team',
    },
    pricing: {
      margin: 1.30, // 30% profit markup
    },
    safety: {
      maxCostPerCallUSD: 0.50, // Auto-shutoff if reasoning loop exceeds $0.50
    },
    onUsage: (event) => {
      console.log(`\n[Agent Completed Step]`);
      console.log(`  Model: ${event.model}`);
      console.log(`  Input Tokens: ${event.usage.inputTokens}`);
      console.log(`  Output Tokens: ${event.usage.outputTokens}`);
      console.log(`  Thinking Tokens: ${event.usage.reasoningTokens ?? 0}`);
      console.log(`  Wholesale Cost: $${event.cost.wholesaleUSD.toFixed(6)}`);
      console.log(`  Retail Billed: $${event.cost.totalUSD.toFixed(6)}`);
    },
  });

  const stream = streamText({
    model: protectedModel,
    prompt,
  });

  for await (const chunk of stream.textStream) {
    process.stdout.write(chunk);
  }
}

if (require.main === module && process.env.OPENAI_API_KEY) {
  runReasoningAgent(
    'Draft an architecture migration plan to migrate from monolithic REST to event-driven gRPC microservices with fallback protocols.',
    'engineer@acme.com'
  ).catch(console.error);
}
