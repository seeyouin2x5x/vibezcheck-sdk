import { withBilling, type WithBillingOptions } from './with-billing';

/**
 * VibezCheck Middleware for Vercel AI SDK wrapLanguageModel({ model, middleware })
 */
export function vibezcheckMiddleware(options: WithBillingOptions = {}) {
  return {
    specificationVersion: 'v1' as const,

    wrapGenerate: async ({ doGenerate, params, model }: any) => {
      const target = { ...model, doGenerate };
      const metered = withBilling(target, options);
      return (metered as any).doGenerate(params);
    },

    wrapStream: async ({ doStream, params, model }: any) => {
      const target = { ...model, doStream };
      const metered = withBilling(target, options);
      return (metered as any).doStream(params);
    },
  };
}

export default vibezcheckMiddleware;
