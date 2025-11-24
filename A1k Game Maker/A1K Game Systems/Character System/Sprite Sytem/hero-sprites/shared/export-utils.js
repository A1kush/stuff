/**
 * Export Utilities for Hero Sprites System
 * Provides PNG export, sprite sheet generation, and JSON metadata export
 */

class ExportUtils {
  /**
   * Export a single frame as PNG
   * @param {HTMLCanvasElement} canvas - The canvas to export
   * @param {string} filename - The filename (without extension)
   */
  static exportPNG(canvas, filename) {
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  /**
   * Generate and export a sprite sheet
   * @param {Function} drawFunction - Function that draws a single frame (frame, animState)
   * @param {number} frameCount - Number of frames in the animation
   * @param {string} animState - Current animation state
   * @param {number} spriteSize - Size of each sprite (assumed square)
   * @param {string} filename - The filename (without extension)
   */
  static exportSpriteSheet(
    drawFunction,
    frameCount,
    animState,
    spriteSize,
    filename
  ) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = spriteSize * frameCount;
    tempCanvas.height = spriteSize;
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.imageSmoothingEnabled = false;

    // Create a smaller canvas for each frame
    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = spriteSize;
    frameCanvas.height = spriteSize;
    const frameCtx = frameCanvas.getContext("2d");
    frameCtx.imageSmoothingEnabled = false;

    // Draw each frame
    for (let i = 0; i < frameCount; i++) {
      frameCtx.clearRect(0, 0, spriteSize, spriteSize);
      drawFunction(frameCtx, frameCanvas, i, animState);
      tempCtx.drawImage(frameCanvas, i * spriteSize, 0);
    }

    // Export
    const link = document.createElement("a");
    link.download = `${filename}-sheet.png`;
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  }

  /**
   * Export all animation states as separate sprite sheets
   * @param {Function} drawFunction - Function that draws a single frame
   * @param {Object} animations - Animation definitions {state: {frames, frameTime, loop}}
   * @param {number} spriteSize - Size of each sprite
   * @param {string} characterName - Base filename
   * @param {string} palette - Current color palette
   */
  static exportAllAnimations(
    drawFunction,
    animations,
    spriteSize,
    characterName,
    palette
  ) {
    Object.keys(animations).forEach((animState) => {
      const anim = animations[animState];
      this.exportSpriteSheet(
        drawFunction,
        anim.frames,
        animState,
        spriteSize,
        `${characterName}-${animState}-${palette}`
      );
    });
  }

