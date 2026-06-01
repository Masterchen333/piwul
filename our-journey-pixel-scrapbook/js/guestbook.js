const guestForm = document.getElementById("guestForm");
const guestList = document.getElementById("guestList");
const saveProgress = document.getElementById("saveProgress");
const saveMessage = document.getElementById("saveMessage");

const SUPABASE_URL = "https://erhgqluzlnygskphahgu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9Z6eDE3iplmppmoUs4NRCA_3uadUufJ";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

if (guestForm) {
  guestForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    event.stopPropagation();

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

    const success = await saveMemory(name, message);

    if (success) {
      guestForm.reset();
      await loadDefaultGuestbook();
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
  const { data, error } = await supabaseClient
    .from("memories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil memories:", error);
    return [];
  }

  return data || [];
}

async function saveMemory(name, message) {
  const { error } = await supabaseClient.from("memories").insert([
    {
      name: name,
      message: message,
    },
  ]);

  if (error) {
    console.error("Gagal menyimpan memory:", error);
    alert("Ucapan gagal dikirim. Cek setting Supabase.");
    return false;
  }

  return true;
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
          <strong>${escapeHTML(item.name)}:</strong><br />
          ${escapeHTML(item.message)}
        </div>
      `;
    })
    .join("");
}

async function loadDefaultGuestbook() {
  const memories = await getMemories();
  renderMemories(memories);
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
