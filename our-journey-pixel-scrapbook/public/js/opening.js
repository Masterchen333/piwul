const appState = {
  config: null,
  wedding: null,
  isPlaying: false,
  fadeInterval: null,
};

const OPENING_TRACKING_URL =
  "https://script.google.com/macros/s/AKfycbwDjSIMzVWoEMssEfjdCuYmYBwJbIGrCH0HIqmenLilBg9AOUHTfUJ6fZwIBchSbO8O/exec";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

const opening = document.getElementById("opening");
const openInvitation = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const paperSound = document.getElementById("paperSound");
const selectSound = document.getElementById("selectSound");
const musicControl = document.getElementById("musicControl");

function getGuestNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  const rawName = params.get("to");

  if (!rawName) return "";

  return rawName.replaceAll("+", " ").trim();
}

function isInvitationMode() {
  return getGuestNameFromURL().length > 0;
}

if (openInvitation) {
  openInvitation.addEventListener("click", () => {
    try {
      paperSound.currentTime = 0;
      paperSound.play();
    } catch {}

    if (opening) opening.classList.add("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (musicControl) musicControl.classList.add("show");
    const npcGuide = document.getElementById("npcGuide");

    if (npcGuide) {
      npcGuide.classList.remove("npc-hidden");

      setTimeout(() => {
        showNPCBubble();
      }, 500);
    }

    try {
      startDialogCutscene();
    } catch (error) {
      console.error("Cutscene error:", error);
    }

    playMusicFadeIn();
  });
}

if (musicControl) {
  musicControl.addEventListener("click", async () => {
    try {
      selectSound.currentTime = 0;
      selectSound.play();
    } catch {}

    if (appState.isPlaying) {
      music.pause();
      appState.isPlaying = false;
      musicControl.textContent = "▶";
    } else {
      await playMusicFadeIn();
    }
  });
}

async function loadConfig() {
  try {
    const response = await fetch("./data/journey.json");
    appState.config = await response.json();

    if (isInvitationMode()) {
      try {
        const weddingResponse = await fetch("./data/wedding.json");
        appState.wedding = await weddingResponse.json();
      } catch (error) {
        console.error("Failed to load wedding.json:", error);
      }
    }

    music.src = appState.config.assets.music;
    paperSound.src = appState.config.assets.paperSound;
    selectSound.src = appState.config.assets.selectSound;

    music.load();
    paperSound.load();
    selectSound.load();

    fillJourneyContent();
    setupNPCGuide();
    guideBtn.addEventListener("click", () => {
      showNPCBubble();

      panel.classList.toggle("show");
      panel.setAttribute("aria-hidden", !panel.classList.contains("show"));
    });

    if (isInvitationMode()) {
      fillInvitationContent();
      markInvitationOpened();
      setupRSVP();
      setupGiftCopy();
      setupSecretLetter();
      setTimeout(() => {
        unlockAchievement("Achievement Unlocked!", "First Visit +100 XP", "🌸");
      }, 900);
    } else {
      hideWeddingSection();
    }

    try {
      updateJourneyCounter();
    } catch (error) {
      console.error("Counter error:", error);
    }

    try {
      await renderTimeline();
    } catch (error) {
      console.error("Timeline error:", error);
    }

    try {
      loadDefaultGuestbook();
    } catch (error) {
      console.error("Guestbook error:", error);
    }
  } catch (error) {
    console.error("Load config error:", error);
  }
}

async function playMusicFadeIn() {
  try {
    clearInterval(appState.fadeInterval);

    music.volume = 0;
    await music.play();

    appState.isPlaying = true;

    if (musicControl) musicControl.textContent = "♪";

    let volume = 0;

    appState.fadeInterval = setInterval(() => {
      volume += 0.02;

      if (volume >= 0.85) {
        volume = 0.85;
        clearInterval(appState.fadeInterval);
      }

      music.volume = volume;
    }, 100);
  } catch (error) {
    appState.isPlaying = false;
    if (musicControl) musicControl.textContent = "▶";
  }
}

function fillJourneyContent() {
  const { site, couple, startDate, ending } = appState.config;

  document.title = `${site.title} - Pixel Scrapbook`;

  setHTML("openingTitle", site.title.replace(" ", "<br />").toUpperCase());
  setText("openingSubtitle", site.subtitle);
  setText("openingNote", site.openingNote);

  if (openInvitation) openInvitation.textContent = site.startButton;

  setText("storyLabel", couple.label.toUpperCase());
  setText("heroTitle", site.title.toUpperCase());
  setText("heroSubtitle", site.subtitle);
  setText("personA", couple.personA);
  setText("personB", couple.personB);

  setText("sinceText", `Sejak ${formatDate(startDate)}`);
  setText("endingTitle", ending.title);
  setText("endingText", ending.text);
  setText("saveProgress", ending.button);
}

function fillInvitationContent() {
  const guestName = getGuestNameFromURL();
  const wedding = appState.wedding;

  setHTML("openingTitle", "WEDDING<br />INVITATION");
  setText("openingSubtitle", "Kepada Yth.");
  setText("openingNote", guestName);

  if (openInvitation) openInvitation.textContent = "BUKA UNDANGAN";

  const weddingSection = document.getElementById("wedding");
  if (weddingSection) weddingSection.classList.remove("hidden-wedding");

  const loveLetterSection = document.getElementById("loveLetterSection");
  if (loveLetterSection)
    loveLetterSection.classList.remove("hidden-love-letter");

  setText("loveLetterGreeting", `Dear ${guestName},`);

  const giftSection = document.getElementById("giftSection");
  if (giftSection) giftSection.classList.remove("hidden-gift");

  if (!wedding) return;

  setText("weddingTitle", wedding.title || "Our Wedding Day");
  setText("weddingSubtitle", wedding.subtitle || "");
  setText("guestGreeting", `Kepada Yth. ${guestName}`);
  setText("weddingMessage", wedding.message || "");

  if (wedding.akad) {
    setText("akadTitle", wedding.akad.title || "Akad Nikah");
    setText(
      "akadDate",
      `${wedding.akad.date || ""} • ${wedding.akad.time || ""}`,
    );
    setText("akadPlace", wedding.akad.place || "");
    setText("akadAddress", wedding.akad.address || "");
  }

  if (wedding.resepsi) {
    setText("resepsiTitle", wedding.resepsi.title || "Resepsi");
    setText(
      "resepsiDate",
      `${wedding.resepsi.date || ""} • ${wedding.resepsi.time || ""}`,
    );
    setText("resepsiPlace", wedding.resepsi.place || "");
    setText("resepsiAddress", wedding.resepsi.address || "");
  }

  const mapsLink = document.getElementById("mapsLink");
  if (mapsLink && wedding.maps) mapsLink.href = wedding.maps;
}

async function markInvitationOpened() {
  const guest = getGuestNameFromURL();

  if (!guest) return;

  try {
    await fetch(OPENING_TRACKING_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        type: "opened",
        name: guest,
      }),
    });
  } catch (error) {
    console.log("Tracking opened failed:", error);
  }
}

