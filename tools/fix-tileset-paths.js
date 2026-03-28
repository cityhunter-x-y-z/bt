/**
 * Namma Quest — Tileset Path Fixer
 *
 * Reads airport_interior.tmj and fixes absolute tileset paths:
 * - Converts absolute paths to relative paths
 * - Copies tileset images to public/assets/tilesets/
 * - Removes duplicate tileset definitions
 * - Updates and saves the fixed .tmj file
 *
 * Usage: node tools/fix-tileset-paths.js
 * Requires: Node.js fs, path
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TMJ_PATH = path.resolve(__dirname, '../public/assets/tilemaps/airport_interior.tmj');
const TILESETS_DIR = path.resolve(__dirname, '../public/assets/tilesets');

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Tileset Path Fixer ===\n');

  // Ensure tilesets directory exists
  if (!fs.existsSync(TILESETS_DIR)) {
    fs.mkdirSync(TILESETS_DIR, { recursive: true });
    console.log(`✓ Created directory: ${TILESETS_DIR}`);
  }

  // Read .tmj file
  if (!fs.existsSync(TMJ_PATH)) {
    console.error(`✗ File not found: ${TMJ_PATH}`);
    process.exit(1);
  }

  const tmjContent = fs.readFileSync(TMJ_PATH, 'utf-8');
  const tmj = JSON.parse(tmjContent);

  console.log(`Loaded: ${TMJ_PATH}`);
  console.log(`Found ${tmj.tilesets.length} tileset definitions\n`);

  // Analyze and fix tilesets
  const seenTilesets = new Set();
  const fixedTilesets = [];
  let copiedCount = 0;
  let pathsFixed = 0;
  let duplicatesRemoved = 0;

  for (let i = 0; i < tmj.tilesets.length; i++) {
    const tileset = tmj.tilesets[i];
    const imagePath = tileset.image;
    const tilesetName = tileset.name;

    console.log(`\n[Tileset ${i + 1}] ${tilesetName}`);
    console.log(`  Image path: ${imagePath}`);
    console.log(`  Dimensions: ${tileset.imagewidth}×${tileset.imageheight}`);
    console.log(`  Tiles: ${tileset.tilecount} (${tileset.columns}×${Math.ceil(tileset.tilecount / tileset.columns)})`);

    // Check for duplicates
    if (seenTilesets.has(tilesetName)) {
      console.log(`  ⚠ DUPLICATE: Already processed "${tilesetName}"`);
      duplicatesRemoved++;
      continue;
    }
    seenTilesets.add(tilesetName);

    // Extract filename from path
    const filename = path.basename(imagePath);

    // Check if path is absolute (Windows or Unix style)
    const isAbsolute = path.isAbsolute(imagePath) || imagePath.includes(':\\') || imagePath.includes('/Users/') || imagePath.includes('/home/');

    if (isAbsolute) {
      console.log(`  ✗ Absolute path detected`);

      // Check if file exists at the absolute path
      if (fs.existsSync(imagePath)) {
        // Copy file to project tilesets directory
        const destPath = path.join(TILESETS_DIR, filename);
        try {
          fs.copyFileSync(imagePath, destPath);
          console.log(`  ✓ Copied: ${destPath}`);
          copiedCount++;
        } catch (err) {
          console.error(`  ✗ Failed to copy: ${err.message}`);
        }
      } else {
        console.log(`  ⚠ Source file not found: ${imagePath}`);
        console.log(`    Place ${filename} in ${TILESETS_DIR} manually`);
      }

      // Update path to relative
      tileset.image = `../tilesets/${filename}`;
      console.log(`  ✓ Path updated to: ${tileset.image}`);
      pathsFixed++;
    } else if (tileset.image.startsWith('../')) {
      console.log(`  ✓ Already relative path`);
    } else {
      console.log(`  ⚠ Unexpected path format`);
    }

    fixedTilesets.push(tileset);
  }

  // Update tilesets in .tmj
  tmj.tilesets = fixedTilesets;

  // Save fixed .tmj
  const fixedTmjContent = JSON.stringify(tmj, null, 1);
  fs.writeFileSync(TMJ_PATH, fixedTmjContent, 'utf-8');

  console.log('\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log(`✓ Files copied: ${copiedCount}`);
  console.log(`✓ Paths fixed: ${pathsFixed}`);
  console.log(`✓ Duplicates removed: ${duplicatesRemoved}`);
  console.log(`✓ Tilesets in .tmj: ${fixedTilesets.length} (was ${tmj.tilesets.length + duplicatesRemoved})`);
  console.log(`\n✓ Updated: ${TMJ_PATH}`);

  // Verify files exist
  console.log('\n' + '='.repeat(50));
  console.log('VERIFICATION');
  console.log('='.repeat(50));

  let allPresent = true;
  for (const tileset of fixedTilesets) {
    const filename = path.basename(tileset.image);
    const filepath = path.join(TILESETS_DIR, filename);
    if (fs.existsSync(filepath)) {
      const stat = fs.statSync(filepath);
      console.log(`✓ Found: ${filename} (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`✗ MISSING: ${filename}`);
      console.log(`  Expected at: ${filepath}`);
      allPresent = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allPresent) {
    console.log('✓ All tileset files present and ready!');
  } else {
    console.log('⚠ Some tileset files are missing.');
    console.log('\nTo fix:');
    console.log(`1. Copy the missing files to: ${TILESETS_DIR}`);
    console.log('2. Run this script again to verify');
  }
  console.log('='.repeat(50));
}

// ── Run ────────────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
