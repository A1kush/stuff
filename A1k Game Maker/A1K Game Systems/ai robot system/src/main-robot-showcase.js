// src/main-robot-showcase.js
// Interactive robot gallery showcase

import "./style.css";
import { AllRobotSprites } from "./art/AllRobotSprites.js";
import {
  ROBOT_REGISTRY,
  getAllRobots,
  getRobotsByType,
  getRobotsByTier,
  ROBOT_TYPES,
  ROBOT_TIERS,
} from "./robots/RobotRegistry.js";

// Setup
const app = document.querySelector("#app");
app.innerHTML = `
  <h1>🤖 AI Robot Gallery</h1>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <div class="controls">
    <h2>All 12 Robots</h2>
    <div class="type-filter" id="type-filter"></div>
    <div class="tier-filter" id="tier-filter"></div>
    <div id="robot-selector"></div>
    <div id="robot-stats" class="info"></div>
  </div>
`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 850;

const robotSprites = new AllRobotSprites();
let allRobots = getAllRobots();
let filteredRobots = [...allRobots];
let selectedRobotIndex = 0;
let selectedType = null;
let selectedTier = null;
let animTime = 0;

// Create type filter buttons
const typeFilter = document.getElementById("type-filter");
const allTypesBtn = document.createElement("button");
allTypesBtn.textContent = "All Types";
allTypesBtn.className = "selected";
allTypesBtn.onclick = () => filterByType(null);
typeFilter.appendChild(allTypesBtn);

for (const [typeId, typeData] of Object.entries(ROBOT_TYPES)) {
  const btn = document.createElement("button");
  btn.textContent = `${typeData.icon} ${typeData.name}`;
  btn.onclick = () => filterByType(typeId);
  typeFilter.appendChild(btn);
}

// Create tier filter buttons
const tierFilter = document.getElementById("tier-filter");
const allTiersBtn = document.createElement("button");
allTiersBtn.textContent = "All Tiers";
allTiersBtn.className = "selected";
allTiersBtn.onclick = () => filterByTier(null);
tierFilter.appendChild(allTiersBtn);

for (const [tierId, tierData] of Object.entries(ROBOT_TIERS)) {
  const btn = document.createElement("button");
  btn.textContent = `${tierData.stars} ${tierData.name}`;
  btn.onclick = () => filterByTier(tierId);
  tierFilter.appendChild(btn);
}

function filterByType(type) {
  selectedType = type;
  applyFilters();
  
  // Update button states
  document.querySelectorAll(".type-filter button").forEach(b => {
    b.className = "";
  });
  if (!type) {
    allTypesBtn.className = "selected";
  } else {
    const typeData = ROBOT_TYPES[type];
    document.querySelectorAll(".type-filter button").forEach(b => {
      if (b.textContent.includes(typeData.name)) {
        b.className = "selected";
      }
    });
  }
}

function filterByTier(tier) {
  selectedTier = tier;
  applyFilters();
  
  // Update button states
  document.querySelectorAll(".tier-filter button").forEach(b => {
    b.className = "";
  });
  if (!tier) {
    allTiersBtn.className = "selected";
  } else {
    const tierData = ROBOT_TIERS[tier];
    document.querySelectorAll(".tier-filter button").forEach(b => {
      if (b.textContent.includes(tierData.name)) {
        b.className = "selected";
      }
    });
  }
}

function applyFilters() {
  let robots = allRobots;
  
  if (selectedType) {
    robots = robots.filter(r => r.type === selectedType);
  }
  
  if (selectedTier) {
    robots = robots.filter(r => r.tier === selectedTier);
  }
  
  filteredRobots = robots;
  selectedRobotIndex = 0;
  updateRobotSelector();
  updateStats();
}

// Create robot selector buttons
function updateRobotSelector() {
  const selector = document.getElementById("robot-selector");
  selector.innerHTML = "";
  
  for (let i = 0; i < filteredRobots.length; i++) {
    const robot = filteredRobots[i];
    const typeData = ROBOT_TYPES[robot.type];
    const btn = document.createElement("button");
    btn.textContent = `${typeData.icon} ${robot.name}`;
    btn.className = i === selectedRobotIndex ? "selected" : "";
    btn.onclick = () => {
      selectedRobotIndex = i;
      updateRobotSelector();
      updateStats();
    };
    selector.appendChild(btn);
  }
}

