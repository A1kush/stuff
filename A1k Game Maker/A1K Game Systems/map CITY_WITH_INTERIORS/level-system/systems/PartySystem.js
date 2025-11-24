/**
 * PartySystem.js - Party/Team Formation & Bonuses
 * @version 1.0.0
 * @description Form parties, role bonuses, team skills, shared rewards
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PartySystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // PARTY ROLES (8 Roles)
  // ============================

  const PARTY_ROLES = {
    tank: {
      id: "tank",
      name: "Tank",
      icon: "🛡️",
      bonuses: { hp: 1.5, def: 1.3, threat: 2.0 },
      description: "Absorbs damage for the team",
    },
    dps: {
      id: "dps",
      name: "DPS",
      icon: "⚔️",
      bonuses: { atk: 1.4, crt: 1.2 },
      description: "Deals maximum damage",
    },
    healer: {
      id: "healer",
      name: "Healer",
      icon: "💚",
      bonuses: { wis: 1.3, healing: 1.5, mp: 1.4 },
      description: "Heals and supports team",
    },
    mage: {
      id: "mage",
      name: "Mage",
      icon: "🔮",
      bonuses: { mag: 1.5, int: 1.3, mp: 1.3 },
      description: "Powerful magic attacks",
    },
    ranger: {
      id: "ranger",
      name: "Ranger",
      icon: "🏹",
      bonuses: { dex: 1.4, spd: 1.3, crt: 1.15 },
      description: "Ranged attacks and mobility",
    },
    support: {
      id: "support",
      name: "Support",
      icon: "✨",
      bonuses: { team_buff: 1.2, xp_share: 1.15 },
      description: "Buffs and assists team",
    },
    assassin: {
      id: "assassin",
      name: "Assassin",
      icon: "🗡️",
      bonuses: { crt: 1.5, spd: 1.4, stealth: 1.5 },
      description: "Critical strikes and stealth",
    },
    paladin: {
      id: "paladin",
      name: "Paladin",
      icon: "⚔️🛡️",
      bonuses: { hp: 1.3, def: 1.2, atk: 1.2, healing: 1.2 },
      description: "Hybrid tank/healer",
    },
  };

  // ============================
  // PARTY FORMATIONS (10 Types)
  // ============================

  const FORMATIONS = {
    balanced: {
      id: "balanced",
      name: "Balanced Formation",
      icon: "⚖️",
      bonuses: { all_stats: 10 },
      description: "Well-rounded team",
    },
    offensive: {
      id: "offensive",
      name: "Offensive Formation",
      icon: "⚔️",
      bonuses: { atk: 1.3, damage: 1.2 },
      description: "Maximum damage output",
    },
    defensive: {
      id: "defensive",
      name: "Defensive Formation",
      icon: "🛡️",
      bonuses: { def: 1.3, hp: 1.2 },
      description: "Maximum survivability",
    },
    speedrun: {
      id: "speedrun",
      name: "Speedrun Formation",
      icon: "⚡",
      bonuses: { spd: 1.5, xp: 1.3, gold: 1.2 },
      description: "Fast clears, high rewards",
    },
    tank_and_spank: {
      id: "tank_and_spank",
      name: "Tank & Spank",
      icon: "🛡️⚔️",
      bonuses: { threat: 2.0, dps_damage: 1.4 },
      description: "Tank holds, DPS burns",
    },
    magic_burst: {
      id: "magic_burst",
      name: "Magic Burst",
      icon: "🔮💥",
      bonuses: { mag: 1.5, mp_regen: 1.5 },
      description: "Magical devastation",
    },
    sustain: {
      id: "sustain",
      name: "Sustain Formation",
      icon: "💚🔄",
      bonuses: { healing: 1.5, hp_regen: 2.0 },
      description: "Maximum healing",
    },
    aoe_clear: {
      id: "aoe_clear",
      name: "AoE Clear",
      icon: "💥🌀",
      bonuses: { aoe_damage: 1.8, multi_target: 1.5 },
      description: "Clear multiple enemies",
    },
    boss_killer: {
      id: "boss_killer",
      name: "Boss Killer",
      icon: "👹💀",
      bonuses: { boss_damage: 2.0, crt_damage: 1.5 },
      description: "Optimized for bosses",
    },
    treasure_hunt: {
      id: "treasure_hunt",
      name: "Treasure Hunt",
      icon: "💎🔍",
      bonuses: { luk: 1.5, rare_drop: 2.0, gold: 1.5 },
      description: "Maximum loot",
    },
  };

  // ============================
  // TEAM SKILLS (15 Skills)
  // ============================

  const TEAM_SKILLS = {
    rally: {
      id: "rally",
      name: "Rally",
      icon: "📢",
      requiredMembers: 3,
      cooldown: 60000,
      effect: { all_stats: 50, duration: 30000 },
      description: "Boost all team stats",
    },
    chain_attack: {
      id: "chain_attack",
      name: "Chain Attack",
      icon: "⛓️⚔️",
      requiredMembers: 4,
      cooldown: 30000,
      effect: { chain_damage: 500 },
      description: "All attack in sequence",
    },
    group_heal: {
      id: "group_heal",
      name: "Group Heal",
      icon: "💚",
      requiredMembers: 2,
      cooldown: 45000,
      effect: { heal_all: 500 },
      description: "Heal entire party",
    },
    synchronized_assault: {
      id: "synchronized_assault",
      name: "Synchronized Assault",
      icon: "🎯",
      requiredMembers: 5,
      cooldown: 90000,
      effect: { sync_damage: 2000, crt: 1.0 },
      description: "Perfect team attack",
    },
    protective_barrier: {
      id: "protective_barrier",
      name: "Protective Barrier",
      icon: "🛡️✨",
      requiredMembers: 3,
      cooldown: 120000,
      effect: { shield_all: 1000, duration: 30000 },
      description: "Shield entire party",
    },
    ultimate_fusion: {
      id: "ultimate_fusion",
      name: "Ultimate Fusion",
      icon: "⚡💥",
      requiredMembers: 8,
      cooldown: 300000,
      effect: { team_ultimate: 10000 },
      description: "Combine all ultimates",
    },
  };

  // ============================
  // PARTY SYSTEM CLASS
  // ============================

  class PartySystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxPartySize: 8,
          xpShareRadius: 1000,
          lootShareEnabled: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Party ID -> Party data */
      this.parties = new Map();

      /** @type {Map<string, string>} Player ID -> Party ID */
      this.playerParties = new Map();

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("party:ready");

      return this;
    }

    /**
     * Create party
     * @param {string} leaderId - Leader ID
     * @param {Object} options - Party options
     * @returns {Object} Party data
     */
    createParty(leaderId, options = {}) {
      if (this.playerParties.has(leaderId)) {
        return { error: "Already in party" };
      }

      const partyId = `party_${Date.now()}`;

      const party = {
        id: partyId,
        leaderId,
        members: [
          {
            playerId: leaderId,
            role: options.role || "dps",
            joinedAt: Date.now(),
          },
        ],
        formation: "balanced",
        lootMode: options.lootMode || "fair", // fair, leader, random
        xpShare: true,
        createdAt: Date.now(),
      };

      this.parties.set(partyId, party);
      this.playerParties.set(leaderId, partyId);

      this._emit("party:created", { party });

      return party;
    }

    /**
     * Invite to party
     * @param {string} partyId - Party ID
     * @param {string} inviteeId - Invitee ID
     * @param {string} role - Role
     * @returns {boolean} Success
     */
    inviteToParty(partyId, inviteeId, role = "dps") {
      const party = this.parties.get(partyId);
      if (!party) return false;

      if (this.playerParties.has(inviteeId)) return false;

      if (party.members.length >= this.options.maxPartySize) return false;

      party.members.push({
        playerId: inviteeId,
        role,
        joinedAt: Date.now(),
      });

      this.playerParties.set(inviteeId, partyId);

      this._emit("party:joined", { partyId, playerId: inviteeId, role });

      return true;
    }

    /**
     * Leave party
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    leaveParty(playerId) {
      const partyId = this.playerParties.get(playerId);
      if (!partyId) return false;

      const party = this.parties.get(partyId);
      if (!party) return false;

      // Remove member
      party.members = party.members.filter((m) => m.playerId !== playerId);

      this.playerParties.delete(playerId);

      // Disband if leader leaves or empty
      if (playerId === party.leaderId || party.members.length === 0) {
        this._disbandParty(partyId);
      }

      this._emit("party:left", { partyId, playerId });

      return true;
    }

    /**
     * Set party formation
     * @param {string} partyId - Party ID
     * @param {string} formationId - Formation ID
     * @returns {boolean} Success
     */
    setFormation(partyId, formationId) {
      const party = this.parties.get(partyId);
      const formation = FORMATIONS[formationId];

      if (!party || !formation) return false;

      party.formation = formationId;

      this._emit("party:formation_changed", { partyId, formation });

      return true;
    }

    /**
     * Get party bonuses
     * @param {string} partyId - Party ID
     * @returns {Object} Bonuses
     */
    getPartyBonuses(partyId) {
      const party = this.parties.get(partyId);
      if (!party) return {};

      const formation = FORMATIONS[party.formation];
      const bonuses = { ...formation.bonuses };

      // Add role synergies
      const roles = party.members.map((m) => m.role);

      // Tank + Healer = +20% survivability
      if (roles.includes("tank") && roles.includes("healer")) {
        bonuses.survivability = (bonuses.survivability || 1.0) * 1.2;
      }

      // DPS + Support = +15% damage
      if (roles.includes("dps") && roles.includes("support")) {
        bonuses.damage = (bonuses.damage || 1.0) * 1.15;
      }

      // Mage + Ranger = +10% magic/physical
      if (roles.includes("mage") && roles.includes("ranger")) {
        bonuses.hybrid = (bonuses.hybrid || 1.0) * 1.1;
      }

      return bonuses;
    }

    /**
     * Get player's party
     * @param {string} playerId - Player ID
     * @returns {Object|null} Party
     */
    getPlayerParty(playerId) {
      const partyId = this.playerParties.get(playerId);
      return partyId ? this.parties.get(partyId) : null;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        parties: Array.from(this.parties.entries()),
        playerParties: Array.from(this.playerParties.entries()),
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.parties.clear();
      if (data.parties) {
        data.parties.forEach(([id, party]) => {
          this.parties.set(id, party);
        });
      }

      this.playerParties.clear();
      if (data.playerParties) {
        data.playerParties.forEach(([playerId, partyId]) => {
          this.playerParties.set(playerId, partyId);
        });
      }

      this._emit("party:loaded");
    }

    // Private methods
    _disbandParty(partyId) {
      const party = this.parties.get(partyId);
      if (!party) return;

      // Remove all members from lookup
      party.members.forEach((m) => {
        this.playerParties.delete(m.playerId);
      });

      this.parties.delete(partyId);

      this._emit("party:disbanded", { partyId });
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[PartySystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  PartySystem.PARTY_ROLES = PARTY_ROLES;
  PartySystem.FORMATIONS = FORMATIONS;
  PartySystem.TEAM_SKILLS = TEAM_SKILLS;

  return PartySystem;
});

