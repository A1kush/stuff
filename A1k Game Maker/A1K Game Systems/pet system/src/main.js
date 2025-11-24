// src/main.js
// Simple pet following demo

import "./style.css";
import { gameState } from "./gameState.js";
import * as InputController from "./InputController.js";
import { CharacterSprite } from "./art/CharacterSprite.js";
import { drawPlatform } from "./art/Platform.js";
import { Pet } from "./pets/Pet.js";
import { updatePet } from "./pets/PetController.js";
import { AllPetSprites } from "./art/AllPetSprites.js";
import { getPet } from "./pets/PetRegistry.js";

// Setup
const app = document.querySelector("#app");
app.innerHTML = `
  <h1>🍬 Chibi Pet Demo</h1>
  <div id="game-container">
    <canvas id="gameCanvas"></canvas>
  </div>
  <div class="controls">
    <h2>Controls</h2>
    <p><kbd>←</kbd> <kbd>→</kbd> Move | <kbd>↑</kbd> Jump</p>
    <div class="info">
      <p><strong>Features:</strong></p>
      <p>• Cute chibi candy-style pets follow you!</p>
      <p>• Big heads, sparkly eyes, bouncy animations</p>
      <p>• 10 elemental types with unique colors</p>
    </div>
  </div>
`;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 648;

InputController.init();

const playerSprite = new CharacterSprite();
const petSprites = new AllPetSprites();

// Create pets
const leader = gameState.players[gameState.leader];
const fireCubData = getPet('pet_firecub');
const icewolfData = getPet('pet_icewolf');

const pet1 = new Pet(leader, fireCubData);
const pet2 = new Pet(leader, icewolfData);
pet2.x = leader.x - 80;

gameState.pets.push(pet1, pet2);

window.gameState = gameState;
console.log("Pet demo loaded!");

// Game logic
const GROUND_Y = gameState.world.groundY;

function updatePlayer(player, dt) {
  if (!player) return;

  const targetVx =
    (InputController.keys.ArrowRight ? 1 : 0) -
    (InputController.keys.ArrowLeft ? 1 : 0);

  player.vx = targetVx * 200;
  player.x += player.vx * dt;
  player.x = Math.max(15, Math.min(gameState.world.width - 15, player.x));

  player.vy += 2000 * dt;
  player.y += player.vy * dt;

  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.grounded = true;
  }

  if (InputController.keys.ArrowUp && player.grounded) {
    player.vy = -600;
    player.grounded = false;
    InputController.keys.ArrowUp = false;
  }
}

function render() {
  ctx.fillStyle = "#1a0a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sparkles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 30; i++) {
    const sparkleX = (i * 173 + gameState.animTime * 0.01) % canvas.width;
    const sparkleY = (i * 97 + gameState.animTime * 0.015) % canvas.height;
    const sparkleSize = (Math.sin(gameState.animTime * 0.005 + i) + 1) * 1.5;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPlatform(ctx, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  const leader = gameState.players[gameState.leader];
  playerSprite.render(ctx, leader.x, leader.y, {
    animTime: gameState.animTime,
    isGrounded: leader.grounded,
    vx: leader.vx,
  });

  for (const pet of gameState.pets) {
    petSprites.renderPet(ctx, pet.petId, pet.x, pet.y, {
      animTime: gameState.animTime,
      elementColor: pet.elementColor,
      secondaryColor: pet.secondaryColor,
    });
  }
}

// Game loop
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  gameState.time += dt;
  gameState.animTime = currentTime;
  gameState.dt = dt;

  const leader = gameState.players[gameState.leader];
  updatePlayer(leader, dt);

  for (const pet of gameState.pets) {
    updatePet(pet, dt);
  }

  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

