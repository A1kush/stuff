// src/main-spirit-showcase.js
// Interactive showcase for 7 spirits + 7 abilities

import "./style.css";
import { AllSpiritSprites } from "./art/AllSpiritSprites.js";
import { AllAbilityEffects } from "./art/AllAbilityEffects.js";
import {
  SPIRIT_REGISTRY,
  getAllSpirits,
  getSpiritsByElement,
  SPIRIT_ELEMENTS,
  SPIRIT_RARITIES,
} from "./spirits/SpiritRegistry.js";
import {
  ABILITY_REGISTRY,
  getAllAbilities,
  getActiveAbilities,
  getPassiveAbilities,
  ABILITY_CATEGORIES,
} from "./spirits/AbilityRegistry.js";

// Setup
const app = document.querySelector("#app");
app.innerHTML = `
  <h1>✨ Supernatural Spirit Gallery</h1>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <div class="controls">
    <h2>7 Spirits + 7 Abilities</h2>
    <div class="category-filter" id="category-filter"></div>
    <div id="spirit-selector"></div>
    <div id="ability-selector"></div>
    <div id="item-stats" class="info"></div>
  </div>
`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 850;

const spiritSprites = new AllSpiritSprites();
const abilityEffects = new AllAbilityEffects();
let allSpirits = getAllSpirits();
let allAbilities = getAllAbilities();
let selectedCategory = 'spirits'; // 'spirits' or 'abilities'
let selectedItemIndex = 0;
let animTime = 0;

// Create category filter buttons
const categoryFilter = document.getElementById("category-filter");

const spiritsBtn = document.createElement("button");
spiritsBtn.textContent = "✨ Spirits (7)";
spiritsBtn.className = "selected";
spiritsBtn.onclick = () => selectCategory('spirits');
categoryFilter.appendChild(spiritsBtn);

const abilitiesBtn = document.createElement("button");
abilitiesBtn.textContent = "🔮 Abilities (7)";
abilitiesBtn.onclick = () => selectCategory('abilities');
categoryFilter.appendChild(abilitiesBtn);

const activeBtn = document.createElement("button");
activeBtn.textContent = "⚡ Active (5)";
activeBtn.onclick = () => selectCategory('active');
categoryFilter.appendChild(activeBtn);

const passiveBtn = document.createElement("button");
passiveBtn.textContent = "🛡️ Passive (2)";
passiveBtn.onclick = () => selectCategory('passive');
categoryFilter.appendChild(passiveBtn);

function selectCategory(category) {
  selectedCategory = category;
  selectedItemIndex = 0;
  updateSelectors();
  updateStats();

  // Update button states
  document.querySelectorAll(".category-filter button").forEach(b => b.className = "");
  if (category === 'spirits') spiritsBtn.className = "selected";
  else if (category === 'abilities') abilitiesBtn.className = "selected";
  else if (category === 'active') activeBtn.className = "selected";
  else if (category === 'passive') passiveBtn.className = "selected";
}

function updateSelectors() {
  const spiritSelector = document.getElementById("spirit-selector");
  const abilitySelector = document.getElementById("ability-selector");

  // Clear both
  spiritSelector.innerHTML = "";
  abilitySelector.innerHTML = "";

  if (selectedCategory === 'spirits') {
    // Show spirits
    for (let i = 0; i < allSpirits.length; i++) {
      const spirit = allSpirits[i];
      const element = SPIRIT_ELEMENTS[spirit.element];
      const btn = document.createElement("button");
      btn.textContent = `${spirit.icon} ${spirit.name} (${spirit.power})`;
      btn.className = i === selectedItemIndex ? "selected" : "";
      btn.onclick = () => {
        selectedItemIndex = i;
        updateSelectors();
        updateStats();
      };
      spiritSelector.appendChild(btn);
    }
  } else {
    // Show abilities
    let abilities = allAbilities;
    if (selectedCategory === 'active') {
      abilities = getActiveAbilities();
    } else if (selectedCategory === 'passive') {
      abilities = getPassiveAbilities();
    }

    for (let i = 0; i < abilities.length; i++) {
      const ability = abilities[i];
      const btn = document.createElement("button");
      btn.textContent = `${ability.icon} ${ability.name}`;
      btn.className = i === selectedItemIndex ? "selected" : "";
      btn.onclick = () => {
        selectedItemIndex = i;
        updateSelectors();
        updateStats();
      };
      abilitySelector.appendChild(btn);
    }
  }
}

