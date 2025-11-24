// src/robots/Robot.js
// Robot entity class

export class Robot {
  constructor(data, x = 0, y = 0) {
    // Core properties
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.category = data.category;
    this.tier = data.tier;
    
    // Stats
    this.hpMax = data.hp;
    this.hp = data.hp;
    this.atk = data.atk;
    this.def = data.def;
    this.speed = data.speed;
    this.cost = data.cost;
    
    // Combat
    this.fireRate = data.fireRate;
    this.ranged = data.ranged;
    this.melee = data.melee;
    this.lastFireTime = 0;
    
    // Position and movement
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facingLeft = false;
    
    // Animation
    this.animState = 'idle'; // idle, run, attack
    this.animTime = 0;
    
    // AI state
    this.mode = data.modes ? data.modes[0] : 'follow';
    this.targetMode = data.targetModes ? data.targetModes[0] : 'nearest';
    this.target = null;
    this.leaderId = null;
    
    // Visual
    this.color = data.color;
    this.secondaryColor = data.secondaryColor;
    this.width = data.width;
    this.height = data.height;
    
    // Special properties
    this.hasShield = data.hasShield || false;
    this.hasHeavyWeapons = data.hasHeavyWeapons || false;
    this.isHovering = data.isHovering || false;
    this.isSupport = data.isSupport || false;
    this.canCloak = data.canCloak || false;
    this.cloaked = false;
    this.canBuild = data.canBuild || false;
    this.isCommander = data.isCommander || false;
    
    // Support/buff properties
    this.healingPower = data.healingPower || 0;
    this.shieldStrength = data.shieldStrength || 0;
    this.buffPower = data.buffPower || 1.0;
    this.buffRadius = data.buffRadius || 0;
    
    // Data reference
    this.data = data;
    
    // State
    this.alive = true;
    this.active = true;
  }
  
  update(dt) {
    if (!this.alive) return;
    
    this.animTime += dt * 1000;
    
    // Simple idle bob for hovering units
    if (this.isHovering && this.animState === 'idle') {
      // Hover handled in render
    }
    
    // Update velocity decay
    this.vx *= 0.9;
    this.vy *= 0.9;
    
    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  
  setMode(mode) {
    if (this.data.modes && this.data.modes.includes(mode)) {
      this.mode = mode;
    }
  }
  
  setTargetMode(targetMode) {
    if (this.data.targetModes && this.data.targetModes.includes(targetMode)) {
      this.targetMode = targetMode;
    }
  }
  
  takeDamage(amount) {
    const actualDamage = Math.max(1, amount - this.def * 0.5);
    this.hp -= actualDamage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
    return actualDamage;
  }
  
  heal(amount) {
    if (!this.alive) return 0;
    const healed = Math.min(amount, this.hpMax - this.hp);
    this.hp += healed;
    return healed;
  }
  
  getHPPercent() {
    return (this.hp / this.hpMax) * 100;
  }
  
  canFire(currentTime) {
    return currentTime - this.lastFireTime >= this.fireRate;
  }
  
  fire(currentTime) {
    this.lastFireTime = currentTime;
    this.animState = 'attack';
  }
}

