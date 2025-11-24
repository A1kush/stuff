const fs = require("fs");
const path = require("path");

function bundleJS() {
  const distDir = path.join(__dirname, "dist");
  const outputFile = path.join(__dirname, "standalone.js");

  // Files to bundle in order (dependencies first)
  const files = [
    "ranks/RankConfig.js",
    "ranks/RankSystem.js",
    "entities/Entity.js",
    "entities/NPC.js",
    "entities/Enemy.js",
    "core/EntityManager.js",
    "core/GameIntegration.js",
    "index.js",
  ];

  let bundle = "// NPC & Enemy Rank System - Standalone Bundle\n";
  bundle += "// Generated: " + new Date().toISOString() + "\n\n";

  // Add a simple module system
  bundle += `
// Simple module system for offline use
const modules = {};
const require = (id) => modules[id];
const define = (id, deps, factory) => {
  modules[id] = factory(...deps.map(dep => modules[dep]));
};

// Define modules
`;

  files.forEach((file, index) => {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, "utf8");

      // Remove imports and exports, convert to our module system
      content = content
        .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, "")
        .replace(/export\s+(class|const|function)\s+/g, "$1 ")
        .replace(/export\s+{\s*([^}]+)\s*};?\s*$/g, "")
        .replace(/export\s+default\s+/g, "");

      const moduleId = file.replace(".js", "").replace(/\//g, "_");
      bundle += `\n// Module: ${file}\ndefine('${moduleId}', [], () => {\n${content}\n  return { Entity, NPC, Enemy, RANK_TIERS, CATEGORY_CONFIG, createRank, getRankTierConfig, getCategoryConfig, RankSystem, rankSystem, EntityManager, entityManager, GameIntegration, createGame, VERSION };\n});\n`;
    }
  });

  // Add the main exports
  bundle += `
// Main exports
const { Entity, NPC, Enemy, RANK_TIERS, CATEGORY_CONFIG, createRank, getRankTierConfig, getCategoryConfig, RankSystem, rankSystem, EntityManager, entityManager, GameIntegration, createGame, VERSION } = require('index');

// Make available globally
window.NPCRankSystem = {
  Entity, NPC, Enemy,
  RANK_TIERS, CATEGORY_CONFIG, createRank, getRankTierConfig, getCategoryConfig,
  RankSystem, rankSystem,
  EntityManager, entityManager,
  GameIntegration, createGame,
  VERSION
};

console.log('🎮 NPC & Enemy Rank System loaded offline!');
`;

  fs.writeFileSync(outputFile, bundle);
  console.log("✅ Bundle created: standalone.js");
}

bundleJS();
