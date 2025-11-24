/**
 * Production-Ready HD Pixel Art Sprite System
 * For NPC & Enemy Rank System
 * Works completely offline - no server required
 * Style: DBZ + Solo Leveling + Minecraft + Brawl Stars (Copyright-Free)
 */

class HDSpriteSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 128;
    this.height = 128;
    this.scale = 4;
    this.currentFrame = 0;
    this.animationState = "idle";
    this.colorPalette = "fire";
    this.characterType = "hero";
    this.subType = "warrior";

    // Load manifest
    this.manifest = null;
    this.loadManifest();

    // Initialize palettes
    this.palettes = this.initializePalettes();

    // Initialize body parts
    this.bodyParts = this.initializeBodyParts();
  }

  async loadManifest() {
    try {
      const response = await fetch("./sprites/sprite-manifest.json");
      this.manifest = await response.json();
    } catch (error) {
      console.warn("Manifest not found, using defaults");
      this.manifest = this.getDefaultManifest();
    }
  }

  getDefaultManifest() {
    return {
      categories: {
        hero: {
          subtypes: ["warrior"],
          stats: { power: 1.2, defense: 1.1, speed: 1.0, magic: 0.9 },
        },
        villain: {
          subtypes: ["warlock"],
          stats: { power: 1.3, defense: 0.9, speed: 1.1, magic: 1.2 },
        },
      },
      palettes: {
        fire: {
          primary: "#FF4444",
          secondary: "#FF8844",
          accent: "#FFFF44",
          glow: "#FF6600",
        },
      },
    };
  }

  initializePalettes() {
    return {
      fire: {
        skin: ["#FFB366", "#FF8C42", "#FF6B35"],
        hair: ["#8B4513", "#A0522D", "#CD853F"],
        eyes: ["#FF0000", "#FF4500", "#FFD700"],
        clothes: ["#DC143C", "#B22222", "#8B0000"],
        weapon: ["#2F2F2F", "#1C1C1C", "#000000"],
        aura: ["#FF6600", "#FF8833", "#FFAA66"],
        glow: "rgba(255,102,0,0.6)",
      },
      ice: {
        skin: ["#E0FFFF", "#B0E0E6", "#87CEEB"],
        hair: ["#F0F8FF", "#E6E6FA", "#DDA0DD"],
        eyes: ["#00CED1", "#48D1CC", "#20B2AA"],
        clothes: ["#4682B4", "#4169E1", "#0000CD"],
        weapon: ["#C0C0C0", "#A8A8A8", "#909090"],
        aura: ["#00CCFF", "#33DDFF", "#66EEFF"],
        glow: "rgba(0,204,255,0.6)",
      },
      shadow: {
        skin: ["#696969", "#808080", "#A9A9A9"],
        hair: ["#2F2F2F", "#1C1C1C", "#000000"],
        eyes: ["#FF1493", "#FF69B4", "#FFB6C1"],
        clothes: ["#4B0082", "#6A5ACD", "#9370DB"],
        weapon: ["#8B4513", "#A0522D", "#CD853F"],
        aura: ["#AA00FF", "#CC33FF", "#DD66FF"],
        glow: "rgba(170,0,255,0.6)",
      },
      light: {
        skin: ["#FFFFE0", "#FFFACD", "#FAFAD2"],
        hair: ["#FFD700", "#FFA500", "#FF8C00"],
        eyes: ["#FFFF00", "#FFD700", "#FFA500"],
        clothes: ["#F0E68C", "#DAA520", "#B8860B"],
        weapon: ["#C0C0C0", "#A8A8A8", "#909090"],
        aura: ["#FFCC00", "#FFDD33", "#FFEE66"],
        glow: "rgba(255,204,0,0.6)",
      },
      nature: {
        skin: ["#90EE90", "#98FB98", "#F0FFF0"],
        hair: ["#228B22", "#32CD32", "#006400"],
        eyes: ["#00FF00", "#7CFC00", "#ADFF2F"],
        clothes: ["#8FBC8F", "#556B2F", "#6B8E23"],
        weapon: ["#8B4513", "#A0522D", "#CD853F"],
        aura: ["#00FF66", "#33FF88", "#66FFAA"],
        glow: "rgba(0,255,102,0.6)",
      },
      energy: {
        skin: ["#E0FFFF", "#B0E0E6", "#87CEEB"],
        hair: ["#FF1493", "#FF69B4", "#FFB6C1"],
        eyes: ["#00FFFF", "#7FFFD4", "#40E0D0"],
        clothes: ["#DA70D6", "#BA55D3", "#9932CC"],
        weapon: ["#C0C0C0", "#A8A8A8", "#909090"],
        aura: ["#FF00FF", "#FF33FF", "#FF66FF"],
        glow: "rgba(255,0,255,0.6)",
      },
    };
  }

  initializeBodyParts() {
    return {
      head: {
        human: { shape: "round", features: ["ears", "nose", "mouth"] },
        elf: { shape: "pointed", features: ["pointed_ears", "sharp_features"] },
        orc: { shape: "square", features: ["tusks", "ridges"] },
        beast: { shape: "animal", features: ["snout", "fur"] },
        undead: { shape: "gaunt", features: ["empty_eyes", "bones"] },
        mechanical: { shape: "visor", features: ["glowing_eyes", "circuits"] },
        angelic: { shape: "halo", features: ["wings", "glow"] },
        demonic: { shape: "horns", features: ["horns", "spikes"] },
      },
      body: {
        light: { armor: "cloth", bulk: 0.8 },
        medium: { armor: "leather", bulk: 1.0 },
        heavy: { armor: "plate", bulk: 1.3 },
        robe: { armor: "magic", bulk: 0.9 },
        armor: { armor: "metal", bulk: 1.2 },
        fur: { armor: "natural", bulk: 1.1 },
        scales: { armor: "dragon", bulk: 1.4 },
        energy: { armor: "plasma", bulk: 0.7 },
      },
      arms: {
        human: { type: "normal", weapon: true },
        mechanical: { type: "cybernetic", weapon: true },
        tentacle: { type: "flexible", weapon: false },
        wing: { type: "avian", weapon: false },
        claw: { type: "bestial", weapon: true },
        blade: { type: "integrated", weapon: true },
        staff: { type: "magical", weapon: true },
        shield: { type: "defensive", weapon: true },
      },
      legs: {
        human: { type: "bipedal", speed: 1.0 },
        hoof: { type: "quadrupedal", speed: 1.2 },
        paw: { type: "feline", speed: 1.3 },
        wheel: { type: "mechanical", speed: 1.4 },
        root: { type: "plant", speed: 0.6 },
        tail: { type: "serpentine", speed: 0.8 },
        none: { type: "floating", speed: 1.1 },
      },
    };
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = this.width * this.scale;
    this.canvas.height = this.height * this.scale;
    this.ctx.imageSmoothingEnabled = false;
  }

  setCharacter(type, subType) {
    this.characterType = type;
    this.subType = subType;
  }

  setPalette(palette) {
    this.colorPalette = palette;
  }

  setAnimation(state) {
    this.animationState = state;
    this.currentFrame = 0;
  }

  setScale(scale) {
    this.scale = scale;
    this.resizeCanvas();
  }

  // Main drawing function
  draw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const palette = this.palettes[this.colorPalette];
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Draw aura/glow effect
    this.drawAura(centerX, centerY, palette);

    // Draw body parts based on character type
    this.drawBody(centerX, centerY, palette);
    this.drawHead(centerX, centerY - 20, palette);
    this.drawArms(centerX, centerY, palette);
    this.drawLegs(centerX, centerY + 20, palette);
    this.drawWeapon(centerX, centerY, palette);
    this.drawAccessories(centerX, centerY, palette);

    // Apply animation offsets
    this.applyAnimationOffsets();
  }

  drawAura(x, y, palette) {
    const gradient = this.ctx.createRadialGradient(
      x * this.scale,
      y * this.scale,
      0,
      x * this.scale,
      y * this.scale,
      60 * this.scale
    );
    gradient.addColorStop(0, palette.glow);
    gradient.addColorStop(0.7, "rgba(0,0,0,0.1)");
    gradient.addColorStop(1, "transparent");

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBody(x, y, palette) {
    const bodyType = this.getBodyType();
    const colors = palette.clothes;

    // Main body shape - made shorter to not cover legs
    this.ctx.fillStyle = colors[0];
    this.drawRect(x - 12, y - 8, 24, 12);

    // Armor details based on type
    switch (bodyType.armor) {
      case "plate":
        this.drawArmorPlates(x, y, colors);
        break;
      case "leather":
        this.drawLeatherArmor(x, y, colors);
        break;
      case "magic":
        this.drawMagicRobes(x, y, colors);
        break;
    }
  }

  drawHead(x, y, palette) {
    const headType = this.getHeadType();
    const colors = palette.skin;

    // Base head shape
    this.ctx.fillStyle = colors[0];
    switch (headType.shape) {
      case "round":
        this.drawCircle(x, y, 10);
        break;
      case "square":
        this.drawRect(x - 10, y - 10, 20, 20);
        break;
      case "pointed":
        this.drawTriangle(x, y - 10, 20, 20);
        break;
    }

    // Eyes
    this.drawEyes(x, y, palette);

    // Special features
    this.drawHeadFeatures(x, y, headType, palette);
  }

  drawArms(x, y, palette) {
    const armType = this.getArmType();
    const colors = palette.skin;

    // Left arm
    this.drawLimb(x - 16, y - 5, x - 22, y + 5, colors, armType);

    // Right arm
    this.drawLimb(x + 16, y - 5, x + 22, y + 5, colors, armType);
  }

  drawLegs(x, y, palette) {
    const legType = this.getLegType();
    const colors = palette.skin;

    if (legType.type === "none") return;

    // Left leg
    this.drawLimb(x - 6, y + 8, x - 8, y + 18, colors, legType);

    // Right leg
    this.drawLimb(x + 6, y + 8, x + 8, y + 18, colors, legType);
  }

  drawWeapon(x, y, palette) {
    const weaponType = this.getWeaponType();
    const colors = palette.weapon;

    switch (weaponType) {
      case "sword":
        this.drawSword(x + 20, y, colors);
        break;
      case "staff":
        this.drawStaff(x + 20, y, colors);
        break;
      case "bow":
        this.drawBow(x + 20, y, colors);
        break;
      case "gun":
        this.drawGun(x + 20, y, colors);
        break;
    }
  }

  drawAccessories(x, y, palette) {
    const accessoryType = this.getAccessoryType();

    switch (accessoryType) {
      case "wings":
        this.drawWings(x, y, palette);
        break;
      case "aura":
        this.drawAuraEffect(x, y, palette);
        break;
      case "cape":
        this.drawCape(x, y, palette);
        break;
    }
  }

  // Helper drawing functions
  drawRect(x, y, w, h) {
    this.ctx.fillRect(
      x * this.scale,
      y * this.scale,
      w * this.scale,
      h * this.scale
    );
  }

  drawCircle(x, y, r) {
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.scale,
      y * this.scale,
      r * this.scale,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  drawTriangle(x, y, w, h) {
    this.ctx.beginPath();
    this.ctx.moveTo(x * this.scale, (y + h) * this.scale);
    this.ctx.lineTo((x + w / 2) * this.scale, y * this.scale);
    this.ctx.lineTo((x + w) * this.scale, (y + h) * this.scale);
    this.ctx.closePath();
    this.ctx.fill();
  }

  drawLimb(x1, y1, x2, y2, colors, type) {
    // Draw limb as filled rectangle for better visibility
    this.ctx.fillStyle = colors[0];
    this.ctx.strokeStyle = colors[1];

    // Calculate limb dimensions
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    // Draw thicker limb
    const thickness = 4;
    const halfThickness = thickness / 2;

    // Calculate perpendicular vector
    const perpX = -Math.sin(angle) * halfThickness;
    const perpY = Math.cos(angle) * halfThickness;

    // Draw filled limb
    this.ctx.beginPath();
    this.ctx.moveTo((x1 + perpX) * this.scale, (y1 + perpY) * this.scale);
    this.ctx.lineTo((x1 - perpX) * this.scale, (y1 - perpY) * this.scale);
    this.ctx.lineTo((x2 - perpX) * this.scale, (y2 - perpY) * this.scale);
    this.ctx.lineTo((x2 + perpX) * this.scale, (y2 + perpY) * this.scale);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Joints
    this.ctx.fillStyle = colors[1];
    this.drawCircle(x1, y1, 3);
    this.drawCircle(x2, y2, 3);

    // Add muscle definition for arms
    if (type && type.muscular) {
      this.ctx.fillStyle = colors[2] || colors[0];
      this.drawCircle((x1 + x2) / 2, (y1 + y2) / 2, 2);
    }
  }

  drawEyes(x, y, palette) {
    const eyeColors = palette.eyes;

    // Left eye
    this.ctx.fillStyle = eyeColors[0];
    this.drawRect(x - 6, y - 2, 3, 2);

    // Right eye
    this.drawRect(x + 3, y - 2, 3, 2);

    // Pupils
    this.ctx.fillStyle = "#000000";
    this.drawRect(x - 5, y - 1, 1, 1);
    this.drawRect(x + 4, y - 1, 1, 1);
  }

  // Specific drawing functions for different types
  drawArmorPlates(x, y, colors) {
    // Chest plate
    this.ctx.fillStyle = colors[1];
    this.drawRect(x - 10, y - 6, 20, 12);

    // Shoulder pads
    this.drawRect(x - 14, y - 8, 6, 4);
    this.drawRect(x + 8, y - 8, 6, 4);
  }

  drawLeatherArmor(x, y, colors) {
    // Leather vest
    this.ctx.fillStyle = colors[1];
    this.drawRect(x - 11, y - 7, 22, 14);

    // Belt
    this.ctx.fillStyle = colors[2];
    this.drawRect(x - 12, y + 4, 24, 3);
  }

  drawMagicRobes(x, y, colors) {
    // Flowing robes
    this.ctx.fillStyle = colors[1];
    this.drawRect(x - 13, y - 9, 26, 18);

    // Magical runes
    this.ctx.fillStyle = colors[2];
    for (let i = 0; i < 5; i++) {
      this.drawRect(x - 10 + i * 4, y - 5, 2, 2);
    }
  }

  drawSword(x, y, colors) {
    // Blade
    this.ctx.fillStyle = colors[0];
    this.drawRect(x, y - 15, 2, 20);

    // Guard
    this.drawRect(x - 3, y - 3, 8, 2);

    // Handle
    this.ctx.fillStyle = colors[1];
    this.drawRect(x - 1, y + 5, 4, 8);
  }

  drawStaff(x, y, colors) {
    // Staff shaft
    this.ctx.fillStyle = colors[1];
    this.drawRect(x, y - 20, 3, 25);

    // Crystal top
    this.ctx.fillStyle = colors[0];
    this.drawTriangle(x - 2, y - 25, 7, 8);
  }

  drawBow(x, y, colors) {
    // Bow curve
    this.ctx.strokeStyle = colors[0];
    this.ctx.lineWidth = 2 * this.scale;
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.scale,
      y * this.scale,
      15 * this.scale,
      -Math.PI / 3,
      Math.PI / 3
    );
    this.ctx.stroke();

    // String
    this.ctx.beginPath();
    this.ctx.moveTo((x - 12) * this.scale, (y - 8) * this.scale);
    this.ctx.lineTo((x + 12) * this.scale, (y - 8) * this.scale);
    this.ctx.stroke();
  }

  drawGun(x, y, colors) {
    // Gun barrel
    this.ctx.fillStyle = colors[0];
    this.drawRect(x, y - 8, 15, 4);

    // Gun body
    this.drawRect(x - 5, y - 6, 8, 8);

    // Handle
    this.drawRect(x - 3, y + 2, 4, 6);
  }

  drawWings(x, y, palette) {
    const colors = palette.aura;

    // Left wing
    this.ctx.fillStyle = colors[0];
    this.drawTriangle(x - 25, y - 10, 15, 20);

    // Right wing
    this.drawTriangle(x + 10, y - 10, 15, 20);
  }

  drawAuraEffect(x, y, palette) {
    const colors = palette.aura;

    // Energy particles
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = x + Math.cos(angle) * 18;
      const py = y + Math.sin(angle) * 18;

      this.ctx.fillStyle = colors[i % colors.length];
      this.drawCircle(px, py, 2);
    }
  }

  drawCape(x, y, palette) {
    const colors = palette.clothes;

    // Cape flowing behind
    this.ctx.fillStyle = colors[1];
    this.drawTriangle(x - 8, y - 15, 16, 25);
  }

  // Type getters
  getBodyType() {
    const category = this.manifest?.categories?.[this.characterType];
    if (!category) return this.bodyParts.body.medium;

    // Map category to body type
    const typeMap = {
      hero: "medium",
      villain: "heavy",
      npc: "light",
      slayer: "medium",
      hunter: "light",
      guardian: "heavy",
      mage: "robe",
      assassin: "light",
      support: "robe",
      minion: "light",
      elite: "heavy",
      boss: "heavy",
      pet: "fur",
      merchant: "light",
      crafter: "medium",
    };

    return this.bodyParts.body[typeMap[this.characterType] || "medium"];
  }

  getHeadType() {
    const typeMap = {
      hero: "human",
      villain: "demonic",
      npc: "human",
      slayer: "human",
      hunter: "elf",
      guardian: "orc",
      mage: "elf",
      assassin: "human",
      support: "human",
      minion: "beast",
      elite: "orc",
      boss: "demonic",
      pet: "beast",
      merchant: "human",
      crafter: "human",
    };

    return this.bodyParts.head[typeMap[this.characterType] || "human"];
  }

  getArmType() {
    const typeMap = {
      hero: "human",
      villain: "human",
      npc: "human",
      slayer: "human",
      hunter: "human",
      guardian: "shield",
      mage: "staff",
      assassin: "blade",
      support: "human",
      minion: "claw",
      elite: "human",
      boss: "blade",
      pet: "paw",
      merchant: "human",
      crafter: "human",
    };

    return this.bodyParts.arms[typeMap[this.characterType] || "human"];
  }

  getLegType() {
    const typeMap = {
      hero: "human",
      villain: "human",
      npc: "human",
      slayer: "human",
      hunter: "human",
      guardian: "human",
      mage: "human",
      assassin: "human",
      support: "human",
      minion: "paw",
      elite: "human",
      boss: "human",
      pet: "paw",
      merchant: "human",
      crafter: "human",
    };

    return this.bodyParts.legs[typeMap[this.characterType] || "human"];
  }

  getWeaponType() {
    const typeMap = {
      hero: "sword",
      villain: "staff",
      npc: "none",
      slayer: "sword",
      hunter: "bow",
      guardian: "shield",
      mage: "staff",
      assassin: "dagger",
      support: "staff",
      minion: "none",
      elite: "sword",
      boss: "sword",
      pet: "none",
      merchant: "none",
      crafter: "none",
    };

    return typeMap[this.characterType] || "none";
  }

  getAccessoryType() {
    const typeMap = {
      hero: "cape",
      villain: "aura",
      npc: "none",
      slayer: "cape",
      hunter: "none",
      guardian: "shield",
      mage: "aura",
      assassin: "mask",
      support: "aura",
      minion: "none",
      elite: "cape",
      boss: "wings",
      pet: "none",
      merchant: "none",
      crafter: "none",
    };

    return typeMap[this.characterType] || "none";
  }

  applyAnimationOffsets() {
    // Apply animation-specific offsets
    let offsetX = 0;
    let offsetY = 0;

    switch (this.animationState) {
      case "idle":
        offsetY = Math.sin(this.currentFrame * 0.1) * 2;
        break;
      case "walk":
        offsetX = Math.sin(this.currentFrame * 0.2) * 3;
        offsetY = Math.abs(Math.sin(this.currentFrame * 0.2)) * 1;
        break;
      case "attack":
        if (this.currentFrame < 3) {
          offsetX = this.currentFrame * 2;
        }
        break;
    }

    if (offsetX !== 0 || offsetY !== 0) {
      // Apply offset to entire sprite (simplified)
      this.ctx.translate(offsetX * this.scale, offsetY * this.scale);
    }
  }

  // Export functions
  exportPNG() {
    if (!this.canvas) return null;
    return this.canvas.toDataURL("image/png");
  }

  exportSpriteSheet() {
    // Create a larger canvas for sprite sheet
    const sheetCanvas = document.createElement("canvas");
    const sheetCtx = sheetCanvas.getContext("2d");
    const frameWidth = this.width;
    const frameHeight = this.height;
    const frames = 8; // 8 frames for animation

    sheetCanvas.width = frameWidth * frames;
    sheetCanvas.height = frameHeight;

    // Draw each frame
    for (let i = 0; i < frames; i++) {
      this.currentFrame = i;
      this.draw();
      sheetCtx.drawImage(this.canvas, i * frameWidth, 0);
    }

    return sheetCanvas.toDataURL("image/png");
  }

  exportJSON() {
    return {
      type: this.characterType,
      subType: this.subType,
      palette: this.colorPalette,
      scale: this.scale,
      animations: ["idle", "walk", "attack", "special"],
      bodyParts: {
        head: this.getHeadType(),
        body: this.getBodyType(),
        arms: this.getArmType(),
        legs: this.getLegType(),
        weapon: this.getWeaponType(),
        accessory: this.getAccessoryType(),
      },
      stats: this.manifest?.categories?.[this.characterType]?.stats || {},
    };
  }

  // Animation loop
  animate() {
    this.currentFrame++;
    this.draw();
  }
}

// Export for use in games
window.HDSpriteSystem = HDSpriteSystem;
