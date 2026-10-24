import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'pulsefit-secret-key-fallback-replace-in-env';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the current authenticated user from cookies or Authorization header
 * @param {Request} [request]
 * @returns {Promise<{ id: number, name: string, email: string } | null>}
 */
export async function getAuthUser(request) {
  try {
    let token = null;

    // 1. Try reading from Next.js cookie store
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
    } catch {
      // If cookies() is unavailable, fallback to request
    }

    // 2. Fallback to Authorization: Bearer <token>
    if (!token && request) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    const result = await query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  } catch (err) {
    console.error('Error in getAuthUser:', err);
    return null;
  }
}
