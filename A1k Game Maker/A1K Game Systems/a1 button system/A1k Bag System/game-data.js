// ═══════════════════════════════════════════════════════════════════════════
// GEAR MANIFEST – Production-ready gear definitions & stat helpers
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const PERCENT_STATS = new Set([
    'critRate',
    'critDamage',
    'lifesteal',
    'armorPen',
    'block',
    'evade',
    'speed',
    'cooldownReduction',
    'elementalDamage',
    'elementalResist'
  ]);

  const STAT_WEIGHTS = {
    attack: 1.0,
    defense: 0.85,
    hp: 0.15,
    mp: 0.12,
    speed: 180,
    critRate: 240,
    critDamage: 140,
    lifesteal: 260,
    armorPen: 210,
    block: 170,
    evade: 170,
    cooldownReduction: 220,
    elementalDamage: 180,
    elementalResist: 120
  };

  const GEAR_SETS = {
    recruit: {
      name: 'Recruit Initiate',
      bonuses: {
        2: { attack: 8, defense: 8 },
        4: { hp: 120, speed: 0.02 },
        6: { critRate: 0.03, critDamage: 0.15 }
      }
    },
    vanguard: {
      name: 'Vanguard Aegis',
      bonuses: {
        2: { attack: 18, defense: 20 },
        4: { hp: 260, mp: 40, block: 0.05 },
        6: { critRate: 0.04, critDamage: 0.2, armorPen: 0.05 }
      }
    },
    mythic: {
      name: 'Mythic Ascendant',
      bonuses: {
        2: { attack: 35, defense: 28 },
        4: { hp: 420, speed: 0.05, cooldownReduction: 0.05 },
        6: { critRate: 0.06, critDamage: 0.3, lifesteal: 0.05, armorPen: 0.08 }
      }
    }
  };

  const GEAR_MANIFEST = [
    // ═══════════════════════════════════════════════════════════════════
    // Recruit Initiate Set – Common starter gear
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'gear_recruit_blade',
      name: 'Recruit Blade',
      icon: '🗡️',
      category: 'weapon',
      slot: 'weapon',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { attack: 22, critRate: 0.03, critDamage: 0.15, speed: 0.02 },
      upgrade: { maxLevel: 10, costBase: 150, costGrowth: 1.25, perLevel: { attack: 4, critRate: 0.002, critDamage: 0.01, speed: 0.002 } },
      price: 320,
      weight: 1.0,
      description: 'Standard issue academy blade for new adventurers.',
      tags: ['starter', 'balanced']
    },
    {
      id: 'gear_recruit_shield',
      name: 'Recruit Bulwark',
      icon: '🛡️',
      category: 'weapon',
      slot: 'offhand',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { defense: 22, hp: 110, block: 0.05 },
      upgrade: { maxLevel: 10, costBase: 140, costGrowth: 1.25, perLevel: { defense: 3, hp: 18, block: 0.003 } },
      price: 280,
      weight: 1.2,
      description: 'Reliable wooden shield reinforced with iron plating.',
      tags: ['starter', 'defense']
    },
    {
      id: 'gear_recruit_helm',
      name: 'Recruit Visor',
      icon: '🪖',
      category: 'armor',
      slot: 'head',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { defense: 16, hp: 60 },
      upgrade: { maxLevel: 10, costBase: 120, costGrowth: 1.22, perLevel: { defense: 2.5, hp: 12 } },
      price: 230,
      weight: 0.8,
      description: 'Basic metal visor that keeps trainees safe.',
      tags: ['starter']
    },
    {
      id: 'gear_recruit_mail',
      name: 'Recruit Mail',
      icon: '🥋',
      category: 'armor',
      slot: 'chest',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { defense: 28, hp: 140 },
      upgrade: { maxLevel: 10, costBase: 160, costGrowth: 1.25, perLevel: { defense: 3.5, hp: 20 } },
      price: 360,
      weight: 1.4,
      description: 'Padded mail armor issued to academy graduates.',
      tags: ['starter']
    },
    {
      id: 'gear_recruit_gloves',
      name: 'Recruit Grips',
      icon: '🧤',
      category: 'armor',
      slot: 'gloves',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { attack: 12, speed: 0.015 },
      upgrade: { maxLevel: 10, costBase: 110, costGrowth: 1.18, perLevel: { attack: 2.5, speed: 0.0015 } },
      price: 210,
      weight: 0.6,
      description: 'Leather grips that enhance weapon control.',
      tags: ['starter', 'speed']
    },
    {
      id: 'gear_recruit_pants',
      name: 'Recruit Greaves',
      icon: '🦿',
      category: 'armor',
      slot: 'pants',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { defense: 20, hp: 100 },
      upgrade: { maxLevel: 10, costBase: 130, costGrowth: 1.2, perLevel: { defense: 3, hp: 18 } },
      price: 260,
      weight: 1.0,
      description: 'Solid greaves perfect for frontline cadets.',
      tags: ['starter']
    },
    {
      id: 'gear_recruit_boots',
      name: 'Recruit Marchers',
      icon: '👢',
      category: 'armor',
      slot: 'boots',
      rarity: 'common',
      levelRequirement: 1,
      element: 'physical',
      set: 'recruit',
      baseStats: { defense: 14, speed: 0.03 },
      upgrade: { maxLevel: 10, costBase: 120, costGrowth: 1.18, perLevel: { defense: 2.2, speed: 0.002 } },
      price: 240,
      weight: 0.7,
      description: 'Lightweight boots that keep recruits swift.',
      tags: ['starter', 'speed']
    },
    {
      id: 'gear_recruit_ring',
      name: 'Recruit Signet',
      icon: '💍',
      category: 'accessory',
      slot: 'ring',
      rarity: 'common',
      levelRequirement: 1,
      element: 'light',
      set: 'recruit',
      baseStats: { attack: 10, critRate: 0.04, critDamage: 0.1 },
      upgrade: { maxLevel: 10, costBase: 125, costGrowth: 1.22, perLevel: { attack: 2, critRate: 0.002, critDamage: 0.01 } },
      price: 200,
      weight: 0.2,
      description: 'Signet ring worn by academy initiates.',
      tags: ['starter', 'crit']
    },
    {
      id: 'gear_recruit_amulet',
      name: 'Recruit Pendant',
      icon: '📿',
      category: 'accessory',
      slot: 'necklace',
      rarity: 'common',
      levelRequirement: 1,
      element: 'light',
      set: 'recruit',
      baseStats: { hp: 120, mp: 40, lifesteal: 0.01 },
      upgrade: { maxLevel: 10, costBase: 135, costGrowth: 1.2, perLevel: { hp: 18, mp: 6, lifesteal: 0.001 } },
      price: 260,
      weight: 0.3,
      description: 'Blessed pendant that restores vitality.',
      tags: ['starter', 'support']
    },

    // ═══════════════════════════════════════════════════════════════════
    // Vanguard Aegis Set – Rare progression gear
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'gear_vanguard_blade',
      name: 'Vanguard Claymore',
      icon: '⚔️',
      category: 'weapon',
      slot: 'weapon',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'physical',
      set: 'vanguard',
      baseStats: { attack: 55, critRate: 0.05, critDamage: 0.22, armorPen: 0.05 },
      upgrade: { maxLevel: 12, costBase: 320, costGrowth: 1.28, perLevel: { attack: 6, critRate: 0.003, critDamage: 0.012, armorPen: 0.002 } },
      price: 980,
      weight: 1.6,
      description: 'Heavy claymore favored by elite vanguard captains.',
      tags: ['offense']
    },
    {
      id: 'gear_vanguard_shield',
      name: 'Vanguard Tower Shield',
      icon: '🛡️',
      category: 'weapon',
      slot: 'offhand',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'earth',
      set: 'vanguard',
      baseStats: { defense: 55, hp: 220, block: 0.08 },
      upgrade: { maxLevel: 12, costBase: 300, costGrowth: 1.28, perLevel: { defense: 5, hp: 28, block: 0.004 } },
      price: 920,
      weight: 2.0,
      description: 'Tower shield that anchors the vanguard line.',
      tags: ['defense', 'block']
    },
    {
      id: 'gear_vanguard_helm',
      name: 'Vanguard Visor',
      icon: '🪖',
      category: 'armor',
      slot: 'head',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'earth',
      set: 'vanguard',
      baseStats: { defense: 40, hp: 140, block: 0.03 },
      upgrade: { maxLevel: 12, costBase: 260, costGrowth: 1.26, perLevel: { defense: 4, hp: 22, block: 0.002 } },
      price: 760,
      weight: 1.1,
      description: 'Articulated visor that deflects lethal blows.',
      tags: ['defense']
    },
    {
      id: 'gear_vanguard_mail',
      name: 'Vanguard Plate',
      icon: '🥋',
      category: 'armor',
      slot: 'chest',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'earth',
      set: 'vanguard',
      baseStats: { defense: 70, hp: 260 },
      upgrade: { maxLevel: 12, costBase: 340, costGrowth: 1.3, perLevel: { defense: 6.5, hp: 32 } },
      price: 1150,
      weight: 2.2,
      description: 'Full plate harness forged for the vanguard order.',
      tags: ['defense']
    },
    {
      id: 'gear_vanguard_gloves',
      name: 'Vanguard Gauntlets',
      icon: '🧤',
      category: 'armor',
      slot: 'gloves',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'physical',
      set: 'vanguard',
      baseStats: { attack: 24, speed: 0.02, armorPen: 0.02 },
      upgrade: { maxLevel: 12, costBase: 260, costGrowth: 1.26, perLevel: { attack: 3.5, speed: 0.0018, armorPen: 0.0015 } },
      price: 780,
      weight: 0.9,
      description: 'Weighted gauntlets that empower crushing blows.',
      tags: ['offense', 'speed']
    },
    {
      id: 'gear_vanguard_pants',
      name: 'Vanguard Greaves',
      icon: '🦿',
      category: 'armor',
      slot: 'pants',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'earth',
      set: 'vanguard',
      baseStats: { defense: 48, hp: 210 },
      upgrade: { maxLevel: 12, costBase: 280, costGrowth: 1.26, perLevel: { defense: 4.5, hp: 26 } },
      price: 820,
      weight: 1.4,
      description: 'Reinforced greaves that keep the line unbroken.',
      tags: ['defense']
    },
    {
      id: 'gear_vanguard_boots',
      name: 'Vanguard Marchers',
      icon: '👢',
      category: 'armor',
      slot: 'boots',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'earth',
      set: 'vanguard',
      baseStats: { defense: 34, speed: 0.04 },
      upgrade: { maxLevel: 12, costBase: 260, costGrowth: 1.26, perLevel: { defense: 3.2, speed: 0.0025 } },
      price: 780,
      weight: 1.0,
      description: 'Marching boots that let defenders reposition quickly.',
      tags: ['speed']
    },
    {
      id: 'gear_vanguard_ring',
      name: 'Vanguard Crest',
      icon: '💍',
      category: 'accessory',
      slot: 'ring',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'light',
      set: 'vanguard',
      baseStats: { attack: 22, critRate: 0.05, critDamage: 0.18 },
      upgrade: { maxLevel: 12, costBase: 250, costGrowth: 1.24, perLevel: { attack: 3, critRate: 0.0025, critDamage: 0.012 } },
      price: 720,
      weight: 0.3,
      description: 'Golden crest representing the vanguard order.',
      tags: ['crit']
    },
    {
      id: 'gear_vanguard_amulet',
      name: 'Vanguard Sigil',
      icon: '📿',
      category: 'accessory',
      slot: 'necklace',
      rarity: 'rare',
      levelRequirement: 15,
      element: 'light',
      set: 'vanguard',
      baseStats: { hp: 260, mp: 80, lifesteal: 0.02 },
      upgrade: { maxLevel: 12, costBase: 270, costGrowth: 1.26, perLevel: { hp: 32, mp: 10, lifesteal: 0.0015 } },
      price: 860,
      weight: 0.4,
      description: 'Radiant sigil that sustains the front line.',
      tags: ['support']
    },

    // ═══════════════════════════════════════════════════════════════════
    // Mythic Ascendant Set – Legendary endgame gear
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 'gear_mythic_blade',
      name: 'Mythic Dawnblade',
      icon: '🗡️',
      category: 'weapon',
      slot: 'weapon',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { attack: 110, critRate: 0.08, critDamage: 0.35, armorPen: 0.1, speed: 0.04 },
      upgrade: { maxLevel: 15, costBase: 620, costGrowth: 1.32, perLevel: { attack: 9, critRate: 0.004, critDamage: 0.015, armorPen: 0.003, speed: 0.0025 } },
      price: 2850,
      weight: 1.8,
      description: 'Blade of sunsteel that carves through reality itself.',
      tags: ['legendary', 'offense']
    },
    {
      id: 'gear_mythic_shield',
      name: 'Mythic Starshield',
      icon: '🛡️',
      category: 'weapon',
      slot: 'offhand',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { defense: 105, hp: 420, block: 0.12, elementalResist: 0.08 },
      upgrade: { maxLevel: 15, costBase: 580, costGrowth: 1.32, perLevel: { defense: 7.5, hp: 38, block: 0.004, elementalResist: 0.003 } },
      price: 2680,
      weight: 2.4,
      description: 'Celestial shield that bends starlight into barriers.',
      tags: ['legendary', 'defense']
    },
    {
      id: 'gear_mythic_helm',
      name: 'Mythic Halo',
      icon: '🪖',
      category: 'armor',
      slot: 'head',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { defense: 70, hp: 240, critRate: 0.04, elementalResist: 0.06 },
      upgrade: { maxLevel: 15, costBase: 520, costGrowth: 1.3, perLevel: { defense: 6, hp: 30, critRate: 0.0025, elementalResist: 0.002 } },
      price: 2240,
      weight: 1.4,
      description: 'Grants the wearer a radiant halo of protection.',
      tags: ['legendary']
    },
    {
      id: 'gear_mythic_mail',
      name: 'Mythic Radiant Plate',
      icon: '🥋',
      category: 'armor',
      slot: 'chest',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { defense: 120, hp: 480, elementalResist: 0.1 },
      upgrade: { maxLevel: 15, costBase: 660, costGrowth: 1.34, perLevel: { defense: 8.5, hp: 45, elementalResist: 0.004 } },
      price: 3100,
      weight: 2.6,
      description: 'Armor that radiates pure sunlight to repel darkness.',
      tags: ['legendary']
    },
    {
      id: 'gear_mythic_gloves',
      name: 'Mythic Dawnclaws',
      icon: '🧤',
      category: 'armor',
      slot: 'gloves',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { attack: 48, speed: 0.05, lifesteal: 0.03 },
      upgrade: { maxLevel: 15, costBase: 540, costGrowth: 1.32, perLevel: { attack: 5.5, speed: 0.0025, lifesteal: 0.002 } },
      price: 2380,
      weight: 1.1,
      description: 'Sunlit claws that tear through shadow and refill life.',
      tags: ['legendary', 'lifesteal']
    },
    {
      id: 'gear_mythic_pants',
      name: 'Mythic Legplates',
      icon: '🦿',
      category: 'armor',
      slot: 'pants',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { defense: 90, hp: 360, speed: 0.04 },
      upgrade: { maxLevel: 15, costBase: 560, costGrowth: 1.32, perLevel: { defense: 7, hp: 32, speed: 0.0025 } },
      price: 2460,
      weight: 1.8,
      description: 'Swift greaves that leave trails of shimmering light.',
      tags: ['legendary', 'speed']
    },
    {
      id: 'gear_mythic_boots',
      name: 'Mythic Zephyr Boots',
      icon: '👢',
      category: 'armor',
      slot: 'boots',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'wind',
      set: 'mythic',
      baseStats: { defense: 60, speed: 0.07, evade: 0.04 },
      upgrade: { maxLevel: 15, costBase: 540, costGrowth: 1.32, perLevel: { defense: 5, speed: 0.003, evade: 0.002 } },
      price: 2320,
      weight: 1.2,
      description: 'Boots that glide across battlefields with astral wind.',
      tags: ['legendary', 'speed']
    },
    {
      id: 'gear_mythic_ring',
      name: 'Mythic Solar Band',
      icon: '💍',
      category: 'accessory',
      slot: 'ring',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { attack: 40, critRate: 0.07, critDamage: 0.28, armorPen: 0.06 },
      upgrade: { maxLevel: 15, costBase: 520, costGrowth: 1.3, perLevel: { attack: 5, critRate: 0.003, critDamage: 0.015, armorPen: 0.002 } },
      price: 2200,
      weight: 0.4,
      description: 'Ring forged from a captured solar flare.',
      tags: ['legendary', 'crit']
    },
    {
      id: 'gear_mythic_amulet',
      name: 'Mythic Heart',
      icon: '📿',
      category: 'accessory',
      slot: 'necklace',
      rarity: 'legendary',
      levelRequirement: 30,
      element: 'light',
      set: 'mythic',
      baseStats: { hp: 520, mp: 160, lifesteal: 0.04, cooldownReduction: 0.04 },
      upgrade: { maxLevel: 15, costBase: 540, costGrowth: 1.32, perLevel: { hp: 45, mp: 14, lifesteal: 0.002, cooldownReduction: 0.002 } },
      price: 2550,
      weight: 0.5,
      description: 'Heart of a sun-leviathan crystallized into an amulet.',
      tags: ['legendary', 'support']
    }
  ];

  const GEAR_LOOKUP = Object.fromEntries(GEAR_MANIFEST.map(def => [def.id, def]));

  function roundStat(key, value) {
    if (value == null) return 0;
    const decimals = PERCENT_STATS.has(key) ? 3 : 0;
    return Number(value.toFixed(decimals));
  }

  function calculateStats(def, upgradeLevel = 0) {
    const stats = { ...def.baseStats };
    const growth = def.upgrade?.perLevel || {};

    Object.entries(growth).forEach(([key, value]) => {
      if (value) {
        const base = stats[key] || 0;
        stats[key] = roundStat(key, base + value * upgradeLevel);
      }
    });

    return stats;
  }

  function calculatePower(def, stats) {
    const rarityMult = {
      common: 1,
      uncommon: 1.15,
      rare: 1.4,
      epic: 1.75,
      legendary: 2.2,
      mythic: 2.6
    };

    let power = 0;
    Object.entries(stats).forEach(([key, value]) => {
      if (!value) return;
      const weight = STAT_WEIGHTS[key];
      if (!weight) return;
      power += value * weight;
    });

    const multiplier = rarityMult[def.rarity] || 1;
    return Math.round(power * multiplier);
  }

  function getDefinition(itemOrId) {
    if (!itemOrId) return null;
    const id = typeof itemOrId === 'string' ? itemOrId : (itemOrId.templateId || itemOrId.baseId || itemOrId.id);
    return GEAR_LOOKUP[id] || null;
  }

  function applyStatsToItem(item, stats) {
    item.stats = { ...stats };
    Object.entries(stats).forEach(([key, value]) => {
      item[key] = value;
    });
    const def = getDefinition(item);
    item.power = calculatePower(def || { rarity: item.rarity || 'common' }, stats);
    item.basePrice = item.basePrice || def?.price || 100;
    item.maxUpgradeLevel = item.maxUpgradeLevel || def?.upgrade?.maxLevel || 10;
    item.upgradeCostBase = item.upgradeCostBase || def?.upgrade?.costBase || 150;
    item.upgradeCostGrowth = item.upgradeCostGrowth || def?.upgrade?.costGrowth || 1.25;
    return item;
  }

  function applyStats(item, overrideLevel) {
    const def = getDefinition(item);
    if (!def) return item;
    const level = overrideLevel != null ? overrideLevel : (item.upgradeLevel || 0);
    const stats = calculateStats(def, level);
    return applyStatsToItem(item, stats);
  }

  function createInstance(defOrId, options = {}) {
    const def = typeof defOrId === 'string' ? GEAR_LOOKUP[defOrId] : defOrId;
    if (!def) {
      throw new Error(`[GearData] Unknown gear id: ${defOrId}`);
    }

    const upgradeLevel = options.upgradeLevel || 0;
    const stats = calculateStats(def, upgradeLevel);
    const idSuffix = Math.random().toString(36).slice(2, 8);

    const item = {
      id: options.id || `${def.id}#${idSuffix}`,
      templateId: def.id,
      name: def.name,
      icon: def.icon,
      category: def.category,
      slot: def.slot,
      rarity: def.rarity,
      element: def.element || 'physical',
      set: def.set || null,
      levelRequirement: def.levelRequirement || 1,
      description: def.description || '',
      weight: def.weight || 1,
      tags: Array.isArray(def.tags) ? [...def.tags] : [],
      basePrice: def.price || 100,
      upgradeLevel,
      maxUpgradeLevel: def.upgrade?.maxLevel || 10,
      upgradeCostBase: def.upgrade?.costBase || 150,
      upgradeCostGrowth: def.upgrade?.costGrowth || 1.25,
      quantity: options.quantity || 1,
      type: 'gear'
    };

    applyStatsToItem(item, stats);
    return item;
  }

  function calculateUpgradeCost(item, targetLevel) {
    const def = getDefinition(item);
    const base = item.upgradeCostBase || def?.upgrade?.costBase || 150;
    const growth = item.upgradeCostGrowth || def?.upgrade?.costGrowth || 1.25;
    return Math.round(base * Math.pow(growth, Math.max(0, targetLevel - 1)));
  }

  function formatStat(key, value) {
    if (!value) return null;
    const iconMap = {
      attack: '⚔️',
      defense: '🛡️',
      hp: '❤️',
      mp: '🔷',
      speed: '💨',
      critRate: '🎯',
      critDamage: '💥',
      lifesteal: '🩸',
      armorPen: '🗡️',
      block: '🛡️',
      evade: '🌀',
      cooldownReduction: '⏱️',
      elementalDamage: '🔥',
      elementalResist: '❄️'
    };

    const icon = iconMap[key] || '✨';
    const isPercent = PERCENT_STATS.has(key);
    const displayValue = isPercent ? `${(value * 100).toFixed(1)}%` : Math.round(value);
    return `${icon} ${displayValue}`;
  }

  function getSetBonuses(setId, pieces) {
    const def = GEAR_SETS[setId];
    if (!def) return {};
    const bonuses = {};
    Object.entries(def.bonuses).forEach(([required, bonus]) => {
      if (pieces >= Number(required)) {
        Object.entries(bonus).forEach(([key, value]) => {
          bonuses[key] = (bonuses[key] || 0) + value;
        });
      }
    });
    return bonuses;
  }

  window.GearData = {
    manifest: GEAR_MANIFEST,
    lookup: GEAR_LOOKUP,
    sets: GEAR_SETS,
    statWeights: STAT_WEIGHTS,
    percentStats: PERCENT_STATS,
    createInstance,
    calculateStats,
    applyStats,
    calculatePower,
    calculateItemPower(item) {
      const def = getDefinition(item) || item;
      const stats = item.stats || calculateStats(def, item.upgradeLevel || 0);
      return calculatePower(def, stats);
    },
    calculateUpgradeCost,
    formatStat,
    getDefinition,
    getSetBonuses,
    ensure(item) {
      if (!item) return null;
      return applyStats(item);
    }
  };

  window.GEAR_MANIFEST = GEAR_MANIFEST;
})();
// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED SKILLS MANIFEST
// This file contains the complete, canonical skills database used across
// both the game engine (game.html) and the bag system (a1k-bag-ULTIMATE.html)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Character-to-icon mapping
 */
