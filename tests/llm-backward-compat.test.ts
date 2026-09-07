import {
  getModelPricing,
  normalizeModelKey,
  calculateCost,
  withBilling,
  createTokenMeter,
  createStripe,
  stripe,
  vibezcheckMiddleware,
} from '../src';
import { meteredModel } from '../src/compat/stripe-meter';

describe('Universal LLM Support & Backward Compatibility Suite', () => {
  describe('Model Pricing & Bedrock Normalization', () => {
    test('normalizes AWS Bedrock Anthropic model IDs with regions and versions', () => {
      expect(normalizeModelKey('anthropic.claude-3-5-sonnet-20241022-v2:0')).toBe('claude-3-5-sonnet');
      expect(normalizeModelKey('us.anthropic.claude-3-7-sonnet-20250219-v1:0')).toBe('claude-3-7-sonnet');
      expect(normalizeModelKey('anthropic.claude-3-haiku-20240307-v1:0')).toBe('claude-3-haiku');
      expect(normalizeModelKey('meta.llama3-1-70b-instruct-v1:0')).toBe('llama-3.1-70b-versatile');
    });

    test('normalizes provider prefix and OpenRouter / Together format', () => {
      expect(normalizeModelKey('openai/gpt-4o')).toBe('gpt-4o');
      expect(normalizeModelKey('anthropic/claude-3-7-sonnet')).toBe('claude-3-7-sonnet');
      expect(normalizeModelKey('deepseek/deepseek-r1')).toBe('deepseek-r1');
      expect(normalizeModelKey('groq/llama-3.3-70b-versatile')).toBe('llama-3.3-70b-versatile');
    });

    test('supports legacy OpenAI models accurately for backward compatibility', () => {
      const gpt4 = getModelPricing('gpt-4');
      expect(gpt4.inputPer1M).toBe(30.0);
      expect(gpt4.outputPer1M).toBe(60.0);

      const gpt4Turbo = getModelPricing('gpt-4-turbo');
      expect(gpt4Turbo.inputPer1M).toBe(10.0);
      expect(gpt4Turbo.outputPer1M).toBe(30.0);

      const gpt4TurboPreview = getModelPricing('gpt-4-0125-preview');
      expect(gpt4TurboPreview.inputPer1M).toBe(10.0);
      expect(gpt4TurboPreview.outputPer1M).toBe(30.0);

      const gpt35 = getModelPricing('gpt-3.5-turbo');
      expect(gpt35.inputPer1M).toBe(0.5);
      expect(gpt35.outputPer1M).toBe(1.5);
    });

    test('supports legacy Anthropic models accurately for backward compatibility', () => {
      const claude21 = getModelPricing('claude-2.1');
      expect(claude21.inputPer1M).toBe(8.0);
      expect(claude21.outputPer1M).toBe(24.0);

      const claudeInstant = getModelPricing('claude-instant-1.2');
      expect(claudeInstant.inputPer1M).toBe(1.63);
      expect(claudeInstant.outputPer1M).toBe(5.51);

      const claudeHaiku = getModelPricing('claude-3-haiku');
      expect(claudeHaiku.inputPer1M).toBe(0.25);
      expect(claudeHaiku.outputPer1M).toBe(1.25);
    });

    test('supports latest 2026/2025 frontier models', () => {
      const deepseekR1 = getModelPricing('deepseek-r1');
      expect(deepseekR1.inputPer1M).toBe(0.55);
      expect(deepseekR1.outputPer1M).toBe(2.19);

      const deepseekV3 = getModelPricing('deepseek-v3');
      expect(deepseekV3.inputPer1M).toBe(0.14);
      expect(deepseekV3.outputPer1M).toBe(0.28);

      const grok3 = getModelPricing('grok-3');
      expect(grok3.inputPer1M).toBe(3.0);
      expect(grok3.outputPer1M).toBe(15.0);

      const gemini2Flash = getModelPricing('gemini-2.0-flash');
      expect(gemini2Flash.inputPer1M).toBe(0.1);
      expect(gemini2Flash.outputPer1M).toBe(0.4);

      const gemini2Lite = getModelPricing('gemini-2.0-flash-lite');
      expect(gemini2Lite.inputPer1M).toBe(0.075);
      expect(gemini2Lite.outputPer1M).toBe(0.3);

      const mistralLarge = getModelPricing('mistral-large-latest');
      expect(mistralLarge.inputPer1M).toBe(2.0);
      expect(mistralLarge.outputPer1M).toBe(6.0);

      const codestral = getModelPricing('codestral-latest');
      expect(codestral.inputPer1M).toBe(0.3);
      expect(codestral.outputPer1M).toBe(0.9);

      const sonar = getModelPricing('sonar-pro');
      expect(sonar.inputPer1M).toBe(3.0);
      expect(sonar.outputPer1M).toBe(15.0);
    });
  });

  describe('Polymorphic Token Format & Backward Compatibility in withBilling', () => {
    test('handles snake_case OpenAI/vLLM/Ollama response token usage', async () => {
      let capturedEvent: any = null;

      const mockModel = {
        modelId: 'gpt-4',
        provider: 'openai',
        specificationVersion: 'v1',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Hello legacy world',
          usage: {
            prompt_tokens: 100,
            completion_tokens: 50,
            prompt_tokens_details: {
              cached_tokens: 20,
            },
          },
        }),
      };

      const metered = withBilling(mockModel, {
        customer: 'cus_legacy_user',
        onUsage: (e) => {
          capturedEvent = e;
        },
      });

      const res = await (metered as any).doGenerate({ prompt: 'test' });
      expect(res.text).toBe('Hello legacy world');
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent.usage.inputTokens).toBe(100);
      expect(capturedEvent.usage.outputTokens).toBe(50);
      expect(capturedEvent.usage.cachedTokens).toBe(20);
      expect(capturedEvent.cost.totalUSD).toBeGreaterThan(0);
    });

    test('handles Google Gemini promptTokenCount and candidatesTokenCount format', async () => {
      let capturedEvent: any = null;

      const mockModel = {
        modelId: 'gemini-1.5-pro',
        provider: 'google',
        specificationVersion: 'v2',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Hello Gemini',
          usage: {
            promptTokenCount: 200,
            candidatesTokenCount: 80,
            thoughtsTokenCount: 30,
            cachedContentTokenCount: 50,
          },
        }),
      };

      const metered = withBilling(mockModel, {
        customer: 'cus_gemini_user',
        onUsage: (e) => {
          capturedEvent = e;
        },
      });

      await (metered as any).doGenerate({ prompt: 'test' });
      expect(capturedEvent).not.toBeNull();
      expect(capturedEvent.usage.inputTokens).toBe(200);
      expect(capturedEvent.usage.outputTokens).toBe(80);
      expect(capturedEvent.usage.reasoningTokens).toBe(30);
      expect(capturedEvent.usage.cachedTokens).toBe(50);
    });

    test('preserves callable models and reflection traps (has, ownKeys, apply)', () => {
      const callableModel = function (prompt: string) {
        return `response to: ${prompt}`;
      };
      (callableModel as any).modelId = 'gpt-4o';
      (callableModel as any).specificationVersion = 'v3';
      (callableModel as any).doGenerate = jest.fn().mockResolvedValue({
        text: 'callable generated',
        usage: { promptTokens: 10, completionTokens: 10 },
      });

      const metered = withBilling(callableModel);

      // Check callable execution
      expect(typeof metered).toBe('function');
      expect(metered('hello')).toBe('response to: hello');

      // Check property reflection
      expect('modelId' in metered).toBe(true);
      expect('specificationVersion' in metered).toBe(true);
      expect(Reflect.has(metered, 'doGenerate')).toBe(true);
      expect(Reflect.ownKeys(metered)).toContain('modelId');
    });
  });

  describe('Compat: @stripe/token-meter Backward Compatibility', () => {
    test('supports createTokenMeter without arguments (reads env)', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key';
      const meter = createTokenMeter();
      expect(meter).toBeDefined();
      expect(typeof meter.trackUsage).toBe('function');
      expect(typeof meter.track).toBe('function');
    });

    test('supports track alias and object customer argument', () => {
      const meter = createTokenMeter('sk_test_mock');
      const response = {
        model: 'deepseek-chat',
        usage: { prompt_tokens: 300, completion_tokens: 150 },
      };

      expect(() => {
        meter.track(response, { customerId: 'cus_flexible_1' });
      }).not.toThrow();

      expect(() => {
        meter.trackUsage(response, { customer: 'cus_flexible_2' });
      }).not.toThrow();
    });

    test('supports trackUsageStreamDeepSeek, trackUsageStreamGroq, trackUsageStreamMistral', async () => {
      const meter = createTokenMeter('sk_test_mock');

      // Mock DeepSeek stream
      const mockChunks = [
        { model: 'deepseek-r1', usage: { prompt_tokens: 50, completion_tokens: 100 } },
      ];
      const asyncIterable = {
        async *[Symbol.asyncIterator]() {
          for (const c of mockChunks) yield c;
        },
      };

      const wrapped = meter.trackUsageStreamDeepSeek(asyncIterable, 'cus_deepseek_user');
      const chunks: any[] = [];
      for await (const chunk of wrapped) {
        chunks.push(chunk);
      }
      expect(chunks.length).toBe(1);
      expect(chunks[0].model).toBe('deepseek-r1');
    });
  });

  describe('Compat: @stripe/ai-sdk/meter Overloads', () => {
    test('supports 2-argument call: meteredModel(model, customerId)', async () => {
      const mockModel = {
        modelId: 'gpt-4o',
        specificationVersion: 'v2',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Hi',
          usage: { promptTokens: 5, completionTokens: 5 },
        }),
      };

      const metered = meteredModel(mockModel, 'cus_two_arg_user');
      const res = await (metered as any).doGenerate({ prompt: 'test' });
      expect(res.text).toBe('Hi');
    });

    test('supports 2-argument call with options object: meteredModel(model, options)', async () => {
      const mockModel = {
        modelId: 'claude-3-5-sonnet',
        specificationVersion: 'v3',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Claude',
          usage: { promptTokens: 10, completionTokens: 10 },
        }),
      };

      const metered = meteredModel(mockModel, { customerId: 'cus_options_user', pricing: { margin: 1.2 } });
      const res = await (metered as any).doGenerate({ prompt: 'test' });
      expect(res.text).toBe('Claude');
    });

    test('supports 3-argument call: meteredModel(model, stripeCustomerId, options)', async () => {
      const mockModel = {
        modelId: 'gpt-4o-mini',
        specificationVersion: 'v2',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Mini',
          usage: { promptTokens: 10, completionTokens: 10 },
        }),
      };

      const metered = meteredModel(mockModel, 'cus_three_arg', { maxCostPerCallUSD: 1.0 });
      const res = await (metered as any).doGenerate({ prompt: 'test' });
      expect(res.text).toBe('Mini');
    });
  });

  describe('Compat: @stripe/ai-sdk/provider Dynamic Resolution', () => {
    test('createStripe returns model with runnable interface rather than throwing', () => {
      const stripeProvider = createStripe({ apiKey: 'sk_test_provider' });
      const model = stripeProvider('gpt-4o', { customerId: 'cus_provider_user' });

      expect(model).toBeDefined();
      expect(typeof (model as any).doGenerate).toBe('function');
      expect(typeof (model as any).doStream).toBe('function');
    });
  });

  describe('AI SDK Middleware chaining', () => {
    test('vibezcheckMiddleware wraps chained doGenerate properly', async () => {
      const middleware = vibezcheckMiddleware({ customer: 'cus_middleware_user' });

      const mockModel = {
        modelId: 'gpt-4o',
        specificationVersion: 'v2',
      };

      const doGenerate = jest.fn().mockResolvedValue({
        text: 'Generated through chained middleware',
        usage: { promptTokens: 15, completionTokens: 25 },
      });

      const res = await middleware.wrapGenerate({
        doGenerate,
        params: { prompt: 'hi' },
        model: mockModel,
      });

      expect(res.text).toBe('Generated through chained middleware');
      expect(doGenerate).toHaveBeenCalled();
    });
  });
});