function updateStats() {
  const statsDiv = document.getElementById("item-stats");

  if (selectedCategory === 'spirits') {
    const spirit = allSpirits[selectedItemIndex];
    const element = SPIRIT_ELEMENTS[spirit.element];
    const rarity = SPIRIT_RARITIES[spirit.rarity];

    let bonusText = '';
    for (const [key, value] of Object.entries(spirit.bonuses)) {
      if (key.includes('Mul')) {
        bonusText += `<p>• ${key.replace('Mul', '')}: +${(value * 100).toFixed(0)}%</p>`;
      } else if (key.includes('Flat')) {
        bonusText += `<p>• ${key.replace('Flat', '')}: +${value}</p>`;
      } else {
        bonusText += `<p>• ${key}: ${value > 0 ? '+' : ''}${value}</p>`;
      }
    }

    statsDiv.innerHTML = `
      <h3>${spirit.icon} ${spirit.name}
        <span class="rarity-badge rarity-${spirit.rarity}">${rarity.stars} ${rarity.name}</span>
      </h3>
      <p><strong>Type:</strong> ${element.icon} ${spirit.type}</p>
      <p><strong>Element:</strong> ${element.name}</p>
      <p><strong>Power:</strong> ${spirit.power}</p>
      <p>${spirit.description}</p>

      <div style="margin-top: 15px;">
        <p><strong>Bonuses:</strong></p>
        ${bonusText}
      </div>

      <div style="margin-top: 15px;">
        <p><strong>Combat:</strong></p>
        <p>• Attack: ${spirit.attackDamage} damage</p>
        <p>• Cooldown: ${spirit.attackCooldown / 1000}s</p>
        <p>• Type: ${spirit.attackType}</p>
        ${spirit.canChainAttack ? '<p>• Special: Chain Lightning</p>' : ''}
      </div>

      <div style="margin-top: 15px;">
        <p><strong>Visual:</strong></p>
        <p>• Orbit Speed: ${spirit.orbitSpeed}</p>
        <p>• Orbit Radius: ${spirit.orbitRadius}px</p>
        <p>• Particle Type: ${spirit.particleType}</p>
        ${spirit.specialPassive ? `<p>• Passive: ${spirit.specialPassive}</p>` : ''}
      </div>
    `;
  } else {
    // Show ability
    let abilities = allAbilities;
    if (selectedCategory === 'active') abilities = getActiveAbilities();
    else if (selectedCategory === 'passive') abilities = getPassiveAbilities();

    const ability = abilities[selectedItemIndex];
    const category = ABILITY_CATEGORIES[ability.category];

    let bonusText = '';
    for (const [key, value] of Object.entries(ability.bonuses)) {
      if (key.includes('Mul')) {
        const percent = ((1 - value) * 100).toFixed(0);
        bonusText += `<p>• ${key.replace('Mul', '')}: ${value < 1 ? '-' : '+'}${percent}%</p>`;
      } else {
        bonusText += `<p>• ${key}: +${value}</p>`;
      }
    }

    statsDiv.innerHTML = `
      <h3>${ability.icon} ${ability.name}
        <span class="ability-badge ability-${ability.type}">${ability.type.toUpperCase()}</span>
      </h3>
      <p><strong>Category:</strong> ${category.icon} ${category.name}</p>
      <p>${ability.description}</p>

      ${ability.type === 'active' ? `
        <div style="margin-top: 15px;">
          <p><strong>Active Stats:</strong></p>
          <p>• Cooldown: ${ability.cooldown / 1000}s</p>
          <p>• Duration: ${ability.duration / 1000}s</p>
          ${ability.dealsDamage ? `<p>• Damage: ${ability.damage}</p>` : ''}
          ${ability.aoeRadius ? `<p>• AOE Radius: ${ability.aoeRadius}px</p>` : ''}
          ${ability.dashSpeed ? `<p>• Dash Speed: ${ability.dashSpeed}</p>` : ''}
        </div>
      ` : ''}

      ${bonusText ? `
        <div style="margin-top: 15px;">
          <p><strong>Bonuses:</strong></p>
          ${bonusText}
        </div>
      ` : ''}

      <div style="margin-top: 15px;">
        <p><strong>Visual Effects:</strong></p>
        <p>• Effect: ${ability.visualEffect}</p>
        <p>• Particles: ${ability.particles}</p>
        ${ability.invulnerable ? '<p>• Grants Invincibility</p>' : ''}
        ${ability.leavesTrail ? '<p>• Leaves Damage Trail</p>' : ''}
        ${ability.alwaysActive ? '<p>• Always Active (Passive)</p>' : ''}
      </div>
    `;
  }
}

