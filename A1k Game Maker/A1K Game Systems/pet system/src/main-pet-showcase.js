// src/main-pet-showcase.js
// Showcase demo for all 13 chibi candy-style pets

import "./style.css";
import { AllPetSprites } from "./art/AllPetSprites.js";
import {
  PET_REGISTRY,
  getPet,
  getAllPets,
  getPetsByElement,
  getPetsByRarity,
  ELEMENTS,
  RARITIES,
} from "./pets/PetRegistry.js";
import { PET_SKILLS, getPetSkills } from "./pets/PetSkills.js";
import { SkillEffects } from "./art/SkillEffects.js";

// ----- Setup -----
const app = document.querySelector("#app");
app.innerHTML = `
  <h1>🍬 Chibi Pet Gallery</h1>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <div class="controls">
    <h2>All 14 Pets (with Skills!)</h2>
    <div class="element-filter" id="element-filter"></div>
    <div id="pet-selector"></div>
    <div id="pet-stats" class="info"></div>
  </div>
`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1400;
canvas.height = 850;

const petSprites = new AllPetSprites();
const skillEffects = new SkillEffects();
let allPets = getAllPets();
let filteredPets = [...allPets];
let selectedPetIndex = 0;
let selectedElement = null;
let animTime = 0;

// Create demo pet instances for skill testing
const demoPets = {};
for (const pet of allPets) {
  demoPets[pet.id] = {
    ...pet,
    petId: pet.id,
    x: canvas.width / 2,
    y: 400,
    normalCooldown: 0,
    specialCooldown: 0,
    owner: { x: 100, y: 400 },
  };
}

// Create element filter buttons
const elementFilter = document.getElementById("element-filter");
const filterBtn = document.createElement("button");
filterBtn.textContent = "All Elements";
filterBtn.className = "selected";
filterBtn.onclick = () => {
  selectedElement = null;
  filteredPets = getAllPets();
  selectedPetIndex = 0;
  updatePetSelector();
  updateAllFilterButtons();
  filterBtn.className = "selected";
};
elementFilter.appendChild(filterBtn);

Object.entries(ELEMENTS).forEach(([key, data]) => {
  const btn = document.createElement("button");
  btn.textContent = `${data.icon} ${data.name}`;
  btn.onclick = () => {
    selectedElement = key;
    filteredPets = getPetsByElement(key);
    selectedPetIndex = 0;
    updatePetSelector();
    updateAllFilterButtons();
    btn.className = "selected";
  };
  elementFilter.appendChild(btn);
});

function updateAllFilterButtons() {
  document.querySelectorAll(".element-filter button").forEach((b) => {
    b.className = "";
  });
}

// Create pet selector buttons
const selector = document.getElementById("pet-selector");

function updatePetSelector() {
  selector.innerHTML = "";

  filteredPets.forEach((pet, index) => {
    const btn = document.createElement("button");
    const element = ELEMENTS[pet.element];
    const rarity = RARITIES[pet.rarity];
    btn.innerHTML = `${element.icon} ${pet.name}`;
    btn.className = index === selectedPetIndex ? "selected" : "";

    btn.onclick = () => {
      selectedPetIndex = index;
      updatePetButtons();
      updateStats();
    };

    selector.appendChild(btn);
  });
}

function updatePetButtons() {
  document.querySelectorAll("#pet-selector button").forEach((b, i) => {
    b.className = i === selectedPetIndex ? "selected" : "";
  });
}

