import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { vibezcheck } from 'vibezcheck';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const {
    messages,
    user = {
      id: 'usr_alex_1',
      email: 'alex@acme.com',
      name: 'Alex Rivera',
      orgId: 'org_acme_corp',
      orgName: 'Acme Corp',
      plan: 'enterprise',
      tier: 'team',
      role: 'engineer',
    },
    modelName = 'gpt-4o-mini',
    margin = 1.5,
  } = await req.json();

  // ⚡ 1-Line Declarative Model Metering
  // - 0ms added streaming latency
  // - Automatic $0.50 runaway safety fuse
  // - Automatic 85% prompt cache discount
  // - Configurable profit margin multiplier (default 1.5 = cost + 50% profit)
  // - Rich B2B multi-tenant customer & organization metadata
  const result = streamText({
    model: vibezcheck(openai(modelName), {
      customer: {
        id: user.stripeCustomerId,
        userId: user.id,
        email: user.email,
        name: user.name,
        orgId: user.orgId,
        teamId: user.teamId,
        plan: user.plan || 'pro',
        tier: user.tier,
        role: user.role,
        metadata: {
          org_name: user.orgName || 'Acme Corp',
          environment: process.env.NODE_ENV || 'development',
        },
      },
      pricing: {
        margin: Number(margin) || 1.5,
        minimumChargeUSD: 0.001,
      },
      safety: {
        maxCostPerCallUSD: 0.50, // Auto kill runaway tool loops
      },
      onUsage: (event) => {
        console.log(
          `⚡ [vibezcheck] Model: ${event.model} | Tokens: ${event.usage.totalTokens} (In: ${event.usage.inputTokens}, Out: ${event.usage.outputTokens}, Cached: ${event.usage.cachedTokens || 0}) | Cost: $${event.cost.totalUSD.toFixed(6)} | Org: ${event.customer?.orgId || 'personal'} | Plan: ${event.customer?.plan}`
        );
      },
    }),
    messages,
  });

  return result.toDataStreamResponse();
}
