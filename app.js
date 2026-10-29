// Desire's Cascade — main script
// Step 28: Particle Explosions for Special Gems

console.log("Desire's Cascade: app.js loaded.");

const GEMS = ["💎", "🍎", "🌟", "🍀", "🍇"];
const SIZE = 8;

let board = [];
let selectedIndex = null;
let isBusy = false;
let currentLevel = null;
let movesLeft = 0;
let cleared = 0;
let goal = 0;

const PLAYER_NAME = "Desire";

// ---- BIRTHDAY -----------------------------------------------------------
// Shows a one-time surprise on this date (her phone's local date), every year.
// Preview it any time by opening the site with  ?birthday=preview  (nothing is saved).
const BIRTHDAY = {
  month: 11, day: 1,
  note: "Today is your day, so before anything else: I'm glad you were born. The world got a little warmer, a little funnier, and a lot more interesting when you arrived.\n\nI made this game one level at a time, hoping it would put a smile on your face on ordinary days. Today I hope it's just one small part of a day full of good things.\n\nI hope you get the quiet moments and the loud ones. The cake, the laughter, and the people who see how special you are. I hope you rest, and I hope you're as kind to yourself as you are to everyone else.\n\nNo pressure, no expectations. Just a gift from me, with all my best wishes.\n\nHappy birthday, Desire. 🎂💗",
  gift: { coins: 500, gems: 10, hammers: 3, shuffles: 3, hints: 3 },
  levelDays: 3,                                   // special level stays playable this many days (1 = birthday only)
  levelBonus: { coins: 300, gems: 5 }             // one-time extra reward for finishing it each year
};

// The special birthday level: break a heart made of ice. It lives outside the normal
// level list, so it never affects her progress on the map.
const BIRTHDAY_LEVEL = {
  id: "bday", birthday: true, chapter: 0, name: "Happy Birthday, " + PLAYER_NAME + "!",
  goal: 0, moves: 34, iceHp: 1,
  ice: [9, 10, 13, 14, 16, 19, 20, 23, 24, 31, 33, 38, 42, 45, 51, 52],   // heart outline
  intro: "Break the heart 💖"
};
let birthdayShowing = false;
let hammers = 3;
let shuffles = 2;
let hints = 2;
let iceGrid = [];
let collected = {};
let pendingDrops = null;
let lockGrid = [];        // chained cells: can't be swapped until a match clears them
let itemsCollected = 0;   // drop-items (🍒) that reached the bottom
let windDue = false;      // wind shifts rows once after each player move
const ITEM = 99;          // cell value of a drop-item (never matches, immune to blasts)
let hammerMode = false;
let isPaused = false;

let touchStartX = 0;
let touchStartY = 0;
let touchStartIndex = null;
let isSwiping = false;

let canvas = null;
let ctx = null;

// ---- AUDIO ENGINE --------------------------------------------------
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (settings.music) startMusic();
}

// ---- SETTINGS (separate key so "Reset progress" keeps them) ---------
const SETTINGS_KEY = "desires_cascade_settings";
let settings = { sound: true, music: true, vibrate: true };
try { Object.assign(settings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}")); } catch (e) {}
function saveSettings() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {} }
function vib(pattern) { if (settings.vibrate && navigator.vibrate) navigator.vibrate(pattern); }

// ---- MUSIC: soft procedural lullaby, no audio files needed ----------
let musicGain = null, musicTimer = null, musicNext = 0, musicBar = 0;
const MUSIC_BEAT = 0.62;
const MUSIC_CHORDS = [
  { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] },  // C
  { bass: 110.00, notes: [220.00, 261.63, 329.63, 440.00] },  // Am
  { bass: 174.61, notes: [261.63, 349.23, 440.00, 523.25] },  // F
  { bass: 196.00, notes: [246.94, 293.66, 392.00, 493.88] }   // G
];
function musicNote(freq, t, dur, vol, type) {
  const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
  osc.type = type; osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g); g.connect(musicGain);
  osc.start(t); osc.stop(t + dur + 0.05);
}
function scheduleMusicBar() {
  const chord = MUSIC_CHORDS[musicBar % MUSIC_CHORDS.length];
  const pattern = [0, 1, 2, 3, 2, 1, 2, 1];
  musicNote(chord.bass, musicNext, MUSIC_BEAT * 3.6, 0.5, 'sine');
  pattern.forEach((n, i) => musicNote(chord.notes[n], musicNext + i * (MUSIC_BEAT / 2), MUSIC_BEAT * 1.4, 0.22, 'triangle'));
  musicNext += MUSIC_BEAT * 4;
  musicBar++;
}
function startMusic() {
  if (!audioCtx || musicTimer) return;
  if (!musicGain) { musicGain = audioCtx.createGain(); musicGain.connect(audioCtx.destination); }
  musicGain.gain.cancelScheduledValues(audioCtx.currentTime);
  musicGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  musicGain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 1.5);
  musicNext = audioCtx.currentTime + 0.1;
  musicTimer = setInterval(() => { while (musicNext < audioCtx.currentTime + 2) scheduleMusicBar(); }, 500);
}
function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  if (musicGain && audioCtx) {
    musicGain.gain.cancelScheduledValues(audioCtx.currentTime);
    musicGain.gain.setValueAtTime(musicGain.gain.value, audioCtx.currentTime);
    musicGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
  }
}
document.addEventListener('visibilitychange', () => {
  if (!audioCtx) return;
  if (document.hidden) audioCtx.suspend(); else audioCtx.resume();
});

function playSound(type, chain) {
  if (!audioCtx || !settings.sound) return;
  const now = audioCtx.currentTime;
  const pitch = 1 + Math.min(chain || 0, 6) * 0.09;

  if (type === 'swap') {
    const osc1 = audioCtx.createOscillator(); const gain1 = audioCtx.createGain();
    osc1.connect(gain1); gain1.connect(audioCtx.destination);
    osc1.type = 'sine'; osc1.frequency.setValueAtTime(800 + Math.random() * 100, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
    gain1.gain.setValueAtTime(0.1, now); gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    const osc2 = audioCtx.createOscillator(); const gain2 = audioCtx.createGain();
    osc2.connect(gain2); gain2.connect(audioCtx.destination);
    osc2.type = 'triangle'; osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now); gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc1.start(now); osc1.stop(now + 0.05); osc2.start(now); osc2.stop(now + 0.08);
  } 
  else if (type === 'pop') {
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine'; osc.frequency.setValueAtTime(400 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(800 * pitch, now + 0.1);
    gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now); osc.stop(now + 0.1);
    vib(40);
  }
  else if (type === 'boom') {
    // Deep explosion sound for specials
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
    gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now); osc.stop(now + 0.3);
    vib([50, 30, 50]);
  }
  else if (type === 'coin') {
    [988, 1319].forEach((freq, i) => {
      const t = now + i * 0.07;
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'square'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.08, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      osc.start(t); osc.stop(t + 0.18);
    });
  }
  else if (type === 'win') {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
      const startTime = now + (index * 0.12);
      const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = 'triangle'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, startTime); gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
      osc.start(startTime); osc.stop(startTime + 0.4);
    });
    vib([100, 50, 100, 50, 200]);
  }
}

// ---- GAME LOGIC ----------------------------------------------------
function getLevelById(id) {
  if (id === "bday") return BIRTHDAY_LEVEL;
  for (let i = 0; i < LEVELS.length; i++) { if (LEVELS[i].id === id) return LEVELS[i]; }
  return null;
}

