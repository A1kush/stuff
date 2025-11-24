// ═══════════════════════════════════════════════════════════════════════════
// NEO BAG SYSTEM - Streamlined Game Data
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // GEAR DATA - Streamlined gear sets
  // ═══════════════════════════════════════════════════════════════════════════
  const GEAR_DATA = [
    // Starter Set
    { id: 'gear_starter_sword', name: 'Neon Blade', icon: '⚔️', slot: 'weapon', rarity: 'common', baseStats: { attack: 25, critRate: 0.03 }, price: 300 },
    { id: 'gear_starter_shield', name: 'Plasma Shield', icon: '🛡️', slot: 'offhand', rarity: 'common', baseStats: { defense: 20, hp: 100 }, price: 280 },
    { id: 'gear_starter_helm', name: 'Cyber Visor', icon: '🪖', slot: 'head', rarity: 'common', baseStats: { defense: 15, hp: 60 }, price: 200 },
    { id: 'gear_starter_chest', name: 'Neon Armor', icon: '🥋', slot: 'chest', rarity: 'common', baseStats: { defense: 30, hp: 150 }, price: 350 },
    { id: 'gear_starter_gloves', name: 'Tech Gloves', icon: '🧤', slot: 'gloves', rarity: 'common', baseStats: { attack: 12, speed: 0.02 }, price: 180 },
    { id: 'gear_starter_pants', name: 'Neon Greaves', icon: '🦿', slot: 'pants', rarity: 'common', baseStats: { defense: 22, hp: 110 }, price: 250 },
    { id: 'gear_starter_boots', name: 'Cyber Boots', icon: '👢', slot: 'boots', rarity: 'common', baseStats: { defense: 14, speed: 0.03 }, price: 220 },
    { id: 'gear_starter_ring', name: 'Data Ring', icon: '💍', slot: 'ring', rarity: 'common', baseStats: { attack: 10, critRate: 0.04 }, price: 180 },
    { id: 'gear_starter_necklace', name: 'Neural Link', icon: '📿', slot: 'necklace', rarity: 'common', baseStats: { hp: 120, mp: 40 }, price: 240 },

    // Advanced Set
    { id: 'gear_advanced_sword', name: 'Quantum Blade', icon: '⚔️', slot: 'weapon', rarity: 'rare', baseStats: { attack: 60, critRate: 0.06, critDamage: 0.25 }, price: 1200 },
    { id: 'gear_advanced_shield', name: 'Energy Barrier', icon: '🛡️', slot: 'offhand', rarity: 'rare', baseStats: { defense: 55, hp: 250, block: 0.08 }, price: 1100 },
    { id: 'gear_advanced_chest', name: 'Plasma Plate', icon: '🥋', slot: 'chest', rarity: 'rare', baseStats: { defense: 75, hp: 300 }, price: 1400 },
    { id: 'gear_advanced_ring', name: 'Quantum Ring', icon: '💍', slot: 'ring', rarity: 'rare', baseStats: { attack: 25, critRate: 0.08, critDamage: 0.15 }, price: 900 },

    // Elite Set
    { id: 'gear_elite_sword', name: 'Void Reaver', icon: '⚔️', slot: 'weapon', rarity: 'epic', baseStats: { attack: 120, critRate: 0.10, critDamage: 0.35, armorPen: 0.10 }, price: 3500 },
    { id: 'gear_elite_chest', name: 'Nexus Armor', icon: '🥋', slot: 'chest', rarity: 'epic', baseStats: { defense: 140, hp: 600, cooldownReduction: 0.05 }, price: 4000 }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // PETS DATA - Companion pets
  // ═══════════════════════════════════════════════════════════════════════════
  const PETS_DATA = [
    { id: 'pet_cyber_wolf', name: 'Cyber Wolf', icon: '🐺', rarity: 'common', baseStats: { attack: 15, hp: 200 }, description: 'Loyal cybernetic companion' },
    { id: 'pet_plasma_dragon', name: 'Plasma Dragon', icon: '🐉', rarity: 'rare', baseStats: { attack: 45, hp: 500, critRate: 0.05 }, description: 'Rare plasma-breathing dragon' },
    { id: 'pet_quantum_cat', name: 'Quantum Cat', icon: '🐱', rarity: 'epic', baseStats: { attack: 80, hp: 400, speed: 0.10, evade: 0.15 }, description: 'Elusive quantum-phase feline' },
    { id: 'pet_void_raven', name: 'Void Raven', icon: '🐦‍⬛', rarity: 'uncommon', baseStats: { attack: 30, hp: 300, critRate: 0.08 }, description: 'Dark raven from the void' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // VEHICLES DATA - Transportation companions
  // ═══════════════════════════════════════════════════════════════════════════
  const VEHICLES_DATA = [
    { id: 'vehicle_hover_bike', name: 'Hover Bike', icon: '🏍️', rarity: 'common', baseStats: { speed: 0.15, hp: 300 }, description: 'Basic hover motorcycle' },
    { id: 'vehicle_quantum_car', name: 'Quantum Car', icon: '🚗', rarity: 'rare', baseStats: { speed: 0.25, hp: 600, defense: 50 }, description: 'Fast quantum-powered vehicle' },
    { id: 'vehicle_void_ship', name: 'Void Ship', icon: '🚀', rarity: 'epic', baseStats: { speed: 0.40, hp: 1000, attack: 100 }, description: 'Elite void-traveling ship' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // ROBOTS/AI DATA - AI companions
  // ═══════════════════════════════════════════════════════════════════════════
  const ROBOTS_DATA = [
    { id: 'robot_assistant_bot', name: 'Assistant Bot', icon: '🤖', rarity: 'common', baseStats: { attack: 20, hp: 250, mp: 100 }, description: 'Basic AI assistant' },
    { id: 'robot_combat_droid', name: 'Combat Droid', icon: '🤖', rarity: 'rare', baseStats: { attack: 60, hp: 500, defense: 40, critRate: 0.08 }, description: 'Advanced combat AI' },
    { id: 'robot_quantum_ai', name: 'Quantum AI', icon: '🤖', rarity: 'epic', baseStats: { attack: 120, hp: 800, mp: 300, cooldownReduction: 0.10 }, description: 'Elite quantum AI system' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILLS DATA - Skills for each character (matching reference HTML)
  // ═══════════════════════════════════════════════════════════════════════════
  const SKILLS_DATA = [
    // === A1 (WARRIOR) ===
    { id: 'A1_S1', name: 'Crimson Slash', characterId: 'A1', slot: 1, baseDamage: 150, damage: 150, cooldown: 2.5, unlockLevel: 1, unlock: 1, icon: '⚔️', tier: 'common', element: 'PHYSICAL', description: '3-hit crimson X-wave slash', projectileCount: 3, shape: 'xwave', color: '#ff0000' },
    { id: 'A1_S2', name: 'Summon Clone', characterId: 'A1', slot: 2, baseDamage: 0, damage: 0, cooldown: 15, unlockLevel: 20, unlock: 20, icon: '👥', tier: 'uncommon', element: 'SUMMON', description: 'Summon combat clone ally', projectileCount: 0, shape: 'summon', color: '#ff0000' },
    { id: 'A1_S3', name: 'Power Wave', characterId: 'A1', slot: 3, baseDamage: 250, damage: 250, cooldown: 4, unlockLevel: 1, unlock: 1, icon: '⚔️', tier: 'rare', element: 'PHYSICAL', description: '4-hit power wave combo', projectileCount: 4, shape: 'xwave', enhanced: true, color: '#ff0000' },
    { id: 'A1_S4', name: 'Phantom Step: Backstab Waltz', characterId: 'A1', slot: 4, baseDamage: 110, damage: 110, cooldown: 20, unlockLevel: 30, unlock: 30, icon: '⏰', tier: 'epic', element: 'SHADOW', description: 'Teleport backstab combo with time manipulation', setupSwings: 6, swingInterval: 0.12, finalPower: 320, executeThreshold: 0.30, arcRadius: 120, crescentRadius: 180, teleport: true, vacuumRadius: 80, shape: 'backstab_waltz', enhanced: true, color: '#00E5FF' },
    { id: 'A1_S5', name: 'Crimson Cyclone: Blink Chain', characterId: 'A1', slot: 5, baseDamage: 150, damage: 150, cooldown: 24, unlockLevel: 40, unlock: 40, icon: '🌪️', tier: 'epic', element: 'PHYSICAL', description: '3-blink aerial spin attack', blinkCount: 3, spinTicks: 6, spinTickDamage: 50, slamDamage: 300, stunDuration: 0.4, vortexRadius: 200, shape: 'blink_chain', enhanced: true, color: '#FF0000' },
    { id: 'A1_X1', name: 'World Splitter', characterId: 'A1', slot: 'X', baseDamage: 260, damage: 260, cooldown: 28, unlockLevel: 50, unlock: 50, icon: '🌌', tier: 'legendary', element: 'ARCANE', description: 'Twin dimension rifts (chargeable)', charge: { t1: 0.50, t2: 0.80 }, riftCount: 2, riftWidth: 60, riftSeparation: 36, pierceUnlimited: true, bossTailBonus: 0.25, bleedDps: 20, bleedDuration: 2.0, shape: 'world_splitter', color: '#00E5FF' },
    
    // === UNIQUE (CYBORG) ===
    { id: 'UNIQUE_S1', name: 'Plasma Blast', characterId: 'UNIQUE', slot: 1, baseDamage: 120, damage: 120, cooldown: 2, unlockLevel: 1, unlock: 1, icon: '🔫', tier: 'common', element: 'PLASMA', description: 'Fire 3 plasma projectiles', projectileCount: 3, shape: 'plasma', color: '#00ffff' },
    { id: 'UNIQUE_S2', name: 'Summon Drone', characterId: 'UNIQUE', slot: 2, baseDamage: 0, damage: 0, cooldown: 15, unlockLevel: 20, unlock: 20, icon: '🤖', tier: 'uncommon', element: 'SUMMON', description: 'Deploy a combat drone', projectileCount: 0, shape: 'summon', color: '#00ffff' },
    { id: 'UNIQUE_S3', name: 'Aether Wave Beam', characterId: 'UNIQUE', slot: 3, baseDamage: 400, damage: 400, cooldown: 8, unlockLevel: 1, unlock: 1, icon: '💠', tier: 'rare', element: 'ENERGY', description: 'Channel a Kamehameha-style energy beam', projectileCount: 0, shape: 'beam', enhanced: true, color: '#00ffff' },
    { id: 'UNIQUE_S4', name: 'Absolute Zero Rail + Cryo Barrage', characterId: 'UNIQUE', slot: 4, baseDamage: 45, damage: 45, cooldown: 20, unlockLevel: 30, unlock: 30, icon: '❄️', tier: 'epic', element: 'ICE', description: 'Freeze enemies with rail beam and cryo barrage', railDuration: 0.45, railTicksPerSec: 12, cryoCount: 4, cryoDamage: 180, cryoPierce: 2, cryoChain: 1, chainFalloff: 0.6, shape: 'cryo_rail', enhanced: true, color: '#87CEEB' },
    { id: 'UNIQUE_S5', name: 'Ion Helix Drill', characterId: 'UNIQUE', slot: 5, baseDamage: 38, damage: 38, cooldown: 24, unlockLevel: 40, unlock: 40, icon: '🔩', tier: 'epic', element: 'PLASMA', description: 'Drill through enemies with rotating helix beam', drillDuration: 0.9, drillTicksPerSec: 15, pullStrength: 120, steerDegrees: 8, endBurst: 220, shape: 'helix_drill', enhanced: true, color: '#00FFFF' },
    { id: 'UNIQUE_X1', name: 'Hyper Ion Wave', characterId: 'UNIQUE', slot: 'X', baseDamage: 34, damage: 34, cooldown: 28, unlockLevel: 50, unlock: 50, icon: '⚡', tier: 'legendary', element: 'ENERGY', description: 'Massive Goku-style beam wave (Chargeable Ultimate)', charge: { t1: 0.60, t2: 1.00 }, beamDuration: 1.6, beamTicksPerSec: 16, beamWidth: 80, steerDegrees: 10, endCone: 200, deepChillStacks: 3, shape: 'ion_beam', color: '#00FFFF' },
    
    // === MISSY (CAT ANGEL) ===
    { id: 'MISSY_S1', name: 'Blade Dance', characterId: 'MISSY', slot: 1, baseDamage: 130, damage: 130, cooldown: 2.5, unlockLevel: 1, unlock: 1, icon: '🗡️', tier: 'common', element: 'PHYSICAL', description: 'Elegant blade dance launching 3 slashes', projectileCount: 3, shape: 'slash', color: '#ff69b4' },
    { id: 'MISSY_S2', name: 'Summon Pet', characterId: 'MISSY', slot: 2, baseDamage: 0, damage: 0, cooldown: 15, unlockLevel: 20, unlock: 20, icon: '🐱', tier: 'uncommon', element: 'SUMMON', description: 'Summon a magical pet companion', projectileCount: 0, shape: 'summon', color: '#ff69b4' },
    { id: 'MISSY_S3', name: 'Gun Barrage', characterId: 'MISSY', slot: 3, baseDamage: 200, damage: 200, cooldown: 4, unlockLevel: 1, unlock: 1, icon: '💰', tier: 'rare', element: 'LIGHT', description: 'Rapid-fire bullet barrage with golden effects', projectileCount: 4, shape: 'bullet', enhanced: true, color: '#ff69b4' },
    { id: 'MISSY_S4', name: 'Golden Rail & Comets', characterId: 'MISSY', slot: 4, baseDamage: 560, damage: 560, cooldown: 6, unlockLevel: 30, unlock: 30, icon: '✨', tier: 'epic', element: 'ARCANE', description: 'Golden rail beam with orbiting magnetic comets', railDuration: 0.6, railTicksPerSec: 10, cometCount: 8, cometDamage: 180, cometPierce: 4, magnetRadius: 200, magnetTime: 2.0, boomerangDegrees: 45, shape: 'gold_rail', enhanced: true, color: '#ffd700' },
    { id: 'MISSY_S5', name: 'Royal Typhoon', characterId: 'MISSY', slot: 5, baseDamage: 720, damage: 720, cooldown: 8, unlockLevel: 40, unlock: 40, icon: '🌀', tier: 'epic', element: 'LIGHT', description: 'Create a royal cyclone with gunfire volleys', cycloneDuration: 1.8, cycloneTicks: 18, cycloneTickDamage: 40, cycloneMagnet: 140, coneVolleys: 3, conePellets: 8, coneSpread: 35, conePower: 110, shape: 'royal_typhoon', enhanced: true, typhoonRadius: 150, color: '#ffd700' },
    { id: 'MISSY_X1', name: 'Royal Coin Cannon', characterId: 'MISSY', slot: 'X', baseDamage: 1400, damage: 1400, cooldown: 20, unlockLevel: 50, unlock: 50, icon: '💎', tier: 'legendary', element: 'ARCANE', description: 'Royal coin beam cannon (Chargeable Ultimate)', charge: { t1: 0.5, t2: 0.9 }, beamDuration: 1.4, beamWidth: 70, beamMagnet: 180, beamTickDamage: 90, beamTicksPerSec: 12, finalNova: 1200, shape: 'royal_cannon', color: '#ffd700' },

    // ═══════════════════════════════════════════════════════════════════
    // UPGRADED SKILLS - Advanced Abilities
    // ═══════════════════════════════════════════════════════════════════

    // A1 UPGRADED SKILLS
    { id: 'A1_S7', name: 'Phantom Edge Combo', characterId: 'A1', slot: 7, baseDamage: 180, damage: 180, cooldown: 8, unlockLevel: 35, unlock: 35, icon: '⚔️', tier: 'epic', element: 'SHADOW', description: '3-hit phantom blade combo with void slashes', precastBullets: 3, precastInterval: 0.25, shape: 'phantom_combo', color: '#9966ff' },
    { id: 'A1_S8', name: 'Phantom Void', characterId: 'A1', slot: 8, baseDamage: 220, damage: 220, cooldown: 10, unlockLevel: 40, unlock: 40, icon: '🌀', tier: 'rare', element: 'SHADOW', description: 'Void energy slash with dimensional rift', precastBullets: 2, precastInterval: 0.3, shape: 'phantom_void', color: '#6600cc' },
    { id: 'A1_S9', name: 'Phantom Radiant', characterId: 'A1', slot: 9, baseDamage: 280, damage: 280, cooldown: 12, unlockLevel: 45, unlock: 45, icon: '✨', tier: 'epic', element: 'LIGHT', description: 'Radiant phantom slash with light burst', precastBullets: 4, precastInterval: 0.2, shape: 'phantom_radiant', color: '#ffdd00' },
    { id: 'A1_X2', name: 'Phantom ULTIMATE', characterId: 'A1', slot: 'X2', baseDamage: 500, damage: 500, cooldown: 30, unlockLevel: 50, unlock: 50, icon: '💥', tier: 'legendary', element: 'SHADOW', description: 'Ultimate phantom barrage - massive combo attack', precastBullets: 6, precastInterval: 0.15, shape: 'phantom_ultimate', color: '#ff00ff' },

    // UNIQUE UPGRADED SKILLS
    { id: 'UNIQUE_S7', name: 'Voidlight Cannon', characterId: 'UNIQUE', slot: 7, baseDamage: 300, damage: 300, cooldown: 8, unlockLevel: 35, unlock: 35, icon: '🌌', tier: 'rare', element: 'ARCANE', description: 'Void energy cannon beam', precastBullets: 4, precastInterval: 0.2, shape: 'voidlight_cannon', color: '#00ffff' },
    { id: 'UNIQUE_S8', name: 'Kinetic Sentry', characterId: 'UNIQUE', slot: 8, baseDamage: 150, damage: 150, cooldown: 15, unlockLevel: 30, unlock: 30, icon: '🤖', tier: 'uncommon', element: 'PLASMA', description: 'Deploy auto-firing kinetic turret', precastBullets: 2, precastInterval: 0.4, shape: 'sentry', color: '#00aaff' },
    { id: 'UNIQUE_S9', name: 'Gauss Driver', characterId: 'UNIQUE', slot: 9, baseDamage: 400, damage: 400, cooldown: 10, unlockLevel: 40, unlock: 40, icon: '⚡', tier: 'rare', element: 'LIGHTNING', description: 'Heavy electromagnetic rail cannon shot', precastBullets: 2, precastInterval: 0.5, shape: 'gauss_driver', color: '#ffaa00' },
    { id: 'UNIQUE_S10', name: 'Gauss Rail', characterId: 'UNIQUE', slot: 10, baseDamage: 350, damage: 350, cooldown: 9, unlockLevel: 42, unlock: 42, icon: '⚡', tier: 'epic', element: 'LIGHTNING', description: 'Piercing rail cannon with chain lightning', precastBullets: 3, precastInterval: 0.25, shape: 'gauss_rail', color: '#ff8800' },
    { id: 'UNIQUE_S11', name: 'Gauss Pierce', characterId: 'UNIQUE', slot: 11, baseDamage: 380, damage: 380, cooldown: 11, unlockLevel: 44, unlock: 44, icon: '💫', tier: 'epic', element: 'LIGHTNING', description: 'Armor-piercing gauss shot', precastBullets: 4, precastInterval: 0.2, shape: 'gauss_pierce', color: '#ffcc00' },
    { id: 'UNIQUE_S12', name: 'Sentry Plasma', characterId: 'UNIQUE', slot: 12, baseDamage: 180, damage: 180, cooldown: 14, unlockLevel: 38, unlock: 38, icon: '🔫', tier: 'rare', element: 'PLASMA', description: 'Deploy plasma-firing auto-turret', precastBullets: 3, precastInterval: 0.3, shape: 'sentry_plasma', color: '#00ffaa' },
    { id: 'UNIQUE_S13', name: 'Voidlight Soul', characterId: 'UNIQUE', slot: 13, baseDamage: 320, damage: 320, cooldown: 13, unlockLevel: 43, unlock: 43, icon: '👻', tier: 'epic', element: 'SHADOW', description: 'Soul-draining void beam', precastBullets: 5, precastInterval: 0.18, shape: 'voidlight_soul', color: '#aa00ff' },
    { id: 'UNIQUE_S14', name: 'Voidlight Radiant', characterId: 'UNIQUE', slot: 14, baseDamage: 340, damage: 340, cooldown: 12, unlockLevel: 46, unlock: 46, icon: '☀️', tier: 'epic', element: 'LIGHT', description: 'Radiant void-light fusion beam', precastBullets: 4, precastInterval: 0.22, shape: 'voidlight_radiant', color: '#ffff00' },
    { id: 'UNIQUE_X2', name: 'Voidlight ULTIMATE', characterId: 'UNIQUE', slot: 'X2', baseDamage: 600, damage: 600, cooldown: 30, unlockLevel: 50, unlock: 50, icon: '💥', tier: 'legendary', element: 'ARCANE', description: 'Ultimate void-light convergence', precastBullets: 6, precastInterval: 0.12, shape: 'voidlight_ultimate', color: '#cc00ff' },

    // MISSY UPGRADED SKILLS
    { id: 'MISSY_S7', name: 'Divine Burst', characterId: 'MISSY', slot: 7, baseDamage: 260, damage: 260, cooldown: 7, unlockLevel: 35, unlock: 35, icon: '✨', tier: 'rare', element: 'LIGHT', description: 'Radiant burst of divine energy', precastBullets: 4, precastInterval: 0.2, shape: 'divine_burst', color: '#ffccff' },
    { id: 'MISSY_S8', name: 'Angel Wings', characterId: 'MISSY', slot: 8, baseDamage: 180, damage: 180, cooldown: 10, unlockLevel: 30, unlock: 30, icon: '🪽', tier: 'uncommon', element: 'LIGHT', description: 'Feather projectiles with homing', precastBullets: 6, precastInterval: 0.15, shape: 'angel_wings', color: '#ffffff' },
    { id: 'MISSY_S9', name: 'Celestial Strike', characterId: 'MISSY', slot: 9, baseDamage: 320, damage: 320, cooldown: 9, unlockLevel: 40, unlock: 40, icon: '⭐', tier: 'epic', element: 'LIGHT', description: 'Heavenly strike from above', precastBullets: 3, precastInterval: 0.25, shape: 'celestial_strike', color: '#ffd700' },
    { id: 'MISSY_X2', name: 'Angel ULTIMATE', characterId: 'MISSY', slot: 'X2', baseDamage: 550, damage: 550, cooldown: 28, unlockLevel: 50, unlock: 50, icon: '👼', tier: 'legendary', element: 'LIGHT', description: 'Divine judgment from the heavens', precastBullets: 8, precastInterval: 0.1, shape: 'angel_ultimate', color: '#ffdd99' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // ITEMS DATA - Consumables and misc
  // ═══════════════════════════════════════════════════════════════════════════
  const ITEMS_DATA = [
    { id: 'item_hp_potion', name: 'Health Potion', icon: '🧪', category: 'consumable', rarity: 'common', price: 50, effect: { hp: 100 } },
    { id: 'item_mp_potion', name: 'Mana Potion', icon: '💙', category: 'consumable', rarity: 'common', price: 60, effect: { mp: 80 } },
    { id: 'item_energy_drink', name: 'Energy Drink', icon: '⚡', category: 'consumable', rarity: 'uncommon', price: 120, effect: { speed: 0.10, duration: 30 } },
    { id: 'item_chest_bronze', name: 'Bronze Chest', icon: '📦', category: 'container', rarity: 'common', price: 200 },
    { id: 'item_chest_silver', name: 'Silver Chest', icon: '📦', category: 'container', rarity: 'uncommon', price: 500 },
    { id: 'item_chest_gold', name: 'Gold Chest', icon: '📦', category: 'container', rarity: 'rare', price: 1200 }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // QUESTS DATA
  // ═══════════════════════════════════════════════════════════════════════════
  const QUESTS_DATA = [
    { id: 'quest_001', name: 'First Steps', status: 'active', description: 'Open the bag and inspect your gear.', reward: { gold: 100, xp: 50 } },
    { id: 'quest_002', name: 'Gear Up', status: 'available', description: 'Equip at least 3 pieces of gear.', reward: { gold: 200, xp: 100 } },
    { id: 'quest_003', name: 'Skill Master', status: 'locked', description: 'Unlock 5 skills for any character.', reward: { gold: 500, gems: 10 } }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // SHOP DATA
  // ═══════════════════════════════════════════════════════════════════════════
  const SHOP_DATA = [
    { id: 'shop_hp_potion', name: 'Health Potion', cost: 50, icon: '🧪', currency: 'gold', category: 'consumable' },
    { id: 'shop_mp_potion', name: 'Mana Potion', cost: 60, icon: '💙', currency: 'gold', category: 'consumable' },
    { id: 'shop_starter_sword', name: 'Neon Blade', cost: 300, icon: '⚔️', currency: 'gold', category: 'gear' },
    { id: 'shop_chest_bronze', name: 'Bronze Chest', cost: 200, icon: '📦', currency: 'gold', category: 'container' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // BESTIARY DATA - Streamlined
  // ═══════════════════════════════════════════════════════════════════════════
  const BESTIARY_DATA = {
    common: [
      { id: 'monster_slime', name: 'Cyber Slime', icon: '🟢', level: 1, hp: 50, attack: 10, defense: 5, exp: 10, gold: 15, lore: 'Basic cybernetic slime' },
      { id: 'monster_drone', name: 'Security Drone', icon: '🤖', level: 3, hp: 80, attack: 15, defense: 8, exp: 20, gold: 25, lore: 'Automated security unit' }
    ],
    uncommon: [
      { id: 'monster_cyborg', name: 'Cyber Warrior', icon: '⚔️', level: 10, hp: 200, attack: 40, defense: 25, exp: 80, gold: 100, lore: 'Enhanced cybernetic fighter' }
    ],
    rare: [
      { id: 'monster_boss', name: 'Void Lord', icon: '👹', level: 25, hp: 1000, attack: 150, defense: 80, exp: 500, gold: 800, lore: 'Powerful void entity' }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MISSIONS DATA
  // ═══════════════════════════════════════════════════════════════════════════
  const MISSIONS_DATA = [
    { id: 'mission_001', name: 'Clear Zone 1', type: 'dungeon', level: 1, reward: { gold: 500, xp: 200 }, description: 'Clear all enemies in Zone 1' },
    { id: 'mission_002', name: 'Defeat Boss', type: 'boss', level: 5, reward: { gold: 1000, gems: 20 }, description: 'Defeat the Zone 1 Boss' },
    { id: 'mission_003', name: 'Survival Challenge', type: 'survival', level: 10, reward: { gold: 2000, xp: 500 }, description: 'Survive 5 minutes' }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════════════════════
  window.NeoGameData = {
    gear: GEAR_DATA,
    pets: PETS_DATA,
    vehicles: VEHICLES_DATA,
    robots: ROBOTS_DATA,
    skills: SKILLS_DATA,
    items: ITEMS_DATA,
    quests: QUESTS_DATA,
    shop: SHOP_DATA,
    bestiary: BESTIARY_DATA,
    missions: MISSIONS_DATA,
    SHOP_ITEMS_DB: SHOP_DATA,
    MISSIONS_DB: MISSIONS_DATA,
    BESTIARY_DB: Object.values(BESTIARY_DATA).flat(),
    SKILLS_DB: SKILLS_DATA,
    getSkillsForCharacter: (charId) => SKILLS_DATA.filter(s => s.characterId === charId)
  };

  console.log('✅ Neo Game Data loaded:', {
    gear: GEAR_DATA.length,
    pets: PETS_DATA.length,
    vehicles: VEHICLES_DATA.length,
    robots: ROBOTS_DATA.length,
    skills: SKILLS_DATA.length
  });
})();

