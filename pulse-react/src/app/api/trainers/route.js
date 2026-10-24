import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM trainers ORDER BY id ASC');
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return Response.json({ error: 'Failed to fetch trainers' }, { status: 500 });
  }
}
