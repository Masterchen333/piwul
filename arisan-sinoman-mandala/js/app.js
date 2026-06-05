const rupiah = (num) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(num || 0));

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

let state = {
  nextArisan: {
    host: "-",
    date: "-",
    address: "-",
    winner: "-",
  },
  cash: [],
  savings: [],
  minutes: [],
  announcements: [],
};

async function loadData() {
  try {
    const response = await fetch("/api/sheets", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.error || "Gagal mengambil data");
    }

    state = {
      nextArisan: data.nextArisan || state.nextArisan,
      cash: data.cash || [],
      savings: data.savings || [],
      minutes: data.minutes || [],
      announcements: data.announcements || [],
    };

    renderAll();
  } catch (error) {
    console.error("LOAD DATA ERROR:", error);
    alert("Gagal mengambil data dari Google Sheet: " + error.message);
  }
}

function renderAll() {
  renderNextArisan();
  renderStats();
  renderFilters();
  renderCashTable();
  renderSavings();
  renderMinutes();
  renderAnnouncements();
}

function getCashDate(item) {
  const rawDate = String(item.date || "").trim();
  const parsedDate = new Date(rawDate);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  const monthText = String(item.month || "").trim();
  const parts = monthText.split(" ");
  const monthName = parts[0];
  const year = Number(parts[1]);

  const monthIndex = monthNames.findIndex(
    (m) => m.toLowerCase() === String(monthName || "").toLowerCase(),
  );

  if (monthIndex >= 0 && year) {
    return new Date(year, monthIndex, 1);
  }

  return null;
}

function renderNextArisan() {
  const next = state.nextArisan || {};

  nextHost.textContent = next.host || "-";
  nextDate.textContent = next.date || "-";
  nextAddress.textContent = next.address || "-";

  scheduleHost.textContent = next.host || "-";
  scheduleMonth.textContent = next.date || "-";
  schedulePlace.textContent = next.address || "-";
  winnerName.textContent = next.winner || "-";
}

function renderStats() {
  const income = state.cash
    .filter((x) => x.type === "in")
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const expense = state.cash
    .filter((x) => x.type === "out")
    .reduce((sum, x) => sum + Number(x.amount || 0), 0);

  const savings = state.savings.reduce(
    (sum, x) => sum + Number(x.amount || 0),
    0,
  );

  totalIncome.textContent = rupiah(income);
  totalExpense.textContent = rupiah(expense);
  totalKas.textContent = rupiah(income - expense);
  totalSavings.textContent = rupiah(savings);
}

