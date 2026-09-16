import { vibezcheck, withBilling, type UsageEvent } from '../src';
import { createSupabaseAdapter } from '../src/database/supabase';
import { createPrismaAdapter } from '../src/database/prisma';
import { createSqlAdapter } from '../src/database/sql';
import { createDatabaseAdapter, createMetronomeAdapter } from '../src/database/adapter';

describe('VibezCheck — 1-Line Database Sinks (Supabase, Prisma, SQL)', () => {
  const createMockModel = () => {
    return {
      modelId: 'openai/gpt-4o-mini',
      provider: '@ai-sdk/openai',
      specificationVersion: 'v1',
      doStream: jest.fn().mockImplementation(async () => {
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'text-delta', textDelta: 'Hi' });
            controller.enqueue({
              type: 'finish',
              usage: { promptTokens: 100, completionTokens: 50 },
            });
            controller.close();
          },
        });
        return { stream };
      }),
    };
  };

  const mockUsageEvent = (overrides: Partial<UsageEvent> = {}): UsageEvent => ({
    timestamp: '2026-09-14T20:00:00.000Z',
    model: 'openai/gpt-4o-mini',
    provider: 'openai',
    usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
    cost: {
      inputCostUSD: 0.001,
      outputCostUSD: 0.0002,
      totalUSD: 0.0012,
      currency: 'USD',
    },
    ...overrides,
  });

  describe('1. vibezcheck.supabase adapter', () => {
    test('attaches to vibezcheck and creates standard DatabaseAdapter', () => {
      expect(typeof vibezcheck.supabase).toBe('function');
      const mockClient = { from: jest.fn() };
      const adapter = vibezcheck.supabase(mockClient);
      expect(adapter.name).toBe('supabase');
      expect(typeof adapter.save).toBe('function');
    });

    test('saves standard usage event into default table (vibez_usage)', async () => {
      const insertedRows: any[] = [];
      const mockClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockImplementation(async (row) => {
            insertedRows.push(row);
            return { data: row, error: null };
          }),
        }),
      };

      const adapter = createSupabaseAdapter(mockClient);
      await adapter.save(
        mockUsageEvent({
          customerId: 'cus_supabase_123',
        })
      );

      expect(mockClient.from).toHaveBeenCalledWith('vibez_usage');
      expect(insertedRows.length).toBe(1);
      expect(insertedRows[0].customer_id).toBe('cus_supabase_123');
      expect(insertedRows[0].model).toBe('openai/gpt-4o-mini');
      expect(insertedRows[0].input_tokens).toBe(100);
      expect(insertedRows[0].cost_usd).toBe(0.0012);
    });

    test('supports custom table and transform options', async () => {
      const insertedRows: any[] = [];
      const mockClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockImplementation(async (row) => {
            insertedRows.push(row);
            return { data: row, error: null };
          }),
        }),
      };

      const adapter = vibezcheck.supabase(mockClient, {
        table: 'custom_ai_events',
        transform: (event) => ({
          custom_id: event.customerId,
          tokens: event.usage.totalTokens,
        }),
      });

      await adapter.save(
        mockUsageEvent({
          customerId: 'user_xyz',
          usage: { inputTokens: 50, outputTokens: 25, totalTokens: 75 },
        })
      );

      expect(mockClient.from).toHaveBeenCalledWith('custom_ai_events');
      expect(insertedRows[0]).toEqual({
        custom_id: 'user_xyz',
        tokens: 75,
      });
    });

    test('queries prepaid balance via getBalance when balanceTable configured', async () => {
      const mockClient = {
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              maybeSingle: jest.fn().mockResolvedValue({
                data: { balance_usd: 42.50 },
                error: null,
              }),
            }),
          }),
        }),
      };

      const adapter = vibezcheck.supabase(mockClient, {
        balanceTable: 'customer_balances',
        balanceColumn: 'balance_usd',
      });

      const balance = await adapter.getBalance!('cus_123');
      expect(balance).toBe(42.50);
      expect(mockClient.from).toHaveBeenCalledWith('customer_balances');
    });

    test('works end-to-end with withBilling', async () => {
      const insertedRows: any[] = [];
      const mockClient = {
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockImplementation(async (row) => {
            insertedRows.push(row);
            return { data: row, error: null };
          }),
        }),
      };

      const model = createMockModel();
      const metered = withBilling(model, {
        customer: 'end_to_end_user',
        database: vibezcheck.supabase(mockClient),
      });

      const { stream } = await metered.doStream();
      const reader = stream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }

      await new Promise((r) => setTimeout(r, 60));

      expect(mockClient.from).toHaveBeenCalledWith('vibez_usage');
      expect(insertedRows.length).toBe(1);
      expect(insertedRows[0].customer_id).toBe('end_to_end_user');
    });
  });

  describe('2. vibezcheck.prisma adapter', () => {
    test('attaches to vibezcheck and supports direct model delegate', async () => {
      expect(typeof vibezcheck.prisma).toBe('function');

      const createdRecords: any[] = [];
      const mockModelDelegate = {
        create: jest.fn().mockImplementation(async (args) => {
          createdRecords.push(args.data);
          return args.data;
        }),
      };

      const adapter = vibezcheck.prisma(mockModelDelegate);
      expect(adapter.name).toBe('prisma');

      await adapter.save(
        mockUsageEvent({
          model: 'anthropic/claude-3-5-sonnet',
          provider: 'anthropic',
          usage: { inputTokens: 200, outputTokens: 100, totalTokens: 300 },
          cost: {
            inputCostUSD: 0.003,
            outputCostUSD: 0.0015,
            totalUSD: 0.0045,
            currency: 'USD',
          },
          customerId: 'cus_prisma_456',
        })
      );

      expect(mockModelDelegate.create).toHaveBeenCalled();
      expect(createdRecords.length).toBe(1);
      expect(createdRecords[0].customerId).toBe('cus_prisma_456');
      expect(createdRecords[0].model).toBe('anthropic/claude-3-5-sonnet');
      expect(createdRecords[0].totalTokens).toBe(300);
      expect(createdRecords[0].costUSD).toBe(0.0045);
    });

    test('supports passing root PrismaClient with model option', async () => {
      const createdRecords: any[] = [];
      const mockPrisma = {
        aiUsageEvent: {
          create: jest.fn().mockImplementation(async (args) => {
            createdRecords.push(args.data);
            return args.data;
          }),
        },
      };

      const adapter = createPrismaAdapter(mockPrisma, { model: 'aiUsageEvent' });
      await adapter.save(
        mockUsageEvent({
          customerId: 'cus_root_client',
        })
      );

      expect(mockPrisma.aiUsageEvent.create).toHaveBeenCalled();
      expect(createdRecords[0].customerId).toBe('cus_root_client');
    });

    test('auto-detects common model names like aiUsage / vibezUsage on client', async () => {
      const mockPrisma = {
        vibezUsage: {
          create: jest.fn().mockResolvedValue({ id: 1 }),
        },
      };

      const adapter = vibezcheck.prisma(mockPrisma);
      await adapter.save(
        mockUsageEvent({
          model: 'gpt-4o',
          customerId: 'cus_auto_detect',
        })
      );

      expect(mockPrisma.vibezUsage.create).toHaveBeenCalled();
    });

    test('queries prepaid balance via balanceModel', async () => {
      const mockBalanceModel = {
        findUnique: jest.fn().mockResolvedValue({ customerId: 'cus_789', balanceUSD: 15.75 }),
      };

      const mockModel = { create: jest.fn() };
      const adapter = vibezcheck.prisma(mockModel, {
        balanceModel: mockBalanceModel,
        balanceField: 'balanceUSD',
      });

      const balance = await adapter.getBalance!('cus_789');
      expect(balance).toBe(15.75);
    });

    test('works end-to-end with withBilling', async () => {
      const createdRecords: any[] = [];
      const mockModelDelegate = {
        create: jest.fn().mockImplementation(async (args) => {
          createdRecords.push(args.data);
          return args.data;
        }),
      };

      const model = createMockModel();
      const metered = withBilling(model, {
        customer: 'prisma_pipeline_user',
        database: vibezcheck.prisma(mockModelDelegate),
      });

      const { stream } = await metered.doStream();
      const reader = stream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }

      await new Promise((r) => setTimeout(r, 60));

      expect(mockModelDelegate.create).toHaveBeenCalled();
      expect(createdRecords.length).toBe(1);
      expect(createdRecords[0].customerId).toBe('prisma_pipeline_user');
    });
  });

  describe('3. vibezcheck.sql adapter', () => {
    test('attaches to vibezcheck and supports query callback function', async () => {
      expect(typeof vibezcheck.sql).toBe('function');

      const executedQueries: Array<{ query: string; params: any[] }> = [];
      const queryFn = jest.fn(async (query: string, params: any[]) => {
        executedQueries.push({ query, params });
        return { rowCount: 1 };
      });

      const adapter = vibezcheck.sql(queryFn);
      expect(adapter.name).toBe('sql');

      await adapter.save(
        mockUsageEvent({
          model: 'deepseek-chat',
          provider: 'deepseek',
          usage: { inputTokens: 500, outputTokens: 250, totalTokens: 750 },
          cost: {
            inputCostUSD: 0.0001,
            outputCostUSD: 0.00005,
            totalUSD: 0.00015,
            currency: 'USD',
          },
          customerId: 'cus_neon_sql',
        })
      );

      expect(queryFn).toHaveBeenCalled();
      expect(executedQueries.length).toBe(1);
      expect(executedQueries[0].query).toContain('INSERT INTO vibez_usage');
      expect(executedQueries[0].params[0]).toBe('cus_neon_sql');
      expect(executedQueries[0].params[2]).toBe('deepseek-chat');
    });

    test('supports SQLite / MySQL ? parameter style', async () => {
      const executed: any[] = [];
      const mockSqlite = {
        run: jest.fn(async (query: string, params: any[]) => {
          executed.push({ query, params });
        }),
      };

      const adapter = createSqlAdapter(mockSqlite, { parameterStyle: '?' });
      await adapter.save(
        mockUsageEvent({
          customerId: 'sqlite_user',
        })
      );

      expect(mockSqlite.run).toHaveBeenCalled();
      expect(executed[0].query).toContain('VALUES (?, ?, ?, ?');
    });

    test('works end-to-end with withBilling', async () => {
      const queryFn = jest.fn().mockResolvedValue({ rowCount: 1 });
      const model = createMockModel();
      const metered = withBilling(model, {
        customer: 'sql_e2e_user',
        database: vibezcheck.sql(queryFn),
      });

      const { stream } = await metered.doStream();
      const reader = stream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }

      await new Promise((r) => setTimeout(r, 60));

      expect(queryFn).toHaveBeenCalled();
    });
  });

  describe('4. vibezcheck.database / createDatabaseAdapter', () => {
    test('attaches to vibezcheck', () => {
      expect(typeof vibezcheck.database).toBe('function');
      expect(typeof vibezcheck.createDatabaseAdapter).toBe('function');
    });

    test('accepts a 1-line callback function', async () => {
      const savedEvents: UsageEvent[] = [];
      const adapter = vibezcheck.database(async (event) => {
        savedEvents.push(event);
      });

      expect(adapter.name).toBe('custom');
      await adapter.save(
        mockUsageEvent({
          id: 'evt_custom_1',
          customerId: 'cus_drizzle_user',
          cost: {
            inputCostUSD: 0.002,
            outputCostUSD: 0.001,
            totalUSD: 0.003,
            currency: 'USD',
          },
        })
      );

      expect(savedEvents.length).toBe(1);
      expect(savedEvents[0].id).toBe('evt_custom_1');
      expect(savedEvents[0].customerId).toBe('cus_drizzle_user');
      expect(savedEvents[0].cost.totalUSD).toBe(0.003);
    });

    test('accepts DatabaseAdapterOptions with custom name and getBalance', async () => {
      const saved: UsageEvent[] = [];
      const adapter = createDatabaseAdapter({
        name: 'clickhouse-sink',
        save: async (event) => {
          saved.push(event);
        },
        getBalance: async (customerId) => {
          return customerId === 'cus_vip' ? 50.0 : 0.0;
        },
      });

      expect(adapter.name).toBe('clickhouse-sink');
      expect(await adapter.getBalance?.('cus_vip')).toBe(50.0);
      expect(await adapter.getBalance?.('cus_regular')).toBe(0.0);

      await adapter.save(mockUsageEvent());
      expect(saved.length).toBe(1);
    });

    test('works end-to-end with withBilling', async () => {
      const events: UsageEvent[] = [];
      const model = createMockModel();
      const metered = withBilling(model, {
        customer: 'custom_e2e_user',
        database: vibezcheck.database(async (event) => {
          events.push(event);
        }),
      });

      const { stream } = await metered.doStream();
      const reader = stream.getReader();
      while (true) {
        const { done } = await reader.read();
        if (done) break;
      }

      await new Promise((r) => setTimeout(r, 60));

      expect(events.length).toBe(1);
      expect(events[0].customerId).toBe('custom_e2e_user');
      expect(events[0].id).toBeDefined();
      expect(events[0].id?.startsWith('evt_')).toBe(true);
    });
  });

  describe('5. vibezcheck.metronome / createMetronomeAdapter', () => {
    const originalFetch = globalThis.fetch;
    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    test('attaches to vibezcheck', () => {
      expect(typeof vibezcheck.metronome).toBe('function');
      expect(typeof vibezcheck.createMetronomeAdapter).toBe('function');
    });

    test('formats payload conforming to Metronome /v1/ingest API', async () => {
      let interceptedUrl = '';
      let interceptedHeaders: any = {};
      let interceptedBody: any = null;

      globalThis.fetch = jest.fn().mockImplementation(async (url: string, init: any) => {
        interceptedUrl = url;
        interceptedHeaders = init.headers;
        interceptedBody = JSON.parse(init.body);
        return {
          ok: true,
          status: 200,
          text: async () => '{"status":"ok"}',
        } as any;
      });

      const adapter = vibezcheck.metronome({
        apiKey: 'test-metronome-api-key',
      });

      expect(adapter.name).toBe('metronome');

      await adapter.save(
        mockUsageEvent({
          id: 'evt_metro_123',
          customerId: 'cus_metro_cust',
          model: 'gpt-4o-mini',
          provider: 'openai',
          usage: { inputTokens: 100, outputTokens: 50, totalTokens: 150 },
          cost: {
            inputCostUSD: 0.0001,
            outputCostUSD: 0.00005,
            totalUSD: 0.00015,
            currency: 'USD',
          },
          metadata: { orgId: 'org_acme' },
        })
      );

      expect(interceptedUrl).toBe('https://api.metronome.com/v1/ingest');
      expect(interceptedHeaders.Authorization).toBe('Bearer test-metronome-api-key');
      expect(interceptedHeaders['Content-Type']).toBe('application/json');
      expect(Array.isArray(interceptedBody)).toBe(true);
      expect(interceptedBody.length).toBe(1);

      const event = interceptedBody[0];
      expect(event.transaction_id).toBe('evt_metro_123');
      expect(event.customer_id).toBe('cus_metro_cust');
      expect(event.event_type).toBe('ai_inference');
      expect(event.properties.model).toBe('gpt-4o-mini');
      expect(event.properties.input_tokens).toBe(100);
      expect(event.properties.output_tokens).toBe(50);
      expect(event.properties.total_tokens).toBe(150);
      expect(event.properties.cost_usd).toBe(0.00015);
      expect(event.properties.orgId).toBe('org_acme');
    });

    test('supports custom eventType and mapProperties', async () => {
      let interceptedBody: any = null;
      globalThis.fetch = jest.fn().mockImplementation(async (_url: string, init: any) => {
        interceptedBody = JSON.parse(init.body);
        return { ok: true, status: 200 } as any;
      });

      const adapter = createMetronomeAdapter({
        apiKey: 'key_123',
        eventType: 'llm_tokens_consumed',
        mapProperties: (e) => ({
          custom_model: e.model,
          billed_amount: e.cost.totalUSD,
        }),
      });

      await adapter.save(
        mockUsageEvent({
          id: 'evt_custom_prop',
          customerId: 'cust_prop',
        })
      );

      expect(interceptedBody[0].event_type).toBe('llm_tokens_consumed');
      expect(interceptedBody[0].properties.custom_model).toBe('openai/gpt-4o-mini');
      expect(interceptedBody[0].properties.billed_amount).toBe(0.0012);
    });

    test('throws error if Metronome returns non-ok response', async () => {
      globalThis.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      } as any);

      const adapter = createMetronomeAdapter({ apiKey: 'bad_key' });
      await expect(adapter.save(mockUsageEvent())).rejects.toThrow(
        '[vibezcheck] Metronome ingest failed with HTTP 401: Unauthorized'
      );
    });
  });
});

