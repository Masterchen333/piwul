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
      ".polaroid-image img, .doc-item img",
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
  });
});
