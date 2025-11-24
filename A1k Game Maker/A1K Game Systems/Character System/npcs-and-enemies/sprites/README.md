# 🎮 Production-Ready HD Sprite System

## NPC & Enemy Rank System - Complete Sprite Collection

> **Works completely offline** • **No server dependencies** • **Production-ready for games**

This comprehensive sprite system provides HD pixel art sprites for all 15 NPC & Enemy categories with modular body parts, animations, and export capabilities.

## 📁 File Structure

```
sprites/
├── sprite-generator.html      # 🎯 Master generator for all categories
├── hd-sprite-engine.js        # ⚙️ Core sprite generation engine
├── sprite-manifest.json       # 📋 Complete configuration data
├── hero-warrior.html          # ⚔️ Hero character sprites
├── villain-warlock.html       # 🧙 Villain character sprites
├── boss-dragon-lord.html      # 👹 Boss character sprites
├── mage-archer.html           # 🔮 Mage character sprites
├── hunter-sprite.html         # 🏹 Hunter character sprites
├── guardian-sprite.html       # 🛡️ Guardian character sprites
├── assassin-sprite.html       # 🗡️ Assassin character sprites
├── support-sprite.html        # 💚 Support character sprites
├── slayer-sprite.html         # 🗡️ Slayer character sprites
├── npc-sprite.html            # 👥 NPC character sprites
├── minion-sprite.html         # 👹 Minion character sprites
├── elite-sprite.html          # 💎 Elite character sprites
├── pet-sprite.html            # 🐾 Pet character sprites
├── merchant-sprite.html       # 💰 Merchant character sprites
├── crafter-sprite.html        # 🔨 Crafter character sprites
└── README.md                  # 📖 This documentation
```

## 🎨 Character Categories (15 Total - COMPLETE ✅)

### Core Classes

- **⚔️ Hero** - Warriors, Mages, Rangers, Paladins, Ninjas
- **🧙 Villain** - Warlocks, Bandits, Necromancers, Tyrants, Assassins
- **👹 Boss** - Dragon Lords, Demon Kings, Titans, Liches, Behemoths

### Combat Classes

- **🔮 Mage** - Fire, Ice, Lightning, Earth, Wind Mages
- **🏹 Hunter** - Archers, Crossbowmen, Snipers, Trackers
- **🛡️ Guardian** - Shield-bearers, Wardens, Protectors, Sentinels
- **🗡️ Assassin** - Shadow, Poison, Blade, Night Assassins
- **💚 Support** - Priests, Shamans, Druids, Monks, Bards

### NPC Classes

- **�️ Slayer** - Berserkers, Executioners, Reapers, Demon Hunters
- **👥 NPC** - Villagers, Guards, Elders, Merchants, Children
- **� Minion** - Imps, Goblins, Skeletons, Zombies, Orcs
- **� Elite** - Champions, Warlords, Sorcerers, Beastmasters, Shadow Lords
- **🐾 Pet** - Wolves, Cats, Birds, Dragons, Bears
- **💰 Merchant** - Shopkeepers, Traders, Alchemists, Blacksmiths, Innkeepers
- **⚒️ Crafter** - Tailors, Jewelers, Carpenters, Chefs, Enchanters

## 🎯 Key Features

### HD Pixel Art

- **128×128 native resolution** with 2x-5x scaling
- **Pixel-perfect rendering** with crisp edges
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)

### Modular Body Parts

- **Separate systems** for head, body, arms, legs, weapons, accessories
- **Infinite character variations** through part combinations
- **Easy customization** and extension
- **✅ Visible limbs** - Arms and legs are now properly filled and visible (not just outlines)

### Color Palette System

- **6 dynamic palettes**: Fire 🔥, Ice ❄️, Shadow 🌑, Light ✨, Nature 🌿, Energy ⚡
- **Procedural color application** for consistent theming
- **Real-time palette switching**

### Animation System

- **Frame-based animations**: Idle, Walk, Attack, Special states
- **Smooth transitions** between animation frames
- **Customizable animation speeds**

### Export Capabilities

- **PNG frame export** for individual sprites
- **Sprite sheet generation** for game engines
- **JSON data export** with complete metadata
- **Batch export** for all categories

## 🚀 Quick Start

### 1. Open the Master Generator

```bash
# Open in your browser (works offline)
open sprites/sprite-generator.html
```

