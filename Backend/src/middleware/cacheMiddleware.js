// src/middleware/cacheMiddleware.js
import { getCachedData, setCachedData } from '../utils/cache.js';
import { fetchNewestStories } from '../services/hnService.js';

const CACHE_KEY = 'hn_newest_all_v2';
const TTL_MS = 15 * 60 * 1000; // 15 min

export const cacheNewestStories = async (req, res, next) => {
  if (req.method !== 'GET') return next();

  let stories = getCachedData(CACHE_KEY);

  if (!stories) {
    console.log('[cache] Miss → fetching newest stories...');
    try {
      stories = await fetchNewestStories();
      setCachedData(CACHE_KEY, stories, TTL_MS);
      console.log(`[cache] Stored ${stories.length} stories`);
    } catch (err) {
      console.error('[cache] Fetch failed:', err.message);
      return res.status(503).json({
        success: false,
        error: 'Upstream HN API error – try again later'
      });
    }
  } else {
    console.log('[cache] Hit');
  }

  res.locals.fetchedStories = stories;
  next();
};