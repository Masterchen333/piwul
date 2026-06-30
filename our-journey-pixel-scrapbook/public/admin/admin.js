console.log("ADMIN JS CLEAN v1 LOADED");

document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "https://piwul.vercel.app";
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwDjSIMzVWoEMssEfjdCuYmYBwJbIGrCH0HIqmenLilBg9AOUHTfUJ6fZwIBchSbO8O/exec";

  const ADMIN_SESSION_KEY = "piwulAdminToken";

  const adminLoginScreen = document.getElementById("adminLoginScreen");
  const adminWorld = document.getElementById("adminWorld");
  const adminPassword = document.getElementById("adminPassword");
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminLoginMessage = document.getElementById("adminLoginMessage");
  const logoutBtn = document.getElementById("logoutBtn");

  const guestName = document.getElementById("guestName");
  const guestPhone = document.getElementById("guestPhone");
  const generateBtn = document.getElementById("generateBtn");
  const resultBox = document.getElementById("resultBox");

  const dashboardBox = document.getElementById("dashboardBox");
  const searchGuest = document.getElementById("searchGuest");
  const filterGuest = document.getElementById("filterGuest");

  const adminLoginForm = document.getElementById("adminLoginForm");

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      handleAdminLogin();
    });
  }

  let guestData = [];
  let isLoggingIn = false;

  if (localStorage.getItem(ADMIN_SESSION_KEY)) {
    unlockAdmin();
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", handleAdminLogin);
  }

  if (adminPassword) {
    adminPassword.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleAdminLogin();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (!confirm("Logout dari Admin?")) return;
      localStorage.removeItem(ADMIN_SESSION_KEY);
      location.reload();
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", generateInvitation);
  }

  if (searchGuest) searchGuest.addEventListener("input", renderDashboard);
  if (filterGuest) filterGuest.addEventListener("change", renderDashboard);

  async function handleAdminLogin() {
    if (isLoggingIn) return;

    const password = adminPassword ? adminPassword.value.trim() : "";

    if (!password) {
      showLoginMessage("Password tidak boleh kosong.");
      return;
    }

    isLoggingIn = true;
    adminLoginBtn.disabled = true;
    adminLoginBtn.textContent = "CHECKING...";
    showLoginMessage("");

    try {
      const result = await jsonpRequest({
        type: "admin_login",
        password,
      });

      if (result && result.success) {
        localStorage.setItem(ADMIN_SESSION_KEY, result.token || "YES");
        unlockAdmin();
      } else {
        showLoginMessage("Password salah.");
        if (adminPassword) adminPassword.value = "";
      }
    } catch (error) {
      console.error("Login failed:", error);
      showLoginMessage("Login gagal. Cek koneksi.");
    }

    isLoggingIn = false;
    adminLoginBtn.disabled = false;
    adminLoginBtn.textContent = "LOGIN";
  }

  function unlockAdmin() {
    if (adminLoginScreen) adminLoginScreen.style.display = "none";
    if (adminWorld) adminWorld.classList.remove("admin-locked");
    loadDashboard();
  }

  function showLoginMessage(text) {
    if (adminLoginMessage) adminLoginMessage.textContent = text;
  }

  async function generateInvitation() {
    const name = guestName.value.trim();
    const phone = guestPhone.value.trim();

    if (!name || !phone) {
      alert("Isi nama dan nomor WA dulu.");
      return;
    }

    const cleanedPhone = cleanPhone(phone);
    const invitationLink = `${BASE_URL}/invite/${slugifyName(name)}`;

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

        <a class="pixel-btn" href="${escapeHTML(waLink)}" target="_blank" rel="noopener">
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

      setTimeout(loadDashboard, 1200);
    } catch (error) {
      console.error("Generate failed:", error);
    }

    generateBtn.disabled = false;
    generateBtn.textContent = "GENERATE LINK 🤍";
  }

  async function loadDashboard() {
    if (!dashboardBox) return;

    dashboardBox.innerHTML = `<div class="guest-item">Loading dashboard...</div>`;

    try {
      const data = await jsonpRequest({
        type: "guests",
      });

      guestData = Array.isArray(data) ? data : [];
      renderDashboard();
    } catch (error) {
      console.error("Dashboard failed:", error);
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
        <div class="stat-card">TOTAL<strong>${total}</strong>👥</div>
        <div class="stat-card">OPENED<strong>${opened}</strong>✉️</div>
        <div class="stat-card">NOT OPEN<strong>${total - opened}</strong>📭</div>
        <div class="stat-card">ATTEND<strong>${attending}</strong>✅</div>
        <div class="stat-card">PENDING<strong>${pending}</strong>⌛</div>
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

  function jsonpRequest(params) {
    return new Promise((resolve, reject) => {
      const callbackName =
        "jsonpCallback_" + Date.now() + "_" + Math.floor(Math.random() * 10000);

      const query = new URLSearchParams({
        ...params,
        callback: callbackName,
        t: Date.now(),
      });

      let script = document.createElement("script");

      window[callbackName] = function (data) {
        resolve(data);
        cleanup();
      };

      script.onerror = function () {
        reject(new Error("JSONP failed"));
        cleanup();
      };

      function cleanup() {
        delete window[callbackName];

        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }

        script = null;
      }

      script.src = `${GOOGLE_SCRIPT_URL}?${query.toString()}`;
      document.body.appendChild(script);
    });
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

  function slugifyName(name) {
    return String(name)
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "");
  }

  function escapeHTML(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
