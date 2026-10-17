import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import cookie from '@fastify/cookie';
import fastifyView from '@fastify/view';
import path from 'node:path';
import ejs from 'ejs';

import { initDatabase } from './db/init.js';
import { loginHandler } from './features/auth/login.js';
import { promptsHandler, addPromptsHandler } from './features/prompts/prompts.js';
import { authenticate } from './features/auth/authenticate.js';
import { generateStoryHandler } from './features/prompts/generate.js';

import { loginPage } from './pages/login.js';
import { mainPage } from './pages/main.js';
import { storyPage } from './pages/story.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(fastifyView, {
    engine: {
      ejs,
    },
    root: path.join(process.cwd(), 'src/views'),
  });

  initDatabase();

  app.register(formbody);
  app.register(cookie);

  app.get('/', mainPage);
  app.get('/story', storyPage)

  app.get('/login', loginPage);
  app.post('/login', loginHandler);

  app.get('/prompts', { preHandler: authenticate }, promptsHandler);
  app.post('/add-prompt', { preHandler: authenticate }, addPromptsHandler);

  app.get('/generate', { preHandler: authenticate }, generateStoryHandler);

  return app;
}