// Update stats display
function updateStats() {
  const robot = filteredRobots[selectedRobotIndex];
  const statsDiv = document.getElementById("robot-stats");
  const typeData = ROBOT_TYPES[robot.type];
  const tierData = ROBOT_TIERS[robot.tier];
  
  let specialAbilities = "";
  if (robot.hasShield) specialAbilities += "🛡️ Shield • ";
  if (robot.hasHeavyWeapons) specialAbilities += "💥 Heavy Weapons • ";
  if (robot.isHovering) specialAbilities += "🚁 Hovering • ";
  if (robot.isSupport) specialAbilities += "❤️ Support • ";
  if (robot.canCloak) specialAbilities += "👻 Cloaking • ";
  if (robot.canBuild) specialAbilities += "🔧 Builder • ";
  if (robot.isCommander) specialAbilities += "🧠 Commander • ";
  if (specialAbilities) specialAbilities = specialAbilities.slice(0, -3);
  
  statsDiv.innerHTML = `
    <h3>${robot.name} (${robot.id})
      <span class="tier-badge tier-${robot.tier}">${tierData.stars} ${tierData.name}</span>
    </h3>
    <p><strong>Type:</strong> ${typeData.icon} ${typeData.name}</p>
    <p><strong>Category:</strong> ${robot.category}</p>
    <p>${robot.description}</p>
    
    <div style="margin-top: 15px;">
      <p><strong>Combat Stats:</strong></p>
      <p>• HP: ${robot.hp}</p>
      <p>• Attack: ${robot.atk}</p>
      <p>• Defense: ${robot.def}</p>
      <p>• Speed: ${robot.speed}</p>
      <p>• Cost: ${robot.cost} credits</p>
    </div>
    
    <div style="margin-top: 15px;">
      <p><strong>Combat Range:</strong></p>
      <p>• Fire Rate: ${robot.fireRate}ms</p>
      <p>• Ranged Attack: ${robot.ranged} units</p>
      <p>• Melee Range: ${robot.melee} units</p>
    </div>
    
    <div style="margin-top: 15px;">
      <p><strong>AI Modes:</strong></p>
      <p>${robot.modes.map(m => `<span style="background: #5ba3ff22; padding: 2px 8px; border-radius: 3px; margin: 2px;">${m}</span>`).join(' ')}</p>
    </div>
    
    <div style="margin-top: 15px;">
      <p><strong>Target Modes:</strong></p>
      <p>${robot.targetModes.map(m => `<span style="background: #5bffaa22; padding: 2px 8px; border-radius: 3px; margin: 2px;">${m}</span>`).join(' ')}</p>
    </div>
    
    <div style="margin-top: 15px;">
      <p><strong>Abilities:</strong></p>
      <p>${robot.abilities.map(a => `• ${a}`).join('<br>')}</p>
    </div>
    
    ${specialAbilities ? `<div style="margin-top: 15px;"><p><strong>Special Features:</strong></p><p>${specialAbilities}</p></div>` : ''}
    
    ${robot.healingPower ? `<p><strong>Healing Power:</strong> ${robot.healingPower} HP</p>` : ''}
    ${robot.shieldStrength ? `<p><strong>Shield Strength:</strong> ${robot.shieldStrength}</p>` : ''}
    ${robot.buffPower > 1 ? `<p><strong>Buff Power:</strong> ${robot.buffPower}x (${robot.buffRadius} radius)</p>` : ''}
  `;
}

// Render function
function render() {
  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, "#0a0e27");
  bgGradient.addColorStop(0.5, "#1a1a2e");
  bgGradient.addColorStop(1, "#16213e");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid pattern
  ctx.strokeStyle = "rgba(0, 212, 255, 0.1)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Selected robot display
  const selectedRobot = filteredRobots[selectedRobotIndex];
  if (selectedRobot) {
    const state = {
      animTime,
      color: selectedRobot.color,
      secondaryColor: selectedRobot.secondaryColor,
      facingLeft: false,
      animState: 'idle',
      hasShield: selectedRobot.hasShield,
      cloaked: false,
    };
    
    // Draw robot (large, centered)
    robotSprites.renderRobot(ctx, selectedRobot.id, canvas.width / 2, canvas.height / 2 - 50, state);
    
    // Draw robot name
    ctx.fillStyle = selectedRobot.color;
    ctx.font = "bold 48px 'Courier New'";
    ctx.textAlign = "center";
    ctx.shadowColor = selectedRobot.color;
    ctx.shadowBlur = 20;
    ctx.fillText(selectedRobot.name, canvas.width / 2, 120);
    ctx.shadowBlur = 0;
    
    // Draw type
    const typeData = ROBOT_TYPES[selectedRobot.type];
    ctx.fillStyle = typeData.color;
    ctx.font = "bold 24px 'Courier New'";
    ctx.fillText(`${typeData.icon} ${typeData.name}`, canvas.width / 2, 160);
    
    // Stats bar
    const barX = 50;
    const barY = canvas.height - 180;
    
    // HP bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(barX, barY, 300, 30);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(barX, barY, 300, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Courier New'";
    ctx.textAlign = "left";
    ctx.fillText(`HP: ${selectedRobot.hp}`, barX + 10, barY + 20);
    
    // ATK
    ctx.fillStyle = "#ff4444";
    ctx.fillText(`ATK: ${selectedRobot.atk}`, barX, barY + 50);
    
    // DEF
    ctx.fillStyle = "#74b9ff";
    ctx.fillText(`DEF: ${selectedRobot.def}`, barX + 150, barY + 50);
    
    // SPD
    ctx.fillStyle = "#ffff00";
    ctx.fillText(`SPD: ${selectedRobot.speed}`, barX, barY + 75);
    
    // Cost
    ctx.fillStyle = "#ffd56a";
    ctx.font = "bold 22px 'Courier New'";
    ctx.fillText(`💰 ${selectedRobot.cost} credits`, barX, barY + 105);
    
    // Category badge
    ctx.fillStyle = selectedRobot.secondaryColor;
    ctx.font = "bold 18px 'Courier New'";
    ctx.fillText(`[${selectedRobot.category.toUpperCase()}]`, barX, barY + 135);
  }
  
  ctx.textAlign = "left";
}

// Game loop
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;
  
  animTime = currentTime;
  
  render();
  
  requestAnimationFrame(gameLoop);
}

// Initialize
updateRobotSelector();
updateStats();
requestAnimationFrame(gameLoop);

console.log("🤖 Robot Gallery loaded!");
console.log(`Total robots: ${allRobots.length}`);
console.log("Robot IDs:", allRobots.map(r => r.id));
console.log("Types:", Object.keys(ROBOT_TYPES));
console.log("By Type:", {
  combat: getRobotsByType("combat_bot").length,
  support: getRobotsByType("support_drone").length,
  mech: getRobotsByType("mech").length,
  sniper: getRobotsByType("ranged_specialist").length,
  stealth: getRobotsByType("infiltrator").length,
  engineer: getRobotsByType("builder").length,
  plasma: getRobotsByType("energy_specialist").length,
  ai_core: getRobotsByType("command_unit").length,
});

