// app/lib/db.ts
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const sql = neon(DATABASE_URL);

export async function createShortUrl(originalUrl: string, shortId: string) {
  try {
    const result = await sql`
      INSERT INTO urls (original_url, short_id)
      VALUES (${originalUrl}, ${shortId})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating short URL:', error);
    throw error;
  }
}

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
    console.error('Error getting original URL:', error);
    throw error;
  }
}