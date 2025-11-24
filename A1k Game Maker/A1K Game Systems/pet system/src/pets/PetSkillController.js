// src/pets/PetSkillController.js
// Skill activation and cooldown management

import { getPetSkills } from './PetSkills.js';

// Activate pet normal skill
export function useNormalSkill(pet, effectSystem, target = null) {
  const skills = getPetSkills(pet.petId);
  if (!skills || !skills.normal) return false;
  
  // Check cooldown
  if (pet.normalCooldown && pet.normalCooldown > 0) return false;
  
  const skill = skills.normal;
  
  // Set cooldown
  pet.normalCooldown = skill.cooldown;
  
  // Create visual effect
  if (effectSystem) {
    executeSkillEffect(pet, skill, effectSystem, target);
  }
  
  return true;
}

// Activate pet special skill
export function useSpecialSkill(pet, effectSystem, targets = []) {
  const skills = getPetSkills(pet.petId);
  if (!skills || !skills.special) return false;
  
  // Check cooldown
  if (pet.specialCooldown && pet.specialCooldown > 0) return false;
  
  const skill = skills.special;
  
  // Set cooldown
  pet.specialCooldown = skill.cooldown;
  
  // Create cast effect first
  if (effectSystem) {
    effectSystem.createCastEffect(pet.x, pet.y, skill.color, 1000, 'ultimate');
    
    // Execute special effect after brief delay
    setTimeout(() => {
      executeSpecialSkillEffect(pet, skill, effectSystem, targets);
    }, 500);
  }
  
  return true;
}

// Execute normal skill effect
function executeSkillEffect(pet, skill, effectSystem, target) {
  const targetX = target ? target.x : pet.x + 200;
  const targetY = target ? target.y : pet.y;
  
  switch (skill.type) {
    case 'projectile':
    case 'homing':
      effectSystem.createProjectile(pet.x, pet.y, targetX, targetY, skill, target);
      break;
      
    case 'beam':
      // Beam effect - instant line
      effectSystem.castEffects.push({
        x: pet.x,
        y: pet.y,
        endX: targetX,
        endY: targetY,
        color: skill.color,
        type: 'beam',
        width: skill.beamWidth || 10,
        life: 0,
        maxLife: skill.duration || 1000,
      });
      if (target) {
        effectSystem.createImpact(targetX, targetY, skill.color, 25);
      }
      break;
      
    case 'melee':
    case 'melee_multi':
      // Close range slash
      for (let i = 0; i < (skill.swipeCount || skill.slashCount || 1); i++) {
        setTimeout(() => {
          effectSystem.createImpact(pet.x + 30, pet.y - 10, skill.color, 20);
        }, i * 100);
      }
      break;
      
    case 'cone':
      // Cone attack - multiple projectiles
      for (let i = -2; i <= 2; i++) {
        const angle = Math.atan2(targetY - pet.y, targetX - pet.x) + (i * 0.15);
        const coneTargetX = pet.x + Math.cos(angle) * skill.range;
        const coneTargetY = pet.y + Math.sin(angle) * skill.range;
        effectSystem.createProjectile(pet.x, pet.y, coneTargetX, coneTargetY, {
          ...skill,
          projectileSize: 6,
          projectileSpeed: 250,
        });
      }
      break;
      
    case 'leap_attack':
      // Frog hop attack
      effectSystem.createCastEffect(pet.x, pet.y, skill.color, 300, 'charge');
      setTimeout(() => {
        effectSystem.createImpact(targetX, targetY, skill.color, 25);
      }, 300);
      break;
      
    case 'dual_attack':
      // Dark Missy's dual attack - bullet + slash
      effectSystem.createProjectile(pet.x, pet.y, targetX, targetY, {
        ...skill,
        projectileSize: 6,
        projectileSpeed: 400,
      });
      effectSystem.createImpact(pet.x + 25, pet.y - 8, '#87ceeb', 15);
      break;
  }
}

