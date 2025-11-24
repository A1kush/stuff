// src/game/Platform.js

// Use the same shared palette
const PALETTE = {
  cyan: "#00E5FF",
  purple: "#9A6BFF",
  crimson: "#FF4D4F",
  gold: "#FFD56A",
  dark: "#0B1421",
};

/**
 * Renders the main ground platform.
 * @param {CanvasRenderingContext2D} ctx The canvas context to draw on.
 * @param {number} y The y-coordinate for the top of the platform.
 * @param {number} width The width of the canvas/view.
 * @param {number} height The height of the platform area.
 */
export function drawPlatform(ctx, y, width, height) {
  // --- Base Platform Shape ---
  // Create a subtle gradient for the main surface to give it depth.
  const platformGradient = ctx.createLinearGradient(0, y, 0, y + height);
  platformGradient.addColorStop(0, "#293854"); // Darker top edge
  platformGradient.addColorStop(0.1, "#1E293B"); // Main surface color
  platformGradient.addColorStop(1, "#111827"); // Fading to dark at the bottom

  ctx.fillStyle = platformGradient;
  ctx.fillRect(0, y, width, height);

  // --- Top Edge Highlight ---
  // A bright line to define the walkable surface.
  ctx.fillStyle = PALETTE.cyan;
  ctx.shadowColor = PALETTE.cyan;
  ctx.shadowBlur = 10;
  ctx.fillRect(0, y, width, 2);
  ctx.shadowBlur = 0;

  // --- Procedural Grid Lines ---
  // Add some vector detail to the surface.
  ctx.strokeStyle = "rgba(157, 215, 255, 0.2)"; // Faint cyan
  ctx.lineWidth = 1;
  ctx.beginPath();

  // Horizontal lines
  const numHorizontalLines = 4;
  for (let i = 1; i <= numHorizontalLines; i++) {
    const lineY = y + (i * height) / (numHorizontalLines + 1);
    ctx.moveTo(0, lineY);
    ctx.lineTo(width, lineY);
  }

  // Vertical lines
  const verticalSpacing = 100;
  for (let i = 0; i < width; i += verticalSpacing) {
    ctx.moveTo(i, y);
    ctx.lineTo(i, y + height);
  }

  ctx.stroke();
}

