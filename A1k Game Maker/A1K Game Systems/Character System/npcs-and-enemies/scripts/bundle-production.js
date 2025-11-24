const fs = require("fs");
const path = require("path");

// Bundle all JS files into one
function bundleJS() {
  const distDir = path.join(__dirname, "dist");
  const outputFile = path.join(__dirname, "bundle.js");

  // Files to include in order (dependencies first)
  const files = [
    "ranks/RankConfig.js",
    "ranks/RankSystem.js",
    "entities/Entity.js",
    "entities/NPC.js",
    "entities/Enemy.js",
    "core/EntityManager.js",
    "core/GameIntegration.js",
  ];

  let bundle = `// NPC & Enemy Rank System Bundle v1.0.0
// Generated: ${new Date().toISOString()}
// This is a self-contained bundle that works offline

`;

  // Add each file
  files.forEach((file) => {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      // Remove import/export statements and source maps
      const cleanContent = content
        .replace(/import\s+.*from\s+['"`].*['"`];?\s*/g, "")
        .replace(/export\s+(const|function|class|default)\s+/g, "$1 ")
        .replace(/export\s*{\s*[^}]*\s*};?\s*$/gm, "")
        .replace(/\/\/# sourceMappingURL=.*/g, "");

      bundle += `\n// ===== ${file} =====\n${cleanContent}\n`;
    }
  });

  // Add the main exports at the end
  bundle += `
// ===== Main Exports =====
window.NPCRankSystem = {
  Entity,
  NPC,
  Enemy,
  RANK_TIERS,
  CATEGORY_CONFIG,
  createRank,
  getRankTierConfig,
  getCategoryConfig,
  RankSystem,
  rankSystem,
  EntityManager,
  entityManager,
  GameIntegration,
  createGame,
  VERSION: '1.0.0'
};

console.log('🎮 NPC & Enemy Rank System loaded! Version 1.0.0');
console.log('Available as: window.NPCRankSystem');
`;

  fs.writeFileSync(outputFile, bundle);
  console.log(`✅ Bundle created: ${outputFile}`);
}

// Copy catalog files
function copyCatalog() {
  const catalogDir = path.join(__dirname, "dist", "catalog");
  const outputDir = path.join(__dirname, "public", "catalog");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(catalogDir)) {
    const files = fs.readdirSync(catalogDir);
    files.forEach((file) => {
      const src = path.join(catalogDir, file);
      const dest = path.join(outputDir, file);
      fs.copyFileSync(src, dest);
    });
    console.log("✅ Catalog files copied");
  }
}

bundleJS();
copyCatalog();
console.log("🎉 Production bundle ready!");
