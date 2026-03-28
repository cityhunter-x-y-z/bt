# Namma Quest — AI IDE Context File

> **Purpose**: This file provides structured context for AI IDEs (Cursor, Claude Code, Copilot) working on the Namma Quest codebase. Keep this file updated as assets and systems evolve.

---

## Project Overview

- **Game**: Namma Quest — a 32-bit top-down pixel RPG set in Bengaluru
- **Engine**: Phaser 3.80+ with TypeScript
- **Build**: Vite 5.x
- **Resolution**: 640×360 native, scaled with `Phaser.Scale.FIT` + `pixelArt: true`
- **Scales to**: 720p (2×), 1080p (3×), 1440p (4×) with perfect integer scaling
- **Tile Size**: 32×32 pixels (20 tiles wide × 11.25 tall visible)
- **Character Sprite Size**: 32×48 pixels per frame (1 tile wide × 1.5 tiles tall)
- **Physics**: Arcade (no gravity, top-down)
- **Target**: Web browsers (desktop + mobile), future Android/iOS via Capacitor

---

## Architecture Pattern

### Scene-Based with Singleton Managers

Every game screen is a **Phaser.Scene**. Cross-cutting state lives in **singleton manager classes** registered on the Phaser game instance via `this.game.registry` or a custom `GameManager` namespace.

```
Scene (handles rendering, input, camera)
  └─ reads/writes → Manager singletons (handle game state)
       ├─ StatsManager    → energy, stress, money
       ├─ QuestManager    → quest progress, objectives
       ├─ DialogueManager → dialogue tree traversal
       ├─ InventoryManager→ items, equipment
       ├─ SkillTreeManager→ XP, skill unlocks
       ├─ CombatManager   → encounter state
       ├─ ChallengeManager→ QTEs, puzzles, social encounters
       └─ SaveManager     → localStorage serialization
```

### Key Conventions

- **Scenes**: `src/scenes/*.ts` — PascalCase, extends `Phaser.Scene`, has `sceneKey` static property
- **Entities**: `src/entities/*.ts` — PascalCase, extends `Phaser.GameObjects.Sprite`
- **Managers**: `src/systems/*.ts` — PascalCase, singleton via static `getInstance()` method
- **Data files**: `src/data/**/*.json` — snake_case filenames
- **Assets**: `public/assets/{sprites,tilesets,tilemaps,ui,audio,portraits}/`
- **Constants**: `src/utils/constants.ts` — game-wide magic numbers and enums
- **Types**: `src/utils/types.ts` — shared TypeScript interfaces and types

---

## File Conventions

### Scene Template

```typescript
import Phaser from 'phaser';

export class ExampleScene extends Phaser.Scene {
  static readonly KEY = 'ExampleScene';

  constructor() {
    super(ExampleScene.KEY);
  }

  preload(): void {
    // Only load scene-specific assets here (bulk loading in BootScene)
  }

  create(): void {
    // Initialize tilemap, entities, camera, UI
  }

  update(time: number, delta: number): void {
    // Per-frame logic: player movement, NPC AI, etc.
  }
}
```

### Entity Template

```typescript
import Phaser from 'phaser';

export class Player extends Phaser.GameObjects.Sprite {
  private speed = 80; // pixels per second

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set body size smaller than sprite for better collision feel
    (this.body as Phaser.Physics.Arcade.Body).setSize(12, 12);
    (this.body as Phaser.Physics.Arcade.Body).setOffset(2, 18);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys): void {
    // Movement logic with 4-directional animation
  }
}
```

### Manager Template

```typescript
export class StatsManager {
  private static instance: StatsManager;
  private energy = 100;
  private stress = 0;
  private money = 2000; // starting rupees

  static getInstance(): StatsManager {
    if (!StatsManager.instance) {
      StatsManager.instance = new StatsManager();
    }
    return StatsManager.instance;
  }

  // Methods emit events via Phaser.Events.EventEmitter for HUD updates
}
```

---

## Sprite Registry

> Update this section every time a new spritesheet is added.

### Player Character

| File | Path | Sheet Size | Frame Size | Layout |
|------|------|-----------|-----------|--------|
| `player.png` | `public/assets/sprites/player.png` | 128×192 | 32×48 | 4 cols × 4 rows |