const CHARACTER_ICONS = {
  A1: '⚔️',
  UNIQUE: '🤖',
  MISSY: '🐱'
};

/**
 * Element-to-icon mapping
 */
const ELEMENT_ICONS = {
  PHYSICAL: '⚔️',
  FIRE: '🔥',
  ICE: '❄️',
  LIGHTNING: '⚡',
  LIGHT: '✨',
  SHADOW: '👻',
  VOID: '🌀',
  ARCANE: '🌠',
  PLASMA: '💥',
  SUMMON: '👥'
};

/**
 * Determine tier based on unlock level and enhanced flag
 */
function determineTier(unlockLevel, enhanced, slot) {
  if (slot === 'X' || slot === 'X2') return 'legendary';
  if (enhanced) return 'epic';
  if (unlockLevel >= 40) return 'epic';
  if (unlockLevel >= 30) return 'rare';
  if (unlockLevel >= 20) return 'uncommon';
  return 'common';
}

/**
 * Determine element based on character and skill properties
 */
function determineElement(characterId, shape, color, name) {
  if (shape === 'summon') return 'SUMMON';
  if (name.toLowerCase().includes('plasma')) return 'PLASMA';
  if (name.toLowerCase().includes('ice') || name.toLowerCase().includes('frost') || name.toLowerCase().includes('cryo') || name.toLowerCase().includes('absolute zero')) return 'ICE';
  if (name.toLowerCase().includes('fire') || name.toLowerCase().includes('flame') || name.toLowerCase().includes('inferno') || name.toLowerCase().includes('crimson')) return 'FIRE';
  if (name.toLowerCase().includes('lightning') || name.toLowerCase().includes('thunder') || name.toLowerCase().includes('electric')) return 'LIGHTNING';
  if (name.toLowerCase().includes('light') || name.toLowerCase().includes('radiant') || name.toLowerCase().includes('golden')) return 'LIGHT';
  if (name.toLowerCase().includes('shadow') || name.toLowerCase().includes('phantom') || name.toLowerCase().includes('void')) return 'SHADOW';
  if (name.toLowerCase().includes('arcane') || name.toLowerCase().includes('dimension')) return 'ARCANE';
  
  // Character defaults
  if (characterId === 'A1') return 'PHYSICAL';
  if (characterId === 'UNIQUE') return 'PLASMA';
  if (characterId === 'MISSY') return 'LIGHT';
  
  return 'PHYSICAL';
}

