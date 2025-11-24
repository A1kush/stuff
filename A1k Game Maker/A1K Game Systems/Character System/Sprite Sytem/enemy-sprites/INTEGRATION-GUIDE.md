# A1K Enemy Sprite System - Integration Guide

## Overview

The A1K Enemy Sprite System is a complete, production-ready enemy sprite solution for HTML5 games. It features:

- **41+ Enemy Types** across 5 tiers (C, B, A, S, SS)
- **3 Art Styles** (Chibi Kawaii, HD Pixel Art, Hybrid Enhanced)
- **Full-body Sprites** with arms, legs, and weapons
- **Dynamic Rendering** with canvas-based sprite generation
- **Bestiary System** for enemy collection tracking
- **Universal Compatibility** - Works with any HTML5 game

## Quick Start

### 1. Add Scripts to Your Game

Add these three scripts to your HTML file's `<head>` section:

```html
<!-- A1K Enemy Sprite System -->
<script src="path/to/enemy-sprites/shared/enemy-sprite-data.js"></script>
<script src="path/to/enemy-sprites/shared/enemy-sprite-renderer.js"></script>
<script src="path/to/enemy-sprites/shared/bestiary-system.js"></script>
```

### 2. Basic Usage

#### Render an Enemy

```javascript
// Get enemy data
const enemyData = window.EnemySpriteAPI.getEnemy('enemy_slime');

// Create enemy instance
const enemy = {
    ...enemyData,
    x: 100,
    y: 100,
    currentHp: enemyData.hp
};

// Render on canvas
const ctx = yourCanvas.getContext('2d');
window.enemySpriteRenderer.renderEnemy(ctx, enemy, enemy.x, enemy.y, 1.0);
```

#### Toggle Bestiary UI

```javascript
// Show/hide bestiary
window.bestiarySystem.toggle();

// Or add keyboard shortcut (e.g., 'B' key)
document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyB') {
        window.bestiarySystem.toggle();
    }
});
```

#### Track Enemy Defeats

```javascript
// When an enemy is defeated
window.bestiarySystem.recordDefeat(enemy.id);

// This automatically:
// - Discovers the enemy
// - Increments defeat count
// - Saves progress to localStorage
```

## API Reference

### EnemySpriteAPI

Access enemy sprite data:

```javascript
// Get single enemy
const slime = window.EnemySpriteAPI.getEnemy('enemy_slime');

// Get all enemies
const allEnemies = window.EnemySpriteAPI.getAllEnemies();

// Get enemies by tier
const cRankEnemies = window.EnemySpriteAPI.getEnemiesByTier('C');
const bosses = window.EnemySpriteAPI.getEnemiesByTier('SS');

// Get enemies by type
const basicEnemies = window.EnemySpriteAPI.getEnemiesByType('basic');
const eliteEnemies = window.EnemySpriteAPI.getEnemiesByType('elite');

// Get sprite path
const spritePath = window.EnemySpriteAPI.getSpritePath('enemy_slime', 'type-7-chibi-kawaii');

// Get available art styles
const styles = window.EnemySpriteAPI.getArtStyles();
// Returns: ['type-7-chibi-kawaii', 'type-1-hd-pixel-art', 'type-5-hybrid-enhanced']
```

### EnemySpriteRenderer

Render enemies on canvas:

```javascript
const renderer = new EnemySpriteRenderer();

// Render enemy
renderer.renderEnemy(ctx, enemy, x, y, scale);

// Set animation state
renderer.setAnimationState(enemy.id, 'attack');

// Get animation state
const state = renderer.getAnimationState(enemy.id);
```

### BestiarySystem

Track and display enemy collection:

```javascript
const bestiary = window.bestiarySystem;

// Discovery and tracking
bestiary.discoverEnemy('enemy_slime');
bestiary.recordDefeat('enemy_slime');

// Check discovery status
const isDiscovered = bestiary.isDiscovered('enemy_slime');

// Get defeat count
const defeats = bestiary.getDefeatCount('enemy_slime');

// Get completion stats
const completion = bestiary.getCompletionPercentage(); // Returns 0-100
const tierCompletion = bestiary.getCompletionByTier(); // Returns object with per-tier stats

// UI control
bestiary.show();
bestiary.hide();
bestiary.toggle();
```

## Enemy Data Structure

Each enemy in the database has the following structure:

```javascript
{
    id: 'enemy_slime',
    name: 'Candy Slime Villain',
    tier: 'C',           // C, B, A, S, or SS
    type: 'basic',       // basic, elite, flying, boss
    element: 'neutral',  // fire, ice, dark, nature, etc.
    hp: 100,
    atk: 15,
    def: 5,
    speed: 80,
    sprites: {
        'type-7-chibi-kawaii': 'candy-slime-villain.html',
        'type-1-hd-pixel-art': 'slime-pixel.html',
        'type-5-hybrid-enhanced': 'slime-hybrid.html'
    },
    animations: ['idle', 'attack'],
    variants: ['pink', 'purple', 'blue'],
    size: { width: 256, height: 256 },
    description: 'Gelatinous candy creature with whip weapon'
}
```

