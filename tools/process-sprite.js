/**
 * Namma Quest — Sprite Sheet Processor
 *
 * Converts test-sprite.png (722×1384, 3×4 grid with black background)
 * into a game-ready player.png (128×192, 4×4 grid with transparent background)
 *
 * Target frame size: 32×48 pixels
 *
 * Usage: node tools/process-sprite.js
 * Requires: npm install sharp
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Configuration ─────────────────────────────────────────────────────────────

const INPUT_PATH = path.resolve(__dirname, '../public/assets/sprites/test-sprite.png');
const OUTPUT_PATH = path.resolve(__dirname, '../public/assets/sprites/player.png');
const DEBUG_DIR = path.resolve(__dirname, 'debug-frames');

const SOURCE_COLS = 3;
const SOURCE_ROWS = 4;

const TARGET_FRAME_W = 32;
const TARGET_FRAME_H = 48;
const OUTPUT_COLS = 4;
const OUTPUT_ROWS = 4;

// How test-sprite rows map to game directions:
// test-sprite: row 0 = front, row 1 = back, row 2 = left, row 3 = right
// game output: row 0 = down(front), row 1 = left, row 2 = right, row 3 = up(back)
const ROW_MAPPING = [
  { sourceRow: 0, label: 'down'  },  // output row 0 ← source row 0 (front)
  { sourceRow: 2, label: 'left'  },  // output row 1 ← source row 2 (left)
  { sourceRow: 3, label: 'right' },  // output row 2 ← source row 3 (right)
  { sourceRow: 1, label: 'up'    },  // output row 3 ← source row 1 (back)
];

// Per output row, which source columns to use for 4 output frames:
// [stride-L, idle, stride-R, idle-copy]
const COL_MAPPING = [0, 1, 2, 1];

// Black removal threshold (0-255) — pixels with ALL channels below this become transparent
const BLACK_THRESHOLD = 40;

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Namma Quest Sprite Processor ===\n');

  // Create debug directory
  if (!fs.existsSync(DEBUG_DIR)) {
    fs.mkdirSync(DEBUG_DIR, { recursive: true });
  }

  // Load source image
  const inputMeta = await sharp(INPUT_PATH).metadata();
  console.log(`Input: ${inputMeta.width}×${inputMeta.height} (${inputMeta.format})`);

  const sourceW = inputMeta.width;
  const sourceH = inputMeta.height;
  const cellW = Math.floor(sourceW / SOURCE_COLS);
  const cellH = Math.floor(sourceH / SOURCE_ROWS);
  console.log(`Cell size: ${cellW}×${cellH}`);
  console.log(`Target frame: ${TARGET_FRAME_W}×${TARGET_FRAME_H}`);
  console.log('');

  // Step 1: Extract raw pixels as RGBA
  const rawBuffer = await sharp(INPUT_PATH)
    .ensureAlpha()       // Convert to RGBA if not already
    .raw()
    .toBuffer();

  // Step 2: Extract each cell, remove black, find bounds, resize
  const processedFrames = [];

  for (let outRow = 0; outRow < OUTPUT_ROWS; outRow++) {
    const { sourceRow, label } = ROW_MAPPING[outRow];

    for (let outCol = 0; outCol < OUTPUT_COLS; outCol++) {
      const sourceCol = COL_MAPPING[outCol];

      console.log(`Processing: output[${outRow},${outCol}] ← source[${sourceRow},${sourceCol}] (${label})`);

      // Extract cell pixels
      const cellPixels = extractCell(rawBuffer, sourceW, sourceH, sourceRow, sourceCol, cellW, cellH);

      // Remove black background
      removeBlackBackground(cellPixels, cellW, cellH);

      // Save raw cell for debugging
      await saveDebugFrame(cellPixels, cellW, cellH, `raw_${label}_${outCol}`);

      // Find bounding box of non-transparent content
      const bounds = findBounds(cellPixels, cellW, cellH);
      if (!bounds) {
        console.log(`  WARNING: Empty cell! Using full cell.`);
        continue;
      }

      const { left, top, right, bottom } = bounds;
      const spriteW = right - left;
      const spriteH = bottom - top;
      console.log(`  Content: ${spriteW}×${spriteH} at (${left},${top})`);

      // Crop to bounding box with 2px padding
      const pad = 2;
      const cropLeft = Math.max(0, left - pad);
      const cropTop = Math.max(0, top - pad);
      const cropRight = Math.min(cellW, right + pad);
      const cropBottom = Math.min(cellH, bottom + pad);
      const cropW = cropRight - cropLeft;
      const cropH = cropBottom - cropTop;

      // Crop the cell
      const croppedBuffer = cropPixels(cellPixels, cellW, cellH, cropLeft, cropTop, cropW, cropH);

      // Resize to fit within TARGET_FRAME_W × TARGET_FRAME_H while maintaining aspect ratio
      // Then CENTER the result on a transparent TARGET_FRAME_W × TARGET_FRAME_H canvas
      const resizedFrame = await resizeAndCenter(croppedBuffer, cropW, cropH);

      // Save debug frame
      await saveDebugFrame(resizedFrame, TARGET_FRAME_W, TARGET_FRAME_H, `final_${label}_${outCol}`);

      processedFrames.push({
        row: outRow,
        col: outCol,
        pixels: resizedFrame,
      });
    }
  }

  // Step 3: Assemble into final spritesheet
  console.log('\nAssembling spritesheet...');
  const sheetW = TARGET_FRAME_W * OUTPUT_COLS;   // 128
  const sheetH = TARGET_FRAME_H * OUTPUT_ROWS;   // 192
  const sheetBuffer = Buffer.alloc(sheetW * sheetH * 4, 0); // All transparent

  for (const frame of processedFrames) {
    const offsetX = frame.col * TARGET_FRAME_W;
    const offsetY = frame.row * TARGET_FRAME_H;

    for (let y = 0; y < TARGET_FRAME_H; y++) {
      for (let x = 0; x < TARGET_FRAME_W; x++) {
        const srcIdx = (y * TARGET_FRAME_W + x) * 4;
        const dstIdx = ((offsetY + y) * sheetW + (offsetX + x)) * 4;
        sheetBuffer[dstIdx + 0] = frame.pixels[srcIdx + 0]; // R
        sheetBuffer[dstIdx + 1] = frame.pixels[srcIdx + 1]; // G
        sheetBuffer[dstIdx + 2] = frame.pixels[srcIdx + 2]; // B
        sheetBuffer[dstIdx + 3] = frame.pixels[srcIdx + 3]; // A
      }
    }
  }

  // Save final spritesheet
  await sharp(sheetBuffer, {
    raw: { width: sheetW, height: sheetH, channels: 4 }
  })
    .png()
    .toFile(OUTPUT_PATH);

  console.log(`\n✓ Saved: ${OUTPUT_PATH}`);
  console.log(`  Sheet: ${sheetW}×${sheetH}`);
  console.log(`  Frames: ${TARGET_FRAME_W}×${TARGET_FRAME_H} × ${processedFrames.length}`);
  console.log(`  Layout: ${OUTPUT_COLS} cols × ${OUTPUT_ROWS} rows`);
  console.log(`\n  Row 0: Down  (front) — stride-L, idle, stride-R, idle`);
  console.log(`  Row 1: Left          — stride-L, idle, stride-R, idle`);
  console.log(`  Row 2: Right         — stride-L, idle, stride-R, idle`);
  console.log(`  Row 3: Up    (back)  — stride-L, idle, stride-R, idle`);
  console.log(`\nDebug frames saved to: ${DEBUG_DIR}/`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function extractCell(buffer, imgW, imgH, row, col, cellW, cellH) {
  const cellBuffer = Buffer.alloc(cellW * cellH * 4);
  const startX = col * cellW;
  const startY = row * cellH;

  for (let y = 0; y < cellH; y++) {
    for (let x = 0; x < cellW; x++) {
      const srcIdx = ((startY + y) * imgW + (startX + x)) * 4;
      const dstIdx = (y * cellW + x) * 4;
      cellBuffer[dstIdx + 0] = buffer[srcIdx + 0];
      cellBuffer[dstIdx + 1] = buffer[srcIdx + 1];
      cellBuffer[dstIdx + 2] = buffer[srcIdx + 2];
      cellBuffer[dstIdx + 3] = buffer[srcIdx + 3];
    }
  }
  return cellBuffer;
}

function removeBlackBackground(buffer, w, h) {
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const r = buffer[idx + 0];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];

    if (r < BLACK_THRESHOLD && g < BLACK_THRESHOLD && b < BLACK_THRESHOLD) {
      buffer[idx + 0] = 0;
      buffer[idx + 1] = 0;
      buffer[idx + 2] = 0;
      buffer[idx + 3] = 0; // Fully transparent
    }
  }
}

function findBounds(buffer, w, h) {
  let left = w, top = h, right = 0, bottom = 0;
  let found = false;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = buffer[(y * w + x) * 4 + 3];
      if (alpha > 0) {
        found = true;
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (!found) return null;
  return { left, top, right: right + 1, bottom: bottom + 1 };
}

function cropPixels(buffer, srcW, srcH, cropX, cropY, cropW, cropH) {
  const cropped = Buffer.alloc(cropW * cropH * 4, 0);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const srcIdx = ((cropY + y) * srcW + (cropX + x)) * 4;
      const dstIdx = (y * cropW + x) * 4;
      cropped[dstIdx + 0] = buffer[srcIdx + 0];
      cropped[dstIdx + 1] = buffer[srcIdx + 1];
      cropped[dstIdx + 2] = buffer[srcIdx + 2];
      cropped[dstIdx + 3] = buffer[srcIdx + 3];
    }
  }
  return cropped;
}

async function resizeAndCenter(pixelBuffer, srcW, srcH) {
  // Calculate scale to fit within TARGET while maintaining aspect ratio
  const scaleX = TARGET_FRAME_W / srcW;
  const scaleY = TARGET_FRAME_H / srcH;
  const scale = Math.min(scaleX, scaleY); // Fit inside, don't overflow

  const scaledW = Math.round(srcW * scale);
  const scaledH = Math.round(srcH * scale);

  // Resize the cropped sprite using nearest-neighbor
  const resizedBuffer = await sharp(pixelBuffer, {
    raw: { width: srcW, height: srcH, channels: 4 }
  })
    .resize(scaledW, scaledH, {
      kernel: sharp.kernel.nearest,  // CRITICAL: nearest-neighbor for pixel art
      fit: 'fill',                    // Exact dimensions
    })
    .raw()
    .toBuffer();

  // Create a transparent TARGET_FRAME_W × TARGET_FRAME_H canvas
  const canvas = Buffer.alloc(TARGET_FRAME_W * TARGET_FRAME_H * 4, 0);

  // Center horizontally, ANCHOR TO BOTTOM vertically
  // (character's feet should be at a consistent Y position across all frames)
  const offsetX = Math.floor((TARGET_FRAME_W - scaledW) / 2);
  const offsetY = TARGET_FRAME_H - scaledH - 1; // 1px from bottom (feet on ground)

  // Paste resized sprite onto canvas
  for (let y = 0; y < scaledH; y++) {
    for (let x = 0; x < scaledW; x++) {
      const srcIdx = (y * scaledW + x) * 4;
      const dstX = offsetX + x;
      const dstY = offsetY + y;

      if (dstX >= 0 && dstX < TARGET_FRAME_W && dstY >= 0 && dstY < TARGET_FRAME_H) {
        const dstIdx = (dstY * TARGET_FRAME_W + dstX) * 4;
        canvas[dstIdx + 0] = resizedBuffer[srcIdx + 0];
        canvas[dstIdx + 1] = resizedBuffer[srcIdx + 1];
        canvas[dstIdx + 2] = resizedBuffer[srcIdx + 2];
        canvas[dstIdx + 3] = resizedBuffer[srcIdx + 3];
      }
    }
  }

  return canvas;
}

async function saveDebugFrame(pixelBuffer, w, h, name) {
  const outPath = path.join(DEBUG_DIR, `${name}.png`);
  await sharp(pixelBuffer, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(outPath);
}

// ── Run ───────────────────────────────────────────────────────────────────────

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
