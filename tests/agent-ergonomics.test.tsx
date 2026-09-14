import React from 'react';
import { renderToString } from 'react-dom/server';
import { vibezcheck, isBudgetExceeded } from '../src';
import { VibezReceipt } from '../src/react/receipt';

describe('VibezCheck 1-Line Agent & Tool Ergonomics', () => {
  it('should export agent, tools, tool, and stopWhen from root vibezcheck', () => {
    expect(typeof vibezcheck.agent).toBe('function');
    expect(typeof vibezcheck.tools).toBe('function');
    expect(typeof vibezcheck.tool).toBe('function');
    expect(typeof vibezcheck.stopWhen).toBe('function');
    expect(typeof isBudgetExceeded).toBe('function');
  });

  it('vibezcheck.tool() should wrap a tool with cost and latency tracking', async () => {
    const rawTool = {
      description: 'Calculator',
      execute: jest.fn().mockResolvedValue(42),
    };

    const wrapped = vibezcheck.tool(rawTool, 0.015);
    expect(wrapped.costUSD).toBe(0.015);
    expect(wrapped.description).toBe('Calculator');

    const result = await wrapped.execute({ a: 2, b: 2 });
    expect(result).toBe(42);
    expect(rawTool.execute).toHaveBeenCalled();
  });

  it('vibezcheck.tools() should declaratively instrument a tools dictionary', async () => {
    const rawTools = {
      search: {
        description: 'Web search',
        execute: jest.fn().mockResolvedValue(['res1', 'res2']),
      },
      sandbox: {
        description: 'Code sandbox',
        execute: jest.fn().mockResolvedValue({ stdout: 'hello' }),
      },
    };

    const tools = vibezcheck.tools(rawTools, {
      costs: {
        sandbox: 0.05,
      },
      costPerActionUSD: 0.01,
    });

    expect(tools.search.costUSD).toBe(0.01);
    expect(tools.sandbox.costUSD).toBe(0.05);

    const searchRes = await tools.search.execute({ query: 'test' });
    expect(searchRes).toEqual(['res1', 'res2']);
  });

  it('vibezcheck.agent() should provision model, tools, and stopWhen linked to budget', async () => {
    const mockModel = {
      modelId: 'gpt-4o-mini',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'Agent answer',
        usage: { promptTokens: 100, completionTokens: 50 },
      }),
      doStream: jest.fn(),
    };

    const rawTools = {
      search: {
        execute: jest.fn().mockResolvedValue('search results'),
      },
    };

    const { model, tools, stopWhen, session, getSummary } = vibezcheck.agent({
      model: mockModel,
      tools: rawTools,
      budget: 0.25,
      toolCosts: { search: 0.02 },
    });

    expect(model).toBeDefined();
    expect(tools.search).toBeDefined();
    expect(typeof stopWhen).toBe('function');

    // Executing tool should increment session spend
    await tools.search.execute({});
    expect(session.getCurrentCostUSD()).toBe(0.02);

    const summary = getSummary();
    expect(summary.totalCostUSD).toBe(0.02);
    expect(summary.toolCallCount).toBe(1);
  });

  it('VibezReceipt should detect AI SDK v7 tool-call parts and display tool badge', () => {
    const v7MessageWithTools = {
      id: 'msg_1',
      role: 'assistant',
      content: 'Here are the search results.',
      parts: [
        { type: 'text', text: 'Here are the search results.' },
        { type: 'tool-call', toolName: 'web_search', args: { q: 'ai' } },
        { type: 'tool-call', toolName: 'python_sandbox', args: { code: 'print(1)' } },
        {
          type: 'data-vibezcheck',
          data: {
            costUSD: 0.0035,
            usage: { totalTokens: 850 },
            model: 'gpt-4o',
          },
        },
      ],
    };

    const html = renderToString(<VibezReceipt message={v7MessageWithTools} />);
    expect(html).toContain('2 tools');
    expect(html).toContain('850');
    expect(html).toContain('gpt-4o');
  });
});
