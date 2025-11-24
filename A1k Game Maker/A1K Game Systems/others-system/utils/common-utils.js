/**
 * Common Utilities - Shared helper functions
 * @description Collection of utility functions used across game systems
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
    root.GameUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const GameUtils = {
    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
      return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Deep clone an object
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone(obj) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map(item => this.deepClone(item));
      if (obj instanceof Object) {
        const cloned = {};
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            cloned[key] = this.deepClone(obj[key]);
          }
        }
        return cloned;
      }
    },

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format time duration
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time (e.g., "1:23" or "1h 23m")
     */
    formatTime(ms) {
      const seconds = Math.floor(ms / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      } else if (minutes > 0) {
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
      } else {
        return `${seconds}s`;
      }
    },

    /**
     * Clamp number between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped value
     */
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    /**
     * Linear interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} t - Interpolation factor (0-1)
     * @returns {number} Interpolated value
     */
    lerp(start, end, t) {
      return start + (end - start) * t;
    },

    /**
     * Random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer
     */
    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Random float between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random float
     */
    randomFloat(min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
     * Pick random element from array
     * @param {Array} array - Source array
     * @returns {*} Random element
     */
    randomChoice(array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
      };
    },

    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
      let inThrottle;
      return function(...args) {
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Calculate percentage
     * @param {number} value - Current value
     * @param {number} max - Maximum value
     * @returns {number} Percentage (0-100)
     */
    percentage(value, max) {
      return Math.round((value / max) * 100);
    },

    /**
     * Check if object is empty
     * @param {Object} obj - Object to check
     * @returns {boolean} True if empty
     */
    isEmpty(obj) {
      return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    },

    /**
     * Merge objects deeply
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    deepMerge(target, source) {
      const result = { ...target };
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          if (source[key] instanceof Object && key in target) {
            result[key] = this.deepMerge(target[key], source[key]);
          } else {
            result[key] = source[key];
          }
        }
      }
      return result;
    },

    /**
     * Wait for condition
     * @param {Function} condition - Condition function
     * @param {number} timeout - Timeout in ms
     * @param {number} interval - Check interval in ms
     * @returns {Promise} Resolves when condition is met or timeout
     */
    waitFor(condition, timeout = 5000, interval = 100) {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const check = () => {
          if (condition()) {
            resolve(true);
          } else if (Date.now() - startTime >= timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, interval);
          }
        };
        check();
      });
    },

    /**
     * Create cooldown manager
     * @returns {Object} Cooldown manager
     */
    createCooldownManager() {
      const cooldowns = {};
      
      return {
        start(id, duration) {
          cooldowns[id] = Date.now() + duration;
        },
        
        isReady(id) {
          return !cooldowns[id] || Date.now() >= cooldowns[id];
        },
        
        getRemaining(id) {
          if (!cooldowns[id]) return 0;
          const remaining = cooldowns[id] - Date.now();
          return Math.max(0, remaining);
        },
        
        clear(id) {
          delete cooldowns[id];
        },
        
        clearAll() {
          for (let key in cooldowns) {
            delete cooldowns[key];
          }
        }
      };
    },

    /**
     * Parse rarity color
     * @param {string} rarity - Rarity tier
     * @returns {string} Hex color code
     */
    getRarityColor(rarity) {
      const colors = {
        common: '#ffffff',
        uncommon: '#4ecdc4',
        rare: '#4c6ef5',
        epic: '#9b59b6',
        legendary: '#f39c12',
        mythic: '#ff6b9d',
        divine: '#ffd700'
      };
      return colors[rarity.toLowerCase()] || colors.common;
    },

    /**
     * Create notification system
     * @returns {Object} Notification manager
     */
    createNotificationSystem() {
      return {
        show(message, type = 'info', duration = 3000) {
          const notification = document.createElement('div');
          notification.className = `notification notification-${type}`;
          notification.textContent = message;
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#4c6ef5'};
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
          `;
          
          document.body.appendChild(notification);
          
          setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
          }, duration);
        }
      };
    }
  };

  return GameUtils;
}));

