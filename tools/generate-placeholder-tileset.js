/**
 * Namma Quest — Placeholder Tileset Generator
 *
 * Generates a 512×512 PNG tileset with a 16×16 grid of 32×32 tiles
 * Each tile is a solid color with subtle borders for visual distinction
 *
 * Tiles 0-24 are predefined, tiles 25+ are transparent
 *
 * Usage: node tools/generate-placeholder-tileset.js
 * Requires: npm install sharp
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TILE_SIZE = 32;
const GRID_SIZE = 16;
const SHEET_SIZE = TILE_SIZE * GRID_SIZE; // 512

const OUTPUT_PATH = path.resolve(__dirname, '../public/assets/tilesets/airport_tiles.png');
const REF_PATH = path.resolve(__dirname, 'tileset-reference.png');

// Tile definitions: index → { name, color, draw function }
const TILES = {
  0: { name: 'Void', color: null }, // Transparent

  // Floors (1-4)
  1: { name: 'Floor Light', color: '#a0a8b0' },
  2: { name: 'Floor Dark', color: '#909098' },
  3: { name: 'Floor Marble', color: '#c8c0b0' },
  4: { name: 'Carpet', color: '#4a6080' },

  // Walls (5-8)
  5: { name: 'Wall White', color: '#d0d0d8' },
  6: { name: 'Wall Glass', color: '#a0c0d8', draw: drawGlassWall },
  7: { name: 'Pillar', color: '#808888', draw: drawPillar },
  8: { name: 'Wall Base', color: '#b0b0b8', draw: drawWallBase },

  // Furniture (9-12)
  9: { name: 'Bench', color: '#8b6914', draw: drawBench },
  10: { name: 'Counter', color: '#5a4020', draw: drawCounter },
  11: { name: 'ATM', color: '#22c55e', draw: drawATM },
  12: { name: 'Luggage Belt', color: '#7c3aed', draw: drawLuggageBelt },

  // Objects (13-16)
  13: { name: 'Plant', color: '#2d8b46', draw: drawPlant },
  14: { name: 'Trash Can', color: '#606060', draw: drawTrashCan },
  15: { name: 'Sign', color: '#2563eb', draw: drawSign },
  16: { name: 'Chai Stall', color: '#f97316', draw: drawChaiStall },

  // Outdoor (17-20)
  17: { name: 'Road', color: '#404040' },
  18: { name: 'Sidewalk', color: '#c8c0b0' },
  19: { name: 'Road Mark', color: '#404040', draw: drawRoadMarking },
  20: { name: 'Auto Stand', color: '#c8b800', draw: drawAutoStand },

  // Transitions (21-24)
  21: { name: 'Door', color: '#3d3d3d', draw: drawDoor },
  22: { name: 'Exit Sign', color: '#ef4444', draw: drawExitSign },
  23: { name: 'Escalator', color: '#888888', draw: drawEscalator },
  24: { name: 'Gate', color: '#ef4444', draw: drawGate },
};

// ── Tile Drawing Functions ─────────────────────────────────────────────────────

function drawGlassWall(pixels, tileX, tileY) {
  // Light blue wall with white reflection stripe
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#a0c0d8');
  fillRect(pixels, tileX, tileY, 2, 2, 4, TILE_SIZE - 4, '#ffffff', 0.4); // 40% opacity
}

function drawPillar(pixels, tileX, tileY) {
  // Gray pillar 24×24 centered with light border
  const pillarSize = 24;
  const offset = (TILE_SIZE - pillarSize) / 2;
  fillRect(pixels, tileX, tileY, offset, offset, pillarSize, pillarSize, '#808888');
  drawBorder(pixels, tileX, tileY, offset, offset, pillarSize, pillarSize, '#a0a8b0', 2);
}

function drawWallBase(pixels, tileX, tileY) {
  // Wall with darker bottom edge (molding effect)
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#b0b0b8');
  fillRect(pixels, tileX, tileY, 0, TILE_SIZE - 3, TILE_SIZE, 3, '#808080'); // Dark bottom
}

function drawBench(pixels, tileX, tileY) {
  // Brown horizontal bench 28×12 centered
  const w = 28, h = 12;
  const x = (TILE_SIZE - w) / 2, y = (TILE_SIZE - h) / 2;
  fillRect(pixels, tileX, tileY, x, y, w, h, '#8b6914');
  drawBorder(pixels, tileX, tileY, x, y, w, h, '#000000', 1);
}

function drawCounter(pixels, tileX, tileY) {
  // Dark brown counter, full width, 20px tall
  fillRect(pixels, tileX, tileY, 0, 6, TILE_SIZE, 20, '#5a4020');
  drawBorder(pixels, tileX, tileY, 0, 6, TILE_SIZE, 20, '#000000', 1);
}

function drawATM(pixels, tileX, tileY) {
  // Green rectangle 20×24 centered with black screen detail
  const w = 20, h = 24;
  const x = (TILE_SIZE - w) / 2, y = (TILE_SIZE - h) / 2;
  fillRect(pixels, tileX, tileY, x, y, w, h, '#22c55e');
  fillRect(pixels, tileX, tileY, x + 2, y + 2, w - 4, h - 6, '#000000'); // Screen
  drawBorder(pixels, tileX, tileY, x, y, w, h, '#000000', 1);
}

function drawLuggageBelt(pixels, tileX, tileY) {
  // Purple square with dark inner border
  fillRect(pixels, tileX, tileY, 2, 2, TILE_SIZE - 4, TILE_SIZE - 4, '#7c3aed');
  drawBorder(pixels, tileX, tileY, 2, 2, TILE_SIZE - 4, TILE_SIZE - 4, '#3d1e6d', 1);
}

function drawPlant(pixels, tileX, tileY) {
  // Green circle on brown pot
  drawCircle(pixels, tileX, tileY, TILE_SIZE / 2, TILE_SIZE / 2, 8, '#2d8b46'); // Leaves
  fillRect(pixels, tileX, tileY, 10, 22, 12, 8, '#8b6914'); // Pot
}

function drawTrashCan(pixels, tileX, tileY) {
  // Gray rectangle with lid
  fillRect(pixels, tileX, tileY, 8, 18, 16, 10, '#606060'); // Body
  fillRect(pixels, tileX, tileY, 6, 14, 20, 4, '#808080'); // Lid
}

function drawSign(pixels, tileX, tileY) {
  // Blue rectangle with white dot (text placeholder)
  fillRect(pixels, tileX, tileY, 6, 4, 20, 20, '#2563eb');
  drawCircle(pixels, tileX, tileY, 16, 12, 2, '#ffffff'); // Text dot
  drawBorder(pixels, tileX, tileY, 6, 4, 20, 20, '#000000', 1);
}

function drawChaiStall(pixels, tileX, tileY) {
  // Orange stall with small brown cup
  fillRect(pixels, tileX, tileY, 2, 6, 28, 20, '#f97316'); // Stall
  fillRect(pixels, tileX, tileY, 14, 4, 4, 4, '#8b6914'); // Cup (simplified)
  drawBorder(pixels, tileX, tileY, 2, 6, 28, 20, '#000000', 1);
}

function drawRoadMarking(pixels, tileX, tileY) {
  // Gray road with yellow center line
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#404040');
  fillRect(pixels, tileX, tileY, 0, 14, TILE_SIZE, 4, '#fbbf24'); // Yellow stripe
}

function drawAutoStand(pixels, tileX, tileY) {
  // Yellow-green with small vehicle shape
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#c8b800');
  fillRect(pixels, tileX, tileY, 6, 12, 20, 12, '#000000'); // Vehicle silhouette
}

function drawDoor(pixels, tileX, tileY) {
  // Dark rectangle with lighter frame
  fillRect(pixels, tileX, tileY, 4, 2, 24, 28, '#3d3d3d'); // Door
  drawBorder(pixels, tileX, tileY, 4, 2, 24, 28, '#a0a0a0', 2); // Light frame
  fillRect(pixels, tileX, tileY, 14, 14, 2, 2, '#ffcc00'); // Door handle
}

function drawExitSign(pixels, tileX, tileY) {
  // Red rectangle with white arrow shape
  fillRect(pixels, tileX, tileY, 2, 2, 28, 28, '#ef4444');
  // White arrow pointing right (simplified)
  fillRect(pixels, tileX, tileY, 8, 12, 6, 8, '#ffffff');
  fillRect(pixels, tileX, tileY, 14, 10, 6, 12, '#ffffff');
}

function drawEscalator(pixels, tileX, tileY) {
  // Gray base with diagonal lines
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#888888');
  // Draw diagonal stripes (steps)
  for (let i = 0; i < TILE_SIZE; i += 4) {
    drawLine(pixels, tileX, tileY, i, 0, i + TILE_SIZE, TILE_SIZE, '#ffffff', 1);
  }
}

function drawGate(pixels, tileX, tileY) {
  // Alternating red/white vertical stripes
  fillRect(pixels, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, '#ef4444');
  for (let x = 0; x < TILE_SIZE; x += 4) {
    fillRect(pixels, tileX, tileY, x, 0, 4, TILE_SIZE, '#ffffff');
  }
}

// ── Pixel Drawing Helpers ──────────────────────────────────────────────────────

function colorToRGBA(hex, alpha = 1.0) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = Math.round(alpha * 255);
  return { r, g, b, a };
}

function setPixel(pixels, x, y, color) {
  if (x < 0 || x >= SHEET_SIZE || y < 0 || y >= SHEET_SIZE) return;
  const idx = (y * SHEET_SIZE + x) * 4;
  pixels[idx] = color.r;
  pixels[idx + 1] = color.g;
  pixels[idx + 2] = color.b;
  pixels[idx + 3] = color.a;
}

function fillRect(pixels, tileX, tileY, x, y, w, h, hex, alpha = 1.0) {
  const color = colorToRGBA(hex, alpha);
  const startX = tileX * TILE_SIZE + x;
  const startY = tileY * TILE_SIZE + y;
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(pixels, startX + dx, startY + dy, color);
    }
  }
}

function drawBorder(pixels, tileX, tileY, x, y, w, h, hex, thickness) {
  const color = colorToRGBA(hex);
  const startX = tileX * TILE_SIZE + x;
  const startY = tileY * TILE_SIZE + y;

  // Top and bottom
  for (let dx = 0; dx < w; dx++) {
    for (let t = 0; t < thickness; t++) {
      setPixel(pixels, startX + dx, startY + t, color); // Top
      setPixel(pixels, startX + dx, startY + h - 1 - t, color); // Bottom
    }
  }

  // Left and right
  for (let dy = 0; dy < h; dy++) {
    for (let t = 0; t < thickness; t++) {
      setPixel(pixels, startX + t, startY + dy, color); // Left
      setPixel(pixels, startX + w - 1 - t, startY + dy, color); // Right
    }
  }
}

function drawCircle(pixels, tileX, tileY, cx, cy, radius, hex) {
  const color = colorToRGBA(hex);
  const startX = tileX * TILE_SIZE;
  const startY = tileY * TILE_SIZE;

  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(pixels, startX + cx + dx, startY + cy + dy, color);
      }
    }
  }
}

function drawLine(pixels, tileX, tileY, x1, y1, x2, y2, hex, thickness) {
  // Bresenham's line algorithm
  const color = colorToRGBA(hex);
  const startX = tileX * TILE_SIZE;
  const startY = tileY * TILE_SIZE;

  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  let x = x1, y = y1;

  while (true) {
    for (let t = 0; t < thickness; t++) {
      setPixel(pixels, startX + x + t, startY + y, color);
    }
    if (x === x2 && y === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) err -= dy, x += sx;
    if (e2 < dx) err += dx, y += sy;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Namma Quest Placeholder Tileset Generator ===\n');

  // Create tileset buffer (all transparent initially)
  const buffer = Buffer.alloc(SHEET_SIZE * SHEET_SIZE * 4, 0);

  console.log(`Generating ${SHEET_SIZE}×${SHEET_SIZE} tileset (${GRID_SIZE}×${GRID_SIZE} grid)...`);

  // Draw each tile
  for (let tileIdx = 0; tileIdx < GRID_SIZE * GRID_SIZE; tileIdx++) {
    const tileX = tileIdx % GRID_SIZE;
    const tileY = Math.floor(tileIdx / GRID_SIZE);

    const tileDef = TILES[tileIdx];

    if (tileDef) {
      // Draw solid color background
      if (tileDef.color) {
        fillRect(buffer, tileX, tileY, 0, 0, TILE_SIZE, TILE_SIZE, tileDef.color);

        // Add inner 1px border for visual distinction
        drawBorder(buffer, tileX, tileY, 1, 1, TILE_SIZE - 2, TILE_SIZE - 2, '#000000', 0.1);
      }

      // Call custom draw function if available
      if (tileDef.draw) {
        tileDef.draw(buffer, tileX, tileY);
      }
    }
    // Tiles without definition remain transparent
  }

  // Save tileset
  await sharp(buffer, {
    raw: { width: SHEET_SIZE, height: SHEET_SIZE, channels: 4 }
  })
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`✓ Tileset saved: ${OUTPUT_PATH}`);
  console.log(`  Size: ${SHEET_SIZE}×${SHEET_SIZE}`);
  console.log(`  Tiles: ${GRID_SIZE}×${GRID_SIZE}`);
  console.log(`  Tile size: ${TILE_SIZE}×${TILE_SIZE}`);
  console.log(`\nTile Index Reference:`);
  console.log(`  0: Void (transparent)`);
  console.log(`  1-4: Floors`);
  console.log(`  5-8: Walls`);
  console.log(`  9-12: Furniture`);
  console.log(`  13-16: Objects`);
  console.log(`  17-20: Outdoor`);
  console.log(`  21-24: Transitions`);
  console.log(`  25-255: Empty (transparent)`);
  console.log('');

  // Generate reference image with tile indices
  console.log('Generating reference image with tile indices...');

  // For now, just save the same tileset as reference
  // In a full implementation, you'd overlay text using canvas or similar
  await sharp(buffer, {
    raw: { width: SHEET_SIZE, height: SHEET_SIZE, channels: 4 }
  })
    .png()
    .toFile(REF_PATH);

  console.log(`✓ Reference saved: ${REF_PATH}`);
  console.log('\n✓ Tileset generation complete!');
}

// ── Run ────────────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
