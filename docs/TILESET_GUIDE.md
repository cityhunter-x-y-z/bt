# Namma Quest — Tileset Guide

## Overview

The airport tileset is a 512×512 PNG image containing a 16×16 grid of 32×32 pixel tiles. It's generated procedurally using the tileset generator script and designed for GBA-era pixel art games.

**Location**: `public/assets/tilesets/airport_tiles.png`
**Generator**: `tools/generate-placeholder-tileset.js`

---

## Tile Index Reference

### 0: Void (Transparent)
- Empty space, typically used for non-rendered areas
- Allows transparency through the tilemap layer

### 1-4: Floor Variants

| Index | Name | Color | Usage |
|-------|------|-------|-------|
| 1 | Light Gray Floor | #a0a8b0 | Main walkable surface, well-lit areas |
| 2 | Dark Gray Floor | #909098 | Shadowed or outdoor pavement |
| 3 | Cream/Marble Floor | #c8c0b0 | Fancy areas, airport terminals |
| 4 | Blue Carpet | #4a6080 | Carpeted indoor areas, seating zones |

**Usage**: Use tiles 1-2 in a checkerboard pattern for standard floors. Mix in tile 3 for elegant areas.

### 5-8: Wall Tiles

| Index | Name | Description |
|-------|------|-------------|
| 5 | White Wall | Solid white wall block |
| 6 | Glass Wall | Light blue with white reflection stripe (dynamic lighting effect) |
| 7 | Concrete Pillar | 24×24 gray pillar centered with light border |
| 8 | Wall Base/Molding | Wall with darker bottom edge (architectural detail) |

**Usage**: Use tile 5 for solid walls. Tile 6 for glass partitions (airports, offices). Tile 7 for structural pillars. Tile 8 for wall bases and trim.

### 9-12: Furniture

| Index | Name | Description |
|-------|------|-------------|
| 9 | Bench | Brown horizontal rectangle with border |
| 10 | Counter/Desk | Dark brown full-width counter (20px tall) |
| 11 | ATM | Green rectangle with black screen |
| 12 | Luggage Belt | Purple square with dark inner border |

**Usage**: Place these on floor tiles to create interactive spaces. Benches for seating areas, counters for service desks, ATMs for banking, luggage belts for cargo areas.

### 13-16: Objects

| Index | Name | Description |
|-------|------|-------------|
| 13 | Potted Plant | Green circle (leaves) on brown pot |
| 14 | Trash Can | Gray rectangle with lid |
| 15 | Sign Board | Blue rectangle with white dot (text placeholder) |
| 16 | Chai Stall | Orange stall with small brown cup |

**Usage**: Decorative and interactive objects. Plants add vegetation, trash cans mark service areas, signs provide information, chai stalls are vendors/food areas.

### 17-20: Outdoor Tiles

| Index | Name | Description |
|-------|------|-------------|
| 17 | Asphalt Road | Dark gray, standard pavement |
| 18 | Sidewalk | Light tan concrete |
| 19 | Road Marking | Dark gray with yellow center stripe |
| 20 | Auto Stand | Yellow-green with vehicle silhouette |

**Usage**: Tiles 17-18 for outdoor areas. Tile 19 for roads with lane markings. Tile 20 for auto-rickshaw stands.

### 21-24: Transition & Door Tiles

| Index | Name | Description |
|-------|------|-------------|
| 21 | Door | Dark rectangle with light frame and handle |
| 22 | Exit Sign | Red rectangle with white arrow |
| 23 | Escalator | Gray with diagonal step lines |
| 24 | Gate Barrier | Red and white vertical stripes |

**Usage**: Use these for map transitions, exits, entrances, and restricted areas.

### 25-255: Empty (Transparent)
All remaining tiles are transparent. Use these indices for custom tiles or leave empty.

---

## Creating Maps with Tilesets

### Method 1: Tiled Map Editor (Recommended)

