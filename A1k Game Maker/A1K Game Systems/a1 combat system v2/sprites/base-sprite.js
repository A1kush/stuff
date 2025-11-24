/**
 * BASE SPRITE CLASS
 * Common animation logic for all HD pixel art sprites
 * 
 * @version 1.0.0
 */

class HDSpriteBase {
  constructor(characterId, palette = 'fire') {
    this.characterId = characterId;
    this.palette = palette;
    this.size = 128; // Native resolution
    
    // Animation state
    this.currentAnim = 'idle';
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.animSpeed = 1.0;
    
    // Position
    this.x = 0;
    this.y = 0;
    
    // Animation data (from SPRITE_ANIMATIONS)
    this.animations = {
      idle: { frames: 8, frameTime: 250, loop: true },
      walk: { frames: 8, frameTime: 125, loop: true },
      attack: { frames: 6, frameTime: 83, loop: false }
    };
  }

  /**
   * Update animation
   */
  update(deltaTime) {
    const anim = this.animations[this.currentAnim];
    if (!anim) return;

    this.frameTimer += deltaTime * this.animSpeed;

    if (this.frameTimer >= anim.frameTime) {
      this.frameTimer = 0;
      this.currentFrame++;

      if (this.currentFrame >= anim.frames) {
        if (anim.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = anim.frames - 1;
          // Auto-return to idle after non-looping animation
          if (this.currentAnim === 'attack') {
            this.setAnimation('idle');
          }
        }
      }
    }
  }

  /**
   * Set animation
   */
  setAnimation(anim) {
    if (this.currentAnim !== anim) {
      this.currentAnim = anim;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  }

  /**
   * Set palette
   */
  setPalette(palette) {
    this.palette = palette;
  }

  /**
   * Set position
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Draw pixel helper
   */
  drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  /**
   * Draw rectangle helper
   */
  drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  /**
   * Draw aura glow (background layer)
   */
  drawAura(ctx, centerX, centerY, bobY, auraColor, glowColor) {
    const gradient = ctx.createRadialGradient(
      centerX, centerY - bobY, 0,
      centerX, centerY - bobY, 45
    );
    gradient.addColorStop(0, auraColor + '0.2)');
    gradient.addColorStop(0.5, auraColor + '0.08)');
    gradient.addColorStop(1, auraColor + '0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.size, this.size);

    // Additional outer glow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY - bobY, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
  }

  /**
   * Render sprite (override in subclass)
   */
  render(ctx, x, y, opts = {}) {
    throw new Error('render() must be implemented in subclass');
  }
}

