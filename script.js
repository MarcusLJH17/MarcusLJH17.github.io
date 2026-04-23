// ═══════════════════════════════════════════════
//  MUSIC PLAYER — shuffle mode
//  Drop MP3 files into the /music/ folder and
//  add their filenames to the TRACKS array below.
// ═══════════════════════════════════════════════

const TRACKS = [
  "music/Bowling - Wii Sports OST.mp3",
  "music/No Such Thing - John Mayer.mp3",
  "music/Destiny - Zero 7 ft. Sia, Sophie Barker.mp3",
  "music/Outbound - After.mp3",
  "music/Pretending - Sweet Trip.mp3",
];

// ── State ──────────────────────────────────────
let currentIndex = 0;
let isPlaying = false;
const audio = new Audio();
audio.volume = 0.7;

// ── DOM refs ───────────────────────────────────
const toggleBtn    = document.getElementById('music-toggle-btn');
const panel        = document.getElementById('music-panel');
const closeBtn     = document.getElementById('music-close');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon     = document.getElementById('play-icon');
const prevBtn      = document.getElementById('prev-btn');
const nextBtn      = document.getElementById('next-btn');
const trackName    = document.getElementById('track-name');
const trackIndex   = document.getElementById('track-index');
const progressBar  = document.getElementById('progress-bar');
const volumeBar    = document.getElementById('volume-bar');
const currentTime  = document.getElementById('current-time');
const durationEl   = document.getElementById('duration');
const discIcon     = document.getElementById('disc-icon');

// ── Helpers ────────────────────────────────────
function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function getTrackDisplayName(path) {
  return path.split('/').pop().replace(/\.[^/.]+$/, '');
}

// Returns a random index different from current
function randomOther() {
  if (TRACKS.length <= 1) return 0;
  let next;
  do { next = Math.floor(Math.random() * TRACKS.length); }
  while (next === currentIndex);
  return next;
}

// ── Load / play ────────────────────────────────
function loadTrack(index, autoPlay = false) {
  if (TRACKS.length === 0) return;
  currentIndex = index;
  audio.src = TRACKS[currentIndex];
  audio.load();
  trackName.textContent = getTrackDisplayName(TRACKS[currentIndex]);
  if (autoPlay) play();
}

function play() {
  audio.play().catch(() => {});
  isPlaying = true;
  playIcon.className = 'fa-solid fa-pause';
  discIcon.style.animationPlayState = 'running';
  toggleBtn.classList.add('active');
}

function pause() {
  audio.pause();
  isPlaying = false;
  playIcon.className = 'fa-solid fa-play';
  discIcon.style.animationPlayState = 'paused';
}

function togglePlay() {
  if (TRACKS.length === 0) return;
  if (!audio.src || audio.src === window.location.href) loadTrack(0);
  isPlaying ? pause() : play();
}

// ── Controls — sequential order ────────────────
playPauseBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
  if (TRACKS.length === 0) return;
  loadTrack((currentIndex - 1 + TRACKS.length) % TRACKS.length, isPlaying);
});

nextBtn.addEventListener('click', () => {
  if (TRACKS.length === 0) return;
  loadTrack((currentIndex + 1) % TRACKS.length, isPlaying);
});

// Auto-advance to next track in order when one ends
audio.addEventListener('ended', () => {
  loadTrack((currentIndex + 1) % TRACKS.length, true);
});

// ── Progress bar ───────────────────────────────
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressBar.value = pct;
  currentTime.textContent = formatTime(audio.currentTime);
  durationEl.textContent  = formatTime(audio.duration);
});

progressBar.addEventListener('input', () => {
  if (audio.duration) audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// ── Volume ─────────────────────────────────────
volumeBar.addEventListener('input', () => {
  audio.volume = volumeBar.value / 100;
});

// ── Panel toggle ───────────────────────────────
toggleBtn.addEventListener('click', () => {
  panel.classList.toggle('hidden');
});

closeBtn.addEventListener('click', () => {
  panel.classList.add('hidden');
});

// ── Init ───────────────────────────────────────
if (TRACKS.length > 0) loadTrack(0);
