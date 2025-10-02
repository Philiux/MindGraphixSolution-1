import { RequestHandler } from "express";
import { z } from "zod";
import { query, initDb } from "../db";

const quoteSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
  files: z.array(z.object({ url: z.string(), name: z.string() })).optional(),
});

export const handleCreateQuote: RequestHandler = async (req, res) => {
  try {
    const parsed = quoteSchema.parse(req.body);

    await initDb();

    const result = await query(
      `INSERT INTO quotes (name, email, phone, service, message, files) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [
        parsed.name,
        parsed.email,
        parsed.phone || null,
        parsed.service || null,
        parsed.message || null,
        parsed.files ? JSON.stringify(parsed.files) : null,
      ],
    );

    const created = result.rows[0];

    // Send notification email to admin in dev using MailHog
    try {
      const { sendQuoteNotification } = await import("../email");
      const adminEmail = process.env.ADMIN_EMAIL || "support@mindgraphix.com";
      await sendQuoteNotification(
        adminEmail,
        `Nouvelle demande de devis (#${created.id})`,
        `Une nouvelle demande de devis a été soumise par ${created.name} (${created.email}).\n\nMessage:\n${created.message || ''}`,
        `<p>Nouvelle demande de devis par <strong>${created.name}</strong> (${created.email})</p><p>Message: ${created.message || ''}</p>`,
      );
    } catch (e) {
      console.error('Failed to send notification email', e);
    }

    res.status(201).json({ quote: created });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleListQuotes: RequestHandler = async (req, res) => {
  try {
    await initDb();

    const { search, service, startDate, endDate, limit, offset } = req.query as Record<string, string | undefined>;

    const conditions: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR message ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    if (service) {
      conditions.push(`service = $${idx}`);
      params.push(service);
      idx++;
    }

    if (startDate) {
      conditions.push(`created_at >= $${idx}`);
      params.push(startDate);
      idx++;
    }

    if (endDate) {
      conditions.push(`created_at <= $${idx}`);
      params.push(endDate);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const lim = limit ? parseInt(limit as string, 10) : 200;
    const off = offset ? parseInt(offset as string, 10) : 0;

    const sql = `SELECT * FROM quotes ${where} ORDER BY created_at DESC LIMIT ${lim} OFFSET ${off}`;
    const result = await query(sql, params);
    res.json({ quotes: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const replySchema = z.object({
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const handleReplyQuote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const parsed = replySchema.parse(req.body);

    await initDb();
    const result = await query(`SELECT * FROM quotes WHERE id = $1 LIMIT 1`, [id]);
    const quote = result.rows[0];
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    const to = quote.email;
    try {
      const { sendQuoteNotification } = await import("../email");
      await sendQuoteNotification(
        to,
        parsed.subject,
        parsed.message,
        `<p>${parsed.message.replace(/\n/g, '<br/>')}</p>`,
      );
    } catch (e) {
      console.error('Failed to send reply email', e);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ ok: true });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ error: 'Validation failed', details: err.issues });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
