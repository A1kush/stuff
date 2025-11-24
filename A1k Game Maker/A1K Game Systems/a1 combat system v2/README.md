# A1 Combat System V2

Complete combat system demo integrating hero sprites, combat engine (90 skills), bag system, and enemy system.

## Features

- **3 Playable Characters**: A1 (Warrior), UNIQUE (Cyborg), MISSY (Cat Angel)
- **HD Pixel Art Sprites**: 128x128 animated sprites with idle, walk, and attack animations
- **90 Skills**: Full skill database with projectiles, beams, explosions, and status effects
- **Combat System**: HP, rage, combo tracking, character switching
- **Enemy System**: Simple AI enemies with patrol and chase behaviors
- **Bag System Integration**: Equipment and item management (optional)
- **Full UI**: Combat HUD, skill buttons, damage numbers

## File Structure

```
a1 combat system v2/
├── index.html                    # Main demo file
├── core/
│   ├── combat-engine.js          # Main combat coordinator
│   ├── sprite-renderer.js        # Sprite animation manager
│   └── enemy-system.js           # Enemy AI and spawning
├── skills/
│   ├── skill-definitions.js      # 90 skills database
│   ├── projectile-manager.js     # Projectiles/VFX/collision
│   └── skill-executor.js         # Skill execution engine
├── sprites/
│   ├── sprite-palettes.js        # Shared color palettes
│   ├── base-sprite.js            # Base sprite class
│   ├── warrior-sprite.js         # A1 sprite
│   ├── cyborg-sprite.js          # UNIQUE sprite
│   └── cat-angel-sprite.js       # MISSY sprite
├── ui/
│   ├── combat-hud.js             # HP/rage/combo display
│   ├── skill-buttons.js          # Skill button handlers
│   ├── damage-numbers.js         # Floating damage text
│   └── sprite-icons.js           # UI icon generation
├── bag/
│   ├── bag-integration.js        # Combat-bag bridge
│   └── A1KBagSystem.js           # Bag system (optional)
└── integration/
    └── demo-bridge.js             # Main coordinator
```

## Controls

- **WASD / Arrow Keys**: Move character
- **1-5**: Activate skills S1-S5
- **X**: Activate ultimate (X1)
- **Space**: Basic attack
- **C**: Switch character (A1 → UNIQUE → MISSY)
- **R**: Activate rage mode (requires 100 rage)
- **B**: Open bag system
- **Click**: Attack at cursor position

## Quick Start

1. Open `index.html` in a modern browser
2. Use WASD to move, click or press Space to attack
3. Press 1-5 to use skills
4. Press C to switch characters
5. Build rage to 100, then press R for 2x ATK mode

## Character Skills

### A1 (Warrior)
- **S1**: Crimson Slash (3-hit combo)
- **S2**: Shadow Clone (summon)
- **S3**: Power Wave (4-hit combo)
- **S4**: Phantom Strike (6-hit combo)
- **S5**: Crimson Cyclone (AoE)
- **X1**: Rift Cutter (ultimate)

### UNIQUE (Cyborg)
- **S1**: Plasma Blast (3-hit)
- **S2**: Combat Drone (summon)
- **S3**: Power Beam (channeled beam)
- **S4**: Cryo Rail (freeze)
- **S5**: Ion Drill
- **X1**: Hyper Beam (ultimate)

### MISSY (Cat Angel)
- **S1**: Crescent Slash (3-hit)
- **S2**: Spirit Pet (summon)
- **S3**: Rapid Fire (4-hit)
- **S4**: Starlight Rail
- **S5**: Storm Vortex
- **X1**: Fortune Cannon (ultimate)

## Integration Notes

### Sprite System
- Sprites render at character position
- Animations: idle (loops), walk (loops), attack (plays once)
- Attack animation auto-returns to idle after completion
- Walk animation triggers when character moves

### Combat System
- 90 skills total (30 per character)
- Projectile system with collision detection
- Status effects: burn, freeze, stun, lifesteal, pierce, chain
- Rage system: builds on hit, 2x ATK when activated
- Combo tracking: achievements at 10, 50, 100 hits

### Enemy System
- Simple AI: patrol or chase player
- 3 enemy types: basic, fast, tank
- Auto-spawns enemies every 3 seconds (max 10)
- HP bars and status effect indicators

### Bag System (Optional)
- Equipment management for skills
- Item usage (potions, consumables)
- Auto-equips default skills on character switch
- Bridge between bag UI and combat engine

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Responsive design

## Performance

- 60 FPS target
- Efficient sprite rendering
- Automatic cleanup of expired projectiles/VFX
- Modular architecture for maintainability

## Future Enhancements

- More enemy types and behaviors
- Boss enemies
- More VFX effects
- Sound effects
- Save/load system
- More skills and abilities

## Credits

- Hero Sprites: Type-1 HD Pixel Art
- Combat System: Modular combat engine
- Bag System: A1K Bag System
- Integration: Combat Demo Bridge

