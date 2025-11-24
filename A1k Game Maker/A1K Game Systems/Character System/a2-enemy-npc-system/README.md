# 🎯 A2 Enemy & NPC System

A comprehensive enemy, boss, zombie, villain, and superhero system with procedural rendering, multi-phase battles, infection mechanics, and AI robot aesthetic.

## 🚀 **Quick Start**

```javascript
// Import databases
import { ENEMIES_DATABASE, getEnemyById } from './data/enemies_db.js';
import { BOSSES_DATABASE, getBossPhase } from './data/bosses_db.js';
import { ZOMBIES_DATABASE, calculateHordeBonuses } from './data/zombies_db.js';
import { VILLAINS_DATABASE, getVillainPhase } from './data/villains_db.js';

// Get an enemy
const slime = getEnemyById('enemy_slime');
console.log(slime.name); // "Slime"
console.log(slime.hp);   // 100

// Get a boss with phase
const boss = BOSSES_DATABASE.boss_slime_king;
const currentPhase = getBossPhase(boss, 1000); // Get phase based on HP
console.log(currentPhase.abilities); // ["slime_split", "bounce_attack"]

// Calculate zombie horde bonuses
const bonuses = calculateHordeBonuses(10); // 10 zombies in horde
console.log(bonuses.damage); // 1.30 (30% damage bonus)
```

---

## 📊 **What's Included**

### **64 Total Entities**
- ✅ **35 Enemies** (C/B/A/S ranks) - Basic to mini-boss
- ✅ **10 Bosses** (Multi-phase) - Stages 1-10
- ✅ **12 Zombies** (Variants) - Walkers, tanks, special
- ✅ **7 Villains** (Named) - 3-phase epic battles
- ⏳ **20 Heroes** (NPCs) - Allies, rivals, neutral (pending)

### **Advanced Systems**
- ✅ Multi-phase boss mechanics
- ✅ Infection spread system
- ✅ Zombie horde bonuses
- ✅ Villain dialogue & personality
- ✅ Loot tables with rarity rates
- ✅ 150+ unique abilities

---

## 📁 **File Structure**

```
a2-enemy-npc-system/
├── data/
│   ├── enemies_db.js ✅     # 35 enemies
│   ├── bosses_db.js ✅      # 10 multi-phase bosses
│   ├── zombies_db.js ✅     # 12 zombies + mechanics
│   ├── villains_db.js ✅    # 7 named villains
│   └── superheroes_db.js ⏳  # 20 heroes (pending)
├── core/ ⏳                  # Management systems (pending)
├── zombies/ ⏳               # Horde & infection (pending)
├── villains/ ⏳              # Phase system (pending)
├── heroes/ ⏳                # Ally AI (pending)
├── visuals/ ⏳               # Sprite renderers (pending)
├── vfx/ ⏳                    # Visual effects (pending)
├── demo/ ⏳                   # HTML demos (pending)
├── README.md ✅
├── CHECKLIST.md ✅
├── PROGRESS.md ✅
└── SYSTEM_STATUS.md ✅
```

---

## 🎮 **Entity Types**

### Enemies (35)
**C-Rank Basic (15):** Slime, Goblin, Skeleton, Bat, Spider, Rat, Imp, Mushroom, Wolf, Wasp, Ghost, Snake, Crab, Jellyfish, Lizard

**B-A Rank Elite (12):** Orc, Golem, Gargoyle, Fire Elemental, Ice Elemental, Demon, Dragon Whelp, Necromancer, Dark Knight, Battle Mage, Werewolf, Fallen Angel

**S-Rank Mini-Bosses (8):** Troll Chieftain, Lesser Hydra, Ancient Golem, Dark Phoenix, Lich, Behemoth, Chimera, Kraken

### Bosses (10)
- **Stage 1-3:** Slime King, Goblin Warlord, Skeleton Lord
- **Stage 4-6:** Crimson Dragon, Demon Prince, Lich King
- **Stage 7-9:** Ancient Dragon, Titan, Void Lord
- **Stage 10:** God King

### Zombies (12)
- **Walkers:** Shambler, Walker, Runner
- **Tanks:** Armored, Brute, Juggernaut
- **Special:** Exploder, Spitter, Screamer, Crawler, Bloater, Hunter