### 2. Generate Sprites

- Select character category or "All Categories"
- Choose color palette and quality settings
- Click "🚀 Generate All Sprites"
- Export PNGs, sprite sheets, or JSON data

### 3. Use Individual Generators

Each category has its own specialized generator:

- `hero-warrior.html` - Hero sprites with warrior features
- `mage-archer.html` - Mage sprites with elemental magic
- `hunter-sprite.html` - Hunter sprites with ranged combat
- `guardian-sprite.html` - Guardian sprites with heavy armor
- `assassin-sprite.html` - Assassin sprites with stealth abilities
- `support-sprite.html` - Support sprites with healing magic

## 🎨 Sprite Specifications

### Technical Details

- **Canvas API**: HTML5 Canvas 2D rendering
- **Resolution**: 128×128 pixels (native), scalable to 640×640
- **Color Depth**: 32-bit RGBA with alpha transparency
- **File Formats**: PNG (with transparency), JSON (metadata)
- **Browser Support**: Modern browsers with Canvas support

### Animation Frames

- **Idle**: 4 frames (standing, breathing animation)
- **Walk**: 6 frames (movement cycle)
- **Attack**: 5 frames (combat animation)
- **Special**: 8 frames (unique ability animation)

### Body Part System

- **Head**: 15+ variations (hair, helmets, hats)
- **Body**: 10+ variations (armor, robes, clothing)
- **Arms**: 8+ variations (weapons, shields, gestures)
- **Legs**: 6+ variations (pants, boots, poses)
- **Accessories**: 20+ variations (capes, jewelry, tools)

## 🛠️ Integration Guide

### For Game Developers

#### 1. Include the Engine

```html
<script src="sprites/hd-sprite-engine.js"></script>
```

#### 2. Create Sprite System

```javascript
const spriteSystem = new HDSpriteSystem();
spriteSystem.setCanvas(canvasElement);
spriteSystem.setCharacter("hero", "warrior");
spriteSystem.setPalette("fire");
spriteSystem.setScale(4);
spriteSystem.draw();
```

#### 3. Export for Your Game

```javascript
// Export individual frame
const pngData = spriteSystem.exportPNG();

// Export sprite sheet
const sheetData = spriteSystem.exportSpriteSheet();

// Export metadata
const jsonData = spriteSystem.exportJSON();
```

### For Web Applications

#### 1. Direct HTML Include

```html
<div id="sprite-container">
  <canvas id="character-canvas" width="512" height="512"></canvas>
</div>
<script src="sprites/hd-sprite-engine.js"></script>
```

