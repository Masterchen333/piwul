// ==========================================
// 1. LOGIKA BUKA AMPLOP & MUSIK
// ==========================================
// Variable pencegah multi-click
let isOpeningEnvelope = false;

function bukaUndangan() {
  if (isOpeningEnvelope) return;
  isOpeningEnvelope = true;

  const envelopeScreen = document.getElementById("envelope-screen");
  const mainContent = document.getElementById("main-content");
  const audio = document.getElementById("bgm");

  // Putar musik latar
  if (audio) {
    audio
      .play()
      .catch((error) => console.log("Autoplay audio dicegah browser:", error));
  }

  if (envelopeScreen && mainContent) {
    // 1. Tampilkan class animasi fisik (flap terbuka, surat meluncur)
    envelopeScreen.classList.add("is-opening");

    // 2. Tampilkan main content di latar belakang
    mainContent.style.display = "block";

    // 3. Setelah animasi unboxing selesai, geser dan pudarkan amplop
    setTimeout(() => {
      envelopeScreen.style.transform = "translateY(-100vh) scale(0.9)";
      envelopeScreen.style.opacity = "0";

      setTimeout(() => {
        envelopeScreen.style.display = "none";
        // Picu animasi elemen saat pertama kali masuk
        revealElements();
      }, 700);
    }, 700);
  }
}

// ==========================================
// 2. LOGIKA ANIMASI SCROLL (REVEAL)
// ==========================================
function revealElements() {
  const reveals = document.querySelectorAll(".reveal");
  const windowHeight = window.innerHeight;
  const elementVisible = 100; // Jarak sebelum elemen muncul

  reveals.forEach((reveal) => {
    const elementTop = reveal.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealElements);

// ==========================================
// 3. LOGIKA TABS PANITIA
// ==========================================
function openTab(event, tabId) {
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((content) => content.classList.remove("active"));

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}

// ==========================================
// 4. EFEK KEMBANG API (FIREWORKS CANVAS)
// ==========================================
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

// Atur ukuran canvas menyesuaikan layar
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const colors = ["#ff0000", "#e62429", "#ffffff", "#f0f0f0", "#ffbaba"];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    // Arah ledakan menyebar (melingkar)
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1; // Kecepatan ledakan
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    this.alpha = 1;
    this.friction = 0.96; // Perlambatan di udara
    this.gravity = 0.04; // Efek gravitasi jatuh berjatuhan
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01; // Memudar perlahan
  }
}

// Fungsi memicu ledakan kembang api
function createFireworks(x, y) {
  const particleCount = 40; // Jumlah percikan per kembang api
  for (let i = 0; i < particleCount; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, color));
  }
}

// Loop animasi
function animateFireworks() {
  requestAnimationFrame(animateFireworks);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan frame sblmnya

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
}
animateFireworks();

// Tembakkan kembang api secara acak otomatis setiap beberapa detik
setInterval(() => {
  // Jangan tembakkan jika amplop belum dibuka
  if (document.getElementById("main-content").style.display === "block") {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2); // Meledak di bagian atas layar
    createFireworks(x, y);
  }
}, 1500); // Meledak tiap 1.5 detik
