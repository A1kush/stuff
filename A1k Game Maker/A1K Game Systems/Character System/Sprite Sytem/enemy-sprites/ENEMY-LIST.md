# A1K Enemy Sprite System - Complete Enemy List

## Overview

This document lists all enemies available in the A1K Enemy Sprite System, organized by tier and type.

**Total Enemies:** 7 (with extensible database for 41+)
**Art Styles:** 3 (Chibi Kawaii, HD Pixel Art, Hybrid Enhanced)
**Tiers:** C, B, A, S, SS

## Enemy Tiers

- **C-RANK:** Basic enemies (HP: 80-140, ATK: 12-22)
- **B-RANK:** Elite enemies (HP: 180-300, ATK: 35-50)
- **A-RANK:** Advanced enemies (HP: 320-480, ATK: 65-78)
- **S-RANK:** Mini-bosses (HP: 750-900, ATK: 115-130)
- **SS-RANK:** Stage bosses (HP: 2000-10000, ATK: 50-180)

---

## C-RANK: BASIC ENEMIES

### Candy Slime Villain
- **ID:** `enemy_slime`
- **Element:** Neutral
- **HP:** 100 | **ATK:** 15 | **DEF:** 5 | **SPD:** 80
- **Type:** Basic (Blob)
- **Weapon:** Candy whip
- **Special Feature:** Crown accessory, multiple color variants
- **Animations:** Idle (bounce), Attack (whip swing)
- **Variants:** Pink Strawberry, Purple Grape, Blue Raspberry, Green Apple, Orange Cream
- **Loot:** Slime gel materials
- **Description:** Gelatinous candy creature that bounces and attacks with magical candy whips. Features a crown showing its status as a candy overlord.

### Goblin Warrior
- **ID:** `enemy_goblin`
- **Element:** Dark
- **HP:** 120 | **ATK:** 20 | **DEF:** 8 | **SPD:** 110
- **Type:** Basic (Humanoid)
- **Weapon:** Club/Axe
- **Special Feature:** Aggressive behavior
- **Animations:** Idle (stance), Attack (club swing)
- **Variants:** Green, Red, Brown
- **Loot:** Wood materials, basic weapons
- **Description:** Small but aggressive creature wielding crude weapons. Quick and persistent in combat.

### Skeleton Fighter
- **ID:** `enemy_skeleton`
- **Element:** Dark
- **HP:** 110 | **ATK:** 18 | **DEF:** 10 | **SPD:** 100
- **Type:** Basic (Undead)
- **Weapon:** Sword
- **Special Feature:** Rattling animation
- **Animations:** Idle (rattle), Attack (sword slash)
- **Variants:** Bone, Dark, Cursed
- **Loot:** Bone materials, fire sword (rare)
- **Description:** Undead warrior risen from the grave. Rattles menacingly while wielding a sword.

### Shadow Bat
- **ID:** `enemy_bat`
- **Element:** Wind
- **HP:** 80 | **ATK:** 12 | **DEF:** 3 | **SPD:** 150
- **Type:** Flying
- **Weapon:** Claws
- **Special Feature:** High speed, aerial movement
- **Animations:** Idle (hover), Attack (dive)
- **Variants:** Shadow, Fire, Frost
- **Loot:** Feather materials
- **Description:** Swift flying creature that swoops down to attack. Moves in circular patterns.

---

## S-RANK: MINI-BOSSES

### Shadow Ninja Assassin
- **ID:** `enemy_shadow_ninja`
- **Element:** Dark
- **HP:** 800 | **ATK:** 120 | **DEF:** 70 | **SPD:** 200
- **Type:** Elite Ninja
- **Weapon:** Dual Kunai
- **Special Features:** 
  - Teleportation ability
  - Shadow clone particles
  - Naruto-inspired design
  - High agility
- **Animations:** Idle (shadow stance), Attack (kunai throw), Teleport (shadow dash)
- **Variants:** Purple Shadow, Red Blood Shadow, Blue Frost Shadow
- **Size:** 128x128px
- **Loot:** Kunai weapons, shadow materials, rare ninja gear
- **Description:** Elite ninja assassin with mastery of shadow techniques. Can teleport and create shadow clones. Inspired by Naruto and Solo Leveling aesthetics.

---

## SS-RANK: STAGE BOSSES

### Demon Lord Boss
- **ID:** `boss_demon_lord`
- **Element:** Fire
- **HP:** 5000 | **ATK:** 110 | **DEF:** 60 | **SPD:** 90
- **Type:** Boss (Demon)
- **Weapon:** Flame Sword
- **Special Features:**
  - Massive wings (bat-like)
  - Crown of flames
  - Demonic horns
  - Muscular build
  - Solo Leveling + Marvel villain aesthetic
- **Animations:** Idle (flame aura), Attack (sword slash), Special (flame burst)
- **Variants:** Crimson, Shadow, Inferno
- **Size:** 384x384px (1.5x larger than normal)
- **Phases:**
  - **Phase 1 (100%-50% HP):** Basic attacks, moderate speed
  - **Phase 2 (50%-0% HP):** Enraged, faster attacks, flame crown intensifies
- **Loot:** 
  - Guaranteed: Demon Lord Crown, Flame Sword (legendary)
  - Rare: Dark armor sets, demonic accessories
  - Epic: Boss essence, evolution stones
- **Description:** Massive demon lord with bat wings, wielding a flaming greatsword. Commands infernal flames and has devastating area attacks. Final boss of Stage 5.

