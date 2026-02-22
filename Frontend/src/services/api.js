// src/services/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';  // fallback to /api

export async function getStories(params = {}) {
  let path = `${API_BASE}/stories/newest`;

  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== null && v !== '')
          .map(([k, v]) => [k, String(v)])
      )
    );
    path += `?${searchParams.toString()}`;
  }

  const res = await fetch(path, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
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