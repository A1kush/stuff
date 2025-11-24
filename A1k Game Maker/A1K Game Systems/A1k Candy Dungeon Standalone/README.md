# Production-Ready Dungeon System

A generic, configurable, production-ready dungeon system for any game. Features modular architecture, comprehensive configuration, error handling, and performance optimizations.

## Features

- ✅ **Fully Configurable** - Customize every aspect via configuration
- ✅ **Theme-Agnostic** - Works with any game theme
- ✅ **Modular Architecture** - Clean separation of concerns
- ✅ **Error Handling** - Comprehensive error boundaries and reporting
- ✅ **Performance Optimized** - Frame skipping, particle limits, entity caps
- ✅ **3rd Person Camera** - Smooth camera following
- ✅ **Extensible Hooks** - Custom event hooks for game integration
- ✅ **Production Ready** - Battle-tested code with validation

## Quick Start

### 1. Include the Files

```html
<script src="dungeon-config.js"></script>
<script src="dungeon-renderer.js"></script>
```

### 2. Customize Configuration (Optional)

```javascript
// Override default configuration
const customConfig = window.DungeonConfig.merge({
  theme: {
    name: 'My Game',
    backgroundColor: '#1a1a2e',
    accentColor: '#0f3460'
  },
  player: {
    speed: 8,
    maxHealth: 150,
    color: '#e94560'
  }
});

// Initialize renderer
window.dungeonRenderer = new window.DungeonInteriorRenderer(customConfig);
window.dungeonRenderer.init();
```

### 3. Start a Dungeon

```javascript
window.dungeonRenderer.startDungeon({
  rankId: 'C',
  room: roomData
});
```

## Configuration Options

### Theme Configuration

```javascript
theme: {
  name: 'Dungeon',              // Game name/theme
  backgroundColor: '#0a0a0a',   // Background color
  foregroundColor: '#1a1a1a',   // Foreground color
  accentColor: '#4ecdc4',      // Accent color
  textColor: '#ffffff',         // Text color
  uiBackground: 'rgba(15, 24, 38, 0.95)',
  uiBorder: 'rgba(255, 255, 255, 0.2)'
}
```

### Player Configuration

```javascript
player: {
  width: 50,                    // Player width
  height: 70,                   // Player height
  speed: 6,                     // Movement speed
  jumpPower: 16,                // Jump strength
  maxHealth: 100,               // Maximum health
  color: '#4ecdc4',             // Player color
  outlineColor: '#ffffff',      // Outline color
  showName: true,               // Show name label
  name: 'Player',               // Player name
  showHealthBar: true,          // Show health bar
  invincibilityFrames: 30       // Invincibility duration
}
```

### Enemy Configuration

```javascript
enemy: {
  defaultWidth: 50,
  defaultHeight: 60,
  defaultSpeed: 2,
  speedVariation: 2,
  defaultHealth: 50,
  healthVariation: 50,
  showName: true,
  showHealthBar: true,
  colors: {
    default: '#ff6b6b',
    elite: '#a78bfa',
    boss: '#ff6bff',
    guard: '#ff9a9e',
    timed: '#7af8c8'
  }
}
```

### Physics Configuration

```javascript
physics: {
  gravity: 0.8,                 // Gravity strength
  friction: 0.85,               // Friction coefficient
  terminalVelocity: 20         // Max fall speed
}
```

### Camera Configuration

```javascript
camera: {
  followSpeed: 0.15,            // Camera follow speed (0-1)
  smoothFollow: true,            // Smooth camera movement
  followX: true,                 // Follow on X axis
  followY: true,                 // Follow on Y axis
  boundsCheck: true              // Clamp camera to room bounds
}
```

### Combat Configuration

```javascript
combat: {
  attackRange: 80,              // Attack range in pixels
  attackDamage: 25,              // Base attack damage
  attackCooldown: 20,           // Frames between attacks
  enemyDamage: 10,               // Enemy damage to player
  enemyAttackCooldown: 60       // Enemy attack cooldown
}
```

