import React from 'react';
import { renderToString } from 'react-dom/server';
import { meteredModel } from '../src/compat/stripe-meter';
import { createStripe, stripe } from '../src/compat/stripe-provider';
import { createTokenMeter } from '../src/compat/token-meter';
import { AgentSession, createAgentSession } from '../src/billing/session';
import { wrapTool, instrumentToolKit } from '../src/billing/tools';
import { VibezCheck } from '../src/react/vibezcheck-ui';
import { generateIdempotencyKey } from '../src/core/idempotency';
import { vibezcheck } from '../src/index';

describe('Commercial Suite & Compat Drop-Ins', () => {
  describe('Compat: @stripe/ai-sdk/meter', () => {
    it('should wrap LanguageModel and pass options', async () => {
      const mockModel = {
        modelId: 'gpt-4o',
        provider: 'openai',
        specificationVersion: 'v2',
        doGenerate: jest.fn().mockResolvedValue({
          text: 'Hello',
          usage: { promptTokens: 10, completionTokens: 20 },
        }),
        doStream: jest.fn(),
      };

      const metered = meteredModel(mockModel, 'sk_test_123', 'cus_test_abc');
      const res = await (metered as any).doGenerate({ prompt: 'Hi' });

      expect(res.text).toBe('Hello');
      expect(mockModel.doGenerate).toHaveBeenCalled();
    });
  });

  describe('Compat: @stripe/ai-sdk/provider', () => {
    it('should create proxy model from createStripe provider factory', () => {
      const provider = createStripe({ apiKey: 'sk_test_123' });
      const model = provider('gpt-4o', { customerId: 'cus_client_1' });

      expect(model).toBeDefined();
      expect(typeof (model as any).doGenerate).toBe('function');
      expect(typeof (model as any).doStream).toBe('function');
    });
  });

  describe('Compat: @stripe/token-meter', () => {
    it('should record usage for OpenAI non-streaming response', () => {
      const meter = createTokenMeter('sk_test_123');
      const mockResponse = {
        model: 'gpt-4o',
        usage: {
          prompt_tokens: 150,
          completion_tokens: 50,
        },
      };

      expect(() => {
        meter.trackUsage(mockResponse, 'cus_token_meter_user');
      }).not.toThrow();
    });
  });

  describe('AgentSession & Tool Tracking', () => {
    it('should accumulate tokens and costs across multiple tool and model invocations', async () => {
      const session = createAgentSession({
        customer: 'cus_agent_user',
        sessionBudgetUSD: 5.0,
      });

      // Track a search tool ($0.01)
      await session.trackTool('web_search', 0.01, async () => {
        return ['search result'];
      });

      expect(session.getCurrentCostUSD()).toBe(0.01);

      // Track a sandbox tool ($0.05)
      await session.trackTool('python_sandbox', { costUSD: 0.05 }, async () => {
        return { stdout: '42' };
      });

      expect(session.getCurrentCostUSD()).toBe(0.06);

      const summary = session.getSummary();
      expect(summary.toolCallCount).toBe(2);
      expect(summary.customer).toBe('cus_agent_user');
      expect(summary.totalCostUSD).toBe(0.06);
    });

    it('should trip circuit breaker if tool exceeds session budget', async () => {
      const session = new AgentSession({
        customer: 'cus_agent_user',
        sessionBudgetUSD: 0.10,
      });

      await expect(
        session.trackTool('heavy_computation', 0.20, async () => {})
      ).rejects.toThrow(/Agent Session Budget exceeded/);
    });

    it('should instrument a toolkit with instrumentToolKit', async () => {
      const tools = {
        query_db: {
          description: 'query database',
          execute: jest.fn().mockResolvedValue([{ id: 1 }]),
        },
      };

      const instrumented = instrumentToolKit(tools, { costPerActionUSD: 0.002 });
      expect(instrumented.query_db).toBeDefined();
      expect(instrumented.query_db.costUSD).toBe(0.002);

      const result = await instrumented.query_db.execute('SELECT 1');
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('Web Crypto Deterministic Idempotency', () => {
    it('should produce deterministic SHA-256 idempotency keys', async () => {
      const key1 = await generateIdempotencyKey('cus_123', 'gpt-4o', '2026-09-06T12:00:00Z', 'step-1');
      const key2 = await generateIdempotencyKey('cus_123', 'gpt-4o', '2026-09-06T12:00:00Z', 'step-1');
      const key3 = await generateIdempotencyKey('cus_456', 'gpt-4o', '2026-09-06T12:00:00Z', 'step-1');

      expect(key1).toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key1.startsWith('vibez_evt_')).toBe(true);
    });
  });

  describe('<VibezCheck /> Zero-DB Dev Mode HUD', () => {
    it('should render dev mode HUD pill and calculate simulated bill with profit margin', () => {
      const messages = [
        { role: 'user', content: 'Explain quantum gravity in detail please.' },
        { role: 'assistant', content: 'Quantum gravity is the field of theoretical physics...' },
      ];

      const html = renderToString(
        <VibezCheck
          messages={messages}
          model="gpt-4o"
          margin={1.5}
          devMode={true}
        />
      );

      expect(html).toContain('vibezcheck-ui-root');
      expect(html).toContain('DEV');
      expect(html).toContain('$');
    });
  });

  describe('Top-level vibezcheck static helper attachments', () => {
    it('should expose all commercial static helpers', () => {
      expect(typeof vibezcheck.Session).toBe('function');
      expect(typeof vibezcheck.wrapTool).toBe('function');
      expect(typeof vibezcheck.instrumentToolKit).toBe('function');
      expect(typeof vibezcheck.middleware).toBe('function');
      expect(typeof vibezcheck.Billing).toBe('function');
      expect(typeof vibezcheck.Auth).toBe('function');
      expect(typeof vibezcheck.Customers).toBe('function');
      expect(typeof vibezcheck.calculateCost).toBe('function');
    });
  });
});
