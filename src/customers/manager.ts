import Stripe from 'stripe';
import { CustomerCache } from './cache';

export interface GetOrCreateCustomerParams {
  userId?: string;
  email?: string;
  name?: string;
  phone?: string;
  orgId?: string;
  organizationId?: string;
  orgName?: string;
  teamId?: string;
  workspaceId?: string;
  role?: string;
  plan?: string;
  tier?: string;
  metadata?: Record<string, string | number | boolean | null>;
  [key: string]: any;
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
   * Retrieves existing Stripe Customer or automatically provisions a new one with full metadata
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

    // 3. Prepare rich metadata for Stripe Customer
    const orgId = params.orgId || params.organizationId;
    const teamId = params.teamId || params.workspaceId;

    const stripeMetadata: Record<string, string> = {
      vibez_user_id: params.userId || '',
      created_by: 'vibezcheck',
    };

    if (orgId) stripeMetadata.org_id = String(orgId);
    if (params.orgName) stripeMetadata.org_name = String(params.orgName);
    if (teamId) stripeMetadata.team_id = String(teamId);
    if (params.plan) stripeMetadata.plan = String(params.plan);
    if (params.tier) stripeMetadata.tier = String(params.tier);
    if (params.role) stripeMetadata.role = String(params.role);

    if (params.metadata) {
      for (const [k, v] of Object.entries(params.metadata)) {
        if (v !== undefined && v !== null) {
          stripeMetadata[k] = String(v);
        }
      }
    }

    // 4. Create new Customer in Stripe
    const newCustomer = await this.stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: stripeMetadata,
    });

    if (cacheKey) this.cache.set(cacheKey, newCustomer.id);
    if (params.userId) this.cache.set(params.userId, newCustomer.id);
    if (params.email) this.cache.set(params.email, newCustomer.id);

    return { id: newCustomer.id, isNew: true, customer: newCustomer };
  }

  /**
   * Updates an existing Stripe Customer's information and metadata
   */
  public async updateCustomer(
    customerId: string,
    params: Partial<GetOrCreateCustomerParams>
  ): Promise<Stripe.Customer> {
    const updatePayload: Stripe.CustomerUpdateParams = {};

    if (params.email) updatePayload.email = params.email;
    if (params.name) updatePayload.name = params.name;
    if (params.phone) updatePayload.phone = params.phone;

    const metadataToUpdate: Record<string, string> = {};
    if (params.userId) metadataToUpdate.vibez_user_id = params.userId;
    const orgId = params.orgId || params.organizationId;
    if (orgId) metadataToUpdate.org_id = String(orgId);
    if (params.orgName) metadataToUpdate.org_name = String(params.orgName);
    const teamId = params.teamId || params.workspaceId;
    if (teamId) metadataToUpdate.team_id = String(teamId);
    if (params.plan) metadataToUpdate.plan = String(params.plan);
    if (params.tier) metadataToUpdate.tier = String(params.tier);
    if (params.role) metadataToUpdate.role = String(params.role);

    if (params.metadata) {
      for (const [k, v] of Object.entries(params.metadata)) {
        if (v !== undefined && v !== null) {
          metadataToUpdate[k] = String(v);
        }
      }
    }

    if (Object.keys(metadataToUpdate).length > 0) {
      updatePayload.metadata = metadataToUpdate;
    }

    return await this.stripe.customers.update(customerId, updatePayload);
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
