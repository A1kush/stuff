/**
 * SGC SPRITE RENDERER
 * Renders Special Game Characters (SGC) heroes with rank-based auras,
 * role-specific visuals, and palette-driven styling
 * Supports: Pixel, Vector, Glitch, Watercolor, Hologram styles
 */

class SGCSpriteRenderer {
  constructor() {
    this.frameCount = 0;
    // Rank-based aura colors
    this.rankColors = {
      'E': 'rgba(150, 150, 150, 0.3)',
      'C': 'rgba(100, 200, 255, 0.4)',
      'A': 'rgba(255, 215, 0, 0.5)',
      'S': 'rgba(255, 100, 200, 0.6)',
      'SS': 'rgba(200, 100, 255, 0.7)',
      'SSS': 'rgba(255, 50, 50, 0.8)',
      'SSSS': 'rgba(255, 255, 255, 0.9)'
    };
  }

  /**
   * Main render method
   */
  render(ctx, hero, camera = { x: 0, y: 0 }) {
    if (!hero) return;

    const screenX = hero.x - camera.x;
    const screenY = hero.y - camera.y;

    // Culling - only render if on screen
    if (screenX < -100 || screenX > ctx.canvas.width + 100 ||
        screenY < -100 || screenY > ctx.canvas.height + 100) {
      return;
    }

    this.frameCount++;
    const animFrame = hero.animFrame || Math.floor(this.frameCount / 8);

    ctx.save();
    const scale = hero.scale || 1.0;
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);

    // Get render style from hero or use default based on role
    const renderStyle = hero.renderStyle || this.getDefaultStyle(hero.role);
    
    // Render hero with selected style
    this.renderHero(ctx, hero, animFrame, renderStyle);
    