function renderFilters() {
  const currentMonth = monthFilter.value || "all";
  const currentYear = yearFilter.value || "all";

  const months = [
    ...new Set(
      state.cash
        .map((item) => {
          const date = getCashDate(item);
          if (!date) return null;
          return String(date.getMonth() + 1);
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(a) - Number(b));

  const years = [
    ...new Set(
      state.cash
        .map((item) => {
          const date = getCashDate(item);
          if (!date) return null;
          return String(date.getFullYear());
        })
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(b) - Number(a));

  monthFilter.innerHTML =
    `<option value="all">Semua Bulan</option>` +
    months
      .map((monthNumber) => {
        const label = monthNames[Number(monthNumber) - 1];
        return `<option value="${monthNumber}">${label}</option>`;
      })
      .join("");

  yearFilter.innerHTML =
    `<option value="all">Semua Tahun</option>` +
    years.map((year) => `<option value="${year}">${year}</option>`).join("");

  monthFilter.value = months.includes(currentMonth) ? currentMonth : "all";
  yearFilter.value = years.includes(currentYear) ? currentYear : "all";
}

function renderCashTable() {
  const selectedMonth = monthFilter.value || "all";
  const selectedYear = yearFilter.value || "all";

  const rows = state.cash.filter((item) => {
    const date = getCashDate(item);

    if (!date) return false;

    const itemMonth = String(date.getMonth() + 1);
    const itemYear = String(date.getFullYear());

    const matchMonth = selectedMonth === "all" || itemMonth === selectedMonth;
    const matchYear = selectedYear === "all" || itemYear === selectedYear;

    return matchMonth && matchYear;
  });

  if (!rows.length) {
    cashTable.innerHTML = `
      <tr>
        <td colspan="5">Belum ada data kas untuk filter ini.</td>
      </tr>
    `;
    return;
  }

  cashTable.innerHTML = rows
    .map(
      (item) => `
        <tr>
          <td>${formatDate(item.date)}</td>
          <td>${item.title || "-"}</td>
          <td>${item.category || "-"}</td>
          <td>
<span class="badge ${item.type}">
  ${item.type.toUpperCase()}
</span>
          </td>
          <td>${rupiah(item.amount)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderSavings() {
  if (!state.savings.length) {
    memberSavings.innerHTML = `<p class="muted">Belum ada data tabungan.</p>`;
    return;
  }

  const max = Math.max(...state.savings.map((x) => Number(x.amount || 0)), 1);

  memberSavings.innerHTML = state.savings
    .map((item) => {
      const amount = Number(item.amount || 0);
      const width = Math.max(8, (amount / max) * 100);

      return `
        <div class="member-item">
          <div>
            <span>${item.name || "-"}</span>
            <div class="progress">
              <span style="width:${width}%"></span>
            </div>
          </div>
          <strong>${rupiah(amount)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderMinutes() {
  if (!state.minutes.length) {
    minutesList.innerHTML = `<p class="muted">Belum ada notulen.</p>`;
    return;
  }

  minutesList.innerHTML = state.minutes
    .map(
      (item) => `
        <div class="note-item">
          <strong>${item.title || "-"}</strong>
          <p class="muted">${item.date || "-"}</p>
          <p>${item.body || "-"}</p>
        </div>
      `,
    )
    .join("");
}

function renderAnnouncements() {
  if (!state.announcements.length) {
    announcementList.innerHTML = `<p class="muted">Belum ada pengumuman.</p>`;
    return;
  }

  announcementList.innerHTML = state.announcements
    .map(
      (item) => `
        <div class="announcement-item">
          <strong>${item.title || "-"}</strong>
          <p>${item.body || "-"}</p>
        </div>
      `,
    )
    .join("");
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createWaText() {
  const n = state.nextArisan || {};

  return `*Arisan Sinoman Mandala*%0A%0AJadwal arisan berikutnya:%0A📅 ${
    n.date || "-"
  }%0A🏠 ${n.host || "-"}%0A📍 ${n.address || "-"}%0A%0APenerima bulan ini: ${
    n.winner || "-"
  }%0A%0AMohon hadir tepat waktu. Terima kasih.`;
}

function shareWhatsApp() {
  window.open(`https://wa.me/?text=${createWaText()}`, "_blank");
}

loginOpen.addEventListener("click", () => {
  loginModal.classList.add("show");
});

loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show");
});

async function checkAdminLogin() {
  const token = localStorage.getItem("admin_token");

  if (!token) return;

  try {
    const response = await fetch("/api/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      adminPanel.style.display = "block";
      loginModal.classList.remove("show");
    } else {
      localStorage.removeItem("admin_token");
      adminPanel.style.display = "none";
    }
  } catch (error) {
    console.error(error);
    adminPanel.style.display = "none";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = adminUsername.value.trim();
  const password = adminPassword.value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Login gagal");
      return;
    }

    localStorage.setItem("admin_token", data.token);

    loginModal.classList.remove("show");
    adminPanel.style.display = "block";

    alert("Login admin berhasil.");
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat login.");
  }
});

logoutAdmin.addEventListener("click", () => {
  localStorage.removeItem("admin_token");
  adminPanel.style.display = "none";
  alert("Admin logout.");
});

adminShareWa.addEventListener("click", shareWhatsApp);

monthFilter.addEventListener("change", renderCashTable);
yearFilter.addEventListener("change", renderCashTable);
shareWa.addEventListener("click", shareWhatsApp);
shareSchedule.addEventListener("click", shareWhatsApp);

checkAdminLogin();
loadData();
