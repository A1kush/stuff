/**
 * CasinoSystem.js - Casino & Gambling Mini-Games
 * @version 1.0.0
 * @description Slots, Poker, Blackjack, Roulette, Dice, Lucky Wheel
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CasinoSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CASINO GAMES
  // ============================

  const SLOT_SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "⭐", "7️⃣"];
  
  const SLOT_PAYOUTS = {
    "🍒🍒🍒": 10,
    "🍋🍋🍋": 20,
    "🍊🍊🍊": 30,
    "🍇🍇🍇": 50,
    "💎💎💎": 100,
    "⭐⭐⭐": 500,
    "7️⃣7️⃣7️⃣": 1000,
  };

  const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i); // 0-36

  // ============================
  // CASINO SYSTEM CLASS
  // ============================

  class CasinoSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          minBet: 10,
          maxBet: 1000000,
          houseEdge: 0.05, // 5% house edge
          dailyLimit: 10000000,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Object>} Player ID -> Casino stats */
      this.playerStats = new Map();

      /** @type {Map<string, number>} Player ID -> Daily spent */
      this.dailySpent = new Map();

      /** @type {Object} Global statistics */
      this.stats = {
        totalBets: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        jackpots: 0,
        biggestWin: { player: null, amount: 0, game: null },
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("casino:ready");

      return this;
    }

    /**
     * Play slots
     * @param {string} playerId - Player ID
     * @param {number} bet - Bet amount
     * @returns {Object} Result
     */
    playSlots(playerId, bet) {
      const validation = this._validateBet(playerId, bet);
      if (!validation.valid) return validation;

      // Spin reels
      const reel1 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      const reel2 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      const reel3 = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];

      const result = `${reel1}${reel2}${reel3}`;
      const payout = SLOT_PAYOUTS[result] || 0;
      const winnings = payout * bet;

      this._updateStats(playerId, "slots", bet, winnings);

      const outcome = {
        game: "slots",
        bet,
        reels: [reel1, reel2, reel3],
        result,
        payout,
        winnings,
        profit: winnings - bet,
      };

      if (payout >= 100) {
        this.stats.jackpots++;
        this._emit("casino:jackpot", { playerId, game: "slots", winnings });
      }

      this._emit("casino:slots_played", outcome);

      return outcome;
    }

    /**
     * Play roulette
     * @param {string} playerId - Player ID
     * @param {number} bet - Bet amount
     * @param {Object} betType - { type: 'number'|'color'|'even'|'odd', value: any }
     * @returns {Object} Result
     */
    playRoulette(playerId, bet, betType) {
      const validation = this._validateBet(playerId, bet);
      if (!validation.valid) return validation;

      // Spin wheel
      const result = ROULETTE_NUMBERS[Math.floor(Math.random() * ROULETTE_NUMBERS.length)];
      const isRed = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(result);
      const isBlack = result !== 0 && !isRed;
      const isEven = result !== 0 && result % 2 === 0;
      const isOdd = result !== 0 && result % 2 === 1;

      let winnings = 0;

      // Check win conditions
      if (betType.type === "number" && betType.value === result) {
        winnings = bet * 35; // 35:1 payout
      } else if (betType.type === "color") {
        if ((betType.value === "red" && isRed) || (betType.value === "black" && isBlack)) {
          winnings = bet * 2; // 1:1 payout
        }
      } else if (betType.type === "even" && isEven) {
        winnings = bet * 2;
      } else if (betType.type === "odd" && isOdd) {
        winnings = bet * 2;
      }

      this._updateStats(playerId, "roulette", bet, winnings);

      const outcome = {
        game: "roulette",
        bet,
        betType,
        result,
        color: isRed ? "red" : isBlack ? "black" : "green",
        winnings,
        profit: winnings - bet,
      };

      if (betType.type === "number" && winnings > 0) {
        this.stats.jackpots++;
        this._emit("casino:jackpot", { playerId, game: "roulette", winnings });
      }

      this._emit("casino:roulette_played", outcome);

      return outcome;
    }

    /**
     * Play dice
     * @param {string} playerId - Player ID
     * @param {number} bet - Bet amount
     * @param {string} prediction - 'high' (8-12) or 'low' (2-6) or 'seven'
     * @returns {Object} Result
     */
    playDice(playerId, bet, prediction) {
      const validation = this._validateBet(playerId, bet);
      if (!validation.valid) return validation;

      // Roll two dice
      const die1 = Math.floor(Math.random() * 6) + 1;
      const die2 = Math.floor(Math.random() * 6) + 1;
      const total = die1 + die2;

      let winnings = 0;

      if (prediction === "seven" && total === 7) {
        winnings = bet * 5; // 4:1 payout
      } else if (prediction === "high" && total >= 8 && total <= 12) {
        winnings = bet * 2; // 1:1 payout
      } else if (prediction === "low" && total >= 2 && total <= 6) {
        winnings = bet * 2; // 1:1 payout
      }

      this._updateStats(playerId, "dice", bet, winnings);

      const outcome = {
        game: "dice",
        bet,
        prediction,
        dice: [die1, die2],
        total,
        winnings,
        profit: winnings - bet,
      };

      this._emit("casino:dice_played", outcome);

      return outcome;
    }

    /**
     * Play lucky wheel
     * @param {string} playerId - Player ID
     * @param {number} bet - Bet amount
     * @returns {Object} Result
     */
    playLuckyWheel(playerId, bet) {
      const validation = this._validateBet(playerId, bet);
      if (!validation.valid) return validation;

      const wheelSegments = [
        { prize: 0, chance: 0.4 }, // 40% - Nothing
        { prize: 1, chance: 0.3 }, // 30% - 1x
        { prize: 2, chance: 0.15 }, // 15% - 2x
        { prize: 5, chance: 0.08 }, // 8% - 5x
        { prize: 10, chance: 0.05 }, // 5% - 10x
        { prize: 50, chance: 0.015 }, // 1.5% - 50x
        { prize: 100, chance: 0.004 }, // 0.4% - 100x
        { prize: 1000, chance: 0.001 }, // 0.1% - 1000x JACKPOT!
      ];

      const roll = Math.random();
      let cumulative = 0;
      let multiplier = 0;

      for (const segment of wheelSegments) {
        cumulative += segment.chance;
        if (roll <= cumulative) {
          multiplier = segment.prize;
          break;
        }
      }

      const winnings = bet * multiplier;

      this._updateStats(playerId, "wheel", bet, winnings);

      const outcome = {
        game: "wheel",
        bet,
        multiplier,
        winnings,
        profit: winnings - bet,
      };

      if (multiplier >= 100) {
        this.stats.jackpots++;
        this._emit("casino:jackpot", { playerId, game: "wheel", winnings });
      }

      this._emit("casino:wheel_played", outcome);

      return outcome;
    }

    /**
     * Play blackjack (simplified)
     * @param {string} playerId - Player ID
     * @param {number} bet - Bet amount
     * @returns {Object} Game session
     */
    playBlackjack(playerId, bet) {
      const validation = this._validateBet(playerId, bet);
      if (!validation.valid) return validation;

      // Simple version: deal 2 cards to player and dealer
      const playerCards = [this._drawCard(), this._drawCard()];
      const dealerCards = [this._drawCard(), this._drawCard()];

      const playerTotal = this._calculateBlackjackHand(playerCards);
      const dealerTotal = this._calculateBlackjackHand(dealerCards);

      let winnings = 0;
      let result = "loss";

      if (playerTotal === 21) {
        result = "blackjack";
        winnings = bet * 2.5; // 3:2 payout
      } else if (playerTotal > 21) {
        result = "bust";
        winnings = 0;
      } else if (dealerTotal > 21) {
        result = "dealer_bust";
        winnings = bet * 2;
      } else if (playerTotal > dealerTotal) {
        result = "win";
        winnings = bet * 2;
      } else if (playerTotal === dealerTotal) {
        result = "push";
        winnings = bet; // Return bet
      }

      this._updateStats(playerId, "blackjack", bet, winnings);

      const outcome = {
        game: "blackjack",
        bet,
        playerCards,
        dealerCards,
        playerTotal,
        dealerTotal,
        result,
        winnings,
        profit: winnings - bet,
      };

      this._emit("casino:blackjack_played", outcome);

      return outcome;
    }

    /**
     * Get player stats
     * @param {string} playerId - Player ID
     * @returns {Object} Stats
     */
    getPlayerStats(playerId) {
      return this.playerStats.get(playerId) || null;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerStats: Array.from(this.playerStats.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerStats.clear();
      if (data.playerStats) {
        data.playerStats.forEach(([playerId, stats]) => {
          this.playerStats.set(playerId, stats);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("casino:loaded");
    }

    // Private methods
    _validateBet(playerId, bet) {
      if (bet < this.options.minBet) {
        return { valid: false, error: `Minimum bet is ${this.options.minBet}` };
      }

      if (bet > this.options.maxBet) {
        return { valid: false, error: `Maximum bet is ${this.options.maxBet}` };
      }

      const dailySpent = this.dailySpent.get(playerId) || 0;
      if (dailySpent + bet > this.options.dailyLimit) {
        return { valid: false, error: "Daily limit reached" };
      }

      return { valid: true };
    }

    _updateStats(playerId, game, bet, winnings) {
      const playerStats = this.playerStats.get(playerId) || {
        totalBets: 0,
        totalWagered: 0,
        totalWon: 0,
        totalLost: 0,
        byGame: {},
      };

      playerStats.totalBets++;
      playerStats.totalWagered += bet;

      if (winnings > bet) {
        playerStats.totalWon += winnings - bet;
      } else {
        playerStats.totalLost += bet - winnings;
      }

      if (!playerStats.byGame[game]) {
        playerStats.byGame[game] = { bets: 0, wagered: 0, won: 0, lost: 0 };
      }

      playerStats.byGame[game].bets++;
      playerStats.byGame[game].wagered += bet;

      if (winnings > bet) {
        playerStats.byGame[game].won += winnings - bet;
      } else {
        playerStats.byGame[game].lost += bet - winnings;
      }

      this.playerStats.set(playerId, playerStats);

      // Update global stats
      this.stats.totalBets++;
      this.stats.totalWagered += bet;

      if (winnings > bet) {
        this.stats.totalWon += winnings - bet;
      } else {
        this.stats.totalLost += bet - winnings;
      }

      if (winnings > this.stats.biggestWin.amount) {
        this.stats.biggestWin = {
          player: playerId,
          amount: winnings,
          game,
        };
      }

      // Update daily spent
      const dailySpent = this.dailySpent.get(playerId) || 0;
      this.dailySpent.set(playerId, dailySpent + bet);
    }

    _drawCard() {
      const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
      return ranks[Math.floor(Math.random() * ranks.length)];
    }

    _calculateBlackjackHand(cards) {
      let total = 0;
      let aces = 0;

      for (const card of cards) {
        if (card === "A") {
          aces++;
          total += 11;
        } else if (["J", "Q", "K"].includes(card)) {
          total += 10;
        } else {
          total += parseInt(card);
        }
      }

      // Adjust for aces
      while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
      }

      return total;
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CasinoSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CasinoSystem.SLOT_SYMBOLS = SLOT_SYMBOLS;
  CasinoSystem.SLOT_PAYOUTS = SLOT_PAYOUTS;

  return CasinoSystem;
});

