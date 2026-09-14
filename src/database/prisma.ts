import type { DatabaseAdapter, UsageEvent } from '../types';

export interface PrismaAdapterOptions {
  /** Model delegate name if passing root Prisma client (e.g. 'aiUsageEvent' or 'vibezUsage') */
  model?: string;
  /** Custom data transformation function */
  transform?: (event: UsageEvent) => Record<string, any>;
  /** Model delegate for checking prepaid balance */
  balanceModel?: any;
  /** Field name for customer ID lookup in balanceModel (default: 'customerId') */
  customerIdField?: string;
  /** Field name for balance amount in balanceModel (default: 'balanceUSD') */
  balanceField?: string;
}

/**
 * 1-Line Prisma Database Sink Adapter
 *
 * Automatically records token usage and costs directly through your Prisma ORM client.
 *
 * @example
 * ```typescript
 * import { PrismaClient } from '@prisma/client';
 * import { vibezcheck } from 'vibezcheck';
 *
 * const prisma = new PrismaClient();
 *
 * // 1. Pass model delegate directly:
 * const model = vibezcheck('openai/gpt-4o-mini', {
 *   database: vibezcheck.prisma(prisma.aiUsageEvent),
 * });
 *
 * // 2. Pass Prisma client with model name:
 * const model = vibezcheck('openai/gpt-4o-mini', {
 *   database: vibezcheck.prisma(prisma, { model: 'aiUsageEvent' }),
 * });
 * ```
 */
export function createPrismaAdapter(
  modelOrClient: any,
  options?: PrismaAdapterOptions
): DatabaseAdapter {
  if (!modelOrClient || typeof modelOrClient !== 'object') {
    throw new Error('[vibezcheck] vibezcheck.prisma requires a Prisma model delegate or client instance.');
  }

  const resolveModel = () => {
    // 1. Direct model delegate (has .create())
    if (typeof modelOrClient.create === 'function') {
      return modelOrClient;
    }

    // 2. Named model from options
    if (options?.model && modelOrClient[options.model] && typeof modelOrClient[options.model].create === 'function') {
      return modelOrClient[options.model];
    }

    // 3. Auto-detect common model names on root PrismaClient
    const commonNames = ['aiUsageEvent', 'aiUsage', 'vibezUsage', 'usageEvent', 'tokenUsage'];
    for (const name of commonNames) {
      if (modelOrClient[name] && typeof modelOrClient[name].create === 'function') {
        return modelOrClient[name];
      }
    }

    throw new Error(
      `[vibezcheck] Could not find a valid Prisma model delegate with a .create() method. Specify { model: 'modelName' } in options.`
    );
  };

  const modelDelegate = resolveModel();

  return {
    name: 'prisma',
    save: async (event: UsageEvent) => {
      const data = options?.transform
        ? options.transform(event)
        : {
            customerId: event.customerId,
            userId: event.customer?.userId || event.customerId,
            model: event.model,
            provider: event.provider,
            inputTokens: event.usage.inputTokens,
            outputTokens: event.usage.outputTokens,
            totalTokens: event.usage.totalTokens,
            cachedTokens: event.usage.cachedTokens,
            reasoningTokens: event.usage.reasoningTokens,
            costUSD: event.cost.retailUSD ?? event.cost.billedUSD ?? event.cost.totalUSD,
            wholesaleUSD: event.cost.wholesaleTotalUSD ?? event.cost.wholesaleUSD,
            createdAt: new Date(event.timestamp),
            metadata: event.metadata && typeof event.metadata === 'object' ? event.metadata : undefined,
          };

      await modelDelegate.create({ data });
    },
    getBalance: async (customerId: string): Promise<number | undefined> => {
      const balanceDelegate = options?.balanceModel;
      if (!balanceDelegate || typeof balanceDelegate.findUnique !== 'function') {
        return undefined;
      }

      const idField = options?.customerIdField || 'customerId';
      const balField = options?.balanceField || 'balanceUSD';

      const record = await balanceDelegate.findUnique({
        where: { [idField]: customerId },
      });

      if (!record) return undefined;
      const val = record[balField];
      return typeof val === 'number' ? val : undefined;
    },
  };
}

export const prismaAdapter = createPrismaAdapter;
