/**
 * Example 1: Local Token & Cost Metering (Free / Zero Config / No Stripe Required)
 * Run: npx ts-node examples/01-local-cost-meter.ts
 */

import { calculateCost, createMeter } from 'vibezcheck';

async function main() {
  console.log('--- 1. Standalone 2026 Model Cost Calculator ---');
  
  // Calculate cost for OpenAI Next-Gen Flagship (gpt-6-astra)
  const gpt6Cost = calculateCost({
    model: 'gpt-6-astra',
    inputTokens: 10000,
    outputTokens: 2500,
    cachedTokens: 8000, // 75% prompt cache discount
  });
  console.log('GPT-6 Astra Cost Breakdown:');
  console.log(`  Wholesale: $${gpt6Cost.totalUSD.toFixed(6)} USD`);
  console.log(`  Savings from Cache: $${(gpt6Cost.savingsUSD || 0).toFixed(6)} USD`);

  // Calculate cost for Mistral Magistral Reasoning model
  const magistralCost = calculateCost({
    model: 'magistral-small-latest',
    inputTokens: 5000,
    outputTokens: 1200,
    reasoningTokens: 800, // Thinking steps
  });
  console.log('\nMagistral Small Reasoning Cost:');
  console.log(`  Wholesale: $${magistralCost.totalUSD.toFixed(6)} USD`);

  console.log('\n--- 2. In-Memory Token & Cost Aggregator ---');
  const meter = createMeter({
    pricing: { margin: 1.25 }, // Automatic 25% profit markup
    onUsage: (event) => {
      console.log(`[vibezcheck] 📊 Model: ${event.model}`);
      console.log(`Tokens: Total=${event.usage.totalTokens} (In=${event.usage.inputTokens}, Out=${event.usage.outputTokens}, Thinking=${event.usage.reasoningTokens ?? 0}, Cached=${event.usage.cachedTokens ?? 0})`);
      const wholesale = event.cost.wholesaleUSD ?? event.cost.wholesaleTotalUSD ?? event.cost.totalUSD;
      console.log(`Wholesale Cost: $${wholesale.toFixed(6)} USD | Customer Retail (1.25x): $${event.cost.totalUSD.toFixed(6)} USD\n`);
    },
  });

  // Record multi-part token events (compatible with LanguageModelV4Usage)
  meter.recordUsage({
    model: 'gpt-4o',
    inputTokens: 3000,
    outputTokens: 1000,
    cachedTokens: 2000,
  });

  meter.recordUsage({
    model: 'magistral-small-latest',
    inputTokens: 4000,
    outputTokens: 1500,
    reasoningTokens: 900,
  });

  // Query aggregated session summary
  console.log('--- Session Cumulative Summary ---');
  console.log(meter.getUsageSummary());
}

main().catch(console.error);
