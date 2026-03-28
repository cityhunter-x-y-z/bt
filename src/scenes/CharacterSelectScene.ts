import Phaser from 'phaser';
import type { PlayerBackground } from '../utils/constants';
import { SCENE_KEYS, GAME_WIDTH, PLAYER_BACKGROUNDS } from '../utils/constants';

/**
 * CharacterSelectScene: Two-phase character creation
 * Phase 1: Enter player name
 * Phase 2: Select educational background
 */
export class CharacterSelectScene extends Phaser.Scene {
  static readonly KEY = SCENE_KEYS.CHARACTER_SELECT;

  private playerName = '';
  private selectedBackground: PlayerBackground | null = null;
  private cursorVisible = true;
  private cursorTimer: Phaser.Time.TimerEvent | null = null;
  private nameInputText!: Phaser.GameObjects.Text;
  private keyboardListener: ((event: KeyboardEvent) => void) | null = null;

  // For background selection grid
  private selectedCardIndex = 0;
  private backgroundCards: Phaser.GameObjects.Container[] = [];

  constructor() {
    super(CharacterSelectScene.KEY);
  }

  create(): void {
    // Ensure camera rounds pixels for crisp rendering
    this.cameras.main.setRoundPixels(true);

    this.cameras.main.setBackgroundColor('#0f172a');
    this.initializePhase1();
  }

  /**
   * Phase 1: Name entry
   */
  private initializePhase1(): void {
    this.playerName = '';
    this.cursorVisible = true;

    // Header
    const greeting = 'Welcome to Bengaluru!';
    this.add.text(GAME_WIDTH / 2, 30, greeting, {
      font: 'bold 12px monospace',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);

    // Input box
    const inputBox = this.add.rectangle(GAME_WIDTH / 2, 70, 160, 20, 0x1e293b);
    inputBox.setStrokeStyle(1, 0x3b82f6);

    // Name text display
    this.nameInputText = this.add.text(GAME_WIDTH / 2, 70, '', {
      font: '10px monospace',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);

    // Instruction
    this.add.text(GAME_WIDTH / 2, 100, 'Type your name and press Enter', {
      font: '7px monospace',
      color: '#64748b',
      align: 'center',
    }).setOrigin(0.5);

    // Cursor blink
    this.cursorTimer = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.cursorVisible = !this.cursorVisible;
        this.updateNameDisplay();
      },
      loop: true,
    });

