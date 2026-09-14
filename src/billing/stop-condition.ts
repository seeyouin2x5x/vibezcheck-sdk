import { calculateCost } from '../pricing/calculator';

export interface BudgetExceededDetails {
  currentCostUSD: number;
  budgetUSD: number;
  stepCount: number;
  steps: Array<any>;
}

export interface IsBudgetExceededOptions {
  /** Target model for token pricing fallback if step does not specify modelId (default: 'gpt-4o-mini') */
  model?: string;
  /** Developer profit margin multiplier (default: 1.0) */
  margin?: number;
  /** Explicit per-tool cost mapping in USD */
  toolCosts?: Record<string, number>;
  /** Fallback cost in USD per tool execution if not listed in toolCosts (default: 0.005) */
  defaultToolCostUSD?: number;
  /** Optional callback fired when budget ceiling is met or exceeded */
  onBudgetExceeded?: (details: BudgetExceededDetails) => void | Promise<void>;
}

/**
 * Creates a native Vercel AI SDK stopCondition predicate that halts multi-step tool loops
 * gracefully as soon as cumulative token and tool costs cross maxBudgetUSD.
 *
 * Direct drop-in for streamText({ stopWhen }), generateText({ stopWhen }), and ToolLoopAgent.
 *
 * @param maxBudgetUSD Cumulative dollar ceiling before halting execution
 * @param options Optional model, margin, and tool cost overrides
 */
export function isBudgetExceeded(
  maxBudgetUSD: number,
  options: IsBudgetExceededOptions = {}
) {
  const {
    model: defaultModel = 'gpt-4o-mini',
    margin = 1.0,
    toolCosts = {},
    defaultToolCostUSD = 0.005,
    onBudgetExceeded,
  } = options;

  return async ({ steps }: { steps: Array<any> }): Promise<boolean> => {
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      return false;
    }

    let totalCostUSD = 0;

    for (const step of steps) {
      // 1. Determine model for this step
      const stepModel =
        step.response?.modelId ||
        step.modelId ||
        step.request?.modelId ||
        defaultModel;

      // 2. Parse token usage (polymorphic across V1, V2, V3, V4)
      const usage = step.usage || {};
      let inputTokens = 0;
      let outputTokens = 0;
      let cachedTokens = 0;

      if (typeof usage.inputTokens === 'object' && usage.inputTokens !== null) {
        inputTokens = usage.inputTokens.total ?? 0;
        cachedTokens = usage.inputTokens.cacheRead ?? 0;
      } else if (typeof usage.inputTokens === 'number') {
        inputTokens = usage.inputTokens;
      } else if (typeof usage.promptTokens === 'number') {
        inputTokens = usage.promptTokens;
      }

      if (typeof usage.outputTokens === 'object' && usage.outputTokens !== null) {
        outputTokens = usage.outputTokens.total ?? 0;
      } else if (typeof usage.outputTokens === 'number') {
        outputTokens = usage.outputTokens;
      } else if (typeof usage.completionTokens === 'number') {
        outputTokens = usage.completionTokens;
      }

      if (cachedTokens === 0 && usage.promptTokensDetails?.cachedTokens) {
        cachedTokens = usage.promptTokensDetails.cachedTokens;
      }

      // Calculate step token cost
      if (inputTokens > 0 || outputTokens > 0) {
        const costResult = calculateCost({
          model: stepModel,
          inputTokens,
          outputTokens,
          cachedTokens,
          markupMultiplier: margin,
        });
        totalCostUSD += costResult.billedUSD ?? costResult.totalUSD;
      }

      // 3. Parse tool calls in this step
      const toolCalls = step.toolCalls || step.staticToolCalls || [];
      if (Array.isArray(toolCalls)) {
        for (const tc of toolCalls) {
          const toolName = tc.toolName || tc.name;
          const toolCost =
            tc.costUSD ??
            (toolName && toolCosts[toolName] !== undefined ? toolCosts[toolName] : defaultToolCostUSD);
          totalCostUSD += toolCost;
        }
      }
    }

    totalCostUSD = Number(totalCostUSD.toFixed(6));

    if (totalCostUSD >= maxBudgetUSD) {
      if (onBudgetExceeded) {
        await onBudgetExceeded({
          currentCostUSD: totalCostUSD,
          budgetUSD: maxBudgetUSD,
          stepCount: steps.length,
          steps,
        });
      }
      return true;
    }

    return false;
  };
}

export const stopWhenBudgetExceeded = isBudgetExceeded;
