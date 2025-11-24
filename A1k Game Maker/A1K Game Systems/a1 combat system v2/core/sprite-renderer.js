/**
 * SPRITE RENDERER
 * Manages sprite instances, animations, and rendering
 * 
 * @version 1.0.0
 */

class SpriteRenderer {
  constructor() {
    this.sprites = new Map(); // characterId -> sprite instance
    this.activeSprite = null;
    this.currentCharacterId = null;
  }

  /**
   * Initialize sprites for all characters
   */
  initialize() {
    // Create sprite instances
    this.sprites.set('A1', new WarriorSprite('fire'));
    this.sprites.set('UNIQUE', new CyborgSprite('fire'));
    this.sprites.set('MISSY', new CatAngelSprite('fire'));

    // Set initial active sprite
    this.setActiveCharacter('A1');
  }

  /**
   * Set active character
   */
  setActiveCharacter(characterId) {
    if (this.currentCharacterId === characterId) return;

    this.currentCharacterId = characterId;
    this.activeSprite = this.sprites.get(characterId);

    if (!this.activeSprite) {
      console.warn(`Sprite not found for character: ${characterId}`);
    }
  }

  /**
   * Set sprite palette
   */
  setPalette(characterId, palette) {
    const sprite = this.sprites.get(characterId);
    if (sprite) {
      sprite.setPalette(palette);
    }
  }

  /**
   * Set sprite animation
   */
  setAnimation(anim) {
    if (this.activeSprite) {
      this.activeSprite.setAnimation(anim);
    }
  }

  /**
   * Set sprite position
   */
  setPosition(x, y) {
    if (this.activeSprite) {
      this.activeSprite.setPosition(x, y);
    }
  }

  /**
   * Update sprite animations
   */
  update(deltaTime) {
    // Update all sprites
    for (let sprite of this.sprites.values()) {
      sprite.update(deltaTime);
    }
  }

  /**
   * Render active sprite
   */
  render(ctx, x, y) {
    if (this.activeSprite) {
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      
      // Render sprite directly at position
      this.activeSprite.render(ctx, x, y);
      
      ctx.restore();
    }
  }

  /**
   * Get sprite instance
   */
  getSprite(characterId) {
    return this.sprites.get(characterId);
  }

  /**
   * Get active sprite
   */
  getActiveSprite() {
    return this.activeSprite;
  }
}

