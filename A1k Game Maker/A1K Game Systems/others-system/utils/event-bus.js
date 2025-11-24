/**
 * Event Bus - Simple pub/sub event system
 * @description Lightweight event system for communication between modules
 * @version 1.0.0
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.EventBus = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * EventBus class for handling custom events
   * @class
   */
  class EventBus {
    constructor() {
      this.events = {};
      this.debugMode = false;
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);

      if (this.debugMode) {
        console.log(`[EventBus] Subscribed to: ${event}`);
      }

      // Return unsubscribe function
      return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event (one-time)
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
      const wrapper = (...args) => {
        callback(...args);
        this.off(event, wrapper);
      };
      return this.on(event, wrapper);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
      if (!this.events[event]) return;

      this.events[event] = this.events[event].filter(cb => cb !== callback);

      if (this.debugMode) {
        console.log(`[EventBus] Unsubscribed from: ${event}`);
      }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Data to pass to callbacks
     */
    emit(event, data) {
      if (!this.events[event]) return;

      if (this.debugMode) {
        console.log(`[EventBus] Emitting: ${event}`, data);
      }

      this.events[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in ${event} handler:`, error);
        }
      });
    }

    /**
     * Clear all listeners for an event
     * @param {string} event - Event name
     */
    clear(event) {
      if (event) {
        delete this.events[event];
      } else {
        this.events = {};
      }
    }

    /**
     * Get all registered events
     * @returns {string[]} Array of event names
     */
    getEvents() {
      return Object.keys(this.events);
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
      return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * Enable/disable debug mode
     * @param {boolean} enabled - Debug mode state
     */
    setDebugMode(enabled) {
      this.debugMode = enabled;
    }
  }

  // Create global instance
  const eventBus = new EventBus();

  // Export both class and instance
  return {
    EventBus,
    default: eventBus,
    on: eventBus.on.bind(eventBus),
    once: eventBus.once.bind(eventBus),
    off: eventBus.off.bind(eventBus),
    emit: eventBus.emit.bind(eventBus),
    clear: eventBus.clear.bind(eventBus),
    getEvents: eventBus.getEvents.bind(eventBus),
    getListenerCount: eventBus.getListenerCount.bind(eventBus),
    setDebugMode: eventBus.setDebugMode.bind(eventBus)
  };
}));

