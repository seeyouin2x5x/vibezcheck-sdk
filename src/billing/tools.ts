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
 * Wraps a Vercel AI SDK tool or custom function with cost and latency tracking.
 * Supports both options object: wrapTool({ tool, costUSD })
 * and direct tool + cost: wrapTool(myTool, 0.01)
 */
export function wrapTool<T = any>(
  toolOrOptions: any,
  costOrOptions?: number | Partial<ToolOptions>
): T {
  let options: ToolOptions;

  if (typeof costOrOptions === 'number') {
    options = {
      tool: toolOrOptions,
      costUSD: costOrOptions,
      name: toolOrOptions?.name,
    };
  } else if (costOrOptions && typeof costOrOptions === 'object') {
    options = {
      tool: toolOrOptions,
      costUSD: costOrOptions.costUSD ?? 0.005,
      ...costOrOptions,
    };
  } else if (toolOrOptions && typeof toolOrOptions === 'object' && 'costUSD' in toolOrOptions) {
    options = toolOrOptions as ToolOptions;
  } else {
    options = {
      tool: toolOrOptions,
      costUSD: 0.005,
      name: toolOrOptions?.name,
    };
  }

  const { name = options.tool?.name || 'tool', costUSD, tool, execute, session, onExecute } = options;
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
 * Instruments an entire toolkit (e.g. agent toolkit or tools record) with cost and latency tracking
 */
export function instrumentToolKit<T extends Record<string, any>>(
  tools: T,
  options:
    | {
        customer?: string;
        costPerActionUSD?: number;
        session?: AgentSession;
        costs?: Record<string, number>;
      }
    | Record<string, { costUSD: number } | number | any> = {}
): { [K in keyof T]: T[K] & { costUSD: number } } {
  const instrumented: Record<string, any> = {};
  const cost = (options as any).costPerActionUSD ?? 0.005;

  for (const [toolName, toolDef] of Object.entries(tools)) {
    let actionCost = cost;
    if (options && 'costs' in options && (options as any).costs?.[toolName] !== undefined) {
      actionCost = (options as any).costs[toolName];
    } else if (options && toolName in options) {
      const val = (options as any)[toolName];
      actionCost = typeof val === 'number' ? val : (val?.costUSD ?? cost);
    }
    instrumented[toolName] = wrapTool({
      name: toolName,
      costUSD: actionCost,
      tool: toolDef,
      session: (options as any).session,
    });
  }

  return instrumented as { [K in keyof T]: T[K] & { costUSD: number } };
}

/**
 * Declarative alias for instrumentToolKit
 */
export const createTools = instrumentToolKit;
