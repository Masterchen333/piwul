const guestName = document.getElementById("guestName");
const guestPhone = document.getElementById("guestPhone");
const generateBtn = document.getElementById("generateBtn");
const resultBox = document.getElementById("resultBox");
const dashboardBox = document.getElementById("dashboardBox");

const BASE_URL = "https://piwul.vercel.app";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwDjSIMzVWoEMssEfjdCuYmYBwJbIGrCH0HIqmenLilBg9AOUHTfUJ6fZwIBchSbO8O/exec";

if (generateBtn) {
  generateBtn.addEventListener("click", async () => {
    const name = guestName.value.trim();
    const phone = guestPhone.value.trim();

    if (!name || !phone) {
      alert("Isi nama dan nomor WA dulu.");
      return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "SAVING...";

    const cleanedPhone = cleanPhone(phone);
    const invitationLink = `${BASE_URL}/?to=${encodeURIComponent(name)}`;

    const message =
      `Kepada Yth. ${name}\n\n` +
      `Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.\n\n` +
      `Silakan buka undangan berikut:\n${invitationLink}\n\n` +
      `Terima kasih ♥`;

    const waLink = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
      message,
    )}`;

    await saveGuestToSheet(name, cleanedPhone, invitationLink, waLink);

    resultBox.innerHTML = `
      <div class="guest-item">
        <strong>${escapeHTML(name)}</strong><br /><br />

        <small>Nomor WA:</small><br />
        <input value="${escapeHTML(cleanedPhone)}" readonly onclick="this.select()" />

        <br /><br />

        <small>Invitation Link:</small><br />
        <input value="${escapeHTML(invitationLink)}" readonly onclick="this.select()" />

        <br /><br />

        <a class="pixel-btn" href="${waLink}" target="_blank" rel="noopener">
          OPEN WHATSAPP
        </a>
      </div>
    `;

    await loadDashboard();

    generateBtn.disabled = false;
    generateBtn.textContent = "GENERATE LINK";
  });
}

async function saveGuestToSheet(name, phone, link, waLink) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        type: "guest",
        name,
        phone,
        link,
        waLink,
      }),
    });
  } catch (error) {
    console.error("Gagal menyimpan guest:", error);
    alert("Link berhasil dibuat, tapi gagal menyimpan ke Google Sheet.");
  }
}

async function loadDashboard() {
  if (!dashboardBox) return;

  try {
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=guests`);
    const guests = await response.json();

    const total = guests.length;
    const opened = guests.filter((g) => g.opened === "YES").length;
    const attending = guests.filter((g) => g.rsvp === "Attending").length;
    const declined = guests.filter((g) => g.rsvp === "Unable to Attend").length;
    const pending = total - attending - declined;

    dashboardBox.innerHTML = `
      <div class="guest-item">
        <strong>DASHBOARD</strong><br /><br />
        Total Guests: ${total}<br />
        Opened: ${opened}<br />
        Not Opened: ${total - opened}<br />
        Attending: ${attending}<br />
        Unable: ${declined}<br />
        Pending RSVP: ${pending}
      </div>

      ${guests
        .map(
          (guest) => `
            <div class="guest-item">
              <strong>${escapeHTML(guest.name || "-")}</strong><br />
              WA: ${escapeHTML(guest.phone || "-")}<br />
              Opened: ${escapeHTML(guest.opened || "NO")}<br />
              RSVP: ${escapeHTML(guest.rsvp || "-")}<br /><br />

              ${
                guest.link
                  ? `<a class="pixel-btn" href="${escapeHTML(guest.link)}" target="_blank" rel="noopener">OPEN LINK</a>`
                  : ""
              }

              ${
                guest.waLink
                  ? `<a class="pixel-btn" href="${escapeHTML(guest.waLink)}" target="_blank" rel="noopener">OPEN WA</a>`
                  : ""
              }
            </div>
          `,
        )
        .join("")}
    `;
  } catch (error) {
    console.error(error);

    dashboardBox.innerHTML = `
      <div class="guest-item">
        Failed to load dashboard.
      </div>
    `;
  }
}

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

loadDashboard();
