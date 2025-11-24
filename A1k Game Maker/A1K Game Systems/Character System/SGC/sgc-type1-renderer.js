/**
 * SGC TYPE-1 HD PIXEL ART RENDERER
 * Full body sprite renderer in Soul Knight / Hyper Light Drifter style
 * Features: 128x128 resolution, pixel-perfect drawing, full body features
 */

class SGCType1Renderer {
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
  render(ctx, hero, animFrame = 0, animState = 'idle', palette = 'fire') {
    if (!hero) return;
    
    this.frameCount++;
    const centerX = 64;
    const centerY = 64;
    
    // Clear canvas
    ctx.clearRect(0, 0, 128, 128);
    
    // Get hero colors from palette or visuals
    const heroPalette = this.getHeroPalette(hero, palette);
    
    // Animation offsets
    let bobY = 0;
    let legOffset = 0;
    let armAngle = 0;
    let wingFlap = 0;
    let weaponRecoil = 0;
    
    if (animState === 'idle') {
      bobY = Math.sin(animFrame / 4 * Math.PI) * 2;
      if (hero.role === 'pet') {
        wingFlap = Math.sin(animFrame / 4 * Math.PI) * 3;
      }
    } else if (animState === 'walk') {
      bobY = Math.sin(animFrame / 4 * Math.PI) * 1.5;
      legOffset = Math.sin(animFrame / 4 * Math.PI) * 3;
    } else if (animState === 'attack') {
      armAngle = animFrame < 3 ? animFrame * 20 : 0;
      weaponRecoil = animFrame < 2 ? animFrame * 3 : 0;
    }
    
    // Draw rank aura
    const rank = hero.rank || 'E';
    let auraColor = this.rankColors[rank] || this.rankColors['E'];
    
    // Special aura for Phantom Phoenix - half fire, half shadow
    if (hero.id === 'phantom-phoenix') {
      this.drawSplitAura(ctx, centerX, centerY, bobY, rank);
    } else if (hero.id === 'jeff') {
      // Jeff gets dark aura
      const darkAuraColor = 'rgba(20, 20, 30, 0.8)';
      this.drawRankAura(ctx, centerX, centerY, bobY, darkAuraColor, rank);
    } else {
      // Shaniqua gets S rank aura (she's S rank)
      const auraRank = (hero.id === 'shaniqua') ? 'S' : rank;
      const finalAuraColor = (hero.id === 'shaniqua') ? this.rankColors['S'] : auraColor;
      this.drawRankAura(ctx, centerX, centerY, bobY, finalAuraColor, auraRank);
    }
    
    // Draw shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 20 - bobY, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw full body (back to front order)
    this.drawLegs(ctx, centerX, centerY, bobY, legOffset, hero, heroPalette);
    this.drawTorso(ctx, centerX, centerY, bobY, hero, heroPalette);
    this.drawArms(ctx, centerX, centerY, bobY, armAngle, legOffset, animState, hero, heroPalette);
    this.drawHead(ctx, centerX, centerY, bobY, hero, heroPalette);
    this.drawHeadAccessory(ctx, centerX, centerY, bobY, animFrame, hero, heroPalette);
    this.drawRoleEquipment(ctx, centerX, centerY, bobY, armAngle, weaponRecoil, animState, hero, heroPalette);
    
    // Draw special effects (wings, auras, etc.)
    if (hero.role === 'pet' || hero.id === 'phoenix' || hero.id === 'phantom-phoenix') {
      this.drawWings(ctx, centerX, centerY, bobY, wingFlap, hero, heroPalette);
    }
  }

