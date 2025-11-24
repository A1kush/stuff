const fs = require('fs');
const path = require('path');

// Feature configurations for each version
const VERSION_CONFIGS = {
  'version-1-core-lite': {
    name: 'Core Lite',
    features: {
      items: true,
      gear: true,
      player: true, // skins tab
      settings: true,
      shop: true,
      // Disabled
      arcade: false,
      missions: false,
      bestiary: false,
      pets: false,
      vehicles: false,
      ai: false,
      talents: false,
      skills: false,
      spirit: false,
      supernatural: false,
      alchemy: false,
      drops: false,
      map: false,
      team: false,
      quests: false,
      controls: false
    }
  },
  'version-2-standard': {
    name: 'Standard Edition',
    features: {
      items: true,
      gear: true,
      player: true,
      settings: true,
      shop: true,
      team: true,
      pets: true,
      vehicles: true,
      skills: true,
      alchemy: true,
      quests: true,
      // Disabled
      arcade: false,
      missions: false,
      bestiary: false,
      ai: false,
      talents: false,
      spirit: false,
      supernatural: false,
      drops: false,
      map: false,
      controls: false
    }
  },
  'version-3-extended': {
    name: 'Extended Edition',
    features: {
      items: true,
      gear: true,
      player: true,
      settings: true,
      shop: true,
      team: true,
      pets: true,
      vehicles: true,
      skills: true,
      alchemy: true,
      quests: true,
      talents: true,
      skins: true,
      spirit: true,
      supernatural: true,
      drops: true,
      bestiary: true,
      map: true,
      // Disabled
      arcade: false,
      missions: false,
      ai: false,
      controls: false
    }
  },
  'version-4-complete': {
    name: 'Complete Edition',
    features: {
      items: true,
      gear: true,
      player: true,
      settings: true,
      shop: true,
      team: true,
      pets: true,
      vehicles: true,
      skills: true,
      alchemy: true,
      quests: true,
      talents: true,
      skins: true,
      spirit: true,
      supernatural: true,
      drops: true,
      bestiary: true,
      map: true,
      arcade: true,
      missions: true,
      ai: true,
      controls: true
    }
  },
  'version-5-ultimate': {
    name: 'Ultimate Edition',
    features: {
      items: true,
      gear: true,
      player: true,
      settings: true,
      shop: true,
      team: true,
      pets: true,
      vehicles: true,
      skills: true,
      alchemy: true,
      quests: true,
      talents: true,
      skins: true,
      spirit: true,
      supernatural: true,
      drops: true,
      bestiary: true,
      map: true,
      arcade: true,
      missions: true,
      ai: true,
      controls: true,
      devTools: true
    }
  }
};

// Tab ID mappings
const TAB_MAPPINGS = {
  items: 'items',
  gear: 'gear',
  player: 'skins',
  settings: 'settings',
  shop: 'shop',
  team: 'team',
  pets: 'pets',
  vehicles: 'vehicles',
  skills: 'skills',
  alchemy: 'alchemy',
  quests: 'quests',
  talents: 'talents',
  skins: 'skins',
  spirit: 'spirit',
  supernatural: 'supernatural',
  drops: 'drops',
  bestiary: 'bestiary',
  missions: 'missions',
  map: 'map',
  ai: 'ai',
  controls: 'controls'
};

function buildVersion(sourceHtml, config, versionId) {
  let html = sourceHtml;
  const features = config.features;
  
  console.log(`\nBuilding ${config.name}...`);
  
  // 1. Filter tabs list JSON
  html = filterTabsList(html, features);
  
  // 2. Filter manifest tabs
  html = filterManifestTabs(html, features);
  
  // 3. Remove arcade CSS if disabled
  if (!features.arcade) {
    html = removeArcadeCSS(html);
  }
  
  // 4. Add feature flag configuration
  html = addFeatureFlags(html, features, versionId);
  
  // 5. Add error handling wrapper
  html = addErrorHandling(html);
  
  // 6. Add dev tools if ultimate version
  if (features.devTools) {
    html = addDevTools(html);
  }
  
  // 7. Update title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>A1K Bag System – ${config.name}</title>`
  );
  
  return html;
}