const SAVE_KEY = "desires_cascade_progress";
function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { highestUnlocked: 1 };
    const p = JSON.parse(raw);
    // Repair: a saved story note for level N proves level N was beaten, so level N+1 must be unlocked.
    // (Fixes saves made on older builds that stopped at level 150.)
    if (Array.isArray(p.unlockedMoments) && p.unlockedMoments.length) {
      const need = Math.min(Math.max.apply(null, p.unlockedMoments) + 1, LEVELS.length);
      if (!(p.highestUnlocked >= need)) { p.highestUnlocked = need; saveProgress(p); }
    }
    return p;
  } catch (e) { return { highestUnlocked: 1 }; }
}
function saveProgress(progress) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch (e) {}
}
function unlockLevel(id) {
  const p = loadProgress();
  if (id > p.highestUnlocked) p.highestUnlocked = Math.min(id, LEVELS.length);
  p.unlockedMoments = Array.isArray(p.unlockedMoments) ? p.unlockedMoments : [];
  const completed = id - 1;
  if (STORY_MOMENTS[completed] && !p.unlockedMoments.includes(completed)) p.unlockedMoments.push(completed);
  saveProgress(p);
}

function updateHomeBadge() {
  const el = document.getElementById("home-level");
  if (el) el.textContent = loadProgress().highestUnlocked;
  refreshWallet();
  updateBirthdayBanner();
}

// ---- WALLET / INVENTORY (stored inside the progress save) -----------
function getWallet() {
  const p = loadProgress();
  if (typeof p.coins !== "number") p.coins = 200;
  if (typeof p.gems !== "number") p.gems = 3;
  if (typeof p.hammers !== "number") p.hammers = 3;
  if (typeof p.shuffles !== "number") p.shuffles = 2;
  if (typeof p.hints !== "number") p.hints = 2;
  if (!p.stars || typeof p.stars !== "object") p.stars = {};
  return p;
}
function patchSave(patch) { const p = getWallet(); Object.assign(p, patch); saveProgress(p); return p; }
function persistInventory() { patchSave({ hammers: hammers, shuffles: shuffles, hints: hints }); }
function refreshWallet() {
  const w = getWallet();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set("home-coins", w.coins.toLocaleString());
  set("shop-coins", w.coins.toLocaleString()); set("shop-gems", w.gems);
  set("shop-hammers", w.hammers); set("shop-shuffles", w.shuffles); set("shop-hints", w.hints);
}
function starsFor(movesRemaining, totalMoves) {
  const ratio = totalMoves > 0 ? movesRemaining / totalMoves : 0;
  return ratio >= 0.4 ? 3 : ratio >= 0.2 ? 2 : 1;
}

// ---- SHOP -----------------------------------------------------------
const SHOP_ITEMS = [
  { id: "h1", icon: "🔨", name: "Hammer",         desc: "Smash any gem",        cost: 60,  give: { hammers: 1 } },
  { id: "h3", icon: "🔨", name: "Hammer ×3",      desc: "Best value",           cost: 150, give: { hammers: 3 } },
  { id: "s1", icon: "🔀", name: "Shuffle",        desc: "Mix up the board",     cost: 50,  give: { shuffles: 1 } },
  { id: "s3", icon: "🔀", name: "Shuffle ×3",     desc: "Best value",           cost: 125, give: { shuffles: 3 } },
  { id: "i1", icon: "💡", name: "Hint",           desc: "Shows a good swap",    cost: 40,  give: { hints: 1 } },
  { id: "i3", icon: "💡", name: "Hint ×3",        desc: "Best value",           cost: 100, give: { hints: 3 } },
  { id: "bundle", icon: "🎀", name: "Care Package", desc: "2 hammers + 2 shuffles + 2 hints", cost: 230, give: { hammers: 2, shuffles: 2, hints: 2 } },
];
function buildShop() {
  const box = document.getElementById("shop-container");
  if (!box) return;
  const w = getWallet();
  box.innerHTML = "";
  SHOP_ITEMS.forEach(item => {
    const row = document.createElement("div"); row.className = "shop-item";
    const icon = document.createElement("div"); icon.className = "shop-icon"; icon.textContent = item.icon;
    const info = document.createElement("div"); info.className = "shop-info";
    const n = document.createElement("b"); n.textContent = item.name;
    const d = document.createElement("span"); d.textContent = item.desc;
    info.append(n, d);
    const btn = document.createElement("button"); btn.className = "shop-buy"; btn.textContent = "🪙 " + item.cost;
    if (w.coins < item.cost) btn.classList.add("cant-afford");
    btn.addEventListener("click", () => buyItem(item));
    row.append(icon, info, btn);
    box.appendChild(row);
  });
  refreshWallet();
}
function buyItem(item) {
  const w = getWallet();
  if (w.coins < item.cost) { playSound("swap"); vib(80); return; }
  const patch = { coins: w.coins - item.cost };
  Object.keys(item.give).forEach(k => { patch[k] = w[k] + item.give[k]; });
  patchSave(patch);
  playSound("coin"); vib(30);
  buildShop();
}

// ---- DAILY REWARD ---------------------------------------------------
const DAILY_REWARDS = [
  { coins: 50 }, { coins: 60 }, { coins: 80 }, { coins: 100 }, { coins: 120, gems: 1 }, { coins: 150 },
  { coins: 250, gems: 3, hammers: 1, shuffles: 1 }
];
function dateKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function dailyState() {
  const w = getWallet();
  const today = dateKey(new Date());
  const y = new Date(); y.setDate(y.getDate() - 1);
  const last = w.dailyLast || null;
  const claimable = last !== today;
  let streak = w.dailyStreak || 0;
  if (claimable) streak = (last === dateKey(y)) ? streak + 1 : 1;
  return { claimable, streak, today };
}
function prizeText(r) {
  return ["🪙 " + r.coins, r.gems ? "💎 " + r.gems : "", r.hammers ? "🔨 " + r.hammers : "", r.shuffles ? "🔀 " + r.shuffles : ""].filter(Boolean).join("  ");
}
function updateDailyButton() {
  const btn = document.getElementById("btn-daily");
  if (btn) btn.style.display = dailyState().claimable ? "block" : "none";
}
// ---- BIRTHDAY LOGIC ----
function birthdayPreview() { return /[?&]birthday=preview/.test(location.search); }
function isBirthdayToday() {
  if (birthdayPreview()) return true;
  const d = new Date();
  return d.getMonth() + 1 === BIRTHDAY.month && d.getDate() === BIRTHDAY.day;
}
function birthdayUnclaimed() {
  if (birthdayPreview()) return true;
  return getWallet().birthdayClaimed !== new Date().getFullYear();
}
function isBirthdayLevelAvailable() {
  if (birthdayPreview()) return true;
  const d = new Date();
  const start = new Date(d.getFullYear(), BIRTHDAY.month - 1, BIRTHDAY.day);
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.round((today - start) / 86400000);
  return days >= 0 && days < BIRTHDAY.levelDays;
}
function updateBirthdayBanner() {
  const lv = document.getElementById("btn-birthday-level");
  if (lv) lv.style.display = isBirthdayLevelAvailable() ? "block" : "none";
  const b = document.getElementById("birthday-banner");
  if (b) b.style.display = isBirthdayToday() ? "block" : "none";
}
function giftText(g) {
  return ["🪙 " + g.coins, "💎 " + g.gems, "🔨 " + g.hammers, "🔀 " + g.shuffles, "💡 " + g.hints].join("   ");
}
function showBirthday() {
  const claimed = !birthdayUnclaimed();
  document.getElementById("birthday-title").textContent = "Happy Birthday, " + PLAYER_NAME + "!";
  document.getElementById("birthday-note").textContent = BIRTHDAY.note;
  const gift = document.getElementById("birthday-gift");
  gift.textContent = claimed ? "" : giftText(BIRTHDAY.gift);
  gift.style.display = claimed ? "none" : "block";
  document.getElementById("btn-birthday-claim").textContent = claimed ? "Close 💗" : "Open your gift 🎁";
  document.getElementById("birthday-level-hint").style.display = isBirthdayLevelAvailable() ? "block" : "none";
  const box = document.getElementById("birthday-confetti");
  box.innerHTML = "";
  const bits = ["🎉", "🎂", "💖", "🎈", "✨", "🌸", "🎁", "⭐"];
  for (let i = 0; i < 44; i++) {
    const s = document.createElement("span");
    s.className = "confetti-bit"; s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = (3 + Math.random() * 3) + "s";
    s.style.animationDelay = (Math.random() * 2) + "s";
    s.style.fontSize = (16 + Math.random() * 20) + "px";
    box.appendChild(s);
  }
  birthdayShowing = true;
  document.getElementById("birthday-modal").classList.add("show");
  playSound("win"); vib([60, 40, 60]);
}
function closeBirthday() {
  document.getElementById("birthday-modal").classList.remove("show");
  birthdayShowing = false;
  if (dailyState().claimable) setTimeout(openDaily, 500);
}
function claimBirthday() {
  if (birthdayUnclaimed()) {
    const g = BIRTHDAY.gift, w = getWallet();
    if (!birthdayPreview()) {
      patchSave({
        coins: w.coins + g.coins, gems: w.gems + g.gems,
        hammers: w.hammers + g.hammers, shuffles: w.shuffles + g.shuffles, hints: w.hints + g.hints,
        birthdayClaimed: new Date().getFullYear()
      });
    }
    playSound("coin"); vib([40, 30, 40]);
    refreshWallet();
  }
  closeBirthday();
}

