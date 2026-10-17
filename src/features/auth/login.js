import bcrypt from 'bcrypt';
import db from '../../db/connect.js';
import { createToken } from './jwt.js';

const loginHandler = async (request, reply) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return reply.status(400).send({ error: 'Username and password are required.' });
  }
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user) {
      return reply.status(401).send({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return reply.status(401).send({ error: 'Invalid username or password.' });
    }

    const token = await createToken(user.id);
      reply.setCookie(
      'access_token',
      token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
      }
    );

    // Authentication successful
    return reply.redirect('/prompts');
  } catch (error) {
    console.error('Error during login:', error);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
};

export { loginHandler };