**Animation Mapping:**
- Row 0 (frames 0–3): Walk Down — [stride-L, idle, stride-R, idle-dup]
- Row 1 (frames 4–7): Walk Left — [stride-L, idle, stride-R, idle-dup]
- Row 2 (frames 8–11): Walk Right — [stride-L, idle, stride-R, idle-dup]
- Row 3 (frames 12–15): Walk Up — [stride-L, idle, stride-R, idle-dup]

**Idle Frames:**
- Frame 1: Idle Down (center frame of row 0)
- Frame 5: Idle Left (center frame of row 1)
- Frame 9: Idle Right (center frame of row 2)
- Frame 13: Idle Up (center frame of row 3)

**Phaser Load:**
```typescript
this.load.spritesheet('player', 'assets/sprites/player.png', {
  frameWidth: 32,
  frameHeight: 48
});
```

**Phaser Animations:**
```typescript
// Walk cycles (4 frames, 8 fps = 0.5 sec per cycle)
this.anims.create({
  key: 'player-walk-down',
  frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
  frameRate: 8, repeat: -1
});
this.anims.create({
  key: 'player-walk-left',
  frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
  frameRate: 8, repeat: -1
});
this.anims.create({
  key: 'player-walk-right',
  frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
  frameRate: 8, repeat: -1
});
this.anims.create({
  key: 'player-walk-up',
  frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
  frameRate: 8, repeat: -1
});

// Idle frames (single frame, stationary)
this.anims.create({ key: 'player-idle-down', frames: [{ key: 'player', frame: 1 }], frameRate: 1 });
this.anims.create({ key: 'player-idle-left', frames: [{ key: 'player', frame: 5 }], frameRate: 1 });
this.anims.create({ key: 'player-idle-right', frames: [{ key: 'player', frame: 9 }], frameRate: 1 });
this.anims.create({ key: 'player-idle-up', frames: [{ key: 'player', frame: 13 }], frameRate: 1 });
```

### NPCs

| File | Path | Sheet Size | Frame Size | Layout |
|------|------|-----------|-----------|--------|
| `npc_auto_driver.png` | `public/assets/sprites/npc_auto_driver.png` | 64×192 | 32×48 | 2 cols × 4 rows |
| `npc_pg_owner.png` | `public/assets/sprites/npc_pg_owner.png` | 64×192 | 32×48 | 2 cols × 4 rows |
| `npc_chai_wallah.png` | `public/assets/sprites/npc_chai_wallah.png` | 64×192 | 32×48 | 2 cols × 4 rows |

**NPC Animation Pattern** (2-frame idle per direction):
- Row 0 (frames 0–1): Idle Down
- Row 1 (frames 2–3): Idle Left
- Row 2 (frames 4–5): Idle Right
- Row 3 (frames 6–7): Idle Up

### Portraits (Dialogue)

| File | Path | Size | Frames | Layout |
|------|------|------|--------|--------|
| `portrait_auto_driver.png` | `public/assets/portraits/portrait_auto_driver.png` | 192×64 | 64×64 | 3 cols: neutral, angry, happy |
| `portrait_pg_owner.png` | `public/assets/portraits/portrait_pg_owner.png` | 192×64 | 64×64 | 3 cols: neutral, stern, friendly |

---

## Tileset Registry

> Document every tileset with its tile index meanings.

### Airport Tileset

| File | Path | Grid | Tile Size |
|------|------|------|-----------|
| `airport_tiles.png` | `public/assets/tilesets/airport_tiles.png` | 16×16 (512×512) | 32×32 |

**Tile Index Map:**
```
0-15:   Floor tiles (polished floor, carpet, metal grating, rubber mat)
16-31:  Wall tiles (glass wall, concrete wall, pillar, wall base, wall top)
32-47:  Furniture (bench, counter, ATM, baggage belt, sign board, trash can)
48-63:  Decorations (potted plant, flight board, hanging sign, floor marking)
64-79:  Door/transition tiles (exit door, gate, escalator)
80-95:  Outdoor tiles (road, sidewalk, taxi stand, auto stand)
```

### PG Tileset

