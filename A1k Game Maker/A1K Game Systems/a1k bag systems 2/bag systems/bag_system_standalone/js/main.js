import { BagSystem } from './core/System.js';
import { TABS_CONFIG } from './config/tabs.js';
import { Inventory, ItemGenerator } from './data/Inventory.js';
import { GridRenderer } from './ui/GridRenderer.js';
import { ListRenderer, InfoRenderer } from './ui/GenericRenderers.js';

// Initialize Systems
const inventory = new Inventory();
const bagSystem = new BagSystem();

// Register Renderers
const gridRenderer = new GridRenderer(inventory);
const listRenderer = new ListRenderer();
const infoRenderer = new InfoRenderer();

bagSystem.registerRenderer('grid', gridRenderer);
bagSystem.registerRenderer('list', listRenderer);
bagSystem.registerRenderer('info', infoRenderer);

// Initialize Bag
bagSystem.init({
    tabs: TABS_CONFIG,
    defaultTab: 'items'
});

// Expose to Global Scope (The "Integration" part)
window.BagSystem = bagSystem;

// Demo Controls Logic
document.getElementById('btn-open-bag').addEventListener('click', () => {
    bagSystem.open();
});

document.getElementById('btn-add-item').addEventListener('click', () => {
    const item = ItemGenerator.generate();
    if (inventory.addItem(item)) {
        console.log("Added:", item.name);
        // If open, refresh
        if (bagSystem.isOpen && bagSystem.activeTabId === 'items') {
            bagSystem.renderActiveTab();
        }
    } else {
        alert("Bag Full!");
    }
});

document.getElementById('btn-save').addEventListener('click', () => {
    inventory.save();
    alert("Saved!");
});

document.getElementById('btn-clear').addEventListener('click', () => {
    inventory.clear();
    if (bagSystem.isOpen) bagSystem.renderActiveTab();
    alert("Cleared!");
});

// Canvas Animation (The "Game" Background)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: Math.random() * 5 + 2,
    color: `rgba(255, 255, 255, ${Math.random() * 0.5})`
}));

function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1e3c72');
    grad.addColorStop(1, '#2a5298');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,width,height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();