1. **Download Tiled** from [mapeditor.org](https://www.mapeditor.org)
2. **Create new tilemap:**
   - File → New → Tilemap
   - Map size: 60×40 tiles (1920×1280 pixels for large maps)
   - Tile size: 32×32
3. **Add tileset:**
   - Tilesets → New Tileset
   - Source: `public/assets/tilesets/airport_tiles.png`
   - Tile size: 32×32
4. **Paint the map** using the tileset in the left panel
5. **Export as JSON:** File → Export As → `airport.tmj`

**In Phaser:**
```typescript
const map = this.make.tilemap({ key: 'airport_map' });
const tiles = map.addTilesetImage('airport_tiles', 'airport_tiles');
const groundLayer = map.createStaticLayer('Ground', tiles, 0, 0);
```

### Method 2: Procedural (Code-Based)

See `src/scenes/AirportScene.ts` for an example of procedurally creating maps:

```typescript
for (let ty = 0; ty < mapHeight; ty++) {
  for (let tx = 0; tx < mapWidth; tx++) {
    // Determine which tile index to place
    const tileIndex = determineTile(tx, ty);
    this.drawTile(tx, ty, tileIndex);
  }
}
```

### Method 3: Hybrid (Tiled + Procedural)

Combine Tiled maps (for main layout) with procedural scripts (for dynamic elements like NPCs or collectibles).

---

## Tile Design Principles

### Visual Consistency
- All tiles use a limited color palette for GBA authenticity
- 1px inner borders on most tiles provide visual separation
- Darker tiles recede, lighter tiles advance (depth perception)

### Collision Layers
In Tiled, create a separate "Collision" layer:
- Place a collision tile on any non-walkable tile
- In Phaser, set collision from this layer:
```typescript
collisionLayer.setCollisionByProperty({ collides: true });
physics.add.collider(player, groundLayer);
```

### Decoration vs. Walkable
- Transparent tiles (0) and floor tiles (1-4, 18) = walkable
- All other tiles = non-walkable or decorative (set collision accordingly)

---

## Extending the Tileset

### Adding Custom Tiles

Edit `tools/generate-placeholder-tileset.js`:

1. **Add tile definition** in the `TILES` object:
```javascript
25: {
  name: 'My Custom Tile',
  color: '#ff0000',
  draw: drawMyCustomTile  // Optional
}
```

2. **Create draw function** (optional):
```javascript
function drawMyCustomTile(pixels, tileX, tileY) {
  // Draw custom pattern
  fillRect(pixels, tileX, tileY, 0, 0, 32, 32, '#ff0000');
  // Add details...
}
```

3. **Regenerate tileset:**
```bash
node tools/generate-placeholder-tileset.js
```

### Replacing with Real Art

Once you have pixel art from your artist:

1. **Create 512×512 PNG** with 16×16 grid of 32×32 tiles
2. **Ensure transparency** for non-walkable tiles (if using alpha)
3. **Replace** `public/assets/tilesets/airport_tiles.png`
4. **Update Phaser loading** if tile names change

---

## Performance Considerations

### Tilemap Size Limits
- Phaser can handle tilemaps up to 512×512 tiles (16M tiles)
- Visible area at 640×360: 20×11.25 tiles (only ~225 tiles on screen)
- Use **static layers** for immutable terrain
- Use **dynamic layers** for animated or changing tiles

### Rendering Optimization
- Enable culling: `layer.enableCulling()`
- Use compressed tilesets (WebP if supported)
- Batch tiles into pre-rendered chunks for large maps

---

## Tile-to-Pixel Conversion

| Unit | Size | Count (640×360 view) |
|------|------|----------------------|
| Tile | 32×32 px | 20 wide × 11.25 tall |
| Game World | 640×360 px | Full viewport |
| Spritesheet | 512×512 px | 16×16 tiles |

**Example positioning:**
```typescript
const worldX = tileX * 32;  // Convert tile to pixel X
const worldY = tileY * 32;  // Convert tile to pixel Y
const tileX = Math.floor(worldX / 32);  // Convert pixel to tile X
const tileY = Math.floor(worldY / 32);  // Convert pixel to tile Y
```

---

## Tileset Reference Image

A reference image with tile indices overlaid is saved to:
```
tools/tileset-reference.png
```

Use this to quickly look up tile indices while creating maps.

---

## Future Tileset Variants

For different areas (PG, Neighborhood, Tech Park), create additional tilesets:

- `pg_tiles.png` — Interior furnishings, bedrooms
- `neighborhood_tiles.png` — Streets, shops, homes
- `techpark_tiles.png` — Glass buildings, modern furniture

Each tileset uses the same 32×32 tile size and 512×512 canvas for consistency.

---

## Resources

- **Tiled Map Editor**: [mapeditor.org](https://www.mapeditor.org)
- **Pixel Art Tools**: Aseprite, Piskel, PixelLab.ai
- **Phaser Tilemap Docs**: [phaser.io/examples/v3/view/tilemap](https://phaser.io/examples/v3/view/tilemap)

