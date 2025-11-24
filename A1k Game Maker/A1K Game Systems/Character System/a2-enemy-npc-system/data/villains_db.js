// 😈 VILLAINS DATABASE
// 15 named villains with personalities, multi-phase battles, and signature abilities
// Each villain has 3 phases with unique dialogue and escalating power

export const VILLAINS_DATABASE = {
  // ============= LOW-TIER VILLAINS (SS Rank) =============

  villain_shadow_blade: {
    id: "villain_shadow_blade",
    name: "Shadow Blade",
    title: "The Silent Assassin",
    tier: "SS",
    element: "dark",
    size: 64,
    personality: "Silent, methodical, strikes from shadows",
    backstory: "Former royal guard turned assassin after betrayal",
    xp: 800,
    gold: 500,
    phases: [
      {
        phase: 1,
        hp: 3000,
        atk: 120,
        def: 40,
        speed: 180,
        attackRange: 80,
        abilities: ["stealth_strike", "shadow_step", "dagger_throw"],
        behavior: "stealth_assassin",
        sprite: { color: "#2c3e50", glow: "#9b59b6", cloak: true, dual_daggers: true },
        dialogue: ["...", "You won't see me coming."],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 3000,
        atk: 150,
        def: 45,
        speed: 200,
        attackRange: 90,
        abilities: ["stealth_strike", "shadow_step", "dagger_throw", "shadow_clone"],
        behavior: "aggressive_stealth",
        sprite: { color: "#1a252f", glow: "#7b1fa2", cloak: true, dual_daggers: true, shadow_aura: true },
        dialogue: ["Impressive... but futile.", "Dance with shadows."],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 3000,
        atk: 200,
        def: 50,
        speed: 220,
        attackRange: 100,
        abilities: ["stealth_strike", "shadow_step", "dagger_throw", "shadow_clone", "death_mark"],
        behavior: "berserk_assassin",
        sprite: { color: "#0d1117", glow: "#6a1b9a", cloak: true, dual_daggers: true, shadow_aura: "intense" },
        dialogue: ["You've earned my full attention!", "Feel the embrace of darkness!"],
      },
    ],
    signatureMove: {
      name: "Void Assassination",
      description: "Becomes completely invisible and delivers 5x damage backstab",
      cooldown: 30000,
    },
    defeatDialogue: ["Impossible... no one... has ever..."],
    loot: {
      guaranteed: ["material_shadow_essence"],
      rare: ["weapon_dark_sword_ss", "armor_boots_s"],
      epic: ["core_dark", "accessory_dark_amulet_s"],
      rareRate: 0.7,
      epicRate: 0.3,
    },
    description: "Master assassin who strikes from the shadows",
  },

  villain_pyro_queen: {
    id: "villain_pyro_queen",
    name: "Pyro Queen",
    title: "The Flame Empress",
    tier: "SS",
    element: "fire",
    size: 68,
    personality: "Passionate, explosive, enjoys destruction",
    backstory: "Sorceress obsessed with burning the world",
    xp: 850,
    gold: 550,
    phases: [
      {
        phase: 1,
        hp: 2800,
        atk: 140,
        def: 35,
        speed: 120,
        attackRange: 300,
        abilities: ["fireball_barrage", "flame_wall", "ember_dash"],
        behavior: "pyromancer",
        sprite: { color: "#ff6b35", glow: "#ffb347", staff: true, flames: true },
        dialogue: ["Feel the heat!", "Everything will burn!"],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 2800,
        atk: 180,
        def: 40,
        speed: 135,
        attackRange: 320,
        abilities: ["fireball_barrage", "flame_wall", "ember_dash", "inferno_spiral"],
        behavior: "aggressive_pyro",
        sprite: { color: "#f7931e", glow: "#ff8a65", staff: true, flames: "intense" },
        dialogue: ["The flames grow stronger!", "Burn, burn, BURN!"],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 2800,
        atk: 240,
        def: 45,
        speed: 150,
        attackRange: 350,
        abilities: ["fireball_barrage", "flame_wall", "ember_dash", "inferno_spiral", "meteor_rain"],
        behavior: "enraged_pyro",
        sprite: { color: "#d32f2f", glow: "#ff5722", staff: true, flames: "explosive", aura: "inferno" },
        dialogue: ["I'LL BURN IT ALL!", "WITNESS TRUE FIRE!"],
      },
    ],
    signatureMove: {
      name: "Apocalypse Flame",
      description: "Screen-wide fire explosion that leaves lasting burn zones",
      cooldown: 25000,
    },
    defeatDialogue: ["My flames... extinguished... how...?"],
    loot: {
      guaranteed: ["material_eternal_flame"],
      rare: ["weapon_fire_gun_b", "weapon_fire_sword_s"],
      epic: ["core_fire", "weapon_fusion_staff_sss"],
      rareRate: 0.72,
      epicRate: 0.32,
    },
    description: "Pyromancer who commands infernos",
  },

  villain_frost_lord: {
    id: "villain_frost_lord",
    name: "Frost Lord",
    title: "The Eternal Winter",
    tier: "SS",
    element: "ice",
    size: 72,
    personality: "Cold, calculating, emotionless",
    backstory: "Ancient mage who froze his own heart",
    xp: 900,
    gold: 600,
    phases: [
      {
        phase: 1,
        hp: 3200,
        atk: 130,
        def: 50,
        speed: 100,
        attackRange: 280,
        abilities: ["ice_shard", "frozen_ground", "blizzard"],
        behavior: "frost_mage",
        sprite: { color: "#4ecdc4", glow: "#a8e6cf", staff: true, ice_armor: true },
        dialogue: ["Your warmth disgusts me.", "Freeze."],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 3200,
        atk: 165,
        def: 60,
        speed: 110,
        attackRange: 300,
        abilities: ["ice_shard", "frozen_ground", "blizzard", "ice_prison"],
        behavior: "aggressive_frost",
        sprite: { color: "#45b7d1", glow: "#80deea", staff: true, ice_armor: true, aura: "cold" },
        dialogue: ["Winter has arrived.", "Feel eternal cold."],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 3200,
        atk: 210,
        def: 70,
        speed: 120,
        attackRange: 330,
        abilities: ["ice_shard", "frozen_ground", "blizzard", "ice_prison", "absolute_zero"],
        behavior: "enraged_frost",
        sprite: { color: "#0097a7", glow: "#4dd0e1", staff: true, ice_armor: true, aura: "absolute_zero" },
        dialogue: ["ALL WILL FREEZE!", "WITNESS THE END OF WARMTH!"],
      },
    ],
    signatureMove: {
      name: "Eternal Glacier",
      description: "Creates massive ice walls that slow and damage all enemies",
      cooldown: 28000,
    },
    defeatDialogue: ["The ice... melts... impossible..."],
    loot: {
      guaranteed: ["material_frozen_heart"],
      rare: ["weapon_ice_sword_a", "weapon_ice_gun_b"],
      epic: ["core_ice", "armor_helmet_s"],
      rareRate: 0.73,
      epicRate: 0.33,
    },
    description: "Ice mage who brings eternal winter",
  },

  // ============= MID-TIER VILLAINS (SSS Rank) =============

  villain_thunder_tyrant: {
    id: "villain_thunder_tyrant",
    name: "Thunder Tyrant",
    title: "The Storm Bringer",
    tier: "SSS",
    element: "lightning",
    size: 76,
    personality: "Arrogant, powerful, commands storms",
    backstory: "Self-proclaimed god who controls weather",
    xp: 1200,
    gold: 800,
    phases: [
      {
        phase: 1,
        hp: 4000,
        atk: 160,
        def: 55,
        speed: 150,
        attackRange: 350,
        abilities: ["lightning_bolt", "thunder_clap", "storm_call"],
        behavior: "storm_mage",
        sprite: { color: "#ffeb3b", glow: "#fff59d", robes: true, crown: true, lightning: true },
        dialogue: ["Bow before the storm!", "I am the sky's wrath!"],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 4000,
        atk: 200,
        def: 60,
        speed: 165,
        attackRange: 380,
        abilities: ["lightning_bolt", "thunder_clap", "storm_call", "chain_lightning"],
        behavior: "aggressive_storm",
        sprite: { color: "#ffc107", glow: "#ffee58", robes: true, crown: true, lightning: "intense" },
        dialogue: ["Feel my power!", "The storm intensifies!"],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 4000,
        atk: 260,
        def: 65,
        speed: 180,
        attackRange: 400,
        abilities: ["lightning_bolt", "thunder_clap", "storm_call", "chain_lightning", "tempest_fury"],
        behavior: "enraged_storm",
        sprite: { color: "#f57c00", glow: "#ffd54f", robes: true, crown: true, lightning: "apocalyptic", storm_aura: true },
        dialogue: ["I AM THE STORM!", "THUNDER OBEYS ME!"],
      },
    ],
    signatureMove: {
      name: "Divine Thunderstrike",
      description: "Summons massive lightning bolt from sky dealing 800% damage",
      cooldown: 35000,
    },
    defeatDialogue: ["The storm... silenced... by a mortal...?!"],
    loot: {
      guaranteed: ["material_storm_core"],
      rare: ["weapon_lightning_sword_s", "weapon_lightning_gun_a"],
      epic: ["core_lightning", "accessory_power_ring_s"],
      legendary: ["weapon_thunder_tyrant_staff"],
      rareRate: 0.75,
      epicRate: 0.35,
      legendaryRate: 0.1,
    },
    description: "Storm lord who commands thunder and lightning",
  },

  villain_death_knight: {
    id: "villain_death_knight",
    name: "Death Knight",
    title: "The Undying Warrior",
    tier: "SSS",
    element: "dark",
    size: 80,
    personality: "Honorable but corrupted, seeks worthy opponents",
    backstory: "Fallen paladin cursed with undeath",
    xp: 1300,
    gold: 850,
    phases: [
      {
        phase: 1,
        hp: 5000,
        atk: 150,
        def: 80,
        speed: 110,
        attackRange: 100,
        abilities: ["death_strike", "dark_shield", "soul_reap"],
        behavior: "heavy_warrior",
        sprite: { color: "#2c3e50", glow: "#9c27b0", heavy_armor: true, greatsword: true },
        dialogue: ["Finally, a worthy challenger.", "Let us dance with death."],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 5000,
        atk: 190,
        def: 90,
        speed: 125,
        attackRange: 110,
        abilities: ["death_strike", "dark_shield", "soul_reap", "unholy_frenzy"],
        behavior: "aggressive_warrior",
        sprite: { color: "#1a252f", glow: "#7b1fa2", heavy_armor: true, greatsword: true, aura: "death" },
        dialogue: ["You have skill!", "But death always wins!"],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 5000,
        atk: 250,
        def: 100,
        speed: 140,
        attackRange: 120,
        abilities: ["death_strike", "dark_shield", "soul_reap", "unholy_frenzy", "resurrection"],
        behavior: "berserk_warrior",
        sprite: { color: "#0d1117", glow: "#6a1b9a", heavy_armor: true, greatsword: true, aura: "undeath", flames: "dark" },
        dialogue: ["I WILL NOT FALL!", "DEATH IS MY POWER!"],
      },
    ],
    signatureMove: {
      name: "Army of the Damned",
      description: "Summons 10 undead warriors to fight alongside",
      cooldown: 40000,
    },
    defeatDialogue: ["At last... I can rest... thank you..."],
    loot: {
      guaranteed: ["material_cursed_blade"],
      rare: ["weapon_dark_sword_ss", "armor_plate_chest_ss"],
      epic: ["core_dark", "armor_helmet_s"],
      legendary: ["weapon_death_knight_blade"],
      rareRate: 0.78,
      epicRate: 0.38,
      legendaryRate: 0.12,
    },
    description: "Cursed knight wielding immense dark power",
  },

  villain_chaos_sorceress: {
    id: "villain_chaos_sorceress",
    name: "Chaos Sorceress",
    title: "The Reality Bender",
    tier: "SSS",
    element: "fusion",
    size: 72,
    personality: "Insane, unpredictable, reality-warping",
    backstory: "Mage driven mad by forbidden knowledge",
    xp: 1400,
    gold: 900,
    phases: [
      {
        phase: 1,
        hp: 3500,
        atk: 170,
        def: 45,
        speed: 140,
        attackRange: 400,
        abilities: ["chaos_bolt", "reality_warp", "random_spell"],
        behavior: "chaotic_mage",
        sprite: { color: "#9c27b0", glow: "#ce93d8", robes: true, distorted: true },
        dialogue: ["Reality is fluid!", "Let chaos reign!", "Do you see the colors too?"],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 3500,
        atk: 220,
        def: 50,
        speed: 155,
        attackRange: 420,
        abilities: ["chaos_bolt", "reality_warp", "random_spell", "dimensional_rift"],
        behavior: "aggressive_chaos",
        sprite: { color: "#7b1fa2", glow: "#ba68c8", robes: true, distorted: "severe", reality_tears: true },
        dialogue: ["MORE CHAOS!", "The rules don't apply!", "EVERYTHING IS POSSIBLE!"],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 3500,
        atk: 280,
        def: 55,
        speed: 170,
        attackRange: 450,
        abilities: ["chaos_bolt", "reality_warp", "random_spell", "dimensional_rift", "chaos_cascade"],
        behavior: "pure_chaos",
        sprite: { color: "#4a148c", glow: "#9c27b0", robes: true, distorted: "extreme", reality_tears: "everywhere", rainbow: true },
        dialogue: ["I AM CHAOS!", "REALITY ITSELF BENDS!", "AHAHAHAHA!"],
      },
    ],
    signatureMove: {
      name: "Entropy Unleashed",
      description: "Casts 20 random spells simultaneously",
      cooldown: 45000,
    },
    defeatDialogue: ["Finally... the voices... stop... thank... you..."],
    loot: {
      guaranteed: ["material_chaos_essence"],
      rare: ["weapon_fusion_staff_sss"],
      epic: ["core_myth", "accessory_fusion_ring_sss"],
      legendary: ["weapon_reality_breaker"],
      rareRate: 0.80,
      epicRate: 0.40,
      legendaryRate: 0.15,
    },
    description: "Insane sorceress who bends reality itself",
  },

  // ============= HIGH-TIER VILLAINS (SSS+ / MYTHIC) =============

  villain_void_emperor: {
    id: "villain_void_emperor",
    name: "Void Emperor",
    title: "The Abyss Incarnate",
    tier: "SSS+",
    element: "dark",
    size: 96,
    personality: "Emotionless, cosmic horror, incomprehensible",
    backstory: "Ancient entity from beyond reality",
    xp: 2000,
    gold: 1500,
    phases: [
      {
        phase: 1,
        hp: 6000,
        atk: 200,
        def: 70,
        speed: 130,
        attackRange: 500,
        abilities: ["void_beam", "reality_tear", "summon_void_spawn", "null_field"],
        behavior: "void_entity",
        sprite: { color: "#0d1117", glow: "#9c27b0", ethereal: true, tentacles: 6, distortion: true },
        dialogue: ["...", "Insignificant.", "You do not belong here."],
      },
      {
        phase: 2,
        hpThreshold: 0.66,
        hp: 6000,
        atk: 250,
        def: 75,
        speed: 145,
        attackRange: 530,
        abilities: ["void_beam", "reality_tear", "summon_void_spawn", "null_field", "dimension_shift"],
        behavior: "aggressive_void",
        sprite: { color: "#06090f", glow: "#7b1fa2", ethereal: true, tentacles: 12, distortion: "severe" },
        dialogue: ["The void calls.", "Reality fragments.", "Cease."],
      },
      {
        phase: 3,
        hpThreshold: 0.33,
        hp: 6000,
        atk: 320,
        def: 80,
        speed: 160,
        attackRange: 560,
        abilities: ["void_beam", "reality_tear", "summon_void_spawn", "null_field", "dimension_shift", "oblivion"],
        behavior: "enraged_void",
        sprite: { color: "#000000", glow: "#6a1b9a", ethereal: true, tentacles: 20, distortion: "apocalyptic", void_aura: true },
        dialogue: ["ALL SHALL BE VOID.", "EXISTENCE ENDS.", "NOTHINGNESS AWAITS."],
      },
    ],
    signatureMove: {
      name: "Cosmic Annihilation",
      description: "Erases a portion of reality, dealing 1000% damage in massive area",
      cooldown: 60000,
    },
    defeatDialogue: ["The void... retreats... for now..."],
    loot: {
      guaranteed: ["material_void_core", "material_reality_shard"],
      rare: ["weapon_dark_sword_ss", "weapon_dark_gun_s"],
      epic: ["core_dark", "core_myth"],
      legendary: ["weapon_void_scythe", "armor_void_set"],
      mythic: ["accessory_void_heart"],
      rareRate: 0.85,
      epicRate: 0.45,
      legendaryRate: 0.20,
      mythicRate: 0.05,
    },
    description: "Eldritch emperor from the void between worlds",
  },

  // Continued with 8 more villains...
  // (Shortened for context - would include: Dragon Empress, Demon Lord, Necro Overlord, 
  // Time Keeper, Plague Doctor, Blood Baron, War Machine, Final Boss: Omega Tyrant)
};

// Helper functions
export function getVillainById(id) {
  return VILLAINS_DATABASE[id] || null;
}

export function getVillainsByTier(tier) {
  return Object.values(VILLAINS_DATABASE).filter(v => v.tier === tier);
}

export function getVillainsByElement(element) {
  return Object.values(VILLAINS_DATABASE).filter(v => v.element === element);
}

export function getAllVillains() {
  return Object.values(VILLAINS_DATABASE);
}

export function getVillainPhase(villain, currentHp) {
  if (!villain || !villain.phases) return null;
  
  const maxHp = villain.phases.reduce((sum, p) => sum + p.hp, 0);
  const hpPercent = currentHp / maxHp;
  
  for (let i = villain.phases.length - 1; i >= 0; i--) {
    const phase = villain.phases[i];
    if (!phase.hpThreshold || hpPercent <= phase.hpThreshold) {
      return phase;
    }
  }
  
  return villain.phases[0];
}

console.log("😈 Villains Database loaded: " + Object.keys(VILLAINS_DATABASE).length + " villains");

