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
  arg2?: string | WithBillingOptions,
  arg3?: string | WithBillingOptions,
  arg4?: WithBillingOptions
): T {
  if (!model || typeof model !== 'object') {
    throw new Error('[vibezcheck / Stripe AI] Invalid model provided to meteredModel().');
  }

  let stripeApiKey: string | undefined;
  let stripeCustomerId: string | undefined;
  let options: WithBillingOptions = {};

  if (typeof arg2 === 'object' && arg2 !== null) {
    // meteredModel(model, options)
    options = { ...arg2 };
    stripeCustomerId = options.customerId || (typeof options.customer === 'string' ? options.customer : options.customer?.id);
    stripeApiKey = options.stripeApiKey;
  } else if (typeof arg2 === 'string') {
    if (typeof arg3 === 'string') {
      // meteredModel(model, stripeApiKey, stripeCustomerId, options)
      stripeApiKey = arg2;
      stripeCustomerId = arg3;
      options = { ...(arg4 || {}) };
    } else {
      // meteredModel(model, stripeCustomerId, options)
      stripeCustomerId = arg2;
      options = { ...(typeof arg3 === 'object' ? arg3 : {}) };
    }
  }

  stripeApiKey =
    stripeApiKey ||
    options.stripeApiKey ||
    (typeof process !== 'undefined' ? (process.env?.STRIPE_API_KEY || process.env?.STRIPE_SECRET_KEY) : undefined);

  if (typeof process !== 'undefined' && stripeApiKey && !process.env.STRIPE_API_KEY && !process.env.STRIPE_SECRET_KEY) {
    process.env.STRIPE_API_KEY = stripeApiKey;
  }

  const mergedOptions: WithBillingOptions = {
    ...options,
    customer: stripeCustomerId || options.customer,
    customerId: stripeCustomerId,
    stripeApiKey,
  };

  return withBilling(model, mergedOptions);
}

export default meteredModel;
