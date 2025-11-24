# NPC & Enemy Rank System

🎮 **Universal rank-based entity management system for HTML games**

A TypeScript-based system that provides a complete rank hierarchy (E → D → C → B → A → S → SS) with entity categories like Hero, Villain, Slayer, Hunter, Guardian, and more. Easily integrate NPCs and enemies into any HTML game with minimal setup.

---

## ✨ Features

- **7-Tier Rank System**: E, D, C, B, A, S, SS ranks with auto-scaling stats
- **15+ Entity Categories**: Hero, Villain, Slayer, Hunter, Guardian, Mage, Assassin, Support, Minion, Elite, Boss, Pet, Merchant, Crafter, NPC
- **Plug & Play**: Drop into any HTML game with 3 lines of code
- **Type-Safe**: Full TypeScript support with complete type definitions
- **Entity Manager**: Automatic tracking, updating, and rendering
- **AI Behaviors**: Built-in enemy AI with chase, patrol, ranged, and more
- **Collision Detection**: Optional collision system
- **JSON Import/Export**: Load entities from JSON catalogs
- **Stat Scaling**: Automatic stat multipliers based on rank
- **Interaction System**: NPC dialogue, quests, vendors, crafting

---

## 🚀 Quick Start

### Installation

```bash
# Clone or download the system
cd npcs-and-enemies

# Install dependencies
npm install

# Build the system
npm run build
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Game</title>
  </head>
  <body>
    <div id="game-container"></div>

    <script type="module">
      import { createGame } from "./dist/index.js";

      // Initialize the game
      const game = createGame({
        containerSelector: "#game-container",
        autoUpdate: true,
      });

      // Add an NPC
      game.addNPC({
        name: "C Rank Hero Scout",
        rank: { tier: "C", category: "hero" },
        interactionType: "quest_giver",
        position: { x: 100, y: 100 },
      });

      // Add an enemy
      game.addEnemy({
        name: "B Rank Shadow Warrior",
        rank: { tier: "B", category: "elite" },
        enemyType: "elite",
        behavior: "aggressive",
        position: { x: 300, y: 200 },
      });

      // Start the game loop
      game.start();
    </script>
  </body>
</html>
```

---

## 📚 Core Concepts

### Rank System

The system uses a 7-tier ranking system:

| Rank | Power Mult | Health Mult | Speed Mult | Rarity    |
| ---- | ---------- | ----------- | ---------- | --------- |
| E    | 0.6x       | 0.7x        | 0.75x      | Common    |
| D    | 0.8x       | 0.85x       | 0.85x      | Common    |
| C    | 1.0x       | 1.0x        | 0.95x      | Normal    |
| B    | 1.3x       | 1.2x        | 1.05x      | Uncommon  |
| A    | 1.6x       | 1.5x        | 1.15x      | Rare      |
| S    | 2.0x       | 1.8x        | 1.25x      | Epic      |
| SS   | 2.5x       | 2.2x        | 1.35x      | Legendary |

### Entity Categories

- **Hero**: Playable heroes or champions
- **Villain**: Main antagonists and bosses
- **Slayer**: Combat-focused mercenaries
- **Hunter**: Tracker/ranger types
- **Guardian**: Defensive/tank entities
- **Mage**: Magic users
- **Assassin**: Stealth/high damage
- **Support**: Healers/buffers
- **Minion**: Basic enemies
- **Elite**: Stronger enemies
- **Boss**: Boss enemies
- **Pet**: Companion pets
- **Merchant**: Vendors/traders
- **Crafter**: Craftsmen/smiths
- **NPC**: Generic non-combat NPCs

---

## 🎯 Usage Examples

### Creating NPCs

