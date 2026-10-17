import db from '../../db/connect.js';

const promptsHandler = async (request, reply) => {
  // Fetch prompts from the database
  const prompts = db.prepare('SELECT * FROM prompts').all();

  // Render the prompts page with the fetched prompts
  return reply.view('prompts.ejs', { prompts });
};

const addPromptsHandler = async (request, reply) => {
  const { prompt, title } = request.body;

  console.log('Headers:', request.headers);
  console.log('Body:', request.body);

  if (!prompt || !title) {
    return reply.status(400).send({ error: 'Prompt and title are required.' });
  }

  try {
    // Insert the new prompt into the database
    db.prepare('INSERT INTO prompts (text, title) VALUES (?, ?)').run(prompt, title);

    // Redirect to the prompts page after successful insertion
    return reply.redirect('/prompts');
  } catch (error) {
    console.error('Error adding prompt:', error);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
};

export { promptsHandler, addPromptsHandler };