### Slime King
- **ID:** `boss_slime_king`
- **Element:** Nature
- **HP:** 2000 | **ATK:** 50 | **DEF:** 15 | **SPD:** 70
- **Type:** Boss (Slime)
- **Weapon:** N/A (splits into smaller slimes)
- **Special Features:**
  - Giant size
  - Royal crown
  - Splitting ability
  - Candy-themed colors
- **Animations:** Idle (royal bounce), Attack (slam), Special (split)
- **Variants:** Green Nature, Toxic Purple, Crystal Blue
- **Size:** 384x384px
- **Phases:**
  - **Phase 1 (100%-50% HP):** Slow bouncing attacks
  - **Phase 2 (50%-0% HP):** Splits into 3-5 smaller slimes, increases speed
- **Loot:**
  - Guaranteed: Slime Core (crafting material)
  - Rare: Nature staff, plate armor
  - Epic: Rare cores
- **Description:** Gelatinous monarch that rules over all slimes. Can split into multiple smaller slimes when damaged. Stage 1 boss.

---

## Sprite File Locations

All enemy sprites are located in the following directory structure:

```
enemy-sprites/
├── type-7-chibi-kawaii/
│   ├── candy-slime-villain.html
│   ├── goblin-warrior.html
│   ├── skeleton-fighter.html
│   └── [other chibi sprites]
├── type-1-hd-pixel-art/
│   ├── shadow-ninja-assassin.html
│   └── [other pixel art sprites]
├── type-5-hybrid-enhanced/
│   ├── demon-lord-boss.html
│   └── [other hybrid sprites]
└── shared/
    ├── enemy-sprite-data.js
    ├── enemy-sprite-renderer.js
    └── bestiary-system.js
```

## Art Style Comparison

### Type-7: Chibi Kawaii
- **Style:** Cute, rounded, anime-inspired
- **Colors:** Bright, candy-like palettes
- **Size:** 256x256px
- **Best For:** Mobile games, casual games, friendly aesthetics
- **Example:** Candy Slime Villain, Goblin Warrior

### Type-1: HD Pixel Art
- **Style:** Retro pixel art with modern detail
- **Colors:** Darker, more realistic
- **Size:** 128x128px
- **Best For:** Retro games, platformers, classic RPGs
- **Example:** Shadow Ninja Assassin

### Type-5: Hybrid Enhanced  
- **Style:** Mixed 2D/3D rendering, dramatic lighting
- **Colors:** Rich, deep tones with glow effects
- **Size:** 384x384px (for bosses)
- **Best For:** Boss fights, cinematic moments, action games
- **Example:** Demon Lord Boss

## Enemy Behaviors

### Chase
- Follows player relentlessly
- Adjusts path in real-time
- **Enemies:** Goblin, Skeleton

### Bounce
- Jumps or bounces toward player
- Vertical movement component
- **Enemies:** Slime types

### Circle
- Flies in circular patterns
- Swoops down periodically
- **Enemies:** Bat, flying types

### Patrol
- Moves in set patterns
- Turns to chase when player is near
- **Enemies:** Skeleton, guards

### Boss Patterns
- Phase-based behavior
- Special attack patterns
- Summons minions
- **Enemies:** All bosses

## Difficulty Scaling

Enemies can be scaled by:
- **Wave Number:** HP, ATK, DEF increase by 10-15% per wave
- **Stage:** Higher stages use higher tier enemies
- **Player Level:** Stats scale to match player progression
- **Modifiers:** Optional difficulty multipliers

Example scaling formula:
```javascript
scaledHP = baseHP * (1 + waveNumber * 0.15);
scaledATK = baseATK * (1 + waveNumber * 0.10);
```

## Loot Tables

### C-RANK Drops
- **Common (70%):** Basic materials (wood, bone, feathers)
- **Uncommon (25%):** Low-tier weapons and armor
- **Rare (5%):** Fire sword, special materials

### S-RANK Drops
- **Common (40%):** Elite materials
- **Uncommon (30%):** Mid-tier equipment
- **Rare (20%):** High-tier weapons
- **Epic (10%):** Legendary accessories

### SS-RANK (Boss) Drops
- **Guaranteed:** Boss-specific unique item
- **Rare (60-70%):** High-tier equipment
- **Epic (15-25%):** Legendary items
- **Unique (5-10%):** Boss evolution stones

## Future Expansion

The system is designed to easily add more enemies:

### Planned Enemy Types
- **B-RANK:** Orc Berserker, Stone Golem, Lesser Demon, Wraith, Troll, Vampire, Werewolf, Harpy (8 enemies)
- **A-RANK:** Dark Knight, Battle Mage, Dragon Whelp, Lich, Fire Elemental, Minotaur (6 enemies)
- **S-RANK:** Dark Paladin, Chimera, Hydra, Phoenix (4 enemies)
- **SS-RANK:** Ancient Dragon, Lich Lord, Titan, Shadow God (4+ bosses)

### Adding New Enemies

To add a new enemy:
1. Create sprite HTML files for each art style
2. Add entry to `enemy-sprite-data.js`
3. Test in BATTLEFIELD-DEMO.html
4. Update this list

## Credits

- **System Design:** A1K Game Systems
- **Sprite Creation:** Procedural canvas rendering
- **Art Styles:** Chibi Kawaii, HD Pixel, Hybrid Enhanced
- **Integration:** Universal HTML5 compatibility

## Version History

- **v1.0** - Initial release with 7 enemies across 3 art styles
- Core system: Data, Renderer, Bestiary
- Full integration with A1K Bag System and Runner Game

