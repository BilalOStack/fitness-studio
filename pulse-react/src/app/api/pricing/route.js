import { query } from '../../../lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM pricing_plans ORDER BY price ASC');
    const plans = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      period: row.period,
      featured: row.featured,
      badge: row.badge,
      features: Array.isArray(row.features) ? row.features : JSON.parse(row.features || '[]'),
      buttonText: row.button_text,
    }));
    return Response.json(plans);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return Response.json({ error: 'Failed to fetch pricing plans' }, { status: 500 });
  }
}
