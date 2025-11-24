/**
 * SkillComboSystem.js - Skill Combination & Chain Attacks
 * @version 1.0.0
 * @description Combine skills for powerful combos, chain attacks, synergies
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SkillComboSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // COMBO DEFINITIONS (30 Combos)
  // ============================

  const SKILL_COMBOS = {
    // 2-Skill Combos (15)
    flame_slash: {
      id: "flame_slash",
      name: "Flame Slash",
      skills: ["slash", "fireball"],
      icon: "🔥⚔️",
      damage: 250,
      effects: ["burn"],
      cooldown: 5000,
      description: "Slash enhanced with fire",
    },
    ice_spike: {
      id: "ice_spike",
      name: "Ice Spike Rush",
      skills: ["ice_shard", "dash"],
      icon: "❄️💨",
      damage: 200,
      effects: ["freeze", "slow"],
      cooldown: 6000,
      description: "Dash while launching ice spikes",
    },
    lightning_storm: {
      id: "lightning_storm",
      name: "Lightning Storm",
      skills: ["lightning_bolt", "thunder"],
      icon: "⚡🌩️",
      damage: 400,
      effects: ["shock", "stun"],
      cooldown: 10000,
      description: "Massive AoE lightning",
    },
    poison_explosion: {
      id: "poison_explosion",
      name: "Poison Explosion",
      skills: ["poison_shot", "bomb"],
      icon: "☠️💣",
      damage: 300,
      effects: ["poison", "confusion"],
      cooldown: 8000,
      description: "Explosive poison cloud",
    },
    holy_strike: {
      id: "holy_strike",
      name: "Holy Strike",
      skills: ["smite", "blessing"],
      icon: "✨⚔️",
      damage: 350,
      effects: ["heal_self"],
      cooldown: 7000,
      description: "Divine damage + healing",
    },
    shadow_step: {
      id: "shadow_step",
      name: "Shadow Step",
      skills: ["shadow", "teleport"],
      icon: "🌑💨",
      damage: 180,
      effects: ["invisible"],
      cooldown: 5000,
      description: "Teleport strike from shadows",
    },
    meteor_crash: {
      id: "meteor_crash",
      name: "Meteor Crash",
      skills: ["meteor", "earthquake"],
      icon: "☄️💥",
      damage: 500,
      effects: ["stun", "knockback"],
      cooldown: 15000,
      description: "Devastating meteor impact",
    },
    blood_frenzy: {
      id: "blood_frenzy",
      name: "Blood Frenzy",
      skills: ["bleed", "rage"],
      icon: "🩸😡",
      damage: 450,
      effects: ["bleed", "atk_buff"],
      cooldown: 12000,
      description: "Bleed damage + attack boost",
    },
    wind_blade: {
      id: "wind_blade",
      name: "Wind Blade Barrage",
      skills: ["wind_slash", "multi_shot"],
      icon: "🌪️⚔️",
      damage: 320,
      effects: ["knockback"],
      cooldown: 7000,
      description: "Multiple wind slashes",
    },
    earth_wall: {
      id: "earth_wall",
      name: "Earth Wall Slam",
      skills: ["stone_wall", "charge"],
      icon: "🪨💥",
      damage: 280,
      effects: ["stun", "def_buff"],
      cooldown: 9000,
      description: "Wall creation + charge",
    },
    arcane_burst: {
      id: "arcane_burst",
      name: "Arcane Burst",
      skills: ["arcane_missile", "power_surge"],
      icon: "🔮✨",
      damage: 380,
      effects: ["mag_buff"],
      cooldown: 8000,
      description: "Powered arcane explosion",
    },
    life_drain: {
      id: "life_drain",
      name: "Life Drain",
      skills: ["drain", "curse"],
      icon: "🧛💀",
      damage: 300,
      effects: ["lifesteal"],
      cooldown: 10000,
      description: "Curse + health steal",
    },
    solar_flare: {
      id: "solar_flare",
      name: "Solar Flare",
      skills: ["sunbeam", "flash"],
      icon: "☀️✨",
      damage: 420,
      effects: ["blind", "burn"],
      cooldown: 11000,
      description: "Blinding solar explosion",
    },
    tsunami_wave: {
      id: "tsunami_wave",
      name: "Tsunami Wave",
      skills: ["water_blast", "wave"],
      icon: "🌊💧",
      damage: 360,
      effects: ["slow", "wet"],
      cooldown: 9000,
      description: "Massive water wave",
    },
    venom_strike: {
      id: "venom_strike",
      name: "Venom Strike",
      skills: ["poison", "precision_shot"],
      icon: "☠️🎯",
      damage: 340,
      effects: ["poison", "accuracy_up"],
      cooldown: 7000,
      description: "Precise poisonous attack",
    },

    // 3-Skill Combos (10)
    elemental_trinity: {
      id: "elemental_trinity",
      name: "Elemental Trinity",
      skills: ["fireball", "ice_shard", "lightning_bolt"],
      icon: "🔥❄️⚡",
      damage: 800,
      effects: ["burn", "freeze", "shock"],
      cooldown: 30000,
      description: "All 3 elements at once",
    },
    divine_judgment: {
      id: "divine_judgment",
      name: "Divine Judgment",
      skills: ["holy_light", "smite", "blessing"],
      icon: "✨⚔️🛡️",
      damage: 1000,
      effects: ["heal_all", "dmg_buff"],
      cooldown: 45000,
      description: "Ultimate holy power",
    },
    chaos_annihilation: {
      id: "chaos_annihilation",
      name: "Chaos Annihilation",
      skills: ["void_blast", "chaos_orb", "dark_ritual"],
      icon: "🕳️🌀💀",
      damage: 1200,
      effects: ["void_damage", "lifesteal"],
      cooldown: 60000,
      description: "Unleash pure chaos",
    },
    nature_fury: {
      id: "nature_fury",
      name: "Nature's Fury",
      skills: ["vine_whip", "earthquake", "thorn_storm"],
      icon: "🌿💥🌹",
      damage: 900,
      effects: ["root", "bleed", "slow"],
      cooldown: 40000,
      description: "Nature's wrath",
    },
    time_stop_assault: {
      id: "time_stop_assault",
      name: "Time Stop Assault",
      skills: ["time_stop", "rapid_strike", "time_skip"],
      icon: "⏰⚔️⏭️",
      damage: 1500,
      effects: ["freeze_time", "multi_hit"],
      cooldown: 90000,
      description: "Stop time and unleash attacks",
    },

    // Ultimate Combos (5) - Require 4+ skills
    apocalypse: {
      id: "apocalypse",
      name: "Apocalypse",
      skills: ["meteor", "earthquake", "tsunami", "tornado"],
      icon: "☄️💥🌊🌪️",
      damage: 3000,
      effects: ["stun_all", "massive_aoe"],
      cooldown: 300000,
      description: "End of the world combo",
    },
    ragnarok: {
      id: "ragnarok",
      name: "Ragnarok",
      skills: ["divine_judgment", "chaos_annihilation", "elemental_trinity"],
      icon: "⚡💀🔥",
      damage: 5000,
      effects: ["ultimate_destruction"],
      cooldown: 600000,
      description: "Requires 9 skills total",
    },
  };

  const COMBO_KEYS = Object.keys(SKILL_COMBOS);

  // ============================
  // SKILL COMBO SYSTEM CLASS
  // ============================

  class SkillComboSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          comboWindow: 5000, // 5 seconds to complete combo
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Array>} Player ID -> Skill history */
      this.skillHistory = new Map();

      /** @type {Map<string, Object>} Player ID -> Active combo */
      this.activeCombos = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalCombos: 0,
        byCombo: {},
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("combos:ready", { combos: COMBO_KEYS.length });

      return this;
    }

    /**
     * Use skill (check for combos)
     * @param {string} playerId - Player ID
     * @param {string} skillId - Skill ID
     * @returns {Object} Result (may include combo)
     */
    useSkill(playerId, skillId) {
      const history = this.skillHistory.get(playerId) || [];

      // Add to history
      history.push({
        skillId,
        timestamp: Date.now(),
      });

      // Keep only recent skills (last 10)
      const recent = history.slice(-10);
      this.skillHistory.set(playerId, recent);

      // Check for combo
      const combo = this._checkCombo(recent);

      if (combo) {
        this.stats.totalCombos++;
        this.stats.byCombo[combo.id] = (this.stats.byCombo[combo.id] || 0) + 1;

        // Clear history
        this.skillHistory.set(playerId, []);

        this._emit("combo:triggered", { playerId, combo });

        return {
          type: "combo",
          combo,
          damage: combo.damage,
          effects: combo.effects,
        };
      }

      return {
        type: "skill",
        skillId,
      };
    }

    /**
     * Get available combos for player's skills
     * @param {Array} playerSkills - Player's known skills
     * @returns {Array} Available combos
     */
    getAvailableCombos(playerSkills) {
      return COMBO_KEYS.map((key) => SKILL_COMBOS[key]).filter((combo) =>
        combo.skills.every((skill) => playerSkills.includes(skill))
      );
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        skillHistory: Array.from(this.skillHistory.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.skillHistory.clear();
      if (data.skillHistory) {
        data.skillHistory.forEach(([playerId, history]) => {
          this.skillHistory.set(playerId, history);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("combos:loaded");
    }

    // Private methods
    _checkCombo(history) {
      const now = Date.now();

      // Filter recent skills (within combo window)
      const recent = history.filter(
        (h) => now - h.timestamp < this.options.comboWindow
      );

      const recentSkills = recent.map((h) => h.skillId);

      // Check each combo
      for (const combo of Object.values(SKILL_COMBOS)) {
        if (this._matchesCombo(recentSkills, combo.skills)) {
          return combo;
        }
      }

      return null;
    }

    _matchesCombo(used, required) {
      // Check if all required skills were used in order
      let usedIndex = used.length - 1;

      for (let i = required.length - 1; i >= 0; i--) {
        let found = false;

        for (let j = usedIndex; j >= 0; j--) {
          if (used[j] === required[i]) {
            found = true;
            usedIndex = j - 1;
            break;
          }
        }

        if (!found) return false;
      }

      return true;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[SkillComboSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  SkillComboSystem.SKILL_COMBOS = SKILL_COMBOS;
  SkillComboSystem.COMBO_KEYS = COMBO_KEYS;

  return SkillComboSystem;
});

