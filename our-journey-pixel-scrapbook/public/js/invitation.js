function getGuestNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("to");
}

function applyGuestName() {
  const guestName = getGuestNameFromURL();

  if (!guestName) return;

  const cleanName = decodeURIComponent(guestName).replaceAll("+", " ");

  const guestGreeting = document.getElementById("guestGreeting");
  const openingNote = document.getElementById("openingNote");

  if (guestGreeting) {
    guestGreeting.textContent = `Kepada Yth. ${cleanName}`;
  }

  if (openingNote) {
    openingNote.textContent = `Kepada Yth. ${cleanName}, kamu diundang untuk membuka chapter baru kami.`;
  }
}

applyGuestName();
