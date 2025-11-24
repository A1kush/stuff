// UI Logic for the Bag System
const BagUI = {
    currentFilter: 'all',
    selectedItem: null,

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
    },

    cacheDOM() {
        this.dom = {
            overlay: document.getElementById('bag-overlay'),
            openBtn: document.getElementById('open-bag-btn'),
            closeBtn: document.getElementById('close-bag-btn'),
            grid: document.getElementById('inventory-grid'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            gold: document.getElementById('gold-display'),
            slots: document.getElementById('slots-display'),
            preview: document.getElementById('selected-item-preview'),
            actions: document.getElementById('selected-item-actions'),
            equipSlots: document.querySelectorAll('.equip-slot'),
            sortBtn: document.getElementById('auto-sort-btn'),
            openAllBtn: document.getElementById('open-all-btn'),
            btnUse: document.getElementById('btn-use'),
            btnEquip: document.getElementById('btn-equip'),
            btnDrop: document.getElementById('btn-drop')
        };
    },

    bindEvents() {
        this.dom.openBtn.addEventListener('click', () => this.toggleBag(true));
        this.dom.closeBtn.addEventListener('click', () => this.toggleBag(false));
        
        // Keyboard shortcut (B)
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'b') {
                const isHidden = this.dom.overlay.classList.contains('hidden');
                this.toggleBag(isHidden);
            }
        });

        // Filters
        this.dom.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.dom.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.selectedItem = null; // Deselect on filter change
                this.renderGrid();
                this.renderDetails();
            });
        });

        // Actions
        this.dom.sortBtn.addEventListener('click', () => {
            BagData.sortInventory();
            this.renderGrid();
        });

        this.dom.openAllBtn.addEventListener('click', () => {
            const boxes = BagData.state.inventory.filter(i => i.openable);
            let count = 0;
            boxes.forEach(box => {
                // simple loop to open all boxes of this type or just one by one
                // For this lightweight version, let's open one instance of each openable item found
                // real implementation might need to handle stacks
                const res = BagData.useItem(box);
                if (res.success) count++;
            });
            if (count > 0) {
                alert(`Opened ${count} boxes!`);
                this.render();
            } else {
                alert("No boxes to open.");
            }
        });

        // Item Actions
        this.dom.btnUse.addEventListener('click', () => {
            if (this.selectedItem) {
                const res = BagData.useItem(this.selectedItem);
                if (res.success) {
                    this.selectedItem = null;
                    this.render();
                    // alert(res.message); // Optional feedback
                }
            }
        });

        this.dom.btnEquip.addEventListener('click', () => {
            if (this.selectedItem) {
                if (BagData.equipItem(this.selectedItem)) {
                    this.selectedItem = null;
                    this.render();
                }
            }
        });

        this.dom.btnDrop.addEventListener('click', () => {
            if (this.selectedItem) {
                if (confirm(`Drop ${this.selectedItem.name}?`)) {
                    BagData.removeItem(this.selectedItem);
                    this.selectedItem = null;
                    this.render();
                }
            }
        });

        // Unequip
        this.dom.equipSlots.forEach(slot => {
            slot.addEventListener('click', () => {
                const slotName = slot.dataset.slot;
                const item = BagData.state.equipped[slotName];
                if (item) {
                    BagData.unequipItem(slotName);
                    this.render();
                }
            });
        });
    },

    toggleBag(show) {
        if (show) {
            this.dom.overlay.classList.remove('hidden');
            this.render();
        } else {
            this.dom.overlay.classList.add('hidden');
        }
    },

    render() {
        this.renderGrid();
        this.renderEquipment();
        this.renderStats();
        this.renderDetails();
    },

    renderStats() {
        this.dom.gold.textContent = `🪙 ${BagData.state.gold} G`;
        this.dom.slots.textContent = `${BagData.state.inventory.length}/${BagData.state.maxSlots}`;
    },

    renderGrid() {
        this.dom.grid.innerHTML = '';
        const items = BagData.state.inventory.filter(item => {
            if (this.currentFilter === 'all') return true;
            return item.type === this.currentFilter;
        });

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'slot';
            el.dataset.rarity = item.rarity;
            if (this.selectedItem === item) el.classList.add('selected');
            
            el.innerHTML = `
                <div class="icon">${item.icon}</div>
                ${item.count && item.count > 1 ? `<span class="count">${item.count}</span>` : ''}
            `;

            el.addEventListener('click', () => {
                this.selectedItem = item;
                this.renderGrid(); // Re-render to show selection border
                this.renderDetails();
            });

            this.dom.grid.appendChild(el);
        });

        // Fill remaining slots visually if wanted, or just leave empty space
        // For lightweight, we just show items.
    },

    renderEquipment() {
        this.dom.equipSlots.forEach(slot => {
            const slotName = slot.dataset.slot;
            const item = BagData.state.equipped[slotName];
            
            slot.innerHTML = '';
            slot.classList.remove('filled');
            
            if (item) {
                slot.classList.add('filled');
                slot.innerHTML = `<span>${item.icon}</span>`;
                slot.title = `${slotName}: ${item.name}`;
            } else {
                slot.title = slotName; // Reset title
            }
        });
    },

    renderDetails() {
        const item = this.selectedItem;
        if (!item) {
            this.dom.preview.innerHTML = '<p>Select an item</p>';
            this.dom.preview.className = 'empty-selection';
            this.dom.actions.classList.add('hidden');
            return;
        }

        this.dom.preview.className = 'item-detail';
        this.dom.actions.classList.remove('hidden');

        // Build stats HTML
        let statsHtml = '';
        if (item.stats) {
            Object.entries(item.stats).forEach(([key, val]) => {
                statsHtml += `<div class="stat"><span>${key.toUpperCase()}</span><span>+${val}</span></div>`;
            });
        }

        this.dom.preview.innerHTML = `
            <div style="text-align:center; font-size: 3rem; margin-bottom: 10px;">${item.icon}</div>
            <h4 class="${item.rarity}">${item.name}</h4>
            <span class="type">${item.rarity.toUpperCase()} ${item.type.toUpperCase()}</span>
            <p class="desc">${item.desc}</p>
            <div class="stats">${statsHtml}</div>
        `;

        // Update Button States
        this.dom.btnUse.style.display = (item.usable || item.openable) ? 'block' : 'none';
        this.dom.btnEquip.style.display = (item.slot) ? 'block' : 'none';
    }
};