```javascript
import { entityManager } from "./dist/index.js";

// Create a quest giver
const questGiver = entityManager.createNPC({
  name: "Village Elder",
  rank: { tier: "B", category: "npc" },
  interactionType: "quest_giver",
  dialogue: ["Welcome, brave adventurer!", "I have a quest for you..."],
  questIds: ["quest_001", "quest_002"],
});

// Create a merchant
const merchant = entityManager.createNPC({
  name: "Master Merchant",
  rank: { tier: "A", category: "merchant" },
  interactionType: "vendor",
  inventory: ["sword_legendary", "armor_epic", "potion_health"],
});

// Create a crafter
const crafter = entityManager.createNPC({
  name: "Legendary Smith",
  rank: { tier: "S", category: "crafter" },
  interactionType: "crafter",
  services: ["crafting", "upgrade", "fusion"],
});
```

### Creating Enemies

```javascript
// Create a basic minion
const goblin = entityManager.createEnemy({
  name: "Goblin Raider",
  rank: { tier: "E", category: "minion" },
  enemyType: "minion",
  behavior: "aggressive",
  attackRange: 30,
  lootTable: ["coin_copper", "goblin_tooth"],
});

// Create an elite enemy
const sentinel = entityManager.createEnemy({
  name: "Sentinel Guardian",
  rank: { tier: "B", category: "elite" },
  enemyType: "elite",
  behavior: "ranged",
  abilities: ["laser_beam", "shield_rotation"],
  attackRange: 150,
});

// Create a boss
const dragon = entityManager.createEnemy({
  name: "Ancient Dragon Lord",
  rank: { tier: "SS", category: "villain" },
  enemyType: "world-boss",
  behavior: "aggressive",
  abilities: ["fire_breath", "wing_gust", "summon_drakes"],
  lootTable: ["legendary_sword", "dragon_scale", "mythic_gem"],
});
```

### Loading from JSON

```javascript
// Load from URL
await game.loadEntitiesFromURL("entities.json");

// Or load from array
const entities = [
  {
    name: "C Rank Hero",
    rank: { tier: "C", category: "hero" },
    interactionType: "mentor",
    type: "npc",
  },
  {
    name: "Shadow Wolf",
    rank: { tier: "B", category: "elite" },
    enemyType: "elite",
    behavior: "chase",
    type: "enemy",
  },
];

game.loadEntitiesFromJSON(entities);
```

### Querying Entities

```javascript
import { entityManager } from "./dist/index.js";

// Get all entities
const all = entityManager.getAllEntities();

// Get by category
const heroes = entityManager.getEntitiesByCategory("hero");
const bosses = entityManager.getEntitiesByCategory("boss");

// Get by rank
const sRank = entityManager.getEntitiesByRank("S");

// Get NPCs only
const npcs = entityManager.getNPCs();

// Get enemies only
const enemies = entityManager.getEnemies();

// Get by tag
const flying = entityManager.getEntitiesByTag("flying");

// Get statistics
const stats = entityManager.getStats();
console.log(stats);
/*
{
  total: 25,
  active: 20,
  npcs: 10,
  enemies: 15,
  byCategory: { hero: 5, villain: 3, ... },
  byRank: { E: 5, D: 4, C: 6, ... }
}
*/
```

### Using the Rank System

```javascript
import { rankSystem } from "./dist/index.js";

// Create ranks
const cHero = rankSystem.createRank("C", "hero");
const sVillain = rankSystem.createRank("S", "villain");

// Calculate stats
const power = rankSystem.calculatePowerLevel("A", 100); // Returns 160
const health = rankSystem.calculateHealth("S", 100); // Returns 180
const speed = rankSystem.calculateSpeed("B", 100); // Returns 105

// Compare ranks
const isHigher = rankSystem.isHigherRank("S", "C"); // true

// Get next/previous rank
const next = rankSystem.getNextTier("B"); // Returns 'A'
const prev = rankSystem.getPreviousTier("B"); // Returns 'C'

// Get random rank (weighted by rarity)
const random = rankSystem.getRandomTier();

// Get colors
const rankColor = rankSystem.getRankColor("S"); // '#fca5a5'
const categoryColor = rankSystem.getCategoryColor("hero"); // '#60a5fa'
```

