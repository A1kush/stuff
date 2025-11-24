// src/art/Platform.js

const PALETTE = {
  cyan: "#00E5FF",
  purple: "#9A6BFF",
};

export function drawPlatform(ctx, y, width, height) {
  // Platform gradient
  const platformGradient = ctx.createLinearGradient(0, y, 0, y + height);
  platformGradient.addColorStop(0, "#293854");
  platformGradient.addColorStop(0.1, "#1E293B");
  platformGradient.addColorStop(1, "#111827");

  ctx.fillStyle = platformGradient;
  ctx.fillRect(0, y, width, height);

  // Top edge
  ctx.fillStyle = PALETTE.cyan;
  ctx.shadowColor = PALETTE.cyan;
  ctx.shadowBlur = 10;
  ctx.fillRect(0, y, width, 2);
  ctx.shadowBlur = 0;

  // Grid lines
  ctx.strokeStyle = "rgba(157, 215, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();

  const numHorizontalLines = 4;
  for (let i = 1; i <= numHorizontalLines; i++) {
    const lineY = y + (i * height) / (numHorizontalLines + 1);
    ctx.moveTo(0, lineY);
    ctx.lineTo(width, lineY);
  }

  const verticalSpacing = 100;
  for (let i = 0; i < width; i += verticalSpacing) {
    ctx.moveTo(i, y);
    ctx.lineTo(i, y + height);
  }

  ctx.stroke();
}

