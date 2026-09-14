import type { CustomerParam } from '../types';
import { createAgentSession, type AgentSession } from './session';
import { isBudgetExceeded } from './stop-condition';
import { createTools } from './tools';

export interface VibezAgentOptions<TOOLS extends Record<string, any> = Record<string, any>> {
  /** The language model instance (e.g. openai('gpt-4o-mini') or anthropic('claude-3-5-sonnet')) */
  model: any;
  /** Optional dictionary of AI SDK tools */
  tools?: TOOLS;
  /** System instructions / prompt */
  instructions?: string;
  /** Hard cumulative budget limit in USD before halting execution (default: 0.50) */
  budget?: number;
  /** Customer email, user ID, or rich customer object */
  customer?: CustomerParam;
  /** Developer profit margin multiplier (default: 1.25 for +25% margin) */
  margin?: number;
  /** Pricing configuration overrides */
  pricing?: {
    margin?: number;
    minimumChargeUSD?: number;
  };
  /** Explicit per-tool cost mapping in USD */
  toolCosts?: Record<string, number>;
  /** Default fallback cost per tool execution in USD (default: 0.005) */
  defaultToolCostUSD?: number;
}

export interface VibezAgentResult<TOOLS extends Record<string, any>> {
  /** The model instance bound to this agent session */
  model: any;
  /** The wrapped tools dictionary with budget enforcement */
  tools: TOOLS;
  /** Native AI SDK StopCondition predicate for stopWhen */
  stopWhen: ReturnType<typeof isBudgetExceeded>;
  /** Underlying AgentSession tracking cumulative spend */
  session: AgentSession;
  /** Concludes session and returns financial breakdown */
  getSummary: () => ReturnType<AgentSession['getSummary']>;
  /** Generates text output using the agent */
  generate: (params: { prompt?: string; messages?: any[]; [key: string]: any }) => Promise<any>;
  /** Streams text output using the agent */
  stream: (params: { prompt?: string; messages?: any[]; [key: string]: any }) => Promise<any>;
}

/**
 * Creates a complete, 1-line agent environment binding model, tools, and loop budget
 * into an isolated financial envelope.
 *
 * @example
 * ```typescript
 * const { model, tools, stopWhen } = vibezcheck.agent({
 *   model: openai('gpt-4o-mini'),
 *   tools: { searchWeb, runPython },
 *   budget: 0.25,
 * });
 *
 * const result = await generateText({ model, tools, stopWhen, prompt });
 * ```
 */
export function createAgent<TOOLS extends Record<string, any> = Record<string, any>>(
  options: VibezAgentOptions<TOOLS>
): VibezAgentResult<TOOLS> {
  const budget = options.budget ?? 0.50;
  const margin = options.margin ?? options.pricing?.margin ?? 1.25;

  // 1. Create scoped AgentSession
  const session = createAgentSession({
    customer: options.customer,
    sessionBudgetUSD: budget,
    pricing: { margin },
  });

  // 2. Bind model to session
  const boundModel = session.model(options.model, {
    pricing: { margin },
  });

  // 3. Wrap tools
  const rawTools = options.tools || ({} as TOOLS);
  const boundTools = createTools(rawTools, {
    session,
    costs: options.toolCosts,
    costPerActionUSD: options.defaultToolCostUSD ?? 0.005,
  });

  // 4. Create native stopCondition
  const stopCondition = isBudgetExceeded(budget, {
    margin,
    toolCosts: options.toolCosts,
    defaultToolCostUSD: options.defaultToolCostUSD,
  });

  return {
    model: boundModel,
    tools: boundTools,
    stopWhen: stopCondition,
    session,
    getSummary: () => session.getSummary(),
    generate: async (params) => {
      const { generateText } = await import('ai');
      return generateText({
        model: boundModel,
        tools: boundTools,
        stopWhen: stopCondition,
        system: options.instructions,
        ...(params as any),
      });
    },
    stream: async (params) => {
      const { streamText } = await import('ai');
      return streamText({
        model: boundModel,
        tools: boundTools,
        stopWhen: stopCondition,
        system: options.instructions,
        ...(params as any),
      });
    },
  };
}
