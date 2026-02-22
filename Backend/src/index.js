// index.js (app entry)
import express from 'express';
import cors from 'cors';
import storiesRoutes from './routes/storiesRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' })); // adjust in production
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/stories', storiesRoutes);

app.listen(PORT, () => {
  console.log(`Backend running → http://localhost:${PORT}`);
  console.log(`API endpoint example: http://localhost:${PORT}/api/stories/newest?page=1&limit=20`);
});