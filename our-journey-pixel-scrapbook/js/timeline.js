const chapterList = document.getElementById("chapterList");
const timelineNav = document.getElementById("timelineNav");
const galleryModal = document.getElementById("galleryModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalClose = document.getElementById("modalClose");

function renderTimeline() {
  const chapters = appState.config.chapters;
  timelineNav.innerHTML = chapters.map(chapter => `
    <a class="timeline-dot" href="#${chapter.id}">
      <span>${chapter.icon}</span>
      <strong>${escapeHTML(chapter.title)}</strong>
      <small>${escapeHTML(chapter.date)}</small>
    </a>
  `).join("");

  chapterList.innerHTML = chapters.map((chapter, index) => `
    <section class="section pixel-box chapter chapter-${chapter.background}" id="${chapter.id}">
      <div class="chapter-header">
        <span class="chapter-badge">CHAPTER ${String(index + 1).padStart(2, "0")}</span>
        <h2>${chapter.icon} ${escapeHTML(chapter.title)}</h2>
        <p class="chapter-date">${escapeHTML(chapter.date)} • ${escapeHTML(chapter.location)}</p>
      </div>
      <p class="chapter-quote">“${escapeHTML(chapter.quote)}”</p>
      <p>${escapeHTML(chapter.summary)}</p>
      <div class="album-grid">${chapter.photos.map((photo, photoIndex) => `
        <button class="photo-frame" type="button" data-src="${photo}" data-caption="${escapeHTML(chapter.title)} - Foto ${photoIndex + 1}">
          <img src="${photo}" alt="${escapeHTML(chapter.title)} foto ${photoIndex + 1}" />
        </button>`).join("")}
      </div>
    </section>
  `).join("");
}

document.addEventListener("click", event => {
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
galleryModal.addEventListener("click", event => { if (event.target === galleryModal) closeGallery(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeGallery(); });
