// Reuse Inventory logic
import { Inventory, ItemGenerator } from '../data/Inventory.js';

export class DashboardSystem {
    constructor() {
        this.isOpen = false;
        this.activeGroup = 'INVENTORY';
        this.activeTabId = 'items';
        this.inventory = new Inventory();
        
        // Seed inventory if empty
        if (this.inventory.getAll().every(i => !i)) {
             for(let i=0; i<10; i++) this.inventory.addItem(ItemGenerator.generate());
        }

        this.renderers = {};
    }

    init(groups, tabsConfig) {
        this.groups = groups;
        this.tabsConfig = tabsConfig;
        this.container = document.getElementById('dashboard-root');
        
        this.createDOM();
        this.setupEvents();
    }

    createDOM() {
        this.container.innerHTML = `
            <div class="dashboard-window">
                <nav class="dash-sidebar" id="dash-sidebar"></nav>
                <div class="dash-main">
                    <header class="dash-header">
                        <nav id="dash-subnav" style="display:flex; gap:30px;"></nav>
                        <div class="close-btn" id="btn-close">✕</div>
                    </header>
                    <main class="dash-content" id="dash-content"></main>
                </div>
            </div>
        `;
        
        this.renderSidebar();
    }

    renderSidebar() {
        const sidebar = document.getElementById('dash-sidebar');
        sidebar.innerHTML = '';
        
        Object.keys(this.groups).forEach(key => {
            const group = this.groups[key];
            const btn = document.createElement('div');
            btn.className = `cat-btn ${key === this.activeGroup ? 'active' : ''}`;
            btn.innerHTML = group.icon;
            btn.title = key;
            btn.onclick = () => this.switchGroup(key);
            sidebar.appendChild(btn);
        });
    }

    renderSubNav() {
        const subnav = document.getElementById('dash-subnav');
        subnav.innerHTML = '';
        
        const group = this.groups[this.activeGroup];
        group.tabs.forEach(tabId => {
            const tabConfig = this.tabsConfig.find(t => t.id === tabId);
            if (!tabConfig) return;
            
            const btn = document.createElement('div');
            btn.className = `sub-tab-btn ${tabId === this.activeTabId ? 'active' : ''}`;
            btn.innerText = tabConfig.label;
            btn.onclick = () => this.switchTab(tabId);
            subnav.appendChild(btn);
        });
    }

    switchGroup(groupKey) {
        this.activeGroup = groupKey;
        // Default to first tab in group
        this.activeTabId = this.groups[groupKey].tabs[0];
        
        this.renderSidebar(); // Update active class
        this.renderSubNav();
        this.renderContent();
    }

    switchTab(tabId) {
        this.activeTabId = tabId;
        this.renderSubNav(); // Update active underline
        this.renderContent();
    }

    renderContent() {
        const container = document.getElementById('dash-content');
        container.innerHTML = '';
        
        const tabConfig = this.tabsConfig.find(t => t.id === this.activeTabId);
        
        // Find renderer
        const renderFn = this.renderers[tabConfig.type] || this.renderers['info'];
        if (renderFn) {
            renderFn(container, tabConfig, this.inventory);
        }
    }

    registerRenderer(type, fn) {
        this.renderers[type] = fn;
    }

    setupEvents() {
        document.getElementById('btn-close').onclick = () => this.toggle();
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.container.classList.add('open');
            this.switchGroup(this.activeGroup); // Refresh
        } else {
            this.container.classList.remove('open');
        }
    }
}
