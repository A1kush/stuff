/**
 * HPC DATABASE - Hireable Playable Characters Database
 * Defines all characters available for hire with costs, stats, and abilities
 */

// Hire costs by rank (increased from NPC system for HPC)
const HPC_HIRE_COSTS = {
  E: 500,   // E-Rank: 500 gold
  D: 1000,  // D-Rank: 1000 gold
  C: 2500,  // C-Rank: 2500 gold
  B: 5000,  // B-Rank: 5000 gold
  A: 10000, // A-Rank: 10000 gold
  S: 25000  // S-Rank: 25000 gold
};

// Base stats multipliers for HPCs (slightly better than NPCs)
const HPC_STAT_MULTIPLIERS = {
  E: { hp: 0.7, atk: 0.7, def: 0.7, speed: 0.9 },
  D: { hp: 0.9, atk: 0.9, def: 0.8, speed: 1.0 },
  C: { hp: 1.1, atk: 1.1, def: 1.1, speed: 1.1 },
  B: { hp: 1.4, atk: 1.4, def: 1.3, speed: 1.2 },
  A: { hp: 1.8, atk: 1.8, def: 1.6, speed: 1.3 },
  S: { hp: 2.3, atk: 2.3, def: 2.1, speed: 1.5 }
};

// Character type base stats
const HPC_TYPE_BASE_STATS = {
  warrior: { hp: 150, atk: 30, def: 20, speed: 100 },
  mage: { hp: 100, atk: 40, def: 10, speed: 90 },
  archer: { hp: 120, atk: 35, def: 12, speed: 130 },
  healer: { hp: 110, atk: 15, def: 15, speed: 95 },
  rogue: { hp: 130, atk: 38, def: 8, speed: 150 },
  tank: { hp: 200, atk: 25, def: 35, speed: 80 },
  crafter: { hp: 120, atk: 20, def: 18, speed: 85 }
};

// Skills by type and rank
const HPC_SKILLS = {
  warrior: {
    E: ['Power Strike'],
    D: ['Power Strike', 'Shield Bash'],
    C: ['Power Strike', 'Shield Bash', 'War Cry'],
    B: ['Power Strike', 'Shield Bash', 'War Cry', 'Berserker Rage'],
    A: ['Power Strike', 'Shield Bash', 'War Cry', 'Berserker Rage', 'Whirlwind'],
    S: ['Power Strike', 'Shield Bash', 'War Cry', 'Berserker Rage', 'Whirlwind', 'Ultimate Slash']
  },
  mage: {
    E: ['Fireball'],
    D: ['Fireball', 'Ice Shield'],
    C: ['Fireball', 'Ice Shield', 'Lightning Bolt'],
    B: ['Fireball', 'Ice Shield', 'Lightning Bolt', 'Teleport'],
    A: ['Fireball', 'Ice Shield', 'Lightning Bolt', 'Teleport', 'Meteor'],
    S: ['Fireball', 'Ice Shield', 'Lightning Bolt', 'Teleport', 'Meteor', 'Arcane Mastery']
  },
  archer: {
    E: ['Multi-Shot'],
    D: ['Multi-Shot', 'Poison Arrow'],
    C: ['Multi-Shot', 'Poison Arrow', 'Snipe'],
    B: ['Multi-Shot', 'Poison Arrow', 'Snipe', 'Rain of Arrows'],
    A: ['Multi-Shot', 'Poison Arrow', 'Snipe', 'Rain of Arrows', 'Piercing Shot'],
    S: ['Multi-Shot', 'Poison Arrow', 'Snipe', 'Rain of Arrows', 'Piercing Shot', 'Arrow Storm']
  },
  healer: {
    E: ['Heal'],
    D: ['Heal', 'Purify'],
    C: ['Heal', 'Purify', 'Regeneration'],
    B: ['Heal', 'Purify', 'Regeneration', 'Revive'],
    A: ['Heal', 'Purify', 'Regeneration', 'Revive', 'Mass Heal'],
    S: ['Heal', 'Purify', 'Regeneration', 'Revive', 'Mass Heal', 'Divine Blessing']
  },
  rogue: {
    E: ['Backstab'],
    D: ['Backstab', 'Smoke Bomb'],
    C: ['Backstab', 'Smoke Bomb', 'Critical Strike'],
    B: ['Backstab', 'Smoke Bomb', 'Critical Strike', 'Evasion'],
    A: ['Backstab', 'Smoke Bomb', 'Critical Strike', 'Evasion', 'Shadow Step'],
    S: ['Backstab', 'Smoke Bomb', 'Critical Strike', 'Evasion', 'Shadow Step', 'Assassinate']
  },
  tank: {
    E: ['Taunt'],
    D: ['Taunt', 'Iron Wall'],
    C: ['Taunt', 'Iron Wall', 'Counter'],
    B: ['Taunt', 'Iron Wall', 'Counter', 'Fortify'],
    A: ['Taunt', 'Iron Wall', 'Counter', 'Fortify', 'Shield Bash'],
    S: ['Taunt', 'Iron Wall', 'Counter', 'Fortify', 'Shield Bash', 'Unbreakable']
  },
  crafter: {
    E: ['Hammer Strike'],
    D: ['Hammer Strike', 'Forge Weapon'],
    C: ['Hammer Strike', 'Forge Weapon', 'Repair'],
    B: ['Hammer Strike', 'Forge Weapon', 'Repair', 'Enhance'],
    A: ['Hammer Strike', 'Forge Weapon', 'Repair', 'Enhance', 'Masterwork'],
    S: ['Hammer Strike', 'Forge Weapon', 'Repair', 'Enhance', 'Masterwork', 'Legendary Forge']
  }
};

