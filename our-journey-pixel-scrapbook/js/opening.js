const appState = { config: null, isPlaying: false, fadeInterval: null };

const opening = document.getElementById("opening");
const openInvitation = document.getElementById("openInvitation");
const music = document.getElementById("bgMusic");
const paperSound = document.getElementById("paperSound");
const selectSound = document.getElementById("selectSound");
const musicControl = document.getElementById("musicControl");

async function loadConfig() {
  const response = await fetch("./data/journey.json");
  appState.config = await response.json();

  music.src = appState.config.assets.music;
  paperSound.src = appState.config.assets.paperSound;
  selectSound.src = appState.config.assets.selectSound;

  fillJourneyContent();
  updateJourneyCounter();
  renderTimeline();
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
      if (volume >= 0.85) { volume = 0.85; clearInterval(appState.fadeInterval); }
      music.volume = volume;
    }, 100);
  } catch (error) {
    appState.isPlaying = false;
    musicControl.textContent = "▶";
  }
}

openInvitation.addEventListener("click", async () => {
  try { paperSound.currentTime = 0; paperSound.play(); } catch {}
  await playMusicFadeIn();
  opening.classList.add("hidden");
  musicControl.classList.add("show");
  startDialogCutscene();
});

musicControl.addEventListener("click", async () => {
  try { selectSound.currentTime = 0; selectSound.play(); } catch {}
  if (appState.isPlaying) { music.pause(); appState.isPlaying = false; musicControl.textContent = "▶"; }
  else { await playMusicFadeIn(); }
});

function fillJourneyContent() {
  const { site, couple, startDate, ending } = appState.config;
  document.title = `${site.title} - Pixel Scrapbook`;
  document.getElementById("openingTitle").innerHTML = site.title.replace(" ", "<br />").toUpperCase();
  document.getElementById("openingSubtitle").textContent = site.subtitle;
  document.getElementById("openingNote").textContent = site.openingNote;
  openInvitation.textContent = site.startButton;
  document.getElementById("storyLabel").textContent = couple.label.toUpperCase();
  document.getElementById("heroTitle").textContent = site.title.toUpperCase();
  document.getElementById("heroSubtitle").textContent = site.subtitle;
  document.getElementById("personA").textContent = couple.personA;
  document.getElementById("personB").textContent = couple.personB;
  document.getElementById("sinceText").textContent = `Sejak ${formatDate(startDate)}`;
  document.getElementById("endingTitle").textContent = ending.title;
  document.getElementById("endingText").textContent = ending.text;
  document.getElementById("saveProgress").textContent = ending.button;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

loadConfig();
