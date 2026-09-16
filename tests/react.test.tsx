import React from 'react';
import { renderToString } from 'react-dom/server';
import { useVibez, extractSessionStats, VibezCheck, VibezCheckHUD } from '../src/react';

describe('useVibez React Hook & Session Extraction Engine (v0.6.0)', () => {
  it('should initialize with zero totals when empty messages array is passed', () => {
    let stats: any = null;

    const TestComponent = () => {
      stats = useVibez([]);
      return <div>Test</div>;
    };

    renderToString(<TestComponent />);

    expect(stats).not.toBeNull();
    expect(stats.totalTokens).toBe(0);
    expect(stats.totalCostUSD).toBe(0);
    expect(stats.wholesaleUSD).toBe(0);
    expect(stats.profitUSD).toBe(0);
    expect(stats.hasServerTelemetry).toBe(false);
  });

  it('should reactively parse AI SDK messages with verified server telemetry', () => {
    const messages = [
      { role: 'user', content: 'What is photosynthesis?' },
      {
        role: 'assistant',
        content: 'Photosynthesis is the biological process...',
        parts: [
          { type: 'text', text: 'Photosynthesis is the biological process...' },
          {
            type: 'data-vibezcheck',
            data: {
              type: 'vibezcheck',
              model: 'gpt-4o',
              cost: { billedUSD: 0.0015, wholesaleUSD: 0.0010 },
              usage: { totalTokens: 150, inputTokens: 50, outputTokens: 100 },
            },
          },
        ],
      },
    ];

    let stats: any = null;
    const TestComponent = () => {
      stats = useVibez(messages);
      return null;
    };

    renderToString(<TestComponent />);

    expect(stats.totalTokens).toBe(150);
    expect(stats.promptTokens).toBe(50);
    expect(stats.completionTokens).toBe(100);
    expect(stats.totalCostUSD).toBe(0.0015);
    expect(stats.wholesaleUSD).toBe(0.001);
    expect(stats.profitUSD).toBe(0.0005);
    expect(stats.marginPercent).toBe(50);
    expect(stats.hasServerTelemetry).toBe(true);
    expect(stats.turnCount).toBe(1);
    expect(stats.byModel['gpt-4o']).toBeDefined();
    expect(stats.byModel['gpt-4o'].tokens).toBe(150);
  });

  it('should aggregate multi-model sessions across turns accurately', () => {
    const messages = [
      { role: 'user', content: 'Say hi' },
      {
        role: 'assistant',
        content: 'Hello!',
        annotations: [
          {
            type: 'vibezcheck',
            model: 'gpt-4o-mini',
            cost: { billedUSD: 0.0001, wholesaleUSD: 0.00008 },
            usage: { totalTokens: 30, inputTokens: 10, outputTokens: 20 },
          },
        ],
      },
      { role: 'user', content: 'Write a quick sort algorithm in Rust' },
      {
        role: 'assistant',
        content: 'fn quicksort(...)',
        parts: [
          { type: 'text', text: 'fn quicksort(...)' },
          {
            type: 'data-vibezcheck',
            data: {
              type: 'vibezcheck',
              model: 'claude-3-5-sonnet',
              cost: { billedUSD: 0.0050, wholesaleUSD: 0.0035 },
              usage: { totalTokens: 400, inputTokens: 100, outputTokens: 300 },
            },
          },
        ],
      },
    ];

    const stats = extractSessionStats(messages);

    expect(stats.totalTokens).toBe(430);
    expect(stats.totalCostUSD).toBe(0.0051);
    expect(stats.wholesaleUSD).toBe(0.00358);
    expect(stats.byModel['gpt-4o-mini'].tokens).toBe(30);
    expect(stats.byModel['claude-3-5-sonnet'].tokens).toBe(400);
    expect(stats.turnCount).toBe(2);
    expect(stats.latestTurn.model).toBe('claude-3-5-sonnet');
    expect(stats.latestTurn.tokens).toBe(400);
  });

  it('should provide offline fallback estimates in local zero-db dev mode', () => {
    const messages = [
      { role: 'user', content: 'Explain string theory.' },
      { role: 'assistant', content: 'String theory proposes that fundamental particles...' },
    ];

    const stats = extractSessionStats(messages, { model: 'gpt-4o', margin: 1.30 });

    expect(stats.hasServerTelemetry).toBe(false);
    expect(stats.totalTokens).toBeGreaterThan(0);
    expect(stats.totalCostUSD).toBeGreaterThan(0);
    expect(stats.wholesaleUSD).toBeGreaterThan(0);
    expect(stats.profitUSD).toBeGreaterThan(0);
  });

  it('should render <VibezCheck /> and <VibezCheckHUD /> as identical components', () => {
    expect(typeof VibezCheck).toBe('function');
    expect(typeof VibezCheckHUD).toBe('function');
    expect(VibezCheckHUD).toBe(VibezCheck);

    const html1 = renderToString(<VibezCheck messages={[]} />);
    const html2 = renderToString(<VibezCheckHUD messages={[]} />);
    expect(html1).toBe(html2);
    expect(html1).toContain('$0.00');
  });
});


