import * as crypto from 'crypto';
import Stripe from 'stripe';

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
  private stripe?: Stripe;

  constructor(stripe?: Stripe) {
    this.stripe = stripe;
  }

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

    // If Stripe client is available, save key metadata to Stripe customer
    if (this.stripe && params.customerId) {
      try {
        await this.stripe.customers.update(params.customerId, {
          metadata: {
            [`vibez_key_${keyId}`]: JSON.stringify({
              hash: keyHash,
              name: params.name,
              scopes: params.scopes,
              created: record.createdAt,
            }),
          },
        });
      } catch {
        // If customer update fails, record is still returned for database storage
      }
    }

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
export function createApiKeyAuth(options: { apiKey?: string; stripe?: Stripe } = {}): ApiKeyAuth {
  let stripeClient = options.stripe;
  if (!stripeClient && (options.apiKey || process.env.STRIPE_SECRET_KEY)) {
    stripeClient = new Stripe(options.apiKey || process.env.STRIPE_SECRET_KEY!);
  }
  return new ApiKeyAuth(stripeClient);
}
