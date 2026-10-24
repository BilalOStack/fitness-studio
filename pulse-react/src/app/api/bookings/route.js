import { getAuthUser } from '../../../lib/auth';
import { query } from '../../../lib/db';

// Get bookings for the authenticated user
export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const result = await query(
      `SELECT b.id, b.spots, b.created_at, c.id AS class_id, c.title, c.category, c.time, c.days, c.duration, c.trainer
       FROM bookings b
       JOIN classes c ON b.class_id = c.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [user.id]
    );

    const bookings = result.rows.map((row) => ({
      id: row.id,
      spots: row.spots,
      createdAt: row.created_at,
      classItem: {
        id: row.class_id,
        title: row.title,
        category: row.category,
        time: row.time,
        days: Array.isArray(row.days) ? row.days : JSON.parse(row.days || '[]'),
        duration: row.duration,
        trainer: row.trainer,
      },
    }));

    return Response.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// Create a new booking (reserve spots)
export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Please sign in to reserve a class.' }, { status: 401 });
    }

    const body = await request.json();
    const { classId, spots = 1 } = body;

    if (!classId || spots < 1) {
      return Response.json({ error: 'Invalid class ID or spots count.' }, { status: 400 });
    }

    // Check available spots
    const classResult = await query('SELECT id, title, spots_available FROM classes WHERE id = $1', [classId]);
    if (classResult.rows.length === 0) {
      return Response.json({ error: 'Class not found.' }, { status: 404 });
    }

    const classItem = classResult.rows[0];
    if (classItem.spots_available < spots) {
      return Response.json(
        { error: `Only ${classItem.spots_available} spot(s) remaining for this class.` },
        { status: 400 }
      );
    }

    // Decrement spots atomically
    await query(
      'UPDATE classes SET spots_available = spots_available - $1 WHERE id = $2 AND spots_available >= $1',
      [spots, classId]
    );

    // Create booking record
    const bookingResult = await query(
      'INSERT INTO bookings (user_id, class_id, spots) VALUES ($1, $2, $3) RETURNING id, created_at',
      [user.id, classId, spots]
    );

    return Response.json({
      success: true,
      bookingId: bookingResult.rows[0].id,
      message: `Successfully booked ${spots} spot${spots > 1 ? 's' : ''} for ${classItem.title}!`,
      remainingSpots: classItem.spots_available - spots,
    });
  } catch (error) {
    console.error('Error reserving class:', error);
    return Response.json({ error: 'Failed to reserve class' }, { status: 500 });
  }
}
