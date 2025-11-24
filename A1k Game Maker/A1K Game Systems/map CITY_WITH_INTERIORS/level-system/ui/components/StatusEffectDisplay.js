/**
 * StatusEffectDisplay.js - Visual Status Effect Icons
 * @version 1.0.0
 * @description Displays status effects above character heads
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.StatusEffectDisplay = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class StatusEffectDisplay {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          containerSelector: "#status-effects-container",
          iconSize: 32,
          maxVisible: 8,
          showTimers: true,
          showStacks: true,
          eventBus: null,
          autoUpdate: true,
        },
        options
      );

      this.container = null;
      this.displays = new Map(); // entityId -> DOM element
      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);

      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      // Create or get container
      if (typeof document !== "undefined") {
        this.container = document.querySelector(this.options.containerSelector);

        if (!this.container) {
          this.container = document.createElement("div");
          this.container.id = "status-effects-container";
          this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
          `;
          document.body.appendChild(this.container);
        }
      }

      // Listen to status events
      if (this.eventBus) {
        this.eventBus.on("status:applied", (data) =>
          this.updateDisplay(data.entityId)
        );
        this.eventBus.on("status:removed", (data) =>
          this.updateDisplay(data.entityId)
        );
        this.eventBus.on("status:expired", (data) =>
          this.updateDisplay(data.entityId)
        );
      }

      this.initialized = true;

      if (this.options.autoUpdate) {
        this.startAutoUpdate();
      }

      return this;
    }

    /**
     * Create or update status display for an entity
     * @param {string} entityId - Entity ID
     * @param {Object} position - {x, y} screen position
     */
    updateDisplay(entityId, position = null) {
      if (!this.container) return;

      // Get or create display element
      let display = this.displays.get(entityId);

      if (!display) {
        display = document.createElement("div");
        display.className = "status-effect-display";
        display.style.cssText = `
          position: absolute;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          max-width: 300px;
          pointer-events: none;
        `;
        this.container.appendChild(display);
        this.displays.set(entityId, display);
      }

      // Update position if provided
      if (position) {
        display.style.left = position.x + "px";
        display.style.top = position.y - 40 + "px";
      }

      // Get active effects
      const statusEffects = this._getStatusEffects(entityId);

      // Clear and rebuild
      display.innerHTML = "";

      // Show up to max visible
      const visible = statusEffects.slice(0, this.options.maxVisible);

      visible.forEach((effect) => {
        const icon = this._createEffectIcon(effect);
        display.appendChild(icon);
      });

      // Hide if no effects
      display.style.display = visible.length > 0 ? "flex" : "none";
    }

    /**
     * Remove display for an entity
     * @param {string} entityId - Entity ID
     */
    removeDisplay(entityId) {
      const display = this.displays.get(entityId);
      if (display && display.parentNode) {
        display.parentNode.removeChild(display);
      }
      this.displays.delete(entityId);
    }

    /**
     * Update all displays
     */
    updateAll() {
      // This would need entity position data
      // For now, just update timers
      for (const [entityId, display] of this.displays) {
        const statusEffects = this._getStatusEffects(entityId);

        if (statusEffects.length === 0) {
          display.style.display = "none";
        } else {
          // Update timer text on icons
          const icons = display.querySelectorAll(".status-icon");
          statusEffects.forEach((effect, index) => {
            if (icons[index]) {
              const timer = icons[index].querySelector(".status-timer");
              if (timer && this.options.showTimers) {
                const remaining = Math.max(0, effect.expiresAt - Date.now());
                timer.textContent = (remaining / 1000).toFixed(1) + "s";
              }
            }
          });
        }
      }
    }

    /**
     * Start auto-update loop
     */
    startAutoUpdate() {
      setInterval(() => this.updateAll(), 100);
    }

    /**
     * Create effect icon element
     * @private
     */
    _createEffectIcon(effect) {
      const icon = document.createElement("div");
      icon.className = "status-icon";
      icon.style.cssText = `
        width: ${this.options.iconSize}px;
        height: ${this.options.iconSize}px;
        background: ${effect.color};
        border: 2px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${this.options.iconSize * 0.6}px;
        position: relative;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      `;

      // Icon emoji
      const emoji = document.createElement("span");
      emoji.textContent = effect.icon;
      icon.appendChild(emoji);

      // Timer overlay
      if (this.options.showTimers) {
        const timer = document.createElement("div");
        timer.className = "status-timer";
        const remaining = Math.max(0, effect.expiresAt - Date.now());
        timer.textContent = (remaining / 1000).toFixed(1) + "s";
        timer.style.cssText = `
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 2px black;
          white-space: nowrap;
        `;
        icon.appendChild(timer);
      }

      // Stack count
      if (this.options.showStacks && effect.stacks > 1) {
        const stacks = document.createElement("div");
        stacks.className = "status-stacks";
        stacks.textContent = effect.stacks;
        stacks.style.cssText = `
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #ff5722;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          color: white;
          border: 1px solid white;
        `;
        icon.appendChild(stacks);
      }

      // Tooltip
      icon.title = `${effect.name}\n${effect.description}`;

      return icon;
    }

    /**
     * Get status effects from status system
     * @private
     */
    _getStatusEffects(entityId) {
      if (typeof window !== "undefined" && window.LevelBridge?.statusEffects) {
        return window.LevelBridge.statusEffects.getEffects(entityId);
      }
      return [];
    }
  }

  return StatusEffectDisplay;
});
