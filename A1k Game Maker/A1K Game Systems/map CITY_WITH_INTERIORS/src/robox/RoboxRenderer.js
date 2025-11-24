(function () {
  class RoboxRenderer {
    constructor() {
      this.animTime = 0;
    }

    render(ctx, x, y, opts = {}) {
      const facingLeft = !!opts.facingLeft;
      const animState = opts.animState || "idle";
      this.animTime = opts.animTime ?? this.animTime;

      ctx.save();
      ctx.translate(x, y);
      if (facingLeft) ctx.scale(-1, 1);

      const bob = Math.sin(this.animTime * 0.008) * 3;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.28 + Math.sin(this.animTime * 0.01) * 0.12;
      const gradient = ctx.createRadialGradient(0, -20, 0, 0, -24, 44);
      gradient.addColorStop(0, "rgba(91,163,255,0.45)");
      gradient.addColorStop(1, "rgba(91,163,255,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, -22, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#101728";
      ctx.strokeStyle = "#5bffaa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -36 + bob);
      ctx.quadraticCurveTo(-18, -12 + bob, -10, 12 + bob);
      ctx.quadraticCurveTo(-6, 30 + bob, 0, 34 + bob);
      ctx.quadraticCurveTo(6, 30 + bob, 10, 12 + bob);
      ctx.quadraticCurveTo(18, -12 + bob, 14, -36 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#5ba3ff";
      ctx.fillRect(-10, -28 + bob, 20, 10);
      ctx.fillStyle = "#5bffaa";
      ctx.fillRect(-6, -26 + bob, 5, 5);
      ctx.fillRect(2, -26 + bob, 5, 5);

      const armSwing =
        animState === "attack"
          ? 0.5
          : Math.sin(this.animTime * 0.01) * (animState === "run" ? 0.45 : 0.2);

      ctx.strokeStyle = "#5bffaa";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      ctx.save();
      ctx.translate(-12, -10 + bob);
      ctx.rotate(-armSwing);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-6, 20);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(12, -10 + bob);
      ctx.rotate(armSwing);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(6, 20);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(0, 18 + bob);
      const thruster = Math.max(0.4, animState === "idle" ? 0.6 : 1.0);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.4 * thruster;
      ctx.fillStyle = "#5ba3ff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }
  }

  function registerRoboxRenderer(scope = window) {
    scope.CharacterRenderers = scope.CharacterRenderers || {};
    if (!scope.CharacterRenderers.Robox) {
      scope.CharacterRenderers.Robox = new RoboxRenderer();
    }
  }

  window.registerRoboxRenderer = registerRoboxRenderer;
})();
