/**
 * TradingSystem.js - Player-to-Player Trading
 * @version 1.0.0
 * @description Secure trading, item exchange, trade history, scam protection
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.TradingSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // TRADE CONSTANTS
  // ============================

  const TRADE_STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    DECLINED: "declined",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
  };

  const TRADE_LIMITS = {
    MAX_ITEMS_PER_TRADE: 8,
    MAX_GOLD_PER_TRADE: 999999999,
    TRADE_TIMEOUT: 300000, // 5 minutes
    CONFIRMATION_TIME: 10000, // 10 seconds to confirm
  };

  // ============================
  // TRADING SYSTEM CLASS
  // ============================

  class TradingSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          requireConfirmation: true,
          enableTradeHistory: true,
          scamProtection: true,
          tradeTax: 0.05, // 5% tax
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Trade ID -> Trade data */
      this.activeTrades = new Map();

      /** @type {Map<string, Array>} Player ID -> Trade history */
      this.tradeHistory = new Map();

      /** @type {Set<string>} Blacklisted players */
      this.blacklist = new Set();

      /** @type {Object} Statistics */
      this.stats = {
        totalTrades: 0,
        totalGoldTraded: 0,
        totalItemsTraded: 0,
        scamsBlocked: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("trading:ready");

      return this;
    }

    /**
     * Create trade offer
     * @param {string} senderId - Sender ID
     * @param {string} receiverId - Receiver ID
     * @param {Object} offer - { items: [], gold: 0 }
     * @returns {Object} Trade data
     */
    createTrade(senderId, receiverId, offer = {}) {
      // Check blacklist
      if (this.blacklist.has(senderId) || this.blacklist.has(receiverId)) {
        this.stats.scamsBlocked++;
        return { error: "Player is blacklisted" };
      }

      // Validate offer
      const items = offer.items || [];
      const gold = offer.gold || 0;

      if (items.length > TRADE_LIMITS.MAX_ITEMS_PER_TRADE) {
        return { error: `Max ${TRADE_LIMITS.MAX_ITEMS_PER_TRADE} items per trade` };
      }

      if (gold > TRADE_LIMITS.MAX_GOLD_PER_TRADE) {
        return { error: "Gold amount exceeds limit" };
      }

      const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const trade = {
        id: tradeId,
        sender: {
          playerId: senderId,
          items: items,
          gold: gold,
          confirmed: false,
        },
        receiver: {
          playerId: receiverId,
          items: [],
          gold: 0,
          confirmed: false,
        },
        status: TRADE_STATUS.PENDING,
        createdAt: Date.now(),
        expiresAt: Date.now() + TRADE_LIMITS.TRADE_TIMEOUT,
      };

      this.activeTrades.set(tradeId, trade);

      // Auto-expire after timeout
      setTimeout(() => {
        if (this.activeTrades.has(tradeId)) {
          const t = this.activeTrades.get(tradeId);
          if (t.status === TRADE_STATUS.PENDING) {
            t.status = TRADE_STATUS.EXPIRED;
            this._emit("trade:expired", { trade: t });
          }
        }
      }, TRADE_LIMITS.TRADE_TIMEOUT);

      this._emit("trade:created", { trade });

      return trade;
    }

    /**
     * Add items to counter-offer
     * @param {string} tradeId - Trade ID
     * @param {string} playerId - Player ID
     * @param {Array} items - Items to add
     * @param {number} gold - Gold to add
     * @returns {Object} Updated trade
     */
    addToTrade(tradeId, playerId, items = [], gold = 0) {
      const trade = this.activeTrades.get(tradeId);
      if (!trade || trade.status !== TRADE_STATUS.PENDING) {
        return { error: "Invalid trade" };
      }

      // Determine which side the player is on
      let side = null;
      if (trade.sender.playerId === playerId) {
        side = trade.sender;
      } else if (trade.receiver.playerId === playerId) {
        side = trade.receiver;
      } else {
        return { error: "Player not in trade" };
      }

      // Add items
      side.items = [...side.items, ...items];
      side.gold += gold;

      // Reset confirmations when trade changes
      trade.sender.confirmed = false;
      trade.receiver.confirmed = false;

      this._emit("trade:updated", { trade });

      return trade;
    }

    /**
     * Remove item from trade
     * @param {string} tradeId - Trade ID
     * @param {string} playerId - Player ID
     * @param {number} itemIndex - Item index to remove
     * @returns {Object} Updated trade
     */
    removeFromTrade(tradeId, playerId, itemIndex) {
      const trade = this.activeTrades.get(tradeId);
      if (!trade || trade.status !== TRADE_STATUS.PENDING) {
        return { error: "Invalid trade" };
      }

      let side = null;
      if (trade.sender.playerId === playerId) {
        side = trade.sender;
      } else if (trade.receiver.playerId === playerId) {
        side = trade.receiver;
      } else {
        return { error: "Player not in trade" };
      }

      // Remove item
      side.items.splice(itemIndex, 1);

      // Reset confirmations
      trade.sender.confirmed = false;
      trade.receiver.confirmed = false;

      this._emit("trade:updated", { trade });

      return trade;
    }

    /**
     * Confirm trade
     * @param {string} tradeId - Trade ID
     * @param {string} playerId - Player ID
     * @returns {Object} Result
     */
    confirmTrade(tradeId, playerId) {
      const trade = this.activeTrades.get(tradeId);
      if (!trade || trade.status !== TRADE_STATUS.PENDING) {
        return { error: "Invalid trade" };
      }

      // Mark player as confirmed
      if (trade.sender.playerId === playerId) {
        trade.sender.confirmed = true;
      } else if (trade.receiver.playerId === playerId) {
        trade.receiver.confirmed = true;
      } else {
        return { error: "Player not in trade" };
      }

      this._emit("trade:confirmed", { tradeId, playerId });

      // Check if both confirmed
      if (trade.sender.confirmed && trade.receiver.confirmed) {
        // Execute trade
        return this._executeTrade(tradeId);
      }

      return { success: true, waiting: true };
    }

    /**
     * Cancel trade
     * @param {string} tradeId - Trade ID
     * @param {string} playerId - Player ID
     * @returns {boolean} Success
     */
    cancelTrade(tradeId, playerId) {
      const trade = this.activeTrades.get(tradeId);
      if (!trade) return false;

      // Only sender/receiver can cancel
      if (trade.sender.playerId !== playerId && trade.receiver.playerId !== playerId) {
        return false;
      }

      trade.status = TRADE_STATUS.CANCELLED;

      this._emit("trade:cancelled", { trade });

      this.activeTrades.delete(tradeId);

      return true;
    }

    /**
     * Get player's active trades
     * @param {string} playerId - Player ID
     * @returns {Array} Active trades
     */
    getActiveTrades(playerId) {
      return Array.from(this.activeTrades.values()).filter(
        (t) =>
          (t.sender.playerId === playerId || t.receiver.playerId === playerId) &&
          t.status === TRADE_STATUS.PENDING
      );
    }

    /**
     * Get trade history
     * @param {string} playerId - Player ID
     * @param {number} limit - Max entries
     * @returns {Array} History
     */
    getTradeHistory(playerId, limit = 50) {
      const history = this.tradeHistory.get(playerId) || [];
      return history.slice(0, limit);
    }

    /**
     * Report scam
     * @param {string} reporterId - Reporter ID
     * @param {string} scammerId - Scammer ID
     * @param {string} reason - Reason
     * @returns {boolean} Success
     */
    reportScam(reporterId, scammerId, reason) {
      // Add to blacklist (in real game, would need admin review)
      this.blacklist.add(scammerId);

      this.stats.scamsBlocked++;

      this._emit("trade:scam_reported", { reporterId, scammerId, reason });

      return true;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeTrades: Array.from(this.activeTrades.entries()),
        tradeHistory: Array.from(this.tradeHistory.entries()),
        blacklist: Array.from(this.blacklist),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeTrades.clear();
      if (data.activeTrades) {
        data.activeTrades.forEach(([id, trade]) => {
          this.activeTrades.set(id, trade);
        });
      }

      this.tradeHistory.clear();
      if (data.tradeHistory) {
        data.tradeHistory.forEach(([playerId, history]) => {
          this.tradeHistory.set(playerId, history);
        });
      }

      this.blacklist.clear();
      if (data.blacklist) {
        data.blacklist.forEach((id) => this.blacklist.add(id));
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("trading:loaded");
    }

    // Private methods
    _executeTrade(tradeId) {
      const trade = this.activeTrades.get(tradeId);
      if (!trade) return { error: "Trade not found" };

      // Calculate tax
      const senderTax = Math.floor(trade.sender.gold * this.options.tradeTax);
      const receiverTax = Math.floor(trade.receiver.gold * this.options.tradeTax);

      // Create trade result
      const result = {
        success: true,
        sender: {
          playerId: trade.sender.playerId,
          gave: {
            items: trade.sender.items,
            gold: trade.sender.gold,
          },
          received: {
            items: trade.receiver.items,
            gold: trade.receiver.gold - receiverTax,
          },
          tax: senderTax,
        },
        receiver: {
          playerId: trade.receiver.playerId,
          gave: {
            items: trade.receiver.items,
            gold: trade.receiver.gold,
          },
          received: {
            items: trade.sender.items,
            gold: trade.sender.gold - senderTax,
          },
          tax: receiverTax,
        },
        completedAt: Date.now(),
      };

      // Update stats
      this.stats.totalTrades++;
      this.stats.totalGoldTraded += trade.sender.gold + trade.receiver.gold;
      this.stats.totalItemsTraded += trade.sender.items.length + trade.receiver.items.length;

      // Add to history
      this._addToHistory(trade.sender.playerId, result);
      this._addToHistory(trade.receiver.playerId, result);

      // Update trade status
      trade.status = TRADE_STATUS.COMPLETED;
      trade.completedAt = Date.now();

      this._emit("trade:completed", { trade, result });

      // Remove from active trades
      this.activeTrades.delete(tradeId);

      return result;
    }

    _addToHistory(playerId, tradeResult) {
      if (!this.options.enableTradeHistory) return;

      const history = this.tradeHistory.get(playerId) || [];
      history.unshift(tradeResult);

      // Keep last 100 trades
      if (history.length > 100) {
        history.length = 100;
      }

      this.tradeHistory.set(playerId, history);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[TradingSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  TradingSystem.TRADE_STATUS = TRADE_STATUS;
  TradingSystem.TRADE_LIMITS = TRADE_LIMITS;

  return TradingSystem;
});

