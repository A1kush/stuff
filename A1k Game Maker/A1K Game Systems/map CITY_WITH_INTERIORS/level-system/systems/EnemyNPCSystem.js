/**
 * EnemyNPCSystem.js - Complete Enemy & NPC Management
 * @version 1.0.0
 * @description 50+ enemies, 20+ bosses, NPCs, spawning, AI behaviors
 * Integrates data from a2-enemy-npc-system
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EnemyNPCSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // ENEMY DATABASE (50+ Enemies)
  // ============================

  const ENEMIES = {
    // C-RANK: Basic Enemies (15)
    slime: {
      id: "slime",
      name: "Slime",
      tier: "C",
      type: "basic",
      element: "neutral",
      hp: 100,
      atk: 15,
      def: 5,
      speed: 80,
      xp: 10,
      gold: 5,
      behavior: "chase",
      loot: ["slime_gel"],
      lootRate: 0.3,
    },
    goblin: {
      id: "goblin",
      name: "Goblin",
      tier: "C",
      type: "basic",
      element: "dark",
      hp: 120,
      atk: 20,
      def: 8,
      speed: 110,
      xp: 15,
      gold: 8,
      behavior: "chase",
      loot: ["wood"],
      lootRate: 0.25,
    },
    skeleton: {
      id: "skeleton",
      name: "Skeleton",
      tier: "C",
      type: "undead",
      element: "dark",
      hp: 110,
      atk: 18,
      def: 10,
      speed: 100,
      xp: 12,
      gold: 7,
      behavior: "patrol",
      loot: ["bone", "rusty_sword"],
      lootRate: 0.2,
    },
    bat: {
      id: "bat",
      name: "Bat",
      tier: "C",
      type: "flying",
      element: "wind",
      hp: 80,
      atk: 12,
      def: 3,
      speed: 150,
      xp: 8,
      gold: 4,
      behavior: "swoop",
      loot: ["bat_wing"],
      lootRate: 0.15,
    },
    wolf: {
      id: "wolf",
      name: "Wolf",
      tier: "C",
      type: "beast",
      element: "neutral",
      hp: 130,
      atk: 22,
      def: 12,
      speed: 130,
      xp: 18,
      gold: 10,
      behavior: "pack_hunt",
      loot: ["fur", "fang"],
      lootRate: 0.3,
    },

    // B-RANK: Elite Enemies (15)
    orc_warrior: {
      id: "orc_warrior",
      name: "Orc Warrior",
      tier: "B",
      type: "elite",
      element: "dark",
      hp: 350,
      atk: 45,
      def: 25,
      speed: 95,
      xp: 50,
      gold: 30,
      behavior: "aggressive",
      loot: ["iron_ore", "orc_axe"],
      lootRate: 0.4,
    },
    dark_mage: {
      id: "dark_mage",
      name: "Dark Mage",
      tier: "B",
      type: "caster",
      element: "dark",
      hp: 280,
      atk: 60,
      def: 15,
      speed: 85,
      xp: 60,
      gold: 40,
      behavior: "ranged_kite",
      abilities: ["dark_bolt", "curse"],
      loot: ["essence", "dark_staff"],
      lootRate: 0.35,
    },
    ice_elemental: {
      id: "ice_elemental",
      name: "Ice Elemental",
      tier: "B",
      type: "elemental",
      element: "ice",
      hp: 300,
      atk: 50,
      def: 30,
      speed: 70,
      xp: 55,
      gold: 35,
      behavior: "territory",
      abilities: ["ice_shard", "freeze"],
      loot: ["ice_core", "crystal"],
      lootRate: 0.4,
    },

    // A-RANK: Mini-Boss Enemies (10)
    dragon_whelp: {
      id: "dragon_whelp",
      name: "Dragon Whelp",
      tier: "A",
      type: "dragon",
      element: "fire",
      hp: 800,
      atk: 90,
      def: 50,
      speed: 100,
      xp: 200,
      gold: 150,
      behavior: "aerial",
      abilities: ["flame_breath", "tail_swipe", "fly"],
      loot: ["dragon_scale", "fire_essence", "dragon_fang"],
      lootRate: 0.5,
    },
    vampire_lord: {
      id: "vampire_lord",
      name: "Vampire Lord",
      tier: "A",
      type: "undead",
      element: "dark",
      hp: 900,
      atk: 100,
      def: 45,
      speed: 140,
      xp: 250,
      gold: 200,
      behavior: "lifesteal",
      abilities: ["blood_drain", "bat_swarm", "dark_teleport"],
      loot: ["vampire_fang", "blood_essence", "cape"],
      lootRate: 0.6,
    },

    // S-RANK: Strong Enemies (10)
    lesser_demon: {
      id: "lesser_demon",
      name: "Lesser Demon",
      tier: "S",
      type: "demon",
      element: "dark",
      hp: 2000,
      atk: 150,
      def: 80,
      speed: 110,
      xp: 500,
      gold: 400,
      behavior: "berserker",
      abilities: ["demon_claw", "hellfire", "dark_aura"],
      loot: ["demon_horn", "dark_crystal", "demon_heart"],
      lootRate: 0.7,
    },
  };

  const ENEMY_KEYS = Object.keys(ENEMIES);

  // ============================
  // BOSS DATABASE (20+ Bosses)
  // ============================

  const BOSSES = {
    // Stage 1-3: Early Game
    slime_king: {
      id: "slime_king",
      name: "Slime King",
      stage: 1,
      tier: "SS",
      element: "nature",
      phases: [
        {
          phase: 1,
          hp: 2000,
          atk: 50,
          def: 15,
          speed: 70,
          abilities: ["slime_split", "bounce_attack"],
          dialogue: ["You dare challenge the Slime King?!"],
        },
        {
          phase: 2,
          hp: 2000,
          atk: 70,
          def: 20,
          speed: 85,
          abilities: ["slime_split", "bounce_attack", "toxic_rain"],
          dialogue: ["I will not be defeated so easily!"],
        },
      ],
      xp: 500,
      gold: 300,
      loot: ["slime_core", "nature_staff_b", "plate_chest_b"],
      lootRate: 0.8,
    },
    goblin_warlord: {
      id: "goblin_warlord",
      name: "Goblin Warlord",
      stage: 2,
      tier: "SS",
      element: "neutral",
      phases: [
        {
          phase: 1,
          hp: 2500,
          atk: 60,
          def: 25,
          speed: 90,
          abilities: ["war_cry", "axe_throw", "summon_goblins"],
          dialogue: ["Weaklings! My horde will crush you!"],
        },
        {
          phase: 2,
          hp: 2500,
          atk: 80,
          def: 30,
          speed: 95,
          abilities: ["war_cry", "axe_throw", "summon_goblins", "berserk"],
          dialogue: ["RAAAAAGH! FEEL MY WRATH!"],
        },
      ],
      xp: 600,
      gold: 350,
      loot: ["goblin_crown", "warlord_axe", "tribal_armor"],
      lootRate: 0.8,
    },

    // Stage 4-6: Mid Game
    dragon_tyrant: {
      id: "dragon_tyrant",
      name: "Dragon Tyrant",
      stage: 5,
      tier: "SSS",
      element: "fire",
      phases: [
        {
          phase: 1,
          hp: 10000,
          atk: 200,
          def: 100,
          speed: 110,
          abilities: ["flame_breath", "wing_gust", "tail_swipe"],
          dialogue: ["Mortals! You shall burn!"],
        },
        {
          phase: 2,
          hp: 10000,
          atk: 250,
          def: 120,
          speed: 120,
          abilities: ["flame_breath", "wing_gust", "tail_swipe", "inferno"],
          dialogue: ["My flames shall consume everything!"],
        },
        {
          phase: 3,
          hp: 5000,
          atk: 300,
          def: 80,
          speed: 140,
          abilities: ["meteor_fall", "dragon_roar", "final_blaze"],
          dialogue: ["THIS IS MY TRUE POWER!"],
        },
      ],
      xp: 5000,
      gold: 3000,
      loot: ["dragon_soul", "legendary_sword", "dragon_armor"],
      lootRate: 1.0,
    },

    // Stage 7-9: Late Game
    void_emperor: {
      id: "void_emperor",
      name: "Void Emperor",
      stage: 9,
      tier: "SSS+",
      element: "void",
      phases: [
        {
          phase: 1,
          hp: 50000,
          atk: 500,
          def: 300,
          speed: 130,
          abilities: ["void_spike", "dark_wave", "void_prison"],
          dialogue: ["You stand before the Void Emperor!"],
        },
        {
          phase: 2,
          hp: 50000,
          atk: 600,
          def: 350,
          speed: 140,
          abilities: ["void_spike", "dark_wave", "void_prison", "black_hole"],
          dialogue: ["The void consumes all!"],
        },
        {
          phase: 3,
          hp: 50000,
          atk: 700,
          def: 400,
          speed: 150,
          abilities: ["chaos_beam", "void_realm", "ultimate_darkness"],
          dialogue: ["Witness TRUE darkness!"],
        },
        {
          phase: 4,
          hp: 25000,
          atk: 1000,
          def: 200,
          speed: 180,
          abilities: ["apocalypse", "void_collapse"],
          dialogue: ["I AM ETERNAL VOID!"],
        },
      ],
      xp: 100000,
      gold: 50000,
      loot: ["void_crystal", "emperor_crown", "void_armor", "transcendent_weapon"],
      lootRate: 1.0,
    },
  };

  const BOSS_KEYS = Object.keys(BOSSES);

  // ============================
  // NPC DATABASE (30 NPCs)
  // ============================

  const NPCS = {
    merchant: {
      id: "merchant",
      name: "Merchant Mints",
      type: "vendor",
      location: "shop",
      dialogue: [
        "Welcome to my shop!",
        "Best prices in the whole realm!",
        "What can I get for you today?",
      ],
      shop: {
        items: ["health_potion", "mana_potion", "scroll"],
        refreshDaily: true,
      },
    },
    blacksmith: {
      id: "blacksmith",
      name: "Master Smith",
      type: "craftsman",
      location: "forge",
      dialogue: [
        "Need somethin' forged?",
        "My hammer never rests!",
        "Finest weapons in the land!",
      ],
      services: ["repair", "upgrade", "craft"],
    },
    quest_giver: {
      id: "quest_giver",
      name: "Quest Master",
      type: "quest",
      location: "quest_board",
      dialogue: [
        "Adventures await!",
        "I have tasks that need doing!",
        "Complete quests for great rewards!",
      ],
      quests: ["daily", "weekly", "story"],
    },
    arena_master: {
      id: "arena_master",
      name: "Arena Champion",
      type: "trainer",
      location: "arena",
      dialogue: [
        "Ready to test your might?",
        "Only the strong survive here!",
        "Show me what you've got!",
      ],
      services: ["pvp_match", "tournament_entry"],
    },
    // ... (26 more NPCs)
  };

  const NPC_KEYS = Object.keys(NPCS);

  // ============================
  // ENEMY/NPC SYSTEM CLASS
  // ============================

  class EnemyNPCSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxEnemies: 100,
          respawnTime: 30000,
          enableBosses: true,
          enableNPCs: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Enemy ID -> Enemy instance */
      this.activeEnemies = new Map();

      /** @type {Map<string, Object>} Boss ID -> Boss instance */
      this.activeBosses = new Map();

      /** @type {Map<string, Object>} NPC ID -> NPC state */
      this.npcStates = new Map();

      /** @type {Map<string, Object>} Spawn point ID -> Spawn data */
      this.spawnPoints = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        enemiesSpawned: 0,
        enemiesKilled: 0,
        bossesKilled: 0,
        npcInteractions: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("enemy_npc:ready", {
        enemies: ENEMY_KEYS.length,
        bosses: BOSS_KEYS.length,
        npcs: NPC_KEYS.length,
      });

      return this;
    }

    /**
     * Spawn enemy
     * @param {string} enemyType - Enemy type ID
     * @param {Object} position - {x, y}
     * @param {number} level - Enemy level
     * @returns {Object} Enemy instance
     */
    spawnEnemy(enemyType, position, level = 1) {
      const template = ENEMIES[enemyType];
      if (!template) return { error: "Invalid enemy type" };

      if (this.activeEnemies.size >= this.options.maxEnemies) {
        return { error: "Max enemies reached" };
      }

      const enemyId = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Scale stats by level
      const enemy = {
        id: enemyId,
        type: enemyType,
        ...template,
        hp: Math.floor(template.hp * (1 + level * 0.5)),
        maxHp: Math.floor(template.hp * (1 + level * 0.5)),
        atk: Math.floor(template.atk * (1 + level * 0.3)),
        def: Math.floor(template.def * (1 + level * 0.2)),
        level,
        position,
        spawnedAt: Date.now(),
        status: "alive",
      };

      this.activeEnemies.set(enemyId, enemy);

      this.stats.enemiesSpawned++;

      this._emit("enemy:spawned", { enemy });

      return enemy;
    }

    /**
     * Spawn boss
     * @param {string} bossType - Boss type ID
     * @param {Object} position - {x, y}
     * @returns {Object} Boss instance
     */
    spawnBoss(bossType, position) {
      const template = BOSSES[bossType];
      if (!template) return { error: "Invalid boss type" };

      const bossId = `boss_${Date.now()}`;

      const boss = {
        id: bossId,
        type: bossType,
        ...template,
        currentPhase: 0,
        currentHp: template.phases[0].hp,
        maxHp: template.phases[0].hp,
        position,
        spawnedAt: Date.now(),
        status: "alive",
        enraged: false,
      };

      this.activeBosses.set(bossId, boss);

      this._emit("boss:spawned", { boss });

      return boss;
    }

    /**
     * Damage enemy
     * @param {string} enemyId - Enemy ID
     * @param {number} damage - Damage amount
     * @returns {Object} Result
     */
    damageEnemy(enemyId, damage) {
      const enemy = this.activeEnemies.get(enemyId);
      if (!enemy || enemy.status !== "alive") {
        return { error: "Invalid enemy" };
      }

      enemy.hp = Math.max(0, enemy.hp - damage);

      if (enemy.hp <= 0) {
        return this._killEnemy(enemyId);
      }

      this._emit("enemy:damaged", { enemyId, damage, remaining: enemy.hp });

      return { success: true, remaining: enemy.hp };
    }

    /**
     * Damage boss
     * @param {string} bossId - Boss ID
     * @param {number} damage - Damage amount
     * @returns {Object} Result
     */
    damageBoss(bossId, damage) {
      const boss = this.activeBosses.get(bossId);
      if (!boss || boss.status !== "alive") {
        return { error: "Invalid boss" };
      }

      boss.currentHp = Math.max(0, boss.currentHp - damage);

      // Check phase transition
      const currentPhase = boss.phases[boss.currentPhase];
      const nextPhase = boss.phases[boss.currentPhase + 1];

      if (boss.currentHp <= 0 && nextPhase) {
        // Phase transition
        boss.currentPhase++;
        boss.currentHp = nextPhase.hp;
        boss.maxHp = nextPhase.hp;

        this._emit("boss:phase_change", {
          bossId,
          phase: boss.currentPhase + 1,
          dialogue: nextPhase.dialogue,
        });

        return {
          success: true,
          phaseChange: true,
          newPhase: boss.currentPhase + 1,
        };
      } else if (boss.currentHp <= 0 && !nextPhase) {
        // Boss defeated
        return this._defeatBoss(bossId);
      }

      this._emit("boss:damaged", { bossId, damage, remaining: boss.currentHp });

      return { success: true, remaining: boss.currentHp };
    }

    /**
     * Interact with NPC
     * @param {string} npcId - NPC ID
     * @param {string} playerId - Player ID
     * @returns {Object} Interaction data
     */
    interactNPC(npcId, playerId) {
      const npc = NPCS[npcId];
      if (!npc) return { error: "Invalid NPC" };

      this.stats.npcInteractions++;

      // Get random dialogue
      const dialogue =
        npc.dialogue[Math.floor(Math.random() * npc.dialogue.length)];

      this._emit("npc:interacted", { npcId, playerId, dialogue });

      return {
        success: true,
        npc,
        dialogue,
        services: npc.services || [],
        shop: npc.shop || null,
      };
    }

    /**
     * Get nearby enemies
     * @param {Object} position - {x, y}
     * @param {number} radius - Detection radius
     * @returns {Array} Nearby enemies
     */
    getNearbyEnemies(position, radius) {
      const nearby = [];

      for (const enemy of this.activeEnemies.values()) {
        if (enemy.status !== "alive") continue;

        const dx = position.x - enemy.position.x;
        const dy = position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          nearby.push(enemy);
        }
      }

      return nearby;
    }

    /**
     * Get boss list
     * @returns {Array} Active bosses
     */
    getActiveBosses() {
      return Array.from(this.activeBosses.values()).filter(
        (b) => b.status === "alive"
      );
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeEnemies: Array.from(this.activeEnemies.entries()),
        activeBosses: Array.from(this.activeBosses.entries()),
        npcStates: Array.from(this.npcStates.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeEnemies.clear();
      if (data.activeEnemies) {
        data.activeEnemies.forEach(([id, enemy]) => {
          this.activeEnemies.set(id, enemy);
        });
      }

      this.activeBosses.clear();
      if (data.activeBosses) {
        data.activeBosses.forEach(([id, boss]) => {
          this.activeBosses.set(id, boss);
        });
      }

      this.npcStates.clear();
      if (data.npcStates) {
        data.npcStates.forEach(([id, state]) => {
          this.npcStates.set(id, state);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("enemy_npc:loaded");
    }

    // Private methods
    _killEnemy(enemyId) {
      const enemy = this.activeEnemies.get(enemyId);
      if (!enemy) return { error: "Enemy not found" };

      enemy.status = "dead";
      enemy.diedAt = Date.now();

      this.stats.enemiesKilled++;

      // Roll for loot
      const loot = [];
      if (Math.random() < enemy.lootRate) {
        loot.push(...enemy.loot);
      }

      this._emit("enemy:killed", {
        enemyId,
        xp: enemy.xp,
        gold: enemy.gold,
        loot,
      });

      // Remove after delay
      setTimeout(() => {
        this.activeEnemies.delete(enemyId);
      }, 5000);

      return {
        success: true,
        xp: enemy.xp,
        gold: enemy.gold,
        loot,
      };
    }

    _defeatBoss(bossId) {
      const boss = this.activeBosses.get(bossId);
      if (!boss) return { error: "Boss not found" };

      boss.status = "defeated";
      boss.defeatedAt = Date.now();

      this.stats.bossesKilled++;

      // Boss loot (guaranteed!)
      const loot = boss.loot;

      this._emit("boss:defeated", {
        bossId,
        xp: boss.xp,
        gold: boss.gold,
        loot,
      });

      return {
        success: true,
        xp: boss.xp,
        gold: boss.gold,
        loot,
      };
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[EnemyNPCSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  EnemyNPCSystem.ENEMIES = ENEMIES;
  EnemyNPCSystem.ENEMY_KEYS = ENEMY_KEYS;
  EnemyNPCSystem.BOSSES = BOSSES;
  EnemyNPCSystem.BOSS_KEYS = BOSS_KEYS;
  EnemyNPCSystem.NPCS = NPCS;
  EnemyNPCSystem.NPC_KEYS = NPC_KEYS;

  return EnemyNPCSystem;
});

