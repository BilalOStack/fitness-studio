import { NextResponse } from 'next/server';

/**
 * Next.js middleware (login check) that blocks checkout and order routes
 * for anyone who does not have an authentication token (cookie or Authorization header).
 */
export function middleware(request) {
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader =
    request.headers.get('authorization') || request.headers.get('Authorization');
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7).trim()
      : null;

  if (!cookieToken && !bearerToken) {
    return NextResponse.json(
      { error: 'Unauthorized. You must be signed in to checkout.' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/checkout', '/api/orders/:path*'],
};
