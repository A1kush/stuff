// 🧟 ZOMBIES DATABASE
// 12 zombie variants with infection mechanics and horde behaviors
// Walkers (3), Tanks (3), Special (6)

export const ZOMBIES_DATABASE = {
  // ============= WALKERS (3) =============
  
  zombie_slow: {
    id: "zombie_slow",
    name: "Shambler",
    category: "walker",
    tier: "C",
    element: "dark",
    hp: 150,
    atk: 25,
    def: 5,
    speed: 40,
    size: 30,
    attackRange: 50,
    attackType: "melee",
    behavior: "shamble",
    biteChance: 0.15,
    infectionDamage: 5,
    infectionDuration: 10000,
    xp: 15,
    gold: 5,
    sprite: { shape: "zombie", color: "#2e7d32", glow: "#388e3c", decay: "heavy" },
    abilities: ["infectious_bite"],
    hordeBonus: { damage: 1.1, speed: 1.05 },
    description: "Slow but relentless undead creature",
  },

  zombie_standard: {
    id: "zombie_standard",
    name: "Walker",
    category: "walker",
    tier: "C",
    element: "dark",
    hp: 180,
    atk: 30,
    def: 8,
    speed: 65,
    size: 32,
    attackRange: 55,
    attackType: "melee",
    behavior: "chase",
    biteChance: 0.20,
    infectionDamage: 8,
    infectionDuration: 8000,
    xp: 18,
    gold: 7,
    sprite: { shape: "zombie", color: "#388e3c", glow: "#4caf50", decay: "moderate" },
    abilities: ["infectious_bite", "grab"],
    hordeBonus: { damage: 1.15, speed: 1.10 },
    description: "Standard zombie with infectious bite",
  },

  zombie_fast: {
    id: "zombie_fast",
    name: "Runner",
    category: "walker",
    tier: "B",
    element: "dark",
    hp: 140,
    atk: 35,
    def: 6,
    speed: 130,
    size: 28,
    attackRange: 50,
    attackType: "melee",
    behavior: "sprint_chase",
    biteChance: 0.25,
    infectionDamage: 10,
    infectionDuration: 6000,
    xp: 22,
    gold: 10,
    sprite: { shape: "zombie_lean", color: "#4caf50", glow: "#66bb6a", decay: "light" },
    abilities: ["infectious_bite", "pounce", "dodge"],
    hordeBonus: { damage: 1.20, speed: 1.15 },
    description: "Fast-moving infected with deadly pounce",
  },

  // ============= TANKS (3) =============

  zombie_armored: {
    id: "zombie_armored",
    name: "Armored Zombie",
    category: "tank",
    tier: "B",
    element: "dark",
    hp: 400,
    atk: 40,
    def: 35,
    speed: 50,
    size: 42,
    attackRange: 70,
    attackType: "melee",
    behavior: "advance",
    biteChance: 0.18,
    infectionDamage: 12,
    infectionDuration: 10000,
    xp: 40,
    gold: 20,
    sprite: { shape: "zombie_large", color: "#616161", glow: "#388e3c", armor: true, decay: "moderate" },
    abilities: ["infectious_bite", "shield_bash", "armor"],
    hordeBonus: { damage: 1.12, def: 1.15 },
    description: "Zombie with rusted armor plating",
  },

  zombie_brute: {
    id: "zombie_brute",
    name: "Brute",
    category: "tank",
    tier: "A",
    element: "dark",
    hp: 600,
    atk: 60,
    def: 40,
    speed: 55,
    size: 52,
    attackRange: 80,
    attackType: "melee",
    behavior: "charge",
    biteChance: 0.20,
    infectionDamage: 15,
    infectionDuration: 12000,
    xp: 60,
    gold: 35,
    sprite: { shape: "zombie_massive", color: "#424242", glow: "#4caf50", muscles: true, decay: "heavy" },
    abilities: ["infectious_bite", "ground_slam", "rage"],
    hordeBonus: { damage: 1.18, hp: 1.20 },
    description: "Massive mutated zombie with incredible strength",
  },

  zombie_juggernaut: {
    id: "zombie_juggernaut",
    name: "Juggernaut",
    category: "tank",
    tier: "S",
    element: "dark",
    hp: 1000,
    atk: 80,
    def: 60,
    speed: 45,
    size: 64,
    attackRange: 100,
    attackType: "melee",
    behavior: "unstoppable",
    biteChance: 0.22,
    infectionDamage: 20,
    infectionDuration: 15000,
    xp: 100,
    gold: 60,
    sprite: { shape: "zombie_titan", color: "#212121", glow: "#2e7d32", mutations: true, decay: "extreme" },
    abilities: ["infectious_bite", "rampage", "thick_skin", "regenerate"],
    hordeBonus: { damage: 1.25, hp: 1.30, def: 1.20 },
    description: "Nearly unstoppable tank zombie",
  },

  // ============= SPECIAL (6) =============

  zombie_exploder: {
    id: "zombie_exploder",
    name: "Exploder",
    category: "special",
    tier: "B",
    element: "fire",
    hp: 200,
    atk: 15,
    def: 5,
    speed: 70,
    size: 34,
    attackRange: 60,
    attackType: "suicide",
    behavior: "rush_explode",
    biteChance: 0.10,
    explosionRadius: 120,
    explosionDamage: 150,
    infectionSpreadRadius: 100,
    xp: 35,
    gold: 15,
    sprite: { shape: "zombie_bloated", color: "#ff6b35", glow: "#ffb347", bulging: true, decay: "explosive" },
    abilities: ["suicide_explosion", "infectious_cloud"],
    hordeBonus: { explosion: 1.30 },
    description: "Bloated zombie that explodes on contact",
  },

  zombie_spitter: {
    id: "zombie_spitter",
    name: "Spitter",
    category: "special",
    tier: "B",
    element: "nature",
    hp: 160,
    atk: 45,
    def: 8,
    speed: 75,
    size: 32,
    attackRange: 250,
    attackType: "ranged",
    behavior: "kite",
    biteChance: 0.12,
    acidDamage: 35,
    acidDOT: 5,
    acidDuration: 5000,
    xp: 32,
    gold: 16,
    sprite: { shape: "zombie_distorted", color: "#4caf50", glow: "#8bc34a", jaw: "enlarged", decay: "chemical" },
    abilities: ["acid_spit", "poison_cloud"],
    hordeBonus: { range: 1.20, damage: 1.15 },
    description: "Spits corrosive acid from afar",
  },

  zombie_screamer: {
    id: "zombie_screamer",
    name: "Screamer",
    category: "special",
    tier: "A",
    element: "dark",
    hp: 140,
    atk: 20,
    def: 6,
    speed: 85,
    size: 30,
    attackRange: 300,
    attackType: "support",
    behavior: "buff_allies",
    biteChance: 0.08,
    screamRadius: 300,
    buffDuration: 8000,
    buffAmount: 1.30,
    xp: 45,
    gold: 22,
    sprite: { shape: "zombie_thin", color: "#9c27b0", glow: "#ba68c8", mouth: "gaping", decay: "skeletal" },
    abilities: ["ear_splitting_scream", "summon_horde", "buff_allies"],
    hordeBonus: { buff: 1.40 },
    description: "Screams to buff nearby zombies",
  },

  zombie_crawler: {
    id: "zombie_crawler",
    name: "Crawler",
    category: "special",
    tier: "B",
    element: "dark",
    hp: 100,
    atk: 50,
    def: 4,
    speed: 95,
    size: 24,
    attackRange: 45,
    attackType: "melee",
    behavior: "ambush_low",
    biteChance: 0.30,
    infectionDamage: 15,
    infectionDuration: 5000,
    xp: 28,
    gold: 14,
    sprite: { shape: "zombie_crawling", color: "#5d4037", glow: "#388e3c", legless: true, decay: "severe" },
    abilities: ["infectious_bite", "stealth", "leg_grab"],
    hordeBonus: { damage: 1.25, stealth: 1.50 },
    description: "Crawls low to the ground for ambush",
  },

  zombie_bloater: {
    id: "zombie_bloater",
    name: "Bloater",
    category: "special",
    tier: "A",
    element: "nature",
    hp: 450,
    atk: 35,
    def: 25,
    speed: 45,
    size: 48,
    attackRange: 70,
    attackType: "melee",
    behavior: "tank_support",
    biteChance: 0.15,
    gasRadius: 150,
    gasDamage: 20,
    gasDuration: 8000,
    xp: 55,
    gold: 28,
    sprite: { shape: "zombie_grotesque", color: "#689f38", glow: "#9ccc65", bloated: true, decay: "gaseous" },
    abilities: ["toxic_gas", "infectious_bite", "explode_on_death"],
    hordeBonus: { hp: 1.30, gas: 1.40 },
    description: "Releases toxic gas that poisons enemies",
  },

  zombie_hunter: {
    id: "zombie_hunter",
    name: "Hunter",
    category: "special",
    tier: "S",
    element: "dark",
    hp: 220,
    atk: 90,
    def: 15,
    speed: 150,
    size: 34,
    attackRange: 60,
    attackType: "melee",
    behavior: "assassin",
    biteChance: 0.35,
    infectionDamage: 25,
    infectionDuration: 4000,
    backstabMultiplier: 3.0,
    xp: 75,
    gold: 40,
    sprite: { shape: "zombie_feral", color: "#d32f2f", glow: "#f44336", claws: true, decay: "minimal" },
    abilities: ["infectious_bite", "pounce", "stealth", "backstab", "leap"],
    hordeBonus: { damage: 1.40, speed: 1.25 },
    description: "Highly evolved hunter zombie with enhanced abilities",
  },
};

