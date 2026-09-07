/**
 * 100% Drop-In Replacement for @stripe/ai-sdk/provider
 * Supports in-process 0ms direct inference and transparent model proxying
 */

import { withBilling, type WithBillingOptions } from '../ai-sdk/with-billing';

import { createVibezModel } from '../ai-sdk/declarative';

export interface StripeProviderConfig {
  apiKey?: string;
  customerId?: string;
  baseURL?: string;
  mode?: 'in-process' | 'proxy';
  headers?: Record<string, string>;
}

export interface StripeModelSettings {
  customerId?: string;
  model?: any;
  [key: string]: any;
}

export function createStripe(config: StripeProviderConfig = {}) {
  const apiKey =
    config.apiKey ||
    (typeof process !== 'undefined' ? (process.env?.STRIPE_API_KEY || process.env?.STRIPE_SECRET_KEY) : undefined);

  const provider = function (modelId: string, settings: StripeModelSettings = {}) {
    const customerId = settings.customerId || config.customerId || 'anonymous';

    const options: WithBillingOptions = {
      customer: customerId,
      stripeApiKey: apiKey,
    };

    if (settings.model && typeof settings.model === 'object') {
      return withBilling(settings.model, options);
    }

    // Resolve model dynamically via universal declarative engine
    return createVibezModel(modelId, {
      ...settings,
      customer: customerId,
      stripeApiKey: apiKey,
      baseURL: config.baseURL,
    });
  };

  provider.languageModel = provider;
  provider.specificationVersion = 'v3';

  return provider;
}

export const stripe = createStripe();
export const createStripeV3 = createStripe;
export const stripeV3 = stripe;