  /**
   * Get hero color palette
   */
  getHeroPalette(hero, paletteName) {
    const heroId = hero.id || hero.name?.toLowerCase().replace(/\s+/g, '-');
    
    // Jeff gets dark clothes
    if (heroId === 'jeff') {
      return {
        primary: '#222222',
        secondary: '#444444',
        accent: '#666666',
        skin: '#8B4513' // Brown skin
      };
    }
    
    // Modelo gets red and black clothes
    if (heroId === 'modelo') {
      return {
        primary: '#8B0000', // Dark red
        secondary: '#000000', // Black
        accent: '#DC143C', // Crimson red
        skin: '#8B4513' // Brown skin
      };
    }
    
    // Use hero's visual palette if available
    if (hero.visuals && hero.visuals.palette) {
      return {
        primary: hero.visuals.palette[0] || '#4a90e2',
        secondary: hero.visuals.palette[1] || '#2c5aa0',
        accent: hero.visuals.palette[2] || '#ffffff',
        skin: hero.role === 'pet' ? (hero.visuals.palette[0] || '#ffb347') : '#8B4513' // Brown skin for all
      };
    }
    
    // Default palettes based on role - all have brown skin
    const rolePalettes = {
      support: { primary: '#f8d9a0', secondary: '#f2b880', accent: '#fff7d6', skin: '#8B4513' },
      striker: { primary: '#ff4444', secondary: '#cc0000', accent: '#ff8888', skin: '#8B4513' },
      tank: { primary: '#4a4a4a', secondary: '#2a2a2a', accent: '#888888', skin: '#8B4513' },
      pet: { primary: '#ffb347', secondary: '#ff512f', accent: '#ffd479', skin: '#ffb347' },
      hybrid: { primary: '#9b59b6', secondary: '#7d3c98', accent: '#bb8fce', skin: '#8B4513' }
    };
    
    return rolePalettes[hero.role] || rolePalettes.striker;
  }

  /**
   * Draw pixel helper
   */
  drawPixel(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
  }

