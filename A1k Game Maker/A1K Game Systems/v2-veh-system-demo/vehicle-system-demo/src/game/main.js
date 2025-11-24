// src/game/main.js

import "../style.css";
import { gameState } from "./gameState.js";
import * as InputController from "./InputController.js";
import { CharacterSprite } from "../art/SpriteDefinitions.js";
import { VehicleSprite } from "../art/SpriteDefinitions.js";
import { PetSprite } from "../art/SpriteDefinitions.js";
import { drawPlatform } from "./Platform.js";
import { Pet } from "../pet/Pet.js";
import { updatePet } from "../pet/PetController.js";
import { VehicleManager } from "../vehicle/VehicleManager.js";
import { updateVehicle } from "../vehicle/VehicleController.js";

// ----- Game Setup -----
const app = document.querySelector("#app");
if (app) {
  app.innerHTML = `
    <h1>🚗 Vehicle + Pet System Demo</h1>
    <div id="game-container">
      <canvas id="gameCanvas"></canvas>
    </div>
    <div class="controls">
      <h2>Controls</h2>
      <p><kbd>←</kbd> <kbd>→</kbd> Move | <kbd>↑</kbd> Jump (hold for higher) | <kbd>E</kbd> Board/Unboard Vehicle</p>
      <div class="info">
        <p><strong>Features:</strong></p>
        <p>• Golden pet orb follows you everywhere</p>
        <p>• Hover-skiff vehicle with drifty physics</p>
        <p>• Walking: Fast acceleration, tight control</p>
        <p>• Riding: Slower acceleration, higher top speed, more drift</p>
      </div>
    </div>
  `;
}

const canvas = document.getElementById("gameCanvas");
if (!canvas) {
  console.error("Canvas element not found!");
  throw new Error("Canvas element required");
}

const ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 648;

InputController.init();

// Create sprite instances
const playerSprite = new CharacterSprite();
const vehicleSprite = new VehicleSprite();
const petSprite = new PetSprite();

// Create game entities
const leader = gameState.players[gameState.leader];
const pet1 = new Pet(leader);
gameState.pets.push(pet1);

const vehicleManager = new VehicleManager();
window.vehicleManager = vehicleManager;
vehicleManager.setPlayer(leader);

// Expose gameState for debugging
window.gameState = gameState;

console.log("Vehicle + Pet System Demo Loaded!");
console.log("Controls: Arrow keys to move, E to board/unboard vehicle");

// ----- Game Logic -----
const GROUND_Y = gameState.world.groundY;
let interactionPrompt = null;

function updatePlayer(player, dt) {
  if (!player) return;

  // If riding, movement is handled by vehicle controller
  if (player.isRiding) return;

  // --- Horizontal Movement ---
  const targetVx =
    (InputController.keys.ArrowRight ? 1 : 0) -
    (InputController.keys.ArrowLeft ? 1 : 0);

  // Apply acceleration
  player.vx += targetVx * player.acceleration * dt;

  // Apply friction
  if (targetVx === 0) {
    player.vx *= (1 - player.friction) ** (dt * 60);
  }

  // Clamp max speed
  const RUN_MAX = 280;
  player.vx = Math.max(-RUN_MAX, Math.min(RUN_MAX, player.vx));

  player.x += player.vx * dt;
  player.x = Math.max(15, Math.min(gameState.world.width - 15, player.x));

  // --- Vertical Movement (Jumping & Gravity) ---
  player.vy += player.gravity * dt;
  player.y += player.vy * dt;

  // Ground collision
  const onGround = player.y >= GROUND_Y;
  if (onGround) {
    player.y = GROUND_Y;
    player.vy = 0;
    player.jumpCount = 0;
  }
  player.grounded = onGround;

  // Handle jump input
  if (InputController.keys.ArrowUp) {
    if (player.jumpCount < player.maxJumps) {
      player.vy = -player.jumpForce;
      player.jumpCount++;
      InputController.keys.ArrowUp = false;
    }
  }
}

// Camera update function
function updateCamera(dt) {
  const leader = gameState.players[gameState.leader];
  if (!leader) return;

  const activeTarget =
    vehicleManager.isPlayerRiding && vehicleManager.spawnedVehicle
      ? vehicleManager.spawnedVehicle
      : leader;

  // Target the active controller (player or vehicle)
  gameState.camera.targetX = activeTarget.x - canvas.width / 2;

  // Smoothly move camera
  const dx = gameState.camera.targetX - gameState.camera.x;
  gameState.camera.x += dx * gameState.camera.smoothness;

  // Clamp camera to world bounds
  gameState.camera.x = Math.max(
    0,
    Math.min(gameState.world.width - canvas.width, gameState.camera.x)
  );
}

