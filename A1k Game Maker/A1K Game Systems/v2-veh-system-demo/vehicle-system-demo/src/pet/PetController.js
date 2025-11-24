// src/pet/PetController.js

export function updatePet(pet, dt) {
  if (!pet || !pet.owner) return;
  
  // Follow the owner at a distance
  const dx = pet.owner.x - pet.followDistance - pet.x;
  const dy = pet.owner.y - pet.y;
  
  pet.x += dx * pet.followSpeed * dt;
  pet.y += dy * pet.followSpeed * dt;
}

