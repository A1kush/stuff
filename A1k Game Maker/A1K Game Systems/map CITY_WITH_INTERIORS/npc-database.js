/**
 * NPC DATABASE - Complete Hireable NPC System
 * Ranks: E, D, C, B, A, S
 * Types: Warrior, Mage, Archer, Merchant, Healer, Rogue, Tank, Crafter
 * Features: Hireable allies, dialogue, missions, combat
 */

// ========== RANK CONFIGURATION ==========
const NPC_RANK_CONFIG = {
  E: {
    label: "E-Rank",
    color: "#9CA3AF", // Gray
    hireCost: 100,
    statMultiplier: { hp: 0.6, atk: 0.6, def: 0.6, speed: 0.8 },
    skillSlots: 1,
    bodyScale: 0.9,
    auraColor: "rgba(156, 163, 175, 0.3)"
  },
  D: {
    label: "D-Rank",
    color: "#86EFAC", // Light Green
    hireCost: 250,
    statMultiplier: { hp: 0.8, atk: 0.8, def: 0.7, speed: 0.9 },
    skillSlots: 1,
    bodyScale: 1.0,
    auraColor: "rgba(134, 239, 172, 0.4)"
  },
  C: {
    label: "C-Rank",
    color: "#60A5FA", // Blue
    hireCost: 500,
    statMultiplier: { hp: 1.0, atk: 1.0, def: 1.0, speed: 1.0 },
    skillSlots: 2,
    bodyScale: 1.1,
    auraColor: "rgba(96, 165, 250, 0.5)"
  },
  B: {
    label: "B-Rank",
    color: "#A78BFA", // Purple
    hireCost: 1000,
    statMultiplier: { hp: 1.3, atk: 1.3, def: 1.2, speed: 1.1 },
    skillSlots: 2,
    bodyScale: 1.15,
    auraColor: "rgba(167, 139, 250, 0.6)"
  },
  A: {
    label: "A-Rank",
    color: "#FBBF24", // Gold
    hireCost: 2500,
    statMultiplier: { hp: 1.7, atk: 1.7, def: 1.5, speed: 1.2 },
    skillSlots: 3,
    bodyScale: 1.25,
    auraColor: "rgba(251, 191, 36, 0.7)"
  },
  S: {
    label: "S-Rank",
    color: "#F87171", // Red
    hireCost: 5000,
    statMultiplier: { hp: 2.2, atk: 2.2, def: 2.0, speed: 1.4 },
    skillSlots: 4,
    bodyScale: 1.35,
    auraColor: "rgba(248, 113, 113, 0.8)"
  }
};

