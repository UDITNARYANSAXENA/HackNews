import express from 'express';
import cors from 'cors';
import storiesRoutes from './routes/storiesRoutes.js';  // adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// ────────────────────────────────────────────────
// REAL ROUTES GO HERE — BEFORE the 404 handler
// ────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Your main API routes
app.use('/api/stories', storiesRoutes);

// ────────────────────────────────────────────────
// 404 handler MUST BE LAST (after all real routes)
// ────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Optional: global error handler (also at the end)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Backend running → http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/stories/newest?page=1&limit=5`);
});