function filterTabsList(html, features) {
  // Find the tabs list JSON object
  const tabsListRegex = /window\.__TABS_LIST_INLINE\s*=\s*(\{[\s\S]*?\});/;
  const match = html.match(tabsListRegex);
  
  if (!match) return html;
  
  try {
    const tabsListStr = match[1];
    const tabsList = eval(`(${tabsListStr})`);
    
    // Filter tabs based on features
    if (tabsList.tabs) {
      tabsList.tabs = tabsList.tabs.filter(tab => {
        const tabId = tab.id;
        // Map tab IDs to feature flags
        if (tabId === 'skins' || tabId === 'player') return features.player;
        if (tabId === 'drops') return features.drops;
        return features[tabId] !== false;
      });
    }
    
    if (tabsList.tabsArray) {
      tabsList.tabsArray = tabsList.tabsArray.filter(tabId => {
        if (tabId === 'skins' || tabId === 'player') return features.player;
        if (tabId === 'drops') return features.drops;
        return features[tabId] !== false;
      });
    }
    
    if (tabsList.manifestTabs) {
      tabsList.manifestTabs = tabsList.manifestTabs.filter(tab => {
        const tabId = tab.id;
        if (tabId === 'skins' || tabId === 'player') return features.player;
        if (tabId === 'drops') return features.drops;
        return features[tabId] !== false;
      });
    }
    
    if (tabsList.rendererFunctions) {
      tabsList.rendererFunctions = tabsList.rendererFunctions.filter(fn => {
        const tabId = fn.replace('render', '').replace('Tab', '').toLowerCase();
        if (tabId === 'skins' || tabId === 'player') return features.player;
        if (tabId === 'drops') return features.drops;
        if (tabId === 'drop systems') return features.drops;
        return features[tabId] !== false;
      });
    }
    
    if (tabsList.allTabIds) {
      tabsList.allTabIds = tabsList.allTabIds.filter(tabId => {
        if (tabId === 'skins' || tabId === 'player') return features.player;
        if (tabId === 'drops') return features.drops;
        return features[tabId] !== false;
      });
    }
    
    const newTabsListStr = JSON.stringify(tabsList, null, 2);
    return html.replace(tabsListRegex, `window.__TABS_LIST_INLINE = ${newTabsListStr};`);
  } catch (e) {
    console.warn('Error filtering tabs list:', e.message);
    return html;
  }
}

function filterManifestTabs(html, features) {
  // Filter bagManifest tabs
  const bagManifestRegex = /"bagManifest":\s*\{[\s\S]*?"tabs":\s*\[([\s\S]*?)\]/;
  const match = html.match(bagManifestRegex);
  
  if (match) {
    const tabsSection = match[1];
    const tabRegex = /\{\s*"id":\s*"([^"]+)",[\s\S]*?\}/g;
    let filteredTabs = [];
    let tabMatch;
    
    while ((tabMatch = tabRegex.exec(tabsSection)) !== null) {
      const tabId = tabMatch[1];
      if (tabId === 'player' || tabId === 'abilities') {
        if (features.player) filteredTabs.push(tabMatch[0]);
      } else if (features[tabId] !== false) {
        filteredTabs.push(tabMatch[0]);
      }
    }
    
    if (filteredTabs.length > 0) {
      const newTabsSection = filteredTabs.join(',\n      ');
      html = html.replace(bagManifestRegex, (m, tabs) => {
        return m.replace(tabs, newTabsSection);
      });
    }
  }
  
  return html;
}

