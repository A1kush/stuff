// src/pets/PetRegistry.js
// Complete pet data from A1K Runner game - 13 elemental pets + summons

export const PET_REGISTRY = {
  // FIRE ELEMENT (2)
  pet_firecub: {
    id: 'pet_firecub',
    name: 'Fire Cub',
    element: 'fire',
    rarity: 'common',
    attack: 20,
    health: 80,
    speed: 0.6,
    cost: 300,
    description: 'A playful fire cub that shoots small fireballs',
    elementColor: '#ff6b35',
    secondaryColor: '#ffff00',
    followDistance: 45,
    attackRange: 80,
    ability: 'Fire Breath',
    abilityDamage: 30,
    abilityCooldown: 2000,
  },
  
  pet_flame_spirit: {
    id: 'pet_flame_spirit',
    name: 'Flame Spirit',
    element: 'fire',
    rarity: 'rare',
    attack: 28,
    health: 75,
    speed: 0.7,
    cost: 800,
    description: 'Ethereal flame spirit with intense heat',
    elementColor: '#ff6b35',
    secondaryColor: '#ff4444',
    followDistance: 50,
    attackRange: 90,
    ability: 'Fire Breath',
    abilityDamage: 30,
    abilityCooldown: 2000,
  },
  
  // ICE ELEMENT (2)
  pet_icewolf: {
    id: 'pet_icewolf',
    name: 'Ice Wolf',
    element: 'ice',
    rarity: 'common',
    attack: 18,
    health: 90,
    speed: 0.5,
    cost: 350,
    description: 'Loyal ice wolf with freezing attacks',
    elementColor: '#87ceeb',
    secondaryColor: '#ffffff',
    followDistance: 40,
    attackRange: 75,
    ability: 'Ice Shard',
    abilityDamage: 25,
    abilityCooldown: 1500,
  },
  
  pet_frost_wolf: {
    id: 'pet_frost_wolf',
    name: 'Frost Wolf',
    element: 'ice',
    rarity: 'rare',
    attack: 25,
    health: 100,
    speed: 0.5,
    cost: 850,
    description: 'Powerful frost wolf alpha',
    elementColor: '#87ceeb',
    secondaryColor: '#b0e0e6',
    followDistance: 45,
    attackRange: 85,
    ability: 'Ice Shard',
    abilityDamage: 25,
    abilityCooldown: 1500,
  },
  
  // ELECTRIC ELEMENT (1)
  pet_lightningbird: {
    id: 'pet_lightningbird',
    name: 'Lightning Bird',
    element: 'electric',
    rarity: 'uncommon',
    attack: 30,
    health: 60,
    speed: 0.8,
    cost: 600,
    description: 'Fast electric bird with shocking strikes',
    elementColor: '#ffff00',
    secondaryColor: '#00ffff',
    followDistance: 55,
    attackRange: 100,
    ability: 'Lightning Strike',
    abilityDamage: 35,
    abilityCooldown: 2500,
  },
  
  // EARTH ELEMENT (1)
  pet_earthgolem: {
    id: 'pet_earthgolem',
    name: 'Earth Golem',
    element: 'earth',
    rarity: 'rare',
    attack: 35,
    health: 150,
    speed: 0.3,
    cost: 900,
    description: 'Sturdy rock golem with crushing power',
    elementColor: '#8b4513',
    secondaryColor: '#4CAF50',
    followDistance: 35,
    attackRange: 70,
    ability: 'Rock Throw',
    abilityDamage: 40,
    abilityCooldown: 3000,
  },
  
  // WIND ELEMENT (1)
  pet_airsprite: {
    id: 'pet_airsprite',
    name: 'Air Sprite',
    element: 'wind',
    rarity: 'uncommon',
    attack: 15,
    health: 70,
    speed: 0.9,
    cost: 550,
    description: 'Swift air sprite that dances on the wind',
    elementColor: '#87ceeb',
    secondaryColor: '#e0f7fa',
    followDistance: 60,
    attackRange: 95,
    ability: 'Gust',
    abilityDamage: 20,
    abilityCooldown: 1000,
  },
  
  // ARCANE ELEMENT (2)
  pet_magic_monkey: {
    id: 'pet_magic_monkey',
    name: 'Magic Monkey',
    element: 'arcane',
    rarity: 'epic',
    attack: 40,
    health: 90,
    speed: 0.6,
    cost: 1500,
    description: 'Mischievous magical monkey with arcane powers',
    elementColor: '#9b59b6',
    secondaryColor: '#ff6b9d',
    followDistance: 50,
    attackRange: 110,
    ability: 'Magic Missile',
    abilityDamage: 45,
    abilityCooldown: 2000,
  },
  
  pet_magicfrog: {
    id: 'pet_magicfrog',
    name: 'Magic Frog',
    element: 'arcane',
    rarity: 'common',
    attack: 12,
    health: 50,
    speed: 0.4,
    cost: 250,
    description: 'Cute magical frog with minor spells',
    elementColor: '#9b59b6',
    secondaryColor: '#ba68c8',
    followDistance: 42,
    attackRange: 65,
    ability: 'Magic Missile',
    abilityDamage: 45,
    abilityCooldown: 2000,
  },
  
  // DARK ELEMENT (1)
  pet_gremlin: {
    id: 'pet_gremlin',
    name: 'Gremlin',
    element: 'dark',
    rarity: 'uncommon',
    attack: 22,
    health: 65,
    speed: 0.7,
    cost: 500,
    description: 'Sneaky gremlin with shadow attacks',
    elementColor: '#2c3e50',
    secondaryColor: '#c0392b',
    followDistance: 48,
    attackRange: 75,
    ability: 'Shadow Claw',
    abilityDamage: 35,
    abilityCooldown: 1800,
  },
  
  // LIGHT ELEMENT (1)
  pet_missy: {
    id: 'pet_missy',
    name: 'Missy Spirit',
    element: 'light',
    rarity: 'legendary',
    attack: 50,
    health: 120,
    speed: 0.5,
    cost: 2500,
    description: 'Legendary light spirit with divine power',
    elementColor: '#f1c40f',
    secondaryColor: '#fff5e1',
    followDistance: 52,
    attackRange: 120,
    ability: 'Holy Light',
    abilityDamage: 50,
    abilityCooldown: 3000,
  },
  
  // CHARACTER SUMMONS (2)
  summon_robot_drone: {
    id: 'summon_robot_drone',
    name: 'Robot Drone',
    element: 'tech',
    rarity: 'epic',
    attack: 35,
    health: 100,
    speed: 0.7,
    cost: 1200,
    description: "UNIQUE's combat drone with energy blasters",
    elementColor: '#74b9ff',
    secondaryColor: '#00d4ff',
    followDistance: 50,
    attackRange: 100,
    ability: 'Energy Beam',
    abilityDamage: 40,
    abilityCooldown: 2200,
    character: 'UNIQUE',
  },
  
  summon_tiger_pet: {
    id: 'summon_tiger_pet',
    name: 'Lucky Tiger',
    element: 'nature',
    rarity: 'legendary',
    attack: 45,
    health: 110,
    speed: 0.8,
    cost: 2000,
    description: "MISSY's lucky tiger with golden aura",
    elementColor: '#ff8c00',
    secondaryColor: '#ffd56a',
    followDistance: 48,
    attackRange: 90,
    ability: 'Claw Slash',
    abilityDamage: 48,
    abilityCooldown: 2500,
    character: 'MISSY',
  },
  
  // SHADOW ELEMENT (1) - NEW!
  pet_dark_missy: {
    id: 'pet_dark_missy',
    name: 'Dark Missy',
    element: 'shadow',
    rarity: 'legendary',
    attack: 55,
    health: 130,
    speed: 0.7,
    cost: 3000,
    description: 'Dark angel with halo and wing, dual-wielding sword and gun',
    elementColor: '#2c2c3e',
    secondaryColor: '#ff69b4',
    followDistance: 50,
    attackRange: 110,
    ability: 'Shadow Shot',
    abilityDamage: 55,
    abilityCooldown: 2800,
    hasWeapons: true,
    dualWield: true,
  },
};

