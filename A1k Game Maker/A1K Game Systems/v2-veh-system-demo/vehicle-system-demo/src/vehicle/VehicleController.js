// src/vehicle/VehicleController.js
import * as InputController from "../game/InputController.js";

export function boardVehicle(player, vehicle) {
  if (vehicle.rider) return; // Vehicle is already occupied

  vehicle.rider = player;
  player.isRiding = true; // Flag the player as riding

  // Player's physics are now controlled by the vehicle
  player.vx = 0;
  player.vy = 0;
}

export function unboardVehicle(player, vehicle) {
  if (!vehicle.rider || vehicle.rider.id !== player.id) return;

  // Eject the player to the side of the vehicle
  player.x = vehicle.x + 50;
  player.y = vehicle.y;
  player.isRiding = false;
  vehicle.rider = null;
}

export function updateVehicle(vehicle, dt, keys = InputController.keys) {
  if (!vehicle) return;

  const controlKeys = keys || InputController.keys;

  if (vehicle.rider) {
    // --- Player is controlling the vehicle ---
    const targetVx =
      (controlKeys.ArrowRight ? 1 : 0) -
      (controlKeys.ArrowLeft ? 1 : 0);

    vehicle.vx += targetVx * vehicle.acceleration * dt;
    if (targetVx === 0) {
      vehicle.vx *= (1 - vehicle.friction) ** (dt * 60);
    }
    vehicle.vx = Math.max(
      -vehicle.maxSpeed,
      Math.min(vehicle.maxSpeed, vehicle.vx)
    );

    // Handle jumping
    if (controlKeys.ArrowUp && vehicle.jumpCount < 2) {
      vehicle.vy = -vehicle.jumpForce;
      vehicle.grounded = false;
      vehicle.jumpCount++;
      if (controlKeys === InputController.keys) {
        InputController.keys.ArrowUp = false;
      } else {
        controlKeys.ArrowUp = false;
      }
    }
  } else {
    // --- Vehicle is idle ---
    // Apply friction to stop it
    vehicle.vx *= (1 - vehicle.friction) ** (dt * 60);
  }

  // Apply physics
  vehicle.x += vehicle.vx * dt;
  vehicle.vy += vehicle.gravity * dt;
  vehicle.y += vehicle.vy * dt;

  // Ground collision
  const GROUND_Y = 460; // Assuming this is the ground level
  if (vehicle.y >= GROUND_Y) {
    vehicle.y = GROUND_Y;
    vehicle.vy = 0;
    vehicle.grounded = true;
    vehicle.jumpCount = 0;
  }

  // If a player is riding, sync their position to the vehicle
  if (vehicle.rider) {
    vehicle.rider.x = vehicle.x;
    vehicle.rider.y = vehicle.y;
  }
}