// ========== NPC TYPE TEMPLATES ==========
const NPC_TYPE_TEMPLATES = {
  warrior: {
    name: "Warrior",
    icon: "⚔️",
    baseStats: { hp: 150, atk: 30, def: 20, speed: 100 },
    bodyType: "muscular",
    headType: "human",
    weapon: "sword",
    armorType: "heavy",
    primaryColor: "#DC2626",
    secondaryColor: "#991B1B",
    personality: "brave",
    dialogue: {
      greet: ["Need a sword arm?", "Ready for battle!", "Let's fight together!"],
      hire: ["I'll join your cause for {cost} gold.", "My blade is yours for {cost} gold."],
      reject: ["Too expensive? Find another warrior.", "I don't work for free."],
      fight: ["You dare challenge me?!", "Prepare yourself!"],
      mission: ["I've got a monster to slay nearby.", "Help me clear the bandit camp."]
    },
    skills: ["Power Strike", "Shield Bash", "War Cry"]
  },
  
  mage: {
    name: "Mage",
    icon: "🔮",
    baseStats: { hp: 100, atk: 40, def: 10, speed: 90 },
    bodyType: "slim",
    headType: "elf",
    weapon: "staff",
    armorType: "robe",
    primaryColor: "#7C3AED",
    secondaryColor: "#5B21B6",
    personality: "wise",
    dialogue: {
      greet: ["The arcane flows strong here.", "Seeking magical assistance?", "Knowledge has a price."],
      hire: ["My magic costs {cost} gold.", "For {cost} gold, I'll lend my power."],
      reject: ["Insufficient funds for my services.", "Magic isn't cheap."],
      fight: ["You'll regret this folly!", "Taste my wrath!"],
      mission: ["Ancient ruins need exploring.", "Collect magical essence for me."]
    },
    skills: ["Fireball", "Ice Shield", "Lightning Bolt", "Teleport"]
  },

  archer: {
    name: "Archer",
    icon: "🏹",
    baseStats: { hp: 120, atk: 35, def: 12, speed: 130 },
    bodyType: "athletic",
    headType: "human",
    weapon: "bow",
    armorType: "light",
    primaryColor: "#059669",
    secondaryColor: "#047857",
    personality: "calm",
    dialogue: {
      greet: ["My arrows never miss.", "Need a sharpshooter?", "I hit from afar."],
      hire: ["{cost} gold and I'm in.", "My bow is yours for {cost} gold."],
      reject: ["Not worth my time.", "Find another archer."],
      fight: ["Bad move, friend.", "You're in my sights."],
      mission: ["Hunt the beast in the forest.", "Eliminate the sniper on the roof."]
    },
    skills: ["Multi-Shot", "Poison Arrow", "Snipe"]
  },

  healer: {
    name: "Healer",
    icon: "💚",
    baseStats: { hp: 110, atk: 15, def: 15, speed: 95 },
    bodyType: "slim",
    headType: "angelic",
    weapon: "wand",
    armorType: "robe",
    primaryColor: "#10B981",
    secondaryColor: "#059669",
    personality: "kind",
    dialogue: {
      greet: ["May light guide you.", "Need healing?", "I restore hope."],
      hire: ["I'll heal your party for {cost} gold.", "My services cost {cost} gold."],
      reject: ["I cannot help without payment.", "Healing takes energy."],
      fight: ["Violence is not my way!", "I defend myself!"],
      mission: ["Gather healing herbs.", "Cure the sick villagers."]
    },
    skills: ["Heal", "Purify", "Regeneration", "Revive"]
  },

  rogue: {
    name: "Rogue",
    icon: "🗡️",
    baseStats: { hp: 130, atk: 38, def: 8, speed: 150 },
    bodyType: "slim",
    headType: "human",
    weapon: "dagger",
    armorType: "light",
    primaryColor: "#6B7280",
    secondaryColor: "#374151",
    personality: "sly",
    dialogue: {
      greet: ["Looking for stealth?", "I work in shadows.", "Quick and deadly."],
      hire: ["{cost} gold upfront.", "My skills aren't free. {cost} gold."],
      reject: ["Too cheap for my talents.", "I don't do charity."],
      fight: ["You made a mistake.", "You won't see me coming."],
      mission: ["Steal from the guild vault.", "Assassinate the corrupt noble."]
    },
    skills: ["Backstab", "Smoke Bomb", "Critical Strike", "Evasion"]
  },

  tank: {
    name: "Tank",
    icon: "🛡️",
    baseStats: { hp: 200, atk: 25, def: 35, speed: 80 },
    bodyType: "bulky",
    headType: "orc",
    weapon: "shield",
    armorType: "heavy",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    personality: "stoic",
    dialogue: {
      greet: ["I am the wall.", "Need protection?", "None shall pass."],
      hire: ["{cost} gold and I'll shield you.", "Hire me for {cost} gold."],
      reject: ["Find another shield.", "Too poor for my defense."],
      fight: ["Break yourself upon me!", "I do not fall!"],
      mission: ["Defend the caravan.", "Hold the fortress gates."]
    },
    skills: ["Taunt", "Iron Wall", "Counter", "Fortify"]
  },

  merchant: {
    name: "Merchant",
    icon: "💰",
    baseStats: { hp: 100, atk: 10, def: 10, speed: 100 },
    bodyType: "average",
    headType: "human",
    weapon: "none",
    armorType: "cloth",
    primaryColor: "#F59E0B",
    secondaryColor: "#D97706",
    personality: "greedy",
    dialogue: {
      greet: ["Welcome! Looking to trade?", "Best prices in town!", "What can I sell you?"],
      hire: ["Ridiculous! I don't fight!", "I'm a merchant, not a warrior!"],
      reject: ["No deal!", "Come back with more gold."],
      fight: ["Guards! GUARDS!", "You'll regret robbing me!"],
      mission: ["Deliver this package.", "Collect my debt from that thief."]
    },
    skills: ["Bribe", "Escape", "Gold Throw"],
    cannotHire: true // Merchants don't join party
  },

  crafter: {
    name: "Crafter",
    icon: "⚒️",
    baseStats: { hp: 120, atk: 20, def: 18, speed: 85 },
    bodyType: "stocky",
    headType: "dwarf",
    weapon: "hammer",
    armorType: "medium",
    primaryColor: "#8B5CF6",
    secondaryColor: "#6D28D9",
    personality: "proud",
    dialogue: {
      greet: ["Quality craftsmanship here.", "Need repairs?", "I forge the finest gear."],
      hire: ["For {cost} gold, I'll join you.", "My hammer is yours for {cost} gold."],
      reject: ["Not enough for my skills.", "I'm a master, not a novice."],
      fight: ["My hammer speaks!", "Forged in battle!"],
      mission: ["Mine rare ore for me.", "Bring me dragon scales."]
    },
    skills: ["Hammer Strike", "Forge Weapon", "Repair"]
  }
};