function openDaily() {
  const s = dailyState();
  if (!s.claimable) return;
  const idx = (s.streak - 1) % DAILY_REWARDS.length;
  document.getElementById("daily-streak").textContent = "Day " + s.streak + " streak 🔥";
  const days = document.getElementById("daily-days");
  days.innerHTML = "";
  DAILY_REWARDS.forEach((r, i) => {
    const cell = document.createElement("div");
    cell.className = "daily-day" + (i < idx ? " done" : "") + (i === idx ? " today" : "");
    cell.textContent = i === DAILY_REWARDS.length - 1 ? "🎁" : (i < idx ? "✓" : i + 1);
    days.appendChild(cell);
  });
  document.getElementById("daily-prize").textContent = "Today: " + prizeText(DAILY_REWARDS[idx]);
  document.getElementById("daily-modal").classList.add("show");
}
function claimDaily() {
  const s = dailyState();
  if (!s.claimable) return;
  const r = DAILY_REWARDS[(s.streak - 1) % DAILY_REWARDS.length];
  const w = getWallet();
  patchSave({
    coins: w.coins + r.coins, gems: w.gems + (r.gems || 0),
    hammers: w.hammers + (r.hammers || 0), shuffles: w.shuffles + (r.shuffles || 0),
    dailyLast: s.today, dailyStreak: s.streak
  });
  playSound("coin"); vib([40, 30, 40]);
  document.getElementById("daily-modal").classList.remove("show");
  refreshWallet(); updateDailyButton();
}

// ---- SETTINGS UI ----------------------------------------------------
function syncSettingsUI() {
  [["tg-sound", "sound"], ["tg-music", "music"], ["tg-vibrate", "vibrate"]].forEach(([id, key]) => {
    const el = document.getElementById(id); if (!el) return;
    el.classList.toggle("off", !settings[key]);
    el.querySelector(".tg-state").textContent = settings[key] ? "On" : "Off";
  });
}
function toggleSetting(key) {
  settings[key] = !settings[key];
  saveSettings(); syncSettingsUI();
  if (key === "music") { initAudio(); if (settings.music) startMusic(); else stopMusic(); }
  if (key === "sound" && settings.sound) playSound("pop");
  if (key === "vibrate" && settings.vibrate) vib(50);
}

function randomBoard() {
  board = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    let gem; let isMatch = true;
    while (isMatch) {
      gem = Math.floor(Math.random() * GEMS.length);
      isMatch = false;
      const row = Math.floor(i / SIZE); const col = i % SIZE;
      if (col >= 2 && board[i - 1] === gem && board[i - 2] === gem) isMatch = true;
      if (row >= 2 && board[i - SIZE] === gem && board[i - SIZE * 2] === gem) isMatch = true;
    }
    board.push(gem);
  }
}

// Cell values: 0-4 normal gem | 100+t row rocket | 300+t column rocket | 400+t bomb (3x3) | 200 rainbow
function gemType(v) { return v === 200 ? 200 : v % 100; }

function renderBoard() {
  const boardEl = document.getElementById("board");
  if (!boardEl) return;
  const drops = pendingDrops; pendingDrops = null;
  boardEl.innerHTML = "";

  for (let i = 0; i < board.length; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    if (i === selectedIndex) tile.classList.add("selected");
    if (hammerMode) tile.classList.add("hammer-target");
    if (iceGrid[i] > 0) { tile.classList.add("ice"); tile.dataset.ice = iceGrid[i]; }
    if (lockGrid[i]) tile.classList.add("locked");
    if (currentLevel && currentLevel.wind) {
      const w = currentLevel.wind.find(x => x.row === Math.floor(i / SIZE));
      if (w) tile.classList.add(w.dir > 0 ? "wind-r" : "wind-l");
    }

    let type = board[i];
    let isSpecial = false;

    if (type === ITEM) { isSpecial = "item"; }
    else if (type === 200) { isSpecial = "rainbow"; }
    else if (type >= 400) { isSpecial = "bomb"; type = type - 400; }
    else if (type >= 300) { isSpecial = "rocket-v"; type = type - 300; }
    else if (type >= 100) { isSpecial = "rocket-h"; type = type - 100; }

    tile.dataset.type = type;
    tile.dataset.index = i;

    if (isSpecial === "item") {
      tile.innerHTML = `<span class="item-gem">🍒</span>`;
    } else if (isSpecial === "rainbow") {
      tile.innerHTML = `<div class="gem-img" style="background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); border-radius: 50%; box-shadow: 0 0 15px #fff; z-index: 2;"></div><span class="gem-fallback" style="z-index:3; font-size: 30px;">🌈</span>`;
    } else if (isSpecial) {
      tile.classList.add("special");
      tile.innerHTML = `<div class="gem-img" style="background-image: url('assets/gem_${type}.png'); filter: brightness(1.5) drop-shadow(0 0 5px #fff);"></div><span class="rocket-arrow">${isSpecial === "bomb" ? "✸" : (isSpecial === "rocket-v" ? "↕" : "↔")}</span>`;
      if (isSpecial === "bomb") tile.classList.add("bomb");
    } else {
      tile.innerHTML = `<div class="gem-img" style="background-image: url('assets/gem_${type}.png');"></div><span class="gem-fallback">${GEMS[type]}</span>`;
    }

    if (drops && drops[i] > 0) { tile.classList.add("falling"); tile.style.setProperty("--drop", drops[i]); }

    tile.addEventListener("touchstart", (e) => onTouchStart(e, i), { passive: false });
    tile.addEventListener("touchmove", onTouchMove, { passive: false });
    tile.addEventListener("touchend", onTouchEnd);
    tile.addEventListener("mousedown", (e) => onTouchStart(e, i));
    tile.addEventListener("mousemove", onTouchMove);
    tile.addEventListener("mouseup", onTouchEnd);

    boardEl.appendChild(tile);
  }
}

// ---- PARTICLE EXPLOSIONS -------------------------------------------
function createParticleExplosion(index) {
  const boardEl = document.getElementById("board");
  const tiles = boardEl.querySelectorAll(".tile");
  const targetTile = tiles[index];
  if (!targetTile) return;

  const rect = targetTile.getBoundingClientRect();
  const boardRect = boardEl.getBoundingClientRect();

  // Calculate center of the tile relative to the board
  const centerX = rect.left - boardRect.left + rect.width / 2;
  const centerY = rect.top - boardRect.top + rect.height / 2;

  // Create 12 particles
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // Randomize color
    const colors = ['#ffd700', '#ff6ec7', '#7b5cff', '#ffffff'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Position at center
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;

    // Random angle and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    boardEl.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => particle.remove(), 600);
  }
}

function onTouchStart(e, index) {
  initAudio();
  if (isBusy || isPaused) return;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  touchStartX = clientX; touchStartY = clientY;
  touchStartIndex = index; isSwiping = false;

  if (hammerMode) {
    onTileTap(index);
    touchStartIndex = null;
    return;
  }

  canvas = document.getElementById("swipe-canvas");
  if (canvas) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx = canvas.getContext("2d");
  }
}