// Execute special skill effect
function executeSpecialSkillEffect(pet, skill, effectSystem, targets) {
  switch (skill.type) {
    case 'aoe_multi':
      // Meteor Storm
      effectSystem.createMeteorStorm(pet.x + 100, pet.y, skill.color, skill.meteorCount);
      break;
      
    case 'spinning_aoe':
      // Inferno Cyclone
      effectSystem.createTornado(pet.x + 80, pet.y, skill.color, skill.duration);
      break;
      
    case 'screen_wide':
      // Absolute Zero / Blizzard
      effectSystem.createScreenExplosion(pet.x, pet.y, skill.color, 450);
      break;
      
    case 'screen_explosion':
      // Divine Judgment
      effectSystem.createScreenExplosion(pet.x, pet.y, skill.color, 500);
      break;
      
    case 'chain_lightning':
      // Thunder God's Wrath
      effectSystem.createChainLightning(pet.x, pet.y, targets.slice(0, 10), skill.color, skill.damage);
      break;
      
    case 'ground_pound':
      // Earthquake
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const shockwaveX = pet.x + (i - 2) * 100;
          effectSystem.createImpact(shockwaveX, pet.y, skill.color, 40);
        }, i * 200);
      }
      effectSystem.addScreenShake(15);
      break;
      
    case 'tornado':
      // Hurricane Force
      effectSystem.createTornado(pet.x + 100, pet.y, skill.color, skill.duration);
      break;
      
    case 'time_distortion':
      // Reality Warp
      effectSystem.castEffects.push({
        x: pet.x,
        y: pet.y,
        color: skill.color,
        type: 'time_warp',
        life: 0,
        maxLife: skill.duration,
        pulseCount: 0,
      });
      effectSystem.addScreenShake(11);
      break;
      
    case 'sound_wave':
      // Cosmic Ribbit
      for (let i = 0; i < skill.waveCount; i++) {
        setTimeout(() => {
          effectSystem.castEffects.push({
            x: pet.x,
            y: pet.y,
            color: skill.color,
            type: 'expanding_ring',
            life: 0,
            maxLife: 1500,
            radius: 10,
          });
        }, i * 400);
      }
      effectSystem.addScreenShake(8);
      break;
      
    case 'summon':
      // Nightmare Realm - shadow clones
      for (let i = 0; i < skill.cloneCount; i++) {
        setTimeout(() => {
          const angle = (i / skill.cloneCount) * Math.PI * 2;
          const cloneX = pet.x + Math.cos(angle) * 80;
          const cloneY = pet.y + Math.sin(angle) * 80;
          effectSystem.createCastEffect(cloneX, cloneY, skill.color, 800, 'summon');
        }, i * 300);
      }
      effectSystem.addScreenShake(9);
      break;
      
    case 'orbital_laser':
      // Orbital Strike
      const laserX = pet.x + 150;
      effectSystem.castEffects.push({
        x: laserX,
        y: -50,
        endX: laserX,
        endY: pet.y,
        color: skill.color,
        type: 'orbital_beam',
        width: 30,
        life: 0,
        maxLife: 3000,
      });
      effectSystem.addScreenShake(13);
      break;
      
    case 'rapid_melee':
      // Berserk Rampage
      for (let i = 0; i < skill.strikeCount; i++) {
        setTimeout(() => {
          const offsetX = (Math.random() - 0.5) * 50;
          const offsetY = (Math.random() - 0.5) * 30;
          effectSystem.createImpact(pet.x + 40 + offsetX, pet.y + offsetY, skill.color, 12);
        }, i * 200);
      }
      effectSystem.addScreenShake(10);
      break;
      
    case 'ultimate':
      // Angelfall Catastrophe - Dark Missy's ultimate
      // Wing explosion
      effectSystem.createScreenExplosion(pet.x, pet.y, skill.color, skill.wingExplosionRadius);
      
      // Bullet barrage
      for (let i = 0; i < skill.bulletBarrageCount; i++) {
        setTimeout(() => {
          const angle = (i / skill.bulletBarrageCount) * Math.PI * 4;
          const bulletTargetX = pet.x + Math.cos(angle) * 300;
          const bulletTargetY = pet.y + Math.sin(angle) * 300;
          effectSystem.createProjectile(pet.x, pet.y, bulletTargetX, bulletTargetY, {
            ...skill,
            projectileSize: 5,
            projectileSpeed: 500,
          });
        }, i * 50);
      }
      
      // Sword slashes
      for (let i = 0; i < skill.swordSlashCount; i++) {
        setTimeout(() => {
          effectSystem.createImpact(pet.x + (i - 5) * 40, pet.y, '#87ceeb', 30);
        }, i * 150);
      }
      
      effectSystem.addScreenShake(20);
      break;
  }
}

// Update cooldowns
export function updatePetCooldowns(pet, dt) {
  if (pet.normalCooldown && pet.normalCooldown > 0) {
    pet.normalCooldown -= dt * 1000;
    if (pet.normalCooldown < 0) pet.normalCooldown = 0;
  }
  
  if (pet.specialCooldown && pet.specialCooldown > 0) {
    pet.specialCooldown -= dt * 1000;
    if (pet.specialCooldown < 0) pet.specialCooldown = 0;
  }
}

// Check if skill can be used
export function canUseSkill(pet, skillType) {
  const cooldownKey = skillType === 'special' ? 'specialCooldown' : 'normalCooldown';
  return !pet[cooldownKey] || pet[cooldownKey] <= 0;
}

// Get cooldown percentage
export function getSkillCooldownPercent(pet, skillType) {
  const skills = getPetSkills(pet.petId);
  if (!skills) return 0;
  
  const skill = skills[skillType];
  const cooldownKey = skillType === 'special' ? 'specialCooldown' : 'normalCooldown';
  const currentCooldown = pet[cooldownKey] || 0;
  
  if (currentCooldown <= 0) return 100;
  return ((skill.cooldown - currentCooldown) / skill.cooldown) * 100;
}

