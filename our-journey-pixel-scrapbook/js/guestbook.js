const guestForm = document.getElementById("guestForm");
const guestList = document.getElementById("guestList");
const saveProgress = document.getElementById("saveProgress");
const saveMessage = document.getElementById("saveMessage");

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwDjSIMzVWoEMssEfjdCuYmYBwJbIGrCH0HIqmenLilBg9AOUHTfUJ6fZwIBchSbO8O/exec";

const SPAM_COOLDOWN = 30 * 1000;
const LAST_SUBMIT_KEY = "ourJourneyLastMemorySubmit";
let memoryCache = [];

if (guestForm) {
  guestForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    event.stopPropagation();

    const now = Date.now();
    const lastSubmit = Number(localStorage.getItem(LAST_SUBMIT_KEY) || 0);
    const remaining = SPAM_COOLDOWN - (now - lastSubmit);

    if (remaining > 0) {
      alert(
        `Please wait ${Math.ceil(
          remaining / 1000,
        )} seconds before sending another memory.`,
      );
      return false;
    }

    const nameInput = document.getElementById("guestName");
    const messageInput = document.getElementById("guestMessage");

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !message) return false;

    const submitButton =
      guestForm.querySelector("button[type='submit']") ||
      guestForm.querySelector("button");

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Saving...";
    }

    const newMemory = {
      name,
      message,
      created_at: new Date().toISOString(),
    };

    memoryCache.unshift(newMemory);
    renderMemories(memoryCache);

    const success = await saveMemory(name, message);

    if (success) {
      localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
      guestForm.reset();

      setTimeout(async () => {
        await loadDefaultGuestbook();
      }, 1500);
    } else {
      memoryCache = memoryCache.filter((item) => item !== newMemory);
      renderMemories(memoryCache);
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Leave Memory";
    }

    return false;
  });
}

if (saveProgress) {
  saveProgress.addEventListener("click", function () {
    try {
      if (typeof selectSound !== "undefined") {
        selectSound.currentTime = 0;
        selectSound.play();
      }
    } catch {}

    if (saveMessage) {
      saveMessage.textContent =
        "Journey Saved 100% - Next Chapter: Coming Soon ♥";
    }
  });
}

async function getMemories() {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Gagal mengambil memories dari Google Sheet:", error);
    return [];
  }
}

async function saveMemory(name, message) {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        name: name,
        message: message,
      }),
    });

    return true;
  } catch (error) {
    console.error("Gagal menyimpan memory ke Google Sheet:", error);
    alert("Ucapan gagal dikirim. Cek Google Apps Script.");
    return false;
  }
}

function renderMemories(memories) {
  if (!guestList) return;

  if (!memories || !memories.length) {
    guestList.innerHTML = `
      <div class="guest-item">
        <strong>System:</strong><br />
        Semoga setiap chapter kalian selalu hangat dan lucu ♥
      </div>
    `;
    return;
  }

  guestList.innerHTML = memories
    .map(function (item) {
      return `
        <div class="guest-item">
          <strong>${escapeHTML(item.name)}:</strong>
          <div class="guest-date">
            ${formatMemoryDate(item.created_at)}
          </div>
          <br />
          ${escapeHTML(item.message)}
        </div>
      `;
    })
    .join("");
}

function formatMemoryDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) +
    " • " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  );
}

async function loadDefaultGuestbook() {
  memoryCache = await getMemories();
  renderMemories(memoryCache);
}

setInterval(async () => {
  await loadDefaultGuestbook();
}, 10000);

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
