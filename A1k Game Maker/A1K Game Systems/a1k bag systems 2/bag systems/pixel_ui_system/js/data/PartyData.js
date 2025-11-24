export const PartyData = [
    {
        id: 'a1',
        name: 'A1',
        role: 'Protagonist',
        color: '#3498db',
        stats: { hp: 120, mp: 40, str: 15, def: 10 },
        desc: "The Blue Swordsman.",
        portraitChar: "🧔" 
    },
    {
        id: 'missy',
        name: 'Missy',
        role: 'Mage',
        color: '#9b59b6',
        stats: { hp: 80, mp: 150, str: 5, def: 8 },
        desc: "Purple Magic user.",
        portraitChar: "👩‍🎤"
    },
    {
        id: 'unique',
        name: 'Unique',
        role: 'Rogue',
        color: '#e67e22',
        stats: { hp: 100, mp: 60, str: 12, def: 9 },
        desc: "Orange Speedster.",
        portraitChar: "🥷"
    }
];

export const SkillData = {
    a1: [
        { id: 's1', name: 'Slash', level: 1, max: 5, desc: "Basic sword attack." },
        { id: 's2', name: 'Dash', level: 0, max: 3, desc: "Quick movement." },
        { id: 's3', name: 'Blue Aura', level: 0, max: 1, desc: "Ultimate power up." }
    ],
    missy: [
        { id: 'm1', name: 'Fireball', level: 1, max: 5, desc: "Shoots fire." },
        { id: 'm2', name: 'Heal', level: 0, max: 5, desc: "Restores HP." },
        { id: 'm3', name: 'Void', level: 0, max: 1, desc: "Creates a black hole." }
    ],
    unique: [
        { id: 'u1', name: 'Stab', level: 1, max: 5, desc: "Critical hit chance." },
        { id: 'u2', name: 'Stealth', level: 0, max: 3, desc: "Become invisible." }
    ]
};
