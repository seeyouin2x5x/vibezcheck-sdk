import React from 'react';
import { renderToString } from 'react-dom/server';
import { VibezReceipt, VibezCheck } from '../src/react';
import { vibezcheck, toResponse } from '../src';
import { withBilling } from '../src/ai-sdk/with-billing';

describe('Zero-Prop UI & Native Stream Telemetry Suite (v0.5.6)', () => {
  describe('<VibezReceipt /> Zero-Prop Telemetry Extraction', () => {
    it('should render verified telemetry from AI SDK v4 message.annotations with zero extra props', () => {
      const message = {
        role: 'assistant',
        content: 'Hello world!',
        annotations: [
          {
            type: 'vibezcheck',
            cost: { totalUSD: 0.0014 },
            usage: { totalTokens: 120 },
            model: 'gpt-4o',
          },
        ],
      };

      const html = renderToString(<VibezReceipt message={message} />);

      expect(html).toContain('✦');
      expect(html).toContain('$0.0014');
      expect(html).toContain('120 tok');
      expect(html).toContain('gpt-4o');
    });

    it('should render verified telemetry from AI SDK v5/v6/v7 message.parts (data-vibezcheck)', () => {
      const message = {
        role: 'assistant',
        parts: [
          { type: 'text', text: 'Quantum computers operate with qubits.' },
          {
            type: 'data-vibezcheck',
            data: {
              type: 'vibezcheck',
              cost: { totalUSD: 0.0028 },
              usage: { totalTokens: 350 },
              model: 'claude-3-5-sonnet',
            },
          },
        ],
      };

      const html = renderToString(<VibezReceipt message={message} />);

      expect(html).toContain('✦');
      expect(html).toContain('$0.0028');
      expect(html).toContain('350 tok');
      expect(html).toContain('claude-3-5-sonnet');
    });

    it('should render verified telemetry from AI SDK message.metadata.vibezcheck', () => {
      const message = {
        role: 'assistant',
        content: 'Here is your summary.',
        metadata: {
          vibezcheck: {
            cost: { totalUSD: 0.0003 },
            usage: { totalTokens: 45 },
            model: 'gemini-1.5-flash',
          },
        },
      };

      const html = renderToString(<VibezReceipt message={message} />);

      expect(html).toContain('✦');
      expect(html).toContain('$0.0003');
      expect(html).toContain('45 tok');
      expect(html).toContain('gemini-1.5-flash');
    });

    it('should fallback to character count estimation if telemetry is missing', () => {
      const message = {
        role: 'assistant',
        content: 'This is a test response with several words.',
      };

      const html = renderToString(<VibezReceipt message={message} />);

      expect(html).toContain('✦');
      expect(html).toContain('tok');
    });
  });

  describe('<VibezCheck /> Zero-Prop Conversation Aggregator', () => {
    it('should dynamically derive model, margin, wholesale, and profit from message telemetry', () => {
      const messages = [
        { role: 'user', content: 'Tell me a joke.' },
        {
          role: 'assistant',
          content: 'Why did the chicken cross the road?',
          parts: [
            {
              type: 'data-vibezcheck',
              data: {
                model: 'gpt-4o-mini',
                cost: {
                  billedUSD: 0.0013,
                  wholesaleUSD: 0.0010,
                  profitUSD: 0.0003,
                },
                usage: {
                  inputTokens: 50,
                  outputTokens: 25,
                  totalTokens: 75,
                },
              },
            },
          ],
        },
      ];

      // ZERO PROPS beyond messages! By default, wholesale and margin are hidden from customers
      const defaultHtml = renderToString(<VibezCheck messages={messages} defaultOpen={true} />);

      expect(defaultHtml).toContain('vibezcheck-ui-root');
      expect(defaultHtml).toContain('$0.0013');
      expect(defaultHtml).toContain('79 tok');
      expect(defaultHtml).toContain('gpt-4o-mini');
      // Hidden by default!
      expect(defaultHtml).not.toContain('+30% Margin');
      expect(defaultHtml).not.toContain('Wholesale API');

      // When showMargin and showWholesale are true, developer economics are shown
      const devHtml = renderToString(
        <VibezCheck messages={messages} defaultOpen={true} showMargin={true} showWholesale={true} />
      );
      expect(devHtml).toContain('+30% Margin');
      expect(devHtml).toContain('Wholesale API');
    });

    it('should aggregate across multiple message turns seamlessly', () => {
      const messages = [
        { role: 'user', content: 'Turn 1' },
        {
          role: 'assistant',
          content: 'Reply 1',
          annotations: [
            {
              type: 'vibezcheck',
              cost: { billedUSD: 0.0010, wholesaleUSD: 0.0008 },
              usage: { totalTokens: 100, inputTokens: 60, outputTokens: 40 },
              model: 'gpt-4o',
            },
          ],
        },
        { role: 'user', content: 'Turn 2' },
        {
          role: 'assistant',
          content: 'Reply 2',
          annotations: [
            {
              type: 'vibezcheck',
              cost: { billedUSD: 0.0020, wholesaleUSD: 0.0016 },
              usage: { totalTokens: 200, inputTokens: 120, outputTokens: 80 },
              model: 'gpt-4o',
            },
          ],
        },
      ];

      const html = renderToString(<VibezCheck messages={messages} defaultOpen={true} showMargin={true} />);

      // Total billed = 0.0010 + 0.0020 = 0.0030
      expect(html).toContain('$0.0030');
      // Total tokens = 100 + 200 + user prompt tokens = 304 tok
      expect(html).toContain('304 tok');
      expect(html).toContain('gpt-4o');
      expect(html).toContain('+25% Margin');
    });

    it('should render cleanly without onTopUp callback', () => {
      const messages = [{ role: 'user', content: 'Hi' }];
      const html = renderToString(<VibezCheck messages={messages} defaultOpen={true} />);
      expect(html).toContain('vibezcheck-ui-root');
      expect(html).not.toContain('Top Up ▶');
    });
  });

  describe('Server Telemetry Protocol (vibezcheck.toResponse & withBilling)', () => {
    it('should expose toResponse helper on vibezcheck', () => {
      expect(typeof vibezcheck.toResponse).toBe('function');
      expect(typeof toResponse).toBe('function');
    });

    it('should inject data-vibezcheck and message-metadata chunks into SSE stream', async () => {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const mockBody = new ReadableStream({
        start(c) {
          c.enqueue(encoder.encode('data: {"type":"text-delta","delta":"hi"}\n\n'));
          c.enqueue(encoder.encode('data: [DONE]\n\n'));
          c.close();
        },
      });

      const mockResponse = new Response(mockBody, {
        headers: { 'content-type': 'text/event-stream' },
      });

      const telemetry = {
        type: 'vibezcheck',
        cost: { totalUSD: 0.0005 },
        usage: { totalTokens: 50 },
        model: 'gpt-4o',
      };

      const response = toResponse(mockResponse, { telemetry });
      const reader = response.body!.getReader();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
      }

      expect(fullText).toContain('data: {"type":"data-vibezcheck"');
      expect(fullText).toContain('"cost":{"totalUSD":0.0005}');
      expect(fullText).toContain('data: {"type":"message-metadata"');
      expect(fullText).toContain('data: [DONE]');
      // Telemetry must be enqueued BEFORE [DONE]
      const teleIdx = fullText.indexOf('data-vibezcheck');
      const doneIdx = fullText.indexOf('data: [DONE]');
      expect(teleIdx).toBeLessThan(doneIdx);
    });

    it('should inject 2:[...] annotation line into data stream', async () => {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const mockBody = new ReadableStream({
        start(c) {
          c.enqueue(encoder.encode('0:"hi"\n'));
          c.enqueue(encoder.encode('d:{"finishReason":"stop"}\n'));
          c.close();
        },
      });

      const mockResponse = new Response(mockBody, {
        headers: { 'x-vercel-ai-data-stream': 'v1' },
      });

      const telemetry = {
        type: 'vibezcheck',
        cost: { totalUSD: 0.0002 },
        usage: { totalTokens: 20 },
        model: 'gpt-4o-mini',
      };

      const response = toResponse(mockResponse, { telemetry });
      const reader = response.body!.getReader();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value);
      }

      expect(fullText).toContain('2:[{"type":"vibezcheck"');
      expect(fullText).toContain('"cost":{"totalUSD":0.0002}');
    });
  });
});
