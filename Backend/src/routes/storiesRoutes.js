import express from 'express';
import { getNewestStories } from '../controllers/storiesController.js';
import { cacheNewestStories } from '../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/newest', cacheNewestStories, getNewestStories);
router.get('/', (req, res) => res.json({ message: 'Stories API root' }));

export default router;