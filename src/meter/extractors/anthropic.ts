import type { TokenUsage } from '../../types';
import type { ExtractedUsage } from './openai';

/**
 * Extracts token usage from Anthropic synchronous responses
 */
export function extractAnthropicResponseUsage(response: any): ExtractedUsage | null {
  if (!response || typeof response !== 'object') return null;

  // Anthropic Message response has type: 'message' or role: 'assistant' with usage
  if (response.type === 'message' || ('content' in response && 'usage' in response)) {
    const rawUsage = response.usage || {};
    const model = response.model || 'claude-3-7-sonnet';

    const inputTokens = rawUsage.input_tokens ?? 0;
    const outputTokens = rawUsage.output_tokens ?? 0;
    const cachedTokens = rawUsage.cache_read_input_tokens ?? 0;
    const cacheWriteTokens = rawUsage.cache_creation_input_tokens ?? 0;

    // Check content blocks for thinking/reasoning tokens count or thinking blocks
    let reasoningTokens: number | undefined = undefined;
    if (Array.isArray(response.content)) {
      const thinkingBlocks = response.content.filter((b: any) => b.type === 'thinking');
      if (thinkingBlocks.length > 0) {
        // Approximate or extract explicit thinking tokens if present in metadata
        reasoningTokens = (rawUsage as any).thinking_tokens ?? undefined;
      }
    }

    return {
      model,
      provider: 'anthropic',
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        reasoningTokens,
        visibleOutputTokens:
          reasoningTokens !== undefined ? Math.max(0, outputTokens - reasoningTokens) : outputTokens,
        cachedTokens: cachedTokens > 0 ? cachedTokens : undefined,
        cacheWriteTokens: cacheWriteTokens > 0 ? cacheWriteTokens : undefined,
      },
    };
  }

  return null;
}

/**
 * Accumulates stream events across an Anthropic raw message stream
 */
export class AnthropicStreamAccumulator {
  private model: string = 'claude-3-7-sonnet';
  private inputTokens: number = 0;
  private outputTokens: number = 0;
  private cachedTokens: number = 0;
  private cacheWriteTokens: number = 0;
  private reasoningTokens: number = 0;

  processEvent(event: any): void {
    if (!event || typeof event !== 'object') return;

    // 1. message_start (contains model and initial input usage)
    if (event.type === 'message_start' && event.message) {
      if (event.message.model) {
        this.model = event.message.model;
      }
      if (event.message.usage) {
        this.inputTokens = event.message.usage.input_tokens ?? 0;
        this.cachedTokens = event.message.usage.cache_read_input_tokens ?? 0;
        this.cacheWriteTokens = event.message.usage.cache_creation_input_tokens ?? 0;
      }
    }

    // 2. message_delta (contains final output usage)
    if (event.type === 'message_delta' && event.usage) {
      this.outputTokens = event.usage.output_tokens ?? 0;
      if (event.usage.thinking_tokens) {
        this.reasoningTokens = event.usage.thinking_tokens;
      }
    }

    // 3. content_block_start / content_block_delta for thinking blocks
    if (event.type === 'content_block_start' && event.content_block?.type === 'thinking') {
      // thinking block detected
    }
  }

  getUsage(): ExtractedUsage {
    return {
      model: this.model,
      provider: 'anthropic',
      usage: {
        inputTokens: this.inputTokens,
        outputTokens: this.outputTokens,
        totalTokens: this.inputTokens + this.outputTokens,
        reasoningTokens: this.reasoningTokens > 0 ? this.reasoningTokens : undefined,
        visibleOutputTokens:
          this.reasoningTokens > 0
            ? Math.max(0, this.outputTokens - this.reasoningTokens)
            : this.outputTokens,
        cachedTokens: this.cachedTokens > 0 ? this.cachedTokens : undefined,
        cacheWriteTokens: this.cacheWriteTokens > 0 ? this.cacheWriteTokens : undefined,
      },
    };
  }
}
