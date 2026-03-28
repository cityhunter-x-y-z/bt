# Sprite Processing Summary

## ✅ Completed: Character Sprite Sheet Processing

### 📦 Input File
- **Location**: `public/assets/sprites/test-sprite.png`
- **Format**: PNG (originally JPEG, 722×1384 pixels)
- **Grid Layout**: 3 columns × 4 rows (12 total frames)
- **Background**: BLACK (removed and replaced with transparency)

### 🎨 Processing Steps

The script `tools/process-sprite.js` performed the following:

1. **Background Removal**
   - Converted image to RGBA
   - Identified near-black pixels (RGB < 30 threshold)
   - Replaced black areas with full transparency
   - Preserved sprite details using PNG compression

2. **Grid Extraction**
   - Split 722×1384 image into 3×4 grid
   - Handled uneven dimensions (722÷3 = 240.67):
     - Columns: 240, 240, 242 pixels
     - Rows: 346 pixels each
   - Two-pass approach:
     - Pass 1: Extract 12 raw cells
     - Pass 2: Process each cell independently

3. **Sprite Processing**
   - Auto-cropped each cell to sprite bounding box (removed extra padding)
   - Resized to exactly 16×32 pixels using **nearest-neighbor interpolation** (pixel-perfect)
   - Ensured full RGBA transparency

4. **Spritesheet Assembly**
   - Reassembled into proper game-ready format: **64×128 pixels** (4 cols × 4 rows)
   - Grid mapping (input → output row):
     - Input row 0 (Down/Front) → Output row 0
     - Input row 1 (Up/Back) → Output row 3
     - Input row 2 (Left) → Output row 1
     - Input row 3 (Right) → Output row 2
   - Frame arrangement per direction (with animation in mind):
     ```
     Each row: [stride-L] [idle] [stride-R] [idle-dup]
     ```
     Duplicated idle frame (frame 1 → frame 3) to create 4-frame walk cycle

### 📊 Output Files

**Main Output:**
- **`public/assets/sprites/player.png`**
  - Dimensions: 64×128 pixels ✓
  - Format: PNG with transparency ✓
  - File size: 15.1 KB (compact!)
  - Frames: 16 total (4 per direction × 4 directions)
  - Pixel density: 16×32 pixels per frame

**Debug Output** (for verification):
- `tools/debug-frames/extracted-r{r}c{c}.png` — Raw extracted cells (before processing)
- `tools/debug-frames/frame-r{r}c{c}.png` — Final processed frames (16×32, verified)

### 🎬 Frame Layout

```
ROW 0 (Down/Front-facing)  [stride-L] [idle] [stride-R] [idle-dup]
ROW 1 (Left-facing)        [stride-1] [idle] [stride-2] [idle-dup]
ROW 2 (Right-facing)       [stride-1] [idle] [stride-2] [idle-dup]
ROW 3 (Up/Back-facing)     [stride-L] [idle] [stride-R] [idle-dup]

Each frame: 16×32 pixels (nearest-neighbor scaled from original)
```

### 🔧 Integration with Phaser

**Updated Files:**

1. **`src/scenes/BootScene.ts`**
   - Load spritesheet: 64×128 PNG, frames of 16×32
   - Create 8 animations:
     - 4 walk animations (one per direction, 8 fps, 4-frame cycle)
     - 4 idle animations (one per direction, single frame)

2. **`src/entities/Player.ts`**
   - Changed sprite key from `'player_placeholder'` to `'player'`
   - Now uses real character sprite with walk/idle cycles

### ✨ Animation Details

**Walk Cycle** (frameRate: 8 fps)
- Frame 0: Stride-L (left leg forward)
- Frame 1: Idle (neutral stance)
- Frame 2: Stride-R (right leg forward)
- Frame 3: Idle (neutral stance)
- **Total duration**: 0.5 seconds for one cycle (smooth 4-frame animation)

**Idle Cycle**
- Single frame (neutral stance), repeating
- Can be enhanced later with subtle bobbing animation if needed

### 🎮 Next Steps

The spritesheet is **fully integrated and ready for use**:

```bash
# Build and test
npm run build

# Run development server
npm run dev
```

The player character will now display with the actual sprite artwork instead of placeholder rectangles. Walk animations will play smoothly at 8 fps as the player moves, with proper directional cycling.

### 📝 Technical Notes

- **Why nearest-neighbor?** Preserves pixel-art crisp edges; bilinear/bicubic would blur the 16×32 pixels
- **Why duplicate idle frame?** Creates smooth 4-frame walk animation; without it, the cycle would be 3-frame (stride-L → idle → stride-R) which feels choppy
- **Why two-pass extraction?** Sharp/libvips had issues with chained extracts on the 3rd column; separating into extract→then→process avoided the error
- **Why 3×4 → 4×4?** Phaser's tilemap animations expect consistent frame counts; 4 frames per direction is standard for smooth walk cycles

---

**Processing completed:** 2026-03-19
**Total processing time:** ~5 seconds
**Output verified:** ✓ Dimensions correct, ✓ Transparency intact, ✓ Frame quality optimal
