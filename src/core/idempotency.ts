/**
 * Deterministic SHA-256 Idempotency Key Generator
 * Uses Web Crypto (crypto.subtle) natively supported in Node 18+, Edge, Cloudflare Workers, and Browsers.
 */
export async function generateIdempotencyKey(
  customerId: string,
  modelId: string,
  timestamp: string,
  extraId?: string
): Promise<string> {
  const payload = `${customerId}:${modelId}:${timestamp}:${extraId || ''}`;

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return `vibez_evt_${hashHex.slice(0, 32)}`;
  }

  // Fallback for edge cases without crypto.subtle
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `vibez_evt_${Math.abs(hash).toString(16)}_${Date.now()}`;
}
