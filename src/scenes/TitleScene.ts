import Phaser from 'phaser';
import { SCENE_KEYS, GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

/**
 * TitleScene: Main menu screen
 * - Displays Bangalore city skyline silhouette
 * - Menu with "New Game", "Continue", "Settings"
 * - Keyboard and mouse input support
 */
export class TitleScene extends Phaser.Scene {
  static readonly KEY = SCENE_KEYS.TITLE;

  private selectedIndex = 0;
  private menuItems: Phaser.GameObjects.Text[] = [];
  private menuOptions = ['New Game', 'Continue', 'Settings'];

  constructor() {
    super(TitleScene.KEY);
  }

  create(): void {
    // Ensure camera rounds pixels for crisp rendering
    this.cameras.main.setRoundPixels(true);

    // Dark background
    this.cameras.main.setBackgroundColor('#0f172a');

    // Decorative city skyline
    this.createSkyline();

    // Title and subtitle
    this.createTitleText();

    // Menu
    this.createMenu();

    // Input
    this.setupInput();
  }

  /**
   * Draw Bangalore cityscape silhouette with simple rectangles
   */
  private createSkyline(): void {
    // Building heights and positions (approximate cityscape)
    const buildings = [
      { x: 20, width: 24, height: 45 },
      { x: 50, width: 20, height: 35 },
      { x: 75, width: 28, height: 55 },
      { x: 110, width: 22, height: 40 },
      { x: 140, width: 26, height: 50 },
      { x: 175, width: 24, height: 38 },
      { x: 205, width: 28, height: 48 },
      { x: 240, width: 20, height: 42 },
      { x: 268, width: 26, height: 52 },
      { x: 300, width: 24, height: 46 },
      { x: 335, width: 28, height: 54 },
      { x: 370, width: 22, height: 40 },
      { x: 400, width: 26, height: 50 },
      { x: 435, width: 20, height: 36 },
    ];

    // Draw buildings (dark slate color)
    buildings.forEach((building) => {
      this.add.rectangle(
        building.x,
        GAME_HEIGHT - building.height / 2 - 8, // Position above ground line
        building.width,
        building.height,
        0x1e293b
      );
    });

    // Ground line (8px tall, full width)
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 4, GAME_WIDTH, 8, 0x334155);
  }

  /**
   * Create title and subtitle text
   */
  private createTitleText(): void {
    // Title: "NAMMA QUEST"
    this.add.text(GAME_WIDTH / 2, 50, 'NAMMA QUEST', {
      font: 'bold 24px monospace',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);

    // Subtitle: "A Bengaluru Story"
    this.add.text(GAME_WIDTH / 2, 72, 'A Bengaluru Story', {
      font: '8px monospace',
      color: '#94a3b8',
      align: 'center',
    }).setOrigin(0.5);

    // Auto-rickshaw emoji
    this.add.text(GAME_WIDTH / 2, 105, '🛺', {
      font: '24px Arial',
      align: 'center',
    }).setOrigin(0.5);

    // Footer: version and controls
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 12, 'v0.1.0 | Arrow Keys + Enter', {
      font: '6px monospace',
      color: '#475569',
      align: 'center',
    }).setOrigin(0.5);
  }

  /**
   * Create the menu with three options
   */
  private createMenu(): void {
    const startY = 145;
    const gap = 22;

    this.menuOptions.forEach((option, index) => {
      const text = this.add.text(GAME_WIDTH / 2, startY + index * gap, option, {
        font: '10px monospace',
        color: '#64748b',
        align: 'center',
      }).setOrigin(0.5);

      // Add interactivity
      text.setInteractive({ useHandCursor: true });

      // Hover to select
      text.on('pointerover', () => {
        this.selectedIndex = index;
        this.updateMenuDisplay();
      });

      // Click to confirm
      text.on('pointerdown', () => {
        this.confirmSelection();
      });

      this.menuItems.push(text);
    });

    // Initial display
    this.updateMenuDisplay();
  }

  /**
   * Setup keyboard input for menu navigation
   */
  private setupInput(): void {
    const cursors = this.input.keyboard?.createCursorKeys();
    const keys = this.input.keyboard?.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    if (cursors) {
      cursors.up.on('down', () => this.moveSelection(-1));
      cursors.down.on('down', () => this.moveSelection(1));
    }

    if (keys) {
      (keys as any).w.on('down', () => this.moveSelection(-1));
      (keys as any).s.on('down', () => this.moveSelection(1));
      (keys as any).enter.on('down', () => this.confirmSelection());
      (keys as any).space.on('down', () => this.confirmSelection());
    }
  }

  /**
   * Move menu selection up or down (with wrap-around)
   */
  private moveSelection(direction: number): void {
    this.selectedIndex += direction;
    this.selectedIndex = Phaser.Math.Wrap(this.selectedIndex, 0, this.menuOptions.length);
    this.updateMenuDisplay();
  }

  /**
   * Update menu display based on selectedIndex
   */
  private updateMenuDisplay(): void {
    this.menuItems.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.setColor('#f8fafc');
        item.setText(`> ${this.menuOptions[index]} <`);
      } else {
        item.setColor('#64748b');
        item.setText(this.menuOptions[index]);
      }
    });
  }

  /**
   * Execute menu selection
   */
  private confirmSelection(): void {
    const action = this.menuOptions[this.selectedIndex];

    switch (action) {
      case 'New Game':
        this.startNewGame();
        break;
      case 'Continue':
        // TODO: Check SaveManager.hasSave() and load if exists
        console.log('Continue selected (not implemented)');
        break;
      case 'Settings':
        // TODO: Navigate to settings scene
        console.log('Settings selected (not implemented)');
        break;
    }
  }

  /**
   * Start a new game with fade transition
   */
  private startNewGame(): void {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
    });
  }
}
