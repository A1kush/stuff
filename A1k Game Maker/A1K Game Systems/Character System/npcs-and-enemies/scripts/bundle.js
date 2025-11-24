// Simple bundler that copies built files to dist
import { copyFileSync, readdirSync, statSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = join(__dirname, "../dist");
const catalogSrc = join(__dirname, "../src/catalog");
const catalogDest = join(__dirname, "../dist/catalog");

console.log("📦 Bundling NPC & Enemy System...");

// Ensure catalog directory exists in dist
if (!existsSync(catalogDest)) {
  mkdirSync(catalogDest, { recursive: true });
}

// Copy catalog files
function copyDirectory(src, dest) {
  const files = readdirSync(src);

  files.forEach((file) => {
    const srcPath = join(src, file);
    const destPath = join(dest, file);

    if (statSync(srcPath).isDirectory()) {
      if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied ${file}`);
    }
  });
}

copyDirectory(catalogSrc, catalogDest);

console.log("✅ Bundle complete!");
console.log("\nTo test the demo:");
console.log("  npm run serve");
console.log("  Then open http://localhost:8080/examples/integration-demo.html");