function onTouchMove(e) {
  if (touchStartIndex === null || isBusy || isPaused || !ctx) return;
  if (e.cancelable) e.preventDefault();

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = clientX - touchStartX;
  const deltaY = clientY - touchStartY;

  if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) isSwiping = true;

  if (isSwiping) {
    const rect = canvas.getBoundingClientRect();
    const canvasStartX = touchStartX - rect.left;
    const canvasStartY = touchStartY - rect.top;
    const canvasEndX = clientX - rect.left;
    const canvasEndY = clientY - rect.top;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvasStartX, canvasStartY);
    ctx.lineTo(canvasEndX, canvasEndY);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.8)"; 
    ctx.lineWidth = 8; ctx.lineCap = "round"; ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasStartX, canvasStartY);
    ctx.lineTo(canvasEndX, canvasEndY);
    ctx.strokeStyle = "rgba(255, 255, 255, 1)"; 
    ctx.lineWidth = 3; ctx.stroke();
  }
}

function onTouchEnd(e) {
  if (touchStartIndex === null || isBusy || isPaused) return;
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

  const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

  const deltaX = clientX - touchStartX;
  const deltaY = clientY - touchStartY;
  const absX = Math.abs(deltaX); const absY = Math.abs(deltaY);

  if (isSwiping && Math.max(absX, absY) > 20) {
    const r = Math.floor(touchStartIndex / SIZE); const c = touchStartIndex % SIZE;
    let targetIndex = -1;

    if (absX > absY) {
      if (deltaX > 0 && c < SIZE - 1) targetIndex = touchStartIndex + 1;
      else if (deltaX < 0 && c > 0) targetIndex = touchStartIndex - 1;
    } else {
      if (deltaY > 0 && r < SIZE - 1) targetIndex = touchStartIndex + SIZE;
      else if (deltaY < 0 && r > 0) targetIndex = touchStartIndex - SIZE;
    }

    if (targetIndex !== -1) attemptSwap(touchStartIndex, targetIndex);
  } else {
    onTileTap(touchStartIndex);
  }
  isSwiping = false; touchStartIndex = null;
}

async function animateSwap(a, b) {
  const tiles = document.querySelectorAll("#board .tile");
  const ta = tiles[a], tb = tiles[b];
  if (!ta || !tb) return;
  const ra = ta.getBoundingClientRect(), rb = tb.getBoundingClientRect();
  const dx = rb.left - ra.left, dy = rb.top - ra.top;
  ta.style.transition = tb.style.transition = "transform .16s ease-in-out";
  ta.style.zIndex = 7;
  ta.style.transform = "translate(" + dx + "px," + dy + "px)";
  tb.style.transform = "translate(" + (-dx) + "px," + (-dy) + "px)";
  await sleep(170);
}

async function attemptSwap(a, b) {
  if (levelOver) return;
  try { await attemptSwapInner(a, b); }
  catch (err) { console.error(err); showPopup("⚠ " + ((err && err.message) || err), 14); isBusy = false; }
}

async function attemptSwapInner(a, b) {
  isBusy = true;
  selectedIndex = null;
  // chained cells and rainbow-with-item swaps are not allowed (no move spent)
  if (lockGrid[a] || lockGrid[b] || (board[a] === 200 && board[b] === ITEM) || (board[b] === 200 && board[a] === ITEM)) {
    playSound('swap'); vib(60);
    renderBoard(); isBusy = false;
    return;
  }
  await animateSwap(a, b);
  swapTiles(a, b);
  renderBoard();
  playSound('swap');

  // Rainbow: swap it with any gem to wipe every gem of that colour
  const rainbowIdx = board[a] === 200 ? a : (board[b] === 200 ? b : -1);
  if (rainbowIdx !== -1) {
    const other = rainbowIdx === a ? b : a;
    const color = gemType(board[other]);
    const otherVal = board[other];
    movesLeft--; windDue = true; updateHUD();
    const list = [rainbowIdx];
    for (let i = 0; i < board.length; i++) if (color === 200 || gemType(board[i]) === color) list.push(i);
    const preset = { idx: rainbowIdx, color: color };
    if (otherVal >= 100 && otherVal !== 200) { preset.mega = otherVal; showPopup("Mega combo!", 40); }
    await resolveMatches([...new Set(list)], preset);
    return;
  }

  // Two specials swapped together: combo blast centred where they landed
  if (board[a] >= 100 && board[b] >= 100) {
    movesLeft--; windDue = true; updateHUD();
    showPopup(["", "Cross blast!", "Big blast!", "Mega bomb!"][(board[a] >= 400 && board[b] >= 400) ? 3 : ((board[a] >= 400 || board[b] >= 400) ? 2 : 1)], 40);
    playSound('boom');
    const cells = comboCells(b, board[a], board[b]);
    await resolveMatches([...new Set([a, b, ...cells])]);
    return;
  }

  const matches = findMatches();
  if (matches.length === 0) {
    await sleep(60);
    await animateSwap(a, b);     // slide back
    swapTiles(a, b);
    renderBoard();
    isBusy = false;
    return;
  }
  movesLeft--; windDue = true; updateHUD();
  await resolveMatches(matches);
}

async function onTileTap(index) {
  if (levelOver) return;
  if (isBusy || isPaused) return;

  if (hammerMode && board[index] === ITEM) return;
  if (hammerMode) {
    hammerMode = false; hammers--; persistInventory(); isBusy = true;
    updateHUD(); playSound('pop');
    clearAndCollapse([index]); renderBoard();
    createParticleExplosion(index);
    await sleep(340);
    await resolveMatches(findMatches());
    return;
  }

  if (selectedIndex === null) { selectedIndex = index; renderBoard(); return; }
  if (selectedIndex === index) { selectedIndex = null; renderBoard(); return; }
  if (!areNeighbors(selectedIndex, index)) { selectedIndex = index; renderBoard(); return; }

  const a = selectedIndex; const b = index;
  await attemptSwap(a, b);
}

function areNeighbors(a, b) {
  const rowA = Math.floor(a / SIZE), colA = a % SIZE;
  const rowB = Math.floor(b / SIZE), colB = b % SIZE;
  return (rowA === rowB && Math.abs(colA - colB) === 1) || (colA === colB && Math.abs(rowA - rowB) === 1);
}

function swapTiles(a, b) {
  const tmp = board[a]; board[a] = board[b]; board[b] = tmp;
}

// Pure scan: finds runs of 3+ without touching the board.
function scanRuns() {
  const found = new Set();
  const specials = [];
  const hCells = new Set(), vCells = new Set();
  const t = (i) => gemType(board[i]);

  for (let row = 0; row < SIZE; row++) {
    let runStart = 0;
    for (let col = 1; col <= SIZE; col++) {
      const cur = col < SIZE ? t(row * SIZE + col) : null;
      const prev = t(row * SIZE + col - 1);
      if (cur !== prev) {
        const len = col - runStart;
        if (len >= 3 && prev !== 200 && prev !== ITEM) {
          for (let k = runStart; k < col; k++) { found.add(row * SIZE + k); hCells.add(row * SIZE + k); }
          const mid = row * SIZE + runStart + Math.floor(len / 2);
          if (len >= 5) specials.push({ index: mid, type: 200 });
          else if (len === 4) specials.push({ index: mid, type: 300 + prev });   // horizontal 4 -> column rocket
        }
        runStart = col;
      }
    }
  }
  for (let col = 0; col < SIZE; col++) {
    let runStart = 0;
    for (let row = 1; row <= SIZE; row++) {
      const cur = row < SIZE ? t(row * SIZE + col) : null;
      const prev = t((row - 1) * SIZE + col);
      if (cur !== prev) {
        const len = row - runStart;
        if (len >= 3 && prev !== 200 && prev !== ITEM) {
          for (let k = runStart; k < row; k++) { found.add(k * SIZE + col); vCells.add(k * SIZE + col); }
          const mid = (runStart + Math.floor(len / 2)) * SIZE + col;
          if (len >= 5) specials.push({ index: mid, type: 200 });
          else if (len === 4) specials.push({ index: mid, type: 100 + prev });   // vertical 4 -> row rocket
        }
        runStart = row;
      }
    }
  }
  // L / T / + shapes (a horizontal and vertical run crossing) make a bomb
  const rainbowAt = new Set(specials.filter(s => s.type === 200).map(s => s.index));
  hCells.forEach(i => {
    if (vCells.has(i) && !rainbowAt.has(i) && board[i] < 100) specials.push({ index: i, type: 400 + t(i) });
  });
  return { found, specials };
}

