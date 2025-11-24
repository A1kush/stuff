export class Inventory {
    constructor() {
        this.size = 60; // Fixed slot count
        this.items = new Array(this.size).fill(null); // Initialize with nulls
        this.load();
    }

    // Add item to first empty slot
    addItem(item) {
        // Check for stackable (simplistic implementation)
        if (item.stackable) {
            const existingIndex = this.items.findIndex(i => i && i.id === item.id && i.qty < i.maxStack);
            if (existingIndex !== -1) {
                this.items[existingIndex].qty++;
                this.save();
                return true;
            }
        }

        // Find first empty slot
        const emptyIndex = this.items.findIndex(i => i === null);
        if (emptyIndex !== -1) {
            this.items[emptyIndex] = {
                instanceId: Date.now() + Math.random(),
                ...item,
                qty: item.qty || 1
            };
            this.save();
            return true;
        }
        return false; // Full
    }

    removeItem(instanceId) {
        const index = this.items.findIndex(i => i && i.instanceId === instanceId);
        if (index !== -1) {
            this.items[index] = null;
            this.save();
        }
    }

    moveItem(fromIndex, toIndex) {
        // Bounds check
        if (fromIndex < 0 || fromIndex >= this.size || toIndex < 0 || toIndex >= this.size) return false;
        
        // Don't do anything if same slot
        if (fromIndex === toIndex) return true;

        const itemFrom = this.items[fromIndex];
        const itemTo = this.items[toIndex];

        // Swap
        this.items[toIndex] = itemFrom;
        this.items[fromIndex] = itemTo;

        this.save();
        return true;
    }

    getAll() {
        return this.items;
    }

    save() {
        // We filter out nulls for storage to save space, but we need to store slot indices if we do that.
        // OR we just store the whole sparse array. For simplicity and robustness of slot position, let's store the whole array.
        localStorage.setItem('bag_system_inventory', JSON.stringify(this.items));
    }

    load() {
        const data = localStorage.getItem('bag_system_inventory');
        if (data) {
            try {
                const parsed = JSON.parse(data);
                // Ensure size consistency if we changed it in code
                if (Array.isArray(parsed)) {
                     // If loaded array is smaller/larger, fit it to current size
                     this.items = new Array(this.size).fill(null);
                     for(let i=0; i < Math.min(parsed.length, this.size); i++) {
                         this.items[i] = parsed[i];
                     }
                }
            } catch (e) {
                console.error("Failed to load inventory", e);
                this.items = new Array(this.size).fill(null);
            }
        }
    }

    clear() {
        this.items = new Array(this.size).fill(null);
        this.save();
    }
}

// Mock Item Generator
export const ItemGenerator = {
    generate() {
        const types = ['sword', 'potion', 'shield', 'ring', 'scroll'];
        const type = types[Math.floor(Math.random() * types.length)];
        const qualities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        
        const icons = {
            sword: '⚔️',
            potion: '🧪',
            shield: '🛡️',
            ring: '💍',
            scroll: '📜'
        };

        return {
            id: `item_${type}`, // simplified ID for stacking check
            name: `${quality.charAt(0).toUpperCase() + quality.slice(1)} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            type: type,
            icon: icons[type],
            quality: quality,
            desc: `A ${quality} quality ${type}. Very useful!`,
            stackable: type === 'potion' || type === 'scroll',
            maxStack: 10,
            value: Math.floor(Math.random() * 100) + 10
        };
    }
};
