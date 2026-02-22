// tests/hnService.test.js (updated from provided)
import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { fetchNewestStories } from '../src/services/hnService.js';

const realFetch = global.fetch;

describe('hnService.fetchNewestStories', () => {
  beforeEach(() => {
    global.fetch = realFetch;
  });

  afterEach(() => {
    global.fetch = realFetch;
  });

  it('returns array of valid story objects', async () => {
    global.fetch = async (url) => {
      if (url.endsWith('/newstories.json')) {
        return { ok: true, json: async () => [1, 2, 3] };
      }
      if (url.includes('/item/')) {
        const id = url.match(/\/(\d+)\.json$/)[1];
        return {
          ok: true,
          json: async () => ({
            id: Number(id),
            type: 'story',
            title: `Mock story ${id}`,
            url: `https://example.com/${id}`,
            time: 1700000000 + Number(id),
            score: 10 + Number(id),
            descendants: Number(id),
            by: 'user' + id
          })
        };
      }
      return { ok: false, status: 404 };
    };

    const result = await fetchNewestStories();

    assert(Array.isArray(result));
    assert(result.length > 0);
    assert(result.every(s => typeof s.id === 'number' && s.title));
  });

  it('skips non-story items and items without title', async () => {
    global.fetch = async (url) => {
      if (url.endsWith('/newstories.json')) return { ok: true, json: async () => [10, 11, 12] };
      if (url.includes('/10')) return { ok: true, json: async () => ({ id: 10, type: 'story', title: 'Good' }) };
      if (url.includes('/11')) return { ok: true, json: async () => ({ id: 11, type: 'comment' }) };
      if (url.includes('/12')) return { ok: true, json: async () => ({ id: 12, type: 'story' }) }; // no title
      return { ok: false };
    };

    const result = await fetchNewestStories();
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Good');
  });
});