// ========== NPC GENERATOR ==========
function generateNPC(type, rank, id) {
  const template = NPC_TYPE_TEMPLATES[type];
  const rankConfig = NPC_RANK_CONFIG[rank];
  const mult = rankConfig.statMultiplier;

  return {
    id: id || `npc_${type}_${rank}_${Date.now()}`,
    type: type,
    rank: rank,
    name: `${template.name} (${rankConfig.label})`,
    displayName: template.name,
    icon: template.icon,
    
    // Combat Stats
    hp: Math.floor(template.baseStats.hp * mult.hp),
    maxHp: Math.floor(template.baseStats.hp * mult.hp),
    atk: Math.floor(template.baseStats.atk * mult.atk),
    def: Math.floor(template.baseStats.def * mult.def),
    speed: Math.floor(template.baseStats.speed * mult.speed),
    
    // Hiring
    hireCost: rankConfig.hireCost,
    hired: false,
    canHire: !template.cannotHire,
    
    // Visual Data
    bodyType: template.bodyType,
    headType: template.headType,
    weapon: template.weapon,
    armorType: template.armorType,
    primaryColor: template.primaryColor,
    secondaryColor: template.secondaryColor,
    rankColor: rankConfig.color,
    bodyScale: rankConfig.bodyScale,
    auraColor: rankConfig.auraColor,
    // Rendering style (from Character Mixer)
    renderStyle: 'pixel', // pixel, vector, glitch, watercolor, hologram
    outline: 2, // Outline width for pixel style
    
    // Behavior
    personality: template.personality,
    dialogue: template.dialogue,
    hostile: false,
    aggressive: false,
    
    // Skills
    skills: template.skills.slice(0, rankConfig.skillSlots),
    
    // Position & State
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    direction: 'down',
    state: 'idle', // idle, walk, attack, dead
    animFrame: 0,
    
    // AI
    target: null,
    aiMode: 'idle', // idle, follow, attack, flee
    lastAttackTime: 0,
    attackCooldown: 2000
  };
}

