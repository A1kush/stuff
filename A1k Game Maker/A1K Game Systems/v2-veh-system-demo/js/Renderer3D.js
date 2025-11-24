/**
 * Renderer3D.js
 * 2.5D Isometric Rendering System
 * Converts 2D world coordinates to 3D perspective rendering
 */

export class Renderer3D {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.camera = null;
  }
  
  /**
   * Initialize renderer with canvas context
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   */
  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
  }
  
  /**
   * Set camera reference
   * @param {Camera3D} camera - Camera3D instance
   */
  setCamera(camera) {
    this.camera = camera;
  }
  
  /**
   * Project 3D world coordinates to 2D screen coordinates
   * Uses isometric projection with camera transformation
   * @param {number} worldX - World X coordinate
   * @param {number} worldY - World Y coordinate
   * @param {number} worldZ - World Z coordinate (height/depth)
   * @returns {Object} Screen coordinates { x, y, scale, depth }
   */
  projectToScreen(worldX, worldY, worldZ = 0) {
    if (!this.camera) {
      // Fallback to 2D if no camera
      return { x: worldX, y: worldY, scale: 1, depth: 0 };
    }
    
    const viewMatrix = this.camera.getViewMatrix();
    const cameraPos = this.camera.getPosition();
    
    // Calculate relative position from camera
    const dx = worldX - cameraPos.x;
    const dy = worldY - cameraPos.y;
    const dz = worldZ - cameraPos.z;
    
    // Convert angles to radians
    const angleXRad = (viewMatrix.angleX * Math.PI) / 180;
    const angleYRad = (viewMatrix.angleY * Math.PI) / 180;
    
    // Isometric projection with camera angle
    // Rotate around Y axis (horizontal rotation)
    const cosY = Math.cos(angleYRad);
    const sinY = Math.sin(angleYRad);
    const rotatedX = dx * cosY - dz * sinY;
    const rotatedZ = dx * sinY + dz * cosY;
    
    // Apply vertical angle (pitch)
    const cosX = Math.cos(angleXRad);
    const sinX = Math.sin(angleXRad);
    const finalY = dy * cosX - rotatedZ * sinX;
    const finalZ = dy * sinX + rotatedZ * cosX;
    
    // Project to screen (isometric style)
    const screenX = this.canvas.width / 2 + rotatedX;
    const screenY = this.canvas.height / 2 + finalY;
    
    // Calculate scale based on distance (further = smaller)
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const baseDistance = viewMatrix.distance;
    const scale = Math.max(0.3, Math.min(1.5, baseDistance / (distance + 100)));
    
    // Depth for sorting (higher Z = further back)
    const depth = finalZ;
    
    return { x: screenX, y: screenY, scale, depth };
  }
  
  /**
   * Render ground plane with perspective
   * @param {number} worldWidth - World width
   * @param {number} worldHeight - World height
   * @param {number} groundY - Ground Y level
   */
  renderGround(worldWidth, worldHeight, groundY) {
    if (!this.ctx || !this.camera) return;
    
    const ctx = this.ctx;
    const cameraPos = this.camera.getPosition();
    
    // Draw ground base (dark cyberpunk city floor)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render ground as perspective grid with isometric tiles
    const gridSize = 100;
    const startX = Math.max(0, cameraPos.x - 1000);
    const endX = Math.min(worldWidth, cameraPos.x + 1000);
    const startY = Math.max(0, cameraPos.y - 800);
    const endY = Math.min(worldHeight, cameraPos.y + 800);
    
    // Draw isometric grid tiles
    ctx.strokeStyle = '#2a2a4a';
    ctx.lineWidth = 1;
    
    // Draw grid lines with perspective (isometric style)
    for (let x = startX; x <= endX; x += gridSize) {
      const start = this.projectToScreen(x, startY, 0);
      const end = this.projectToScreen(x, endY, 0);
      
      if (start.x >= -100 && start.x <= this.canvas.width + 100) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }
    
    for (let y = startY; y <= endY; y += gridSize) {
      const start = this.projectToScreen(startX, y, 0);
      const end = this.projectToScreen(endX, y, 0);
      
      if (start.y >= -100 && start.y <= this.canvas.height + 100) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }
    
    // Draw ground tiles with depth shading
    for (let x = startX; x <= endX; x += gridSize) {
      for (let y = startY; y <= endY; y += gridSize) {
        const corners = [
          this.projectToScreen(x, y, 0),
          this.projectToScreen(x + gridSize, y, 0),
          this.projectToScreen(x + gridSize, y + gridSize, 0),
          this.projectToScreen(x, y + gridSize, 0)
        ];
        
        // Calculate average depth for shading
        const avgDepth = corners.reduce((sum, c) => sum + c.depth, 0) / 4;
        const depthFactor = Math.max(0.3, Math.min(1, (avgDepth + 500) / 1000));
        
        ctx.fillStyle = `rgba(42, 42, 74, ${0.3 * depthFactor})`;
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        ctx.lineTo(corners[1].x, corners[1].y);
        ctx.lineTo(corners[2].x, corners[2].y);
        ctx.lineTo(corners[3].x, corners[3].y);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    // Draw atmospheric fog/gradient for depth
    const gradient = ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      this.canvas.width / 2,
      this.canvas.height / 2,
      Math.max(this.canvas.width, this.canvas.height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(26, 26, 46, 0)');
    gradient.addColorStop(0.5, 'rgba(16, 16, 32, 0.3)');
    gradient.addColorStop(1, 'rgba(8, 8, 16, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  /**
   * Render player with 3D perspective
   * @param {Object} player - Player object
   * @param {string} color - Player color
   */
  renderPlayer(player, color = '#FFD700') {
    if (!this.ctx || !this.camera) return;
    
    const ctx = this.ctx;
    const screenPos = this.projectToScreen(player.x, player.y, 10); // Player slightly above ground
    
    // Render shadow on ground first
    this.renderShadow(player.x, player.y, 30, 0.3);
    
    // Render player with scale based on distance
    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    ctx.scale(screenPos.scale, screenPos.scale);
    
    // Draw player body with 3D appearance (viewed from behind/above)
    // Body (torso)
    ctx.fillStyle = color;
    ctx.fillRect(-12, -25, 24, 20);
    
    // Head (circular, viewed from above)
    ctx.beginPath();
    ctx.arc(0, -30, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms (extended for walking animation)
    const armOffset = Math.sin(Date.now() / 200) * 3; // Simple walking animation
    ctx.fillStyle = color;
    // Left arm
    ctx.fillRect(-18, -20 + armOffset, 8, 12);
    // Right arm
    ctx.fillRect(10, -20 - armOffset, 8, 12);
    
    // Legs (walking animation)
    const legOffset = Math.sin(Date.now() / 200) * 4;
    ctx.fillStyle = '#8B6914'; // Darker gold for legs
    // Left leg
    ctx.fillRect(-8, -5, 6, 15 + legOffset);
    // Right leg
    ctx.fillRect(2, -5, 6, 15 - legOffset);
    
    // Draw facing direction indicator (arrow pointing in direction)
    ctx.fillStyle = '#FF0000';
    const indicatorX = player.facingLeft ? -20 : 20;
    ctx.beginPath();
    if (player.facingLeft) {
      ctx.moveTo(indicatorX, -15);
      ctx.lineTo(indicatorX - 5, -20);
      ctx.lineTo(indicatorX - 5, -10);
    } else {
      ctx.moveTo(indicatorX, -15);
      ctx.lineTo(indicatorX + 5, -20);
      ctx.lineTo(indicatorX + 5, -10);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * Render shadow on ground
   * @param {number} worldX - World X position
   * @param {number} worldY - World Y position
   * @param {number} size - Shadow size
   * @param {number} alpha - Shadow opacity
   */
  renderShadow(worldX, worldY, size, alpha = 0.3) {
    if (!this.ctx || !this.camera) return;
    
    const ctx = this.ctx;
    const screenPos = this.projectToScreen(worldX, worldY, 0);
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#000000';
    
    // Draw elliptical shadow
    ctx.beginPath();
    ctx.ellipse(
      screenPos.x,
      screenPos.y,
      size * screenPos.scale,
      size * screenPos.scale * 0.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.restore();
  }
  
  /**
   * Render vehicle with 3D perspective
   * @param {Object} vehicle - Vehicle object
   */
  renderVehicle(vehicle) {
    if (!this.ctx || !this.camera || !vehicle || !vehicle.data) return;
    
    const ctx = this.ctx;
    const screenPos = this.projectToScreen(vehicle.x, vehicle.y, 5); // Vehicle slightly above ground
    
    // Render shadow
    this.renderShadow(vehicle.x, vehicle.y, vehicle.data.width * 0.5, 0.4);
    
    // Render vehicle
    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    ctx.scale(screenPos.scale, screenPos.scale);
    
    // Draw vehicle body
    ctx.fillStyle = vehicle.data.color;
    ctx.fillRect(
      -vehicle.data.width / 2,
      -vehicle.data.height / 2,
      vehicle.data.width,
      vehicle.data.height
    );
    
    // Draw accent
    ctx.fillStyle = vehicle.data.secondaryColor;
    ctx.fillRect(
      -vehicle.data.width / 2 + 5,
      -vehicle.data.height / 2 + 5,
      vehicle.data.width - 10,
      10
    );
    
    ctx.restore();
  }
  
  /**
   * Sort objects by depth for proper rendering order
   * @param {Array} objects - Array of objects with { x, y, z } properties
   * @returns {Array} Sorted array (back to front)
   */
  sortByDepth(objects) {
    return objects.sort((a, b) => {
      const depthA = this.projectToScreen(a.x, a.y, a.z || 0).depth;
      const depthB = this.projectToScreen(b.x, b.y, b.z || 0).depth;
      return depthB - depthA; // Further back first
    });
  }
  
  /**
   * Clear canvas
   */
  clear() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

