// Contoh endpoint Vercel Serverless Function untuk baca Google Sheet privat.
// Install: npm install googleapis
// Environment Variables di Vercel:
// GOOGLE_SERVICE_ACCOUNT_EMAIL=...
// GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const [cash, savings] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Kas!A2:E' }),
      sheets.spreadsheets.values.get({ spreadsheetId, range: 'Tabungan!A2:B' })
    ]);

    res.status(200).json({
      cash: (cash.data.values || []).map(([date, month, title, type, amount]) => ({
        date, month, title, category: type === 'in' ? 'Pemasukan' : 'Pengeluaran', type, amount: Number(amount || 0)
      })),
      savings: (savings.data.values || []).map(([name, amount]) => ({ name, amount: Number(amount || 0) }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membaca Google Sheet', detail: error.message });
  }
}
