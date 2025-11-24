// src/spirits/AbilityRegistry.js
// Complete Supernatural Ability Registry - 7 active/passive abilities with visual effects

export const ABILITY_REGISTRY = {
  // ACTIVE ABILITIES (5)

  // 1. DIVINE BARRIER
  divine_barrier: {
    id: "divine_barrier",
    name: "Divine Barrier",
    type: "active",
    category: "defensive",
    cooldown: 12000, // 12 seconds
    duration: 4000, // 4 seconds
    manaCost: 0,
    description:
      "Creates a protective shield that reduces incoming damage by 30%",
    icon: "🛡️",
    color: "#7b61ff",
    secondaryColor: "#2EA8FF",
    bonuses: {
      damageTakenMul: 0.7, // 30% damage reduction
    },
    visualEffect: "shield_ring",
    particles: "protective_aura",
    soundEffect: "divine_cast",
    castTime: 0,
    affectsSelf: true,
  },

  // 2. ANGELIC MIGHT
  angelic_might: {
    id: "angelic_might",
    name: "Angelic Might",
    type: "active",
    category: "offensive",
    cooldown: 15000, // 15 seconds
    duration: 5000, // 5 seconds
    manaCost: 0,
    description: "Channels angelic power to increase attack damage by 25%",
    icon: "⚔️",
    color: "#ffd56a",
    secondaryColor: "#ff6b35",
    bonuses: {
      atkMul: 0.25, // +25% attack
    },
    visualEffect: "power_aura",
    particles: "ascending_light",
    soundEffect: "angel_cast",
    castTime: 0,
    affectsSelf: true,
  },

  // 3. DASH NOVA
  dash_nova: {
    id: "dash_nova",
    name: "Dash Nova",
    type: "active",
    category: "mobility",
    cooldown: 9000, // 9 seconds
    duration: 200, // 0.2 seconds burst
    manaCost: 0,
    description:
      "Explosive dash forward with invincibility frames and damage wave",
    icon: "💨",
    color: "#60a5fa",
    secondaryColor: "#e0e7ff",
    bonuses: {},
    visualEffect: "speed_burst",
    particles: "afterimages",
    soundEffect: "dash_whoosh",
    castTime: 0,
    affectsSelf: true,
    dashSpeed: 800,
    invulnerable: true,
    dealsDamage: true,
    damage: 50,
  },

  // 4. RADIANT BURST
  radiant_burst: {
    id: "radiant_burst",
    name: "Radiant Burst",
    type: "active",
    category: "offensive",
    cooldown: 11000, // 11 seconds
    duration: 400, // 0.4 seconds
    manaCost: 0,
    description:
      "Release a burst of radiant energy dealing area damage and boosting attack",
    icon: "✨",
    color: "#ffd56a",
    secondaryColor: "#fff7d1",
    bonuses: {
      atkMul: 0.1, // +10% attack
    },
    visualEffect: "explosion_wave",
    particles: "light_rays",
    soundEffect: "radiant_explosion",
    castTime: 0,
    affectsSelf: true,
    dealsDamage: true,
    damage: 80,
    aoeRadius: 150,
  },

  // 5. FLAME DASH
  flame_dash: {
    id: "flame_dash",
    name: "Flame Dash",
    type: "active",
    category: "mobility",
    cooldown: 9000, // 9 seconds
    duration: 200, // 0.2 seconds burst
    manaCost: 0,
    description:
      "Dash forward in a trail of flames, leaving burning damage behind",
    icon: "🔥",
    color: "#ff6b35",
    secondaryColor: "#fbbf24",
    bonuses: {},
    visualEffect: "fire_trail",
    particles: "ember_trail",
    soundEffect: "flame_whoosh",
    castTime: 0,
    affectsSelf: true,
    dashSpeed: 800,
    dealsDamage: true,
    damage: 40,
    leavesTrail: true,
    trailDuration: 2000,
    trailDamage: 15,
  },

  // PASSIVE ABILITIES (2)

  // 6. AURA OF FORTUNE
  aura_of_fortune: {
    id: "aura_of_fortune",
    name: "Aura of Fortune",
    type: "passive",
    category: "utility",
    cooldown: 0,
    duration: 0, // always active
    manaCost: 0,
    description:
      "Permanently increases luck, improving critical hit chance and drop rates",
    icon: "🍀",
    color: "#ffbf3b",
    secondaryColor: "#ffd56a",
    bonuses: {
      luck: 10, // +10 luck
    },
    visualEffect: "luck_sparkles",
    particles: "golden_shimmer",
    soundEffect: null,
    castTime: 0,
    affectsSelf: true,
    alwaysActive: true,
  },

  // 7. IRON WILL
  iron_will: {
    id: "iron_will",
    name: "Iron Will",
    type: "passive",
    category: "defensive",
    cooldown: 0,
    duration: 0, // always active
    manaCost: 0,
    description: "Hardens resolve, permanently reducing incoming damage by 10%",
    icon: "🛡️",
    color: "#94a3b8",
    secondaryColor: "#cbd5e1",
    bonuses: {
      damageTakenMul: 0.9, // 10% damage reduction
    },
    visualEffect: "steel_aura",
    particles: "defensive_glow",
    soundEffect: null,
    castTime: 0,
    affectsSelf: true,
    alwaysActive: true,
  },
};

// Ability categories
export const ABILITY_CATEGORIES = {
  offensive: { name: "Offensive", icon: "⚔️", color: "#ff6b35" },
  defensive: { name: "Defensive", icon: "🛡️", color: "#60a5fa" },
  mobility: { name: "Mobility", icon: "💨", color: "#a78bfa" },
  utility: { name: "Utility", icon: "✨", color: "#fbbf24" },
};

// Ability types
export const ABILITY_TYPES = {
  active: { name: "Active", description: "Activated with cooldown" },
  passive: { name: "Passive", description: "Always active" },
};

// Helper functions
export function getAbility(id) {
  return ABILITY_REGISTRY[id] || null;
}

export function getAllAbilities() {
  return Object.values(ABILITY_REGISTRY);
}

export function getActiveAbilities() {
  return Object.values(ABILITY_REGISTRY).filter((a) => a.type === "active");
}

export function getPassiveAbilities() {
  return Object.values(ABILITY_REGISTRY).filter((a) => a.type === "passive");
}

export function getAbilitiesByCategory(category) {
  return Object.values(ABILITY_REGISTRY).filter((a) => a.category === category);
}

export function getCooldownSeconds(ability) {
  return ability.cooldown ? ability.cooldown / 1000 : 0;
}

export function getDurationSeconds(ability) {
  return ability.duration ? ability.duration / 1000 : 0;
}
