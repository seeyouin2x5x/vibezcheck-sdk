interface CacheEntry {
  customerId: string;
  expiresAt: number;
}

/**
 * In-memory Customer Resolution Cache with TTL
 */
export class CustomerCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTtlMs: number;

  constructor(defaultTtlMs: number = 1000 * 60 * 60) {
    // Default TTL: 1 hour
    this.defaultTtlMs = defaultTtlMs;
  }

  public get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.customerId;
  }

  public set(key: string, customerId: string, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.cache.set(key, { customerId, expiresAt });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}
