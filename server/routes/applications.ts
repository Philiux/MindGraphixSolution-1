import { RequestHandler } from "express";
import { z } from "zod";
import { query, initDb } from "../db";

const applicationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  position: z.string().optional(),
  message: z.string().optional(),
  files: z.array(z.object({ url: z.string(), name: z.string() })).optional(),
});

export const handleCreateApplication: RequestHandler = async (req, res) => {
  try {
    const parsed = applicationSchema.parse(req.body);
    await initDb();

    const sql = `
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        position TEXT,
        message TEXT,
        files JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;
    await query(sql);

    const result = await query(
      `INSERT INTO applications (name, email, phone, position, message, files) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        parsed.name,
        parsed.email,
        parsed.phone || null,
        parsed.position || null,
        parsed.message || null,
        parsed.files ? JSON.stringify(parsed.files) : null,
      ],
    );

    const created = result.rows[0];

    res.status(201).json({ application: created });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleListApplications: RequestHandler = async (_req, res) => {
  try {
    await initDb();
    const result = await query(`SELECT * FROM applications ORDER BY created_at DESC LIMIT 200`);
    res.json({ applications: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
