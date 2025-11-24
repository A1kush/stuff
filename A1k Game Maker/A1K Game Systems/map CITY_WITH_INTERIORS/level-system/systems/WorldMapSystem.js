/**
 * WorldMapSystem.js - World Map & Fast Travel
 * @version 1.0.0
 * @description Exploration, fast travel, waypoints, fog of war, regions
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WorldMapSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // WORLD REGIONS (20 Regions)
  // ============================

  const WORLD_REGIONS = {
    // Starting Areas (5)
    peaceful_meadows: {
      id: "peaceful_meadows",
      name: "Peaceful Meadows",
      icon: "🌾",
      level: 1,
      position: { x: 500, y: 500 },
      discovered: true,
      connections: ["whispering_forest", "green_hills"],
      npcs: ["Tutorial Guide", "Merchant"],
      quests: 5,
    },
    whispering_forest: {
      id: "whispering_forest",
      name: "Whispering Forest",
      icon: "🌲",
      level: 5,
      position: { x: 400, y: 400 },
      discovered: false,
      connections: ["peaceful_meadows", "dark_woods", "elven_village"],
      npcs: ["Forest Ranger", "Herbalist"],
      quests: 8,
    },
    green_hills: {
      id: "green_hills",
      name: "Green Hills",
      icon: "⛰️",
      level: 3,
      position: { x: 600, y: 600 },
      discovered: false,
      connections: ["peaceful_meadows", "mountain_pass"],
      npcs: ["Hill Shepherd"],
      quests: 4,
    },

    // Mid-Level Areas (10)
    scorching_desert: {
      id: "scorching_desert",
      name: "Scorching Desert",
      icon: "🏜️",
      level: 20,
      position: { x: 800, y: 400 },
      discovered: false,
      connections: ["mountain_pass", "oasis"],
      npcs: ["Desert Nomad"],
      quests: 12,
    },
    frozen_tundra: {
      id: "frozen_tundra",
      name: "Frozen Tundra",
      icon: "❄️",
      level: 30,
      position: { x: 200, y: 200 },
      discovered: false,
      connections: ["ice_palace", "frozen_lake"],
      npcs: ["Ice Shaman"],
      quests: 15,
    },
    volcanic_crater: {
      id: "volcanic_crater",
      name: "Volcanic Crater",
      icon: "🌋",
      level: 40,
      position: { x: 900, y: 700 },
      discovered: false,
      connections: ["scorching_desert", "lava_caves"],
      npcs: ["Fire Sage"],
      quests: 18,
    },

    // High-Level Areas (5)
    sky_kingdom: {
      id: "sky_kingdom",
      name: "Sky Kingdom",
      icon: "☁️",
      level: 60,
      position: { x: 500, y: 100 },
      discovered: false,
      connections: ["cloud_gardens", "storm_peaks"],
      npcs: ["Sky Guardian"],
      quests: 25,
    },
    void_realm: {
      id: "void_realm",
      name: "Void Realm",
      icon: "🕳️",
      level: 80,
      position: { x: 100, y: 900 },
      discovered: false,
      connections: ["abyss"],
      npcs: ["Void Walker"],
      quests: 30,
    },
    celestial_realm: {
      id: "celestial_realm",
      name: "Celestial Realm",
      icon: "✨",
      level: 100,
      position: { x: 500, y: 0 },
      discovered: false,
      connections: ["heaven_gates"],
      npcs: ["Divine Oracle"],
      quests: 50,
    },
  };

  const REGION_KEYS = Object.keys(WORLD_REGIONS);

  // ============================
  // WAYPOINTS (30 Total)
  // ============================

  const WAYPOINTS = {};
  
  // Generate waypoints for each region
  REGION_KEYS.forEach((regionId, index) => {
    const region = WORLD_REGIONS[regionId];
    
    WAYPOINTS[`${regionId}_waypoint`] = {
      id: `${regionId}_waypoint`,
      name: `${region.name} Waypoint`,
      regionId,
      position: region.position,
      discovered: region.discovered || false,
      fastTravelCost: region.level * 100,
    };
  });

  // ============================
  // WORLD MAP SYSTEM CLASS
  // ============================

  class WorldMapSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          fogOfWar: true,
          fastTravelUnlockLevel: 10,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Set>} Player ID -> Discovered regions */
      this.discoveredRegions = new Map();

      /** @type {Map<string, Set>} Player ID -> Discovered waypoints */
      this.discoveredWaypoints = new Map();

      /** @type {Map<string, string>} Player ID -> Current region */
      this.playerLocations = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalDiscoveries: 0,
        totalFastTravels: 0,
        explorationRate: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Set starting region as discovered for all players
      this.initialized = true;
      this._emit("worldmap:ready", { regions: REGION_KEYS.length });

      return this;
    }

    /**
     * Initialize player map
     * @param {string} playerId - Player ID
     */
    initializePlayerMap(playerId) {
      const discovered = new Set(["peaceful_meadows"]);
      this.discoveredRegions.set(playerId, discovered);

      const waypoints = new Set(["peaceful_meadows_waypoint"]);
      this.discoveredWaypoints.set(playerId, waypoints);

      this.playerLocations.set(playerId, "peaceful_meadows");

      this._emit("worldmap:initialized", { playerId });
    }

    /**
     * Discover region
     * @param {string} playerId - Player ID
     * @param {string} regionId - Region ID
     * @returns {Object} Region data
     */
    discoverRegion(playerId, regionId) {
      const region = WORLD_REGIONS[regionId];
      if (!region) return { error: "Invalid region" };

      const discovered = this.discoveredRegions.get(playerId) || new Set();

      if (discovered.has(regionId)) {
        return { error: "Region already discovered" };
      }

      // Check if player is in a connected region
      const currentRegion = this.playerLocations.get(playerId);
      if (currentRegion) {
        const current = WORLD_REGIONS[currentRegion];
        if (!current.connections.includes(regionId)) {
          return { error: "Region not accessible from current location" };
        }
      }

      discovered.add(regionId);
      this.discoveredRegions.set(playerId, discovered);

      this.stats.totalDiscoveries++;
      this.stats.explorationRate = (discovered.size / REGION_KEYS.length) * 100;

      this._emit("worldmap:region_discovered", { playerId, region });

      return region;
    }

    /**
     * Discover waypoint
     * @param {string} playerId - Player ID
     * @param {string} waypointId - Waypoint ID
     * @returns {Object} Waypoint data
     */
    discoverWaypoint(playerId, waypointId) {
      const waypoint = WAYPOINTS[waypointId];
      if (!waypoint) return { error: "Invalid waypoint" };

      const waypoints = this.discoveredWaypoints.get(playerId) || new Set();

      if (waypoints.has(waypointId)) {
        return { error: "Waypoint already discovered" };
      }

      // Check if region is discovered
      const regions = this.discoveredRegions.get(playerId) || new Set();
      if (!regions.has(waypoint.regionId)) {
        return { error: "Region not discovered yet" };
      }

      waypoints.add(waypointId);
      this.discoveredWaypoints.set(playerId, waypoints);

      this._emit("worldmap:waypoint_discovered", { playerId, waypoint });

      return waypoint;
    }

    /**
     * Fast travel
     * @param {string} playerId - Player ID
     * @param {string} waypointId - Target waypoint ID
     * @param {number} playerLevel - Player level
     * @returns {Object} Result
     */
    fastTravel(playerId, waypointId, playerLevel) {
      const waypoint = WAYPOINTS[waypointId];
      if (!waypoint) return { error: "Invalid waypoint" };

      // Check level requirement
      if (playerLevel < this.options.fastTravelUnlockLevel) {
        return { error: `Fast travel unlocks at level ${this.options.fastTravelUnlockLevel}` };
      }

      // Check if waypoint is discovered
      const waypoints = this.discoveredWaypoints.get(playerId) || new Set();
      if (!waypoints.has(waypointId)) {
        return { error: "Waypoint not discovered" };
      }

      // Set player location
      this.playerLocations.set(playerId, waypoint.regionId);

      this.stats.totalFastTravels++;

      this._emit("worldmap:fast_travel", { playerId, waypoint });

      return {
        success: true,
        destination: waypoint,
        cost: waypoint.fastTravelCost,
      };
    }

    /**
     * Travel to region (walking)
     * @param {string} playerId - Player ID
     * @param {string} regionId - Target region ID
     * @returns {Object} Result
     */
    travelTo(playerId, regionId) {
      const region = WORLD_REGIONS[regionId];
      if (!region) return { error: "Invalid region" };

      const currentRegion = this.playerLocations.get(playerId);
      if (!currentRegion) return { error: "No current location" };

      const current = WORLD_REGIONS[currentRegion];
      if (!current.connections.includes(regionId)) {
        return { error: "Region not connected" };
      }

      this.playerLocations.set(playerId, regionId);

      // Auto-discover if not discovered
      const discovered = this.discoveredRegions.get(playerId) || new Set();
      if (!discovered.has(regionId)) {
        this.discoverRegion(playerId, regionId);
      }

      this._emit("worldmap:traveled", { playerId, region });

      return { success: true, region };
    }

    /**
     * Get player location
     * @param {string} playerId - Player ID
     * @returns {Object} Current region
     */
    getPlayerLocation(playerId) {
      const regionId = this.playerLocations.get(playerId);
      return regionId ? WORLD_REGIONS[regionId] : null;
    }

    /**
     * Get discovered regions
     * @param {string} playerId - Player ID
     * @returns {Array} Regions
     */
    getDiscoveredRegions(playerId) {
      const discovered = this.discoveredRegions.get(playerId) || new Set();
      return Array.from(discovered).map((id) => WORLD_REGIONS[id]);
    }

    /**
     * Get map data for player
     * @param {string} playerId - Player ID
     * @returns {Object} Map data
     */
    getMapData(playerId) {
      const discovered = this.discoveredRegions.get(playerId) || new Set();
      const waypoints = this.discoveredWaypoints.get(playerId) || new Set();
      const currentRegion = this.playerLocations.get(playerId);

      return {
        regions: this.options.fogOfWar
          ? Array.from(discovered).map((id) => WORLD_REGIONS[id])
          : Object.values(WORLD_REGIONS),
        waypoints: Array.from(waypoints).map((id) => WAYPOINTS[id]),
        currentRegion: currentRegion ? WORLD_REGIONS[currentRegion] : null,
        explorationRate: (discovered.size / REGION_KEYS.length) * 100,
      };
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        discoveredRegions: Array.from(this.discoveredRegions.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        discoveredWaypoints: Array.from(this.discoveredWaypoints.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        playerLocations: Array.from(this.playerLocations.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.discoveredRegions.clear();
      if (data.discoveredRegions) {
        data.discoveredRegions.forEach(([id, arr]) => {
          this.discoveredRegions.set(id, new Set(arr));
        });
      }

      this.discoveredWaypoints.clear();
      if (data.discoveredWaypoints) {
        data.discoveredWaypoints.forEach(([id, arr]) => {
          this.discoveredWaypoints.set(id, new Set(arr));
        });
      }

      this.playerLocations.clear();
      if (data.playerLocations) {
        data.playerLocations.forEach(([playerId, regionId]) => {
          this.playerLocations.set(playerId, regionId);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("worldmap:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[WorldMapSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  WorldMapSystem.WORLD_REGIONS = WORLD_REGIONS;
  WorldMapSystem.REGION_KEYS = REGION_KEYS;
  WorldMapSystem.WAYPOINTS = WAYPOINTS;

  return WorldMapSystem;
});

