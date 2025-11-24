/**
 * NPC SPRITE RENDERER
 * Enhanced with Character Mixer rendering styles
 * Supports: Pixel, Vector, Glitch, Watercolor, Hologram styles
 */

class NPCSpriteRenderer {
  constructor() {
    this.frameCount = 0;
    // Default render style - can be overridden per NPC
    this.defaultStyle = 'pixel';
  }

  render(ctx, npc, camera) {
    if (!npc || npc.hp <= 0 || npc.dead) return;

    const screenX = npc.x - camera.x;
    const screenY = npc.y; // Camera only tracks X, Y is absolute screen position

    // Culling - only render if on screen
    if (screenX < -100 || screenX > ctx.canvas.width + 100 ||
        screenY < -100 || screenY > ctx.canvas.height + 100) {
      return;
    }

    this.frameCount++;
    const animFrame = npc.animFrame || Math.floor(this.frameCount / 8);

    ctx.save();
    
    // Get standardized size if available
    let baseScale = npc.bodyScale || 1.0;
    if (window.npcSpriteStandardization && npc.spriteId) {
      const expectedSize = window.npcSpriteStandardization.getExpectedSize(npc.spriteId);
      const isBoss = window.npcSpriteStandardization.isWorldBoss(npc.spriteId);
      
      // Preserve original size for world bosses
      if (!isBoss && expectedSize && expectedSize.width && expectedSize.height) {
        // Adjust scale based on standard size (S-rank larger, etc.)
        const rank = npc.rank || 'C';
        const standardSizes = {
          'S': 128,
          'A': 96,
          'B': 64,
          'C': 64
        };
        const standardSize = standardSizes[rank] || 64;
        // Normalize scale to standard size
        baseScale = (standardSize / 64) * (npc.bodyScale || 1.0);
      }
    }
    
    ctx.translate(screenX, screenY);
    ctx.scale(baseScale, baseScale);

    // Get render style from NPC or use default
    const renderStyle = npc.renderStyle || this.defaultStyle;
    
    // Render NPC with selected style
    this.renderNPC(ctx, npc, animFrame, renderStyle);
    
    ctx.restore();
  }

