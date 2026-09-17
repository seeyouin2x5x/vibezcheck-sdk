import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LLM Cost Calculator — Compare OpenAI, Anthropic, Gemini, DeepSeek | VibezCheck',
  description:
    'Interactive real-time LLM cost calculator. Estimate token and prompt caching costs for GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro, DeepSeek R1, and Grok with retail customer pricing markups.',
  alternates: {
    canonical: 'https://vibezcheck.app/llm-cost-calculator',
  },
  openGraph: {
    title: 'LLM Cost Calculator | VibezCheck',
    description:
      'Calculate real dollar cost for LLM calls with input, output, cached tokens, and retail margin markups.',
    url: 'https://vibezcheck.app/llm-cost-calculator',
  },
};

export default function LlmCostCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