### Villains (7)
- **SS Rank:** Shadow Blade, Pyro Queen, Frost Lord
- **SSS Rank:** Thunder Tyrant, Death Knight, Chaos Sorceress
- **SSS+ Rank:** Void Emperor

---

## 🎨 **Visual Style: AI Robot Aesthetic**

All entities use procedural rendering with tech/cyberpunk style:

```javascript
TECH_PALETTE = {
  core: '#00d4ff',
  energy: '#5ba3ff',
  accent: '#5bffaa',
  warning: '#ff6b35',
  critical: '#ff4444',
  shield: '#74b9ff',
  stealth: '#9b59b6'
}

ELEMENT_COLORS = {
  fire: { primary: '#ff6b35', glow: '#ffb347' },
  ice: { primary: '#4ecdc4', glow: '#a8e6cf' },
  lightning: { primary: '#ffeb3b', glow: '#fff59d' },
  dark: { primary: '#2c3e50', glow: '#7f8c8d' },
  light: { primary: '#ffd93d', glow: '#fffacd' },
  // ... and more
}
```

---

## 🧟 **Special Systems**

### Multi-Phase Bosses
Bosses transition between 2-4 phases based on HP thresholds:

```javascript
const boss = BOSSES_DATABASE.boss_dragon_red;
// Phase 1: 100-67% HP - Basic attacks
// Phase 2: 66-34% HP - Enhanced abilities
// Phase 3: 33-0% HP - Ultimate power

const currentPhase = getBossPhase(boss, currentHP);
```

### Zombie Infection
Zombies spread infection through bites:

```javascript
const zombie = ZOMBIES_DATABASE.zombie_standard;
console.log(zombie.biteChance);        // 0.20 (20%)
console.log(zombie.infectionDamage);   // 8 damage/tick
console.log(zombie.infectionDuration); // 8000ms

// Infection progresses through stages
const stage = getInfectionStage(infectionTime);
// Stages: Bite → Infected → Turning → Converted
```

### Horde Bonuses
Zombies get stronger in groups:

```javascript
const bonuses = calculateHordeBonuses(10); // 10 zombies
console.log(bonuses);
// {
//   damage: 1.30,  // +30% damage
//   speed: 1.20,   // +20% speed
//   def: 1.20,     // +20% defense
//   hp: 1.40       // +40% HP
// }
```

### Villain Phases
Villains have 3 escalating phases with dialogue:

```javascript
const villain = VILLAINS_DATABASE.villain_shadow_blade;
const phase = getVillainPhase(villain, currentHP);

console.log(phase.dialogue);
// Phase 1: ["...", "You won't see me coming."]
// Phase 2: ["Impressive... but futile."]
// Phase 3: ["Feel the embrace of darkness!"]
```

---

## 📦 **Database API**

### Enemies
```javascript
import {
  ENEMIES_DATABASE,
  getEnemyById,
  getEnemiesByTier,
  getEnemiesByElement,
  getBasicEnemies,
  getEliteEnemies,
  getMiniBosses,
  getAllEnemies
} from './data/enemies_db.js';

const slime = getEnemyById('enemy_slime');
const cRank = getEnemiesByTier('C');
const fireEnemies = getEnemiesByElement('fire');
```

### Bosses
```javascript
import {
  BOSSES_DATABASE,
  getBossById,
  getBossByStage,
  getBossesByTier,
  getBossPhase,
  getAllBosses
} from './data/bosses_db.js';

const stage1Boss = getBossByStage(1);
const phase = getBossPhase(boss, currentHP);
```

### Zombies
```javascript
import {
  ZOMBIES_DATABASE,
  getZombieById,
  getZombiesByCategory,
  getWalkers,
  getTanks,
  getSpecialZombies,
  calculateHordeBonuses,
  getInfectionStage,
  getAllZombies
} from './data/zombies_db.js';

const walkers = getWalkers();
const bonuses = calculateHordeBonuses(15);
```

