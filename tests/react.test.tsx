import React from 'react';
import { renderToString } from 'react-dom/server';
import { VibezSessionProvider, useVibezSession, VibezSessionBadge } from '../src/react';

describe('VibezSession React Context & Hooks', () => {
  it('should initialize with empty in-memory session state', () => {
    let capturedCtx: any = null;

    const TestComponent = () => {
      capturedCtx = useVibezSession();
      return <div>Test</div>;
    };

    renderToString(
      <VibezSessionProvider sessionId="test_sess_1">
        <TestComponent />
      </VibezSessionProvider>
    );

    expect(capturedCtx).not.toBeNull();
    expect(capturedCtx.sessionId).toBe('test_sess_1');
    expect(capturedCtx.turnCount).toBe(0);
    expect(capturedCtx.sessionUsage.totalTokens).toBe(0);
    expect(capturedCtx.sessionCost.totalUSD).toBe(0);
  });

  it('should record turns and calculate multi-turn usage and costs', () => {
    let capturedCtx: any = null;

    const TestComponent = () => {
      capturedCtx = useVibezSession();
      return null;
    };

    renderToString(
      <VibezSessionProvider>
        <TestComponent />
      </VibezSessionProvider>
    );

    // Turn 1: GPT-5.6 Sol (1000 input, 500 output, 300 reasoning)
    const turn1 = capturedCtx.recordTurn({
      model: 'gpt-5.6-sol',
      usage: {
        promptTokens: 1000,
        completionTokens: 500,
        reasoningTokens: 300,
      },
    });

    expect(turn1.usage.inputTokens).toBe(1000);
    expect(turn1.usage.outputTokens).toBe(500);
    expect(turn1.usage.reasoningTokens).toBe(300);
    expect(turn1.cost.totalUSD).toBeGreaterThan(0);

    // Turn 2: Claude 3.7 Sonnet (2000 input, 800 output, 400 thinking)
    const turn2 = capturedCtx.recordTurn({
      model: 'claude-3-7-sonnet',
      usage: {
        inputTokens: 2000,
        outputTokens: 800,
        reasoningTokens: 400,
      },
    });

    expect(turn2.usage.inputTokens).toBe(2000);
    expect(turn2.usage.outputTokens).toBe(800);
    expect(turn2.usage.reasoningTokens).toBe(400);
    expect(turn2.cost.totalUSD).toBeGreaterThan(0);
  });

  it('should support custom storage adapters for persistence', () => {
    const mockStorageMap = new Map<string, string>();
    const mockStorage = {
      getItem: (key: string) => mockStorageMap.get(key) || null,
      setItem: (key: string, val: string) => {
        mockStorageMap.set(key, val);
      },
      removeItem: (key: string) => {
        mockStorageMap.delete(key);
      },
    };

    let capturedCtx: any = null;
    const TestComponent = () => {
      capturedCtx = useVibezSession();
      return null;
    };

    renderToString(
      <VibezSessionProvider
        sessionId="persisted_session_1"
        persist="custom"
        storage={mockStorage}
      >
        <TestComponent />
      </VibezSessionProvider>
    );

    capturedCtx.recordTurn({
      model: 'gpt-4o',
      usage: { promptTokens: 100, completionTokens: 200 },
    });

    // Check custom storage received updated JSON
    const stored = mockStorageMap.get('vibez_session_persisted_session_1');
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed.turnCount).toBe(1);
    expect(parsed.sessionUsage.totalTokens).toBe(300);
  });

  it('should render VibezSessionBadge markup cleanly', () => {
    const html = renderToString(
      <VibezSessionProvider>
        <VibezSessionBadge showTokens showCost />
      </VibezSessionProvider>
    );

    expect(html).toContain('⚡');
    expect(html).toContain('tok');
    expect(html).toContain('0.0000');
  });
});
