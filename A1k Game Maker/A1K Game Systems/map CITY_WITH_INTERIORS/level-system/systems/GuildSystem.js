/**
 * GuildSystem.js - Complete Guild/Clan Management
 * @version 1.0.0
 * @description Guild creation, management, perks, raids, wars
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.GuildSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // GUILD RANKS & PERMISSIONS
  // ============================

  const GUILD_RANKS = {
    leader: {
      id: "leader",
      name: "Guild Leader",
      icon: "👑",
      permissions: [
        "invite",
        "kick",
        "promote",
        "demote",
        "disband",
        "edit_info",
        "start_war",
        "manage_bank",
      ],
    },
    officer: {
      id: "officer",
      name: "Officer",
      icon: "⚔️",
      permissions: ["invite", "kick", "edit_info"],
    },
    elite: {
      id: "elite",
      name: "Elite Member",
      icon: "⭐",
      permissions: ["invite"],
    },
    member: {
      id: "member",
      name: "Member",
      icon: "🛡️",
      permissions: [],
    },
    recruit: {
      id: "recruit",
      name: "Recruit",
      icon: "🆕",
      permissions: [],
    },
  };

  // ============================
  // GUILD PERKS (20 Total)
  // ============================

  const GUILD_PERKS = {
    xp_boost: {
      id: "xp_boost",
      name: "XP Boost",
      description: "+5% XP for all members",
      maxLevel: 5,
      cost: [1000, 2500, 5000, 10000, 20000],
      effect: { type: "xp_multiplier", values: [1.05, 1.1, 1.15, 1.2, 1.25] },
    },
    gold_boost: {
      id: "gold_boost",
      name: "Gold Boost",
      description: "+5% gold drops",
      maxLevel: 5,
      cost: [1000, 2500, 5000, 10000, 20000],
      effect: {
        type: "gold_multiplier",
        values: [1.05, 1.1, 1.15, 1.2, 1.25],
      },
    },
    member_slots: {
      id: "member_slots",
      name: "Member Capacity",
      description: "Increase max members",
      maxLevel: 10,
      cost: [500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000],
      effect: {
        type: "max_members",
        values: [20, 30, 40, 50, 60, 80, 100, 150, 200, 300],
      },
    },
    bank_size: {
      id: "bank_size",
      name: "Guild Bank",
      description: "Increase bank capacity",
      maxLevel: 5,
      cost: [2000, 5000, 10000, 25000, 50000],
      effect: {
        type: "bank_capacity",
        values: [100, 250, 500, 1000, 2500],
      },
    },
    bonus_stats: {
      id: "bonus_stats",
      name: "Stat Bonus",
      description: "+10 to all stats",
      maxLevel: 10,
      cost: [
        3000, 7500, 15000, 30000, 60000, 120000, 240000, 480000, 960000,
        1920000,
      ],
      effect: {
        type: "stat_bonus",
        values: [10, 20, 30, 40, 50, 75, 100, 150, 200, 300],
      },
    },
    loot_luck: {
      id: "loot_luck",
      name: "Lucky Loot",
      description: "+5% rare drop chance",
      maxLevel: 5,
      cost: [5000, 12500, 25000, 50000, 100000],
      effect: {
        type: "loot_luck",
        values: [1.05, 1.1, 1.15, 1.2, 1.3],
      },
    },
    reduced_respawn: {
      id: "reduced_respawn",
      name: "Quick Revival",
      description: "-10% respawn time",
      maxLevel: 5,
      cost: [2500, 6000, 12000, 24000, 48000],
      effect: {
        type: "respawn_reduction",
        values: [0.9, 0.8, 0.7, 0.6, 0.5],
      },
    },
    craft_speed: {
      id: "craft_speed",
      name: "Fast Crafting",
      description: "-10% craft time",
      maxLevel: 5,
      cost: [3000, 7500, 15000, 30000, 60000],
      effect: {
        type: "craft_speed",
        values: [0.9, 0.8, 0.7, 0.6, 0.5],
      },
    },
    pvp_bonus: {
      id: "pvp_bonus",
      name: "PvP Power",
      description: "+5% damage in PvP",
      maxLevel: 5,
      cost: [10000, 25000, 50000, 100000, 200000],
      effect: {
        type: "pvp_damage",
        values: [1.05, 1.1, 1.15, 1.2, 1.3],
      },
    },
    daily_quests: {
      id: "daily_quests",
      name: "Extra Quests",
      description: "+1 daily quest slot",
      maxLevel: 3,
      cost: [15000, 40000, 100000],
      effect: { type: "quest_slots", values: [4, 5, 6] },
    },
  };

  // ============================
  // GUILD SYSTEM CLASS
  // ============================

  class GuildSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxGuildNameLength: 20,
          createCost: 10000,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Guild ID -> Guild data */
      this.guilds = new Map();

      /** @type {Map<string, string>} Player ID -> Guild ID */
      this.playerGuilds = new Map();

      /** @type {Array} Guild wars */
      this.activeWars = [];

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("guild:ready");

      return this;
    }

    /**
     * Create a new guild
     * @param {string} guildName - Guild name
     * @param {string} leaderId - Leader player ID
     * @param {Object} options - Guild options
     * @returns {Object|null} Guild data
     */
    createGuild(guildName, leaderId, options = {}) {
      if (this.playerGuilds.has(leaderId)) {
        return { error: "Player already in a guild" };
      }

      if (guildName.length > this.options.maxGuildNameLength) {
        return { error: "Guild name too long" };
      }

      const guildId = `guild_${Date.now()}`;

      const guild = {
        id: guildId,
        name: guildName,
        tag: options.tag || guildName.substring(0, 4).toUpperCase(),
        description: options.description || "",
        icon: options.icon || "🏰",
        leaderId,
        members: [
          {
            playerId: leaderId,
            rank: "leader",
            joinedAt: Date.now(),
            contribution: 0,
          },
        ],
        level: 1,
        xp: 0,
        bank: {
          gold: 0,
          materials: {},
        },
        perks: {},
        stats: {
          totalMembers: 1,
          maxMembers: 10,
          totalWars: 0,
          warsWon: 0,
          totalRaids: 0,
          raidsCompleted: 0,
        },
        createdAt: Date.now(),
      };

      this.guilds.set(guildId, guild);
      this.playerGuilds.set(leaderId, guildId);

      this._emit("guild:created", { guild });

      return guild;
    }

    /**
     * Invite player to guild
     * @param {string} guildId - Guild ID
     * @param {string} inviterId - Inviter player ID
     * @param {string} inviteeId - Invitee player ID
     * @returns {boolean} Success
     */
    invitePlayer(guildId, inviterId, inviteeId) {
      const guild = this.guilds.get(guildId);
      if (!guild) return false;

      // Check permissions
      if (!this._hasPermission(guild, inviterId, "invite")) return false;

      // Check if invitee already in guild
      if (this.playerGuilds.has(inviteeId)) return false;

      // Check member limit
      if (guild.members.length >= guild.stats.maxMembers) return false;

      // Add member
      guild.members.push({
        playerId: inviteeId,
        rank: "recruit",
        joinedAt: Date.now(),
        contribution: 0,
      });

      guild.stats.totalMembers++;

      this.playerGuilds.set(inviteeId, guildId);

      this._emit("guild:member_joined", { guildId, playerId: inviteeId });

      return true;
    }

    /**
     * Kick player from guild
     * @param {string} guildId - Guild ID
     * @param {string} kickerId - Kicker player ID
     * @param {string} kickeeId - Kickee player ID
     * @returns {boolean} Success
     */
    kickPlayer(guildId, kickerId, kickeeId) {
      const guild = this.guilds.get(guildId);
      if (!guild) return false;

      if (!this._hasPermission(guild, kickerId, "kick")) return false;

      // Can't kick leader
      if (kickeeId === guild.leaderId) return false;

      // Remove member
      guild.members = guild.members.filter((m) => m.playerId !== kickeeId);
      guild.stats.totalMembers--;

      this.playerGuilds.delete(kickeeId);

      this._emit("guild:member_kicked", { guildId, playerId: kickeeId });

      return true;
    }

    /**
     * Promote/demote player
     * @param {string} guildId - Guild ID
     * @param {string} promoterId - Promoter player ID
     * @param {string} targetId - Target player ID
     * @param {string} newRank - New rank
     * @returns {boolean} Success
     */
    changeRank(guildId, promoterId, targetId, newRank) {
      const guild = this.guilds.get(guildId);
      if (!guild) return false;

      if (!this._hasPermission(guild, promoterId, "promote")) return false;

      const member = guild.members.find((m) => m.playerId === targetId);
      if (!member) return false;

      member.rank = newRank;

      this._emit("guild:rank_changed", { guildId, playerId: targetId, rank: newRank });

      return true;
    }

    /**
     * Contribute to guild
     * @param {string} playerId - Player ID
     * @param {Object} contribution - {gold, materials}
     * @returns {boolean} Success
     */
    contribute(playerId, contribution = {}) {
      const guildId = this.playerGuilds.get(playerId);
      if (!guildId) return false;

      const guild = this.guilds.get(guildId);
      if (!guild) return false;

      // Add to bank
      if (contribution.gold) {
        guild.bank.gold += contribution.gold;
      }

      if (contribution.materials) {
        for (const [matId, amount] of Object.entries(contribution.materials)) {
          guild.bank.materials[matId] =
            (guild.bank.materials[matId] || 0) + amount;
        }
      }

      // Track contribution
      const member = guild.members.find((m) => m.playerId === playerId);
      if (member) {
        member.contribution += contribution.gold || 0;
      }

      this._emit("guild:contribution", { guildId, playerId, contribution });

      return true;
    }

    /**
     * Upgrade guild perk
     * @param {string} guildId - Guild ID
     * @param {string} perkId - Perk ID
     * @returns {boolean} Success
     */
    upgradePerk(guildId, perkId) {
      const guild = this.guilds.get(guildId);
      const perk = GUILD_PERKS[perkId];

      if (!guild || !perk) return false;

      const currentLevel = guild.perks[perkId] || 0;
      if (currentLevel >= perk.maxLevel) return false;

      const cost = perk.cost[currentLevel];
      if (guild.bank.gold < cost) return false;

      // Consume gold
      guild.bank.gold -= cost;

      // Upgrade perk
      guild.perks[perkId] = currentLevel + 1;

      this._emit("guild:perk_upgraded", { guildId, perkId, level: currentLevel + 1 });

      return true;
    }

    /**
     * Get guild by player ID
     * @param {string} playerId - Player ID
     * @returns {Object|null} Guild
     */
    getPlayerGuild(playerId) {
      const guildId = this.playerGuilds.get(playerId);
      return guildId ? this.guilds.get(guildId) : null;
    }

    /**
     * Get guild perks multiplier
     * @param {string} guildId - Guild ID
     * @returns {Object} Multipliers
     */
    getGuildBonuses(guildId) {
      const guild = this.guilds.get(guildId);
      if (!guild) return {};

      const bonuses = {
        xp: 1.0,
        gold: 1.0,
        loot: 1.0,
        stats: 0,
        craftSpeed: 1.0,
        pvpDamage: 1.0,
      };

      for (const [perkId, level] of Object.entries(guild.perks)) {
        const perk = GUILD_PERKS[perkId];
        if (!perk) continue;

        const effect = perk.effect;
        const value = effect.values[level - 1];

        switch (effect.type) {
          case "xp_multiplier":
            bonuses.xp *= value;
            break;
          case "gold_multiplier":
            bonuses.gold *= value;
            break;
          case "loot_luck":
            bonuses.loot *= value;
            break;
          case "stat_bonus":
            bonuses.stats += value;
            break;
          case "craft_speed":
            bonuses.craftSpeed *= value;
            break;
          case "pvp_damage":
            bonuses.pvpDamage *= value;
            break;
        }
      }

      return bonuses;
    }

    /**
     * Start guild war
     * @param {string} guildId1 - Attacker guild
     * @param {string} guildId2 - Defender guild
     * @returns {Object|null} War data
     */
    declareWar(guildId1, guildId2) {
      const guild1 = this.guilds.get(guildId1);
      const guild2 = this.guilds.get(guildId2);

      if (!guild1 || !guild2) return null;

      const warId = `war_${Date.now()}`;

      const war = {
        id: warId,
        attacker: guildId1,
        defender: guildId2,
        startTime: Date.now(),
        endTime: Date.now() + 86400000, // 24 hours
        score: {
          [guildId1]: 0,
          [guildId2]: 0,
        },
        kills: {
          [guildId1]: 0,
          [guildId2]: 0,
        },
        status: "active",
      };

      this.activeWars.push(war);

      guild1.stats.totalWars++;
      guild2.stats.totalWars++;

      this._emit("guild:war_declared", { war });

      return war;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        guilds: Array.from(this.guilds.entries()),
        playerGuilds: Array.from(this.playerGuilds.entries()),
        activeWars: this.activeWars,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.guilds.clear();
      if (data.guilds) {
        data.guilds.forEach(([id, guild]) => {
          this.guilds.set(id, guild);
        });
      }

      this.playerGuilds.clear();
      if (data.playerGuilds) {
        data.playerGuilds.forEach(([playerId, guildId]) => {
          this.playerGuilds.set(playerId, guildId);
        });
      }

      this.activeWars = data.activeWars || [];

      this._emit("guild:loaded", { guilds: this.guilds.size });
    }

    // Private methods
    _hasPermission(guild, playerId, permission) {
      const member = guild.members.find((m) => m.playerId === playerId);
      if (!member) return false;

      const rank = GUILD_RANKS[member.rank];
      return rank && rank.permissions.includes(permission);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[GuildSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  GuildSystem.GUILD_RANKS = GUILD_RANKS;
  GuildSystem.GUILD_PERKS = GUILD_PERKS;

  return GuildSystem;
});

