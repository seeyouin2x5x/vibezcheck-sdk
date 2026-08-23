import { CustomerCache } from '../src/customers/cache';
import { CustomerManager } from '../src/customers/manager';

describe('Customer Cache & Manager', () => {
  it('should cache and retrieve customer IDs in-memory', () => {
    const cache = new CustomerCache(5000);
    cache.set('user_123', 'cus_abc123');

    expect(cache.get('user_123')).toBe('cus_abc123');
    expect(cache.get('user_non_existent')).toBeNull();

    cache.delete('user_123');
    expect(cache.get('user_123')).toBeNull();
  });

  it('should auto-create customer when not found in Stripe', async () => {
    const mockSearch = jest.fn().mockResolvedValue({ data: [] });
    const mockList = jest.fn().mockResolvedValue({ data: [] });
    const mockCreate = jest.fn().mockResolvedValue({
      id: 'cus_new_123',
      email: 'alex@example.com',
      metadata: { vibez_user_id: 'user_alex' },
    });

    const mockStripe: any = {
      customers: {
        search: mockSearch,
        list: mockList,
        create: mockCreate,
      },
    };

    const manager = new CustomerManager({ stripe: mockStripe });

    const result = await manager.getOrCreate({
      userId: 'user_alex',
      email: 'alex@example.com',
      name: 'Alex Doe',
    });

    expect(result.id).toBe('cus_new_123');
    expect(result.isNew).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alex@example.com',
        name: 'Alex Doe',
        metadata: expect.objectContaining({ vibez_user_id: 'user_alex' }),
      })
    );

    // Second call should hit the in-memory cache and not call Stripe API
    const cachedResult = await manager.getOrCreate({
      userId: 'user_alex',
      email: 'alex@example.com',
    });

    expect(cachedResult.id).toBe('cus_new_123');
    expect(cachedResult.isNew).toBe(false);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
