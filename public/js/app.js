
const STORAGE_KEY = "sessions";

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}


function todayTotal(sessions, now) {
  const midnight = new Date(now).setHours(0, 0, 0, 0);
  let total = 0;
  for (const s of sessions) {
    const start = Math.max(s.start, midnight);
    const end = s.end ?? now;
    if (end > start) total += end - start;
  }
  return total;
}

function format(ms) {
  const secs = Math.floor(ms / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(secs / 3600))}:${pad(Math.floor(secs / 60) % 60)}:${pad(secs % 60)}`;
}

const display = document.getElementById("display");
const toggle = document.getElementById("toggle");
const timer = document.querySelector(".timer");

let sessions = loadSessions();
const isRunning = () => sessions.length > 0 && sessions.at(-1).end === null;

function render() {
  const text = format(todayTotal(sessions, Date.now()));
  display.textContent = text;
  document.title = isRunning() ? `${text} · timmer` : "timmer";
  timer.classList.toggle("running", isRunning());
  toggle.setAttribute("aria-label", isRunning() ? "Pause" : "Start");
}

toggle.addEventListener("click", () => {
  if (isRunning()) sessions.at(-1).end = Date.now();
  else sessions.push({ start: Date.now(), end: null });
  saveSessions(sessions);
  render();
});

window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    sessions = loadSessions();
    render();
  }
});

render();
setInterval(render, 250);
