/**
 * ShopItems.js
 * Complete registry of all shop items
 * Extracted from A1K Runner game
 */

export const SHOP_ITEMS = [
  // ============================================
  // CONSUMABLES
  // ============================================
  {
    id: "hp_potion",
    name: "HP Potion",
    description: "Heals 40% leader HP.",
    cost: 60,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "rage_pill",
    name: "Rage Pill",
    description: "Grants +30 Rage to party.",
    cost: 90,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "revive_token",
    name: "Revive Token",
    description: "Instantly revives one defeated hero.",
    cost: 80,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "wave_skip",
    name: "Wave Skip",
    description: "Skips the current wave.",
    cost: 100,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "stage_skip",
    name: "Stage Skip",
    description: "Skips the current stage.",
    cost: 500,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "boss_skip_pass",
    name: "Boss Skip Pass",
    description: "Skips to the next boss.",
    cost: 1000,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "treasure_box_boss_pass",
    name: "Treasure Box Boss Pass",
    description: "Unlocks a special treasure boss.",
    cost: 2000,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "ap_reset",
    name: "AP Reset",
    description: "Refund all spent AP.",
    cost: 400,
    type: "consumable",
    category: "consumable",
  },

  // ============================================
  // CONTAINERS AND MISC
  // ============================================
  {
    id: "gold_bag",
    name: "Gold Bag",
    description: "Open for 500-5000 gold.",
    cost: 300,
    type: "item",
    category: "misc",
  },
  {
    id: "big_gold_bag",
    name: "Big Gold Bag",
    description: "Open for 2000-10000 gold.",
    cost: 1200,
    type: "item",
    category: "misc",
  },
  {
    id: "gear_kit",
    name: "Random Gear Kit",
    description: "Adds 3 random gear pieces.",
    cost: 250,
    type: "item",
    category: "gear",
  },
  {
    id: "pet_box",
    name: "Pet Box",
    description: "Contains a random pet.",
    cost: 500,
    type: "item",
    category: "misc",
  },
  {
    id: "vehicle_box",
    name: "Vehicle Box",
    description: "Contains a random vehicle.",
    cost: 750,
    type: "item",
    category: "misc",
  },
  {
    id: "super_equipment_pack",
    name: "Super Equipment Pack",
    description: "Contains B-A rank gear.",
    cost: 1500,
    type: "item",
    category: "gear",
  },
  {
    id: "big_box",
    name: "Big Box",
    description: "Contains 3 random items, 1 pet, 1 vehicle, and 1 set of A-C gear.",
    cost: 3000,
    type: "item",
    category: "misc",
  },

  // ============================================
  // ARMOR PIECES
  // ============================================
  {
    id: "vanguard_armor",
    name: "Vanguard Armor",
    description: "Sturdy armor boosting DEF by 50.",
    cost: 500,
    type: "gear",
    category: "armor",
    slot: "armor",
    def: 50,
    set: "Vanguard",
  },
  {
    id: "mystic_robes",
    name: "Mystic Robes",
    description: "Robes boosting DEF by 40 and MP.",
    cost: 600,
    type: "gear",
    category: "armor",
    slot: "armor",
    def: 40,
    mp: 50,
    set: "Mystic",
  },
  {
    id: "shadow_cloak",
    name: "Shadow Cloak",
    description: "Increases evasion and stealth.",
    cost: 700,
    type: "gear",
    category: "armor",
    slot: "armor",
    def: 30,
    evasion: 15,
    set: "Shadow",
  },
  {
    id: "dragon_plate",
    name: "Dragon Plate",
    description: "Heavy armor with fire resistance.",
    cost: 800,
    type: "gear",
    category: "armor",
    slot: "armor",
    def: 80,
    resistance: 20,
    set: "Dragon",
  },
  {
    id: "guardian_mail",
    name: "Guardian Mail",
    description: "Protective chainmail with health boost.",
    cost: 650,
    type: "gear",
    category: "armor",
    slot: "armor",
    def: 60,
    hp: 100,
    set: "Guardian",
  },

  // ============================================
  // SPELL SCROLLS
  // ============================================
  {
    id: "spell_scroll_fireball",
    name: "Spell Scroll: Fireball",
    description: "Learn the Fireball skill.",
    cost: 400,
    type: "scroll",
    category: "scroll",
    use: "learn_fireball",
  },
  {
    id: "spell_scroll_heal",
    name: "Spell Scroll: Heal",
    description: "Learn the Heal skill.",
    cost: 500,
    type: "scroll",
    category: "scroll",
    use: "learn_heal",
  },
  {
    id: "spell_scroll_lightning",
    name: "Spell Scroll: Lightning",
    description: "Learn the Lightning Bolt skill.",
    cost: 600,
    type: "scroll",
    category: "scroll",
    use: "learn_lightning",
  },
  {
    id: "spell_scroll_ice_nova",
    name: "Spell Scroll: Ice Nova",
    description: "Learn the Ice Nova skill.",
    cost: 550,
    type: "scroll",
    category: "scroll",
    use: "learn_ice_nova",
  },
  {
    id: "spell_scroll_meteor",
    name: "Spell Scroll: Meteor",
    description: "Learn the Meteor skill.",
    cost: 800,
    type: "scroll",
    category: "scroll",
    use: "learn_meteor",
  },
  {
    id: "spell_scroll_teleport",
    name: "Spell Scroll: Teleport",
    description: "Learn the Teleport skill.",
    cost: 700,
    type: "scroll",
    category: "scroll",
    use: "learn_teleport",
  },
  {
    id: "spell_scroll_shield",
    name: "Spell Scroll: Shield",
    description: "Learn the Magic Shield skill.",
    cost: 450,
    type: "scroll",
    category: "scroll",
    use: "learn_shield",
  },
  {
    id: "spell_scroll_summon",
    name: "Spell Scroll: Summon",
    description: "Learn the Summon Ally skill.",
    cost: 900,
    type: "scroll",
    category: "scroll",
    use: "learn_summon",
  },

  // ============================================
  // PREMIUM S-RANK GEAR
  // ============================================
  {
    id: "aether_greatblade",
    name: "Aether Greatblade",
    description: "Legendary blade imbued with cosmic power.",
    cost: 5000,
    type: "gear",
    category: "srank",
    slot: "weapon",
    atk: 55,
    rank: "S",
  },
  {
    id: "starlit_carapace",
    name: "Starlit Carapace",
    description: "Radiant armor forged from starlight.",
    cost: 5000,
    type: "gear",
    category: "srank",
    slot: "armor",
    def: 60,
    rank: "S",
  },
  {
    id: "celestial_loop",
    name: "Celestial Loop",
    description: "Ring that channels celestial energy.",
    cost: 5000,
    type: "gear",
    category: "srank",
    slot: "accessory",
    atk: 65,
    rank: "S",
  },
  {
    id: "void_reaper",
    name: "Void Reaper",
    description: "Scythe that tears through reality.",
    cost: 6000,
    type: "gear",
    category: "srank",
    slot: "weapon",
    atk: 75,
    critDamage: 50,
    rank: "S",
  },
  {
    id: "eternal_crown",
    name: "Eternal Crown",
    description: "Crown of immortal kings.",
    cost: 5500,
    type: "gear",
    category: "srank",
    slot: "helmet",
    def: 45,
    mp: 200,
    rank: "S",
  },
  {
    id: "phoenix_wings",
    name: "Phoenix Wings",
    description: "Wings of rebirth and flame.",
    cost: 7000,
    type: "gear",
    category: "srank",
    slot: "back",
    atk: 40,
    def: 40,
    revival: true,
    rank: "S",
  },
  {
    id: "infinity_gauntlet",
    name: "Infinity Gauntlet",
    description: "Ultimate power in physical form.",
    cost: 10000,
    type: "gear",
    category: "srank",
    slot: "gloves",
    atk: 100,
    allStats: 50,
    rank: "S",
  },

  // ============================================
  // WEAPONS
  // ============================================
  {
    id: "iron_sword",
    name: "Iron Sword",
    description: "Basic iron sword.",
    cost: 150,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 10,
    rank: "C",
  },
  {
    id: "steel_blade",
    name: "Steel Blade",
    description: "Sturdy steel weapon.",
    cost: 300,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 20,
    rank: "B",
  },
  {
    id: "mithril_edge",
    name: "Mithril Edge",
    description: "Lightweight but powerful.",
    cost: 600,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 35,
    rank: "A",
  },
  {
    id: "battle_axe",
    name: "Battle Axe",
    description: "Heavy weapon with high damage.",
    cost: 400,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 30,
    critDamage: 20,
    rank: "B",
  },
  {
    id: "crystal_staff",
    name: "Crystal Staff",
    description: "Amplifies magical power.",
    cost: 500,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 25,
    mp: 100,
    rank: "B",
  },
  {
    id: "twin_daggers",
    name: "Twin Daggers",
    description: "Fast dual-wield weapons.",
    cost: 450,
    type: "gear",
    category: "gear",
    slot: "weapon",
    atk: 22,
    speed: 30,
    rank: "B",
  },

  // ============================================
  // ACCESSORIES
  // ============================================
  {
    id: "strength_ring",
    name: "Strength Ring",
    description: "Increases attack power.",
    cost: 200,
    type: "gear",
    category: "gear",
    slot: "accessory",
    atk: 8,
    rank: "C",
  },
  {
    id: "vitality_amulet",
    name: "Vitality Amulet",
    description: "Increases maximum health.",
    cost: 250,
    type: "gear",
    category: "gear",
    slot: "accessory",
    hp: 80,
    rank: "C",
  },
  {
    id: "mana_pendant",
    name: "Mana Pendant",
    description: "Increases magical energy.",
    cost: 220,
    type: "gear",
    category: "gear",
    slot: "accessory",
    mp: 60,
    rank: "C",
  },
  {
    id: "lucky_charm",
    name: "Lucky Charm",
    description: "Boosts luck and item drops.",
    cost: 300,
    type: "gear",
    category: "gear",
    slot: "accessory",
    luck: 20,
    rank: "B",
  },
  {
    id: "speed_boots",
    name: "Speed Boots",
    description: "Increases movement speed.",
    cost: 280,
    type: "gear",
    category: "gear",
    slot: "boots",
    speed: 25,
    rank: "B",
  },
  {
    id: "defense_bracers",
    name: "Defense Bracers",
    description: "Protective arm guards.",
    cost: 260,
    type: "gear",
    category: "gear",
    slot: "bracers",
    def: 25,
    rank: "B",
  },

  // ============================================
  // SPECIAL ITEMS
  // ============================================
  {
    id: "experience_potion",
    name: "Experience Potion",
    description: "Grants bonus XP for limited time.",
    cost: 350,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "rare_candy",
    name: "Rare Candy",
    description: "Instantly gain one level.",
    cost: 1000,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "skill_reset",
    name: "Skill Reset Orb",
    description: "Reset all learned skills.",
    cost: 800,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "evolution_stone",
    name: "Evolution Stone",
    description: "Evolve a pet or companion.",
    cost: 2000,
    type: "item",
    category: "misc",
  },
  {
    id: "enchant_scroll",
    name: "Enchant Scroll",
    description: "Upgrade gear to next rank.",
    cost: 1500,
    type: "item",
    category: "misc",
  },
  {
    id: "soul_gem",
    name: "Soul Gem",
    description: "Capture and summon spirits.",
    cost: 1200,
    type: "item",
    category: "misc",
  },
  {
    id: "warp_crystal",
    name: "Warp Crystal",
    description: "Teleport to any cleared stage.",
    cost: 600,
    type: "consumable",
    category: "consumable",
  },
  {
    id: "fortune_cookie",
    name: "Fortune Cookie",
    description: "Random buff or reward.",
    cost: 100,
    type: "consumable",
    category: "consumable",
  },

  // ============================================
  // SUPERNATURAL & SPIRIT ITEMS (ESSENCE)
  // ============================================
  {
    id: "essence_small",
    name: "Small Essence Vial",
    description: "Contains 5 pure essence for spirit upgrades.",
    cost: 200,
    type: "consumable",
    category: "supernatural",
    currency: "gold",
    essenceAmount: 5,
  },
  {
    id: "essence_medium",
    name: "Medium Essence Flask",
    description: "Contains 15 essence. Glows with ethereal energy.",
    cost: 500,
    type: "consumable",
    category: "supernatural",
    currency: "gold",
    essenceAmount: 15,
  },
  {
    id: "essence_large",
    name: "Large Essence Crystal",
    description: "Contains 40 essence. Radiates power.",
    cost: 1200,
    type: "consumable",
    category: "supernatural",
    currency: "gold",
    essenceAmount: 40,
  },
  {
    id: "spirit_summon_scroll",
    name: "Spirit Summon Scroll",
    description: "Summon a random spirit companion.",
    cost: 50,
    type: "consumable",
    category: "supernatural",
    currency: "essence",
    use: "summon_spirit",
  },
  {
    id: "ability_unlock_token",
    name: "Supernatural Ability Token",
    description: "Unlock a random supernatural ability.",
    cost: 80,
    type: "consumable",
    category: "supernatural",
    currency: "essence",
    use: "unlock_ability",
  },
  {
    id: "spirit_evolution_catalyst",
    name: "Evolution Catalyst",
    description: "Boost spirit trait max levels by +1.",
    cost: 150,
    type: "consumable",
    category: "supernatural",
    currency: "essence",
    use: "boost_spirit_traits",
  },
  {
    id: "essence_pack_premium",
    name: "Essence Pack (Premium)",
    description: "Bundle: 100 Essence + random spirit.",
    cost: 2500,
    type: "item",
    category: "supernatural",
    currency: "gold",
    essenceAmount: 100,
    bonusSpirit: true,
  },

  // ============================================
  // EXPERIENCE PACKS (PLAYER LEVEL)
  // ============================================
  {
    id: "exp_pack_small",
    name: "Small EXP Pack",
    description: "Grants 500 experience points.",
    cost: 300,
    type: "consumable",
    category: "consumable",
    expAmount: 500,
  },
  {
    id: "exp_pack_medium",
    name: "Medium EXP Pack",
    description: "Grants 1500 experience points.",
    cost: 800,
    type: "consumable",
    category: "consumable",
    expAmount: 1500,
  },
  {
    id: "exp_pack_large",
    name: "Large EXP Pack",
    description: "Grants 5000 experience points.",
    cost: 2000,
    type: "consumable",
    category: "consumable",
    expAmount: 5000,
  },
  {
    id: "exp_pack_mega",
    name: "Mega EXP Pack",
    description: "Grants 15000 experience points. Instant level up!",
    cost: 5000,
    type: "consumable",
    category: "consumable",
    expAmount: 15000,
  },

  // ============================================
  // LOW-LEVEL CORES (E, D, C, B RANKS)
  // ============================================
  // E-RANK CORES (Starter)
  {
    id: "core_ember",
    name: "Ember Core",
    description: "E-Rank: Tiny fire sparks every 5s. Basic starter core.",
    cost: 100,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "E",
    rarity: "E",
    icon: "🔥",
    weaponSkill: {
      name: "Fire Spark",
      cooldown: 5000,
      damage: 20,
      range: 60,
    },
    passiveEffects: ["+2% fire damage"],
  },
  {
    id: "core_frost",
    name: "Frost Core",
    description: "E-Rank: Icy mist slows nearby enemies. Beginner core.",
    cost: 100,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "E",
    rarity: "E",
    icon: "❄️",
    weaponSkill: {
      name: "Frost Mist",
      cooldown: 5000,
      damage: 18,
      range: 50,
    },
    passiveEffects: ["+5% slow effect"],
  },
  {
    id: "core_spark",
    name: "Spark Core",
    description: "E-Rank: Electric zaps for minimal damage. Training core.",
    cost: 100,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "E",
    rarity: "E",
    icon: "⚡",
    weaponSkill: {
      name: "Static Zap",
      cooldown: 4500,
      damage: 22,
      range: 70,
    },
    passiveEffects: ["+3% attack speed"],
  },

  // D-RANK CORES (Low-tier)
  {
    id: "core_stone",
    name: "Stone Core",
    description: "D-Rank: Rock shards for defense. +10 HP.",
    cost: 250,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "D",
    rarity: "D",
    icon: "🪨",
    weaponSkill: {
      name: "Rock Shard",
      cooldown: 4000,
      damage: 35,
      range: 80,
    },
    passiveEffects: ["+10 HP", "+3% defense"],
  },
  {
    id: "core_wind",
    name: "Wind Core",
    description: "D-Rank: Wind gust pushes enemies back.",
    cost: 250,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "D",
    rarity: "D",
    icon: "💨",
    weaponSkill: {
      name: "Wind Gust",
      cooldown: 4200,
      damage: 30,
      range: 100,
    },
    passiveEffects: ["+5% movement speed"],
  },
  {
    id: "core_shadow",
    name: "Shadow Core",
    description: "D-Rank: Dark pulse with lifesteal.",
    cost: 280,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "D",
    rarity: "D",
    icon: "🌑",
    weaponSkill: {
      name: "Shadow Pulse",
      cooldown: 4500,
      damage: 40,
      range: 75,
    },
    passiveEffects: ["+2% lifesteal"],
  },

  // MORE C-RANK VARIETY
  {
    id: "core_nature",
    name: "Nature Core",
    description: "C-Rank: Vine whip with healing aura.",
    cost: 500,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "C",
    rarity: "C",
    icon: "🌿",
    weaponSkill: {
      name: "Vine Whip",
      cooldown: 4000,
      damage: 55,
      range: 90,
    },
    passiveEffects: ["+1 HP regen/sec", "+5% heal effectiveness"],
  },
  {
    id: "core_poison",
    name: "Poison Core",
    description: "C-Rank: Toxic cloud inflicts damage over time.",
    cost: 550,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "C",
    rarity: "C",
    icon: "☠️",
    weaponSkill: {
      name: "Poison Cloud",
      cooldown: 4500,
      damage: 45,
      range: 85,
    },
    passiveEffects: ["+10% DoT damage", "Poison on hit (3s)"],
  },

  // MORE B-RANK VARIETY
  {
    id: "core_plasma",
    name: "Plasma Core",
    description: "B-Rank: High-energy plasma burst.",
    cost: 1000,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "B",
    rarity: "B",
    icon: "⚛️",
    weaponSkill: {
      name: "Plasma Burst",
      cooldown: 3500,
      damage: 90,
      range: 110,
    },
    passiveEffects: ["+8% energy damage", "+5% crit chance"],
  },
  {
    id: "core_lunar",
    name: "Lunar Core",
    description: "B-Rank: Moonlight beam with multi-hit.",
    cost: 1100,
    type: "core",
    category: "gear",
    slot: "core",
    rank: "B",
    rarity: "B",
    icon: "🌙",
    weaponSkill: {
      name: "Lunar Beam",
      cooldown: 3800,
      damage: 85,
      range: 120,
    },
    passiveEffects: ["+10% damage at night", "+6% accuracy"],
  },

  // ============================================
  // CORE PACK
  // ============================================
  {
    id: "core_starter_pack",
    name: "Core Starter Pack",
    description: "Contains 3 random low-level cores (E-D rank). Perfect for beginners!",
    cost: 400,
    type: "item",
    category: "misc",
    use: "open_core_pack",
    corePackType: "starter",
  },
];

