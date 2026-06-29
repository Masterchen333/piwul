const appState = {
  config: null,
  wedding: null,
  isPlaying: false,
  fadeInterval: null,
};

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

  return decodeURIComponent(rawName).replaceAll("+", " ").trim();
}

function isInvitationMode() {
  return Boolean(getGuestNameFromURL());
}

async function loadConfig() {
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

  if (isInvitationMode()) {
    fillInvitationContent();
  } else {
    hideWeddingSection();
  }

  updateJourneyCounter();
  await renderTimeline();
  loadDefaultGuestbook();
}

async function playMusicFadeIn() {
  try {
    clearInterval(appState.fadeInterval);

    music.volume = 0;
    await music.play();

    appState.isPlaying = true;
    musicControl.textContent = "♪";

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
    musicControl.textContent = "▶";
  }
}

openInvitation.addEventListener("click", async () => {
  try {
    paperSound.currentTime = 0;
    paperSound.play();
  } catch {}

  await playMusicFadeIn();

  opening.classList.add("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  musicControl.classList.add("show");
  startDialogCutscene();
});

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

function fillJourneyContent() {
  const { site, couple, startDate, ending } = appState.config;

  document.title = `${site.title} - Pixel Scrapbook`;

  document.getElementById("openingTitle").innerHTML = site.title
    .replace(" ", "<br />")
    .toUpperCase();

  document.getElementById("openingSubtitle").textContent = site.subtitle;
  document.getElementById("openingNote").textContent = site.openingNote;
  openInvitation.textContent = site.startButton;

  document.getElementById("storyLabel").textContent =
    couple.label.toUpperCase();

  document.getElementById("heroTitle").textContent = site.title.toUpperCase();
  document.getElementById("heroSubtitle").textContent = site.subtitle;
  document.getElementById("personA").textContent = couple.personA;
  document.getElementById("personB").textContent = couple.personB;

  document.getElementById("sinceText").textContent = `Sejak ${formatDate(
    startDate,
  )}`;

  document.getElementById("endingTitle").textContent = ending.title;
  document.getElementById("endingText").textContent = ending.text;
  document.getElementById("saveProgress").textContent = ending.button;
}

function fillInvitationContent() {
  const guestName = getGuestNameFromURL();
  const wedding = appState.wedding;

  document.getElementById("openingTitle").innerHTML = "WEDDING<br />INVITATION";
  document.getElementById("openingSubtitle").textContent = "Kepada Yth.";
  document.getElementById("openingNote").textContent = guestName;
  openInvitation.textContent = "BUKA UNDANGAN";

  const weddingSection = document.getElementById("wedding");

  if (weddingSection) {
    weddingSection.classList.remove("hidden-wedding");
  }

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

  if (mapsLink && wedding.maps) {
    mapsLink.href = wedding.maps;
  }
}

function hideWeddingSection() {
  const weddingSection = document.getElementById("wedding");

  if (weddingSection) {
    weddingSection.classList.add("hidden-wedding");
  }
}

function setText(id, text) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = text;
  }
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

loadConfig();
