document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("open-btn");
  const envelopeScreen = document.getElementById("envelope-screen");
  const mainContent = document.getElementById("main-content");
  const bgMusic = document.getElementById("bg-music");

  openBtn.addEventListener("click", function () {
    // Tampilkan halaman utama
    mainContent.classList.remove("hidden");

    // Animasi amplop naik ke atas
    envelopeScreen.style.top = "-100vh";

    // Memutar musik latar
    // Catatan: Beberapa browser mewajibkan interaksi user sebelum memutar audio,
    // klik tombol ini sudah memenuhi syarat tersebut.
    if (bgMusic) {
      bgMusic.play().catch((error) => {
        console.log("Audio autoplay dicegah oleh browser:", error);
      });
    }

    // Hapus layar amplop dari DOM setelah animasi selesai agar tidak memberatkan
    setTimeout(() => {
      envelopeScreen.style.display = "none";
    }, 1000);
  });
});
