# Game Systems Library

> Production-ready, standalone game systems for any project

A comprehensive collection of 5 core game systems that can be integrated into any game project. Each system is completely standalone, framework-agnostic, and ready for production use.

## 🎮 Systems Included

### 📜 Quest System
Complete quest and mission tracking with progression, rewards, and multiple quest types.

**Features:**
- Story quests with unlock chains
- Mission board (kill quests, time challenges)
- Daily/weekly quests
- Reward system
- Progress tracking
- Save/load support

### ✨ Supernatural System
Manages supernatural abilities, spirits, and elemental powers.

**Features:**
- Active & passive abilities
- Spirit equipping with bonuses
- Mastery ranking system
- Cooldown management
- Visual effects integration
- Element-based powers

### 👤 Skin System
Character skin management with unlocking, equipping, and previewing.

**Features:**
- Multiple character support
- Unlock system with conditions
- Rarity tiers
- Preview rendering
- Scale customization
- Save/load support

### 🎒 Inventory System
Complete inventory and equipment management.

**Features:**
- Item stacking
- Equipment slots (weapon, armor, accessory)
- Item categories and rarities
- Sorting and filtering
- Consumables system
- Stat bonuses

### ⚙️ Settings System
Comprehensive game settings management.

**Features:**
- Audio settings (master/sfx/music)
- Graphics presets
- Gameplay options
- Key bindings
- UI customization
- Import/export settings

## 🚀 Quick Start

### Installation

```bash
# Clone or download the repository
git clone https://github.com/yourusername/game-systems.git

# Or use individual files directly
```

### Basic Usage

```html
<!-- Include the system -->
<script src="systems/quests/quest-system.js"></script>

<script>
  // Create instance
  const questSystem = new QuestSystem();
  
  // Initialize with data
  await questSystem.initialize({
    questTemplates: [
      {
        id: 'quest_001',
        title: 'First Quest',
        objectives: [{ type: 'kill', target: 'slime', count: 10 }],
        rewards: { gold: 100, xp: 50 }
      }
    ]
  });
  
  // Start a quest
  questSystem.startQuest('quest_001');
  
  // Update progress
  questSystem.updateProgress('quest_001', 'kill', 'slime', 1);
  
  // Listen to events
  window.addEventListener('quest:completed', (e) => {
    console.log('Quest completed!', e.detail);
  });
</script>
```

### Using All Systems Together

```html
<!-- Include unified library -->
<script src="unified/all-systems.js"></script>

<script>
  // Load all systems
  await GameSystems.loadAll();
  
  // Create instances
  const systems = GameSystems.createAllSystems({
    quests: { maxSlots: 20 },
    inventory: { maxSlots: 50 }
  });
  
  // Initialize all
  await GameSystems.initializeAll(systems, {
    quests: { questTemplates: [...] },
    inventory: { itemDatabase: {...} }
  });
  
  // Use systems
  systems.quests.startQuest('quest_001');
  systems.inventory.addItem('sword', 1);
</script>
```

## 📁 File Structure

```
others-system/
├── systems/              # Individual system modules
│   ├── quests/
│   │   ├── quest-system.js
│   │   └── README.md
│   ├── supernatural/
│   ├── skins/
│   ├── items/
│   └── settings/
├── unified/              # Unified library
│   ├── all-systems.js
│   └── API_REFERENCE.md
├── utils/                # Shared utilities
│   ├── event-bus.js
│   ├── storage-helper.js
│   └── common-utils.js
├── demos/                # Demo pages
│   ├── index.html
│   └── quest-showcase.html
├── data/                 # Example data templates
│   ├── quests-example.json
│   └── items-example.json
├── styles/               # Shared CSS
│   ├── systems-base.css
│   └── demo-styles.css
├── README.md
└── INTEGRATION_GUIDE.md
```

## 🎨 Demo

Open `demos/index.html` in your browser to see all systems in action.

**Live demos available for:**
- Quest System
- Supernatural System
- Skin System
- Inventory System
- Settings System

## 📖 Documentation

- **[Integration Guide](INTEGRATION_GUIDE.md)** - Step-by-step integration guide
- **[API Reference](unified/API_REFERENCE.md)** - Complete API documentation
- **System-specific READMEs** - Detailed docs for each system

## ✨ Features

- **🎯 Standalone** - Each system works independently
- **📦 Framework-Agnostic** - Pure vanilla JavaScript
- **💾 Save/Load** - Built-in localStorage support
- **🎪 Event-Driven** - Custom event system for integration
- **📱 Responsive** - Works on desktop and mobile
- **🎨 Customizable** - Easy to modify and extend
- **📝 Well-Documented** - Comprehensive documentation and examples
- **⚡ Performance-Optimized** - Efficient and lightweight

## 🔧 Integration

### Method 1: Direct Script Tags

```html
<script src="systems/quests/quest-system.js"></script>
<script>
  const quests = new QuestSystem();
</script>
```

### Method 2: ES6 Modules

```javascript
import QuestSystem from './systems/quests/quest-system.js';
const quests = new QuestSystem();
```

### Method 3: CommonJS

```javascript
const QuestSystem = require('./systems/quests/quest-system.js');
const quests = new QuestSystem();
```

## 🎯 Use Cases

- **RPG Games** - Quest progression, inventory, character customization
- **Action Games** - Ability systems, power-ups, settings
- **Adventure Games** - Quest tracking, item collection
- **Mobile Games** - Lightweight, touch-friendly UI
- **Web Games** - No build step required, works immediately
- **Game Prototypes** - Quick integration for testing

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## 📄 License

MIT License - feel free to use in commercial and personal projects.

## 🙏 Credits

Built with ❤️ for game developers everywhere.

## 📞 Support

- **Documentation**: See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **Issues**: Open an issue on GitHub
- **Demos**: Check out the demos folder

## 🔄 Version History

### 1.0.0 (Current)
- Initial release
- 5 core systems
- Complete documentation
- Demo pages
- Production-ready

## 🚧 Roadmap

- [ ] TypeScript definitions
- [ ] Unit tests
- [ ] More example templates
- [ ] Additional systems (achievements, leaderboards)
- [ ] Framework integrations (React, Vue)
- [ ] Mobile-specific optimizations

---

**Ready to get started?** Check out the [Integration Guide](INTEGRATION_GUIDE.md) or open `demos/index.html` to see the systems in action!

