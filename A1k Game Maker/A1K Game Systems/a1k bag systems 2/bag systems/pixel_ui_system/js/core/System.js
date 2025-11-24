// The Core Pixel System Class
// Reused architecture but adapted for Pixel UI DOM structure
export class PixelSystem {
    constructor() {
        this.isOpen = false;
        this.activeTabId = 'items';
        this.tabs = [];
        this.renderers = {};
        
        this.toggle = this.toggle.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.switchTab = this.switchTab.bind(this);
    }

    init(config) {
        console.log("PixelSystem: Initializing...");
        
        // 1. Inject HTML Structure if not present
        this.container = document.getElementById('pixel-system-root');
        if (!this.container.innerHTML.trim()) {
            this.createDOMStructure();
        }

        // 2. Load Configuration
        this.tabs = config.tabs || [];
        this.defaultTab = config.defaultTab || 'items';
        this.activeTabId = this.defaultTab;

        // 3. Render Sidebar
        this.renderSidebar();

        // 4. Setup Event Listeners
        this.setupEvents();

        // 5. Initial Render
        // We defer this until open, or do it now invisible
        this.renderActiveTab();
    }

    createDOMStructure() {
        this.container.innerHTML = `
            <div class="sys-window">
                <header class="sys-header">
                    <div class="sys-title" id="sys-title-text">SYSTEM</div>
                    <button class="sys-close" id="sys-btn-close">X</button>
                </header>
                <div class="sys-body">
                    <nav class="sys-sidebar" id="sys-sidebar-list"></nav>
                    <main class="sys-content" id="sys-view-container"></main>
                </div>
            </div>
        `;
    }

    renderSidebar() {
        const sidebar = document.getElementById('sys-sidebar-list');
        sidebar.innerHTML = '';

        this.tabs.forEach(tab => {
            const btn = document.createElement('div');
            btn.className = `sys-tab ${tab.id === this.activeTabId ? 'active' : ''}`;
            btn.dataset.tabId = tab.id;
            btn.innerHTML = `
                <span>${tab.icon}</span>
                <span>${tab.label}</span>
            `;
            btn.onclick = () => this.switchTab(tab.id);
            sidebar.appendChild(btn);
        });
    }

    setupEvents() {
        document.getElementById('sys-btn-close').onclick = this.close;
        
        // Shortcut Tab
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault(); // Stop focus change
                this.toggle();
            }
        });
    }

    registerRenderer(type, rendererInstance) {
        this.renderers[type] = rendererInstance;
    }

    switchTab(tabId) {
        if (this.activeTabId === tabId) return;

        this.activeTabId = tabId;
        
        // Update Sidebar UI
        document.querySelectorAll('.sys-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tabId === tabId);
        });

        this.renderActiveTab();
    }

    renderActiveTab() {
        const tabConfig = this.tabs.find(t => t.id === this.activeTabId);
        if (!tabConfig) return;

        // Update Title
        document.getElementById('sys-title-text').innerText = `SYSTEM // ${tabConfig.label.toUpperCase()}`;

        // Clear View
        const container = document.getElementById('sys-view-container');
        container.innerHTML = '';

        // Find Renderer
        // We can have specific renderers (e.g. 'teamRenderer') or generic types ('grid')
        // We'll prioritize specific ID match first, then generic type
        let renderer = this.renderers[tabConfig.id]; // check for 'team' renderer
        if (!renderer) {
            renderer = this.renderers[tabConfig.type]; // check for 'grid' renderer
        }

        if (renderer) {
            renderer.render(container, tabConfig);
        } else {
            container.innerHTML = `<div style="padding:20px; color:#555;">NO MODULE FOUND FOR [${tabConfig.id}]</div>`;
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.renderActiveTab();
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
    }
}
