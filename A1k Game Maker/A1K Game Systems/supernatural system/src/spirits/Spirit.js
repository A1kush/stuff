// src/spirits/Spirit.js
// Spirit companion entity class

export class Spirit {
  constructor(data, ownerId = null) {
    // Core properties
    this.id = data.id;
    this.name = data.name;
    this.icon = data.icon;
    this.type = data.type;
    this.element = data.element;
    this.power = data.power;
    this.level = data.level;
    this.rarity = data.rarity;
    this.description = data.description;

    // Visual
    this.color = data.color;
    this.secondaryColor = data.secondaryColor;
    this.glowColor = data.glowColor;
    this.width = data.width;
    this.height = data.height;

    // Position and orbit
    this.x = 0;
    this.y = 0;
    this.orbitAngle = Math.random() * Math.PI * 2;
    this.orbitSpeed = data.orbitSpeed || 2.0;
    this.orbitRadius = data.orbitRadius || 60;

    // Owner
    this.ownerId = ownerId;
    this.owner = null;

    // Animation
    this.animTime = 0;

    // Combat
    this.attackType = data.attackType || 'dark_bolt';
    this.attackDamage = data.attackDamage || 20;
    this.attackCooldown = data.attackCooldown || 2500;
    this.lastAttackTime = 0;
    this.canChainAttack = data.canChainAttack || false;

    // Bonuses
    this.bonuses = data.bonuses || {};

    // Special abilities
    this.specialPassive = data.specialPassive || null;
    this.particleType = data.particleType || 'sparkle';

    // Data reference
    this.data = data;

    // State
    this.active = true;
    this.equipped = false;
  }

  update(dt) {
    if (!this.active) return;

    this.animTime += dt * 1000;

    // Update orbit
    if (this.owner) {
      this.orbitAngle += this.orbitSpeed * dt;
      this.x = this.owner.x + Math.cos(this.orbitAngle) * this.orbitRadius;
      this.y = this.owner.y + Math.sin(this.orbitAngle) * this.orbitRadius - 40;
    }
  }

  setOwner(owner) {
    this.owner = owner;
  }

  canAttack(currentTime) {
    return currentTime - this.lastAttackTime >= this.attackCooldown;
  }

  attack(currentTime, target) {
    if (!this.canAttack(currentTime)) return false;
    this.lastAttackTime = currentTime;
    return true;
  }

  getBonuses() {
    return this.equipped ? { ...this.bonuses } : {};
  }

  equip() {
    this.equipped = true;
  }

  unequip() {
    this.equipped = false;
  }
}

