import type { ApiKeyAuth } from './keys';

export interface VerifyAuthResult {
  valid: boolean;
  apiKey?: string;
  customerId?: string;
  userId?: string;
  keyId?: string;
  error?: string;
}

/**
 * Extracts and verifies Bearer API key or authorization token from Request or Header string
 */
export function extractAuthToken(
  reqOrHeader: Request | Headers | Record<string, string | string[] | undefined> | string
): string | null {
  if (!reqOrHeader) return null;

  let authHeader: string | null = null;

  if (typeof reqOrHeader === 'string') {
    authHeader = reqOrHeader;
  } else if ('headers' in reqOrHeader && typeof (reqOrHeader as any).headers?.get === 'function') {
    authHeader = (reqOrHeader as any).headers.get('authorization') || (reqOrHeader as any).headers.get('x-api-key');
  } else if (typeof (reqOrHeader as any).get === 'function') {
    authHeader = (reqOrHeader as any).get('authorization') || (reqOrHeader as any).get('x-api-key');
  } else if (typeof reqOrHeader === 'object') {
    const raw =
      (reqOrHeader as any)['authorization'] ||
      (reqOrHeader as any)['Authorization'] ||
      (reqOrHeader as any)['x-api-key'] ||
      (reqOrHeader as any)['X-API-Key'];
    authHeader = Array.isArray(raw) ? raw[0] : raw;
  }

  if (!authHeader) return null;

  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  return authHeader.trim();
}
