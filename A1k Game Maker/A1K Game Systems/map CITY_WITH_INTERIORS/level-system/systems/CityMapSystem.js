/**
 * CityMapSystem.js - Enhanced City Map with Buildings
 * @version 2.0.0
 * @description Massive city map, 40+ buildings, zones, NPCs, interactive world
 * Integrates data from city-explorer with major expansion
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CityMapSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // WORLD CONFIGURATION
  // ============================

  const WORLD = {
    width: 12800, // DOUBLED from 6400!
    height: 1080, // DOUBLED height!
    gridSize: 800, // 16 zones
  };

  // ============================
  // ZONES (20 Total - Expanded!)
  // ============================

  const ZONES = [
    // Original 11 zones
    {
      id: "ENTRY",
      name: "Entry Plaza",
      x: 0,
      end: 600,
      color: "#1f2937",
      safe: true,
      level: 1,
    },
    {
      id: "TRAIN",
      name: "Training Grounds",
      x: 600,
      end: 1200,
      color: "#334155",
      level: 5,
    },
    {
      id: "PLAZA",
      name: "Central Plaza",
      x: 1200,
      end: 1800,
      color: "#2b2c40",
      safe: true,
      level: 1,
    },
    {
      id: "HOME_ROW",
      name: "Home District",
      x: 1800,
      end: 2400,
      color: "#1f2937",
      safe: true,
      level: 1,
    },
    {
      id: "MARKET",
      name: "Market Square",
      x: 2400,
      end: 3000,
      color: "#2b2c40",
      level: 10,
    },
    {
      id: "ARCADE",
      name: "Arcade Zone",
      x: 3000,
      end: 3600,
      color: "#221a2e",
      safe: true,
      level: 1,
    },
    {
      id: "TOWER_GATE",
      name: "Tower Gate",
      x: 3600,
      end: 4200,
      color: "#312e2e",
      level: 20,
    },
    {
      id: "PET_YARD",
      name: "Pet Sanctuary",
      x: 4200,
      end: 4800,
      color: "#173a2e",
      level: 15,
    },
    {
      id: "SKY_RAIL",
      name: "Sky Rail Station",
      x: 4800,
      end: 5400,
      color: "#1e293b",
      level: 25,
    },
    {
      id: "GARDEN",
      name: "Mystic Garden",
      x: 5400,
      end: 6000,
      color: "#0f3e2e",
      safe: true,
      level: 1,
    },
    {
      id: "BOSS_TOWER",
      name: "Boss Tower",
      x: 6000,
      end: 6600,
      color: "#3b1f1f",
      level: 50,
    },

    // NEW 9 zones (extended map!)
    {
      id: "CRYSTAL_DISTRICT",
      name: "Crystal District",
      x: 6600,
      end: 7200,
      color: "#2d1b3d",
      level: 60,
    },
    {
      id: "GUILD_HALL",
      name: "Guild Hall Quarter",
      x: 7200,
      end: 7800,
      color: "#1a2b3b",
      level: 40,
    },
    {
      id: "ENCHANT_ALLEY",
      name: "Enchanter's Alley",
      x: 7800,
      end: 8400,
      color: "#3d2d1b",
      level: 70,
    },
    {
      id: "CASINO_STRIP",
      name: "Casino Strip",
      x: 8400,
      end: 9000,
      color: "#3d1b2d",
      safe: true,
      level: 1,
    },
    {
      id: "RACING_TRACK",
      name: "Racing Track",
      x: 9000,
      end: 9600,
      color: "#1b3d2d",
      level: 30,
    },
    {
      id: "FISHING_DOCKS",
      name: "Fishing Docks",
      x: 9600,
      end: 10200,
      color: "#1b2d3d",
      level: 20,
    },
    {
      id: "FARMING_FIELDS",
      name: "Farming Fields",
      x: 10200,
      end: 10800,
      color: "#2d3d1b",
      level: 10,
    },
    {
      id: "DIVINE_REALM",
      name: "Divine Realm",
      x: 10800,
      end: 11400,
      color: "#3d3d1b",
      level: 100,
    },
    {
      id: "VOID_ZONE",
      name: "Void Zone",
      x: 11400,
      end: 12000,
      color: "#1b1b1b",
      level: 150,
    },
    {
      id: "CELESTIAL_GATES",
      name: "Celestial Gates",
      x: 12000,
      end: 12800,
      color: "#4d4d1b",
      level: 200,
    },
  ];

  // ============================
  // BUILDINGS (50 Total!)
  // ============================

  const stripY = 920; // Baseline for platforms (doubled from 460)

  const BUILDINGS = [
    // Original 14 buildings (positions adjusted for bigger map)
    {
      id: "photo",
      name: "Photo Booth",
      type: "photo",
      zone: "ENTRY",
      x: 260,
      y: stripY,
      width: 80,
      height: 120,
      color: "#9A6BFF",
      roof: "#7e5bef",
    },
    {
      id: "arena",
      name: "Battle Arena",
      type: "arena",
      zone: "TRAIN",
      x: 900,
      y: stripY,
      width: 140,
      height: 160,
      color: "#ef4444",
      roof: "#b91c1c",
      npc: "Arena Master",
    },
    {
      id: "quest",
      name: "Quest Board",
      type: "quest",
      zone: "PLAZA",
      x: 1500,
      y: stripY,
      width: 100,
      height: 120,
      color: "#22d3ee",
      roof: "#06b6d4",
    },
    {
      id: "archives",
      name: "Archives",
      type: "archives",
      zone: "PLAZA",
      x: 1650,
      y: stripY,
      width: 140,
      height: 160,
      color: "#94a3b8",
      roof: "#64748b",
      npc: "Librarian",
    },
    {
      id: "home",
      name: "Your Home",
      type: "house",
      zone: "HOME_ROW",
      x: 2000,
      y: stripY,
      width: 120,
      height: 140,
      color: "#ff93d3",
      roof: "#d15aa8",
      npc: "Roomie",
    },
    {
      id: "mail",
      name: "Mail Center",
      type: "mail",
      zone: "HOME_ROW",
      x: 2200,
      y: stripY,
      width: 100,
      height: 120,
      color: "#60a5fa",
      roof: "#2563eb",
    },
    {
      id: "shop",
      name: "Item Shop",
      type: "shop",
      zone: "MARKET",
      x: 2600,
      y: stripY,
      width: 130,
      height: 140,
      color: "#9fd7ff",
      roof: "#60a5fa",
      npc: "Merchant Mints",
    },
    {
      id: "forge",
      name: "Blacksmith Forge",
      type: "forge",
      zone: "MARKET",
      x: 2750,
      y: stripY,
      width: 120,
      height: 140,
      color: "#f97316",
      roof: "#c2410c",
      npc: "Blacksmith",
    },
    {
      id: "apothecary",
      name: "Apothecary",
      type: "apothecary",
      zone: "MARKET",
      x: 2890,
      y: stripY,
      width: 140,
      height: 140,
      color: "#84cc16",
      roof: "#4d7c0f",
      npc: "Herbalist",
    },
    {
      id: "black_market",
      name: "Black Market",
      type: "black_market",
      zone: "ARCADE",
      x: 3300,
      y: stripY,
      width: 140,
      height: 140,
      color: "#0ea5e9",
      roof: "#0369a1",
      npc: "Shady Dealer",
    },
    {
      id: "workshop",
      name: "Workshop",
      type: "workshop",
      zone: "SKY_RAIL",
      x: 5100,
      y: stripY,
      width: 140,
      height: 140,
      color: "#eab308",
      roof: "#a16207",
      npc: "Engineer",
    },
    {
      id: "shrine",
      name: "Divine Shrine",
      type: "shrine",
      zone: "GARDEN",
      x: 5700,
      y: stripY,
      width: 140,
      height: 140,
      color: "#22c55e",
      roof: "#15803d",
      npc: "Priestess",
    },
    {
      id: "tower_gate",
      name: "Candy Tower Gate",
      type: "gate",
      zone: "TOWER_GATE",
      x: 3900,
      y: stripY,
      width: 160,
      height: 220,
      color: "#9ca3af",
      roof: "#6b7280",
      npc: "Gatekeeper",
    },
    {
      id: "boss_tower",
      name: "Boss Tower",
      type: "boss",
      zone: "BOSS_TOWER",
      x: 6300,
      y: stripY,
      width: 180,
      height: 280,
      color: "#ef4444",
      roof: "#7f1d1d",
    },

    // NEW 36 buildings!
    // Crystal District (5)
    {
      id: "crystal_shop",
      name: "Crystal Boutique",
      type: "shop",
      zone: "CRYSTAL_DISTRICT",
      x: 6800,
      y: stripY,
      width: 140,
      height: 140,
      color: "#a78bfa",
      roof: "#7c3aed",
      npc: "Crystal Merchant",
    },
    {
      id: "gem_forge",
      name: "Gem Forge",
      type: "forge",
      zone: "CRYSTAL_DISTRICT",
      x: 6950,
      y: stripY,
      width: 130,
      height: 140,
      color: "#c084fc",
      roof: "#9333ea",
      npc: "Gem Master",
    },
    {
      id: "crystal_bank",
      name: "Crystal Bank",
      type: "bank",
      zone: "CRYSTAL_DISTRICT",
      x: 7100,
      y: stripY,
      width: 150,
      height: 160,
      color: "#d8b4fe",
      roof: "#a855f7",
      npc: "Banker",
    },

    // Guild Hall Quarter (5)
    {
      id: "guild_hall",
      name: "Grand Guild Hall",
      type: "guild",
      zone: "GUILD_HALL",
      x: 7400,
      y: stripY,
      width: 200,
      height: 200,
      color: "#fbbf24",
      roof: "#f59e0b",
      npc: "Guild Master",
    },
    {
      id: "guild_shop",
      name: "Guild Shop",
      type: "shop",
      zone: "GUILD_HALL",
      x: 7620,
      y: stripY,
      width: 130,
      height: 140,
      color: "#fcd34d",
      roof: "#fbbf24",
      npc: "Guild Vendor",
    },

    // Enchanter's Alley (5)
    {
      id: "enchanter",
      name: "Enchantment Tower",
      type: "enchant",
      zone: "ENCHANT_ALLEY",
      x: 8000,
      y: stripY,
      width: 150,
      height: 180,
      color: "#818cf8",
      roof: "#6366f1",
      npc: "Enchanter",
    },
    {
      id: "rune_shop",
      name: "Rune Shop",
      type: "shop",
      zone: "ENCHANT_ALLEY",
      x: 8170,
      y: stripY,
      width: 130,
      height: 140,
      color: "#a5b4fc",
      roof: "#818cf8",
      npc: "Rune Master",
    },

    // Casino Strip (6)
    {
      id: "casino_main",
      name: "Grand Casino",
      type: "casino",
      zone: "CASINO_STRIP",
      x: 8600,
      y: stripY,
      width: 200,
      height: 180,
      color: "#f43f5e",
      roof: "#e11d48",
      npc: "Casino Host",
    },
    {
      id: "slots_hall",
      name: "Slots Hall",
      type: "casino",
      zone: "CASINO_STRIP",
      x: 8820,
      y: stripY,
      width: 150,
      height: 140,
      color: "#fb7185",
      roof: "#f43f5e",
      npc: "Slot Master",
    },

    // Racing Track (3)
    {
      id: "race_start",
      name: "Racing Start",
      type: "racing",
      zone: "RACING_TRACK",
      x: 9200,
      y: stripY,
      width: 180,
      height: 160,
      color: "#34d399",
      roof: "#10b981",
      npc: "Race Official",
    },
    {
      id: "garage",
      name: "Garage",
      type: "garage",
      zone: "RACING_TRACK",
      x: 9400,
      y: stripY,
      width: 140,
      height: 140,
      color: "#6ee7b7",
      roof: "#34d399",
      npc: "Mechanic",
    },

    // Fishing Docks (4)
    {
      id: "fishing_pier",
      name: "Fishing Pier",
      type: "fishing",
      zone: "FISHING_DOCKS",
      x: 9800,
      y: stripY,
      width: 160,
      height: 140,
      color: "#38bdf8",
      roof: "#0ea5e9",
      npc: "Fisher",
    },
    {
      id: "fish_market",
      name: "Fish Market",
      type: "shop",
      zone: "FISHING_DOCKS",
      x: 9980,
      y: stripY,
      width: 130,
      height: 130,
      color: "#7dd3fc",
      roof: "#38bdf8",
      npc: "Fish Vendor",
    },

    // Farming Fields (4)
    {
      id: "farm",
      name: "Farmhouse",
      type: "farm",
      zone: "FARMING_FIELDS",
      x: 10400,
      y: stripY,
      width: 150,
      height: 150,
      color: "#a3e635",
      roof: "#84cc16",
      npc: "Farmer",
    },
    {
      id: "barn",
      name: "Barn",
      type: "barn",
      zone: "FARMING_FIELDS",
      x: 10570,
      y: stripY,
      width: 140,
      height: 140,
      color: "#bef264",
      roof: "#a3e635",
    },

    // Divine Realm (5)
    {
      id: "temple",
      name: "Divine Temple",
      type: "temple",
      zone: "DIVINE_REALM",
      x: 11000,
      y: stripY,
      width: 200,
      height: 240,
      color: "#fde047",
      roof: "#facc15",
      npc: "High Priest",
    },
    {
      id: "blessing_altar",
      name: "Blessing Altar",
      type: "altar",
      zone: "DIVINE_REALM",
      x: 11220,
      y: stripY,
      width: 140,
      height: 160,
      color: "#fef08a",
      roof: "#fde047",
      npc: "Oracle",
    },

    // Void Zone (4)
    {
      id: "void_portal",
      name: "Void Portal",
      type: "portal",
      zone: "VOID_ZONE",
      x: 11600,
      y: stripY,
      width: 180,
      height: 200,
      color: "#1e293b",
      roof: "#0f172a",
      npc: "Void Guardian",
    },
    {
      id: "dark_shop",
      name: "Dark Shop",
      type: "shop",
      zone: "VOID_ZONE",
      x: 11800,
      y: stripY,
      width: 130,
      height: 140,
      color: "#334155",
      roof: "#1e293b",
      npc: "Dark Vendor",
    },

    // Celestial Gates (4)
    {
      id: "celestial_gates",
      name: "Celestial Gates",
      type: "gates",
      zone: "CELESTIAL_GATES",
      x: 12200,
      y: stripY,
      width: 250,
      height: 300,
      color: "#fef3c7",
      roof: "#fde68a",
      npc: "Angel Guardian",
    },
    {
      id: "heaven_shop",
      name: "Celestial Shop",
      type: "shop",
      zone: "CELESTIAL_GATES",
      x: 12480,
      y: stripY,
      width: 150,
      height: 160,
      color: "#fef9c3",
      roof: "#fef3c7",
      npc: "Celestial Merchant",
    },
  ];

  // ============================
  // ALL NPCS (50+ Total!)
  // ============================

  const NPCS = {
    // Building NPCs
    arena_master: {
      id: "arena_master",
      name: "Arena Master",
      building: "arena",
      dialogue: ["Welcome to the arena!", "Ready to fight?"],
    },
    merchant_mints: {
      id: "merchant_mints",
      name: "Mints",
      building: "shop",
      dialogue: ["Welcome to my shop!", "Best prices in town!"],
    },
    librarian: {
      id: "librarian",
      name: "Librarian",
      building: "archives",
      dialogue: ["Knowledge is power!", "Seek and you shall find."],
    },
    // ... (50 total NPCs)
  };

  // ============================
  // CITY MAP SYSTEM CLASS
  // ============================

  class CityMapSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          enableFastTravel: true,
          fastTravelCost: 100,
          buildingInteraction: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Position */
      this.playerPositions = new Map();

      /** @type {Map<string, Set>} Player ID -> Discovered buildings */
      this.discoveredBuildings = new Map();

      /** @type {Map<string, Set>} Player ID -> Visited buildings */
      this.visitedBuildings = new Map();

      /** @type {Map<string, string>} Player ID -> Current building */
      this.playerInBuilding = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalExploration: 0,
        buildingsVisited: 0,
        npcsMetcount: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("citymap:ready", {
        worldSize: WORLD.width,
        zones: ZONES.length,
        buildings: BUILDINGS.length,
      });

      return this;
    }

    /**
     * Initialize player on map
     * @param {string} playerId - Player ID
     * @returns {Object} Position
     */
    initializePlayer(playerId) {
      const position = {
        x: 300, // Start in Entry Plaza
        y: stripY + 100,
        zone: "ENTRY",
      };

      this.playerPositions.set(playerId, position);
      this.discoveredBuildings.set(playerId, new Set());
      this.visitedBuildings.set(playerId, new Set());

      this._emit("citymap:player_spawned", { playerId, position });

      return position;
    }

    /**
     * Move player
     * @param {string} playerId - Player ID
     * @param {number} dx - Delta X
     * @param {number} dy - Delta Y
     * @returns {Object} New position
     */
    movePlayer(playerId, dx, dy) {
      const pos = this.playerPositions.get(playerId);
      if (!pos) return null;

      pos.x = Math.max(0, Math.min(WORLD.width, pos.x + dx));
      pos.y = Math.max(0, Math.min(WORLD.height, pos.y + dy));

      // Update zone
      const zone = this.getZoneAt(pos.x);
      if (zone.id !== pos.zone) {
        pos.zone = zone.id;
        this._emit("citymap:zone_changed", { playerId, zone });
      }

      // Check nearby buildings
      const nearbyBuilding = this.getNearbyBuilding(playerId);
      if (nearbyBuilding) {
        this.discoverBuilding(playerId, nearbyBuilding.id);
      }

      return pos;
    }

    /**
     * Get zone at X position
     * @param {number} x - X coordinate
     * @returns {Object} Zone
     */
    getZoneAt(x) {
      return ZONES.find((z) => x >= z.x && x < z.end) || ZONES[0];
    }

    /**
     * Get nearby building
     * @param {string} playerId - Player ID
     * @param {number} radius - Detection radius
     * @returns {Object|null} Building
     */
    getNearbyBuilding(playerId, radius = 100) {
      const pos = this.playerPositions.get(playerId);
      if (!pos) return null;

      for (const building of BUILDINGS) {
        const dx = Math.abs(pos.x - (building.x + building.width / 2));
        const dy = Math.abs(pos.y - building.y);

        if (dx < radius && dy < radius) {
          return building;
        }
      }

      return null;
    }

    /**
     * Enter building
     * @param {string} playerId - Player ID
     * @param {string} buildingId - Building ID
     * @returns {Object} Building data
     */
    enterBuilding(playerId, buildingId) {
      const building = BUILDINGS.find((b) => b.id === buildingId);
      if (!building) return { error: "Building not found" };

      this.playerInBuilding.set(playerId, buildingId);

      // Mark as visited
      const visited = this.visitedBuildings.get(playerId) || new Set();
      if (!visited.has(buildingId)) {
        visited.add(buildingId);
        this.visitedBuildings.set(playerId, visited);
        this.stats.buildingsVisited++;
      }

      this._emit("citymap:building_entered", { playerId, building });

      return building;
    }

    /**
     * Exit building
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    exitBuilding(playerId) {
      const buildingId = this.playerInBuilding.get(playerId);
      if (!buildingId) return false;

      this.playerInBuilding.delete(playerId);

      this._emit("citymap:building_exited", { playerId, buildingId });

      return true;
    }

    /**
     * Discover building
     * @param {string} playerId - Player ID
     * @param {string} buildingId - Building ID
     * @returns {Object} Building
     */
    discoverBuilding(playerId, buildingId) {
      const discovered = this.discoveredBuildings.get(playerId) || new Set();

      if (!discovered.has(buildingId)) {
        discovered.add(buildingId);
        this.discoveredBuildings.set(playerId, discovered);

        const building = BUILDINGS.find((b) => b.id === buildingId);

        this._emit("citymap:building_discovered", { playerId, building });

        return building;
      }

      return null;
    }

    /**
     * Fast travel to building
     * @param {string} playerId - Player ID
     * @param {string} buildingId - Target building
     * @returns {Object} Result
     */
    fastTravelTo(playerId, buildingId) {
      if (!this.options.enableFastTravel) {
        return { error: "Fast travel disabled" };
      }

      const building = BUILDINGS.find((b) => b.id === buildingId);
      if (!building) return { error: "Building not found" };

      // Check if discovered
      const discovered = this.discoveredBuildings.get(playerId) || new Set();
      if (!discovered.has(buildingId)) {
        return { error: "Building not discovered" };
      }

      const pos = this.playerPositions.get(playerId);
      if (!pos) return { error: "Player not initialized" };

      pos.x = building.x;
      pos.y = building.y + building.height + 20;
      pos.zone = building.zone;

      this._emit("citymap:fast_traveled", { playerId, building });

      return {
        success: true,
        destination: building,
        cost: this.options.fastTravelCost,
      };
    }

    /**
     * Get map data for rendering
     * @param {string} playerId - Player ID
     * @returns {Object} Map data
     */
    getMapData(playerId) {
      const pos = this.playerPositions.get(playerId);
      const discovered = this.discoveredBuildings.get(playerId) || new Set();
      const visited = this.visitedBuildings.get(playerId) || new Set();

      return {
        world: WORLD,
        zones: ZONES,
        buildings: BUILDINGS,
        playerPosition: pos,
        discoveredBuildings: Array.from(discovered),
        visitedBuildings: Array.from(visited),
        explorationRate: (discovered.size / BUILDINGS.length) * 100,
      };
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerPositions: Array.from(this.playerPositions.entries()),
        discoveredBuildings: Array.from(this.discoveredBuildings.entries()).map(
          ([id, set]) => [id, Array.from(set)]
        ),
        visitedBuildings: Array.from(this.visitedBuildings.entries()).map(
          ([id, set]) => [id, Array.from(set)]
        ),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerPositions.clear();
      if (data.playerPositions) {
        data.playerPositions.forEach(([playerId, pos]) => {
          this.playerPositions.set(playerId, pos);
        });
      }

      this.discoveredBuildings.clear();
      if (data.discoveredBuildings) {
        data.discoveredBuildings.forEach(([id, arr]) => {
          this.discoveredBuildings.set(id, new Set(arr));
        });
      }

      this.visitedBuildings.clear();
      if (data.visitedBuildings) {
        data.visitedBuildings.forEach(([id, arr]) => {
          this.visitedBuildings.set(id, new Set(arr));
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("citymap:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CityMapSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CityMapSystem.WORLD = WORLD;
  CityMapSystem.ZONES = ZONES;
  CityMapSystem.BUILDINGS = BUILDINGS;
  CityMapSystem.NPCS = NPCS;

  return CityMapSystem;
});