// Update stats display
function updateStats() {
  const pet = filteredPets[selectedPetIndex];
  const statsDiv = document.getElementById("pet-stats");
  const element = ELEMENTS[pet.element];
  const rarity = RARITIES[pet.rarity];
  const skills = getPetSkills(pet.id);

  if (!skills) return;

  statsDiv.innerHTML = `
    <h3>${pet.name} (${pet.id})
      <span class="rarity-badge rarity-${pet.rarity}">${rarity.star} ${
    rarity.name
  }</span>
    </h3>
    <p><strong>Element:</strong> ${element.icon} ${element.name}</p>
    <p>${pet.description}</p>
    <div style="margin-top: 12px;">
      <p><strong>Combat Stats:</strong></p>
      <p>• Attack: ${pet.attack}</p>
      <p>• Health: ${pet.health}</p>
      <p>• Speed: ${(pet.speed * 100).toFixed(0)}%</p>
      <p>• Cost: ${pet.cost} gold</p>
      <p>• Follow Distance: ${pet.followDistance}px</p>
      <p>• Attack Range: ${pet.attackRange}px</p>
    </div>
    <div style="margin-top: 12px;">
      <p><strong>💫 Normal Skill:</strong> ${skills.normal.name}</p>
      <p>• Damage: ${skills.normal.damage}</p>
      <p>• Cooldown: ${skills.normal.cooldown / 1000}s</p>
      <p>• Type: ${skills.normal.type}</p>
    </div>
    <div style="margin-top: 12px;">
      <p><strong>⚡ INSANE SPECIAL:</strong> ${skills.special.name}</p>
      <p>• Damage: ${skills.special.damage} 💥</p>
      <p>• Cooldown: ${skills.special.cooldown / 1000}s</p>
      <p>• Type: ${skills.special.type}</p>
      <p>• Screen Shake: ${skills.special.screenShake || 0}</p>
    </div>
  `;
}

