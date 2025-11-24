# 🎮 Adding NPC & Enemy System to Your Existing HTML Games

## Quick Integration Guide

This guide shows how to add the rank-based NPC and Enemy system to any of your existing HTML games.

---

## Step 1: Copy the System

Copy the entire `npcs-and-enemies` folder into your game directory:

```
your-game/
├── index.html
├── npcs-and-enemies/    ← Copy this folder here
│   ├── dist/
│   ├── examples/
│   └── ...
└── ... (your other game files)
```

---

## Step 2: Add to Your HTML Game

### For Runner Transition Games

Open any runner game (e.g., `14-bicycle-delivery.html`) and add:

```html
<!-- Add before closing </body> tag -->
<script type="module">
  import { createGame, entityManager } from "./npcs-and-enemies/dist/index.js";

  // Initialize the NPC/Enemy system
  const rankSystem = createGame({
    containerSelector: "#game-container", // Your game container
    autoUpdate: false, // We'll update manually
  });

  // Load catalog
  await rankSystem.loadEntitiesFromURL(
    "./npcs-and-enemies/dist/catalog/ranked_entities.json"
  );

  // Spawn entities in your game
  function spawnRankedEnemy(x, y, rank = "C") {
    return rankSystem.addEnemy({
      name: `${rank} Rank Enemy`,
      rank: { tier: rank, category: "minion" },
      enemyType: "minion",
      behavior: "chase",
      position: { x, y },
    });
  }

  // In your game loop
  function gameLoop() {
    // Your existing game logic

    // Update ranked entities
    entityManager.updateAll(16); // deltaTime in ms

    requestAnimationFrame(gameLoop);
  }
</script>
```

### For Almost Ready Games (index.html)

```html
<script type="module">
  import { createGame } from "../npcs-and-enemies/dist/index.js";

  const game = createGame({
    containerSelector: "#game-world",
    autoUpdate: true,
  });

  // Add NPCs to the game world
  game.addNPC({
    name: "Shop Keeper",
    rank: { tier: "B", category: "merchant" },
    interactionType: "vendor",
    position: { x: 200, y: 300 },
  });

  // Add enemies that spawn in levels
  function spawnLevelEnemies(level) {
    const rank = level <= 5 ? "C" : level <= 10 ? "B" : "A";

    for (let i = 0; i < 5; i++) {
      game.addEnemy({
        name: `Level ${level} Enemy`,
        rank: { tier: rank, category: "elite" },
        enemyType: "elite",
        behavior: "aggressive",
        position: { x: Math.random() * 800, y: Math.random() * 600 },
      });
    }
  }

  game.start();
</script>
```

### For Candy Dungeon / Quest Games

```html
<script type="module">
  import { entityManager, rankSystem } from "../npcs-and-enemies/dist/index.js";

  // Create quest NPCs
  const questGiver = entityManager.createNPC({
    name: "Dungeon Master",
    rank: { tier: "A", category: "npc" },
    interactionType: "quest_giver",
    questIds: ["dungeon_quest_1"],
    dialogue: ["Clear the dungeon and return!"],
  });

  // Create dungeon enemies by floor
  function createDungeonFloor(floor) {
    const enemies = [];
    const rank = floor <= 3 ? "D" : floor <= 6 ? "C" : floor <= 9 ? "B" : "A";

    // Regular enemies
    for (let i = 0; i < 10; i++) {
      enemies.push(
        entityManager.createEnemy({
          name: `Floor ${floor} Monster`,
          rank: { tier: rank, category: "minion" },
          enemyType: "minion",
          behavior: "aggressive",
        })
      );
    }

    // Floor boss
    const bossRank =
      floor <= 3 ? "C" : floor <= 6 ? "B" : floor <= 9 ? "A" : "S";
    enemies.push(
      entityManager.createEnemy({
        name: `Floor ${floor} Boss`,
        rank: { tier: bossRank, category: "boss" },
        enemyType: "boss",
        behavior: "aggressive",
      })
    );

    return enemies;
  }
</script>
```

---

## Step 3: Integrate with Existing Game Systems

### With Your Player System

```javascript
import { entityManager } from "./npcs-and-enemies/dist/index.js";

// When player defeats enemy
function onEnemyDefeated(enemy) {
  const enemyEntity = entityManager.getEntity(enemy.id);
  if (enemyEntity) {
    // Get experience based on rank
    const exp = enemyEntity.experienceValue;
    player.addExp(exp);

    // Get loot
    const loot = enemyEntity.getLoot();
    loot.forEach((item) => player.addItem(item));
  }
}

// When player levels up, increase encounter rank
function onPlayerLevelUp(newLevel) {
  if (newLevel === 10) playerRank = "C";
  if (newLevel === 20) playerRank = "B";
  if (newLevel === 30) playerRank = "A";
  if (newLevel === 50) playerRank = "S";

  // Spawn higher rank enemies
  updateEnemySpawns(playerRank);
}
```

### With Your Shop System