export const SHOP_CATEGORIES = [
  { id: "all", cat: "all", label: "All", description: "View all shop items" },
  { id: "consumable", cat: "consumable", label: "Consumables", description: "Potions and temporary items" },
  { id: "gear", cat: "gear", label: "Gear", description: "Weapons and equipment" },
  { id: "armor", cat: "armor", label: "Armor", description: "Defensive equipment" },
  { id: "scroll", cat: "scroll", label: "Scrolls", description: "Skill learning scrolls" },
  { id: "srank", cat: "srank", label: "S Rank", description: "Legendary premium items" },
  { id: "supernatural", cat: "supernatural", label: "Supernatural", description: "Essence & spirit items" },
  { id: "misc", cat: "misc", label: "Misc", description: "Miscellaneous items" },
];

/**
 * Get item by ID
 */
export function getItem(itemId) {
  return SHOP_ITEMS.find(item => item.id === itemId) || null;
}

/**
 * Get items by category
 */
export function getItemsByCategory(category) {
  if (!category || category === 'all') {
    return SHOP_ITEMS;
  }
  return SHOP_ITEMS.filter(item => item.category === category);
}

/**
 * Get items by type
 */
export function getItemsByType(type) {
  return SHOP_ITEMS.filter(item => item.type === type);
}

/**
 * Get items in price range
 */
export function getItemsByPriceRange(min, max) {
  return SHOP_ITEMS.filter(item => item.cost >= min && item.cost <= max);
}

/**
 * Shop statistics
 */
export const SHOP_STATS = {
  totalItems: SHOP_ITEMS.length,
  categories: SHOP_CATEGORIES.length,
  consumables: SHOP_ITEMS.filter(i => i.category === 'consumable').length,
  gear: SHOP_ITEMS.filter(i => i.category === 'gear').length,
  armor: SHOP_ITEMS.filter(i => i.category === 'armor').length,
  scrolls: SHOP_ITEMS.filter(i => i.category === 'scroll').length,
  srank: SHOP_ITEMS.filter(i => i.category === 'srank').length,
  misc: SHOP_ITEMS.filter(i => i.category === 'misc').length,
  priceRange: {
    min: Math.min(...SHOP_ITEMS.map(i => i.cost)),
    max: Math.max(...SHOP_ITEMS.map(i => i.cost)),
  }
};

export default {
  SHOP_ITEMS,
  SHOP_CATEGORIES,
  getItem,
  getItemsByCategory,
  getItemsByType,
  getItemsByPriceRange,
  SHOP_STATS
};

