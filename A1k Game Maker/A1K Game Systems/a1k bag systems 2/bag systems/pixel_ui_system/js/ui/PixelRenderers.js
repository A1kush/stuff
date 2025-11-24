import { PartyData, SkillData } from '../data/PartyData.js';

export class TeamRenderer {
    constructor() {
        this.activeLeader = 'a1';
    }

    render(container, tabConfig) {
        const wrap = document.createElement('div');
        wrap.className = 'team-container';

        PartyData.forEach(char => {
            const card = document.createElement('div');
            card.className = `char-card ${this.activeLeader === char.id ? 'leader' : ''}`;
            
            card.innerHTML = `
                <div class="char-portrait" style="color:${char.color}">${char.portraitChar}</div>
                <div class="char-name">${char.name}</div>
                <div class="char-stats">
                    <div class="stat-row"><span>HP</span> <span>${char.stats.hp}</span></div>
                    <div class="stat-row"><span>MP</span> <span>${char.stats.mp}</span></div>
                    <div class="stat-row"><span>STR</span> <span>${char.stats.str}</span></div>
                </div>
                ${this.activeLeader !== char.id ? `<button class="btn-make-leader" data-id="${char.id}">MAKE LEADER</button>` : `<div style="text-align:center; color:#0f0; margin-top:10px;">[ LEADER ]</div>`}
            `;

            // Event Delegation or direct bind
            const btn = card.querySelector('.btn-make-leader');
            if (btn) {
                btn.onclick = () => {
                    this.activeLeader = char.id;
                    this.render(container, tabConfig); // Re-render
                };
            }

            wrap.appendChild(card);
        });

        container.appendChild(wrap);
    }
}

export class SkillsRenderer {
    render(container, tabConfig) {
        // Just show A1 skills for demo simplicity, or tabs for each char?
        // Let's show all for now grouped.
        
        const list = document.createElement('div');
        list.className = 'skill-list';

        // Flatten data for demo
        Object.keys(SkillData).forEach(charKey => {
            const charName = PartyData.find(p => p.id === charKey).name;
            
            const header = document.createElement('h3');
            header.style.color = PartyData.find(p => p.id === charKey).color;
            header.style.borderBottom = '1px solid #333';
            header.style.marginTop = '20px';
            header.innerText = `${charName} SKILLS`;
            list.appendChild(header);

            SkillData[charKey].forEach(skill => {
                const row = document.createElement('div');
                row.className = 'skill-row';
                row.innerHTML = `
                    <div class="skill-info">
                        <h4>${skill.name}</h4>
                        <div class="skill-desc">${skill.desc}</div>
                    </div>
                    <div class="skill-level">${skill.level}/${skill.max}</div>
                `;
                list.appendChild(row);
            });
        });

        container.appendChild(list);
    }
}

export class PixelGridRenderer {
    render(container, tabConfig) {
        const grid = document.createElement('div');
        grid.className = 'pixel-grid';
        
        // Mock 20 slots
        for(let i=0; i<30; i++) {
            const slot = document.createElement('div');
            slot.className = 'pixel-slot';
            // Randomly populate some
            if (Math.random() > 0.7) {
                slot.innerHTML = `⚔️ <span class="qty">${Math.ceil(Math.random()*5)}</span>`;
            }
            grid.appendChild(slot);
        }
        container.appendChild(grid);
    }
}

export class GenericPixelRenderer {
    render(container, tabConfig) {
        container.innerHTML = `
            <div style="text-align:center; padding: 40px;">
                <h1 style="font-size: 60px; color: #333;">${tabConfig.icon}</h1>
                <h2 style="color: var(--pix-neon-pink);">${tabConfig.label}</h2>
                <p>NO DATA SIGNAL...</p>
            </div>
        `;
    }
}
