import { verifyToken } from './jwt.js';

export async function authenticate(request, reply) {
  const token = request.cookies.access_token;

  if (!token) {
    return reply.redirect('/login?message=Please%20authorise%20first');
  }

  try {
    const payload = await verifyToken(token);
    request.user = { id: payload.userId };
  } catch {
    return reply.redirect('/login?message=Invalid%20or%20expired%20token');
  }
}