// Render function
function render() {
  // Starry mystical background
  const bgGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.height);
  bgGrad.addColorStop(0, "#1a0a2e");
  bgGrad.addColorStop(0.5, "#2d1b4e");
  bgGrad.addColorStop(1, "#0f0520");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Stars
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 100; i++) {
    const x = (i * 137.5) % canvas.width;
    const y = (i * 241.3) % canvas.height;
    const twinkle = Math.sin(animTime / 200 + i) * 0.5 + 0.5;
    ctx.globalAlpha = twinkle * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Mystic particles
  for (let i = 0; i < 30; i++) {
    const x = (i * 211.7 + animTime / 20) % canvas.width;
    const y = (i * 319.3 + animTime / 15) % canvas.height;
    const size = 2 + (i % 4);
    ctx.fillStyle = i % 2 === 0 ? "#7c3aed" : "#a78bfa";
    ctx.globalAlpha = 0.3;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;

  // Render selected item
  if (selectedCategory === 'spirits') {
    const spirit = allSpirits[selectedItemIndex];
    const state = {
      animTime,
      color: spirit.color,
      secondaryColor: spirit.secondaryColor,
      glowColor: spirit.glowColor,
    };

    // Draw spirit (large, centered)
    spiritSprites.renderSpirit(ctx, spirit.id, canvas.width / 2, canvas.height / 2 - 50, state);

    // Draw spirit name
    ctx.fillStyle = spirit.color;
    ctx.font = "bold 48px Georgia";
    ctx.textAlign = "center";
    ctx.shadowColor = spirit.glowColor;
    ctx.shadowBlur = 25;
    ctx.fillText(spirit.name, canvas.width / 2, 120);
    ctx.shadowBlur = 0;

    // Draw type
    const element = SPIRIT_ELEMENTS[spirit.element];
    ctx.fillStyle = element.color;
    ctx.font = "bold 24px Georgia";
    ctx.fillText(`${element.icon} ${spirit.type}`, canvas.width / 2, 160);

    // Draw orbit preview
    ctx.strokeStyle = spirit.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 50, spirit.orbitRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

  } else {
    // Show ability
    let abilities = allAbilities;
    if (selectedCategory === 'active') abilities = getActiveAbilities();
    else if (selectedCategory === 'passive') abilities = getPassiveAbilities();

    const ability = abilities[selectedItemIndex];

    // Draw ability name
    ctx.fillStyle = ability.color;
    ctx.font = "bold 48px Georgia";
    ctx.textAlign = "center";
    ctx.shadowColor = ability.color;
    ctx.shadowBlur = 25;
    ctx.fillText(ability.name, canvas.width / 2, 200);
    ctx.shadowBlur = 0;

    // Draw type
    ctx.fillStyle = ability.secondaryColor;
    ctx.font = "bold 24px Georgia";
    ctx.fillText(`${ability.icon} ${ability.type.toUpperCase()}`, canvas.width / 2, 240);

    // Visualize ability effect
    visualizeAbility(ability, canvas.width / 2, canvas.height / 2);
  }

  // Render active effects
  abilityEffects.render(ctx);

  // Stats display
  displayStats();

  ctx.textAlign = "left";
}

function visualizeAbility(ability, cx, cy) {
  const time = animTime / 1000;

  switch (ability.id) {
    case 'divine_barrier':
      // Shield ring
      ctx.strokeStyle = ability.color;
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.6 + Math.sin(time * 3) * 0.3;
      ctx.shadowColor = ability.secondaryColor;
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      break;

    case 'angelic_might':
      // Power aura
      const pulseSize = 60 + Math.sin(time * 4) * 15;
      ctx.fillStyle = ability.color;
      ctx.globalAlpha = 0.3;
      ctx.shadowColor = ability.color;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      break;

    case 'dash_nova':
    case 'flame_dash':
      // Speed lines
      ctx.strokeStyle = ability.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 5; i++) {
        const offset = i * 20;
        ctx.beginPath();
        ctx.moveTo(cx - 100 + offset, cy - 20);
        ctx.lineTo(cx - 60 + offset, cy - 20);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 100 + offset, cy + 20);
        ctx.lineTo(cx - 60 + offset, cy + 20);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;

    case 'radiant_burst':
      // Explosion waves
      for (let i = 0; i < 3; i++) {
        const radius = 40 + i * 30 + Math.sin(time * 3 + i) * 10;
        ctx.strokeStyle = ability.color;
        ctx.lineWidth = 4 - i;
        ctx.globalAlpha = 0.5 - i * 0.15;
        ctx.shadowColor = ability.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      break;

    case 'aura_of_fortune':
      // Luck sparkles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time * 2;
        const radius = 50 + Math.sin(time * 3 + i) * 15;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        ctx.fillStyle = ability.color;
        ctx.shadowColor = ability.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      break;

    case 'iron_will':
      // Defensive ring
      ctx.strokeStyle = ability.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5 + Math.sin(time * 2) * 0.2;
      ctx.shadowColor = ability.secondaryColor;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      break;
  }
}

function displayStats() {
  const barX = 50;
  const barY = canvas.height - 150;

  ctx.textAlign = "left";

  if (selectedCategory === 'spirits') {
    const spirit = allSpirits[selectedItemIndex];

    // Power bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(barX, barY, 300, 25);
    ctx.fillStyle = spirit.color;
    const powerWidth = (spirit.power / 100) * 300;
    ctx.fillRect(barX, barY, powerWidth, 25);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px Georgia";
    ctx.fillText(`Power: ${spirit.power}`, barX + 10, barY + 18);

    // Element
    const element = SPIRIT_ELEMENTS[spirit.element];
    ctx.fillStyle = element.color;
    ctx.font = "bold 20px Georgia";
    ctx.fillText(`${element.icon} ${element.name.toUpperCase()}`, barX, barY + 50);
  } else {
    const abilities = selectedCategory === 'active' ? getActiveAbilities() : 
                      selectedCategory === 'passive' ? getPassiveAbilities() : allAbilities;
    const ability = abilities[selectedItemIndex];

    if (ability.type === 'active') {
      ctx.fillStyle = ability.color;
      ctx.font = "bold 18px Georgia";
      ctx.fillText(`Cooldown: ${ability.cooldown / 1000}s`, barX, barY);
      ctx.fillText(`Duration: ${ability.duration / 1000}s`, barX, barY + 30);
    } else {
      ctx.fillStyle = ability.color;
      ctx.font = "bold 18px Georgia";
      ctx.fillText("ALWAYS ACTIVE", barX, barY);
    }

    const category = ABILITY_CATEGORIES[ability.category];
    ctx.fillStyle = category.color;
    ctx.font = "bold 20px Georgia";
    ctx.fillText(`${category.icon} ${category.name.toUpperCase()}`, barX, barY + 65);
  }
}

// Game loop
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  animTime = currentTime;

  // Update effects
  abilityEffects.update(dt);

  render();

  requestAnimationFrame(gameLoop);
}

// Initialize
updateSelectors();
updateStats();
requestAnimationFrame(gameLoop);

console.log("✨ Supernatural Spirit Gallery loaded!");
console.log(`Total spirits: ${allSpirits.length}`);
console.log(`Total abilities: ${allAbilities.length}`);
console.log("Spirit IDs:", allSpirits.map(s => s.id));
console.log("Ability IDs:", allAbilities.map(a => a.id));
console.log("Elements:", Object.keys(SPIRIT_ELEMENTS));
console.log("Categories:", Object.keys(ABILITY_CATEGORIES));