    ctx.restore();
  }

  /**
   * Get default render style based on role
   */
  getDefaultStyle(role) {
    const styleMap = {
      'support': 'watercolor',
      'striker': 'vector',
      'tank': 'pixel',
      'pet': 'glitch',
      'hybrid': 'hologram'
    };
    return styleMap[role] || 'pixel';
  }

  /**
   * Main hero rendering method
   */
  renderHero(ctx, hero, animFrame, style) {
    const state = hero.state || 'idle';
    const direction = hero.direction || 'down';
    
    // Animation offsets
    let bobY = 0;
    let walk = 0;
    let attack = 0;
    let legOffset = 0;
    let armAngle = 0;
    let skillEffect = 0;

    if (state === 'idle') {
      bobY = Math.sin(animFrame / 20 * Math.PI) * 3;
    } else if (state === 'walk') {
      bobY = Math.sin(animFrame / 5 * Math.PI) * 1.5;
      walk = Math.sin(animFrame / 5 * Math.PI) * 5;
      legOffset = Math.sin(animFrame / 5 * Math.PI) * 3;
    } else if (state === 'attack' || state === 'skill') {
      attack = animFrame % 30 < 15 ? (animFrame % 30) : 0;
      armAngle = animFrame < 3 ? animFrame * 20 : (animFrame < 5 ? 60 - (animFrame - 3) * 20 : 0);
      skillEffect = animFrame % 20;
    }

    // Get colors from hero palette
    const palette = hero.visuals?.palette || ['#4a90e2', '#2c5aa0', '#ffffff'];
    const color1 = palette[0] || '#4a90e2';
    const color2 = palette[1] || '#2c5aa0';
    const color3 = palette[2] || '#ffffff';

    // Draw rank-based aura
    const rank = hero.rank || 'E';
    const auraColor = this.rankColors[rank] || this.rankColors['E'];
    this.drawRankAura(ctx, 0, 0, bobY, auraColor, rank);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 20 - bobY, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const facingLeft = direction === 'left' || direction === 'west';
    if (facingLeft) {
      ctx.scale(-1, 1);
    }

    // Render based on style
    switch (style) {
      case 'pixel':
      case '8bit':
        this.drawPixelStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
        break;
      case 'vector':
      case 'neon':
        this.drawVectorStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
        break;
      case 'glitch':
        this.drawGlitchStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
        break;
      case 'watercolor':
        this.drawWatercolorStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
        break;
      case 'hologram':
        this.drawHologramStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
        break;
      default:
        this.drawPixelStyle(ctx, hero, 0, bobY, walk, attack, color1, color2, color3);
    }

    // Name tag (above hero)
    if (hero.name) {
      ctx.save();
      if (facingLeft) ctx.scale(-1, 1);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.strokeText(hero.name, 0, -35 - bobY);
      ctx.fillText(hero.name, 0, -35 - bobY);
      
      if (hero.rank) {
        ctx.fillStyle = this.getRankTextColor(hero.rank);
        ctx.font = 'bold 8px Arial';
        ctx.fillText(`[${hero.rank}]`, 0, -25 - bobY);
      }
      ctx.restore();
    }

    if (facingLeft) {
      ctx.scale(-1, 1);
    }
  }

  /**
   * Draw rank-based aura with intensity based on rank
   */
  drawRankAura(ctx, x, y, bobY, color, rank) {
    ctx.save();
    
    // Rank intensity multiplier
    const intensityMap = { 'E': 0.2, 'C': 0.3, 'A': 0.4, 'S': 0.5, 'SS': 0.6, 'SSS': 0.7, 'SSSS': 0.9 };
    const intensity = intensityMap[rank] || 0.2;
    
    // Pulsing effect for high ranks
    const pulse = rank >= 'S' ? Math.sin(this.frameCount / 10) * 0.2 + 1 : 1;
    const radius = 20 * pulse;
    
    // Parse rgba color and create gradient colors
    const parseRGBA = (rgbaStr) => {
      const match = rgbaStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (match) {
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
          a: match[4] ? parseFloat(match[4]) : 1.0
        };
      }
      return null;
    };
    
    const colorParts = parseRGBA(color);
    if (!colorParts) {
      // Fallback if color parsing fails
      ctx.globalAlpha = intensity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - bobY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    
    // Create gradient with proper color stops
    const gradient = ctx.createRadialGradient(x, y - bobY, 0, x, y - bobY, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, `rgba(${colorParts.r}, ${colorParts.g}, ${colorParts.b}, ${colorParts.a * 0.3})`);
    gradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = intensity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - bobY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Additional glow layers for SS+ ranks
    if (rank >= 'SS') {
      ctx.globalAlpha = intensity * 0.5;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y - bobY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  /**
   * Get rank text color
   */
  getRankTextColor(rank) {
    const colorMap = {
      'E': '#999999',
      'C': '#64c8ff',
      'A': '#ffd700',
      'S': '#ff64c8',
      'SS': '#c864ff',
      'SSS': '#ff3232',
      'SSSS': '#ffffff'
    };
    return colorMap[rank] || '#ffffff';
  }

  /**
   * Pixel/8-bit style rendering
   */
  drawPixelStyle(ctx, hero, x, y, walk, attack, color1, color2, color3) {
    ctx.fillStyle = color1;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Head
    const headColor = this.getHeadColor(hero);
    ctx.fillStyle = headColor;
    ctx.fillRect(x - 15, y - 40, 30, 30);
    ctx.strokeRect(x - 15, y - 40, 30, 30);

    // Hair/Helmet/Crown based on role
    this.drawHeadAccessory(ctx, hero, x, y - 40, color2);

    // Eyes
    ctx.fillStyle = color2;
    ctx.fillRect(x - 10, y - 30, 6, 6);
    ctx.fillRect(x + 4, y - 30, 6, 6);

    // Body
    ctx.fillStyle = color1;
    ctx.fillRect(x - 20, y - 10, 40, 35);
    ctx.strokeRect(x - 20, y - 10, 40, 35);

    // Arms
    ctx.fillRect(x - 28, y, 8, 25);
    ctx.fillRect(x + 20, y, 8, 25);

    // Legs with walk animation
    ctx.fillRect(x - 15 + walk, y + 25, 10, 30);
    ctx.fillRect(x + 5 - walk, y + 25, 10, 30);

    // Weapon/Equipment based on role
    this.drawRoleEquipment(ctx, hero, x + 20, y, attack, color2, color3);
  }

  /**
   * Vector/Cel-shaded style rendering
   */
  drawVectorStyle(ctx, hero, x, y, walk, attack, color1, color2, color3) {
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
    this.drawRoleEquipment(ctx, hero, x + 20, y, attack, color2, color3, 'vector');
  }

  /**
   * Glitch style rendering
   */
  drawGlitchStyle(ctx, hero, x, y, walk, attack, color1, color2, color3) {
    const glitch = this.frameCount % 20 < 3;
    const offset = glitch ? (Math.random() - 0.5) * 10 : 0;

    if (glitch) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.5;
      this.drawPixelStyle(ctx, hero, x + 2, y, walk, attack, color1, color2, color3);
      ctx.fillStyle = '#00FF00';
      this.drawPixelStyle(ctx, hero, x - 2, y, walk, attack, color1, color2, color3);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    this.drawPixelStyle(ctx, hero, x + offset, y, walk, attack, color1, color2, color3);
  }

  /**
   * Watercolor style rendering
   */
  drawWatercolorStyle(ctx, hero, x, y, walk, attack, color1, color2, color3) {
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
  drawHologramStyle(ctx, hero, x, y, walk, attack, color1, color2, color3) {
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
   * Get head color based on hero (default human skin)
   */
  getHeadColor(hero) {
    // For pets, use different colors
    if (hero.role === 'pet') {
      const palette = hero.visuals?.palette || ['#f8f6ff', '#ff96d5'];
      return palette[0] || '#f8f6ff';
    }
    return '#ffdbac'; // Default human skin
  }

  /**
   * Draw head accessory based on role and rank
   */
  drawHeadAccessory(ctx, hero, x, y, color) {
    ctx.fillStyle = color;
    
    if (hero.role === 'support') {
      // Crown or halo for support
      ctx.beginPath();
      ctx.arc(x, y - 5, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (hero.role === 'striker') {
      // Hat or helmet
      ctx.fillRect(x - 12, y - 5, 24, 8);
    } else if (hero.role === 'tank') {
      // Helmet
      ctx.fillRect(x - 15, y - 5, 30, 10);
    } else if (hero.role === 'pet') {
      // Ears for pets
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 5);
      ctx.lineTo(x - 12, y - 15);
      ctx.lineTo(x - 4, y - 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 5);
      ctx.lineTo(x + 12, y - 15);
      ctx.lineTo(x + 4, y - 10);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Draw role-specific equipment (weapons, tools, etc.)
   */
  drawRoleEquipment(ctx, hero, x, y, attack, color2, color3, style = 'pixel') {
    const role = hero.role || 'striker';
    
    ctx.save();
    ctx.translate(x, y - 3);
    if (attack > 0) {
      ctx.rotate(attack * 0.1);
    }

    if (style === 'vector') {
      ctx.strokeStyle = color2;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    } else {
      ctx.fillStyle = color2;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
    }

    switch (role) {
      case 'striker':
        // Gun or sword
        if (style === 'vector') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -15);
          ctx.stroke();
          // Gun barrel
          ctx.beginPath();
          ctx.arc(0, -15, 3, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillRect(0, -12, 3, 12);
          ctx.fillRect(-1, -15, 5, 3);
        }
        break;
      case 'support':
        // Staff or wand
        if (style === 'vector') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -18);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, -18, 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillRect(0, -15, 2, 15);
          ctx.fillStyle = color3;
          ctx.beginPath();
          ctx.arc(1, -15, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'tank':
        // Shield
        if (style === 'vector') {
          ctx.beginPath();
          ctx.arc(0, -8, 8, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillRect(-8, -12, 16, 16);
        }
        break;
      case 'pet':
        // Claws or energy
        if (style === 'vector') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(-5, -8);
          ctx.moveTo(0, 0);
          ctx.lineTo(5, -8);
          ctx.stroke();
        } else {
          ctx.fillRect(-3, -8, 2, 8);
          ctx.fillRect(1, -8, 2, 8);
        }
        break;
      default:
        // Default weapon
        if (style === 'vector') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -10);
          ctx.stroke();
        } else {
          ctx.fillRect(0, -10, 2, 10);
        }
    }

    ctx.restore();
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.SGCSpriteRenderer = SGCSpriteRenderer;
}

