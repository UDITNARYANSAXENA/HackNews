// storiesRoutes.js
import express from 'express';
import { getNewestStories } from '../controllers/storiesController.js';
import { cacheNewestStories } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// GET /api/stories/newest
router.get('/newest', cacheNewestStories, getNewestStories);

// Optional: root pe health
router.get('/', (req, res) => res.json({ message: 'Stories API root' }));

export default router;