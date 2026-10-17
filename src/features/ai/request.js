import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

import db from '../../db/connect.js';

const ai = new GoogleGenAI();

const generateAndSaveStory = async (promptObject) => {
  try {
    console.log('Отправка промпта в Gemini API...');

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: promptObject.text,
    });

    const storyText = response.text;

    const result = db
      .prepare('INSERT INTO stories (story, prompt_id) VALUES (?, ?)')
      .run(storyText, promptObject.id);

    console.log(`\nУспешно! Рассказ сохранен в базу данных с ID: ${result.lastInsertRowid}\n`);
    return { success: true, storyId: result.lastInsertRowid };
  } catch (error) {
    console.error('Произошла ошибка при генерации или сохранении:', error);
    return { success: false, error };
  }
}

export { generateAndSaveStory };