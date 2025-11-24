# Integration Guide

Complete guide to integrating Game Systems into your project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [System Setup](#system-setup)
3. [Data Configuration](#data-configuration)
4. [Event Handling](#event-handling)
5. [Save/Load](#saveload)
6. [Advanced Integration](#advanced-integration)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Step 1: Include the Systems

Choose your preferred integration method:

#### Option A: Individual Systems

```html
<!-- Include only what you need -->
<script src="systems/quests/quest-system.js"></script>
<script src="systems/inventory/inventory-system.js"></script>
```

#### Option B: Unified Library

```html
<!-- Include everything -->
<script src="unified/all-systems.js"></script>
```

#### Option C: ES6 Modules

```javascript
import QuestSystem from './systems/quests/quest-system.js';
import InventorySystem from './systems/items/inventory-system.js';
```

### Step 2: Include Utilities (Optional)

For enhanced functionality:

```html
<script src="utils/event-bus.js"></script>
<script src="utils/storage-helper.js"></script>
<script src="utils/common-utils.js"></script>
```

### Step 3: Include Styles (Optional)

```html
<link rel="stylesheet" href="styles/systems-base.css">
```

## System Setup

### Quest System

```javascript
// 1. Create instance
const questSystem = new QuestSystem({
  storageKey: 'my_game_quests',  // Custom storage key
  autoSave: true,                 // Auto-save progress
  eventBus: myEventBus            // Optional event bus
});

// 2. Prepare data
const questData = {
  questTemplates: [
    {
      id: 'quest_001',
      title: 'First Quest',
      description: 'Complete your first adventure',
      objectives: [
        {
          type: 'kill',
          target: 'slime',
          count: 10,
          description: 'Defeat 10 slimes'
        }
      ],
      rewards: {
        gold: 1000,
        xp: 100,
        items: ['health_potion']
      },
      unlocks: ['quest_002']
    }
  ],
  dailyQuests: [...],
  weeklyQuests: [...]
};

// 3. Initialize
await questSystem.initialize(questData);

// 4. Use the system
questSystem.startQuest('quest_001');
questSystem.updateProgress('quest_001', 'kill', 'slime', 1);
```

### Supernatural System

```javascript
const supernatural = new SupernaturalSystem({
  storageKey: 'my_game_supernatural',
  autoSave: true
});

await supernatural.initialize({
  abilities: [
    {
      id: 'divine_barrier',
      name: 'Divine Barrier',
      type: 'active',
      cooldown: 12000,
      duration: 5000,
      bonuses: { defense: 50 }
    }
  ],
  spirits: [
    {
      id: 'spirit_phoenix',
      name: 'Phoenix Spirit',
      bonuses: { attack: 20, fireDamage: 0.25 }
    }
  ]
});

// Trigger ability
supernatural.triggerAbility('divine_barrier');

// Equip spirit
supernatural.equipSpirit('spirit_phoenix');
```

### Skin System

```javascript
const skins = new SkinSystem({
  storageKey: 'my_game_skins',
  autoSave: true
});

await skins.initialize({
  characters: {
    hero: { name: 'Hero', defaultColor: '#FF6B9D' }
  },
  skins: {
    hero: {
      default: {
        name: 'Default Hero',
        unlocked: true,
        type: 'procedural'
      },
      warrior: {
        name: 'Warrior',
        type: 'sprite',
        sprite: 'hero_warrior',
        rarity: 'rare'
      }
    }
  }
});

// Unlock and equip
skins.unlockSkin('hero', 'warrior');
skins.equipSkin('hero', 'warrior');
```

### Inventory System

```javascript
const inventory = new InventorySystem({
  maxSlots: 50,
  storageKey: 'my_game_inventory',
  autoSave: true
});

await inventory.initialize({
  itemDatabase: {
    sword: {
      id: 'sword',
      name: 'Iron Sword',
      category: 'weapon',
      rarity: 'common',
      stats: { attack: 15 },
      stackable: false
    },
    potion: {
      id: 'potion',
      name: 'Health Potion',
      category: 'consumable',
      rarity: 'common',
      stackable: true,
      maxStack: 99,
      effects: { heal: 50 }
    }
  }
});

// Add items
inventory.addItem('sword', 1);
inventory.addItem('potion', 5);

// Equip item
inventory.equipItem('sword', 'weapon');

// Use consumable
const effects = inventory.useConsumable('potion');
```

### Settings System

```javascript
const settings = new SettingsSystem({
  storageKey: 'my_game_settings',
  autoSave: true
});

await settings.initialize({
  masterVolume: 0.8,
  quality: 'high'
});

// Change settings
settings.set('masterVolume', 0.5);
settings.set('quality', 'ultra');

// Get settings
const volume = settings.get('masterVolume');

// Apply preset
settings.applyPreset('performance');
```

## Data Configuration

### Loading from JSON Files

```javascript
// Fetch data
const questData = await fetch('data/quests-example.json').then(r => r.json());

// Initialize with data
await questSystem.initialize(questData);
```

### Loading from API

```javascript
const response = await fetch('https://api.mygame.com/quests');
const questData = await response.json();
await questSystem.initialize(questData);
```

### Inline Configuration

```javascript
await questSystem.initialize({
  questTemplates: [/* ... */],
  dailyQuests: [/* ... */]
});
```

## Event Handling

All systems emit events that you can listen to:

### Using Window Events

```javascript
window.addEventListener('quest:started', (event) => {
  console.log('Quest started:', event.detail);
});

window.addEventListener('quest:completed', (event) => {
  const { quest, rewards } = event.detail;
  console.log(`Completed ${quest.title}!`);
  giveRewards(rewards);
});

window.addEventListener('item:added', (event) => {
  console.log('Item added:', event.detail);
});
```

### Using Event Bus (Optional)

```javascript
// Create shared event bus
const eventBus = EventBus.default;

// Pass to systems
const quests = new QuestSystem({ eventBus });
const inventory = new InventorySystem({ eventBus });

// Listen to events
eventBus.on('quest:completed', (data) => {
  // Give rewards
  const rewards = data.rewards;
  if (rewards.gold) {
    playerGold += rewards.gold;
  }
  if (rewards.items) {
    rewards.items.forEach(item => inventory.addItem(item, 1));
  }
});
```

### Available Events

**Quest System:**
- `quest:initialized`
- `quest:started`
- `quest:progress`
- `quest:objective_completed`
- `quest:completed`
- `mission:started`
- `mission:progress`
- `mission:completed`
- `daily_quest:completed`

**Supernatural System:**
- `supernatural:ready`
- `ability:triggered`
- `ability:ranked_up`
- `spirit:equipped`
- `bonuses:updated`

**Skin System:**
- `skin:initialized`
- `skin:equipped`
- `skin:unlocked`
- `skin:locked`

**Inventory System:**
- `inventory:initialized`
- `item:added`
- `item:removed`
- `item:equipped`
- `item:unequipped`
- `consumable:used`

**Settings System:**
- `settings:initialized`
- `setting:changed`
- `settings:reset`
- `preset:applied`

## Save/Load

All systems support automatic save/load:

### Automatic Save

```javascript
const system = new QuestSystem({
  autoSave: true  // Saves automatically on changes
});
```

### Manual Save/Load

```javascript
// Save manually
questSystem.save();

// Load manually
questSystem.load();
```

### Export/Import

```javascript
// Export all data
const saveData = {
  quests: questSystem.exportData(),
  inventory: inventorySystem.exportData(),
  skins: skinSystem.exportData()
};

// Save to file
const json = JSON.stringify(saveData);
localStorage.setItem('game_save', json);

// Load from file
const loadedData = JSON.parse(localStorage.getItem('game_save'));
questSystem.importData(loadedData.quests);
inventorySystem.importData(loadedData.inventory);
skinSystem.importData(loadedData.skins);
```

### Cross-System Save

```javascript
// Using unified library
const systems = GameSystems.createAllSystems();
await GameSystems.initializeAll(systems);

// Export everything
const saveData = GameSystems.exportAllData(systems);
localStorage.setItem('full_save', JSON.stringify(saveData));

// Import everything
const loadedData = JSON.parse(localStorage.getItem('full_save'));
GameSystems.importAllData(systems, loadedData);
```

## Advanced Integration

### Connecting Systems Together

```javascript
// Quest completion gives items
window.addEventListener('quest:completed', (event) => {
  const { rewards } = event.detail;
  
  // Add items to inventory
  if (rewards.items) {
    rewards.items.forEach(itemId => {
      inventorySystem.addItem(itemId, 1);
    });
  }
  
  // Unlock skins
  if (rewards.skin) {
    skinSystem.unlockSkin(rewards.character, rewards.skin);
  }
});

// Level up unlocks abilities
function onLevelUp(newLevel) {
  if (newLevel === 10) {
    supernatural.unlockAbility('dash_nova');
  }
}
```

### Custom Visual Effects

```javascript
// Override visual effect handlers
const supernatural = new SupernaturalSystem();

supernatural.createBarrierEffect = function() {
  // Your custom particle effects
  createParticles('barrier', playerX, playerY);
  playSound('divine_shield.mp3');
};
```

### UI Integration

```javascript
// Update UI when quest progress changes
window.addEventListener('quest:progress', (event) => {
  const quest = event.detail;
  updateQuestUI(quest);
});

function updateQuestUI(quest) {
  const questEl = document.getElementById(`quest-${quest.id}`);
  quest.objectives.forEach((obj, i) => {
    const progressBar = questEl.querySelector(`.objective-${i} .progress`);
    const percentage = (obj.progress / obj.count) * 100;
    progressBar.style.width = `${percentage}%`;
  });
}
```

## Best Practices

### 1. Initialize Early

```javascript
// Initialize all systems before game starts
async function initGame() {
  await questSystem.initialize(questData);
  await inventorySystem.initialize(inventoryData);
  await skinSystem.initialize(skinData);
  
  // Now start game
  startGame();
}
```

### 2. Use Event Bus for Large Projects

```javascript
// Centralized event handling
const eventBus = EventBus.default;

// All systems use same event bus
const systems = {
  quests: new QuestSystem({ eventBus }),
  inventory: new InventorySystem({ eventBus }),
  skins: new SkinSystem({ eventBus })
};
```

### 3. Validate Data

```javascript
// Validate quest data before initializing
function validateQuestData(data) {
  if (!data.questTemplates || !Array.isArray(data.questTemplates)) {
    throw new Error('Invalid quest data');
  }
  return true;
}

const questData = await loadQuestData();
if (validateQuestData(questData)) {
  await questSystem.initialize(questData);
}
```

### 4. Handle Errors

```javascript
try {
  await questSystem.initialize(questData);
} catch (error) {
  console.error('Failed to initialize quest system:', error);
  // Show error message to user
  showErrorMessage('Failed to load quests');
}
```

### 5. Clean Up

```javascript
// When switching scenes or restarting
function cleanUp() {
  // Export data before cleanup
  const saveData = questSystem.exportData();
  localStorage.setItem('quest_backup', JSON.stringify(saveData));
  
  // Clear event listeners
  window.removeEventListener('quest:completed', handleQuestComplete);
}
```

## Troubleshooting

### System Not Loading

```javascript
// Check if system is defined
if (typeof QuestSystem === 'undefined') {
  console.error('QuestSystem not loaded');
}

// Check initialization
if (!questSystem.initialized) {
  console.warn('QuestSystem not initialized');
}
```

### Save Not Working

```javascript
// Check localStorage availability
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available');
}

// Enable autosave
questSystem.options.autoSave = true;
```

### Events Not Firing

```javascript
// Enable debug mode on event bus
EventBus.setDebugMode(true);

// Check if listeners are registered
console.log(EventBus.getListenerCount('quest:completed'));
```

### Performance Issues

```javascript
// Disable autosave for batch operations
questSystem.options.autoSave = false;

// Do many operations
for (let i = 0; i < 100; i++) {
  questSystem.updateProgress('quest_001', 'kill', 'slime', 1);
}

// Re-enable and save once
questSystem.options.autoSave = true;
questSystem.save();
```

## Next Steps

- Check out the [API Reference](unified/API_REFERENCE.md) for complete method documentation
- Explore the [demos](demos/) for working examples
- Join the community for support and updates

---

Need help? Open an issue or check the documentation!