  /**
   * Export JSON metadata
   * @param {Object} data - The metadata object
   * @param {string} filename - The filename (without extension)
   */
  static exportJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  /**
   * Generate complete character metadata
   * @param {Object} options - Character options
   */
  static generateMetadata(options) {
    return {
      character: options.name,
      type: options.type || "HD Pixel Art",
      resolution: options.resolution || "128x128",
      animations: options.animations,
      palettes: options.palettes || [
        "fire",
        "ice",
        "shadow",
        "light",
        "nature",
      ],
      currentState: {
        animation: options.currentAnim,
        frame: options.currentFrame,
        palette: options.currentPalette,
      },
      metadata: options.metadata || {},
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
  }

  /**
   * Export sprite sheet with JSON metadata as a package
   * @param {Function} drawFunction - Function that draws frames
   * @param {Object} options - Export options
   */
  static exportPackage(drawFunction, options) {
    // Export sprite sheets for all animations
    this.exportAllAnimations(
      drawFunction,
      options.animations,
      options.spriteSize,
      options.characterName,
      options.palette
    );

    // Export metadata
    const metadata = this.generateMetadata({
      name: options.characterName,
      type: options.type,
      resolution: `${options.spriteSize}x${options.spriteSize}`,
      animations: options.animations,
      currentAnim: options.currentAnim,
      currentFrame: options.currentFrame,
      currentPalette: options.palette,
      metadata: options.extraMetadata,
    });

    this.exportJSON(
      metadata,
      `${options.characterName}-${options.palette}-package`
    );
  }

  /**
   * Create a preview GIF-style animation (using canvas frames)
   * @param {Function} drawFunction - Function that draws frames
   * @param {Object} animation - Animation definition
   * @param {number} spriteSize - Sprite size
   * @returns {HTMLCanvasElement} - Canvas with animated preview
   */
  static createAnimatedPreview(drawFunction, animation, spriteSize) {
    const canvas = document.createElement("canvas");
    canvas.width = spriteSize;
    canvas.height = spriteSize;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    let currentFrame = 0;
    let lastTime = 0;

    function animate(timestamp) {
      if (timestamp - lastTime >= animation.frameTime) {
        ctx.clearRect(0, 0, spriteSize, spriteSize);
        drawFunction(ctx, canvas, currentFrame, animation.state);
        currentFrame = (currentFrame + 1) % animation.frames;
        lastTime = timestamp;
      }
      requestAnimationFrame(animate);
    }

    animate(0);
    return canvas;
  }

  /**
   * Export for specific game engines
   * @param {Object} data - Sprite data
   * @param {string} engine - Target engine ('phaser', 'pixi', 'a1k', 'vanilla', 'three')
   * @returns {string} - Integration code
   */
  static generateEngineIntegration(data, engine) {
    const templates = {
      phaser: `
// Phaser 3 Integration
class ${data.character.replace(/\s/g, "")} extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, '${data.character.toLowerCase()}-sprite');
    
    // Add animations
    ${Object.keys(data.animations)
      .map(
        (anim) => `
    scene.anims.create({
      key: '${anim}',
      frames: scene.anims.generateFrameNumbers('${data.character.toLowerCase()}-sprite', {
        start: 0,
        end: ${data.animations[anim].frames - 1}
      }),
      frameRate: ${Math.round(1000 / data.animations[anim].frameTime)},
      repeat: ${data.animations[anim].loop ? -1 : 0}
    });`
      )
      .join("")}
    
    this.play('idle');
    scene.add.existing(this);
  }
}`,
      pixi: `
// PixiJS Integration
import { AnimatedSprite, Texture } from 'pixi.js';

const textures = {};
${Object.keys(data.animations)
  .map(
    (anim) => `
textures.${anim} = [];
for (let i = 0; i < ${data.animations[anim].frames}; i++) {
  textures.${anim}.push(Texture.from(\`${data.character.toLowerCase()}-${anim}-\${i}.png\`));
}`
  )
  .join("")}

const sprite = new AnimatedSprite(textures.idle);
sprite.animationSpeed = ${1000 / data.animations.idle.frameTime / 60};
sprite.play();`,
      a1k: `
// A1K Engine Integration
const ${data.character.replace(/\s/g, "")}Sprite = {
  name: '${data.character}',
  type: '${data.type}',
  animations: ${JSON.stringify(data.animations, null, 2)},
  
  init(game, x, y) {
    this.x = x;
    this.y = y;
    this.currentAnim = 'idle';
    this.currentFrame = 0;
    this.frameTimer = 0;
    game.addSprite(this);
  },
  
  update(deltaTime) {
    const anim = this.animations[this.currentAnim];
    this.frameTimer += deltaTime;
    if (this.frameTimer >= anim.frameTime) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % anim.frames;
    }
  },
  
  draw(ctx) {
    // Draw using sprite sheet
    const anim = this.animations[this.currentAnim];
    const spriteSize = ${data.resolution.split("x")[0]};
    ctx.drawImage(
      this.spriteSheet,
      this.currentFrame * spriteSize, 0,
      spriteSize, spriteSize,
      this.x, this.y,
      spriteSize, spriteSize
    );
  }
};`,
      vanilla: `
// Vanilla Canvas Integration
class ${data.character.replace(/\s/g, "")} {
  constructor(canvas, spriteSheet) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.spriteSheet = spriteSheet;
    this.animations = ${JSON.stringify(data.animations, null, 2)};
    this.currentAnim = 'idle';
    this.currentFrame = 0;
    this.frameTimer = 0;
    this.x = 0;
    this.y = 0;
    this.spriteSize = ${data.resolution.split("x")[0]};
  }
  
  update(deltaTime) {
    const anim = this.animations[this.currentAnim];
    this.frameTimer += deltaTime;
    if (this.frameTimer >= anim.frameTime) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % anim.frames;
    }
  }
  
  draw() {
    this.ctx.drawImage(
      this.spriteSheet,
      this.currentFrame * this.spriteSize, 0,
      this.spriteSize, this.spriteSize,
      this.x, this.y,
      this.spriteSize, this.spriteSize
    );
  }
  
  playAnimation(name) {
    if (this.animations[name]) {
      this.currentAnim = name;
      this.currentFrame = 0;
      this.frameTimer = 0;
    }
  }
}`,
      three: `
// Three.js Sprite Integration
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const spriteTexture = loader.load('${data.character.toLowerCase()}-spritesheet.png');
spriteTexture.magFilter = THREE.NearestFilter;
spriteTexture.minFilter = THREE.NearestFilter;

const spriteMaterial = new THREE.SpriteMaterial({
  map: spriteTexture,
  transparent: true
});

const sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(1, 1, 1);

// Animate using texture offset
const animations = ${JSON.stringify(data.animations, null, 2)};
let currentAnim = 'idle';
let currentFrame = 0;
let frameTimer = 0;

function updateSprite(deltaTime) {
  const anim = animations[currentAnim];
  frameTimer += deltaTime * 1000;
  if (frameTimer >= anim.frameTime) {
    frameTimer = 0;
    currentFrame = (currentFrame + 1) % anim.frames;
    const frameWidth = 1 / anim.frames;
    sprite.material.map.offset.x = currentFrame * frameWidth;
  }
}`,
    };

    return templates[engine] || "// Engine not supported";
  }
}

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExportUtils;
}
