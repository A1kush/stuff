/**
 * RankBadge.js - Enemy Rank Badge Display
 * @version 1.0.0
 * @description Shows rank badges (F to SSS+) on enemies
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RankBadge = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class RankBadge {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          containerSelector: "#rank-badges-container",
          showThreatLevel: true,
          showMultiplier: false,
          animateOnSpawn: true,
          eventBus: null,
        },
        options
      );

      this.container = null;
      this.badges = new Map(); // entityId -> DOM element

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Create container
      if (typeof document !== "undefined") {
        this.container = document.querySelector(this.options.containerSelector);

        if (!this.container) {
          this.container = document.createElement("div");
          this.container.id = "rank-badges-container";
          this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
          `;
          document.body.appendChild(this.container);
        }
      }

      this.initialized = true;
      return this;
    }

    /**
     * Create rank badge for an enemy
     * @param {string} entityId - Entity ID
     * @param {string} rank - Rank tier (F to SSS+)
     * @param {Object} position - {x, y} screen position
     * @param {Object} options - Additional options
     */
    createBadge(entityId, rank, position = { x: 0, y: 0 }, options = {}) {
      if (!this.container) return null;

      // Get rank info
      const rankInfo = this._getRankInfo(rank);
      if (!rankInfo) return null;

      // Create badge element
      const badge = document.createElement("div");
      badge.className = "rank-badge";
      badge.dataset.rank = rank;
      badge.dataset.entity = entityId;

      // Position
      badge.style.cssText = `
        position: absolute;
        left: ${position.x}px;
        top: ${position.y - 50}px;
        padding: 4px 12px;
        background: ${this._getRankGradient(rankInfo.color)};
        border: 2px solid ${rankInfo.color};
        border-radius: 20px;
        color: white;
        font-weight: bold;
        font-size: 14px;
        text-shadow: 1px 1px 2px black;
        box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        white-space: nowrap;
        pointer-events: none;
        transform: translateX(-50%);
      `;

      // Rank text
      const rankText = document.createElement("span");
      rankText.textContent = rank;
      rankText.style.cssText = "font-size: 16px; margin-right: 4px;";
      badge.appendChild(rankText);

      // Rank name
      const rankName = document.createElement("span");
      rankName.textContent = rankInfo.name;
      rankName.style.cssText = "font-size: 11px; opacity: 0.9;";
      badge.appendChild(rankName);

      // Show multiplier if enabled
      if (this.options.showMultiplier) {
        const mult = document.createElement("span");
        mult.textContent = ` (${rankInfo.mult}x)`;
        mult.style.cssText = "font-size: 10px; opacity: 0.8;";
        badge.appendChild(mult);
      }

      // Animate on spawn
      if (this.options.animateOnSpawn) {
        badge.style.animation = "rankBadgeSpawn 0.5s ease-out";
      }

      this.container.appendChild(badge);
      this.badges.set(entityId, badge);

      // Add CSS animation if not exists
      this._ensureAnimationCSS();

      return badge;
    }

    /**
     * Update badge position
     * @param {string} entityId - Entity ID
     * @param {Object} position - {x, y} screen position
     */
    updatePosition(entityId, position) {
      const badge = this.badges.get(entityId);
      if (badge) {
        badge.style.left = position.x + "px";
        badge.style.top = position.y - 50 + "px";
      }
    }

    /**
     * Remove badge
     * @param {string} entityId - Entity ID
     */
    removeBadge(entityId) {
      const badge = this.badges.get(entityId);
      if (badge) {
        // Fade out animation
        badge.style.animation = "rankBadgeFadeOut 0.3s ease-out";
        setTimeout(() => {
          if (badge.parentNode) {
            badge.parentNode.removeChild(badge);
          }
        }, 300);
        this.badges.delete(entityId);
      }
    }

    /**
     * Create rank badge HTML (for custom rendering)
     * @static
     */
    static createHTML(rank, options = {}) {
      const rankInfo = RankBadge._getRankInfoStatic(rank);
      if (!rankInfo) return "";

      const showMult = options.showMultiplier || false;
      const size = options.size || "normal"; // 'small', 'normal', 'large'

      const sizes = {
        small: { padding: "2px 8px", fontSize: "12px" },
        normal: { padding: "4px 12px", fontSize: "14px" },
        large: { padding: "6px 16px", fontSize: "18px" },
      };

      const sizeStyle = sizes[size] || sizes.normal;

      return `
        <div class="rank-badge rank-${rank.toLowerCase()}" style="
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: ${sizeStyle.padding};
          background: linear-gradient(135deg, ${
            rankInfo.color
          }ee, ${rankInfo.color}88);
          border: 2px solid ${rankInfo.color};
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: ${sizeStyle.fontSize};
          text-shadow: 1px 1px 2px black;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          <span style="font-size: 1.2em;">${rank}</span>
          <span style="font-size: 0.8em; opacity: 0.9;">${rankInfo.name}</span>
          ${
            showMult
              ? `<span style="font-size: 0.7em; opacity: 0.8;">(${rankInfo.mult}x)</span>`
              : ""
          }
        </div>
      `;
    }

    // Private methods
    _getRankInfo(rank) {
      if (typeof window !== "undefined" && window.EnemyScaling) {
        return window.EnemyScaling.RANKS[rank] || null;
      }
      return RankBadge._getRankInfoStatic(rank);
    }

    static _getRankInfoStatic(rank) {
      const RANKS = {
        F: { mult: 0.5, name: "Novice", color: "#888888" },
        E: { mult: 0.7, name: "Beginner", color: "#999999" },
        D: { mult: 0.9, name: "Apprentice", color: "#aaaaaa" },
        "C-": { mult: 1.0, name: "Journeyman", color: "#8bc34a" },
        C: { mult: 1.2, name: "Adventurer", color: "#4caf50" },
        "C+": { mult: 1.4, name: "Veteran", color: "#2196f3" },
        "B-": { mult: 1.7, name: "Elite", color: "#2196f3" },
        B: { mult: 2.0, name: "Expert", color: "#9c27b0" },
        "B+": { mult: 2.5, name: "Master", color: "#9c27b0" },
        "A-": { mult: 3.0, name: "Champion", color: "#ff9800" },
        A: { mult: 4.0, name: "Hero", color: "#ff9800" },
        "A+": { mult: 5.0, name: "Legend", color: "#ff5722" },
        S: { mult: 7.0, name: "Mythic", color: "#f44336" },
        SS: { mult: 10.0, name: "Godlike", color: "#ffd700" },
        SSS: { mult: 15.0, name: "Transcendent", color: "#ffd700" },
        "SSS+": { mult: 25.0, name: "Supreme", color: "#ff1744" },
      };
      return RANKS[rank] || null;
    }

    _getRankGradient(color) {
      return `linear-gradient(135deg, ${color}ee, ${color}88)`;
    }

    _getStatusEffects(entityId) {
      if (typeof window !== "undefined" && window.LevelBridge?.statusEffects) {
        return window.LevelBridge.statusEffects.getEffects(entityId);
      }
      return [];
    }

    _ensureAnimationCSS() {
      if (document.getElementById("rank-badge-animations")) return;

      const style = document.createElement("style");
      style.id = "rank-badge-animations";
      style.textContent = `
        @keyframes rankBadgeSpawn {
          0% { transform: translateX(-50%) scale(0) rotate(-180deg); opacity: 0; }
          70% { transform: translateX(-50%) scale(1.1) rotate(10deg); }
          100% { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes rankBadgeFadeOut {
          0% { opacity: 1; transform: translateX(-50%) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) scale(0.5); }
        }

        .rank-badge:hover {
          transform: translateX(-50%) scale(1.1);
          transition: transform 0.2s;
        }
      `;
      document.head.appendChild(style);
    }
  }

  return RankBadge;
});
