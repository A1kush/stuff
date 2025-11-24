// Tactical System Core
export class TacticalSystem {
    constructor() {
        this.isOpen = false;
        this.activeTabId = 'items';
        this.selectedItem = null; // For inspector
        this.tabs = [];
        this.renderers = {};
        
        // Bindings
        this.toggle = this.toggle.bind(this);
    }

    init(config) {
        this.container = document.getElementById('tactical-root');
        if (!this.container.innerHTML.trim()) {
            this.createDOMStructure();
        }

        this.tabs = config.tabs || [];
        this.defaultTab = config.defaultTab || 'items';
        this.activeTabId = this.defaultTab;

        this.setupEvents();
        this.renderNav();
        // Don't render content yet until open
    }

    createDOMStructure() {
        this.container.innerHTML = `
            <div class="tac-container">
                <!-- COL 1: NAV -->
                <aside class="tac-nav">
                    <div class="tac-header">
                        <div class="tac-title">NEXUS</div>
                        <div class="tac-subtitle">Tactical Field Interface</div>
                    </div>
                    <nav id="tac-nav-list"></nav>
                </aside>

                <!-- COL 2: CONTENT -->
                <section class="tac-content">
                    <header class="content-header">
                        <div class="content-title" id="content-title">INVENTORY</div>
                        <div class="content-meta">SYS.VER.4.0</div>
                    </header>
                    <div id="tac-view-container"></div>
                </section>

                <!-- COL 3: INSPECTOR -->
                <aside class="tac-inspector" id="tac-inspector-panel">
                    <div style="padding-top:100px; text-align:center; color:#555;">NO SIGNAL TARGET ACQUIRED</div>
                </aside>
            </div>
        `;
    }

    renderNav() {
        const list = document.getElementById('tac-nav-list');
        list.innerHTML = '';

        // Grouping logic (simplified)
        const groups = {
            'PRIMARY': ['items', 'gear', 'shop'],
            'PERSONNEL': ['team', 'pets', 'skins', 'talents', 'skills'],
            'INTEL': ['quests', 'bestiary', 'missions', 'map', 'ai', 'alchemy', 'spirit', 'supernatural', 'drops', 'vehicles'],
            'SYSTEM': ['settings', 'controls']
        };

        Object.keys(groups).forEach(groupName => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'nav-group';
            
            groupDiv.innerHTML = `<div class="nav-group-title">${groupName}</div>`;
            
            groups[groupName].forEach(tabId => {
                const tab = this.tabs.find(t => t.id === tabId);
                if (tab) {
                    const item = document.createElement('div');
                    item.className = `nav-item ${tab.id === this.activeTabId ? 'active' : ''}`;
                    item.dataset.id = tab.id;
                    item.innerHTML = `<span>${tab.icon}</span> ${tab.label}`;
                    item.onclick = () => this.switchTab(tab.id);
                    groupDiv.appendChild(item);
                }
            });

            list.appendChild(groupDiv);
        });
    }

    setupEvents() {
        // Keyboard B
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'b') this.toggle();
        });
    }

    registerRenderer(type, renderer) {
        this.renderers[type] = renderer;
    }

    switchTab(id) {
        if (this.activeTabId === id) return;
        this.activeTabId = id;
        this.selectedItem = null; // Clear selection on tab switch
        this.renderNav(); // Update active class
        this.renderContent();
        this.renderInspector(); // Clear inspector
    }

    renderContent() {
        const container = document.getElementById('tac-view-container');
        container.innerHTML = '';
        
        const tab = this.tabs.find(t => t.id === this.activeTabId);
        document.getElementById('content-title').innerText = tab.label.toUpperCase();

        let renderer = this.renderers[tab.id] || this.renderers[tab.type];
        if (renderer) {
            renderer.render(container, tab);
        } else {
            container.innerHTML = "MODULE OFFLINE";
        }
    }

    // New: Inspector Logic
    selectItem(item) {
        this.selectedItem = item;
        this.renderInspector();
        
        // Update Grid Selection Visuals
        document.querySelectorAll('.tac-slot').forEach(slot => {
            slot.classList.toggle('selected', slot.dataset.itemId === item.instanceId?.toString() || slot.dataset.itemId === item.id);
        });
    }

    renderInspector() {
        const panel = document.getElementById('tac-inspector-panel');
        if (!this.selectedItem) {
            panel.innerHTML = `<div style="padding-top:100px; text-align:center; color:#555;">NO SIGNAL TARGET ACQUIRED</div>`;
            return;
        }

        const item = this.selectedItem;
        
        // Randomized stats for demo
        const power = Math.floor(Math.random() * 100);
        const dur = Math.floor(Math.random() * 100);

        panel.innerHTML = `
            <div class="inspect-preview q-${item.quality} border-${item.quality}">
                ${item.icon}
            </div>
            <div class="inspect-title">${item.name}</div>
            <div class="inspect-type">${item.type} // ${item.quality}</div>
            
            <div class="inspect-stats">
                <div class="stat-bar">
                    <div class="stat-label"><span>POWER OUTPUT</span> <span>${power}%</span></div>
                    <div class="stat-track"><div class="stat-fill" style="width:${power}%"></div></div>
                </div>
                <div class="stat-bar">
                    <div class="stat-label"><span>INTEGRITY</span> <span>${dur}%</span></div>
                    <div class="stat-track"><div class="stat-fill" style="width:${dur}%"></div></div>
                </div>
            </div>

            <div class="inspect-desc">
                ${item.desc || "No description data available in database."}
            </div>

            <div class="inspect-actions">
                <button class="action-btn">EQUIP</button>
                <button class="action-btn">DROP</button>
            </div>
        `;
        
        // Trigger reflow for animation
        setTimeout(() => {
            panel.querySelectorAll('.stat-fill').forEach(el => {
                // re-apply width if needed or CSS transition handles it from 0
            });
        }, 50);
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.renderContent();
    }
    
    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
    }
}
