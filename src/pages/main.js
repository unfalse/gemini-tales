import db from '../db/connect.js';

const mainPage = async (request, reply) => {
  const stories = db
    .prepare('SELECT stories.id, prompt_id, title FROM stories JOIN prompts ON stories.prompt_id = prompts.id')
    .all();

  return reply.view('main.ejs', { stories });
};

export { mainPage };