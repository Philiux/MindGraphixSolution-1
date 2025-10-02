import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://mind:mindpass@localhost:5432/mindgraphix";

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}

export async function initDb() {
  // Create quotes table if not exists
  const sql = `
    CREATE TABLE IF NOT EXISTS quotes (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      phone TEXT,
      service TEXT,
      message TEXT,
      files JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  `;
  await query(sql);
}