    // Keyboard input
    this.setupPhase1Input();
  }

  /**
   * Setup keyboard input for name entry phase
   */
  private setupPhase1Input(): void {
    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
    }

    this.keyboardListener = (event: KeyboardEvent) => {
      const key = event.key;

      // Letters, numbers, spaces
      if (/[a-zA-Z0-9 ]/.test(key) && this.playerName.length < 12) {
        this.playerName += key;
        this.updateNameDisplay();
      }

      // Backspace
      if (key === 'Backspace') {
        this.playerName = this.playerName.slice(0, -1);
        this.updateNameDisplay();
      }

      // Enter to proceed
      if (key === 'Enter' && this.playerName.length > 0) {
        this.proceedToPhase2();
      }
    };

    window.addEventListener('keydown', this.keyboardListener);
  }

  /**
   * Update the name display with cursor
   */
  private updateNameDisplay(): void {
    const displayText = this.playerName + (this.cursorVisible ? '_' : '');
    this.nameInputText.setText(displayText);
  }

  /**
   * Transition to Phase 2: Background selection
   */
  private proceedToPhase2(): void {
    // Cleanup phase 1
    if (this.cursorTimer) {
      this.cursorTimer.destroy();
      this.cursorTimer = null;
    }

    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
      this.keyboardListener = null;
    }

    // Fade out and transition
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.children.removeAll();
      this.cameras.main.fadeIn(300, 0, 0, 0);
      this.initializePhase2();
    });
  }

  /**
   * Phase 2: Background selection
   */
  private initializePhase2(): void {
    this.selectedCardIndex = 0;
    this.backgroundCards = [];

    // Header
    const header = `${this.playerName}, what did you study?`;
    this.add.text(GAME_WIDTH / 2, 16, header, {
      font: '10px monospace',
      color: '#f8fafc',
      align: 'center',
    }).setOrigin(0.5);

    // Create background cards in 2x2 grid
    const backgrounds = Object.entries(PLAYER_BACKGROUNDS);
    const cardWidth = 100;
    const cardHeight = 50;
    const gap = 12;
    const gridWidth = cardWidth * 2 + gap;
    const startX = (GAME_WIDTH - gridWidth) / 2;
    const startY = 50;

    backgrounds.forEach(([backgroundKey, backgroundData], index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * (cardWidth + gap) + cardWidth / 2;
      const y = startY + row * (cardHeight + gap) + cardHeight / 2;

      const card = this.createBackgroundCard(
        backgroundKey as PlayerBackground,
        backgroundData,
        x,
        y,
        cardWidth,
        cardHeight,
        index
      );

      this.backgroundCards.push(card);
    });

    // Setup input
    this.setupPhase2Input();
    this.updateBackgroundSelection();
  }

  /**
   * Create a background card UI
   */
  private createBackgroundCard(
    key: PlayerBackground,
    data: typeof PLAYER_BACKGROUNDS[PlayerBackground],
    x: number,
    y: number,
    width: number,
    height: number,
    index: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Background rectangle (border)
    const rect = this.add.rectangle(0, 0, width, height, 0x1e293b);
    rect.setStrokeStyle(1, 0x334155);
    container.add(rect);

    // Store rect for selection updates
    (container as any).rect = rect;

    // Label (background name)
    const label = this.add.text(0, -15, data.label, {
      font: 'bold 8px monospace',
      color: '#f8fafc',
      align: 'center',
      wordWrap: { width: width - 4 },
    }).setOrigin(0.5);
    container.add(label);

    // Description
    const description = this.add.text(0, 0, data.description, {
      font: '6px monospace',
      color: '#94a3b8',
      align: 'center',
      wordWrap: { width: width - 4 },
    }).setOrigin(0.5);
    container.add(description);

    // Bonus text
    const bonusKeys = Object.keys(data.statBonuses);
    const bonusText = bonusKeys.map((k) => `+${(data.statBonuses as any)[k]} ${k}`).join(', ');
    const bonus = this.add.text(0, 13, bonusText, {
      font: '6px monospace',
      color: '#3b82f6',
      align: 'center',
      wordWrap: { width: width - 4 },
    }).setOrigin(0.5);
    container.add(bonus);

    // Mouse interaction
    rect.setInteractive({ useHandCursor: true });
    rect.on('pointerover', () => {
      this.selectedCardIndex = index;
      this.updateBackgroundSelection();
    });
    rect.on('pointerdown', () => {
      this.confirmBackgroundSelection();
    });

    // Store the background key
    (container as any).backgroundKey = key;

    return container;
  }

  /**
   * Setup keyboard input for background selection phase
   */
  private setupPhase2Input(): void {
    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
    }

    this.keyboardListener = (event: KeyboardEvent) => {
      const key = event.key;

      // Arrow key navigation (2x2 grid)
      if (key === 'ArrowUp') {
        this.selectedCardIndex = Math.max(0, this.selectedCardIndex - 2);
      } else if (key === 'ArrowDown') {
        this.selectedCardIndex = Math.min(3, this.selectedCardIndex + 2);
      } else if (key === 'ArrowLeft') {
        if (this.selectedCardIndex % 2 === 1) {
          this.selectedCardIndex -= 1;
        }
      } else if (key === 'ArrowRight') {
        if (this.selectedCardIndex % 2 === 0) {
          this.selectedCardIndex += 1;
        }
      }

      // Confirm selection
      if (key === 'Enter' || key === ' ') {
        this.confirmBackgroundSelection();
      }

      this.updateBackgroundSelection();
    };

    window.addEventListener('keydown', this.keyboardListener);
  }

  /**
   * Update background card selection styling
   */
  private updateBackgroundSelection(): void {
    this.backgroundCards.forEach((card, index) => {
      const rect = (card as any).rect as Phaser.GameObjects.Rectangle;

      if (index === this.selectedCardIndex) {
        rect.setStrokeStyle(2, 0x3b82f6);
        rect.setFillStyle(0x1e3a5f);
      } else {
        rect.setStrokeStyle(1, 0x334155);
        rect.setFillStyle(0x1e293b);
      }
    });
  }

  /**
   * Confirm the selected background and finish character creation
   */
  private confirmBackgroundSelection(): void {
    const selectedCard = this.backgroundCards[this.selectedCardIndex];
    this.selectedBackground = (selectedCard as any).backgroundKey;

    // Flash animation on selected card
    const rect = (selectedCard as any).rect as Phaser.GameObjects.Rectangle;
    this.tweens.add({
      targets: rect,
      alpha: { from: 1, to: 0.5 },
      duration: 150,
      yoyo: true,
      repeat: 2,
    });

    // Store in global registry
    this.registry.set('playerName', this.playerName);
    this.registry.set('playerBackground', this.selectedBackground);

    // Cleanup
    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
      this.keyboardListener = null;
    }

    // Transition to Airport
    this.time.delayedCall(600, () => {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENE_KEYS.AIRPORT);
      });
    });
  }

  /**
   * Cleanup on scene shutdown
   */
  shutdown(): void {
    if (this.cursorTimer) {
      this.cursorTimer.destroy();
      this.cursorTimer = null;
    }

    if (this.keyboardListener) {
      window.removeEventListener('keydown', this.keyboardListener);
      this.keyboardListener = null;
    }
  }
}
