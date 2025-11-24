/**
 * AuctionHouseSystem.js - Player Auction House
 * @version 1.0.0
 * @description Bidding, buyout, market prices, auction history
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.AuctionHouseSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // AUCTION CONSTANTS
  // ============================

  const AUCTION_DURATIONS = {
    SHORT: 3600000, // 1 hour
    MEDIUM: 10800000, // 3 hours
    LONG: 86400000, // 24 hours
    EXTENDED: 259200000, // 3 days
  };

  const AUCTION_FEES = {
    LISTING_FEE: 0.05, // 5% of starting bid
    SUCCESS_FEE: 0.10, // 10% of final price
    BUYOUT_FEE: 0.08, // 8% of buyout price
  };

  // ============================
  // AUCTION HOUSE SYSTEM CLASS
  // ============================

  class AuctionHouseSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          maxActiveAuctions: 10,
          minBidIncrement: 0.05, // 5% minimum bid increase
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Auction ID -> Auction data */
      this.activeAuctions = new Map();

      /** @type {Map<string, Array>} Player ID -> Player's auctions */
      this.playerAuctions = new Map();

      /** @type {Array} Completed auctions history */
      this.auctionHistory = [];

      /** @type {Map<string, Object>} Item ID -> Market data */
      this.marketPrices = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalAuctions: 0,
        totalSales: 0,
        totalGoldTraded: 0,
        highestSale: { item: null, price: 0 },
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("auction:ready");

      return this;
    }

    /**
     * Create auction
     * @param {string} sellerId - Seller ID
     * @param {Object} item - Item to sell
     * @param {number} startingBid - Starting bid
     * @param {number} buyoutPrice - Buyout price (optional)
     * @param {number} duration - Duration in ms
     * @returns {Object} Auction data
     */
    createAuction(sellerId, item, startingBid, buyoutPrice = null, duration = AUCTION_DURATIONS.MEDIUM) {
      // Check seller's active auctions
      const sellerAuctions = this.playerAuctions.get(sellerId) || [];
      if (sellerAuctions.length >= this.options.maxActiveAuctions) {
        return { error: `Max ${this.options.maxActiveAuctions} active auctions` };
      }

      // Validate prices
      if (startingBid <= 0) {
        return { error: "Starting bid must be positive" };
      }

      if (buyoutPrice && buyoutPrice <= startingBid) {
        return { error: "Buyout price must be higher than starting bid" };
      }

      // Calculate listing fee
      const listingFee = Math.floor(startingBid * AUCTION_FEES.LISTING_FEE);

      const auctionId = `auction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const auction = {
        id: auctionId,
        sellerId,
        item,
        startingBid,
        currentBid: startingBid,
        buyoutPrice,
        highestBidder: null,
        bids: [],
        createdAt: Date.now(),
        expiresAt: Date.now() + duration,
        duration,
        status: "active",
        listingFee,
      };

      this.activeAuctions.set(auctionId, auction);

      // Add to seller's auctions
      sellerAuctions.push(auctionId);
      this.playerAuctions.set(sellerId, sellerAuctions);

      this.stats.totalAuctions++;

      // Auto-complete after duration
      setTimeout(() => {
        this._completeAuction(auctionId);
      }, duration);

      this._emit("auction:created", { auction });

      return { success: true, auction, listingFee };
    }

    /**
     * Place bid
     * @param {string} auctionId - Auction ID
     * @param {string} bidderId - Bidder ID
     * @param {number} bidAmount - Bid amount
     * @returns {Object} Result
     */
    placeBid(auctionId, bidderId, bidAmount) {
      const auction = this.activeAuctions.get(auctionId);
      if (!auction || auction.status !== "active") {
        return { error: "Auction not available" };
      }

      // Can't bid on own auction
      if (auction.sellerId === bidderId) {
        return { error: "Cannot bid on your own auction" };
      }

      // Check if auction expired
      if (Date.now() > auction.expiresAt) {
        return { error: "Auction has expired" };
      }

      // Validate bid amount
      const minBid = Math.ceil(auction.currentBid * (1 + this.options.minBidIncrement));

      if (bidAmount < minBid) {
        return { error: `Minimum bid is ${minBid} gold` };
      }

      // Refund previous highest bidder
      if (auction.highestBidder) {
        this._emit("auction:outbid", {
          auctionId,
          bidderId: auction.highestBidder,
          refund: auction.currentBid,
        });
      }

      // Update auction
      auction.currentBid = bidAmount;
      auction.highestBidder = bidderId;
      auction.bids.push({
        bidderId,
        amount: bidAmount,
        timestamp: Date.now(),
      });

      this._emit("auction:bid_placed", { auction, bidderId, bidAmount });

      return { success: true, auction };
    }

    /**
     * Buyout auction
     * @param {string} auctionId - Auction ID
     * @param {string} buyerId - Buyer ID
     * @returns {Object} Result
     */
    buyout(auctionId, buyerId) {
      const auction = this.activeAuctions.get(auctionId);
      if (!auction || auction.status !== "active") {
        return { error: "Auction not available" };
      }

      if (!auction.buyoutPrice) {
        return { error: "No buyout price set" };
      }

      // Can't buy own auction
      if (auction.sellerId === buyerId) {
        return { error: "Cannot buy your own auction" };
      }

      // Refund previous highest bidder if exists
      if (auction.highestBidder) {
        this._emit("auction:outbid", {
          auctionId,
          bidderId: auction.highestBidder,
          refund: auction.currentBid,
        });
      }

      // Calculate fees
      const buyoutFee = Math.floor(auction.buyoutPrice * AUCTION_FEES.BUYOUT_FEE);
      const sellerReceives = auction.buyoutPrice - buyoutFee;

      // Update auction
      auction.status = "sold";
      auction.buyerId = buyerId;
      auction.finalPrice = auction.buyoutPrice;
      auction.soldAt = Date.now();
      auction.soldVia = "buyout";
      auction.fee = buyoutFee;

      // Update stats
      this.stats.totalSales++;
      this.stats.totalGoldTraded += auction.buyoutPrice;

      if (auction.buyoutPrice > this.stats.highestSale.price) {
        this.stats.highestSale = {
          item: auction.item,
          price: auction.buyoutPrice,
        };
      }

      // Update market prices
      this._updateMarketPrice(auction.item.id, auction.buyoutPrice);

      // Add to history
      this.auctionHistory.unshift(auction);
      if (this.auctionHistory.length > 1000) {
        this.auctionHistory.length = 1000;
      }

      this._emit("auction:buyout", { auction, buyerId, sellerReceives });

      // Remove from active auctions
      this.activeAuctions.delete(auctionId);

      return { success: true, paid: auction.buyoutPrice, received: auction.item };
    }

    /**
     * Cancel auction
     * @param {string} auctionId - Auction ID
     * @param {string} sellerId - Seller ID
     * @returns {Object} Result
     */
    cancelAuction(auctionId, sellerId) {
      const auction = this.activeAuctions.get(auctionId);
      if (!auction || auction.status !== "active") {
        return { error: "Auction not available" };
      }

      // Only seller can cancel
      if (auction.sellerId !== sellerId) {
        return { error: "Not your auction" };
      }

      // Can't cancel if there are bids
      if (auction.highestBidder) {
        return { error: "Cannot cancel auction with bids" };
      }

      // Refund listing fee (50%)
      const refund = Math.floor(auction.listingFee * 0.5);

      auction.status = "cancelled";
      auction.cancelledAt = Date.now();

      this._emit("auction:cancelled", { auction, refund });

      this.activeAuctions.delete(auctionId);

      return { success: true, refund };
    }

    /**
     * Search auctions
     * @param {Object} filters - Search filters
     * @returns {Array} Matching auctions
     */
    searchAuctions(filters = {}) {
      let results = Array.from(this.activeAuctions.values()).filter(
        (a) => a.status === "active"
      );

      // Filter by item name
      if (filters.name) {
        const searchTerm = filters.name.toLowerCase();
        results = results.filter((a) =>
          a.item.name.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by rarity
      if (filters.rarity) {
        results = results.filter((a) => a.item.rarity === filters.rarity);
      }

      // Filter by price range
      if (filters.minPrice) {
        results = results.filter((a) => a.currentBid >= filters.minPrice);
      }
      if (filters.maxPrice) {
        results = results.filter((a) => a.currentBid <= filters.maxPrice);
      }

      // Sort
      if (filters.sort === "price_asc") {
        results.sort((a, b) => a.currentBid - b.currentBid);
      } else if (filters.sort === "price_desc") {
        results.sort((a, b) => b.currentBid - a.currentBid);
      } else if (filters.sort === "time_left") {
        results.sort((a, b) => a.expiresAt - b.expiresAt);
      }

      return results;
    }

    /**
     * Get market price for item
     * @param {string} itemId - Item ID
     * @returns {Object} Market data
     */
    getMarketPrice(itemId) {
      return this.marketPrices.get(itemId) || null;
    }

    /**
     * Get player's auctions
     * @param {string} playerId - Player ID
     * @returns {Array} Player's auctions
     */
    getPlayerAuctions(playerId) {
      const auctionIds = this.playerAuctions.get(playerId) || [];
      return auctionIds
        .map((id) => this.activeAuctions.get(id))
        .filter((a) => a && a.status === "active");
    }

    /**
     * Get player's bids
     * @param {string} playerId - Player ID
     * @returns {Array} Auctions player bid on
     */
    getPlayerBids(playerId) {
      return Array.from(this.activeAuctions.values()).filter(
        (a) => a.status === "active" && a.highestBidder === playerId
      );
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        activeAuctions: Array.from(this.activeAuctions.entries()),
        playerAuctions: Array.from(this.playerAuctions.entries()),
        auctionHistory: this.auctionHistory.slice(0, 100),
        marketPrices: Array.from(this.marketPrices.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.activeAuctions.clear();
      if (data.activeAuctions) {
        data.activeAuctions.forEach(([id, auction]) => {
          this.activeAuctions.set(id, auction);
        });
      }

      this.playerAuctions.clear();
      if (data.playerAuctions) {
        data.playerAuctions.forEach(([playerId, auctions]) => {
          this.playerAuctions.set(playerId, auctions);
        });
      }

      if (data.auctionHistory) {
        this.auctionHistory = data.auctionHistory;
      }

      this.marketPrices.clear();
      if (data.marketPrices) {
        data.marketPrices.forEach(([itemId, data]) => {
          this.marketPrices.set(itemId, data);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("auction:loaded");
    }

    // Private methods
    _completeAuction(auctionId) {
      const auction = this.activeAuctions.get(auctionId);
      if (!auction || auction.status !== "active") return;

      if (auction.highestBidder) {
        // Auction sold
        const successFee = Math.floor(auction.currentBid * AUCTION_FEES.SUCCESS_FEE);
        const sellerReceives = auction.currentBid - successFee;

        auction.status = "sold";
        auction.buyerId = auction.highestBidder;
        auction.finalPrice = auction.currentBid;
        auction.soldAt = Date.now();
        auction.soldVia = "auction";
        auction.fee = successFee;

        this.stats.totalSales++;
        this.stats.totalGoldTraded += auction.currentBid;

        if (auction.currentBid > this.stats.highestSale.price) {
          this.stats.highestSale = {
            item: auction.item,
            price: auction.currentBid,
          };
        }

        this._updateMarketPrice(auction.item.id, auction.currentBid);

        this._emit("auction:sold", { auction, sellerReceives });
      } else {
        // No bids - return item
        auction.status = "unsold";
        auction.expiredAt = Date.now();

        this._emit("auction:unsold", { auction });
      }

      // Add to history
      this.auctionHistory.unshift(auction);
      if (this.auctionHistory.length > 1000) {
        this.auctionHistory.length = 1000;
      }

      // Remove from active
      this.activeAuctions.delete(auctionId);
    }

    _updateMarketPrice(itemId, price) {
      const marketData = this.marketPrices.get(itemId) || {
        itemId,
        prices: [],
        averagePrice: 0,
        lowestPrice: price,
        highestPrice: price,
        lastSold: Date.now(),
      };

      marketData.prices.push(price);
      if (marketData.prices.length > 100) {
        marketData.prices.shift();
      }

      marketData.averagePrice = Math.floor(
        marketData.prices.reduce((a, b) => a + b, 0) / marketData.prices.length
      );
      marketData.lowestPrice = Math.min(marketData.lowestPrice, price);
      marketData.highestPrice = Math.max(marketData.highestPrice, price);
      marketData.lastSold = Date.now();

      this.marketPrices.set(itemId, marketData);
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[AuctionHouseSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  AuctionHouseSystem.AUCTION_DURATIONS = AUCTION_DURATIONS;
  AuctionHouseSystem.AUCTION_FEES = AUCTION_FEES;

  return AuctionHouseSystem;
});