// Infection mechanics
export const INFECTION_MECHANICS = {
  baseChance: 0.15,
  damagePerTick: 5,
  tickInterval: 1000,
  spreadRadius: 80,
  conversionTime: 30000,
  cureItems: ["antidote", "holy_water"],
  
  // Modifiers based on zombie type
  typeModifiers: {
    walker: 1.0,
    tank: 1.2,
    special: 1.5,
  },

  // Progression stages
  stages: [
    { time: 0, name: "Bite", damage: 5, slow: 0 },
    { time: 10000, name: "Infected", damage: 8, slow: 0.1 },
    { time: 20000, name: "Turning", damage: 12, slow: 0.25 },
    { time: 30000, name: "Converted", damage: 0, slow: 0, zombie: true },
  ],
};

// Horde mechanics
export const HORDE_MECHANICS = {
  // Horde bonuses activate when X+ zombies are within Y range
  minHordeSize: 5,
  hordeRadius: 200,
  
  // Bonuses scale with horde size
  bonusPerZombie: {
    damage: 0.03,
    speed: 0.02,
    def: 0.02,
    hp: 0.04,
  },
  
  maxBonuses: {
    damage: 1.50,
    speed: 1.30,
    def: 1.30,
    hp: 1.50,
  },

  // Coordination behaviors
  packTactics: true,
  surroundTarget: true,
  callReinforcements: true,
};

