import { getCachedData, setCachedData } from '../utils/cache.js';
import { fetchNewestStories } from '../services/hnService.js';

const TTL_MS = 30 * 60 * 1000; // 30 minutes for non-search

export const cacheNewestStories = async (req, res, next) => {
  if (req.method !== 'GET') return next();

  const sort   = req.query.sort   || 'newest';
  const search = (req.query.search || '').trim().toLowerCase();
  const page   = req.query.page   || '1';
  const limit  = req.query.limit  || '20';

  let stories;

  if (!search) {
    // Only cache when NO search (most common case)
    const cacheKey = `hn_newest_${sort}_all_p${page}_l${limit}`;
    console.log('[CACHE KEY]', cacheKey);

    stories = getCachedData(cacheKey);

    if (!stories) {
      console.log('[CACHE MISS - no search] Fetching from HN...');
      stories = await fetchNewestStories();
      setCachedData(cacheKey, stories, TTL_MS);
    } else {
      console.log('[CACHE HIT - no search]');
    }
  } else {
    // Search → always fresh (search is rare + dynamic)
    console.log('[SEARCH MODE] Fresh fetch...');
    stories = await fetchNewestStories();
  }

  res.locals.fetchedStories = stories;
  next();
};