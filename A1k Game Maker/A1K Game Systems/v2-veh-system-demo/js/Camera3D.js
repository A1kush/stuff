/**
 * Camera3D.js
 * Third-Person 3D Camera System
 * Fixed angle camera that follows player from behind/above (Fortnite/Zelda N64 style)
 */

export class Camera3D {
  constructor() {
    // Camera position in 3D space
    this.x = 0;
    this.y = 0;
    this.z = 0;
    
    // Target position (player position)
    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    
    // Camera angles (fixed)
    this.angleX = 45; // Vertical angle (downward) in degrees
    this.angleY = 30; // Horizontal rotation around player in degrees
    this.distance = 200; // Distance from player
    
    // Camera offset from player
    this.offsetX = -100; // Behind player
    this.offsetY = -50;  // Above player
    this.offsetZ = 150;  // Height offset
    
    // Smooth following
    this.followSpeed = 0.1; // Lerp speed (0-1)
    
    // Camera bounds
    this.minX = 0;
    this.maxX = 6000;
    this.minY = 0;
    this.maxY = 900;
    
    // Shake effect
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeZ = 0;
    this.shakeIntensity = 0;
    this.shakeDecay = 0.9;
  }
  
  /**
   * Update camera position to follow player
   * @param {number} playerX - Player X position
   * @param {number} playerY - Player Y position
   * @param {number} playerFacingLeft - Player facing direction
   * @param {number} dt - Delta time
   */
  update(playerX, playerY, playerFacingLeft, dt) {
    // Calculate target camera position behind player
    // Adjust offset based on facing direction
    const facingOffset = playerFacingLeft ? -this.offsetX : this.offsetX;
    
    // Convert angles to radians
    const angleXRad = (this.angleX * Math.PI) / 180;
    const angleYRad = (this.angleY * Math.PI) / 180;
    
    // Calculate camera position relative to player
    // Behind and above player at fixed angle
    const targetX = playerX + Math.cos(angleYRad) * facingOffset;
    const targetY = playerY + this.offsetY;
    const targetZ = this.offsetZ + Math.sin(angleXRad) * this.distance;
    
    // Smoothly lerp camera to target position
    this.x += (targetX - this.x) * this.followSpeed;
    this.y += (targetY - this.y) * this.followSpeed;
    this.z += (targetZ - this.z) * this.followSpeed;
    
    // Update target (player position)
    this.targetX = playerX;
    this.targetY = playerY;
    this.targetZ = 0; // Player is on ground (z=0)
    
    // Clamp camera within world bounds
    this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
    this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
    
    // Update shake effect
    if (this.shakeIntensity > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeZ = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity *= this.shakeDecay;
      
      if (this.shakeIntensity < 0.1) {
        this.shakeIntensity = 0;
        this.shakeX = 0;
        this.shakeY = 0;
        this.shakeZ = 0;
      }
    }
  }
  
  /**
   * Apply screen shake effect
   * @param {number} intensity - Shake intensity
   */
  applyShake(intensity) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
  }
  
  /**
   * Get camera position with shake applied
   * @returns {Object} Camera position { x, y, z }
   */
  getPosition() {
    return {
      x: this.x + this.shakeX,
      y: this.y + this.shakeY,
      z: this.z + this.shakeZ
    };
  }
  
  /**
   * Get view transformation matrix for rendering
   * @returns {Object} View matrix data
   */
  getViewMatrix() {
    const pos = this.getPosition();
    return {
      cameraX: pos.x,
      cameraY: pos.y,
      cameraZ: pos.z,
      targetX: this.targetX,
      targetY: this.targetY,
      targetZ: this.targetZ,
      angleX: this.angleX,
      angleY: this.angleY,
      distance: this.distance
    };
  }
  
  /**
   * Reset camera to initial position
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   */
  reset(x, y) {
    this.x = x + this.offsetX;
    this.y = y + this.offsetY;
    this.z = this.offsetZ;
    this.targetX = x;
    this.targetY = y;
    this.targetZ = 0;
  }
  
  /**
   * Set camera distance (zoom)
   * @param {number} distance - New distance
   */
  setDistance(distance) {
    this.distance = Math.max(100, Math.min(400, distance));
  }
  
  /**
   * Set camera angle
   * @param {number} angleX - Vertical angle
   * @param {number} angleY - Horizontal angle
   */
  setAngle(angleX, angleY) {
    this.angleX = Math.max(30, Math.min(60, angleX));
    this.angleY = Math.max(0, Math.min(60, angleY));
  }
}

