import { cookies } from 'next/headers';
import { query } from '../../../../lib/db';
import { hashPassword, signToken } from '../../../../lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existingUser.rows.length > 0) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const insertResult = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), trimmedEmail, passwordHash]
    );

    const user = insertResult.rows[0];
    const token = signToken({ userId: user.id, email: user.email });

    // Set HTTP-only session cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return Response.json({
      user,
      token,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return Response.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
