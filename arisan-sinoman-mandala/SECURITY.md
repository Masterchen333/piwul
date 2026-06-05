# Catatan Keamanan Admin

Jangan simpan Admin ID, password, token Google Sheet, atau private key di `index.html`, `app.js`, file JSON, atau Google Sheet publik.

## Rekomendasi aman

1. Login admin diproses lewat backend/serverless API, bukan dicek di browser.
2. Password disimpan dalam bentuk hash bcrypt, bukan teks asli.
3. Secret seperti `JWT_SECRET`, `GOOGLE_PRIVATE_KEY`, dan `GOOGLE_SERVICE_ACCOUNT_EMAIL` disimpan di Vercel Environment Variables.
4. Data Google Sheet privat dibaca oleh `/api/sheets`, lalu frontend hanya menerima data yang boleh dilihat anggota.
5. Jangan pakai Google Sheet sebagai database password mentah.

## Opsi sederhana

Untuk tahap awal, gunakan:
- Google Sheet untuk data laporan kas/tabungan.
- Supabase Auth atau Firebase Auth untuk login admin.
- Vercel Environment Variables untuk semua secret.
