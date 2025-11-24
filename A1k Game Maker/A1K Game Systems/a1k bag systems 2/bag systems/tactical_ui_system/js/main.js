import { TacticalSystem } from './core/System.js';
import { Inventory, ItemGenerator } from './data/Inventory.js';
import { TABS_CONFIG } from './config/tabs.js';
import { TacticalGridRenderer, TacticalGenericRenderer } from './ui/Renderers.js';

const sys = new TacticalSystem();
const inv = new Inventory();

// Pre-fill inventory if empty for the "surprise" effect
if (inv.getAll().filter(i => i).length === 0) {
    for(let i=0; i<15; i++) {
        inv.addItem(ItemGenerator.generate());
    }
}

// Register
sys.registerRenderer('grid', new TacticalGridRenderer(inv));
sys.registerRenderer('list', new TacticalGenericRenderer());
sys.registerRenderer('info', new TacticalGenericRenderer());
// Fallbacks
sys.registerRenderer('items', new TacticalGridRenderer(inv));
sys.registerRenderer('gear', new TacticalGridRenderer(inv));

// Init
sys.init({
    tabs: TABS_CONFIG,
    defaultTab: 'items'
});

window.TacticalSystem = sys;

// Button Hook
document.getElementById('btn-deploy').onclick = () => sys.toggle();

// Radar / Rain Animation
const canvas = document.getElementById('radar-canvas');
const ctx = canvas.getContext('2d');
let w, h;

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Matrix Rain Effect (Orange/Amber)
const columns = Math.floor(window.innerWidth / 20);
const drops = new Array(columns).fill(1);

function animate() {
    // Translucent black for trail
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ff9f43'; // Amber
    ctx.font = '15px monospace';

    for(let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * 20, drops[i] * 20);

        if(drops[i] * 20 > h && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
    requestAnimationFrame(animate);
}
animate();
