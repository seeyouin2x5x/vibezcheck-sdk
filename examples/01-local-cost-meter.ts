/**
 * Example 1: Local Token & Cost Metering (Free / No Stripe Required)
 * Run: npx ts-node examples/01-local-cost-meter.ts
 */

import { createMeter } from '../src/meter';
import { calculateCost } from '../src/pricing';

async function main() {
  console.log('--- 1. Standalone Pricing Calculator ---');
  const gpt5Cost = calculateCost({
    model: 'gpt-5.6-sol',
    inputTokens: 2500,
    outputTokens: 1200,
    cachedTokens: 1000,
  });
  console.log('GPT-5.6 Sol Cost:', gpt5Cost);

  console.log('\n--- 2. In-Memory Token & Cost Meter ---');
  const meter = createMeter({
    onUsage: (event) => {
      console.log(`[vibezcheck] 📊 Model: ${event.model}`);
      console.log(`Tokens: Total=${event.usage.totalTokens} (Input=${event.usage.inputTokens}, Output=${event.usage.outputTokens}, Reasoning=${event.usage.reasoningTokens ?? 0})`);
      console.log(`Inference Cost: $${event.cost.totalUSD.toFixed(6)} USD\n`);
    },
  });

  // Record a simulated prompt execution
  meter.recordUsage({
    model: 'claude-3-7-sonnet',
    inputTokens: 1500,
    outputTokens: 800,
    reasoningTokens: 500,
  });

  meter.recordUsage({
    model: 'gemini-3.7-flash',
    inputTokens: 4000,
    outputTokens: 1500,
    reasoningTokens: 900,
  });

  // Query aggregated session summary
  console.log('--- Session Summary ---');
  console.log(meter.getUsageSummary());
}

main().catch(console.error);
