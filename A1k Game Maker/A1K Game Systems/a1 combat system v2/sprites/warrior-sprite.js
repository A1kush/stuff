/**
 * WARRIOR DUAL SWORDS - HD Pixel Art Sprite
 * 
 * 128x128 pixel-perfect character
 * Warrior with dual swords
 * 
 * @version 1.0.0
 */

class WarriorSprite extends HDSpriteBase {
  constructor(palette = 'fire') {
    super('A1', palette);
  }

  /**
   * Render warrior sprite
   */
  render(ctx, x, y, opts = {}) {
    const pal = SPRITE_PALETTES[this.palette];
    const centerX = x;
    const centerY = y;
    const frame = this.currentFrame;
    const anim = this.currentAnim;

    // Calculate animation offsets
    let bobY = 0;
    let armAngle = 0;
    let legOffset = 0;

    if (anim === 'idle') {
      bobY = Math.sin(frame / 4 * Math.PI) * 1;
    } else if (anim === 'walk') {
      bobY = Math.sin(frame / 4 * Math.PI) * 2;
      legOffset = Math.sin(frame / 4 * Math.PI) * 3;
    } else if (anim === 'attack') {
      armAngle = (frame / 6) * 90;
    }

    // Draw aura glow (background layer)
    this.drawAura(ctx, centerX, centerY, bobY, pal.aura, pal.glow);

    // Legs (behind body)
    // Left leg
    this.drawRect(ctx, centerX - 10, centerY + 20 - bobY + legOffset, 6, 16, pal.clothes[2]);
    this.drawRect(ctx, centerX - 10, centerY + 36 - bobY + legOffset, 6, 8, pal.skin[1]);

    // Right leg
    this.drawRect(ctx, centerX + 4, centerY + 20 - bobY - legOffset, 6, 16, pal.clothes[2]);
    this.drawRect(ctx, centerX + 4, centerY + 36 - bobY - legOffset, 6, 8, pal.skin[1]);

    // Torso
    this.drawRect(ctx, centerX - 12, centerY + 4 - bobY, 24, 20, pal.clothes[1]);
    this.drawRect(ctx, centerX - 10, centerY + 6 - bobY, 20, 16, pal.clothes[2]);

    // Left arm (behind body for walk)
    if (anim === 'walk') {
      this.drawRect(ctx, centerX - 16, centerY + 8 - bobY - legOffset, 5, 14, pal.skin[1]);
    }

    // Head
    this.drawRect(ctx, centerX - 10, centerY - 16 - bobY, 20, 18, pal.skin[2]);
    // Neck
    this.drawRect(ctx, centerX - 6, centerY + 2 - bobY, 12, 4, pal.skin[1]);

    // Baseball cap
    this.drawRect(ctx, centerX - 12, centerY - 20 - bobY, 24, 6, pal.clothes[0]);
    this.drawRect(ctx, centerX - 14, centerY - 18 - bobY, 6, 2, pal.clothes[0]); // brim

    // Black curly hair (LOCKED - always black)
    this.drawPixel(ctx, centerX - 11, centerY - 14 - bobY, '#000000');
    this.drawPixel(ctx, centerX - 10, centerY - 15 - bobY, '#000000');
    this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
    this.drawPixel(ctx, centerX - 9, centerY - 14 - bobY, '#111111');

    // Glowing eyes (2 pixels each)
    this.drawPixel(ctx, centerX - 6, centerY - 8 - bobY, pal.eyes[0]);
    this.drawPixel(ctx, centerX - 5, centerY - 8 - bobY, pal.eyes[1]);
    this.drawPixel(ctx, centerX + 5, centerY - 8 - bobY, pal.eyes[0]);
    this.drawPixel(ctx, centerX + 6, centerY - 8 - bobY, pal.eyes[1]);

    // Right arm (in front)
    this.drawRect(ctx, centerX + 12, centerY + 8 - bobY + Math.sin(armAngle * Math.PI / 180) * 5, 5, 14, pal.skin[1]);

    // Left sword (behind)
    ctx.save();
    ctx.translate(centerX - 20, centerY + 10 - bobY);
    ctx.rotate((-45 + armAngle) * Math.PI / 180);
    this.drawRect(ctx, -2, -20, 4, 24, pal.weapon[0]);
    this.drawRect(ctx, -1, -20, 2, 24, pal.weapon[2]); // bright core
    // Rim light (1px highlight)
    this.drawPixel(ctx, 1, -18, pal.weapon[3]);
    this.drawPixel(ctx, 1, -10, pal.weapon[3]);
    this.drawPixel(ctx, 1, -2, pal.weapon[3]);
    // Handle
    this.drawRect(ctx, -2, 4, 4, 6, pal.clothes[0]);
    ctx.restore();

    // Right sword (in front)
    ctx.save();
    ctx.translate(centerX + 20, centerY + 10 - bobY);
    ctx.rotate((45 - armAngle) * Math.PI / 180);
    this.drawRect(ctx, -2, -20, 4, 24, pal.weapon[0]);
    this.drawRect(ctx, -1, -20, 2, 24, pal.weapon[2]); // bright core
    // Rim light
    this.drawPixel(ctx, -2, -18, pal.weapon[3]);
    this.drawPixel(ctx, -2, -10, pal.weapon[3]);
    this.drawPixel(ctx, -2, -2, pal.weapon[3]);
    // Handle
    this.drawRect(ctx, -2, 4, 4, 6, pal.clothes[0]);
    ctx.restore();

    // Weapon glow effects
    ctx.fillStyle = pal.glow;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(centerX - 20, centerY - 5 - bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 20, centerY - 5 - bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

