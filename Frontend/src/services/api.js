const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function getStories(params = {}) {
  let path = `${API_BASE}/stories/newest`;

  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v != null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    path += `?${searchParams}`;
  }

  console.log('API request:', path); // debug

  const res = await fetch(path, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}