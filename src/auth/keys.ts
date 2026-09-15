import * as crypto from 'crypto';

export interface ApiKeyRecord {
  keyId: string;
  keyHash: string;
  customerId: string;
  userId: string;
  name?: string;
  scopes?: string[];
  createdAt: string;
}

export interface CreateApiKeyParams {
  customerId: string;
  userId: string;
  name?: string;
  scopes?: string[];
}

export class ApiKeyAuth {
  constructor() {}

  /**
   * Hashes a raw API key using SHA-256
   */
  public hashKey(rawKey: string): string {
    return crypto.createHash('sha256').update(rawKey).digest('hex');
  }

  /**
   * Generates a new secure vz_live_... API key
   */
  public async createApiKey(params: CreateApiKeyParams): Promise<{
    apiKey: string;
    keyId: string;
    record: ApiKeyRecord;
  }> {
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const apiKey = `vz_live_${randomBytes}`;
    const keyId = `key_${crypto.randomBytes(8).toString('hex')}`;
    const keyHash = this.hashKey(apiKey);

    const record: ApiKeyRecord = {
      keyId,
      keyHash,
      customerId: params.customerId,
      userId: params.userId,
      name: params.name,
      scopes: params.scopes,
      createdAt: new Date().toISOString(),
    };

    return { apiKey, keyId, record };
  }

  /**
   * Validates a raw key against an expected hash
   */
  public verifyKeyHash(rawKey: string, expectedHash: string): boolean {
    const computedHash = this.hashKey(rawKey);
    return crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(expectedHash));
  }
}

/**
 * Factory to create ApiKeyAuth
 */
export function createApiKeyAuth(_options: { apiKey?: string } = {}): ApiKeyAuth {
  return new ApiKeyAuth();
}
