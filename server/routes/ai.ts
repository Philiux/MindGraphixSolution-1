import { RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleGeneratePdf: RequestHandler = async (req, res) => {
  try {
    const data = req.body;
    if (!data) return res.status(400).json({ error: 'No data provided' });

    // Simple HTML template
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Devis - ${data.client?.name || 'Client'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111 }
            h1 { color: #0b69ff }
            .section { margin-bottom: 16px }
            .label { font-weight: bold }
            .value { margin-left: 8px }
            .services { margin-top: 8px }
            table { width: 100%; border-collapse: collapse }
            td, th { padding: 8px; border: 1px solid #ddd }
          </style>
        </head>
        <body>
          <h1>Devis - ${data.project?.title || ''}</h1>
          <div class="section">
            <div><span class="label">Client:</span><span class="value">${data.client?.name || ''} (${data.client?.email || ''})</span></div>
            <div><span class="label">Téléphone:</span><span class="value">${data.client?.phone || ''}</span></div>
          </div>
          <div class="section">
            <div class="label">Description du projet</div>
            <div class="value">${(data.project?.description || '').replace(/\n/g,'<br/>')}</div>
          </div>
          <div class="section">
            <div class="label">Services demandés</div>
            <div class="services">
              <ul>
                ${(data.services || []).map((s:any)=>`<li>${s.name} - ${s.description || ''}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="section">
            <table>
              <thead><tr><th>Item</th><th>Qte</th><th>Prix Unitaire</th><th>Total</th></tr></thead>
              <tbody>
                ${(data.services || []).map((s:any)=>`<tr><td>${s.name}</td><td>${s.quantity||1}</td><td>${s.unitPrice||0}</td><td>${(s.quantity||1)*(s.unitPrice||0)}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    // Use puppeteer to render
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const outDir = path.join(process.cwd(), 'public', 'generated');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const fileName = `devis_${Date.now()}.pdf`;
    const filePath = path.join(outDir, fileName);

    await page.pdf({ path: filePath, format: 'A4', printBackground: true });
    await browser.close();

    const url = `/generated/${fileName}`;
    res.json({ url, file: fileName });
  } catch (e) {
    console.error('PDF generation error', e);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
