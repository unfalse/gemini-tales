import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

import db from '../../db/connect.js';

const ai = new GoogleGenAI();

const sendPrompt = async (promptObject) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: promptObject.text,
    });
    return { response };
  } catch(error) {
    console.error('Error happened on sending the prompt:', error);
    if (error.message) {
      return { error: JSON.parse(error.message) };
    }
  }
}

const saveStoryToDB = (storyText, promptObject) => {
  return db
    .prepare('INSERT INTO stories (story, prompt_id) VALUES (?, ?)')
    .run(storyText, promptObject.id);
}

const generateAndSaveStory = async (promptObject) => {
  let storyText;

  console.log('Sending prompt to Gemini API...');
  const response = await sendPrompt(promptObject);
  if (response.error) {
    return { success: false, error: response.error };
  }

  storyText = response.response.text;

  try {
    const result = saveStoryToDB(storyText, promptObject);

    console.log(`\nStory was saved to DB with ID: ${result.lastInsertRowid}\n`);

    return { success: true, storyId: result.lastInsertRowid };
  } catch (error) {
    console.error('Error happened on save:', error);
    return { success: false, error };
  }
}

export { generateAndSaveStory };