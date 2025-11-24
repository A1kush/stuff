// src/art/SpriteDefinitions.js
// Consolidated sprite definitions for all game entities

// Shared color palette
const PALETTE = {
  cyan: "#00E5FF",
  purple: "#9A6BFF",
  crimson: "#FF4D4F",
  gold: "#FFD56A",
  dark: "#0B1421",
  purpleDark: "#6A3FBF",
  cyanLight: "#66F3FF",
  white: "#FFFFFF",
  glowCyan: "rgba(0, 229, 255, 0.6)",
  glowGold: "rgba(255, 213, 106, 0.4)",
  exhaustCyan: "rgba(0, 229, 255, 0.8)",
};

// ============================================================================
// CHARACTER SPRITE
// ============================================================================

export class CharacterSprite {
  constructor(options = {}) {
    this.color = options.color || PALETTE.crimson;
  }

  /**
   * Renders the character onto the canvas.
   * @param {CanvasRenderingContext2D} ctx The canvas context to draw on.
   * @param {number} x The center x-coordinate to draw the character.
   * @param {number} y The base y-coordinate (feet) of the character.
   * @param {object} state Information about the character's state.
   * @param {number} state.animTime A continuous time value for animations.
   * @param {boolean} state.isGrounded Is the character on the ground.
   * @param {number} state.vx The character's horizontal velocity.
   */
  render(ctx, x, y, state) {
    const { animTime, isGrounded, vx } = state;
    const time = animTime / 1000; // Convert to seconds

    // --- Animation Calculations ---
    // Bobbing motion using a sine wave for a "breathing" effect
    const bobOffset = isGrounded ? Math.sin(time * 5) * 2 : 0;

    // Running motion for legs
    const runCycle = isGrounded && Math.abs(vx) > 0.1 ? time * 15 : 0;
    const legAngle = Math.sin(runCycle) * 0.4; // Radians

    // --- Drawing ---
    ctx.save();
    ctx.translate(x, y + bobOffset); // Move canvas origin to player's base position

    // Body
    const bodyHeight = 35;
    const bodyWidth = 20;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-bodyWidth / 2, -bodyHeight);
    ctx.lineTo(bodyWidth / 2, -bodyHeight);
    ctx.lineTo((bodyWidth / 2) * 0.6, 0);
    ctx.lineTo((-bodyWidth / 2) * 0.6, 0);
    ctx.closePath();
    ctx.fill();

    // Head
    const headRadius = 10;
    ctx.fillStyle = PALETTE.purple;
    ctx.beginPath();
    ctx.arc(0, -bodyHeight - headRadius + 4, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Glowing "Eye" or Core
    ctx.fillStyle = PALETTE.cyan;
    ctx.shadowColor = PALETTE.cyan;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -bodyHeight - headRadius + 4, headRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow for other elements

    // Legs (simple rotating lines to show running)
    const legLength = 18;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    // Leg 1
    ctx.save();
    ctx.rotate(legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, legLength);
    ctx.stroke();
    ctx.restore();

    // Leg 2
    ctx.save();
    ctx.rotate(-legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, legLength);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Restore context to its original state
  }
}

// ============================================================================
// VEHICLE SPRITE (Default)
// ============================================================================

export class VehicleSprite {
  render(ctx, x, y, state) {
    const { animTime } = state;
    const time = animTime / 1000;

    const width = 80;
    const height = 30;
    const bobOffset = Math.sin(time * 2.5) * 4;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    // --- Main Body ---
    const bodyGradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    bodyGradient.addColorStop(0, PALETTE.dark);
    bodyGradient.addColorStop(0.5, PALETTE.purple);
    bodyGradient.addColorStop(1, PALETTE.dark);

    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(-width / 2, 0);
    ctx.lineTo((-width / 2) * 0.8, -height);
    ctx.lineTo((width / 2) * 0.8, -height);
    ctx.lineTo(width / 2, 0);
    ctx.closePath();
    ctx.fill();

    // --- Engine Glow ---
    ctx.fillStyle = PALETTE.cyan;
    ctx.shadowColor = PALETTE.cyan;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.ellipse((-width / 2) * 0.9, -height / 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // --- Canopy ---
    ctx.fillStyle = "rgba(0, 229, 255, 0.2)";
    ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -height - 5, width * 0.25, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}

// ============================================================================
// PET SPRITE
// ============================================================================

export class PetSprite {
  render(ctx, x, y, state) {
    const { animTime } = state;
    const time = animTime / 1000;

    const size = 12;
    const bobOffset = Math.sin(time * 6) * 3;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    // Simple glowing orb
    ctx.fillStyle = PALETTE.gold;
    ctx.shadowColor = PALETTE.gold;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -size, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inner core
    ctx.fillStyle = PALETTE.cyan;
    ctx.beginPath();
    ctx.arc(0, -size, size * 0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ============================================================================
// ALL VEHICLE SPRITES (Extended Collection)
// ============================================================================

export class AllVehicleSprites {
  // 1. Sports Car - Sleek, low-profile wedge (90x35px)
  renderSportsCar(ctx, x, y, state) {
    const { animTime } = state;
    const time = animTime / 1000;
    const bobOffset = Math.sin(time * 2.0) * 1.5;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    const width = 90;
    const height = 35;

    // Body gradient
    const bodyGradient = ctx.createLinearGradient(-width / 2, 0, width / 2, 0);
    bodyGradient.addColorStop(0, PALETTE.purpleDark);
    bodyGradient.addColorStop(0.5, PALETTE.purple);
    bodyGradient.addColorStop(1, PALETTE.dark);

    // Main body - wedge shape
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.moveTo(-width / 2 + 10, 0);
    ctx.lineTo(-width / 2, -height + 10);
    ctx.lineTo(width / 2 - 10, -height);
    ctx.lineTo(width / 2, -height / 3);
    ctx.closePath();
    ctx.fill();

    // Cyan accent stripe
    ctx.fillStyle = PALETTE.cyan;
    ctx.fillRect(-width / 2 + 20, -height + 15, width - 40, 3);

    // Canopy
    ctx.fillStyle = "rgba(0, 229, 255, 0.15)";
    ctx.strokeStyle = PALETTE.cyan;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(-width / 4, -height + 10, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Exhaust ports (2)
    ctx.fillStyle = PALETTE.cyan;
    ctx.shadowColor = PALETTE.cyan;
    ctx.shadowBlur = 15;
    for (let i = 0; i < 2; i++) {
      const portY = -height / 2 + i * 12 - 6;
      ctx.beginPath();
      ctx.ellipse(width / 2 - 5, portY, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // Helper method to render any vehicle by ID
  renderVehicle(ctx, vehicleId, x, y, state) {
    const renderMap = {
      'vehicle_sports_car': this.renderSportsCar,
      // Add more mappings as needed
    };

    const renderFn = renderMap[vehicleId];
    if (renderFn) {
      renderFn.call(this, ctx, x, y, state);
      return true;
    }
    return false;
  }
}