// Check for vehicle interactions
function checkInteractions() {
  const leader = gameState.players[gameState.leader];
  interactionPrompt = null;

  const spawnedVehicle = vehicleManager.spawnedVehicle;
  if (!leader || !spawnedVehicle) return;

  if (vehicleManager.isPlayerRiding && spawnedVehicle.rider === leader) {
    interactionPrompt = { type: "vehicle", action: "unboard", vehicle: spawnedVehicle };
    return;
  }

  const dx = leader.x - spawnedVehicle.x;
  const dy = leader.y - spawnedVehicle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= (spawnedVehicle.interactionRadius || 70)) {
    interactionPrompt = { type: "vehicle", action: "board", vehicle: spawnedVehicle };
  }
}

// ----- Rendering -----
function render() {
  // Clear canvas
  ctx.fillStyle = "#0B1421";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-gameState.camera.x, 0);

  // Draw platform
  drawPlatform(ctx, GROUND_Y, gameState.world.width, canvas.height - GROUND_Y);

  // Draw vehicle
  if (vehicleManager.spawnedVehicle) {
    vehicleSprite.render(ctx, vehicleManager.spawnedVehicle.x, vehicleManager.spawnedVehicle.y, {
      animTime: gameState.animTime,
    });
  }

  // Draw player (only if not riding)
  const leader = gameState.players[gameState.leader];
  if (!leader.isRiding) {
    playerSprite.render(ctx, leader.x, leader.y, {
      animTime: gameState.animTime,
      isGrounded: leader.grounded,
      vx: leader.vx,
    });
  }

  // Draw pet
  for (const pet of gameState.pets) {
    petSprite.render(ctx, pet.x, pet.y, {
      animTime: gameState.animTime,
    });
  }

  ctx.restore();

  // Draw UI prompts (screen space)
  if (interactionPrompt) {
    const leader = gameState.players[gameState.leader];
    const screenX = leader.x - gameState.camera.x;
    const screenY = leader.y - 80;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.strokeStyle = "#00E5FF";
    ctx.lineWidth = 2;

    const text =
      interactionPrompt.action === "board"
        ? "Press E to Board"
        : "Press E to Unboard";
    const textWidth = ctx.measureText(text).width;
    const padding = 10;

    ctx.fillRect(
      screenX - textWidth / 2 - padding,
      screenY - 10,
      textWidth + padding * 2,
      25
    );
    ctx.strokeRect(
      screenX - textWidth / 2 - padding,
      screenY - 10,
      textWidth + padding * 2,
      25
    );

    ctx.fillStyle = "#00E5FF";
    ctx.font = "14px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, screenX, screenY + 5);
    ctx.restore();
  }
}

// ----- Game Loop -----
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  gameState.time += dt;
  gameState.animTime = currentTime;
  gameState.dt = dt;

  const leader = gameState.players[gameState.leader];
  vehicleManager.setPlayer(leader);

  // --- 3. UPDATE PHASE ---
  // All game logic and physics go here

  // Check if the player is riding the vehicle
  if (vehicleManager.isPlayerRiding && vehicleManager.spawnedVehicle) {
    // If riding, the vehicle update drives movement using live input.
    updateVehicle(vehicleManager.spawnedVehicle, dt, InputController.keys);
  } else {
    // If not riding, fall back to standard on-foot controls.
    updatePlayer(leader, dt);
  }

  // Update the spawned vehicle's physics (if it exists but isn't being ridden)
  // Note: We pass an idle key map so only passive forces apply.
  if (vehicleManager.spawnedVehicle && !vehicleManager.isPlayerRiding) {
    updateVehicle(vehicleManager.spawnedVehicle, dt, vehicleManager.idleKeys);
  }

  // Update the pet follower
  for (const pet of gameState.pets) {
    updatePet(pet, dt);
  }

  // Update camera
  updateCamera(dt);

  // Check interactions
  checkInteractions();

  // Render
  render();

  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

/*
== VEHICLE SYSTEM TEST PLAN ==

1.  Bag to World:
    • Open Bag. Equip "Sports Car".
    • Vehicle should NOT spawn yet.
    • Close Bag. Press 'V'.
    • Result: Vehicle should spawn next to the player.

2.  Toggle Spawn:
    • With vehicle spawned, press 'V' again.
    • Result: Vehicle should de-spawn.

3.  Boarding:
    • Spawn vehicle. Walk near it. Press 'E'.
    • Result: Player model should disappear. You should now control the vehicle.

4.  Unboarding:
    • While controlling the vehicle, press 'E'.
    • Result: Player should reappear next to the vehicle. You should regain control of the player.

5.  Edge Case 1: Unequip while Spawned:
    • Spawn vehicle.
    • Open Bag. Unequip the vehicle.
    • Result: The spawned vehicle should immediately de-spawn.

6.  Edge Case 2: Unequip while Boarded:
    • Spawn vehicle. Board it.
    • Open Bag. Unequip the vehicle.
    • Result: You should be unboarded, the vehicle should de-spawn, and you should regain player control.

7.  Edge Case 3: Swap Vehicle:
    • Equip "Sports Car". Spawn it.
    • Open Bag. Equip "Hoverbike" (this will auto-unequip the car).
    • Result: The "Sports Car" should de-spawn. The "Hoverbike" should immediately spawn in its place.
*/

