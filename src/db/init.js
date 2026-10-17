import bcrypt from 'bcrypt';
import db from './connect.js';

const ADMIN_CREATED = true;

const initScript =
  `CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    title TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story TEXT NOT NULL,
      prompt_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

const createAdminUser = async () => {
  const username = '';
  const passwordHash = await bcrypt.hash('', 12); // Хэш пароля "admin"
  try {
    const result = 
      db
        .prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
        .run(username, passwordHash);
    console.log('Администратор успешно создан. ' + result.lastInsertRowid);
  } catch (err) {
    console.error('Ошибка при создании администратора:', err);
  }
}

const initDatabase = async () => {
  db.exec(initScript, (err) => {
    if (err) {
      console.error('Ошибка при инициализации базы данных:', err);
    } else {
      console.log('База данных успешно инициализирована.');
    }
  });
  if (!ADMIN_CREATED) await createAdminUser();
};

export { initDatabase };