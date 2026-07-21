document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open-btn");
  const envelopeScreen = document.getElementById("envelope-screen");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bg-music");
  const envelopeWrapper = document.querySelector(".envelope-wrapper");

  openBtn.addEventListener("click", function () {
    // 1. Jalankan animasi CSS untuk membuka flap dan menaikkan surat
    envelopeWrapper.classList.add("is-open");

    // 2. Putar musik latar
    if (bgMusic) {
      bgMusic.play().catch((error) => {
        console.log("Audio autoplay dicegah oleh browser:", error);
      });
    }

    // 3. Tahan selama 1.2 detik agar user sempat melihat suratnya keluar dari amplop
    setTimeout(() => {
      mainContent.classList.remove("hidden");
      envelopeScreen.style.opacity = "0"; // Layar amplop perlahan menghilang
      envelopeScreen.style.top = "-100vh"; // Layar amplop ditarik ke atas
    }, 1200);

    // 4. Hapus elemen dari memori agar web tetap ringan
    setTimeout(() => {
      envelopeScreen.style.display = "none";
    }, 2000);

    // --- LOGIKA POP-UP GALERI FOTO ---

    const imageModal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeModal = document.querySelector(".close-modal");

    // Ambil semua gambar yang ada di dalam Photobooth dan Galeri Dokumentasi
    const clickableImages = document.querySelectorAll(
      ".polaroid-image img, .doc-item img, .prize-img-wrapper img",
    );

    // Jika gambar diklik, buka pop-up
    clickableImages.forEach((img) => {
      img.addEventListener("click", function () {
        modalImg.src = this.src; // Ambil sumber gambar yang diklik
        imageModal.classList.add("modal-show"); // Munculkan pop-up
      });
    });

    // Fungsi untuk menutup pop-up
    function closePopup() {
      imageModal.classList.remove("modal-show");
      // Hapus src setelah tertutup (opsional, agar saat dibuka ulang tidak ada kedipan)
      setTimeout(() => {
        modalImg.src = "";
      }, 300);
    }

    // Jika tombol (X) diklik, tutup pop-up
    closeModal.addEventListener("click", closePopup);

    // Jika area gelap di luar gambar diklik, tutup pop-up juga
    imageModal.addEventListener("click", function (event) {
      if (event.target === imageModal) {
        closePopup();
      }
    });

    // --- LOGIKA HITUNG MUNDUR (COUNTDOWN) ---

    // Tentukan waktu tujuan (16 Agustus 2026 pukul 07:00:00 WIB)
    const targetWaktu = new Date("August 15, 2026 07:00:00").getTime();

    // Jalankan pembaruan data setiap 1 detik
    const jalankanCountdown = setInterval(function () {
      const waktuSekarang = new Date().getTime();
      const selisihWaktu = targetWaktu - waktuSekarang;

      // Jika hitungan mundur selesai / sudah hari H
      if (selisihWaktu < 0) {
        clearInterval(jalankanCountdown);
        document.getElementById("cd-days").innerText = "00";
        document.getElementById("cd-hours").innerText = "00";
        document.getElementById("cd-minutes").innerText = "00";
        document.getElementById("cd-seconds").innerText = "00";

        const teksDeskripsi = document.querySelector(".countdown-desc");
        if (teksDeskripsi) {
          teksDeskripsi.innerText = "Acara sudah dimulai! Selamat berlomba! 🎉";
        }
        return;
      }

      // Rumus matematika konversi milidetik ke satuan waktu biasa
      const hitungHari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
      const hitungJam = Math.floor(
        (selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const hitungMenit = Math.floor(
        (selisihWaktu % (1000 * 60 * 60)) / (1000 * 60),
      );
      const hitungDetik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

      // Tampilkan angka ke HTML dengan format dua digit (misal: 05 jika di bawah 10)
      document.getElementById("cd-days").innerText =
        hitungHari < 10 ? "0" + hitungHari : hitungHari;
      document.getElementById("cd-hours").innerText =
        hitungJam < 10 ? "0" + hitungJam : hitungJam;
      document.getElementById("cd-minutes").innerText =
        hitungMenit < 10 ? "0" + hitungMenit : hitungMenit;
      document.getElementById("cd-seconds").innerText =
        hitungDetik < 10 ? "0" + hitungDetik : hitungDetik;
    }, 1000);
  });
});
