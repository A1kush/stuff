import { PixelSystem } from './core/System.js';
import { TABS_CONFIG } from './config/tabs.js';
import { TeamRenderer, SkillsRenderer, PixelGridRenderer, GenericPixelRenderer } from './ui/PixelRenderers.js';

// Init
const sys = new PixelSystem();

// Register Renderers
sys.registerRenderer('team', new TeamRenderer());
sys.registerRenderer('skills', new SkillsRenderer());
sys.registerRenderer('grid', new PixelGridRenderer());
sys.registerRenderer('list', new GenericPixelRenderer()); // Fallback for list/info for now to keep it simple but working
sys.registerRenderer('info', new GenericPixelRenderer());

sys.init({
    tabs: TABS_CONFIG,
    defaultTab: 'team' // Start on Team tab as requested
});

// Expose
window.PixelSystem = sys;

// Hook up HUD button
document.getElementById('btn-menu').onclick = () => sys.toggle();

// Matrix Rain / Grid Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Cyberpunk Grid Animation
let offset = 0;
function animate() {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#00ff41'; // Neon Green
    ctx.lineWidth = 1;
    
    // Perspective Grid
    const horizon = h * 0.4;
    const speed = 0.5;
    
    offset = (offset + speed) % 40;

    ctx.beginPath();
    // Vertical lines
    for (let x = -w; x < w * 2; x += 40) {
        ctx.moveTo(x, h);
        ctx.lineTo((x - w/2) * 0.1 + w/2, horizon);
    }
    // Horizontal lines
    for (let y = h; y > horizon; y -= 40) {
        let drawY = y - (40 - offset); // Moving effect
        if(drawY > horizon) {
            ctx.moveTo(0, drawY);
            ctx.lineTo(w, drawY);
        }
    }
    ctx.stroke();
    
    // Glow
    ctx.fillStyle = 'rgba(0, 255, 65, 0.05)';
    ctx.fillRect(0, horizon, w, h-horizon);

    requestAnimationFrame(animate);
}
animate();
