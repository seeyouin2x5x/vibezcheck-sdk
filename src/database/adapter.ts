import type { DatabaseAdapter, UsageEvent } from '../types';

export interface DatabaseAdapterOptions {
  /** Adapter identifier name (default: 'custom') */
  name?: string;
  /** Persist a usage event */
  save: (event: UsageEvent) => Promise<void> | void;
  /** Optional customer balance lookup (for prepaid or quota checking) */
  getBalance?: (customerId: string) => Promise<number | undefined>;
}

export interface MetronomeAdapterOptions {
  /** Metronome API Key */
  apiKey: string;
  /** Event type name configured in Metronome (default: 'ai_inference') */
  eventType?: string;
  /** Optional custom Metronome API base URL (default: 'https://api.metronome.com') */
  baseUrl?: string;
  /** Optional custom properties mapper */
  mapProperties?: (event: UsageEvent) => Record<string, any>;
}

/**
 * Extensible Database / Ingestion Adapter Factory
 *
 * Creates a standard DatabaseAdapter for any storage engine, ORM, queue, or billing service.
 * Supports either:
 * 1. A 1-line async function:
 *    vibezcheck.database(async (event) => {
 *      await db.insert(aiUsage).values(event);
 *    })
 * 2. An options object:
 *    vibezcheck.createDatabaseAdapter({
 *      name: 'clickhouse',
 *      save: async (event) => { ... },
 *      getBalance: async (customerId) => { ... },
 *    })
 */
export function createDatabaseAdapter(
  saveOrOptions: ((event: UsageEvent) => Promise<void> | void) | DatabaseAdapterOptions
): DatabaseAdapter {
  if (typeof saveOrOptions === 'function') {
    return {
      name: 'custom',
      save: saveOrOptions,
    };
  }

  if (!saveOrOptions || typeof saveOrOptions.save !== 'function') {
    throw new Error('[vibezcheck] createDatabaseAdapter requires a save function or an object with a save() method.');
  }

  return {
    name: saveOrOptions.name || 'custom',
    save: saveOrOptions.save,
    getBalance: saveOrOptions.getBalance,
  };
}

export const createCustomAdapter = createDatabaseAdapter;

/**
 * 1-Line Metronome Ingestion Adapter
 *
 * Streams usage events directly into Metronome's /v1/ingest endpoint with 0 dependencies.
 */
export function createMetronomeAdapter(options: MetronomeAdapterOptions): DatabaseAdapter {
  if (!options?.apiKey) {
    throw new Error('[vibezcheck] vibezcheck.metronome requires an apiKey.');
  }

  const endpoint = `${options.baseUrl || 'https://api.metronome.com'}/v1/ingest`;
  const eventType = options.eventType || 'ai_inference';

  return createDatabaseAdapter({
    name: 'metronome',
    save: async (event: UsageEvent) => {
      const transactionId = event.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const customerId = event.customerId || (event.customer as any)?.id || 'anonymous';

      const properties = options.mapProperties
        ? options.mapProperties(event)
        : {
            model: event.model,
            provider: event.provider,
            input_tokens: event.usage.inputTokens,
            output_tokens: event.usage.outputTokens,
            total_tokens: event.usage.totalTokens,
            cached_tokens: event.usage.cachedTokens ?? 0,
            reasoning_tokens: event.usage.reasoningTokens ?? 0,
            cost_usd: event.cost.retailUSD ?? event.cost.totalUSD,
            input_cost_usd: event.cost.inputCostUSD,
            output_cost_usd: event.cost.outputCostUSD,
            ...event.metadata,
          };

      const payload = [
        {
          transaction_id: transactionId,
          customer_id: customerId,
          event_type: eventType,
          timestamp: event.timestamp,
          properties,
        },
      ];

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`[vibezcheck] Metronome ingest failed with HTTP ${res.status}: ${errorText}`);
      }
    },
  });
}

export const metronomeAdapter = createMetronomeAdapter;
