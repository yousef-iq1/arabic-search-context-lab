import type { MarketSearchResult } from "./types";

type CacheEntry = { expiresAt: number; value: MarketSearchResult };

declare global {
  var __contextLabCache: Map<string, CacheEntry> | undefined;
}

const cache = globalThis.__contextLabCache ?? new Map<string, CacheEntry>();
globalThis.__contextLabCache = cache;
const TTL_MS = 6 * 60 * 60 * 1000;

export function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCached(key: string, value: MarketSearchResult) {
  cache.set(key, { value, expiresAt: Date.now() + TTL_MS });
}
