// Generic Grid Renderer for Items
export class GridRenderer {
    constructor(inventorySystem) {
        this.inventory = inventorySystem;
        this.draggedItemIndex = null;
    }

    render(container, tabConfig) {
        // Create Grid Container
        const grid = document.createElement('div');
        grid.className = 'item-grid';

        // Get Items (fixed array with nulls)
        const items = this.inventory.getAll();
        
        // Render Slots based on inventory size
        items.forEach((item, index) => {
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            slot.dataset.index = index;

            if (item) {
                this.renderItemInSlot(slot, item);
                slot.draggable = true;
            } else {
                // Empty slot can still receive drops
            }

            // Drag Events
            this.setupDragEvents(slot, index);

            grid.appendChild(slot);
        });

        container.appendChild(grid);
    }

    renderItemInSlot(slot, item) {
        slot.innerHTML = `
            <div class="item-icon quality-${item.quality}">${item.icon}</div>
            ${item.qty > 1 ? `<span class="item-qty">${item.qty}</span>` : ''}
        `;
        
        // Tooltip Events
        slot.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        slot.addEventListener('mouseleave', () => this.hideTooltip());
        slot.addEventListener('mousemove', (e) => this.moveTooltip(e));
    }

    setupDragEvents(slot, index) {
        slot.addEventListener('dragstart', (e) => {
            const item = this.inventory.getAll()[index];
            if (!item) {
                e.preventDefault();
                return;
            }
            this.draggedItemIndex = index;
            slot.style.opacity = '0.5';
            e.dataTransfer.effectAllowed = 'move';
            // Optional: Set drag image
        });

        slot.addEventListener('dragend', () => {
            this.draggedItemIndex = null;
            slot.style.opacity = '1';
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            if (this.draggedItemIndex !== null) {
                const toIndex = parseInt(slot.dataset.index);
                const fromIndex = this.draggedItemIndex;

                console.log(`Moving item from ${fromIndex} to ${toIndex}`);
                
                const success = this.inventory.moveItem(fromIndex, toIndex);
                if (success) {
                    // Re-render the grid to show new state
                    const container = slot.closest('.bag-view-container');
                    if (container) {
                        container.innerHTML = '';
                        this.render(container, { type: 'grid' }); // Re-render self
                    }
                }
            }
        });
    }

    showTooltip(e, item) {
        if (!item) return;
        const tooltip = document.getElementById('bag-tooltip');
        tooltip.innerHTML = `
            <div class="tooltip-title quality-${item.quality}">${item.name}</div>
            <div class="tooltip-meta">${item.type} | Value: ${item.value}</div>
            <div class="tooltip-desc">${item.desc}</div>
        `;
        tooltip.style.display = 'block';
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const tooltip = document.getElementById('bag-tooltip');
        const x = e.clientX + 15;
        const y = e.clientY + 15;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('bag-tooltip');
        tooltip.style.display = 'none';
    }
}