  /**
   * Draw rectangle helper
   */
  drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  /**
   * Draw split aura (half fire, half shadow) for Phantom Phoenix
   */
  drawSplitAura(ctx, x, y, bobY, rank) {
    ctx.save();
    const intensityMap = { 'E': 0.2, 'C': 0.3, 'A': 0.4, 'S': 0.5, 'SS': 0.6, 'SSS': 0.7, 'SSSS': 0.9 };
    const intensity = intensityMap[rank] || 0.2;
    const pulse = rank >= 'S' ? Math.sin(this.frameCount / 10) * 0.2 + 1 : 1;
    const radius = 20 * pulse;
    
    // Fire side (left)
    const fireColor = 'rgba(255, 100, 50, 0.6)';
    const fireGradient = ctx.createRadialGradient(x - radius/2, y - bobY, 0, x - radius/2, y - bobY, radius);
    fireGradient.addColorStop(0, fireColor);
    fireGradient.addColorStop(0.5, 'rgba(255, 100, 50, 0.2)');
    fireGradient.addColorStop(1, 'transparent');
    
    ctx.globalAlpha = intensity;
    ctx.fillStyle = fireGradient;
    ctx.beginPath();
    ctx.arc(x - radius/2, y - bobY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Shadow side (right)
    const shadowColor = 'rgba(50, 50, 100, 0.6)';
    const shadowGradient = ctx.createRadialGradient(x + radius/2, y - bobY, 0, x + radius/2, y - bobY, radius);
    shadowGradient.addColorStop(0, shadowColor);
    shadowGradient.addColorStop(0.5, 'rgba(50, 50, 100, 0.2)');
    shadowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = shadowGradient;
    ctx.beginPath();
    ctx.arc(x + radius/2, y - bobY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    if (rank >= 'SS') {
      ctx.globalAlpha = intensity * 0.5;
      ctx.fillStyle = fireGradient;
      ctx.beginPath();
      ctx.arc(x - radius/2, y - bobY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.arc(x + radius/2, y - bobY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /**
   * Draw rank aura
   */
  drawRankAura(ctx, x, y, bobY, color, rank) {
    ctx.save();
    const intensityMap = { 'E': 0.2, 'C': 0.3, 'A': 0.4, 'S': 0.5, 'SS': 0.6, 'SSS': 0.7, 'SSSS': 0.9 };
    const intensity = intensityMap[rank] || 0.2;
    const pulse = rank >= 'S' ? Math.sin(this.frameCount / 10) * 0.2 + 1 : 1;
    const radius = 20 * pulse;

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
      ctx.globalAlpha = intensity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - bobY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const gradient = ctx.createRadialGradient(x, y - bobY, 0, x, y - bobY, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, `rgba(${colorParts.r}, ${colorParts.g}, ${colorParts.b}, ${colorParts.a * 0.3})`);
    gradient.addColorStop(1, 'transparent');

    ctx.globalAlpha = intensity;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - bobY, radius, 0, Math.PI * 2);
    ctx.fill();

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
   * Draw legs (behind body)
   */
  drawLegs(ctx, centerX, centerY, bobY, legOffset, hero, palette) {
    const isPet = hero.role === 'pet';
    const legColor = isPet ? palette.skin : palette.secondary;
    
    // Left leg
    this.drawRect(ctx, centerX - 10, centerY + 20 - bobY + legOffset, 6, 16, legColor);
    if (!isPet) {
      this.drawRect(ctx, centerX - 10, centerY + 36 - bobY + legOffset, 6, 8, palette.skin);
    }
    
    // Right leg
    this.drawRect(ctx, centerX + 4, centerY + 20 - bobY - legOffset, 6, 16, legColor);
    if (!isPet) {
      this.drawRect(ctx, centerX + 4, centerY + 36 - bobY - legOffset, 6, 8, palette.skin);
    }
  }

  /**
   * Draw torso
   */
  drawTorso(ctx, centerX, centerY, bobY, hero, palette) {
    // Main body
    this.drawRect(ctx, centerX - 12, centerY + 4 - bobY, 24, 20, palette.primary);
    this.drawRect(ctx, centerX - 10, centerY + 6 - bobY, 20, 16, palette.secondary);
    
    // Chest badge/emblem for high ranks
    if (hero.rank >= 'A') {
      this.drawRect(ctx, centerX - 3, centerY + 8 - bobY, 6, 8, palette.accent);
      this.drawRect(ctx, centerX - 2, centerY + 9 - bobY, 4, 6, palette.primary);
    }
  }

  /**
   * Draw arms
   */
  drawArms(ctx, centerX, centerY, bobY, armAngle, legOffset, animState, hero, palette) {
    const isPet = hero.role === 'pet';
    const armColor = isPet ? palette.skin : palette.skin;
    
    // Left arm (behind for walk)
    if (animState === 'walk') {
      this.drawRect(ctx, centerX - 16, centerY + 8 - bobY - legOffset, 5, 14, armColor);
    } else {
      this.drawRect(ctx, centerX - 16, centerY + 8 - bobY, 5, 14, armColor);
    }
    
    // Right arm (in front)
    const armOffset = animState === 'attack' ? Math.sin(armAngle * Math.PI / 180) * 5 : 0;
    this.drawRect(ctx, centerX + 12, centerY + 8 - bobY + armOffset, 5, 14, armColor);
  }

  /**
   * Draw head
   */
  drawHead(ctx, centerX, centerY, bobY, hero, palette) {
    const isPet = hero.role === 'pet';
    const headColor = isPet ? palette.skin : palette.skin;
    
    // Head
    this.drawRect(ctx, centerX - 10, centerY - 16 - bobY, 20, 18, headColor);
    
    // Neck
    if (!isPet) {
      this.drawRect(ctx, centerX - 6, centerY + 2 - bobY, 12, 4, palette.skin);
    }
    
    // Eyes (2 pixels each)
    const eyeColor = hero.rank >= 'S' ? palette.accent : '#000000';
    this.drawPixel(ctx, centerX - 6, centerY - 8 - bobY, eyeColor);
    this.drawPixel(ctx, centerX - 5, centerY - 8 - bobY, eyeColor);
    this.drawPixel(ctx, centerX + 5, centerY - 8 - bobY, eyeColor);
    this.drawPixel(ctx, centerX + 6, centerY - 8 - bobY, eyeColor);
    
    // Pet ears if applicable
    if (isPet) {
      // Left ear
      this.drawPixel(ctx, centerX - 9, centerY - 16 - bobY, headColor);
      this.drawPixel(ctx, centerX - 8, centerY - 18 - bobY, headColor);
      this.drawPixel(ctx, centerX - 7, centerY - 17 - bobY, headColor);
      // Right ear
      this.drawPixel(ctx, centerX + 8, centerY - 16 - bobY, headColor);
      this.drawPixel(ctx, centerX + 7, centerY - 18 - bobY, headColor);
      this.drawPixel(ctx, centerX + 6, centerY - 17 - bobY, headColor);
    }
  }

  /**
   * Draw head accessory (hair, helmet, crown, etc.)
   */
  drawHeadAccessory(ctx, centerX, centerY, bobY, animFrame, hero, palette) {
    const heroId = hero.id || hero.name?.toLowerCase().replace(/\s+/g, '-');
    const heroName = hero.name?.toLowerCase() || '';
    
    // Female heroes list
    const femaleHeroes = ['grandma', 'vernal-moody', 'jannesica-moody', 'shaniqua', 'missy'];
    const isFemale = femaleHeroes.includes(heroId);
    
    // Don't touch Missy and Phoenix
    if (heroId === 'missy' || heroId === 'phoenix') {
      // Keep original hair logic for these
      if (hero.role !== 'pet') {
        this.drawPixel(ctx, centerX - 11, centerY - 14 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 10, centerY - 15 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 9, centerY - 14 - bobY, '#111111');
      }
      return;
    }
    
    // Wavii: Black hair/dreads and hat
    if (heroId === 'wavii') {
      // Hat
      this.drawRect(ctx, centerX - 12, centerY - 20 - bobY, 24, 6, palette.secondary);
      this.drawRect(ctx, centerX - 14, centerY - 18 - bobY, 6, 2, palette.secondary);
      // Black dreads coming out from under hat
      for (let i = 0; i < 4; i++) {
        this.drawRect(ctx, centerX - 10 + i * 5, centerY - 14 - bobY, 3, 8, '#000000');
        this.drawRect(ctx, centerX - 9 + i * 5, centerY - 12 - bobY, 1, 6, '#1a1a1a');
      }
      return;
    }
    
    // Modelo: Bald head (no hair)
    if (heroId === 'modelo') {
      // Just the head, no hair
      return;
    }
    
    // Shaniqua: Pigtails
    if (heroId === 'shaniqua') {
      // Left pigtail
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 12, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 10, '#1a1a1a');
      this.drawRect(ctx, centerX - 16, centerY - 0 - bobY, 4, 6, '#000000');
      // Right pigtail
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 12, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 10, '#1a1a1a');
      this.drawRect(ctx, centerX + 12, centerY - 0 - bobY, 4, 6, '#000000');
      // Hair on top
      this.drawPixel(ctx, centerX - 11, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 10, centerY - 15 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 9, centerY - 14 - bobY, '#111111');
      this.drawPixel(ctx, centerX + 9, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 10, centerY - 15 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 11, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 12, centerY - 13 - bobY, '#111111');
      return;
    }
    
    // A1 Kush: Hat and braids (boy, so no pigtails)
    if (heroId === 'a1-kush') {
      // Hat
      this.drawRect(ctx, centerX - 12, centerY - 20 - bobY, 24, 6, palette.secondary);
      this.drawRect(ctx, centerX - 14, centerY - 18 - bobY, 6, 2, palette.secondary);
      // Braids on sides (shorter, boy style)
      // Left braid
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 8, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 6, '#1a1a1a');
      // Right braid
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 8, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 6, '#1a1a1a');
      return;
    }
    
    // Jae Reload: Hat and braids/pigtails
    if (heroId === 'jae-reload') {
      // Hat
      this.drawRect(ctx, centerX - 12, centerY - 20 - bobY, 24, 6, palette.secondary);
      this.drawRect(ctx, centerX - 14, centerY - 18 - bobY, 6, 2, palette.secondary);
      // Braids/pigtails on sides
      // Left braid
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 10, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 8, '#1a1a1a');
      // Right braid
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 10, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 8, '#1a1a1a');
      return;
    }
    
    // Jeff: Braids and dark clothes
    if (heroId === 'jeff') {
      // Braids on sides
      // Left braid
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 10, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 8, '#1a1a1a');
      // Right braid
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 10, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 8, '#1a1a1a');
      // Hair on top
      this.drawPixel(ctx, centerX - 11, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 10, centerY - 15 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
      this.drawPixel(ctx, centerX - 9, centerY - 14 - bobY, '#111111');
      this.drawPixel(ctx, centerX + 9, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 10, centerY - 15 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 11, centerY - 14 - bobY, '#000000');
      this.drawPixel(ctx, centerX + 12, centerY - 13 - bobY, '#111111');
      return;
    }
    
