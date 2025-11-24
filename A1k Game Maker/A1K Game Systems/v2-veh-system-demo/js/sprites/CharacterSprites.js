// CharacterSprites.js - 3 characters in 3 styles for vehicle riding

export class CharacterSprites {
  constructor() {
    this.currentStyle = 'pixel'; // pixel, vector, 3d
  }

  setStyle(style) {
    this.currentStyle = style;
  }

  // Render character on vehicle based on vehicle type
  renderCharacterOnVehicle(ctx, character, vehicleId, x, y, state) {
    const characterMap = {
      warrior: {
        pixel: this.renderWarriorPixel.bind(this),
        vector: this.renderWarriorVector.bind(this),
        '3d': this.renderWarrior3D.bind(this)
      },
      cat_angel: {
        pixel: this.renderCatAngelPixel.bind(this),
        vector: this.renderCatAngelVector.bind(this),
        '3d': this.renderCatAngel3D.bind(this)
      },
      cyborg: {
        pixel: this.renderCyborgPixel.bind(this),
        vector: this.renderCyborgVector.bind(this),
        '3d': this.renderCyborg3D.bind(this)
      }
    };

    // Position adjustments based on vehicle type
    // Negative Y = above vehicle (character appears higher)
    // Different vehicles have different boarding styles:
    // - Bikes/Choppers: Sitting ON the seat
    // - Cars: Inside (visible through window area)  
    // - Jetpacks: Wearing on back (character behind pack)
    // - Skateboard: Standing ON TOP
    // - Mechs: Inside cockpit (centered)
    // - Tank/Heavy: Inside cabin
    const vehicleOffsets = {
      bike: { x: 0, y: -24 },              // Sitting on bike seat
      chopper: { x: 0, y: -26 },           // Sitting on chopper seat
      jetpack: { x: 0, y: -16 },           // Wearing jetpack on back
      car: { x: 0, y: -30 },               // Inside car (visible through roof area)
      personal_bike: { x: 0, y: -22 },     // Sitting on personal bike
      personal_chopper: { x: 0, y: -24 },  // Sitting on personal chopper
      personal_jetpack: { x: 0, y: -14 },  // Wearing personal jetpack
      personal_car: { x: 0, y: -28 },      // Inside personal car
      hovercraft: { x: 0, y: -28 },        // Inside hovercraft cabin
      heavy_transport: { x: 10, y: -42 },  // Inside transport cabin (driver side)
      buggy: { x: 0, y: -28 },             // Sitting in buggy seat
      mech_proto: { x: 0, y: -32 },        // Inside mech cockpit (centered in torso)
      mech_apex: { x: 0, y: -38 },         // Inside apex cockpit (higher up)
      skateboard_street: { x: 0, y: -32 }, // Standing ON TOP of skateboard
      tank: { x: 0, y: -44 },              // Inside tank turret hatch
      helicopter: { x: 8, y: -24 },        // Pilot seat in helicopter
      speedboat: { x: 4, y: -26 },         // Sitting at speedboat controls
      // NEW VEHICLES FROM BAG SYSTEM
      scooter: { x: 0, y: -28 },           // Standing on scooter deck
      shopping_cart: { x: -12, y: -26 },   // Standing behind cart, pushing
      roller_skates: { x: 0, y: -24 },     // Wearing skates on feet (standing)
      hover_disc: { x: 0, y: -30 },        // Standing on disc platform
      glider: { x: 0, y: 10 },             // Hanging BELOW glider wing
      balloon_ride: { x: 0, y: -18 },      // Standing in balloon basket
      sled: { x: 0, y: -24 },              // Sitting/lying on sled
      van: { x: 8, y: -32 },               // Driver seat inside van
      bus: { x: -20, y: -36 },             // Driver position (left side of bus)
      train: { x: -15, y: -34 }            // Conductor position in train
    };

    const offset = vehicleOffsets[vehicleId] || { x: 0, y: -12 };
    const charX = x + offset.x;
    const charY = y + offset.y;

    const renderFn = characterMap[character]?.[this.currentStyle];
    if (renderFn) {
      renderFn(ctx, charX, charY, state);
    }
  }

  // Walking character (not on vehicle)
  renderCharacterWalking(ctx, character, x, y, state) {
    const characterMap = {
      warrior: {
        pixel: this.renderWarriorWalkPixel.bind(this),
        vector: this.renderWarriorWalkVector.bind(this),
        '3d': this.renderWarriorWalk3D.bind(this)
      },
      cat_angel: {
        pixel: this.renderCatAngelWalkPixel.bind(this),
        vector: this.renderCatAngelWalkVector.bind(this),
        '3d': this.renderCatAngelWalk3D.bind(this)
      },
      cyborg: {
        pixel: this.renderCyborgWalkPixel.bind(this),
        vector: this.renderCyborgWalkVector.bind(this),
        '3d': this.renderCyborgWalk3D.bind(this)
      }
    };

    const renderFn = characterMap[character]?.[this.currentStyle];
    if (renderFn) {
      renderFn(ctx, x, y, state);
    }
  }