| File | Path | Grid | Tile Size |
|------|------|------|-----------|
| `pg_tiles.png` | `public/assets/tilesets/pg_tiles.png` | 16×16 (512×512) | 32×32 |

**Tile Index Map:**
```
0-15:   Floor (concrete, mosaic, doormat, rug)
16-31:  Walls (painted wall, peeling paint, window, door frame)
32-47:  Bedroom furniture (single bed, desk, chair, cupboard, suitcase, fan)
48-63:  Kitchen (stove, counter, fridge, water filter, steel rack)
64-79:  Common area (sofa, TV, table, shoe rack)
80-95:  Rooftop (railing, clothes line, water tank, satellite dish)
```

### Neighborhood Tileset

| File | Path | Grid | Tile Size |
|------|------|------|-----------|
| `neighborhood_tiles.png` | `public/assets/tilesets/neighborhood_tiles.png` | 16×16 (512×512) | 32×32 |

**Tile Index Map:**
```
0-15:   Roads (asphalt, road marking, pothole, speed bump, median)
16-31:  Sidewalk (concrete slab, broken slab, drain cover, curb)
32-47:  Buildings (shop front, window, door, signboard, shutter)
48-63:  Vegetation (tree trunk, tree canopy, bush, flower pot, grass patch)
64-79:  Street objects (street light, auto-rickshaw, bike, dustbin, bench)
80-95:  Commercial (tea stall, food cart, mobile shop, temple entrance)
```

### Interview/Tech Park Tileset

| File | Path | Grid | Tile Size |
|------|------|------|-----------|
| `techpark_tiles.png` | `public/assets/tilesets/techpark_tiles.png` | 16×16 (512×512) | 32×32 |

**Tile Index Map:**
```
0-15:   Floor (marble, carpet tile, elevator floor)
16-31:  Walls (glass panel, white wall, partition, column)
32-47:  Office furniture (reception desk, waiting chair, water cooler, plant)
48-63:  Interview room (table, office chair, whiteboard, projector screen)
64-79:  Decorations (company logo, wall art, clock, fire extinguisher)
80-95:  Outdoor (parking lot, glass entrance, security booth)
```

---

## Tilemap Registry

> Tilemaps are created in Tiled and exported as .tmj (JSON).

| Map | File | Dimensions | Layers |
|-----|------|-----------|--------|
| Airport | `airport.tmj` | 60×40 tiles | Ground, Walls, Objects, AbovePlayer, Collision, Spawns |
| PG Interior | `pg_interior.tmj` | 40×30 tiles | Ground, Walls, Furniture, AbovePlayer, Collision, Spawns |
| Neighborhood | `neighborhood.tmj` | 80×60 tiles | Ground, Roads, Buildings, Objects, AbovePlayer, Collision, Spawns |
| Tech Park | `techpark.tmj` | 30×25 tiles | Ground, Walls, Furniture, AbovePlayer, Collision, Spawns |

**Layer Conventions:**
- **Ground**: Always rendered first (floor, road, grass)
- **Walls**: Rendered above ground (wall bases, building facades)
- **Objects/Furniture**: Interactive or decorative items on the ground plane
- **AbovePlayer**: Rendered above the player sprite (tree canopies, roof overhangs, ceiling fans)
- **Collision**: Non-visible layer; any tile placed = unwalkable
- **Spawns**: Object layer with point objects for player spawn, NPC positions, interactables, zone transitions

**Phaser Tilemap Loading Pattern:**
```typescript
// In preload():
this.load.tilemapTiledJSON('airport_map', 'assets/tilemaps/airport.tmj');
this.load.image('airport_tiles', 'assets/tilesets/airport_tiles.png');

// In create():
const map = this.make.tilemap({ key: 'airport_map' });
const tileset = map.addTilesetImage('airport_tiles', 'airport_tiles');
const ground = map.createLayer('Ground', tileset!);
const walls = map.createLayer('Walls', tileset!);
const objects = map.createLayer('Objects', tileset!);
const abovePlayer = map.createLayer('AbovePlayer', tileset!);
abovePlayer?.setDepth(10); // render above player

// Collision from dedicated layer
const collisionLayer = map.createLayer('Collision', tileset!);
collisionLayer?.setVisible(false);
collisionLayer?.setCollisionByExclusion([-1]); // all tiles = collision
this.physics.add.collider(this.player, collisionLayer!);

// Read spawn points from object layer
const spawns = map.getObjectLayer('Spawns');
spawns?.objects.forEach(obj => {
  if (obj.name === 'player_spawn') {
    this.player.setPosition(obj.x!, obj.y!);
  }
});
```

