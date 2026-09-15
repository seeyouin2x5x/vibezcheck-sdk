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

  it('should auto-create customer and retrieve from cache/store', async () => {
    const manager = new CustomerManager();

    const result = await manager.getOrCreate({
      userId: 'user_alex',
      email: 'alex@example.com',
      name: 'Alex Doe',
    });

    expect(result.id).toBe('user_alex');
    expect(result.isNew).toBe(true);
    expect(result.customer.name).toBe('Alex Doe');
    expect(result.customer.metadata?.vibez_user_id).toBe('user_alex');

    // Second call should hit the in-memory cache
    const cachedResult = await manager.getOrCreate({
      userId: 'user_alex',
      email: 'alex@example.com',
    });

    expect(cachedResult.id).toBe('user_alex');
    expect(cachedResult.isNew).toBe(false);
  });
});
