/**
 * ShopUI.js
 * Renders shop with categories, items, and currency exchange
 */

class ShopUI {
  constructor(shopController, gameState) {
    this.controller = shopController;
    this.gameState = gameState;
    this.container = null;
    this.currentCategory = 'all';
  }

  /**
   * Render shop
   */
  render(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    const state = this.gameState.get();
    const categories = this.controller.getCategories();
    const items = this.controller.getItems(this.currentCategory);

    this.container.innerHTML = `
      <div class="shop-system">
        <div class="shop-header">
          <h2>Shop</h2>
          <div class="currency-display">
            <div class="currency-item">
              <span class="currency-icon">💰</span>
              <span class="currency-value">${state.currencies.gold}</span>
              <span class="currency-label">Gold</span>
            </div>
            <div class="currency-item">
              <span class="currency-icon">✨</span>
              <span class="currency-value">${state.currencies.essence}</span>
              <span class="currency-label">Essence</span>
            </div>
            <div class="currency-item">
              <span class="currency-icon">🎫</span>
              <span class="currency-value">${state.currencies.tokens}</span>
              <span class="currency-label">Tokens</span>
            </div>
          </div>
        </div>

        <div class="shop-exchange">
          <h3>Currency Exchange</h3>
          <div class="exchange-grid">
            <button class="btn-exchange" data-exchange="gold_to_essence">
              500 Gold → 5 Essence
            </button>
            <button class="btn-exchange" data-exchange="gold_to_tokens">
              2000 Gold → 2 Tokens
            </button>
            <button class="btn-exchange" data-exchange="essence_to_gold">
              10 Essence → 800 Gold
            </button>
            <button class="btn-exchange" data-exchange="tokens_to_gold">
              2 Tokens → 1800 Gold
            </button>
          </div>
        </div>

        <div class="shop-packs">
          <h3>Bundle Packs</h3>
          <div class="packs-grid">
            ${this.renderPacks()}
          </div>
        </div>

        <div class="shop-categories">
          ${categories.map(cat => `
            <button 
              class="category-btn ${cat.id === this.currentCategory ? 'active' : ''}" 
              data-category="${cat.id}"
            >
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <div class="shop-items">
          ${items.map(item => this.renderItem(item)).join('')}
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  /**
   * Render bundle packs
   */
  renderPacks() {
    const prices = this.controller.getPackPrices();
    
    return `
      <div class="pack-card">
        <h4>Essence Pack</h4>
        <p>+50 Essence</p>
        <div class="pack-price">Cost: ${prices.essence.current} Gold</div>
        <button class="btn-pack" data-pack="essence">Buy Pack</button>
        <small>Purchased: ${prices.essence.purchased}</small>
      </div>
      <div class="pack-card">
        <h4>Token Pack</h4>
        <p>+5 Tokens</p>
        <div class="pack-price">Cost: ${prices.tokens.current} Gold</div>
        <button class="btn-pack" data-pack="tokens">Buy Pack</button>
        <small>Purchased: ${prices.tokens.purchased}</small>
      </div>
    `;
  }

  /**
   * Render shop item
   */
  renderItem(item) {
    const state = this.gameState.get();
    const canAfford = state.currencies.gold >= item.cost;

    return `
      <div class="shop-item ${!canAfford ? 'unaffordable' : ''}">
        <div class="item-header">
          <h4 class="item-name">${item.name}</h4>
          ${item.rank ? `<span class="item-rank rank-${item.rank}">${item.rank}</span>` : ''}
        </div>
        <p class="item-description">${item.description}</p>
        <div class="item-stats">
          ${item.atk ? `<span class="stat">⚔️ ${item.atk} ATK</span>` : ''}
          ${item.def ? `<span class="stat">🛡️ ${item.def} DEF</span>` : ''}
          ${item.hp ? `<span class="stat">❤️ ${item.hp} HP</span>` : ''}
          ${item.mp ? `<span class="stat">💙 ${item.mp} MP</span>` : ''}
        </div>
        <div class="item-footer">
          <span class="item-cost">💰 ${item.cost} Gold</span>
          <button 
            class="btn-buy" 
            data-item-id="${item.id}"
            ${!canAfford ? 'disabled' : ''}
          >
            ${canAfford ? 'Buy' : 'Too Expensive'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Category buttons
    const categoryButtons = this.container.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.currentCategory = e.target.dataset.category;
        this.render(this.container.id);
      });
    });

    // Buy buttons
    const buyButtons = this.container.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = e.target.dataset.itemId;
        this.purchaseItem(itemId);
      });
    });

    // Exchange buttons
    const exchangeButtons = this.container.querySelectorAll('.btn-exchange');
    exchangeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const exchange = e.target.dataset.exchange;
        this.performExchange(exchange);
      });
    });

    // Pack buttons
    const packButtons = this.container.querySelectorAll('.btn-pack');
    packButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const packType = e.target.dataset.pack;
        this.buyPack(packType);
      });
    });
  }

  /**
   * Purchase item
   */
  purchaseItem(itemId) {
    const result = this.controller.purchase(itemId);
    
    if (result.success) {
      this.showNotification(`Purchased ${result.item.name}!`, 'success');
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Perform currency exchange
   */
  performExchange(exchangeType) {
    const [from, , to] = exchangeType.split('_');
    const amount = 1;
    
    const result = this.controller.exchange(from, to, amount);
    
    if (result.success) {
      this.showNotification(`Exchanged ${result.cost} ${result.fromCurrency} for ${result.gain} ${result.toCurrency}!`, 'success');
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Buy pack
   */
  buyPack(packType) {
    const result = this.controller.buyPack(packType);
    
    if (result.success) {
      this.showNotification(`Purchased ${result.pack}! Received ${result.reward.amount} ${result.reward.currency}`, 'success');
      this.render(this.container.id);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Update display
   */
  update() {
    if (this.container) {
      this.render(this.container.id);
    }
  }
}

export function createShopUI(shopController, gameState) {
  return new ShopUI(shopController, gameState);
}

export default {
  createShopUI
};

