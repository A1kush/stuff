/**
 * CYBORG RIFLE OPERATIVE - HD Pixel Art Sprite
 * 
 * 128x128 pixel-perfect character
 * Cyborg with energy rifle
 * 
 * @version 1.0.0
 */

class CyborgSprite extends HDSpriteBase {
  constructor(palette = 'fire') {
    super('UNIQUE', palette);
  }

  /**
   * Render cyborg sprite
   */
  render(ctx, x, y, opts = {}) {
    const pal = SPRITE_PALETTES[this.palette];
    const centerX = x;
    const centerY = y;
    const frame = this.currentFrame;
    const anim = this.currentAnim;

    // Calculate animation offsets
    let bobY = 0;
    let legOffset = 0;
    let rifleRecoil = 0;
    let muzzleFlash = false;

    if (anim === 'idle') {
      bobY = Math.sin(frame / 4 * Math.PI) * 1;
    } else if (anim === 'walk') {
      bobY = Math.sin(frame / 4 * Math.PI) * 1.5;
      legOffset = Math.sin(frame / 4 * Math.PI) * 2.5;
    } else if (anim === 'attack') {
      rifleRecoil = frame < 2 ? frame * 2 : 0;
      muzzleFlash = frame < 2;
    }

    // Draw aura glow
    const gradient = ctx.createRadialGradient(centerX, centerY - bobY, 0, centerX, centerY - bobY, 42);
    gradient.addColorStop(0, pal.aura + '0.18)');
    gradient.addColorStop(0.5, pal.aura + '0.06)');
    gradient.addColorStop(1, pal.aura + '0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - 64, centerY - 64 - bobY, 128, 128);

    // Legs (behind body)
    // Left leg
    this.drawRect(ctx, centerX - 10, centerY + 18 - bobY + legOffset, 6, 14, pal.armor[1]);
    this.drawRect(ctx, centerX - 9, centerY + 32 - bobY + legOffset, 4, 8, pal.skin[1]);
    // Armor accent on knee
    this.drawRect(ctx, centerX - 9, centerY + 26 - bobY + legOffset, 4, 3, pal.armorAccent[0]);

    // Right leg
    this.drawRect(ctx, centerX + 4, centerY + 18 - bobY - legOffset, 6, 14, pal.armor[1]);
    this.drawRect(ctx, centerX + 5, centerY + 32 - bobY - legOffset, 4, 8, pal.skin[1]);
    // Armor accent on knee
    this.drawRect(ctx, centerX + 5, centerY + 26 - bobY - legOffset, 4, 3, pal.armorAccent[0]);

    // Torso (segmented armor)
    this.drawRect(ctx, centerX - 12, centerY + 4 - bobY, 24, 18, pal.armor[1]);
    this.drawRect(ctx, centerX - 10, centerY + 6 - bobY, 20, 14, pal.armor[2]);
    // Accents on chest
    this.drawRect(ctx, centerX - 8, centerY + 8 - bobY, 3, 8, pal.armorAccent[0]);
    this.drawRect(ctx, centerX + 5, centerY + 8 - bobY, 3, 8, pal.armorAccent[0]);
    this.drawPixel(ctx, centerX - 7, centerY + 9 - bobY, pal.armorAccent[2]);
    this.drawPixel(ctx, centerX + 6, centerY + 9 - bobY, pal.armorAccent[2]);

    // Head
    this.drawRect(ctx, centerX - 10, centerY - 16 - bobY, 20, 18, pal.skin[2]);
    // Neck
    this.drawRect(ctx, centerX - 6, centerY + 2 - bobY, 12, 4, pal.skin[1]);

    // Black pigtails (LOCKED - always black)
    // Left pigtail
    this.drawRect(ctx, centerX - 18, centerY - 14 - bobY, 6, 12, '#000000');
    this.drawRect(ctx, centerX - 17, centerY - 2 - bobY, 4, 4, '#000000');
    // Right pigtail
    this.drawRect(ctx, centerX + 12, centerY - 14 - bobY, 6, 12, '#000000');
    this.drawRect(ctx, centerX + 13, centerY - 2 - bobY, 4, 4, '#000000');
    // Top of head hair
    this.drawRect(ctx, centerX - 10, centerY - 18 - bobY, 20, 4, '#000000');

    // White pixel eyes (2 pixels each)
    this.drawPixel(ctx, centerX - 5, centerY - 8 - bobY, pal.eyes || '#ffffff');
    this.drawPixel(ctx, centerX - 4, centerY - 8 - bobY, pal.eyes || '#ffffff');
    this.drawPixel(ctx, centerX + 4, centerY - 8 - bobY, pal.eyes || '#ffffff');
    this.drawPixel(ctx, centerX + 5, centerY - 8 - bobY, pal.eyes || '#ffffff');

    // Left arm (armored)
    this.drawRect(ctx, centerX - 18, centerY + 8 - bobY, 6, 12, pal.armor[1]);
    this.drawRect(ctx, centerX - 17, centerY + 20 - bobY, 4, 8, pal.skin[1]);
    // Shoulder armor accent
    this.drawRect(ctx, centerX - 17, centerY + 8 - bobY, 4, 3, pal.armorAccent[1]);

    // Right arm (holding rifle)
    this.drawRect(ctx, centerX + 12, centerY + 6 - bobY, 6, 10, pal.armor[1]);
    this.drawRect(ctx, centerX + 13, centerY + 16 - bobY, 4, 6, pal.skin[1]);
    // Shoulder armor accent
    this.drawRect(ctx, centerX + 13, centerY + 6 - bobY, 4, 3, pal.armorAccent[1]);

    // Energy rifle (horizontal grip, futuristic)
    const rifleX = centerX - 8 + rifleRecoil;
    const rifleY = centerY + 10 - bobY;

    // Rifle body
    this.drawRect(ctx, rifleX, rifleY, 24, 6, pal.rifle[0]);
    this.drawRect(ctx, rifleX + 2, rifleY + 1, 20, 4, pal.rifle[1]);

    // Energy sections (glowing)
    this.drawRect(ctx, rifleX + 4, rifleY, 4, 6, pal.rifleGlow[0]);
    this.drawRect(ctx, rifleX + 5, rifleY + 1, 2, 4, pal.rifleGlow[2]);

    this.drawRect(ctx, rifleX + 14, rifleY, 4, 6, pal.rifleGlow[0]);
    this.drawRect(ctx, rifleX + 15, rifleY + 1, 2, 4, pal.rifleGlow[2]);

    // Handle/grip
    this.drawRect(ctx, rifleX + 10, rifleY + 6, 4, 4, pal.rifle[0]);

    // Barrel tip glow
    this.drawPixel(ctx, rifleX + 23, rifleY + 2, pal.rifleGlow[2]);
    this.drawPixel(ctx, rifleX + 23, rifleY + 3, pal.rifleGlow[2]);

    // Muzzle flash (during attack)
    if (muzzleFlash) {
      ctx.fillStyle = pal.glow;
      ctx.globalAlpha = 0.9;
      this.drawRect(ctx, rifleX + 24, rifleY - 2, 8, 10, pal.glow);
      ctx.globalAlpha = 0.6;
      this.drawRect(ctx, rifleX + 32, rifleY, 6, 6, pal.glow);
      ctx.globalAlpha = 1;
    }

    // Rifle glow effects
    ctx.fillStyle = pal.glow;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(rifleX + 6, rifleY + 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rifleX + 16, rifleY + 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

