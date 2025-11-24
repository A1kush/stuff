// NPC & Enemy Rank System Bundle v1.0.0
// Production-ready • Works offline • Zero dependencies
// Generated: Auto-generated bundle
// ====================================================

// ===== RANK CONFIG =====
const RANK_TIERS = {
  E: {
    id: "E",
    label: "E Rank",
    accentColor: "#cffafe",
    speedMultiplier: 0.75,
    powerMultiplier: 0.6,
    healthMultiplier: 0.7,
    rarityWeight: 1,
  },
  D: {
    id: "D",
    label: "D Rank",
    accentColor: "#bae6fd",
    speedMultiplier: 0.85,
    powerMultiplier: 0.8,
    healthMultiplier: 0.85,
    rarityWeight: 2,
  },
  C: {
    id: "C",
    label: "C Rank",
    accentColor: "#a5b4fc",
    speedMultiplier: 0.95,
    powerMultiplier: 1.0,
    healthMultiplier: 1.0,
    rarityWeight: 3,
  },
  B: {
    id: "B",
    label: "B Rank",
    accentColor: "#fbcfe8",
    speedMultiplier: 1.05,
    powerMultiplier: 1.3,
    healthMultiplier: 1.2,
    rarityWeight: 5,
  },
  A: {
    id: "A",
    label: "A Rank",
    accentColor: "#fcd34d",
    speedMultiplier: 1.15,
    powerMultiplier: 1.6,
    healthMultiplier: 1.5,
    rarityWeight: 8,
  },
  S: {
    id: "S",
    label: "S Rank",
    accentColor: "#fca5a5",
    speedMultiplier: 1.25,
    powerMultiplier: 2.0,
    healthMultiplier: 1.8,
    rarityWeight: 13,
  },
  SS: {
    id: "SS",
    label: "SS Rank",
    accentColor: "#f472b6",
    speedMultiplier: 1.35,
    powerMultiplier: 2.5,
    healthMultiplier: 2.2,
    rarityWeight: 21,
  },
};

const CATEGORY_CONFIG = {
  hero: { label: "Hero", color: "#60a5fa", icon: "⚔️" },
  villain: { label: "Villain", color: "#dc2626", icon: "☠️" },
  npc: { label: "NPC", color: "#10b981", icon: "👤" },
  slayer: { label: "Slayer", color: "#f59e0b", icon: "🗡️" },
  hunter: { label: "Hunter", color: "#84cc16", icon: "🏹" },
  guardian: { label: "Guardian", color: "#0ea5e9", icon: "🛡️" },
  mage: { label: "Mage", color: "#8b5cf6", icon: "🔮" },
  assassin: { label: "Assassin", color: "#6b7280", icon: "🗡️" },
  support: { label: "Support", color: "#06b6d4", icon: "💚" },
  minion: { label: "Minion", color: "#78716c", icon: "👾" },
  elite: { label: "Elite", color: "#ea580c", icon: "💀" },
  boss: { label: "Boss", color: "#dc2626", icon: "👹" },
  pet: { label: "Pet", color: "#ec4899", icon: "🐾" },
  merchant: { label: "Merchant", color: "#eab308", icon: "💰" },
  crafter: { label: "Crafter", color: "#a855f7", icon: "⚒️" },
};

function createRank(tier, category) {
  const tierConfig = RANK_TIERS[tier];
  const categoryConfig = CATEGORY_CONFIG[category];
  return {
    tier,
    category,
    displayName: `${tierConfig.label} ${categoryConfig.label}`,
  };
}

function getRankTierConfig(tier) {
  return RANK_TIERS[tier];
}
function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category];
}

// ===== RANK SYSTEM =====
class RankSystem {
  constructor() {}

  static getInstance() {
    if (!RankSystem.instance) RankSystem.instance = new RankSystem();
    return RankSystem.instance;
  }

  createRank(tier, category) {
    return createRank(tier, category);
  }
  getAllTiers() {
    return ["E", "D", "C", "B", "A", "S", "SS"];
  }
  getAllCategories() {
    return [
      "hero",
      "villain",
      "npc",
      "slayer",
      "hunter",
      "guardian",
      "mage",
      "assassin",
      "support",
      "minion",
      "elite",
      "boss",
      "pet",
      "merchant",
      "crafter",
    ];
  }

  calculatePowerLevel(tier, baseLevel = 100) {
    const config = getRankTierConfig(tier);
    return Math.floor(baseLevel * config.powerMultiplier);
  }

  calculateHealth(tier, baseHealth = 100) {
    const config = getRankTierConfig(tier);
    return Math.floor(baseHealth * config.healthMultiplier);
  }

  calculateSpeed(tier, baseSpeed = 100) {
    const config = getRankTierConfig(tier);
    return Math.floor(baseSpeed * config.speedMultiplier);
  }

  compareRanks(tier1, tier2) {
    const tiers = this.getAllTiers();
    return tiers.indexOf(tier1) - tiers.indexOf(tier2);
  }

  formatRankName(tier, category) {
    const rank = this.createRank(tier, category);
    return rank.displayName;
  }

