export class TacticalGridRenderer {
    constructor(inventory) {
        this.inventory = inventory;
    }

    render(container, tabConfig) {
        const grid = document.createElement('div');
        grid.className = 'tac-grid';

        const items = this.inventory.getAll();
        
        items.forEach((item, index) => {
            const slot = document.createElement('div');
            slot.className = 'tac-slot';
            slot.dataset.index = index;

            if (item) {
                slot.dataset.itemId = item.instanceId;
                slot.classList.add(`border-${item.quality}`);
                slot.innerHTML = `
                    <div class="q-${item.quality}">${item.icon}</div>
                    ${item.qty > 1 ? `<span class="qty">x${item.qty}</span>` : ''}
                `;
                
                slot.onclick = () => window.TacticalSystem.selectItem(item);
                slot.draggable = true;
                
                // Drag Events (Simplified)
                slot.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', index);
                });
            }

            slot.addEventListener('dragover', (e) => e.preventDefault());
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                this.inventory.moveItem(fromIndex, toIndex);
                // Re-render
                window.TacticalSystem.renderContent();
            });

            grid.appendChild(slot);
        });

        container.appendChild(grid);
    }
}

export class TacticalGenericRenderer {
    render(container, tabConfig) {
        container.innerHTML = `
            <div style="padding:40px; text-align:center; color: #555;">
                <h1>${tabConfig.icon}</h1>
                <p>DATA STREAM LOADING...</p>
            </div>
        `;
    }
}