---

## 🔧 Configuration

### Game Integration Config

```javascript
const game = createGame({
  containerSelector: "#game-container", // DOM selector
  autoUpdate: true, // Auto update loop
  updateInterval: 16, // Update interval (ms)
  enableAutoRender: true, // Auto render entities
  enableCollisionDetection: false, // Enable collisions
});
```

### Entity Config

```javascript
{
  id: 'unique_id',           // Optional, auto-generated if not provided
  name: 'Entity Name',       // Display name
  rank: {                    // Rank object
    tier: 'C',               // E, D, C, B, A, S, SS
    category: 'hero'         // hero, villain, slayer, etc.
  },
  stats: {                   // Base stats (multiplied by rank)
    health: 100,
    maxHealth: 100,
    power: 20,
    speed: 50,
    defense: 10,
    luck: 5
  },
  visuals: {                 // Visual properties
    assetPath: 'path/to/sprite.png',
    assetKey: 'sprite_key',
    scale: 1.0,
    spriteWidth: 64,
    spriteHeight: 64
  },
  tags: ['tag1', 'tag2'],    // Custom tags
  description: 'Description', // Flavor text
  metadata: {}               // Custom data
}
```

---

## 📦 API Reference

### GameIntegration

- `init()` - Initialize the system
- `start()` - Start game loop
- `stop()` - Stop game loop
- `addNPC(config)` - Add NPC
- `addEnemy(config)` - Add enemy
- `loadEntitiesFromJSON(data)` - Load from JSON array
- `loadEntitiesFromURL(url)` - Load from URL
- `clearAll()` - Remove all entities
- `update(deltaTime)` - Manual update
- `render()` - Manual render
- `getStats()` - Get statistics

### EntityManager

- `createNPC(config)` - Create NPC
- `createEnemy(config)` - Create Enemy
- `createEntity(config)` - Create generic entity
- `getEntity(id)` - Get by ID
- `getAllEntities()` - Get all
- `getEntitiesByCategory(category)` - Filter by category
- `getEntitiesByRank(tier)` - Filter by rank
- `getNPCs()` - Get all NPCs
- `getEnemies()` - Get all enemies
- `removeEntity(id)` - Remove entity
- `clearAll()` - Clear all
- `importFromJSON(data)` - Import from JSON
- `exportToJSON()` - Export to JSON

### RankSystem

- `createRank(tier, category)` - Create rank
- `calculatePowerLevel(tier, base)` - Calculate power
- `calculateHealth(tier, base)` - Calculate health
- `calculateSpeed(tier, base)` - Calculate speed
- `compareRanks(tier1, tier2)` - Compare ranks
- `isHigherRank(tier1, tier2)` - Check if higher
- `getNextTier(tier)` - Get next tier
- `getRandomTier()` - Get random weighted tier

---

## 🎨 Styling

The system injects base styles automatically. Customize by adding your own CSS:

```css
.entity {
  /* Base entity styles */
}

.entity.npc {
  /* NPC-specific styles */
}

.entity.enemy {
  /* Enemy-specific styles */
}

.entity[data-rank="S"] {
  /* S-Rank specific styles */
}

.entity[data-category="hero"] {
  /* Hero-specific styles */
}
```

---

## 📝 Examples

See the `examples/` folder for complete demos:

- `integration-demo.html` - Full interactive demo
- Basic game integration examples
- Advanced features showcase

---

## 🤝 Contributing

Feel free to extend the system with:

- New entity categories
- Additional behaviors
- Custom rank tiers
- New features

---

## 📄 License

MIT License - use in any project, commercial or personal.

---

## 🎮 Built With

- TypeScript
- Vanilla JavaScript (no frameworks required)
- HTML5/CSS3

---

**Ready to add ranked NPCs and enemies to your game? Start with the Quick Start guide above!**
