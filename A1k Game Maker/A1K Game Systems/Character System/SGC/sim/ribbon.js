const TYPE_COLORS = {
  feed: "#7ef0ff",
  heal: "#7effb3",
  attack: "#ff7edb",
  buff: "#ffce54",
  utility: "#a78bfa"
};

/**
 * Action Ribbon visualizer. It turns hero skill definitions into a horizontal
 * timeline so designers can see feed/heal beats interleave with damage arcs—no
 * combat engine needed. Pure canvas keeps it portable for vanilla HTML drops.
 */
export class RibbonSim {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.timeline = [];
    this.duration = 30; // seconds per loop
    this.time = 0;
    this.running = false;
    this.lastTs = 0;
  }

  setHeroes(heroes) {
    this.timeline = buildTimeline(heroes, this.duration);
    this.time = 0;
    if (!this.running) {
      this.start();
    }
  }

  start() {
    this.running = true;
    this.lastTs = performance.now();
    const tick = (ts) => {
      if (!this.running) return;
      const delta = (ts - this.lastTs) / 1000;
      this.lastTs = ts;
      this.time = (this.time + delta) % this.duration;
      this.render();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas);
    this.timeline.forEach((beat) => drawBeat(ctx, canvas, beat, this.time, this.duration));
    drawPlayhead(ctx, canvas, this.time, this.duration);
  }
}

function buildTimeline(heroes, duration) {
  const beats = [];
  const lanes = {
    feed: 0,
    heal: 1,
    buff: 2,
    attack: 3,
    utility: 4
  };
  heroes.slice(0, 6).forEach((hero, heroIdx) => {
    hero.skills.forEach((skill, skillIdx) => {
      const lane = lanes[skill.type] ?? (skillIdx % 5);
      const spacing = (duration / 6) * heroIdx;
      const offset = (skillIdx * 2) % duration;
      beats.push({
        hero: hero.name,
        skill: skill.name,
        type: skill.type,
        start: (spacing + offset) % duration,
        duration: Math.max(2, skill.cooldown / 4),
        lane,
        rationale: skill.rationale
      });
    });
  });
  return beats;
}

function drawGrid(ctx, canvas) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = mapLaneToY(canvas, i);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBeat(ctx, canvas, beat, time, duration) {
  const laneY = mapLaneToY(canvas, beat.lane) - 20;
  const width = (beat.duration / duration) * canvas.width;
  const x = (beat.start / duration) * canvas.width;
  const active = isBeatActive(beat, time, duration);
  ctx.save();
  ctx.fillStyle = active ? lighten(TYPE_COLORS[beat.type], 0.2) : TYPE_COLORS[beat.type];
  roundRect(ctx, x, laneY, width, 30, 10);
  ctx.fill();
  ctx.fillStyle = "#0d0d16";
  ctx.font = "12px 'Space Grotesk', sans-serif";
  ctx.fillText(`${beat.hero} • ${beat.skill}`, x + 8, laneY + 18);
  ctx.restore();

  if (active) {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.font = "10px 'Space Grotesk', sans-serif";
    ctx.fillText(`Why: ${beat.rationale}`, x + 8, laneY - 6);
    ctx.restore();
  }
}

function drawPlayhead(ctx, canvas, time, duration) {
  const x = (time / duration) * canvas.width;
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, canvas.height);
  ctx.stroke();
  ctx.restore();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function mapLaneToY(canvas, lane) {
  const spacing = canvas.height / 5;
  return spacing * lane + spacing / 2;
}

function isBeatActive(beat, time, loopDuration) {
  const end = (beat.start + beat.duration) % loopDuration;
  if (beat.start + beat.duration < loopDuration) {
    return time >= beat.start && time <= beat.start + beat.duration;
  }
  return time >= beat.start || time <= end;
}

function lighten(hex, amount = 0.2) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 255) + 255 * amount);
  const g = Math.min(255, ((num >> 8) & 255) + 255 * amount);
  const b = Math.min(255, (num & 255) + 255 * amount);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}
