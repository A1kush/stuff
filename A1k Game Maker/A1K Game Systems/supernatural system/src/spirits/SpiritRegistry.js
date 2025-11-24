// src/spirits/SpiritRegistry.js
// Complete Spirit Companion Registry - 7 ethereal spirits with bonuses and abilities

export const SPIRIT_REGISTRY = {
  // 1. DARK SOUL
  dark_soul: {
    id: "dark_soul",
    name: "Dark Soul",
    icon: "🜏",
    type: "Dark Energy",
    element: "dark",
    power: 85,
    level: 1,
    rarity: "rare",
    description:
      "A dark energy spirit that enhances offensive power through shadow energy",
    color: "#7c3aed",
    secondaryColor: "#a78bfa",
    glowColor: "#8b5cf6",
    bonuses: {
      atkMul: 0.06, // +6% attack
    },
    orbitSpeed: 2.5,
    orbitRadius: 60,
    particleType: "shadow",
    attackType: "dark_bolt",
    attackDamage: 30,
    attackCooldown: 2500,
    width: 24,
    height: 24,
  },

  // 2. LIGHT SOUL
  light_soul: {
    id: "light_soul",
    name: "Light Soul",
    icon: "☀️",
    type: "Light Energy",
    element: "light",
    power: 90,
    level: 1,
    rarity: "rare",
    description:
      "A radiant light spirit that grants protective health and slow-fall abilities",
    color: "#ffd56a",
    secondaryColor: "#fff7d1",
    glowColor: "#ffe89d",
    bonuses: {
      hpFlat: 60, // +60 HP
    },
    orbitSpeed: 3.0,
    orbitRadius: 55,
    particleType: "light_ray",
    attackType: "light_beam",
    attackDamage: 25,
    attackCooldown: 2000,
    specialPassive: "slow_fall", // reduces fall speed
    width: 26,
    height: 26,
  },

  // 3. GOLDEN SPIRIT
  golden_spirit: {
    id: "golden_spirit",
    name: "Golden Spirit",
    icon: "✶",
    type: "Gold Energy",
    element: "gold",
    power: 75,
    level: 1,
    rarity: "uncommon",
    description:
      "A fortunate spirit that increases gold collection and attracts nearby treasures",
    color: "#ffbf3b",
    secondaryColor: "#ffd56a",
    glowColor: "#ffe89d",
    bonuses: {
      goldGain: 0.15, // +15% gold
    },
    orbitSpeed: 2.0,
    orbitRadius: 50,
    particleType: "sparkle",
    attackType: "gold_shard",
    attackDamage: 20,
    attackCooldown: 3000,
    specialPassive: "gold_magnet", // attracts pickups
    width: 22,
    height: 22,
  },

  // 4. TECH ESSENCE
  tech_essence: {
    id: "tech_essence",
    name: "Tech Essence",
    icon: "⚡",
    type: "Tech Energy",
    element: "tech",
    power: 80,
    level: 1,
    rarity: "rare",
    description:
      "A technological spirit core that boosts movement speed and reaction time",
    color: "#3ec5ff",
    secondaryColor: "#7dd3fc",
    glowColor: "#38bdf8",
    bonuses: {
      speedMul: 0.05, // +5% speed
    },
    orbitSpeed: 4.0,
    orbitRadius: 65,
    particleType: "energy",
    attackType: "tech_pulse",
    attackDamage: 35,
    attackCooldown: 2200,
    specialPassive: "speed_boost", // periodic speed bursts
    width: 24,
    height: 24,
  },

  // 5. STORM WISP
  storm_wisp: {
    id: "storm_wisp",
    name: "Storm Wisp",
    icon: "🌩️",
    type: "Sky Energy",
    element: "storm",
    power: 92,
    level: 1,
    rarity: "epic",
    description:
      "A powerful storm spirit combining attack power and speed with chain lightning",
    color: "#60a5fa",
    secondaryColor: "#e0e7ff",
    glowColor: "#818cf8",
    bonuses: {
      atkMul: 0.08, // +8% attack
      speedMul: 0.03, // +3% speed
    },
    orbitSpeed: 3.5,
    orbitRadius: 70,
    particleType: "lightning",
    attackType: "chain_lightning",
    attackDamage: 40,
    attackCooldown: 2800,
    specialPassive: "glide", // reduced air friction
    canChainAttack: true,
    width: 28,
    height: 28,
  },

  // 6. GUARDIAN SAND
  guardian_sand: {
    id: "guardian_sand",
    name: "Guardian Sand",
    icon: "⏳",
    type: "Earth Ward",
    element: "earth",
    power: 88,
    level: 1,
    rarity: "epic",
    description:
      "An ancient earth guardian that reduces incoming damage through protective barriers",
    color: "#d97706",
    secondaryColor: "#fbbf24",
    glowColor: "#f59e0b",
    bonuses: {
      damageTakenMul: 0.85, // 15% damage reduction
    },
    orbitSpeed: 1.8,
    orbitRadius: 45,
    particleType: "sand",
    attackType: "earth_spike",
    attackDamage: 28,
    attackCooldown: 3500,
    specialPassive: "earth_shield", // damage absorption
    width: 26,
    height: 26,
  },

  // 7. EMBER FOX
  ember_fox: {
    id: "ember_fox",
    name: "Ember Fox",
    icon: "🦊",
    type: "Blaze Spirit",
    element: "fire",
    power: 94,
    level: 1,
    rarity: "legendary",
    description:
      "A legendary fire fox spirit granting attack power and luck through blazing trails",
    color: "#ff6b35",
    secondaryColor: "#fbbf24",
    glowColor: "#fb923c",
    bonuses: {
      atkMul: 0.05, // +5% attack
      luck: 5, // +5 luck
    },
    orbitSpeed: 3.2,
    orbitRadius: 58,
    particleType: "ember",
    attackType: "fire_bolt",
    attackDamage: 45,
    attackCooldown: 2400,
    specialPassive: "burning_trail", // leaves fire damage
    width: 30,
    height: 30,
  },
};

