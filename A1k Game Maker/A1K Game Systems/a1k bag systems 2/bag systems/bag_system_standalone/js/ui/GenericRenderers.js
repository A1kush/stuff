export class ListRenderer {
    render(container, tabConfig) {
        container.innerHTML = `<div style="padding: 10px; color: #aaa;">List of ${tabConfig.label}...</div>`;
        
        // Mock data generation
        const count = 5 + Math.floor(Math.random() * 5);
        for(let i=0; i<count; i++) {
            const el = document.createElement('div');
            el.className = 'list-item';
            el.innerHTML = `
                <div>
                    <h3>${tabConfig.label} Entry #${i+1}</h3>
                    <p>Description for this entry goes here.</p>
                </div>
                <div>➡️</div>
            `;
            container.appendChild(el);
        }
    }
}

export class InfoRenderer {
    render(container, tabConfig) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">${tabConfig.icon}</div>
                <h2>${tabConfig.label}</h2>
                <p>This is the info panel for ${tabConfig.label}.</p>
                <div style="margin-top: 20px; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px;">
                    <p>Stat 1: <strong>100</strong></p>
                    <p>Stat 2: <strong>50%</strong></p>
                    <p>Status: <strong>Active</strong></p>
                </div>
            </div>
        `;
    }
}
