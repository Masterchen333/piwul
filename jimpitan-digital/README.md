# 🪙 Jimpitan Digital RT

**Jimpitan Digital** adalah platform Web App berbasis kearifan lokal yang mengkomputasi dan mendigitalisasi pencatatan iuran jimpitan warga secara transparan, akuntabel, dan real-time.

Sistem ini mempertahankan kebiasaan sosiologis **penarikan manual rumah-ke-rumah** menggunakan **QR Code**, tetapi mengotomatisasi pencatatan kas, rekapitulasi, pelaporan keuangan, serta pelacakan tunggakan warga secara instan.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend & Routing:** Next.js (React) / Tailwind CSS
- **Hosting / Deployment:** [Vercel](https://vercel.app)
- **Database & CMS:** Google Sheets (Via Google Apps Script REST API)
- **Scanner QR:** `html5-qrcode` (Browser Camera Native)
- **Generator QR:** `qrcode.react` / `jspdf`

---

## 🚀 Fitur Utama

1. **Dashboard Transparansi Publik (Warga):**
   - Melihat total saldo kas RT secara real-time.
   - Laporan pengeluaran beserta foto/nota kuitansi.
   - Statistik keaktifan per Blok/Dawis (Persentase keterlibatan).

2. **Fitur Petugas Penarik (Mobile View):**
   - **Sistem Login Keamanan:** Wajib login dengan Username/ID & Password unik dari Admin.
   - **Scanner Kamera HP:** Scan QR Code rumah warga dalam hitungan detik.
   - **Deteksi Tunggakan Real-Time:** Menampilkan otomatis informasi penunggakan (misal: _2x tidak membayar_) beserta rincian tanggal Jumat yang terlewat & total tagihan.
   - **Fleksibilitas Pelayanan:** Opsi bayar lunas seluruh tunggakan sekaligus atau bayar pekan berjalan saja.
   - **Validasi Otomatis:** Mencegah _double scan_ pada Jumat yang sama.
   - **Rekap Setoran Lapangan:** Total nominal fisik yang terkumpul untuk dicocokkan sebelum disetor ke bendahara hari itu.

3. **Fitur Admin / Bendahara (Full Access):**
   - **Generate & Print QR Code:** Fitur cetak QR Code massal per warga/rumah.
   - **Manajemen Data Warga & Petugas:** Pengelolaan daftar rumah, pembagian Blok/Dawis, dan akun petugas.
   - **Pencatatan Kas Keluar:** Form input pengeluaran + upload foto kuitansi ke Google Drive.
   - **Audit Trail & Denormalisasi Data:** Memantau petugas yang menarik jimpitan di rumah tertentu lengkap dengan timestamp, ID Warga, dan **Nama Warga** langsung pada log transaksi.

---

## 📁 Struktur Folder Proyek

```text
jimpitan-digital/
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── page.js                 # Dashboard Publik Warga
│   │   ├── login/
│   │   │   └── page.js             # Login Multi-role (Admin/Petugas)
│   │   ├── petugas/
│   │   │   └── page.js             # Scanner QR, Interface Lapangan & Cek Tunggakan
│   │   ├── admin/
│   │   │   ├── page.js             # Dashboard Kelola Kas & Pengeluaran
│   │   │   └── generate-qr/
│   │   │       └── page.js         # Layout Print QR Code Warga
│   │   └── api/
│   │       └── jimpitan/route.js   # Proxy API ke Google Apps Script
│   └── components/
│       ├── Scanner.jsx
│       └── Header.jsx
├── .env.local
├── README.md
├── PRD.md
└── google-apps-script.js
```
