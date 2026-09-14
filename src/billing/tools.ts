import type { AgentSession } from './session';

export interface ToolOptions {
  name?: string;
  costUSD: number;
  tool?: any;
  execute?: (...args: any[]) => any;
  session?: AgentSession;
  onExecute?: (info: {
    name: string;
    costUSD: number;
    latencyMs: number;
    args: any;
    result?: any;
    error?: any;
  }) => void | Promise<void>;
}

/**
 * Wraps a Vercel AI SDK tool or custom function with cost and latency tracking
 */
export function wrapTool<T = any>(options: ToolOptions): T {
  const { name = 'tool', costUSD, tool, execute, session, onExecute } = options;
  const targetFn = execute || tool?.execute;

  if (!targetFn && !tool) {
    return options as any;
  }

  const base = tool || {};

  return {
    ...base,
    name,
    costUSD,
    execute: async (...args: any[]) => {
      const startTime = performance.now();
      try {
        let result: any;
        if (session && typeof session.trackTool === 'function') {
          result = await session.trackTool(name, { costUSD }, () => targetFn(...args));
        } else {
          result = await targetFn(...args);
        }
        const latencyMs = Math.round(performance.now() - startTime);

        if (onExecute) {
          await onExecute({ name, costUSD, latencyMs, args: args[0], result });
        }

        return result;
      } catch (error) {
        const latencyMs = Math.round(performance.now() - startTime);
        if (onExecute) {
          await onExecute({ name, costUSD, latencyMs, args: args[0], error });
        }
        throw error;
      }
    },
  } as any;
}

/**
 * Instruments an entire toolkit (e.g. StripeAgentToolkit) with cost and latency tracking
 */
export function instrumentToolKit<T extends Record<string, any>>(
  tools: T,
  options: {
    customer?: string;
    costPerActionUSD?: number;
    session?: AgentSession;
    costs?: Record<string, number>;
  } = {}
): { [K in keyof T]: T[K] & { costUSD: number } } {
  const instrumented: Record<string, any> = {};
  const cost = options.costPerActionUSD ?? 0.005;

  for (const [toolName, toolDef] of Object.entries(tools)) {
    const actionCost = options.costs?.[toolName] ?? cost;
    instrumented[toolName] = wrapTool({
      name: toolName,
      costUSD: actionCost,
      tool: toolDef,
      session: options.session,
    });
  }

  return instrumented as { [K in keyof T]: T[K] & { costUSD: number } };
}


