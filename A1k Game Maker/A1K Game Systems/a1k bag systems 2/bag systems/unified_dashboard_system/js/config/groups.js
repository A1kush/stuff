export const GROUPS = {
    'INVENTORY': {
        icon: '🎒',
        tabs: ['items', 'gear', 'shop']
    },
    'PARTY': {
        icon: '👥',
        tabs: ['team', 'pets', 'skins', 'vehicles', 'ai']
    },
    'POWERS': {
        icon: '⚡',
        tabs: ['talents', 'skills', 'spirit', 'supernatural', 'alchemy']
    },
    'WORLD': {
        icon: '🌍',
        tabs: ['quests', 'missions', 'bestiary', 'drops', 'map']
    },
    'SYSTEM': {
        icon: '⚙️',
        tabs: ['settings', 'controls']
    }
};

export const TABS_CONFIG = [
    { id: "items", label: "Items", type: "grid" },
    { id: "gear", label: "Gear", type: "grid" },
    { id: "shop", label: "Shop", type: "grid" },
    
    { id: "team", label: "Team", type: "team" },
    { id: "pets", label: "Pets", type: "grid" },
    { id: "skins", label: "Skins", type: "grid" },
    { id: "vehicles", label: "Vehicles", type: "list" },
    { id: "ai", label: "AI", type: "info" },

    { id: "talents", label: "Talents", type: "tree" },
    { id: "skills", label: "Skills", type: "list" },
    { id: "spirit", label: "Spirit", type: "info" },
    { id: "supernatural", label: "Supernatural", type: "info" },
    { id: "alchemy", label: "Alchemy", type: "list" },

    { id: "quests", label: "Quests", type: "list" },
    { id: "missions", label: "Missions", type: "list" },
    { id: "bestiary", label: "Bestiary", type: "list" },
    { id: "drops", label: "Drops", type: "info" },
    { id: "map", label: "Map", type: "info" },

    { id: "settings", label: "Settings", type: "info" },
    { id: "controls", label: "Controls", type: "info" }
];
