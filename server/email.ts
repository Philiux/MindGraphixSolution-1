import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.SMTP_HOST || 'localhost';
const port = Number(process.env.SMTP_PORT || 1025);

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false,
  tls: { rejectUnauthorized: false },
});

export async function sendQuoteNotification(to: string, subject: string, text: string, html?: string) {
  const from = process.env.SMTP_FROM || 'no-reply@mindgraphix.local';
  const info = await transporter.sendMail({ from, to, subject, text, html });
  console.log('Email sent:', info.messageId);
  return info;
}
