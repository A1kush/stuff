# 🎮 NPC & Enemy Rank System - Production Ready

**Add rank-based NPCs and enemies to any HTML game in under 5 minutes!**

## ✨ Features

- ✅ **7 Rank Tiers**: E → D → C → B → A → S → SS with automatic stat scaling
- ✅ **15 Categories**: Hero, Villain, Slayer, Hunter, Guardian, Mage, Assassin, Support, Minion, Elite, Boss, Pet, Merchant, Crafter, NPC
- ✅ **Offline Ready**: Works completely offline, no server required
- ✅ **Zero Dependencies**: Pure vanilla JavaScript
- ✅ **Production Tested**: TypeScript built, fully tested
- ✅ **Easy Integration**: 3 lines of code to add to any HTML game

## 🚀 Quick Start (5 minutes)

### Step 1: Download

Download `npc-rank-system.js` and add it to your HTML project.

### Step 2: Include in HTML

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Game</title>
  </head>
  <body>
    <div id="game"></div>

    <!-- Add the system -->
    <script src="npc-rank-system.js"></script>

    <!-- Your game code -->
    <script>
      // Initialize (3 lines!)
      const game = NPCRankSystem.createGame({
        containerSelector: "#game",
      });
      game.start();

      // Add entities
      game.addNPC({
        name: "Hero",
        rank: NPCRankSystem.createRank("C", "hero"),
        position: { x: 100, y: 100 },
      });
    </script>
  </body>
</html>
```

### Step 3: Done! 🎉

Your game now has a complete rank system!

## 📁 Files

- `npc-rank-system.js` - Main system file (include this)
- `standalone-demo.html` - Full demo with UI
- `integration-example.html` - Simple integration example

## 🎯 API Reference

### Initialize Game

```javascript
const game = NPCRankSystem.createGame({
  containerSelector: "#my-game-div", // Required: CSS selector for game area
});
game.start();
```

### Create Ranks

```javascript
// Create any rank combination
const heroRank = NPCRankSystem.createRank("C", "hero"); // "C Rank Hero"
const bossRank = NPCRankSystem.createRank("S", "villain"); // "S Rank Villain"
const npcRank = NPCRankSystem.createRank("B", "merchant"); // "B Rank Merchant"
```

### Add NPCs

```javascript
game.addNPC({
  name: "Shop Keeper",
  rank: NPCRankSystem.createRank("C", "merchant"),
  position: { x: 200, y: 150 },
  visuals: {
    assetPath: "path/to/shopkeeper.png", // or data:image/svg+xml,...
    assetKey: "shopkeeper",
  },
  dialogue: ["Welcome to my shop!", "What can I get for you?"],
  inventory: ["sword", "shield", "potion"],
});
```

### Add Enemies

```javascript
game.addEnemy({
  name: "Forest Wolf",
  rank: NPCRankSystem.createRank("B", "elite"),
  position: { x: 300, y: 200 },
  visuals: {
    assetPath: "path/to/wolf.png",
    assetKey: "wolf",
  },
  behavior: "patrol", // patrol, aggressive, chase, stationary
  lootTable: ["wolf_fur", "wolf_teeth"],
});
```

### Available Categories

- **Combat**: `hero`, `villain`, `slayer`, `hunter`, `guardian`, `mage`, `assassin`
- **Support**: `support`, `npc`, `merchant`, `crafter`
- **Enemies**: `minion`, `elite`, `boss`, `pet`

### Rank Tiers (E = weakest, SS = strongest)

- `E` - Basic (60% power, 70% health)
- `D` - Novice (80% power, 85% health)
- `C` - Skilled (100% power, 100% health)
- `B` - Veteran (130% power, 120% health)
- `A` - Expert (160% power, 150% health)
- `S` - Master (200% power, 180% health)
- `SS` - Legendary (250% power, 220% health)

## 🎨 Visuals

### Using Images

```javascript
visuals: {
    assetPath: 'images/hero.png',
    assetKey: 'hero',
    scale: 1.0
}
```

### Using Inline SVG (works offline)

```javascript
visuals: {
    assetPath: 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
            <circle cx="32" cy="32" r="28" fill="#06b6d4"/>
            <text x="32" y="40" text-anchor="middle" font-size="32" fill="white">H</text>
        </svg>
    `),
    assetKey: 'hero',
    scale: 1.0
}
```

## 🔧 Advanced Usage

### Custom Stats

```javascript
game.addEnemy({
  name: "Custom Boss",
  rank: NPCRankSystem.createRank("S", "boss"),
  stats: {
    health: 500,
    maxHealth: 500,
    power: 50,
    speed: 20,
    defense: 30,
    luck: 5,
  },
  position: { x: 400, y: 300 },
});
```

### Entity Management

```javascript
// Get all entities
const allEntities = NPCRankSystem.entityManager.getAllEntities();

// Get specific entity
const entity = NPCRankSystem.entityManager.getEntity("entity_id");

// Remove entity
NPCRankSystem.entityManager.removeEntity("entity_id");

// Clear all
game.clearAll();
```

### Events & Callbacks

```javascript
// Entities have click events built-in
// Add custom event listeners to the game container
document.querySelector("#game").addEventListener("click", (e) => {
  const entityEl = e.target.closest(".entity");
  if (entityEl) {
    const entity = NPCRankSystem.entityManager.getEntity(
      entityEl.dataset.entityId
    );
    console.log("Clicked:", entity.getInfo());
  }
});
```

## 🎮 Integration Examples

### Add to Existing Game

```html
<!-- Your existing game HTML -->
<div id="existing-game"></div>

<!-- Add system -->
<script src="npc-rank-system.js"></script>
<script>
  // Your existing game code...

  // Add NPC system
  const npcGame = NPCRankSystem.createGame({
    containerSelector: "#existing-game",
  });
  npcGame.start();

  // Now you can add NPCs to your existing game!
</script>
```

### Runner Game Integration

```javascript
// In your runner game
function spawnNPC() {
  npcGame.addNPC({
    name: "Power-up Vendor",
    rank: NPCRankSystem.createRank("C", "merchant"),
    position: { x: player.x + 500, y: groundY - 50 },
  });
}
```

## 📦 Download

**Option 1: Single File**
Just download `npc-rank-system.js` and include it in your HTML.

**Option 2: Full Package**
Download all files for examples and documentation.

## 🆘 Troubleshooting

**"Container not found" error**

- Make sure your `containerSelector` matches an existing HTML element
- Example: `containerSelector: '#game'` needs `<div id="game"></div>`

**Entities not showing**

- Check that `game.start()` was called
- Verify position coordinates are within container bounds
- Check browser console for errors

**Offline not working**

- Make sure you're opening the HTML file directly (file://)
- Or use a local server: `python -m http.server 8000`

## 📄 License

MIT License - Free to use in any project!

---

**Made with ❤️ for HTML game developers**