function setupRSVP() {
  const guest = getGuestNameFromURL();
  const buttons = document.querySelectorAll(".rsvp-btn");
  const rsvpMessage = document.getElementById("rsvpMessage");

  if (!guest || !buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const rsvp = button.dataset.rsvp;

      buttons.forEach((btn) => {
        btn.disabled = true;
        btn.textContent = "SAVING...";
      });

      try {
        await fetch(OPENING_TRACKING_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            type: "rsvp",
            name: guest,
            rsvp,
          }),
        });

        if (rsvpMessage) {
          rsvpMessage.textContent = `RSVP saved: ${rsvp} ♥`;
        }

        if (rsvp === "Attending") {
          playPixelConfetti();

          unlockAchievement(
            "Achievement Unlocked!",
            "Wedding Supporter +250 XP",
            "💌",
          );

          setTimeout(() => {
            showSecretLetter();
          }, 500);
        }
      } catch (error) {
        console.error("RSVP failed:", error);

        if (rsvpMessage) {
          rsvpMessage.textContent = "Failed to save RSVP.";
        }
      }

      buttons.forEach((btn) => {
        btn.disabled = false;
      });

      if (buttons[0]) buttons[0].textContent = "YES, I WILL ATTEND";
      if (buttons[1]) buttons[1].textContent = "SORRY, I CAN'T";
    });
  });
}

