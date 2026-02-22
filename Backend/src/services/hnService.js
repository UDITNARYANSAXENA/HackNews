import fetch from 'node-fetch';

const HN_BASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchNewestStories() {
  try {
    // 1. Get newest story IDs
    const idsRes = await fetch(`${HN_BASE}/newstories.json`);
    if (!idsRes.ok) throw new Error(`newstories failed: ${idsRes.status}`);

    const ids = await idsRes.json();

    // Limit to ~200 newest to avoid hammering the API
    const limitedIds = ids.slice(0, 200);

    // 2. Fetch story details in parallel
    const storyPromises = limitedIds.map(async (id) => {
      try {
        const itemRes = await fetch(`${HN_BASE}/item/${id}.json`);
        if (!itemRes.ok) return null;

        const item = await itemRes.json();

        if (item?.type !== 'story' || !item.title) return null;

        return {
          id: item.id,
          title: item.title,
          url: item.url || null,
          score: item.score || 0,
          by: item.by || 'anonymous',
          time: item.time,
          descendants: item.descendants || 0
        };
      } catch {
        return null;
      }
    });

    const stories = (await Promise.all(storyPromises)).filter(Boolean);

    // Ensure newest first (HN usually returns newest first, but we sort to be safe)
    stories.sort((a, b) => b.time - a.time);

    return stories;
  } catch (err) {
    console.error('fetchNewestStories error:', err.message);
    throw err;
  }
}