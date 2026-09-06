/**
 * 100% Drop-In Replacement for @stripe/ai-sdk/meter
 * Seamlessly supports LanguageModel V1, V2, V3, V4, and V5+
 */

import { withBilling, type WithBillingOptions } from '../ai-sdk/with-billing';

export interface AIMeterConfig {
  stripeApiKey: string;
  stripeCustomerId: string;
}

/**
 * Wraps a Vercel AI SDK language model to automatically report usage to Stripe meter events.
 * Enhanced to support all specification versions (V1, V2, V3, V4, V5+) without runtime errors.
 */
export function meteredModel<T extends object>(
  model: T,
  stripeApiKey: string,
  stripeCustomerId: string,
  additionalOptions: WithBillingOptions = {}
): T {
  if (!model || typeof model !== 'object') {
    throw new Error('[vibezcheck / Stripe AI] Invalid model provided to meteredModel().');
  }

  // Set Stripe API Key in environment if not present
  if (typeof process !== 'undefined' && stripeApiKey && !process.env.STRIPE_API_KEY && !process.env.STRIPE_SECRET_KEY) {
    process.env.STRIPE_API_KEY = stripeApiKey;
  }

  const options: WithBillingOptions = {
    ...additionalOptions,
    customer: stripeCustomerId,
    stripeApiKey,
  };

  return withBilling(model, options);
}

export default meteredModel;