    // Grandma: Long hair/pigtails
    if (heroId === 'grandma') {
      // Hair on top
      for (let i = -12; i <= 12; i++) {
        if (Math.abs(i) < 11) {
          this.drawPixel(ctx, centerX + i, centerY - 14 - bobY, '#000000');
          if (Math.abs(i) < 10) {
            this.drawPixel(ctx, centerX + i, centerY - 15 - bobY, '#000000');
          }
        }
      }
      // Left long pigtail (extended down)
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 18, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 16, '#1a1a1a');
      this.drawRect(ctx, centerX - 16, centerY + 6 - bobY, 4, 8, '#000000');
      // Right long pigtail (extended down)
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 18, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 16, '#1a1a1a');
      this.drawRect(ctx, centerX + 12, centerY + 6 - bobY, 4, 8, '#000000');
      return;
    }
    
    // Jannesica Moody: Long hair/pigtails
    if (heroId === 'jannesica-moody') {
      // Hair on top
      for (let i = -12; i <= 12; i++) {
        if (Math.abs(i) < 11) {
          this.drawPixel(ctx, centerX + i, centerY - 14 - bobY, '#000000');
          if (Math.abs(i) < 10) {
            this.drawPixel(ctx, centerX + i, centerY - 15 - bobY, '#000000');
          }
        }
      }
      // Left long pigtail (extended down)
      this.drawRect(ctx, centerX - 16, centerY - 12 - bobY, 4, 18, '#000000');
      this.drawRect(ctx, centerX - 15, centerY - 10 - bobY, 2, 16, '#1a1a1a');
      this.drawRect(ctx, centerX - 16, centerY + 6 - bobY, 4, 8, '#000000');
      // Right long pigtail (extended down)
      this.drawRect(ctx, centerX + 12, centerY - 12 - bobY, 4, 18, '#000000');
      this.drawRect(ctx, centerX + 13, centerY - 10 - bobY, 2, 16, '#1a1a1a');
      this.drawRect(ctx, centerX + 12, centerY + 6 - bobY, 4, 8, '#000000');
      return;
    }
    
    // Default hair for other heroes
    ctx.fillStyle = palette.secondary;
    if (hero.role === 'support') {
      // Crown or halo for support
      const haloY = centerY - 28 - bobY - Math.abs(Math.sin(animFrame / 4 * Math.PI)) * 2;
      this.drawRect(ctx, centerX - 12, haloY, 24, 4, palette.accent);
      this.drawRect(ctx, centerX - 10, haloY + 1, 20, 2, palette.primary);
      this.drawPixel(ctx, centerX - 8, haloY + 1, palette.accent);
      this.drawPixel(ctx, centerX + 7, haloY + 1, palette.accent);
    } else if (hero.role === 'striker') {
      // Hat or cap
      this.drawRect(ctx, centerX - 12, centerY - 20 - bobY, 24, 6, palette.secondary);
      this.drawRect(ctx, centerX - 14, centerY - 18 - bobY, 6, 2, palette.secondary);
    } else if (hero.role === 'tank') {
      // Helmet
      this.drawRect(ctx, centerX - 15, centerY - 18 - bobY, 30, 10, palette.secondary);
      this.drawRect(ctx, centerX - 13, centerY - 16 - bobY, 26, 6, palette.primary);
    }
    
    // Hair for non-pets (black, locked like type-1 style)
    // Make sure girls have hair
    if (hero.role !== 'pet') {
      // More hair for female heroes
      if (isFemale) {
        // Full hair coverage for girls
        for (let i = -12; i <= 12; i++) {
          if (Math.abs(i) < 11) {
            this.drawPixel(ctx, centerX + i, centerY - 14 - bobY, '#000000');
            if (Math.abs(i) < 10) {
              this.drawPixel(ctx, centerX + i, centerY - 15 - bobY, '#000000');
            }
          }
        }
        this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
        this.drawPixel(ctx, centerX + 12, centerY - 13 - bobY, '#000000');
      } else {
        // Default hair for males
        this.drawPixel(ctx, centerX - 11, centerY - 14 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 10, centerY - 15 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 12, centerY - 13 - bobY, '#000000');
        this.drawPixel(ctx, centerX - 9, centerY - 14 - bobY, '#111111');
      }
    }
  }

  /**
   * Draw role-specific equipment (weapons, tools, etc.)
   */
  drawRoleEquipment(ctx, centerX, centerY, bobY, armAngle, weaponRecoil, animState, hero, palette) {
    const role = hero.role || 'striker';
    const heroId = hero.id || hero.name?.toLowerCase().replace(/\s+/g, '-');
    
    ctx.save();
    
    // Jeff: Sword, gun, and robot pet (lowered, dark colors)
    if (heroId === 'jeff') {
      // Dark palette for Jeff
      const darkSecondary = '#1a1a1a';
      const darkPrimary = '#2a2a2a';
      const darkAccent = '#3a3a3a';
      
      // Right hand - Gun (lowered even more)
      const gunX = centerX + 16 - weaponRecoil;
      const gunY = centerY + 34 - bobY; // Lowered by 28 pixels total
      this.drawRect(ctx, gunX, gunY, 10, 4, darkSecondary);
      this.drawRect(ctx, gunX, gunY + 1, 8, 2, darkPrimary);
      this.drawRect(ctx, gunX - 4, gunY, 4, 4, darkAccent);
      
      // Left hand - Sword (lowered even more)
      ctx.save();
      ctx.translate(centerX - 20, centerY + 38 - bobY); // Lowered by 28 pixels total
      ctx.rotate((45 - armAngle) * Math.PI / 180);
      this.drawRect(ctx, -2, -20, 4, 24, darkAccent);
      this.drawRect(ctx, -1, -20, 2, 24, darkPrimary);
      // Rim light
      this.drawPixel(ctx, -2, -18, darkAccent);
      this.drawPixel(ctx, -2, -10, darkAccent);
      this.drawPixel(ctx, -2, -2, darkAccent);
      // Handle
      this.drawRect(ctx, -2, 4, 4, 6, darkSecondary);
      ctx.restore();
      
      // Robot pet (small robot floating near Jeff, lowered even more)
      const robotX = centerX - 8;
      const robotY = centerY + 18 - bobY + Math.sin(this.frameCount / 8) * 2; // Lowered by 14 pixels more
      // Robot body
      this.drawRect(ctx, robotX - 4, robotY - 4, 8, 8, '#444444');
      this.drawRect(ctx, robotX - 3, robotY - 3, 6, 6, '#555555');
      // Robot head
      this.drawRect(ctx, robotX - 3, robotY - 8, 6, 4, '#333333');
      // Robot eyes
      this.drawPixel(ctx, robotX - 2, robotY - 6, '#ff0000');
      this.drawPixel(ctx, robotX + 1, robotY - 6, '#ff0000');
      // Robot arms
      this.drawRect(ctx, robotX - 6, robotY - 2, 2, 4, '#444444');
      this.drawRect(ctx, robotX + 4, robotY - 2, 2, 4, '#444444');
      
      // Muzzle flash during attack
      if (animState === 'attack' && weaponRecoil > 0) {
        ctx.fillStyle = darkAccent;
        ctx.globalAlpha = 0.8;
        this.drawRect(ctx, gunX - 8, gunY - 2, 6, 8, darkAccent);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      return;
    }
    
    // Wavii and Jae Reload: Dual guns (lowered)
    if (heroId === 'wavii' || heroId === 'jae-reload') {
      // Left gun (lowered by 6 pixels)
      const leftGunX = centerX - 16 + weaponRecoil;
      const leftGunY = centerY + 12 - bobY;
      this.drawRect(ctx, leftGunX - 10, leftGunY, 10, 4, palette.secondary);
      this.drawRect(ctx, leftGunX - 10, leftGunY + 1, 8, 2, palette.primary);
      this.drawRect(ctx, leftGunX - 14, leftGunY, 4, 4, palette.accent);
      
      // Right gun (lowered by 6 pixels)
      const rightGunX = centerX + 16 - weaponRecoil;
      const rightGunY = centerY + 12 - bobY;
      this.drawRect(ctx, rightGunX, rightGunY, 10, 4, palette.secondary);
      this.drawRect(ctx, rightGunX, rightGunY + 1, 8, 2, palette.primary);
      this.drawRect(ctx, rightGunX - 4, rightGunY, 4, 4, palette.accent);
      
      // Muzzle flash during attack
      if (animState === 'attack' && weaponRecoil > 0) {
        ctx.fillStyle = palette.accent;
        ctx.globalAlpha = 0.8;
        // Left flash
        this.drawRect(ctx, leftGunX - 18, leftGunY - 2, 6, 8, palette.accent);
        // Right flash
        this.drawRect(ctx, rightGunX + 10, rightGunY - 2, 6, 8, palette.accent);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      return;
    }
    
    if (role === 'striker') {
      // Sword or melee weapon (lowered by 6 pixels)
      ctx.translate(centerX + 20, centerY + 16 - bobY);
      ctx.rotate((45 - armAngle) * Math.PI / 180);
      this.drawRect(ctx, -2, -20, 4, 24, palette.accent);
      this.drawRect(ctx, -1, -20, 2, 24, palette.primary);
      // Rim light
      this.drawPixel(ctx, -2, -18, palette.accent);
      this.drawPixel(ctx, -2, -10, palette.accent);
      this.drawPixel(ctx, -2, -2, palette.accent);
      // Handle
      this.drawRect(ctx, -2, 4, 4, 6, palette.secondary);
    } else if (role === 'support') {
      // Staff or wand (lowered by 6 pixels)
      ctx.translate(centerX + 18, centerY + 14 - bobY);
      ctx.rotate(30 * Math.PI / 180);
      this.drawRect(ctx, -2, -18, 4, 20, palette.accent);
      this.drawRect(ctx, -1, -18, 2, 20, palette.primary);
      // Orb at top
      ctx.beginPath();
      ctx.arc(0, -18, 4, 0, Math.PI * 2);
      ctx.fillStyle = palette.accent;
      ctx.fill();
    } else if (role === 'tank') {
      // Shield (lowered by 6 pixels)
      ctx.translate(centerX - 20, centerY + 14 - bobY);
      this.drawRect(ctx, -8, -12, 16, 16, palette.secondary);
      this.drawRect(ctx, -6, -10, 12, 12, palette.primary);
      // Shield emblem
      this.drawRect(ctx, -3, -6, 6, 8, palette.accent);
    } else if (role === 'pet') {
      // Claws or energy (lowered by 6 pixels)
      ctx.translate(centerX + 18, centerY + 14 - bobY);
      this.drawRect(ctx, -3, -8, 2, 8, palette.accent);
      this.drawRect(ctx, 1, -8, 2, 8, palette.accent);
    } else {
      // Default weapon (gun) (lowered by 6 pixels)
      const gunX = centerX + 16 - weaponRecoil;
      const gunY = centerY + 12 - bobY;
      this.drawRect(ctx, gunX, gunY, 10, 4, palette.secondary);
      this.drawRect(ctx, gunX, gunY + 1, 8, 2, palette.primary);
      this.drawRect(ctx, gunX - 4, gunY, 4, 4, palette.accent);
      
      // Muzzle flash during attack
      if (animState === 'attack' && weaponRecoil > 0) {
        ctx.fillStyle = palette.accent;
        ctx.globalAlpha = 0.8;
        this.drawRect(ctx, gunX - 8, gunY - 2, 6, 8, palette.accent);
        ctx.globalAlpha = 1;
      }
    }
    
    ctx.restore();
  }

  /**
   * Draw wings (for pets or special heroes)
   */
  drawWings(ctx, centerX, centerY, bobY, wingFlap, hero, palette) {
    // Left wing
    this.drawRect(ctx, centerX - 20, centerY - 8 - bobY + wingFlap, 8, 14, palette.accent);
    this.drawRect(ctx, centerX - 18, centerY - 6 - bobY + wingFlap, 6, 10, palette.primary);
    this.drawRect(ctx, centerX - 16, centerY - 4 - bobY + wingFlap, 4, 6, palette.secondary);
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.SGCType1Renderer = SGCType1Renderer;
}