function hasMatch() { return scanRuns().found.size > 0; }

function findMatches() {
  const { found, specials } = scanRuns();
  specials.forEach(s => { found.delete(s.index); board[s.index] = s.type; });
  return Array.from(found);
}

// Any swap that would make a match (or involves a rainbow)? Returns [a, b] or null.
function findValidSwap() {
  for (let i = 0; i < board.length; i++) {
    const c = i % SIZE;
    const neighbours = [];
    if (c < SIZE - 1) neighbours.push(i + 1);
    if (i + SIZE < board.length) neighbours.push(i + SIZE);
    for (const j of neighbours) {
      if (lockGrid[i] || lockGrid[j]) continue;
      if (board[i] === ITEM && board[j] === 200 || board[j] === ITEM && board[i] === 200) continue;
      if (board[i] === 200 || board[j] === 200) return [i, j];
      if (board[i] >= 100 && board[j] >= 100) return [i, j];
      swapTiles(i, j);
      const ok = hasMatch();
      swapTiles(i, j);
      if (ok) return [i, j];
    }
  }
  return null;
}

function shuffleBoardArray() {
  const slots = [];
  for (let i = 0; i < board.length; i++) if (board[i] !== ITEM) slots.push(i);
  for (let k = slots.length - 1; k > 0; k--) {
    const m = Math.floor(Math.random() * (k + 1));
    const x = slots[k], y = slots[m];
    [board[x], board[y]] = [board[y], board[x]];
  }
}

function reshuffleUntilPlayable() {
  for (let tries = 0; tries < 100; tries++) {
    shuffleBoardArray();
    if (findValidSwap()) return;
  }
  randomBoard();
}

function newPlayableBoard() {
  for (let tries = 0; tries < 100; tries++) {
    randomBoard();
    if (findValidSwap()) return;
  }
}

function lockRemaining() { return lockGrid.reduce((n, v) => n + (v ? 1 : 0), 0); }

// Drop-items that reached the bottom row are collected and removed.
function collectBottomItems() {
  const hit = [];
  for (let c = 0; c < SIZE; c++) { const idx = (SIZE - 1) * SIZE + c; if (board[idx] === ITEM) hit.push(idx); }
  if (!hit.length) return false;
  itemsCollected += hit.length;
  clearAndCollapse(hit);
  return true;
}

// Wind: shifts each windy row one cell (wrapping) in its direction.
function applyWind() {
  if (!currentLevel || !currentLevel.wind) return;
  currentLevel.wind.forEach(w => {
    const row = board.slice(w.row * SIZE, (w.row + 1) * SIZE);
    const shifted = w.dir > 0 ? [row[SIZE - 1]].concat(row.slice(0, SIZE - 1)) : row.slice(1).concat([row[0]]);
    for (let c = 0; c < SIZE; c++) board[w.row * SIZE + c] = shifted[c];
  });
}

function iceRemaining() { return iceGrid.reduce((n, v) => n + (v > 0 ? 1 : 0), 0); }

function goalsMet() {
  const L = currentLevel;
  if (!L) return false;
  if (L.collect && !L.collect.every(c => (collected[c.gem] || 0) >= c.target)) return false;
  if (L.ice && iceRemaining() > 0) return false;
  if (L.chains && lockRemaining() > 0) return false;
  if (L.items && itemsCollected < L.items) return false;
  if (!L.collect && !L.ice && !L.chains && !L.items && cleared < goal) return false;
  return true;
}

function goalText() {
  const L = currentLevel;
  if (!L) return "";
  const parts = [];
  if (L.collect) L.collect.forEach(c => parts.push(GEMS[c.gem] + " " + Math.min(collected[c.gem] || 0, c.target) + "/" + c.target));
  if (L.ice) parts.push((L.birthday ? "💖 " : "❄️ ") + iceRemaining() + " left");
  if (L.chains) parts.push("⛓️ " + lockRemaining() + " left");
  if (L.items) parts.push("🍒 " + itemsCollected + "/" + L.items);
  return parts.length ? parts.join("  ") : cleared + " / " + goal;
}

function goalIntroText() {
  const L = currentLevel;
  if (L.intro) return L.intro;
  const parts = [];
  if (L.collect) L.collect.forEach(c => parts.push("Collect " + c.target + " " + GEMS[c.gem]));
  if (L.ice) parts.push("Break all the ice ❄️");
  if (L.chains) parts.push("Break the chains ⛓️");
  if (L.items) parts.push("Bring " + L.items + " 🍒 to the bottom");
  let text = parts.length ? parts.join(" + ") : "Clear " + goal + " gems";
  if (L.wind) text += "  💨 rows slide";
  return text;
}

function showPopup(text, size) {
  const p = document.getElementById("combo-popup");
  if (!p) return;
  p.textContent = text;
  p.style.fontSize = (size || 52) + "px";
  p.classList.remove("show"); void p.offsetWidth; p.classList.add("show");
}

// Cells hit by a special sitting at idx.
function specialArea(idx, v) {
  const r = Math.floor(idx / SIZE), c = idx % SIZE, out = [];
  if (v >= 400) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) out.push(rr * SIZE + cc);
    }
  } else if (v >= 300) { for (let i = 0; i < SIZE; i++) out.push(i * SIZE + c); }          // column rocket
  else if (v >= 100 && v !== 200) { for (let i = 0; i < SIZE; i++) out.push(r * SIZE + i); } // row rocket
  return out;
}

// Big cells for two specials swapped together (centre = where the swap landed).
function comboCells(centre, v1, v2) {
  const r = Math.floor(centre / SIZE), c = centre % SIZE, out = [];
  const isBomb = (v) => v >= 400;
  if (isBomb(v1) && isBomb(v2)) {                       // bomb + bomb: 5x5
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
      const rr = r + dr, cc = c + dc;
      if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) out.push(rr * SIZE + cc);
    }
  } else if (isBomb(v1) || isBomb(v2)) {                // bomb + rocket: 3 rows + 3 columns
    for (let d = -1; d <= 1; d++) for (let i = 0; i < SIZE; i++) {
      if (r + d >= 0 && r + d < SIZE) out.push((r + d) * SIZE + i);
      if (c + d >= 0 && c + d < SIZE) out.push(i * SIZE + c + d);
    }
  } else {                                              // rocket + rocket: cross
    for (let i = 0; i < SIZE; i++) { out.push(r * SIZE + i); out.push(i * SIZE + c); }
  }
  return out;
}

// Expands a clear list so specials caught in the blast chain-react.
function expandClears(base, preset) {
  const set = new Set(base);
  if (preset && preset.mega) {            // rainbow + special: the special fires from every gem of that colour
    base.forEach(i => { if (i !== preset.idx) specialArea(i, preset.mega).forEach(x => set.add(x)); });
  }
  const queue = [...set], done = new Set();
  while (queue.length) {
    const idx = queue.pop();
    if (done.has(idx)) continue;
    done.add(idx);
    const v = board[idx];
    if (v === 200) {
      if (preset && preset.idx === idx) continue;           // colour already chosen by the swap
      const targetColor = Math.floor(Math.random() * GEMS.length);
      for (let i = 0; i < board.length; i++) if (gemType(board[i]) === targetColor && !set.has(i)) { set.add(i); queue.push(i); }
    } else if (v >= 100) {
      specialArea(idx, v).forEach(i => { if (!set.has(i)) { set.add(i); } if (!done.has(i)) queue.push(i); });
    }
  }
  return Array.from(set).filter(i => board[i] !== ITEM);
}

