import * as fs from 'fs';
import * as path from 'path';
import {
  syncVercelGateway,
  triggerVercelGatewaySync,
  VERCEL_GATEWAY_MODELS_URL,
  getModelPricing,
  calculateCost,
  clearDynamicCache,
  seedPricingCache,
  vibezcheck,
} from '../src';

describe('Vercel AI Gateway Pricing Integration', () => {
  beforeEach(() => {
    clearDynamicCache();
  });

  afterAll(() => {
    clearDynamicCache();
  });

  describe('Manifest Vercel Gateway Ingestion', () => {
    it('manifest/pricing-v1.json should contain Vercel Gateway models and accurate per-1M pricing', () => {
      const manifestPath = path.resolve(__dirname, '../manifest/pricing-v1.json');
      const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

      expect(Array.isArray(data.vercel_gateway_models)).toBe(true);
      expect(data.vercel_gateway_models.length).toBeGreaterThan(200);

      // Hydrate into dynamic cache
      seedPricingCache(data);

      // Test Alibaba Qwen3-14B: input 0.00000012 -> $0.12/1M, output 0.00000024 -> $0.24/1M
      const qwen14 = getModelPricing('alibaba/qwen-3-14b');
      expect(qwen14.inputPer1M).toBe(0.12);
      expect(qwen14.outputPer1M).toBe(0.24);

      // Also available stripped of prefix
      const qwen14Stripped = getModelPricing('qwen-3-14b');
      expect(qwen14Stripped.inputPer1M).toBe(0.12);
      expect(qwen14Stripped.outputPer1M).toBe(0.24);

      // Test Alibaba Qwen 3.6 Max Preview: input $1.3/1M, output $7.8/1M, cache read $0.13/1M, cache write $1.625/1M
      const qwenMax = getModelPricing('alibaba/qwen-3.6-max-preview');
      expect(qwenMax.inputPer1M).toBe(1.3);
      expect(qwenMax.outputPer1M).toBe(7.8);
      expect(qwenMax.cachedInputPer1M).toBe(0.13);
      expect(qwenMax.cacheWritePer1M).toBe(1.625);
    });

    it('should calculate cost accurately for Vercel Gateway models with prompt cache savings', () => {
      const manifestPath = path.resolve(__dirname, '../manifest/pricing-v1.json');
      seedPricingCache(JSON.parse(fs.readFileSync(manifestPath, 'utf8')));

      // 1,000,000 input tokens where 500,000 were cached on Qwen 3.6 Max Preview
      // regular 500k @ $1.30/1M = $0.65
      // cached 500k @ $0.13/1M = $0.065
      // total input = $0.715
      // output 100,000 tokens @ $7.80/1M = $0.78
      // wholesale total = $1.495
      const cost = calculateCost({
        model: 'alibaba/qwen-3.6-max-preview',
        inputTokens: 1_000_000,
        cachedTokens: 500_000,
        outputTokens: 100_000,
      });

      expect(cost.inputCostUSD).toBe(0.715);
      expect(cost.outputCostUSD).toBe(0.78);
      expect(cost.totalUSD).toBe(1.495);
      expect(cost.cachedDiscountUSD).toBe(0.585);
    });
  });

  describe('Direct Sync from Vercel AI Gateway endpoint', () => {
    it('should parse native Vercel Gateway response { object: "list", data: [...] }', async () => {
      const mockGatewayPayload = {
        object: 'list',
        data: [
          {
            id: 'meta/llama-3.4-turbo',
            name: 'Llama 3.4 Turbo',
            owned_by: 'meta',
            pricing: {
              input: '0.00000035', // $0.35 / 1M
              output: '0.00000105', // $1.05 / 1M
              input_cache_read: '0.00000007', // $0.07 / 1M
              input_cache_write: '0.00000045', // $0.45 / 1M
            },
          },
        ],
      };

      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => mockGatewayPayload,
      });

      const synced = await syncVercelGateway({
        fetch: mockFetch as any,
        force: true,
      });

      expect(synced).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        VERCEL_GATEWAY_MODELS_URL,
        expect.objectContaining({ method: 'GET' })
      );

      const rate = getModelPricing('meta/llama-3.4-turbo');
      expect(rate.inputPer1M).toBe(0.35);
      expect(rate.outputPer1M).toBe(1.05);
      expect(rate.cachedInputPer1M).toBe(0.07);
      expect(rate.cacheWritePer1M).toBe(0.45);

      // Unprefixed alias also available
      const unprefix = getModelPricing('llama-3.4-turbo');
      expect(unprefix.inputPer1M).toBe(0.35);
      expect(unprefix.outputPer1M).toBe(1.05);
    });

    it('should provide non-throwing offline fallback when Vercel Gateway endpoint is unreachable', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network unreachable: ai-gateway.vercel.sh'));

      const result = await syncVercelGateway({
        fetch: mockFetch as any,
        force: true,
      });

      expect(result).toBe(false);

      // Bundled fallback remains functional
      const fallback = getModelPricing('gpt-4o');
      expect(fallback.inputPer1M).toBe(2.5);
    });

    it('triggerVercelGatewaySync should execute safely in the background', (done) => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({
          object: 'list',
          data: [
            {
              id: 'bg-provider/bg-model',
              pricing: { input: '0.000001', output: '0.000002' },
            },
          ],
        }),
      });

      expect(() => {
        triggerVercelGatewaySync({ fetch: mockFetch as any, force: true });
      }).not.toThrow();

      setTimeout(() => {
        const rate = getModelPricing('bg-provider/bg-model');
        expect(rate.inputPer1M).toBe(1.0);
        expect(rate.outputPer1M).toBe(2.0);
        done();
      }, 50);
    });
  });

  describe('VibezCheck Root API Exports', () => {
    it('vibezcheck.syncVercelGateway and vibezcheck.syncVercel should be exposed', async () => {
      expect(typeof vibezcheck.syncVercelGateway).toBe('function');
      expect(typeof vibezcheck.syncVercel).toBe('function');
      expect(vibezcheck.VERCEL_GATEWAY_MODELS_URL).toBe('https://ai-gateway.vercel.sh/v1/models');
    });
  });
});
