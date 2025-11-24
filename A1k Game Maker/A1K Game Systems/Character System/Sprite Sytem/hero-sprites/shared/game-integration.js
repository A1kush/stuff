/**
 * Game Integration Utilities for Hero Sprites System
 * Provides adapters for popular game engines
 */

class GameIntegration {
  /**
   * Phaser 3 Adapter
   */
  static createPhaserSprite(scene, spriteKey, x, y, animations) {
    // Preload in scene's preload function:
    // this.load.spritesheet(spriteKey, 'path/to/spritesheet.png', {
    //   frameWidth: 128,
    //   frameHeight: 128
    // });

    const sprite = scene.add.sprite(x, y, spriteKey);

    // Create animations
    Object.keys(animations).forEach((animKey) => {
      const anim = animations[animKey];
      if (!scene.anims.exists(animKey)) {
        scene.anims.create({
          key: animKey,
          frames: scene.anims.generateFrameNumbers(spriteKey, {
            start: 0,
            end: anim.frames - 1,
          }),
          frameRate: Math.round(1000 / anim.frameTime),
          repeat: anim.loop ? -1 : 0,
        });
      }
    });

    sprite.play("idle");
    return sprite;
  }

  /**
   * PixiJS Adapter
   */
  static createPixiSprite(spriteSheetPath, animations) {
    // Returns configuration object for PixiJS AnimatedSprite
    return {
      init: async (PIXI) => {
        const sheet = await PIXI.Assets.load(spriteSheetPath);
        const textures = {};

        Object.keys(animations).forEach((animKey) => {
          textures[animKey] = [];
          const anim = animations[animKey];
          for (let i = 0; i < anim.frames; i++) {
            textures[animKey].push(sheet.textures[`${animKey}_${i}`]);
          }
        });

        return textures;
      },

      createSprite: (textures, initialAnim = "idle") => {
        const sprite = new PIXI.AnimatedSprite(textures[initialAnim]);
        sprite.animationSpeed = 1000 / animations[initialAnim].frameTime / 60;
        sprite.play();

        sprite.switchAnimation = (animKey) => {
          if (textures[animKey]) {
            sprite.textures = textures[animKey];
            sprite.animationSpeed = 1000 / animations[animKey].frameTime / 60;
            sprite.gotoAndPlay(0);
          }
        };

        return sprite;
      },
    };
  }

  /**
   * A1K Engine Adapter
   */
  static createA1KSprite(characterData, spriteSheetImage) {
    return {
      name: characterData.character,
      type: characterData.type,
      spriteSheet: spriteSheetImage,
      animations: characterData.animations,
      currentAnim: "idle",
      currentFrame: 0,
      frameTimer: 0,
      x: 0,
      y: 0,
      spriteSize: parseInt(characterData.resolution.split("x")[0]),

      init(game, x, y) {
        this.x = x;
        this.y = y;
        game.addEntity(this);
        return this;
      },

      update(deltaTime) {
        const anim = this.animations[this.currentAnim];
        this.frameTimer += deltaTime;

        if (this.frameTimer >= anim.frameTime) {
          this.frameTimer = 0;
          this.currentFrame++;

          if (this.currentFrame >= anim.frames) {
            if (anim.loop) {
              this.currentFrame = 0;
            } else {
              this.currentFrame = anim.frames - 1;
            }
          }
        }
      },

      draw(ctx) {
        const sx = this.currentFrame * this.spriteSize;
        const sy = 0;

        ctx.drawImage(
          this.spriteSheet,
          sx,
          sy,
          this.spriteSize,
          this.spriteSize,
          this.x - this.spriteSize / 2,
          this.y - this.spriteSize / 2,
          this.spriteSize,
          this.spriteSize
        );
      },

      playAnimation(animKey, reset = true) {
        if (this.animations[animKey]) {
          this.currentAnim = animKey;
          if (reset) {
            this.currentFrame = 0;
            this.frameTimer = 0;
          }
        }
      },

      setPosition(x, y) {
        this.x = x;
        this.y = y;
      },
    };
  }

  /**
   * Vanilla Canvas Adapter
   */
  static createVanillaSprite(canvas, characterData, spriteSheetImage) {
    return {
      canvas: canvas,
      ctx: canvas.getContext("2d"),
      spriteSheet: spriteSheetImage,
      animations: characterData.animations,
      currentAnim: "idle",
      currentFrame: 0,
      frameTimer: 0,
      lastTime: 0,
      x: 0,
      y: 0,
      spriteSize: parseInt(characterData.resolution.split("x")[0]),
      scale: 1,
      rotation: 0,
      flipX: false,
      flipY: false,

      start() {
        this.animate(0);
      },

      animate(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.animate(t));
      },

      update(deltaTime) {
        const anim = this.animations[this.currentAnim];
        this.frameTimer += deltaTime;

        if (this.frameTimer >= anim.frameTime) {
          this.frameTimer = 0;
          this.currentFrame++;

          if (this.currentFrame >= anim.frames) {
            if (anim.loop) {
              this.currentFrame = 0;
            } else {
              this.currentFrame = anim.frames - 1;
            }
          }
        }
      },

      draw() {
        const ctx = this.ctx;
        const sx = this.currentFrame * this.spriteSize;
        const sy = 0;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.flipX ? -1 : 1, this.flipY ? -1 : 1);
        ctx.scale(this.scale, this.scale);

        ctx.drawImage(
          this.spriteSheet,
          sx,
          sy,
          this.spriteSize,
          this.spriteSize,
          -this.spriteSize / 2,
          -this.spriteSize / 2,
          this.spriteSize,
          this.spriteSize
        );

        ctx.restore();
      },