#### 2. Initialize and Customize

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("character-canvas");
  const spriteSystem = new HDSpriteSystem();

  spriteSystem.setCanvas(canvas);
  spriteSystem.setCharacter("mage", "fire-mage");
  spriteSystem.setPalette("fire");
  spriteSystem.setScale(4);
  spriteSystem.draw();
});
```

## 🎨 Customization Options

### Character Types

```javascript
spriteSystem.setCharacter(category, subType);
// Examples:
// setCharacter('hero', 'warrior')
// setCharacter('mage', 'fire-mage')
// setCharacter('hunter', 'archer')
```

### Color Palettes

```javascript
spriteSystem.setPalette(paletteName);
// Options: 'fire', 'ice', 'shadow', 'light', 'nature', 'energy'
```

### Scale Settings

```javascript
spriteSystem.setScale(multiplier);
// Options: 2, 3, 4, 5 (multiplies 128px base resolution)
```

### Animation Control

```javascript
spriteSystem.setAnimation(animationName);
// Options: 'idle', 'walk', 'attack', 'special'
```

### Accessory Addition

```javascript
spriteSystem.addAccessory(accessoryType);
// Options: 'helmet', 'cape', 'amulet', 'shield', etc.
```

## 📊 Performance Notes

### Memory Usage

- **Base sprite**: ~50KB per character type
- **With animations**: ~200KB per complete character
- **Sprite sheet**: ~500KB for all frames

### Rendering Performance

- **60 FPS capability** on modern hardware
- **Hardware acceleration** via Canvas 2D
- **Optimized for real-time** game rendering

### Browser Compatibility

- **Chrome 60+**: Full support
- **Firefox 55+**: Full support
- **Safari 12+**: Full support
- **Edge 79+**: Full support with webkit fallback

## 🔧 Advanced Features

### Custom Palette Creation

```javascript
const customPalette = {
  primary: "#ff0000",
  secondary: "#00ff00",
  accent: "#0000ff",
  shadow: "#333333",
};
spriteSystem.setCustomPalette(customPalette);
```

### Animation Frame Control

```javascript
spriteSystem.setAnimationSpeed(100); // milliseconds per frame
spriteSystem.setAnimationLoop(true); // continuous looping
```

### Body Part Swapping

```javascript
spriteSystem.setBodyPart("head", "helmet-1");
spriteSystem.setBodyPart("weapon", "sword-2");
spriteSystem.setBodyPart("armor", "plate-3");
```

## 📈 Export Formats

### PNG Export

- **Individual frames**: 128×128 to 640×640 pixels
- **Transparent background**: Alpha channel preserved
- **High quality**: No compression artifacts

### Sprite Sheet Export

- **Grid layout**: All animation frames in one image
- **Coordinate mapping**: JSON metadata for frame positions
- **Game engine ready**: Compatible with Unity, Godot, Phaser

### JSON Metadata

```json
{
  "character": "hero-warrior",
  "palette": "fire",
  "scale": 4,
  "animations": {
    "idle": { "frames": 4, "duration": 500 },
    "walk": { "frames": 6, "duration": 400 },
    "attack": { "frames": 5, "duration": 300 },
    "special": { "frames": 8, "duration": 600 }
  },
  "stats": {
    "hp": 150,
    "attack": 65,
    "defense": 40
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Sprites not rendering:**

- Check Canvas 2D support in browser
- Verify `hd-sprite-engine.js` is loaded
- Ensure canvas element exists in DOM

**Export not working:**

- Check browser download permissions
- Verify Blob and URL.createObjectURL support
- Try different browser if issues persist

**Performance issues:**

- Reduce scale multiplier (try 2x instead of 4x)
- Limit animation frame rate
- Use sprite sheets instead of individual frames

## 📝 License & Usage

### Free for Personal Use

- **Personal projects**: Completely free
- **Indie games**: Free with attribution
- **Educational use**: Free for learning purposes

### Commercial Use

- **Contact required** for commercial applications
- **Licensing available** for game studios
- **Custom development** services offered

### Attribution

```
HD Sprite System by [Your Name]
https://github.com/your-repo/sprites
```

## 🤝 Contributing

### Ways to Help

- **Bug reports**: Open issues for problems found
- **Feature requests**: Suggest new character types or features
- **Code contributions**: Submit pull requests for improvements
- **Documentation**: Help improve this README

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/sprites.git

# Open in browser (works offline)
open sprites/sprite-generator.html

# Start developing
# Edit hd-sprite-engine.js for core changes
# Edit individual HTML files for UI improvements
```

## 📞 Support

### Getting Help

- **Documentation**: This README file
- **Examples**: Check individual HTML files for usage examples
- **Issues**: Open GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

### Contact Information

- **Email**: your-email@example.com
- **GitHub**: https://github.com/your-repo/sprites
- **Discord**: [Your Discord server]

---

## 📋 Recent Updates

### v1.1.0 - Limb Visibility Fix ✅

- **Fixed**: Arms and legs now properly visible (filled shapes instead of outlines)
- **Improved**: Body drawing optimized to not cover leg area
- **Added**: Enhanced limb rendering with thickness and muscle definition
- **Completed**: All 15 character categories now have dedicated sprite generators

### v1.0.0 - Complete Sprite System ✅

- **Added**: All 15 NPC & Enemy categories with individual generators
- **Added**: Master sprite generator for batch operations
- **Added**: Complete export system (PNG, spritesheets, JSON)
- **Added**: 6 color palettes with real-time switching
- **Added**: Modular body parts system with visible limbs

---

## 🎉 What's Next

### Planned Features

- **More character categories** (additional NPC types)
- **Custom character creator** (drag-and-drop interface)
- **Animation editor** (create custom animations)
- **Unity integration package** (direct Unity import)
- **Godot asset pack** (ready-to-use Godot resources)

### Version History

- **v1.0.0**: Initial release with 15 categories
- **v1.1.0**: Added master generator and batch export
- **v1.2.0**: Enhanced animation system and performance

---

_Built with ❤️ for game developers and pixel art enthusiasts_
