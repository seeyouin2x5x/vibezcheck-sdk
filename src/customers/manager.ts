import Stripe from 'stripe';
import { CustomerCache } from './cache';

export interface GetOrCreateCustomerParams {
  userId: string;
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface CustomerManagerOptions {
  apiKey?: string;
  stripe?: Stripe;
  cacheTtlMs?: number;
}

export class CustomerManager {
  private stripe: Stripe;
  private cache: CustomerCache;

  constructor(options: CustomerManagerOptions = {}) {
    if (options.stripe) {
      this.stripe = options.stripe;
    } else {
      const apiKey = options.apiKey || process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        throw new Error('[vibezcheck] Stripe API key required for customer management.');
      }
      this.stripe = new Stripe(apiKey);
    }

    this.cache = new CustomerCache(options.cacheTtlMs);
  }

  /**
   * Retrieves existing Stripe Customer or automatically provisions a new one
   */
  public async getOrCreate(
    params: GetOrCreateCustomerParams
  ): Promise<{ id: string; isNew: boolean; customer: Stripe.Customer }> {
    const cacheKey = params.userId || params.email;
    if (cacheKey) {
      const cachedId = this.cache.get(cacheKey);
      if (cachedId) {
        return {
          id: cachedId,
          isNew: false,
          customer: { id: cachedId } as Stripe.Customer,
        };
      }
    }

    // 1. Search by userId in Stripe metadata
    if (params.userId) {
      try {
        const searchResult = await this.stripe.customers.search({
          query: `metadata['vibez_user_id']:'${params.userId}'`,
          limit: 1,
        });

        if (searchResult.data.length > 0) {
          const customer = searchResult.data[0];
          if (cacheKey) this.cache.set(cacheKey, customer.id);
          if (params.email) this.cache.set(params.email, customer.id);
          return { id: customer.id, isNew: false, customer };
        }
      } catch {
        // Fallback to email search if search query is unsupported or errors
      }
    }

    // 2. Search by email if provided
    if (params.email) {
      const listResult = await this.stripe.customers.list({
        email: params.email,
        limit: 1,
      });

      if (listResult.data.length > 0) {
        const customer = listResult.data[0];
        if (cacheKey) this.cache.set(cacheKey, customer.id);
        if (params.userId) this.cache.set(params.userId, customer.id);
        return { id: customer.id, isNew: false, customer };
      }
    }

    // 3. Create new Customer in Stripe
    const newCustomer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        vibez_user_id: params.userId,
        created_by: 'vibezcheck',
        ...(params.metadata || {}),
      },
    });

    if (cacheKey) this.cache.set(cacheKey, newCustomer.id);
    if (params.userId) this.cache.set(params.userId, newCustomer.id);
    if (params.email) this.cache.set(params.email, newCustomer.id);

    return { id: newCustomer.id, isNew: true, customer: newCustomer };
  }

  /**
   * Clears in-memory resolution cache
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Factory to create CustomerManager
 */
export function createCustomerManager(options: CustomerManagerOptions = {}): CustomerManager {
  return new CustomerManager(options);
}
