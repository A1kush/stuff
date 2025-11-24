// EffectsSystem.js - Particle effects, glows, shadows, dust trails

class Particle {
  constructor(x, y, vx, vy, life, color, size, type = 'circle', z = 0) {
    this.x = x;
    this.y = y;
    this.z = z; // Z coordinate for 3D rendering
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.type = type;
    this.alpha = 1;
    this.gravity = 0.2;
  }

  update(dt) {
    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
    
    // Apply gravity
    this.vy += this.gravity * dt * 60;
    
    // Apply air resistance
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    // Decrease life
    this.life -= dt * 1000;
    this.alpha = this.life / this.maxLife;
    
    return this.life > 0;
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'square') {
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
    
    ctx.restore();
  }
  
  // Render with 3D projection
  render3D(ctx, screenPos) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    // Scale particle size based on distance
    const scaledSize = this.size * screenPos.scale;
    
    if (this.type === 'circle') {
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, scaledSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'square') {
      ctx.fillRect(screenPos.x - scaledSize / 2, screenPos.y - scaledSize / 2, scaledSize, scaledSize);
    }
    
    ctx.restore();
  }
}

export class EffectsSystem {
  constructor() {
    this.particles = [];
    this.shadows = new Map(); // vehicle id -> shadow data
    this.shakeIntensity = 0; // Camera shake intensity
    this.shakeDecay = 0.9; // Shake decay rate
  }

  update(dt) {
    // Update all particles
    this.particles = this.particles.filter(p => p.update(dt));
  }

  render(ctx) {
    // Render particles with 3D projection if available
    if (window.renderer3D && window.renderer3D.camera) {
      // Sort particles by depth for proper rendering
      const sortedParticles = [...this.particles].sort((a, b) => {
        const depthA = window.renderer3D.projectToScreen(a.x, a.y, a.z || 0).depth;
        const depthB = window.renderer3D.projectToScreen(b.x, b.y, b.z || 0).depth;
        return depthB - depthA; // Further back first
      });
      
      sortedParticles.forEach(p => {
        // Project particle position to screen
        const screenPos = window.renderer3D.projectToScreen(p.x, p.y, p.z || 0);
        p.render3D(ctx, screenPos);
      });
    } else {
      // Fallback to 2D rendering
      this.particles.forEach(p => p.render(ctx));
    }
  }

