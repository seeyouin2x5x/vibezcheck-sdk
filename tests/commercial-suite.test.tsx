import React from 'react';
import { renderToString } from 'react-dom/server';
import { AgentSession, createAgentSession } from '../src/billing/session';
import { wrapTool, instrumentToolKit } from '../src/billing/tools';
import { VibezCheck } from '../src/react/vibezcheck-ui';
import { vibezcheck } from '../src/index';

describe('Commercial Suite & Tool Metering Engine (v0.6.0)', () => {
  describe('session.tools() & session.wrapTool() Budget Integration', () => {
    it('should track tool execution against AgentSession budget', async () => {
      const session = createAgentSession({
        customer: 'cus_agent_user',
        sessionBudgetUSD: 1.0,
      });

      const rawTools = {
        web_search: {
          description: 'search the web',
          execute: jest.fn().mockResolvedValue(['res1', 'res2']),
        },
      };

      const tools = session.tools(rawTools, { costPerActionUSD: 0.05 });
      expect(tools.web_search).toBeDefined();

      const result = await tools.web_search.execute({ query: 'quantum computing' });
      expect(result).toEqual(['res1', 'res2']);
      expect(session.getCurrentCostUSD()).toBe(0.05);

      const summary = session.getSummary();
      expect(summary.toolCallCount).toBe(1);
      expect(summary.toolCalls[0].name).toBe('web_search');
      expect(summary.toolCalls[0].costUSD).toBe(0.05);
    });

    it('should trip circuit breaker if tool execution crosses session budget', async () => {
      const session = createAgentSession({
        customer: 'cus_agent_user',
        sessionBudgetUSD: 0.08,
      });

      const tools = session.tools({
        expensive_tool: {
          execute: jest.fn().mockResolvedValue('done'),
        },
      }, { costPerActionUSD: 0.10 });

      await expect(
        tools.expensive_tool.execute({})
      ).rejects.toThrow(/Agent Session Budget exceeded/);
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
      expect(typeof vibezcheck.Auth).toBe('function');
      expect(typeof vibezcheck.Customers).toBe('function');
      expect(typeof vibezcheck.calculateCost).toBe('function');
    });
  });
});
