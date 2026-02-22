import { fetchNewestStories } from '../services/hnService.js';

export const getNewestStories = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = Math.min(parseInt(req.query.limit) || 20, 50);
    const search = (req.query.search || '').trim().toLowerCase();

    // Data comes already fetched & cached via service/middleware
    // But we still apply final search + pagination here
    const allStories = res.locals.fetchedStories || (await fetchNewestStories());

    let filtered = allStories;
    if (search) {
      filtered = allStories.filter(story =>
        story.title?.toLowerCase().includes(search)
      );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        stories: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('storiesController error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process stories'
    });
  }
};