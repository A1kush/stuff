// src/art/CharacterSprite.js
// Simple player sprite for pet demo

const PALETTE = {
  cyan: "#00E5FF",
  purple: "#9A6BFF",
  crimson: "#FF4D4F",
};

export class CharacterSprite {
  render(ctx, x, y, state) {
    const { animTime, isGrounded, vx } = state;
    const time = animTime / 1000;

    const bobOffset = isGrounded ? Math.sin(time * 5) * 2 : 0;
    const runCycle = isGrounded && Math.abs(vx) > 0.1 ? time * 15 : 0;
    const legAngle = Math.sin(runCycle) * 0.4;

    ctx.save();
    ctx.translate(x, y + bobOffset);

    // Body
    const bodyHeight = 35;
    const bodyWidth = 20;
    ctx.fillStyle = PALETTE.crimson;
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

    // Eye
    ctx.fillStyle = PALETTE.cyan;
    ctx.shadowColor = PALETTE.cyan;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, -bodyHeight - headRadius + 4, headRadius * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Legs
    const legLength = 18;
    ctx.strokeStyle = PALETTE.crimson;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    ctx.save();
    ctx.rotate(legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, legLength);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.rotate(-legAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, legLength);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }
}

