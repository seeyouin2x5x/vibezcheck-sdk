import { withBilling } from '../src/ai-sdk/with-billing';
import { createCustomerManager } from '../src/customers/manager';
import { normalizeCustomer } from '../src/customers/helpers';
import type { CustomerInfo } from '../src/types';

describe('Customer Information & Rich Metadata', () => {
  test('normalizeCustomer handles string and rich structured customer objects', () => {
    // 1. Simple string
    const s1 = normalizeCustomer('user_123');
    expect(s1.customerId).toBe('user_123');
    expect(s1.customerEmail).toBeUndefined();

    // 2. Email string
    const s2 = normalizeCustomer('alex@example.com');
    expect(s2.customerId).toBe('alex@example.com');
    expect(s2.customerEmail).toBe('alex@example.com');

    // 3. Rich structured object
    const customerInfo: CustomerInfo = {
      id: 'cus_premium_999',
      userId: 'usr_internal_456',
      email: 'alex@acme.corp',
      name: 'Alex Developer',
      orgId: 'org_enterprise_1',
      orgName: 'Acme Corp',
      teamId: 'team_ai_agents',
      role: 'admin',
      plan: 'scale',
      tier: 'unlimited',
      currency: 'usd',
      metadata: {
        feature_flag_beta: true,
        region: 'eu-central-1',
        cost_center: 90210,
      },
    };

    const norm = normalizeCustomer(customerInfo);
    expect(norm.customerId).toBe('cus_premium_999');
    expect(norm.customerEmail).toBe('alex@acme.corp');
    expect(norm.customerObj?.name).toBe('Alex Developer');
    expect(norm.customerMetadata.org_id).toBe('org_enterprise_1');
    expect(norm.customerMetadata.org_name).toBe('Acme Corp');
    expect(norm.customerMetadata.team_id).toBe('team_ai_agents');
    expect(norm.customerMetadata.role).toBe('admin');
    expect(norm.customerMetadata.plan).toBe('scale');
    expect(norm.customerMetadata.tier).toBe('unlimited');
    expect(norm.customerMetadata.feature_flag_beta).toBe(true);
    expect(norm.customerMetadata.region).toBe('eu-central-1');
    expect(norm.customerMetadata.cost_center).toBe(90210);
  });

  test('withBilling propagates customer metadata and profile snapshot into UsageEvent and DB sink', async () => {
    let capturedEvent: any = null;
    let dbRecordedRow: any = null;

    const mockDb = {
      from: (table: string) => ({
        insert: async (row: any) => {
          dbRecordedRow = row;
          return { data: row, error: null };
        },
      }),
    };

    const mockModel: any = {
      specificationVersion: 'v2',
      provider: '@ai-sdk/openai',
      modelId: 'gpt-4o-mini',
      doGenerate: async () => ({
        text: 'Hello world!',
        usage: { promptTokens: 100, completionTokens: 50 },
      }),
    };

    const metered = withBilling(mockModel, {
      customer: {
        id: 'cus_enterprise_888',
        userId: 'usr_founder_1',
        email: 'founder@startup.io',
        name: 'Sarah Connor',
        orgId: 'org_skynet',
        teamId: 'team_resistance',
        plan: 'enterprise_custom',
        tier: 'platinum',
        metadata: {
          department: 'R&D',
          compliance_gdpr: true,
        },
      },
      metadata: {
        route_name: 'api/chat/agent',
      },
      database: mockDb,
      onUsage: (event) => {
        capturedEvent = event;
      },
    });

    await metered.doGenerate({ prompt: 'test' });

    expect(capturedEvent).toBeDefined();
    expect(capturedEvent.customerId).toBe('cus_enterprise_888');
    expect(capturedEvent.customerEmail).toBe('founder@startup.io');
    expect(capturedEvent.customer?.name).toBe('Sarah Connor');
    expect(capturedEvent.metadata?.org_id).toBe('org_skynet');
    expect(capturedEvent.metadata?.team_id).toBe('team_resistance');
    expect(capturedEvent.metadata?.plan).toBe('enterprise_custom');
    expect(capturedEvent.metadata?.tier).toBe('platinum');
    expect(capturedEvent.metadata?.department).toBe('R&D');
    expect(capturedEvent.metadata?.compliance_gdpr).toBe(true);
    expect(capturedEvent.metadata?.route_name).toBe('api/chat/agent');

    expect(dbRecordedRow).toBeDefined();
    expect(dbRecordedRow.customer_id).toBe('cus_enterprise_888');
    expect(dbRecordedRow.user_id).toBe('usr_founder_1');
    expect(dbRecordedRow.metadata.org_id).toBe('org_skynet');
    expect(dbRecordedRow.metadata.department).toBe('R&D');
  });

  test('CustomerManager provisions and updates Customer with rich metadata', async () => {
    const manager = createCustomerManager();

    const result = await manager.getOrCreate({
      userId: 'usr_777',
      email: 'cto@acme.ai',
      name: 'John Doe',
      phone: '+15551234567',
      orgId: 'org_acme',
      orgName: 'Acme AI Inc',
      teamId: 'team_platform',
      plan: 'growth',
      tier: 'tier_3',
      role: 'cto',
      metadata: {
        invited_by: 'ceo@acme.ai',
        seats: 25,
      },
    });

    expect(result.id).toBe('usr_777');
    expect(result.isNew).toBe(true);
    expect(result.customer.email).toBe('cto@acme.ai');
    expect(result.customer.name).toBe('John Doe');
    expect(result.customer.phone).toBe('+15551234567');
    expect(result.customer.metadata?.vibez_user_id).toBe('usr_777');
    expect(result.customer.metadata?.org_id).toBe('org_acme');
    expect(result.customer.metadata?.org_name).toBe('Acme AI Inc');
    expect(result.customer.metadata?.team_id).toBe('team_platform');
    expect(result.customer.metadata?.plan).toBe('growth');
    expect(result.customer.metadata?.tier).toBe('tier_3');
    expect(result.customer.metadata?.role).toBe('cto');
    expect(result.customer.metadata?.invited_by).toBe('ceo@acme.ai');
    expect(result.customer.metadata?.seats).toBe('25');

    // Test updating customer metadata
    const updated = await manager.updateCustomer('usr_777', {
      plan: 'enterprise',
      metadata: {
        seats: 100,
        upgraded_at: '2026-09-06',
      },
    });

    expect(updated.id).toBe('usr_777');
    expect(updated.metadata?.plan).toBe('enterprise');
    expect(updated.metadata?.seats).toBe('100');
    expect(updated.metadata?.upgraded_at).toBe('2026-09-06');
  });
});