// Clears cells, counts collected gems, cracks ice, drops new gems in.
function clearAndCollapse(matchIndices) {
  matchIndices.forEach(function (i) {
    const v = board[i];
    if (v >= 0) {
      if (v !== 200 && v !== ITEM) collected[gemType(v)] = (collected[gemType(v)] || 0) + 1;
      if (iceGrid[i] > 0) iceGrid[i]--;
      if (lockGrid[i]) lockGrid[i] = false;
    }
    board[i] = -1;
  });
  const drops = new Array(SIZE * SIZE).fill(0);
  for (let col = 0; col < SIZE; col++) {
    const column = [];
    for (let row = SIZE - 1; row >= 0; row--) {
      const v = board[row * SIZE + col];
      if (v !== -1) column.push({ v: v, row: row });
    }
    let fresh = 0;
    while (column.length < SIZE) column.push({ v: Math.floor(Math.random() * GEMS.length), row: -(++fresh) });
    for (let k = 0; k < SIZE; k++) {
      const row = SIZE - 1 - k;
      board[row * SIZE + col] = column[k].v;
      drops[row * SIZE + col] = row - column[k].row;
    }
  }
  pendingDrops = drops;
}

async function resolveMatches(initialMatches, preset) {
  try { await resolveMatchesInner(initialMatches, preset); }
  catch (err) { console.error(err); showPopup("⚠ " + ((err && err.message) || err), 14); }
  finally { isBusy = false; }
  checkEndConditions();
}

async function resolveMatchesInner(initialMatches, preset) {
  isBusy = true;
  let matches = initialMatches;
  let chain = 0;

  while (true) {
    while (matches.length > 0) {
      chain++;
      playSound('pop', chain);
      if (chain >= 2) showPopup(["", "", "Sweet!", "Great!", "Amazing!", "Wow!!"][Math.min(chain, 5)]);

      let specialTriggered = false;
      matches.forEach(idx => {
        if (board[idx] >= 100) { specialTriggered = true; createParticleExplosion(idx); }
      });
      if (specialTriggered) playSound('boom');

      cleared += matches.length;
      updateHUD();
      await animateMatches(matches);

      const newClears = expandClears(matches, preset);
      cleared += newClears.length - matches.length;
      preset = null;

      clearAndCollapse(newClears);
      renderBoard();
      updateHUD();
      await sleep(340);
      while (collectBottomItems()) { playSound('coin'); renderBoard(); updateHUD(); await sleep(340); }
      matches = findMatches();
    }
    if (windDue) {
      windDue = false;
      if (!goalsMet() && movesLeft > 0 && currentLevel && currentLevel.wind) {
        applyWind(); showPopup("💨", 44); renderBoard(); await sleep(380);
        while (collectBottomItems()) { playSound('coin'); renderBoard(); updateHUD(); await sleep(340); }
        matches = findMatches();
        if (matches.length) continue;
      }
    }
    if (goalsMet() || movesLeft <= 0 || findValidSwap()) break;
    showPopup("No moves — reshuffling!", 28);
    reshuffleUntilPlayable();
    renderBoard();
    await sleep(450);
    matches = findMatches();
  }
}

async function animateMatches(indices) {
  const tiles = document.querySelectorAll(".tile");
  indices.forEach(function (i) { if (tiles[i]) tiles[i].classList.add("matched"); });
  await sleep(280);
}

