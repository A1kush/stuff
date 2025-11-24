/**
 * EventBus.js - Lightweight Event System for Inter-Module Communication
 * @version 1.0.0
 * @description Pub/sub event system for decoupled component communication
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.EventBus = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  class EventBus {
    constructor() {
      /** @type {Map<string, Set<Function>>} */
      this.listeners = new Map();
      /** @type {Map<string, Array>} */
      this.eventHistory = new Map();
      /** @type {boolean} */
      this.debug = false;
      /** @type {number} */
      this.maxHistorySize = 100;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name (supports wildcards with *)
     * @param {Function} callback - Callback function
     * @param {Object} options - Options {once: boolean, priority: number}
     * @returns {Function} Unsubscribe function
     */
    on(event, callback, options = {}) {
      if (typeof event !== "string" || !event) {
        console.error("[EventBus] Invalid event name:", event);
        return () => {};
      }

      if (typeof callback !== "function") {
        console.error("[EventBus] Invalid callback for event:", event);
        return () => {};
      }

      // Create listener set if it doesn't exist
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }

      // Wrap callback with options
      const wrappedCallback = this._wrapCallback(callback, options);

      // Add to listeners
      this.listeners.get(event).add(wrappedCallback);

      if (this.debug) {
        console.log(`[EventBus] Registered listener for '${event}'`);
      }

      // Return unsubscribe function
      return () => this.off(event, wrappedCallback);
    }

    /**
     * Subscribe to event (fires only once)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
      return this.on(event, callback, { once: true });
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
      if (!this.listeners.has(event)) {
        return;
      }

      if (callback) {
        this.listeners.get(event).delete(callback);
        if (this.debug) {
          console.log(`[EventBus] Removed listener from '${event}'`);
        }
      } else {
        // Remove all listeners for this event
        this.listeners.delete(event);
        if (this.debug) {
          console.log(`[EventBus] Removed all listeners from '${event}'`);
        }
      }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @returns {boolean} True if event had listeners
     */
    emit(event, data) {
      if (typeof event !== "string" || !event) {
        console.error("[EventBus] Invalid event name:", event);
        return false;
      }

      // Store in history
      this._addToHistory(event, data);

      let hasListeners = false;

      // Exact match listeners
      if (this.listeners.has(event)) {
        hasListeners = true;
        const listeners = Array.from(this.listeners.get(event));

        for (const listener of listeners) {
          try {
            listener(data, event);

            // Remove if it was a 'once' listener
            if (listener._once) {
              this.listeners.get(event).delete(listener);
            }
          } catch (error) {
            console.error(
              `[EventBus] Error in listener for '${event}':`,
              error
            );
          }
        }
      }

      // Wildcard listeners
      hasListeners = this._emitWildcard(event, data) || hasListeners;

      if (this.debug) {
        console.log(`[EventBus] Emitted '${event}'`, data);
      }

      return hasListeners;
    }

    /**
     * Emit event asynchronously
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @returns {Promise<boolean>}
     */
    async emitAsync(event, data) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = this.emit(event, data);
          resolve(result);
        }, 0);
      });
    }

    /**
     * Check if event has listeners
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasListeners(event) {
      return this.listeners.has(event) && this.listeners.get(event).size > 0;
    }

    /**
     * Get listener count for event
     * @param {string} event - Event name
     * @returns {number}
     */
    listenerCount(event) {
      return this.listeners.has(event) ? this.listeners.get(event).size : 0;
    }

    /**
     * Get all registered event names
     * @returns {string[]}
     */
    eventNames() {
      return Array.from(this.listeners.keys());
    }

    /**
     * Clear all listeners (or for specific event)
     * @param {string} [event] - Optional event name
     */
    clear(event) {
      if (event) {
        this.listeners.delete(event);
      } else {
        this.listeners.clear();
      }

      if (this.debug) {
        console.log("[EventBus] Cleared", event || "all listeners");
      }
    }

    /**
     * Get event history
     * @param {string} [event] - Optional event name filter
     * @param {number} [limit] - Max number of events to return
     * @returns {Array}
     */
    getHistory(event, limit = 10) {
      if (event) {
        const history = this.eventHistory.get(event) || [];
        return history.slice(-limit);
      }

      // Return all history
      const allHistory = [];
      for (const [eventName, events] of this.eventHistory) {
        allHistory.push(...events.map((e) => ({ event: eventName, ...e })));
      }

      return allHistory.slice(-limit);
    }

    /**
     * Clear event history
     * @param {string} [event] - Optional event name
     */
    clearHistory(event) {
      if (event) {
        this.eventHistory.delete(event);
      } else {
        this.eventHistory.clear();
      }
    }

    /**
     * Enable/disable debug mode
     * @param {boolean} enabled - Debug mode
     */
    setDebug(enabled) {
      this.debug = !!enabled;
      console.log("[EventBus] Debug mode:", this.debug ? "ON" : "OFF");
    }

    // ============================
    // PRIVATE METHODS
    // ============================

    /**
     * Wrap callback with options
     * @private
     */
    _wrapCallback(callback, options) {
      const wrapped = callback;

      if (options.once) {
        wrapped._once = true;
      }

      if (options.priority !== undefined) {
        wrapped._priority = options.priority;
      }

      // Store original for unwrapping
      wrapped._original = callback;

      return wrapped;
    }

    /**
     * Handle wildcard event matching
     * @private
     */
    _emitWildcard(event, data) {
      let hasWildcardListeners = false;

      // Check for wildcard listeners
      for (const [listenerEvent, callbacks] of this.listeners) {
        if (listenerEvent.includes("*")) {
          // Convert wildcard to regex
          const regex = new RegExp(
            "^" + listenerEvent.replace(/\*/g, ".*") + "$"
          );

          if (regex.test(event)) {
            hasWildcardListeners = true;
            const listeners = Array.from(callbacks);

            for (const listener of listeners) {
              try {
                listener(data, event);

                if (listener._once) {
                  callbacks.delete(listener);
                }
              } catch (error) {
                console.error(
                  `[EventBus] Error in wildcard listener for '${event}':`,
                  error
                );
              }
            }
          }
        }
      }

      return hasWildcardListeners;
    }

    /**
     * Add event to history
     * @private
     */
    _addToHistory(event, data) {
      if (!this.eventHistory.has(event)) {
        this.eventHistory.set(event, []);
      }

      const history = this.eventHistory.get(event);
      history.push({
        data,
        timestamp: Date.now(),
      });

      // Limit history size
      if (history.length > this.maxHistorySize) {
        history.shift();
      }
    }
  }

  // Create global instance
  const globalEventBus = new EventBus();

  // Expose both class and global instance
  globalEventBus.EventBus = EventBus;

  return globalEventBus;
});

// ============================
// USAGE EXAMPLES
// ============================

/*

// Basic usage
EventBus.on('player:levelup', (data) => {
  console.log('Player leveled up!', data);
});

EventBus.emit('player:levelup', { level: 10, xp: 1500 });

// One-time listener
EventBus.once('game:start', (data) => {
  console.log('Game started!', data);
});

// Wildcard listeners
EventBus.on('player:*', (data, event) => {
  console.log('Player event:', event, data);
});

// Unsubscribe
const unsub = EventBus.on('enemy:spawn', handleEnemySpawn);
unsub(); // Removes listener

// Check listeners
if (EventBus.hasListeners('player:death')) {
  EventBus.emit('player:death');
}

// Debug mode
EventBus.setDebug(true);

// Get history
const recentEvents = EventBus.getHistory('player:levelup', 5);

*/
