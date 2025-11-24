/**
 * CardGameSystem.js - Collectible Card Battles
 * @version 1.0.0
 * @description Deck building, card battles, tournaments, card collection
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CardGameSystem = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ============================
  // CARD COLLECTION (60 Cards)
  // ============================

  const CARDS = {
    // Common (20)
    goblin: { id: "goblin", name: "Goblin", rarity: "common", cost: 1, atk: 2, hp: 1, effect: null },
    wolf: { id: "wolf", name: "Wolf", rarity: "common", cost: 2, atk: 3, hp: 2, effect: null },
    archer: { id: "archer", name: "Archer", rarity: "common", cost: 2, atk: 2, hp: 3, effect: null },
    knight: { id: "knight", name: "Knight", rarity: "common", cost: 3, atk: 3, hp: 4, effect: null },
    mage: { id: "mage", name: "Mage", rarity: "common", cost: 3, atk: 4, hp: 2, effect: "draw" },
    
    // Uncommon (15)
    dragon_whelp: { id: "dragon_whelp", name: "Dragon Whelp", rarity: "uncommon", cost: 4, atk: 5, hp: 4, effect: "burn" },
    necromancer: { id: "necromancer", name: "Necromancer", rarity: "uncommon", cost: 5, atk: 3, hp: 5, effect: "summon" },
    paladin: { id: "paladin", name: "Paladin", rarity: "uncommon", cost: 5, atk: 4, hp: 6, effect: "heal" },
    
    // Rare (15)
    phoenix: { id: "phoenix", name: "Phoenix", rarity: "rare", cost: 6, atk: 6, hp: 5, effect: "revive" },
    void_mage: { id: "void_mage", name: "Void Mage", rarity: "rare", cost: 7, atk: 8, hp: 4, effect: "exile" },
    titan: { id: "titan", name: "Titan", rarity: "rare", cost: 8, atk: 10, hp: 8, effect: "shield" },
    
    // Legendary (10)
    god_slayer: { id: "god_slayer", name: "God Slayer", rarity: "legendary", cost: 10, atk: 15, hp: 10, effect: "ultimate" },
    primordial_dragon: { id: "primordial_dragon", name: "Primordial Dragon", rarity: "legendary", cost: 12, atk: 20, hp: 15, effect: "domination" },
  };

  const CARD_KEYS = Object.keys(CARDS);

  // ============================
  // CARD GAME SYSTEM CLASS
  // ============================

  class CardGameSystem {
    constructor(options = {}) {
      this.options = Object.assign(
        {
          startingDeckSize: 30,
          maxDeckSize: 60,
          handSize: 5,
          maxMana: 10,
          eventBus: null,
          debug: false,
        },
        options
      );

      /** @type {Map<string, Set>} Player ID -> Card collection */
      this.playerCollections = new Map();

      /** @type {Map<string, Array>} Player ID -> Decks */
      this.playerDecks = new Map();

      /** @type {Map<string, Object>} Match ID -> Match data */
      this.activeMatches = new Map();

      /** @type {Object} Statistics */
      this.stats = {
        totalMatches: 0,
        totalWins: 0,
        cardsPlayed: 0,
      };

      this.eventBus =
        this.options.eventBus ||
        (typeof window !== "undefined" && window.EventBus);
      this.initialized = false;
    }

    init() {
      if (this.initialized) return this;

      this.initialized = true;
      this._emit("cardgame:ready", { cards: CARD_KEYS.length });

      return this;
    }

    /**
     * Give player starter deck
     * @param {string} playerId - Player ID
     * @returns {Set} Card collection
     */
    giveStarterDeck(playerId) {
      const collection = new Set();

      // Add 30 random common cards
      const commonCards = CARD_KEYS.filter((id) => CARDS[id].rarity === "common");

      for (let i = 0; i < this.options.startingDeckSize; i++) {
        const randomCard = commonCards[Math.floor(Math.random() * commonCards.length)];
        collection.add(randomCard);
      }

      this.playerCollections.set(playerId, collection);

      // Create default deck
      this.createDeck(playerId, "Default", Array.from(collection));

      this._emit("cardgame:starter_deck", { playerId, collection });

      return collection;
    }

    /**
     * Add card to collection
     * @param {string} playerId - Player ID
     * @param {string} cardId - Card ID
     * @returns {boolean} Success
     */
    addCard(playerId, cardId) {
      if (!CARDS[cardId]) return false;

      const collection = this.playerCollections.get(playerId) || new Set();
      collection.add(cardId);

      this.playerCollections.set(playerId, collection);

      this._emit("cardgame:card_obtained", { playerId, cardId });

      return true;
    }

    /**
     * Create deck
     * @param {string} playerId - Player ID
     * @param {string} name - Deck name
     * @param {Array} cards - Card IDs
     * @returns {Object} Deck
     */
    createDeck(playerId, name, cards) {
      if (cards.length < this.options.startingDeckSize || cards.length > this.options.maxDeckSize) {
        return { error: `Deck must be ${this.options.startingDeckSize}-${this.options.maxDeckSize} cards` };
      }

      const decks = this.playerDecks.get(playerId) || [];

      const deck = {
        id: `deck_${Date.now()}`,
        name,
        cards,
        createdAt: Date.now(),
      };

      decks.push(deck);
      this.playerDecks.set(playerId, decks);

      this._emit("cardgame:deck_created", { playerId, deck });

      return deck;
    }

    /**
     * Start match
     * @param {string} player1Id - Player 1 ID
     * @param {string} player2Id - Player 2 ID
     * @param {string} deck1Id - Player 1 deck ID
     * @param {string} deck2Id - Player 2 deck ID
     * @returns {Object} Match
     */
    startMatch(player1Id, player2Id, deck1Id, deck2Id) {
      const player1Decks = this.playerDecks.get(player1Id) || [];
      const player2Decks = this.playerDecks.get(player2Id) || [];

      const deck1 = player1Decks.find((d) => d.id === deck1Id);
      const deck2 = player2Decks.find((d) => d.id === deck2Id);

      if (!deck1 || !deck2) {
        return { error: "Invalid decks" };
      }

      const matchId = `match_${Date.now()}`;

      const match = {
        id: matchId,
        players: {
          player1: {
            id: player1Id,
            deck: [...deck1.cards],
            hand: [],
            field: [],
            graveyard: [],
            hp: 30,
            mana: 1,
            maxMana: 1,
          },
          player2: {
            id: player2Id,
            deck: [...deck2.cards],
            hand: [],
            field: [],
            graveyard: [],
            hp: 30,
            mana: 0,
            maxMana: 0,
          },
        },
        currentTurn: "player1",
        turn: 1,
        status: "active",
        startedAt: Date.now(),
      };

      // Draw starting hands
      this._drawCards(match.players.player1, this.options.handSize);
      this._drawCards(match.players.player2, this.options.handSize);

      // Shuffle decks
      this._shuffleDeck(match.players.player1.deck);
      this._shuffleDeck(match.players.player2.deck);

      this.activeMatches.set(matchId, match);

      this.stats.totalMatches++;

      this._emit("cardgame:match_started", { match });

      return match;
    }

    /**
     * Play card
     * @param {string} matchId - Match ID
     * @param {string} playerId - Player ID
     * @param {number} handIndex - Card index in hand
     * @returns {Object} Result
     */
    playCard(matchId, playerId, handIndex) {
      const match = this.activeMatches.get(matchId);
      if (!match || match.status !== "active") {
        return { error: "Invalid match" };
      }

      const playerKey = match.players.player1.id === playerId ? "player1" : "player2";
      const player = match.players[playerKey];

      if (match.currentTurn !== playerKey) {
        return { error: "Not your turn" };
      }

      const cardId = player.hand[handIndex];
      if (!cardId) {
        return { error: "Invalid card" };
      }

      const card = CARDS[cardId];

      if (card.cost > player.mana) {
        return { error: "Not enough mana" };
      }

      // Play card
      player.hand.splice(handIndex, 1);
      player.field.push(cardId);
      player.mana -= card.cost;

      this.stats.cardsPlayed++;

      // Apply card effect
      this._applyCardEffect(match, playerKey, card);

      this._emit("cardgame:card_played", { matchId, playerId, card });

      return { success: true, card };
    }

    /**
     * Attack
     * @param {string} matchId - Match ID
     * @param {string} playerId - Player ID
     * @param {number} attackerIndex - Attacker card index
     * @param {number} targetIndex - Target card index (-1 for player)
     * @returns {Object} Result
     */
    attack(matchId, playerId, attackerIndex, targetIndex = -1) {
      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Invalid match" };

      const playerKey = match.players.player1.id === playerId ? "player1" : "player2";
      const opponentKey = playerKey === "player1" ? "player2" : "player1";

      const attacker = match.players[playerKey].field[attackerIndex];
      if (!attacker) return { error: "Invalid attacker" };

      const attackerCard = CARDS[attacker];

      if (targetIndex === -1) {
        // Attack player directly
        match.players[opponentKey].hp -= attackerCard.atk;

        this._emit("cardgame:direct_attack", { matchId, damage: attackerCard.atk });
      } else {
        // Attack card
        const target = match.players[opponentKey].field[targetIndex];
        if (!target) return { error: "Invalid target" };

        const targetCard = CARDS[target];

        // Mutual damage
        targetCard.hp -= attackerCard.atk;
        attackerCard.hp -= targetCard.atk;

        // Check if cards died
        if (targetCard.hp <= 0) {
          match.players[opponentKey].field.splice(targetIndex, 1);
          match.players[opponentKey].graveyard.push(target);
        }

        if (attackerCard.hp <= 0) {
          match.players[playerKey].field.splice(attackerIndex, 1);
          match.players[playerKey].graveyard.push(attacker);
        }

        this._emit("cardgame:card_attack", { matchId, attacker, target });
      }

      // Check win condition
      if (match.players[opponentKey].hp <= 0) {
        return this._endMatch(matchId, playerKey);
      }

      return { success: true };
    }

    /**
     * End turn
     * @param {string} matchId - Match ID
     * @param {string} playerId - Player ID
     * @returns {Object} Match
     */
    endTurn(matchId, playerId) {
      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Invalid match" };

      const playerKey = match.players.player1.id === playerId ? "player1" : "player2";

      if (match.currentTurn !== playerKey) {
        return { error: "Not your turn" };
      }

      // Switch turns
      match.currentTurn = playerKey === "player1" ? "player2" : "player1";
      match.turn++;

      const nextPlayer = match.players[match.currentTurn];

      // Increase mana
      nextPlayer.maxMana = Math.min(this.options.maxMana, nextPlayer.maxMana + 1);
      nextPlayer.mana = nextPlayer.maxMana;

      // Draw card
      this._drawCards(nextPlayer, 1);

      this._emit("cardgame:turn_end", { matchId, nextPlayer: match.currentTurn });

      return match;
    }

    /**
     * Serialize for saving
     * @returns {Object}
     */
    serialize() {
      return {
        playerCollections: Array.from(this.playerCollections.entries()).map(([id, set]) => [
          id,
          Array.from(set),
        ]),
        playerDecks: Array.from(this.playerDecks.entries()),
        stats: this.stats,
      };
    }

    /**
     * Deserialize from save
     * @param {Object} data - Save data
     */
    deserialize(data) {
      if (!data) return;

      this.playerCollections.clear();
      if (data.playerCollections) {
        data.playerCollections.forEach(([id, arr]) => {
          this.playerCollections.set(id, new Set(arr));
        });
      }

      this.playerDecks.clear();
      if (data.playerDecks) {
        data.playerDecks.forEach(([playerId, decks]) => {
          this.playerDecks.set(playerId, decks);
        });
      }

      if (data.stats) {
        Object.assign(this.stats, data.stats);
      }

      this._emit("cardgame:loaded");
    }

    // Private methods
    _drawCards(player, count) {
      for (let i = 0; i < count; i++) {
        if (player.deck.length > 0) {
          player.hand.push(player.deck.pop());
        }
      }
    }

    _shuffleDeck(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }

    _applyCardEffect(match, playerKey, card) {
      const player = match.players[playerKey];
      const opponent = match.players[playerKey === "player1" ? "player2" : "player1"];

      switch (card.effect) {
        case "draw":
          this._drawCards(player, 1);
          break;
        case "burn":
          opponent.hp -= 2;
          break;
        case "heal":
          player.hp += 3;
          break;
        // Add more effects as needed
      }
    }

    _endMatch(matchId, winnerId) {
      const match = this.activeMatches.get(matchId);
      if (!match) return { error: "Match not found" };

      match.status = "completed";
      match.winner = winnerId;
      match.endedAt = Date.now();

      if (winnerId === match.players.player1.id) {
        this.stats.totalWins++;
      }

      this._emit("cardgame:match_ended", { match });

      this.activeMatches.delete(matchId);

      return { success: true, winner: winnerId, match };
    }

    _emit(event, data) {
      if (this.eventBus && typeof this.eventBus.emit === "function") {
        try {
          this.eventBus.emit(event, data);
        } catch (err) {
          console.error("[CardGameSystem] Event emit failed:", err);
        }
      }
    }
  }

  // Expose constants
  CardGameSystem.CARDS = CARDS;
  CardGameSystem.CARD_KEYS = CARD_KEYS;

  return CardGameSystem;
});

