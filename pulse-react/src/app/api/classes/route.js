import { query } from '../../../lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = 'SELECT * FROM classes';
    const params = [];

    if (category && category !== 'All') {
      sql += ' WHERE category = $1';
      params.push(category);
    }

    sql += ' ORDER BY id ASC';

    const result = await query(sql, params);

    // Format DB rows for React component compatibility
    const classes = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      time: row.time,
      days: Array.isArray(row.days) ? row.days : JSON.parse(row.days || '[]'),
      duration: row.duration,
      trainer: row.trainer,
      spotsAvailable: row.spots_available,
      description: row.description,
      tagColor: row.tag_color,
    }));

    return Response.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return Response.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}