### Input Configuration

```javascript
input: {
  moveLeft: ['a', 'arrowleft'],
  moveRight: ['d', 'arrowright'],
  jump: ['w', 'arrowup', ' '],
  attack: [' ', 'space'],
  interact: ['e', 'E']
}
```

### Performance Configuration

```javascript
performance: {
  maxEnemies: 50,                // Maximum enemies per room
  maxPlatforms: 100,            // Maximum platforms
  maxChests: 20,                 // Maximum chests
  enableParticles: true,        // Enable particle effects
  particleLimit: 100,            // Maximum particles
  frameSkip: 0,                  // Frame skip (0 = no skip)
  enableDebug: false             // Enable debug logging
}
```

## Event Hooks

Customize behavior with event hooks:

```javascript
hooks: {
  onPlayerSpawn: (player, room) => {
    // Called when player spawns
  },
  onEnemySpawn: (enemy, room) => {
    // Called when enemy spawns
  },
  onRoomLoad: (room) => {
    // Called when room loads
  },
  onRoomComplete: (room, stats) => {
    // Called when room is cleared
  },
  onPlayerAttack: (player, target) => {
    // Called when player attacks
  },
  onPlayerDamage: (player, amount) => {
    // Called when player takes damage
  },
  onEnemyKilled: (enemy, rewards) => {
    // Called when enemy is killed
  },
  onChestOpened: (chest, rewards) => {
    // Called when chest is opened
  },
  onDungeonComplete: (dungeon, stats) => {
    // Called when dungeon is completed
  },
  onError: (error, context) => {
    // Called on errors
  }
}
```

## API Reference

### DungeonInteriorRenderer

#### Methods

- `init(canvasId = 'dungeonCanvas')` - Initialize the renderer
- `startDungeon(detail)` - Start a dungeon
- `loadRoom(room)` - Load a room
- `spawnEnemy(data)` - Spawn an enemy
- `playerAttack()` - Player attack action
- `playerTakeDamage(amount)` - Apply damage to player
- `tryInteract()` - Try to interact with objects
- `exitDungeon()` - Exit the dungeon
- `resizeCanvas()` - Resize canvas to fit container

#### Properties

- `playerStats` - Player state object
- `enemies` - Array of enemy objects
- `platforms` - Array of platform objects
- `chests` - Array of chest objects
- `currentRoom` - Current room data
- `camera` - Camera position object
- `stats` - Game statistics

## Room Data Format

Rooms should follow this structure:

```javascript
{
  width: 2400,                  // Room width
  height: 800,                  // Room height
  backgroundColor: '#0a0a0a',   // Background color
  foregroundColor: '#1a1a1a', // Foreground color
  floorNumber: 1,               // Floor number
  platforms: [                  // Platform array
    {
      x: 300,
      y: 600,
      width: 200,
      height: 20,
      color: '#3a3a3a',
      type: 'platform'
    }
  ],
  encounters: [                  // Enemy encounters
    {
      id: 'enemy_default',
      count: 3
    }
  ],
  chestSpawns: [                // Chest spawns
    {
      x: 600,
      y: 600,
      rewards: {}
    }
  ]
}
```

## Performance Tips

1. **Limit Entities**: Use `maxEnemies`, `maxPlatforms`, `maxChests` to cap entities
2. **Frame Skipping**: Set `frameSkip: 1` to skip every other frame on low-end devices
3. **Disable Particles**: Set `enableParticles: false` to disable particle effects
4. **Reduce Particle Limit**: Lower `particleLimit` for better performance
5. **Disable Debug**: Set `enableDebug: false` in production

## Error Handling

The system includes comprehensive error handling:

- All methods are wrapped in try-catch blocks
- Errors are logged with context
- Custom error handler via `hooks.onError`
- Graceful degradation on errors

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires Canvas API support
- Requires ES6+ JavaScript support

## License

Production-ready for any game. Customize as needed.

## Support

For issues or questions, check the configuration options and event hooks documentation above.
