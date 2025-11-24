import { DashboardSystem } from './core/System.js';
import { GROUPS, TABS_CONFIG } from './config/groups.js';
import { Renderers } from './ui/Renderers.js';

const sys = new DashboardSystem();

// Register Renderers
sys.registerRenderer('grid', Renderers.grid);
sys.registerRenderer('team', Renderers.team);
sys.registerRenderer('list', Renderers.list);
sys.registerRenderer('tree', Renderers.info); // Fallback for tree
sys.registerRenderer('info', Renderers.info);

// Init
sys.init(GROUPS, TABS_CONFIG);

// Expose
window.DashboardSystem = sys;

document.getElementById('btn-dashboard').onclick = () => sys.toggle();

// Playtest/Verification Hook
window.verifyState = () => {
    console.log(`Active Group: ${sys.activeGroup}, Active Tab: ${sys.activeTabId}`);
    return { group: sys.activeGroup, tab: sys.activeTabId };
};

// Canvas BG
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w, h;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.onresize = resize;
resize();

function animate() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0,0,w,h);
    
    // Subtle flowing particles
    const time = Date.now() * 0.001;
    for(let i=0; i<50; i++) {
        const x = (Math.sin(time + i) * 0.5 + 0.5) * w;
        const y = (Math.cos(time * 0.5 + i) * 0.5 + 0.5) * h;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(59, 130, 246, ${Math.random()*0.5})`;
        ctx.fill();
    }
    requestAnimationFrame(animate);
}
animate();
