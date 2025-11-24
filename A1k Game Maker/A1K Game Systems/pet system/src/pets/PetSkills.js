// src/pets/PetSkills.js
// Complete pet skill system - 14 pets with normal + insane special skills

export const PET_SKILLS = {
  // FIRE CUB
  pet_firecub: {
    normal: {
      name: 'Fireball',
      damage: 30,
      cooldown: 2000,
      range: 200,
      type: 'projectile',
      projectileSpeed: 300,
      projectileSize: 8,
      color: '#ff6b35',
      effect: 'burn',
    },
    special: {
      name: 'METEOR STORM',
      damage: 150,
      cooldown: 20000,
      range: 400,
      type: 'aoe_multi',
      meteorCount: 10,
      meteorSize: 15,
      color: '#ff4444',
      screenShake: 8,
      effect: 'burn_field',
    },
  },
  
  // FLAME SPIRIT
  pet_flame_spirit: {
    normal: {
      name: 'Fire Breath',
      damage: 28,
      cooldown: 2000,
      range: 150,
      type: 'cone',
      coneAngle: 45,
      color: '#ff6b35',
      effect: 'burn',
    },
    special: {
      name: 'INFERNO CYCLONE',
      damage: 180,
      cooldown: 22000,
      range: 250,
      type: 'spinning_aoe',
      duration: 3000,
      rotationSpeed: 5,
      color: '#ff4444',
      screenShake: 6,
      effect: 'fire_tornado',
    },
  },
  
  // ICE WOLF
  pet_icewolf: {
    normal: {
      name: 'Frost Bite',
      damage: 25,
      cooldown: 1500,
      range: 100,
      type: 'melee',
      color: '#87ceeb',
      effect: 'slow',
    },
    special: {
      name: 'ABSOLUTE ZERO',
      damage: 120,
      cooldown: 25000,
      range: 999,
      type: 'screen_wide',
      freezeDuration: 5000,
      color: '#ffffff',
      screenShake: 10,
      effect: 'freeze_all',
    },
  },
  
  // FROST WOLF
  pet_frost_wolf: {
    normal: {
      name: 'Ice Shard',
      damage: 30,
      cooldown: 1800,
      range: 250,
      type: 'projectile',
      projectileSpeed: 350,
      projectileSize: 10,
      color: '#b0e0e6',
      effect: 'slow',
    },
    special: {
      name: 'BLIZZARD APOCALYPSE',
      damage: 200,
      cooldown: 28000,
      range: 999,
      type: 'screen_wide',
      duration: 4000,
      particleCount: 100,
      color: '#87ceeb',
      screenShake: 9,
      effect: 'blizzard_slow',
    },
  },
  
  // LIGHTNING BIRD
  pet_lightningbird: {
    normal: {
      name: 'Shock Bolt',
      damage: 35,
      cooldown: 2500,
      range: 220,
      type: 'projectile',
      projectileSpeed: 400,
      projectileSize: 6,
      color: '#ffff00',
      effect: 'stun',
    },
    special: {
      name: 'THUNDER GOD WRATH',
      damage: 250,
      cooldown: 25000,
      range: 500,
      type: 'chain_lightning',
      chainCount: 10,
      chainRange: 80,
      color: '#00ffff',
      screenShake: 12,
      effect: 'paralysis',
    },
  },
  
  // EARTH GOLEM
  pet_earthgolem: {
    normal: {
      name: 'Rock Throw',
      damage: 40,
      cooldown: 3000,
      range: 180,
      type: 'projectile',
      projectileSpeed: 250,
      projectileSize: 12,
      color: '#8b4513',
      effect: 'knockback',
    },
    special: {
      name: 'EARTHQUAKE DEVASTATION',
      damage: 300,
      cooldown: 30000,
      range: 999,
      type: 'ground_pound',
      shockwaveCount: 5,
      stunDuration: 3000,
      color: '#4CAF50',
      screenShake: 15,
      effect: 'ground_crack',
    },
  },
  
  // AIR SPRITE
  pet_airsprite: {
    normal: {
      name: 'Wind Slash',
      damage: 20,
      cooldown: 1000,
      range: 180,
      type: 'projectile',
      projectileSpeed: 450,
      projectileSize: 8,
      color: '#87ceeb',
      effect: 'pushback',
    },
    special: {
      name: 'HURRICANE FORCE',
      damage: 160,
      cooldown: 18000,
      range: 300,
      type: 'tornado',
      duration: 3500,
      pullStrength: 200,
      multiHit: 8,
      color: '#e0f7fa',
      screenShake: 7,
      effect: 'vacuum',
    },
  },
  
  // MAGIC MONKEY
  pet_magic_monkey: {
    normal: {
      name: 'Magic Missile',
      damage: 45,
      cooldown: 2000,
      range: 240,
      type: 'homing',
      projectileSpeed: 320,
      projectileSize: 10,
      color: '#9b59b6',
      effect: 'arcane',
    },
    special: {
      name: 'REALITY WARP',
      damage: 220,
      cooldown: 30000,
      range: 400,
      type: 'time_distortion',
      slowFactor: 0.3,
      duration: 5000,
      teleportCount: 8,
      color: '#ff6b9d',
      screenShake: 11,
      effect: 'time_slow',
    },
  },
  
  // MAGIC FROG
  pet_magicfrog: {
    normal: {
      name: 'Arcane Hop',
      damage: 15,
      cooldown: 1200,
      range: 120,
      type: 'leap_attack',
      leapHeight: 50,
      color: '#ba68c8',
      effect: 'splash',
    },
    special: {
      name: 'COSMIC RIBBIT',
      damage: 140,
      cooldown: 20000,
      range: 350,
      type: 'sound_wave',
      waveCount: 3,
      confuseDuration: 4000,
      color: '#9b59b6',
      screenShake: 8,
      effect: 'confusion',
    },
  },
  
  // GREMLIN
  pet_gremlin: {
    normal: {
      name: 'Shadow Claw',
      damage: 35,
      cooldown: 1800,
      range: 110,
      type: 'melee',
      slashCount: 3,
      color: '#c0392b',
      effect: 'bleed',
    },
    special: {
      name: 'NIGHTMARE REALM',
      damage: 180,
      cooldown: 24000,
      range: 300,
      type: 'summon',
      cloneCount: 5,
      cloneDuration: 8000,
      color: '#2c3e50',
      screenShake: 9,
      effect: 'shadow_clones',
    },
  },
  
  // MISSY SPIRIT
  pet_missy: {
    normal: {
      name: 'Holy Beam',
      damage: 50,
      cooldown: 3000,
      range: 260,
      type: 'beam',
      beamWidth: 20,
      duration: 1000,
      color: '#f1c40f',
      effect: 'purify',
    },
    special: {
      name: 'DIVINE JUDGMENT',
      damage: 350,
      cooldown: 35000,
      range: 999,
      type: 'screen_explosion',
      healAmount: 100,
      duration: 2000,
      color: '#fff5e1',
      screenShake: 14,
      effect: 'holy_explosion',
    },
  },
  
  // ROBOT DRONE
  summon_robot_drone: {
    normal: {
      name: 'Energy Beam',
      damage: 40,
      cooldown: 2200,
      range: 230,
      type: 'beam',
      beamWidth: 8,
      duration: 800,
      color: '#00d4ff',
      effect: 'energy_burn',
    },
    special: {
      name: 'ORBITAL STRIKE',
      damage: 280,
      cooldown: 30000,
      range: 350,
      type: 'orbital_laser',
      chargeTime: 2000,
      burnFieldDuration: 5000,
      color: '#74b9ff',
      screenShake: 13,
      effect: 'laser_field',
    },
  },
  
  // LUCKY TIGER
  summon_tiger_pet: {
    normal: {
      name: 'Claw Swipe',
      damage: 48,
      cooldown: 2500,
      range: 130,
      type: 'melee_multi',
      swipeCount: 3,
      color: '#ffd56a',
      effect: 'slash',
    },
    special: {
      name: 'BERSERK RAMPAGE',
      damage: 300,
      cooldown: 28000,
      range: 200,
      type: 'rapid_melee',
      strikeCount: 20,
      speedBoost: 2.0,
      duration: 4000,
      color: '#ff8c00',
      screenShake: 10,
      effect: 'fury',
    },
  },
  
  // DARK MISSY (NEW!)
  pet_dark_missy: {
    normal: {
      name: 'Shadow Shot',
      damage: 55,
      cooldown: 2800,
      range: 240,
      type: 'dual_attack',
      bulletDamage: 30,
      slashDamage: 25,
      color: '#ff69b4',
      effect: 'dual_element',
    },
    special: {
      name: 'ANGELFALL CATASTROPHE',
      damage: 400,
      cooldown: 35000,
      range: 450,
      type: 'ultimate',
      wingExplosionRadius: 200,
      bulletBarrageCount: 50,
      swordSlashCount: 10,
      duration: 5000,
      color: '#ff69b4',
      screenShake: 20,
      effect: 'angelfall',
    },
  },
};

// Get skills for a pet
export function getPetSkills(petId) {
  return PET_SKILLS[petId] || null;
}

// Get all skill names
export function getAllSkillNames() {
  const skills = [];
  for (const [petId, skillSet] of Object.entries(PET_SKILLS)) {
    skills.push({
      petId,
      normal: skillSet.normal.name,
      special: skillSet.special.name,
    });
  }
  return skills;
}

// Check if skill is ready
export function isSkillReady(pet, skillType) {
  const cooldownKey = skillType === 'special' ? 'specialCooldown' : 'normalCooldown';
  return !pet[cooldownKey] || pet[cooldownKey] <= 0;
}

// Get skill damage
export function getSkillDamage(petId, skillType) {
  const skills = getPetSkills(petId);
  if (!skills) return 0;
  return skills[skillType]?.damage || 0;
}

