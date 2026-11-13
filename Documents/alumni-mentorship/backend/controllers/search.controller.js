const db = require('../db');

const ALLOWED_SORTS = ['relevance', 'name', 'newest'];

// GET /api/users/search?q=&role=&industry=&day=&timeSlot=&sort=&page=&limit=
exports.searchUsers = (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const role = req.query.role || '';
    const industry = req.query.industry || '';
    const day = req.query.day || '';
    const timeSlot = req.query.timeSlot || '';
    const sort = ALLOWED_SORTS.includes(req.query.sort) ? req.query.sort : 'relevance';

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
    const offset = (page - 1) * limit;

    // ---- Build WHERE dynamically (always with bound parameters, never string-concatenated values) ----
    const where = [];
    const params = {};

    if (q) {
      where.push('(u.name LIKE @like OR u.industry LIKE @like OR u.bio LIKE @like)');
      params.like = `%${q}%`;
    }
    if (role) {
      where.push('u.role = @role');
      params.role = role;
    }
    if (industry) {
      where.push('u.industry = @industry');
      params.industry = industry;
    }
    if (day || timeSlot) {
      let sub = 'EXISTS (SELECT 1 FROM availability a WHERE a.user_id = u.id';
      if (day) { sub += ' AND a.day_of_week = @day'; params.day = day; }
      if (timeSlot) { sub += ' AND a.time_slot = @timeSlot'; params.timeSlot = timeSlot; }
      sub += ')';
      where.push(sub);
    }
    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

    // ---- "Most Relevant" score: name match > industry match > bio match ----
    const relevanceSql = q
      ? `(CASE WHEN u.name     LIKE @like THEN 3 ELSE 0 END
        + CASE WHEN u.industry LIKE @like THEN 2 ELSE 0 END
        + CASE WHEN u.bio      LIKE @like THEN 1 ELSE 0 END)`
      : '0';

    const orderBy = {
      relevance: 'relevance DESC, u.name ASC',
      name: 'u.name ASC',
      newest: 'u.created_at DESC, u.id DESC'
    }[sort];

    // ---- Total count (for pagination) ----
    const total = db
      .prepare(`SELECT COUNT(*) AS total FROM users u ${whereSql}`)
      .get(params).total;

    // ---- The page of results ----
    const rows = db
      .prepare(`
        SELECT u.id, u.name, u.role, u.industry, u.bio, u.created_at,
               ${relevanceSql} AS relevance,
               (SELECT GROUP_CONCAT(a.day_of_week || ' ' || a.time_slot, ', ')
                  FROM availability a WHERE a.user_id = u.id) AS schedule
        FROM users u
        ${whereSql}
        ORDER BY ${orderBy}
        LIMIT @limit OFFSET @offset
      `)
      .all({ ...params, limit, offset });

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search failed' });
  }
};

// GET /api/users/filters  -> values to fill the dropdowns
exports.getFilterOptions = (req, res) => {
  try {
    const industries = db
      .prepare("SELECT DISTINCT industry FROM users WHERE industry IS NOT NULL ORDER BY industry")
      .all()
      .map(r => r.industry);

    res.json({
      roles: ['student', 'alumni'],
      industries,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      timeSlots: ['Morning', 'Afternoon', 'Evening']
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load filters' });
  }
};