---

## Dialogue Data Schema

```typescript
interface DialogueFile {
  id: string;                    // unique identifier
  speaker: string;               // display name
  portrait: string;              // portrait spritesheet key
  nodes: Record<string, DialogueNode>;
}

interface DialogueNode {
  text: string;                  // display text (supports {player_name} interpolation)
  portrait_expression?: number;  // frame index for portrait emotion (0=neutral, 1=angry, 2=happy)
  choices?: DialogueChoice[];    // if absent, auto-advance to "next" or end
  next?: string;                 // auto-advance to this node (if no choices)
  effect?: StatEffect;           // apply stat changes when this node is shown
  quest_trigger?: string;        // trigger quest objective completion
  requires?: SkillRequirement;   // only show this choice if skill met
}

interface DialogueChoice {
  text: string;                  // choice button text
  next: string;                  // which node to go to
  effect?: StatEffect;           // stat changes on selection
  requires?: SkillRequirement;   // grey out if not met
  quest_trigger?: string;        // complete quest objective
}

interface StatEffect {
  energy?: number;
  stress?: number;
  money?: number;
  xp?: number;
  xp_branch?: 'technical' | 'soft_skills' | 'city_survival';
  item_add?: string;
  item_remove?: string;
}

interface SkillRequirement {
  skill: string;
  level: number;
}
```

---

## Quest Data Schema

```typescript
interface QuestFile {
  id: string;
  title: string;
  description: string;
  chapter: number;
  prerequisite_quests?: string[];     // must be completed before this unlocks
  objectives: QuestObjective[];
  rewards: QuestRewards;
  on_complete?: {
    unlock_scene?: string;
    trigger_dialogue?: string;
    trigger_cutscene?: string;
  };
}

interface QuestObjective {
  id: string;
  text: string;                       // display text in quest log
  type: 'interact' | 'dialogue' | 'collect' | 'reach' | 'challenge';
  target: string;                     // entity ID, NPC ID, item ID, or zone ID
  count?: number;                     // for collect-type: how many needed
  optional?: boolean;                 // bonus objectives
}

interface QuestRewards {
  xp: number;
  xp_branch?: 'technical' | 'soft_skills' | 'city_survival';
  money?: number;
  items?: string[];
  skill_unlock?: string;
  unlocks?: string[];                 // scene keys or quest IDs
}
```

---

## Save Data Schema

```typescript
interface SaveData {
  version: string;                    // "1.0.0" — for migration support
  timestamp: number;
  player: {
    name: string;
    background: 'architecture' | 'engineering' | 'design' | 'commerce';
    home_state: string;
    position: { scene: string; x: number; y: number };
    direction: 'down' | 'left' | 'right' | 'up';
  };
  stats: {
    energy: number;
    stress: number;
    money: number;
  };
  skills: {
    technical: { xp: number; level: number };
    soft_skills: { xp: number; level: number };
    city_survival: { xp: number; level: number };
  };
  inventory: string[];                // item IDs
  quests: {
    active: Record<string, string[]>; // quest_id → completed objective IDs
    completed: string[];              // quest IDs
  };
  flags: Record<string, boolean>;     // generic game flags for branching
  playtime_seconds: number;
}
```

---

## Asset Checklist

> Track asset production status. Update as assets are created.

### Sprites
| Asset | Status | Notes |
|-------|--------|-------|
| Player spritesheet | ⬜ TODO | 4-dir walk, 16 frames |
| Auto driver NPC | ⬜ TODO | 4-dir idle, 8 frames |
| PG owner NPC | ⬜ TODO | 4-dir idle, 8 frames |
| Chai wallah NPC | ⬜ TODO | 4-dir idle, 8 frames |
| PG-mate 1 NPC | ⬜ TODO | 4-dir idle, 8 frames |
| PG-mate 2 NPC | ⬜ TODO | 4-dir idle, 8 frames |
| PG-mate 3 NPC | ⬜ TODO | 4-dir idle, 8 frames |
| Interviewer NPC | ⬜ TODO | 4-dir idle, 8 frames |
| Generic pedestrians (×4) | ⬜ TODO | 4-dir walk, 16 frames each |

