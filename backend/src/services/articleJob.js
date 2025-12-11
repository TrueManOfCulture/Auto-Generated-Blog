import cron from 'node-cron';
import db from './db.js'; // Your PostgreSQL client
import { generateArticle } from './aiClient.js'; // The new AI client

async function createNewArticle() {
  try {
    console.log('--- 🤖 Starting daily article generation job... ---');
    
    // 1. Generate Article Content
    // We are requesting an article on a generic topic since it runs daily.
    const topic = "A random, intriguing technical trend or concept in cloud, AI, or software architecture";
    const { title, content } = await generateArticle(topic); 
    
    // 2. Insert into PostgreSQL
    const text = 'INSERT INTO articles (title, content) VALUES ($1, $2) RETURNING *';
    const values = [title, content];
    
    const res = await db.query(text, values);
    
    console.log(`✅ New article saved to DB: ID ${res.rows[0].id}`);
    
  } catch (error) {
    console.error(`❌ Daily article generation failed at ${new Date().toISOString()}:`, error.message);
    // You might want to log the error to a persistent file or service here
  }
}

export function startArticleScheduler() {
  // CRON Expression: '0 0 * * *' runs at 00:00 (midnight) every day.
  cron.schedule('0 0 * * *', createNewArticle, {
    scheduled: true,
    timezone: "Etc/UTC" // Ensure consistent scheduling regardless of server location
  });
  
  console.log('⏳ Article scheduler initialized. Next run: daily at midnight UTC.');
  
  // Requirement: The application must contain at least 3 articles when checked.
  // Running the job immediately ensures at least one article is generated right away,
  // complementing the 3 initial articles you added in init-db.sql.
  createNewArticle(); 
}