// Helper functions
export function getZombieById(id) {
  return ZOMBIES_DATABASE[id] || null;
}

export function getZombiesByCategory(category) {
  return Object.values(ZOMBIES_DATABASE).filter(z => z.category === category);
}

export function getWalkers() {
  return getZombiesByCategory("walker");
}

export function getTanks() {
  return getZombiesByCategory("tank");
}

export function getSpecialZombies() {
  return getZombiesByCategory("special");
}

export function getAllZombies() {
  return Object.values(ZOMBIES_DATABASE);
}

export function calculateHordeBonuses(hordeSize) {
  if (hordeSize < HORDE_MECHANICS.minHordeSize) return {};
  
  const bonuses = {};
  const effectiveSize = Math.min(hordeSize, 20);
  
  for (const [stat, bonus] of Object.entries(HORDE_MECHANICS.bonusPerZombie)) {
    const calculated = 1 + (bonus * effectiveSize);
    bonuses[stat] = Math.min(calculated, HORDE_MECHANICS.maxBonuses[stat]);
  }
  
  return bonuses;
}

export function getInfectionStage(infectionTime) {
  const stages = INFECTION_MECHANICS.stages;
  for (let i = stages.length - 1; i >= 0; i--) {
    if (infectionTime >= stages[i].time) {
      return stages[i];
    }
  }
  return stages[0];
}

console.log("🧟 Zombies Database loaded: " + Object.keys(ZOMBIES_DATABASE).length + " variants");

