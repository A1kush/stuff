// The Core Bag System Class
export class BagSystem {
    constructor() {
        this.isOpen = false;
        this.activeTabId = 'items';
        this.tabs = [];
        this.renderers = {};
        
        // Bind methods
        this.toggle = this.toggle.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.switchTab = this.switchTab.bind(this);
    }

    init(config) {
        console.log("BagSystem: Initializing...");
        
        // 1. Inject HTML Structure if not present
        this.container = document.getElementById('bag-system-root');
        if (!this.container) {
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

        // 5. Initial Render of Active Tab (Empty)
        this.renderActiveTab();

        console.log("BagSystem: Ready.");
    }

    createDOMStructure() {
        const root = document.createElement('div');
        root.id = 'bag-system-root';
        root.innerHTML = `
            <div class="bag-window">
                <nav class="bag-sidebar" id="bag-sidebar-list">
                    <!-- Tabs go here -->
                </nav>
                <main class="bag-content">
                    <header class="bag-header">
                        <h2 id="bag-title">Inventory</h2>
                        <button class="bag-close-btn" id="bag-btn-close">×</button>
                    </header>
                    <div id="bag-view-container" class="bag-view-container">
                        <!-- Content goes here -->
                    </div>
                </main>
            </div>
            <div id="bag-tooltip"></div>
        `;
        document.body.appendChild(root);
        this.container = root;
    }

    renderSidebar() {
        const sidebar = document.getElementById('bag-sidebar-list');
        sidebar.innerHTML = '';

        this.tabs.forEach(tab => {
            const btn = document.createElement('div');
            btn.className = `bag-tab-btn ${tab.id === this.activeTabId ? 'active' : ''}`;
            btn.dataset.tabId = tab.id;
            btn.innerHTML = `
                <span class="bag-tab-icon">${tab.icon}</span>
                <span class="bag-tab-label">${tab.label}</span>
            `;
            btn.onclick = () => this.switchTab(tab.id);
            sidebar.appendChild(btn);
        });
    }

    setupEvents() {
        // Close Button
        document.getElementById('bag-btn-close').onclick = this.close;
        
        // Keyboard Shortcut (B)
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'b' && !e.repeat) {
                this.toggle();
            }
        });

        // Click outside to close (Optional)
        this.container.addEventListener('mousedown', (e) => {
            if (e.target === this.container) {
                this.close();
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
        document.querySelectorAll('.bag-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tabId === tabId);
        });

        this.renderActiveTab();
    }

    renderActiveTab() {
        const tabConfig = this.tabs.find(t => t.id === this.activeTabId);
        if (!tabConfig) return;

        // Update Title
        document.getElementById('bag-title').innerText = tabConfig.label;

        // Clear View
        const container = document.getElementById('bag-view-container');
        container.innerHTML = '';

        // Find Renderer
        const renderer = this.renderers[tabConfig.type];
        if (renderer) {
            renderer.render(container, tabConfig);
        } else {
            container.innerHTML = `<div style="padding:20px; color:#666;">Renderer not found for type: ${tabConfig.type}</div>`;
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        this.renderActiveTab(); // Re-render in case data changed
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
    }
}
