/**
 * CAT ANGEL GUNNER - HD Pixel Art Sprite
 * 
 * 128x128 pixel-perfect character
 * Anthropomorphic cat with floating halo, wing, and handgun
 * 
 * @version 1.0.0
 */

class CatAngelSprite extends HDSpriteBase {
  constructor(palette = 'fire') {
    super('MISSY', palette);
  }

  /**
   * Render cat angel sprite
   */
  render(ctx, x, y, opts = {}) {
    const pal = SPRITE_PALETTES[this.palette];
    const centerX = x;
    const centerY = y;
    const frame = this.currentFrame;
    const anim = this.currentAnim;

    // Calculate animation offsets
    let bobY = 0;
    let wingFlap = 0;
    let gunRecoil = 0;
    let legOffset = 0;

    if (anim === 'idle') {
      bobY = Math.sin(frame / 4 * Math.PI) * 2;
      wingFlap = Math.sin(frame / 4 * Math.PI) * 3;
    } else if (anim === 'walk') {
      bobY = Math.sin(frame / 4 * Math.PI) * 1.5;
      legOffset = Math.sin(frame / 4 * Math.PI) * 2;
    } else if (anim === 'attack') {
      gunRecoil = frame < 2 ? frame * 3 : 0;
    }

    // Draw aura glow
    const gradient = ctx.createRadialGradient(centerX, centerY - bobY, 0, centerX, centerY - bobY, 45);
    gradient.addColorStop(0, pal.aura + '0.2)');
    gradient.addColorStop(0.5, pal.aura + '0.08)');
    gradient.addColorStop(1, pal.aura + '0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(centerX - 64, centerY - 64 - bobY, 128, 128);

    // Halo (floating above head)
    const haloY = centerY - 28 - bobY - Math.abs(Math.sin(frame / 4 * Math.PI)) * 2;
    ctx.fillStyle = pal.halo[0];
    ctx.fillRect(centerX - 12, haloY, 24, 4);
    ctx.fillRect(centerX - 10, haloY + 1, 20, 2);
    this.drawPixel(ctx, centerX - 8, haloY + 1, pal.halo[2]);
    this.drawPixel(ctx, centerX + 7, haloY + 1, pal.halo[2]);

    // Wing (pink/beige, left side)
    ctx.fillStyle = pal.wing[0];
    ctx.fillRect(centerX - 20, centerY - 8 - bobY + wingFlap, 8, 14);
    ctx.fillStyle = pal.wing[1];
    ctx.fillRect(centerX - 18, centerY - 6 - bobY + wingFlap, 6, 10);
    ctx.fillStyle = pal.wing[2];
    ctx.fillRect(centerX - 16, centerY - 4 - bobY + wingFlap, 4, 6);

    // Legs (behind body)
    // Black cat legs
    this.drawRect(ctx, centerX - 8, centerY + 16 - bobY + legOffset, 5, 12, '#000000');
    this.drawRect(ctx, centerX + 3, centerY + 16 - bobY - legOffset, 5, 12, '#000000');

    // Body (dark suit)
    this.drawRect(ctx, centerX - 10, centerY + 2 - bobY, 20, 18, pal.suit[1]);
    this.drawRect(ctx, centerX - 8, centerY + 4 - bobY, 16, 14, pal.suit[2]);

    // Chest badge (themed rectangle)
    this.drawRect(ctx, centerX - 3, centerY + 8 - bobY, 6, 8, pal.chestBadge[0]);
    this.drawRect(ctx, centerX - 2, centerY + 9 - bobY, 4, 6, pal.chestBadge[1]);

    // Head (black cat)
    this.drawRect(ctx, centerX - 10, centerY - 12 - bobY, 20, 16, '#000000');

    // Cat ears (pointed, triangular)
    this.drawPixel(ctx, centerX - 9, centerY - 16 - bobY, '#000000');
    this.drawPixel(ctx, centerX - 8, centerY - 18 - bobY, '#000000');
    this.drawPixel(ctx, centerX - 7, centerY - 17 - bobY, '#000000');

    this.drawPixel(ctx, centerX + 8, centerY - 16 - bobY, '#000000');
    this.drawPixel(ctx, centerX + 7, centerY - 18 - bobY, '#000000');
    this.drawPixel(ctx, centerX + 6, centerY - 17 - bobY, '#000000');

    // Two eyes (both visible)
    const eyeColor = pal.eye || '#00ff00';
    this.drawPixel(ctx, centerX - 5, centerY - 8 - bobY, eyeColor);
    this.drawPixel(ctx, centerX + 4, centerY - 8 - bobY, eyeColor);

    // Cat tail (black, curved behind)
    this.drawRect(ctx, centerX + 10, centerY + 18 - bobY, 3, 6, '#000000');
    this.drawRect(ctx, centerX + 11, centerY + 24 - bobY, 4, 3, '#000000');
    this.drawRect(ctx, centerX + 10, centerY + 27 - bobY, 3, 2, '#000000');

    // Left arm (holding gun)
    this.drawRect(ctx, centerX - 18, centerY + 8 - bobY, 6, 12, '#000000');
    this.drawRect(ctx, centerX - 17, centerY + 20 - bobY, 4, 8, '#000000');

    // Right arm (holding sword)
    this.drawRect(ctx, centerX + 12, centerY + 6 - bobY, 6, 10, '#000000');
    this.drawRect(ctx, centerX + 13, centerY + 16 - bobY, 4, 6, '#000000');

    // Gun (left hand/paw)
    const gunX = centerX - 16 - gunRecoil;
    const gunY = centerY + 6 - bobY;
    this.drawRect(ctx, gunX, gunY, 10, 4, pal.gun[0]);
    this.drawRect(ctx, gunX, gunY + 1, 8, 2, pal.gun[1]);
    this.drawRect(ctx, gunX - 4, gunY, 4, 4, pal.gun[2]); // barrel

    // Muzzle flash (during attack)
    if (anim === 'attack' && frame < 2) {
      ctx.fillStyle = pal.glow;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(gunX - 8, gunY - 2, 6, 8);
      ctx.globalAlpha = 1;
    }

    // Sword (right hand/paw)
    ctx.save();
    ctx.translate(centerX + 18, centerY + 8 - bobY);
    ctx.rotate(45 * Math.PI / 180);
    this.drawRect(ctx, -2, -15, 4, 18, pal.halo[0]); // blade
    this.drawRect(ctx, -1, -15, 2, 18, pal.halo[2]); // core glow
    this.drawRect(ctx, -2, 3, 4, 4, pal.gun[0]); // handle
    ctx.restore();

    // Halo glow
    ctx.fillStyle = pal.glow;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(centerX, haloY + 2, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

