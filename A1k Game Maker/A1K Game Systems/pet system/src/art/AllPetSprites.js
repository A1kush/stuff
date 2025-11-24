// src/art/AllPetSprites.js
// All 13 chibi candy-style pet sprites - cute, round, kawaii aesthetic!

const CANDY_PALETTE = {
  // Shared cute colors
  white: '#ffffff',
  black: '#1a1a1a',
  pink: '#ff69b4',
  
  // Eye colors
  eyeWhite: '#ffffff',
  eyeBlack: '#000000',
  eyeSparkle: 'rgba(255, 255, 255, 0.8)',
};

export class AllPetSprites {
  // 1. FIRE CUB - Cute fire puppy (28px tall)
  renderFireCub(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 6) * 4;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 28;
    const headSize = size * 0.6;
    const bodySize = size * 0.4;

    // Body (round)
    ctx.fillStyle = elementColor || '#ff6b35';
    ctx.shadowColor = secondaryColor || '#ffff00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -bodySize / 2, bodySize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Head (big and round)
    ctx.fillStyle = elementColor || '#ff6b35';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize / 2, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Ears (flame-shaped)
    ctx.fillStyle = secondaryColor || '#ffff00';
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.6, -bodySize - headSize);
    ctx.lineTo(-headSize * 0.7, -bodySize - headSize - 8);
    ctx.lineTo(-headSize * 0.4, -bodySize - headSize - 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headSize * 0.6, -bodySize - headSize);
    ctx.lineTo(headSize * 0.7, -bodySize - headSize - 8);
    ctx.lineTo(headSize * 0.4, -bodySize - headSize - 5);
    ctx.closePath();
    ctx.fill();

    // Big eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize / 2, headSize * 0.3, 0, Math.PI * 2);
    ctx.arc(headSize * 0.3, -bodySize - headSize / 2, headSize * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = CANDY_PALETTE.eyeBlack;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize / 2, headSize * 0.15, 0, Math.PI * 2);
    ctx.arc(headSize * 0.3, -bodySize - headSize / 2, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Eye sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.35, -bodySize - headSize / 2 - 2, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize / 2 - 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute nose
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize / 2 + 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // Flame tail
    ctx.fillStyle = secondaryColor || '#ffff00';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(bodySize * 0.8, -bodySize / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // 2. FLAME SPIRIT - Ethereal fire spirit (30px tall)
  renderFlameSpirit(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5) * 5;
    const flicker = Math.sin(time * 12) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 30;

    // Ethereal glow
    ctx.fillStyle = elementColor || '#ff6b35';
    ctx.shadowColor = secondaryColor || '#ff4444';
    ctx.shadowBlur = 25;
    ctx.globalAlpha = 0.6 * flicker;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Core body (wispy)
    ctx.fillStyle = elementColor || '#ff6b35';
    ctx.beginPath();
    ctx.arc(0, -size * 0.4, size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Face area (bright)
    ctx.fillStyle = secondaryColor || '#ff4444';
    ctx.beginPath();
    ctx.arc(0, -size * 0.6, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glowing eyes
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.6, 3, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.6, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Flame wisps
    for (let i = 0; i < 3; i++) {
      const angle = (time * 2 + i * Math.PI * 0.66) % (Math.PI * 2);
      const wispX = Math.cos(angle) * size * 0.5;
      const wispY = -size * 0.5 + Math.sin(angle) * size * 0.3;
      
      ctx.fillStyle = secondaryColor || '#ff4444';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(wispX, wispY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // 3. ICE WOLF - Cute ice puppy (32px tall)
  renderIceWolf(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5.5) * 3.5;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 32;
    const headSize = size * 0.55;
    const bodySize = size * 0.45;

    // Body
    ctx.fillStyle = elementColor || '#87ceeb';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize / 2, bodySize * 0.9, bodySize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = secondaryColor || '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.6, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Wolf ears (pointed, icy)
    ctx.fillStyle = elementColor || '#87ceeb';
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.5, -bodySize - headSize);
    ctx.lineTo(-headSize * 0.6, -bodySize - headSize - 10);
    ctx.lineTo(-headSize * 0.35, -bodySize - headSize - 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headSize * 0.5, -bodySize - headSize);
    ctx.lineTo(headSize * 0.6, -bodySize - headSize - 10);
    ctx.lineTo(headSize * 0.35, -bodySize - headSize - 6);
    ctx.closePath();
    ctx.fill();

    // Big eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.28, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (icy blue)
    ctx.fillStyle = elementColor || '#87ceeb';
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.12, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.65, 1.5, 0, Math.PI * 2);
    ctx.arc(headSize * 0.2, -bodySize - headSize * 0.65, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#4169e1';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Ice crystals floating around
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 3; i++) {
      const angle = time * 3 + i * Math.PI * 0.66;
      const crystalX = Math.cos(angle) * headSize;
      const crystalY = -bodySize - headSize * 0.5 + Math.sin(angle) * headSize * 0.5;
      ctx.fillRect(crystalX - 2, crystalY - 2, 4, 4);
    }

    ctx.restore();
  }

  // 4. FROST WOLF - Larger ice wolf (34px tall)
  renderFrostWolf(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5) * 3;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 34;
    const headSize = size * 0.58;
    const bodySize = size * 0.42;

    // Frost aura
    ctx.fillStyle = 'rgba(176, 224, 230, 0.3)';
    ctx.shadowColor = secondaryColor || '#b0e0e6';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body
    ctx.fillStyle = secondaryColor || '#b0e0e6';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize / 2, bodySize, bodySize * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = elementColor || '#87ceeb';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.65, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Alpha ears (larger)
    ctx.fillStyle = secondaryColor || '#b0e0e6';
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.5, -bodySize - headSize * 0.95);
    ctx.lineTo(-headSize * 0.65, -bodySize - headSize - 12);
    ctx.lineTo(-headSize * 0.3, -bodySize - headSize - 7);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headSize * 0.5, -bodySize - headSize * 0.95);
    ctx.lineTo(headSize * 0.65, -bodySize - headSize - 12);
    ctx.lineTo(headSize * 0.3, -bodySize - headSize - 7);
    ctx.closePath();
    ctx.fill();

    // Big eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.28, -bodySize - headSize * 0.65, headSize * 0.3, 0, Math.PI * 2);
    ctx.arc(headSize * 0.28, -bodySize - headSize * 0.65, headSize * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (ice blue)
    ctx.fillStyle = '#00bfff';
    ctx.beginPath();
    ctx.arc(-headSize * 0.28, -bodySize - headSize * 0.65, headSize * 0.14, 0, Math.PI * 2);
    ctx.arc(headSize * 0.28, -bodySize - headSize * 0.65, headSize * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.33, -bodySize - headSize * 0.7, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.23, -bodySize - headSize * 0.7, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 5. LIGHTNING BIRD - Electric bird (26px tall)
  renderLightningBird(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 8) * 6;
    const wingFlap = Math.sin(time * 15) * 0.3;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 26;
    const headSize = size * 0.55;
    const bodySize = size * 0.45;

    // Electric aura
    ctx.strokeStyle = elementColor || '#ffff00';
    ctx.lineWidth = 2;
    ctx.shadowColor = elementColor || '#ffff00';
    ctx.shadowBlur = 15;
    for (let i = 0; i < 4; i++) {
      const angle = time * 5 + i * Math.PI / 2;
      const boltX = Math.cos(angle) * size * 0.6;
      const boltY = -size / 2 + Math.sin(angle) * size * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(boltX, boltY);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Body (round bird)
    ctx.fillStyle = secondaryColor || '#00ffff';
    ctx.beginPath();
    ctx.arc(0, -bodySize / 2, bodySize * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = elementColor || '#ffff00';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.5, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(0, -bodySize - headSize * 0.4);
    ctx.lineTo(headSize * 0.3, -bodySize - headSize * 0.45);
    ctx.lineTo(0, -bodySize - headSize * 0.5);
    ctx.closePath();
    ctx.fill();

    // Big eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.5, headSize * 0.32, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.5, headSize * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = CANDY_PALETTE.eyeBlack;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.5, headSize * 0.14, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.5, headSize * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.55, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.2, -bodySize - headSize * 0.55, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wings (simple, flapping)
    ctx.fillStyle = secondaryColor || '#00ffff';
    ctx.globalAlpha = 0.7;
    ctx.save();
    ctx.rotate(wingFlap);
    ctx.beginPath();
    ctx.ellipse(-bodySize * 0.8, -bodySize / 2, bodySize * 0.6, bodySize * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.save();
    ctx.rotate(-wingFlap);
    ctx.beginPath();
    ctx.ellipse(bodySize * 0.8, -bodySize / 2, bodySize * 0.6, bodySize * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // 6. EARTH GOLEM - Rock creature (35px tall)
  renderEarthGolem(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 3) * 2;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 35;
    const headSize = size * 0.5;
    const bodySize = size * 0.5;

    // Body (rocky, chunky)
    ctx.fillStyle = elementColor || '#8b4513';
    ctx.fillRect(-bodySize / 2, -bodySize, bodySize, bodySize);

    // Rock texture
    ctx.fillStyle = '#654321';
    ctx.fillRect(-bodySize / 4, -bodySize + 5, bodySize / 2.5, bodySize / 3);
    ctx.fillRect(-bodySize * 0.4, -bodySize / 2, bodySize / 3, bodySize / 4);

    // Head (round rock)
    ctx.fillStyle = elementColor || '#8b4513';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize / 2, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Moss (green accent)
    ctx.fillStyle = secondaryColor || '#4CAF50';
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.3, headSize * 0.2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.4, -bodySize - headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Big friendly eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize / 2, headSize * 0.25, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize / 2, headSize * 0.25, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = secondaryColor || '#4CAF50';
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize / 2, headSize * 0.12, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize / 2, headSize * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.55, 1.5, 0, Math.PI * 2);
    ctx.arc(headSize * 0.2, -bodySize - headSize * 0.55, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Arms (stubby)
    ctx.fillStyle = elementColor || '#8b4513';
    ctx.fillRect(-bodySize * 0.7, -bodySize + 8, bodySize * 0.25, bodySize / 3);
    ctx.fillRect(bodySize * 0.45, -bodySize + 8, bodySize * 0.25, bodySize / 3);

    ctx.restore();
  }

  // 7. AIR SPRITE - Wispy wind spirit (24px tall)
  renderAirSprite(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 7) * 5;
    const sway = Math.sin(time * 4) * 3;

    ctx.save();
    ctx.translate(x + sway, y + bobOffset);

    const size = 24;

    // Wispy trails
    ctx.fillStyle = 'rgba(135, 206, 235, 0.2)';
    for (let i = 0; i < 4; i++) {
      const trailY = -size * 0.3 + i * 6;
      ctx.fillRect(-size * 0.6, trailY, size * 1.2, 3);
    }

    // Core body (very round and light)
    ctx.fillStyle = elementColor || '#87ceeb';
    ctx.shadowColor = secondaryColor || '#e0f7fa';
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Face (bright center)
    ctx.fillStyle = secondaryColor || '#e0f7fa';
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Big kawaii eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.5, size * 0.18, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.5, size * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#4682b4';
    ctx.beginPath();
    ctx.arc(-size * 0.15, -size * 0.5, size * 0.08, 0, Math.PI * 2);
    ctx.arc(size * 0.15, -size * 0.5, size * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-size * 0.18, -size * 0.53, 1.5, 0, Math.PI * 2);
    ctx.arc(size * 0.12, -size * 0.53, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Wind swirls
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
      const angle = time * 6 + i * Math.PI;
      const swirl = size * 0.7;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * swirl, -size * 0.5 + Math.sin(angle) * swirl * 0.5, 3, 0, Math.PI);
      ctx.stroke();
    }

    ctx.restore();
  }

  // 8. MAGIC MONKEY - Chibi monkey (30px tall)
  renderMagicMonkey(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 6) * 4;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 30;
    const headSize = size * 0.6;
    const bodySize = size * 0.4;

    // Arcane aura
    ctx.fillStyle = 'rgba(155, 89, 182, 0.2)';
    ctx.shadowColor = secondaryColor || '#ff6b9d';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body
    ctx.fillStyle = elementColor || '#9b59b6';
    ctx.beginPath();
    ctx.arc(0, -bodySize / 2, bodySize, 0, Math.PI * 2);
    ctx.fill();

    // Head (big round monkey head)
    ctx.fillStyle = secondaryColor || '#ff6b9d';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.5, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Ears (round)
    ctx.fillStyle = elementColor || '#9b59b6';
    ctx.beginPath();
    ctx.arc(-headSize * 0.7, -bodySize - headSize * 0.5, headSize * 0.3, 0, Math.PI * 2);
    ctx.arc(headSize * 0.7, -bodySize - headSize * 0.5, headSize * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Face area (lighter)
    ctx.fillStyle = '#e1bee7';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize - headSize * 0.4, headSize * 0.55, headSize * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Big eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.22, -bodySize - headSize * 0.45, headSize * 0.28, 0, Math.PI * 2);
    ctx.arc(headSize * 0.22, -bodySize - headSize * 0.45, headSize * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = CANDY_PALETTE.eyeBlack;
    ctx.beginPath();
    ctx.arc(-headSize * 0.22, -bodySize - headSize * 0.45, headSize * 0.13, 0, Math.PI * 2);
    ctx.arc(headSize * 0.22, -bodySize - headSize * 0.45, headSize * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.27, -bodySize - headSize * 0.5, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.17, -bodySize - headSize * 0.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Magic staff (tiny)
    ctx.strokeStyle = secondaryColor || '#ff6b9d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bodySize * 0.6, -bodySize / 2);
    ctx.lineTo(bodySize * 0.6, -bodySize / 2 - 12);
    ctx.stroke();
    
    // Staff orb
    ctx.fillStyle = elementColor || '#9b59b6';
    ctx.shadowColor = elementColor || '#9b59b6';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(bodySize * 0.6, -bodySize / 2 - 15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // 9. MAGIC FROG - Cute frog (22px tall)
  renderMagicFrog(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 7) * 3;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 22;
    const headSize = size * 0.7;
    const bodySize = size * 0.3;

    // Body (small, frog sitting pose)
    ctx.fillStyle = elementColor || '#9b59b6';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize / 2, bodySize * 1.2, bodySize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (huge, typical frog)
    ctx.fillStyle = secondaryColor || '#ba68c8';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.4, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Frog bumps (texture)
    ctx.fillStyle = elementColor || '#9b59b6';
    ctx.beginPath();
    ctx.arc(-headSize * 0.4, -bodySize - headSize * 0.3, headSize * 0.12, 0, Math.PI * 2);
    ctx.arc(headSize * 0.4, -bodySize - headSize * 0.5, headSize * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // HUGE eyes (frog characteristic)
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.5, headSize * 0.35, 0, Math.PI * 2);
    ctx.arc(headSize * 0.3, -bodySize - headSize * 0.5, headSize * 0.35, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (big and round)
    ctx.fillStyle = CANDY_PALETTE.eyeBlack;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.5, headSize * 0.18, 0, Math.PI * 2);
    ctx.arc(headSize * 0.3, -bodySize - headSize * 0.5, headSize * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.35, -bodySize - headSize * 0.55, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.55, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute mouth
    ctx.strokeStyle = '#7b1fa2';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.3, headSize * 0.3, 0, Math.PI);
    ctx.stroke();

    // Magic sparkles around
    ctx.fillStyle = secondaryColor || '#ba68c8';
    for (let i = 0; i < 4; i++) {
      const angle = time * 4 + i * Math.PI / 2;
      const sparkleX = Math.cos(angle) * headSize * 1.1;
      const sparkleY = -bodySize - headSize * 0.5 + Math.sin(angle) * headSize * 0.6;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // 10. GREMLIN - Dark creature (25px tall)
  renderGremlin(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 6.5) * 3.5;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 25;
    const headSize = size * 0.6;
    const bodySize = size * 0.4;

    // Dark aura
    ctx.fillStyle = 'rgba(44, 62, 80, 0.3)';
    ctx.shadowColor = secondaryColor || '#c0392b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body
    ctx.fillStyle = elementColor || '#2c3e50';
    ctx.beginPath();
    ctx.arc(0, -bodySize / 2, bodySize * 0.95, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = secondaryColor || '#c0392b';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize / 2, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Horns (small devil horns)
    ctx.fillStyle = elementColor || '#2c3e50';
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.5, -bodySize - headSize * 0.8);
    ctx.lineTo(-headSize * 0.6, -bodySize - headSize - 7);
    ctx.lineTo(-headSize * 0.4, -bodySize - headSize - 5);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headSize * 0.5, -bodySize - headSize * 0.8);
    ctx.lineTo(headSize * 0.6, -bodySize - headSize - 7);
    ctx.lineTo(headSize * 0.4, -bodySize - headSize - 5);
    ctx.closePath();
    ctx.fill();

    // Mischievous eyes
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize / 2, headSize * 0.2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize / 2, headSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // White sparkles in eyes
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.28, -bodySize - headSize * 0.55, 1.5, 0, Math.PI * 2);
    ctx.arc(headSize * 0.22, -bodySize - headSize * 0.55, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Grin
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.3, headSize * 0.35, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  // 11. MISSY SPIRIT - Legendary light pet (33px tall)
  renderMissySpirit(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 4) * 4;
    const pulse = Math.sin(time * 3) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 33;
    const headSize = size * 0.62;
    const bodySize = size * 0.38;

    // Legendary aura
    ctx.fillStyle = 'rgba(241, 196, 15, 0.2)';
    ctx.shadowColor = elementColor || '#f1c40f';
    ctx.shadowBlur = 25 * pulse;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body (glowing)
    ctx.fillStyle = secondaryColor || '#fff5e1';
    ctx.beginPath();
    ctx.arc(0, -bodySize / 2, bodySize * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = elementColor || '#f1c40f';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.6, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Crown/halo
    ctx.strokeStyle = secondaryColor || '#fff5e1';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = elementColor || '#f1c40f';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize - 5, headSize * 0.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Stars on crown
    ctx.fillStyle = secondaryColor || '#fff5e1';
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const starX = Math.cos(angle) * headSize * 0.6;
      const starY = -bodySize - headSize - 5 + Math.sin(angle) * headSize * 0.6;
      this.drawStar(ctx, starX, starY, 3, 5, 2);
    }

    // Big beautiful eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.32, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.32, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (golden)
    ctx.fillStyle = elementColor || '#f1c40f';
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.3, -bodySize - headSize * 0.65, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.2, -bodySize - headSize * 0.65, 2, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.strokeStyle = '#ffb74d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.45, headSize * 0.3, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.restore();
  }

  // 12. ROBOT DRONE - Hexagon drone (26px tall)
  renderRobotDrone(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5) * 5;
    const rotate = time * 0.5;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 26;

    // Tech aura
    ctx.strokeStyle = secondaryColor || '#00d4ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = secondaryColor || '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Hexagon body (rotating)
    ctx.save();
    ctx.rotate(rotate);
    ctx.fillStyle = elementColor || '#74b9ff';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * size * 0.45;
      const py = -size / 2 + Math.sin(angle) * size * 0.45;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Hexagon outline
    ctx.strokeStyle = secondaryColor || '#00d4ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Core (glowing center)
    ctx.fillStyle = secondaryColor || '#00d4ff';
    ctx.shadowColor = secondaryColor || '#00d4ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Scanner eye
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Propeller blades (4)
    ctx.save();
    ctx.rotate(-rotate * 2);
    ctx.strokeStyle = 'rgba(116, 185, 255, 0.6)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(Math.cos(angle) * size * 0.7, -size / 2 + Math.sin(angle) * size * 0.7);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  // 13. TIGER PET - Cute chibi tiger (30px tall)
  renderTigerPet(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5.5) * 3.5;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 30;
    const headSize = size * 0.58;
    const bodySize = size * 0.42;

    // Golden aura
    ctx.fillStyle = 'rgba(255, 213, 106, 0.25)';
    ctx.shadowColor = secondaryColor || '#ffd56a';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body (tiger orange)
    ctx.fillStyle = elementColor || '#ff8c00';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize / 2, bodySize * 1.1, bodySize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiger stripes on body
    ctx.fillStyle = '#1a1a1a';
    for (let i = 0; i < 2; i++) {
      ctx.fillRect(-bodySize * 0.4 + i * bodySize * 0.5, -bodySize + 3, bodySize * 0.15, bodySize / 2);
    }

    // Head
    ctx.fillStyle = elementColor || '#ff8c00';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.6, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Tiger ears (rounded)
    ctx.fillStyle = elementColor || '#ff8c00';
    ctx.beginPath();
    ctx.arc(-headSize * 0.6, -bodySize - headSize, headSize * 0.3, 0, Math.PI * 2);
    ctx.arc(headSize * 0.6, -bodySize - headSize, headSize * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Ear inner (black)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(-headSize * 0.6, -bodySize - headSize, headSize * 0.15, 0, Math.PI * 2);
    ctx.arc(headSize * 0.6, -bodySize - headSize, headSize * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Face markings (white)
    ctx.fillStyle = '#fff5e1';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize - headSize * 0.5, headSize * 0.55, headSize * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tiger stripes on face
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.3, -bodySize - headSize * 0.7);
      ctx.lineTo(side * headSize * 0.5, -bodySize - headSize * 0.75);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(side * headSize * 0.2, -bodySize - headSize * 0.5);
      ctx.lineTo(side * headSize * 0.45, -bodySize - headSize * 0.55);
      ctx.stroke();
    }

    // Big golden eyes
    ctx.fillStyle = CANDY_PALETTE.eyeWhite;
    ctx.beginPath();
    ctx.arc(-headSize * 0.22, -bodySize - headSize * 0.6, headSize * 0.28, 0, Math.PI * 2);
    ctx.arc(headSize * 0.22, -bodySize - headSize * 0.6, headSize * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (golden)
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(-headSize * 0.22, -bodySize - headSize * 0.6, headSize * 0.13, 0, Math.PI * 2);
    ctx.arc(headSize * 0.22, -bodySize - headSize * 0.6, headSize * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // Sparkles
    ctx.fillStyle = CANDY_PALETTE.eyeSparkle;
    ctx.beginPath();
    ctx.arc(-headSize * 0.27, -bodySize - headSize * 0.65, 2, 0, Math.PI * 2);
    ctx.arc(headSize * 0.17, -bodySize - headSize * 0.65, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.moveTo(0, -bodySize - headSize * 0.45);
    ctx.lineTo(-3, -bodySize - headSize * 0.4);
    ctx.lineTo(3, -bodySize - headSize * 0.4);
    ctx.closePath();
    ctx.fill();

    // Cute tail (golden)
    ctx.strokeStyle = secondaryColor || '#ffd56a';
    ctx.lineWidth = 3;
    ctx.shadowColor = secondaryColor || '#ffd56a';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bodySize * 0.9, -bodySize / 2, 8, Math.PI, 0);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // Continue with remaining render methods that were referenced but not implemented above
  // The methods renderLightningBird, renderEarthGolem, renderAirSprite are already implemented above
  
  // 14. DARK MISSY - Dark angel cat (34px tall)
  renderDarkMissy(ctx, x, y, state) {
    const { animTime, elementColor, secondaryColor } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 5) * 3.5;
    const wingFlap = Math.sin(time * 6) * 0.15;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const size = 34;
    const headSize = size * 0.6;
    const bodySize = size * 0.4;

    // Dark aura with pink accents
    ctx.fillStyle = 'rgba(44, 44, 62, 0.3)';
    ctx.shadowColor = secondaryColor || '#ff69b4';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(0, -size / 2, size * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body (dark cat)
    ctx.fillStyle = elementColor || '#2c2c3e';
    ctx.beginPath();
    ctx.ellipse(0, -bodySize / 2, bodySize * 0.9, bodySize, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head (round cat head)
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.6, headSize, 0, Math.PI * 2);
    ctx.fill();

    // Cat ears (pointed)
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.moveTo(-headSize * 0.5, -bodySize - headSize * 0.85);
    ctx.lineTo(-headSize * 0.55, -bodySize - headSize - 10);
    ctx.lineTo(-headSize * 0.35, -bodySize - headSize - 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headSize * 0.5, -bodySize - headSize * 0.85);
    ctx.lineTo(headSize * 0.55, -bodySize - headSize - 10);
    ctx.lineTo(headSize * 0.35, -bodySize - headSize - 6);
    ctx.closePath();
    ctx.fill();

    // Glowing HALO above head
    ctx.strokeStyle = '#ff8c00';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ff8c00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize - 8, headSize * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Pink WING (single, left side)
    ctx.save();
    ctx.translate(-headSize * 0.7, -bodySize - headSize * 0.4);
    ctx.rotate(wingFlap - 0.3);
    ctx.fillStyle = secondaryColor || '#ff69b4';
    ctx.globalAlpha = 0.7;
    ctx.shadowColor = secondaryColor || '#ff69b4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    // Wing shape
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-18, -10, -15, -25);
    ctx.quadraticCurveTo(-8, -20, -5, -15);
    ctx.quadraticCurveTo(-10, -8, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();

    // Glowing green EYES
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.18, 0, Math.PI * 2);
    ctx.arc(headSize * 0.25, -bodySize - headSize * 0.6, headSize * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Black pupils (cat-like slits)
    ctx.fillStyle = CANDY_PALETTE.eyeBlack;
    ctx.fillRect(-headSize * 0.25 - 1, -bodySize - headSize * 0.65, 2, headSize * 0.12);
    ctx.fillRect(headSize * 0.25 - 1, -bodySize - headSize * 0.65, 2, headSize * 0.12);

    // SWORD (right hand/paw)
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bodySize * 0.5, -bodySize / 2);
    ctx.lineTo(bodySize * 0.7, -bodySize / 2 - 12);
    ctx.stroke();
    
    // Sword blade glow
    ctx.strokeStyle = '#87ceeb';
    ctx.shadowColor = '#87ceeb';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bodySize * 0.5, -bodySize / 2);
    ctx.lineTo(bodySize * 0.7, -bodySize / 2 - 12);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // GUN (left hand/paw)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(-bodySize * 0.7, -bodySize / 2 - 4, 8, 4);
    
    // Gun muzzle glow
    ctx.fillStyle = '#ff6b35';
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-bodySize * 0.7 - 8, -bodySize / 2 - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cute nose
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(0, -bodySize - headSize * 0.48, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cat tail (dark, pointed)
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bodySize * 0.6, -bodySize / 2);
    ctx.quadraticCurveTo(bodySize * 0.9, -bodySize / 2 + 8, bodySize * 0.8, 2);
    ctx.stroke();

    ctx.restore();
  }

  // Helper: Draw a star
  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  // Helper method to render any pet by ID
  renderPet(ctx, petId, x, y, state) {
    const renderMap = {
      'pet_firecub': this.renderFireCub,
      'pet_flame_spirit': this.renderFlameSpirit,
      'pet_icewolf': this.renderIceWolf,
      'pet_frost_wolf': this.renderFrostWolf,
      'pet_lightningbird': this.renderLightningBird,
      'pet_earthgolem': this.renderEarthGolem,
      'pet_airsprite': this.renderAirSprite,
      'pet_magic_monkey': this.renderMagicMonkey,
      'pet_magicfrog': this.renderMagicFrog,
      'pet_gremlin': this.renderGremlin,
      'pet_missy': this.renderMissySpirit,
      'summon_robot_drone': this.renderRobotDrone,
      'summon_tiger_pet': this.renderTigerPet,
      'pet_dark_missy': this.renderDarkMissy,
    };

    const renderFn = renderMap[petId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
      return true;
    }
    return false;
  }
}

