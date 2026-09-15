import { CustomerCache } from './cache';

export interface CustomerRecord {
  id: string;
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
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

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
  cacheTtlMs?: number;
}

export class CustomerManager {
  private cache: CustomerCache;
  private records = new Map<string, CustomerRecord>();

  constructor(options: CustomerManagerOptions = {}) {
    this.cache = new CustomerCache(options.cacheTtlMs);
  }

  /**
   * Retrieves existing Customer or automatically provisions a new one with full metadata
   */
  public async getOrCreate(
    params: GetOrCreateCustomerParams
  ): Promise<{ id: string; isNew: boolean; customer: CustomerRecord }> {
    const cacheKey = params.userId || params.email;
    if (cacheKey) {
      const cachedId = this.cache.get(cacheKey);
      if (cachedId && this.records.has(cachedId)) {
        return {
          id: cachedId,
          isNew: false,
          customer: this.records.get(cachedId)!,
        };
      }
    }

    // 1. Search by userId
    if (params.userId) {
      for (const record of this.records.values()) {
        if (record.userId === params.userId) {
          if (cacheKey) this.cache.set(cacheKey, record.id);
          if (params.email) this.cache.set(params.email, record.id);
          return { id: record.id, isNew: false, customer: record };
        }
      }
    }

    // 2. Search by email
    if (params.email) {
      for (const record of this.records.values()) {
        if (record.email === params.email) {
          if (cacheKey) this.cache.set(cacheKey, record.id);
          if (params.userId) this.cache.set(params.userId, record.id);
          return { id: record.id, isNew: false, customer: record };
        }
      }
    }

    // 3. Prepare metadata
    const metadata: Record<string, string> = {
      vibez_user_id: params.userId || '',
      created_by: 'vibezcheck',
    };
    const orgId = params.orgId || params.organizationId;
    const teamId = params.teamId || params.workspaceId;
    if (orgId) metadata.org_id = String(orgId);
    if (params.orgName) metadata.org_name = String(params.orgName);
    if (teamId) metadata.team_id = String(teamId);
    if (params.plan) metadata.plan = String(params.plan);
    if (params.tier) metadata.tier = String(params.tier);
    if (params.role) metadata.role = String(params.role);

    if (params.metadata) {
      for (const [k, v] of Object.entries(params.metadata)) {
        if (v !== undefined && v !== null) {
          metadata[k] = String(v);
        }
      }
    }

    // 4. Provision new Customer record
    const id = params.userId || `cus_${Math.random().toString(36).substring(2, 11)}`;
    const now = new Date().toISOString();
    const newCustomer: CustomerRecord = {
      id,
      userId: params.userId,
      email: params.email,
      name: params.name,
      phone: params.phone,
      orgId: orgId ? String(orgId) : undefined,
      organizationId: orgId ? String(orgId) : undefined,
      orgName: params.orgName,
      teamId: teamId ? String(teamId) : undefined,
      workspaceId: teamId ? String(teamId) : undefined,
      role: params.role,
      plan: params.plan,
      tier: params.tier,
      metadata,
      createdAt: now,
      updatedAt: now,
    };

    this.records.set(id, newCustomer);
    if (cacheKey) this.cache.set(cacheKey, id);
    if (params.userId) this.cache.set(params.userId, id);
    if (params.email) this.cache.set(params.email, id);

    return { id, isNew: true, customer: newCustomer };
  }

  /**
   * Updates an existing Customer's information and metadata
   */
  public async updateCustomer(
    customerId: string,
    params: Partial<GetOrCreateCustomerParams>
  ): Promise<CustomerRecord> {
    const existing = this.records.get(customerId) || {
      id: customerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const metadataToUpdate: Record<string, string> = { ...(existing.metadata || {}) };
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

    const updated: CustomerRecord = {
      ...existing,
      ...params,
      id: customerId,
      metadata: metadataToUpdate,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(customerId, updated);
    if (updated.userId) this.cache.set(updated.userId, customerId);
    if (updated.email) this.cache.set(updated.email, customerId);

    return updated;
  }

  /**
   * Clears in-memory resolution cache and records
   */
  public clearCache(): void {
    this.cache.clear();
    this.records.clear();
  }
}

/**
 * Factory to create CustomerManager
 */
export function createCustomerManager(options: CustomerManagerOptions = {}): CustomerManager {
  return new CustomerManager(options);
}
