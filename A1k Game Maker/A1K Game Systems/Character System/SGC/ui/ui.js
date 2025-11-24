import { validateHero } from "../scripts/schema-validator.js";
import { RibbonSim } from "../sim/ribbon.js";
import { EconomySimulator } from "../scripts/economy.js";

const rankFilter = document.getElementById("rankFilter");
const roleFilter = document.getElementById("roleFilter");
const rerollBtn = document.getElementById("rerollBtn");
const heroGrid = document.getElementById("heroGrid");
const statusPanel = document.getElementById("statusPanel");
const template = document.getElementById("heroCardTemplate");
const ribbonCanvas = document.getElementById("ribbonCanvas");
const pauseRibbonBtn = document.getElementById("pauseRibbon");
const playRibbonBtn = document.getElementById("playRibbon");
const seedInput = document.getElementById("seedInput");
const playstyleSelect = document.getElementById("playstyleSelect");
const rollEventBtn = document.getElementById("rollEventBtn");
const currencyReadout = document.getElementById("currencyReadout");
const eventLog = document.getElementById("eventLog");
const colorblindToggle = document.getElementById("colorblindToggle");
const autoFeedToggle = document.getElementById("autoFeedToggle");
const cinematicSlider = document.getElementById("cinematicSlider");
const snapshotInput = document.getElementById("snapshotInput");
const exportSnapshotBtn = document.getElementById("exportSnapshot");
const importSnapshotBtn = document.getElementById("importSnapshot");

const ribbonSim = ribbonCanvas ? new RibbonSim(ribbonCanvas) : null;
let economy;
let roster = [];
let filtered = [];

const rankColors = {
  E: "#6fb1ff",
  C: "#ffce54",
  A: "#8233ff",
  S: "#ff7edb",
  SS: "#f996ff",
  SSS: "#f4f1ff",
  SSSS: "#ffffff"
};

init();

async function init() {
  statusPanel.textContent = "Loading roster...";
  try {
    const [heroes, events] = await Promise.all([
      loadRoster(),
      fetchJSON("../data/events.json")
    ]);
    roster = heroes;
    filtered = roster.slice();
    economy = new EconomySimulator(events);
    economy.setRoster(roster);
    economy.setSeed(seedInput?.value || "sgc-default");
    applyCinematicIntensity(cinematicSlider?.value || "1");
    render();
    wireEvents();
    updateRibbon();
    updateCurrencyReadout();
    statusPanel.textContent = `Loaded ${roster.length} heroes. Toggle filters or roll surprise events.`;
  } catch (err) {
    console.error(err);
    statusPanel.textContent = "Failed to load heroes. Check file paths or run from same directory.";
  }
}

function wireEvents() {
  rankFilter.addEventListener("change", applyFilters);
  roleFilter.addEventListener("change", applyFilters);
  rerollBtn.addEventListener("click", () => {
    const hero = filtered[Math.floor(Math.random() * filtered.length)];
    if (!hero) return;
    statusPanel.textContent = `${hero.name} just appeared! ${hero.acquisition.spawn_logic}`;
  });
  if (pauseRibbonBtn && ribbonSim) {
    pauseRibbonBtn.addEventListener("click", () => ribbonSim.pause());
  }
  if (playRibbonBtn && ribbonSim) {
    playRibbonBtn.addEventListener("click", () => ribbonSim.start());
  }
  if (seedInput && economy) {
    seedInput.addEventListener("change", () => {
      economy.setSeed(seedInput.value);
      statusPanel.textContent = `Seed locked to "${seedInput.value}" for reproducible events.`;
    });
  }
  if (rollEventBtn && economy) {
    rollEventBtn.addEventListener("click", handleRollEvent);
  }
  if (colorblindToggle) {
    colorblindToggle.addEventListener("change", () =>
      document.body.classList.toggle("colorblind-mode", colorblindToggle.checked)
    );
  }
  if (autoFeedToggle) {
    autoFeedToggle.addEventListener("change", () => {
      document.body.classList.toggle("auto-feed-mode", autoFeedToggle.checked);
      statusPanel.textContent = autoFeedToggle.checked
        ? "Auto-feed assist will automate feed beats in future builds."
        : "Auto-feed assist disabled.";
    });
  }
  if (cinematicSlider) {
    cinematicSlider.addEventListener("input", () => {
      applyCinematicIntensity(cinematicSlider.value);
      statusPanel.textContent = `Cinematic intensity ${cinematicSlider.value}x`;
    });
  }
  if (exportSnapshotBtn && snapshotInput && economy) {
    exportSnapshotBtn.addEventListener("click", handleSnapshotExport);
  }
  if (importSnapshotBtn && snapshotInput && economy) {
    importSnapshotBtn.addEventListener("click", handleSnapshotImport);
  }
}

async function loadRoster() {
  const ids = await fetchJSON("../data/heroes/index.json");
  const heroes = await Promise.all(
    ids.map((id) => fetchJSON(`../data/heroes/${id}.json`))
  );
  heroes.forEach((hero) => {
    const issues = validateHero(hero);
    if (issues.length) {
      console.warn(`Schema issues for ${hero.name}`, issues);
    }
  });
  return heroes;
}

function applyFilters() {
  const rankValue = rankFilter.value;
  const roleValue = roleFilter.value;
  filtered = roster.filter((hero) => {
    const rankMatch = rankValue === "all" || hero.rank === rankValue;
    const roleMatch = roleValue === "all" || hero.role === roleValue;
    return rankMatch && roleMatch;
  });
  render();
  updateRibbon();
  statusPanel.textContent = `Showing ${filtered.length} heroes after filter.`;
}

