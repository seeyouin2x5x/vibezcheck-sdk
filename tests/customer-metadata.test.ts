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
      id: 'cus_stripe_999',
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
    expect(norm.customerId).toBe('cus_stripe_999');
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

  test('CustomerManager provisions and updates Stripe Customer with rich metadata', async () => {
    let createdPayload: any = null;
    let updatedPayload: any = null;

    const mockStripe: any = {
      customers: {
        search: async () => ({ data: [] }),
        list: async () => ({ data: [] }),
        create: async (payload: any) => {
          createdPayload = payload;
          return { id: 'cus_new_123', ...payload };
        },
        update: async (id: string, payload: any) => {
          updatedPayload = { id, ...payload };
          return { id, ...payload };
        },
      },
    };

    const manager = createCustomerManager({ stripe: mockStripe });

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

    expect(result.id).toBe('cus_new_123');
    expect(result.isNew).toBe(true);
    expect(createdPayload.email).toBe('cto@acme.ai');
    expect(createdPayload.name).toBe('John Doe');
    expect(createdPayload.phone).toBe('+15551234567');
    expect(createdPayload.metadata.vibez_user_id).toBe('usr_777');
    expect(createdPayload.metadata.org_id).toBe('org_acme');
    expect(createdPayload.metadata.org_name).toBe('Acme AI Inc');
    expect(createdPayload.metadata.team_id).toBe('team_platform');
    expect(createdPayload.metadata.plan).toBe('growth');
    expect(createdPayload.metadata.tier).toBe('tier_3');
    expect(createdPayload.metadata.role).toBe('cto');
    expect(createdPayload.metadata.invited_by).toBe('ceo@acme.ai');
    expect(createdPayload.metadata.seats).toBe('25');

    // Test updating customer metadata
    await manager.updateCustomer('cus_new_123', {
      plan: 'enterprise',
      metadata: {
        seats: 100,
        upgraded_at: '2026-09-06',
      },
    });

    expect(updatedPayload.id).toBe('cus_new_123');
    expect(updatedPayload.metadata.plan).toBe('enterprise');
    expect(updatedPayload.metadata.seats).toBe('100');
    expect(updatedPayload.metadata.upgraded_at).toBe('2026-09-06');
  });
});
