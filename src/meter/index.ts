export * from './client';
export * from './batcher';
export * from './stream';
export * from './extractors';

import { createMeter } from './client';
import type { StreamWrapOptions, CustomerParam } from '../types';

// Default singleton instance
const defaultMeter = createMeter();

/**
 * Convenient standalone stream wrapper
 */
export function wrapStream<T>(stream: T, options?: StreamWrapOptions): T {
  return defaultMeter.wrapStream(stream, options);
}

/**
 * Convenient standalone usage tracker
 */
export function trackTokens(
  response: any,
  options?: { customer?: CustomerParam; customerId?: string; model?: string }
) {
  return defaultMeter.trackUsage(response, options);
}