  // ===== WARRIOR - PIXEL ART =====
  renderWarriorPixel(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head with baseball cap
    ctx.fillStyle = '#8B6F47'; // Skin
    ctx.fillRect(-4, -16, 8, 8);
    ctx.fillStyle = '#FF4444'; // Cap
    ctx.fillRect(-5, -18, 10, 4);
    ctx.fillRect(-6, -18, 2, 2); // Brim

    // Eyes (red glow)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-2, -14, 2, 2);
    ctx.fillRect(1, -14, 2, 2);

    // Torso
    ctx.fillStyle = '#333333'; // Dark shirt
    ctx.fillRect(-5, -8, 10, 12);

    // Arms on controls
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-8, -4, 3, 6); // Left arm
    ctx.fillRect(5, -4, 3, 6); // Right arm

    ctx.restore();
  }

  renderWarriorWalkPixel(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head with cap
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-4, -28, 8, 8);
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(-5, -30, 10, 4);

    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-2, -26, 2, 2);
    ctx.fillRect(1, -26, 2, 2);

    // Body
    ctx.fillStyle = '#333333';
    ctx.fillRect(-5, -20, 10, 14);

    // Legs (walking)
    ctx.fillStyle = '#222222';
    ctx.fillRect(-4, -6 + walk, 4, 10);
    ctx.fillRect(1, -6 - walk, 4, 10);

    // Arms swinging
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-7, -16 + walk, 3, 8);
    ctx.fillRect(5, -16 - walk, 3, 8);

    ctx.restore();
  }

  // ===== WARRIOR - VECTOR =====
  renderWarriorVector(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cap
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(0, -15, 6, 3, 0, Math.PI, 0, true);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-2, -12, 1.5, 0, Math.PI * 2);
    ctx.arc(2, -12, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.roundRect(-5, -7, 10, 12, 2);
    ctx.fill();

    ctx.restore();
  }

  renderWarriorWalkVector(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cap
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(0, -26, 7, 4, 0, Math.PI, 0, true);
    ctx.fill();

    // Body
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.roundRect(-6, -16, 12, 16, 3);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.roundRect(-5, -4 + walk, 4, 10, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(1, -4 - walk, 4, 10, 2);
    ctx.fill();

    ctx.restore();
  }

  // ===== WARRIOR - 3D =====
  renderWarrior3D(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head with gradient shading
    const headGradient = ctx.createRadialGradient(-2, -14, 0, 0, -12, 6);
    headGradient.addColorStop(0, '#A08050');
    headGradient.addColorStop(1, '#6B5037');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Cap with specular
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(0, -15, 6, 3, 0, Math.PI, 0, true);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-2, -16, 2, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes with glow
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-2, -13, 2, 2);
    ctx.fillRect(1, -13, 2, 2);
    ctx.shadowBlur = 0;

    // Body with cloth shading
    const bodyGradient = ctx.createLinearGradient(-5, -7, 5, 5);
    bodyGradient.addColorStop(0, '#444444');
    bodyGradient.addColorStop(0.5, '#333333');
    bodyGradient.addColorStop(1, '#222222');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-5, -7, 10, 12);

    ctx.restore();
  }

  renderWarriorWalk3D(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    const bob = Math.abs(Math.sin(animTime * 0.015)) * 2;
    
    ctx.save();
    ctx.translate(x, y - bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    const headGradient = ctx.createRadialGradient(-2, -24, 0, 0, -22, 7);
    headGradient.addColorStop(0, '#A08050');
    headGradient.addColorStop(1, '#6B5037');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Cap
    ctx.fillStyle = '#FF4444';
    ctx.beginPath();
    ctx.ellipse(0, -26, 7, 4, 0, Math.PI, 0, true);
    ctx.fill();

    // Eyes
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(-3, -23, 2, 2);
    ctx.fillRect(1, -23, 2, 2);
    ctx.shadowBlur = 0;

    // Body
    const bodyGradient = ctx.createLinearGradient(0, -16, 0, 0);
    bodyGradient.addColorStop(0, '#444444');
    bodyGradient.addColorStop(1, '#222222');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-6, -16, 12, 16);

    // Legs with shadow
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#222222';
    ctx.fillRect(-5, -4 + walk, 4, 10);
    ctx.fillRect(1, -4 - walk, 4, 10);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // ===== CAT ANGEL - PIXEL ART =====
  renderCatAngelPixel(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head (black cat)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-4, -16, 8, 8);
    
    // Ears
    ctx.fillRect(-5, -20, 2, 4);
    ctx.fillRect(3, -20, 2, 4);

    // Eye (green)
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(1, -14, 2, 2);

    // Tail (animated)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-8, -6, 3, 8);

    // Wing (pink)
    ctx.fillStyle = '#FF88AA';
    ctx.fillRect(-10, -12, 4, 8);

    ctx.restore();
  }

  renderCatAngelWalkPixel(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    const tailWag = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#000000';
    ctx.fillRect(-5, -28, 10, 10);
    ctx.fillRect(-6, -32, 3, 4); // Ears
    ctx.fillRect(3, -32, 3, 4);

    // Eye
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(1, -26, 2, 3);

    // Body
    ctx.fillStyle = '#FF88AA'; // Suit
    ctx.fillRect(-5, -18, 10, 12);

    // Legs
    ctx.fillStyle = '#000000';
    ctx.fillRect(-4, -6 + walk, 3, 8);
    ctx.fillRect(1, -6 - walk, 3, 8);

    // Tail
    ctx.fillRect(-8 + tailWag, -14, 3, 10);

    // Wing
    ctx.fillStyle = '#FF88AA';
    ctx.fillRect(-10, -20, 4, 12);

    ctx.restore();
  }

  // ===== CAT ANGEL - VECTOR =====
  renderCatAngelVector(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-4, -16);
    ctx.lineTo(-6, -20);
    ctx.lineTo(-2, -18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, -16);
    ctx.lineTo(6, -20);
    ctx.lineTo(2, -18);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(2, -12, 1.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#FF88AA';
    ctx.beginPath();
    ctx.ellipse(-8, -8, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderCatAngelWalkVector(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-4, -26);
    ctx.lineTo(-7, -32);
    ctx.lineTo(-2, -28);
    ctx.fill();

    // Body
    ctx.fillStyle = '#FF88AA';
    ctx.beginPath();
    ctx.roundRect(-5, -16, 10, 14, 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(-4, -4 + walk, 3, 8, 1);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(1, -4 - walk, 3, 8, 1);
    ctx.fill();

    // Wing
    ctx.fillStyle = '#FF88AA';
    ctx.beginPath();
    ctx.ellipse(-8, -12, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ===== CAT ANGEL - 3D =====
  renderCatAngel3D(ctx, x, y, state) {
    const { facingLeft, animTime } = state;
    const haloFloat = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Halo with glow
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -20 + haloFloat, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Head
    const headGradient = ctx.createRadialGradient(-1, -13, 0, 0, -12, 5);
    headGradient.addColorStop(0, '#222222');
    headGradient.addColorStop(1, '#000000');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eye glow
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(2, -12, 1.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wing with feather detail
    const wingGradient = ctx.createRadialGradient(-8, -8, 0, -8, -8, 5);
    wingGradient.addColorStop(0, '#FFAACC');
    wingGradient.addColorStop(1, '#FF88AA');
    ctx.fillStyle = wingGradient;
    ctx.beginPath();
    ctx.ellipse(-8, -8, 3, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderCatAngelWalk3D(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    const bob = Math.abs(Math.sin(animTime * 0.015)) * 2;
    const haloFloat = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y - bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Floating halo
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -34 + haloFloat, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Head
    const headGradient = ctx.createRadialGradient(-2, -23, 0, 0, -22, 6);
    headGradient.addColorStop(0, '#222222');
    headGradient.addColorStop(1, '#000000');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.shadowColor = '#00FF00';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(2, -22, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Body
    const bodyGradient = ctx.createLinearGradient(0, -16, 0, -2);
    bodyGradient.addColorStop(0, '#FFAACC');
    bodyGradient.addColorStop(1, '#FF88AA');
    ctx.fillStyle = bodyGradient;
    ctx.fillRect(-5, -16, 10, 14);

    // Legs
    ctx.fillStyle = '#000000';
    ctx.fillRect(-4, -4 + walk, 3, 8);
    ctx.fillRect(1, -4 - walk, 3, 8);

    // Wing
    const wingGradient = ctx.createRadialGradient(-8, -12, 0, -8, -12, 6);
    wingGradient.addColorStop(0, '#FFAACC');
    wingGradient.addColorStop(1, '#FF88AA');
    ctx.fillStyle = wingGradient;
    ctx.beginPath();
    ctx.ellipse(-8, -12, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ===== CYBORG - PIXEL ART =====
  renderCyborgPixel(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-4, -16, 8, 8);

    // Pigtails (black)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-7, -14, 2, 6);
    ctx.fillRect(5, -14, 2, 6);

    // Visor glow
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-3, -13, 6, 2);

    // Body (armor)
    ctx.fillStyle = '#556688';
    ctx.fillRect(-5, -8, 10, 12);

    // Energy conduits
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -6, 2, 2);
    ctx.fillRect(2, -6, 2, 2);

    ctx.restore();
  }

  renderCyborgWalkPixel(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.fillRect(-5, -28, 10, 10);

    // Pigtails
    ctx.fillStyle = '#000000';
    ctx.fillRect(-8, -26 + walk * 0.5, 2, 8);
    ctx.fillRect(6, -26 - walk * 0.5, 2, 8);

    // Visor
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -25, 8, 2);

    // Body
    ctx.fillStyle = '#556688';
    ctx.fillRect(-6, -18, 12, 14);

    // Legs
    ctx.fillStyle = '#444466';
    ctx.fillRect(-5, -6 + walk, 4, 10);
    ctx.fillRect(1, -6 - walk, 4, 10);

    // Energy conduits
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -14, 2, 2);
    ctx.fillRect(2, -14, 2, 2);

    ctx.restore();
  }

  // ===== CYBORG - VECTOR =====
  renderCyborgVector(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pigtails
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-6, -10, 1.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -10, 1.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -13, 8, 2);

    // Body
    ctx.fillStyle = '#556688';
    ctx.beginPath();
    ctx.roundRect(-5, -7, 10, 12, 2);
    ctx.fill();

    ctx.restore();
  }

  renderCyborgWalkVector(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    ctx.fillStyle = '#8B6F47';
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pigtails
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-7, -20 + walk * 0.3, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -20 - walk * 0.3, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-5, -23, 10, 2);

    // Body
    ctx.fillStyle = '#556688';
    ctx.beginPath();
    ctx.roundRect(-6, -16, 12, 14, 3);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#444466';
    ctx.beginPath();
    ctx.roundRect(-5, -4 + walk, 4, 10, 2);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(1, -4 - walk, 4, 10, 2);
    ctx.fill();

    ctx.restore();
  }

  // ===== CYBORG - 3D =====
  renderCyborg3D(ctx, x, y, state) {
    const { facingLeft } = state;
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Head with skin gradient
    const headGradient = ctx.createRadialGradient(-2, -13, 0, 0, -12, 5);
    headGradient.addColorStop(0, '#A08050');
    headGradient.addColorStop(1, '#6B5037');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pigtails
    const hairGradient = ctx.createRadialGradient(0, -10, 0, -6, -10, 3);
    hairGradient.addColorStop(0, '#111111');
    hairGradient.addColorStop(1, '#000000');
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.ellipse(-6, -10, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -10, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor with glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -13, 8, 2);
    ctx.shadowBlur = 0;

    // Armor body
    const armorGradient = ctx.createLinearGradient(-5, -7, 5, 5);
    armorGradient.addColorStop(0, '#667799');
    armorGradient.addColorStop(0.5, '#556688');
    armorGradient.addColorStop(1, '#445577');
    ctx.fillStyle = armorGradient;
    ctx.fillRect(-5, -7, 10, 12);

    // Energy conduits with glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 4;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-3, -5, 2, 2);
    ctx.fillRect(1, -5, 2, 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  renderCyborgWalk3D(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.015) * 3;
    const bob = Math.abs(Math.sin(animTime * 0.015)) * 2;
    
    ctx.save();
    ctx.translate(x, y - bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Head
    const headGradient = ctx.createRadialGradient(-2, -23, 0, 0, -22, 6);
    headGradient.addColorStop(0, '#A08050');
    headGradient.addColorStop(1, '#6B5037');
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pigtails (animated)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-7, -20 + walk * 0.3, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -20 - walk * 0.3, 2, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Visor glow
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-5, -23, 10, 2);
    ctx.shadowBlur = 0;

    // Armor body
    const armorGradient = ctx.createLinearGradient(0, -16, 0, -2);
    armorGradient.addColorStop(0, '#667799');
    armorGradient.addColorStop(1, '#445577');
    ctx.fillStyle = armorGradient;
    ctx.fillRect(-6, -16, 12, 14);

    // Legs
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = '#444466';
    ctx.fillRect(-5, -4 + walk, 4, 10);
    ctx.fillRect(1, -4 - walk, 4, 10);
    ctx.shadowBlur = 0;

    // Energy conduits
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#00FFFF';
    ctx.fillRect(-4, -12, 2, 2);
    ctx.fillRect(2, -12, 2, 2);
    ctx.shadowBlur = 0;

    ctx.restore();
  }
}

