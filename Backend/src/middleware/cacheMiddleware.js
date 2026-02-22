import { getCachedData, setCachedData } from '../utils/cache.js';
import { fetchNewestStories } from '../services/hnService.js';

const CACHE_KEY_ALL = 'hn_newest_all';
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export const cacheNewestStories = async (req, res, next) => {
  if (req.method !== 'GET') return next();

  const search = (req.query.search || '').trim().toLowerCase();

  // For simplicity we cache the full list once → then filter in controller
  // (caching every search combination would explode memory quickly)
  let stories = getCachedData(CACHE_KEY_ALL);

  if (!stories) {
    try {
      stories = await fetchNewestStories();
      setCachedData(CACHE_KEY_ALL, stories, TTL_MS);
    } catch (err) {
      return next(err);
    }
  }

  // Attach to res.locals so controller can use it without re-fetching
  res.locals.fetchedStories = stories;

  next();
};