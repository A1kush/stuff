// src/pets/PetController.js

import { updatePetCooldowns } from './PetSkillController.js';

export function updatePet(pet, dt) {
  if (!pet || !pet.owner) return;
  
  // Follow the owner at a distance
  const dx = pet.owner.x - pet.followDistance - pet.x;
  const dy = pet.owner.y - pet.y;
  
  // Use pet's speed stat for follow speed
  const followSpeed = 8 * (pet.speed || 0.5);
  
  pet.x += dx * followSpeed * dt;
  pet.y += dy * followSpeed * dt;
  
  // Update skill cooldowns
  updatePetCooldowns(pet, dt);
  
  // Update ability cooldown (legacy)
  if (pet.lastAbility > 0) {
    pet.lastAbility -= dt * 1000;
  }
}

export function usePetAbility(pet) {
  if (!pet || pet.lastAbility > 0) return false;
  
  pet.lastAbility = pet.abilityCooldown;
  return true;
}

