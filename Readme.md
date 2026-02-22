# Hacker News Newest Stories Viewer

A clean, modern web app showing the **newest stories** from Hacker News.

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express REST API
- **Features**:
  - List of newest stories (title, link, domain, score, comments count, time ago, author)
  - Handles stories without URL (links to HN discussion page)
  - Live search (filters as you type)
  - Pagination with smart ellipsis
  - Loading & error states with retry
  - Dark theme + smooth animations
  - Caching (15 min TTL) on backend → reduces HN API calls
  - Concurrency-limited fetching with polite rate limiting
  - Basic automated tests (backend services + frontend placeholder)

## Tech decisions & trade-offs

- Chose **React** (instead of Angular) because of its popularity for interactive UIs, excellent component ecosystem, and faster iteration for this kind of news-feed app.
- Backend fetches up to **500 newest stories** once every 15 minutes → good balance between freshness & HN API politeness.
- Search is client-side filtering (after backend fetch) → fast & no extra endpoint needed.
- No authentication / user features (not requested).

## Running locally

### Backend

```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
