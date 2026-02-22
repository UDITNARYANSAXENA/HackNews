import express from 'express';
import { getNewestStories } from '../controllers/storiesController.js';
import { cacheNewestStories } from '../middleware/cacheMiddleware.js';

const router = express.Router();

router.get('/stories/newest', cacheNewestStories, getNewestStories);

export default router;