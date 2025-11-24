// 🎨 ENEMY SPRITES V2 - ALGORITHMIC GENERATIVE ART
// Programmatic sprite generation with physical limb structure
// Vector geometry + code-based lighting + mathematical motion
// No overlays/filters - pure geometric rendering with transparent backgrounds

// ═══════════════════════════════════════════════════════════════════════════
// NEON ALGORITHMIC PALETTE
// ═══════════════════════════════════════════════════════════════════════════
const NEON_PALETTE = {
  cyan: { base: '#00ffff', bright: '#66ffff', dark: '#0099aa', shadow: '#004455' },
  purple: { base: '#aa00ff', bright: '#dd66ff', dark: '#660099', shadow: '#330044' },
  crimson: { base: '#ff0055', bright: '#ff6688', dark: '#990033', shadow: '#440011' },
  gold: { base: '#ffaa00', bright: '#ffcc66', dark: '#aa6600', shadow: '#553300' },
  emerald: { base: '#00ff88', bright: '#66ffaa', dark: '#009955', shadow: '#004422' },
  azure: { base: '#0088ff', bright: '#66aaff', dark: '#005599', shadow: '#002244' },
  magenta: { base: '#ff00ff', bright: '#ff66ff', dark: '#990099', shadow: '#440044' },
  lime: { base: '#88ff00', bright: '#aaff66', dark: '#559900', shadow: '#224400' },
};

// Element to color mapping
const ELEMENT_COLORS = {
  fire: 'crimson',
  ice: 'cyan',
  lightning: 'gold',
  nature: 'emerald',
  dark: 'purple',
  light: 'gold',
  neutral: 'azure',
  tech: 'cyan',
  fusion: 'magenta',
  earth: 'lime',
  wind: 'azure',
};

