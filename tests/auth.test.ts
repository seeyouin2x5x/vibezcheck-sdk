import { ApiKeyAuth } from '../src/auth/keys';
import { extractAuthToken } from '../src/auth/verify';

describe('ApiKeyAuth & Token Verification', () => {
  it('should generate secure vz_live_ API keys and hashes', async () => {
    const auth = new ApiKeyAuth();
    const result = await auth.createApiKey({
      customerId: 'cus_123',
      userId: 'user_123',
      name: 'Test Key',
    });

    expect(result.apiKey).toMatch(/^vz_live_[0-9a-f]{48}$/);
    expect(result.keyId).toMatch(/^key_[0-9a-f]{16}$/);
    expect(result.record.keyHash).toBeDefined();

    const isValid = auth.verifyKeyHash(result.apiKey, result.record.keyHash);
    expect(isValid).toBe(true);

    const isInvalid = auth.verifyKeyHash('vz_live_wrongkey', result.record.keyHash);
    expect(isInvalid).toBe(false);
  });

  it('should extract Bearer tokens from various header formats', () => {
    expect(extractAuthToken('Bearer vz_live_123456')).toBe('vz_live_123456');
    expect(extractAuthToken('vz_live_123456')).toBe('vz_live_123456');

    const mockHeaders = {
      authorization: 'Bearer vz_live_header_token',
    };
    expect(extractAuthToken(mockHeaders)).toBe('vz_live_header_token');

    const mockRequest: any = {
      headers: {
        get: (name: string) => (name === 'authorization' ? 'Bearer vz_live_req_token' : null),
      },
    };
    expect(extractAuthToken(mockRequest)).toBe('vz_live_req_token');
  });
});
