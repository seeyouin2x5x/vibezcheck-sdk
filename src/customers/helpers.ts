import type { CustomerParam, CustomerInfo } from '../types';

export interface NormalizedCustomer {
  customerId?: string;
  customerEmail?: string;
  customerObj?: CustomerInfo;
  customerMetadata: Record<string, string | number | boolean>;
}

/**
 * Normalizes string or object customer into structured identifiers and metadata
 */
export function normalizeCustomer(customer?: CustomerParam, extraCustomerId?: string): NormalizedCustomer {
  if (!customer && !extraCustomerId) {
    return {
      customerId: undefined,
      customerEmail: undefined,
      customerObj: undefined,
      customerMetadata: {},
    };
  }

  if (typeof customer === 'string') {
    const isEmail = customer.includes('@');
    const customerObj: CustomerInfo = {
      id: customer,
      email: isEmail ? customer : undefined,
    };
    return {
      customerId: customer,
      customerEmail: isEmail ? customer : undefined,
      customerObj,
      customerMetadata: {},
    };
  }

  const customerObj = customer || (extraCustomerId ? { id: extraCustomerId } : undefined);
  const customerId = customerObj?.id || customerObj?.userId || extraCustomerId;
  const customerEmail = customerObj?.email;

  const customerMetadata: Record<string, string | number | boolean> = {};

  if (customerObj) {
    const orgId = customerObj.orgId || customerObj.organizationId;
    if (orgId) customerMetadata.org_id = String(orgId);

    const teamId = customerObj.teamId || customerObj.workspaceId;
    if (teamId) customerMetadata.team_id = String(teamId);

    if (customerObj.plan) customerMetadata.plan = String(customerObj.plan);
    if (customerObj.tier) customerMetadata.tier = String(customerObj.tier);
    if (customerObj.role) customerMetadata.role = String(customerObj.role);
    if (customerObj.orgName) customerMetadata.org_name = String(customerObj.orgName);

    if (customerObj.metadata) {
      for (const [key, val] of Object.entries(customerObj.metadata)) {
        if (val !== null && val !== undefined) {
          customerMetadata[key] = val as string | number | boolean;
        }
      }
    }
  }

  return {
    customerId,
    customerEmail,
    customerObj,
    customerMetadata,
  };
}
