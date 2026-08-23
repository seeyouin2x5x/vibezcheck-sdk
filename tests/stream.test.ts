import { wrapOpenAIStream, wrapAnthropicStream } from '../src/meter/stream';
import type { UsageEvent } from '../src/types';

describe('Stream Wrapping & Interception', () => {
  it('should stream OpenAI chunks with zero latency and capture final usage', async () => {
    const mockChunks = [
      { id: '1', choices: [{ delta: { content: 'Hello ' } }] },
      { id: '2', choices: [{ delta: { content: 'world!' } }] },
      {
        id: '3',
        model: 'gpt-4o',
        choices: [{ delta: {} }],
        usage: {
          prompt_tokens: 15,
          completion_tokens: 2,
          total_tokens: 17,
        },
      },
    ];

    async function* createMockStream() {
      for (const chunk of mockChunks) {
        yield chunk;
      }
    }

    let capturedEvent: UsageEvent | null = null;
    const wrappedStream = wrapOpenAIStream(
      createMockStream(),
      { customerId: 'cus_test123' },
      (event) => {
        capturedEvent = event;
      }
    );

    const receivedChunks: any[] = [];
    for await (const chunk of wrappedStream) {
      receivedChunks.push(chunk);
    }

    expect(receivedChunks).toHaveLength(3);
    expect(receivedChunks[0].choices[0].delta.content).toBe('Hello ');
    expect(receivedChunks[1].choices[0].delta.content).toBe('world!');

    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.usage.inputTokens).toBe(15);
    expect(capturedEvent!.usage.outputTokens).toBe(2);
    expect(capturedEvent!.customerId).toBe('cus_test123');
  });

  it('should accumulate Anthropic message_start and message_delta events', async () => {
    const mockAnthropicEvents = [
      {
        type: 'message_start',
        message: {
          id: 'msg_1',
          model: 'claude-3-7-sonnet',
          usage: { input_tokens: 50, cache_read_input_tokens: 20 },
        },
      },
      {
        type: 'content_block_delta',
        delta: { type: 'text_delta', text: 'Anthropic test' },
      },
      {
        type: 'message_delta',
        usage: { output_tokens: 100, thinking_tokens: 60 },
      },
    ];

    async function* createAnthropicStream() {
      for (const event of mockAnthropicEvents) {
        yield event;
      }
    }

    let capturedEvent: UsageEvent | null = null;
    const wrappedStream = wrapAnthropicStream(
      createAnthropicStream(),
      { customerId: 'cus_anthropic_user' },
      (event) => {
        capturedEvent = event;
      }
    );

    const receivedEvents: any[] = [];
    for await (const event of wrappedStream) {
      receivedEvents.push(event);
    }

    expect(receivedEvents).toHaveLength(3);
    expect(capturedEvent).not.toBeNull();
    expect(capturedEvent!.model).toBe('claude-3-7-sonnet');
    expect(capturedEvent!.usage.inputTokens).toBe(50);
    expect(capturedEvent!.usage.outputTokens).toBe(100);
    expect(capturedEvent!.usage.reasoningTokens).toBe(60);
    expect(capturedEvent!.usage.cachedTokens).toBe(20);
  });
});
