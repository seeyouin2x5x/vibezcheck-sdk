export interface ToolOptions {
  name: string;
  costUSD: number;
  tool?: any;
  execute?: (...args: any[]) => any;
}

/**
 * Wraps a Vercel AI SDK tool with usage and cost tracking
 */
export function wrapTool(options: ToolOptions): any {
  const { name, costUSD, tool, execute } = options;
  const targetFn = execute || tool?.execute;

  if (!targetFn && !tool) {
    return options;
  }

  const base = tool || {};

  return {
    ...base,
    name,
    costUSD,
    execute: async (...args: any[]) => {
      const startTime = performance.now();
      try {
        const result = await targetFn(...args);
        const latencyMs = Math.round(performance.now() - startTime);

        if (typeof (globalThis as any).__vibezCurrentSession?.trackTool === 'function') {
          await (globalThis as any).__vibezCurrentSession.trackTool(name, {
            costUSD,
            latencyMs,
            metadata: { args: args[0] },
          });
        }

        return result;
      } catch (error) {
        const latencyMs = Math.round(performance.now() - startTime);
        if (typeof (globalThis as any).__vibezCurrentSession?.trackTool === 'function') {
          await (globalThis as any).__vibezCurrentSession.trackTool(name, {
            costUSD,
            latencyMs,
            metadata: { error: String(error) },
          });
        }
        throw error;
      }
    },
  };
}

/**
 * Instruments an entire toolkit (e.g. StripeAgentToolkit) with cost and latency tracking
 */
export function instrumentToolKit(
  tools: Record<string, any>,
  options: { customer?: string; costPerActionUSD?: number } = {}
): Record<string, any> {
  const instrumented: Record<string, any> = {};
  const cost = options.costPerActionUSD ?? 0.005;

  for (const [toolName, toolDef] of Object.entries(tools)) {
    instrumented[toolName] = wrapTool({
      name: toolName,
      costUSD: cost,
      tool: toolDef,
    });
  }

  return instrumented;
}
