import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

import db from '../../db/connect.js';

const ai = new GoogleGenAI();

const sendPrompt = async () => {
  try {
    return await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: promptObject.text,
    });
  } catch(err) {
    console.error('Error happened on sending the prompt:', error);
  }
}

const saveStoryToDB = (storyText, promptObject) => {
  return db
    .prepare('INSERT INTO stories (story, prompt_id) VALUES (?, ?)')
    .run(storyText, promptObject.id);
}

const generateAndSaveStory = async (promptObject) => {
  let storyText;

  try {
    console.log('Sending prompt to Gemini API...');
    const response = await sendPrompt();
    storyText = response.text;
  } catch(err) {
    console.error('Error happened on sending the prompt:', error);
    return { success: false, error };
  }

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