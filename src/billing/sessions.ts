import Stripe from 'stripe';

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export interface CreateCheckoutSessionParams {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  returnUrl: string;
  mode?: 'subscription' | 'payment';
  metadata?: Record<string, string>;
}

export interface CreateTopUpSessionParams {
  customerId: string;
  amountCents: number;
  returnUrl: string;
  currency?: string;
}

export class BillingHelper {
  private stripe: Stripe;

  constructor(options: { apiKey?: string; stripe?: Stripe } = {}) {
    if (options.stripe) {
      this.stripe = options.stripe;
    } else {
      const apiKey = options.apiKey || process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new Error('[vibezcheck] Stripe API key required for billing operations.');
      }
      this.stripe = new Stripe(apiKey);
    }
  }

  /**
   * Creates a Stripe Customer Portal session URL where users can manage cards, view usage & invoices
   */
  public async createPortalSession(params: CreatePortalSessionParams): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
    return session.url;
  }

  /**
   * Creates a Stripe Checkout session to subscribe a customer to a metered pricing tier
   */
  public async createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      customer_email: !params.customerId ? params.customerEmail : undefined,
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      mode: params.mode || 'subscription',
      success_url: `${params.returnUrl}?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${params.returnUrl}?status=cancelled`,
      metadata: params.metadata,
    });

    if (!session.url) {
      throw new Error('[vibezcheck] Failed to generate checkout session URL.');
    }

    return session.url;
  }

  /**
   * Creates a Checkout session for topping up prepaid credit wallet balance
   */
  public async createTopUpSession(params: CreateTopUpSessionParams): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      line_items: [
        {
          price_data: {
            currency: params.currency || 'usd',
            unit_amount: params.amountCents,
            product_data: {
              name: 'AI Token Credits Top-Up',
              description: `Add $${(params.amountCents / 100).toFixed(2)} in AI inference credits`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${params.returnUrl}?status=success&amount=${params.amountCents}`,
      cancel_url: `${params.returnUrl}?status=cancelled`,
      metadata: {
        type: 'vibezcheck_topup',
        customerId: params.customerId,
        amountCents: params.amountCents.toString(),
      },
    });

    if (!session.url) {
      throw new Error('[vibezcheck] Failed to generate top-up checkout URL.');
    }

    return session.url;
  }
}

/**
 * Factory to create BillingHelper
 */
export function createBillingHelper(options: { apiKey?: string; stripe?: Stripe } = {}): BillingHelper {
  return new BillingHelper(options);
}