```javascript
// Replace your shop NPC with ranked merchant
const merchant = game.addNPC({
  name: "Weapon Merchant",
  rank: { tier: "B", category: "merchant" },
  interactionType: "vendor",
  inventory: ["sword_iron", "sword_steel", "sword_legendary"],
});

// On shop interaction
merchant.element.addEventListener("click", () => {
  openShop(merchant.inventory);
});
```

### With Your Quest System

```javascript
// Create quest givers with different ranks
const beginnerQuests = game.addNPC({
  name: "Rookie Guide",
  rank: { tier: "C", category: "npc" },
  interactionType: "quest_giver",
  questIds: ["quest_beginner_1", "quest_beginner_2"],
});

const advancedQuests = game.addNPC({
  name: "Elite Commander",
  rank: { tier: "S", category: "hero" },
  interactionType: "quest_giver",
  questIds: ["quest_elite_1", "quest_raid_boss"],
});
```

---

## Step 4: Style Integration

The system auto-injects base styles. Customize for your game theme:

```css
/* Override in your game's CSS */
.entity {
  /* Match your game's art style */
}

.entity.npc {
  border: 2px solid #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

.entity.enemy {
  border: 2px solid #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.entity[data-rank="S"],
.entity[data-rank="SS"] {
  /* Epic/legendary glow */
  animation: legendary-glow 2s infinite;
}

@keyframes legendary-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 5px gold);
  }
  50% {
    filter: drop-shadow(0 0 15px gold);
  }
}
```

---

## Example: Full Integration in Runner Game

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Runner Game with Rank System</title>
  </head>
  <body>
    <div id="game-container"></div>

    <script type="module">
      import {
        createGame,
        entityManager,
        rankSystem,
      } from "./npcs-and-enemies/dist/index.js";

      // Initialize
      const game = createGame({
        containerSelector: "#game-container",
        autoUpdate: false, // We control the update
      });

      // Game state
      let score = 0;
      let currentRank = "E";

      // Update rank based on score
      function updatePlayerRank() {
        if (score >= 1000 && currentRank === "E") currentRank = "D";
        if (score >= 2500 && currentRank === "D") currentRank = "C";
        if (score >= 5000 && currentRank === "C") currentRank = "B";
        if (score >= 10000 && currentRank === "B") currentRank = "A";
      }

      // Spawn enemies matching player rank
      function spawnEnemyWave() {
        for (let i = 0; i < 3; i++) {
          game.addEnemy({
            name: `${currentRank} Rank Enemy`,
            rank: { tier: currentRank, category: "minion" },
            enemyType: "minion",
            behavior: "chase",
            position: { x: 800, y: Math.random() * 400 + 100 },
          });
        }
      }

      // Game loop
      function gameLoop(timestamp) {
        const deltaTime = 16; // ~60fps

        // Update your game logic
        score += 1;
        updatePlayerRank();

        // Update ranked entities
        entityManager.updateAll(deltaTime);

        // Spawn enemies periodically
        if (timestamp % 3000 < 16) {
          spawnEnemyWave();
        }

        requestAnimationFrame(gameLoop);
      }

      // Start
      game.start();
      requestAnimationFrame(gameLoop);
    </script>
  </body>
</html>
```

---

## Tips for Integration

1. **Start Small**: Add one NPC or enemy first
2. **Use Existing Sprites**: Point `assetPath` to your game's sprites
3. **Match Your Theme**: Customize colors and styles
4. **Gradual Integration**: Don't replace everything at once
5. **Test Often**: Check entity spawning and interactions
6. **Use the Demos**: Reference `examples/` for patterns

---

## Common Integration Patterns

### Pattern: Boss Waves by Rank

```javascript
function spawnBossWave(waveNumber) {
  const ranks = ["D", "C", "B", "A", "S", "SS"];
  const rank = ranks[Math.min(Math.floor(waveNumber / 5), 5)];

  return game.addEnemy({
    name: `Wave ${waveNumber} Boss`,
    rank: { tier: rank, category: "boss" },
    enemyType: "boss",
    behavior: "aggressive",
  });
}
```

### Pattern: Rank-Based Loot

```javascript
const lootTables = {
  E: ["coin_copper"],
  D: ["coin_copper", "coin_silver"],
  C: ["coin_silver", "gem_common"],
  B: ["gem_common", "gem_rare"],
  A: ["gem_rare", "legendary_item"],
  S: ["legendary_item", "mythic_item"],
  SS: ["mythic_item", "ultimate_gear"],
};
```

### Pattern: Progressive Difficulty

```javascript
function getEnemyRankForArea(area) {
  const areaRanks = {
    starter_zone: "E",
    forest: "D",
    caves: "C",
    mountains: "B",
    castle: "A",
    demon_realm: "S",
    final_dungeon: "SS",
  };
  return areaRanks[area] || "C";
}
```

---

**Ready to add the rank system to your games!** 🚀

See `PROJECT_SUMMARY.md` for full system overview.
