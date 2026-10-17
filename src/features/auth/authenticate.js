import { verifyToken } from './jwt.js';

export async function authenticate(request, reply) {
  const token = request.cookies.access_token;

  if (!token) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  try {
    const payload = await verifyToken(token);
    request.user = { id: payload.userId };
  } catch {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}