function setupGiftCopy() {
  const copyButton = document.getElementById("copyGiftNumber");
  const giftNumber = document.getElementById("giftBankNumber");
  const message = document.getElementById("giftCopyMessage");

  if (!copyButton || !giftNumber) return;

  copyButton.addEventListener("click", async () => {
    const number = giftNumber.textContent.trim();

    try {
      await navigator.clipboard.writeText(number);

      if (message) {
        message.textContent = "Nomor rekening berhasil disalin ♥";
        unlockAchievement(
          "Achievement Unlocked!",
          "Generous Heart +200 XP",
          "🎁",
        );
      }
    } catch (error) {
      if (message) {
        message.textContent = "Gagal menyalin. Silakan salin manual ya.";
      }
    }
  });
}

function hideWeddingSection() {
  const weddingSection = document.getElementById("wedding");
  if (weddingSection) weddingSection.classList.add("hidden-wedding");

  const loveLetterSection = document.getElementById("loveLetterSection");
  if (loveLetterSection) loveLetterSection.classList.add("hidden-love-letter");

  const giftSection = document.getElementById("giftSection");
  if (giftSection) giftSection.classList.add("hidden-gift");
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function setHTML(id, html) {
  const element = document.getElementById(id);
  if (element) element.innerHTML = html;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function playPixelConfetti() {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;

  const pieces = ["🌸", "💗", "✨", "🎉", "♥"];

  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = pieces[Math.floor(Math.random() * pieces.length)];

    piece.style.setProperty("--x", `${Math.random() * 260 - 130}px`);
    piece.style.setProperty("--y", `${Math.random() * -260 - 40}px`);
    piece.style.left = `${Math.random() * 70 + 15}%`;
    piece.style.top = `${Math.random() * 20 + 45}%`;

    layer.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 1300);
  }
}

function showSecretLetter() {
  const guestName = getGuestNameFromURL();
  const modal = document.getElementById("secretLetterModal");
  const greeting = document.getElementById("secretLetterGreeting");

  if (!modal) return;

  if (greeting) {
    greeting.textContent = `Dear ${guestName || "Guest"},`;
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}

function setupSecretLetter() {
  const modal = document.getElementById("secretLetterModal");
  const closeBtn = document.getElementById("secretLetterClose");

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener("click", closeSecretLetter);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeSecretLetter();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSecretLetter();
    }
  });
}

function closeSecretLetter() {
  const modal = document.getElementById("secretLetterModal");

  if (!modal) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

function unlockAchievement(title, text, icon = "🏆") {
  const toast = document.getElementById("achievementToast");
  const titleElement = document.getElementById("achievementTitle");
  const textElement = document.getElementById("achievementText");
  const iconElement = toast?.querySelector(".achievement-icon");

  if (!toast || !titleElement || !textElement || !iconElement) return;

  iconElement.textContent = icon;
  titleElement.textContent = title;
  textElement.textContent = text;

  toast.classList.remove("show");

  setTimeout(() => {
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");
    toast.setAttribute("aria-hidden", "true");
  }, 4200);
}

function setupNPCGuide() {
  const guideBtn = document.getElementById("npcGuideBtn");
  const panel = document.getElementById("npcPanel");
  const closeBtn = document.getElementById("npcCloseBtn");
  const menuButtons = document.querySelectorAll(".npc-menu button");

  if (!guideBtn || !panel) return;

  guideBtn.addEventListener("click", () => {
    panel.classList.toggle("show");
    panel.setAttribute("aria-hidden", !panel.classList.contains("show"));
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      panel.classList.remove("show");
      panel.setAttribute("aria-hidden", "true");
    });
  }

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetSelector = button.dataset.target;
      const target = document.querySelector(targetSelector);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        panel.classList.remove("show");
        panel.setAttribute("aria-hidden", "true");
      }
    });
  });
}

function showNPCBubble() {
  const bubble = document.querySelector(".npc-bubble");

  if (!bubble) return;

  bubble.classList.remove("hide");
  bubble.classList.add("show");

  clearTimeout(bubble.hideTimer);

  bubble.hideTimer = setTimeout(() => {
    bubble.classList.remove("show");
    bubble.classList.add("hide");
  }, 2800); // 2.8 detik
}

loadConfig();
