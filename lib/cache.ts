type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  createdAt: number;
};

const memoryCache = new Map<string, CacheEntry<unknown>>();

export async function getOrSetCache<T>(
  key: string,
  ttlMs: number,
  valueFactory: () => Promise<T> | T
): Promise<{ value: T; createdAt: number; cacheHit: boolean }> {
  const now = Date.now();
  const existing = memoryCache.get(key) as CacheEntry<T> | undefined;

  if (existing && existing.expiresAt > now) {
    return { value: existing.value, createdAt: existing.createdAt, cacheHit: true };
  }

  const value = await valueFactory();
  const entry: CacheEntry<T> = {
    value,
    createdAt: now,
    expiresAt: now + ttlMs
  };

  memoryCache.set(key, entry);

  return { value, createdAt: now, cacheHit: false };
}

export function clearCache(prefix?: string): void {
  if (!prefix) {
    memoryCache.clear();
    return;
  }

  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
    }
  }
}