// Spirit elements and categories
export const SPIRIT_ELEMENTS = {
  dark: { name: "Dark", color: "#7c3aed", icon: "🜏" },
  light: { name: "Light", color: "#ffd56a", icon: "☀️" },
  gold: { name: "Gold", color: "#ffbf3b", icon: "✶" },
  tech: { name: "Tech", color: "#3ec5ff", icon: "⚡" },
  storm: { name: "Storm", color: "#60a5fa", icon: "🌩️" },
  earth: { name: "Earth", color: "#d97706", icon: "⏳" },
  fire: { name: "Fire", color: "#ff6b35", icon: "🦊" },
};

export const SPIRIT_RARITIES = {
  uncommon: { name: "Uncommon", color: "#4CAF50", stars: "⭐⭐" },
  rare: { name: "Rare", color: "#3498db", stars: "⭐⭐⭐" },
  epic: { name: "Epic", color: "#9b59b6", stars: "⭐⭐⭐⭐" },
  legendary: { name: "Legendary", color: "#f39c12", stars: "⭐⭐⭐⭐⭐" },
};

// Helper functions
export function getSpirit(id) {
  return SPIRIT_REGISTRY[id] || null;
}

export function getAllSpirits() {
  return Object.values(SPIRIT_REGISTRY);
}

export function getSpiritsByElement(element) {
  return Object.values(SPIRIT_REGISTRY).filter((s) => s.element === element);
}

export function getSpiritsByRarity(rarity) {
  return Object.values(SPIRIT_REGISTRY).filter((s) => s.rarity === rarity);
}

export function getSpiritsByPower(minPower = 0) {
  return Object.values(SPIRIT_REGISTRY).filter((s) => s.power >= minPower);
}
