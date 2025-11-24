// Mock Data for the bag system
const MOCK_ITEMS = [
    { id: 'w1', name: 'Plasma Blade', type: 'weapon', slot: 'mainhand', rarity: 'rare', icon: '🗡️', desc: 'A blade formed of pure plasma.', stats: { atk: 45 } },
    { id: 'w2', name: 'Rusty Pipe', type: 'weapon', slot: 'mainhand', rarity: 'common', icon: '🏏', desc: 'Better than nothing.', stats: { atk: 5 } },
    { id: 'a1', name: 'Nano Vest', type: 'armor', slot: 'chest', rarity: 'rare', icon: '🦺', desc: 'Lightweight protection.', stats: { def: 20 } },
    { id: 'p1', name: 'Health Potion', type: 'potion', rarity: 'common', icon: '🧪', desc: 'Restores 50 HP.', count: 5, usable: true },
    { id: 'm1', name: 'Scrap Metal', type: 'material', rarity: 'common', icon: '🔩', desc: 'Used for crafting.', count: 12 },
    { id: 'a2', name: 'Cyber Boots', type: 'armor', slot: 'legs', rarity: 'epic', icon: '👢', desc: 'Increases movement speed.', stats: { def: 15, spd: 10 } },
    { id: 'b1', name: 'Mystery Box', type: 'consumable', rarity: 'rare', icon: '🎁', desc: 'Contains random loot.', count: 2, openable: true },
    { id: 'w3', name: 'Laser Pistol', type: 'weapon', slot: 'offhand', rarity: 'rare', icon: '🔫', desc: 'Pew pew.', stats: { atk: 30 } },
    { id: 't1', name: 'Lucky Coin', type: 'armor', slot: 'trinket', rarity: 'epic', icon: '🪙', desc: 'Increases luck.', stats: { luk: 5 } }
];

const BOX_LOOT_TABLE = [
    { id: 'p2', name: 'Mana Potion', type: 'potion', rarity: 'common', icon: '⚗️', desc: 'Restores 50 MP.', count: 1, usable: true },
    { id: 'm2', name: 'Circuit Board', type: 'material', rarity: 'rare', icon: '📟', desc: 'Advanced component.', count: 1 },
    { id: 'g1', name: 'Gold Bag', type: 'consumable', rarity: 'common', icon: '💰', desc: 'Contains 100 Gold.', useValue: 100, gold: true }
];

// Initial State
const INITIAL_STATE = {
    inventory: [...MOCK_ITEMS],
    gold: 1500,
    maxSlots: 30,
    equipped: {
        head: null,
        chest: null,
        legs: null,
        mainhand: null,
        offhand: null,
        trinket: null
    }
};

window.BagData = {
    state: JSON.parse(JSON.stringify(INITIAL_STATE)), // Deep copy

    addItem(item) {
        if (this.state.inventory.length >= this.state.maxSlots) return false;
        
        // Stack check
        if (item.count) {
            const existing = this.state.inventory.find(i => i.name === item.name);
            if (existing) {
                existing.count = (existing.count || 1) + (item.count || 1);
                return true;
            }
        }
        
        this.state.inventory.push(item);
        return true;
    },

    removeItem(item) {
        const idx = this.state.inventory.indexOf(item);
        if (idx > -1) {
            this.state.inventory.splice(idx, 1);
            return true;
        }
        return false;
    },

    equipItem(item) {
        if (!item.slot || !this.state.equipped.hasOwnProperty(item.slot)) return false;

        const currentEquip = this.state.equipped[item.slot];
        
        // Swap
        this.state.equipped[item.slot] = item;
        this.removeItem(item);

        if (currentEquip) {
            this.addItem(currentEquip);
        }
        return true;
    },

    unequipItem(slot) {
        const item = this.state.equipped[slot];
        if (item) {
            if (this.addItem(item)) {
                this.state.equipped[slot] = null;
                return true;
            }
        }
        return false;
    },

    useItem(item) {
        if (item.gold) {
            this.state.gold += item.useValue || 0;
            this.removeItem(item);
            return { success: true, message: `Gained ${item.useValue} Gold!` };
        }
        
        if (item.openable) {
            this.removeItem(item);
            const loot = BOX_LOOT_TABLE[Math.floor(Math.random() * BOX_LOOT_TABLE.length)];
            // Clone loot to avoid reference issues
            const newLoot = JSON.parse(JSON.stringify(loot));
            this.addItem(newLoot);
            return { success: true, message: `Opened box: Found ${newLoot.name}!` };
        }

        if (item.usable) {
             if (item.count > 1) {
                item.count--;
            } else {
                this.removeItem(item);
            }
            return { success: true, message: `Used ${item.name}.` };
        }

        return { success: false, message: "Item cannot be used." };
    },

    sortInventory() {
        this.state.inventory.sort((a, b) => {
            if (a.type !== b.type) return a.type.localeCompare(b.type);
            return b.rarity.localeCompare(a.rarity); // Rough rarity sort
        });
    }
};
