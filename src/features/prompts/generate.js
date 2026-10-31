import db from '../../db/connect.js';
import { generateAndSaveStory } from '../ai/request.js';

const pendingStories = new Set();

const generateStoryHandler = async (request, reply) => {
  const { id } = request.query;

  if (!id) {
    return reply.status(400).send({ error: 'Prompt ID is required.' });
  }

  try {
    // Fetch the prompt from the database using the provided ID
    const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);

    if (!prompt) {
      return reply.status(404).send({ error: 'Prompt not found.' });
    }
    
    const storyExists = db.prepare('SELECT * FROM stories WHERE prompt_id = ?').get(id);

    if (storyExists) {
      return reply.status(500).send({ error: 'Story already exist' });
    }
    
    const storyTitle = prompt.title;

    if (pendingStories.has(id)) {
      return reply.status(429).send({ error: 'Story generation is already in progress for this prompt.' });
    }
    
    pendingStories.add(id);

    const storyResult = await generateAndSaveStory({ text: prompt.text, id: prompt.id });

    if (!storyResult.success) {
      return reply.status(500).send({ error: 'Failed to generate story: ' + JSON.stringify(storyResult.error) });
    }

    const storyText = db
      .prepare('SELECT story FROM stories WHERE id = ?')
      .get(storyResult.storyId)
      .story;

    pendingStories.delete(id);

    return reply.view('story.ejs', { content: storyText, title: storyTitle });
  } catch (error) {
    console.error('Error generating story:', error);

    pendingStories.delete(id);

    return reply.status(500).send({ error: 'Internal server error.' });
  }
};

export { generateStoryHandler };