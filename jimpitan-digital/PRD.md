# Product Requirement Document (PRD) — Jimpitan Digital

## 1. Aturan Bisnis (Business Rules)

- **Nominal Fixed:** Rp 3.000 / minggu per rumah[cite: 2].
- **Jadwal Penarikan:** Setiap hari **Jumat**[cite: 2].
- **Segmentasi Wilayah:** Dibagi menjadi **3 Blok / Dawis**[cite: 2].
- **Metode Penarikan:** Manual fisik (Rumah ke Rumah) didampingi scan QR Code oleh petugas resmi[cite: 2].

---

## 2. Skema & Struktur Google Sheets (Database)

### Sheet 1: `Data_Warga`

| Column Name  | Data Type   | Description                             |
| :----------- | :---------- | :-------------------------------------- |
| `id_warga`   | String (PK) | Format: `WRG-BLK1-001`[cite: 2]         |
| `nama_warga` | String      | Nama Kepala Keluarga[cite: 2]           |
| `blok_dawis` | Enum        | `Blok 1` / `Blok 2` / `Blok 3`[cite: 2] |
| `qr_payload` | String      | Identifikasi Unik QR Code[cite: 2]      |
| `status`     | Enum        | `Aktif` / `Non-Aktif`[cite: 2]          |

### Sheet 2: `Data_Petugas`

| Column Name    | Data Type   | Description                             |
| :------------- | :---------- | :-------------------------------------- |
| `id_petugas`   | String (PK) | Format: `PTG-01`[cite: 2]               |
| `nama_petugas` | String      | Nama Petugas Penarik[cite: 2]           |
| `username`     | String      | Username Login[cite: 2]                 |
| `password`     | String      | Hash / PIN Keamanan[cite: 2]            |
| `blok_tugas`   | Enum        | `Blok 1` / `Blok 2` / `Blok 3`[cite: 2] |

### Sheet 3: `Transaksi_Jimpitan` (Kas Masuk & Denormalisasi)

| Column Name    | Data Type   | Description                                                          |
| :------------- | :---------- | :------------------------------------------------------------------- |
| `id_transaksi` | String (PK) | Auto-generated ID (`TRX-...`)[cite: 2]                               |
| `timestamp`    | Datetime    | Waktu pasti saat QR di-scan[cite: 2]                                 |
| `id_warga`     | String (FK) | Relasi ke `Data_Warga`[cite: 2]                                      |
| `nama_warga`   | String      | Nama Warga (Denormalisasi untuk kemudahan ekspor & laporan)[cite: 2] |
| `nominal`      | Number      | Fixed `3000` (atau kelipatannya saat bayar tunggakan)[cite: 2]       |
| `id_petugas`   | String (FK) | ID Petugas Penarik[cite: 2]                                          |
| `nama_petugas` | String      | Nama Petugas Penarik[cite: 2]                                        |

### Sheet 4: `Kas_Keluar`

| Column Name      | Data Type    | Description                                   |
| :--------------- | :----------- | :-------------------------------------------- |
| `id_pengeluaran` | String (PK)  | Auto-generated ID (`OUT-...`)[cite: 2]        |
| `tanggal`        | Date         | Tanggal Transaksi[cite: 2]                    |
| `kategori`       | String       | Kebersihan, Pembangunan, Duka, dll.[cite: 2]  |
| `nominal`        | Number       | Jumlah Pengeluaran[cite: 2]                   |
| `keterangan`     | Text         | Catatan Detail[cite: 2]                       |
| `url_nota`       | String (URL) | Link Gambar Kuitansi di Google Drive[cite: 2] |

---

## 3. Fitur Manajemen Tunggakan (Arrears Management)

### Aturan Bisnis Tunggakan:

1. **Otomatisasi Hitung Tunggakan:** Setiap QR Code di-scan, sistem secara _real-time_ mengecek riwayat tanggal Jumat yang belum tercatat transaksi pembayarannya di Google Sheets[cite: 2].
2. **Fleksibilitas Pelayanan:** Petugas diberikan opsi untuk menerima pembayaran lunas sekaligus (Tunggakan + Jumat Ini) atau hanya membayar untuk pekan berjalan[cite: 2].
3. **Pencatatan Multi-Transaksi:** Jika warga membayar tunggakan 2x sekaligus, sistem akan membuat 2 baris _record_ transaksi terpisah (atau akumulasi nominal) sesuai tanggal Jumat yang ditunggak beserta informasi `nama_warga` di setiap baris agar rekap bulanan tetap akurat[cite: 2].

### Tampilan Interface Petugas (UI/UX):

- **Peringatan Warna (Badging):**
  - 🟢 **Hijau:** Lunas / Tidak ada tunggakan[cite: 2].
  - 🟡 **Kuning:** Menunggak 1-2 minggu (Menampilkan rincian tanggal Jumat yang terlewat)[cite: 2].
  - 🔴 **Merah:** Menunggak ≥ 3 minggu (Butuh perhatian pengurus RT)[cite: 2].
- **Rincian Tanggal:** Menampilkan daftar tanggal Jumat mana saja yang belum terbayar secara eksplisit (misal: _2x tidak membayar: 24 Juli 2026, 31 Juli 2026_)[cite: 2].

---

## 4. Fitur Gamifikasi & Modal Sosial

1. **Badges / Status Warga:** Warga yang tidak pernah absen membayar jimpitan dalam 4 Jumat berturut-turut mendapat predikat _"Warga Taat Streak 4x"_[cite: 2].
2. **Inter-Block Leaderboard:** Menampilkan persentase pencapaian penarikan mingguan antara Blok 1, 2, dan 3 untuk memicu kompetisi positif antarwilayah[cite: 2].
