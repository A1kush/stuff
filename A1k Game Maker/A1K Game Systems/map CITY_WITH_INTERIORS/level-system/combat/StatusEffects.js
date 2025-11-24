/**
 * StatusEffects.js - Status Effect & Buff/Debuff System
 * @version 1.0.0
 * @description 20 essential status effects with stacks, ticks, and management
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StatusEffects = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // STATUS EFFECT DEFINITIONS
  // ============================

  const STATUS_EFFECTS = {
    // BUFFS (Positive Effects)
    haste: {
      name: "Haste",
      type: "buff",
      icon: "💨",
      color: "#4ecdc4",
      description: "+30% movement speed",
      stats: { spd: 0.3 },
      duration: 10000,
    },
    strength: {
      name: "Strength",
      type: "buff",
      icon: "💪",
      color: "#ff6b6b",
      description: "+25% attack damage",
      stats: { atk: 0.25 },
      duration: 15000,
    },
    shield: {
      name: "Shield",
      type: "buff",
      icon: "🛡️",
      color: "#4c6ef5",
      description: "+50% defense",
      stats: { def: 0.5 },
      duration: 12000,
    },
    regen: {
      name: "Regeneration",
      type: "buff",
      icon: "💚",
      color: "#4caf50",
      description: "Restore 5% HP per second",
      tickDamage: -0.05, // Negative = healing
      tickRate: 1000,
      duration: 10000,
    },
    berserk: {
      name: "Berserk",
      type: "buff",
      icon: "😡",
      color: "#ff5722",
      description: "+50% ATK, -20% DEF",
      stats: { atk: 0.5, def: -0.2 },
      duration: 8000,
    },
    focus: {
      name: "Focus",
      type: "buff",
      icon: "🎯",
      color: "#ffd93d",
      description: "+20% critical chance",
      stats: { crt: 0.2 },
      duration: 10000,
    },
    stealth: {
      name: "Stealth",
      type: "buff",
      icon: "👻",
      color: "#9b59b6",
      description: "+50% evasion",
      stats: { eva: 0.5 },
      duration: 6000,
    },
    invincible: {
      name: "Invincible",
      type: "buff",
      icon: "✨",
      color: "#ffd700",
      description: "Immune to all damage",
      special: "invincible",
      duration: 3000,
    },
    double_xp: {
      name: "Double XP",
      type: "buff",
      icon: "📈",
      color: "#4c6ef5",
      description: "+100% XP gained",
      stats: { xpMult: 1.0 },
      duration: 30000,
    },
    lucky: {
      name: "Lucky",
      type: "buff",
      icon: "🍀",
      color: "#4caf50",
      description: "+50% luck",
      stats: { luk: 0.5 },
      duration: 20000,
    },
    rage: {
      name: "Rage",
      type: "buff",
      icon: "💢",
      color: "#ff1744",
      description: "+40% ATK, +30% SPD, +20% Crit",
      stats: { atk: 0.4, spd: 0.3, crt: 0.2 },
      duration: 12000,
    },
    loot_finder: {
      name: "Loot Finder",
      type: "buff",
      icon: "💰",
      color: "#ffd700",
      description: "+100% drop rate, +50% gold",
      stats: { dropMult: 1.0, goldMult: 0.5 },
      duration: 30000,
    },
    treasure_hunter: {
      name: "Treasure Hunter",
      type: "buff",
      icon: "🏴‍☠️",
      color: "#ffa726",
      description: "+200% rare item chance",
      stats: { rareDropMult: 2.0 },
      duration: 20000,
    },
    vampiric: {
      name: "Vampiric",
      type: "buff",
      icon: "🧛",
      color: "#d32f2f",
      description: "+30% lifesteal",
      stats: { lifesteal: 0.3 },
      duration: 15000,
    },
    fortified: {
      name: "Fortified",
      type: "buff",
      icon: "🏰",
      color: "#607d8b",
      description: "+100% DEF, cannot be knocked back",
      stats: { def: 1.0 },
      special: "antiknockback",
      duration: 10000,
    },
    barrier: {
      name: "Barrier",
      type: "buff",
      icon: "🔰",
      color: "#9c27b0",
      description: "Absorb next 3 hits",
      special: "barrier",
      stacks: 3,
      duration: 20000,
    },

    // DEBUFFS (Negative Effects)
    slow: {
      name: "Slow",
      type: "debuff",
      icon: "🐌",
      color: "#888888",
      description: "-30% movement speed",
      stats: { spd: -0.3 },
      duration: 8000,
    },
    weak: {
      name: "Weak",
      type: "debuff",
      icon: "⚠️",
      color: "#ff9800",
      description: "-25% attack damage",
      stats: { atk: -0.25 },
      duration: 10000,
    },
    poison: {
      name: "Poison",
      type: "debuff",
      icon: "☠️",
      color: "#9c27b0",
      description: "Lose 3% HP per second",
      tickDamage: 0.03,
      tickRate: 1000,
      duration: 10000,
    },
    burn: {
      name: "Burn",
      type: "debuff",
      icon: "🔥",
      color: "#ff6b35",
      description: "Lose 5% HP per second",
      tickDamage: 0.05,
      tickRate: 1000,
      duration: 6000,
    },
    freeze: {
      name: "Freeze",
      type: "debuff",
      icon: "❄️",
      color: "#4ecdc4",
      description: "Stunned and immobilized",
      special: "stun",
      duration: 2000,
    },
    stun: {
      name: "Stun",
      type: "debuff",
      icon: "💫",
      color: "#ffd93d",
      description: "Cannot move or attack",
      special: "stun",
      duration: 1500,
    },
    bleed: {
      name: "Bleed",
      type: "debuff",
      icon: "🩸",
      color: "#d32f2f",
      description: "Lose 2% HP per second",
      tickDamage: 0.02,
      tickRate: 1000,
      duration: 15000,
    },
    curse: {
      name: "Curse",
      type: "debuff",
      icon: "🌑",
      color: "#9b59b6",
      description: "-50% healing received",
      stats: { healingMult: -0.5 },
      duration: 12000,
    },
    silenced: {
      name: "Silenced",
      type: "debuff",
      icon: "🔇",
      color: "#607d8b",
      description: "Cannot use skills",
      special: "silence",
      duration: 4000,
    },
    disarmed: {
      name: "Disarmed",
      type: "debuff",
      icon: "❌",
      color: "#ff5722",
      description: "Cannot use basic attacks",
      special: "disarm",
      duration: 3000,
    },
    fear: {
      name: "Fear",
      type: "debuff",
      icon: "😱",
      color: "#795548",
      description: "Flee randomly, cannot attack",
      special: "fear",
      stats: { spd: -0.5 },
      duration: 4000,
    },
    confusion: {
      name: "Confusion",
      type: "debuff",
      icon: "😵",
      color: "#9e9e9e",
      description: "Attacks random targets",
      special: "confusion",
      duration: 5000,
    },
    shock: {
      name: "Shock",
      type: "debuff",
      icon: "⚡",
      color: "#ffeb3b",
      description: "Chain lightning, -50% RES",
      stats: { res: -0.5 },
      tickDamage: 0.01,
      tickRate: 500,
      duration: 3000,
    },
    frostbite: {
      name: "Frostbite",
      type: "debuff",
      icon: "🧊",
      color: "#00bcd4",
      description: "Slowed, -30% ATK, loses 1% HP/s",
      stats: { spd: -0.5, atk: -0.3 },
      tickDamage: 0.01,
      tickRate: 1000,
      duration: 8000,
    },
    armor_break: {
      name: "Armor Break",
      type: "debuff",
      icon: "🔨",
      color: "#ff6f00",
      description: "-70% DEF",
      stats: { def: -0.7 },
      duration: 6000,
    },
    vulnerability: {
      name: "Vulnerability",
      type: "debuff",
      icon: "💔",
      color: "#e91e63",
      description: "Take +50% damage from all sources",
      stats: { damageTakenMult: 0.5 },
      duration: 8000,
    },
    exhausted: {
      name: "Exhausted",
      type: "debuff",
      icon: "😮‍💨",
      color: "#9e9e9e",
      description: "-40% SPD, -20% ATK, +50% skill cooldowns",
      stats: { spd: -0.4, atk: -0.2, cdr: -0.5 },
      duration: 12000,
    },
  };

  const EFFECT_KEYS = Object.keys(STATUS_EFFECTS);

  // ============================
  // STATUS EFFECTS CLASS
  // ============================

  class StatusEffects {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxStacksDefault: 5,
          tickInterval: 100, // Update every 100ms
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Array>} Entity ID -> Active Effects */
      this.activeEffects = new Map();

      /** @type {number} */
      this.lastTickTime = Date.now();

      // Event bus integration
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      this.initialized = false;
    }

    /**
     * Initialize the status effects system
     */
    init() {
      if (this.initialized) {
        console.warn("[StatusEffects] Already initialized");
        return this;
      }

      this.initialized = true;
      this.lastTickTime = Date.now();

      this._emit("status:ready");

      if (this.options.debug) {
        console.log("[StatusEffects] Initialized");
      }

      return this;
    }

    /**
     * Apply a status effect to an entity
     * @param {string} entityId - Entity ID
     * @param {string} effectKey - Effect key
     * @param {Object} options - Options {duration, intensity, stacks, source}
     * @returns {Object|null} Applied effect
     */
    applyEffect(entityId, effectKey, options = {}) {
      if (!this.initialized) {
        console.error("[StatusEffects] Not initialized");
        return null;
      }

      const effectDef = STATUS_EFFECTS[effectKey];
      if (!effectDef) {
        console.warn(`[StatusEffects] Unknown effect: ${effectKey}`);
        return null;
      }

      // Get or create effects array for entity
      if (!this.activeEffects.has(entityId)) {
        this.activeEffects.set(entityId, []);
      }

      const effects = this.activeEffects.get(entityId);

      // Check if effect already exists
      const existing = effects.find((e) => e.key === effectKey);

      if (existing) {
        // Refresh duration or stack
        if (options.stack || effectDef.stackable) {
          existing.stacks = Math.min(
            existing.stacks + (options.stacks || 1),
            effectDef.maxStacks || this.options.maxStacksDefault
          );
        }
        existing.duration = options.duration || effectDef.duration || 10000;
        existing.appliedAt = Date.now();
        existing.expiresAt = existing.appliedAt + existing.duration;

        this._emit("status:refreshed", { entityId, effect: existing });

        return existing;
      }

      // Create new effect
      const effect = {
        key: effectKey,
        name: effectDef.name,
        type: effectDef.type,
        icon: effectDef.icon,
        color: effectDef.color,
        description: effectDef.description,
        stats: { ...effectDef.stats },
        tickDamage: effectDef.tickDamage,
        tickRate: effectDef.tickRate,
        special: effectDef.special,
        intensity: options.intensity || 1.0,
        stacks: options.stacks || 1,
        duration: options.duration || effectDef.duration || 10000,
        appliedAt: Date.now(),
        expiresAt: 0,
        source: options.source || null,
        lastTickTime: Date.now(),
      };

      effect.expiresAt = effect.appliedAt + effect.duration;

      effects.push(effect);

      this._emit("status:applied", { entityId, effect });

      if (this.options.debug) {
        console.log(
          `[StatusEffects] Applied ${effectKey} to ${entityId}`,
          effect
        );
      }

      return effect;
    }

    /**
     * Remove a status effect from an entity
     * @param {string} entityId - Entity ID
     * @param {string} effectKey - Effect key
     * @returns {boolean} Success
     */
    removeEffect(entityId, effectKey) {
      const effects = this.activeEffects.get(entityId);
      if (!effects) return false;

      const index = effects.findIndex((e) => e.key === effectKey);
      if (index === -1) return false;

      const removed = effects.splice(index, 1)[0];

      this._emit("status:removed", { entityId, effect: removed });

      if (this.options.debug) {
        console.log(`[StatusEffects] Removed ${effectKey} from ${entityId}`);
      }

      return true;
    }

    /**
     * Remove all status effects from an entity
     * @param {string} entityId - Entity ID
     * @param {string} [type] - Optional type filter ('buff' or 'debuff')
     * @returns {number} Number removed
     */
    clearEffects(entityId, type = null) {
      const effects = this.activeEffects.get(entityId);
      if (!effects) return 0;

      let removed = 0;

      if (type) {
        // Remove only specific type
        for (let i = effects.length - 1; i >= 0; i--) {
          if (effects[i].type === type) {
            effects.splice(i, 1);
            removed++;
          }
        }
      } else {
        // Remove all
        removed = effects.length;
        effects.length = 0;
      }

      this._emit("status:cleared", { entityId, type, count: removed });

      return removed;
    }

    /**
     * Get all active effects for an entity
     * @param {string} entityId - Entity ID
     * @param {string} [type] - Optional type filter
     * @returns {Array}
     */
    getEffects(entityId, type = null) {
      const effects = this.activeEffects.get(entityId) || [];

      if (type) {
        return effects.filter((e) => e.type === type);
      }

      return [...effects];
    }

    /**
     * Check if entity has a specific effect
     * @param {string} entityId - Entity ID
     * @param {string} effectKey - Effect key
     * @returns {boolean}
     */
    hasEffect(entityId, effectKey) {
      const effects = this.activeEffects.get(entityId) || [];
      return effects.some((e) => e.key === effectKey);
    }

    /**
     * Check if entity is stunned
     * @param {string} entityId - Entity ID
     * @returns {boolean}
     */
    isStunned(entityId) {
      const effects = this.activeEffects.get(entityId) || [];
      return effects.some((e) => e.special === "stun");
    }

    /**
     * Check if entity is silenced
     * @param {string} entityId - Entity ID
     * @returns {boolean}
     */
    isSilenced(entityId) {
      const effects = this.activeEffects.get(entityId) || [];
      return effects.some((e) => e.special === "silence");
    }

    /**
     * Check if entity is invincible
     * @param {string} entityId - Entity ID
     * @returns {boolean}
     */
    isInvincible(entityId) {
      const effects = this.activeEffects.get(entityId) || [];
      return effects.some((e) => e.special === "invincible");
    }

    /**
     * Calculate total stat modifiers from effects
     * @param {string} entityId - Entity ID
     * @returns {Object} Stat modifiers
     */
    calculateStatModifiers(entityId) {
      const effects = this.activeEffects.get(entityId) || [];
      const modifiers = {};

      effects.forEach((effect) => {
        if (!effect.stats) return;

        Object.keys(effect.stats).forEach((stat) => {
          const value = effect.stats[stat] * effect.intensity * effect.stacks;
          modifiers[stat] = (modifiers[stat] || 0) + value;
        });
      });

      return modifiers;
    }

    /**
     * Update status effects (call every frame)
     * @param {number} deltaTime - Time since last update (ms)
     */
    update(deltaTime) {
      if (!this.initialized) return;

      const now = Date.now();
      const actualDelta = now - this.lastTickTime;

      // Process ticks and expirations
      for (const [entityId, effects] of this.activeEffects) {
        // Process effects in reverse to safely remove
        for (let i = effects.length - 1; i >= 0; i--) {
          const effect = effects[i];

          // Check expiration
          if (now >= effect.expiresAt) {
            effects.splice(i, 1);
            this._emit("status:expired", { entityId, effect });
            continue;
          }

          // Process tick damage/healing
          if (effect.tickDamage && effect.tickRate) {
            if (now - effect.lastTickTime >= effect.tickRate) {
              effect.lastTickTime = now;

              this._emit("status:tick", {
                entityId,
                effect,
                tickDamage:
                  effect.tickDamage * effect.intensity * effect.stacks,
              });
            }
          }
        }
      }

      this.lastTickTime = now;
    }

    /**
     * Get effect definition
     * @param {string} effectKey - Effect key
     * @returns {Object|null}
     */
    getEffectDefinition(effectKey) {
      return STATUS_EFFECTS[effectKey] || null;
    }

    /**
     * Get all effect definitions
     * @returns {Array}
     */
    getAllEffectDefinitions() {
      return EFFECT_KEYS.map((key) => ({
        key,
        ...STATUS_EFFECTS[key],
      }));
    }

    /**
     * Serialize active effects for saving
     * @returns {Object}
     */
    serialize() {
      const data = {};

      for (const [entityId, effects] of this.activeEffects) {
        data[entityId] = effects.map((e) => ({
          key: e.key,
          intensity: e.intensity,
          stacks: e.stacks,
          duration: e.duration,
          appliedAt: e.appliedAt,
          expiresAt: e.expiresAt,
          source: e.source,
        }));
      }

      return data;
    }

    /**
     * Deserialize and load active effects
     * @param {Object} data - Serialized data
     */
    deserialize(data) {
      if (!data || typeof data !== "object") {
        console.error("[StatusEffects] Invalid deserialization data");
        return;
      }

      this.activeEffects.clear();

      const now = Date.now();

      Object.keys(data).forEach((entityId) => {
        const effects = data[entityId];
        if (!Array.isArray(effects)) return;

        effects.forEach((effectData) => {
          // Skip expired effects
          if (effectData.expiresAt < now) return;

          // Reapply effect
          this.applyEffect(entityId, effectData.key, {
            intensity: effectData.intensity,
            stacks: effectData.stacks,
            duration: effectData.expiresAt - now,
            source: effectData.source,
          });
        });
      });

      this._emit("status:loaded", { entityCount: this.activeEffects.size });
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Emit event through event bus
     * @private
     */
    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[StatusEffects] Event emit failed:", err);
        }
      }
    }
  }

  // Expose status effect definitions
  StatusEffects.STATUS_EFFECTS = STATUS_EFFECTS;
  StatusEffects.EFFECT_KEYS = EFFECT_KEYS;

  return StatusEffects;
});
