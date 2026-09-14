import { vibezcheck, withBilling, type UsageEvent } from '../src';
import { createSupabaseAdapter } from '../src/database/supabase';
import { createPrismaAdapter } from '../src/database/prisma';
import { createSqlAdapter } from '../src/database/sql';

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
});
