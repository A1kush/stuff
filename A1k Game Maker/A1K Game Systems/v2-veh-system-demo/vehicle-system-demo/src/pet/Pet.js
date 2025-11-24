// src/pet/Pet.js

export class Pet {
  constructor(owner) {
    this.id = `pet_${Math.random().toString(36).slice(2)}`;
    this.owner = owner;
    this.x = owner.x - 40;
    this.y = owner.y;
    this.targetX = this.x;
    this.targetY = this.y;
    this.followDistance = 50;
    this.followSpeed = 8;
  }
}