  renderNPC(ctx, npc, animFrame, style) {
    const state = npc.state || 'idle';
    const direction = npc.direction || 'down';
    
    // Animation offsets
    let bobY = 0;
    let walk = 0;
    let attack = 0;
    let legOffset = 0;
    let armAngle = 0;
    let weaponAngle = 0;

    if (state === 'idle') {
      bobY = Math.sin(animFrame / 20 * Math.PI) * 3;
    } else if (state === 'walk') {
      bobY = Math.sin(animFrame / 5 * Math.PI) * 1.5;
      walk = Math.sin(animFrame / 5 * Math.PI) * 5;
      legOffset = Math.sin(animFrame / 5 * Math.PI) * 3;
    } else if (state === 'attack') {
      attack = animFrame % 30 < 15 ? (animFrame % 30) : 0;
      armAngle = animFrame < 3 ? animFrame * 20 : (animFrame < 5 ? 60 - (animFrame - 3) * 20 : 0);
      weaponAngle = animFrame < 3 ? animFrame * 25 : 0;
    }

    // Draw aura for A/S rank NPCs
    if (npc.rank === 'A' || npc.rank === 'S') {
      this.drawAura(ctx, 0, 0, bobY, npc.auraColor || 'rgba(255, 215, 0, 0.4)');
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 20 - bobY, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const facingLeft = direction === 'left' || direction === 'west';
    if (facingLeft) {
      ctx.scale(-1, 1);
    }

    // Get colors from NPC
    const color1 = npc.primaryColor || '#4a90e2';
    const color2 = npc.secondaryColor || '#2c5aa0';
    const outline = npc.outline || 2;

    // Render based on style
    switch (style) {
      case 'pixel':
      case '8bit':
        this.drawPixelStyle(ctx, npc, 0, bobY, walk, attack, color1, color2, outline);
        break;
      case 'vector':
      case 'neon':
        this.drawVectorStyle(ctx, npc, 0, bobY, walk, attack, color1, color2);
        break;
      case 'glitch':
        this.drawGlitchStyle(ctx, npc, 0, bobY, walk, attack, color1, color2, outline);
        break;
      case 'watercolor':
        this.drawWatercolorStyle(ctx, npc, 0, bobY, walk, attack, color1, color2);
        break;
      case 'hologram':
        this.drawHologramStyle(ctx, npc, 0, bobY, walk, attack, color1, color2);
        break;
      default:
        this.drawPixelStyle(ctx, npc, 0, bobY, walk, attack, color1, color2, outline);
    }

    // Name tag (above NPC)
    if (npc.displayName || npc.name) {
      ctx.save();
      if (facingLeft) ctx.scale(-1, 1);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      const name = npc.displayName || npc.name;
      ctx.strokeText(name, 0, -35 - bobY);
      ctx.fillText(name, 0, -35 - bobY);
      
      if (npc.rank) {
        ctx.fillStyle = npc.rankColor || '#ffffff';
        ctx.font = 'bold 8px Arial';
        ctx.fillText(`[${npc.rank}]`, 0, -25 - bobY);
      }
      ctx.restore();
    }

    if (facingLeft) {
      ctx.scale(-1, 1);
    }
  }

  /**
   * Pixel/8-bit style rendering (from Character Mixer)
   */
  drawPixelStyle(ctx, npc, x, y, walk, attack, color1, color2, outline) {
    ctx.fillStyle = color1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = outline;

    // Head
    const headColor = this.getHeadColor(npc);
    ctx.fillStyle = headColor;
    ctx.fillRect(x - 15, y - 40, 30, 30);
    if (outline > 0) ctx.strokeRect(x - 15, y - 40, 30, 30);

    // Hair/Helmet
    ctx.fillStyle = '#000';
    ctx.fillRect(x - 15, y - 40, 30, 8);

    // Eyes
    ctx.fillStyle = color2;
    ctx.fillRect(x - 10, y - 30, 6, 6);
    ctx.fillRect(x + 4, y - 30, 6, 6);

    // Body
    ctx.fillStyle = color1;
    ctx.fillRect(x - 20, y - 10, 40, 35);
    if (outline > 0) ctx.strokeRect(x - 20, y - 10, 40, 35);

    // Arms
    ctx.fillRect(x - 28, y, 8, 25);
    ctx.fillRect(x + 20, y, 8, 25);

    // Legs with walk animation
    ctx.fillRect(x - 15 + walk, y + 25, 10, 30);
    ctx.fillRect(x + 5 - walk, y + 25, 10, 30);

    // Weapon
    this.drawWeaponSimple(ctx, npc, x + 20, y, attack);
  }

  /**
   * Vector/Cel-shaded style rendering
   */
  drawVectorStyle(ctx, npc, x, y, walk, attack, color1, color2) {
    ctx.strokeStyle = color1;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Head
    ctx.beginPath();
    ctx.arc(x, y - 25, 18, 0, Math.PI * 2);
    ctx.fillStyle = color2 + '40';
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 25);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x, y - 5);
    ctx.lineTo(x + 20, y);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x - 10 + walk, y + 55);
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x + 10 - walk, y + 55);
    ctx.stroke();

    // Weapon
    this.drawWeaponVector(ctx, npc, x + 20, y, attack, color1);
  }

  /**
   * Glitch style rendering
   */
  drawGlitchStyle(ctx, npc, x, y, walk, attack, color1, color2, outline) {
    const glitch = this.frameCount % 20 < 3;
    const offset = glitch ? (Math.random() - 0.5) * 10 : 0;

    if (glitch) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5;
      this.drawPixelStyle(ctx, npc, x + 2, y, walk, attack, color1, color2, outline);
      ctx.fillStyle = '#00FF00';
      this.drawPixelStyle(ctx, npc, x - 2, y, walk, attack, color1, color2, outline);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    this.drawPixelStyle(ctx, npc, x + offset, y, walk, attack, color1, color2, outline);
  }

  /**
   * Watercolor style rendering
   */
  drawWatercolorStyle(ctx, npc, x, y, walk, attack, color1, color2) {
    const waterBlob = (bx, by, w, h) => {
      for (let i = 0; i < 3; i++) {
        ctx.globalAlpha = 0.4 - i * 0.1;
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, w);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color1 + '00');
        ctx.fillStyle = grad;
        ctx.fillRect(bx - w/2 + Math.random() * 3, by - h/2 + Math.random() * 3, w + Math.random() * 4, h + Math.random() * 4);
      }
      ctx.globalAlpha = 1;
    };

    waterBlob(x, y - 25, 35, 35);
    waterBlob(x, y, 40, 35);
    waterBlob(x - 20, y + 5, 10, 25);
    waterBlob(x + 20, y + 5, 10, 25);
    waterBlob(x - 13 + walk, y + 35, 10, 30);
    waterBlob(x + 5 - walk, y + 35, 10, 30);
  }

  /**
   * Hologram/Wireframe style rendering
   */
  drawHologramStyle(ctx, npc, x, y, walk, attack, color1, color2) {
    ctx.globalCompositeOperation = 'lighter';
    const alpha = 0.6 + Math.sin(this.frameCount / 10) * 0.2;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color1;
    ctx.lineWidth = 2;

    ctx.strokeRect(x - 15, y - 40, 30, 30);
    ctx.strokeRect(x - 20, y - 10, 40, 35);
    ctx.strokeRect(x - 28, y, 8, 25);
    ctx.strokeRect(x + 20, y, 8, 25);
    ctx.strokeRect(x - 15 + walk, y + 25, 10, 30);
    ctx.strokeRect(x + 5 - walk, y + 25, 10, 30);

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Get head color based on NPC head type
   */
  getHeadColor(npc) {
    const headType = npc.headType || 'human';
    switch (headType) {
      case 'elf': return '#f4d1ae';
      case 'orc': return '#8b7355';
      case 'dwarf': return '#d4a574';
      case 'angelic': return '#fff8dc';
      default: return '#ffdbac';
    }
  }

  /**
   * Simple weapon rendering for pixel style
   */
  drawWeaponSimple(ctx, npc, x, y, attack) {
    const weapon = npc.weapon || 'sword';
    const weaponColor = '#8b7355';
    const bladeColor = '#c0c0c0';

    ctx.save();
    ctx.translate(x, y - 3);
    if (attack > 0) {
      ctx.rotate(attack * 0.1);
    }

    switch (weapon) {
      case 'sword':
        ctx.fillStyle = bladeColor;
        ctx.fillRect(0, -2, 12, 2);
        ctx.fillStyle = weaponColor;
        ctx.fillRect(-2, -1, 2, 3);
        break;
      case 'staff':
        ctx.fillStyle = weaponColor;
        ctx.fillRect(0, -8, 2, 16);
        ctx.fillStyle = npc.primaryColor || '#4a90e2';
        ctx.beginPath();
        ctx.arc(1, -8, 3, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'bow':
        ctx.strokeStyle = weaponColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(6, 0);
        ctx.stroke();
        break;
      default:
        ctx.fillStyle = bladeColor;
        ctx.fillRect(0, -2, 10, 2);
    }

    ctx.restore();
  }

  /**
   * Vector style weapon rendering
   */
  drawWeaponVector(ctx, npc, x, y, attack, color) {
    const weapon = npc.weapon || 'sword';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.save();
    ctx.translate(x, y - 3);
    if (attack > 0) {
      ctx.rotate(attack * 0.1);
    }

    switch (weapon) {
      case 'sword':
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -10);
        ctx.stroke();
        break;
      case 'staff':
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -15);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -15, 3, 0, Math.PI * 2);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  /**
   * Draw aura effect for high-rank NPCs
   */
  drawAura(ctx, x, y, bobY, color) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    const gradient = ctx.createRadialGradient(x, y - bobY, 0, x, y - bobY, 20);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - bobY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.NPCSpriteRenderer = NPCSpriteRenderer;
}
