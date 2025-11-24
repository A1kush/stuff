# Quick Start Guide

## Installation & Setup

### 1. Build the System

```bash
cd npcs-and-enemies
npm install
npm run build
```

This will:

- Compile TypeScript to JavaScript
- Copy catalog files
- Generate type definitions

### 2. Create Your First Game

Create a new HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Rank Game</title>
    <style>
      #game-container {
        width: 800px;
        height: 600px;
        background: #1a1a2e;
        position: relative;
        margin: 20px auto;
        border: 2px solid #16213e;
      }
    </style>
  </head>
  <body>
    <h1>My Rank-Based Game</h1>
    <div id="game-container"></div>

    <script type="module">
      // Import the system (adjust path as needed)
      import { createGame } from "./npcs-and-enemies/dist/index.js";

      // Create and initialize the game
      const game = createGame({
        containerSelector: "#game-container",
      });

      // Add a C Rank Hero
      const hero = game.addNPC({
        name: "C Rank Hero Scout",
        rank: { tier: "C", category: "hero" },
        interactionType: "quest_giver",
        position: { x: 100, y: 200 },
        visuals: {
          assetPath: "path/to/hero-sprite.png",
          assetKey: "hero_c",
          scale: 1.0,
        },
      });

      // Add an enemy
      const enemy = game.addEnemy({
        name: "B Rank Shadow Warrior",
        rank: { tier: "B", category: "elite" },
        enemyType: "elite",
        behavior: "aggressive",
        position: { x: 600, y: 300 },
        visuals: {
          assetPath: "path/to/enemy-sprite.png",
          assetKey: "shadow_warrior",
          scale: 1.0,
        },
      });

      // Start the game loop
      game.start();

      // Listen for entity interactions
      document.addEventListener("click", (e) => {
        const entityEl = e.target.closest(".entity");
        if (entityEl) {
          const id = entityEl.dataset.entityId;
          const entity = game.getEntityManager().getEntity(id);
          if (entity) {
            console.log(entity.getInfo());
          }
        }
      });
    </script>
  </body>
</html>
```

### 3. Load from JSON Catalog

```javascript
// Load the pre-built catalog
await game.loadEntitiesFromURL(
  "./npcs-and-enemies/dist/catalog/ranked_entities.json"
);

// Or create custom catalog
const myEntities = {
  npcs: [
    {
      name: "Shop Keeper",
      rank: { tier: "D", category: "merchant" },
      interactionType: "vendor",
      inventory: ["sword", "shield", "potion"],
    },
  ],
  enemies: [
    {
      name: "Forest Wolf",
      rank: { tier: "C", category: "minion" },
      enemyType: "minion",
      behavior: "chase",
    },
  ],
};

game.loadEntitiesFromJSON([...myEntities.npcs, ...myEntities.enemies]);
```

## Common Patterns

### Pattern 1: Spawn Enemies in Waves

```javascript
function spawnWave(count, rank) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      game.addEnemy({
        name: `Wave Enemy ${i + 1}`,
        rank: { tier: rank, category: "minion" },
        enemyType: "minion",
        behavior: "aggressive",
        position: {
          x: Math.random() * 700 + 50,
          y: Math.random() * 500 + 50,
        },
      });
    }, i * 500);
  }
}

// Spawn 5 C-rank enemies
spawnWave(5, "C");
```

### Pattern 2: Create a Merchant Shop

```javascript
const shop = game.addNPC({
  name: "Weapon Merchant",
  rank: { tier: "B", category: "merchant" },
  interactionType: "vendor",
  inventory: ["iron_sword", "steel_sword", "legendary_blade"],
  position: { x: 400, y: 300 },
});

// Handle shop interaction
shop.interact = function () {
  console.log("Shop opened!");
  // Show shop UI
  showShopUI(this.inventory);
};
```

### Pattern 3: Quest System

```javascript
const questGiver = game.addNPC({
  name: "Village Elder",
  rank: { tier: "A", category: "npc" },
  interactionType: "quest_giver",
  questIds: ["quest_kill_goblins"],
  dialogue: ["Help us defeat the goblin king!"],
  position: { x: 200, y: 200 },
});

// Track quest progress
let goblinsKilled = 0;

document.addEventListener("enemy-death", (e) => {
  if (e.detail.enemy.tags.includes("goblin")) {
    goblinsKilled++;
    if (goblinsKilled >= 10) {
      console.log("Quest complete! Return to village elder.");
    }
  }
});
```

### Pattern 4: Boss Fight

```javascript
function spawnBoss() {
  const boss = game.addEnemy({
    name: "SS Rank Dragon Lord",
    rank: { tier: "SS", category: "villain" },
    enemyType: "world-boss",
    behavior: "aggressive",
    abilities: ["fire_breath", "tail_swipe", "fly"],
    lootTable: ["legendary_sword", "dragon_scale"],
    position: { x: 400, y: 300 },
  });

  // Boss has phases
  boss.onPhaseChange = function (phase) {
    console.log(`Boss entered phase ${phase}`);
    if (phase === 2) {
      this.abilities.push("meteor_shower");
    }
  };

  // Listen for boss defeat
  document.addEventListener("enemy-death", (e) => {
    if (e.detail.enemy === boss) {
      console.log("Boss defeated!");
      console.log("Loot:", e.detail.loot);
      showVictoryScreen();
    }
  });

  return boss;
}
```

### Pattern 5: Rank Progression System

```javascript
let playerRank = "E";

function levelUp() {
  const currentRank = playerRank;
  const nextRank = rankSystem.getNextTier(currentRank);

  if (nextRank) {
    playerRank = nextRank;
    console.log(`Rank Up! Now ${playerRank} rank!`);

    // Update player stats
    updatePlayerStats();

    // Unlock new NPCs/areas
    if (playerRank === "B") {
      spawnHighRankMerchant();
    }
  }
}

function updatePlayerStats() {
  const power = rankSystem.calculatePowerLevel(playerRank, 100);
  const health = rankSystem.calculateHealth(playerRank, 100);

  console.log(`New stats - Power: ${power}, Health: ${health}`);
}
```

## Testing

Run the demo to see everything in action:

```bash
npm run serve
# Open http://localhost:8080/examples/integration-demo.html
```

## Next Steps

- Customize entity stats and behaviors
- Add your own sprite assets
- Create custom entity categories
- Build your game mechanics on top of the system
- Check out the full API documentation in README.md

## Tips

1. **Start Small**: Begin with a few entities and build up
2. **Use the Catalog**: Leverage the pre-built entity catalog
3. **Rank Matters**: Higher ranks = more challenging/valuable
4. **Tag Everything**: Use tags for easy filtering and grouping
5. **Test Often**: Use the demo page to test your entities

Happy coding! 🎮
