/**
 * ✦ VibezCheck Universal Telemetry Response Stream Injector
 *
 * Transmits real-time verified token counts, exact dollar costs, profit margins,
 * and model telemetry from the server into AI SDK useChat() across all versions:
 * - AI SDK v5/v6/v7 (UI Message Stream): Injects `data-vibezcheck` and `message-metadata` SSE events
 * - AI SDK v4 (Data Stream Protocol): Injects `2:[{"type":"vibezcheck", ...}]` message annotation lines
 * - Custom / Text Streams: Injects clean telemetry without breaking stream parsers
 */

export interface ToResponseOptions {
  /** Custom ResponseInit (status, statusText, headers) */
  init?: ResponseInit;
  /** Additional HTTP headers */
  headers?: HeadersInit;
  /** Explicit telemetry payload override */
  telemetry?: any;
}

/**
 * Transforms an AI SDK stream result (or standard Response) into a client-ready HTTP Response
 * that transmits both AI completion chunks and verified VibezCheck telemetry.
 *
 * @example
 * ```typescript
 * import { streamText } from 'ai';
 * import { openai } from '@ai-sdk/openai';
 * import { vibezcheck } from 'vibezcheck';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *   const result = streamText({
 *     model: vibezcheck(openai('gpt-4o'), { customer: 'cus_123' }),
 *     messages,
 *   });
 *   return vibezcheck.toResponse(result);
 * }
 * ```
 */
export function toResponse(
  result: any,
  options?: ToResponseOptions
): Response {
  let baseResponse: Response;

  if (typeof result?.toUIMessageStreamResponse === 'function') {
    baseResponse = result.toUIMessageStreamResponse(options?.init);
  } else if (typeof result?.toDataStreamResponse === 'function') {
    baseResponse = result.toDataStreamResponse(options?.init);
  } else if (typeof result?.toTextStreamResponse === 'function') {
    baseResponse = result.toTextStreamResponse(options?.init);
  } else if (result instanceof Response) {
    baseResponse = result;
  } else if (result && typeof result === 'object' && result.body && result.headers) {
    baseResponse = result as Response;
  } else {
    baseResponse = new Response(result, options?.init);
  }

  if (!baseResponse.body) {
    return baseResponse;
  }

  const contentType = baseResponse.headers.get('content-type') || '';
  const isSSE =
    contentType.includes('text/event-stream') ||
    baseResponse.headers.has('x-vercel-ai-ui-message-stream');
  const isDataStream = baseResponse.headers.has('x-vercel-ai-data-stream');

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let injected = false;

  const resolveTelemetry = async (): Promise<any> => {
    if (options?.telemetry) return options.telemetry;

    // Check providerMetadata promise from streamText
    if (result?.providerMetadata) {
      try {
        const meta = await Promise.race([
          result.providerMetadata,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800)),
        ]);
        if (meta?.vibezcheck) {
          return meta.vibezcheck;
        }
      } catch {
        // Fall through
      }
    }

    // Check usage promise from streamText
    if (result?.usage) {
      try {
        const u = await Promise.race([
          result.usage,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800)),
        ]);
        if (u) {
          const inputTokens = u.promptTokens ?? u.inputTokens ?? 0;
          const outputTokens = u.completionTokens ?? u.outputTokens ?? 0;
          const reasoningTokens = u.reasoningTokens ?? u.completionTokensDetails?.reasoningTokens;
          return {
            type: 'vibezcheck',
            usage: {
              inputTokens,
              outputTokens,
              totalTokens: inputTokens + outputTokens,
              reasoningTokens,
            },
          };
        }
      } catch {
        // Fall through
      }
    }

    return null;
  };

  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const text = decoder.decode(chunk, { stream: true });

      // AI SDK v5/v6/v7 UI Message Stream (SSE)
      if (isSSE && text.includes('[DONE]') && !injected) {
        injected = true;
        const telemetry = await resolveTelemetry();
        if (telemetry) {
          const ssePayload =
            `data: ${JSON.stringify({ type: 'data-vibezcheck', data: telemetry })}\n\n` +
            `data: ${JSON.stringify({ type: 'message-metadata', messageMetadata: { vibezcheck: telemetry } })}\n\n`;

          const doneIndex = text.indexOf('data: [DONE]');
          if (doneIndex !== -1) {
            const before = text.slice(0, doneIndex);
            const after = text.slice(doneIndex);
            if (before) controller.enqueue(encoder.encode(before));
            controller.enqueue(encoder.encode(ssePayload));
            controller.enqueue(encoder.encode(after));
            return;
          } else {
            controller.enqueue(encoder.encode(ssePayload));
          }
        }
      } else if (isDataStream && (text.includes('d:{') || text.includes('d: {')) && !injected) {
        // AI SDK v4 Data Stream Protocol: 2:[{...}] annotation line
        injected = true;
        const telemetry = await resolveTelemetry();
        if (telemetry) {
          const annotationLine = `2:[${JSON.stringify(telemetry)}]\n`;
          controller.enqueue(encoder.encode(annotationLine));
        }
      }

      controller.enqueue(chunk);
    },
    async flush(controller) {
      if (!injected) {
        injected = true;
        const telemetry = await resolveTelemetry();
        if (telemetry) {
          if (isSSE) {
            const ssePayload =
              `data: ${JSON.stringify({ type: 'data-vibezcheck', data: telemetry })}\n\n` +
              `data: ${JSON.stringify({ type: 'message-metadata', messageMetadata: { vibezcheck: telemetry } })}\n\n`;
            controller.enqueue(encoder.encode(ssePayload));
          } else {
            const annotationLine = `2:[${JSON.stringify(telemetry)}]\n`;
            controller.enqueue(encoder.encode(annotationLine));
          }
        }
      }
    },
  });

  const mergedHeaders = new Headers(baseResponse.headers);
  if (options?.headers) {
    const extraHeaders = new Headers(options.headers);
    extraHeaders.forEach((value, key) => {
      mergedHeaders.set(key, value);
    });
  }

  const status = options?.init?.status ?? baseResponse.status;
  const statusText = options?.init?.statusText ?? baseResponse.statusText;

  return new Response(baseResponse.body.pipeThrough(transformStream), {
    status,
    statusText,
    headers: mergedHeaders,
  });
}
