/* js/SaveSystem.js */

class SaveSystem {
  constructor() {
    this.SAVE_KEY = 'A1K_CITY_SAVE_V1';
    this.autoSaveInterval = null;
  }

  startAutoSave(intervalMs = 60000) {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
    // Autosave keeps mobile players from losing progress during accidental tab closes
    this.autoSaveInterval = setInterval(() => {
      this.save();
      console.log('Auto-saved game.');
    }, intervalMs);
  }

  save() {
    if (!window.gameState) return;

    // Persist only portable primitives so future patches can migrate format safely
    const data = {
      timestamp: Date.now(),
      player: {
        x: window.gameState.player?.x || 0,
        y: window.gameState.player?.y || 0,
        hp: window.gameState.player?.hp || 100,
        stats: window.gameState.player?.stats || {},
      },
      inventory: window.BagSystem ? window.BagSystem.serialize() : {},
      quests: window.QuestSystem ? window.QuestSystem.serialize() : {},
      flags: window.gameState.flags || {},
    };

    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
      this.showSaveIcon();
      return true;
    } catch (e) {
      console.error('Save failed (quota exceeded?):', e);
      return false;
    }
  }

  load() {
    const json = localStorage.getItem(this.SAVE_KEY);
    if (!json) return false;

    try {
      const data = JSON.parse(json);

      if (window.gameState && window.gameState.player) {
        window.gameState.player.x = data.player.x;
        window.gameState.player.y = data.player.y;
        window.gameState.player.hp = data.player.hp;
      }

      if (window.BagSystem && data.inventory) window.BagSystem.deserialize(data.inventory);
      if (window.QuestSystem && data.quests) window.QuestSystem.deserialize(data.quests);

      console.log('Game Loaded successfully.');
      return true;
    } catch (e) {
      console.error('Load failed (corrupt data?):', e);
      return false;
    }
  }

  showSaveIcon() {
    let el = document.getElementById('save-icon');
    if (!el) {
      el = document.createElement('div');
      el.id = 'save-icon';
      el.style.cssText = 'position:fixed; bottom:10px; right:10px; font-size:24px; opacity:0; transition: opacity 0.5s;';
      el.innerHTML = '💾';
      document.body.appendChild(el);
    }
    el.style.opacity = 1;
    setTimeout(() => (el.style.opacity = 0), 2000);
  }
}

window.SaveGame = new SaveSystem();