// ========== PERSONALITY TRAITS ==========
const NPC_PERSONALITIES = {
  brave: { attackChance: 0.8, fleeThreshold: 0.2, talkStyle: "bold" },
  wise: { attackChance: 0.5, fleeThreshold: 0.4, talkStyle: "formal" },
  calm: { attackChance: 0.6, fleeThreshold: 0.3, talkStyle: "measured" },
  kind: { attackChance: 0.3, fleeThreshold: 0.5, talkStyle: "gentle" },
  sly: { attackChance: 0.7, fleeThreshold: 0.2, talkStyle: "cunning" },
  stoic: { attackChance: 0.6, fleeThreshold: 0.1, talkStyle: "brief" },
  greedy: { attackChance: 0.4, fleeThreshold: 0.6, talkStyle: "merchant" },
  proud: { attackChance: 0.7, fleeThreshold: 0.3, talkStyle: "boastful" }
};

// ========== PRESET NPCs FOR SPAWNING ==========
const PRESET_NPCS = {
  // E-Rank NPCs (Common, cheap)
  rookie_warrior: () => generateNPC('warrior', 'E', 'npc_rookie_warrior'),
  novice_mage: () => generateNPC('mage', 'E', 'npc_novice_mage'),
  trainee_archer: () => generateNPC('archer', 'E', 'npc_trainee_archer'),
  
  // D-Rank NPCs
  guard: () => generateNPC('warrior', 'D', 'npc_guard'),
  apprentice_mage: () => generateNPC('mage', 'D', 'npc_apprentice_mage'),
  hunter: () => generateNPC('archer', 'D', 'npc_hunter'),
  
  // C-Rank NPCs (Average)
  knight: () => generateNPC('warrior', 'C', 'npc_knight'),
  wizard: () => generateNPC('mage', 'C', 'npc_wizard'),
  ranger: () => generateNPC('archer', 'C', 'npc_ranger'),
  cleric: () => generateNPC('healer', 'C', 'npc_cleric'),
  thief: () => generateNPC('rogue', 'C', 'npc_thief'),
  
  // B-Rank NPCs (Strong)
  champion: () => generateNPC('warrior', 'B', 'npc_champion'),
  archmage: () => generateNPC('mage', 'B', 'npc_archmage'),
  sniper: () => generateNPC('archer', 'B', 'npc_sniper'),
  bishop: () => generateNPC('healer', 'B', 'npc_bishop'),
  fortress: () => generateNPC('tank', 'B', 'npc_fortress'),
  
  // A-Rank NPCs (Elite)
  hero: () => generateNPC('warrior', 'A', 'npc_hero'),
  sage: () => generateNPC('mage', 'A', 'npc_sage'),
  deadeye: () => generateNPC('archer', 'A', 'npc_deadeye'),
  high_priest: () => generateNPC('healer', 'A', 'npc_high_priest'),
  shadow: () => generateNPC('rogue', 'A', 'npc_shadow'),
  
  // S-Rank NPCs (Legendary)
  legend: () => generateNPC('warrior', 'S', 'npc_legend'),
  grand_wizard: () => generateNPC('mage', 'S', 'npc_grand_wizard'),
  hawkeye: () => generateNPC('archer', 'S', 'npc_hawkeye'),
  saint: () => generateNPC('healer', 'S', 'npc_saint'),
  immortal: () => generateNPC('tank', 'S', 'npc_immortal'),
  
  // Non-combat NPCs
  shop_merchant: () => generateNPC('merchant', 'C', 'npc_shop_merchant'),
  blacksmith: () => generateNPC('crafter', 'B', 'npc_blacksmith')
};

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NPC_RANK_CONFIG,
    NPC_TYPE_TEMPLATES,
    NPC_PERSONALITIES,
    PRESET_NPCS,
    generateNPC
  };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
  window.NPC_RANK_CONFIG = NPC_RANK_CONFIG;
  window.NPC_TYPE_TEMPLATES = NPC_TYPE_TEMPLATES;
  window.NPC_PERSONALITIES = NPC_PERSONALITIES;
  window.PRESET_NPCS = PRESET_NPCS;
  window.generateNPC = generateNPC;
}
