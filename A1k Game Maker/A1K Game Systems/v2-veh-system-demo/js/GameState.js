// GameState.js - Demo state management

export class GameState {
  constructor() {
    this.mode = 'gallery'; // 'gallery' or 'testdrive'
    this.currentStyle = 'pixel'; // 'pixel', 'vector', '3d'
    this.currentCharacter = 'warrior'; // 'warrior', 'cat_angel', 'cyborg'
    this.selectedVehicleId = null;
    
    // Player state
    this.player = {
      x: 700,
      y: 450,
      vx: 0,
      vy: 0,
      facingLeft: false,
      isRiding: false,
      ridingVehicle: null,
      boardingVehicle: null,
      boardingProgress: 0,
      unboardingVehicle: null,
      unboardingProgress: 0,
      acceleration: 1200,
      friction: 0.9,
      maxSpeed: 280,
      gravity: 2000,
      jumpForce: 600,
      grounded: true,
      jumpCount: 0
    };
    
    // Current vehicle instance in test drive
    this.currentVehicle = null;
    
    // World settings
    this.groundY = 500;
    this.cameraX = 0;
    this.worldWidth = 6000;
    
    // Animation time
    this.animTime = 0;
    
    // FPS tracking
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsTime = 0;
    
    // Infinite Horizon: The Janitor God - Extended properties
    this.suspicionMeter = 0; // 0-100, increases when A1 uses high-damage skills in Public Mode
    this.isShadowMode = false; // Public Mode (false) or Shadow Mode (true)
    this.styleMeter = 0; // 0-100, for Unique's Breathing Style meter (replaces rage for Unique)
    this.boredomTimer = 0; // Time in seconds since last S-Rank+ enemy hit
    this.cameraTilt = 0; // Camera tilt angle in degrees for dynamic camera effects
    this.camerasHacked = false; // Missy's drone has hacked nearby cameras
    this.gateHacked = false; // Dungeon gate has been hacked by Missy
    this.shadowArmyDeployed = false; // Shadow army deployment state
    this.symbolOfPeaceActive = false; // Hero Heat system boss is active
    
    // 3D Camera System
    this.camera3D = {
      x: 0,
      y: 0,
      z: 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      angleX: 45,
      angleY: 30,
      distance: 200
    };
    
    this.world3D = {
      width: 6000,
      height: 900,
      depth: 1000 // Z-depth for 3D rendering
    };
  }

  enterTestDrive(vehicleData) {
    this.mode = 'testdrive';
    this.selectedVehicleId = vehicleData.id;
    
    // Create vehicle instance
    this.currentVehicle = {
      id: vehicleData.id,
      data: vehicleData,
      x: 1000,
      y: this.groundY,
      vx: 0,
      vy: 0,
      facingLeft: false,
      grounded: true,
      jumpCount: 0,
      rider: null
    };
    
    // Reset player
    this.player.x = 700;
    this.player.y = this.groundY;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isRiding = false;
    this.player.ridingVehicle = null;
    this.player.grounded = true;
    this.player.facingLeft = false;
  }

  exitTestDrive() {
    this.mode = 'gallery';
    this.currentVehicle = null;
    this.selectedVehicleId = null;
  }

  setStyle(style) {
    this.currentStyle = style;
  }

  setCharacter(character) {
    this.currentCharacter = character;
  }

  updateCamera(canvasWidth) {
    if (this.mode !== 'testdrive') return;

    const target = this.player.x;
    const centerX = canvasWidth / 2;
    
    // Smooth camera follow
    const targetCameraX = target - centerX;
    const diff = targetCameraX - this.cameraX;
    this.cameraX += diff * 0.1;
    
    // Clamp camera
    this.cameraX = Math.max(0, Math.min(this.worldWidth - canvasWidth, this.cameraX));
  }

  updateFPS(timestamp) {
    this.frameCount++;
    if (timestamp - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = timestamp;
    }
  }
}

