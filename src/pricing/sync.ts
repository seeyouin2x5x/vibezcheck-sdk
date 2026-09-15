import type { ModelPricingRates } from '../types';
import { normalizeModelKey } from './table';

export interface PricingSyncOptions {
  /**
   * Remote manifest URL to fetch pricing from.
   * Defaults to the official hosted pricing-v1.json manifest.
   */
  manifestUrl?: string;

  /**
   * Request timeout in milliseconds (default: 3000ms).
   */
  timeoutMs?: number;

  /**
   * Custom fetch implementation (defaults to globalThis.fetch).
   */
  fetch?: typeof fetch;

  /**
   * Maximum cache age in milliseconds before re-fetching (default: 3600_000 = 1 hour).
   */
  cacheTtlMs?: number;

  /**
   * If true, bypass cache TTL and force an immediate re-fetch.
   */
  force?: boolean;

  /**
   * Fallback manifest JSON string or object to seed cache if network fails.
   */
  fallbackManifest?: unknown;

  /**
   * Custom headers for authentication or versioning.
   */
  headers?: Record<string, string>;
}

export interface PricingSyncStatus {
  status: 'idle' | 'syncing' | 'synced' | 'failed';
  lastSyncTime: number | null;
  lastSyncETag: string | null;
  cachedModelsCount: number;
  lastError: string | null;
}

export interface StripePricingItem {
  publisher?: string;
  provider?: string;
  model: string;
  prices_per_1m: {
    input_token?: number | null;
    output_token?: number | null;
    cached_input?: number | null;
    cached_output?: number | null;
    cached_read?: number | null;
    cached_write?: number | null;
  };
}

export const DEFAULT_MANIFEST_URL =
  'https://raw.githubusercontent.com/seeyouin2x5x/vibezcheck-sdk/main/manifest/pricing-v1.json';

const DEFAULT_TIMEOUT_MS = 3000;
const DEFAULT_CACHE_TTL_MS = 3600_000; // 1 hour

// In-memory fast cache
const dynamicPricingCache: Record<string, ModelPricingRates> = {};

let lastSyncTime: number | null = null;
let lastSyncETag: string | null = null;
let syncStatus: 'idle' | 'syncing' | 'synced' | 'failed' = 'idle';
let lastError: string | null = null;

/**
 * Synchronously retrieves a rate from the dynamic pricing cache
 */
export function getDynamicRate(model: string): ModelPricingRates | undefined {
  if (!model) return undefined;
  const key = model.toLowerCase().trim();
  if (dynamicPricingCache[key]) {
    return dynamicPricingCache[key];
  }
  const normalized = normalizeModelKey(key);
  if (dynamicPricingCache[normalized]) {
    return dynamicPricingCache[normalized];
  }
  return undefined;
}

/**
 * Returns the count of models currently held in dynamic cache
 */
export function getDynamicCacheSize(): number {
  return Object.keys(dynamicPricingCache).length;
}

/**
 * Resets the in-memory dynamic pricing cache
 */
export function clearDynamicCache(): void {
  for (const k of Object.keys(dynamicPricingCache)) {
    delete dynamicPricingCache[k];
  }
  lastSyncTime = null;
  lastSyncETag = null;
  syncStatus = 'idle';
  lastError = null;
}

/**
 * Current synchronization status and telemetry
 */
export function getSyncStatus(): PricingSyncStatus {
  return {
    status: syncStatus,
    lastSyncTime,
    lastSyncETag,
    cachedModelsCount: Object.keys(dynamicPricingCache).length,
    lastError,
  };
}

/**
 * Ingests and registers an array of Stripe rate items or a manifest object into cache
 */
export function seedPricingCache(manifest: unknown): number {
  if (!manifest || typeof manifest !== 'object') {
    return 0;
  }

  let count = 0;

  // Case 1: Array of Stripe pricing items
  if (Array.isArray(manifest)) {
    for (const item of manifest) {
      if (registerStripeItem(item)) {
        count++;
      }
    }
    return count;
  }

  const obj = manifest as Record<string, any>;

  // Case 2: Object with models array (e.g. { models: [...] })
  if (Array.isArray(obj.models)) {
    for (const item of obj.models) {
      if (registerStripeItem(item)) {
        count++;
      }
    }
  }

  // Case 3: Object with rates dictionary (e.g. { rates: { "gpt-4o": { inputPer1M: 2.5, ... } } })
  const ratesDict = obj.rates && typeof obj.rates === 'object' ? obj.rates : obj;
  for (const [key, val] of Object.entries(ratesDict)) {
    if (key === 'models' || key === 'rates' || key === 'version' || key === '$schema') {
      continue;
    }
    const v = val as any;
    if (v && typeof v === 'object' && typeof v.inputPer1M === 'number' && typeof v.outputPer1M === 'number') {
      registerRate(key, {
        inputPer1M: Math.max(0, v.inputPer1M),
        outputPer1M: Math.max(0, v.outputPer1M),
        cachedInputPer1M: typeof v.cachedInputPer1M === 'number' ? Math.max(0, v.cachedInputPer1M) : undefined,
        reasoningPer1M: typeof v.reasoningPer1M === 'number' ? Math.max(0, v.reasoningPer1M) : undefined,
        cacheWritePer1M: typeof v.cacheWritePer1M === 'number' ? Math.max(0, v.cacheWritePer1M) : undefined,
        currency: typeof v.currency === 'string' ? v.currency : 'USD',
      });
      count++;
    }
  }

  return count;
}