/**
 * Generate a description based on skill properties
 */
function generateDescription(skill) {
  if (skill.description) return skill.description;
  
  const parts = [];
  
  if (skill.projectileCount > 0) {
    parts.push(`${skill.projectileCount}-projectile attack`);
  }
  
  if (skill.baseDamage) {
    const dmg = Array.isArray(skill.baseDamage) ? skill.baseDamage[0] : skill.baseDamage;
    parts.push(`${dmg} base damage`);
  }
  
  if (skill.shape === 'summon') {
    parts.push('summons an ally');
  } else if (skill.shape === 'beam' || skill.shape === 'hyper_beam' || skill.shape.includes('rail')) {
    parts.push('beam attack');
  } else if (skill.shape.includes('wave') || skill.shape.includes('blast')) {
    parts.push('wave attack');
  } else if (skill.shape.includes('slash') || skill.shape.includes('blade')) {
    parts.push('melee slash');
  }
  
  if (skill.enhanced) {
    parts.push('✨ ENHANCED');
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'A powerful skill';
}

/**
 * Transform game.html SKILLS_DB format to bag system format
 */
function transformSkill(skill) {
  const element = determineElement(skill.characterId, skill.shape, skill.color, skill.name);
  const tier = skill.tier || determineTier(skill.unlockLevel, skill.enhanced, skill.slot);
  const icon = skill.icon || ELEMENT_ICONS[element] || CHARACTER_ICONS[skill.characterId] || '⚡';
  const description = generateDescription(skill);
  const damage = Array.isArray(skill.baseDamage) ? skill.baseDamage[0] : (skill.baseDamage || 0);
  
  return {
    // Core identifiers
    id: skill.id,
    name: skill.name,
    characterId: skill.characterId,
    slot: skill.slot,
    
    // Bag system format
    icon: icon,
    tier: tier,
    element: element,
    description: description,
    damage: damage,
    cooldown: skill.cooldown,
    unlock: skill.unlockLevel || 1,
    
    // Game engine format (preserve all original fields)
    baseDamage: skill.baseDamage,
    unlockLevel: skill.unlockLevel,
    projectileCount: skill.projectileCount,
    shape: skill.shape,
    color: skill.color,
    enhanced: skill.enhanced,
    
    // Preserve any additional special properties
    ...Object.keys(skill).reduce((acc, key) => {
      if (!['id', 'name', 'characterId', 'slot', 'baseDamage', 'cooldown', 'unlockLevel', 'projectileCount', 'shape', 'color', 'enhanced', 'icon', 'tier', 'description'].includes(key)) {
        acc[key] = skill[key];
      }
      return acc;
    }, {})
  };
}

/**
 * The unified skills database
 * Contains ALL skills from game.html in a format compatible with both systems
 */
window.UNIFIED_SKILLS_DB = [
  // === A1 (WARRIOR) ===
  {
    id: 'A1_S1',
    name: 'Crimson Slash',
    characterId: 'A1',
    slot: 1,
    baseDamage: 150,
    cooldown: 2.5,
    unlockLevel: 1,
    projectileCount: 3,
    shape: 'xwave',
    color: '#ff0000'
  },
  {
    id: 'A1_S2',
    name: 'Summon Clone',
    characterId: 'A1',
    slot: 2,
    baseDamage: 0,
    cooldown: 15,
    unlockLevel: 20,
    projectileCount: 0,
    shape: 'summon',
    color: '#ff0000'
  },
  {
    id: 'A1_S3',
    name: 'Power Wave',
    characterId: 'A1',
    slot: 3,
    baseDamage: 250,
    cooldown: 4,
    unlockLevel: 1,
    projectileCount: 4,
    shape: 'xwave',
    enhanced: true,
    color: '#ff0000'
  },
  {
    id: 'A1_S4',
    name: 'Phantom Step: Backstab Waltz',
    characterId: 'A1',
    slot: 4,
    baseDamage: 110,
    cooldown: 20,
    unlockLevel: 30,
    setupSwings: 6,
    swingInterval: 0.12,
    finalPower: 320,
    executeThreshold: 0.30,
    arcRadius: 120,
    crescentRadius: 180,
    teleport: true,
    vacuumRadius: 80,
    shape: 'backstab_waltz',
    enhanced: true,
    color: '#00E5FF'
  },
  {
    id: 'A1_S5',
    name: 'Crimson Cyclone: Blink Chain',
    characterId: 'A1',
    slot: 5,
    baseDamage: 150,
    cooldown: 24,
    unlockLevel: 40,
    blinkCount: 3,
    spinTicks: 6,
    spinTickDamage: 50,
    slamDamage: 300,
    stunDuration: 0.4,
    vortexRadius: 200,
    shape: 'blink_chain',
    enhanced: true,
    color: '#FF0000'
  },
  {
    id: 'A1_X1',
    name: 'World Splitter',
    characterId: 'A1',
    slot: 'X',
    baseDamage: [260, 320, 380],
    cooldown: 28,
    unlockLevel: 50,
    charge: {
      t1: 0.50,
      t2: 0.80
    },
    riftCount: 2,
    riftWidth: [60, 75, 90],
    riftSeparation: 36,
    pierceUnlimited: true,
    bossTailBonus: 0.25,
    bleedDps: 20,
    bleedDuration: 2.0,
    shape: 'world_splitter',
    color: '#00E5FF'
  },

  // === UNIQUE (CYBORG) ===
  {
    id: 'UNIQUE_S1',
    name: 'Plasma Blast',
    characterId: 'UNIQUE',
    slot: 1,
    baseDamage: 120,
    cooldown: 2,
    unlockLevel: 1,
    projectileCount: 3,
    shape: 'plasma',
    color: '#00ffff'
  },
  {
    id: 'UNIQUE_S2',
    name: 'Summon Drone',
    characterId: 'UNIQUE',
    slot: 2,
    baseDamage: 0,
    cooldown: 15,
    unlockLevel: 20,
    projectileCount: 0,
    shape: 'summon',
    color: '#00ffff'
  },
  {
    id: 'UNIQUE_S3',
    name: 'Hyper Beam',
    characterId: 'UNIQUE',
    slot: 3,
    baseDamage: 400,
    cooldown: 8,
    unlockLevel: 1,
    projectileCount: 0,
    shape: 'hyper_beam',
    enhanced: true,
    color: '#00ffff',
    beamDuration: 1.5
  },
  {
    id: 'UNIQUE_S4',
    name: 'Absolute Zero Rail + Cryo Barrage',
    characterId: 'UNIQUE',
    slot: 4,
    baseDamage: 45,
    cooldown: 20,
    unlockLevel: 30,
    railDuration: 0.45,
    railTicksPerSec: 12,
    cryoCount: 4,
    cryoDamage: 180,
    cryoPierce: 2,
    cryoChain: 1,
    chainFalloff: 0.6,
    shape: 'cryo_rail',
    enhanced: true,
    color: '#87CEEB'
  },
  {
    id: 'UNIQUE_S5',
    name: 'Ion Helix Drill',
    characterId: 'UNIQUE',
    slot: 5,
    baseDamage: 38,
    cooldown: 24,
    unlockLevel: 40,
    drillDuration: 0.9,
    drillTicksPerSec: 15,
    pullStrength: 120,
    steerDegrees: 8,
    endBurst: 220,
    shape: 'helix_drill',
    enhanced: true,
    color: '#00FFFF'
  },
  {
    id: 'UNIQUE_X1',
    name: 'Hyper Ion Wave',
    characterId: 'UNIQUE',
    slot: 'X',
    baseDamage: [34, 41, 46],
    cooldown: 28,
    unlockLevel: 50,
    charge: {
      t1: 0.60,
      t2: 1.00
    },
    beamDuration: 1.6,
    beamTicksPerSec: 16,
    beamWidth: [80, 96, 112],
    steerDegrees: 10,
    endCone: [200, 240, 300],
    deepChillStacks: 3,
    shape: 'goku_beam',
    color: '#00FFFF'
  },

  // === MISSY (CAT ANGEL) ===
  {
    id: 'MISSY_S1',
    name: 'Blade Dance',
    characterId: 'MISSY',
    slot: 1,
    baseDamage: 130,
    cooldown: 2.5,
    unlockLevel: 1,
    projectileCount: 3,
    shape: 'slash',
    color: '#ff69b4'
  },
  {
    id: 'MISSY_S2',
    name: 'Summon Pet',
    characterId: 'MISSY',
    slot: 2,
    baseDamage: 0,
    cooldown: 15,
    unlockLevel: 20,
    projectileCount: 0,
    shape: 'summon',
    color: '#ff69b4'
  },
  {
    id: 'MISSY_S3',
    name: 'Gun Barrage',
    characterId: 'MISSY',
    slot: 3,
    baseDamage: 200,
    cooldown: 4,
    unlockLevel: 1,
    projectileCount: 4,
    shape: 'bullet',
    enhanced: true,
    color: '#ff69b4'
  },
  {
    id: 'MISSY_S4',
    name: 'Golden Rail & Comets',
    characterId: 'MISSY',
    slot: 4,
    baseDamage: 560,
    railDuration: 0.6,
    railTicksPerSec: 10,
    cometCount: 8,
    cometDamage: 180,
    cometPierce: 4,
    magnetRadius: 200,
    magnetTime: 2.0,
    boomerangDegrees: 45,
    cooldown: 6,
    unlockLevel: 30,
    shape: 'gold_rail',
    enhanced: true,
    color: '#ffd700'
  },
  {
    id: 'MISSY_S5',
    name: 'Royal Typhoon',
    characterId: 'MISSY',
    slot: 5,
    baseDamage: 720,
    cycloneDuration: 1.8,
    cycloneTicks: 18,
    cycloneTickDamage: 40,
    cycloneMagnet: 140,
    coneVolleys: 3,
    conePellets: 8,
    coneSpread: 35,
    conePower: 110,
    cooldown: 8,
    unlockLevel: 40,
    shape: 'royal_typhoon',
    enhanced: true,
    typhoonRadius: 150,
    color: '#ffd700'
  },
  {
    id: 'MISSY_X1',
    name: 'Royal Coin Cannon',
    characterId: 'MISSY',
    slot: 'X',
    baseDamage: [1400, 2000, 2800],
    charge: {
      t1: 0.5,
      t2: 0.9,
      dmgMult: [1.0, 1.4, 1.8],
      sizeMult: [1.0, 1.3, 1.6]
    },
    beamDuration: 1.4,
    beamWidth: [70, 90, 110],
    beamMagnet: [180, 220, 280],
    beamTickDamage: 90,
    beamTicksPerSec: 12,
    finalNova: [1200, 1800, 2400],
    cooldown: 20,
    unlockLevel: 50,
    shape: 'vegeta_cannon',
    color: '#ffd700'
  },

  // ═══════════════════════════════════════════════════════════════════
  // UPGRADED SKILLS - Advanced Abilities
  // ═══════════════════════════════════════════════════════════════════

  // A1 UPGRADED SKILLS
  {
    id: 'A1_S7',
    name: 'Phantom Edge Combo',
    characterId: 'A1',
    slot: 7,
    icon: '⚔️',
    tier: 'epic',
    baseDamage: 180,
    cooldown: 8,
    unlockLevel: 35,
    description: '3-hit phantom blade combo with void slashes',
    precastBullets: 3,
    precastInterval: 0.25,
    shape: 'phantom_combo',
    color: '#9966ff'
  },
  {
    id: 'A1_S8',
    name: 'Phantom Void',
    characterId: 'A1',
    slot: 8,
    icon: '🌀',
    tier: 'rare',
    baseDamage: 220,
    cooldown: 10,
    unlockLevel: 40,
    description: 'Void energy slash with dimensional rift',
    precastBullets: 2,
    precastInterval: 0.3,
    shape: 'phantom_void',
    color: '#6600cc'
  },
  {
    id: 'A1_S9',
    name: 'Phantom Radiant',
    characterId: 'A1',
    slot: 9,
    icon: '✨',
    tier: 'epic',
    baseDamage: 280,
    cooldown: 12,
    unlockLevel: 45,
    description: 'Radiant phantom slash with light burst',
    precastBullets: 4,
    precastInterval: 0.2,
    shape: 'phantom_radiant',
    color: '#ffdd00'
  },
  {
    id: 'A1_X2',
    name: 'Phantom ULTIMATE',
    characterId: 'A1',
    slot: 'X2',
    icon: '💥',
    tier: 'legendary',
    baseDamage: 500,
    cooldown: 30,
    unlockLevel: 50,
    description: 'Ultimate phantom barrage - massive combo attack',
    precastBullets: 6,
    precastInterval: 0.15,
    shape: 'phantom_ultimate',
    color: '#ff00ff'
  },

  // UNIQUE UPGRADED SKILLS
  {
    id: 'UNIQUE_S7',
    name: 'Voidlight Cannon',
    characterId: 'UNIQUE',
    slot: 7,
    icon: '🌌',
    tier: 'rare',
    baseDamage: 300,
    cooldown: 8,
    unlockLevel: 35,
    description: 'Void energy cannon beam',
    precastBullets: 4,
    precastInterval: 0.2,
    shape: 'voidlight_cannon',
    color: '#00ffff'
  },
  {
    id: 'UNIQUE_S8',
    name: 'Kinetic Sentry',
    characterId: 'UNIQUE',
    slot: 8,
    icon: '🤖',
    tier: 'uncommon',
    baseDamage: 150,
    cooldown: 15,
    unlockLevel: 30,
    description: 'Deploy auto-firing kinetic turret',
    precastBullets: 2,
    precastInterval: 0.4,
    shape: 'sentry',
    color: '#00aaff'
  },
  {
    id: 'UNIQUE_S9',
    name: 'Gauss Driver',
    characterId: 'UNIQUE',
    slot: 9,
    icon: '⚡',
    tier: 'rare',
    baseDamage: 400,
    cooldown: 10,
    unlockLevel: 40,
    description: 'Heavy electromagnetic rail cannon shot',
    precastBullets: 2,
    precastInterval: 0.5,
    shape: 'gauss_driver',
    color: '#ffaa00'
  },
  {
    id: 'UNIQUE_S10',
    name: 'Gauss Rail',
    characterId: 'UNIQUE',
    slot: 10,
    icon: '⚡',
    tier: 'epic',
    baseDamage: 350,
    cooldown: 9,
    unlockLevel: 42,
    description: 'Piercing rail cannon with chain lightning',
    precastBullets: 3,
    precastInterval: 0.25,
    shape: 'gauss_rail',
    color: '#ff8800'
  },
  {
    id: 'UNIQUE_S11',
    name: 'Gauss Pierce',
    characterId: 'UNIQUE',
    slot: 11,
    icon: '💫',
    tier: 'epic',
    baseDamage: 380,
    cooldown: 11,
    unlockLevel: 44,
    description: 'Armor-piercing gauss shot',
    precastBullets: 4,
    precastInterval: 0.2,
    shape: 'gauss_pierce',
    color: '#ffcc00'
  },
  {
    id: 'UNIQUE_S12',
    name: 'Sentry Plasma',
    characterId: 'UNIQUE',
    slot: 12,
    icon: '🔫',
    tier: 'rare',
    baseDamage: 180,
    cooldown: 14,
    unlockLevel: 38,
    description: 'Deploy plasma-firing auto-turret',
    precastBullets: 3,
    precastInterval: 0.3,
    shape: 'sentry_plasma',
    color: '#00ffaa'
  },
  {
    id: 'UNIQUE_S13',
    name: 'Voidlight Soul',
    characterId: 'UNIQUE',
    slot: 13,
    icon: '👻',
    tier: 'epic',
    baseDamage: 320,
    cooldown: 13,
    unlockLevel: 43,
    description: 'Soul-draining void beam',
    precastBullets: 5,
    precastInterval: 0.18,
    shape: 'voidlight_soul',
    color: '#aa00ff'
  },
  {
    id: 'UNIQUE_S14',
    name: 'Voidlight Radiant',
    characterId: 'UNIQUE',
    slot: 14,
    icon: '☀️',
    tier: 'epic',
    baseDamage: 340,
    cooldown: 12,
    unlockLevel: 46,
    description: 'Radiant void-light fusion beam',
    precastBullets: 4,
    precastInterval: 0.22,
    shape: 'voidlight_radiant',
    color: '#ffff00'
  },
  {
    id: 'UNIQUE_X2',
    name: 'Voidlight ULTIMATE',
    characterId: 'UNIQUE',
    slot: 'X2',
    icon: '💥',
    tier: 'legendary',
    baseDamage: 600,
    cooldown: 30,
    unlockLevel: 50,
    description: 'Ultimate void-light convergence',
    precastBullets: 6,
    precastInterval: 0.12,
    shape: 'voidlight_ultimate',
    color: '#cc00ff'
  },

  // MISSY UPGRADED SKILLS
  {
    id: 'MISSY_S7',
    name: 'Divine Burst',
    characterId: 'MISSY',
    slot: 7,
    icon: '✨',
    tier: 'rare',
    baseDamage: 260,
    cooldown: 7,
    unlockLevel: 35,
    description: 'Radiant burst of divine energy',
    precastBullets: 4,
    precastInterval: 0.2,
    shape: 'divine_burst',
    color: '#ffccff'
  },
  {
    id: 'MISSY_S8',
    name: 'Angel Wings',
    characterId: 'MISSY',
    slot: 8,
    icon: '🪽',
    tier: 'uncommon',
    baseDamage: 180,
    cooldown: 10,
    unlockLevel: 30,
    description: 'Feather projectiles with homing',
    precastBullets: 6,
    precastInterval: 0.15,
    shape: 'angel_wings',
    color: '#ffffff'
  },
  {
    id: 'MISSY_S9',
    name: 'Celestial Strike',
    characterId: 'MISSY',
    slot: 9,
    icon: '⭐',
    tier: 'epic',
    baseDamage: 320,
    cooldown: 9,
    unlockLevel: 40,
    description: 'Heavenly strike from above',
    precastBullets: 3,
    precastInterval: 0.25,
    shape: 'celestial_strike',
    color: '#ffd700'
  },
  {
    id: 'MISSY_X2',
    name: 'Angel ULTIMATE',
    characterId: 'MISSY',
    slot: 'X2',
    icon: '👼',
    tier: 'legendary',
    baseDamage: 550,
    cooldown: 28,
    unlockLevel: 50,
    description: 'Divine judgment from the heavens',
    precastBullets: 8,
    precastInterval: 0.1,
    shape: 'angel_ultimate',
    color: '#ffdd99'
  }
].map(transformSkill);

// Export for bag system compatibility
window.BEST_SKILLS_MANIFEST = window.UNIFIED_SKILLS_DB;

// Export for game engine compatibility (with proper format for SKILLS_DB)
window.SKILLS_DB = window.UNIFIED_SKILLS_DB;

console.log('✅ Unified Skills Manifest loaded:', window.UNIFIED_SKILLS_DB.length, 'skills');
console.log('   - A1 skills:', window.UNIFIED_SKILLS_DB.filter(s => s.characterId === 'A1').length);
console.log('   - UNIQUE skills:', window.UNIFIED_SKILLS_DB.filter(s => s.characterId === 'UNIQUE').length);
console.log('   - MISSY skills:', window.UNIFIED_SKILLS_DB.filter(s => s.characterId === 'MISSY').length);

/**
 * Mission Data
 * Templates for all mission types: Hunt, Survival, Boss Rush, Tower, Dungeon
 */

(function() {
  'use strict';

  console.log('[MissionData] Loading mission templates...');

  window.MissionDatabase = {
    // Hunt Bounty Missions
    hunt: [
      {
        id: "hunt_slime_king",
        type: "hunt",
        name: "Hunt the Slime King",
        description: "Defeat the Slime King and claim his core",
        targetEnemy: "boss_slime_king",
        targetCount: 1,
        difficulty: 2,
        rewards: { gold: 500, items: ["material_slime_core"], xp: 500 },
        unlockLevel: 1
      },
      {
        id: "hunt_goblin_warlord",
        type: "hunt",
        name: "Goblin Warlord Bounty",
        description: "Eliminate the Goblin Warlord terrorizing the villages",
        targetEnemy: "boss_goblin_warlord",
        targetCount: 1,
        difficulty: 2,
        rewards: { gold: 600, items: ["material_warlord_axe"], xp: 600 },
        unlockLevel: 2
      },
      {
        id: "hunt_slimes",
        type: "hunt",
        name: "Slime Cleanup",
        description: "Defeat 10 slimes",
        targetEnemy: "enemy_slime",
        targetCount: 10,
        difficulty: 1,
        rewards: { gold: 200, items: ["material_slime_gel"], xp: 100 },
        unlockLevel: 1
      },
      {
        id: "hunt_goblins",
        type: "hunt",
        name: "Goblin Extermination",
        description: "Defeat 15 goblins",
        targetEnemy: "enemy_goblin",
        targetCount: 15,
        difficulty: 1,
        rewards: { gold: 300, items: ["material_wood"], xp: 150 },
        unlockLevel: 1
      }
    ],

    // Horde Survival Missions
    survival: [
      {
        id: "zombie_horde_5min",
        type: "survival",
        name: "Zombie Horde Survival",
        description: "Survive 5 minutes against waves of zombies",
        duration: 300000, // 5 minutes in ms
        enemyType: "zombie",
        spawnRate: 2, // per second
        difficulty: 3,
        rewards: { gold: 1000, xp: 500, items: ["material_zombie_essence"] },
        unlockLevel: 5
      },
      {
        id: "zombie_horde_10min",
        type: "survival",
        name: "Extended Horde Survival",
        description: "Survive 10 minutes against endless zombie waves",
        duration: 600000, // 10 minutes
        enemyType: "zombie",
        spawnRate: 3,
        difficulty: 4,
        rewards: { gold: 2500, xp: 1200, items: ["material_zombie_essence", "core_dark"] },
        unlockLevel: 10
      },
      {
        id: "enemy_wave_survival",
        type: "survival",
        name: "Endless Wave Survival",
        description: "Survive as long as possible against increasing enemy waves",
        duration: -1, // Infinite
        enemyType: "mixed",
        spawnRate: 1,
        difficulty: 5,
        rewards: { gold: 5000, xp: 2000, items: ["core_rare"] },
        unlockLevel: 15
      }
    ],

    // Boss Rush Missions
    bossRush: [
      {
        id: "boss_rush_stage_1_3",
        type: "boss_rush",
        name: "Boss Rush: Stages 1-3",
        description: "Fight all bosses from stages 1-3 back-to-back",
        bosses: ["boss_slime_king", "boss_goblin_warlord", "boss_skeleton_lord"],
        difficulty: 4,
        rewards: { gold: 2000, items: ["core_fire", "core_ice"], xp: 1800 },
        unlockLevel: 5
      },
      {
        id: "boss_rush_stage_4_6",
        type: "boss_rush",
        name: "Boss Rush: Stages 4-6",
        description: "Face the mid-game bosses in rapid succession",
        bosses: ["boss_dragon_red", "boss_demon_lord", "boss_ice_queen"],
        difficulty: 5,
        rewards: { gold: 4000, items: ["core_fire", "core_ice", "core_dark"], xp: 3500 },
        unlockLevel: 10
      },
      {
        id: "boss_rush_all",
        type: "boss_rush",
        name: "Ultimate Boss Rush",
        description: "Fight ALL bosses in one epic challenge",
        bosses: ["boss_slime_king", "boss_goblin_warlord", "boss_skeleton_lord", "boss_dragon_red", "boss_demon_lord"],
        difficulty: 5,
        rewards: { gold: 10000, items: ["core_legendary", "weapon_fusion_staff_sss"], xp: 8000 },
        unlockLevel: 20
      }
    ],

    // Tower Floor Missions
    tower: [
      {
        id: "tower_floor_1",
        type: "tower",
        name: "Dark Tower - Floor 1",
        description: "Clear 20 waves of enemies and defeat the floor boss",
        floor: 1,
        waves: 20,
        enemies: ["enemy_slime", "enemy_goblin", "enemy_skeleton"],
        boss: "boss_slime_king",
        difficulty: 2,
        rewards: { gold: 800, items: ["material_tower_essence"], xp: 600 },
        unlockLevel: 3
      },
      {
        id: "tower_floor_2",
        type: "tower",
        name: "Dark Tower - Floor 2",
        description: "Face stronger enemies on the second floor",
        floor: 2,
        waves: 25,
        enemies: ["enemy_goblin", "enemy_skeleton", "enemy_wolf"],
        boss: "boss_goblin_warlord",
        difficulty: 3,
        rewards: { gold: 1200, items: ["material_tower_essence", "core_rare"], xp: 900 },
        unlockLevel: 5
      },
      {
        id: "tower_floor_3",
        type: "tower",
        name: "Dark Tower - Floor 3",
        description: "The third floor brings new challenges",
        floor: 3,
        waves: 30,
        enemies: ["enemy_skeleton", "enemy_wolf", "enemy_orc"],
        boss: "boss_skeleton_lord",
        difficulty: 3,
        rewards: { gold: 1800, items: ["material_tower_essence", "core_rare"], xp: 1200 },
        unlockLevel: 7
      },
      {
        id: "tower_floor_5",
        type: "tower",
        name: "Dark Tower - Floor 5",
        description: "Mid-tier floor with elite enemies",
        floor: 5,
        waves: 40,
        enemies: ["enemy_orc", "enemy_demon", "enemy_golem"],
        boss: "boss_dragon_red",
        difficulty: 4,
        rewards: { gold: 3000, items: ["material_tower_essence", "core_fire"], xp: 2000 },
        unlockLevel: 10
      }
    ],

    // Dungeon Run Missions
    dungeon: [
      {
        id: "dungeon_ancient_temple",
        type: "dungeon",
        name: "Ancient Temple",
        description: "Explore the ancient temple and defeat its guardians",
        rooms: 5,
        enemies: ["enemy_skeleton", "enemy_mummy", "boss_skeleton_lord"],
        difficulty: 3,
        rewards: { gold: 1500, items: ["weapon_ancient_blade"], xp: 1000 },
        unlockLevel: 5
      },
      {
        id: "dungeon_crystal_caverns",
        type: "dungeon",
        name: "Crystal Caverns",
        description: "Navigate through crystal-filled caves",
        rooms: 7,
        enemies: ["enemy_golem", "enemy_elemental_ice", "boss_ice_queen"],
        difficulty: 4,
        rewards: { gold: 2500, items: ["core_ice", "material_crystal_shard"], xp: 1800 },
        unlockLevel: 8
      },
      {
        id: "dungeon_demon_fortress",
        type: "dungeon",
        name: "Demon Fortress",
        description: "Invade the demon fortress and face its master",
        rooms: 10,
        enemies: ["enemy_demon", "enemy_imp", "boss_demon_lord"],
        difficulty: 5,
        rewards: { gold: 5000, items: ["core_dark", "weapon_dark_sword_ss"], xp: 3500 },
        unlockLevel: 12
      }
    ],

    // Get all missions
    getAllMissions: function() {
      return [
        ...this.hunt,
        ...this.survival,
        ...this.bossRush,
        ...this.tower,
        ...this.dungeon
      ];
    },

    // Get missions by type
    getMissionsByType: function(type) {
      return this.getAllMissions().filter(m => m.type === type);
    },

    // Get mission by ID
    getMissionById: function(id) {
      return this.getAllMissions().find(m => m.id === id);
    },

    // Get available missions (based on player level)
    getAvailableMissions: function(playerLevel = 1) {
      return this.getAllMissions().filter(m => (m.unlockLevel || 1) <= playerLevel);
    }
  };

  console.log(`[MissionData] Loaded ${window.MissionDatabase.getAllMissions().length} missions`);
})();

// ═══════════════════════════════════════════════════════════════════════════
// A1K DROP SYSTEMS & BESTIARY - STANDALONE MODULE
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // DROP SYSTEMS DATA
  // ═══════════════════════════════════════════════════════════════════════════

  const DROP_TABLES = {
    // Common Drops
    common: [
      { id: 'health_potion_small', name: 'Small Health Potion', icon: '🧪', rarity: 'common', type: 'consumable', effect: '+50 HP', dropRate: 0.4 },
      { id: 'mana_potion_small', name: 'Small Mana Potion', icon: '💙', rarity: 'common', type: 'consumable', effect: '+30 MP', dropRate: 0.3 },
      { id: 'gold_small', name: 'Gold Coins', icon: '💰', rarity: 'common', type: 'currency', amount: '10-25g', dropRate: 0.5 },
      { id: 'cloth_scrap', name: 'Cloth Scrap', icon: '🧵', rarity: 'common', type: 'material', dropRate: 0.35 },
      { id: 'leather_scrap', name: 'Leather Scrap', icon: '🦴', rarity: 'common', type: 'material', dropRate: 0.3 },
      { id: 'gear_recruit_pants', name: 'Recruit Greaves', icon: '🦿', rarity: 'common', type: 'gear', slot: 'pants', dropRate: 0.05 }
    ],

    // Uncommon Drops
    uncommon: [
      { id: 'health_potion_medium', name: 'Medium Health Potion', icon: '🧪', rarity: 'uncommon', type: 'consumable', effect: '+100 HP', dropRate: 0.2 },
      { id: 'mana_potion_medium', name: 'Medium Mana Potion', icon: '💙', rarity: 'uncommon', type: 'consumable', effect: '+60 MP', dropRate: 0.15 },
      { id: 'iron_ore', name: 'Iron Ore', icon: '⛏️', rarity: 'uncommon', type: 'material', dropRate: 0.2 },
      { id: 'ruby_shard', name: 'Ruby Shard', icon: '💎', rarity: 'uncommon', type: 'material', dropRate: 0.15 },
      { id: 'enchanted_dust', name: 'Enchanted Dust', icon: '✨', rarity: 'uncommon', type: 'material', dropRate: 0.18 },
      { id: 'gear_vanguard_pants', name: 'Vanguard Greaves', icon: '🦿', rarity: 'rare', type: 'gear', slot: 'pants', dropRate: 0.03 }
    ],

    // Rare Drops
    rare: [
      { id: 'health_potion_large', name: 'Large Health Potion', icon: '🧪', rarity: 'rare', type: 'consumable', effect: '+200 HP', dropRate: 0.08 },
      { id: 'skill_book_common', name: 'Skill Book: Common', icon: '📕', rarity: 'rare', type: 'skill', dropRate: 0.1 },
      { id: 'mythril_ore', name: 'Mythril Ore', icon: '⛏️', rarity: 'rare', type: 'material', dropRate: 0.09 },
      { id: 'dragon_scale', name: 'Dragon Scale', icon: '🐉', rarity: 'rare', type: 'material', dropRate: 0.07 },
      { id: 'enchanted_gem', name: 'Enchanted Gem', icon: '💠', rarity: 'rare', type: 'material', dropRate: 0.08 },
      { id: 'gear_mythic_pants', name: 'Mythic Legplates', icon: '🦿', rarity: 'legendary', type: 'gear', slot: 'pants', dropRate: 0.01 }
    ],

    // Epic Drops
    epic: [
      { id: 'resurrection_scroll', name: 'Resurrection Scroll', icon: '📜', rarity: 'epic', type: 'consumable', effect: 'Revive with 50% HP', dropRate: 0.03 },
      { id: 'skill_book_rare', name: 'Skill Book: Rare', icon: '📘', rarity: 'epic', type: 'skill', dropRate: 0.04 },
      { id: 'celestial_crystal', name: 'Celestial Crystal', icon: '🔮', rarity: 'epic', type: 'material', dropRate: 0.03 },
      { id: 'phoenix_feather', name: 'Phoenix Feather', icon: '🪶', rarity: 'epic', type: 'material', dropRate: 0.025 }
    ],

    // Legendary Drops
    legendary: [
      { id: 'elixir_of_life', name: 'Elixir of Life', icon: '⚗️', rarity: 'legendary', type: 'consumable', effect: 'Full Restore + Buff', dropRate: 0.01 },
      { id: 'skill_book_legendary', name: 'Skill Book: Legendary', icon: '📙', rarity: 'legendary', type: 'skill', dropRate: 0.008 },
      { id: 'void_essence', name: 'Void Essence', icon: '🌑', rarity: 'legendary', type: 'material', dropRate: 0.005 },
      { id: 'legendary_chest', name: 'Legendary Chest', icon: '🎁', rarity: 'legendary', type: 'chest', dropRate: 0.002 }
    ]
  };

  // Drop System Configuration
  const DROP_SYSTEM_CONFIG = {
    chests: [
      { id: 'wooden_chest', name: 'Wooden Chest', icon: '📦', rarity: 'common', loot: ['common', 'uncommon'], goldRange: [5, 15] },
      { id: 'iron_chest', name: 'Iron Chest', icon: '🗃️', rarity: 'uncommon', loot: ['uncommon', 'rare'], goldRange: [20, 50] },
      { id: 'golden_chest', name: 'Golden Chest', icon: '💼', rarity: 'rare', loot: ['rare', 'epic'], goldRange: [50, 150] },
      { id: 'mythic_chest', name: 'Mythic Chest', icon: '🎁', rarity: 'epic', loot: ['epic', 'legendary'], goldRange: [200, 500] }
    ],

    bosses: [
      { id: 'goblin_king', name: 'Goblin King', level: 5, guaranteedDrops: 1, rarityBoost: 1.2 },
      { id: 'dragon_lord', name: 'Dragon Lord', level: 15, guaranteedDrops: 2, rarityBoost: 1.5 },
      { id: 'void_reaper', name: 'Void Reaper', level: 25, guaranteedDrops: 3, rarityBoost: 2.0 }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BESTIARY DATA
  // ═══════════════════════════════════════════════════════════════════════════

  const BESTIARY_DATA = {
    common: [
      { id: 'slime', name: 'Slime', icon: '🟢', level: 1, hp: 50, attack: 5, defense: 2, gold: '1-3', exp: 10, lore: 'A wobbly creature made of goo.' },
      { id: 'goblin', name: 'Goblin', icon: '👺', level: 2, hp: 80, attack: 10, defense: 5, gold: '3-7', exp: 20, lore: 'Small but cunning creatures.' },
      { id: 'wolf', name: 'Wolf', icon: '🐺', level: 3, hp: 120, attack: 15, defense: 8, gold: '5-10', exp: 30, lore: 'Hunts in packs at night.' },
      { id: 'skeleton', name: 'Skeleton', icon: '💀', level: 4, hp: 100, attack: 12, defense: 10, gold: '4-8', exp: 25, lore: 'Animated bones seeking revenge.' }
    ],

    uncommon: [
      { id: 'orc_warrior', name: 'Orc Warrior', icon: '🧟', level: 6, hp: 200, attack: 25, defense: 15, gold: '15-30', exp: 60, lore: 'Brutal fighters with great strength.' },
      { id: 'dark_knight', name: 'Dark Knight', icon: '🛡️', level: 8, hp: 280, attack: 30, defense: 25, gold: '20-40', exp: 90, lore: 'Fallen knights corrupted by darkness.' },
      { id: 'ice_golem', name: 'Ice Golem', icon: '❄️', level: 9, hp: 350, attack: 35, defense: 30, gold: '25-50', exp: 110, lore: 'Living ice with a frozen heart.' },
      { id: 'fire_demon', name: 'Fire Demon', icon: '🔥', level: 10, hp: 320, attack: 40, defense: 20, gold: '30-60', exp: 120, lore: 'Burns everything in its path.' }
    ],

    rare: [
      { id: 'wyvern', name: 'Wyvern', icon: '🐲', level: 12, hp: 500, attack: 55, defense: 35, gold: '50-100', exp: 200, lore: 'Lesser dragon with deadly venom.' },
      { id: 'shadow_assassin', name: 'Shadow Assassin', icon: '🥷', level: 14, hp: 420, attack: 70, defense: 30, gold: '60-120', exp: 250, lore: 'Strikes from the shadows.' },
      { id: 'necromancer', name: 'Necromancer', icon: '🧙', level: 15, hp: 450, attack: 65, defense: 40, gold: '70-140', exp: 280, lore: 'Master of death magic.' },
      { id: 'minotaur', name: 'Minotaur', icon: '🐂', level: 16, hp: 600, attack: 60, defense: 45, gold: '80-160', exp: 300, lore: 'Half-man, half-bull beast.' }
    ],

    epic: [
      { id: 'dragon', name: 'Ancient Dragon', icon: '🐉', level: 20, hp: 1000, attack: 100, defense: 60, gold: '200-400', exp: 600, lore: 'Legendary creature of immense power.' },
      { id: 'lich', name: 'Lich Lord', icon: '☠️', level: 22, hp: 850, attack: 110, defense: 70, gold: '250-500', exp: 700, lore: 'Immortal undead sorcerer.' },
      { id: 'titan', name: 'Titan', icon: '⚡', level: 25, hp: 1200, attack: 120, defense: 80, gold: '300-600', exp: 850, lore: 'Giants from the age of gods.' }
    ],

    legendary: [
      { id: 'void_lord', name: 'Void Lord', icon: '🌑', level: 30, hp: 2000, attack: 150, defense: 100, gold: '500-1000', exp: 1500, lore: 'Entity from beyond reality.' },
      { id: 'phoenix', name: 'Eternal Phoenix', icon: '🔥', level: 35, hp: 2500, attack: 180, defense: 120, gold: '800-1500', exp: 2000, lore: 'Reborn from its ashes eternally.' },
      { id: 'kraken', name: 'Deep Kraken', icon: '🦑', level: 40, hp: 3000, attack: 200, defense: 150, gold: '1000-2000', exp: 3000, lore: 'Terror of the deepest seas.' }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // DROP SYSTEM RENDERER
  // ═══════════════════════════════════════════════════════════════════════════

  window.DropSystemsRenderer = {
    renderDropSystemsTab() {
      const pane = document.getElementById('bagContentPane');
      if (!pane) return;

      const allDrops = Object.entries(DROP_TABLES).map(([rarity, items]) => ({
        rarity,
        items
      }));

      const getRarityColor = (rarity) => {
        const colors = {
          common: '#9ca3af',
          uncommon: '#60a5fa',
          rare: '#a78bfa',
          epic: '#f472b6',
          legendary: '#fbbf24'
        };
        return colors[rarity] || '#fff';
      };

      pane.innerHTML = `
        <div style="padding: 20px; overflow-y: auto; height: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #7ad5ff; font-size: 18px; margin: 0;">🎁 Drop Systems</h2>
            <div style="display: flex; gap: 8px;">
              <button class="auto-btn" onclick="window.DropSystemsRenderer.simulateDrop('common')" style="font-size: 10px;">Test Common</button>
              <button class="auto-btn" onclick="window.DropSystemsRenderer.simulateDrop('rare')" style="font-size: 10px;">Test Rare</button>
              <button class="auto-btn" onclick="window.DropSystemsRenderer.simulateDrop('legendary')" style="font-size: 10px;">Test Legendary</button>
            </div>
          </div>

          <!-- Drop Tables -->
          ${allDrops.map(({ rarity, items }) => `
            <div style="margin-bottom: 24px;">
              <h3 style="color: ${getRarityColor(rarity)}; font-size: 14px; text-transform: capitalize; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                ${rarity} Drops
                <span style="font-size: 11px; color: rgba(255,255,255,0.5);">(${items.length} items)</span>
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
                ${items.map(item => `
                  <div style="
                    background: rgba(15, 24, 38, 0.6);
                    border: 1px solid ${getRarityColor(rarity)}40;
                    border-radius: 8px;
                    padding: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s;
                    cursor: pointer;
                  " onmouseover="this.style.borderColor='${getRarityColor(rarity)}'; this.style.transform='translateY(-2px)'" onmouseout="this.style.borderColor='${getRarityColor(rarity)}40'; this.style.transform='translateY(0)'">
                    <div style="font-size: 24px;">${item.icon}</div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="color: ${getRarityColor(rarity)}; font-weight: 600; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                      <div style="color: rgba(255,255,255,0.5); font-size: 9px; margin-top: 2px;">${item.type}</div>
                      ${item.effect ? `<div style="color: #38ef7d; font-size: 9px; margin-top: 2px;">${item.effect}</div>` : ''}
                      <div style="color: rgba(255,255,255,0.4); font-size: 9px; margin-top: 4px;">Drop Rate: ${(item.dropRate * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Chest System -->
          <div style="margin-top: 32px;">
            <h3 style="color: #7ad5ff; font-size: 14px; margin-bottom: 12px;">📦 Chest System</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
              ${DROP_SYSTEM_CONFIG.chests.map(chest => `
                <div style="
                  background: linear-gradient(135deg, rgba(15, 24, 38, 0.8), rgba(30, 41, 59, 0.8));
                  border: 2px solid ${getRarityColor(chest.rarity)};
                  border-radius: 12px;
                  padding: 16px;
                  text-align: center;
                " onclick="window.DropSystemsRenderer.openChest('${chest.id}')">
                  <div style="font-size: 48px; margin-bottom: 8px;">${chest.icon}</div>
                  <div style="color: ${getRarityColor(chest.rarity)}; font-weight: 700; font-size: 13px; margin-bottom: 4px;">${chest.name}</div>
                  <div style="color: rgba(255,255,255,0.6); font-size: 10px; margin-bottom: 8px;">Contains: ${chest.loot.join(', ')}</div>
                  <div style="color: #fbbf24; font-size: 10px;">💰 ${chest.goldRange[0]}-${chest.goldRange[1]}g</div>
                  <button class="auto-btn" style="margin-top: 12px; width: 100%; font-size: 10px;">Open Chest</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Boss Drop Info -->
          <div style="margin-top: 32px;">
            <h3 style="color: #7ad5ff; font-size: 14px; margin-bottom: 12px;">👹 Boss Drop Bonuses</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 12px;">
              ${DROP_SYSTEM_CONFIG.bosses.map(boss => `
                <div style="
                  background: rgba(15, 24, 38, 0.6);
                  border: 1px solid rgba(255, 107, 53, 0.5);
                  border-radius: 8px;
                  padding: 16px;
                ">
                  <div style="color: #ff6b35; font-weight: 700; font-size: 13px; margin-bottom: 8px;">${boss.name}</div>
                  <div style="color: rgba(255,255,255,0.6); font-size: 10px; line-height: 1.6;">
                    Level: <span style="color: #fff">${boss.level}</span><br>
                    Guaranteed Drops: <span style="color: #fbbf24">${boss.guaranteedDrops}</span><br>
                    Rarity Boost: <span style="color: #a78bfa">${boss.rarityBoost}x</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    simulateDrop(rarityFilter) {
      const items = DROP_TABLES[rarityFilter] || DROP_TABLES.common;
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`${randomItem.icon} Found: ${randomItem.name}!`);
      } else {
        alert(`${randomItem.icon} Found: ${randomItem.name}!`);
      }
    },

    openChest(chestId) {
      const chest = DROP_SYSTEM_CONFIG.chests.find(c => c.id === chestId);
      if (!chest) return;

      const gold = Math.floor(Math.random() * (chest.goldRange[1] - chest.goldRange[0] + 1)) + chest.goldRange[0];
      const lootRarity = chest.loot[Math.floor(Math.random() * chest.loot.length)];
      const lootItems = DROP_TABLES[lootRarity] || DROP_TABLES.common;
      const loot = lootItems[Math.floor(Math.random() * lootItems.length)];

      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`📦 ${chest.name} opened! Found ${loot.icon} ${loot.name} + ${gold}g!`);
      } else {
        alert(`📦 ${chest.name} opened! Found ${loot.icon} ${loot.name} + ${gold}g!`);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BESTIARY RENDERER
  // ═══════════════════════════════════════════════════════════════════════════

  window.BestiaryRenderer = {
    renderBestiaryTab() {
      const pane = document.getElementById('bagContentPane');
      if (!pane) return;

      const allMonsters = Object.entries(BESTIARY_DATA).map(([rarity, monsters]) => ({
        rarity,
        monsters
      }));

      const getRarityColor = (rarity) => {
        const colors = {
          common: '#9ca3af',
          uncommon: '#60a5fa',
          rare: '#a78bfa',
          epic: '#f472b6',
          legendary: '#fbbf24'
        };
        return colors[rarity] || '#fff';
      };

      pane.innerHTML = `
        <div style="padding: 20px; overflow-y: auto; height: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #7ad5ff; font-size: 18px; margin: 0;">📖 Bestiary</h2>
            <div style="color: rgba(255,255,255,0.5); font-size: 11px;">
              Total Monsters: ${Object.values(BESTIARY_DATA).reduce((sum, arr) => sum + arr.length, 0)}
            </div>
          </div>

          ${allMonsters.map(({ rarity, monsters }) => `
            <div style="margin-bottom: 32px;">
              <h3 style="
                color: ${getRarityColor(rarity)};
                font-size: 14px;
                text-transform: capitalize;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 8px;
                padding-bottom: 8px;
                border-bottom: 2px solid ${getRarityColor(rarity)}40;
              ">
                ${rarity} Monsters
                <span style="font-size: 11px; color: rgba(255,255,255,0.5);">(${monsters.length} entries)</span>
              </h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px;">
                ${monsters.map(monster => `
                  <div style="
                    background: linear-gradient(135deg, rgba(15, 24, 38, 0.8), rgba(30, 41, 59, 0.6));
                    border: 2px solid ${getRarityColor(rarity)}40;
                    border-radius: 12px;
                    padding: 16px;
                    transition: all 0.3s;
                    cursor: pointer;
                  " onmouseover="this.style.borderColor='${getRarityColor(rarity)}'; this.style.transform='translateY(-4px) scale(1.02)'; this.style.boxShadow='0 8px 24px ${getRarityColor(rarity)}40'" onmouseout="this.style.borderColor='${getRarityColor(rarity)}40'; this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none'">
                    <div style="display: flex; gap: 16px; margin-bottom: 12px;">
                      <div style="font-size: 48px; line-height: 1;">${monster.icon}</div>
                      <div style="flex: 1;">
                        <div style="color: ${getRarityColor(rarity)}; font-weight: 700; font-size: 14px; margin-bottom: 4px;">${monster.name}</div>
                        <div style="color: rgba(255,255,255,0.5); font-size: 10px; margin-bottom: 8px; font-style: italic;">${monster.lore}</div>
                        <div style="display: inline-block; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 12px; font-size: 10px; color: #fbbf24;">
                          Level ${monster.level}
                        </div>
                      </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
                      <div style="background: rgba(255, 59, 59, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(255, 59, 59, 0.3);">
                        <div style="color: rgba(255,255,255,0.5); font-size: 9px; margin-bottom: 2px;">HP</div>
                        <div style="color: #ff3b3b; font-weight: 700; font-size: 12px;">❤️ ${monster.hp}</div>
                      </div>
                      <div style="background: rgba(255, 182, 122, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(255, 182, 122, 0.3);">
                        <div style="color: rgba(255,255,255,0.5); font-size: 9px; margin-bottom: 2px;">Attack</div>
                        <div style="color: #ffb67a; font-weight: 700; font-size: 12px;">⚔️ ${monster.attack}</div>
                      </div>
                      <div style="background: rgba(122, 213, 255, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(122, 213, 255, 0.3);">
                        <div style="color: rgba(255,255,255,0.5); font-size: 9px; margin-bottom: 2px;">Defense</div>
                        <div style="color: #7ad5ff; font-weight: 700; font-size: 12px;">🛡️ ${monster.defense}</div>
                      </div>
                      <div style="background: rgba(56, 239, 125, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(56, 239, 125, 0.3);">
                        <div style="color: rgba(255,255,255,0.5); font-size: 9px; margin-bottom: 2px;">EXP</div>
                        <div style="color: #38ef7d; font-weight: 700; font-size: 12px;">⭐ ${monster.exp}</div>
                      </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                      <div style="color: #fbbf24; font-size: 11px; font-weight: 600;">
                        💰 ${monster.gold}
                      </div>
                      <button class="auto-btn" style="font-size: 9px; padding: 4px 12px;" onclick="window.BestiaryRenderer.trackMonster('${monster.id}', '${monster.name}')">
                        Track
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <!-- Statistics Section -->
          <div style="margin-top: 32px; background: rgba(15, 24, 38, 0.8); border: 1px solid rgba(122, 213, 255, 0.3); border-radius: 12px; padding: 20px;">
            <h3 style="color: #7ad5ff; font-size: 14px; margin-bottom: 16px;">📊 Bestiary Statistics</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
              ${Object.entries(BESTIARY_DATA).map(([rarity, monsters]) => `
                <div style="text-align: center;">
                  <div style="color: ${getRarityColor(rarity)}; font-size: 24px; font-weight: 700; margin-bottom: 4px;">${monsters.length}</div>
                  <div style="color: rgba(255,255,255,0.5); font-size: 11px; text-transform: capitalize;">${rarity}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    trackMonster(monsterId, monsterName) {
      if (window.BagSystem && window.BagSystem.showToast) {
        window.BagSystem.showToast(`🎯 Now tracking: ${monsterName}`);
      } else {
        alert(`🎯 Now tracking: ${monsterName}`);
      }
    }
  };

  // Export data for external use
  window.DROP_SYSTEMS = {
    tables: DROP_TABLES,
    config: DROP_SYSTEM_CONFIG
  };

  window.BESTIARY = BESTIARY_DATA;

  console.log('✅ Drop Systems & Bestiary loaded successfully');
  console.log(`📦 ${Object.values(DROP_TABLES).reduce((sum, arr) => sum + arr.length, 0)} drop items available`);
  console.log(`📖 ${Object.values(BESTIARY_DATA).reduce((sum, arr) => sum + arr.length, 0)} monsters cataloged`);

})();

(function candyDungeonAssetBootstrap() {
  'use strict';

  /**
   * Pulls the rich skill definitions from the skills mini-game if they are already on the page.
   * Falls back to a curated subset so the dungeon catalog always has the moves it needs
   * even when the standalone skills game bundle is not present.
   */
  const createSkillLookup = () => {
    const runtimeSkills = Array.isArray(window.SKILLS_DB) ? window.SKILLS_DB : null;
    if (runtimeSkills) {
      return runtimeSkills.reduce((acc, skill) => {
        acc[skill.id] = { ...skill };
        return acc;
      }, {});
    }

    // Minimal fallback sourced from skills-game-complete/game.html (trimmed fields keep bundle light)
    return {
      A1_S1: { id: 'A1_S1', name: 'Crimson Slash', characterId: 'A1', slot: 1, baseDamage: 150, cooldown: 2.5, shape: 'xwave', color: '#ff0000' },
      A1_S4: { id: 'A1_S4', name: 'Phantom Step: Backstab Waltz', characterId: 'A1', slot: 4, baseDamage: 110, cooldown: 20, executeThreshold: 0.30, shape: 'backstab_waltz', color: '#00E5FF' },
      A1_X1: { id: 'A1_X1', name: 'World Splitter', characterId: 'A1', slot: 'X', baseDamage: [260, 320, 380], cooldown: 28, riftCount: 2, shape: 'world_splitter', color: '#00E5FF' },
      UNIQUE_S3: { id: 'UNIQUE_S3', name: 'Hyper Beam', characterId: 'UNIQUE', slot: 3, baseDamage: 400, cooldown: 8, beamDuration: 1.5, shape: 'hyper_beam', color: '#00ffff' },
      UNIQUE_S4: { id: 'UNIQUE_S4', name: 'Absolute Zero Rail', characterId: 'UNIQUE', slot: 4, baseDamage: 45, cooldown: 20, railDuration: 0.45, cryoDamage: 180, shape: 'cryo_rail', color: '#87CEEB' },
      UNIQUE_S5: { id: 'UNIQUE_S5', name: 'Ion Helix Drill', characterId: 'UNIQUE', slot: 5, baseDamage: 38, cooldown: 24, drillDuration: 0.9, shape: 'helix_drill', color: '#00FFFF' },
      MISSY_S1: { id: 'MISSY_S1', name: 'Royal Blade Dance', characterId: 'MISSY', slot: 1, baseDamage: 130, cooldown: 2.8, shape: 'blade_dance', color: '#ff9ed1' },
      MISSY_S4: { id: 'MISSY_S4', name: 'Golden Rail', characterId: 'MISSY', slot: 4, baseDamage: 70, cooldown: 18, railDuration: 0.5, shape: 'golden_rail', color: '#ffd700' },
      MISSY_S5: { id: 'MISSY_S5', name: 'Royal Coin Cannon', characterId: 'MISSY', slot: 5, baseDamage: 320, cooldown: 22, projectileCount: 12, shape: 'coin_cannon', color: '#ffdf4f' }
    };
  };

  const skillsById = createSkillLookup();
  const pullSkill = (id) => {
    const skill = skillsById[id];
    if (!skill) {
      console.warn(`[CandyDungeonAssets] Missing skill "${id}" from skills manifest.`);
      return null;
    }
    return { ...skill };
  };

  /**
   * Characters from the skills mini-game reinterpreted for the candy Solo Leveling campaign.
   * Sprite references point to the skills-game-complete bundle so the caller can lazy-load them when rendering.
   */
  const characters = [
    {
      id: 'A1',
      codename: 'Crimson Vanguard',
      displayName: 'A1 - Crimson Vanguard',
      spriteSheet: 'skills-game-complete/assets/sprites/a1_crimson.png',
      auraColor: '#ff005d',
      role: 'Burst Duelist',
      bio: 'The original Solo Leveling swordsman who carved through demon gates. Specialises in time-splitting slashes and execution finishers.',
      signatureSkillIds: ['A1_S1', 'A1_S4', 'A1_X1'],
      recommendedStats: { power: 2600, agility: 2400, essence: 1200 }
    },
    {
      id: 'UNIQUE',
      codename: 'Chrono Cyborg',
      displayName: 'UNIQUE - Chrono Cyborg',
      spriteSheet: 'skills-game-complete/assets/sprites/unique_cyborg.png',
      auraColor: '#00e5ff',
      role: 'Hybrid Artillery',
      bio: 'Experimental fusion of candy tech and cyborg weapon systems. Locks down arenas with sustained beams and cryo railguns.',
      signatureSkillIds: ['UNIQUE_S3', 'UNIQUE_S4', 'UNIQUE_S5'],
      recommendedStats: { power: 2400, agility: 1800, essence: 2000 }
    },
    {
      id: 'MISSY',
      codename: 'Royal Trickster',
      displayName: 'MISSY - Royal Trickster',
      spriteSheet: 'skills-game-complete/assets/sprites/missy_royal.png',
      auraColor: '#ff9ed1',
      role: 'Support Carry',
      bio: 'Candy kingdom princess who commands coin storms and support familiars. Excels at branching encounters with high mobility.',
      signatureSkillIds: ['MISSY_S1', 'MISSY_S4', 'MISSY_S5'],
      recommendedStats: { power: 2100, agility: 2600, essence: 1600 }
    }
  ];

  /**
   * Floor templates describe each encounter archetype.
   * Branching logic uses these templates to assemble unique runs without duplicating configuration.
   */
  const floorTemplates = [
    {
      id: 'floor_candy_scout',
      type: 'scout',
      icon: '🍬',
      description: 'Scout the Sugar Plaza and dissolve 15 gummy raiders before they corrupt the gate.',
      recommendedPower: 1800,
      spawnTable: [
        { enemyId: 'gummy_raider', weight: 45, sprite: 'skills-game-complete/assets/enemies/gummy_raider.png' },
        { enemyId: 'taffy_archer', weight: 35, sprite: 'skills-game-complete/assets/enemies/taffy_archer.png' },
        { enemyId: 'caramel_guardian', weight: 20, sprite: 'skills-game-complete/assets/enemies/caramel_guardian.png' }
      ],
      skillHighlights: ['A1_S1', 'MISSY_S1'],
      environmentalHazards: ['Molten sugar puddles that slow movement by 40%.']
    },
    {
      id: 'floor_puzzle_lights',
      type: 'puzzle',
      icon: '🧩',
      description: 'Stabilise the chroma pillars by chaining light orbs before the timer expires.',
      recommendedPower: 1900,
      puzzleRules: {
        objective: 'Activate 3 chroma pillars',
        timerSeconds: 120,
        penalty: 'Spawns elite macaroon sentries on failure'
      },
      rewardPreview: ['essence', 'candy_core_light'],
      skillHighlights: ['MISSY_S4']
    },
    {
      id: 'floor_elite_mech',
      type: 'elite',
      icon: '🤖',
      description: 'Defeat the Chrono Sugar Golem and its drone cohort.',
      recommendedPower: 2300,
      enemySquads: [
        { enemyId: 'chrono_sugar_golem', sprite: 'skills-game-complete/assets/enemies/chrono_sugar_golem.png', elite: true },
        { enemyId: 'drone_helper', sprite: 'skills-game-complete/assets/enemies/drone_helper.png', count: 4 }
      ],
      skillHighlights: ['UNIQUE_S3', 'UNIQUE_S4'],
      rewards: ['raid_token', 'candy_core_ice']
    },
    {
      id: 'floor_branch_choice',
      type: 'branch',
      icon: '🔀',
      description: 'Choose between speed-clear sugar slides or high-risk caramel vault.',
      recommendedPower: 2100,
      branchOptions: [
        { branchId: 'path_speedrun', label: 'Sugar Sprint (Timed Bonus)', modifiers: { timerSeconds: 150, lootMultiplier: 1.2 } },
        { branchId: 'path_vault', label: 'Caramel Vault (Elite + Loot)', modifiers: { eliteCount: 2, lootMultiplier: 1.5 } }
      ]
    },
    {
      id: 'floor_boss_shadow',
      type: 'boss',
      icon: '👑',
      description: 'Face the Shadow Nougat Avatar wielding Worldbreaker confectionery arts.',
      recommendedPower: 2800,
      bossId: 'shadow_nougat_avatar',
      arenaCue: 'candy_shadow_gate',
      skillHighlights: ['A1_X1', 'UNIQUE_S5'],
      rewards: ['legendary_candy_relic', 'solo_leveling_trophy']
    }
  ];

  const branchingPaths = [
    {
      id: 'candy_campaign_route_a',
      name: 'Sugar Citadel Defense',
      description: 'Linear escalation perfect for first clear. Ends with a cinematic boss intro.',
      sequence: ['floor_candy_scout', 'floor_puzzle_lights', 'floor_elite_mech', 'floor_boss_shadow'],
      modifiers: { entryCostGold: 750000, raidKeys: 1, lootMultiplier: 1.5 }
    },
    {
      id: 'candy_campaign_route_b',
      name: 'Caramel Catacombs Branch',
      description: 'Branching second act with speedrun and vault choices. Unlocks leaderboard submission.',
      sequence: ['floor_candy_scout', 'floor_branch_choice', 'floor_elite_mech', 'floor_boss_shadow'],
      modifiers: { entryCostGold: 1100000, raidKeys: 2, lootMultiplier: 1.9, timedRushSeconds: 240 }
    },
    {
      id: 'candy_campaign_route_c',
      name: 'Chrono Collapse Challenge',
      description: 'Hardcore variant that pulls skills from all three heroes with stacked modifiers.',
      sequence: ['floor_puzzle_lights', 'floor_elite_mech', 'floor_branch_choice', 'floor_boss_shadow'],
      modifiers: { entryCostGold: 1500000, raidKeys: 3, lootMultiplier: 2.4, hardcore: true }
    }
  ];

  const cinematics = {
    intro: {
      id: 'cinematic_intro_crimson_city',
      headline: 'Candy City Under Siege',
      narration: '“Solo hunters, the candy citadel is breached. Take your squads and reclaim each floor before the nougat wave spreads.”',
      keyframes: [
        { sprite: 'skills-game-complete/assets/cinematics/city_pan_left.png', duration: 1800 },
        { sprite: 'skills-game-complete/assets/cinematics/city_pan_right.png', duration: 1800 }
      ],
      soundtrack: 'sfx/candy_swell_intro.mp3'
    },
    floorClear: {
      id: 'cinematic_floor_clear',
      headline: 'Sweet Victory',
      narration: '“Another sector purged. Candy citizens cheer from the rooftops.”',
      particlePreset: 'glitter_confetti'
    },
    bossIntro: {
      id: 'cinematic_boss_shadow',
      headline: 'Shadow Nougat Ascends',
      narration: '“Power bleeds from the nougat avatar as the arena crystallises. Prepare your strongest skills.”',
      cameraShake: 18,
      soundtrack: 'sfx/candy_boss_drop.mp3'
    },
    storyBeats: {
      C: [
        { id: 'c_prologue', title: 'Gate Briefing', subtitle: 'Gatekeeper Evie rallies rookie squads to reclaim the Sugar Citadel.' },
        { id: 'c_reinforce', title: 'Sweet Reinforcements', subtitle: 'Candy citizens donate syrup barriers to slow the Nougat surge.' }
      ],
      B: [
        { id: 'b_prologue', title: 'Factory Overdrive', subtitle: 'The caramel forges double output in preparation for elite waves.' },
        { id: 'b_vanguard', title: 'Vanguard Arrival', subtitle: 'Veteran hunters share intel on hidden vault passages.' }
      ],
      A: [
        { id: 'a_chronicle', title: 'Arcane Echo', subtitle: 'Temporal echoes reveal how previous squads cleared the labyrinth.' },
        { id: 'a_empower', title: 'Essence Surge', subtitle: 'Spirit engineers infuse gear with luminous coatings.' }
      ],
      S: [
        { id: 's_brief', title: 'Kingdom Protocol', subtitle: 'Royal decree authorises dimensional anchors around the gate.' },
        { id: 's_catalyst', title: 'Catalyst Awakening', subtitle: 'Dormant candy catalysts flare, stabilising teleport routes.' }
      ],
      SS: [
        { id: 'ss_signal', title: 'Distress Call', subtitle: 'Allied guilds report simultaneous gate spikes across the region.' },
        { id: 'ss_obelisk', title: 'Obelisk Resonance', subtitle: 'Obelisk guardians align to shield civilians from nougat storms.' }
      ],
      SSS: [
        { id: 'sss_manifest', title: 'Shadow Manifest', subtitle: 'The Nougat Avatar fractalises into multiple timelines.' },
        { id: 'sss_finale', title: 'Sweet Salvation', subtitle: 'Candy constellations ignite, guiding the final assault.' }
      ]
    },
    shaderPresets: {
      baseOpacity: 0.45,
      finishedOpacity: 0.12,
      primaryAlpha: 0.35,
      primaryHardcoreAlpha: 0.58,
      secondary: 'rgba(147, 51, 234, 0.24)',
      bossSecondary: 'rgba(255, 110, 170, 0.45)',
      lootAccent: 'rgba(122, 248, 200, 0.32)',
      tertiary: 'rgba(147, 51, 234, 0.18)'
    }
  };

  const catalog = {
    source: 'skills-game-complete',
    version: '1.0.0',
    characters: characters.map(charDef => ({
      ...charDef,
      signatureSkills: charDef.signatureSkillIds.map(pullSkill).filter(Boolean)
    })),
    skills: Object.keys(skillsById).map(pullSkill).filter(Boolean),
    floorTemplates,
    branchingPaths,
    cinematics,
    lootThemes: [
      { id: 'candy_flux', rewards: ['candy_core_fire', 'candy_core_light', 'raid_token'] },
      { id: 'chrono_shards', rewards: ['time_fragment', 'candy_core_ice', 'essence_chunk'] }
    ]
  };

  window.CandyDungeonCatalog = catalog;
  window.dispatchEvent(new CustomEvent('candy-dungeon:catalog-ready', { detail: catalog }));
})();

