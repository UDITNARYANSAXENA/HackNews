// src/controllers/storiesController.js
export const getNewestStories = async (req, res) => {
  try {
    let page  = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) page = 1;

    let limit = parseInt(req.query.limit, 10);
    if (isNaN(limit) || limit < 1) limit = 20;
    limit = Math.min(limit, 50); // hard cap

    const search = (req.query.search || '').trim().toLowerCase();

    const allStories = res.locals.fetchedStories;

    let filtered = allStories;

    if (search) {
      filtered = allStories.filter(story =>
        story.title?.toLowerCase().includes(search) ||
        story.url?.toLowerCase().includes(search) ||
        story.by?.toLowerCase().includes(search)
      );
    }

    // Sort with time descending, then score descending for ties
    filtered = filtered.sort((a, b) => {
      if (b.time !== a.time) return b.time - a.time;
      return b.score - a.score;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

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
          hasPrev: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
          nextPageUrl: page < totalPages ? `/api/stories/newest?page=${page+1}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ''}` : null,
        },
        searchTerm: search || undefined,
        fetchedAt: allStories.length > 0 ? new Date(allStories[0].time * 1000).toISOString() : null,
      }
    });
  } catch (err) {
    console.error('getNewestStories error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};