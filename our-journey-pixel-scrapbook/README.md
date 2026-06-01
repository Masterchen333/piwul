# Our Journey - Pixel Scrapbook / Visual Novel

Project ini adalah versi **Our Journey**, bukan wedding invitation. Cocok untuk timeline hubungan, album foto per tanggal, dan cerita visual novel pixel-art.

## Cara menjalankan di XAMPP

1. Copy folder `public` ke `htdocs/our-journey`.
2. Buka browser:
   `http://127.0.0.1/our-journey/`

## Cara deploy ke Vercel

1. Upload isi folder project ke GitHub.
2. Di Vercel, pilih project tersebut.
3. Framework: **Other** / static.
4. Output directory: `public`.

## Edit isi timeline

Buka file:

`public/data/journey.json`

Ubah bagian `chapters` untuk menambah / mengedit chapter:

```json
{
  "id": "first-meet",
  "icon": "🌱",
  "title": "First Meet",
  "date": "10 February 2026",
  "location": "Tempat pertama kenal",
  "background": "spring",
  "summary": "Cerita kamu di hari itu.",
  "quote": "It all started here...",
  "photos": [
    "./assets/photos/first-meet/photo-1.png"
  ]
}
```

## Ganti foto

Letakkan foto di folder:

`public/assets/photos/nama-chapter/`

Lalu sesuaikan path-nya di `journey.json`.

## Musik dan sound

Masukkan file berikut jika ada:

- `public/assets/music/wedding-theme.mp3`
- `public/assets/sounds/paper-open.mp3`
- `public/assets/sounds/select.wav`

Nama file boleh diganti, asal path di `journey.json` ikut diganti.

## Catatan Memory Book

Versi ini menyimpan pesan di `localStorage` browser, jadi hanya muncul di perangkat/browser yang sama. Untuk penyimpanan online permanen di Vercel, sambungkan ke Supabase/Firebase.