## Integration Examples

### Example 1: Runner Game

```javascript
// In your game update loop
function updateEnemies(dt) {
    enemies.forEach(enemy => {
        // Update enemy position
        enemy.x += enemy.vx * dt;
        enemy.y += enemy.vy * dt;
        
        // Check if defeated
        if (enemy.hp <= 0) {
            window.bestiarySystem.recordDefeat(enemy.id);
            enemies.splice(enemies.indexOf(enemy), 1);
        }
    });
}

// In your game render loop
function renderEnemies(ctx) {
    enemies.forEach(enemy => {
        window.enemySpriteRenderer.renderEnemy(ctx, enemy, enemy.x, enemy.y, 1.0);
        
        // Draw HP bar
        const hpRatio = enemy.hp / enemy.maxHp;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(enemy.x - 20, enemy.y - 40, 40 * hpRatio, 5);
    });
}
```

### Example 2: Wave-Based Game

```javascript
function spawnWave(waveNumber) {
    const enemyCount = 3 + waveNumber;
    const tierMap = {
        1: 'C',
        5: 'B',
        10: 'A',
        15: 'S',
        20: 'SS'
    };
    
    // Determine tier based on wave
    let tier = 'C';
    for (const [wave, tierName] of Object.entries(tierMap)) {
        if (waveNumber >= parseInt(wave)) tier = tierName;
    }
    
    // Get enemies of appropriate tier
    const availableEnemies = window.EnemySpriteAPI.getEnemiesByTier(tier);
    
    // Spawn random enemies
    for (let i = 0; i < enemyCount; i++) {
        const enemyData = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
        spawnEnemy(enemyData);
    }
}
```

### Example 3: Bag System Integration

```javascript
// Add enemies tab to your inventory UI
function createEnemiesTab() {
    const enemies = window.EnemySpriteAPI.getAllEnemies();
    
    enemies.forEach(enemy => {
        const discovered = window.bestiarySystem.isDiscovered(enemy.id);
        const defeats = window.bestiarySystem.getDefeatCount(enemy.id);
        
        // Create UI element
        const card = document.createElement('div');
        card.className = 'enemy-card';
        card.innerHTML = `
            <div class="enemy-name">${discovered ? enemy.name : '???'}</div>
            <div class="enemy-tier">${enemy.tier}-RANK</div>
            ${discovered ? `<div>Defeated: ${defeats}</div>` : ''}
        `;
        
        // Add to UI
        enemiesContainer.appendChild(card);
    });
}
```

## Customization

### Adding Custom Enemies

To add your own enemies to the database, edit `enemy-sprite-data.js`:

```javascript
// In ENEMY_SPRITE_DATABASE object
enemy_custom: {
    id: 'enemy_custom',
    name: 'Your Enemy Name',
    tier: 'B',
    type: 'elite',
    element: 'fire',
    hp: 200,
    atk: 30,
    def: 15,
    speed: 120,
    sprites: {
        'type-7-chibi-kawaii': 'your-enemy.html',
        'type-1-hd-pixel-art': 'your-enemy-pixel.html',
        'type-5-hybrid-enhanced': 'your-enemy-hybrid.html'
    },
    animations: ['idle', 'attack'],
    variants: ['red', 'blue'],
    size: { width: 256, height: 256 },
    description: 'Your enemy description'
}
```

### Custom Rendering

You can override the default renderer:

```javascript
// Custom render function
function customRenderEnemy(ctx, enemy, x, y, scale) {
    // Your custom rendering logic here
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // Draw custom sprite
    // ...
    
    ctx.restore();
}

// Use in game
customRenderEnemy(ctx, enemy, enemy.x, enemy.y, 1.0);
```

## Demos

The system includes two demo files:

1. **ENEMY-SHOWCASE.html** - Browse all enemy sprites
   - Filter by tier
   - View stats
   - See all available enemies

2. **BATTLEFIELD-DEMO.html** - See sprites in action
   - Spawn enemies
   - Test animations
   - Performance testing with 50+ enemies

## Performance Tips

- The renderer uses procedural generation which is fast and memory-efficient
- Sprites are cached automatically
- For 100+ enemies on screen, consider:
  - Reducing render distance
  - Using simpler sprites for distant enemies
  - Batching draw calls

## Troubleshooting

### Sprites not rendering
- Check that all three scripts are loaded
- Verify enemy ID exists in database
- Check browser console for errors

### Bestiary not opening
- Ensure `window.bestiarySystem` is initialized
- Check for JavaScript errors
- Verify event handler is attached

### Performance issues
- Reduce number of simultaneous enemies
- Use smaller sprite scales
- Check for memory leaks

## Support

For issues or questions:
- Check the ENEMY-LIST.md for complete enemy reference
- Review the demo files for working examples
- Ensure all scripts are loaded in correct order

## License

This system is part of the A1K Game Systems suite.
Use freely in your projects!