  // Render shadow under vehicle
  renderShadow(ctx, x, y, width, height, vehicleCategory) {
    ctx.save();
    
    // Shadow size based on vehicle
    const shadowWidth = width * 0.8;
    const shadowHeight = height * 0.3;
    const shadowY = y + height / 2 + 10;
    
    // Hover vehicles have smaller, more diffuse shadows
    const alpha = vehicleCategory === 'hover' ? 0.15 : 0.3;
    
    // Create elliptical shadow
    const gradient = ctx.createRadialGradient(x, shadowY, 0, x, shadowY, shadowWidth / 2);
    gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
    gradient.addColorStop(0.7, `rgba(0, 0, 0, ${alpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, shadowY, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  // Dust particles when moving on ground
  emitDust(x, y, vx, count = 3) {
    for (let i = 0; i < count; i++) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * 20,
        y + 10 + Math.random() * 5,
        -vx * 0.3 + (Math.random() - 0.5) * 2,
        -Math.random() * 1.5 - 0.5,
        300 + Math.random() * 200, // 300-500ms life
        `rgba(150, 130, 100, ${0.4 + Math.random() * 0.3})`,
        3 + Math.random() * 3,
        'circle',
        0 // Z coordinate (on ground)
      );
      particle.gravity = 0.05; // Light gravity
      this.particles.push(particle);
    }
  }

  // Exhaust trail for bikes/cars
  emitExhaust(x, y, facingLeft, count = 2) {
    const direction = facingLeft ? 1 : -1;
    
    for (let i = 0; i < count; i++) {
      const particle = new Particle(
        x + direction * 15,
        y + 5 + Math.random() * 3,
        direction * (1 + Math.random()) * 1.5,
        (Math.random() - 0.5) * 0.5,
        400 + Math.random() * 200,
        i % 2 === 0 ? 'rgba(100, 100, 120, 0.6)' : 'rgba(80, 80, 100, 0.5)',
        4 + Math.random() * 3,
        'circle'
      );
      particle.gravity = -0.02; // Rises slightly
      this.particles.push(particle);
    }
  }

  // Jet flames for jetpacks/aircraft
  emitJetFlame(x, y, intensity = 1) {
    for (let i = 0; i < 3 * intensity; i++) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * 6,
        y,
        (Math.random() - 0.5) * 1,
        2 + Math.random() * 2,
        200 + Math.random() * 150,
        i % 3 === 0 ? 'rgba(255, 150, 50, 0.9)' :
        i % 3 === 1 ? 'rgba(255, 100, 0, 0.8)' :
        'rgba(255, 50, 0, 0.7)',
        6 + Math.random() * 4,
        'circle'
      );
      particle.gravity = -0.1; // Flames rise
      this.particles.push(particle);
    }
  }

  // Water splash for speedboat
  emitWaterSplash(x, y, vx) {
    for (let i = 0; i < 5; i++) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * 15,
        y + Math.random() * 5,
        -vx * 0.5 + (Math.random() - 0.5) * 3,
        -Math.random() * 3 - 1,
        400 + Math.random() * 300,
        'rgba(200, 230, 255, 0.7)',
        3 + Math.random() * 4,
        'circle'
      );
      this.particles.push(particle);
    }
  }

  // Hover glow effect
  emitHoverGlow(x, y, width) {
    for (let i = 0; i < 2; i++) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * width,
        y + 15 + Math.random() * 5,
        (Math.random() - 0.5) * 0.5,
        Math.random() * 0.5 + 0.2,
        300 + Math.random() * 200,
        'rgba(0, 255, 255, 0.5)',
        8 + Math.random() * 6,
        'circle'
      );
      particle.gravity = 0; // No gravity
      this.particles.push(particle);
    }
  }

  // Mech footstep impact
  emitMechImpact(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const speed = 2 + Math.random() * 2;
      const particle = new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed - 1,
        300 + Math.random() * 200,
        'rgba(255, 200, 100, 0.7)',
        3 + Math.random() * 3,
        'square'
      );
      this.particles.push(particle);
    }
  }

  // Speed lines for fast movement
  renderSpeedLines(ctx, x, y, vx, facingLeft) {
    if (Math.abs(vx) < 150) return; // Only show at high speed
    
    ctx.save();
    ctx.globalAlpha = Math.min(0.6, Math.abs(vx) / 400);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    const direction = vx > 0 ? -1 : 1;
    
    for (let i = 0; i < 5; i++) {
      const lineX = x + direction * (30 + i * 20);
      const lineY = y + (Math.random() - 0.5) * 40;
      const lineLength = 10 + Math.random() * 15;
      
      ctx.beginPath();
      ctx.moveTo(lineX, lineY);
      ctx.lineTo(lineX + direction * lineLength, lineY);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  // Engine glow pulse
  renderEngineGlow(ctx, x, y, color, intensity, size) {
    const pulseSize = size * (0.8 + Math.sin(Date.now() * 0.005) * 0.2);
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseSize);
    gradient.addColorStop(0, color.replace(')', `, ${intensity})`).replace('rgb', 'rgba'));
    gradient.addColorStop(0.5, color.replace(')', `, ${intensity * 0.5})`).replace('rgb', 'rgba'));
    gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Headlight beam
  renderHeadlight(ctx, x, y, facingLeft, range = 100) {
    ctx.save();
    
    const direction = facingLeft ? -1 : 1;
    const beamX = x + direction * 20;
    
    const gradient = ctx.createLinearGradient(beamX, y, beamX + direction * range, y);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 100, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(beamX, y - 10);
    ctx.lineTo(beamX + direction * range, y - 25);
    ctx.lineTo(beamX + direction * range, y + 25);
    ctx.lineTo(beamX, y + 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  // Update effects for a vehicle
  updateVehicleEffects(vehicle, dt) {
    const { data, vx, vy, x, y, grounded, facingLeft } = vehicle;
    const speed = Math.abs(vx);

    // Ground dust
    if (grounded && data.category === 'ground' && speed > 50) {
      if (Math.random() < 0.3) {
        this.emitDust(x, y, vx, 2);
      }
    }

    // Exhaust for bikes/cars
    if (data.category === 'ground' && speed > 30 && 
        (data.id.includes('bike') || data.id.includes('car') || data.id === 'chopper')) {
      if (Math.random() < 0.2) {
        this.emitExhaust(x, y, facingLeft, 1);
      }
    }

    // Jet flames for jetpacks
    if (data.category === 'air' && data.id.includes('jetpack')) {
      this.emitJetFlame(x, y + 12, 1);
    }

    // Hover glow
    if (data.category === 'hover') {
      if (Math.random() < 0.5) {
        this.emitHoverGlow(x, y, data.width);
      }
    }

    // Water splash
    if (data.category === 'water' && speed > 50) {
      if (Math.random() < 0.4) {
        this.emitWaterSplash(x - (facingLeft ? 20 : -20), y, vx);
      }
    }

    // Mech footsteps
    if (data.purpose === 'mech' && grounded) {
      const walkCycle = Math.floor((Date.now() / 300) % 2);
      if (vehicle.lastWalkCycle !== walkCycle) {
        this.emitMechImpact(x, y + 30);
        vehicle.lastWalkCycle = walkCycle;
      }
    }
  }

  // Render all vehicle effects
  renderVehicleEffects(ctx, vehicle) {
    const { data, vx, x, y, facingLeft } = vehicle;

    // Shadow
    this.renderShadow(ctx, x, y, data.width, data.height, data.category);

    // Speed lines
    this.renderSpeedLines(ctx, x, y, vx, facingLeft);

    // Engine glow for certain vehicles
    if (data.id.includes('bike') || data.id.includes('car')) {
      const glowX = x + (facingLeft ? 20 : -20);
      this.renderEngineGlow(ctx, glowX, y, data.color, 0.4, 15);
    }

    // Headlights for cars/heavy transport at night or always
    if (data.id === 'car' || data.id === 'personal_car' || data.id === 'heavy_transport') {
      this.renderHeadlight(ctx, x, y, facingLeft, 80);
    }
  }

  // Clear all particles
  clear() {
    this.particles = [];
  }
  
  // Infinite Horizon: The Janitor God - Camera Tilt Effect
  setCameraTilt(angle) {
    // Store tilt angle in GameState (will be applied in render)
    if (window.gameState) {
      window.gameState.cameraTilt = angle;
    }
  }
  
  // Apply speed effect (motion blur / speed lines)
  applySpeedEffect(active) {
    // This will be used to toggle speed line rendering
    this.speedEffectActive = active;
  }
  
  // Screen shatter filter for Domain Expansion (Phase 4)
  applyScreenFilter(filterType) {
    if (filterType === 'SHATTER_RED') {
      const canvas = document.getElementById('gameCanvas');
      if (canvas) {
        // Add shatter effect class
        canvas.classList.add('screen-shatter');
        
        // Remove after animation
        setTimeout(() => {
          canvas.classList.remove('screen-shatter');
        }, 1000);
      }
    }
  }
  
  // Breathing trail effect for Unique (Phase 4)
  emitBreathingTrail(x, y, facingLeft, style = 'water') {
    const colors = {
      water: '#4A90E2',
      fire: '#FF4500',
      thunder: '#FFD700',
      wind: '#87CEEB'
    };
    
    const color = colors[style] || colors.water;
    const direction = facingLeft ? -1 : 1;
    
    for (let i = 0; i < 3; i++) {
      const particle = new Particle(
        x + (Math.random() - 0.5) * 20,
        y - 10 + Math.random() * 10,
        direction * (2 + Math.random() * 2),
        (Math.random() - 0.5) * 1,
        300 + Math.random() * 200,
        color,
        4 + Math.random() * 3,
        'circle'
      );
      particle.gravity = -0.05; // Slight upward float
      this.particles.push(particle);
    }
  }
  
  // Screen shake effect (Phase 6)
  applyScreenShake(intensity = 1, duration = 200) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    let startTime = Date.now();
    const originalTransform = canvas.style.transform;
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration) {
        const offsetX = (Math.random() - 0.5) * intensity * 10;
        const offsetY = (Math.random() - 0.5) * intensity * 10;
        canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        requestAnimationFrame(shake);
      } else {
        canvas.style.transform = originalTransform;
      }
    };
    
    shake();
  }
}

