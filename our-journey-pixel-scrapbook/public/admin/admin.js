const guestName = document.getElementById("guestName");
const guestPhone = document.getElementById("guestPhone");
const generateBtn = document.getElementById("generateBtn");
const resultBox = document.getElementById("resultBox");

const BASE_URL = "https://piwul.vercel.app";

generateBtn.addEventListener("click", () => {
  const name = guestName.value.trim();
  const phone = guestPhone.value.trim();

  if (!name || !phone) {
    alert("Isi nama dan nomor WA dulu.");
    return;
  }

  const invitationLink = `${BASE_URL}/?to=${encodeURIComponent(name)}`;

  const message =
    `Kepada Yth. ${name}\n\n` +
    `Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.\n\n` +
    `Silakan buka undangan berikut:\n${invitationLink}\n\n` +
    `Terima kasih ♥`;

  const waLink = `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(
    message,
  )}`;

  resultBox.innerHTML = `
    <div class="guest-item">
      <strong>${escapeHTML(name)}</strong><br /><br />

      <small>Invitation Link:</small><br />
      <input value="${invitationLink}" readonly />

      <br /><br />

      <a class="pixel-btn" href="${waLink}" target="_blank">
        SEND WHATSAPP
      </a>
    </div>
  `;
});

function cleanPhone(phone) {
  return phone.replace(/\D/g, "").replace(/^0/, "62");
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
