// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// 初始化資料庫表
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_id VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        clicks INTEGER DEFAULT 0
      );
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// 創建短網址
export async function createShortUrl(originalUrl: string, shortId: string) {
  try {
    const result = await sql`
      INSERT INTO urls (original_url, short_id)
      VALUES (${originalUrl}, ${shortId})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    throw error;
  }
}

// 獲取原始網址
export async function getOriginalUrl(shortId: string) {
  try {
    const result = await sql`
      UPDATE urls 
      SET clicks = clicks + 1 
      WHERE short_id = ${shortId}
      RETURNING original_url
    `;
    return result[0]?.original_url;
  } catch (error) {
    throw error;
  }
}