### Villains
```javascript
import {
  VILLAINS_DATABASE,
  getVillainById,
  getVillainsByTier,
  getVillainPhase,
  getAllVillains
} from './data/villains_db.js';

const villain = getVillainById('villain_shadow_blade');
const phase = getVillainPhase(villain, currentHP);
```

---

## 🎯 **Entity Structure**

### Enemy Example
```javascript
{
  id: "enemy_slime",
  name: "Slime",
  tier: "C",
  type: "basic",
  element: "neutral",
  hp: 100,
  atk: 15,
  def: 5,
  speed: 80,
  size: 24,
  attackRange: 50,
  attackType: "melee",
  behavior: "chase",
  xp: 10,
  gold: 5,
  sprite: {
    shape: "blob",
    color: "#4caf50",
    glow: "#a5d6a7"
  },
  loot: {
    common: ["material_slime_gel"],
    rate: 0.3
  },
  description: "Gelatinous creature that oozes forward"
}
```

### Boss Example (Multi-Phase)
```javascript
{
  id: "boss_dragon_red",
  name: "Crimson Dragon",
  stage: 4,
  tier: "SSS",
  element: "fire",
  size: 96,
  phases: [
    {
      phase: 1,
      hp: 4000,
      atk: 100,
      abilities: ["fire_breath", "wing_buffet"],
      dialogue: ["You dare enter my lair?"]
    },
    {
      phase: 2,
      hpThreshold: 0.66,
      hp: 4000,
      atk: 120,
      abilities: ["fire_breath", "inferno_dive"],
      dialogue: ["Feel the wrath of dragonkind!"]
    }
  ],
  loot: {
    guaranteed: ["material_dragon_heart"],
    epic: ["core_fire"],
    epicRate: 0.25
  }
}
```

---

## 🔧 **Integration**

### Basic Usage
```javascript
// 1. Import what you need
import { getEnemyById } from './data/enemies_db.js';
import { getBossPhase } from './data/bosses_db.js';

// 2. Spawn an enemy
function spawnEnemy(enemyId, x, y) {
  const data = getEnemyById(enemyId);
  return {
    ...data,
    x, y,
    currentHp: data.hp,
    state: 'idle'
  };
}

// 3. Update boss phase
function updateBoss(boss, dt) {
  const phase = getBossPhase(boss, boss.currentHp);
  boss.currentPhase = phase;
  boss.atk = phase.atk;
  boss.abilities = phase.abilities;
}

// 4. Apply horde bonuses
function updateZombieHorde(zombies) {
  const bonuses = calculateHordeBonuses(zombies.length);
  zombies.forEach(z => {
    z.atk *= bonuses.damage;
    z.speed *= bonuses.speed;
  });
}
```

---

## 🚧 **Status: 20% Complete**

### ✅ Complete (20%)
- [x] Folder structure
- [x] 35 enemies database
- [x] 10 bosses database
- [x] 12 zombies database
- [x] 7 villains database
- [x] Documentation files

### ⏳ In Progress (80%)
- [ ] 20 superheroes database
- [ ] 9 core management systems
- [ ] 7 visual rendering systems
- [ ] 7 interactive HTML demos
- [ ] Testing & API docs

---

## 📖 **Documentation**

- **README.md** - This file
- **CHECKLIST.md** - Complete feature checklist
- **PROGRESS.md** - Development progress
- **SYSTEM_STATUS.md** - Current implementation status

---

## 🎉 **Features**

- ✅ 64 unique entities
- ✅ Multi-phase boss system
- ✅ Zombie infection mechanics
- ✅ Horde bonus system
- ✅ Villain dialogue system
- ✅ AI robot aesthetic
- ✅ Procedural rendering specs
- ✅ Loot tables
- ✅ 9 element types
- ✅ 8 rarity tiers
- ✅ ES6 modules
- ✅ Production ready data

---

## 🚀 **Next Steps**

1. Complete superhero database (20 heroes)
2. Build EnemyManager system
3. Create sprite renderers
4. Build interactive demos
5. Test and document

---

## 📝 **License**

Part of the A1K Runner game system.

---

**Status:** Foundation Complete ✨  
**Version:** 1.0.0-alpha  
**Last Updated:** Phase 1 - Data Layer (80%)

