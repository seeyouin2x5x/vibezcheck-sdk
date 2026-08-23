import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'meter/index': 'src/meter/index.ts',
    'pricing/index': 'src/pricing/index.ts',
    'ai-sdk/index': 'src/ai-sdk/index.ts',
    'customers/index': 'src/customers/index.ts',
    'auth/index': 'src/auth/index.ts',
    'billing/index': 'src/billing/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  external: [
    'stripe',
    'openai',
    '@anthropic-ai/sdk',
    '@google/generative-ai',
    'ai',
    '@ai-sdk/provider',
  ],
});
