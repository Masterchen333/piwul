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
  });
});
