import type { DatabaseAdapter, UsageEvent } from '../types';

export interface SupabaseAdapterOptions {
  /** Database table to insert usage rows into (default: 'vibez_usage') */
  table?: string;
  /** Custom row transformation function */
  transform?: (event: UsageEvent) => Record<string, any>;
  /** Table containing customer prepaid balances (optional) */
  balanceTable?: string;
  /** Column name for the prepaid balance in USD (default: 'balance_usd') */
  balanceColumn?: string;
  /** Column name for the customer ID lookup in balanceTable (default: 'customer_id') */
  customerIdColumn?: string;
}

/**
 * 1-Line Supabase Database Sink Adapter
 *
 * Automatically records token usage and costs directly into your Supabase database table.
 *
 * @example
 * ```typescript
 * import { createClient } from '@supabase/supabase-js';
 * import { vibezcheck } from 'vibezcheck';
 *
 * const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
 *
 * const model = vibezcheck('openai/gpt-4o-mini', {
 *   database: vibezcheck.supabase(supabase),
 * });
 * ```
 */
export function createSupabaseAdapter(
  clientOrOptions: any,
  options?: SupabaseAdapterOptions
): DatabaseAdapter {
  const client =
    typeof clientOrOptions === 'object' && clientOrOptions !== null && typeof clientOrOptions.from === 'function'
      ? clientOrOptions
      : clientOrOptions?.client;

  const resolvedOptions: SupabaseAdapterOptions = {
    table: options?.table || clientOrOptions?.table || 'vibez_usage',
    transform: options?.transform || clientOrOptions?.transform,
    balanceTable: options?.balanceTable || clientOrOptions?.balanceTable,
    balanceColumn: options?.balanceColumn || clientOrOptions?.balanceColumn || 'balance_usd',
    customerIdColumn: options?.customerIdColumn || clientOrOptions?.customerIdColumn || 'customer_id',
  };

  if (!client || typeof client.from !== 'function') {
    throw new Error('[vibezcheck] vibezcheck.supabase requires a valid Supabase client instance.');
  }

  const tableName = resolvedOptions.table || 'vibez_usage';

  return {
    name: 'supabase',
    save: async (event: UsageEvent) => {
      const row = resolvedOptions.transform
        ? resolvedOptions.transform(event)
        : {
            customer_id: event.customerId,
            user_id: event.customer?.userId || event.customerId,
            model: event.model,
            provider: event.provider,
            input_tokens: event.usage.inputTokens,
            output_tokens: event.usage.outputTokens,
            total_tokens: event.usage.totalTokens,
            cached_tokens: event.usage.cachedTokens,
            reasoning_tokens: event.usage.reasoningTokens,
            cost_usd: event.cost.retailUSD ?? event.cost.billedUSD ?? event.cost.totalUSD,
            wholesale_usd: event.cost.wholesaleTotalUSD ?? event.cost.wholesaleUSD,
            created_at: event.timestamp,
            metadata: event.metadata,
          };

      const { error } = await client.from(tableName).insert(row);
      if (error) {
        throw error;
      }
    },
    getBalance: async (customerId: string): Promise<number | undefined> => {
      if (!resolvedOptions.balanceTable) return undefined;

      const col = resolvedOptions.balanceColumn || 'balance_usd';
      const idCol = resolvedOptions.customerIdColumn || 'customer_id';

      const { data, error } = await client
        .from(resolvedOptions.balanceTable)
        .select(col)
        .eq(idCol, customerId)
        .maybeSingle();

      if (error || !data) {
        return undefined;
      }

      const val = data[col];
      return typeof val === 'number' ? val : undefined;
    },
  };
}

export const supabaseAdapter = createSupabaseAdapter;
