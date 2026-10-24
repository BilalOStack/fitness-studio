import { getAuthUser } from '../../../../lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);

    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return Response.json({ user: null });
  }
}
