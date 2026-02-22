const cacheStore = new Map();

export function getCachedData(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value;
}

export function setCachedData(key, value, ttlMs) {
  const expiry = Date.now() + ttlMs;
  cacheStore.set(key, { value, expiry });
}