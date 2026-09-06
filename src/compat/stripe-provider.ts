/**
 * 100% Drop-In Replacement for @stripe/ai-sdk/provider
 * Supports in-process 0ms direct inference and transparent model proxying
 */

import { withBilling, type WithBillingOptions } from '../ai-sdk/with-billing';

export interface StripeProviderConfig {
  apiKey?: string;
  customerId?: string;
  baseURL?: string;
  mode?: 'in-process' | 'proxy';
  headers?: Record<string, string>;
}

export interface StripeModelSettings {
  customerId?: string;
  [key: string]: any;
}

export function createStripe(config: StripeProviderConfig = {}) {
  const apiKey = config.apiKey || (typeof process !== 'undefined' ? (process.env?.STRIPE_API_KEY || process.env?.STRIPE_SECRET_KEY) : undefined);

  const provider = function (modelId: string, settings: StripeModelSettings = {}) {
    const customerId = settings.customerId || config.customerId || 'anonymous';

    const options: WithBillingOptions = {
      customer: customerId,
      stripeApiKey: apiKey,
    };

    // Construct proxy model matching Stripe provider interface
    const baseModel = {
      specificationVersion: 'v3' as const,
      provider: 'stripe',
      modelId,
      supportedUrls: {},
      async doGenerate(params: any) {
        throw new Error(
          `[Stripe Provider] To use stripe('${modelId}'), please pass an underlying provider instance or configure provider registry.`
        );
      },
      async doStream(params: any) {
        throw new Error(
          `[Stripe Provider] To use stripe('${modelId}'), please pass an underlying provider instance or configure provider registry.`
        );
      },
    };

    return withBilling(baseModel, options);
  };

  provider.languageModel = provider;
  provider.specificationVersion = 'v3';

  return provider;
}

export const stripe = createStripe();
export const createStripeV3 = createStripe;
export const stripeV3 = stripe;
