/**
 * Supernatural System - Standalone Module
 * @description Manages supernatural abilities, spirits, and elemental powers
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SupernaturalSystem = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SupernaturalSystem {
    constructor(options = {}) {
      this.options = Object.assign({
        storageKey: 'supernatural_data',
        autoSave: true,
        eventBus: null
      }, options);

      // Abilities
      this.abilities = [];
      this.activeBuffs = [];
      this.cooldowns = {};
      this.mastery = {};

      // Spirits
      this.spirits = [];
      this.equippedSpirit = null;

      // Bindings (keybinds for abilities)
      this.bindings = {};

      this.initialized = false;
    }

    async initialize(data = {}) {
      if (this.initialized) return;

      if (data.abilities) this.abilities = data.abilities;
      if (data.spirits) this.spirits = data.spirits;

      this.load();
      this.initialized = true;
      this.emit('supernatural:ready');
      
      console.log('[SupernaturalSystem] Initialized');
    }

    // ===== ABILITIES =====

    getAbilities() {
      return this.abilities.map(ability => ({
        ...ability,
        mastery: this.getMastery(ability.id),
        cooldown: this.getEffectiveCooldown(ability),
        isReady: this.isAbilityReady(ability.id)
      }));
    }

    getAbility(id) {
      return this.abilities.find(a => a.id === id) || null;
    }

    triggerAbility(id) {
      const ability = this.getAbility(id);
      if (!ability) return false;

      if (ability.type === 'passive') return false; // Passives are always active

      if (!this.isAbilityReady(id)) return false;

      const cooldown = this.getEffectiveCooldown(ability);
      this.cooldowns[id] = Date.now() + cooldown;

      // Apply buff
      const buff = {
        id,
        abilityName: ability.name,
        bonuses: ability.bonuses || {},
        expires: Date.now() + (ability.duration || 3000)
      };

      this.activeBuffs.push(buff);
      this.applyBonuses();

      // Visual effects
      if (ability.visualEffect) {
        this.triggerVisualEffect(ability);
      }

      // Auto-remove buff after duration
      setTimeout(() => {
        this.activeBuffs = this.activeBuffs.filter(b => b !== buff);
        this.applyBonuses();
      }, ability.duration || 3000);

      this.emit('ability:triggered', { ability, buff });
      return true;
    }

    isAbilityReady(id) {
      if (!this.cooldowns[id]) return true;
      return Date.now() >= this.cooldowns[id];
    }

    getRemainingCooldown(id) {
      if (!this.cooldowns[id]) return 0;
      const remaining = this.cooldowns[id] - Date.now();
      return Math.max(0, remaining);
    }

    getEffectiveCooldown(ability) {
      const base = ability.cooldown || 8000;
      const rank = this.getMastery(ability.id);
      const masteryReduction = 1 - Math.min(0.4, rank * 0.06); // -6% per rank, max -40%
      return Math.max(base * 0.6, Math.round(base * masteryReduction));
    }

    // ===== MASTERY =====

    getMastery(abilityId) {
      return Number(this.mastery[abilityId] || 0);
    }

    canRankUp(abilityId, currencyAmount) {
      const rank = this.getMastery(abilityId);
      const cost = 5 * (rank + 1);
      return currencyAmount >= cost;
    }

    rankUp(abilityId) {
      const rank = this.getMastery(abilityId);
      this.mastery[abilityId] = rank + 1;
      this.save();
      this.emit('ability:ranked_up', { abilityId, newRank: this.mastery[abilityId] });
      return true;
    }

    // ===== BONUSES =====

    getTotalBonuses() {
      const total = {};

      // Passive abilities
      this.abilities
        .filter(a => a.type === 'passive')
        .forEach(ability => {
          for (const [key, value] of Object.entries(ability.bonuses || {})) {
            total[key] = (total[key] || 0) + value;
          }
        });

      // Active buffs
      const now = Date.now();
      this.activeBuffs = this.activeBuffs.filter(b => now < b.expires);
      
      this.activeBuffs.forEach(buff => {
        for (const [key, value] of Object.entries(buff.bonuses || {})) {
          total[key] = (total[key] || 0) + value;
        }
      });

      // Spirit bonuses
      if (this.equippedSpirit) {
        const spirit = this.spirits.find(s => s.id === this.equippedSpirit);
        if (spirit && spirit.bonuses) {
          for (const [key, value] of Object.entries(spirit.bonuses)) {
            total[key] = (total[key] || 0) + value;
          }
        }
      }

      return total;
    }

    applyBonuses() {
      const bonuses = this.getTotalBonuses();
      this.emit('bonuses:updated', bonuses);
    }

    // ===== SPIRITS =====

    getSpirits() {
      return this.spirits;
    }

    getEquippedSpirit() {
      return this.spirits.find(s => s.id === this.equippedSpirit) || null;
    }

    equipSpirit(spiritId) {
      const spirit = this.spirits.find(s => s.id === spiritId);
      if (!spirit) return false;

      this.equippedSpirit = spiritId;
      this.applyBonuses();
      this.save();
      this.emit('spirit:equipped', spirit);
      return true;
    }

    unequipSpirit() {
      this.equippedSpirit = null;
      this.applyBonuses();
      this.save();
      this.emit('spirit:unequipped');
    }

    // ===== BINDINGS =====

    bindAbility(key, abilityId) {
      this.bindings[key] = abilityId;
      this.save();
      this.emit('ability:bound', { key, abilityId });
    }

    unbindAbility(key) {
      delete this.bindings[key];
      this.save();
      this.emit('ability:unbound', { key });
    }

    getBoundAbility(key) {
      return this.bindings[key] || null;
    }

    // ===== VISUAL EFFECTS =====

    triggerVisualEffect(ability) {
      const effects = {
        'divine_barrier': () => this.createBarrierEffect(),
        'dash_nova': () => this.createDashNovaEffect(),
        'angelic_might': () => this.createBeamEffect(),
        'radiant_burst': () => this.createBurstEffect(),
        'flame_dash': () => this.createFlameTrailEffect()
      };

      const effectFn = effects[ability.id];
      if (effectFn) {
        effectFn();
      }

      this.emit('visual_effect:triggered', ability);
    }

    createBarrierEffect() {
      // Placeholder - game should override this
      console.log('[Supernatural] Divine Barrier effect triggered');
    }

    createDashNovaEffect() {
      console.log('[Supernatural] Dash Nova effect triggered');
    }

    createBeamEffect() {
      console.log('[Supernatural] Beam effect triggered');
    }

    createBurstEffect() {
      console.log('[Supernatural] Burst effect triggered');
    }

    createFlameTrailEffect() {
      console.log('[Supernatural] Flame trail effect triggered');
    }

    // ===== DATA MANAGEMENT =====

    save() {
      if (!this.options.autoSave) return;

      const data = {
        mastery: this.mastery,
        equippedSpirit: this.equippedSpirit,
        bindings: this.bindings,
        lastSaved: Date.now()
      };

      try {
        localStorage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[SupernaturalSystem] Save error:', e);
      }
    }

    load() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);
        
        if (data.mastery) this.mastery = data.mastery;
        if (data.equippedSpirit) this.equippedSpirit = data.equippedSpirit;
        if (data.bindings) this.bindings = data.bindings;

        this.emit('supernatural:loaded');
      } catch (e) {
        console.error('[SupernaturalSystem] Load error:', e);
      }
    }

    exportData() {
      return {
        mastery: this.mastery,
        equippedSpirit: this.equippedSpirit,
        bindings: this.bindings,
        activeBuffs: this.activeBuffs.map(buff => ({
          ...buff,
          expiresIn: buff.expires - Date.now()
        }))
      };
    }

    importData(data) {
      if (data.mastery) this.mastery = data.mastery;
      if (data.equippedSpirit) this.equippedSpirit = data.equippedSpirit;
      if (data.bindings) this.bindings = data.bindings;

      this.save();
      this.emit('supernatural:imported');
    }

    emit(event, data) {
      if (this.options.eventBus && typeof this.options.eventBus.emit === 'function') {
        this.options.eventBus.emit(event, data);
      }

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(event, { detail: data }));
      }
    }

    getStats() {
      return {
        totalAbilities: this.abilities.length,
        activeBuffs: this.activeBuffs.length,
        equippedSpirit: this.equippedSpirit,
        totalBonuses: this.getTotalBonuses(),
        masteryLevels: Object.keys(this.mastery).length
      };
    }
  }

  return SupernaturalSystem;
}));

