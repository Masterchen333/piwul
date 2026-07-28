// Logika Membuka Amplop dan Memutar Musik
function bukaUndangan() {
  const envelope = document.getElementById("envelope-screen");
  const mainContent = document.getElementById("main-content");
  const audio = document.getElementById("bgm");

  // 1. Pengecekan aman: Putar musik JIKA tag audio-nya ditemukan
  if (audio) {
    audio
      .play()
      .catch((error) =>
        console.log("Audio diblokir browser atau file tidak ditemukan:", error),
      );
  } else {
    console.warn("Tag audio dengan id='bgm' tidak ditemukan.");
  }

  // 2. Jalankan animasi JIKA elemen amplop dan konten ditemukan
  if (envelope && mainContent) {
    // Animasi envelope naik ke atas
    envelope.style.transform = "translateY(-100vh)";
    envelope.style.opacity = "0";

    // Tampilkan konten utama
    mainContent.style.display = "block";

    // Hapus amplop secara permanen setelah 1 detik
    setTimeout(() => {
      envelope.style.display = "none";
    }, 1000);
  } else {
    console.error(
      "Error: Halaman amplop atau halaman utama tidak ditemukan di HTML.",
    );
  }
}

// Logika Navigasi Tab Panitia (Tetap sama)
function openTab(event, tabId) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}