// ═══════════════════════════════════════════════════════════════════════════
// MATHEMATICAL UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
const MathUtils = {
  // Sine wave motion for smooth animation
  wave: (time, frequency = 1, amplitude = 1, phase = 0) => {
    return Math.sin(time * frequency + phase) * amplitude;
  },
  
  // Cosine wave for complementary motion
  cowave: (time, frequency = 1, amplitude = 1, phase = 0) => {
    return Math.cos(time * frequency + phase) * amplitude;
  },
  
  // Smooth step interpolation
  smoothstep: (t) => {
    return t * t * (3 - 2 * t);
  },
  
  // Lerp between values
  lerp: (a, b, t) => {
    return a + (b - a) * t;
  },
  
  // 2D rotation
  rotate2D: (x, y, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos - y * sin,
      y: x * sin + y * cos
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CODE-BASED LIGHTING SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
class CodeLighting {
  // Apply rim lighting (highlight edges)
  static applyRimLight(ctx, x, y, width, height, color, intensity = 0.3) {
    const gradient = ctx.createLinearGradient(x - width/2, y, x + width/2, y);
    gradient.addColorStop(0, color.bright + Math.floor(intensity * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(0.2, color.base + '00');
    gradient.addColorStop(0.8, color.base + '00');
    gradient.addColorStop(1, color.bright + Math.floor(intensity * 255).toString(16).padStart(2, '0'));
    return gradient;
  }
  
  // Apply core lighting (center glow)
  static applyCoreLight(ctx, x, y, radius, color, intensity = 1) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color.bright);
    gradient.addColorStop(0.4, color.base);
    gradient.addColorStop(0.7, color.dark);
    gradient.addColorStop(1, color.shadow + Math.floor(intensity * 128).toString(16).padStart(2, '0'));
    return gradient;
  }
  
  // Apply volumetric lighting (depth)
  static applyVolumetricLight(ctx, x, y, width, height, color, lightAngle = -Math.PI / 4) {
    const dx = Math.cos(lightAngle) * width;
    const dy = Math.sin(lightAngle) * height;
    const gradient = ctx.createLinearGradient(x - dx, y - dy, x + dx, y + dy);
    gradient.addColorStop(0, color.bright);
    gradient.addColorStop(0.5, color.base);
    gradient.addColorStop(1, color.dark);
    return gradient;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LIMB STRUCTURE SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
class LimbStructure {
  constructor(color) {
    this.color = NEON_PALETTE[color] || NEON_PALETTE.cyan;
  }
  
  // Render articulated arm with proper joints
  renderArm(ctx, x, y, angle, length, thickness, time, side = 1) {
    const upperLength = length * 0.55;
    const lowerLength = length * 0.45;
    const elbowBend = MathUtils.wave(time, 8, 0.4) * side;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Upper arm
    ctx.strokeStyle = this.color.base;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(upperLength, 0);
    ctx.stroke();
    
    // Shoulder joint
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, 0, 0, thickness * 0.8, this.color, 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, thickness * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Elbow joint
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, upperLength, 0, thickness * 0.6, this.color, 0.6);
    ctx.beginPath();
    ctx.arc(upperLength, 0, thickness * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Lower arm (forearm)
    ctx.translate(upperLength, 0);
    ctx.rotate(elbowBend);
    ctx.strokeStyle = this.color.base;
    ctx.lineWidth = thickness * 0.85;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(lowerLength, 0);
    ctx.stroke();
    
    // Hand
    ctx.fillStyle = this.color.bright;
    ctx.beginPath();
    ctx.arc(lowerLength, 0, thickness * 0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  // Render articulated leg with proper joints
  renderLeg(ctx, x, y, angle, length, thickness, time, side = 1, walking = true) {
    const upperLength = length * 0.5;
    const lowerLength = length * 0.5;
    const kneeBend = walking ? MathUtils.wave(time, 6, 0.5, side * Math.PI) : 0.3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Thigh
    ctx.strokeStyle = this.color.base;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, upperLength);
    ctx.stroke();
    
    // Hip joint
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, 0, 0, thickness * 0.8, this.color, 0.8);
    ctx.beginPath();
    ctx.arc(0, 0, thickness * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Knee joint
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, 0, upperLength, thickness * 0.7, this.color, 0.7);
    ctx.beginPath();
    ctx.arc(0, upperLength, thickness * 0.65, 0, Math.PI * 2);
    ctx.fill();
    
    // Shin/Calf
    ctx.translate(0, upperLength);
    ctx.rotate(kneeBend);
    ctx.strokeStyle = this.color.base;
    ctx.lineWidth = thickness * 0.9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, lowerLength);
    ctx.stroke();
    
    // Foot
    ctx.translate(0, lowerLength);
    ctx.fillStyle = this.color.bright;
    ctx.beginPath();
    ctx.ellipse(thickness * 0.5, 0, thickness * 0.8, thickness * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  // Render torso with volumetric lighting
  renderTorso(ctx, x, y, width, height, time) {
    const breathe = MathUtils.wave(time, 3, 0.05, 0);
    const scale = 1 + breathe;
    
    ctx.save();
    ctx.translate(x, y);
    
    // Main body with volumetric lighting
    ctx.fillStyle = CodeLighting.applyVolumetricLight(ctx, 0, 0, width * scale, height * scale, this.color);
    ctx.beginPath();
    ctx.ellipse(0, 0, width * scale, height * scale, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Rim lighting
    ctx.strokeStyle = this.color.bright;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Core energy center
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, 0, height * 0.2, width * 0.4, this.color, 1);
    ctx.beginPath();
    ctx.arc(0, height * 0.2, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
  
  // Render head with facial features
  renderHead(ctx, x, y, size, time, expression = 'neutral') {
    const headBob = MathUtils.wave(time, 5, size * 0.05);
    
    ctx.save();
    ctx.translate(x, y + headBob);
    
    // Head sphere with lighting
    ctx.fillStyle = CodeLighting.applyCoreLight(ctx, 0, 0, size, this.color, 1);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Rim highlight
    ctx.strokeStyle = this.color.bright;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(-size * 0.3, -size * 0.3, size * 0.9, 0, Math.PI);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // Eyes
    const eyeGlow = 0.8 + MathUtils.wave(time, 15, 0.2);
    const eyeOffsetX = size * 0.3;
    const eyeOffsetY = size * 0.1;
    const eyeSize = size * 0.15;
    
    // Left eye
    ctx.fillStyle = this.color.bright;
    ctx.shadowColor = this.color.bright;
    ctx.shadowBlur = 8 * eyeGlow;
    ctx.beginPath();
    ctx.arc(-eyeOffsetX, -eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -eyeOffsetY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Eye pupils
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-eyeOffsetX, -eyeOffsetY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.arc(eyeOffsetX, -eyeOffsetY, eyeSize * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PARTICLE FIELD SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
class ParticleField {
  static renderAuraPulse(ctx, x, y, radius, color, time, intensity = 1) {
    const particles = 12;
    const pulse = MathUtils.wave(time, 2, 0.2, 0) + 1;
    
    ctx.save();
    ctx.translate(x, y);
    
    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2 + time;
      const distance = radius * pulse;
      const px = Math.cos(angle) * distance;
      const py = Math.sin(angle) * distance;
      const particleSize = MathUtils.lerp(2, 5, MathUtils.wave(time + i, 3, 0.5, 0) * 0.5 + 0.5);
      
      ctx.fillStyle = color.bright;
      ctx.globalAlpha = intensity * (0.5 + MathUtils.wave(time + i * 0.5, 4, 0.5));
      ctx.beginPath();
      ctx.arc(px, py, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  
  static renderEnergyTrail(ctx, x, y, targetX, targetY, color, time, segments = 8) {
    ctx.save();
    ctx.strokeStyle = color.bright;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.6;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const midX = MathUtils.lerp(x, targetX, t);
      const midY = MathUtils.lerp(y, targetY, t);
      const offset = MathUtils.wave(time + i, 8, 5);
      ctx.lineTo(midX + offset, midY);
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SPRITE RENDERER
// ═══════════════════════════════════════════════════════════════════════════
class EnemySprites {
  /**
   * Render any entity with full limb articulation
   */
  static render(ctx, entity, options = {}) {
    const time = (options.animTime || Date.now()) / 1000;
    const glow = options.glow !== false;
    
    // Determine entity type and delegate
    if (entity.type === 'enemy') {
      this.renderEnemy(ctx, entity, time, glow);
    } else if (entity.type === 'boss') {
      this.renderBoss(ctx, entity, time, glow);
    } else if (entity.type === 'zombie') {
      this.renderZombie(ctx, entity, time, glow);
    } else if (entity.type === 'villain') {
      this.renderVillain(ctx, entity, time, glow);
    } else if (entity.type === 'hero') {
      this.renderHero(ctx, entity, time, glow);
    } else {
      this.renderEnemy(ctx, entity, time, glow);
    }
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // ENEMY RENDERING (Humanoid with limbs)
  // ═════════════════════════════════════════════════════════════════════════
  static renderEnemy(ctx, enemy, time, glow) {
    const colorKey = ELEMENT_COLORS[enemy.element] || 'azure';
    const color = NEON_PALETTE[colorKey];
    const limbs = new LimbStructure(colorKey);
    const size = enemy.size || 32;
    const x = enemy.x;
    const y = enemy.y;
    
    // Side-view alignment offset
    const walkCycle = MathUtils.wave(time, 6, size * 0.1);
    
    ctx.save();
    ctx.translate(x, y + walkCycle);
    
    // Optional aura pulse
    if (glow) {
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.5, size * 1.2, color, time, 0.6);
    }
    
    // Back leg (further from camera)
    limbs.renderLeg(ctx, -size * 0.15, size * 0.3, 0, size * 0.8, size * 0.12, time, -1, true);
    
    // Back arm
    limbs.renderArm(ctx, -size * 0.2, -size * 0.4, Math.PI * 0.1, size * 0.7, size * 0.1, time, -1);
    
    // Torso
    limbs.renderTorso(ctx, 0, -size * 0.3, size * 0.4, size * 0.6, time);
    
    // Front leg (closer to camera)
    limbs.renderLeg(ctx, size * 0.15, size * 0.3, 0, size * 0.8, size * 0.12, time, 1, true);
    
    // Front arm
    limbs.renderArm(ctx, size * 0.2, -size * 0.4, -Math.PI * 0.1, size * 0.7, size * 0.1, time, 1);
    
    // Head
    limbs.renderHead(ctx, 0, -size * 0.9, size * 0.35, time);
    
    ctx.restore();
    
    // Health bar
    this.renderHealthBar(ctx, x, y - size * 1.4, size, enemy.hp, enemy.maxHp, color);
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // BOSS RENDERING (Large entity with enhanced effects)
  // ═════════════════════════════════════════════════════════════════════════
  static renderBoss(ctx, boss, time, glow) {
    const colorKey = ELEMENT_COLORS[boss.element] || 'magenta';
    const color = NEON_PALETTE[colorKey];
    const limbs = new LimbStructure(colorKey);
    const size = boss.size || 64;
    const x = boss.x;
    const y = boss.y;
    
    const pulse = MathUtils.wave(time, 2, 0.1, 0) + 1;
    const hover = MathUtils.wave(time, 3, size * 0.15);
    
    ctx.save();
    ctx.translate(x, y + hover);
    ctx.scale(pulse, pulse);
    
    // Multi-layer aura for boss
    if (glow) {
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.4, size * 1.5, color, time, 1);
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.4, size * 1.2, color, time * 1.5, 0.7);
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.4, size * 0.9, color, time * 2, 0.5);
    }
    
    // Back legs
    limbs.renderLeg(ctx, -size * 0.25, size * 0.2, 0, size * 0.9, size * 0.18, time, -1, false);
    
    // Back arms (multiple for boss)
    limbs.renderArm(ctx, -size * 0.3, -size * 0.5, Math.PI * 0.2, size * 0.9, size * 0.14, time, -1);
    
    // Massive torso
    limbs.renderTorso(ctx, 0, -size * 0.3, size * 0.6, size * 0.8, time);
    
    // Front legs
    limbs.renderLeg(ctx, size * 0.25, size * 0.2, 0, size * 0.9, size * 0.18, time, 1, false);
    
    // Front arms
    limbs.renderArm(ctx, size * 0.3, -size * 0.5, -Math.PI * 0.2, size * 0.9, size * 0.14, time, 1);
    
    // Large head
    limbs.renderHead(ctx, 0, -size * 1.0, size * 0.5, time, 'aggressive');
    
    // Crown/horns effect
    ctx.strokeStyle = color.bright;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      const angle = (i - 2) * 0.4;
      const length = size * (0.3 + Math.abs(i - 2) * 0.1);
      const endX = Math.sin(angle) * length;
      const endY = -size * 1.5 - Math.cos(angle) * length;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.5);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Boss health bar (larger)
    this.renderHealthBar(ctx, x, y - size * 1.8, size * 1.5, boss.hp, boss.maxHp, color);
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // ZOMBIE RENDERING (Shambling motion, decay effects)
  // ═════════════════════════════════════════════════════════════════════════
  static renderZombie(ctx, zombie, time, glow) {
    const color = NEON_PALETTE.emerald; // Green for zombies
    const limbs = new LimbStructure('emerald');
    const size = zombie.size || 32;
    const x = zombie.x;
    const y = zombie.y;
    
    // Shambling motion (slower, jerky)
    const shamble = Math.floor(time * 4) % 2 === 0 ? size * 0.05 : -size * 0.05;
    
    ctx.save();
    ctx.translate(x, y + shamble);
    
    // Decay particle field
    if (glow) {
      ctx.globalAlpha = 0.3;
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.5, size * 1.0, color, time * 0.5, 0.4);
      ctx.globalAlpha = 1;
    }
    
    // Legs (stiff, less articulation)
    limbs.renderLeg(ctx, -size * 0.15, size * 0.3, 0.1, size * 0.7, size * 0.11, time * 0.5, -1, true);
    limbs.renderLeg(ctx, size * 0.15, size * 0.3, -0.1, size * 0.7, size * 0.11, time * 0.5, 1, true);
    
    // Back arm (reaching forward)
    limbs.renderArm(ctx, -size * 0.2, -size * 0.3, -Math.PI * 0.3, size * 0.8, size * 0.09, time * 0.5, -1);
    
    // Hunched torso
    ctx.save();
    ctx.rotate(Math.PI * 0.05); // Lean forward
    limbs.renderTorso(ctx, 0, -size * 0.2, size * 0.35, size * 0.55, time * 0.5);
    ctx.restore();
    
    // Front arm (reaching forward)
    limbs.renderArm(ctx, size * 0.2, -size * 0.3, -Math.PI * 0.35, size * 0.8, size * 0.09, time * 0.5, 1);
    
    // Head (tilted)
    ctx.save();
    ctx.rotate(MathUtils.wave(time, 2, 0.2));
    limbs.renderHead(ctx, 0, -size * 0.8, size * 0.3, time * 0.5);
    ctx.restore();
    
    ctx.restore();
    
    this.renderHealthBar(ctx, x, y - size * 1.3, size, zombie.hp, zombie.maxHp, color);
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // VILLAIN RENDERING (Imposing stance, dramatic effects)
  // ═════════════════════════════════════════════════════════════════════════
  static renderVillain(ctx, villain, time, glow) {
    const colorKey = ELEMENT_COLORS[villain.element] || 'purple';
    const color = NEON_PALETTE[colorKey];
    const limbs = new LimbStructure(colorKey);
    const size = villain.size || 48;
    const x = villain.x;
    const y = villain.y;
    
    const dramatic = MathUtils.wave(time, 1.5, 0.05, 0) + 1;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dramatic, dramatic);
    
    // Dramatic energy field
    if (glow) {
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.6, size * 1.4, color, time, 0.9);
      
      // Energy tendrils
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + time;
        const targetX = Math.cos(angle) * size * 1.2;
        const targetY = -size * 0.6 + Math.sin(angle) * size * 1.2;
        ParticleField.renderEnergyTrail(ctx, 0, -size * 0.6, targetX, targetY, color, time + i, 6);
      }
    }
    
    // Legs (wide stance)
    limbs.renderLeg(ctx, -size * 0.3, size * 0.4, -0.2, size * 0.9, size * 0.16, time, -1, false);
    limbs.renderLeg(ctx, size * 0.3, size * 0.4, 0.2, size * 0.9, size * 0.16, time, 1, false);
    
    // Back arm (crossed or dramatic pose)
    limbs.renderArm(ctx, -size * 0.25, -size * 0.5, Math.PI * 0.3, size * 0.85, size * 0.13, time, -1);
    
    // Larger torso
    limbs.renderTorso(ctx, 0, -size * 0.4, size * 0.5, size * 0.7, time);
    
    // Front arm (pointing or threatening)
    limbs.renderArm(ctx, size * 0.25, -size * 0.5, -Math.PI * 0.4, size * 0.85, size * 0.13, time, 1);
    
    // Menacing head
    limbs.renderHead(ctx, 0, -size * 1.05, size * 0.42, time, 'menacing');
    
    // Cape effect (flowing)
    ctx.fillStyle = color.dark + '66';
    ctx.beginPath();
    ctx.moveTo(-size * 0.3, -size * 0.8);
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const capeX = MathUtils.lerp(-size * 0.3, -size * 0.5, t);
      const capeY = MathUtils.lerp(-size * 0.8, size * 0.6, t);
      const wave = MathUtils.wave(time + i * 0.3, 4, size * 0.1);
      ctx.lineTo(capeX + wave, capeY);
    }
    ctx.lineTo(size * 0.5 + MathUtils.wave(time + 3, 4, size * 0.1), size * 0.6);
    for (let i = 10; i >= 0; i--) {
      const t = i / 10;
      const capeX = MathUtils.lerp(size * 0.3, size * 0.5, t);
      const capeY = MathUtils.lerp(-size * 0.8, size * 0.6, t);
      const wave = MathUtils.wave(time + i * 0.3, 4, size * 0.1);
      ctx.lineTo(capeX + wave, capeY);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
    
    this.renderHealthBar(ctx, x, y - size * 1.6, size * 1.2, villain.hp, villain.maxHp, color);
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // HERO RENDERING (Dynamic pose, heroic effects)
  // ═════════════════════════════════════════════════════════════════════════
  static renderHero(ctx, hero, time, glow) {
    const colorKey = ELEMENT_COLORS[hero.element] || 'gold';
    const color = NEON_PALETTE[colorKey];
    const limbs = new LimbStructure(colorKey);
    const size = hero.size || 48;
    const x = hero.x;
    const y = hero.y;
    
    const heroicPulse = MathUtils.wave(time, 3, 0.08, 0) + 1;
    const hover = MathUtils.wave(time, 4, size * 0.12);
    
    ctx.save();
    ctx.translate(x, y + hover);
    ctx.scale(heroicPulse, heroicPulse);
    
    // Heroic aura
    if (glow) {
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.6, size * 1.3, color, time, 0.8);
      ParticleField.renderAuraPulse(ctx, 0, -size * 0.6, size * 1.0, color, time * 1.3, 0.6);
    }
    
    // Dynamic cape (flowing behind)
    ctx.fillStyle = color.dark + '88';
    ctx.beginPath();
    ctx.moveTo(-size * 0.25, -size * 0.9);
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const capeX = MathUtils.lerp(-size * 0.25, -size * 0.7, t);
      const capeY = MathUtils.lerp(-size * 0.9, size * 0.8, t);
      const flow = MathUtils.wave(time * 2 + i * 0.2, 5, size * 0.15);
      ctx.lineTo(capeX + flow, capeY);
    }
    ctx.lineTo(size * 0.7 + MathUtils.wave(time * 2 + 2.4, 5, size * 0.15), size * 0.8);
    for (let i = 12; i >= 0; i--) {
      const t = i / 12;
      const capeX = MathUtils.lerp(size * 0.25, size * 0.7, t);
      const capeY = MathUtils.lerp(-size * 0.9, size * 0.8, t);
      const flow = MathUtils.wave(time * 2 + i * 0.2, 5, size * 0.15);
      ctx.lineTo(capeX + flow, capeY);
    }
    ctx.closePath();
    ctx.fill();
    
    // Legs (heroic stance)
    limbs.renderLeg(ctx, -size * 0.2, size * 0.35, -0.15, size * 0.9, size * 0.15, time, -1, false);
    limbs.renderLeg(ctx, size * 0.2, size * 0.35, 0.15, size * 0.9, size * 0.15, time, 1, false);
    
    // Back arm (power pose)
    limbs.renderArm(ctx, -size * 0.22, -size * 0.55, Math.PI * 0.25, size * 0.9, size * 0.12, time, -1);
    
    // Heroic torso
    limbs.renderTorso(ctx, 0, -size * 0.45, size * 0.48, size * 0.68, time);
    
    // Front arm (fist raised or ready)
    limbs.renderArm(ctx, size * 0.22, -size * 0.55, -Math.PI * 0.35, size * 0.9, size * 0.12, time, 1);
    
    // Noble head
    limbs.renderHead(ctx, 0, -size * 1.1, size * 0.4, time, 'determined');
    
    // Emblem on chest
    ctx.fillStyle = color.bright;
    ctx.shadowColor = color.bright;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, -size * 0.4, size * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -size * 0.4, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.restore();
    
    this.renderHealthBar(ctx, x, y - size * 1.7, size * 1.1, hero.hp, hero.maxHp, color);
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // HEALTH BAR (Clean vector style)
  // ═════════════════════════════════════════════════════════════════════════
  static renderHealthBar(ctx, x, y, width, hp, maxHp, color) {
    const barWidth = width * 1.2;
    const barHeight = 6;
    const hpPercent = Math.max(0, Math.min(1, hp / maxHp));
    
    ctx.save();
    ctx.translate(x - barWidth / 2, y);
    
    // Background
    ctx.fillStyle = '#000000aa';
    ctx.fillRect(0, 0, barWidth, barHeight);
    
    // HP fill (gradient based on percentage)
    let fillColor;
    if (hpPercent > 0.6) {
      fillColor = color.base;
    } else if (hpPercent > 0.3) {
      fillColor = NEON_PALETTE.gold.base;
    } else {
      fillColor = NEON_PALETTE.crimson.base;
    }
    
    ctx.fillStyle = fillColor;
    ctx.fillRect(1, 1, (barWidth - 2) * hpPercent, barHeight - 2);
    
    // Border
    ctx.strokeStyle = color.bright;
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, barWidth, barHeight);
    
    ctx.restore();
  }
}

if (typeof window !== "undefined") {
  window.EnemySprites = EnemySprites;
  window.EnemySprites_v2 = EnemySprites;
}
