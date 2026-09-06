import type { CustomerParam, UsageEvent } from '../types';
import { VibezCircuitBreakerError } from '../types';
import { withBilling, type WithBillingOptions } from '../ai-sdk/with-billing';

export interface AgentSessionOptions {
  customer?: CustomerParam;
  maxCostUSD?: number;
  sessionBudgetUSD?: number;
  pricing?: WithBillingOptions['pricing'];
  billing?: WithBillingOptions['billing'];
  metadata?: Record<string, string | number | boolean>;
  onUsage?: (event: UsageEvent) => void | Promise<void>;
}

export interface ToolTrackingOptions {
  costUSD: number;
  latencyMs?: number;
  metadata?: any;
}

export class AgentSession {
  readonly sessionId: string;
  readonly customer?: CustomerParam;
  readonly maxCostUSD: number;

  private totalCostUSD: number = 0;
  private totalTokens: number = 0;
  private toolCalls: Array<{ name: string; costUSD: number; latencyMs?: number; metadata?: any }> = [];
  private options: AgentSessionOptions;

  constructor(options: AgentSessionOptions = {}) {
    this.sessionId = `vibez_sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.customer = options.customer;
    this.maxCostUSD = options.sessionBudgetUSD ?? options.maxCostUSD ?? 1.00;
    this.options = options;
  }

  /**
   * Returns an AI model instance bound to this agent session with cumulative budget enforcement
   */
  model<T extends object>(modelOrId: T, modelOptions: WithBillingOptions = {}): T {
    const session = this;

    return withBilling(modelOrId, {
      ...modelOptions,
      customer: this.customer,
      pricing: modelOptions.pricing || this.options.pricing,
      billing: modelOptions.billing || this.options.billing,
      onUsage: async (event: UsageEvent) => {
        const callCost = event.cost.retailUSD ?? event.cost.billedUSD ?? event.cost.totalUSD;
        session.totalCostUSD = Number((session.totalCostUSD + callCost).toFixed(8));
        session.totalTokens += event.usage.totalTokens;

        // Verify session-wide fuse box
        if (session.totalCostUSD > session.maxCostUSD) {
          throw new VibezCircuitBreakerError({
            reason: 'cost_per_call_exceeded',
            limit: session.maxCostUSD,
            current: session.totalCostUSD,
            model: event.model,
            customerId: event.customerId,
            message: `[vibezcheck] Agent Session Budget exceeded: Cumulative cost ($${session.totalCostUSD.toFixed(4)}) exceeded limit ($${session.maxCostUSD.toFixed(4)}).`,
          });
        }

        if (session.options.onUsage) {
          await session.options.onUsage(event);
        }
      },
    });
  }

  /**
   * Tracks an external tool invocation (e.g. web search, Python code sandbox, vector query, API call)
   */
  async trackTool<T = void>(
    toolName: string,
    costOrOptions: number | ToolTrackingOptions,
    fn?: () => Promise<T> | T
  ): Promise<T> {
    const costUSD = typeof costOrOptions === 'number' ? costOrOptions : costOrOptions.costUSD;
    const latencyMs = typeof costOrOptions === 'object' ? costOrOptions.latencyMs : undefined;
    const metadata = typeof costOrOptions === 'object' ? costOrOptions.metadata : undefined;

    // Verify session-wide budget before executing tool
    if (this.totalCostUSD + costUSD > this.maxCostUSD) {
      throw new VibezCircuitBreakerError({
        reason: 'cost_per_call_exceeded',
        limit: this.maxCostUSD,
        current: this.totalCostUSD + costUSD,
        model: `tool:${toolName}`,
        message: `[vibezcheck] Agent Session Budget exceeded on tool '${toolName}': ($${(this.totalCostUSD + costUSD).toFixed(4)}) exceeded limit ($${this.maxCostUSD.toFixed(4)}).`,
      });
    }

    let result: any = undefined;
    const start = performance.now();
    if (fn) {
      result = await fn();
    }
    const elapsed = latencyMs ?? Math.round(performance.now() - start);

    this.totalCostUSD = Number((this.totalCostUSD + costUSD).toFixed(8));
    this.toolCalls.push({
      name: toolName,
      costUSD,
      latencyMs: elapsed,
      metadata,
    });

    return result as T;
  }

  getCurrentCostUSD(): number {
    return this.totalCostUSD;
  }

  getTotalTokens(): number {
    return this.totalTokens;
  }

  /**
   * Concludes session and returns final financial summary
   */
  async conclude() {
    return this.getSummary();
  }

  /**
   * Returns current session summary
   */
  getSummary() {
    return {
      sessionId: this.sessionId,
      customer: this.customer,
      totalCostUSD: this.totalCostUSD,
      totalTokens: this.totalTokens,
      toolCallCount: this.toolCalls.length,
      toolCalls: [...this.toolCalls],
    };
  }
}

export function createAgentSession(options: AgentSessionOptions = {}): AgentSession {
  return new AgentSession(options);
}