function render() {
  heroGrid.innerHTML = "";
  filtered.forEach((hero) => {
    heroGrid.appendChild(createCard(hero));
  });
}

function updateRibbon() {
  if (!ribbonSim) return;
  ribbonSim.setHeroes(filtered.slice(0, 6));
}

function createCard(hero) {
  const node = template.content.cloneNode(true);
  const article = node.querySelector(".hero-card");
  article.classList.add(`rank-${hero.rank}`);

  node.querySelector(".hero-card__rank").textContent = `${hero.rank} • ${hero.role}`;
  node.querySelector(".hero-card__name").textContent = hero.name;
  node.querySelector(".hero-card__summary").textContent = hero.summary.hook;

  const stats = node.querySelector(".hero-card__stats");
  Object.entries(hero.stats).forEach(([key, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = key.slice(0, 3).toUpperCase();
    const dd = document.createElement("dd");
    dd.textContent = value;
    stats.appendChild(dt);
    stats.appendChild(dd);
  });

  const skillsWrap = node.querySelector(".hero-card__skills");
  hero.skills.forEach((skill) => {
    const skillBox = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${skill.name} • ${skill.type}`;
    const desc = document.createElement("p");
    desc.textContent = `${skill.effects.join(", ")}. Why: ${skill.rationale}`;
    skillBox.appendChild(title);
    skillBox.appendChild(desc);
    skillsWrap.appendChild(skillBox);
  });

  const acquisitionLine = node.querySelector(".hero-card__acquisition");
  let acquisitionText = `Acquire: ${hero.acquisition.method} — Costs ${formatCosts(hero.acquisition.costs)}`;
  if (economy) {
    const hireState = economy.evaluateHire(hero);
    if (hireState.canAfford) {
      acquisitionText += " • Ready to hire";
    } else if (Object.keys(hireState.shortfall).length) {
      acquisitionText += ` • Need ${formatCosts(hireState.shortfall)}`;
    }
  }
  acquisitionLine.textContent = acquisitionText;

  node.querySelector(
    ".hero-card__synergy"
  ).textContent = `Synergy: ${hero.synergy.combos.join(" | ")}`;

  const canvas = node.querySelector("[data-canvas]");
  drawAura(canvas, hero);
  return node;
}

function handleRollEvent() {
  if (!economy) return;
  const playstyle = playstyleSelect?.value || "balanced";
  const result = economy.rollEvent(playstyle);
  updateCurrencyReadout();
  if (result.rewards.auctionLots) {
    logEvent(
      `${result.event.name}: ${result.detail}. Lots → ${result.rewards.auctionLots
        .map((lot) => `${lot.name} (${formatCosts(lot.cost)})`)
        .join(" | ")}`
    );
  } else {
    logEvent(`${result.event.name}: ${result.detail}`);
  }
  statusPanel.textContent = `${result.event.name} resolved. Currencies refreshed.`;
}

function drawAura(canvas, hero) {
  const ctx = canvas.getContext("2d");
  const color = rankColors[hero.rank] || "#ffffff";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createRadialGradient(90, 90, 10, 90, 90, 90);
  gradient.addColorStop(0, hexToRgba(color, 0.9));
  gradient.addColorStop(1, hexToRgba(color, 0));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 12; i++) {
    const angle = ((performance.now() / 1000 + i) % 1) * Math.PI * 2;
    const radius = 50 + (i % 3) * 12;
    const x = 90 + Math.cos(angle) * radius;
    const y = 90 + Math.sin(angle) * radius * 0.6;
    ctx.beginPath();
    ctx.fillStyle = hexToRgba(color, 0.35);
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function hexToRgba(hex, alpha = 1) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatCosts(costs) {
  return Object.entries(costs)
    .map(([key, value]) => `${value} ${key}`)
    .join(", ");
}

async function fetchJSON(path) {
  const url = new URL(path, import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  return res.json();
}

function updateCurrencyReadout() {
  if (!currencyReadout || !economy) return;
  currencyReadout.innerHTML = "";
  Object.entries(economy.getCurrencies()).forEach(([key, value]) => {
    const li = document.createElement("li");
    li.textContent = `${key.replace(/_/g, " ")}: ${value}`;
    currencyReadout.appendChild(li);
  });
}

function logEvent(message) {
  if (!eventLog) return;
  const entry = document.createElement("div");
  entry.className = "event-log__entry";
  entry.textContent = message;
  eventLog.prepend(entry);
  while (eventLog.children.length > 6) {
    eventLog.lastChild.remove();
  }
}

function handleSnapshotExport() {
  if (!snapshotInput || !economy) return;
  const snapshot = economy.serializeState();
  snapshotInput.value = JSON.stringify(snapshot, null, 2);
  statusPanel.textContent = "Snapshot exported. Store it anywhere to replay seeds later.";
}

function handleSnapshotImport() {
  if (!snapshotInput || !economy) return;
  try {
    const snapshot = JSON.parse(snapshotInput.value || "{}");
    economy.loadState(snapshot);
    if (snapshot.seed && seedInput) {
      seedInput.value = snapshot.seed;
    }
    updateCurrencyReadout();
    statusPanel.textContent = "Snapshot imported. Economy + seed restored.";
  } catch (err) {
    console.error(err);
    statusPanel.textContent = "Invalid snapshot JSON. Please check formatting.";
  }
}

function applyCinematicIntensity(value) {
  const clamped = Math.max(0.5, Math.min(1.5, Number(value) || 1));
  document.documentElement.style.setProperty("--cinematic-intensity", clamped);
  if (cinematicSlider && cinematicSlider.value !== String(clamped)) {
    cinematicSlider.value = clamped;
  }
}
