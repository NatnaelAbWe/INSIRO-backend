import { db } from "./db.js";

export async function startDataBase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS user(
        id VARCHAR(100) NOT NULL UNIQUE PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS questions(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        question TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS answers(
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id INT NOT NULL,
        user_id VARCHAR(100) NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (question_id) REFERENCES questions(id),
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
    `);

    console.log("DB connected successfully");
  } catch (err) {
    console.log("Database connection unsuccessful\n", err);
  }
}

startDataBase();