// Character descriptions
const HPC_DESCRIPTIONS = {
  warrior: {
    E: "A rookie warrior eager to prove themselves in battle. Basic combat skills but high potential.",
    D: "An experienced warrior with solid combat fundamentals. Reliable in most situations.",
    C: "A skilled warrior who has seen many battles. Strong offense and defense.",
    B: "A veteran warrior with exceptional combat prowess. Can turn the tide of battle.",
    A: "An elite warrior known across the land. Master of multiple fighting styles.",
    S: "A legendary warrior whose name strikes fear in enemies. Unmatched in combat."
  },
  mage: {
    E: "A novice mage just learning the arcane arts. Basic spells but growing power.",
    D: "A capable mage with a good grasp of elemental magic. Useful in combat.",
    C: "A skilled mage with diverse spell knowledge. Powerful magical attacks.",
    B: "A master mage with deep arcane understanding. Devastating spell combinations.",
    A: "An archmage of legendary power. Can reshape reality with their magic.",
    S: "A legendary sorcerer who has transcended mortal limits. Reality bends to their will."
  },
  archer: {
    E: "A trainee archer learning to hit targets. Basic ranged attacks.",
    D: "A competent archer with good accuracy. Reliable ranged support.",
    C: "A skilled archer with deadly precision. Excellent at picking off enemies.",
    B: "A master archer who never misses. Can eliminate threats from afar.",
    A: "An elite archer with legendary accuracy. Arrows find their mark every time.",
    S: "A legendary archer whose arrows pierce through anything. Death from above."
  },
  healer: {
    E: "A novice healer learning restoration magic. Basic healing abilities.",
    D: "A capable healer who can keep the party alive. Essential support.",
    C: "A skilled healer with strong restoration magic. Keeps party healthy.",
    B: "A master healer with powerful healing spells. Can revive fallen allies.",
    A: "An elite healer with divine healing powers. Can bring back the dead.",
    S: "A legendary healer touched by the divine. Death itself cannot stop their healing."
  },
  rogue: {
    E: "A beginner rogue learning stealth and deception. Basic sneak attacks.",
    D: "A capable rogue with good stealth skills. Useful for scouting and ambushes.",
    C: "A skilled rogue who strikes from the shadows. Deadly critical hits.",
    B: "A master rogue with exceptional stealth. Can assassinate high-value targets.",
    A: "An elite rogue whose name is whispered in fear. Death comes unseen.",
    S: "A legendary assassin who has never failed a contract. The perfect killer."
  },
  tank: {
    E: "A rookie tank learning to protect others. Basic defensive skills.",
    D: "A capable tank who can absorb damage. Reliable frontline defense.",
    C: "A skilled tank with strong defensive abilities. Protects the party well.",
    B: "A master tank who is nearly unbreakable. Can hold the line against anything.",
    A: "An elite tank with legendary defenses. An impenetrable wall.",
    S: "A legendary tank whose shield has never been broken. The ultimate protector."
  },
  crafter: {
    E: "A novice crafter learning the trade. Basic crafting abilities.",
    D: "A capable crafter who can make useful items. Good for equipment.",
    C: "A skilled crafter with quality workmanship. Creates good gear.",
    B: "A master crafter who creates excellent equipment. Valuable for upgrades.",
    A: "An elite crafter with legendary skills. Can forge masterwork items.",
    S: "A legendary smith whose creations are works of art. Forges items of legend."
  }
};

