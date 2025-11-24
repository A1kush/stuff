import { createRNG } from "./rng.js";

/**
 * Offline economy sandbox. Designers can tweak currency balances and roll events
 * to verify Bond Sparks, Reputation Shards, and auction logic without a server.
 */
export class EconomySimulator {
  constructor(events = []) {
    this.events = events;
    this.seedValue = "sgc-default";
    this.rng = createRNG(this.seedValue);
    this.currencies = {
      gold: 2500,
      bond_sparks: 12,
      reputation_shards: 10,
      clan_relics: 0,
      honor_score: 50,
      ingredients: 0,
      battle_bonds: 0
    };
    this.roster = [];
  }

  setRoster(heroes) {
    this.roster = heroes;
  }

  setSeed(seed) {
    this.seedValue = seed || "sgc-default";
    this.rng = createRNG(this.seedValue);
  }

  getSeed() {
    return this.seedValue;
  }

  getCurrencies() {
    return { ...this.currencies };
  }

  serializeState() {
    return {
      seed: this.seedValue,
      currencies: this.getCurrencies()
    };
  }

  loadState(snapshot = {}) {
    if (snapshot.seed) {
      this.setSeed(snapshot.seed);
    }
    if (snapshot.currencies) {
      this.currencies = { ...this.currencies, ...snapshot.currencies };
    }
  }

  rollEvent(playstyle = "balanced") {
    const weights = this.events.map((event) => computeWeight(event, this.currencies, playstyle));
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = this.rng.range(0, total);
    let picked = this.events[0];
    for (let i = 0; i < weights.length; i++) {
      if (roll <= weights[i]) {
        picked = this.events[i];
        break;
      }
      roll -= weights[i];
    }

    let detail = "";
    let rewards = {};
    if (picked.rewards.auction) {
      const lots = this.buildAuctionLots();
      detail = `Voidgreen caravan offers ${lots.map((lot) => lot.name).join(", ")}`;
      rewards = { auctionLots: lots };
    } else {
      rewards = { ...picked.rewards };
      this.applyRewards(rewards);
      detail = formatRewards(rewards);
    }

    return {
      event: picked,
      detail,
      rewards,
      currencies: this.getCurrencies()
    };
  }

  applyRewards(rewards) {
    Object.entries(rewards).forEach(([key, value]) => {
      if (key === "auctionLots") return;
      if (typeof value !== "number") return;
      if (typeof this.currencies[key] !== "number") {
        this.currencies[key] = 0;
      }
      this.currencies[key] += value;
    });
  }

  evaluateHire(hero) {
    if (!hero) return { canAfford: false, shortfall: {} };
    const shortfall = {};
    let canAfford = true;
    Object.entries(hero.acquisition.costs).forEach(([currency, amount]) => {
      const owned = this.currencies[currency] || 0;
      if (owned < amount) {
        canAfford = false;
        shortfall[currency] = amount - owned;
      }
    });
    return { canAfford, shortfall };
  }

  buildAuctionLots() {
    const premium = this.roster.filter((hero) => ["S", "SS", "SSS"].includes(hero.rank));
    const lots = [];
    for (let i = 0; i < Math.min(3, premium.length); i++) {
      const pick = this.rng.pick(premium);
      if (!pick) break;
      lots.push({
        id: pick.id,
        name: pick.name,
        cost: scaleCost(pick.acquisition.costs, 0.85 + this.rng.next() * 0.3)
      });
    }
    return lots;
  }
}

function computeWeight(event, currencies, playstyle) {
  let weight = event.baseWeight || 0.1;
  (event.modifiers || []).forEach((mod) => {
    if (mod.type === "playstyle" && mod.value === playstyle) {
      weight *= mod.multiplier;
    }
    if (mod.type === "currency") {
      const current = currencies[mod.value] || 0;
      if (current >= (mod.threshold || 0)) {
        weight *= mod.multiplier;
      }
    }
  });
  return weight;
}

function scaleCost(costs, factor) {
  return Object.fromEntries(
    Object.entries(costs).map(([currency, amount]) => [currency, Math.round(amount * factor)])
  );
}

function formatRewards(rewards) {
  return Object.entries(rewards)
    .filter(([key]) => key !== "auction")
    .map(([key, value]) => `${value} ${key}`)
    .join(", ");
}
