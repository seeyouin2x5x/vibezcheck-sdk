import type { DatabaseAdapter, UsageEvent } from '../types';

export interface SqlAdapterOptions {
  /** Target table name (default: 'vibez_usage') */
  table?: string;
  /** Parameter style: '$' for Postgres/Neon ($1, $2) or '?' for SQLite/MySQL (default: '$') */
  parameterStyle?: '$' | '?';
  /** Custom transformation generating SQL query and params */
  transform?: (event: UsageEvent) => { query: string; params: any[] };
}

/**
 * 1-Line Generic SQL Database Sink Adapter
 *
 * Connects to Neon, Drizzle, Kysely, pg (node-postgres), SQLite, or any SQL query executor.
 *
 * @example
 * ```typescript
 * import { Pool } from 'pg';
 * import { vibezcheck } from 'vibezcheck';
 *
 * const pool = new Pool();
 *
 * const model = vibezcheck('openai/gpt-4o-mini', {
 *   database: vibezcheck.sql(pool),
 * });
 * ```
 */
export function createSqlAdapter(
  queryFnOrClient: any,
  options?: SqlAdapterOptions
): DatabaseAdapter {
  if (!queryFnOrClient) {
    throw new Error('[vibezcheck] vibezcheck.sql requires a query function or SQL client instance.');
  }

  const table = options?.table || 'vibez_usage';
  const paramStyle = options?.parameterStyle || '$';

  const executeQuery = async (query: string, params: any[]) => {
    if (typeof queryFnOrClient === 'function') {
      return await queryFnOrClient(query, params);
    }
    if (typeof queryFnOrClient.query === 'function') {
      return await queryFnOrClient.query(query, params);
    }
    if (typeof queryFnOrClient.execute === 'function') {
      return await queryFnOrClient.execute(query, params);
    }
    if (typeof queryFnOrClient.run === 'function') {
      return await queryFnOrClient.run(query, params);
    }
    throw new Error('[vibezcheck] SQL client does not have a supported query(), execute(), or run() method.');
  };

  return {
    name: 'sql',
    save: async (event: UsageEvent) => {
      if (options?.transform) {
        const { query, params } = options.transform(event);
        await executeQuery(query, params);
        return;
      }

      const params = [
        event.customerId || null,
        event.customer?.userId || event.customerId || null,
        event.model,
        event.provider,
        event.usage.inputTokens,
        event.usage.outputTokens,
        event.usage.totalTokens,
        event.usage.cachedTokens || 0,
        event.usage.reasoningTokens || 0,
        event.cost.retailUSD ?? event.cost.billedUSD ?? event.cost.totalUSD,
        event.cost.wholesaleTotalUSD ?? event.cost.wholesaleUSD ?? 0,
        event.timestamp,
        event.metadata ? JSON.stringify(event.metadata) : null,
      ];

      const columns = [
        'customer_id',
        'user_id',
        'model',
        'provider',
        'input_tokens',
        'output_tokens',
        'total_tokens',
        'cached_tokens',
        'reasoning_tokens',
        'cost_usd',
        'wholesale_usd',
        'created_at',
        'metadata',
      ];

      const placeholders =
        paramStyle === '?'
          ? columns.map(() => '?').join(', ')
          : columns.map((_, i) => `$${i + 1}`).join(', ');

      const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders});`;

      await executeQuery(sql, params);
    },
  };
}

export const sqlAdapter = createSqlAdapter;