function registerRate(key: string, rate: ModelPricingRates): void {
  const cleanKey = key.toLowerCase().trim();
  dynamicPricingCache[cleanKey] = rate;
  const normalized = normalizeModelKey(cleanKey);
  dynamicPricingCache[normalized] = rate;
}

function registerStripeItem(entry: any): boolean {
  if (!entry || typeof entry !== 'object' || typeof entry.model !== 'string') {
    return false;
  }
  const p = entry.prices_per_1m;
  if (!p || typeof p !== 'object') return false;
  if (typeof p.input_token !== 'number' || typeof p.output_token !== 'number') return false;

  const rateObj: ModelPricingRates = {
    inputPer1M: Math.max(0, p.input_token),
    outputPer1M: Math.max(0, p.output_token),
    currency: 'USD',
  };

  if (typeof p.cached_input === 'number') {
    rateObj.cachedInputPer1M = Math.max(0, p.cached_input);
  } else if (typeof p.cached_read === 'number') {
    rateObj.cachedInputPer1M = Math.max(0, p.cached_read);
  }

  if (typeof p.cached_write === 'number') {
    rateObj.cacheWritePer1M = Math.max(0, p.cached_write);
  }

  const baseKey = entry.model.toLowerCase().trim();
  registerRate(baseKey, rateObj);

  if (entry.publisher && typeof entry.publisher === 'string') {
    const pub = entry.publisher.toLowerCase().replace(/\s+/g, '-');
    dynamicPricingCache[`${pub}/${baseKey}`] = rateObj;
    if (pub === 'mistral-ai') {
      dynamicPricingCache[`mistral/${baseKey}`] = rateObj;
    }
  }

  if (entry.provider && typeof entry.provider === 'string') {
    const prov = entry.provider.toLowerCase().replace(/\s+/g, '-');
    dynamicPricingCache[`${prov}/${baseKey}`] = rateObj;
  }

  return true;
}

/**
 * Asynchronously synchronizes the LLM pricing manifest from a remote endpoint.
 *
 * Guaranteed Safe & Non-Throwing:
 * If network is down, request times out, or manifest is invalid, returns false
 * and seamlessly preserves existing cached or bundled rates (offline fallback).
 */
export async function syncPricingManifest(options: PricingSyncOptions = {}): Promise<boolean> {
  const ttl = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const now = Date.now();

  // If cache is fresh and not forced, reuse existing cache
  if (!options.force && lastSyncTime !== null && now - lastSyncTime < ttl && Object.keys(dynamicPricingCache).length > 0) {
    return true;
  }

  const url = options.manifestUrl || DEFAULT_MANIFEST_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchFn = options.fetch || globalThis.fetch;

  if (typeof fetchFn !== 'function') {
    // No fetch available in environment; try fallback manifest
    if (options.fallbackManifest) {
      seedPricingCache(options.fallbackManifest);
      lastSyncTime = now;
      syncStatus = 'synced';
      return true;
    }
    syncStatus = 'failed';
    lastError = 'Fetch API unavailable in runtime environment';
    return false;
  }

  syncStatus = 'syncing';

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    if (lastSyncETag && !options.force) {
      reqHeaders['If-None-Match'] = lastSyncETag;
    }

    const response = await fetchFn(url, {
      method: 'GET',
      headers: reqHeaders,
      signal: controller?.signal,
    });

    if (timeoutId) clearTimeout(timeoutId);

    // 304 Not Modified: Existing dynamic cache is still up to date
    if (response.status === 304) {
      lastSyncTime = now;
      syncStatus = 'synced';
      lastError = null;
      return true;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const etag = response.headers?.get ? response.headers.get('etag') : null;
    if (etag) {
      lastSyncETag = etag;
    }

    const data = await response.json();
    const seeded = seedPricingCache(data);

    if (seeded === 0) {
      throw new Error('Manifest contains no recognizable pricing rates');
    }

    lastSyncTime = now;
    syncStatus = 'synced';
    lastError = null;
    return true;
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);

    syncStatus = 'failed';
    lastError = err?.message || 'Unknown network error';

    // Seed fallback if provided
    if (options.fallbackManifest) {
      seedPricingCache(options.fallbackManifest);
    }

    // Graceful offline fallback: Never throw, return false
    return false;
  }
}

/**
 * Non-blocking, fire-and-forget background synchronization.
 * Triggers sync in background without awaiting or crashing if network is unavailable.
 */
export function triggerBackgroundSync(options: PricingSyncOptions = {}): void {
  syncPricingManifest(options).catch(() => {
    // Silently caught - offline fallback preserved
  });
}