// Render function
function render() {
  // Clear with candy gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGradient.addColorStop(0, "#1a0a2e");
  bgGradient.addColorStop(0.5, "#16213e");
  bgGradient.addColorStop(1, "#0f3460");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cute sparkle background
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  for (let i = 0; i < 50; i++) {
    const sparkleX = (i * 173 + animTime * 0.01) % canvas.width;
    const sparkleY = (i * 97 + animTime * 0.015) % canvas.height;
    const sparkleSize = (Math.sin(animTime * 0.005 + i) + 1) * 1.5;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground line
  const groundY = canvas.height - 200;
  ctx.strokeStyle = "#ff6b9d";
  ctx.lineWidth = 3;
  ctx.shadowColor = "#ff6b9d";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(canvas.width, groundY);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Title for selected pet
  const selectedPet = filteredPets[selectedPetIndex];
  const element = ELEMENTS[selectedPet.element];

  ctx.fillStyle = element.color;
  ctx.font = "bold 36px 'Comic Sans MS'";
  ctx.textAlign = "center";
  ctx.shadowColor = element.color;
  ctx.shadowBlur = 10;
  ctx.fillText(`${element.icon} ${selectedPet.name}`, canvas.width / 2, 60);
  ctx.shadowBlur = 0;

  const rarity = RARITIES[selectedPet.rarity];
  ctx.fillStyle = rarity.color;
  ctx.font = "bold 18px 'Comic Sans MS'";
  ctx.fillText(
    `${rarity.star} ${rarity.name.toUpperCase()}`,
    canvas.width / 2,
    95
  );

  // Render large selected pet in center
  const state = {
    animTime,
    elementColor: selectedPet.elementColor,
    secondaryColor: selectedPet.secondaryColor,
  };

  // Scale up selected pet
  ctx.save();
  ctx.translate(canvas.width / 2, groundY - 80);
  ctx.scale(3, 3);
  petSprites.renderPet(ctx, selectedPet.id, 0, 0, state);
  ctx.restore();

  // Render all filtered pets in a grid below
  const gridStartY = groundY + 120;
  const spacing = 100;

  ctx.font = "12px 'Comic Sans MS'";
  ctx.textAlign = "center";

  filteredPets.forEach((pet, index) => {
    const row = Math.floor(index / 7);
    const col = index % 7;
    const petX = 150 + col * spacing;
    const petY = gridStartY + row * 100;

    // Highlight selected
    if (index === selectedPetIndex) {
      const petElement = ELEMENTS[pet.element];
      ctx.fillStyle = `rgba(${parseInt(
        petElement.color.slice(1, 3),
        16
      )}, ${parseInt(petElement.color.slice(3, 5), 16)}, ${parseInt(
        petElement.color.slice(5, 7),
        16
      )}, 0.2)`;
      ctx.fillRect(petX - 40, petY - 50, 80, 80);
      ctx.strokeStyle = petElement.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(petX - 40, petY - 50, 80, 80);
    }

    // Render pet
    petSprites.renderPet(ctx, pet.id, petX, petY, {
      animTime,
      elementColor: pet.elementColor,
      secondaryColor: pet.secondaryColor,
    });

    // Label with element icon
    const petElement = ELEMENTS[pet.element];
    ctx.fillStyle = index === selectedPetIndex ? petElement.color : "#9A6BFF";
    ctx.fillText(`${petElement.icon} ${pet.name}`, petX, petY + 35);
  });

  // Stats bars in top right
  const barX = canvas.width - 320;
  const barY = 140;
  const barWidth = 220;
  const barHeight = 22;

  ctx.textAlign = "left";
  ctx.font = "bold 15px 'Comic Sans MS'";

  const stats = [
    { label: "Attack", value: selectedPet.attack, max: 50, color: "#ff6b35" },
    { label: "Health", value: selectedPet.health, max: 150, color: "#4CAF50" },
    {
      label: "Speed",
      value: selectedPet.speed * 100,
      max: 100,
      color: "#ffff00",
    },
  ];

  stats.forEach((stat, i) => {
    const statY = barY + i * (barHeight + 18);

    // Label
    ctx.fillStyle = "#fff";
    ctx.fillText(stat.label, barX, statY + barHeight / 2 + 5);

    // Bar background
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(barX + 80, statY, barWidth, barHeight);

    // Bar fill
    ctx.fillStyle = stat.color;
    const fillWidth = (stat.value / stat.max) * barWidth;
    ctx.fillRect(barX + 80, statY, fillWidth, barHeight);

    // Value
    ctx.fillStyle = "#fff";
    ctx.fillText(
      `${Math.round(stat.value)}`,
      barX + 80 + barWidth + 12,
      statY + barHeight / 2 + 5
    );
  });

  // Cost display
  ctx.fillStyle = "#ffd56a";
  ctx.font = "bold 22px 'Comic Sans MS'";
  ctx.fillText(`💰 ${selectedPet.cost} gold`, barX, barY + 130);

  // Element badge
  const elementBadge = ELEMENTS[selectedPet.element];
  ctx.fillStyle = elementBadge.color;
  ctx.font = "bold 18px 'Comic Sans MS'";
  ctx.fillText(
    `${elementBadge.icon} ${elementBadge.name.toUpperCase()}`,
    barX,
    barY + 165
  );

  // Render skill effects
  skillEffects.render(ctx);
}

// Game loop
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  animTime = currentTime;

  // Update skill effects
  skillEffects.update(dt);

  render();

  requestAnimationFrame(gameLoop);
}

// Initialize
updatePetSelector();
updateStats();
requestAnimationFrame(gameLoop);

console.log("🍬 Pet Gallery loaded!");
console.log(`Total pets: ${allPets.length}`);
console.log(
  "Pet IDs:",
  allPets.map((p) => p.id)
);
console.log("Elements:", Object.keys(ELEMENTS));
console.log(
  "Total skills:",
  Object.keys(PET_SKILLS).length * 2,
  "(14 normal + 14 special)"
);
console.log("By Element:", {
  fire: getPetsByElement("fire").length,
  ice: getPetsByElement("ice").length,
  electric: getPetsByElement("electric").length,
  earth: getPetsByElement("earth").length,
  wind: getPetsByElement("wind").length,
  arcane: getPetsByElement("arcane").length,
  dark: getPetsByElement("dark").length,
  light: getPetsByElement("light").length,
  tech: getPetsByElement("tech").length,
  nature: getPetsByElement("nature").length,
  shadow: getPetsByElement("shadow").length,
});
