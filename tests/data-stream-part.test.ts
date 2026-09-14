import {
  toVibezDataStream,
  toVibezDataStreamResponse,
  normalizeTelemetryPayload,
  vibezcheck,
} from '../src';
import { extractSessionStats } from '../src/react/hooks';

// Helper to read an entire ReadableStream to text
async function readStream(stream: ReadableStream<any>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value instanceof Uint8Array) {
      result += decoder.decode(value, { stream: true });
    } else if (typeof value === 'string') {
      result += value;
    } else {
      result += JSON.stringify(value);
    }
  }
  return result;
}

// Helper to read an object stream
async function readObjectStream(stream: ReadableStream<any>): Promise<any[]> {
  const reader = stream.getReader();
  const items: any[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    items.push(value);
  }
  return items;
}

describe('Native AI SDK v7 DataUIPart Stream Helper (toVibezDataStream)', () => {
  test('normalizeTelemetryPayload calculates correct costs, profit margins, and token fields', () => {
    const payload = normalizeTelemetryPayload(
      {
        model: 'gpt-4o',
        usage: {
          inputTokens: 1000,
          outputTokens: 200,
          reasoningTokens: 50,
          cachedTokens: 400,
        },
        toolCalls: [{ name: 'web_search', calls: 2, costUSD: 0.02 }],
        customerId: 'cus_test_123',
      },
      { margin: 1.30 }
    );

    expect(payload.model).toBe('gpt-4o');
    expect(payload.promptTokens).toBe(1000);
    expect(payload.completionTokens).toBe(200);
    expect(payload.reasoningTokens).toBe(50);
    expect(payload.cachedTokens).toBe(400);
    expect(payload.tokens).toBe(1200);
    expect(payload.costUSD).toBeGreaterThan(0);
    expect(payload.wholesaleUSD).toBeGreaterThan(0);
    expect(payload.profitUSD).toBeGreaterThan(0);
    expect(payload.toolCalls).toHaveLength(1);
    expect(payload.toolCalls![0].name).toBe('web_search');
    expect(payload.customerId).toBe('cus_test_123');
  });

  test('injects data-vibezcheck part into SSE text stream before data: [DONE]', async () => {
    const sseChunks = [
      'data: {"type":"text-delta","textDelta":"Hello "}\n\n',
      'data: {"type":"text-delta","textDelta":"world!"}\n\n',
      'data: [DONE]\n\n',
    ];

    const sourceStream = new ReadableStream({
      start(controller) {
        for (const chunk of sseChunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const stream = toVibezDataStream(sourceStream, {
      telemetry: {
        model: 'gpt-4o',
        costUSD: 0.0035,
        wholesaleUSD: 0.0025,
        profitUSD: 0.0010,
        tokens: 850,
        promptTokens: 700,
        completionTokens: 150,
      },
    });

    const text = await readStream(stream);

    expect(text).toContain('"Hello "');
    expect(text).toContain('"world!"');
    expect(text).toContain('data: {"type":"data-vibezcheck"');
    expect(text).toContain('"costUSD":0.0035');
    expect(text).toContain('"wholesaleUSD":0.0025');
    expect(text).toContain('"profitUSD":0.001');

    // Ensure data-vibezcheck appears before data: [DONE]
    const partIdx = text.indexOf('data: {"type":"data-vibezcheck"');
    const doneIdx = text.indexOf('data: [DONE]');
    expect(partIdx).toBeLessThan(doneIdx);
  });

  test('injects data-vibezcheck part into Uint8Array SSE byte stream', async () => {
    const encoder = new TextEncoder();
    const chunks = [
      encoder.encode('data: {"type":"text-delta","textDelta":"AI SDK SSE"}\n\n'),
      encoder.encode('data: [DONE]\n\n'),
    ];

    const sourceStream = new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const stream = toVibezDataStream(sourceStream, {
      telemetry: {
        model: 'claude-3-5-sonnet',
        costUSD: 0.0042,
        tokens: 950,
        promptTokens: 800,
        completionTokens: 150,
      },
    });

    const output = await readStream(stream);
    expect(output).toContain('AI SDK SSE');
    expect(output).toContain('data: {"type":"data-vibezcheck"');
    expect(output).toContain('"model":"claude-3-5-sonnet"');
    expect(output).toContain('"costUSD":0.0042');
  });

  test('injects raw data-vibezcheck object part into object-mode stream', async () => {
    const objectChunks = [
      { type: 'text-delta', textDelta: 'chunk 1' },
      { type: 'text-delta', textDelta: 'chunk 2' },
      {
        type: 'finish',
        usage: { promptTokens: 300, completionTokens: 50 },
        providerMetadata: {
          vibezcheck: {
            model: 'gpt-4o-mini',
            cost: { totalUSD: 0.00015, wholesaleUSD: 0.00010, profitUSD: 0.00005 },
            usage: { totalTokens: 350, inputTokens: 300, outputTokens: 50 },
          },
        },
      },
    ];

    const sourceStream = new ReadableStream({
      start(controller) {
        for (const chunk of objectChunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const stream = toVibezDataStream(sourceStream);
    const items = await readObjectStream(stream);

    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({ type: 'text-delta', textDelta: 'chunk 1' });
    expect(items[1]).toEqual({ type: 'text-delta', textDelta: 'chunk 2' });
    expect(items[2].type).toBe('finish');

    const lastItem = items[3];
    expect(lastItem.type).toBe('data-vibezcheck');
    expect(lastItem.data.model).toBe('gpt-4o-mini');
    expect(lastItem.data.costUSD).toBe(0.00015);
    expect(lastItem.data.wholesaleUSD).toBe(0.0001);
  });

  test('transforms StreamTextResult mock with .toDataStream() and usage promise', async () => {
    const mockResult = {
      toDataStream: () => {
        return new ReadableStream({
          start(controller) {
            controller.enqueue('0:"Hello from AI SDK"\n');
            controller.close();
          },
        });
      },
      usage: Promise.resolve({
        promptTokens: 500,
        completionTokens: 100,
      }),
      providerMetadata: Promise.resolve({
        vibezcheck: {
          model: 'gpt-4o',
          cost: { billedUSD: 0.0025, wholesaleUSD: 0.0018, profitUSD: 0.0007 },
          usage: { totalTokens: 600, inputTokens: 500, outputTokens: 100 },
        },
      }),
    };

    const stream = toVibezDataStream(mockResult);
    const text = await readStream(stream);

    expect(text).toContain('0:"Hello from AI SDK"\n');
    expect(text).toContain('d:{"type":"data-vibezcheck"');
    expect(text).toContain('"model":"gpt-4o"');
    expect(text).toContain('"costUSD":0.0025');
  });

  test('.toResponse() helper returns standard Response with SSE headers', async () => {
    const sourceStream = new ReadableStream({
      start(controller) {
        controller.enqueue('data: {"type":"text-delta","textDelta":"stream chunk"}\n\n');
        controller.enqueue('data: [DONE]\n\n');
        controller.close();
      },
    });

    const stream = toVibezDataStream(sourceStream, {
      telemetry: {
        model: 'gemini-2.0-flash',
        costUSD: 0.0001,
        tokens: 400,
      },
    });

    const response = stream.toResponse({
      headers: {
        'x-custom-header': 'test-val',
      },
    });

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-transform');
    expect(response.headers.get('x-custom-header')).toBe('test-val');

    const bodyText = await response.text();
    expect(bodyText).toContain('stream chunk');
    expect(bodyText).toContain('data: {"type":"data-vibezcheck"');
    expect(bodyText).toContain('"model":"gemini-2.0-flash"');
  });

  test('toVibezDataStreamResponse creates a client-ready Response directly', async () => {
    const sourceStream = new ReadableStream({
      start(controller) {
        controller.enqueue('data: {"type":"text-delta","textDelta":"hello"}\n\n');
        controller.enqueue('data: [DONE]\n\n');
        controller.close();
      },
    });

    const response = toVibezDataStreamResponse(sourceStream, {
      telemetry: {
        model: 'gpt-4o',
        costUSD: 0.002,
        tokens: 500,
      },
      headers: { 'x-powered-by': 'vibezcheck' },
    });

    expect(response.headers.get('x-powered-by')).toBe('vibezcheck');
    const body = await response.text();
    expect(body).toContain('"type":"data-vibezcheck"');
  });

  test('attached to vibezcheck root object as vibezcheck.toDataStream and vibezcheck.toVibezDataStream', () => {
    expect(typeof vibezcheck.toDataStream).toBe('function');
    expect(typeof vibezcheck.toVibezDataStream).toBe('function');
    expect(typeof vibezcheck.toDataStreamResponse).toBe('function');
  });

  test('useVibez hook automatically consumes the emitted data-vibezcheck part from message history', () => {
    const messages = [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Search and summarize recent papers',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: 'Here is the summary of recent research...',
        parts: [
          { type: 'text', text: 'Here is the summary of recent research...' },
          {
            type: 'data-vibezcheck',
            data: {
              model: 'gpt-4o',
              costUSD: 0.0035,
              wholesaleUSD: 0.0025,
              profitUSD: 0.0010,
              tokens: 850,
              promptTokens: 700,
              completionTokens: 150,
              reasoningTokens: 50,
              cachedTokens: 200,
              toolCalls: [
                { name: 'web_search', calls: 2, costUSD: 0.02 },
                { name: 'calculator', calls: 1, costUSD: 0.005 },
              ],
            },
          },
        ],
      },
    ];

    const stats = extractSessionStats(messages);

    expect(stats.hasServerTelemetry).toBe(true);
    expect(stats.activeModel).toBe('gpt-4o');
    expect(stats.totalCostUSD).toBe(0.0035);
    expect(stats.wholesaleUSD).toBe(0.0025);
    expect(stats.profitUSD).toBe(0.0010);
    expect(stats.totalTokens).toBe(850);
    expect(stats.promptTokens).toBe(700);
    expect(stats.completionTokens).toBe(150);
    expect(stats.reasoningTokens).toBe(50);
    expect(stats.cachedTokens).toBe(200);

    // Verify tool breakdown
    expect(stats.toolCallCount).toBe(3);
    expect(stats.toolCostUSD).toBe(0.025);
    expect(stats.byTool.web_search.calls).toBe(2);
    expect(stats.byTool.web_search.costUSD).toBe(0.02);
    expect(stats.byTool.calculator.calls).toBe(1);
    expect(stats.byTool.calculator.costUSD).toBe(0.005);
  });
});
