// HDPixelArtVehicles.js - HD Pixel Art style (128x128) for all 17 vehicles

export class HDPixelArtVehicles {
  constructor() {
    this.pixelSize = 1; // 1:1 pixel ratio for HD
  }

  // Helper to draw pixel-perfect rectangles
  drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
  }

  // Helper for pixel glow effect
  drawGlow(ctx, x, y, radius, color) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = radius;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
    ctx.restore();
  }

  renderBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.015) * 1;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    this.drawPixelRect(ctx, -20, -8, 40, 12, '#00AACC');
    this.drawPixelRect(ctx, -18, -10, 36, 2, '#00E5FF'); // Top highlight
    
    // Seat
    this.drawPixelRect(ctx, -8, -12, 16, 4, '#0099BB');
    
    // Wheels (animated rotation)
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.drawWheel(ctx, -14, 6, 6, wheelAngle);
    this.drawWheel(ctx, 14, 6, 6, wheelAngle);
    
    // Engine glow
    this.drawGlow(ctx, -22, -4, 8, '#00E5FF');
    
    // Handlebars
    this.drawPixelRect(ctx, -16, -14, 2, 6, '#0088AA');
    this.drawPixelRect(ctx, -16, -14, 8, 2, '#0088AA');

    ctx.restore();
  }

  renderChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.012) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Extended body
    this.drawPixelRect(ctx, -30, -10, 60, 16, '#CC5529');
    this.drawPixelRect(ctx, -28, -12, 56, 3, '#FF6B35'); // Top highlight
    
    // Seat sections (3 seats)
    this.drawPixelRect(ctx, -24, -14, 12, 4, '#AA4422');
    this.drawPixelRect(ctx, -8, -14, 12, 4, '#AA4422');
    this.drawPixelRect(ctx, 8, -14, 12, 4, '#AA4422');
    
    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -22, 8, 8, wheelAngle);
    this.drawWheel(ctx, 22, 8, 8, wheelAngle);
    
    // Chrome pipes
    this.drawPixelRect(ctx, -12, -4, 3, 12, '#DDDDDD');
    this.drawPixelRect(ctx, -6, -4, 3, 12, '#DDDDDD');
    this.drawPixelRect(ctx, 6, -4, 3, 12, '#DDDDDD');

    ctx.restore();
  }

  renderJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.02) * 2;
    const flame = Math.sin(animTime * 0.05) * 4 + 8;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main jetpack body
    this.drawPixelRect(ctx, -12, -20, 24, 32, '#7A55CC');
    this.drawPixelRect(ctx, -10, -18, 20, 2, '#AA88FF'); // Top highlight
    
    // Straps
    this.drawPixelRect(ctx, -14, -12, 2, 16, '#555555');
    this.drawPixelRect(ctx, 12, -12, 2, 16, '#555555');
    
    // Thruster nozzles
    this.drawPixelRect(ctx, -10, 10, 6, 6, '#333333');
    this.drawPixelRect(ctx, 4, 10, 6, 6, '#333333');
    
    // Flames
    ctx.globalAlpha = 0.8;
    this.drawPixelRect(ctx, -8, 16, 4, flame, '#FF6600');
    this.drawPixelRect(ctx, -7, 16 + flame * 0.3, 2, flame * 0.5, '#FFAA00');
    this.drawPixelRect(ctx, 6, 16, 4, flame, '#FF6600');
    this.drawPixelRect(ctx, 7, 16 + flame * 0.3, 2, flame * 0.5, '#FFAA00');
    ctx.globalAlpha = 1;
    
    // Control panel
    this.drawPixelRect(ctx, -4, -14, 8, 4, '#00E5FF');
    this.drawGlow(ctx, 0, -12, 6, '#00E5FF');

    ctx.restore();
  }

  renderCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    this.drawPixelRect(ctx, -28, -12, 56, 20, '#CCAA00');
    this.drawPixelRect(ctx, -26, -14, 52, 3, '#FFD700'); // Top highlight
    
    // Roof
    this.drawPixelRect(ctx, -16, -18, 32, 6, '#AA8800');
    
    // Windows
    this.drawPixelRect(ctx, -14, -16, 12, 4, '#6699CC');
    this.drawPixelRect(ctx, 2, -16, 12, 4, '#6699CC');
    
    // Wheels
    const wheelAngle = (animTime * 0.01) % (Math.PI * 2);
    this.drawWheel(ctx, -20, 10, 7, wheelAngle);
    this.drawWheel(ctx, 20, 10, 7, wheelAngle);
    
    // Headlights
    this.drawGlow(ctx, 26, -4, 10, '#FFFF88');
    this.drawPixelRect(ctx, 26, -4, 3, 6, '#FFFF88');
    
    // Details
    this.drawPixelRect(ctx, -28, 0, 56, 2, '#998800'); // Body line

    ctx.restore();
  }

  renderPersonalBike(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.018) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Sleek body
    this.drawPixelRect(ctx, -18, -6, 36, 10, '#00CC6A');
    this.drawPixelRect(ctx, -16, -8, 32, 2, '#00FF88'); // Top shine
    
    // Single seat
    this.drawPixelRect(ctx, -6, -10, 12, 4, '#00AA55');
    
    // Wheels (smaller, faster looking)
    const wheelAngle = (animTime * 0.015) % (Math.PI * 2);
    this.drawWheel(ctx, -12, 6, 5, wheelAngle);
    this.drawWheel(ctx, 12, 6, 5, wheelAngle);
    
    // Speed lines
    ctx.globalAlpha = 0.6;
    this.drawPixelRect(ctx, -22, -2, 4, 1, '#00FF88');
    this.drawPixelRect(ctx, -24, 0, 6, 1, '#00FF88');
    ctx.globalAlpha = 1;
    
    // Engine glow
    this.drawGlow(ctx, -20, -2, 10, '#00FF88');

    ctx.restore();
  }

  renderPersonalChopper(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.01) * 0.5;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Body
    this.drawPixelRect(ctx, -28, -8, 56, 14, '#CC3333');
    this.drawPixelRect(ctx, -26, -10, 52, 2, '#FF4444');
    
    // Single seat
    this.drawPixelRect(ctx, -8, -12, 16, 4, '#AA2222');
    
    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -20, 8, 7, wheelAngle);
    this.drawWheel(ctx, 20, 8, 7, wheelAngle);
    
    // Exhaust pipes
    this.drawPixelRect(ctx, -10, -2, 3, 10, '#CCCCCC');
    this.drawPixelRect(ctx, 8, -2, 3, 10, '#CCCCCC');

    ctx.restore();
  }

  renderPersonalJetpack(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.025) * 2.5;
    const flame = Math.sin(animTime * 0.06) * 5 + 10;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Compact jetpack body
    this.drawPixelRect(ctx, -10, -18, 20, 28, '#8866CC');
    this.drawPixelRect(ctx, -8, -16, 16, 2, '#AA88FF');
    
    // Thrusters
    this.drawPixelRect(ctx, -8, 8, 5, 5, '#333333');
    this.drawPixelRect(ctx, 3, 8, 5, 5, '#333333');
    
    // Enhanced flames
    ctx.globalAlpha = 0.9;
    this.drawPixelRect(ctx, -6, 13, 3, flame, '#FF3300');
    this.drawPixelRect(ctx, -5, 13 + flame * 0.3, 1, flame * 0.6, '#FFCC00');
    this.drawPixelRect(ctx, 5, 13, 3, flame, '#FF3300');
    this.drawPixelRect(ctx, 6, 13 + flame * 0.3, 1, flame * 0.6, '#FFCC00');
    ctx.globalAlpha = 1;
    
    // Glow effect
    this.drawGlow(ctx, 0, -10, 8, '#AA88FF');

    ctx.restore();
  }

  renderPersonalCar(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Sporty body
    this.drawPixelRect(ctx, -24, -10, 48, 18, '#CC8800');
    this.drawPixelRect(ctx, -22, -12, 44, 2, '#FFAA00');
    
    // Low profile roof
    this.drawPixelRect(ctx, -12, -16, 24, 6, '#AA7700');
    
    // Window
    this.drawPixelRect(ctx, -10, -14, 20, 3, '#6699CC');
    
    // Wheels
    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.drawWheel(ctx, -16, 10, 6, wheelAngle);
    this.drawWheel(ctx, 16, 10, 6, wheelAngle);
    
    // Spoiler
    this.drawPixelRect(ctx, -26, -14, 4, 2, '#CC8800');
    this.drawPixelRect(ctx, -28, -16, 6, 2, '#CC8800');
    
    // Headlight glow
    this.drawGlow(ctx, 22, -4, 12, '#FFFFFF');

    ctx.restore();
  }

  renderHovercraft(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 3;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body
    this.drawPixelRect(ctx, -32, -12, 64, 20, '#00CCCC');
    this.drawPixelRect(ctx, -30, -14, 60, 3, '#00FFFF');
    
    // Canopy
    this.drawPixelRect(ctx, -16, -18, 32, 8, '#009999');
    this.drawPixelRect(ctx, -14, -17, 28, 2, '#66DDDD');
    
    // Hover pads
    this.drawPixelRect(ctx, -28, 10, 20, 4, '#008888');
    this.drawPixelRect(ctx, 8, 10, 20, 4, '#008888');
    
    // Hover glow effect
    ctx.globalAlpha = 0.6;
    this.drawPixelRect(ctx, -30, 14, 24, 8, '#00FFFF');
    this.drawPixelRect(ctx, 6, 14, 24, 8, '#00FFFF');
    ctx.globalAlpha = 1;
    
    this.drawGlow(ctx, -18, 16, 15, '#00FFFF');
    this.drawGlow(ctx, 18, 16, 15, '#00FFFF');

    ctx.restore();
  }

  renderHeavyTransport(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Large cargo body
    this.drawPixelRect(ctx, -44, -20, 88, 32, '#666666');
    this.drawPixelRect(ctx, -42, -22, 84, 3, '#888888');
    
    // Cargo container
    this.drawPixelRect(ctx, -38, -18, 76, 24, '#555555');
    this.drawPixelRect(ctx, -36, -16, 72, 2, '#777777');
    
    // Cabin
    this.drawPixelRect(ctx, 24, -24, 18, 10, '#777777');
    this.drawPixelRect(ctx, 26, -22, 14, 3, '#999999');
    
    // Windows
    this.drawPixelRect(ctx, 28, -21, 10, 4, '#4488AA');
    
    // Multiple wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -32, 14, 8, wheelAngle);
    this.drawWheel(ctx, -16, 14, 8, wheelAngle);
    this.drawWheel(ctx, 0, 14, 8, wheelAngle);
    this.drawWheel(ctx, 32, 14, 8, wheelAngle);

    ctx.restore();
  }

  renderBuggy(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bounce = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y + bounce);
    if (facingLeft) ctx.scale(-1, 1);

    // Roll cage
    this.drawPixelRect(ctx, -26, -20, 3, 26, '#CCCC00');
    this.drawPixelRect(ctx, 23, -20, 3, 26, '#CCCC00');
    this.drawPixelRect(ctx, -26, -20, 52, 3, '#CCCC00');
    this.drawPixelRect(ctx, -26, -10, 52, 3, '#CCCC00');
    
    // Body
    this.drawPixelRect(ctx, -22, 0, 44, 8, '#FFFF00');
    this.drawPixelRect(ctx, -20, -2, 40, 2, '#FFFF88');
    
    // Seats
    this.drawPixelRect(ctx, -16, -8, 12, 8, '#AAAA00');
    this.drawPixelRect(ctx, 4, -8, 12, 8, '#AAAA00');
    
    // Large off-road wheels
    const wheelAngle = (animTime * 0.012) % (Math.PI * 2);
    this.drawWheel(ctx, -18, 10, 9, wheelAngle);
    this.drawWheel(ctx, 18, 10, 9, wheelAngle);

    ctx.restore();
  }

  renderMechProto(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Legs
    this.drawPixelRect(ctx, -16, 10 + walk, 10, 20, '#444466');
    this.drawPixelRect(ctx, 6, 10 - walk, 10, 20, '#444466');
    
    // Feet
    this.drawPixelRect(ctx, -18, 30, 14, 6, '#333344');
    this.drawPixelRect(ctx, 4, 30, 14, 6, '#333344');
    
    // Main body/torso
    this.drawPixelRect(ctx, -20, -16, 40, 28, '#555577');
    this.drawPixelRect(ctx, -18, -18, 36, 3, '#666688');
    
    // Cockpit
    this.drawPixelRect(ctx, -12, -12, 24, 16, '#444455');
    this.drawPixelRect(ctx, -10, -10, 20, 2, '#6677AA');
    
    // Arms
    this.drawPixelRect(ctx, -24, -8, 6, 20, '#444466');
    this.drawPixelRect(ctx, 18, -8, 6, 20, '#444466');
    
    // Head/sensor
    this.drawPixelRect(ctx, -8, -24, 16, 8, '#555577');
    this.drawGlow(ctx, 0, -20, 8, '#FF0000');

    ctx.restore();
  }

  renderMechApex(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const walk = Math.sin(animTime * 0.01) * 2.5;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Legs (more articulated)
    this.drawPixelRect(ctx, -18, 12 + walk, 12, 24, '#556688');
    this.drawPixelRect(ctx, 6, 12 - walk, 12, 24, '#556688');
    
    // Joint details
    this.drawPixelRect(ctx, -16, 22, 8, 3, '#667799');
    this.drawPixelRect(ctx, 8, 22, 8, 3, '#667799');
    
    // Feet
    this.drawPixelRect(ctx, -20, 36, 16, 8, '#445566');
    this.drawPixelRect(ctx, 4, 36, 16, 8, '#445566');
    
    // Main body
    this.drawPixelRect(ctx, -24, -20, 48, 34, '#667799');
    this.drawPixelRect(ctx, -22, -22, 44, 3, '#7788AA');
    
    // Cockpit
    this.drawPixelRect(ctx, -14, -16, 28, 20, '#555577');
    this.drawPixelRect(ctx, -12, -14, 24, 2, '#8899BB');
    
    // Shoulder cannons
    this.drawPixelRect(ctx, -28, -18, 6, 12, '#556688');
    this.drawPixelRect(ctx, -32, -14, 6, 4, '#333344');
    this.drawPixelRect(ctx, 22, -18, 6, 12, '#556688');
    this.drawPixelRect(ctx, 26, -14, 6, 4, '#333344');
    
    // Cannon glow
    this.drawGlow(ctx, -30, -12, 8, '#FF6600');
    this.drawGlow(ctx, 28, -12, 8, '#FF6600');
    
    // Head
    this.drawPixelRect(ctx, -10, -30, 20, 10, '#667799');
    this.drawGlow(ctx, 0, -26, 10, '#00FF00');

    ctx.restore();
  }

  renderStreetSkateboard(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const tilt = Math.sin(animTime * 0.02) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Deck
    this.drawPixelRect(ctx, -16, -3, 32, 6, '#CC6688');
    this.drawPixelRect(ctx, -18, -2, 4, 4, '#CC6688'); // Nose curve
    this.drawPixelRect(ctx, 14, -2, 4, 4, '#CC6688'); // Tail curve
    
    // Grip tape
    this.drawPixelRect(ctx, -14, -1, 28, 2, '#333333');
    
    // Graphics
    this.drawPixelRect(ctx, -8, -2, 16, 1, '#FF88AA');
    this.drawPixelRect(ctx, -6, 1, 12, 1, '#FF88AA');
    
    // Trucks
    this.drawPixelRect(ctx, -12, 4, 6, 2, '#AAAAAA');
    this.drawPixelRect(ctx, 6, 4, 6, 2, '#AAAAAA');
    
    // Wheels (fast spin)
    const wheelAngle = (animTime * 0.02) % (Math.PI * 2);
    this.drawWheel(ctx, -14, 7, 3, wheelAngle);
    this.drawWheel(ctx, -8, 7, 3, wheelAngle);
    this.drawWheel(ctx, 8, 7, 3, wheelAngle);
    this.drawWheel(ctx, 14, 7, 3, wheelAngle);

    ctx.restore();
  }

  renderTank(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body/hull
    this.drawPixelRect(ctx, -42, -12, 84, 24, '#2A4A2A');
    this.drawPixelRect(ctx, -40, -14, 80, 3, '#3D5A3D');
    
    // Turret
    this.drawPixelRect(ctx, -24, -24, 48, 14, '#3D5A3D');
    this.drawPixelRect(ctx, -22, -26, 44, 2, '#4A664A');
    
    // Cannon
    this.drawPixelRect(ctx, 20, -20, 24, 6, '#2A4A2A');
    this.drawPixelRect(ctx, 44, -19, 4, 4, '#1A3A1A');
    
    // Armor plating details
    this.drawPixelRect(ctx, -38, -10, 76, 2, '#1A3A1A');
    this.drawPixelRect(ctx, -36, 0, 72, 2, '#1A3A1A');
    
    // Tracks
    this.drawPixelRect(ctx, -44, 14, 88, 10, '#1A2A1A');
    
    // Track wheels
    const wheelAngle = (animTime * 0.005) % (Math.PI * 2);
    for (let i = -32; i <= 32; i += 16) {
      this.drawWheel(ctx, i, 18, 5, wheelAngle);
    }

    ctx.restore();
  }

  renderHelicopter(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 2;
    const rotorAngle = (animTime * 0.03) % (Math.PI * 2);
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body
    this.drawPixelRect(ctx, -32, -8, 64, 20, '#338833');
    this.drawPixelRect(ctx, -30, -10, 60, 2, '#44AA44');
    
    // Cockpit bubble
    this.drawPixelRect(ctx, 12, -16, 24, 10, '#228822');
    ctx.globalAlpha = 0.4;
    this.drawPixelRect(ctx, 14, -14, 20, 6, '#66CCFF');
    ctx.globalAlpha = 1;
    
    // Tail boom
    this.drawPixelRect(ctx, -44, -4, 14, 8, '#2A772A');
    
    // Landing skids
    this.drawPixelRect(ctx, -24, 14, 48, 3, '#555555');
    this.drawPixelRect(ctx, -26, 18, 4, 6, '#555555');
    this.drawPixelRect(ctx, 22, 18, 4, 6, '#555555');
    
    // Main rotor (spinning)
    ctx.save();
    ctx.translate(0, -18);
    ctx.rotate(rotorAngle);
    ctx.globalAlpha = 0.5;
    this.drawPixelRect(ctx, -36, -2, 72, 4, '#666666');
    this.drawPixelRect(ctx, -2, -36, 4, 72, '#666666');
    ctx.globalAlpha = 1;
    ctx.restore();
    
    // Rotor mast
    this.drawPixelRect(ctx, -2, -18, 4, 10, '#444444');
    
    // Tail rotor
    ctx.save();
    ctx.translate(-48, 0);
    ctx.rotate(rotorAngle * 2);
    ctx.globalAlpha = 0.5;
    this.drawPixelRect(ctx, -8, -1, 16, 2, '#555555');
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.restore();
  }

  renderSpeedboat(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const bob = Math.sin(animTime * 0.02) * 1.5;
    
    ctx.save();
    ctx.translate(x, y + bob);
    if (facingLeft) ctx.scale(-1, 1);

    // Hull (wedge shape)
    this.drawPixelRect(ctx, -28, -6, 56, 16, '#2277CC');
    this.drawPixelRect(ctx, -26, -8, 52, 2, '#3399FF');
    
    // Bow (pointed)
    this.drawPixelRect(ctx, 26, -4, 6, 12, '#2277CC');
    this.drawPixelRect(ctx, 32, -2, 4, 8, '#1A66AA');
    
    // Windshield
    this.drawPixelRect(ctx, 4, -12, 16, 6, '#1A66AA');
    ctx.globalAlpha = 0.4;
    this.drawPixelRect(ctx, 6, -10, 12, 4, '#66CCFF');
    ctx.globalAlpha = 1;
    
    // Seats
    this.drawPixelRect(ctx, -12, -4, 10, 8, '#1A55AA');
    this.drawPixelRect(ctx, 0, -4, 10, 8, '#1A55AA');
    
    // Engine cover
    this.drawPixelRect(ctx, -22, -2, 12, 6, '#1A66AA');
    
    // Wake/splash effect
    ctx.globalAlpha = 0.6;
    this.drawPixelRect(ctx, -32, 8, 8, 4, '#FFFFFF');
    this.drawPixelRect(ctx, -34, 10, 4, 2, '#AADDFF');
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  // Helper method to draw animated wheels
  drawWheel(ctx, x, y, radius, angle) {
    ctx.save();
    ctx.translate(x, y);
    
    // Tire
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Rim
    ctx.fillStyle = '#666666';
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Spokes
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.rotate(angle);
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius * 0.5, 0);
      ctx.stroke();
      ctx.rotate(Math.PI / 2);
    }
    
    ctx.restore();
  }

  // NEW VEHICLES FROM BAG SYSTEM
  
  renderScooter(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const lean = Math.sin(animTime * 0.02) * 2;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lean * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Deck
    this.drawPixelRect(ctx, -12, 2, 24, 4, '#CC5580');
    this.drawPixelRect(ctx, -10, 0, 20, 2, '#FF6B9D'); // Top shine
    
    // Vertical post
    this.drawPixelRect(ctx, -10, -20, 3, 22, '#666666');
    
    // Handlebars
    this.drawPixelRect(ctx, -14, -22, 8, 2, '#888888');
    this.drawPixelRect(ctx, 6, -22, 8, 2, '#888888');
    this.drawPixelRect(ctx, -14, -22, 2, 4, '#666666'); // Grips
    this.drawPixelRect(ctx, 12, -22, 2, 4, '#666666');
    
    // Wheels (small)
    const wheelAngle = (animTime * 0.02) % (Math.PI * 2);
    this.drawWheel(ctx, -8, 6, 3, wheelAngle);
    this.drawWheel(ctx, 8, 6, 3, wheelAngle);

    ctx.restore();
  }

  renderShoppingCart(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Basket frame
    this.drawPixelRect(ctx, -18, -16, 36, 20, '#A0A0A0');
    this.drawPixelRect(ctx, -16, -14, 32, 16, '#C0C0C0'); // Inner
    
    // Wire pattern
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    for (let i = -14; i < 16; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, -14);
      ctx.lineTo(i, 2);
      ctx.stroke();
    }
    
    // Handle
    this.drawPixelRect(ctx, -20, -18, 2, 24, '#666666');
    this.drawPixelRect(ctx, -20, -18, 12, 2, '#666666');
    
    // Wheels (4 small casters)
    const wheelAngle = (animTime * 0.015) % (Math.PI * 2);
    this.drawWheel(ctx, -14, 6, 3, wheelAngle);
    this.drawWheel(ctx, -6, 6, 3, wheelAngle);
    this.drawWheel(ctx, 6, 6, 3, wheelAngle);
    this.drawWheel(ctx, 14, 6, 3, wheelAngle);

    ctx.restore();
  }

  renderRollerSkates(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const stride = Math.sin(animTime * 0.02) * 3;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Left boot
    this.drawPixelRect(ctx, -12, -8 + stride, 10, 12, '#FFA500');
    this.drawPixelRect(ctx, -11, -7 + stride, 8, 2, '#FFD700'); // Shine
    
    // Right boot
    this.drawPixelRect(ctx, 2, -8 - stride, 10, 12, '#FFA500');
    this.drawPixelRect(ctx, 3, -7 - stride, 8, 2, '#FFD700'); // Shine
    
    // Wheels (inline 4 wheels each)
    const wheelAngle = (animTime * 0.03) % (Math.PI * 2);
    for (let i = 0; i < 4; i++) {
      const wheelX = -10 + i * 3;
      this.drawWheel(ctx, wheelX, 4 + stride, 2, wheelAngle);
      this.drawWheel(ctx, wheelX + 14, 4 - stride, 2, wheelAngle);
    }

    ctx.restore();
  }

  renderHoverDisc(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const hover = Math.sin(animTime * 0.015) * 2;
    
    ctx.save();
    ctx.translate(x, y + hover);
    if (facingLeft) ctx.scale(-1, 1);

    // Main disc
    ctx.fillStyle = '#00CCCC';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Top shine
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.ellipse(0, -2, 18, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Hover glow
    ctx.globalAlpha = 0.6;
    const glowSize = 28 + Math.sin(animTime * 0.01) * 4;
    ctx.fillStyle = '#00FFFF';
    ctx.beginPath();
    ctx.ellipse(0, 6, glowSize / 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    this.drawGlow(ctx, 0, 8, 20, '#00FFFF');

    ctx.restore();
  }

  renderGlider(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const tilt = Math.sin(animTime * 0.01) * 5;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Wing (triangular)
    ctx.fillStyle = '#6495ED';
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(-40, 4);
    ctx.lineTo(40, 4);
    ctx.closePath();
    ctx.fill();
    
    // Wing highlight
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-35, 2);
    ctx.lineTo(35, 2);
    ctx.closePath();
    ctx.fill();
    
    // Support bars
    this.drawPixelRect(ctx, -1, -8, 2, 12, '#444444');
    this.drawPixelRect(ctx, -20, 0, 2, 6, '#444444');
    this.drawPixelRect(ctx, 18, 0, 2, 6, '#444444');
    
    // Control bar
    this.drawPixelRect(ctx, -24, 8, 48, 2, '#666666');

    ctx.restore();
  }

  renderBalloonRide(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const sway = Math.sin(animTime * 0.008) * 3;
    const float = Math.sin(animTime * 0.005) * 2;
    
    ctx.save();
    ctx.translate(x, y + float);
    ctx.rotate(sway * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Balloon
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.ellipse(0, -40, 20, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Balloon highlight
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.ellipse(-6, -44, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Balloon shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-8, -48, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Ropes
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, -12);
    ctx.lineTo(-10, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, -12);
    ctx.lineTo(10, -4);
    ctx.stroke();
    
    // Basket
    this.drawPixelRect(ctx, -12, -4, 24, 12, '#A0522D');
    this.drawPixelRect(ctx, -10, -2, 20, 8, '#D2691E'); // Inner
    
    // Basket weave
    ctx.strokeStyle = '#8B4513';
    for (let i = -10; i < 10; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, -2);
      ctx.lineTo(i, 6);
      ctx.stroke();
    }

    ctx.restore();
  }

  renderSled(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    const tilt = Math.sin(animTime * 0.015) * 1;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt * Math.PI / 180);
    if (facingLeft) ctx.scale(-1, 1);

    // Top surface
    this.drawPixelRect(ctx, -20, -4, 40, 6, '#654321');
    this.drawPixelRect(ctx, -18, -5, 36, 2, '#8B4513'); // Highlight
    
    // Wooden slats
    ctx.strokeStyle = '#4A3520';
    ctx.lineWidth = 1;
    for (let i = -16; i < 20; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, -4);
      ctx.lineTo(i, 2);
      ctx.stroke();
    }
    
    // Curved runners
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 6);
    ctx.quadraticCurveTo(-24, 2, -20, 2);
    ctx.lineTo(-20, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(22, 6);
    ctx.quadraticCurveTo(24, 2, 20, 2);
    ctx.lineTo(20, 4);
    ctx.stroke();
    
    // Metal runners
    this.drawPixelRect(ctx, -22, 4, 44, 2, '#888888');

    ctx.restore();
  }

  renderVan(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body (box shape)
    this.drawPixelRect(ctx, -36, -20, 72, 32, '#1E3A8A');
    this.drawPixelRect(ctx, -34, -22, 68, 3, '#4169E1'); // Top highlight
    
    // Cargo area
    this.drawPixelRect(ctx, -28, -18, 56, 24, '#2C4C9A');
    
    // Cabin
    this.drawPixelRect(ctx, 26, -22, 12, 10, '#4169E1');
    
    // Windows
    this.drawPixelRect(ctx, 28, -20, 8, 6, '#6699CC');
    this.drawPixelRect(ctx, -20, -16, 10, 8, '#6699CC'); // Side window
    
    // Wheels
    const wheelAngle = (animTime * 0.008) % (Math.PI * 2);
    this.drawWheel(ctx, -24, 14, 8, wheelAngle);
    this.drawWheel(ctx, 24, 14, 8, wheelAngle);
    
    // Headlights
    this.drawGlow(ctx, 36, -12, 8, '#FFFF88');
    this.drawPixelRect(ctx, 36, -12, 2, 4, '#FFFF88');

    ctx.restore();
  }

  renderBus(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Main body (long box)
    this.drawPixelRect(ctx, -56, -24, 112, 36, '#FFA500');
    this.drawPixelRect(ctx, -54, -26, 108, 3, '#FFD700'); // Top highlight
    
    // Stripe
    this.drawPixelRect(ctx, -56, -8, 112, 3, '#FFFFFF');
    
    // Multiple windows
    for (let i = -48; i < 48; i += 16) {
      this.drawPixelRect(ctx, i, -20, 12, 10, '#6699CC');
    }
    
    // Front window
    this.drawPixelRect(ctx, 48, -20, 6, 12, '#6699CC');
    
    // Door
    this.drawPixelRect(ctx, -50, -4, 8, 14, '#CC8800');
    
    // Wheels
    const wheelAngle = (animTime * 0.006) % (Math.PI * 2);
    this.drawWheel(ctx, -44, 14, 8, wheelAngle);
    this.drawWheel(ctx, -20, 14, 8, wheelAngle);
    this.drawWheel(ctx, 20, 14, 8, wheelAngle);
    this.drawWheel(ctx, 44, 14, 8, wheelAngle);
    
    // Headlights
    this.drawGlow(ctx, 54, -10, 10, '#FFFF88');

    ctx.restore();
  }

  renderTrain(ctx, x, y, state) {
    const { animTime, facingLeft } = state;
    
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Main coach body
    this.drawPixelRect(ctx, -60, -28, 120, 40, '#8B0000');
    this.drawPixelRect(ctx, -58, -30, 116, 3, '#DC143C'); // Top highlight
    
    // Stripe
    this.drawPixelRect(ctx, -60, -8, 120, 4, '#FFD700');
    
    // Multiple windows
    for (let i = -52; i < 52; i += 16) {
      this.drawPixelRect(ctx, i, -22, 12, 12, '#6699CC');
    }
    
    // Door
    this.drawPixelRect(ctx, -56, -4, 10, 16, '#660000');
    
    // Train wheels (special)
    const wheelAngle = (animTime * 0.005) % (Math.PI * 2);
    ctx.fillStyle = '#333333';
    for (let i = -48; i < 48; i += 24) {
      ctx.beginPath();
      ctx.arc(i, 14, 10, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#666666';
      ctx.beginPath();
      ctx.arc(i, 14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#333333';
    }
    
    // Connection rod
    this.drawPixelRect(ctx, -48, 16, 96, 3, '#888888');

    ctx.restore();
  }

  // Main render dispatcher
  renderVehicle(ctx, vehicleId, x, y, state) {
    const renderMap = {
      bike: this.renderBike,
      chopper: this.renderChopper,
      jetpack: this.renderJetpack,
      car: this.renderCar,
      personal_bike: this.renderPersonalBike,
      personal_chopper: this.renderPersonalChopper,
      personal_jetpack: this.renderPersonalJetpack,
      personal_car: this.renderPersonalCar,
      hovercraft: this.renderHovercraft,
      heavy_transport: this.renderHeavyTransport,
      buggy: this.renderBuggy,
      mech_proto: this.renderMechProto,
      mech_apex: this.renderMechApex,
      skateboard_street: this.renderStreetSkateboard,
      tank: this.renderTank,
      helicopter: this.renderHelicopter,
      speedboat: this.renderSpeedboat,
      // NEW VEHICLES
      scooter: this.renderScooter,
      shopping_cart: this.renderShoppingCart,
      roller_skates: this.renderRollerSkates,
      hover_disc: this.renderHoverDisc,
      glider: this.renderGlider,
      balloon_ride: this.renderBalloonRide,
      sled: this.renderSled,
      van: this.renderVan,
      bus: this.renderBus,
      train: this.renderTrain
    };

    const renderFn = renderMap[vehicleId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
    }
  }
}

