import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.hn-cache.json');

let cacheStore = new Map();

try {
  const data = await fs.readFile(CACHE_FILE, 'utf-8');
  const parsed = JSON.parse(data);
  for (const [k, v] of Object.entries(parsed)) {
    cacheStore.set(k, v);
  }
} catch {}

export function getCachedData(key) {
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cacheStore.delete(key);
    void saveCache();
    return null;
  }
  return entry.value;
}

export function setCachedData(key, value, ttlMs) {
  const expiry = Date.now() + ttlMs;
  cacheStore.set(key, { value, expiry });
  void saveCache();
}

async function saveCache() {
  const serializable = {};
  for (const [k, { value, expiry }] of cacheStore) {
    if (Date.now() < expiry) serializable[k] = { value, expiry };
  }
  await fs.writeFile(CACHE_FILE, JSON.stringify(serializable, null, 2));
}