function updateHUD() {
  const movesEl = document.getElementById("hud-moves");
  const clearedEl = document.getElementById("hud-cleared");
  const nameEl = document.getElementById("level-name");
  if (movesEl) movesEl.textContent = movesLeft;
  if (clearedEl) {
    clearedEl.textContent = goalText();
    clearedEl.classList.toggle("small", !!(currentLevel && (currentLevel.collect || currentLevel.ice || currentLevel.chains || currentLevel.items)));
  }
  if (nameEl && currentLevel) nameEl.textContent = currentLevel.name;
  
  document.getElementById("count-hammer").textContent = hammers;
  document.getElementById("count-shuffle").textContent = shuffles;
  document.getElementById("count-hint").textContent = hints;
  
  const btnHammer = document.getElementById("btn-hammer");
  const btnShuffle = document.getElementById("btn-shuffle");
  if (hammers <= 0) btnHammer.classList.add("disabled"); else btnHammer.classList.remove("disabled");
  if (shuffles <= 0) btnShuffle.classList.add("disabled"); else btnShuffle.classList.remove("disabled");
  const btnHint = document.getElementById("btn-hint");
  if (btnHint) { if (hints <= 0) btnHint.classList.add("disabled"); else btnHint.classList.remove("disabled"); }
  if (hammerMode) btnHammer.classList.add("active"); else btnHammer.classList.remove("active");
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

let levelOver = false;
function checkEndConditions() {
  if (levelOver || !currentLevel) return;
  if (goalsMet()) { levelOver = true; setTimeout(showWin, 300); }
  else if (movesLeft <= 0) { levelOver = true; setTimeout(showLose, 300); }
}

// Safety net: if the goal is met while the game screen is showing and nothing is animating, finish the level.
setInterval(() => {
  const gameScreen = document.getElementById("screen-game");
  if (!isBusy && !isPaused && !levelOver && currentLevel && gameScreen && gameScreen.classList.contains("active")) checkEndConditions();
}, 700);

// Show unexpected errors on screen so they can be reported.
window.addEventListener("error", (e) => { try { showPopup("⚠ " + e.message, 14); } catch (x) {} });

function showWin() {
  playSound('win');
  if (!currentLevel.birthday) unlockLevel(currentLevel.id + 1);

  const stars = starsFor(movesLeft, currentLevel.moves);
  const w = getWallet();
  const firstClear = !w.stars[currentLevel.id];
  const coinsEarned = 20 + stars * 10 + (firstClear ? 20 : 0);
  const gemsEarned = firstClear ? 1 : 0;
  w.stars[currentLevel.id] = Math.max(w.stars[currentLevel.id] || 0, stars);
  w.coins += coinsEarned; w.gems += gemsEarned;
  saveProgress(w);

  const starRow = document.getElementById("win-stars");
  if (starRow) {
    starRow.innerHTML = "";
    for (let i = 1; i <= 3; i++) {
      const s = document.createElement("span");
      s.className = "win-star" + (i <= stars ? " earned" : "");
      s.style.animationDelay = (i * 0.25) + "s";
      s.textContent = "★";
      starRow.appendChild(s);
    }
  }
  const praise = [
    "Proud of you, " + PLAYER_NAME + " 💖", "Look at you go, " + PLAYER_NAME + "!", "Unstoppable, " + PLAYER_NAME + " ✨",
    "That was beautiful, " + PLAYER_NAME + ".", PLAYER_NAME + " for the win! 🏆", "Brilliant, " + PLAYER_NAME + " 🌟"
  ];
  const praiseEl = document.getElementById("win-praise");
  if (praiseEl) praiseEl.textContent = praise[Math.floor(Math.random() * praise.length)];
  document.getElementById("reward-coins").textContent = "+" + coinsEarned;
  document.getElementById("reward-gems").textContent = "+" + gemsEarned;
  updateHomeBadge();
  showScreen("screen-win");
}

function showMessageIfAny(levelId) {
  const text = MESSAGES[levelId];
  if (!text) return false;
  const progress = loadProgress();
  const moment = STORY_MOMENTS[levelId];
  const label = document.querySelector("#screen-message .message-from");
  if (label) label.textContent = moment ? "🔓 Memory unlocked · " + moment.title : "A note for you";
  typeText(document.getElementById("message-text"), moment ? moment.text + "\n\n" + text : text);
  showScreen("screen-message");
  return true;
}

let typeTimer = null, typeFull = "";
function typeText(el, text) {
  clearInterval(typeTimer);
  typeFull = text; el.textContent = "";
  let i = 0;
  typeTimer = setInterval(() => {
    i += 3; el.textContent = text.slice(0, i);
    if (i >= text.length) { clearInterval(typeTimer); typeTimer = null; }
  }, 30);
}
function skipTyping() {
  if (!typeTimer) return false;
  clearInterval(typeTimer); typeTimer = null;
  document.getElementById("message-text").textContent = typeFull;
  return true;
}

function buildMemories() {
  const container = document.getElementById("memories-container");
  if (!container) return;
  const progress = loadProgress();
  const unlocked = Array.isArray(progress.unlockedMoments) ? progress.unlockedMoments : [];
  container.innerHTML = "";
  Object.keys(STORY_MOMENTS).map(Number).sort((a,b)=>a-b).forEach(id => {
    const memory = STORY_MOMENTS[id];
    const card = document.createElement("article");
    card.className = "memory-item" + (unlocked.includes(id) ? " memory-unlocked" : " memory-locked");
    const heading = document.createElement("h3");
    heading.textContent = (unlocked.includes(id) ? "🔓 " : "🔒 ") + memory.title;
    const body = document.createElement("p");
    body.textContent = unlocked.includes(id) ? memory.text : "Complete level " + id + " to uncover this memory.";
    card.append(heading, body);
    container.appendChild(card);
  });
}

function showLose() {
  const btn = document.getElementById("btn-extra-moves");
  if (btn) {
    const can = getWallet().gems >= 3;
    btn.style.display = can ? "inline-block" : "none";
  }
  showScreen("screen-lose");
}
function buyExtraMoves() {
  const w = getWallet();
  if (w.gems < 3) return;
  patchSave({ gems: w.gems - 3 });
  movesLeft = 5; isBusy = false; isPaused = false; levelOver = false;
  updateHUD(); playSound("coin");
  showScreen("screen-game");
  renderBoard();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
}

function startLevel(id) {
  initAudio();
  const level = getLevelById(id);
  if (!level) return;
  currentLevel = level; movesLeft = level.moves; cleared = 0; goal = level.goal;
  const wallet = getWallet(); hammers = wallet.hammers; shuffles = wallet.shuffles; hints = wallet.hints; hammerMode = false; isPaused = false;
  document.getElementById("pause-modal").classList.remove("show");
  iceGrid = new Array(SIZE * SIZE).fill(0);
  if (level.ice) level.ice.forEach(i => { iceGrid[i] = level.iceHp || 1; });
  lockGrid = new Array(SIZE * SIZE).fill(false);
  if (level.chains) level.chains.forEach(i => { lockGrid[i] = true; });
  collected = {}; pendingDrops = null; levelOver = false; itemsCollected = 0; windDue = false;
  newPlayableBoard();
  if (level.items) {
    for (let tries = 0; tries < 60; tries++) {
      let cols = [];
      for (let attempt = 0; attempt < 12; attempt++) {         // spread cherries out when possible
        const pool = [0, 1, 2, 3, 4, 5, 6, 7];
        for (let k = pool.length - 1; k > 0; k--) { const m = Math.floor(Math.random() * (k + 1)); [pool[k], pool[m]] = [pool[m], pool[k]]; }
        cols = pool.slice(0, level.items);
        const sorted = cols.slice().sort((x, y) => x - y);
        if (sorted.every((c, i) => i === 0 || c - sorted[i - 1] > 1)) break;
      }
      cols.forEach(c => { board[c] = ITEM; });
      if (findValidSwap()) break;
      newPlayableBoard();
    }
  } selectedIndex = null; isBusy = false;
  showScreen("screen-game");
  requestAnimationFrame(() => { updateHUD(); renderBoard(); (() => { const t = goalIntroText(); showPopup(t, t.length > 26 ? 18 : 26); })(); });
}

function advanceFromWin() {
  if (currentLevel.birthday) { showBirthdayComplete(); return; }
  const hasMessage = showMessageIfAny(currentLevel.id);
  if (!hasMessage) afterWinFlow();
}

function showBirthdayComplete() {
  const w = getWallet();
  const year = new Date().getFullYear();
  let bonus = "Thank you for playing today 💗";
  if (w.birthdayLevelDone !== year && !birthdayPreview()) {
    w.coins += BIRTHDAY.levelBonus.coins; w.gems += BIRTHDAY.levelBonus.gems; w.birthdayLevelDone = year;
    saveProgress(w);
    bonus = "+" + BIRTHDAY.levelBonus.coins + " 🪙   +" + BIRTHDAY.levelBonus.gems + " 💎";
  }
  document.getElementById("chapter-kicker").textContent = "Birthday level complete";
  document.getElementById("chapter-emoji").textContent = "🎂";
  document.getElementById("chapter-title").textContent = "Happy Birthday, " + PLAYER_NAME + "!";
  document.getElementById("chapter-bonus").textContent = bonus;
  document.getElementById("chapter-next").textContent = "You broke the heart. Now go enjoy your day 💗";
  const box = document.getElementById("chapter-confetti");
  box.innerHTML = "";
  const bits = ["🎉", "🎂", "💖", "🎈", "✨", "🎁"];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("span");
    s.className = "confetti-bit"; s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = (2.6 + Math.random() * 2.4) + "s";
    s.style.animationDelay = (Math.random() * 1.6) + "s";
    s.style.fontSize = (16 + Math.random() * 20) + "px";
    box.appendChild(s);
  }
  playSound("win");
  showScreen("screen-chapter");
}

function isChapterEnd(level) {
  const inChapter = LEVELS.filter(l => l.chapter === level.chapter);
  return inChapter.length > 0 && inChapter[inChapter.length - 1].id === level.id;
}

function afterWinFlow() {
  if (isChapterEnd(currentLevel)) showChapterComplete(currentLevel);
  else goToNextLevel();
}

function showChapterComplete(level) {
  const ch = CHAPTERS.find(c => c.id === level.chapter);
  const next = CHAPTERS.find(c => c.id === level.chapter + 1);
  const w = getWallet();
  w.chaptersDone = Array.isArray(w.chaptersDone) ? w.chaptersDone : [];
  let bonus = "Chapter revisited 💗";
  if (!w.chaptersDone.includes(ch.id)) {
    w.chaptersDone.push(ch.id); w.coins += 100; w.gems += 2; saveProgress(w);
    bonus = "+100 🪙   +2 💎";
  }
  document.getElementById("chapter-kicker").textContent = "Chapter " + ch.id + " complete";
  document.getElementById("chapter-emoji").textContent = ch.emoji;
  document.getElementById("chapter-title").textContent = ch.title;
  document.getElementById("chapter-bonus").textContent = bonus;
  document.getElementById("chapter-next").textContent = !next ? "You finished everything, " + PLAYER_NAME + " 💗"
    : (next.bonus && !ch.bonus) ? "The story is complete 💗  Bonus levels start now: " + next.title + " " + next.emoji
    : "Next: " + next.title + " " + next.emoji;

  const box = document.getElementById("chapter-confetti");
  box.innerHTML = "";
  const bits = ["🎉", "✨", "💖", "🌸", "⭐", "💫"];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement("span");
    s.className = "confetti-bit"; s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = (2.6 + Math.random() * 2.4) + "s";
    s.style.animationDelay = (Math.random() * 1.6) + "s";
    s.style.fontSize = (16 + Math.random() * 20) + "px";
    box.appendChild(s);
  }
  playSound("win");
  showScreen("screen-chapter");
}

function goToNextLevel() {
  const nextId = currentLevel.id + 1;
  if (getLevelById(nextId)) startLevel(nextId);
  else showScreen("screen-title");
}

