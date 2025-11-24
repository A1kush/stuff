// 🎮 RUNNER GAME BOSSES DATABASE
// Extracted from index.html and src/systems/boss-pools.js
// Contains: Gold Bosses, Gift Bosses, and Random Boss Pool System

// ═══════════════════════════════════════════════════════════════════════════
// GOLD BOSSES - Bosses that drop extra gold
// ═══════════════════════════════════════════════════════════════════════════

export const GOLD_BOSSES = [
  // Zone Boss from index.html line 28583
  {
    id: 'gold_boss_v',
    name: 'Gold Boss V',
    type: 'boss',
    category: 'gold',
    element: 'light',
    size: 64,
    hp: 8000,
    maxHp: 8000,
    atk: 120,
    def: 60,
    speed: 1.2,
    skill: 'coin_shower',
    abilities: ['coin_shower', 'gold_aura'],
    drops: {
      gold: 100000,
      guaranteed: ['gold_x1000'],
      possible: ['treasure_chest', 'gold_ingot']
    },
    sprite: {
      shape: 'humanoid',
      colors: ['#ffd700', '#ffed4e', '#d4af37'],
      effects: ['golden_shimmer', 'coin_particles']
    },
    description: 'A golden-armored boss that showers enemies with coins.',
    rank: 'S'
  },
  
  // From boss-pools.js lines 60-68
  {
    id: 'gilded_serpent',
    name: 'Gilded Serpent',
    type: 'boss',
    category: 'gold',
    element: 'neutral',
    size: 56,
    hpMul: 2.4,
    atkMul: 1.1,
    defMul: 1.0,
    goldMul: 8,
    speed: 1.3,
    abilities: ['serpent_coil', 'gold_spray'],
    drops: {
      goldMul: 8,
      possible: ['gold_bag', 'big_gold_bag', 'treasure_box']
    },
    sprite: {
      shape: 'serpent',
      colors: ['#ffd700', '#b8860b', '#daa520'],
      effects: ['slither_animation', 'gold_trail']
    },
    description: 'A serpentine creature covered in golden scales.',
    rank: 'A',
    pool: 'gold'
  },
  
  // From boss-pools.js lines 69-77
  {
    id: 'gold_knight',
    name: 'Gold Knight',
    type: 'boss',
    category: 'gold',
    element: 'light',
    size: 60,
    hpMul: 2.6,
    atkMul: 1.0,
    defMul: 1.2,
    goldMul: 6,
    speed: 1.0,
    abilities: ['shield_bash', 'gold_storm'],
    drops: {
      goldMul: 6,
      possible: ['legendary_armor', 'gold_knight_helmet', 'gold_sword']
    },
    sprite: {
      shape: 'humanoid',
      colors: ['#ffd700', '#b8860b', '#f0e68c'],
      effects: ['metallic_sheen', 'golden_aura']
    },
    description: 'A knight clad in pure gold armor.',
    rank: 'S',
    pool: 'gold'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// GIFT BOSSES - Special bosses from Gift Room challenge
// ═══════════════════════════════════════════════════════════════════════════

export const GIFT_BOSSES = [
  // Gift Room mini-bosses (index.html line 34739)
  {
    id: 'candy_king',
    name: 'Candy King',
    type: 'boss',
    category: 'gift',
    element: 'nature',
    size: 48,
    hp: 500,
    maxHp: 500,
    atk: 30,
    def: 15,
    speed: 1.1,
    abilities: ['sugar_rush', 'candy_cane_strike'],
    drops: {
      gold: 1000,
      goldRange: [1000, 3000],
      possible: ['candy', 'sugar_shard', 'gift']
    },
    sprite: {
      shape: 'humanoid',
      colors: ['#ff69b4', '#ff1493', '#ffb6c1'],
      effects: ['candy_sparkles', 'sweet_aura']
    },
    description: 'The ruler of candies, made of pure sugar.',
    rank: 'B',
    position: { x: 200, y: 230 }
  },
  
  {
    id: 'sugar_beast',
    name: 'Sugar Beast',
    type: 'boss',
    category: 'gift',
    element: 'nature',
    size: 52,
    hp: 720,
    maxHp: 720,
    atk: 40,
    def: 20,
    speed: 1.2,
    abilities: ['sweet_slam', 'sugar_coating'],
    drops: {
      gold: 1000,
      goldRange: [1000, 3000],
      possible: ['beast_fur', 'sugar_crystal', 'gift']
    },
    sprite: {
      shape: 'beast',
      colors: ['#ff69b4', '#c71585', '#db7093'],
      effects: ['sugar_dust', 'sweet_glow']
    },
    description: 'A ferocious beast made entirely of sugar.',
    rank: 'B',
    position: { x: 420, y: 230 }
  },
  
  {
    id: 'chocolate_golem',
    name: 'Chocolate Golem',
    type: 'boss',
    category: 'gift',
    element: 'earth',
    size: 56,
    hp: 940,
    maxHp: 940,
    atk: 50,
    def: 30,
    speed: 0.9,
    abilities: ['chocolate_smash', 'cocoa_shield'],
    drops: {
      gold: 1000,
      goldRange: [1000, 3000],
      possible: ['chocolate_bar', 'cocoa_powder', 'gift']
    },
    sprite: {
      shape: 'golem',
      colors: ['#8b4513', '#d2691e', '#a0522d'],
      effects: ['melting_drip', 'chocolate_aura']
    },
    description: 'A massive golem sculpted from dark chocolate.',
    rank: 'A',
    position: { x: 640, y: 230 }
  },
  
  {
    id: 'gummy_dragon',
    name: 'Gummy Dragon',
    type: 'boss',
    category: 'gift',
    element: 'wind',
    size: 60,
    hp: 1160,
    maxHp: 1160,
    atk: 60,
    def: 25,
    speed: 1.4,
    abilities: ['gummy_breath', 'sticky_bite', 'bounce_attack'],
    drops: {
      gold: 1000,
      goldRange: [1000, 3000],
      possible: ['gummy_scale', 'dragon_essence', 'gift']
    },
    sprite: {
      shape: 'dragon',
      colors: ['#32cd32', '#00ff00', '#7fff00'],
      effects: ['gummy_shine', 'bounce_motion']
    },
    description: 'A dragon made of colorful gummy candy.',
    rank: 'A',
    position: { x: 860, y: 230 }
  },
  
  // Gift King - Final Boss
  {
    id: 'gift_king',
    name: 'Gift King',
    type: 'boss',
    category: 'gift',
    element: 'light',
    size: 72,
    hp: 2500,
    maxHp: 2500,
    atk: 80,
    def: 40,
    speed: 1.3,
    abilities: ['present_barrage', 'ribbon_whip', 'gift_explosion', 'royal_blessing'],
    drops: {
      gold: 5000,
      goldRange: [5000, 10000],
      gems: 10,
      gemsRange: [10, 20],
      guaranteed: ['legendary_gift', 'gift_crown'],
      possible: ['s_box', 'ss_egg', 'treasure_chest']
    },
    sprite: {
      shape: 'humanoid',
      colors: ['#ffd700', '#ff1493', '#00ffff'],
      effects: ['rainbow_aura', 'gift_sparkles', 'crown_glow']
    },
    description: 'The supreme ruler of the Gift Room. Appears after defeating all mini-bosses.',
    rank: 'S',
    locked: true,
    position: { x: 520, y: 160 }
  },
  
  // Pool Gift Bosses (boss-pools.js lines 6-24)
  {
    id: 'gift_bearer',
    name: 'Gift Bearer',
    type: 'boss',
    category: 'gift',
    element: 'neutral',
    size: 48,
    hpMul: 2.2,
    atkMul: 1.1,
    defMul: 1.0,
    speed: 1.2,
    giftDrop: true,
    abilities: ['gift_toss', 'present_shield'],
    drops: {
      guaranteed: ['gift', 'giftBox'],
      possible: ['treasure_box', 'big_box', 's_box']
    },
    sprite: {
      shape: 'chest',
      colors: ['#ff69b4', '#ffd700', '#00ffff'],
      effects: ['gift_glow', 'ribbon_flutter']
    },
    description: 'A mysterious entity that carries precious gifts.',
    rank: 'B',
    pool: 'gift'
  },
  
  {
    id: 'treasure_phantom',
    name: 'Treasure Phantom',
    type: 'boss',
    category: 'gift',
    element: 'dark',
    size: 52,
    hpMul: 2.4,
    atkMul: 1.2,
    defMul: 0.95,
    speed: 1.5,
    giftDrop: true,
    abilities: ['phantom_strike', 'treasure_curse', 'teleport'],
    drops: {
      guaranteed: ['gift', 'giftBox'],
      possible: ['super_equipment_pack', 'gear_kit', 's_box']
    },
    sprite: {
      shape: 'ghost',
      colors: ['#9370db', '#8a2be2', '#4b0082'],
      effects: ['phantom_fade', 'treasure_glow']
    },
    description: 'A ghostly apparition guarding ancient treasures.',
    rank: 'A',
    pool: 'gift'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// RANDOM BOSS POOLS - BossPoolSystem pools for wave-based spawning
// ═══════════════════════════════════════════════════════════════════════════

export const RANDOM_BOSS_POOLS = {
  // Already included above
  gold: GOLD_BOSSES.filter(b => b.pool === 'gold'),
  gift: GIFT_BOSSES.filter(b => b.pool === 'gift'),
  
  // Silver Pool (boss-pools.js lines 79-88)
  silver: [
    {
      id: 'silver_phantom',
      name: 'Silver Phantom',
      type: 'boss',
      category: 'silver',
      element: 'wind',
      size: 48,
      hpMul: 1.9,
      atkMul: 1.3,
      defMul: 0.8,
      silverMul: 15,
      speed: 1.6,
      abilities: ['phantom_dash', 'silver_blade', 'afterimage'],
      drops: {
        silverMul: 15,
        possible: ['silver_coin', 'phantom_essence', 'speed_boots']
      },
      sprite: {
        shape: 'ghost',
        colors: ['#c0c0c0', '#d3d3d3', '#a9a9a9'],
        effects: ['silver_trail', 'speed_lines']
      },
      description: 'A swift phantom that leaves silver trails.',
      rank: 'A',
      pool: 'silver'
    }
  ],
  
  // Armor Pool (boss-pools.js lines 26-35)
  armor: [
    {
      id: 'plate_warden',
      name: 'Plate Warden',
      type: 'boss',
      category: 'armor',
      element: 'earth',
      size: 64,
      hpMul: 3.2,
      atkMul: 0.9,
      defMul: 2.2,
      armorDrop: true,
      speed: 0.8,
      abilities: ['fortress_stance', 'shield_wall', 'counter_attack'],
      drops: {
        guaranteed: ['legendary_armor'],
        possible: ['steel_plate', 'iron_shield', 'heavy_boots'],
        armorRanks: ['C', 'B', 'A']
      },
      sprite: {
        shape: 'humanoid',
        colors: ['#708090', '#2f4f4f', '#696969'],
        effects: ['metallic_glint', 'armor_shine']
      },
      description: 'A heavily armored guardian with impenetrable defense.',
      rank: 'S',
      pool: 'armor'
    }
  ],
  
  // Pet Pool (boss-pools.js lines 37-46)
  pet: [
    {
      id: 'menagerie_alpha',
      name: 'Menagerie Alpha',
      type: 'boss',
      category: 'pet',
      element: 'fire',
      size: 52,
      hpMul: 2.4,
      atkMul: 1.1,
      defMul: 1.0,
      petDrop: 'FireCub',
      speed: 1.3,
      abilities: ['summon_cubs', 'fire_pounce', 'pack_howl'],
      drops: {
        guaranteed: [{ type: 'petShard', which: 'FireCub', qty: 5 }],
        possible: ['pet_box', 'fire_essence', 'beast_claw']
      },
      sprite: {
        shape: 'beast',
        colors: ['#ff4500', '#ff6347', '#ff7f50'],
        effects: ['fire_aura', 'cub_summons']
      },
      description: 'The alpha of fire cubs, leading its pack with ferocity.',
      rank: 'A',
      pool: 'pet'
    }
  ],
  
  // Key Pool (boss-pools.js lines 48-57)
  key: [
    {
      id: 'key_warden',
      name: 'Key Warden',
      type: 'boss',
      category: 'key',
      element: 'tech',
      size: 58,
      hpMul: 3.2,
      atkMul: 1.1,
      defMul: 1.2,
      dropsKey: true,
      speed: 1.1,
      abilities: ['lock_down', 'key_storm', 'unlock_fury'],
      drops: {
        guaranteed: [{ type: 'bossKey', qty: 1 }],
        possible: ['giftKey', 'master_key', 'golden_key']
      },
      sprite: {
        shape: 'humanoid',
        colors: ['#ffd700', '#4169e1', '#00ced1'],
        effects: ['key_orbit', 'lock_symbols']
      },
      description: 'Guardian of all keys, unlocking paths to treasure.',
      rank: 'S',
      pool: 'key'
    }
  ],
  
  // Mini Boss Pool (boss-pools.js lines 90-98)
  miniBoss: [
    {
      id: 'champion_orc',
      name: 'Champion Orc',
      type: 'boss',
      category: 'miniBoss',
      element: 'neutral',
      size: 60,
      hpMul: 3.0,
      atkMul: 1.4,
      defMul: 1.3,
      speed: 1.2,
      abilities: ['rage_strike', 'war_cry', 'berserker_mode'],
      drops: {
        possible: ['orc_axe', 'champion_belt', 'gear_kit'],
        gearRanks: ['B', 'A']
      },
      sprite: {
        shape: 'humanoid',
        colors: ['#8b4513', '#228b22', '#2f4f4f'],
        effects: ['battle_scars', 'rage_aura']
      },
      description: 'An elite orc champion with battle-hardened strength.',
      rank: 'A',
      pool: 'miniBoss'
    }
  ],
  
  // Big Boss Pool (boss-pools.js lines 100-133)
  bigBoss: [
    {
      id: 'demon_king',
      name: 'Demon King',
      type: 'boss',
      category: 'bigBoss',
      element: 'dark',
      size: 80,
      hpMul: 6.0,
      atkMul: 2.0,
      defMul: 2.5,
      speed: 1.4,
      abilities: ['demon_fury', 'hellfire', 'dark_summoning', 'demonic_aura'],
      drops: {
        guaranteed: ['legendary_weapon', 'demon_crown'],
        possible: ['ss_egg', 'demon_essence', 'dark_crystal'],
        gearRanks: ['S', 'SS']
      },
      sprite: {
        shape: 'demon',
        colors: ['#8b0000', '#ff0000', '#2f4f4f'],
        effects: ['hellfire_aura', 'demon_wings', 'dark_energy']
      },
      description: 'The supreme ruler of demons, commanding hellish powers.',
      rank: 'SS',
      pool: 'bigBoss'
    },
    {
      id: 'leviathan',
      name: 'Leviathan',
      type: 'boss',
      category: 'bigBoss',
      element: 'ice',
      size: 96,
      hpMul: 5.6,
      atkMul: 2.2,
      defMul: 2.0,
      speed: 1.2,
      abilities: ['tidal_wave', 'ice_breath', 'whirlpool', 'frozen_domain'],
      drops: {
        guaranteed: ['leviathan_scale', 'ocean_trident'],
        possible: ['ss_egg', 'ice_crystal', 'water_essence'],
        gearRanks: ['S', 'SS']
      },
      sprite: {
        shape: 'serpent',
        colors: ['#1e90ff', '#4682b4', '#00bfff'],
        effects: ['water_flow', 'ice_particles', 'wave_motion']
      },
      description: 'The ancient sea serpent controlling the oceans.',
      rank: 'SS',
      pool: 'bigBoss'
    },
    {
      id: 'archangel',
      name: 'Archangel',
      type: 'boss',
      category: 'bigBoss',
      element: 'light',
      size: 76,
      hpMul: 5.0,
      atkMul: 2.5,
      defMul: 1.9,
      speed: 1.6,
      abilities: ['divine_strike', 'holy_light', 'heavenly_judgment', 'angel_wings'],
      drops: {
        guaranteed: ['angel_feather', 'holy_sword'],
        possible: ['ss_egg', 'light_crystal', 'divine_essence'],
        gearRanks: ['S', 'SS']
      },
      sprite: {
        shape: 'humanoid',
        colors: ['#ffffff', '#ffd700', '#fffacd'],
        effects: ['holy_aura', 'wing_glow', 'divine_light']
      },
      description: 'A celestial warrior wielding divine power.',
      rank: 'SS',
      pool: 'bigBoss'
    },
    {
      id: 'void_reaver',
      name: 'Void Reaver',
      type: 'boss',
      category: 'bigBoss',
      element: 'dark',
      size: 84,
      hpMul: 6.4,
      atkMul: 2.3,
      defMul: 2.2,
      speed: 1.5,
      abilities: ['void_slash', 'dimensional_rift', 'reality_tear', 'void_consumption'],
      drops: {
        guaranteed: ['void_crystal', 'reaver_blade'],
        possible: ['sss_item', 'void_essence', 'chaos_orb'],
        gearRanks: ['S', 'SS', 'SSS']
      },
      sprite: {
        shape: 'humanoid',
        colors: ['#000000', '#4b0082', '#8b008b'],
        effects: ['void_distortion', 'reality_cracks', 'dark_vortex']
      },
      description: 'An entity from the void that consumes reality itself.',
      rank: 'SSS',
      pool: 'bigBoss'
    }
  ],
  
  // Vehicle, Gear, Behavior pools (mentioned in code but not defined)
  vehicle: [],
  gear: [],
  behavior: []
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get a gold boss by ID
 */
export function getGoldBoss(id) {
  return GOLD_BOSSES.find(b => b.id === id);
}

/**
 * Get all gold bosses
 */
export function getAllGoldBosses() {
  return [...GOLD_BOSSES];
}

/**
 * Get a gift boss by ID
 */
export function getGiftBoss(id) {
  return GIFT_BOSSES.find(b => b.id === id);
}

/**
 * Get all gift bosses
 */
export function getAllGiftBosses() {
  return [...GIFT_BOSSES];
}

/**
 * Get a random boss from a specific pool
 */
export function getRandomBossFromPool(poolName) {
  const pool = RANDOM_BOSS_POOLS[poolName];
  if (!pool || pool.length === 0) return null;
  return { ...pool[Math.floor(Math.random() * pool.length)] };
}

/**
 * Get all available pool names
 */
export function getAllPoolNames() {
  return Object.keys(RANDOM_BOSS_POOLS).filter(key => 
    RANDOM_BOSS_POOLS[key].length > 0
  );
}

/**
 * Get all bosses from all pools
 */
export function getAllRunnerBosses() {
  const all = [
    ...GOLD_BOSSES,
    ...GIFT_BOSSES
  ];
  
  // Add unique bosses from pools
  for (const poolName in RANDOM_BOSS_POOLS) {
    const pool = RANDOM_BOSS_POOLS[poolName];
    for (const boss of pool) {
      if (!all.find(b => b.id === boss.id)) {
        all.push(boss);
      }
    }
  }
  
  return all;
}

/**
 * Get boss by ID from any category
 */
export function getRunnerBoss(id) {
  return getAllRunnerBosses().find(b => b.id === id);
}

/**
 * Get bosses by category
 */
export function getBossesByCategory(category) {
  return getAllRunnerBosses().filter(b => b.category === category);
}

/**
 * Get bosses by rank
 */
export function getBossesByRank(rank) {
  return getAllRunnerBosses().filter(b => b.rank === rank);
}

// ═══════════════════════════════════════════════════════════════════════════
// WAVE CONFIGURATION (from BossPoolSystem)
// ═══════════════════════════════════════════════════════════════════════════

export const WAVE_BOSS_CONFIGS = {
  1: { pools: ['armor', 'gold', 'silver', 'pet', 'gift'], count: [2, 3] },
  2: { pools: ['gold', 'key', 'gift'], count: [2, 3] },
  3: { pools: ['armor', 'pet', 'silver', 'gift'], count: [2, 3] },
  4: { pools: ['gold', 'silver', 'key', 'gift'], count: [2, 3] },
  5: { pools: ['pet', 'armor', 'gift'], count: [2, 3] },
  6: { pools: ['gold', 'silver', 'gift'], count: [2, 3] },
  7: { pools: ['armor', 'key', 'pet', 'gift'], count: [2, 3] },
  8: { pools: ['gold', 'silver', 'armor'], count: [2, 3] },
  9: { pools: ['miniBoss'], count: [1] },
  9.5: { pools: ['bigBoss'], count: [1] }
};

/**
 * Get bosses for a specific wave
 */
export function getWaveBosses(wave, stage = 1) {
  const config = WAVE_BOSS_CONFIGS[wave];
  if (!config) return [];
  
  const count = Array.isArray(config.count) 
    ? config.count[Math.floor(Math.random() * config.count.length)]
    : config.count;
  
  const bosses = [];
  for (let i = 0; i < count; i++) {
    const poolName = config.pools[Math.floor(Math.random() * config.pools.length)];
    const boss = getRandomBossFromPool(poolName);
    if (boss) {
      // Apply stage scaling
      if (boss.hpMul) {
        boss.hp = Math.round(300 * (1 + stage * 0.12) * boss.hpMul);
        boss.maxHp = boss.hp;
      }
      if (boss.atkMul) {
        boss.atk = Math.round(25 * (1 + stage * 0.12) * boss.atkMul);
      }
      if (boss.defMul) {
        boss.def = Math.round(8 * (1 + stage * 0.12) * boss.defMul);
      }
      bosses.push(boss);
    }
  }
  
  return bosses;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

export const RUNNER_BOSSES_SUMMARY = {
  totalBosses: getAllRunnerBosses().length,
  goldBosses: GOLD_BOSSES.length,
  giftBosses: GIFT_BOSSES.length,
  pools: Object.keys(RANDOM_BOSS_POOLS).filter(k => RANDOM_BOSS_POOLS[k].length > 0),
  categories: ['gold', 'gift', 'silver', 'armor', 'pet', 'key', 'miniBoss', 'bigBoss'],
  ranks: ['B', 'A', 'S', 'SS', 'SSS']
};

console.log('🎮 Runner Bosses DB Loaded:', RUNNER_BOSSES_SUMMARY);

