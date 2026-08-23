import { withBilling } from '../src/ai-sdk/with-billing';
import type { UsageEvent } from '../src/types';

describe('withBilling (Vercel AI SDK Wrapper)', () => {
  it('should wrap doGenerate and capture usage upon synchronous completion', async () => {
    let capturedEvent: UsageEvent | null = null;

    const mockLanguageModel = {
      modelId: 'gpt-5.6-sol',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v2',
      doGenerate: jest.fn().mockResolvedValue({
        text: 'AI response text',
        usage: {
          promptTokens: 1000,
          completionTokens: 2500,
          reasoningTokens: 1800,
        },
      }),
      doStream: jest.fn(),
    };

    const metered = withBilling(mockLanguageModel, {
      customer: 'user_alex',
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    const result = await (metered as any).doGenerate({ prompt: 'Solve equation' });
    expect(result.text).toBe('AI response text');

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('gpt-5.6-sol');
    expect(capturedEvent!.usage.inputTokens).toBe(1000);
    expect(capturedEvent!.usage.outputTokens).toBe(2500);
    expect(capturedEvent!.usage.reasoningTokens).toBe(1800);
    expect(capturedEvent!.usage.visibleOutputTokens).toBe(700);
    expect(capturedEvent!.customerId).toBe('user_alex');
  });

  it('should wrap doStream ReadableStream and capture finish usage', async () => {
    let capturedEvent: UsageEvent | null = null;

    const streamChunks = [
      { type: 'text-delta', textDelta: 'Quantum ' },
      { type: 'text-delta', textDelta: 'computing.' },
      {
        type: 'finish',
        finishReason: 'stop',
        usage: {
          promptTokens: 350,
          completionTokens: 80,
          reasoningTokens: 0,
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

    const mockLanguageModel = {
      modelId: 'claude-3-7-sonnet',
      provider: '@ai-sdk/anthropic',
      specificationVersion: 'v3',
      doGenerate: jest.fn(),
      doStream: jest.fn().mockResolvedValue({
        stream: readable,
      }),
    };

    const metered = withBilling(mockLanguageModel, {
      customer: 'cus_stream_user',
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    const streamResult = await (metered as any).doStream({ prompt: 'Explain' });
    const reader = streamResult.stream.getReader();

    const chunks: any[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    expect(chunks).toHaveLength(3);
    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('claude-3-7-sonnet');
    expect(capturedEvent!.usage.inputTokens).toBe(350);
    expect(capturedEvent!.usage.outputTokens).toBe(80);
    expect(capturedEvent!.customerId).toBe('cus_stream_user');
  });
});
