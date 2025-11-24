/**
 * SPRITE ICONS
 * Generates small icon versions of sprites for UI
 * 
 * @version 1.0.0
 */

class SpriteIconManager {
  constructor() {
    this.iconCache = new Map(); // characterId + palette -> canvas
    this.iconSize = 64; // Icon size (64x64)
  }

  /**
   * Generate icon for character
   */
  generateIcon(characterId, palette = 'fire') {
    const cacheKey = `${characterId}_${palette}`;
    
    // Check cache
    if (this.iconCache.has(cacheKey)) {
      return this.iconCache.get(cacheKey);
    }

    // Create sprite instance
    let sprite;
    switch (characterId) {
      case 'A1':
        sprite = new WarriorSprite(palette);
        break;
      case 'UNIQUE':
        sprite = new CyborgSprite(palette);
        break;
      case 'MISSY':
        sprite = new CatAngelSprite(palette);
        break;
      default:
        return null;
    }

    // Set to idle animation, first frame
    sprite.setAnimation('idle');
    sprite.currentFrame = 0;

    // Create icon canvas
    const iconCanvas = document.createElement('canvas');
    iconCanvas.width = this.iconSize;
    iconCanvas.height = this.iconSize;
    const iconCtx = iconCanvas.getContext('2d');
    iconCtx.imageSmoothingEnabled = false;

    // Render sprite at smaller size
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 128;
    tempCanvas.height = 128;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.imageSmoothingEnabled = false;

    sprite.render(tempCtx, 64, 64);

    // Scale down to icon size
    iconCtx.drawImage(tempCanvas, 0, 0, this.iconSize, this.iconSize);

    // Cache icon
    this.iconCache.set(cacheKey, iconCanvas);

    return iconCanvas;
  }

  /**
   * Get icon as data URL
   */
  getIconDataURL(characterId, palette = 'fire') {
    const icon = this.generateIcon(characterId, palette);
    if (icon) {
      return icon.toDataURL('image/png');
    }
    return null;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.iconCache.clear();
  }

  /**
   * Pre-generate icons for all characters and palettes
   */
  pregenerateIcons() {
    const characters = ['A1', 'UNIQUE', 'MISSY'];
    const palettes = ['fire', 'ice', 'shadow', 'light', 'nature'];

    for (let charId of characters) {
      for (let palette of palettes) {
        this.generateIcon(charId, palette);
      }
    }
  }
}

