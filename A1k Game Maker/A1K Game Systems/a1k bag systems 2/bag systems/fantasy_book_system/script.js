// The Grimoire System - Offline Mode (No Modules)

(function() {
    // --- DATA & CONFIG ---
    const TABS_CONFIG = [
        { id: "items", label: "Inventory", icon: "📦", type: "grid" },
        { id: "gear", label: "Equipment", icon: "⚔️", type: "grid" },
        { id: "team", label: "Companions", icon: "👥", type: "team" },
        { id: "pets", label: "Familiars", icon: "🐾", type: "grid" },
        { id: "skins", label: "Attire", icon: "👤", type: "grid" },
        { id: "talents", label: "Talents", icon: "⭐", type: "list" },
        { id: "vehicles", label: "Mounts", icon: "🐎", type: "list" },
        { id: "ai", label: "Constructs", icon: "🤖", type: "list" },
        { id: "alchemy", label: "Alchemy", icon: "⚗️", type: "grid" },
        { id: "skills", label: "Grimoire", icon: "🔰", type: "list" },
        { id: "spirit", label: "Spirit", icon: "✨", type: "list" },
        { id: "supernatural", label: "Arcane", icon: "🔮", type: "list" },
        { id: "quests", label: "Quests", icon: "📜", type: "list" },
        { id: "drops", label: "Loot", icon: "🎁", type: "grid" },
        { id: "bestiary", label: "Bestiary", icon: "📖", type: "list" },
        { id: "missions", label: "Bounties", icon: "🗺️", type: "list" },
        { id: "map", label: "Atlas", icon: "🗺️", type: "list" },
        { id: "shop", label: "Merchant", icon: "💰", type: "grid" },
        { id: "settings", label: "Options", icon: "⚙️", type: "list" },
        { id: "controls", label: "Bindings", icon: "🕹️", type: "list" }
    ];

    const PARTY_DATA = [
        { name: 'A1', role: 'Knight', sketch: '🧔', desc: 'The bearer of the Blue Blade.' },
        { name: 'Missy', role: 'Sorceress', sketch: '👩‍🎤', desc: 'Mistress of Purple Fire.' },
        { name: 'Unique', role: 'Rogue', sketch: '🥷', desc: 'Shadow of the Orange Sun.' }
    ];

    // --- INVENTORY LOGIC ---
    class Inventory {
        constructor() {
            this.size = 30;
            this.items = new Array(this.size).fill(null);
            this.load();
            
            // Seed if empty
            if (this.getAll().every(i => i === null)) {
                this.seed();
            }
        }

        seed() {
            const loot = [
                { name: "Ancient Sword", icon: "⚔️", quality: "common" },
                { name: "Health Potion", icon: "🧪", quality: "common", qty: 3 },
                { name: "Magic Scroll", icon: "📜", quality: "rare" },
                { name: "Gold Ring", icon: "💍", quality: "uncommon" }
            ];
            loot.forEach(item => this.addItem({
                ...item, 
                instanceId: Date.now() + Math.random(),
                desc: "A discovered item."
            }));
        }

        addItem(item) {
            const idx = this.items.findIndex(i => i === null);
            if (idx !== -1) {
                this.items[idx] = { ...item, qty: item.qty || 1 };
                this.save();
                return true;
            }
            return false;
        }

        moveItem(from, to) {
            if (from === to) return;
            const temp = this.items[to];
            this.items[to] = this.items[from];
            this.items[from] = temp;
            this.save();
        }

        getAll() { return this.items; }

        save() {
            localStorage.setItem('grimoire_inv', JSON.stringify(this.items));
        }

        load() {
            const data = localStorage.getItem('grimoire_inv');
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    this.items = parsed.length === this.size ? parsed : new Array(this.size).fill(null);
                } catch(e) { console.error(e); }
            }
        }
    }

    // --- RENDERERS ---
    const Renderers = {
        grid: (container, tab, inv) => {
            container.innerHTML = `<div class="ink-grid" id="drag-grid"></div>`;
            const grid = container.querySelector('.ink-grid');
            
            inv.getAll().forEach((item, idx) => {
                const slot = document.createElement('div');
                slot.className = 'ink-slot';
                slot.dataset.index = idx;
                
                if (item) {
                    slot.draggable = true;
                    slot.innerHTML = `
                        <div>${item.icon}</div>
                        ${item.qty > 1 ? `<span class="qty">${item.qty}</span>` : ''}
                    `;
                    
                    slot.addEventListener('dragstart', (e) => {
                        e.dataTransfer.setData('text/plain', idx);
                        slot.style.opacity = '0.5';
                    });
                    
                    slot.addEventListener('dragend', () => slot.style.opacity = '1');
                }
                
                slot.addEventListener('dragover', e => e.preventDefault());
                slot.addEventListener('drop', e => {
                    e.preventDefault();
                    const from = parseInt(e.dataTransfer.getData('text/plain'));
                    if (!isNaN(from)) {
                        inv.moveItem(from, idx);
                        Renderers.grid(container, tab, inv); // Re-render
                    }
                });

                grid.appendChild(slot);
            });
        },
        
        team: (container) => {
            PARTY_DATA.forEach(char => {
                const card = document.createElement('div');
                card.className = 'portrait-card';
                card.innerHTML = `
                    <div class="portrait-sketch">${char.sketch}</div>
                    <div>
                        <div style="font-family: var(--font-header); font-size:24px;">${char.name}</div>
                        <div style="color: var(--crimson); font-style: italic;">${char.role}</div>
                        <div>${char.desc}</div>
                    </div>
                `;
                container.appendChild(card);
            });
        },

        list: (container, tab) => {
            container.innerHTML = `<p style="font-style:italic;">Notes on ${tab.label}...</p>`;
            for(let i=1; i<=5; i++) {
                const row = document.createElement('div');
                row.className = 'ink-list-item';
                row.innerHTML = `
                    <strong>${tab.label} Entry ${i}</strong>
                    <span>pg. ${100+i}</span>
                `;
                container.appendChild(row);
            }
        }
    };

    // --- MAIN SYSTEM ---
    class GrimoireApp {
        constructor() {
            this.inv = new Inventory();
            this.activeTab = 'items';
            this.isOpen = false;
            this.init();
        }

        init() {
            this.renderNav();
            
            document.getElementById('btn-toggle-book').onclick = () => this.toggle();
            
            // Candle Animation
            this.initCandle();
        }

        renderNav() {
            const nav = document.getElementById('book-nav');
            nav.innerHTML = '';
            TABS_CONFIG.forEach(tab => {
                const el = document.createElement('div');
                el.className = `nav-entry ${tab.id === this.activeTab ? 'active' : ''}`;
                el.innerText = tab.label;
                el.onclick = () => this.switchTab(tab);
                nav.appendChild(el);
            });
        }

        switchTab(tab) {
            this.activeTab = tab.id;
            this.renderNav();
            
            document.getElementById('page-header').innerText = tab.label;
            
            const container = document.getElementById('book-view-container');
            container.innerHTML = '';
            
            if (tab.type === 'grid') Renderers.grid(container, tab, this.inv);
            else if (tab.type === 'team') Renderers.team(container);
            else Renderers.list(container, tab);
        }

        toggle() {
            this.isOpen = !this.isOpen;
            const book = document.getElementById('book-container');
            const btn = document.getElementById('btn-toggle-book');
            
            if (this.isOpen) {
                book.classList.add('open');
                btn.innerText = "Close Grimoire";
                // Render initial tab
                const tab = TABS_CONFIG.find(t => t.id === this.activeTab);
                this.switchTab(tab);
            } else {
                book.classList.remove('open');
                btn.innerText = "Open Grimoire (B)";
            }
        }

        initCandle() {
            const canvas = document.getElementById('candle-canvas');
            const ctx = canvas.getContext('2d');
            let w, h;
            
            const resize = () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            };
            window.onresize = resize;
            resize();

            const flicker = () => {
                ctx.clearRect(0,0,w,h);
                
                // Vignette effect with flicker
                const radius = Math.min(w, h) * (0.6 + Math.random() * 0.05);
                const grad = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, radius);
                grad.addColorStop(0, 'rgba(255, 160, 60, 0.1)'); // Warm center
                grad.addColorStop(1, 'rgba(0,0,0,0.8)'); // Dark edges
                
                ctx.fillStyle = grad;
                ctx.fillRect(0,0,w,h);
                
                requestAnimationFrame(flicker);
            };
            flicker();
        }
    }

    // Start
    window.onload = () => {
        window.Grimoire = new GrimoireApp();
    };

})();
