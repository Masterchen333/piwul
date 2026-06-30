document.addEventListener("DOMContentLoaded", () => {
  const guestName =
    document.getElementById("guestName") ||
    document.getElementById("adminGuestName");

  const guestPhone =
    document.getElementById("guestPhone") ||
    document.getElementById("adminGuestPhone");

  const generateBtn = document.getElementById("generateBtn");
  const resultBox = document.getElementById("resultBox");
  const dashboardBox = document.getElementById("dashboardBox");
  const searchGuest = document.getElementById("searchGuest");
  const filterGuest = document.getElementById("filterGuest");

  const BASE_URL = "https://piwul.vercel.app";
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwDjSIMzVWoEMssEfjdCuYmYBwJbIGrCH0HIqmenLilBg9AOUHTfUJ6fZwIBchSbO8O/exec";

  let guestData = [];

  if (!guestName || !guestPhone || !generateBtn || !resultBox) {
    alert(
      "Admin element tidak lengkap. Cek id input/button di admin/index.html.",
    );
    return;
  }

  if (searchGuest) searchGuest.addEventListener("input", renderDashboard);
  if (filterGuest) filterGuest.addEventListener("change", renderDashboard);

  generateBtn.addEventListener("click", async () => {
    const name = guestName.value.trim();
    const phone = guestPhone.value.trim();

    if (!name || !phone) {
      alert("Isi nama dan nomor WA dulu.");
      return;
    }

    const cleanedPhone = cleanPhone(phone);
    const invitationLink = `${BASE_URL}/?to=${encodeURIComponent(name)}`;

    const message =
      `Kepada Yth. ${name}\n\n` +
      `Dengan penuh kebahagiaan, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.\n\n` +
      `Silakan buka undangan berikut:\n${invitationLink}\n\n` +
      `Terima kasih ♥`;

    const waLink = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

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

    generateBtn.disabled = true;
    generateBtn.textContent = "SAVING...";

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
          phone: cleanedPhone,
          link: invitationLink,
          waLink,
        }),
      });

      setTimeout(loadDashboard, 1000);
    } catch (error) {
      console.error("Generate save failed:", error);
    }

    generateBtn.disabled = false;
    generateBtn.textContent = "GENERATE LINK";
  });

  async function loadDashboard() {
    if (!dashboardBox) return;

    try {
      dashboardBox.innerHTML = `<div class="guest-item">Loading dashboard...</div>`;

      const response = await fetch(
        `${GOOGLE_SCRIPT_URL}?type=guests&t=${Date.now()}`,
      );
      const data = await response.json();

      guestData = Array.isArray(data) ? data : [];
      renderDashboard();
    } catch (error) {
      console.error("Dashboard load failed:", error);
      dashboardBox.innerHTML = `<div class="guest-item">Failed to load dashboard.</div>`;
    }
  }

  function renderDashboard() {
    if (!dashboardBox) return;

    const keyword = searchGuest ? searchGuest.value.toLowerCase().trim() : "";
    const filter = filterGuest ? filterGuest.value : "all";

    const total = guestData.length;
    const opened = guestData.filter((g) => g.opened === "YES").length;
    const attending = guestData.filter((g) => g.rsvp === "Attending").length;
    const declined = guestData.filter(
      (g) => g.rsvp === "Unable to Attend",
    ).length;
    const pending = total - attending - declined;

    const filteredGuests = guestData.filter((guest) => {
      const name = String(guest.name || "").toLowerCase();
      const phone = String(guest.phone || "").toLowerCase();

      const matchKeyword =
        !keyword || name.includes(keyword) || phone.includes(keyword);

      const matchFilter =
        filter === "all" ||
        (filter === "opened" && guest.opened === "YES") ||
        (filter === "not-opened" && guest.opened !== "YES") ||
        (filter === "attending" && guest.rsvp === "Attending") ||
        (filter === "declined" && guest.rsvp === "Unable to Attend") ||
        (filter === "pending" && !guest.rsvp);

      return matchKeyword && matchFilter;
    });

    dashboardBox.innerHTML = `
      <div class="dashboard-stats">
        <div class="stat-card">TOTAL<strong>${total}</strong></div>
        <div class="stat-card">OPENED<strong>${opened}</strong></div>
        <div class="stat-card">NOT OPEN<strong>${total - opened}</strong></div>
        <div class="stat-card">ATTEND<strong>${attending}</strong></div>
        <div class="stat-card">PENDING<strong>${pending}</strong></div>
      </div>

      ${
        filteredGuests.length
          ? filteredGuests.map(renderGuestItem).join("")
          : `<div class="guest-item">No guest found.</div>`
      }
    `;
  }

  function renderGuestItem(guest) {
    const statusIcon =
      guest.rsvp === "Attending" ? "🟢" : guest.opened === "YES" ? "🟡" : "🔴";

    return `
      <div class="guest-item">
        <strong>${statusIcon} ${escapeHTML(guest.name || "-")}</strong><br />
        WA: ${escapeHTML(guest.phone || "-")}<br />
        Opened: ${escapeHTML(guest.opened || "NO")}<br />
        RSVP: ${escapeHTML(guest.rsvp || "-")}<br />
        <div class="guest-status">
          Opened At: ${guest.openedAt ? formatAdminDate(guest.openedAt) : "-"}<br />
          RSVP Time: ${guest.rsvpTime ? formatAdminDate(guest.rsvpTime) : "-"}
        </div>
        <br />
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
    `;
  }

  function formatAdminDate(value) {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
});