function removeArcadeCSS(html) {
  // Remove arcade CSS section - more comprehensive removal
  // Find the arcade CSS block
  const arcadeStart = html.indexOf('/* ========== ARCADE');
  if (arcadeStart > 0) {
    // Find the end of the arcade section (next major section or end of style tag)
    const afterArcade = html.indexOf('/* ==========', arcadeStart + 1);
    const styleEnd = html.indexOf('</style>', arcadeStart);
    const endPos = afterArcade > 0 && afterArcade < styleEnd ? afterArcade : styleEnd;
    
    if (endPos > arcadeStart) {
      // Remove the arcade CSS block
      html = html.slice(0, arcadeStart) + html.slice(endPos);
    }
  }
  
  // Remove any remaining arcade-related CSS rules
  html = html.replace(/\.arcade-[^{]*\{[^}]*\}/g, '');
  html = html.replace(/\[data-game="[^"]*"\][^{]*\{[^}]*\}/g, '');
  
  return html;
}

function addFeatureFlags(html, features, versionId) {
  const enabledFeatures = Object.keys(features).filter(k => features[k]);
  const featureFlagsScript = `
<script>
// Version Configuration
const VERSION_CONFIG = {
  id: '${versionId}',
  features: ${JSON.stringify(features, null, 2)},
  initialized: false
};

// Feature flag helper
window.hasFeature = function(feature) {
  return VERSION_CONFIG.features[feature] === true;
};

// Override renderer functions for disabled features
(function() {
  const disabledTabs = Object.keys(VERSION_CONFIG.features).filter(k => !VERSION_CONFIG.features[k]);
  
  // Wrap BagSystem initialization to filter tabs
  const originalInit = window.BagSystem?.init;
  if (window.BagSystem && originalInit) {
    const bagInit = window.BagSystem.init.bind(window.BagSystem);
    window.BagSystem.init = function() {
      // Filter out disabled tabs before initialization
      if (this.state && this.state.tabs) {
        this.state.tabs = this.state.tabs.filter(tab => {
          const tabId = tab.id || tab;
          return !disabledTabs.includes(tabId) && 
                 !(tabId === 'skins' && !VERSION_CONFIG.features.player) &&
                 !(tabId === 'drops' && !VERSION_CONFIG.features.drops);
        });
      }
      return bagInit();
    };
  }
  
  // Prevent disabled tab renderers from being called
  disabledTabs.forEach(tabId => {
    const rendererName = 'render' + tabId.charAt(0).toUpperCase() + tabId.slice(1) + 'Tab';
    if (window.BagSystem && typeof window.BagSystem[rendererName] === 'function') {
      const original = window.BagSystem[rendererName];
      window.BagSystem[rendererName] = function() {
        console.warn('[Version] Tab "' + tabId + '" is disabled in this version');
        return '<div style="padding: 20px; text-align: center;"><p>This feature is not available in ${versionId}</p></div>';
      };
    }
  });
  
  // Disable arcade if not enabled
  if (!VERSION_CONFIG.features.arcade && window.BagSystem) {
    if (window.BagSystem.renderArcadeSubtab) {
      window.BagSystem.renderArcadeSubtab = function() {
        return '<div style="padding: 20px; text-align: center;"><p>Arcade games are not available in this version</p></div>';
      };
    }
  }
})();

// Initialize feature flags
VERSION_CONFIG.initialized = true;
console.log('[Version] ${versionId} loaded');
console.log('[Version] Enabled features:', ${JSON.stringify(enabledFeatures)});
</script>
`;
  
  // Insert after the fetch shim script
  const insertPoint = html.indexOf('</head>');
  if (insertPoint > 0) {
    html = html.slice(0, insertPoint) + featureFlagsScript + html.slice(insertPoint);
  }
  
  return html;
}

function addErrorHandling(html) {
  const errorHandlerScript = `
<script>
// Enhanced Error Handling
(function() {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  // Wrap renderer functions with error handling
  if (window.BagSystem) {
    const originalRenderTab = window.BagSystem.renderTab;
    if (originalRenderTab) {
      window.BagSystem.renderTab = function(tabId) {
        try {
          return originalRenderTab.call(this, tabId);
        } catch (error) {
          console.error('[BagSystem] Error rendering tab:', tabId, error);
          const container = document.getElementById('bag-content');
          if (container) {
            container.innerHTML = '<div style="padding: 20px; text-align: center; color: #ff3b3b;"><h3>Error Loading Tab</h3><p>' + error.message + '</p></div>';
          }
        }
      };
    }
  }
  
  // Global error handler
  window.addEventListener('error', function(e) {
    console.error('[Global Error]', e.error || e.message, e.filename, e.lineno);
  });
  
  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(e) {
    console.error('[Unhandled Promise Rejection]', e.reason);
  });
})();
</script>
`;
  
  const insertPoint = html.indexOf('</head>');
  if (insertPoint > 0) {
    html = html.slice(0, insertPoint) + errorHandlerScript + html.slice(insertPoint);
  }
  
  return html;
}

function addDevTools(html) {
  const devToolsScript = `
<script>
// Developer Tools for Ultimate Edition
(function() {
  const DevTools = {
    enabled: false,
    panel: null,
    
    init: function() {
      if (this.panel) return;
      
      // Create dev tools panel
      this.panel = document.createElement('div');
      this.panel.id = 'dev-tools-panel';
      this.panel.style.cssText = 'position: fixed; bottom: 10px; right: 10px; width: 300px; background: rgba(0,0,0,0.9); color: #fff; padding: 10px; border-radius: 5px; z-index: 10000; display: none; font-size: 11px;';
      this.panel.innerHTML = \`
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <strong>Dev Tools</strong>
          <button onclick="DevTools.toggle()" style="background: #ff3b3b; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer;">Close</button>
        </div>
        <div id="dev-stats"></div>
        <div style="margin-top: 10px;">
          <button onclick="DevTools.clearCache()" style="background: #4cd137; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; width: 100%;">Clear Cache</button>
        </div>
      \`;
      document.body.appendChild(this.panel);
      
      // Toggle with Ctrl+Shift+D
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          this.toggle();
        }
      });
      
      // Update stats
      this.updateStats();
      setInterval(() => this.updateStats(), 1000);
    },
    
    toggle: function() {
      this.enabled = !this.enabled;
      if (this.panel) {
        this.panel.style.display = this.enabled ? 'block' : 'none';
      }
    },
    
    updateStats: function() {
      if (!this.panel || !this.enabled) return;
      
      const stats = document.getElementById('dev-stats');
      if (!stats) return;
      
      const memory = performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB' : 'N/A';
      const fps = 'N/A'; // Would need FPS counter
      
      stats.innerHTML = \`
        <div>Memory: \${memory}</div>
        <div>FPS: \${fps}</div>
        <div>Bag Open: \${window.BagSystem?.isOpen ? 'Yes' : 'No'}</div>
        <div>Active Tab: \${window.BagSystem?.state?.activeTab || 'None'}</div>
      \`;
    },
    
    clearCache: function() {
      if (window.localStorage) {
        localStorage.clear();
        console.log('[DevTools] Cache cleared');
        alert('Cache cleared!');
      }
    }
  };
  
  window.DevTools = DevTools;
  
  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DevTools.init());
  } else {
    DevTools.init();
  }
})();
</script>
`;
  
  const insertPoint = html.indexOf('</body>');
  if (insertPoint > 0) {
    html = html.slice(0, insertPoint) + devToolsScript + html.slice(insertPoint);
  }
  
  return html;
}

// Main build function
function main() {
  const sourceFile = path.join(__dirname, 'index.html');
  const outputDir = __dirname;
  
  console.log('Reading source file...');
  const sourceHtml = fs.readFileSync(sourceFile, 'utf8');
  
  // Build each version
  for (const [versionId, config] of Object.entries(VERSION_CONFIGS)) {
    const outputFile = path.join(outputDir, `${versionId}.html`);
    const builtHtml = buildVersion(sourceHtml, config, versionId);
    
    fs.writeFileSync(outputFile, builtHtml, 'utf8');
    
    const sizeKB = (fs.statSync(outputFile).size / 1024).toFixed(2);
    const sizeMB = (fs.statSync(outputFile).size / 1024 / 1024).toFixed(2);
    console.log(`✓ Created ${versionId}.html (${sizeMB} MB / ${sizeKB} KB)`);
  }
  
  console.log('\n✓ All versions built successfully!');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { buildVersion, VERSION_CONFIGS };