/**
 * Generate HPC data for a character
 * @param {string} type - Character type (warrior, mage, etc.)
 * @param {string} rank - Character rank (E, D, C, B, A, S)
 * @returns {Object} HPC character data
 */
function generateHPCData(type, rank) {
  const baseStats = HPC_TYPE_BASE_STATS[type] || HPC_TYPE_BASE_STATS.warrior;
  const multipliers = HPC_STAT_MULTIPLIERS[rank] || HPC_STAT_MULTIPLIERS.E;
  const skills = HPC_SKILLS[type]?.[rank] || HPC_SKILLS.warrior.E;
  const description = HPC_DESCRIPTIONS[type]?.[rank] || "A capable adventurer.";
  const hireCost = HPC_HIRE_COSTS[rank] || HPC_HIRE_COSTS.E;

  const hpcId = `${type}_${rank.toLowerCase()}`;
  const rankLabels = {
    E: 'E-Rank', D: 'D-Rank', C: 'C-Rank',
    B: 'B-Rank', A: 'A-Rank', S: 'S-Rank'
  };

  return {
    id: hpcId,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} (${rankLabels[rank]})`,
    displayName: type.charAt(0).toUpperCase() + type.slice(1),
    type: type,
    rank: rank,
    hireCost: hireCost,
    baseStats: {
      hp: Math.floor(baseStats.hp * multipliers.hp),
      atk: Math.floor(baseStats.atk * multipliers.atk),
      def: Math.floor(baseStats.def * multipliers.def),
      speed: Math.floor(baseStats.speed * multipliers.speed)
    },
    skills: skills,
    description: description,
    unlockRequirement: null, // Can add unlock requirements later
    icon: getIconForType(type),
    color: getColorForRank(rank)
  };
}

/**
 * Get icon for character type
 */
function getIconForType(type) {
  const icons = {
    warrior: '⚔️',
    mage: '🔮',
    archer: '🏹',
    healer: '💚',
    rogue: '🗡️',
    tank: '🛡️',
    crafter: '⚒️'
  };
  return icons[type] || '👤';
}

/**
 * Get color for rank
 */
function getColorForRank(rank) {
  const colors = {
    E: '#9CA3AF', // Gray
    D: '#86EFAC', // Light Green
    C: '#60A5FA', // Blue
    B: '#A78BFA', // Purple
    A: '#FBBF24', // Gold
    S: '#F87171'  // Red
  };
  return colors[rank] || '#9CA3AF';
}

/**
 * Get all available HPCs
 * @returns {Array} Array of all HPC data
 */
function getAllHPCs() {
  const types = ['warrior', 'mage', 'archer', 'healer', 'rogue', 'tank', 'crafter'];
  const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
  const allHPCs = [];

  types.forEach(type => {
    ranks.forEach(rank => {
      allHPCs.push(generateHPCData(type, rank));
    });
  });

  return allHPCs;
}

/**
 * Get HPC by ID
 * @param {string} hpcId - HPC ID (e.g., 'warrior_e')
 * @returns {Object|null} HPC data or null
 */
function getHPCById(hpcId) {
  const [type, rank] = hpcId.split('_');
  if (!type || !rank) return null;
  return generateHPCData(type, rank.toUpperCase());
}

/**
 * Get HPCs by type
 * @param {string} type - Character type
 * @returns {Array} Array of HPCs of that type
 */
function getHPCsByType(type) {
  const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
  return ranks.map(rank => generateHPCData(type, rank));
}

/**
 * Get HPCs by rank
 * @param {string} rank - Character rank
 * @returns {Array} Array of HPCs of that rank
 */
function getHPCsByRank(rank) {
  const types = ['warrior', 'mage', 'archer', 'healer', 'rogue', 'tank', 'crafter'];
  return types.map(type => generateHPCData(type, rank));
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.HPCDatabase = {
    getAllHPCs,
    getHPCById,
    getHPCsByType,
    getHPCsByRank,
    generateHPCData,
    HIRE_COSTS: HPC_HIRE_COSTS,
    STAT_MULTIPLIERS: HPC_STAT_MULTIPLIERS
  };
}