// Element information
export const ELEMENTS = {
  fire: { name: 'Fire', color: '#ff6b35', icon: '🔥' },
  ice: { name: 'Ice', color: '#87ceeb', icon: '❄️' },
  electric: { name: 'Electric', color: '#ffff00', icon: '⚡' },
  earth: { name: 'Earth', color: '#8b4513', icon: '🪨' },
  wind: { name: 'Wind', color: '#87ceeb', icon: '💨' },
  arcane: { name: 'Arcane', color: '#9b59b6', icon: '✨' },
  dark: { name: 'Dark', color: '#2c3e50', icon: '👹' },
  light: { name: 'Light', color: '#f1c40f', icon: '☀️' },
  tech: { name: 'Tech', color: '#74b9ff', icon: '🤖' },
  nature: { name: 'Nature', color: '#ff8c00', icon: '🐯' },
  shadow: { name: 'Shadow', color: '#ff69b4', icon: '😈' },
};

// Rarity information
export const RARITIES = {
  common: { name: 'Common', color: '#ffffff', star: '⭐' },
  uncommon: { name: 'Uncommon', color: '#4CAF50', star: '⭐⭐' },
  rare: { name: 'Rare', color: '#2196F3', star: '⭐⭐⭐' },
  epic: { name: 'Epic', color: '#9C27B0', star: '⭐⭐⭐⭐' },
  legendary: { name: 'Legendary', color: '#FF9800', star: '⭐⭐⭐⭐⭐' },
};

// Helper functions
export function getPet(id) {
  return PET_REGISTRY[id] || null;
}

export function getAllPets() {
  return Object.values(PET_REGISTRY);
}

export function getPetsByElement(element) {
  return Object.values(PET_REGISTRY).filter(p => p.element === element);
}

export function getPetsByRarity(rarity) {
  return Object.values(PET_REGISTRY).filter(p => p.rarity === rarity);
}

export function getPetsByPower() {
  return Object.values(PET_REGISTRY)
    .map(pet => ({
      ...pet,
      power: pet.attack + pet.health + (pet.speed * 100),
    }))
    .sort((a, b) => b.power - a.power);
}

export function getRandomPet(element = null) {
  let pets = getAllPets();
  if (element) {
    pets = getPetsByElement(element);
  }
  if (pets.length === 0) return null;
  return pets[Math.floor(Math.random() * pets.length)];
}

export function getPetStats() {
  const pets = getAllPets();
  const stats = {
    total: pets.length,
    byElement: {},
    byRarity: {},
    avgAttack: 0,
    avgHealth: 0,
    avgSpeed: 0,
  };
  
  let attackSum = 0, healthSum = 0, speedSum = 0;
  
  for (const pet of pets) {
    stats.byElement[pet.element] = (stats.byElement[pet.element] || 0) + 1;
    stats.byRarity[pet.rarity] = (stats.byRarity[pet.rarity] || 0) + 1;
    attackSum += pet.attack;
    healthSum += pet.health;
    speedSum += pet.speed;
  }
  
  stats.avgAttack = attackSum / pets.length;
  stats.avgHealth = healthSum / pets.length;
  stats.avgSpeed = speedSum / pets.length;
  
  return stats;
}

