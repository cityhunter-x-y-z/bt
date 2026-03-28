import Phaser from 'phaser';
import type { Direction } from '../utils/types';
import { PLAYER_SPEED, PLAYER_RUN_SPEED, DEPTH, TILE_SIZE } from '../utils/constants';

/**
 * Player: The controllable character entity
 * - Handles movement with keyboard input (arrow keys or WASD)
 * - Supports running (SHIFT key)
 * - Plays directional walk/idle animations
 * - Supports interaction (E key)
 * - Can be frozen during dialogue/events
 */
export class Player extends Phaser.GameObjects.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private shiftKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;

  private currentDirection: Direction = 'down';
  private isMoving = false;
  private interactionEnabled = true;
  private interactionCallback: (() => void) | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Start with idle frame facing down (frame 1)
    super(scene, x, y, 'player', 1);

    // Add to scene and physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body
    // The 32×48 sprite has the character's head/torso in the top ~36px
    // and feet in the bottom ~12px, so body should be positioned there
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(20, 12); // Collision box: 20px wide (centered), 12px tall (feet level)
    body.setOffset(6, 35); // Offset: centered horizontally, positioned at feet
    body.setCollideWorldBounds(true);

    // Set depth layer
    this.setDepth(DEPTH.ENTITIES);

    // Setup keyboard input
    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.shiftKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.eKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Play initial idle animation
    this.playIdleAnim();
  }

  /**
   * Update player movement and input every frame
   * Called from the scene's update loop
   */
  update(): void {
    // If player is frozen (during dialogue, etc.), stop moving and return
    if (!this.interactionEnabled) {
      this.stopMoving();
      return;
    }

    // Read all directional inputs
    const isLeftDown =
      this.cursors.left!.isDown || this.wasdKeys.A.isDown;
    const isRightDown =
      this.cursors.right!.isDown || this.wasdKeys.D.isDown;
    const isUpDown =
      this.cursors.up!.isDown || this.wasdKeys.W.isDown;
    const isDownDown =
      this.cursors.down!.isDown || this.wasdKeys.S.isDown;

    // Determine movement speed
    const speed = this.shiftKey.isDown ? PLAYER_RUN_SPEED : PLAYER_SPEED;

    // Initialize velocity
    let velX = 0;
    let velY = 0;

    // Calculate velocity based on input
    if (isLeftDown) {
      velX = -speed;
      if (this.currentDirection !== 'left') {
        this.currentDirection = 'left';
      }
    }
    if (isRightDown) {
      velX = speed;
      if (this.currentDirection !== 'right') {
        this.currentDirection = 'right';
      }
    }
    if (isUpDown) {
      velY = -speed;
      if (this.currentDirection !== 'up') {
        this.currentDirection = 'up';
      }
    }
    if (isDownDown) {
      velY = speed;
      if (this.currentDirection !== 'down') {
        this.currentDirection = 'down';
      }
    }

    // Set velocity on physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(velX, velY);

    // Normalize diagonal movement (prevent faster diagonal movement)
    if (velX !== 0 && velY !== 0) {
      body.velocity.normalize().scale(speed);
    }

    // Update animation and movement state
    const isCurrentlyMoving = velX !== 0 || velY !== 0;
    if (isCurrentlyMoving) {
      this.isMoving = true;
      this.playWalkAnim();
    } else {
      this.isMoving = false;
      this.playIdleAnim();
    }

    // Check for interaction (E key press)
    if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      if (this.interactionCallback) {
        this.interactionCallback();
      }
    }
  }

  /**
   * Play walk animation for current direction
   * Only plays if not already playing that animation
   */
  private playWalkAnim(): void {
    const animKey = `player-walk-${this.currentDirection}`;
    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }
  }

  /**
   * Play idle animation for current direction
   * Only plays if not already playing that animation
   */
  private playIdleAnim(): void {
    const animKey = `player-idle-${this.currentDirection}`;
    if (this.anims.currentAnim?.key !== animKey) {
      this.play(animKey);
    }
  }

  /**
   * Stop movement and play idle animation
   */
  private stopMoving(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    this.isMoving = false;
    this.playIdleAnim();
  }

  /**
   * Get the player's current facing direction
   */
  getDirection(): Direction {
    return this.currentDirection;
  }

  /**
   * Check if player is currently moving
   */
  getIsMoving(): boolean {
    return this.isMoving;
  }

  /**
   * Freeze or unfreeze player movement (used during dialogue, etc.)
   */
  setInteractionEnabled(enabled: boolean): void {
    this.interactionEnabled = enabled;
  }

  /**
   * Register an interaction callback (triggered by E key)
   */
  onInteract(callback: () => void): void {
    this.interactionCallback = callback;
  }

  /**
   * Get the tile coordinate the player is facing
   * Returns the position one tile in the facing direction
   */
  getFacingPosition(): { x: number; y: number } {
    const tileX = Math.floor(this.x / TILE_SIZE);
    const tileY = Math.floor(this.y / TILE_SIZE);

    switch (this.currentDirection) {
      case 'up':
        return { x: tileX, y: tileY - 1 };
      case 'down':
        return { x: tileX, y: tileY + 1 };
      case 'left':
        return { x: tileX - 1, y: tileY };
      case 'right':
        return { x: tileX + 1, y: tileY };
    }
  }
}