  getRankColor(tier) {
    return getRankTierConfig(tier).accentColor;
  }
  getCategoryColor(category) {
    return getCategoryConfig(category).color;
  }
}

const rankSystem = RankSystem.getInstance();

// ===== ENTITY =====
class Entity {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.rank = config.rank;
    this.stats = { ...config.stats };
    this.visuals = { ...config.visuals };
    this.tags = config.tags || [];
    this.description = config.description || "";
    this.metadata = config.metadata || {};
    this.position = { x: 0, y: 0 };
    this.isActive = true;
  }

  applyRankModifiers() {
    const tier = this.rank.tier;
    const baseStats = { ...this.stats };
    this.stats.health = rankSystem.calculateHealth(tier, baseStats.maxHealth);
    this.stats.maxHealth = this.stats.health;
    this.stats.power = rankSystem.calculatePowerLevel(tier, baseStats.power);
    this.stats.speed = rankSystem.calculateSpeed(tier, baseStats.speed);
  }

  takeDamage(amount) {
    const actualDamage = Math.max(0, amount - this.stats.defense);
    this.stats.health = Math.max(0, this.stats.health - actualDamage);
    if (this.stats.health <= 0) this.onDeath();
  }

  heal(amount) {
    this.stats.health = Math.min(
      this.stats.maxHealth,
      this.stats.health + amount
    );
  }

  isAlive() {
    return this.stats.health > 0;
  }
  onDeath() {
    this.isActive = false;
  }

  update(deltaTime) {}

  render(container) {
    if (!this.element) this.element = this.createElement();
    if (!container.contains(this.element)) container.appendChild(this.element);
    this.updateElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.className = `entity`;
    element.dataset.entityId = this.id;
    element.dataset.rank = this.rank.tier;
    element.dataset.category = this.rank.category;

    const img = document.createElement("img");
    img.src = this.visuals.assetPath;
    img.alt = this.name;
    img.style.width = "48px";
    img.style.height = "48px";
    element.appendChild(img);

    const info = document.createElement("div");
    info.className = "entity-info";
    info.textContent = this.getInfo();
    element.appendChild(info);

    return element;
  }

  updateElement() {
    if (!this.element) return;
    this.element.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    this.element.style.display = this.isActive ? "block" : "none";
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.isActive = false;
  }

  getInfo() {
    return `${this.rank.displayName} - ${this.name} (HP: ${this.stats.health}/${this.stats.maxHealth})`;
  }
}

// ===== NPC =====
class NPC extends Entity {
  constructor(config) {
    super(config);
    this.interactionType = config.interactionType || "quest_giver";
    this.dialogue = config.dialogue || [];
    this.questIds = config.questIds || [];
    this.inventory = config.inventory || [];
    this.services = config.services || [];
  }

  interact() {
    return (
      this.dialogue[Math.floor(Math.random() * this.dialogue.length)] ||
      "Hello!"
    );
  }
}

// ===== ENEMY =====
class Enemy extends Entity {
  constructor(config) {
    super(config);
    this.enemyType = config.enemyType || "minion";
    this.behavior = config.behavior || "aggressive";
    this.attackPower = config.attackPower || this.stats.power;
    this.attackRange = config.attackRange || 50;
    this.attackSpeed = config.attackSpeed || 1000;
    this.detectionRange = config.detectionRange || 150;
    this.lootTable = config.lootTable || [];
    this.experienceValue = config.experienceValue || 10;
    this.abilities = config.abilities || [];
  }

  update(deltaTime) {
    // Simple AI behavior
    switch (this.behavior) {
      case "patrol":
        this.position.x += Math.sin(Date.now() * 0.001) * 0.5;
        break;
      case "chase":
        // Would implement chasing logic here
        break;
    }
  }

  attack(target) {
    if (target && target.takeDamage) {
      target.takeDamage(this.attackPower);
    }
  }

  getLoot() {
    return (
      this.lootTable[Math.floor(Math.random() * this.lootTable.length)] || null
    );
  }

  onDeath() {
    super.onDeath();
    // Drop loot, emit events, etc.
  }
}

// ===== ENTITY MANAGER =====
class EntityManager {
  constructor() {
    this.entities = new Map();
    this.entityIdCounter = 0;
  }

  static getInstance() {
    if (!EntityManager.instance) EntityManager.instance = new EntityManager();
    return EntityManager.instance;
  }

  generateId(prefix = "entity") {
    return `${prefix}_${++this.entityIdCounter}_${Date.now()}`;
  }

  createNPC(config) {
    const id = config.id || this.generateId("npc");
    const fullConfig = {
      id,
      name: config.name || "Unknown NPC",
      rank: config.rank || rankSystem.createRank("C", "npc"),
      stats: config.stats || this.getDefaultStats("npc"),
      visuals: config.visuals || this.getDefaultVisuals(),
      interactionType: config.interactionType || "quest_giver",
      dialogue: config.dialogue,
      questIds: config.questIds,
      inventory: config.inventory,
      services: config.services,
      tags: config.tags,
      description: config.description,
      metadata: config.metadata,
    };

    const npc = new NPC(fullConfig);
    npc.applyRankModifiers();
    this.entities.set(id, npc);
    return npc;
  }

