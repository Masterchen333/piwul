function updateJourneyCounter() {
  if (!appState.config) return;
  const start = new Date(appState.config.startDate).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}
setInterval(updateJourneyCounter, 1000);
