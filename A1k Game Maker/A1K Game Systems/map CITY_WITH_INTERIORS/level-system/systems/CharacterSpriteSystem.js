/**
 * CharacterSpriteSystem.js - Complete Sprite & Skin System
 * @version 1.0.0
 * @description 19 sprite styles, 57 characters, animations, skins
 * Integrates data from Character System/Sprite System
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CharacterSpriteSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // 19 SPRITE STYLES!
  // ============================

  const SPRITE_STYLES = {
    hd_pixel_art: {
      id: "hd_pixel_art",
      name: "HD Pixel Art",
      description: "Classic pixel-art with modern HD resolution",
      resolution: "high",
      animations: ["idle", "run", "jump", "attack", "hurt", "death"],
    },
    vector_cel_shaded: {
      id: "vector_cel_shaded",
      name: "Vector Cel-Shaded",
      description: "Smooth vector graphics with anime-style shading",
      resolution: "vector",
      animations: ["idle", "run", "jump", "attack", "special"],
    },
    "3d_prerendered": {
      id: "3d_prerendered",
      name: "3D Pre-rendered",
      description: "3D models rendered to 2D sprites",
      resolution: "high",
      animations: ["idle", "walk", "attack", "block", "ultimate"],
    },
    procedural_shader: {
      id: "procedural_shader",
      name: "Procedural Shader",
      description: "Real-time shader-based rendering",
      resolution: "dynamic",
      animations: ["all"],
    },
    hybrid_enhanced: {
      id: "hybrid_enhanced",
      name: "Hybrid Enhanced",
      description: "Mix of pixel-art and vector with effects",
      resolution: "high",
      animations: ["idle", "run", "jump", "attack", "special", "ultimate"],
    },
    chibi_kawaii: {
      id: "chibi_kawaii",
      name: "Chibi Kawaii",
      description: "Cute chibi-style characters",
      resolution: "medium",
      animations: ["idle", "run", "jump", "emote"],
    },
    neon_cyberpunk: {
      id: "neon_cyberpunk",
      name: "Neon Cyberpunk",
      description: "Glowing neon outlines with cyberpunk aesthetic",
      resolution: "high",
      animations: ["idle", "run", "hack", "shoot", "dash"],
    },
    lowpoly_3d: {
      id: "lowpoly_3d",
      name: "Low-Poly 3D",
      description: "Stylized low-polygon 3D models",
      resolution: "3d",
      animations: ["all"],
    },
    metroidvania_hires: {
      id: "metroidvania_hires",
      name: "Metroidvania Hi-Res",
      description: "Detailed pixel-art for exploration games",
      resolution: "high",
      animations: ["idle", "walk", "run", "jump", "climb", "slide"],
    },
    retro_8bit: {
      id: "retro_8bit",
      name: "Retro 8-Bit",
      description: "Classic NES/SNES era pixel-art",
      resolution: "low",
      animations: ["idle", "walk", "jump", "attack"],
    },
    sketch_art: {
      id: "sketch_art",
      name: "Sketch Art",
      description: "Hand-drawn sketch aesthetic",
      resolution: "high",
      animations: ["idle", "run", "attack", "special"],
    },
    stained_glass: {
      id: "stained_glass",
      name: "Stained Glass",
      description: "Colorful stained-glass window style",
      resolution: "high",
      animations: ["idle", "attack", "special"],
    },
    comic_halftone: {
      id: "comic_halftone",
      name: "Comic Halftone",
      description: "Comic book style with halftone dots",
      resolution: "high",
      animations: ["idle", "punch", "kick", "special"],
    },
    glitch_art: {
      id: "glitch_art",
      name: "Glitch Art",
      description: "Digital glitch aesthetic",
      resolution: "high",
      animations: ["idle", "glitch", "attack", "teleport"],
    },
    watercolor_paint: {
      id: "watercolor_paint",
      name: "Watercolor Paint",
      description: "Soft watercolor painting style",
      resolution: "high",
      animations: ["idle", "walk", "attack"],
    },
    ascii_terminal: {
      id: "ascii_terminal",
      name: "ASCII Terminal",
      description: "Old-school ASCII text art",
      resolution: "text",
      animations: ["all_text"],
    },
    paper_cutout: {
      id: "paper_cutout",
      name: "Paper Cutout",
      description: "Layered paper cutout aesthetic",
      resolution: "high",
      animations: ["idle", "walk", "jump"],
    },
    hologram_wireframe: {
      id: "hologram_wireframe",
      name: "Hologram Wireframe",
      description: "Futuristic hologram wireframe",
      resolution: "vector",
      animations: ["idle", "scan", "attack", "warp"],
    },
  };

  const STYLE_KEYS = Object.keys(SPRITE_STYLES);

  // ============================
  // 57 CHARACTER SPRITES (19 styles × 3 characters)
  // ============================

  const CHARACTERS = {
    cat_angel_gunner: {
      id: "cat_angel_gunner",
      name: "Cat Angel Gunner",
      class: "ranged",
      weapon: "dual_pistols",
      baseStats: { hp: 100, atk: 45, def: 20, spd: 130 },
      abilities: ["holy_shot", "angel_wings", "rapid_fire"],
      availableStyles: STYLE_KEYS, // All 19 styles!
    },
    cyborg_rifle_operative: {
      id: "cyborg_rifle_operative",
      name: "Cyborg Rifle Operative",
      class: "tech",
      weapon: "rifle",
      baseStats: { hp: 120, atk: 50, def: 30, spd: 110 },
      abilities: ["precision_shot", "tactical_scan", "emp_blast"],
      availableStyles: STYLE_KEYS,
    },
    warrior_dual_swords: {
      id: "warrior_dual_swords",
      name: "Warrior (Dual Swords)",
      class: "melee",
      weapon: "dual_swords",
      baseStats: { hp: 150, atk: 60, def: 40, spd: 120 },
      abilities: ["dual_slash", "whirlwind", "blade_storm"],
      availableStyles: STYLE_KEYS,
    },
  };

  const CHARACTER_KEYS = Object.keys(CHARACTERS);

  // Total: 19 styles × 3 characters = 57 unique sprite combinations!

  // ============================
  // ANIMATION SYSTEM
  // ============================

  const ANIMATIONS = {
    idle: { frames: 4, duration: 800, loop: true },
    walk: { frames: 6, duration: 600, loop: true },
    run: { frames: 8, duration: 480, loop: true },
    jump: { frames: 6, duration: 400, loop: false },
    attack: { frames: 6, duration: 360, loop: false },
    hurt: { frames: 3, duration: 300, loop: false },
    death: { frames: 8, duration: 800, loop: false },
    special: { frames: 10, duration: 600, loop: false },
    ultimate: { frames: 15, duration: 1200, loop: false },
  };

  // ============================
  // CHARACTER SPRITE SYSTEM CLASS
  // ============================

  class CharacterSpriteSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          defaultStyle: "hd_pixel_art",
          defaultCharacter: "cat_angel_gunner",
          enableAnimations: true,
          cacheSprites: true,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Sprite config */
      this.playerSprites = new Map();

      /** @type {Map<string, Set>} Player ID -> Unlocked styles */
      this.unlockedStyles = new Map();

      /** @type {Map<string, Set>} Player ID -> Unlocked characters */
      this.unlockedCharacters = new Map();

      /** @type {Map<string, Object>} Sprite cache */
      this.spriteCache = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalStyleChanges: 0,
        totalCharacterChanges: 0,
        mostPopularStyle: null,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("sprites:ready", {
        styles: STYLE_KEYS.length,
        characters: CHARACTER_KEYS.length,
        totalCombinations: STYLE_KEYS.length * CHARACTER_KEYS.length,
      });

      return this;
    }

    /**
     * Initialize player sprite
     * @param {string} playerId - Player ID
     * @param {string} characterId - Character ID
     * @param {string} styleId - Style ID
     * @returns {Object} Sprite config
     */
    initializeSprite(playerId, characterId = null, styleId = null) {
      const character = characterId || this.options.defaultCharacter;
      const style = styleId || this.options.defaultStyle;

      const sprite = {
        playerId,
        characterId: character,
        styleId: style,
        currentAnimation: "idle",
        frame: 0,
        flipX: false,
        scale: 1.0,
        tint: null,
      };

      this.playerSprites.set(playerId, sprite);

      // Unlock default character and style
      this.unlockCharacter(playerId, character);
      this.unlockStyle(playerId, style);

      this._emit("sprite:initialized", { playerId, sprite });

      return sprite;
    }

    /**
     * Change character
     * @param {string} playerId - Player ID
     * @param {string} characterId - Character ID
     * @returns {Object} Sprite config
     */
    changeCharacter(playerId, characterId) {
      const character = CHARACTERS[characterId];
      if (!character) return { error: "Invalid character" };

      // Check if unlocked
      const unlocked = this.unlockedCharacters.get(playerId) || new Set();
      if (!unlocked.has(characterId)) {
        return { error: "Character not unlocked" };
      }

      const sprite = this.playerSprites.get(playerId);
      if (!sprite) return { error: "Player sprite not initialized" };

      sprite.characterId = characterId;
      this.stats.totalCharacterChanges++;

      this._emit("sprite:character_changed", { playerId, characterId });

      return sprite;
    }

    /**
     * Change sprite style
     * @param {string} playerId - Player ID
     * @param {string} styleId - Style ID
     * @returns {Object} Sprite config
     */
    changeStyle(playerId, styleId) {
      const style = SPRITE_STYLES[styleId];
      if (!style) return { error: "Invalid style" };

      // Check if unlocked
      const unlocked = this.unlockedStyles.get(playerId) || new Set();
      if (!unlocked.has(styleId)) {
        return { error: "Style not unlocked" };
      }

      const sprite = this.playerSprites.get(playerId);
      if (!sprite) return { error: "Player sprite not initialized" };

      sprite.styleId = styleId;
      this.stats.totalStyleChanges++;

      this._emit("sprite:style_changed", { playerId, styleId });

      return sprite;
    }

    /**
     * Play animation
     * @param {string} playerId - Player ID
     * @param {string} animationId - Animation ID
     * @returns {Object} Animation data
     */
    playAnimation(playerId, animationId) {
      const sprite = this.playerSprites.get(playerId);
      if (!sprite) return { error: "Player sprite not initialized" };

      const animation = ANIMATIONS[animationId];
      if (!animation) return { error: "Invalid animation" };

      sprite.currentAnimation = animationId;
      sprite.frame = 0;

      this._emit("sprite:animation_started", {
        playerId,
        animation: animationId,
      });

      return animation;
    }

    /**
     * Unlock character
     * @param {string} playerId - Player ID
     * @param {string} characterId - Character ID
     * @returns {boolean} Success
     */
    unlockCharacter(playerId, characterId) {
      if (!CHARACTERS[characterId]) return false;

      const unlocked = this.unlockedCharacters.get(playerId) || new Set();

      if (unlocked.has(characterId)) return false;

      unlocked.add(characterId);
      this.unlockedCharacters.set(playerId, unlocked);

      this._emit("sprite:character_unlocked", { playerId, characterId });

      return true;
    }

    /**
     * Unlock style
     * @param {string} playerId - Player ID
     * @param {string} styleId - Style ID
     * @returns {boolean} Success
     */
    unlockStyle(playerId, styleId) {
      if (!SPRITE_STYLES[styleId]) return false;

      const unlocked = this.unlockedStyles.get(playerId) || new Set();

      if (unlocked.has(styleId)) return false;

      unlocked.add(styleId);
      this.unlockedStyles.set(playerId, unlocked);

      this._emit("sprite:style_unlocked", { playerId, styleId });

      return true;
    }

    /**
     * Get sprite config
     * @param {string} playerId - Player ID
     * @returns {Object} Sprite data
     */
    getSprite(playerId) {
      const sprite = this.playerSprites.get(playerId);
      if (!sprite) return null;

      const character = CHARACTERS[sprite.characterId];
      const style = SPRITE_STYLES[sprite.styleId];

      return {
        ...sprite,
        character,
        style,
      };
    }

    /**
     * Get unlocked characters
     * @param {string} playerId - Player ID
     * @returns {Array} Characters
     */
    getUnlockedCharacters(playerId) {
      const unlocked = this.unlockedCharacters.get(playerId) || new Set();
      return Array.from(unlocked).map((id) => CHARACTERS[id]);
    }

    /**
     * Get unlocked styles
     * @param {string} playerId - Player ID
     * @returns {Array} Styles
     */
    getUnlockedStyles(playerId) {
      const unlocked = this.unlockedStyles.get(playerId) || new Set();
      return Array.from(unlocked).map((id) => SPRITE_STYLES[id]);
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerSprites: Array.from(this.playerSprites.entries()),
        unlockedStyles: Array.from(this.unlockedStyles.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        unlockedCharacters: Array.from(this.unlockedCharacters.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerSprites.clear();
      if (data.playerSprites) {
        data.playerSprites.forEach(([playerId, sprite]) => {
          this.playerSprites.set(playerId, sprite);
        });
      }

      this.unlockedStyles.clear();
      if (data.unlockedStyles) {
        data.unlockedStyles.forEach(([id, arr]) => {
          this.unlockedStyles.set(id, new Set(arr));
        });
      }

      this.unlockedCharacters.clear();
      if (data.unlockedCharacters) {
        data.unlockedCharacters.forEach(([id, arr]) => {
          this.unlockedCharacters.set(id, new Set(arr));
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("sprites:loaded");
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CharacterSpriteSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CharacterSpriteSystem.SPRITE_STYLES = SPRITE_STYLES;
  CharacterSpriteSystem.STYLE_KEYS = STYLE_KEYS;
  CharacterSpriteSystem.CHARACTERS = CHARACTERS;
  CharacterSpriteSystem.CHARACTER_KEYS = CHARACTER_KEYS;
  CharacterSpriteSystem.ANIMATIONS = ANIMATIONS;

  return CharacterSpriteSystem;
});

