# 🎮 NPC & Enemy Rank System

## What is this?

A **complete, production-ready system** for adding ranked NPCs and enemies to any HTML game. Think of it like a rank system from games like Solo Leveling or Hunter x Hunter - where characters have ranks (E, D, C, B, A, S, SS) and categories (Hero, Villain, Slayer, Hunter, etc.).

## Quick Overview

```
Rank Tiers:     E → D → C → B → A → S → SS
                │   │   │   │   │   │   │
                │   │   │   │   │   │   └─ Legendary (2.5x power)
                │   │   │   │   │   └───── Epic (2.0x power)
                │   │   │   │   └─────── Rare (1.6x power)
                │   │   │   └─────────── Uncommon (1.3x power)
                │   │   └───────────────── Normal (1.0x power)
                │   └───────────────────── Common (0.8x power)
                └───────────────────────── Basic (0.6x power)

Categories:     Hero, Villain, Slayer, Hunter, Guardian, Mage,
                Assassin, Support, Minion, Elite, Boss, Pet,
                Merchant, Crafter, NPC
```

## What Can You Do?

### Create Ranked NPCs

```javascript
game.addNPC({
  name: "C Rank Hero Scout",
  rank: { tier: "C", category: "hero" },
  interactionType: "quest_giver",
});
```

### Spawn Ranked Enemies

```javascript
game.addEnemy({
  name: "S Rank Dragon Lord",
  rank: { tier: "S", category: "villain" },
  enemyType: "boss",
  behavior: "aggressive",
});
```

### Load Full Catalogs

```javascript
// 21 pre-built entities ready to use!
await game.loadEntitiesFromURL("catalog/ranked_entities.json");
```

## 3-Line Integration

```html
<script type="module">
  import { createGame } from "./dist/index.js";
  const game = createGame({ containerSelector: "#game" });
  game.start();
</script>
```

That's it! The system handles:

- ✅ Entity management
- ✅ Stat scaling by rank
- ✅ AI behaviors
- ✅ Rendering
- ✅ Collision detection
- ✅ Loot systems
- ✅ Experience calculation
- ✅ And more!

## What's Included?

### 📦 Pre-Built Entities (21 total)

**NPCs (12)**

- C/B/A/S/SS Rank Heroes
- Merchants, Hunters, Crafters
- Guardians, Mages, Civilians

**Enemies (9)**

- E-D Rank Minions
- C-B Rank Elites
- A-S Rank Bosses
- SS Rank Villains

All with complete:

- Stats (health, power, speed, defense)
- Behaviors (aggressive, chase, patrol, etc.)
- Loot tables
- Abilities
- Visual configs

### 📁 Files

```
npcs-and-enemies/
├── dist/               # Ready-to-use compiled code
├── examples/           # 2 working demos
├── README.md          # Full documentation
├── QUICK_START.md     # Getting started guide
├── INTEGRATION_GUIDE.md   # How to add to your games
└── PROJECT_SUMMARY.md     # Complete overview
```

### 🎮 Demos

1. **Full Demo** (`examples/integration-demo.html`)

   - Interactive entity spawning
   - Real-time statistics
   - Filter by rank/category
   - Auto-spawn mode
   - Export functionality

2. **Simple Demo** (`examples/simple-example.html`)
   - Minimal code example
   - Easy to understand
   - Copy-paste ready

## Use Cases

✅ **RPG Games** - Quest givers, merchants, ranked bosses  
✅ **Runner Games** - Wave-based enemies with progression  
✅ **Dungeon Crawlers** - Floor-based difficulty scaling  
✅ **Strategy Games** - Unit rank management  
✅ **Adventure Games** - NPC dialogue and quests  
✅ **Any HTML Game** - Universal integration

## Features Breakdown

### Rank System

- 7 tiers with auto stat scaling
- Rarity-based spawn weights
- Progression utilities
- Color-coded displays

### NPC System

- Dialogue management
- Quest tracking
- Vendor inventories
- Crafting services
- Multiple interaction types

### Enemy System

- 8 AI behaviors
- 5 enemy types
- Attack/defense systems
- Loot drop tables
- Experience rewards
- Special abilities

### Integration

- Plug-and-play setup
- JSON catalog loading
- Auto update/render
- Event system
- TypeScript support
- Zero dependencies

## Get Started

```bash
# Build
npm install
npm run build

# Run demo
npm run serve
# Visit http://localhost:8080/examples/integration-demo.html
```

## Documentation

- **README.md** - Complete API reference
- **QUICK_START.md** - Fast setup guide
- **INTEGRATION_GUIDE.md** - Add to existing games
- **PROJECT_SUMMARY.md** - Full system overview

## Perfect For

- Solo developers looking for a rank system
- Games needing NPC/enemy management
- Projects wanting quick entity integration
- Anyone building HTML games

## License

MIT - Use in any project!

---

**Built with TypeScript • Zero Dependencies • Production Ready**

🎮 Ready to add ranks to your game? Check out `QUICK_START.md`!
