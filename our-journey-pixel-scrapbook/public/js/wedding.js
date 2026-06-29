async function loadWeddingSection() {
  try {
    const response = await fetch("./data/wedding.json");
    const wedding = await response.json();

    if (!wedding.enabled) return;

    document.getElementById("weddingTitle").textContent = wedding.title;
    document.getElementById("weddingSubtitle").textContent = wedding.subtitle;
    document.getElementById("weddingMessage").textContent = wedding.message;

    document.getElementById("akadTitle").textContent = wedding.akad.title;
    document.getElementById("akadDate").textContent =
      `${wedding.akad.date} • ${wedding.akad.time}`;
    document.getElementById("akadPlace").textContent = wedding.akad.place;
    document.getElementById("akadAddress").textContent = wedding.akad.address;

    document.getElementById("resepsiTitle").textContent = wedding.resepsi.title;
    document.getElementById("resepsiDate").textContent =
      `${wedding.resepsi.date} • ${wedding.resepsi.time}`;
    document.getElementById("resepsiPlace").textContent = wedding.resepsi.place;
    document.getElementById("resepsiAddress").textContent =
      wedding.resepsi.address;

    document.getElementById("mapsLink").href = wedding.maps;
  } catch (error) {
    console.error("Failed to load wedding section:", error);
  }
}

loadWeddingSection();
