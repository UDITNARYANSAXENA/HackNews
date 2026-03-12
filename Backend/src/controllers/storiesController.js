export const getNewestStories = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const search = (req.query.search || '').trim().toLowerCase();
    const sort  = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    console.log('Backend →', { page, limit, search: search || '-', sort });

    const allStories = res.locals.fetchedStories || [];

    let filtered = allStories;

    if (search) {
      filtered = allStories.filter(s =>
        (s.title || '').toLowerCase().includes(search) ||
        (s.url   || '').toLowerCase().includes(search) ||
        (s.by    || '').toLowerCase().includes(search)
      );
    }

    filtered = filtered.slice().sort((a, b) => {
      const ta = a.time || 0;
      const tb = b.time || 0;
      return sort === 'oldest' ? ta - tb : tb - ta;
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
        },
        searchTerm: search || undefined,
        sort,
        fetchedAt: allStories[0] ? new Date(allStories[0].time * 1000).toISOString() : null,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};