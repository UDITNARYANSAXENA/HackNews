// src/services/api.js
export async function getStories(params = {}) {
  // Use RELATIVE path – Vite proxy will catch it
  let path = '/api/stories/newest';

  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => [k, String(v)])
      )
    );
    path += '?' + searchParams.toString();
  }

  const res = await fetch(path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    // credentials: 'same-origin'   // only if you need cookies later
  });

  if (!res.ok) {
    let errorText = '';
    try {
      errorText = await res.text();
    } catch {}
    throw new Error(`API request failed (${res.status}): ${errorText || res.statusText}`);
  }

  return res.json();
}