  createEnemy(config) {
    const id = config.id || this.generateId("enemy");
    const fullConfig = {
      id,
      name: config.name || "Unknown Enemy",
      rank: config.rank || rankSystem.createRank("C", "minion"),
      stats: config.stats || this.getDefaultStats("enemy"),
      visuals: config.visuals || this.getDefaultVisuals(),
      enemyType: config.enemyType || "minion",
      behavior: config.behavior || "aggressive",
      attackPower: config.attackPower,
      attackRange: config.attackRange,
      attackSpeed: config.attackSpeed,
      detectionRange: config.detectionRange,
      lootTable: config.lootTable,
      experienceValue: config.experienceValue,
      abilities: config.abilities,
      tags: config.tags,
      description: config.description,
      metadata: config.metadata,
    };

    const enemy = new Enemy(fullConfig);
    enemy.applyRankModifiers();
    this.entities.set(id, enemy);
    return enemy;
  }

  getDefaultStats(type) {
    const base = {
      health: 100,
      maxHealth: 100,
      power: 10,
      speed: 5,
      defense: 5,
      luck: 1,
    };
    return type === "enemy" ? { ...base, power: 15, defense: 3 } : base;
  }

  getDefaultVisuals() {
    return {
      assetPath:
        "data:image/svg+xml," +
        encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="28" fill="#666" stroke="#333" stroke-width="4"/><text x="32" y="40" text-anchor="middle" font-size="24" fill="white">?</text></svg>'
        ),
      assetKey: "default",
      scale: 1.0,
    };
  }

  getEntity(id) {
    return this.entities.get(id);
  }
  getAllEntities() {
    return Array.from(this.entities.values());
  }
  getEntityCount() {
    return this.entities.size;
  }

  removeEntity(id) {
    const entity = this.entities.get(id);
    if (entity) {
      entity.destroy();
      this.entities.delete(id);
    }
  }

  clearAll() {
    this.entities.forEach((entity) => entity.destroy());
    this.entities.clear();
  }
}

const entityManager = EntityManager.getInstance();

// ===== GAME INTEGRATION =====
class GameIntegration {
  constructor(config) {
    this.container = document.querySelector(config.containerSelector);
    this.entities = [];
    this.isRunning = false;
    this.lastTime = 0;

    if (!this.container) {
      throw new Error(`Container not found: ${config.containerSelector}`);
    }

    this.injectBaseStyles();
  }

  start() {
    this.isRunning = true;
    this.gameLoop = (currentTime) => {
      if (!this.isRunning) return;

      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      this.update(deltaTime);
      this.render();

      requestAnimationFrame(this.gameLoop);
    };

    requestAnimationFrame(this.gameLoop);
    console.log("🎮 Game started!");
  }

  stop() {
    this.isRunning = false;
    console.log("🎮 Game stopped!");
  }

  update(deltaTime) {
    this.entities.forEach((entity) => {
      if (entity.isActive) {
        entity.update(deltaTime);
      }
    });
  }

  render() {
    this.entities.forEach((entity) => {
      if (entity.isActive) {
        entity.render(this.container);
      }
    });
  }

  addEntity(entity) {
    this.entities.push(entity);
    return entity;
  }

  addNPC(config) {
    const npc = entityManager.createNPC(config);
    return this.addEntity(npc);
  }

  addEnemy(config) {
    const enemy = entityManager.createEnemy(config);
    return this.addEntity(enemy);
  }

  clearAll() {
    this.entities.forEach((entity) => entity.destroy());
    this.entities = [];
    entityManager.clearAll();
  }

  injectBaseStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .entity { position: absolute; transition: all 0.3s ease; cursor: pointer; user-select: none; -webkit-user-select: none; }
            .entity img { border-radius: 50%; border: 3px solid #334155; transition: all 0.3s ease; }
            .entity:hover img { border-color: #06b6d4; transform: scale(1.1); }
            .entity-info {
                position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
                background: #1e293b; padding: 8px 12px; border-radius: 6px; font-size: 12px;
                white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
                border: 1px solid #334155; color: #f1f5f9;
            }
            .entity:hover .entity-info { opacity: 1; }
        `;
    document.head.appendChild(style);
  }
}

function createGame(config) {
  return new GameIntegration(config);
}

// ===== EXPORTS =====
window.NPCRankSystem = {
  Entity,
  NPC,
  Enemy,
  RANK_TIERS,
  CATEGORY_CONFIG,
  createRank,
  getRankTierConfig,
  getCategoryConfig,
  RankSystem,
  rankSystem,
  EntityManager,
  entityManager,
  GameIntegration,
  createGame,
  VERSION: "1.0.0",
};

console.log("🎮 NPC & Enemy Rank System loaded! Version 1.0.0");
console.log("Available as: window.NPCRankSystem");
console.log(
  'Add to any HTML game with: <script src="npc-rank-system.js"></script>'
);
