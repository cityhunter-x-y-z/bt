# NAMMA QUEST — Product Requirements Document

### A 32-Bit Top-Down Pixel RPG Set in Bengaluru

**Version 1.0 | March 2026**
**Engine:** Phaser.js | **Platform:** Web + Mobile
**Resolution:** 640×360 (16:9) | **Tiles:** 32×32 | **Sprites:** 32×48 (1 wide × 1.5 tall)
**Scales to:** 720p (2×), 1080p (3×), 1440p (4×)
**Art Style:** GBA-era 32-bit Pixel Art

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technical Architecture](#2-technical-architecture)
3. [Game Design](#3-game-design)
4. [Pixel Art and Asset Pipeline](#4-pixel-art-and-asset-pipeline)
5. [Dialogue and Quest System](#5-dialogue-and-quest-system)
6. [Audio Design](#6-audio-design)
7. [Development Roadmap](#7-development-roadmap)
8. [Implementation Quick-Start Guide](#8-implementation-quick-start-guide)
9. [Success Metrics](#9-success-metrics)
10. [Appendix](#10-appendix)

---

## 1. Executive Summary

### 1.1 Game Concept

Namma Quest is a 32-bit top-down pixel RPG that follows a young adult from a small town who arrives in Bengaluru to start their career. The game blends classic GBA-era action RPG mechanics with a grounded, semi-autobiographical narrative about navigating a new city, surviving daily life, hunting for jobs, and building a career from scratch.

The game draws mechanical inspiration from Dragon Ball Z: Buu's Fury (real-time combat, character progression, transformations) while replacing fantasy elements with the real-world challenges of urban Indian life. "Boss fights" become tough job interviews. "Dungeons" become office buildings. "Enemy encounters" become autorickshaw fare negotiations, landlord confrontations, and imposter syndrome episodes.

### 1.2 Core Pillars

- **Authenticity:** Real Bangalore locations, situations, and cultural details that resonate with anyone who's moved to a new city for work.
- **Humor with Heart:** Satirical takes on Bangalore stereotypes (traffic, tech bros, PG food) balanced with genuine emotional moments about loneliness, growth, and resilience.
- **Player Agency:** Character background selection, branching dialogue, and meaningful choices that affect career path and relationships.
- **Retro Aesthetic:** Authentic GBA-era 32-bit pixel art at 640×360 resolution, with chiptune-inspired audio.

### 1.3 Target Audience

- **Primary:** Young professionals (20–30) who've experienced moving to a metro city for work
- **Secondary:** Retro gaming enthusiasts who appreciate GBA-style RPGs
- **Tertiary:** Bangalore residents who'll enjoy the cultural references and inside jokes

### 1.4 Platform and Distribution

| Attribute | Detail |
|-----------|--------|
| Primary Platform | Web browser (desktop and mobile browsers) |
| Secondary Platform | Android and iOS via Capacitor wrapper |
| Distribution | itch.io, personal website, Play Store / App Store (future) |
| Monetization (Future) | Free base game, optional donation / premium chapter DLC |

---

## 2. Technical Architecture

### 2.1 Tech Stack Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Game Engine | Phaser 3.80+ (JavaScript/TypeScript) | Core game loop, rendering, physics, input, audio |
| Language | TypeScript 5.x | Type safety, better IDE support, scalable codebase |
| Build Tool | Vite 5.x | Fast HMR, ESM-native bundling, optimized production builds |
| Tile Map Editor | Tiled Map Editor (free) | Create and export .tmj/.json tilemaps for Phaser |
| Pixel Art Tools | Aseprite + PixelLab.ai + Piskel (free) | Sprite creation, animation, AI-assisted generation |
| Audio | Tone.js + jsfxr | Chiptune music synthesis and retro SFX generation |
| State Management | Custom EventEmitter + JSON save system | Game state, inventory, quest progress, save/load |
| Mobile Wrapper | Capacitor 6.x | Native iOS/Android builds from web codebase |
| AI IDE | Cursor / Claude Code | AI-assisted coding, debugging, multi-file editing |
| Version Control | Git + GitHub | Source control, branching strategy, CI/CD |
| Dialogue System | Custom JSON-based + Ink (optional) | Branching dialogue trees with conditions |
| Testing | Vitest + Playwright | Unit testing game logic, E2E browser testing |

### 2.2 Project Folder Structure

```
namma-quest/
├── docs/                        # PRD, design docs, AI context files
│   ├── PRD.md                   # This document
│   ├── GAME_DESIGN.md           # Living game design document
│   └── AI_CONTEXT.md            # Context file for AI IDE reference
├── src/
│   ├── main.ts                  # Phaser game config and bootstrap
│   ├── scenes/                  # Phaser scenes (one per game screen)
│   │   ├── BootScene.ts         # Asset preloading
│   │   ├── TitleScene.ts        # Main menu
│   │   ├── CharacterSelectScene.ts # Background selection
│   │   ├── AirportScene.ts      # Opening area
│   │   ├── PGScene.ts           # PG/Hostel area
│   │   ├── NeighborhoodScene.ts # Exploration area
│   │   └── InterviewScene.ts    # First boss encounter
│   ├── entities/                # Game objects
│   │   ├── Player.ts            # Player character class
│   │   ├── NPC.ts               # Base NPC class
│   │   └── Interactable.ts      # Items, doors, signs
│   ├── systems/                 # Game systems
│   │   ├── StatsManager.ts      # Health, energy, stress, money
│   │   ├── QuestManager.ts      # Quest tracking and progression
│   │   ├── DialogueManager.ts   # Branching dialogue engine
│   │   ├── InventoryManager.ts  # Items and equipment
│   │   ├── SkillTreeManager.ts  # Skill progression
│   │   ├── CombatManager.ts     # Real-time combat logic
│   │   ├── ChallengeManager.ts  # Social/puzzle challenge logic
│   │   └── SaveManager.ts       # LocalStorage save/load
│   ├── ui/                      # HUD and menu components
│   │   ├── HUD.ts               # Stats bars, money, minimap
│   │   ├── DialogueBox.ts       # Text box with typewriter effect
│   │   ├── MenuOverlay.ts       # Pause menu, inventory, skills
│   │   └── TransitionEffect.ts  # Scene transition animations
│   ├── data/                    # Static game data
│   │   ├── dialogues/           # JSON dialogue trees per NPC/quest
│   │   ├── quests/              # Quest definition JSONs
│   │   ├── items.json           # Item database
│   │   └── skills.json          # Skill tree definitions
│   └── utils/                   # Helpers, constants, types
├── public/
│   └── assets/
│       ├── sprites/             # Character spritesheets (.png)
│       ├── tilesets/            # Tileset images (.png)
│       ├── tilemaps/            # Tiled .tmj exports
│       ├── ui/                  # UI elements, fonts, icons
│       ├── audio/               # Music (.ogg) and SFX (.wav)
│       └── portraits/           # Dialogue character portraits
├── tools/                       # Build and asset pipeline scripts
│   ├── sprite-slicer.js         # Slice spritesheets for Phaser
│   └── tileset-validator.js     # Validate tileset consistency
├── package.json
├── tsconfig.json
├── vite.config.ts
└── capacitor.config.ts          # Mobile build config
```

### 2.3 System Architecture Diagram

The game follows a Scene-based architecture native to Phaser 3, with manager singletons handling cross-cutting concerns:

```
[Phaser Game Instance]
  ├─ Scene Manager (built-in)
  │   ├─ BootScene → preload all assets
  │   ├─ TitleScene → main menu + new/load game
  │   ├─ CharacterSelectScene → background picker
  │   └─ GameScene (per map) → gameplay
  │       ├─ Tilemap Layer (ground, walls, objects, above-player)
  │       ├─ Entity Layer (player, NPCs, interactables)
  │       └─ UI Layer (HUD overlay, dialogue box)
  └─ Global Managers (singleton registry)
      ├─ StatsManager    → HP, energy, stress, money
      ├─ QuestManager    → active/completed quests
      ├─ DialogueManager → dialogue tree traversal
      ├─ InventoryManager→ items, equipment
      ├─ SkillTreeManager→ skill unlocks, XP
      ├─ CombatManager   → real-time combat state
      └─ SaveManager     → localStorage serialization
```

### 2.4 Rendering Pipeline

The game renders at a native resolution of 640×360 pixels, scaled up to fill the browser/device viewport using Phaser's NEAREST neighbor scaling (no anti-aliasing) to preserve crisp pixel art. The camera follows the player with configurable deadzone and smoothing.

**Scaling perfection:** Scales perfectly to 720p (2×), 1080p (3×), and 1440p (4×) with no fractional pixel interpolation.

| Setting | Value | Notes |
|---------|-------|-------|
| Native Resolution | 640×360 | 16:9 ratio, 20 tiles wide × 11.25 tiles tall visible |
| Tile Size | 32×32 px | Ground, walls, objects, decorations |
| Character Sprites | 32×48 px | Per frame; 1 tile wide × 1.5 tiles tall; 4-directional × 4 frames walk cycle |
| Scale Mode | Phaser.Scale.FIT | Maintains aspect ratio, fills viewport |
| Render Type | Phaser.AUTO | WebGL with Canvas fallback |
| Pixel Art Mode | pixelArt: true | Disables texture smoothing globally |
| Camera Deadzone | 160×100 px | Player moves freely in center before camera follows |

---

## 3. Game Design

### 3.1 Narrative Overview

The protagonist is a fresh graduate from a small town in India who has never lived in a big city. They arrive at Kempegowda International Airport with a suitcase, a phone with 40% battery, and the address of a PG accommodation they found on an app. From here, they must navigate the chaos of Bengaluru — from surviving their first auto ride to landing their first job interview.

The narrative unfolds across chapters, each representing a phase of settling into city life:

1. **Arrival:** Landing at the airport, first auto ride, reaching the PG
2. **Settling In:** Meeting PG-mates, exploring the neighborhood, finding essentials
3. **The Hunt:** Applying for jobs, attending interviews, dealing with rejection
4. **First Day:** Starting work, office politics, imposter syndrome (future chapter)
5. **Growth:** Career progression, networking, finding your tribe (future chapter)

### 3.2 Character Creation

At game start, the player chooses their educational background, which affects starting stats, available dialogue options, and early quest branches:

| Background | Starting Stats Bonus | Unique Perks |
|-----------|---------------------|-------------|
| Architecture Graduate | +2 Creativity, +1 Spatial Awareness | Can sketch solutions to spatial puzzles, bonus in design interviews |
| Engineering/Tech Graduate | +2 Technical, +1 Logic | Can debug code challenges, bonus in tech interviews |
| Design/Creative Graduate | +2 Creativity, +1 Communication | Can redesign spaces/UI in challenges, bonus in portfolio reviews |
| Commerce/Business Graduate | +2 Negotiation, +1 Finance | Better auto/rent haggling, bonus in business interviews |

The player also names their character and chooses a home state (cosmetic, affects some NPC dialogue reactions).

### 3.3 Core RPG Systems

#### 3.3.1 Stats and Resources

The player manages three core resource bars that fluctuate based on actions and time:

| Stat | Range | Depleted By | Restored By | Zero Consequence |
|------|-------|-------------|-------------|-----------------|
| Energy | 0–100 | Walking, challenges, stress events, skipping meals | Sleeping, eating, chai, rest | Collapse → wake at PG, lose half-day |
| Stress | 0–100 | Rejection, arguments, deadlines, poor sleep | Friends, hobbies, food, music | Burnout → forced rest day, stats debuff |
| Money (₹) | 0–999,999 | Rent, food, transport, items | Jobs, freelance, side quests | Eviction warning → 3-day countdown to earn |

#### 3.3.2 Skill Tree

Skills are organized into three branches. Each branch has 5 tiers, unlocked by earning XP through relevant activities:

| Branch | Example Skills | How XP is Earned |
|--------|---------------|-----------------|
| Technical Skills | Basics → Intermediate → Proficient → Advanced → Expert | Completing technical challenges, study sessions, work tasks |
| Soft Skills | Shy → Friendly → Charismatic → Influential → Leader | NPC conversations, group activities, successful negotiations |
| City Survival | Tourist → Newcomer → Resident → Local → Namma Bengalurean | Exploring areas, trying food, using public transport, attending events |

#### 3.3.3 Combat and Challenge System

The game uses a mixed challenge system. Some encounters are real-time action, others are social/puzzle challenges:

**Real-Time Encounters:**
- Auto-rickshaw fare negotiation: Quick-time event (QTE) where you counter the driver's inflated price
- Street harassment: Dodge-and-respond sequences where the player must navigate hostile NPCs
- Rush hour bus: Timing-based minigame to board a crowded BMTC bus

**Social/Puzzle Challenges:**
- Job interviews: Multi-phase dialogue battles with a confidence meter — choose the right responses under time pressure
- Landlord negotiations: Turn-based dialogue where each response affects the other party's mood meter
- Technical tests: Puzzle minigames themed to the player's background (code debugging, design critique, etc.)
- Networking events: Memory/matching game to remember names and conversation topics

### 3.4 MVP Map Areas

#### 3.4.1 Kempegowda International Airport (Opening Area)

The game's tutorial zone. The player spawns inside the arrivals terminal after a cutscene showing the flight landing. This area teaches basic movement, interaction, and the dialogue system.

| Element | Details |
|---------|---------|
| Map Size | ~60×40 tiles (960×640 px) |
| Key Locations | Arrivals gate, baggage claim, ATM, chai stall, auto stand |
| NPCs | Airport guard (tutorial), chai wallah, auto drivers (3), fellow traveler |
| Quests | Collect luggage, withdraw cash from ATM, negotiate auto fare to PG |
| Tutorial Teaches | WASD movement, E to interact, dialogue choices, inventory basics |
| Transition | Auto ride cutscene → PG area |

#### 3.4.2 PG Accommodation (Hub Area)

The player's home base. A cramped but functional PG in a Bangalore neighborhood. This is where the player sleeps, eats, saves the game, and meets recurring characters.

| Element | Details |
|---------|---------|
| Map Size | ~40×30 tiles (640×480 px) — interior |
| Key Locations | Player's room, common room, kitchen, rooftop, entrance |
| NPCs | PG owner (quest giver), 3 PG-mates (each with own storyline), cook |
| Quests | Set up room, meet PG-mates, first meal challenge, find WiFi password |
| Systems | Bed = save + restore energy, Kitchen = food (costs money, restores energy) |
| Transition | Front door → Neighborhood |

#### 3.4.3 Neighborhood (Exploration Area)

A bustling Bangalore neighborhood with shops, street food vendors, a park, and a bus stop. This is where the player explores, takes on side quests, and gets a feel for city life.

| Element | Details |
|---------|---------|
| Map Size | ~80×60 tiles (1280×960 px) |
| Key Locations | Main road, tea shop, grocery store, park, bus stop, mobile repair shop, temple |
| NPCs | Street food vendor, shopkeeper, auto drivers, random pedestrians (8–10), stray dog |
| Quests | Buy essentials (bedsheet, lock, etc.), help vendor with delivery, find shortcut to bus stop |
| Encounters | Auto negotiation QTE, street navigation mini-game |
| Transition | Bus stop → Interview Location (bus ride cutscene) |

#### 3.4.4 Interview Location (First "Boss")

A generic tech park building where the player faces their first job interview — the game's first major boss encounter. This combines dialogue choices, timed responses, and a puzzle minigame.

| Element | Details |
|---------|---------|
| Map Size | ~30×25 tiles (480×400 px) — interior |
| Key Locations | Reception, waiting area, interview room, restroom (save point) |
| NPCs | Receptionist, other candidates (ambient), interviewer (boss) |
| Boss Encounter | 3-phase interview: introduction (dialogue), technical test (puzzle), HR round (negotiation) |
| Win Condition | Confidence meter stays above 30% through all phases |
| Fail State | Rejection email next day → player can retry or find another opportunity |
| Reward | Large XP boost, money (if hired), skill unlock, new quest chain |

---

## 4. Pixel Art and Asset Pipeline

### 4.1 Art Style Guide

The visual style targets GBA-era authenticity: limited but vibrant palettes, detailed 32px tiles, expressive 32×48 character sprites with 4-directional walk cycles, and atmospheric environmental art. The palette should reflect Bangalore's character — warm earth tones for dusty streets, cool blues for tech parks, and lush greens for parks and trees.

| Asset Type | Dimensions | Frames | Format |
|-----------|-----------|--------|--------|
| Ground Tiles | 32×32 px | 1 (static) | PNG, indexed color |
| Wall/Object Tiles | 32×32 or 32×64 px | 1–4 (animated optional) | PNG spritesheet |
| Character Sprites | 32×48 px per frame | 4 directions × 4 walk frames = 16 min | PNG spritesheet (128×192) |
| NPC Sprites | 32×48 px per frame | 4 directions × 2 idle frames = 8 min | PNG spritesheet (64×192) |
| Portraits | 48×48 or 64×64 px | 2–4 expressions per character | PNG |
| UI Elements | Variable | As needed | PNG with transparency |
| Effects/Particles | 16×16 or 32×32 px | 4–8 animation frames | PNG spritesheet |

### 4.2 Color Palette Specification

Use a constrained palette per area for visual consistency. Each area should use a master palette of 32–48 colors maximum, with shared colors for characters and UI.

| Area | Dominant Colors | Mood |
|------|----------------|------|
| Airport | Cool grays, white, blue accents, warm yellow lighting | Sterile, overwhelming, new beginnings |
| PG Interior | Warm browns, cream, faded green, yellow | Cramped, lived-in, comforting |
| Neighborhood | Earth tones, green foliage, dusty orange, bright signage | Busy, colorful, chaotic, alive |
| Tech Park | Glass blue, steel gray, white, sterile green | Corporate, intimidating, modern |

### 4.3 AI-Assisted Art Generation Workflow

The art pipeline uses a three-stage approach: AI generation, manual cleanup, and integration.

#### Stage 1: AI Base Generation

Use PixelLab.ai, Midjourney, or DALL-E with specific prompts to generate base assets. The key is providing highly specific prompts that define style, palette, and dimensions.

**Example prompts for different asset types:**

**Character Sprites:**
```
"32x48 pixel art character sprite, GBA style, young Indian male, casual clothes,
backpack, 4-directional walk cycle spritesheet, limited palette, transparent
background, no anti-aliasing"
```

**Tilesets:**
```
"32x32 pixel art tileset, GBA style, Indian street scene, concrete road, sidewalk,
tree, auto-rickshaw, dusty earth, warm palette, seamless tiles, top-down perspective"
```

**Building Exteriors:**
```
"32x32 tile pixel art, GBA RPG style, Indian PG building exterior, top-down
perspective, 3-story building, balconies, clothes drying, warm brown palette,
no anti-aliasing"
```

**Interior Tiles:**
```
"32x32 pixel art tileset, GBA interior style, small bedroom, single bed, desk,
suitcase, fan, dim lighting, Indian PG room, top-down RPG perspective"
```

#### Stage 2: Manual Cleanup and Consistency (Aseprite)

1. Import AI-generated base into Aseprite
2. Resize/crop to exact required dimensions (16×16 or 16×32)
3. Reduce to the area's master palette (32–48 colors) using indexed color mode
4. Clean up any AI artifacts: stray pixels, broken outlines, inconsistent shading
5. Ensure seamless tiling: edges must match when placed adjacent
6. Add sub-pixel animation if needed (2–4 frame idle bobble, walk cycle refinement)
7. Export as indexed PNG with transparent background

#### Stage 3: Integration into Tiled and Phaser

1. Import cleaned PNGs into Tiled Map Editor as tilesets
2. Set tile size to 16×16 in Tiled; create layers: Ground, Walls, Objects, Above-Player, Collision
3. Paint the map using tiles; use the Collision layer to mark unwalkable areas
4. Add Object layers for NPC spawn points, interactables, and zone transitions
5. Export as .tmj (Tiled JSON format) for Phaser's tilemap loader
6. In Phaser, load the tilemap and tileset image, create layers, and set collision from the Collision layer

### 4.4 Spritesheet Specifications for Phaser

Phaser loads spritesheets with a defined frame size. Here are the exact specifications for each asset type:

| Asset | Sheet Size | Frame Size | Phaser Load Call |
|-------|-----------|-----------|-----------------|
| Player Walk | 128×192 px | 32×48 | `this.load.spritesheet('player', 'player.png', { frameWidth: 32, frameHeight: 48 })` |
| NPC Idle | 64×192 px | 32×48 | `this.load.spritesheet('npc_name', 'npc.png', { frameWidth: 32, frameHeight: 48 })` |
| Tileset | 512×512 px (16x16 grid) | 32×32 | `this.load.image('tileset_name', 'tileset.png')` // loaded via tilemap |
| Portraits | 192×64 px (3 expressions) | 64×64 | `this.load.spritesheet('portrait', 'portrait.png', { frameWidth: 64, frameHeight: 64 })` |

### 4.5 Feeding Assets to AI IDE for Context

To help the AI IDE (Cursor/Claude Code) understand your visual assets and generate correct code:

1. Create an `AI_CONTEXT.md` file in your `docs/` folder that describes every spritesheet: file path, frame dimensions, animation names, and frame indices.
2. Include a `TILESET_MAP.md` that documents each tile index and what it represents (e.g., tile 0 = grass, tile 14 = road edge, tile 32 = wall top).
3. Keep a `SPRITE_REGISTRY.json` that maps character names to their spritesheet paths, frame counts, and animation definitions — the AI can read this to generate correct Phaser animation code.
4. Screenshot your Tiled maps and include them in `docs/` so the AI can visually reference level layouts when generating scene code.
5. Maintain an `ASSET_CHECKLIST.md` tracking which assets exist, which need creation, and which are placeholders.

---

## 5. Dialogue and Quest System

### 5.1 Dialogue Data Format

Dialogues are stored as JSON files in `src/data/dialogues/`. Each file represents one NPC's dialogue tree or one quest's conversation flow:

```json
{
  "id": "auto_driver_airport",
  "speaker": "Auto Driver",
  "portrait": "auto_driver_default",
  "nodes": {
    "start": {
      "text": "Where to, boss? Whitefield? Koramangala? Anywhere!",
      "choices": [
        { "text": "HSR Layout PG (show address)", "next": "negotiate" },
        { "text": "How much to Koramangala?", "next": "koramangala_price" },
        { "text": "(Walk away)", "next": "exit", "effect": { "stress": 5 } }
      ]
    },
    "negotiate": {
      "text": "HSR Layout? 800 rupees. Fixed rate.",
      "choices": [
        {
          "text": "That's too much! 400?",
          "next": "haggle",
          "requires": { "skill": "negotiation", "level": 1 }
        },
        { "text": "Okay fine.", "next": "accept_high", "effect": { "money": -800 } },
        { "text": "I'll use the meter.", "next": "meter_response" }
      ]
    }
  }
}
```

### 5.2 Quest Data Format

Quests are defined in `src/data/quests/` as JSON files:

```json
{
  "id": "chapter1_arrive",
  "title": "Welcome to Namma Bengaluru",
  "description": "Find your luggage, get cash, and reach your PG.",
  "objectives": [
    { "id": "get_luggage", "text": "Collect luggage from baggage claim", "type": "interact", "target": "luggage_belt" },
    { "id": "get_cash", "text": "Withdraw money from ATM", "type": "interact", "target": "atm" },
    { "id": "get_auto", "text": "Negotiate an auto to your PG", "type": "dialogue", "target": "auto_driver_airport" }
  ],
  "rewards": { "xp": 50, "items": ["city_map"], "unlocks": ["pg_scene"] }
}
```

---

## 6. Audio Design

### 6.1 Music

Each area has a unique looping background track in a GBA-inspired chiptune style. Tracks should be 1–3 minutes long, loopable, and exported as .ogg for web compatibility.

| Area | Mood | Tempo | Instruments |
|------|------|-------|------------|
| Title Screen | Hopeful, adventurous | Medium (110 BPM) | Lead synth, warm pad, light percussion |
| Airport | Anxious excitement, bustling | Medium-fast (120 BPM) | Bright arpeggios, ambient crowd SFX layer |
| PG Interior | Cozy, slightly melancholy | Slow (80 BPM) | Soft piano-like synth, subtle bass |
| Neighborhood | Lively, chaotic, colorful | Fast (130 BPM) | Punchy bass, tabla-like percussion, flute lead |
| Interview | Tense, corporate | Medium (100 BPM) | Minimal, pulsing bass, staccato strings |
| Boss Theme | Intense, high stakes | Fast (140 BPM) | Aggressive lead, fast arpeggios, heavy drums |

### 6.2 Sound Effects

Use jsfxr or Chiptone to generate retro-style sound effects. Key SFX needed for MVP:

- **UI:** menu select, menu confirm, menu cancel, dialogue advance, dialogue choice
- **Player:** footstep (4 variants), door open, item pickup, level up jingle
- **Combat:** hit, dodge, success, fail, confidence meter change
- **Ambient:** crowd murmur, auto horn, bird chirp, phone notification

---

## 7. Development Roadmap

### 7.1 Phase 1: Foundation (Weeks 1–2)

1. Initialize project: Vite + TypeScript + Phaser 3 boilerplate
2. Configure Phaser game instance: 640×360, pixel art mode, scale settings
3. Implement BootScene with asset preloader and loading bar
4. Implement TitleScene with animated pixel art title and New Game / Continue buttons
5. Create Player entity class with 4-directional movement and collision
6. Build basic tilemap loading from Tiled .tmj exports
7. Implement camera follow with deadzone
8. Create placeholder sprites (colored rectangles) for all entity types

### 7.2 Phase 2: Core Systems (Weeks 3–4)

1. Build StatsManager: energy, stress, money tracking with events
2. Build HUD overlay: stat bars, money display, quest tracker
3. Build DialogueManager: JSON loader, typewriter text, choice selection
4. Build DialogueBox UI: portrait, text area, choice buttons
5. Build QuestManager: objective tracking, completion detection, rewards
6. Build InventoryManager: item database, add/remove, use effects
7. Build SaveManager: serialize all manager states to localStorage
8. Build CharacterSelectScene: background picker with stat preview

### 7.3 Phase 3: Content (Weeks 5–8)

- Create all MVP pixel art assets (AI-generated + manual cleanup)
- Build Airport tilemap in Tiled, implement AirportScene with tutorial flow
- Build PG tilemap and scene: room, NPCs, save point, food system
- Build Neighborhood tilemap and scene: shops, side quests, auto QTE
- Build Interview tilemap and scene: 3-phase boss encounter
- Write all MVP dialogue trees (15–20 NPCs)
- Write all MVP quest data (5–8 quests)
- Implement SkillTreeManager and skill tree UI

### 7.4 Phase 4: Polish (Weeks 9–10)

- Scene transitions (fade, slide, bus ride animation)
- Audio integration: area music, SFX, ambient sounds
- Menu system: pause menu, inventory screen, skill tree, quest log
- Mobile touch controls overlay (virtual D-pad + action buttons)
- Capacitor wrapper for Android/iOS builds
- Performance optimization: texture atlases, lazy loading, object pooling
- Playtesting, bug fixing, balance tuning

### 7.5 Future Phases (Post-MVP)

- Chapter 2: First Day at Work — office environment, coworker dynamics
- Chapter 3: Career Growth — promotions, networking events, conference
- Side content: weekend exploration, dating subplot, competitive shooting hobby
- Multiplayer: trade items with friends, compare career progress leaderboards
- Community content: player-submitted quest mods via JSON quest format

---

## 8. Implementation Quick-Start Guide

### 8.1 Project Initialization

```bash
npm create vite@latest namma-quest -- --template vanilla-ts
cd namma-quest
npm install phaser@3.80
npm install -D typescript @types/node
```

### 8.2 Phaser Config (src/main.ts)

```typescript
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false }
  },
  scene: [BootScene, TitleScene],
};

new Phaser.Game(config);
```

### 8.3 Key Phaser Patterns

**Scene Lifecycle:** Each scene implements `preload()` for asset loading, `create()` for initialization, and `update()` for per-frame logic. Use `this.scene.start('SceneName')` to transition between scenes.

**Tilemap Integration:** Load .tmj files with `this.load.tilemapTiledJSON()`. Create layers with `map.createLayer()`. Use the Collision layer with `map.setCollisionByProperty()` to define walkable areas.

**Entity-Component Pattern:** Each game entity (Player, NPC, Interactable) extends `Phaser.GameObjects.Sprite` and implements its own update logic. Use the Phaser physics system for movement and collision detection.

### 8.4 AI IDE Context File Template

Place this in `docs/AI_CONTEXT.md` for your AI IDE to reference:

```markdown
# Namma Quest — AI IDE Context

## Project Overview
- Engine: Phaser 3.80+, TypeScript, Vite
- Resolution: 480x270, pixelArt: true
- Tiles: 16x16, Characters: 16x32
- Architecture: Scene-based with singleton managers

## File Conventions
- Scenes: src/scenes/*.ts (PascalCase, extends Phaser.Scene)
- Entities: src/entities/*.ts (PascalCase, extends Phaser.GameObjects.Sprite)
- Managers: src/systems/*.ts (PascalCase, singleton pattern)
- Data: src/data/**/*.json (snake_case)
- Assets: public/assets/{sprites,tilesets,tilemaps,ui,audio,portraits}/

## Sprite Registry
- player.png: 64x128, frames 16x32 (4 cols x 4 rows: down/left/right/up)
- [add each spritesheet here with exact specs]

## Tileset Registry
- airport_tiles.png: 256x256, 16x16 grid
  - 0-15: floor tiles, 16-31: walls, 32-47: furniture, 48-63: decorations
- [add each tileset with tile index map]
```

---

## 9. Success Metrics

### 9.1 MVP Completion Criteria

- Player can create a character (choose background, name)
- Player can navigate all 4 MVP areas with working collision
- Dialogue system works with branching choices and stat effects
- Quest system tracks and completes at least 5 quests
- Stats (energy, stress, money) are tracked, displayed, and affect gameplay
- At least 1 QTE encounter (auto negotiation) is fully functional
- Interview boss encounter is playable and has win/lose states
- Game saves and loads from localStorage
- Works on Chrome, Firefox, Safari (desktop and mobile)
- Mobile touch controls are usable

### 9.2 Quality Targets

| Metric | Target |
|--------|--------|
| Frame Rate | Stable 60 FPS on mid-range devices |
| Load Time | Under 3 seconds on 4G connection |
| Bundle Size | Under 5 MB total (including all assets) |
| MVP Play Time | 30–45 minutes for a complete playthrough |
| Accessibility | Keyboard, mouse, touch, and gamepad support |

---

## 10. Appendix

### 10.1 Reference Games

- **Dragon Ball Z: Buu's Fury (GBA)** — combat, progression, visual style
- **Earthbound (SNES)** — modern-setting RPG tone, humor, emotional depth
- **Stardew Valley** — daily life management, NPC relationships, cozy-but-deep systems
- **Undertale** — creative non-combat encounters, memorable characters
- **Coffee Talk** — urban slice-of-life narrative, diverse cast

### 10.2 Key External Resources

- Phaser 3 Documentation: https://phaser.io/docs
- Tiled Map Editor: https://www.mapeditor.org/
- Aseprite (pixel art): https://www.aseprite.org/
- PixelLab.ai (AI pixel art): https://www.pixellab.ai/
- jsfxr (retro SFX): https://sfxr.me/
- Chiptone (SFX): https://sfbgames.itch.io/chiptone
- Capacitor (mobile): https://capacitorjs.com/

### 10.3 Bangalore Cultural Reference Sheet

Key terms, locations, and cultural details for authentic game content:

| Term | Meaning / Context | Game Usage |
|------|-------------------|-----------|
| Namma | "Our" in Kannada | Game title, used by NPCs to say "Namma Bengaluru" |
| PG | Paying Guest accommodation | Player's home base |
| Auto | Auto-rickshaw, primary transport | Transport system, negotiation encounters |
| BMTC | Bangalore Metropolitan Transport Corporation | Bus system for area transitions |
| Darshini | Standing-only quick-service restaurant | Food location, energy restoration |
| Chai | Tea, the universal social lubricant | Cheap energy restore item, conversation starter |
| Filter Coffee | South Indian style drip coffee | Premium energy restore, cultural quest item |
| Silk Board | Infamous traffic junction | Referenced in NPC dialogue, traffic mission |
| Koramangala | Popular neighborhood for young professionals | Future expansion area |
| HSR Layout | Residential area near tech parks | Neighborhood map area |
| Whitefield / ORR | IT corridor, tech park concentration | Interview location area |

---

*End of Document — Namma Quest PRD v1.0*
