/**
 * DungeonSystem.js - Procedural Dungeon Generation & Raids
 * @version 1.0.0
 * @description Randomly generated dungeons with rooms, enemies, bosses, loot
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.DungeonSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // DUNGEON TEMPLATES (10 Types)
  // ============================

  const DUNGEON_TYPES = {
    // Standard Dungeons (5)
    goblin_cave: {
      id: "goblin_cave",
      name: "Goblin Cave",
      icon: "🏔️",
      difficulty: 1,
      minRooms: 5,
      maxRooms: 10,
      bossRequired: true,
      theme: "cave",
      enemies: ["goblin", "goblin_warrior", "goblin_shaman"],
      boss: "goblin_king",
      rewards: {
        gold: { min: 500, max: 2000 },
        xp: { min: 1000, max: 3000 },
        loot: "common_enemy",
      },
    },
    undead_crypt: {
      id: "undead_crypt",
      name: "Undead Crypt",
      icon: "⚰️",
      difficulty: 2,
      minRooms: 8,
      maxRooms: 15,
      bossRequired: true,
      theme: "undead",
      enemies: ["skeleton", "zombie", "ghost", "wraith"],
      boss: "lich",
      rewards: {
        gold: { min: 1000, max: 5000 },
        xp: { min: 3000, max: 8000 },
        loot: "elite_enemy",
      },
    },
    dragon_lair: {
      id: "dragon_lair",
      name: "Dragon's Lair",
      icon: "🐲",
      difficulty: 4,
      minRooms: 10,
      maxRooms: 20,
      bossRequired: true,
      theme: "volcanic",
      enemies: ["drake", "wyvern", "fire_elemental"],
      boss: "ancient_dragon",
      rewards: {
        gold: { min: 10000, max: 50000 },
        xp: { min: 20000, max: 50000 },
        loot: "boss",
      },
    },
    void_labyrinth: {
      id: "void_labyrinth",
      name: "Void Labyrinth",
      icon: "🌀",
      difficulty: 6,
      minRooms: 15,
      maxRooms: 30,
      bossRequired: true,
      theme: "void",
      enemies: ["void_spawn", "shadow_beast", "void_horror"],
      boss: "void_lord",
      rewards: {
        gold: { min: 50000, max: 200000 },
        xp: { min: 100000, max: 300000 },
        loot: "rare_chest",
      },
    },
    celestial_tower: {
      id: "celestial_tower",
      name: "Celestial Tower",
      icon: "🗼",
      difficulty: 8,
      minRooms: 20,
      maxRooms: 50,
      bossRequired: true,
      theme: "celestial",
      enemies: ["angel", "archon", "seraph"],
      boss: "archangel",
      rewards: {
        gold: { min: 200000, max: 1000000 },
        xp: { min: 500000, max: 1500000 },
        loot: "rare_chest",
      },
    },

    // Raid Dungeons (5) - Multiplayer
    titan_fortress: {
      id: "titan_fortress",
      name: "Titan Fortress",
      icon: "🏰",
      difficulty: 10,
      minRooms: 30,
      maxRooms: 50,
      bossRequired: true,
      requiredPlayers: 4,
      theme: "fortress",
      enemies: ["titan", "giant", "colossus"],
      boss: "titan_emperor",
      rewards: {
        gold: { min: 500000, max: 2000000 },
        xp: { min: 1000000, max: 5000000 },
        loot: "rare_chest",
        guaranteed: ["legendary_weapon"],
      },
    },
    abyss_raid: {
      id: "abyss_raid",
      name: "Abyss Raid",
      icon: "🕳️",
      difficulty: 12,
      minRooms: 40,
      maxRooms: 60,
      bossRequired: true,
      requiredPlayers: 8,
      theme: "abyss",
      enemies: ["abyss_demon", "void_beast", "chaos_spawn"],
      boss: "abyss_god",
      rewards: {
        gold: { min: 1000000, max: 5000000 },
        xp: { min: 2000000, max: 10000000 },
        loot: "rare_chest",
        guaranteed: ["mythic_armor", "legendary_pet_egg"],
      },
    },
    world_boss_lair: {
      id: "world_boss_lair",
      name: "World Boss Lair",
      icon: "🌍",
      difficulty: 15,
      minRooms: 50,
      maxRooms: 100,
      bossRequired: true,
      requiredPlayers: 16,
      theme: "epic",
      enemies: ["elite_guard", "champion", "legend"],
      boss: "world_destroyer",
      rewards: {
        gold: { min: 5000000, max: 20000000 },
        xp: { min: 10000000, max: 50000000 },
        loot: "rare_chest",
        guaranteed: ["divine_weapon", "mythic_pet"],
      },
    },
    realm_of_gods: {
      id: "realm_of_gods",
      name: "Realm of Gods",
      icon: "⚡",
      difficulty: 20,
      minRooms: 75,
      maxRooms: 150,
      bossRequired: true,
      requiredPlayers: 24,
      theme: "divine",
      enemies: ["lesser_god", "demigod", "deity"],
      boss: "supreme_god",
      rewards: {
        gold: { min: 10000000, max: 100000000 },
        xp: { min: 50000000, max: 500000000 },
        loot: "rare_chest",
        guaranteed: ["transcendent_weapon", "god_pet"],
      },
    },
    infinity_dungeon: {
      id: "infinity_dungeon",
      name: "Infinity Dungeon",
      icon: "♾️",
      difficulty: 999,
      minRooms: 100,
      maxRooms: 999,
      bossRequired: false,
      requiredPlayers: 1,
      theme: "infinite",
      enemies: ["random"],
      boss: null,
      rewards: {
        scalingRewards: true,
      },
    },
  };

  // ============================
  // ROOM TYPES
  // ============================

  const ROOM_TYPES = {
    combat: { id: "combat", name: "Combat Room", icon: "⚔️", weight: 50 },
    treasure: { id: "treasure", name: "Treasure Room", icon: "💎", weight: 10 },
    trap: { id: "trap", name: "Trap Room", icon: "🪤", weight: 15 },
    healing: { id: "healing", name: "Healing Fountain", icon: "⛲", weight: 8 },
    shop: { id: "shop", name: "Merchant", icon: "🛒", weight: 5 },
    puzzle: { id: "puzzle", name: "Puzzle Room", icon: "🧩", weight: 7 },
    boss: { id: "boss", name: "Boss Room", icon: "👹", weight: 5 },
    secret: { id: "secret", name: "Secret Room", icon: "🔒", weight: 2 },
  };

  // ============================
  // DUNGEON SYSTEM CLASS
  // ============================

  class DungeonSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Dungeon ID -> Dungeon data */
      this.activeDungeons = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        dungeonsCompleted: 0,
        bossesDefeated: 0,
        roomsCleared: 0,
        treasuresFound: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("dungeon:ready");

      return this;
    }

    /**
     * Generate a dungeon
     * @param {string} dungeonType - Dungeon type ID
     * @param {Object} options - Generation options
     * @returns {Object} Generated dungeon
     */
    generateDungeon(dungeonType, options = {}) {
      const template = DUNGEON_TYPES[dungeonType];
      if (!template) return null;

      const dungeonId = `dungeon_${Date.now()}`;

      const roomCount =
        options.roomCount ||
        this._randomRange(template.minRooms, template.maxRooms);

      const rooms = this._generateRooms(roomCount, template);

      const dungeon = {
        id: dungeonId,
        type: dungeonType,
        name: template.name,
        icon: template.icon,
        difficulty: template.difficulty,
        rooms,
        currentRoom: 0,
        completed: false,
        party: [],
        startedAt: Date.now(),
        stats: {
          roomsCleared: 0,
          enemiesKilled: 0,
          treasuresFound: 0,
          deaths: 0,
        },
      };

      this.activeDungeons.set(dungeonId, dungeon);

      this._emit("dungeon:generated", { dungeon });

      return dungeon;
    }

    /**
     * Enter dungeon
     * @param {string} dungeonId - Dungeon ID
     * @param {Array} playerIds - Player IDs
     * @returns {Object} Dungeon state
     */
    enterDungeon(dungeonId, playerIds) {
      const dungeon = this.activeDungeons.get(dungeonId);
      if (!dungeon) return null;

      dungeon.party = playerIds;

      this._emit("dungeon:entered", { dungeonId, party: playerIds });

      return this.getCurrentRoom(dungeonId);
    }

    /**
     * Get current room
     * @param {string} dungeonId - Dungeon ID
     * @returns {Object} Room data
     */
    getCurrentRoom(dungeonId) {
      const dungeon = this.activeDungeons.get(dungeonId);
      if (!dungeon) return null;

      return dungeon.rooms[dungeon.currentRoom] || null;
    }

    /**
     * Clear current room
     * @param {string} dungeonId - Dungeon ID
     * @returns {Object} Result
     */
    clearRoom(dungeonId) {
      const dungeon = this.activeDungeons.get(dungeonId);
      if (!dungeon) return null;

      const room = dungeon.rooms[dungeon.currentRoom];

      // Mark cleared
      room.cleared = true;
      dungeon.stats.roomsCleared++;
      this.stats.roomsCleared++;

      // Give rewards
      const rewards = this._generateRoomRewards(room, dungeon);

      this._emit("room:cleared", { dungeonId, room, rewards });

      return { room, rewards, canAdvance: true };
    }

    /**
     * Advance to next room
     * @param {string} dungeonId - Dungeon ID
     * @returns {Object|null} Next room
     */
    advanceRoom(dungeonId) {
      const dungeon = this.activeDungeons.get(dungeonId);
      if (!dungeon) return null;

      dungeon.currentRoom++;

      if (dungeon.currentRoom >= dungeon.rooms.length) {
        // Dungeon complete!
        dungeon.completed = true;
        this.stats.dungeonsCompleted++;

        this._emit("dungeon:completed", { dungeon });

        return { completed: true, dungeon };
      }

      const nextRoom = dungeon.rooms[dungeon.currentRoom];

      this._emit("room:entered", { dungeonId, room: nextRoom });

      return nextRoom;
    }

    /**
     * Get dungeon progress
     * @param {string} dungeonId - Dungeon ID
     * @returns {Object} Progress
     */
    getProgress(dungeonId) {
      const dungeon = this.activeDungeons.get(dungeonId);
      if (!dungeon) return null;

      return {
        currentRoom: dungeon.currentRoom,
        totalRooms: dungeon.rooms.length,
        percentage: (dungeon.currentRoom / dungeon.rooms.length) * 100,
        roomsCleared: dungeon.stats.roomsCleared,
      };
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeDungeons: Array.from(this.activeDungeons.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeDungeons.clear();
      if (data.activeDungeons) {
        data.activeDungeons.forEach(([id, dungeon]) => {
          this.activeDungeons.set(id, dungeon);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("dungeon:loaded");
    }

    // Private methods
    _generateRooms(count, template) {
      const rooms = [];

      for (let i = 0; i < count; i++) {
        const isBossRoom =
          template.bossRequired && i === count - 1;
        const roomType = isBossRoom ? "boss" : this._pickRoomType();

        const room = {
          id: `room_${i}`,
          index: i,
          type: roomType,
          ...ROOM_TYPES[roomType],
          cleared: false,
          enemies: isBossRoom
            ? [template.boss]
            : this._pickEnemies(template.enemies, 3, 8),
          loot: [],
        };

        rooms.push(room);
      }

      return rooms;
    }

    _pickRoomType() {
      // Weighted random selection
      const totalWeight = Object.values(ROOM_TYPES).reduce(
        (sum, rt) => sum + rt.weight,
        0
      );

      let roll = Math.random() * totalWeight;

      for (const roomType of Object.values(ROOM_TYPES)) {
        roll -= roomType.weight;
        if (roll <= 0) {
          return roomType.id;
        }
      }

      return "combat";
    }

    _pickEnemies(enemyPool, min, max) {
      const count = this._randomRange(min, max);
      const enemies = [];

      for (let i = 0; i < count; i++) {
        enemies.push(
          enemyPool[Math.floor(Math.random() * enemyPool.length)]
        );
      }

      return enemies;
    }

    _generateRoomRewards(room, dungeon) {
      const rewards = {
        gold: 0,
        xp: 0,
        items: [],
      };

      switch (room.type) {
        case "combat":
          rewards.gold = this._randomRange(100, 500) * dungeon.difficulty;
          rewards.xp = this._randomRange(200, 800) * dungeon.difficulty;
          break;
        case "treasure":
          rewards.gold = this._randomRange(500, 2000) * dungeon.difficulty;
          rewards.items.push({ type: "equipment", rarity: "rare" });
          this.stats.treasuresFound++;
          break;
        case "boss":
          const template = DUNGEON_TYPES[dungeon.type];
          rewards.gold = this._randomRange(
            template.rewards.gold.min,
            template.rewards.gold.max
          );
          rewards.xp = this._randomRange(
            template.rewards.xp.min,
            template.rewards.xp.max
          );
          rewards.items.push({ type: "equipment", rarity: "epic" });
          this.stats.bossesDefeated++;
          break;
        case "healing":
          rewards.heal = "full";
          break;
      }

      return rewards;
    }

    _randomRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[DungeonSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  DungeonSystem.DUNGEON_TYPES = DUNGEON_TYPES;
  DungeonSystem.ROOM_TYPES = ROOM_TYPES;

  return DungeonSystem;
});

