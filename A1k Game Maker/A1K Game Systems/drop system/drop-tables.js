/**
 * A1K Drop Tables - Complete Loot System Data
 * Contains all enemy drops, boss loot, quest rewards, and daily missions
 */

(function() {
  'use strict';

  console.log('[DropTables] Loading drop tables data...');

  window.DROP_SYSTEMS = {
    
    // ═══════════════════════════════════════════════════════════════
    // ENEMY TYPE DROP TABLES
    // ═══════════════════════════════════════════════════════════════
    
    enemyTypes: {
      beast: {
        icon: '🐾',
        color: '#8b4513',
        name: 'Beast Enemies',
        description: 'Wild creatures that roam the lands. Drop pets and beast-related items.',
        drops: {
          common: ['pet_dog', 'pet_cat', 'pet_rabbit', 'pet_hamster', 'pet_bird', 'pet_mouse', 'pet_turtle', 'pet_frog', 'pet_pig', 'pet_cow', 'pet_chicken', 'pet_sheep', 'pet_monkey', 'pet_penguin', 'pet_owl'],
          uncommon: ['pet_wolf', 'pet_fox', 'pet_bear', 'pet_eagle', 'pet_panther', 'pet_panda', 'pet_koala', 'pet_tiger', 'pet_lion', 'pet_elephant', 'pet_gorilla', 'pet_rhino', 'pet_falcon', 'pet_snake', 'pet_bat'],
          rare: ['pet_dragon_wyrmling', 'pet_phoenix_chick', 'pet_unicorn', 'pet_griffin', 'pet_cerberus_pup', 'pet_white_tiger', 'pet_hydra_spawn', 'pet_dire_wolf', 'pet_thunderbird', 'pet_basilisk'],
          epic: ['pet_dragon_adult', 'pet_phoenix_adult', 'pet_kraken_spawn', 'pet_celestial_lion', 'pet_shadow_beast'],
          legendary: ['pet_ancient_dragon', 'pet_leviathan', 'pet_behemoth', 'pet_pegasus_lord', 'pet_world_serpent']
        },
        dropRates: {
          common: 0.60,
          uncommon: 0.25,
          rare: 0.10,
          epic: 0.04,
          legendary: 0.01
        }
      },

      elemental: {
        icon: '🔥',
        color: '#f97316',
        name: 'Elemental Enemies',
        description: 'Creatures of pure elemental energy. Drop spirits and essences.',
        drops: {
          common: ['spirit_fire', 'spirit_water', 'spirit_earth', 'spirit_wind', 'spirit_lightning', 'spirit_shadow', 'spirit_light', 'spirit_nature', 'spirit_ice', 'spirit_dark', 'essence_fire', 'essence_water', 'essence_earth', 'essence_wind', 'essence_lightning', 'essence_shadow', 'essence_light'],
          uncommon: ['spirit_inferno', 'spirit_tsunami', 'spirit_earthquake', 'spirit_tempest', 'spirit_thunder', 'spirit_void', 'spirit_radiance', 'spirit_forest', 'spirit_blizzard', 'spirit_nightmare'],
          rare: ['spirit_phoenix', 'spirit_leviathan', 'spirit_titan', 'spirit_storm', 'spirit_celestial'],
          epic: ['spirit_primordial_flame', 'spirit_abyssal_deep', 'spirit_ancient_earth'],
          legendary: ['spirit_cosmic_entity', 'spirit_omega']
        },
        dropRates: {
          common: 0.65,
          uncommon: 0.22,
          rare: 0.09,
          epic: 0.03,
          legendary: 0.01
        }
      },

      armored: {
        icon: '🛡️',
        color: '#64748b',
        name: 'Armored Enemies',
        description: 'Heavily protected foes. Drop armor and defensive gear.',
        drops: {
          common: ['armor_cloth', 'armor_leather', 'armor_padded', 'armor_animal_hide', 'armor_work_gloves', 'armor_travel_boots', 'armor_simple_helmet', 'armor_leather_belt', 'armor_silk_tunic', 'armor_studded_leather'],
          uncommon: ['armor_knight', 'armor_chain_mail', 'armor_plate', 'armor_battle_helm', 'armor_steel_gauntlets', 'armor_heavy_boots', 'armor_tower_shield', 'armor_reinforced_vest', 'armor_combat_suit', 'armor_war_plate'],
          rare: ['armor_dragon_scale', 'armor_shadow_cloak', 'armor_flame_guard', 'armor_frost_plate', 'armor_celestial_robes'],
          epic: ['armor_titan', 'armor_phoenix_mantle', 'armor_void'],
          legendary: ['armor_infinity', 'armor_genesis']
        },
        dropRates: {
          common: 0.55,
          uncommon: 0.28,
          rare: 0.12,
          epic: 0.04,
          legendary: 0.01
        }
      },

      mechanical: {
        icon: '🤖',
        color: '#3b82f6',
        name: 'Mechanical Enemies',
        description: 'Robotic adversaries. Drop robots and tech items.',
        drops: {
          common: ['robot_helper', 'robot_scout', 'robot_combat', 'robot_repair', 'robot_miner', 'robot_cleaner', 'robot_builder', 'robot_guard', 'robot_messenger', 'robot_utility'],
          uncommon: ['robot_assault', 'robot_heavy', 'robot_tactical', 'robot_shield', 'robot_gunner', 'robot_sniper', 'robot_medic', 'robot_tech', 'robot_organizer', 'robot_scout_swarm'],
          rare: ['robot_destroyer', 'robot_titan', 'robot_stealth', 'robot_artillery', 'robot_nano_swarm'],
          epic: ['robot_warmachine', 'robot_omega_defender', 'robot_omnidroid'],
          legendary: ['robot_god_machine']
        },
        dropRates: {
          common: 0.58,
          uncommon: 0.26,
          rare: 0.11,
          epic: 0.04,
          legendary: 0.01
        }
      },

      flying: {
        icon: '🦅',
        color: '#06b6d4',
        name: 'Flying Enemies',
        description: 'Aerial threats. Drop flying pets and vehicles.',
        drops: {
          common: ['pet_bird', 'pet_owl', 'spirit_wind', 'vehicle_hang_glider'],
          uncommon: ['pet_eagle', 'pet_falcon', 'pet_bat', 'spirit_tempest', 'vehicle_helicopter_basic'],
          rare: ['pet_thunderbird', 'pet_phoenix_chick', 'spirit_storm', 'vehicle_attack_helicopter'],
          epic: ['pet_phoenix_adult', 'vehicle_hypersonic_jet'],
          legendary: ['pet_pegasus_lord', 'vehicle_dimensional_rift']
        },
        dropRates: {
          common: 0.50,
          uncommon: 0.30,
          rare: 0.15,
          epic: 0.04,
          legendary: 0.01
        }
      },

      aquatic: {
        icon: '🌊',
        color: '#0ea5e9',
        name: 'Aquatic Enemies',
        description: 'Water-dwelling monsters. Drop aquatic pets and vehicles.',
        drops: {
          common: ['pet_turtle', 'pet_frog', 'spirit_water', 'vehicle_canoe', 'essence_water'],
          uncommon: ['spirit_tsunami', 'vehicle_speedboat', 'vehicle_jet_ski'],
          rare: ['pet_hydra_spawn', 'spirit_leviathan', 'vehicle_submarine'],
          epic: ['pet_kraken_spawn', 'spirit_abyssal_deep'],
          legendary: ['pet_leviathan', 'vehicle_starship']
        },
        dropRates: {
          common: 0.62,
          uncommon: 0.24,
          rare: 0.10,
          epic: 0.03,
          legendary: 0.01
        }
      },

      warrior: {
        icon: '⚔️',
        color: '#dc2626',
        name: 'Warrior Enemies',
        description: 'Skilled fighters. Drop weapons and combat gear.',
        drops: {
          common: ['weapon_wooden_sword', 'weapon_iron_dagger', 'weapon_short_bow', 'weapon_staff', 'weapon_bronze_axe', 'weapon_wooden_club', 'weapon_sling', 'weapon_rusty_blade', 'weapon_wooden_spear', 'weapon_stone_hammer'],
          uncommon: ['weapon_katana', 'weapon_steel_greatsword', 'weapon_crossbow', 'weapon_battle_axe', 'weapon_war_hammer', 'weapon_longbow', 'weapon_dual_daggers', 'weapon_halberd', 'weapon_rapier', 'weapon_mace'],
          rare: ['weapon_legendary_sword', 'weapon_shadow_reaper', 'weapon_flame_tongue', 'weapon_frost_blade', 'weapon_lightning_spear'],
          epic: ['weapon_infinity_blade', 'weapon_dragon_slayer', 'weapon_void_scythe'],
          legendary: ['weapon_world_ender', 'weapon_genesis']
        },
        dropRates: {
          common: 0.57,
          uncommon: 0.27,
          rare: 0.11,
          epic: 0.04,
          legendary: 0.01
        }
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // BOSS-SPECIFIC LOOT TABLES
    // ═══════════════════════════════════════════════════════════════
    
    bossLoot: {
      'Gift Bearer': {
        icon: '🎁',
        type: 'gift',
        description: 'Generous boss that drops treasure and consumables',
        guaranteed: ['potion_hp', 'potion_mp', 'scroll_heal'],
        rare: ['pet_hamster', 'vehicle_bike', 'essence_fire'],
        goldBonus: 500,
        dropRates: { rare: 0.50 }
      },

      'Treasure Phantom': {
        icon: '👻💎',
        type: 'gift',
        description: 'Ghostly treasure guardian',
        guaranteed: ['essence_fire', 'essence_water', 'scroll_heal'],
        rare: ['pet_bird', 'spirit_fire', 'spirit_water'],
        goldBonus: 750,
        dropRates: { rare: 0.45 }
      },

      'Plate Warden': {
        icon: '🛡️👤',
        type: 'armor',
        description: 'Heavily armored guardian',
        guaranteed: ['armor_knight', 'armor_chain_mail'],
        rare: ['armor_dragon_scale', 'armor_plate'],
        epic: ['armor_titan'],
        goldBonus: 1000,
        dropRates: { rare: 0.50, epic: 0.15 }
      },

      'Menagerie Alpha': {
        icon: '🐾👑',
        type: 'pet',
        description: 'Leader of the beasts',
        guaranteed: ['pet_dog', 'pet_cat'],
        rare: ['pet_wolf', 'pet_fox', 'pet_bear'],
        epic: ['pet_dragon_wyrmling', 'pet_phoenix_chick'],
        goldBonus: 800,
        dropRates: { rare: 0.60, epic: 0.20 }
      },

      'Key Warden': {
        icon: '🔑👤',
        type: 'key',
        description: 'Guardian of secrets',
        guaranteed: ['scroll_teleport', 'essence_lightning'],
        rare: ['spirit_storm', 'spirit_thunder'],
        goldBonus: 1200,
        dropRates: { rare: 0.55 }
      },

      'Gilded Serpent': {
        icon: '🐍💰',
        type: 'gold',
        description: 'Golden serpent hoarding wealth',
        guaranteed: ['potion_hp', 'essence_earth'],
        rare: ['pet_snake', 'spirit_earth', 'spirit_nature'],
        epic: ['pet_hydra_spawn'],
        goldBonus: 5000,
        dropRates: { rare: 0.40, epic: 0.10 }
      },

      'Gold Knight': {
        icon: '👑💰',
        type: 'gold',
        description: 'Knight of golden valor',
        guaranteed: ['weapon_katana', 'armor_knight'],
        rare: ['weapon_legendary_sword', 'armor_plate'],
        epic: ['weapon_dragon_slayer', 'armor_dragon_scale'],
        goldBonus: 6000,
        dropRates: { rare: 0.45, epic: 0.15 }
      },

      'Silver Phantom': {
        icon: '👻⚡',
        type: 'silver',
        description: 'Swift spectral warrior',
        guaranteed: ['spirit_light', 'scroll_heal'],
        rare: ['pet_owl', 'spirit_radiance', 'spirit_wind'],
        goldBonus: 3000,
        dropRates: { rare: 0.50 }
      },

      'Champion Orc': {
        icon: '👹⚔️',
        type: 'miniBoss',
        description: 'Elite warrior champion',
        guaranteed: ['weapon_battle_axe', 'armor_leather'],
        rare: ['pet_wolf', 'vehicle_motorcycle', 'weapon_war_hammer'],
        epic: ['weapon_legendary_sword'],
        goldBonus: 1500,
        dropRates: { rare: 0.55, epic: 0.12 }
      },

      'Demon King': {
        icon: '😈👑',
        type: 'bigBoss',
        description: 'Ruler of demons - Epic boss encounter',
        guaranteed: ['weapon_shadow_reaper', 'armor_dragon_scale', 'spirit_nightmare'],
        rare: ['pet_cerberus_pup', 'spirit_void', 'weapon_flame_tongue'],
        epic: ['weapon_infinity_blade', 'armor_titan', 'pet_shadow_beast'],
        legendary: ['pet_shadow_beast', 'weapon_void_scythe'],
        goldBonus: 15000,
        dropRates: { rare: 0.50, epic: 0.20, legendary: 0.05 }
      },

      'Leviathan': {
        icon: '🐋👑',
        type: 'bigBoss',
        description: 'Titanic sea beast - Legendary encounter',
        guaranteed: ['spirit_leviathan', 'essence_water', 'spirit_tsunami'],
        rare: ['pet_hydra_spawn', 'vehicle_submarine', 'spirit_abyssal_deep'],
        epic: ['pet_kraken_spawn', 'spirit_abyssal_deep'],
        legendary: ['pet_leviathan'],
        goldBonus: 20000,
        dropRates: { rare: 0.55, epic: 0.22, legendary: 0.08 }
      },

      'Archangel': {
        icon: '😇✨',
        type: 'bigBoss',
        description: 'Divine celestial being',
        guaranteed: ['spirit_light', 'armor_celestial', 'spirit_radiance'],
        rare: ['pet_phoenix_chick', 'spirit_celestial', 'pet_unicorn'],
        epic: ['pet_phoenix_adult', 'spirit_primordial_flame', 'armor_phoenix_mantle'],
        legendary: ['pet_pegasus_lord', 'armor_infinity'],
        goldBonus: 18000,
        dropRates: { rare: 0.52, epic: 0.20, legendary: 0.06 }
      },

      'Void Reaver': {
        icon: '💀🌌',
        type: 'bigBoss',
        description: 'Destroyer from the void - Ultimate boss',
        guaranteed: ['spirit_void', 'essence_shadow', 'weapon_shadow_reaper'],
        rare: ['pet_basilisk', 'spirit_nightmare', 'pet_shadow_beast'],
        epic: ['weapon_void_scythe', 'armor_void', 'spirit_omega'],
        legendary: ['weapon_world_ender', 'pet_world_serpent', 'armor_genesis'],
        goldBonus: 25000,
        dropRates: { rare: 0.58, epic: 0.25, legendary: 0.10 }
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // QUEST REWARDS
    // ═══════════════════════════════════════════════════════════════
    
    questRewards: {
      // Starter Quests (Level 1-10)
      'first_steps': {
        name: 'First Steps',
        icon: '🎯',
        description: 'Defeat 10 enemies',
        type: 'kill',
        target: 10,
        levelReq: 1,
        rewards: {
          gold: 500,
          items: ['potion_hp', 'potion_mp', 'scroll_heal'],
          message: 'Welcome to the adventure!'
        }
      },

      'pet_lover': {
        name: 'Pet Lover',
        icon: '🐾',
        description: 'Collect 3 pets',
        type: 'collect_pets',
        target: 3,
        levelReq: 5,
        rewards: {
          gold: 1000,
          items: ['pet_cat', 'pet_rabbit'],
          random: ['pet_hamster', 'pet_bird', 'pet_mouse'],
          randomCount: 1,
          message: 'You love animals!'
        }
      },

      'geared_up': {
        name: 'Geared Up',
        icon: '⚔️',
        description: 'Equip 5 pieces of gear',
        type: 'equip_gear',
        target: 5,
        levelReq: 3,
        rewards: {
          gold: 800,
          essence: 10,
          items: ['weapon_iron_dagger', 'armor_leather'],
          message: 'Fully equipped and ready!'
        }
      },

      // Combat Quests (Level 10-30)
      'beast_hunter': {
        name: 'Beast Hunter',
        icon: '🐺',
        description: 'Defeat 25 beast-type enemies',
        type: 'kill_beast',
        target: 25,
        levelReq: 10,
        rewards: {
          gold: 2000,
          items: ['pet_wolf', 'pet_fox'],
          random: ['pet_bear', 'pet_panther', 'pet_tiger'],
          randomCount: 1,
          message: 'Master of the wild!'
        }
      },

      'dragon_slayer': {
        name: 'Dragon Slayer',
        icon: '🐉',
        description: 'Defeat a dragon boss',
        type: 'kill_boss',
        target: 1,
        bossName: 'Dragon',
        levelReq: 30,
        rewards: {
          gold: 10000,
          gems: 50,
          items: ['pet_dragon_wyrmling', 'weapon_dragon_slayer'],
          random: ['armor_dragon_scale', 'pet_phoenix_chick'],
          randomCount: 1,
          message: 'Dragon conquered!'
        }
      },

      'boss_hunter': {
        name: 'Boss Hunter',
        icon: '👑',
        description: 'Defeat 10 bosses',
        type: 'kill_boss',
        target: 10,
        levelReq: 20,
        rewards: {
          gold: 5000,
          gems: 25,
          items: ['weapon_legendary_sword', 'armor_knight'],
          random: ['pet_griffin', 'pet_unicorn', 'spirit_phoenix'],
          randomCount: 2,
          message: 'Elite boss hunter!'
        }
      },

      // Collection Quests
      'vehicle_collector': {
        name: 'Vehicle Collector',
        icon: '🚗',
        description: 'Collect 5 vehicles',
        type: 'collect_vehicles',
        target: 5,
        levelReq: 15,
        rewards: {
          gold: 3000,
          items: ['vehicle_sports_car', 'vehicle_motorcycle'],
          random: ['vehicle_hoverboard', 'vehicle_atv', 'vehicle_jet_ski'],
          randomCount: 1,
          message: 'Vehicle enthusiast!'
        }
      },

      'spirit_master': {
        name: 'Spirit Master',
        icon: '✨',
        description: 'Bond with 10 spirits',
        type: 'collect_spirits',
        target: 10,
        levelReq: 25,
        rewards: {
          gold: 4000,
          essence: 100,
          items: ['spirit_phoenix', 'spirit_titan'],
          random: ['spirit_primordial_flame', 'spirit_abyssal_deep'],
          randomCount: 1,
          message: 'One with the spirits!'
        }
      },

      // Alchemy Quests
      'alchemist_apprentice': {
        name: 'Alchemist Apprentice',
        icon: '⚗️',
        description: 'Craft 10 items in alchemy',
        type: 'craft_items',
        target: 10,
        levelReq: 10,
        rewards: {
          gold: 2000,
          essence: 50,
          items: ['essence_fire', 'essence_water', 'essence_earth'],
          alchemyTier: 2,
          message: 'Alchemy skills growing!'
        }
      },

      'master_alchemist': {
        name: 'Master Alchemist',
        icon: '⚗️👑',
        description: 'Craft 100 items in alchemy',
        type: 'craft_items',
        target: 100,
        levelReq: 50,
        rewards: {
          gold: 15000,
          essence: 500,
          items: ['weapon_infinity_blade', 'armor_titan'],
          random: ['pet_phoenix_adult', 'spirit_primordial_flame'],
          randomCount: 1,
          alchemyTier: 5,
          message: 'Master of transmutation!'
        }
      },

      // Epic Quests (Level 40-60)
      'legendary_collector': {
        name: 'Legendary Collector',
        icon: '👑💎',
        description: 'Collect 5 legendary items',
        type: 'collect_legendary',
        target: 5,
        levelReq: 60,
        rewards: {
          gold: 50000,
          gems: 500,
          items: ['pet_ancient_dragon'],
          random: ['weapon_world_ender', 'armor_infinity', 'pet_leviathan', 'pet_behemoth'],
          randomCount: 1,
          message: 'Legendary collector status achieved!'
        }
      },

      'ultimate_warrior': {
        name: 'Ultimate Warrior',
        icon: '⚔️💫',
        description: 'Reach level 80',
        type: 'reach_level',
        target: 80,
        levelReq: 80,
        rewards: {
          gold: 100000,
          gems: 1000,
          essence: 1000,
          items: ['weapon_genesis', 'armor_genesis', 'pet_ancient_dragon'],
          random: ['vehicle_dimensional_rift', 'robot_god_machine', 'spirit_omega'],
          randomCount: 2,
          message: 'Ultimate power achieved!'
        }
      }
    },

    // ═══════════════════════════════════════════════════════════════
    // DAILY & WEEKLY MISSIONS
    // ═══════════════════════════════════════════════════════════════
    
    dailyMissions: [
      // Daily Missions (Reset every 24 hours)
      {
        id: 'daily_kills_10',
        name: 'Daily Exterminator',
        icon: '⚔️',
        description: 'Defeat 10 enemies today',
        type: 'daily',
        goal: { type: 'kill', target: 10 },
        rewards: {
          gold: 1000,
          items: ['potion_hp', 'potion_mp'],
          random: ['pet_dog', 'pet_cat', 'pet_rabbit'],
          randomCount: 1
        }
      },
      {
        id: 'daily_boss_1',
        name: 'Boss Bounty',
        icon: '👑',
        description: 'Defeat 1 boss today',
        type: 'daily',
        goal: { type: 'kill_boss', target: 1 },
        rewards: {
          gold: 3000,
          gems: 10,
          items: ['weapon_katana', 'armor_knight'],
          random: ['pet_wolf', 'spirit_fire', 'vehicle_motorcycle'],
          randomCount: 1
        }
      },
      {
        id: 'daily_craft_5',
        name: 'Alchemist Work',
        icon: '⚗️',
        description: 'Craft 5 items in alchemy today',
        type: 'daily',
        goal: { type: 'craft', target: 5 },
        rewards: {
          gold: 2000,
          essence: 50,
          items: ['essence_fire', 'essence_water', 'essence_lightning']
        }
      },
      {
        id: 'daily_gold_5k',
        name: 'Gold Rush',
        icon: '💰',
        description: 'Earn 5000 gold today',
        type: 'daily',
        goal: { type: 'earn_gold', target: 5000 },
        rewards: {
          gems: 25,
          items: ['vehicle_bike', 'pet_hamster'],
          random: ['vehicle_electric_scooter', 'pet_bird'],
          randomCount: 1
        }
      },

      // Weekly Missions (Reset every 7 days - Bigger Rewards)
      {
        id: 'weekly_kills_100',
        name: 'Weekly Massacre',
        icon: '⚔️💀',
        description: 'Defeat 100 enemies this week',
        type: 'weekly',
        goal: { type: 'kill', target: 100 },
        rewards: {
          gold: 10000,
          gems: 100,
          items: ['pet_dragon_wyrmling', 'weapon_legendary_sword'],
          random: ['pet_unicorn', 'pet_griffin', 'spirit_phoenix'],
          randomCount: 2
        }
      },
      {
        id: 'weekly_boss_10',
        name: 'Boss Exterminator',
        icon: '👑💀',
        description: 'Defeat 10 bosses this week',
        type: 'weekly',
        goal: { type: 'kill_boss', target: 10 },
        rewards: {
          gold: 25000,
          gems: 250,
          essence: 200,
          items: ['weapon_infinity_blade', 'armor_dragon_scale'],
          random: ['pet_dragon_adult', 'pet_phoenix_adult', 'spirit_primordial_flame'],
          randomCount: 2
        }
      },
      {
        id: 'weekly_legendary',
        name: 'Legendary Hunter',
        icon: '👑💎',
        description: 'Acquire 1 legendary item this week',
        type: 'weekly',
        goal: { type: 'collect_legendary', target: 1 },
        rewards: {
          gold: 50000,
          gems: 500,
          essence: 500,
          items: ['pet_ancient_dragon'],
          random: ['weapon_world_ender', 'armor_infinity', 'pet_leviathan', 'pet_behemoth'],
          randomCount: 1
        }
      }
    ],

    // ═══════════════════════════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    getItemDetails(itemId) {
      if (!window.GameDatabase) return null;
      
      // Search all categories for the item
      for (let category in window.GameDatabase) {
        const categoryData = window.GameDatabase[category];
        
        // Skip if not an array (e.g., enemies, bosses are objects, not arrays)
        if (!Array.isArray(categoryData)) continue;
        
        const item = categoryData.find(i => i.id === itemId);
        if (item) return item;
      }
      return null;
    },

    getDropRateForLevel(enemyLevel, rarity) {
      const baseRates = {
        common: 0.60,
        uncommon: 0.25,
        rare: 0.10,
        epic: 0.04,
        legendary: 0.01
      };

      // Adjust rates based on enemy level
      let multiplier = 1.0;
      if (enemyLevel >= 50) multiplier = 1.5;
      else if (enemyLevel >= 30) multiplier = 1.3;
      else if (enemyLevel >= 20) multiplier = 1.2;
      else if (enemyLevel >= 10) multiplier = 1.1;

      return Math.min(baseRates[rarity] * multiplier, 0.95);
    },

    // Get all items that can drop from an enemy type
    getAllDropsForType(enemyType) {
      const typeData = this.enemyTypes[enemyType];
      if (!typeData) return [];

      const allDrops = [];
      for (let rarity in typeData.drops) {
        typeData.drops[rarity].forEach(itemId => {
          const item = this.getItemDetails(itemId);
          if (item) {
            allDrops.push({
              ...item,
              dropRarity: rarity,
              dropRate: typeData.dropRates[rarity]
            });
          }
        });
      }

      return allDrops;
    },

    // Reverse lookup: Find where an item can drop
    findDropSources(itemId) {
      const sources = {
        enemies: [],
        bosses: [],
        quests: [],
        missions: []
      };

      // Check enemy types
      for (let enemyType in this.enemyTypes) {
        const typeData = this.enemyTypes[enemyType];
        for (let rarity in typeData.drops) {
          if (typeData.drops[rarity].includes(itemId)) {
            sources.enemies.push({
              type: enemyType,
              rarity: rarity,
              rate: typeData.dropRates[rarity]
            });
          }
        }
      }

      // Check bosses
      for (let bossName in this.bossLoot) {
        const boss = this.bossLoot[bossName];
        ['guaranteed', 'rare', 'epic', 'legendary'].forEach(tier => {
          if (boss[tier] && boss[tier].includes(itemId)) {
            sources.bosses.push({
              boss: bossName,
              tier: tier,
              rate: tier === 'guaranteed' ? 1.0 : boss.dropRates[tier]
            });
          }
        });
      }

      // Check quests
      for (let questId in this.questRewards) {
        const quest = this.questRewards[questId];
        if (quest.rewards.items && quest.rewards.items.includes(itemId)) {
          sources.quests.push({ quest: quest.name, guaranteed: true });
        }
        if (quest.rewards.random && quest.rewards.random.includes(itemId)) {
          sources.quests.push({ quest: quest.name, chance: true });
        }
      }

      // Check missions
      this.dailyMissions.forEach(mission => {
        if (mission.rewards.items && mission.rewards.items.includes(itemId)) {
          sources.missions.push({ mission: mission.name, type: mission.type, guaranteed: true });
        }
        if (mission.rewards.random && mission.rewards.random.includes(itemId)) {
          sources.missions.push({ mission: mission.name, type: mission.type, chance: true });
        }
      });

      return sources;
    }
  };

  console.log('✅ [DropTables] Drop tables loaded');
  console.log(`   • ${Object.keys(window.DROP_SYSTEMS.enemyTypes).length} enemy types`);
  console.log(`   • ${Object.keys(window.DROP_SYSTEMS.bossLoot).length} boss loot tables`);
  console.log(`   • ${Object.keys(window.DROP_SYSTEMS.questRewards).length} quest rewards`);
  console.log(`   • ${window.DROP_SYSTEMS.dailyMissions.length} daily/weekly missions`);

})();