      playAnimation(animKey, reset = true) {
        if (this.animations[animKey] && this.currentAnim !== animKey) {
          this.currentAnim = animKey;
          if (reset) {
            this.currentFrame = 0;
            this.frameTimer = 0;
          }
        }
      },

      setPosition(x, y) {
        this.x = x;
        this.y = y;
      },

      setScale(scale) {
        this.scale = scale;
      },

      setRotation(radians) {
        this.rotation = radians;
      },

      flip(horizontal = true, vertical = false) {
        this.flipX = horizontal;
        this.flipY = vertical;
      },
    };
  }

  /**
   * Three.js Sprite Plane Adapter
   */
  static createThreeJSSprite(THREE, characterData, spriteSheetPath) {
    return {
      init: (scene) => {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(spriteSheetPath);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 1, 1);

        const animations = characterData.animations;
        const spriteSize = parseInt(characterData.resolution.split("x")[0]);

        sprite.userData = {
          animations: animations,
          currentAnim: "idle",
          currentFrame: 0,
          frameTimer: 0,
          spriteSize: spriteSize,
        };

        sprite.update = function (deltaTime) {
          const anim = this.userData.animations[this.userData.currentAnim];
          this.userData.frameTimer += deltaTime * 1000;

          if (this.userData.frameTimer >= anim.frameTime) {
            this.userData.frameTimer = 0;
            this.userData.currentFrame++;

            if (this.userData.currentFrame >= anim.frames) {
              if (anim.loop) {
                this.userData.currentFrame = 0;
              } else {
                this.userData.currentFrame = anim.frames - 1;
              }
            }

            // Update texture offset
            const frameWidth = 1 / anim.frames;
            this.material.map.offset.x =
              this.userData.currentFrame * frameWidth;
          }
        };

        sprite.playAnimation = function (animKey) {
          if (this.userData.animations[animKey]) {
            this.userData.currentAnim = animKey;
            this.userData.currentFrame = 0;
            this.userData.frameTimer = 0;
          }
        };

        scene.add(sprite);
        return sprite;
      },
    };
  }

  /**
   * Generate integration code template
   */
  static generateTemplate(engine, characterData) {
    const templates = {
      phaser: `
// 1. In your Phaser scene's preload():
preload() {
  this.load.spritesheet('${characterData.character.toLowerCase()}', 
    'assets/${characterData.character.toLowerCase()}-spritesheet.png', 
    { frameWidth: 128, frameHeight: 128 }
  );
}

// 2. In your scene's create():
create() {
  const sprite = GameIntegration.createPhaserSprite(
    this,
    '${characterData.character.toLowerCase()}',
    400, 300,
    ${JSON.stringify(characterData.animations, null, 2)}
  );
  
  // Control the sprite
  sprite.play('idle');
}`,

      pixi: `
// 1. Initialize PixiJS application
const app = new PIXI.Application({ width: 800, height: 600 });
document.body.appendChild(app.view);

// 2. Load and create sprite
const config = GameIntegration.createPixiSprite(
  'assets/${characterData.character.toLowerCase()}-spritesheet.png',
  ${JSON.stringify(characterData.animations, null, 2)}
);

config.init(PIXI).then(textures => {
  const sprite = config.createSprite(textures, 'idle');
  sprite.x = 400;
  sprite.y = 300;
  sprite.anchor.set(0.5);
  app.stage.addChild(sprite);
  
  // Switch animations
  setTimeout(() => sprite.switchAnimation('walk'), 2000);
});`,

      a1k: `
// 1. Load sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'assets/${characterData.character.toLowerCase()}-spritesheet.png';

// 2. Create sprite when loaded
spriteSheet.onload = () => {
  const characterData = ${JSON.stringify(characterData, null, 2)};
  
  const sprite = GameIntegration.createA1KSprite(characterData, spriteSheet);
  sprite.init(game, 400, 300);
  
  // Control sprite
  sprite.playAnimation('walk');
  sprite.setPosition(500, 400);
};`,

      vanilla: `
// 1. Setup canvas
const canvas = document.getElementById('game-canvas');
const characterData = ${JSON.stringify(characterData, null, 2)};

// 2. Load sprite sheet
const spriteSheet = new Image();
spriteSheet.src = 'assets/${characterData.character.toLowerCase()}-spritesheet.png';

// 3. Create and start sprite
spriteSheet.onload = () => {
  const sprite = GameIntegration.createVanillaSprite(
    canvas,
    characterData,
    spriteSheet
  );
  
  sprite.setPosition(400, 300);
  sprite.setScale(2);
  sprite.start();
  
  // Control sprite
  setTimeout(() => sprite.playAnimation('attack'), 2000);
};`,

      three: `
// 1. Setup Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// 2. Create sprite
const characterData = ${JSON.stringify(characterData, null, 2)};
const config = GameIntegration.createThreeJSSprite(
  THREE,
  characterData,
  'assets/${characterData.character.toLowerCase()}-spritesheet.png'
);

const sprite = config.init(scene);
sprite.position.set(0, 0, 0);

// 3. Animation loop
function animate() {
  requestAnimationFrame(animate);
  sprite.update(0.016); // ~60fps
  renderer.render(scene, camera);
}
animate();`,
    };

    return templates[engine] || "// Template not available";
  }
}

// Export for use in modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GameIntegration;
}
