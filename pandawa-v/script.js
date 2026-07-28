// Logika Membuka Amplop dan Memutar Musik
function bukaUndangan() {
  const envelope = document.getElementById("envelope-screen");
  const mainContent = document.getElementById("main-content");
  const audio = document.getElementById("bgm");

  // Play musik (browser mengizinkan autoplay jika ada interaksi klik)
  audio.play().catch((error) => console.log("Audio play failed:", error));

  // Animasi envelope menghilang
  envelope.style.transform = "translateY(-100vh)";
  envelope.style.opacity = "0";

  // Tampilkan konten utama
  mainContent.style.display = "block";

  // Hapus envelope dari DOM setelah animasi selesai (1 detik)
  setTimeout(() => {
    envelope.style.display = "none";
  }, 1000);
}

// Logika Navigasi Tab Panitia
function openTab(event, tabId) {
  // Sembunyikan semua tab content
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
  });

  // Hapus class active dari semua tombol
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  // Tampilkan tab yang dipilih
  document.getElementById(tabId).classList.add("active");

  // Tambahkan class active ke tombol yang diklik
  event.currentTarget.classList.add("active");
}
