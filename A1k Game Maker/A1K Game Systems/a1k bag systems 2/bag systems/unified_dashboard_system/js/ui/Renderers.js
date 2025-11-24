export const Renderers = {
    grid: (container, tab, inventory) => {
        const grid = document.createElement('div');
        grid.className = 'item-grid';
        
        inventory.getAll().forEach(item => {
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            if (item) {
                slot.innerHTML = `
                    <div>${item.icon}</div>
                    ${item.qty > 1 ? `<div class="qty">${item.qty}</div>` : ''}
                `;
            }
            grid.appendChild(slot);
        });
        
        container.appendChild(grid);
    },

    team: (container) => {
        const list = document.createElement('div');
        list.className = 'team-list';
        
        const members = [
            { name: "A1", role: "Warrior", icon: "🧔", color: "#3b82f6" },
            { name: "Missy", role: "Mage", icon: "👩‍🎤", color: "#a855f7" },
            { name: "Unique", role: "Rogue", icon: "🥷", color: "#f97316" }
        ];

        members.forEach(m => {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.style.borderColor = m.color;
            card.innerHTML = `
                <div class="team-avatar" style="border-color:${m.color}">${m.icon}</div>
                <div class="team-name">${m.name}</div>
                <div class="team-role" style="color:${m.color}">${m.role}</div>
                <div style="width:100%; margin-top:auto;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:12px; color:#888;">
                        <span>HP</span> <span>100/100</span>
                    </div>
                    <div style="height:4px; background:#333; width:100%;"><div style="width:80%; height:100%; background:${m.color};"></div></div>
                </div>
            `;
            list.appendChild(card);
        });
        
        container.appendChild(list);
    },

    list: (container, tab) => {
        container.innerHTML = `<h3>${tab.label} List</h3>`;
        for(let i=0; i<5; i++) {
            container.innerHTML += `
                <div style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between;">
                    <span>Entry #${i+1}</span>
                    <span style="color:#666;">Details...</span>
                </div>
            `;
        }
    },

    info: (container, tab) => {
        container.innerHTML = `
            <div class="info-panel">
                <div style="font-size:60px; margin-bottom:20px;">${tab.type === 'tree' ? '🌳' : 'ℹ️'}</div>
                <h2>${tab.label}</h2>
                <p>This module renders generic info for ${tab.label}.</p>
            </div>
        `;
    }
};