### Tilesets
| Asset | Status | Notes |
|-------|--------|-------|
| Airport tileset | ⬜ TODO | 256×256, 16×16 grid |
| PG interior tileset | ⬜ TODO | 256×256, 16×16 grid |
| Neighborhood tileset | ⬜ TODO | 256×256, 16×16 grid |
| Tech park tileset | ⬜ TODO | 256×256, 16×16 grid |

### Tilemaps
| Asset | Status | Notes |
|-------|--------|-------|
| Airport map (.tmj) | ⬜ TODO | 60×40 tiles |
| PG interior map (.tmj) | ⬜ TODO | 40×30 tiles |
| Neighborhood map (.tmj) | ⬜ TODO | 80×60 tiles |
| Tech park map (.tmj) | ⬜ TODO | 30×25 tiles |

### Portraits
| Asset | Status | Notes |
|-------|--------|-------|
| Auto driver portraits | ⬜ TODO | 3 expressions, 64×64 each |
| PG owner portraits | ⬜ TODO | 3 expressions |
| Interviewer portraits | ⬜ TODO | 3 expressions |
| PG-mate portraits (×3) | ⬜ TODO | 3 expressions each |

### Audio
| Asset | Status | Notes |
|-------|--------|-------|
| Title screen music | ⬜ TODO | .ogg, loopable |
| Airport music | ⬜ TODO | .ogg, loopable |
| PG music | ⬜ TODO | .ogg, loopable |
| Neighborhood music | ⬜ TODO | .ogg, loopable |
| Interview music | ⬜ TODO | .ogg, loopable |
| Boss theme | ⬜ TODO | .ogg, loopable |
| SFX pack | ⬜ TODO | footsteps, UI, combat, ambient |

### UI
| Asset | Status | Notes |
|-------|--------|-------|
| HUD frame | ⬜ TODO | stat bars, money, quest tracker |
| Dialogue box | ⬜ TODO | 9-slice, portrait slot |
| Menu backgrounds | ⬜ TODO | pause, inventory, skills |
| Button sprites | ⬜ TODO | normal, hover, pressed states |
| Pixel font | ⬜ TODO | or use bitmap font from existing pack |

---

## Color Palettes (Hex)

### Shared (Characters & UI)
```
Skin tones:   #F5D6B8, #D4A574, #A67C52, #7B5B3A
Hair:         #1A1A2E, #4A3728, #8B6914
Clothes:      #3B82F6, #EF4444, #22C55E, #F59E0B, #8B5CF6
UI Primary:   #1E293B, #334155, #64748B, #94A3B8
UI Accent:    #3B82F6, #2563EB
UI Warning:   #EF4444
UI Success:   #22C55E
UI Gold:      #F59E0B
```

### Airport
```
Floor:     #C8CCD0, #B0B4B8, #989CA0
Walls:     #E8EDF2, #D0D5DA, #A0B0C0
Accents:   #3B82F6, #F59E0B, #F8F8F0
Lights:    #FFF8E0, #FFE4B0
```

### PG Interior
```
Floor:     #C0A888, #A89070, #907860
Walls:     #F0E8D8, #E0D0B8, #C8B898
Wood:      #8B6914, #6B4C12, #4A3520
Fabric:    #4A7A60, #8B4513, #CD853F
```

### Neighborhood
```
Road:      #606060, #505050, #404040
Sidewalk:  #C8C0B0, #B0A890, #989080
Earth:     #B8945C, #A07840, #886830
Foliage:   #2D8B46, #228B22, #1A6B1A
Signs:     #FF6B35, #E8352B, #FFD700
```

### Tech Park
```
Glass:     #B0D4F0, #90B8D8, #70A0C8
Floor:     #E8E8E8, #D8D8D8, #F0F0F0
Steel:     #A8B0B8, #8890A0, #687888
Accent:    #00A86B, #0078D4, #FF4500
```
