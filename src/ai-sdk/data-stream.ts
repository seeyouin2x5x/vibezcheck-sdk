/**
 * ✦ VibezCheck Native AI SDK v7 DataUIPart Stream Helper
 *
 * Automatically injects native `{ type: 'data-vibezcheck', data }` parts into
 * AI SDK SSE streams, UI message streams, and Data Stream protocol pipes.
 *
 * Seamlessly hydrates client-side `useVibez(messages)` with real-time verified:
 * - Cost breakdown (costUSD, wholesaleUSD, profitUSD)
 * - Token metrics (prompt, completion, reasoning, cached)
 * - Model & Provider metadata
 * - Tool usage & itemized costs
 */

import { calculateCost } from '../pricing/calculator';
import type { CustomerParam } from '../types';

/**
 * Normalized telemetry payload transmitted inside `{ type: 'data-vibezcheck', data: ... }`
 */
export interface VibezDataStreamPayload {
  model: string;
  provider?: string;
  costUSD: number;
  wholesaleUSD: number;
  profitUSD: number;
  tokens: number;
  promptTokens: number;
  completionTokens: number;
  reasoningTokens?: number;
  cachedTokens?: number;
  toolCalls?: Array<{
    name: string;
    calls: number;
    costUSD: number;
    latencyMs?: number;
  }>;
  customerId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface ToVibezDataStreamOptions {
  /** Explicit telemetry payload or overrides */
  telemetry?: Partial<VibezDataStreamPayload>;
  /** Customer param for billing attribution */
  customer?: CustomerParam;
  /** Model override if not auto-detected */
  model?: string;
  /** Profit margin multiplier if recalculating (e.g. 1.30 for 30%) */
  margin?: number;
  /** Callback fired when telemetry is written to stream */
  onTelemetry?: (telemetry: VibezDataStreamPayload) => void | Promise<void>;
  /** Custom extra stream parts to emit alongside data-vibezcheck */
  extraParts?: any[];
}

/**
 * Augmented ReadableStream with convenient 1-line `.toResponse()` helper
 */
export interface VibezDataStream extends ReadableStream<any> {
  toResponse(init?: ResponseInit & { headers?: HeadersInit }): Response;
}

/**
 * Normalizes any raw telemetry or usage event into a canonical VibezDataStreamPayload
 */
export function normalizeTelemetryPayload(
  raw: any = {},
  options: ToVibezDataStreamOptions = {}
): VibezDataStreamPayload {
  const model = options.telemetry?.model || raw.model || options.model || 'ai-model';
  const provider = options.telemetry?.provider || raw.provider || 'openai';

  const inputTokens =
    options.telemetry?.promptTokens ??
    raw.usage?.inputTokens ??
    raw.promptTokens ??
    raw.inputTokens ??
    0;
  const outputTokens =
    options.telemetry?.completionTokens ??
    raw.usage?.outputTokens ??
    raw.completionTokens ??
    raw.outputTokens ??
    0;
  const reasoningTokens =
    options.telemetry?.reasoningTokens ??
    raw.usage?.reasoningTokens ??
    raw.reasoningTokens ??
    0;
  const cachedTokens =
    options.telemetry?.cachedTokens ??
    raw.usage?.cachedTokens ??
    raw.cachedTokens ??
    0;
  const totalTokens =
    options.telemetry?.tokens ??
    raw.usage?.totalTokens ??
    raw.tokens ??
    inputTokens + outputTokens;

  let costUSD = 0;
  let wholesaleUSD = 0;
  let profitUSD = 0;

  if (typeof options.telemetry?.costUSD === 'number') {
    costUSD = options.telemetry.costUSD;
    wholesaleUSD = options.telemetry.wholesaleUSD ?? costUSD;
    profitUSD = options.telemetry.profitUSD ?? Math.max(0, costUSD - wholesaleUSD);
  } else if (typeof raw.cost === 'number') {
    costUSD = raw.cost;
    wholesaleUSD = raw.cost;
    profitUSD = 0;
  } else if (raw.cost && typeof raw.cost === 'object') {
    costUSD = raw.cost.billedUSD ?? raw.cost.totalUSD ?? raw.cost.costUSD ?? 0;
    wholesaleUSD = raw.cost.wholesaleUSD ?? raw.cost.wholesaleTotalUSD ?? costUSD;
    profitUSD = raw.cost.profitUSD ?? Math.max(0, costUSD - wholesaleUSD);
  } else if (typeof raw.costUSD === 'number') {
    costUSD = raw.costUSD;
    wholesaleUSD = raw.wholesaleUSD ?? raw.costUSD;
    profitUSD = raw.profitUSD ?? Math.max(0, costUSD - wholesaleUSD);
  } else {
    const computed = calculateCost({
      model,
      inputTokens,
      outputTokens,
      reasoningTokens,
      cachedTokens,
      markupMultiplier: options.margin,
    });
    costUSD = computed.totalUSD;
    wholesaleUSD = computed.wholesaleUSD ?? computed.totalUSD;
    profitUSD = computed.profitUSD ?? Math.max(0, costUSD - wholesaleUSD);
  }

  const customerId =
    typeof options.customer === 'string'
      ? options.customer
      : options.customer?.id ||
        options.customer?.userId ||
        raw.customerId ||
        raw.customer?.id;

  const toolCalls =
    options.telemetry?.toolCalls ||
    raw.toolCalls ||
    raw.metadata?.toolCalls ||
    (Array.isArray(raw.metadata?.toolCalls) ? raw.metadata.toolCalls : undefined);

  return {
    model,
    provider,
    costUSD: Number(costUSD.toFixed(6)),
    wholesaleUSD: Number(wholesaleUSD.toFixed(6)),
    profitUSD: Number(profitUSD.toFixed(6)),
    tokens: totalTokens,
    promptTokens: inputTokens,
    completionTokens: outputTokens,
    reasoningTokens: reasoningTokens > 0 ? reasoningTokens : undefined,
    cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
    toolCalls: toolCalls && toolCalls.length > 0 ? toolCalls : undefined,
    customerId,
    timestamp: raw.timestamp || new Date().toISOString(),
    metadata: {
      ...raw.metadata,
      ...options.telemetry?.metadata,
    },
  };
}

/**
 * Transforms an AI SDK stream (or StreamTextResult) into a VibezDataStream
 * that writes native `{ type: 'data-vibezcheck', data }` parts directly into the SSE stream.
 *
 * @example
 * ```typescript
 * import { streamText } from 'ai';
 * import { openai } from '@ai-sdk/openai';
 * import { vibezcheck, toVibezDataStream } from 'vibezcheck';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *   const result = streamText({
 *     model: vibezcheck(openai('gpt-4o')),
 *     messages,
 *   });
 *
 *   // ✦ 1-Line Data Stream with Native Telemetry Part
 *   return toVibezDataStream(result).toResponse();
 * }
 * ```
 */
export function toVibezDataStream(
  source: any,
  options: ToVibezDataStreamOptions = {}
): VibezDataStream {
  let underlyingStream: ReadableStream<any>;
  let detectedType: 'sse' | 'datastream' | 'object' = 'sse';

  // 1. Resolve raw ReadableStream from StreamTextResult, Response, or direct stream
  if (typeof source?.toUIMessageStream === 'function') {
    underlyingStream = source.toUIMessageStream();
    detectedType = 'sse';
  } else if (typeof source?.toDataStream === 'function') {
    underlyingStream = source.toDataStream();
    detectedType = 'datastream';
  } else if (typeof source?.toTextStreamResponse === 'function') {
    const res = source.toTextStreamResponse();
    underlyingStream = res.body!;
    detectedType = 'sse';
  } else if (source instanceof Response && source.body) {
    underlyingStream = source.body;
    const ct = source.headers.get('content-type') || '';
    detectedType = ct.includes('event-stream') ? 'sse' : 'datastream';
  } else if (source && typeof source === 'object' && typeof source.pipeThrough === 'function') {
    underlyingStream = source as ReadableStream<any>;
  } else if (source?.body && typeof source.body.pipeThrough === 'function') {
    underlyingStream = source.body as ReadableStream<any>;
  } else {
    throw new Error('[vibezcheck] toVibezDataStream: Invalid stream source provided.');
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let injected = false;
  let capturedChunkMeta: any = null;

  // Resolve telemetry from promises or captured chunk metadata
  const resolveTelemetry = async (): Promise<VibezDataStreamPayload> => {
    if (options.telemetry && options.telemetry.costUSD !== undefined) {
      return normalizeTelemetryPayload(options.telemetry, options);
    }

    // Check captured metadata from stream chunks
    if (capturedChunkMeta) {
      return normalizeTelemetryPayload(capturedChunkMeta, options);
    }

    // Check providerMetadata promise from streamText
    if (source?.providerMetadata) {
      try {
        const meta = await Promise.race([
          source.providerMetadata,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 500)),
        ]);
        if (meta?.vibezcheck) {
          return normalizeTelemetryPayload(meta.vibezcheck, options);
        }
      } catch {
        // Continue to usage check
      }
    }

    // Check usage promise from streamText
    if (source?.usage) {
      try {
        const u = await Promise.race([
          source.usage,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 500)),
        ]);
        if (u) {
          return normalizeTelemetryPayload({ usage: u }, options);
        }
      } catch {
        // Fallback to options
      }
    }

    return normalizeTelemetryPayload({}, options);
  };

  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      // Object Mode Stream
      if (typeof chunk === 'object' && !(chunk instanceof Uint8Array)) {
        detectedType = 'object';

        // Capture metadata attached to finish chunk
        if (chunk.type === 'finish' && chunk.providerMetadata?.vibezcheck) {
          capturedChunkMeta = chunk.providerMetadata.vibezcheck;
        } else if (chunk.providerMetadata?.vibezcheck) {
          capturedChunkMeta = chunk.providerMetadata.vibezcheck;
        }

        controller.enqueue(chunk);
        return;
      }

      // Byte / Text Mode Stream
      const isBuffer = chunk instanceof Uint8Array;
      const text = isBuffer ? decoder.decode(chunk, { stream: true }) : String(chunk);

      // Check for SSE indicators
      if (text.includes('data:')) {
        detectedType = 'sse';
      } else if (text.startsWith('0:') || text.startsWith('2:') || text.startsWith('d:')) {
        detectedType = 'datastream';
      }

      // Check if this chunk is the completion event (e.g. data: [DONE])
      if (text.includes('[DONE]') && !injected) {
        injected = true;
        const telemetry = await resolveTelemetry();
        if (options.onTelemetry) {
          try {
            await options.onTelemetry(telemetry);
          } catch {}
        }

        const partPayload = { type: 'data-vibezcheck', data: telemetry };
        const sseLines = `data: ${JSON.stringify(partPayload)}\n\n`;

        const doneIdx = text.indexOf('data: [DONE]');
        if (doneIdx !== -1) {
          const before = text.slice(0, doneIdx);
          const after = text.slice(doneIdx);
          if (before) {
            controller.enqueue(isBuffer ? encoder.encode(before) : before);
          }
          controller.enqueue(isBuffer ? encoder.encode(sseLines) : sseLines);
          controller.enqueue(isBuffer ? encoder.encode(after) : after);
          return;
        } else {
          controller.enqueue(isBuffer ? encoder.encode(sseLines) : sseLines);
        }
      }

      controller.enqueue(chunk);
    },

    async flush(controller) {
      if (!injected) {
        injected = true;
        const telemetry = await resolveTelemetry();
        if (options.onTelemetry) {
          try {
            await options.onTelemetry(telemetry);
          } catch {}
        }

        const partPayload = { type: 'data-vibezcheck', data: telemetry };

        if (detectedType === 'object') {
          controller.enqueue(partPayload);
        } else if (detectedType === 'datastream') {
          // AI SDK v4 / v5 Data Stream Protocol
          const line = `d:${JSON.stringify(partPayload)}\n`;
          controller.enqueue(isBufferCompatible() ? encoder.encode(line) : line);
        } else {
          // Default: SSE UI Message Stream
          const sseLines = `data: ${JSON.stringify(partPayload)}\n\n`;
          controller.enqueue(isBufferCompatible() ? encoder.encode(sseLines) : sseLines);
        }
      }

      function isBufferCompatible(): boolean {
        return detectedType !== 'object';
      }
    },
  });

  const piped = underlyingStream.pipeThrough(transformStream);

  // Attach .toResponse() fluent helper
  const vibezStream = piped as VibezDataStream;
  vibezStream.toResponse = (init?: ResponseInit & { headers?: HeadersInit }): Response => {
    const isSSE = detectedType === 'sse';
    const defaultHeaders = new Headers({
      'Content-Type': isSSE ? 'text/event-stream; charset=utf-8' : 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'x-vercel-ai-ui-message-stream': isSSE ? 'v1' : (undefined as any),
      'x-vercel-ai-data-stream': !isSSE ? 'v1' : (undefined as any),
    });

    if (init?.headers) {
      const custom = new Headers(init.headers);
      custom.forEach((val, key) => defaultHeaders.set(key, val));
    }

    // Ensure all chunks are Uint8Array for standard Web Response compatibility
    const encoderStream = new TransformStream<any, Uint8Array>({
      transform(chunk, controller) {
        if (chunk instanceof Uint8Array) {
          controller.enqueue(chunk);
        } else if (typeof chunk === 'string') {
          controller.enqueue(encoder.encode(chunk));
        } else {
          controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
        }
      },
    });

    return new Response(vibezStream.pipeThrough(encoderStream), {
      status: init?.status ?? 200,
      statusText: init?.statusText,
      headers: defaultHeaders,
    });
  };

  return vibezStream;
}

/**
 * Transforms an AI SDK stream into an HTTP Response with native `data-vibezcheck` telemetry parts.
 */
export function toVibezDataStreamResponse(
  source: any,
  options?: ToVibezDataStreamOptions & { init?: ResponseInit; headers?: HeadersInit }
): Response {
  const stream = toVibezDataStream(source, options);
  return stream.toResponse({
    status: options?.init?.status,
    statusText: options?.init?.statusText,
    headers: options?.headers,
  });
}
