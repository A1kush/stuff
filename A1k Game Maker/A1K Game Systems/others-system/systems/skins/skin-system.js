/**
 * Skin System - Standalone Module
 * @description Character skin management with unlocking, equipping, and previewing
 * @version 1.0.0
 * @license MIT
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SkinSystem = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  class SkinSystem {
    constructor(options = {}) {
      this.options = Object.assign({
        storageKey: 'skin_system_data',
        autoSave: true,
        eventBus: null
      }, options);

      // Skin data
      this.characters = {};
      this.skins = {};
      this.equippedSkins = {};
      this.unlockedSkins = {};

      this.initialized = false;
    }

    async initialize(data = {}) {
      if (this.initialized) return;

      if (data.characters) this.characters = data.characters;
      if (data.skins) this.skins = data.skins;

      // Load saved data
      this.load();

      // Initialize defaults for each character
      Object.keys(this.skins).forEach(characterId => {
        if (!this.equippedSkins[characterId]) {
          this.equippedSkins[characterId] = 'default';
        }
        if (!this.unlockedSkins[characterId]) {
          this.unlockedSkins[characterId] = ['default'];
        }
      });

      this.initialized = true;
      this.emit('skin:initialized');
      
      console.log('[SkinSystem] Initialized');
    }

    // ===== CHARACTER MANAGEMENT =====

    getCharacters() {
      return Object.keys(this.skins).map(id => ({
        id,
        name: this.characters[id]?.name || id,
        ...this.characters[id]
      }));
    }

    getCharacter(characterId) {
      return this.characters[characterId] || null;
    }

    // ===== SKIN MANAGEMENT =====

    getSkins(characterId) {
      return this.skins[characterId] || {};
    }

    getSkin(characterId, skinId) {
      return this.skins[characterId]?.[skinId] || null;
    }

    getAvailableSkins(characterId) {
      const allSkins = this.getSkins(characterId);
      const unlocked = this.unlockedSkins[characterId] || [];
      const equipped = this.equippedSkins[characterId];

      return Object.entries(allSkins).map(([id, skin]) => ({
        id,
        characterId,
        ...skin,
        unlocked: unlocked.includes(id),
        equipped: equipped === id
      }));
    }

    // ===== EQUIPPING =====

    getEquippedSkin(characterId) {
      const skinId = this.equippedSkins[characterId];
      if (!skinId) return null;

      const skin = this.getSkin(characterId, skinId);
      return skin ? { id: skinId, characterId, ...skin } : null;
    }

    equipSkin(characterId, skinId) {
      const skin = this.getSkin(characterId, skinId);
      if (!skin) {
        console.warn(`[SkinSystem] Skin ${skinId} not found for ${characterId}`);
        return false;
      }

      if (!this.isSkinUnlocked(characterId, skinId)) {
        console.warn(`[SkinSystem] Skin ${skinId} is locked for ${characterId}`);
        return false;
      }

      this.equippedSkins[characterId] = skinId;
      this.save();
      this.emit('skin:equipped', { characterId, skinId, skin });
      
      return true;
    }

    // ===== UNLOCKING =====

    isSkinUnlocked(characterId, skinId) {
      return this.unlockedSkins[characterId]?.includes(skinId) || false;
    }

    unlockSkin(characterId, skinId) {
      const skin = this.getSkin(characterId, skinId);
      if (!skin) return false;

      if (!this.unlockedSkins[characterId]) {
        this.unlockedSkins[characterId] = [];
      }

      if (this.unlockedSkins[characterId].includes(skinId)) {
        return false; // Already unlocked
      }

      this.unlockedSkins[characterId].push(skinId);
      this.save();
      this.emit('skin:unlocked', { characterId, skinId, skin });
      
      return true;
    }

    unlockAllSkins() {
      Object.keys(this.skins).forEach(characterId => {
        Object.keys(this.skins[characterId]).forEach(skinId => {
          this.unlockSkin(characterId, skinId);
        });
      });
      this.emit('skins:all_unlocked');
    }

    lockSkin(characterId, skinId) {
      if (!this.unlockedSkins[characterId]) return false;

      const index = this.unlockedSkins[characterId].indexOf(skinId);
      if (index === -1) return false;

      // Don't lock default skin
      if (skinId === 'default') return false;

      this.unlockedSkins[characterId].splice(index, 1);

      // If this was equipped, revert to default
      if (this.equippedSkins[characterId] === skinId) {
        this.equippedSkins[characterId] = 'default';
      }

      this.save();
      this.emit('skin:locked', { characterId, skinId });
      
      return true;
    }

    // ===== PREVIEW =====

    renderSkinPreview(characterId, skinId, canvas, width = 128, height = 128) {
      const skin = this.getSkin(characterId, skinId);
      if (!skin) return false;

      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      ctx.clearRect(0, 0, width, height);

      // If there's a sprite image, try to render it
      if (skin.sprite && skin.spriteImage) {
        const img = new Image();
        img.onload = () => {
          const scale = skin.scale || 1;
          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const x = (width - scaledWidth) / 2;
          const y = (height - scaledHeight) / 2;
          
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        };
        img.src = skin.spriteImage;
      } else {
        // Procedural preview
        this.renderProceduralPreview(ctx, characterId, skinId, width, height);
      }

      return true;
    }

    renderProceduralPreview(ctx, characterId, skinId, width, height) {
      const skin = this.getSkin(characterId, skinId);
      const scale = skin?.scale || 1;

      // Character colors
      const colors = {
        A1: { primary: '#FF6B9D', secondary: '#C44569' },
        Unique: { primary: '#4ECDC4', secondary: '#45B7D1' },
        Missy: { primary: '#B4A7D6', secondary: '#9B59B6' }
      };

      const color = colors[characterId] || { primary: '#ffd56a', secondary: '#000000' };

      const scaledWidth = width * scale;
      const scaledHeight = height * scale;
      const offsetX = (width - scaledWidth) / 2;
      const offsetY = (height - scaledHeight) / 2;

      // Simple character shape
      ctx.fillStyle = color.primary;
      ctx.fillRect(
        offsetX + scaledWidth * 0.2,
        offsetY + scaledHeight * 0.2,
        scaledWidth * 0.6,
        scaledHeight * 0.6
      );

      ctx.fillStyle = color.secondary;
      ctx.fillRect(
        offsetX + scaledWidth * 0.3,
        offsetY + scaledHeight * 0.3,
        scaledWidth * 0.4,
        scaledHeight * 0.4
      );
    }

    // ===== DATA MANAGEMENT =====

    save() {
      if (!this.options.autoSave) return;

      const data = {
        equippedSkins: this.equippedSkins,
        unlockedSkins: this.unlockedSkins,
        lastSaved: Date.now()
      };

      try {
        localStorage.setItem(this.options.storageKey, JSON.stringify(data));
      } catch (e) {
        console.error('[SkinSystem] Save error:', e);
      }
    }

    load() {
      try {
        const saved = localStorage.getItem(this.options.storageKey);
        if (!saved) return;

        const data = JSON.parse(saved);
        
        if (data.equippedSkins) this.equippedSkins = data.equippedSkins;
        if (data.unlockedSkins) this.unlockedSkins = data.unlockedSkins;

        this.emit('skin:loaded');
      } catch (e) {
        console.error('[SkinSystem] Load error:', e);
      }
    }

    exportData() {
      return {
        equippedSkins: this.equippedSkins,
        unlockedSkins: this.unlockedSkins
      };
    }

    importData(data) {
      if (data.equippedSkins) this.equippedSkins = data.equippedSkins;
      if (data.unlockedSkins) this.unlockedSkins = data.unlockedSkins;

      this.save();
      this.emit('skin:imported');
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
      const stats = {
        totalCharacters: Object.keys(this.skins).length,
        totalSkins: 0,
        totalUnlocked: 0,
        characters: {}
      };

      Object.keys(this.skins).forEach(characterId => {
        const total = Object.keys(this.skins[characterId]).length;
        const unlocked = this.unlockedSkins[characterId]?.length || 0;
        
        stats.characters[characterId] = {
          total,
          unlocked,
          equipped: this.equippedSkins[characterId]
        };
        
        stats.totalSkins += total;
        stats.totalUnlocked += unlocked;
      });

      return stats;
    }
  }

  return SkinSystem;
}));

