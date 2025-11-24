// src/pets/Pet.js

export class Pet {
  constructor(owner, petData) {
    this.id = `pet_${Math.random().toString(36).slice(2)}`;
    this.petId = petData.id;
    this.owner = owner;
    this.x = owner.x - 40;
    this.y = owner.y;
    this.targetX = this.x;
    this.targetY = this.y;
    
    // From pet data
    this.name = petData.name;
    this.element = petData.element;
    this.rarity = petData.rarity;
    this.attack = petData.attack;
    this.health = petData.health;
    this.maxHealth = petData.health;
    this.speed = petData.speed;
    this.elementColor = petData.elementColor;
    this.secondaryColor = petData.secondaryColor;
    this.followDistance = petData.followDistance || 50;
    this.attackRange = petData.attackRange || 80;
    this.ability = petData.ability;
    this.abilityDamage = petData.abilityDamage;
    this.abilityCooldown = petData.abilityCooldown;
    this.lastAbility = 0;
  }
}

