const chapterList = document.getElementById("chapterList");
const timelineNav = document.getElementById("timelineNav");
const galleryModal = document.getElementById("galleryModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

const loadedChapters = new Map();

async function renderTimeline() {
  const chapterRefs = appState.config.chapters || [];

  timelineNav.innerHTML = chapterRefs
    .map(
      (chapter, index) => `
        <a class="timeline-dot" href="#${chapter.id}" data-index="${index}">
          <span>${chapter.icon || "📖"}</span>
          <strong>${escapeHTML(chapter.title || "Loading...")}</strong>
          <small>${escapeHTML(chapter.date || "")}</small>
        </a>
      `,
    )
    .join("");

  chapterList.innerHTML = chapterRefs
    .map(
      (chapter, index) => `
        <section
          class="section pixel-box chapter chapter-${chapter.background || "default"}"
          id="${chapter.id}"
        >
          <div class="chapter-header">
            <span class="chapter-badge">
              CHAPTER ${String(index + 1).padStart(2, "0")}
            </span>
            <h2>${chapter.icon || "📖"} ${escapeHTML(chapter.title || "Loading Chapter")}</h2>
            <p class="chapter-date">
              ${escapeHTML(chapter.date || "Klik untuk melihat")} ${
                chapter.location ? " • " + escapeHTML(chapter.location) : ""
              }
            </p>
          </div>

          <p class="chapter-quote">“${escapeHTML(chapter.quote || "Awas, spoiler ahead! 👀⚠️")}”</p>
          <p>${escapeHTML(chapter.summary || "Chapter ini akan dimuat ketika dipilih.")}</p>

          <button class="pixel-btn load-chapter-btn" type="button" data-index="${index}">
            KLIK CHAPTER
          </button>

          <div class="album-grid" id="album-${chapter.id}"></div>
        </section>
      `,
    )
    .join("");

  document.querySelectorAll(".timeline-dot").forEach((link) => {
    link.addEventListener("click", async function (event) {
      event.preventDefault();

      const index = Number(this.dataset.index);
      const chapter = await loadChapter(index);

      renderSingleChapter(chapter, index);

      document.getElementById(chapter.id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  document.querySelectorAll(".load-chapter-btn").forEach((button) => {
    button.addEventListener("click", async function () {
      const index = Number(this.dataset.index);
      const chapter = await loadChapter(index);

      renderSingleChapter(chapter, index);
    });
  });
}

async function loadChapter(index) {
  const chapterRef = appState.config.chapters[index];

  if (!chapterRef) return null;

  if (loadedChapters.has(chapterRef.id)) {
    return loadedChapters.get(chapterRef.id);
  }

  if (!chapterRef.file) {
    loadedChapters.set(chapterRef.id, chapterRef);
    return chapterRef;
  }

  try {
    const response = await fetch(chapterRef.file);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${chapterRef.file}`);
    }

    const chapterData = await response.json();

    const mergedChapter = {
      ...chapterRef,
      ...chapterData,
    };

    loadedChapters.set(chapterRef.id, mergedChapter);
    return mergedChapter;
  } catch (error) {
    console.error("Failed to load chapter:", chapterRef.file, error);
    return chapterRef;
  }
}

function renderSingleChapter(chapter, index) {
  if (!chapter) return;

  const section = document.getElementById(chapter.id);
  if (!section) return;

  section.className = `section pixel-box chapter chapter-${chapter.background || "default"}`;

  section.innerHTML = `
    <div class="chapter-header">
      <span class="chapter-badge">
        CHAPTER ${String(index + 1).padStart(2, "0")}
      </span>
      <h2>${chapter.icon || "📖"} ${escapeHTML(chapter.title || "Untitled Chapter")}</h2>
      <p class="chapter-date">
        ${escapeHTML(chapter.date || "")} ${
          chapter.location ? " • " + escapeHTML(chapter.location) : ""
        }
      </p>
    </div>

    <p class="chapter-quote">“${escapeHTML(chapter.quote || "")}”</p>
    <p>${escapeHTML(chapter.summary || "")}</p>

    <div class="album-grid">
      ${(chapter.photos || [])
        .map(function (photo, photoIndex) {
          const src = typeof photo === "string" ? photo : photo.src;
          const caption =
            typeof photo === "string"
              ? `${chapter.title} - Foto ${photoIndex + 1}`
              : photo.caption || `${chapter.title} - Foto ${photoIndex + 1}`;

          return `
            <button
              class="photo-frame"
              type="button"
              data-src="${escapeHTML(src)}"
              data-caption="${escapeHTML(caption)}"
            >
              <img
                src="${escapeHTML(src)}"
                alt="${escapeHTML(chapter.title)} foto ${photoIndex + 1}"
                loading="lazy"
              />
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

document.addEventListener("click", function (event) {
  const frame = event.target.closest(".photo-frame");
  if (!frame) return;

  modalImage.src = frame.dataset.src;
  modalCaption.textContent = frame.dataset.caption;
  galleryModal.classList.add("show");
  galleryModal.setAttribute("aria-hidden", "false");
});

function closeGallery() {
  galleryModal.classList.remove("show");
  galleryModal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

modalClose.addEventListener("click", closeGallery);

galleryModal.addEventListener("click", function (event) {
  if (event.target === galleryModal) closeGallery();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeGallery();
});
