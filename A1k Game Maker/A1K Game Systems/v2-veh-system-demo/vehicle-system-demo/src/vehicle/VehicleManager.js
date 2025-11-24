import {
  boardVehicle,
  unboardVehicle,
  updateVehicle,
} from "./VehicleController.js";
import { UNIFIED_VEHICLE_REGISTRY } from "./UnifiedVehicleRegistry.js";

/**
 * Centralised coordinator that keeps the player, bag system, and physics layer
 * in sync. It deliberately stays dumb about rendering so we can swap engines
 * later without rewriting orchestration code.
 */
export class VehicleManager {
  playerInstance = null;
  spawnedVehicle = null;
  equippedVehicleData = null;
  isPlayerRiding = false;

  idleKeys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
  };

  /**
   * Injects a reference to the active player object so spawn points can align.
   */
  setPlayer(player) {
    this.playerInstance = player;
  }

  onVehicleEquipped(vehicleData) {
    console.log(`[VehicleManager] Equipped: ${vehicleData.name}`);
    this.equippedVehicleData = vehicleData;
    if (this.spawnedVehicle) {
      this.despawn();
    }
    this.spawn();
  }

  onVehicleUnequipped() {
    console.log("[VehicleManager] Vehicle Unequipped");
    this.equippedVehicleData = null;
    if (this.spawnedVehicle) {
      this.despawn();
    }
  }

  toggleSpawn() {
    if (this.spawnedVehicle) {
      this.despawn();
    } else if (this.equippedVehicleData) {
      this.spawn();
    } else {
      console.warn("VehicleManager: 'V' pressed, but no vehicle is equipped.");
    }
  }

  /**
   * Instantiates a lightweight vehicle structure for the physics system.
   * The manager never pushes directly into world arrays so the integration
   * point can hook in later (Phase 9).
   */
  spawn() {
    if (this.spawnedVehicle) return;
    if (!this.equippedVehicleData) {
      console.warn("VehicleManager: Cannot spawn, no vehicle is equipped.");
      return;
    }
    if (!this.playerInstance) {
      console.warn("VehicleManager: Cannot spawn, player instance is not set.");
      return;
    }

    const vehicleDef =
      UNIFIED_VEHICLE_REGISTRY[this.equippedVehicleData.id];
    if (!vehicleDef) {
      console.error(
        `VehicleManager: Vehicle ID "${this.equippedVehicleData.id}" not found in UnifiedVehicleRegistry.`
      );
      return;
    }

    this.spawnedVehicle = {
      ...vehicleDef,
      x: this.playerInstance.x + 60,
      y: this.playerInstance.y,
      vx: 0,
      vy: 0,
      rider: null,
      jumpCount: 0,
      grounded: true,
      gravity: vehicleDef.gravity ?? 2000,
      maxSpeed: vehicleDef.maxSpeed ?? vehicleDef.baseSpeed ?? 320,
      acceleration: vehicleDef.acceleration ?? 900,
      friction: vehicleDef.friction ?? 0.9,
      jumpForce: vehicleDef.jumpForce ?? 650,
    };

    console.log(`[VehicleManager] Spawning ${this.spawnedVehicle.name}`);
  }

  despawn() {
    if (this.isPlayerRiding) {
      this.unboard();
    }
    this.isPlayerRiding = false;

    if (!this.spawnedVehicle) return;

    console.log(`[VehicleManager] Despawning ${this.spawnedVehicle.name}`);
    this.spawnedVehicle = null;
  }

  attemptBoard() {
    if (this.isPlayerRiding || !this.spawnedVehicle || !this.playerInstance) {
      return;
    }

    const dx = this.playerInstance.x - this.spawnedVehicle.x;
    const dy = this.playerInstance.y - this.spawnedVehicle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const boardingRadius = this.spawnedVehicle.interactionRadius || 70;

    if (distance <= boardingRadius) {
      console.log("[VehicleManager] Boarding vehicle.");
      boardVehicle(this.playerInstance, this.spawnedVehicle);
      this.isPlayerRiding = true;
    } else {
      console.log(
        `[VehicleManager] Too far to board. Dist: ${distance}, Radius: ${boardingRadius}`
      );
    }
  }

  unboard() {
    if (!this.isPlayerRiding || !this.spawnedVehicle || !this.playerInstance) {
      return;
    }

    console.log("[VehicleManager] Unboarding vehicle.");
    unboardVehicle(this.playerInstance, this.spawnedVehicle);
    this.isPlayerRiding = false;
  }

  /**
   * Update loop hook (Phase 9) – currently a stub so consumers can wire safely.
   */
  update(dt, keys = this.idleKeys) {
    if (!this.spawnedVehicle) return;
    updateVehicle(this.spawnedVehicle, dt, keys);
  }
}

