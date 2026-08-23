import {
  extractOpenAIResponseUsage,
  extractAnthropicResponseUsage,
  extractGeminiResponseUsage,
  extractGenericResponseUsage,
  detectAndExtractUsage,
} from '../src/meter/extractors';

describe('Token Extractors', () => {
  it('should extract OpenAI ChatCompletion with reasoning tokens', () => {
    const mockOpenAIResponse = {
      id: 'chatcmpl-123',
      object: 'chat.completion',
      model: 'o3-mini',
      choices: [{ message: { role: 'assistant', content: 'Here is the proof.' } }],
      usage: {
        prompt_tokens: 500,
        completion_tokens: 1200,
        total_tokens: 1700,
        completion_tokens_details: {
          reasoning_tokens: 900,
        },
        prompt_tokens_details: {
          cached_tokens: 200,
        },
      },
    };

    const extracted = extractOpenAIResponseUsage(mockOpenAIResponse);
    expect(extracted).not.toBeNull();
    expect(extracted?.model).toBe('o3-mini');
    expect(extracted?.provider).toBe('openai');
    expect(extracted?.usage.inputTokens).toBe(500);
    expect(extracted?.usage.outputTokens).toBe(1200);
    expect(extracted?.usage.reasoningTokens).toBe(900);
    expect(extracted?.usage.visibleOutputTokens).toBe(300);
    expect(extracted?.usage.cachedTokens).toBe(200);
  });

  it('should extract Anthropic Message response with cache tokens', () => {
    const mockAnthropicResponse = {
      id: 'msg_123',
      type: 'message',
      model: 'claude-3-7-sonnet-20250219',
      role: 'assistant',
      content: [{ type: 'text', text: 'Hello!' }],
      usage: {
        input_tokens: 450,
        output_tokens: 120,
        cache_read_input_tokens: 300,
        cache_creation_input_tokens: 50,
      },
    };

    const extracted = extractAnthropicResponseUsage(mockAnthropicResponse);
    expect(extracted).not.toBeNull();
    expect(extracted?.provider).toBe('anthropic');
    expect(extracted?.usage.inputTokens).toBe(450);
    expect(extracted?.usage.outputTokens).toBe(120);
    expect(extracted?.usage.cachedTokens).toBe(300);
    expect(extracted?.usage.cacheWriteTokens).toBe(50);
  });

  it('should extract Google Gemini response with thoughtsTokenCount', () => {
    const mockGeminiResponse = {
      model: 'gemini-3.7-flash',
      response: {
        candidates: [{ content: { parts: [{ text: 'Calculated.' }] } }],
        usageMetadata: {
          promptTokenCount: 300,
          candidatesTokenCount: 150,
          thoughtsTokenCount: 800,
          totalTokenCount: 1250,
        },
      },
    };

    const extracted = extractGeminiResponseUsage(mockGeminiResponse);
    expect(extracted).not.toBeNull();
    expect(extracted?.provider).toBe('google');
    expect(extracted?.usage.inputTokens).toBe(300);
    expect(extracted?.usage.outputTokens).toBe(950); // 150 base + 800 thoughts
    expect(extracted?.usage.reasoningTokens).toBe(800);
    expect(extracted?.usage.visibleOutputTokens).toBe(150);
  });

  it('should auto-detect response types polymorphically', () => {
    const mockGeneric = {
      model: 'deepseek-v4-pro',
      provider: 'deepseek',
      usage: {
        prompt_tokens: 100,
        completion_tokens: 200,
        reasoning_tokens: 150,
      },
    };

    const extracted = detectAndExtractUsage(mockGeneric);
    expect(extracted).not.toBeNull();
    expect(extracted?.model).toBe('deepseek-v4-pro');
    expect(extracted?.usage.totalTokens).toBe(300);
    expect(extracted?.usage.reasoningTokens).toBe(150);
  });
});
