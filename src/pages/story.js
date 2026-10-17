import db from '../db/connect.js';

const storyPage = async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ error: 'Story ID is required.' });
  }

  try {
    const story = db
      .prepare('SELECT stories.story, prompts.title FROM stories JOIN prompts ON stories.prompt_id = prompts.id WHERE stories.id = ?')
      .get(id);

    if (!story) {
      return reply.status(404).send({ error: 'Story not found.' });
    }

    return reply.view('story.ejs', { content: story.story, title: story.title });
  } catch (error) {
    console.error('Error fetching story:', error);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
};

export { storyPage };