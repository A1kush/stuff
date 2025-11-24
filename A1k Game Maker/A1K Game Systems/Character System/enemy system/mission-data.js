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