function buildMap() {
  const mapContainer = document.getElementById("map-container");
  if (!mapContainer) return;
  mapContainer.innerHTML = "";
  const progress = loadProgress();

  let hiddenChapters = 0;
  CHAPTERS.forEach(chapter => {
    const chapterLevels = LEVELS.filter(l => l.chapter === chapter.id);
    if (chapterLevels.length === 0) return;
    // keep the map light: show unlocked chapters plus one locked teaser
    const prevChapterStart = LEVELS.find(l => l.chapter === chapter.id - 1);
    const reachable = chapterLevels[0].id <= progress.highestUnlocked || (prevChapterStart && prevChapterStart.id <= progress.highestUnlocked);
    if (!reachable) { hiddenChapters++; return; }

    const group = document.createElement("div");
    group.className = "chapter-group";
    group.innerHTML = `<div class="chapter-header"><span>${chapter.emoji}</span> <span>${chapter.title}</span></div>`;
    const grid = document.createElement("div");
    grid.className = "level-grid";

    chapterLevels.forEach(lvl => {
      const btn = document.createElement("button");
      btn.className = "level-btn";
      btn.textContent = lvl.id;
      const earned = (progress.stars && progress.stars[lvl.id]) || 0;
      if (earned > 0) {
        const tag = document.createElement("span");
        tag.className = "level-stars"; tag.textContent = "★".repeat(earned);
        btn.appendChild(tag);
      }
      if (lvl.id === progress.highestUnlocked) btn.classList.add("current");
      if (lvl.id <= progress.highestUnlocked) {
        btn.classList.add("unlocked");
        btn.onclick = () => startLevel(lvl.id);
      } else {
        btn.classList.add("locked");
        btn.onclick = () => alert("Level locked! Finish the previous levels first.");
      }
      grid.appendChild(btn);
    });
    group.appendChild(grid);
    mapContainer.appendChild(group);
  });
  if (hiddenChapters > 0) {
    const more = document.createElement("div");
    more.className = "chapter-header";
    more.style.justifyContent = "center";
    more.textContent = "🔒 " + hiddenChapters + " more chapters to discover";
    mapContainer.appendChild(more);
  }
}

function scrollMapToCurrent() {
  requestAnimationFrame(() => {
    const target = document.querySelector("#map-container .level-btn.current");
    if (target && target.scrollIntoView) target.scrollIntoView({ block: "center" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateHomeBadge();

  document.getElementById("btn-start").addEventListener("click", () => { initAudio(); startLevel(loadProgress().highestUnlocked); });
  document.getElementById("btn-map").addEventListener("click", () => { initAudio(); buildMap(); showScreen("screen-map"); scrollMapToCurrent(); });
  document.getElementById("btn-map-back").addEventListener("click", () => { showScreen("screen-title"); updateHomeBadge(); });
  const memoriesButton = document.getElementById("btn-memories");
  if (memoriesButton) memoriesButton.addEventListener("click", () => { buildMemories(); showScreen("screen-memories"); });
  const memoriesBack = document.getElementById("btn-memories-back");
  if (memoriesBack) memoriesBack.addEventListener("click", () => showScreen("screen-title"));
  document.getElementById("btn-next").addEventListener("click", advanceFromWin);
  document.getElementById("btn-message-continue").addEventListener("click", () => { if (skipTyping()) return; afterWinFlow(); });
  const noteCard = document.querySelector("#screen-message .message-card");
  if (noteCard) noteCard.addEventListener("click", skipTyping);
  document.getElementById("btn-chapter-continue").addEventListener("click", () => {
    if (currentLevel && currentLevel.birthday) { updateHomeBadge(); showScreen("screen-title"); return; }
    goToNextLevel();   // after the story finale (ch. 15) this goes straight into bonus level 151
  });
  document.getElementById("btn-retry").addEventListener("click", () => startLevel(currentLevel.id));

  document.getElementById("btn-pause").addEventListener("click", () => {
    isPaused = true;
    document.getElementById("pause-modal").classList.add("show");
  });

  document.getElementById("btn-resume").addEventListener("click", () => {
    isPaused = false;
    document.getElementById("pause-modal").classList.remove("show");
  });

  document.getElementById("btn-restart").addEventListener("click", () => startLevel(currentLevel.id));

  document.getElementById("btn-quit").addEventListener("click", () => {
    isPaused = false;
    document.getElementById("pause-modal").classList.remove("show");
    showScreen("screen-map");
    buildMap(); scrollMapToCurrent();
  });

  document.getElementById("btn-hammer").addEventListener("click", () => {
    if (hammers > 0) { hammerMode = !hammerMode; selectedIndex = null; updateHUD(); renderBoard(); }
  });

  document.getElementById("btn-hint").addEventListener("click", () => {
    if (hints <= 0 || isBusy || isPaused || levelOver) return;
    const swap = findValidSwap();
    if (!swap) return;
    hints--; persistInventory(); hammerMode = false; selectedIndex = null;
    updateHUD(); renderBoard(); playSound('pop');
    const tiles = document.querySelectorAll("#board .tile");
    swap.forEach(i => { if (tiles[i]) tiles[i].classList.add("hint"); });
  });

  document.getElementById("btn-shuffle").addEventListener("click", async () => {
    if (shuffles > 0 && !isBusy && !isPaused && !levelOver) {
      shuffles--; persistInventory(); updateHUD(); playSound('swap');
      shuffleBoardArray();            // keeps cherries in place
      isBusy = true;
      renderBoard(); await sleep(200);
      await resolveMatches(findMatches());
    }
  });

  const openShop = () => { initAudio(); playSound('pop'); buildShop(); showScreen("screen-shop"); };
  document.getElementById("btn-shop").addEventListener("click", openShop);
  document.getElementById("btn-coins-plus").addEventListener("click", openShop);
  document.getElementById("btn-shop-back").addEventListener("click", () => { showScreen("screen-title"); updateHomeBadge(); });

  document.getElementById("btn-extra-moves").addEventListener("click", buyExtraMoves);

  // Settings
  document.getElementById("btn-settings").addEventListener("click", () => {
    initAudio(); syncSettingsUI();
    document.getElementById("settings-modal").classList.add("show");
  });
  document.getElementById("btn-guide").addEventListener("click", () => {
    document.getElementById("settings-modal").classList.remove("show");
    document.getElementById("guide-modal").classList.add("show");
  });
  document.getElementById("btn-guide-close").addEventListener("click", () => document.getElementById("guide-modal").classList.remove("show"));
  document.getElementById("btn-settings-close").addEventListener("click", () => document.getElementById("settings-modal").classList.remove("show"));
  document.getElementById("tg-sound").addEventListener("click", () => toggleSetting("sound"));
  document.getElementById("tg-music").addEventListener("click", () => toggleSetting("music"));
  document.getElementById("tg-vibrate").addEventListener("click", () => toggleSetting("vibrate"));
  document.getElementById("btn-reset").addEventListener("click", () => {
    if (confirm("Reset ALL progress, coins, stars and items? This cannot be undone.")) {
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      document.getElementById("settings-modal").classList.remove("show");
      updateHomeBadge(); updateDailyButton();
    }
  });

  // Daily reward
  document.getElementById("btn-daily").addEventListener("click", () => { initAudio(); openDaily(); });
  document.getElementById("btn-daily-claim").addEventListener("click", claimDaily);
  document.getElementById("daily-modal").addEventListener("click", (e) => { if (e.target.id === "daily-modal") e.target.classList.remove("show"); });
  updateDailyButton();
  document.getElementById("btn-birthday-claim").addEventListener("click", claimBirthday);
  document.getElementById("btn-birthday-level").addEventListener("click", () => { initAudio(); startLevel("bday"); });
  document.getElementById("birthday-banner").addEventListener("click", () => { initAudio(); showBirthday(); });
  updateBirthdayBanner();
  if (isBirthdayToday() && birthdayUnclaimed()) { birthdayShowing = true; setTimeout(showBirthday, 500); }
  else if (dailyState().claimable) setTimeout(openDaily, 600);

  let tapCount = 0; let tapTimer = null;
  const titleText = document.querySelector(".title-logo h1");
  if (titleText) {
    titleText.addEventListener("click", () => {
      tapCount++;
      clearTimeout(tapTimer);
      if (tapCount >= 5) {
        tapCount = 0;
        let p = loadProgress(); p.highestUnlocked = LEVELS.length; saveProgress(p);
        updateHomeBadge(); playSound('win');
        alert("Developer Cheat Activated! All " + LEVELS.length + " levels are now unlocked.");
      } else {
        tapTimer = setTimeout(() => { tapCount = 0; }, 1500);
      }
    });
  }
});
