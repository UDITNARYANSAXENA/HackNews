import fetch from 'node-fetch';
import pLimit from 'p-limit';

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';
const MAX_STORIES = 500;
const CONCURRENCY = 8;

export async function fetchNewestStories() {
  try {
    const idsRes = await fetch(`${HN_BASE}/newstories.json`);
    if (!idsRes.ok) throw new Error(`newstories failed: ${idsRes.status}`);

    const ids = await idsRes.json();
    const limitedIds = ids.slice(0, MAX_STORIES);

    const limit = pLimit(6);

    const promises = limitedIds.map(id => limit(async () => {
      try {
        const itemRes = await fetch(`${HN_BASE}/item/${id}.json`);
        if (!itemRes.ok) return null;
        const item = await itemRes.json();
        if (item?.type !== 'story' || !item.title) return null;

        return {
          id: item.id,
          title: item.title,
          url: item.url || null,
          score: item.score ?? 0,
          by: item.by ?? 'anonymous',
          time: item.time ?? 0,
          descendants: item.descendants ?? 0,
        };
      } catch {
        return null;
      }
    }));

    let results = await Promise.all(promises);
    results = results.filter(Boolean);

    // Already sort newest first (controller will handle oldest)
    results.sort((a, b) => b.time - a.time || b.score - a.score);

    return results;
  } catch (err) {
    console.error('fetchNewestStories error:', err.message);
    throw err;
  }
}