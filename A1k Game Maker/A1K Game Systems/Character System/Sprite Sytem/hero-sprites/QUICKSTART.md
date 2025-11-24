# 🚀 Quick Start Guide - Hero Sprites System

## In 30 Seconds

1. **Open** `START_HERE.html` in your browser
2. **Click** "Type 1: HD Pixel Art"
3. **Choose** any character (Warrior, Cat Angel, or Cyborg)
4. **Export** sprite sheet for your game
5. **Done!** Copy integration code and start building

---

## What You Get

### ✅ **READY NOW** - Type 1: HD Pixel Art
**3 Complete Characters:**
- ⚔️ Warrior (Dual Swords) - Dark skin, black curly hair, red energy swords
- 😇 Cat Angel Gunner - Black fur, floating halo, wing, handgun
- 🤖 Cyborg Rifle Operative - Black pigtails, segmented armor, energy rifle

**Each Character Includes:**
- 3 animations (idle, walk, attack)
- 5 color palettes (fire, ice, shadow, light, nature)
- Live preview at 60fps
- Export PNG, sprite sheets, JSON
- Game engine integration code

### ⚡ **PARTIAL** - Type 4: Procedural Shader
- Warrior character complete (WebGL2 shader-based)
- Infinite resolution scaling
- Math-driven SDF geometry
- Cat Angel & Cyborg coming soon

### 🚧 **COMING SOON** - Types 2, 3, 5
- Type 2: Vector Cel-Shaded (Castle Crashers style)
- Type 3: 3D Pre-rendered (Octopath Traveler style)
- Type 5: Hybrid Enhanced (Best of all techniques)

---

## File Locations

```
hero-sprites/
├── START_HERE.html              ← Open this first!
│
├── type-1-hd-pixel-art/         ← All 3 characters ready
│   ├── warrior-dual-swords.html
│   ├── cat-angel-gunner.html
│   └── cyborg-rifle-operative.html
│
└── shared/                      ← Helper utilities
    ├── export-utils.js
    ├── animation-engine.js
    └── game-integration.js
```

---

## Export Workflow

### Step 1: Choose Character & Palette
- Open any character HTML file
- Select color palette (fire/ice/shadow/light/nature)
- Choose animation (idle/walk/attack)

### Step 2: Export Sprite Sheet
- Click "Sprite Sheet" button
- Saves horizontal strip (all frames combined)
- File: `character-animation-palette-sheet.png`

### Step 3: Integrate into Game
Copy provided integration code for:
- Phaser 3
- PixiJS
- A1K Engine
- Vanilla Canvas
- Three.js

### Step 4: Use in Game
```javascript
// Example: Phaser 3
this.load.spritesheet('warrior', 
  'warrior-idle-fire-sheet.png',
  { frameWidth: 128, frameHeight: 128 }
);
```

---

## Key Features

### 🎯 Production Ready
- All sprites fully animated
- Multiple color themes
- Export-ready formats
- Zero dependencies

### 🎨 Unique Black Hair
- Hair/fur stays black across ALL palettes
- Character identity marker
- Never changes with theme

### ⚡ 60fps Performance
- Real-time rendering
- Smooth animations
- Low GPU usage (~2-4%)

### 📦 Self-Contained
- No external libraries
- Works completely offline
- Single HTML files

---

## Animation Details

| Animation | Frames | Duration | Loop |
|-----------|--------|----------|------|
| Idle      | 8      | 2.0 sec  | Yes  |
| Walk      | 8      | 1.0 sec  | Yes  |
| Attack    | 6      | 0.5 sec  | No   |

---

## Color Palettes

Each character supports 5 themes:
1. **Fire** 🔥 - Red/orange glow
2. **Ice** ❄️ - Cyan/blue glow
3. **Shadow** 🌑 - Purple/dark energy
4. **Light** ✨ - Gold/white holy
5. **Nature** 🌿 - Green/earth tones

**Remember:** Hair always stays black!

---

## Next Steps

### For Immediate Use
1. Export all animations for chosen character
2. Pick your favorite palette
3. Import into game engine
4. Start building!

### To Extend
1. Use Type 1 characters as templates
2. Modify colors/animations
3. Add new palettes
4. Create variations

### To Complete System
1. Finish Type 4 (add Cat Angel & Cyborg)
2. Build Types 2, 3, 5 using existing structure
3. Follow templates in completed characters

---

## Troubleshooting

**Q: Where do I start?**  
A: Open `START_HERE.html`

**Q: Which type should I use?**  
A: Type 1 (HD Pixel Art) - it's complete!

**Q: How do I export?**  
A: Open character → click "Sprite Sheet" → save PNG

**Q: WebGL2 warning?**  
A: Use Chrome/Firefox/Safari 15+ for full features

**Q: Can I use commercially?**  
A: Yes! Production-ready for any project

---

## File Sizes

- **Each HTML file:** ~10-15KB
- **Exported sprite sheet (8 frames):** ~30-50KB PNG
- **Total system:** < 1MB

---

## Browser Requirements

- **Chrome 56+** ✅
- **Firefox 51+** ✅
- **Safari 15+** ✅
- **Edge 79+** ✅

---

## Quick Integration

### Phaser 3
```javascript
this.load.spritesheet('warrior', 'warrior-sheet.png', 
  { frameWidth: 128, frameHeight: 128 });
```

### Vanilla Canvas
```javascript
const img = new Image();
img.src = 'warrior-sheet.png';
ctx.drawImage(img, frame*128, 0, 128, 128, x, y, 128, 128);
```

### PixiJS
```javascript
const sheet = PIXI.Loader.shared.resources['warrior-sheet.png'];
const sprite = new PIXI.AnimatedSprite(sheet.spritesheet.animations.idle);
```

---

## Support

- **Documentation:** Read `README.md`
- **Examples:** Open any character HTML
- **Templates:** Use Type 1 characters
- **Integration:** Check `shared/game-integration.js`

---

**You're ready to go!** 🎮✨

Open `START_HERE.html` and start creating amazing games!

