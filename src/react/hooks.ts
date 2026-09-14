import { useMemo } from 'react';
import type { UseVibezOptions, UseVibezResult, ModelUsageDetail, ToolUsageDetail } from './types';

// Built-in fallback rate cards per 1M tokens for local Zero-DB Dev Mode
const DEV_RATES: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'claude-3-5-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-7-sonnet': { input: 3.0, output: 15.0 },
  'claude-opus': { input: 15.0, output: 75.0 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
  'deepseek-chat': { input: 0.14, output: 0.28 },
  default: { input: 2.0, output: 8.0 },
};

export function cleanModelName(raw?: string): string | undefined {
  if (!raw || raw === 'ai-model' || raw === 'default') return undefined;
  const match = raw.match(/\(['"]?([^'"]+)['"]?\)/);
  let name = match ? match[1] : raw;
  name = name.replace(/^(openai|anthropic|google|xai|elevenlabs|deepseek|luma|mistral|groq)\//, '');
  return name;
}

/**
 * Pure function to extract live session financial and token metrics from messages or events
 */
export function extractSessionStats(
  messages?: any[],
  options: UseVibezOptions = {}
): UseVibezResult {
  const {
    model = 'gpt-4o',
    margin = 1.25,
    events,
    toolCosts,
    totalCostUSD: manualCost,
    totalTokens: manualTokens,
  } = options;

  let hasServerTelemetry = false;
  let wholesaleUSD = 0;
  let billedUSD = manualCost ?? 0;
  let totalTokens = manualTokens ?? 0;
  let promptTokens = 0;
  let completionTokens = 0;
  let cachedTokens = 0;
  let reasoningTokens = 0;
  let detectedModel: string | undefined = undefined;
  let turnCount = 0;

  const byModel: Record<string, ModelUsageDetail> = {};
  const byTool: Record<string, ToolUsageDetail> = {};
  let toolCostUSD = 0;
  let toolCallCount = 0;

  let latestBilledUSD = 0;
  let latestWholesaleUSD = 0;
  let latestTokens = 0;
  let latestPromptTokens = 0;
  let latestCompletionTokens = 0;
  let latestModel: string | undefined = undefined;

  const recordToolUsage = (
    toolName: string,
    cost: number = 0,
    latency?: number,
    callCount: number = 1
  ) => {
    if (!toolName) return;
    if (!byTool[toolName]) {
      byTool[toolName] = {
        name: toolName,
        calls: 0,
        costUSD: 0,
        latencyMs: latency,
      };
    }
    byTool[toolName].calls += callCount;
    byTool[toolName].costUSD = Number((byTool[toolName].costUSD + cost).toFixed(6));
    if (latency !== undefined) {
      byTool[toolName].latencyMs = (byTool[toolName].latencyMs ?? 0) + latency;
    }
    toolCallCount += callCount;
    toolCostUSD = Number((toolCostUSD + cost).toFixed(6));
  };

  const recordModelUsage = (
    rawModel: string | undefined,
    tok: number,
    pTok: number,
    cTok: number,
    billed: number,
    wholesale: number,
    rTok: number = 0,
    cachedTok: number = 0
  ) => {
    const clean = cleanModelName(rawModel) || rawModel || 'ai-model';
    if (!byModel[clean]) {
      byModel[clean] = {
        model: clean,
        displayName: clean,
        tokens: 0,
        promptTokens: 0,
        completionTokens: 0,
        reasoningTokens: 0,
        cachedTokens: 0,
        billedUSD: 0,
        wholesaleUSD: 0,
        profitUSD: 0,
        turns: 0,
      };
    }
    byModel[clean].tokens += tok;
    byModel[clean].promptTokens += pTok;
    byModel[clean].completionTokens += cTok;
    byModel[clean].reasoningTokens += rTok;
    byModel[clean].cachedTokens += cachedTok;
    byModel[clean].billedUSD += billed;
    byModel[clean].wholesaleUSD += wholesale;
    byModel[clean].profitUSD = Math.max(0, byModel[clean].billedUSD - byModel[clean].wholesaleUSD);
    byModel[clean].turns += 1;
  };

  if (events && events.length > 0) {
    hasServerTelemetry = true;
    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      const evBilled = ev.cost?.billedUSD ?? ev.cost?.totalUSD ?? 0;
      const evWholesale =
        ev.cost?.wholesaleTotalUSD ?? ev.cost?.wholesaleUSD ?? ev.cost?.billedUSD ?? 0;
      const evTokens = ev.usage?.totalTokens ?? 0;
      const evPrompt = ev.usage?.inputTokens ?? 0;
      const evComp = ev.usage?.outputTokens ?? 0;
      const evCached = ev.usage?.cachedTokens ?? 0;
      const evReasoning = ev.usage?.reasoningTokens ?? 0;

      billedUSD += evBilled;
      wholesaleUSD += evWholesale;
      totalTokens += evTokens;
      promptTokens += evPrompt;
      completionTokens += evComp;
      cachedTokens += evCached;
      reasoningTokens += evReasoning;
      turnCount += 1;

      // Extract tool calls from event
      if (Array.isArray((ev as any).toolCalls)) {
        for (const tc of (ev as any).toolCalls) {
          const tName = tc.name || tc.toolName || 'tool';
          const tCost = tc.costUSD ?? tc.cost ?? toolCosts?.[tName] ?? 0;
          const calls = tc.calls ?? tc.count ?? 1;
          recordToolUsage(tName, tCost, tc.latencyMs, calls);
        }
      } else if ((ev as any).metadata?.toolCalls && Array.isArray((ev as any).metadata.toolCalls)) {
        for (const tc of (ev as any).metadata.toolCalls) {
          const tName = tc.name || tc.toolName || 'tool';
          const tCost = tc.costUSD ?? tc.cost ?? toolCosts?.[tName] ?? 0;
          const calls = tc.calls ?? tc.count ?? 1;
          recordToolUsage(tName, tCost, tc.latencyMs, calls);
        }
      }

      const currentModel = ev.model || model;
      if (currentModel && !detectedModel) {
        detectedModel = currentModel;
      }

      recordModelUsage(
        currentModel,
        evTokens,
        evPrompt,
        evComp,
        evBilled,
        evWholesale,
        evReasoning,
        evCached
      );

      if (i === events.length - 1) {
        latestBilledUSD = evBilled;
        latestWholesaleUSD = evWholesale;
        latestTokens = evTokens;
        latestPromptTokens = evPrompt;
        latestCompletionTokens = evComp;
        latestModel = currentModel;
      }
    }
  }

  if (messages && messages.length > 0) {
    const telemetryEvents: Array<{ mIdx: number; event: any }> = [];

    for (let mIdx = 0; mIdx < messages.length; mIdx++) {
      const msg = messages[mIdx];
      let eventFound: any = null;

      // 1. AI SDK v4 Message Annotations
      if (Array.isArray(msg.annotations)) {
        for (const ann of msg.annotations) {
          if (ann && (ann.cost || ann.usage || ann.vibez || ann.type === 'vibezcheck')) {
            eventFound = ann.vibez || ann;
            break;
          }
        }
      }

      // 2. AI SDK v5/v6/v7 Message Parts
      if (!eventFound && Array.isArray(msg.parts)) {
        for (const part of msg.parts) {
          if (part?.type === 'data-vibezcheck' && part.data) {
            eventFound = part.data;
            break;
          } else if (
            (part?.type === 'data' || part?.type === 'custom') &&
            (part.data?.vibez || part.data?.cost || part.data?.usage)
          ) {
            eventFound = part.data.vibez || part.data;
            break;
          } else if (part?.providerMetadata?.vibezcheck) {
            eventFound = part.providerMetadata.vibezcheck;
            break;
          }
        }
      }

      // 3. AI SDK v5/v6/v7 Message Metadata
      if (!eventFound && msg.metadata?.vibezcheck) {
        eventFound = msg.metadata.vibezcheck;
      } else if (!eventFound && msg.metadata && (msg.metadata.cost || msg.metadata.usage)) {
        eventFound = msg.metadata;
      }

      // 4. Direct Provider Metadata
      if (!eventFound && msg.providerMetadata?.vibezcheck) {
        eventFound = msg.providerMetadata.vibezcheck;
      }

      if (eventFound) {
        telemetryEvents.push({ mIdx, event: eventFound });
      }
    }

    if (telemetryEvents.length > 0) {

      hasServerTelemetry = true;
      let hasTelemetryToolCalls = false;

      for (const { event: eventFound } of telemetryEvents) {
        const costVal = eventFound.cost;
        let msgBilled = 0;
        let msgWholesale = 0;
        if (typeof costVal === 'number') {
          msgBilled = costVal;
          msgWholesale = costVal;
        } else if (costVal && typeof costVal === 'object') {
          msgBilled = costVal.billedUSD ?? costVal.totalUSD ?? costVal.costUSD ?? 0;
          msgWholesale =
            costVal.wholesaleUSD ??
            costVal.wholesaleTotalUSD ??
            costVal.billedUSD ??
            costVal.totalUSD ??
            0;
        } else if (typeof eventFound.costUSD === 'number') {
          msgBilled = eventFound.costUSD;
          msgWholesale = typeof eventFound.wholesaleUSD === 'number' ? eventFound.wholesaleUSD : eventFound.costUSD;
        }

        const msgTok = eventFound.usage?.totalTokens ?? eventFound.tokens ?? 0;
        const msgPrompt = eventFound.usage?.inputTokens ?? eventFound.promptTokens ?? 0;
        const msgComp = eventFound.usage?.outputTokens ?? eventFound.completionTokens ?? 0;
        const msgCached = eventFound.usage?.cachedTokens ?? eventFound.cachedTokens ?? 0;
        const msgReasoning = eventFound.usage?.reasoningTokens ?? eventFound.reasoningTokens ?? 0;
        const currentModel = eventFound.model || model;

        if (currentModel && !detectedModel) {
          detectedModel = currentModel;
        }

        billedUSD += msgBilled;
        wholesaleUSD += msgWholesale;
        totalTokens += msgTok;
        promptTokens += msgPrompt;
        completionTokens += msgComp;
        cachedTokens += msgCached;
        reasoningTokens += msgReasoning;
        turnCount += 1;

        // Check for server-tracked toolCalls in telemetry
        if (Array.isArray(eventFound.toolCalls) && eventFound.toolCalls.length > 0) {
          hasTelemetryToolCalls = true;
          for (const tc of eventFound.toolCalls) {
            const tName = tc.name || tc.toolName || 'tool';
            const tCost = tc.costUSD ?? tc.cost ?? toolCosts?.[tName] ?? 0;
            const calls = tc.calls ?? tc.count ?? 1;
            recordToolUsage(tName, tCost, tc.latencyMs, calls);
          }
        }

        recordModelUsage(
          currentModel,
          msgTok,
          msgPrompt,
          msgComp,
          msgBilled,
          msgWholesale,
          msgReasoning,
          msgCached
        );

        latestBilledUSD = msgBilled;
        latestWholesaleUSD = msgWholesale;
        latestTokens = msgTok;
        latestPromptTokens = msgPrompt;
        latestCompletionTokens = msgComp;
        latestModel = currentModel;
      }

      // If server telemetry did not include explicit toolCalls, extract from message parts
      if (!hasTelemetryToolCalls) {
        for (const msg of messages) {
          if (Array.isArray(msg.parts)) {
            for (const part of msg.parts) {
              if (part?.type === 'tool-call' || part?.type === 'tool-invocation') {
                const toolName = part.toolName || part.toolInvocation?.toolName || 'tool';
                const cost =
                  part.costUSD ??
                  part.cost ??
                  part.toolInvocation?.costUSD ??
                  part.toolInvocation?.cost ??
                  toolCosts?.[toolName] ??
                  0;
                const latency = part.latencyMs ?? part.toolInvocation?.latencyMs;
                recordToolUsage(toolName, cost, latency);
              }
            }
          }
        }
      }
    } else {
      // Local Zero-DB Dev Mode heuristic
      const activeRate = DEV_RATES[model] || DEV_RATES.default;
      const effectiveMargin = margin ?? 1.25;

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        // Extract tool calls from parts
        if (Array.isArray(msg.parts)) {
          for (const part of msg.parts) {
            if (part?.type === 'tool-call' || part?.type === 'tool-invocation') {
              const toolName = part.toolName || part.toolInvocation?.toolName || 'tool';
              const cost =
                part.costUSD ??
                part.cost ??
                part.toolInvocation?.costUSD ??
                part.toolInvocation?.cost ??
                toolCosts?.[toolName] ??
                0;
              const latency = part.latencyMs ?? part.toolInvocation?.latencyMs;
              recordToolUsage(toolName, cost, latency);
            }
          }
        }

        const text =
          typeof msg.content === 'string'
            ? msg.content
            : Array.isArray(msg.parts)
            ? msg.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('')
            : '';

        const charCount = text.length;
        const estimatedTokens = Math.max(1, Math.ceil(charCount / 3.8));

        totalTokens += estimatedTokens;

        if (msg.role === 'assistant') {
          completionTokens += estimatedTokens;
          turnCount += 1;
          const turnWholesale = (estimatedTokens / 1_000_000) * activeRate.output;
          const turnBilled = turnWholesale * effectiveMargin;
          wholesaleUSD += turnWholesale;
          billedUSD += turnBilled;

          recordModelUsage(model, estimatedTokens, 0, estimatedTokens, turnBilled, turnWholesale);

          latestBilledUSD = turnBilled;
          latestWholesaleUSD = turnWholesale;
          latestTokens = estimatedTokens;
          latestPromptTokens = 0;
          latestCompletionTokens = estimatedTokens;
          latestModel = model;
        } else {
          promptTokens += estimatedTokens;
          const turnWholesale = (estimatedTokens / 1_000_000) * activeRate.input;
          const turnBilled = turnWholesale * effectiveMargin;
          wholesaleUSD += turnWholesale;
          billedUSD += turnBilled;
        }
      }

      if (toolCostUSD > 0) {
        billedUSD = Number((billedUSD + toolCostUSD).toFixed(6));
        wholesaleUSD = Number((wholesaleUSD + toolCostUSD).toFixed(6));
      }
    }
  }

  const profitUSD = Math.max(0, billedUSD - wholesaleUSD);
  const marginPercent =
    wholesaleUSD > 0 ? Math.round(((billedUSD - wholesaleUSD) / wholesaleUSD) * 100) : 0;

  return {
    totalCostUSD: Number(billedUSD.toFixed(6)),
    wholesaleUSD: Number(wholesaleUSD.toFixed(6)),
    profitUSD: Number(profitUSD.toFixed(6)),
    marginPercent,
    totalTokens,
    promptTokens,
    completionTokens,
    cachedTokens,
    reasoningTokens,
    byModel,
    byTool,
    toolCostUSD: Number(toolCostUSD.toFixed(6)),
    toolCallCount,
    turnCount,
    activeModel: detectedModel || model,
    hasServerTelemetry,
    latestTurn: {
      model: latestModel || detectedModel || model,
      billedUSD: Number(latestBilledUSD.toFixed(6)),
      wholesaleUSD: Number(latestWholesaleUSD.toFixed(6)),
      tokens: latestTokens,
      promptTokens: latestPromptTokens,
      completionTokens: latestCompletionTokens,
    },
  };
}

/**
 * ✦ Modern Reactive Hook for Vercel AI SDK
 *
 * Pass `messages` from `useChat()` and get real-time aggregated costs,
 * token counts, profit margins, and multi-model breakdowns with zero props or providers.
 *
 * @example
 * ```tsx
 * const { messages } = useChat();
 * const { totalCostUSD, totalTokens, byModel } = useVibez(messages);
 * ```
 */
export function useVibez(
  messages?: any[],
  options: UseVibezOptions = {}
): UseVibezResult {
  return useMemo(
    () => extractSessionStats(messages, options),
    [
      messages,
      options.events,
      options.model,
      options.margin,
      options.toolCosts,
      options.totalCostUSD,
      options.totalTokens,
    ]
  );
}

// Aliases for developer convenience
export const useVibezSession = useVibez;
export const useVibezStats = useVibez;
