import { vibezcheck, withBilling } from '../src';
import type { UsageEvent } from '../src/types';

describe('AI SDK Latest Providers Compatibility (OpenAI & Anthropic)', () => {
  it('should wrap OpenAI LanguageModel and capture tokens and prompt caching', async () => {
    let capturedEvent: UsageEvent | null = null;

    const mockOpenAIModel = {
      modelId: 'gpt-4o-mini',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'Hello from OpenAI!',
        usage: {
          promptTokens: 500,
          completionTokens: 200,
          promptTokensDetails: {
            cachedTokens: 150,
          },
        },
      }),
      doStream: jest.fn(),
    };

    const metered = vibezcheck(mockOpenAIModel, {
      customer: {
        userId: 'usr_openai_1',
        email: 'alex@acme.ai',
        orgId: 'org_acme',
        plan: 'pro',
      },
      pricing: { margin: 1.5 },
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    const res = await metered.doGenerate({ prompt: 'Hi' });
    expect(res.text).toBe('Hello from OpenAI!');
    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('gpt-4o-mini');
    expect(capturedEvent!.usage.inputTokens).toBe(500);
    expect(capturedEvent!.usage.outputTokens).toBe(200);
    expect(capturedEvent!.usage.cachedTokens).toBe(150);
    expect(capturedEvent!.customer?.orgId).toBe('org_acme');
    expect(capturedEvent!.cost.totalUSD).toBeGreaterThan(0);
  });

  it('should wrap Anthropic LanguageModel and extract Extended Thinking reasoning tokens', async () => {
    let capturedEvent: UsageEvent | null = null;

    const streamChunks = [
      { type: 'reasoning', textDelta: 'Analyzing the problem step by step...' },
      { type: 'text-delta', textDelta: 'The result is 42.' },
      {
        type: 'finish',
        finishReason: 'stop',
        usage: {
          inputTokens: 800,
          outputTokens: 1200,
          outputTokenDetails: {
            reasoningTokens: 950,
          },
        },
      },
    ];

    const readable = new ReadableStream({
      start(controller) {
        for (const chunk of streamChunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const mockAnthropicModel = {
      modelId: 'claude-3-7-sonnet',
      provider: '@ai-sdk/anthropic',
      specificationVersion: 'v3',
      doGenerate: jest.fn(),
      doStream: jest.fn().mockResolvedValue({
        stream: readable,
      }),
    };

    const metered = vibezcheck(mockAnthropicModel, {
      customer: 'cus_anthropic_dev',
      pricing: { margin: 1.3 },
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    const streamResult = await metered.doStream({ prompt: 'Think carefully' });
    const reader = streamResult.stream.getReader();

    const outputChunks: any[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      outputChunks.push(value);
    }

    expect(outputChunks).toHaveLength(3);
    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('claude-3-7-sonnet');
    expect(capturedEvent!.usage.inputTokens).toBe(800);
    expect(capturedEvent!.usage.outputTokens).toBe(1200);
    expect(capturedEvent!.usage.reasoningTokens).toBe(950);
    expect(capturedEvent!.usage.visibleOutputTokens).toBe(250);
  });

  it('should resolve string identifiers for anthropic and openai seamlessly', () => {
    const openaiModel = vibezcheck('openai/gpt-4o', { customer: 'test@example.com' });
    expect(openaiModel).toBeDefined();

    const anthropicModel = vibezcheck('anthropic/claude-3-7-sonnet', { customer: 'test@example.com' });
    expect(anthropicModel).toBeDefined();

    const shorthandClaude = vibezcheck('claude-3-5-haiku', { customer: 'test@example.com' });
    expect(shorthandClaude).toBeDefined();

    const magistralModel = vibezcheck('magistral-small-latest', { customer: 'test@example.com' });
    expect(magistralModel).toBeDefined();

    const imageModel = vibezcheck('gpt-image-2.5-flare', { customer: 'test@example.com' });
    expect(imageModel).toBeDefined();
  });

  it('should handle modern LanguageModelV4Usage structured objects without NaN', async () => {
    let capturedEvent: UsageEvent | null = null;

    // Vercel AI SDK v4 specification returns structured usage objects
    const v4Usage = {
      inputTokens: {
        total: 1200,
        noCache: 800,
        cacheRead: 400,
        cacheWrite: 50,
      },
      outputTokens: {
        total: 600,
        text: 450,
        reasoning: 150,
      },
    };

    const mockV4Model = {
      modelId: 'gpt-4o',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v4',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'V4 generation response',
        usage: v4Usage,
      }),
      doStream: jest.fn(),
    };

    const metered = vibezcheck(mockV4Model, {
      customer: 'cus_v4_test',
      pricing: { margin: 1.25 },
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    await metered.doGenerate({ prompt: 'Test V4 spec' });

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.usage.inputTokens).toBe(1200);
    expect(capturedEvent!.usage.outputTokens).toBe(600);
    expect(capturedEvent!.usage.totalTokens).toBe(1800);
    expect(capturedEvent!.usage.cachedTokens).toBe(400);
    expect(capturedEvent!.usage.cacheWriteTokens).toBe(50);
    expect(capturedEvent!.usage.reasoningTokens).toBe(150);
    expect(capturedEvent!.usage.visibleOutputTokens).toBe(450);
    expect(Number.isNaN(capturedEvent!.cost.totalUSD)).toBe(false);
    expect(capturedEvent!.cost.totalUSD).toBeGreaterThan(0);
  });

  it('should preserve reasoning and capture tokens when stream contains empty tool_calls deltas', async () => {
    let capturedEvent: UsageEvent | null = null;

    // Provider stream deltas with empty tool_calls arrays during reasoning (Groq / xAI / Moonshot fix)
    const streamChunks = [
      { type: 'reasoning-start', id: 'r1' },
      { type: 'reasoning-delta', id: 'r1', delta: 'Let me think about this...', tool_calls: [] },
      { type: 'reasoning-delta', id: 'r1', delta: ' Step 2: verify.', tool_calls: [] },
      { type: 'reasoning-end', id: 'r1' },
      { type: 'text-delta', delta: 'Final answer.', tool_calls: [] },
      {
        type: 'finish',
        finishReason: 'stop',
        usage: {
          inputTokens: { total: 300, noCache: 300, cacheRead: 0, cacheWrite: 0 },
          outputTokens: { total: 120, text: 40, reasoning: 80 },
        },
      },
    ];

    const readable = new ReadableStream({
      start(controller) {
        for (const chunk of streamChunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const mockModel = {
      modelId: 'magistral-small-latest',
      provider: '@ai-sdk/mistral',
      specificationVersion: 'v4',
      doGenerate: jest.fn(),
      doStream: jest.fn().mockResolvedValue({
        stream: readable,
      }),
    };

    const metered = vibezcheck(mockModel, {
      customer: 'cus_reasoning_stream',
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    const res = await metered.doStream({ prompt: 'Explain' });
    const reader = res.stream.getReader();
    const collected: any[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      collected.push(value);
    }

    expect(collected).toHaveLength(6);
    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('magistral-small-latest');
    expect(capturedEvent!.usage.inputTokens).toBe(300);
    expect(capturedEvent!.usage.outputTokens).toBe(120);
    expect(capturedEvent!.usage.reasoningTokens).toBe(80);
    expect(capturedEvent!.cost.totalUSD).toBeGreaterThan(0);
  });
});
