/**
 * A1K Dungeon System - Room Configurations and Data
 * 15 Room Types: Soul Knight Style Side-Scrolling Dungeons
 */

(function() {
  'use strict';

  console.log('[DungeonData] Loading dungeon room configurations...');

  window.DungeonRoomData = {
    
    // ═══════════════════════════════════════════════════════════════
    // ROOM TYPE CONFIGURATIONS
    // ═══════════════════════════════════════════════════════════════
    
    roomTypes: {
      dungeon_depths: {
        id: 'dungeon_depths',
        name: 'Dungeon Depths',
        icon: '🕳️',
        description: 'Dark underground caverns with torches lighting the way. Hidden passages lead to secret treasure rooms.',
        theme: 'dark',
        backgroundColor: '#0a0a0a',
        foregroundColor: '#2a2a2a',
        accentColor: '#FFA500', // Torch orange
        platforms: {
          ground: { color: '#4a4a4a', height: 20 },
          mid: { color: '#3a3a3a', height: 15 },
          high: { color: '#2a2a2a', height: 12 }
        },
        features: ['torches', 'hidden_passages', 'cave_walls', 'stalactites'],
        enemySpawnRate: 0.8,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.3
      },

      elf_forest: {
        id: 'elf_forest',
        name: 'Elf Forest',
        icon: '🌲',
        description: 'Magical forest with floating platforms, tree houses, and hidden groves filled with ancient treasures.',
        theme: 'nature',
        backgroundColor: '#1a3a2a',
        foregroundColor: '#2a5a3a',
        accentColor: '#4ade80', // Magical green
        platforms: {
          ground: { color: '#3a5a2a', height: 20 },
          mid: { color: '#4a6a3a', height: 15, floating: true },
          high: { color: '#5a7a4a', height: 12, floating: true }
        },
        features: ['floating_platforms', 'tree_houses', 'magical_portals', 'ancient_trees'],
        enemySpawnRate: 0.7,
        chestSpawnRate: 0.7,
        hiddenRoomChance: 0.4
      },

      goblin_mines: {
        id: 'goblin_mines',
        name: 'Goblin Mines',
        icon: '⛏️',
        description: 'Mining tunnels with ore carts, glowing ore veins, and secret treasure rooms hidden behind rock walls.',
        theme: 'industrial',
        backgroundColor: '#2a1a0a',
        foregroundColor: '#4a3a2a',
        accentColor: '#fbbf24', // Gold ore
        platforms: {
          ground: { color: '#5a4a3a', height: 20 },
          mid: { color: '#4a3a2a', height: 15 },
          high: { color: '#3a2a1a', height: 12 }
        },
        features: ['ore_carts', 'ore_veins', 'mine_tracks', 'rock_walls'],
        enemySpawnRate: 0.9,
        chestSpawnRate: 0.8,
        hiddenRoomChance: 0.5
      },

      magic_academy: {
        id: 'magic_academy',
        name: 'Magic Academy',
        icon: '🏰',
        description: 'Floating platforms connected by spell circles, library sections with magical books, and hidden study chambers.',
        theme: 'magical',
        backgroundColor: '#1a1a3a',
        foregroundColor: '#2a2a4a',
        accentColor: '#a78bfa', // Magical purple
        platforms: {
          ground: { color: '#3a3a5a', height: 20 },
          mid: { color: '#4a4a6a', height: 15, floating: true },
          high: { color: '#5a5a7a', height: 12, floating: true }
        },
        features: ['spell_circles', 'floating_books', 'magical_portals', 'library_shelves'],
        enemySpawnRate: 0.6,
        chestSpawnRate: 0.5,
        hiddenRoomChance: 0.4
      },

      space_station: {
        id: 'space_station',
        name: 'Space Station',
        icon: '🚀',
        description: 'Zero-gravity platforms, airlocks, and hidden compartments with advanced technology and alien artifacts.',
        theme: 'sci-fi',
        backgroundColor: '#0a0a1a',
        foregroundColor: '#1a1a2a',
        accentColor: '#60a5fa', // Tech blue
        platforms: {
          ground: { color: '#2a2a3a', height: 20 },
          mid: { color: '#3a3a4a', height: 15, floating: true },
          high: { color: '#4a4a5a', height: 12, floating: true }
        },
        features: ['airlocks', 'zero_gravity_zones', 'tech_panels', 'alien_artifacts'],
        enemySpawnRate: 0.7,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.3
      },

      samurai_dojo: {
        id: 'samurai_dojo',
        name: 'Samurai Dojo',
        icon: '⚔️',
        description: 'Traditional Japanese architecture with training platforms, hidden chambers behind sliding doors, and ancient weapon racks.',
        theme: 'traditional',
        backgroundColor: '#2a1a0a',
        foregroundColor: '#4a3a2a',
        accentColor: '#dc2626', // Red accents
        platforms: {
          ground: { color: '#5a4a3a', height: 20 },
          mid: { color: '#4a3a2a', height: 15 },
          high: { color: '#3a2a1a', height: 12 }
        },
        features: ['sliding_doors', 'weapon_racks', 'training_dummies', 'zen_gardens'],
        enemySpawnRate: 0.8,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.4
      },

      pirate_cove: {
        id: 'pirate_cove',
        name: 'Pirate Cove',
        icon: '🏴‍☠️',
        description: 'Ship decks with rope swings, hidden treasure caves, and secret passages behind barrels and crates.',
        theme: 'pirate',
        backgroundColor: '#1a2a1a',
        foregroundColor: '#2a3a2a',
        accentColor: '#f59e0b', // Gold
        platforms: {
          ground: { color: '#3a4a3a', height: 20 },
          mid: { color: '#4a5a4a', height: 15 },
          high: { color: '#5a6a5a', height: 12 }
        },
        features: ['rope_swings', 'ship_decks', 'barrels', 'treasure_caves'],
        enemySpawnRate: 0.8,
        chestSpawnRate: 0.9,
        hiddenRoomChance: 0.5
      },

      zombie_apocalypse: {
        id: 'zombie_apocalypse',
        name: 'Zombie Apocalypse',
        icon: '🧟',
        description: 'Urban ruins with broken buildings, rooftop paths, and hidden safe houses filled with supplies.',
        theme: 'post-apocalyptic',
        backgroundColor: '#1a1a1a',
        foregroundColor: '#2a2a2a',
        accentColor: '#84cc16', // Toxic green
        platforms: {
          ground: { color: '#3a3a3a', height: 20 },
          mid: { color: '#4a4a4a', height: 15 },
          high: { color: '#5a5a5a', height: 12 }
        },
        features: ['broken_buildings', 'rubble', 'safe_houses', 'barricades'],
        enemySpawnRate: 1.0,
        chestSpawnRate: 0.7,
        hiddenRoomChance: 0.4
      },

      carnival_circus: {
        id: 'carnival_circus',
        name: 'Carnival Circus',
        icon: '🎪',
        description: 'Colorful tents, tightrope platforms, hidden backstage areas, and secret performer rooms.',
        theme: 'festive',
        backgroundColor: '#2a1a3a',
        foregroundColor: '#4a3a5a',
        accentColor: '#f472b6', // Pink
        platforms: {
          ground: { color: '#5a4a6a', height: 20 },
          mid: { color: '#6a5a7a', height: 15 },
          high: { color: '#7a6a8a', height: 12 }
        },
        features: ['colorful_tents', 'tightropes', 'backstage_areas', 'circus_lights'],
        enemySpawnRate: 0.7,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.4
      },

      moon_walk: {
        id: 'moon_walk',
        name: 'Moon Walk',
        icon: '🌙',
        description: 'Low-gravity platforms, crater jumps, and hidden lunar bases with advanced technology.',
        theme: 'lunar',
        backgroundColor: '#1a1a2a',
        foregroundColor: '#2a2a3a',
        accentColor: '#e0e7ff', // Moonlight blue
        platforms: {
          ground: { color: '#3a3a4a', height: 20 },
          mid: { color: '#4a4a5a', height: 15, lowGravity: true },
          high: { color: '#5a5a6a', height: 12, lowGravity: true }
        },
        features: ['craters', 'low_gravity_zones', 'lunar_bases', 'space_rocks'],
        enemySpawnRate: 0.6,
        chestSpawnRate: 0.5,
        hiddenRoomChance: 0.3
      },

      crystal_caverns: {
        id: 'crystal_caverns',
        name: 'Crystal Caverns',
        icon: '💎',
        description: 'Glowing crystal platforms, hidden crystal chambers, and prismatic light effects throughout.',
        theme: 'crystal',
        backgroundColor: '#0a0a2a',
        foregroundColor: '#1a1a3a',
        accentColor: '#a855f7', // Crystal purple
        platforms: {
          ground: { color: '#2a2a4a', height: 20 },
          mid: { color: '#3a3a5a', height: 15, glowing: true },
          high: { color: '#4a4a6a', height: 12, glowing: true }
        },
        features: ['glowing_crystals', 'prismatic_light', 'crystal_chambers', 'reflective_surfaces'],
        enemySpawnRate: 0.7,
        chestSpawnRate: 0.8,
        hiddenRoomChance: 0.4
      },

      volcanic_forge: {
        id: 'volcanic_forge',
        name: 'Volcanic Forge',
        icon: '🌋',
        description: 'Lava platforms, floating rocks, and hidden forge rooms with legendary weapons.',
        theme: 'volcanic',
        backgroundColor: '#2a0a0a',
        foregroundColor: '#4a1a1a',
        accentColor: '#f97316', // Lava orange
        platforms: {
          ground: { color: '#5a2a1a', height: 20 },
          mid: { color: '#6a3a2a', height: 15, floating: true },
          high: { color: '#7a4a3a', height: 12, floating: true }
        },
        features: ['lava_pools', 'floating_rocks', 'forge_fires', 'molten_metal'],
        enemySpawnRate: 0.9,
        chestSpawnRate: 0.7,
        hiddenRoomChance: 0.3
      },

      sky_temple: {
        id: 'sky_temple',
        name: 'Sky Temple',
        icon: '☁️',
        description: 'Floating temple platforms, cloud jumps, and hidden sanctums with divine treasures.',
        theme: 'divine',
        backgroundColor: '#1a2a3a',
        foregroundColor: '#2a3a4a',
        accentColor: '#fbbf24', // Divine gold
        platforms: {
          ground: { color: '#3a4a5a', height: 20 },
          mid: { color: '#4a5a6a', height: 15, floating: true },
          high: { color: '#5a6a7a', height: 12, floating: true }
        },
        features: ['cloud_platforms', 'divine_light', 'temple_pillars', 'sacred_chambers'],
        enemySpawnRate: 0.6,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.5
      },

      underwater_ruins: {
        id: 'underwater_ruins',
        name: 'Underwater Ruins',
        icon: '🌊',
        description: 'Bubble platforms, sunken structures, and hidden chambers filled with ancient aquatic treasures.',
        theme: 'aquatic',
        backgroundColor: '#0a1a2a',
        foregroundColor: '#1a2a3a',
        accentColor: '#06b6d4', // Ocean blue
        platforms: {
          ground: { color: '#2a3a4a', height: 20 },
          mid: { color: '#3a4a5a', height: 15, floating: true },
          high: { color: '#4a5a6a', height: 12, floating: true }
        },
        features: ['bubble_platforms', 'sunken_ruins', 'coral_reefs', 'ancient_chambers'],
        enemySpawnRate: 0.7,
        chestSpawnRate: 0.7,
        hiddenRoomChance: 0.4
      },

      desert_oasis: {
        id: 'desert_oasis',
        name: 'Desert Oasis',
        icon: '🏜️',
        description: 'Sand platforms, mirage portals, and hidden oasis rooms with rare desert treasures.',
        theme: 'desert',
        backgroundColor: '#3a2a1a',
        foregroundColor: '#5a4a3a',
        accentColor: '#fbbf24', // Sand gold
        platforms: {
          ground: { color: '#6a5a4a', height: 20 },
          mid: { color: '#7a6a5a', height: 15 },
          high: { color: '#8a7a6a', height: 12 }
        },
        features: ['sand_dunes', 'mirage_portals', 'oasis_pools', 'ancient_ruins'],
        enemySpawnRate: 0.8,
        chestSpawnRate: 0.6,
        hiddenRoomChance: 0.4
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // RANK CONFIGURATIONS (C to SSS)
    // ═══════════════════════════════════════════════════════════════
    
    ranks: {
      C: {
        name: 'C-Rank',
        color: '#9ca3af', // Gray
        unlockLevel: 1,
        floors: 5,
        roomsPerFloor: 3,
        enemyMultiplier: 0.5,
        rewardMultiplier: 0.5,
        dailyEntries: -1, // Unlimited
        description: 'Entry level dungeons. Perfect for beginners.'
      },
      B: {
        name: 'B-Rank',
        color: '#60a5fa', // Blue
        unlockLevel: 10,
        floors: 8,
        roomsPerFloor: 4,
        enemyMultiplier: 1.0,
        rewardMultiplier: 1.0,
        dailyEntries: 10,
        description: 'Moderate difficulty. Elite enemies await.'
      },
      A: {
        name: 'A-Rank',
        color: '#34d399', // Green
        unlockLevel: 25,
        floors: 12,
        roomsPerFloor: 5,
        enemyMultiplier: 1.5,
        rewardMultiplier: 1.5,
        dailyEntries: 5,
        description: 'High difficulty. Mini-bosses appear.'
      },
      S: {
        name: 'S-Rank',
        color: '#fbbf24', // Gold
        unlockLevel: 50,
        floors: 15,
        roomsPerFloor: 6,
        enemyMultiplier: 2.0,
        rewardMultiplier: 2.0,
        dailyEntries: 3,
        description: 'Extreme difficulty. Multiple bosses.'
      },
      SS: {
        name: 'SS-Rank',
        color: '#f97316', // Orange
        unlockLevel: 75,
        floors: 18,
        roomsPerFloor: 7,
        enemyMultiplier: 3.0,
        rewardMultiplier: 3.0,
        dailyEntries: 1,
        description: 'Legendary difficulty. Unique bosses.'
      },
      SSS: {
        name: 'SSS-Rank',
        color: '#ef4444', // Red
        unlockLevel: 100,
        floors: 20,
        roomsPerFloor: 8,
        enemyMultiplier: 5.0,
        rewardMultiplier: 5.0,
        dailyEntries: 1, // Per week
        description: 'Ultimate challenge. Final bosses.'
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // NPC TYPES FOR ROOMS
    // ═══════════════════════════════════════════════════════════════
    
    npcTypes: {
      shop: {
        icon: '🏪',
        name: 'Merchant',
        description: 'Sells items and equipment',
        spawnChance: 0.2
      },
      quest: {
        icon: '📜',
        name: 'Quest Giver',
        description: 'Offers dungeon-specific quests',
        spawnChance: 0.15
      },
      hidden: {
        icon: '👤',
        name: 'Hidden NPC',
        description: 'Rare NPCs in secret rooms',
        spawnChance: 0.05
      }
    }
  };

  console.log(`✅ [DungeonData] Loaded ${Object.keys(window.DungeonRoomData.roomTypes).length} room types`);
  console.log(`   • ${Object.keys(window.DungeonRoomData.ranks).length} rank tiers (C to SSS)`);

})();

