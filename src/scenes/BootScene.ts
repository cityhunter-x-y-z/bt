import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

/**
 * BootScene: Asset preloading with loading bar
 * - Displays loading progress as assets load
 * - Generates placeholder textures for development (colored rectangles)
 * - Creates idle animations for player character
 * - Transitions to TitleScene when complete
 */
export class BootScene extends Phaser.Scene {
  static readonly KEY = SCENE_KEYS.BOOT;

  private loadingBarFill!: Phaser.GameObjects.Rectangle;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super(BootScene.KEY);
  }

  preload(): void {
    // Create loading bar UI
    this.createLoadingBar();

    // Listen to load progress
    this.load.on('progress', (value: number) => {
      this.loadingBarFill.width = value * 200; // Fill 0-200px
    });

    this.load.on('complete', () => {
      this.loadingText.setText('Ready!');
    });

    // Load player spritesheet (128×192, 4 cols × 4 rows, each frame 32×48)
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 32,
      frameHeight: 48,
    });

    // Load Tiled map
    this.load.tilemapTiledJSON('airport_map', 'assets/tilemaps/airport_interior.tmj');

    // Load all 8 tilesets (names MUST match "name" field in airport_interior.tmj)
    this.load.image('airport', 'assets/tilesets/airport.png');
    this.load.image('wall', 'assets/tilesets/wall.png');
    this.load.image('skirting', 'assets/tilesets/skirting.png');
    this.load.image('airport-exitgate', 'assets/tilesets/airport-exitgate.png');
    this.load.image('tourist-info-desk', 'assets/tilesets/tourist-info-desk.png');
    this.load.image('luggage-belt', 'assets/tilesets/luggage-belt.png');
    this.load.image('objects', 'assets/tilesets/objects.png');
    this.load.image('shops', 'assets/tilesets/shops.png');

    // Load procedural tileset placeholder (for fallback)
    this.load.image('airport_tiles', 'assets/tilesets/airport_tiles.png');
  }

  create(): void {
    // Force NEAREST filter on all textures for crisp pixel rendering
    this.setAllTexturesNearest();

    // Generate placeholder textures for development
    this.createPlaceholderTextures();

    // Create idle animations for player
    this.createIdleAnimations();

    // Transition to TitleScene after a brief delay (show the loading bar)
    this.time.delayedCall(300, () => {
      this.scene.start(SCENE_KEYS.TITLE);
    });
  }

  /**
   * Set all textures to use NEAREST filter for crisp pixel-perfect rendering
   * This ensures no bilinear/trilinear smoothing at the texture level
   */
  private setAllTexturesNearest(): void {
    // Iterate through all loaded textures and set to NEAREST
    Object.values(this.textures.list).forEach((texture) => {
      if (texture && typeof texture.setFilter === 'function') {
        texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });
  }

  /**
   * Create the loading bar UI
   */
  private createLoadingBar(): void {
    const centerX = GAME_WIDTH / 2;
    const centerY = GAME_HEIGHT / 2;

    // Background (204x16)
    const bgBar = this.add.rectangle(centerX, centerY - 20, 204, 16, 0x1e293b);
    bgBar.setStrokeStyle(1, 0x64748b);

    // Fill bar (starts at 0 width)
    this.loadingBarFill = this.add.rectangle(
      centerX - 100,
      centerY - 20,
      0,
      12,
      0x3b82f6
    );
    this.loadingBarFill.setOrigin(0, 0.5);

    // Loading text
    this.loadingText = this.add.text(
      centerX,
      centerY + 15,
      'Loading...',
      {
        font: '8px monospace',
        color: '#94a3b8',
        align: 'center',
      }
    );
    this.loadingText.setOrigin(0.5);
  }

  /**
   * Create placeholder textures for development
   */
  private createPlaceholderTextures(): void {
    // Player placeholder: 16x32 blue with yellow head
    this.createCharacterPlaceholder('player_placeholder', 0x3b82f6);

    // NPC placeholder: 16x32 green with yellow head
    this.createCharacterPlaceholder('npc_placeholder', 0x22c55e);

    // Item/Interactable placeholder: 16x16 yellow
    this.createItemPlaceholder('item_placeholder', 0xf59e0b);

    // Tile placeholders: 16x16 with grid
    this.createTilePlaceholder('tile_floor', 0x94a3b8);
    this.createTilePlaceholder('tile_wall', 0x475569);
    this.createTilePlaceholder('tile_grass', 0x22c55e);
    this.createTilePlaceholder('tile_road', 0x64748b);
  }

  /**
   * Create a character placeholder: 32x48 rectangle with head, body, and legs
   */
  private createCharacterPlaceholder(key: string, bodyColor: number): void {
    const gfx = this.add.graphics();

    // Head: 16x12 yellow at top
    gfx.fillStyle(0xfbbf24);
    gfx.fillRect(8, 0, 16, 12);

    // Torso: 24x30
    gfx.fillStyle(bodyColor);
    gfx.fillRect(4, 6, 24, 30);

    // Left leg: 8x12
    gfx.fillStyle(0x1e293b);
    gfx.fillRect(6, 36, 8, 12);

    // Right leg: 8x12
    gfx.fillRect(18, 36, 8, 12);

    gfx.generateTexture(key, 32, 48);
    gfx.destroy();
  }

  /**
   * Create an item placeholder: 32x32 square
   */
  private createItemPlaceholder(key: string, color: number): void {
    const gfx = this.add.graphics();

    gfx.fillStyle(color);
    gfx.fillRect(0, 0, 32, 32);

    gfx.generateTexture(key, 32, 32);
    gfx.destroy();
  }

  /**
   * Create a tile placeholder: 32x32 square with subtle grid
   */
  private createTilePlaceholder(key: string, color: number): void {
    const gfx = this.add.graphics();

    // Fill
    gfx.fillStyle(color);
    gfx.fillRect(0, 0, 32, 32);

    // Subtle grid line at 0.3 alpha
    gfx.lineStyle(1, 0x1e293b, 0.3);
    gfx.strokeRect(0, 0, 32, 32);

    gfx.generateTexture(key, 32, 32);
    gfx.destroy();
  }

  /**
   * Create walk and idle animations for each direction
   * Spritesheet layout: 64×128 = 4 cols × 4 rows
   * Row 0 (frames 0-3): Walk Down, Row 1 (frames 4-7): Walk Left
   * Row 2 (frames 8-11): Walk Right, Row 3 (frames 12-15): Walk Up
   * Each row: [stride-left, idle, stride-right, idle-duplicate]
   */
  private createIdleAnimations(): void {
    // Walk animations (4 frames each at 8 fps = 0.5 sec per cycle)
    this.anims.create({
      key: 'player-walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    // Idle animations (single frame: frame 1=down, 5=left, 9=right, 13=up)
    this.anims.create({
      key: 'player-idle-down',
      frames: [{ key: 'player', frame: 1 }],
      frameRate: 1,
    });

    this.anims.create({
      key: 'player-idle-left',
      frames: [{ key: 'player', frame: 5 }],
      frameRate: 1,
    });

    this.anims.create({
      key: 'player-idle-right',
      frames: [{ key: 'player', frame: 9 }],
      frameRate: 1,
    });

    this.anims.create({
      key: 'player-idle-up',
      frames: [{ key: 'player', frame: 13 }],
      frameRate: 1,
    });
  }
}
