import * as fs from 'fs';
import * as path from 'path';
import {
  syncPricingManifest,
  triggerBackgroundSync,
  getDynamicRate,
  getDynamicCacheSize,
  clearDynamicCache,
  getSyncStatus,
  seedPricingCache,
  getModelPricing,
  calculateCost,
  vibezcheck,
} from '../src';

describe('Dynamic Pricing Manifest Sync with Offline Fallback', () => {
  beforeEach(() => {
    clearDynamicCache();
  });

  afterAll(() => {
    clearDynamicCache();
  });

  describe('Local Manifest File Validation', () => {
    it('manifest/pricing-v1.json should be valid JSON containing all Stripe models and rates', () => {
      const manifestPath = path.resolve(__dirname, '../manifest/pricing-v1.json');
      expect(fs.existsSync(manifestPath)).toBe(true);

      const content = fs.readFileSync(manifestPath, 'utf8');
      const data = JSON.parse(content);

      expect(data.version).toBe('1.0.0');
      expect(Array.isArray(data.models)).toBe(true);
      expect(data.models.length).toBeGreaterThanOrEqual(80);
      expect(typeof data.rates).toBe('object');

      // Check specific models from Stripe rate card
      expect(data.rates['nova-2-lite']).toBeDefined();
      expect(data.rates['nova-2-lite'].inputPer1M).toBe(0.3);
      expect(data.rates['nova-2-lite'].outputPer1M).toBe(2.5);

      expect(data.rates['claude-3.7-sonnet']).toBeDefined();
      expect(data.rates['claude-3.7-sonnet'].inputPer1M).toBe(3.0);
      expect(data.rates['claude-3.7-sonnet'].outputPer1M).toBe(15.0);

      expect(data.rates['deepseek-chat']).toBeDefined();
      expect(data.rates['deepseek-chat'].inputPer1M).toBe(0.57);
      expect(data.rates['deepseek-chat'].outputPer1M).toBe(1.68);
    });

    it('seedPricingCache should successfully hydrate rates from manifest', () => {
      const manifestPath = path.resolve(__dirname, '../manifest/pricing-v1.json');
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      const seededCount = seedPricingCache(data);
      expect(seededCount).toBeGreaterThan(50);
      expect(getDynamicCacheSize()).toBeGreaterThan(50);

      // Verify immediate synchronous lookup
      const rate = getModelPricing('nova-2-lite');
      expect(rate.inputPer1M).toBe(0.3);
      expect(rate.outputPer1M).toBe(2.5);
      expect(rate.cachedInputPer1M).toBe(0.07);
    });
  });

  describe('Network Synchronization', () => {
    it('should successfully sync from mock remote endpoint', async () => {
      const mockManifest = {
        version: '1.0.0',
        models: [
          {
            publisher: 'CustomCorp',
            provider: 'CustomProvider',
            model: 'custom-turbo-99',
            prices_per_1m: {
              input_token: 0.42,
              output_token: 1.84,
              cached_input: 0.1,
            },
          },
        ],
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => '"etag-12345"' },
        json: async () => mockManifest,
      });

      const success = await syncPricingManifest({
        fetch: mockFetch as any,
        manifestUrl: 'https://cdn.example.com/pricing.json',
      });

      expect(success).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const status = getSyncStatus();
      expect(status.status).toBe('synced');
      expect(status.lastSyncETag).toBe('"etag-12345"');

      // Verify custom-turbo-99 is available via getModelPricing
      const rate = getModelPricing('custom-turbo-99');
      expect(rate.inputPer1M).toBe(0.42);
      expect(rate.outputPer1M).toBe(1.84);
      expect(rate.cachedInputPer1M).toBe(0.1);

      // Verify cost calculation uses the rate
      const cost = calculateCost({
        model: 'custom-turbo-99',
        inputTokens: 1_000_000,
        outputTokens: 1_000_000,
      });
      expect(cost.totalUSD).toBeCloseTo(2.26, 4);
    });

    it('should support array format directly in sync', async () => {
      const rawArray = [
        {
          publisher: 'Anthropic',
          provider: 'Anthropic',
          model: 'claude-mythos-5',
          prices_per_1m: {
            input_token: 10.0,
            output_token: 50.0,
            cached_input: 1.0,
            cached_write: 12.5,
          },
        },
      ];

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => rawArray,
      });

      const success = await syncPricingManifest({
        fetch: mockFetch as any,
        force: true,
      });

      expect(success).toBe(true);
      const rate = getModelPricing('claude-mythos-5');
      expect(rate.inputPer1M).toBe(10.0);
      expect(rate.outputPer1M).toBe(50.0);
      expect(rate.cachedInputPer1M).toBe(1.0);
      expect(rate.cacheWritePer1M).toBe(12.5);
    });

    it('should honor cache TTL and avoid unnecessary network fetches', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          rates: {
            'ttl-model': { inputPer1M: 1.0, outputPer1M: 2.0 },
          },
        }),
      });

      // First call fetches
      const first = await syncPricingManifest({ fetch: mockFetch as any, cacheTtlMs: 10_000 });
      expect(first).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call within TTL skips fetch
      const second = await syncPricingManifest({ fetch: mockFetch as any, cacheTtlMs: 10_000 });
      expect(second).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Call with force: true bypasses TTL
      const third = await syncPricingManifest({ fetch: mockFetch as any, cacheTtlMs: 10_000, force: true });
      expect(third).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle 304 Not Modified without replacing cache', async () => {
      seedPricingCache({
        rates: {
          'cached-model': { inputPer1M: 0.5, outputPer1M: 1.5 },
        },
      });

      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 304,
        headers: { get: () => null },
      });

      const success = await syncPricingManifest({ fetch: mockFetch as any, force: true });
      expect(success).toBe(true);
      expect(getModelPricing('cached-model').inputPer1M).toBe(0.5);
    });
  });

  describe('Offline Fallback & Error Resilience', () => {
    it('should NEVER throw when network fails (offline fallback)', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('getaddrinfo ENOTFOUND raw.githubusercontent.com'));

      const result = await syncPricingManifest({
        fetch: mockFetch as any,
        force: true,
      });

      expect(result).toBe(false);
      const status = getSyncStatus();
      expect(status.status).toBe('failed');
      expect(status.lastError).toContain('ENOTFOUND');

      // Built-in bundled pricing remains 100% operational
      const bundled = getModelPricing('gpt-4o');
      expect(bundled.inputPer1M).toBe(2.5);
      expect(bundled.outputPer1M).toBe(10.0);
    });

    it('should gracefully handle HTTP 500 server error', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: { get: () => null },
      });

      const result = await syncPricingManifest({
        fetch: mockFetch as any,
        force: true,
      });

      expect(result).toBe(false);
      expect(getSyncStatus().status).toBe('failed');
    });

    it('should gracefully handle malformed JSON manifest', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ unexpected: 'empty object with no models or rates' }),
      });

      const result = await syncPricingManifest({
        fetch: mockFetch as any,
        force: true,
      });

      expect(result).toBe(false);
      expect(getSyncStatus().status).toBe('failed');
    });

    it('should seed fallback manifest when network fails if provided', async () => {
      const fallback = {
        rates: {
          'offline-guaranteed': { inputPer1M: 0.12, outputPer1M: 0.48 },
        },
      };

      const mockFetch = jest.fn().mockRejectedValue(new Error('Network timeout'));

      const result = await syncPricingManifest({
        fetch: mockFetch as any,
        fallbackManifest: fallback,
        force: true,
      });

      expect(result).toBe(false);
      // Fallback was seeded into cache
      expect(getModelPricing('offline-guaranteed').inputPer1M).toBe(0.12);
    });

    it('triggerBackgroundSync should not crash or unhandle rejections', (done) => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Fatal connection drop'));

      expect(() => {
        triggerBackgroundSync({ fetch: mockFetch as any, force: true });
      }).not.toThrow();

      // Give background microtask time to settle
      setTimeout(() => {
        expect(getSyncStatus().status).toBe('failed');
        done();
      }, 50);
    });
  });

  describe('VibezCheck Namespace Integration', () => {
    it('vibezcheck.syncPricing should be exposed and functional', async () => {
      expect(typeof vibezcheck.syncPricing).toBe('function');
      expect(typeof vibezcheck.triggerBackgroundSync).toBe('function');

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          rates: {
            'vibezcheck-synced-test': { inputPer1M: 0.99, outputPer1M: 2.99 },
          },
        }),
      });

      const synced = await vibezcheck.syncPricing({
        fetch: mockFetch as any,
        force: true,
      });

      expect(synced).toBe(true);
      expect(vibezcheck.getModelPricing('vibezcheck-synced-test').inputPer1M).toBe(0.99);
    });
  });
});
