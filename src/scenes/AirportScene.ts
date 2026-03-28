import Phaser from 'phaser';
import { SCENE_KEYS, TILE_SIZE, DEPTH, CAMERA_DEADZONE_X, CAMERA_DEADZONE_Y } from '../utils/constants';
import { Player } from '../entities/Player';

/**
 * AirportScene: First game area using Tiled map editor file
 * Loads airport_interior.tmj with 8 tilesets, 5 layers, and 7 spawn points
 * Player arrives at Kempegowda International Airport, tutorial zone
 */
export class AirportScene extends Phaser.Scene {
  static readonly KEY = SCENE_KEYS.AIRPORT;

  private player!: Player;
  private npcs: Phaser.GameObjects.Sprite[] = [];
  private map!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super(AirportScene.KEY);
  }

  create(): void {
    // Ensure camera rounds pixels for crisp rendering
    this.cameras.main.setRoundPixels(true);

    // ─────────────────────────────────────────────────────────────
    // Load the tilemap
    // ─────────────────────────────────────────────────────────────
    this.map = this.make.tilemap({ key: 'airport_map' });

    // ─────────────────────────────────────────────────────────────
    // Register ALL 8 tilesets (names from .tmj file)
    // ─────────────────────────────────────────────────────────────
    const tilesets: Phaser.Tilemaps.Tileset[] = [];

    const ts1 = this.map.addTilesetImage('airport', 'airport');
    if (ts1) tilesets.push(ts1);

    const ts2 = this.map.addTilesetImage('wall', 'wall');
    if (ts2) tilesets.push(ts2);

    const ts3 = this.map.addTilesetImage('skirting', 'skirting');
    if (ts3) tilesets.push(ts3);

    const ts4 = this.map.addTilesetImage('airport-exitgate', 'airport-exitgate');
    if (ts4) tilesets.push(ts4);

    const ts5 = this.map.addTilesetImage('tourist-info-desk', 'tourist-info-desk');
    if (ts5) tilesets.push(ts5);

    const ts6 = this.map.addTilesetImage('luggage-belt', 'luggage-belt');
    if (ts6) tilesets.push(ts6);

    const ts7 = this.map.addTilesetImage('objects', 'objects');
    if (ts7) tilesets.push(ts7);

    const ts8 = this.map.addTilesetImage('shops', 'shops');
    if (ts8) tilesets.push(ts8);

    console.log(`✓ Registered ${tilesets.length} tilesets`);

    // ─────────────────────────────────────────────────────────────
    // Create all 5 layers (names MUST match .tmj exactly)
    // ─────────────────────────────────────────────────────────────
    const groundLayer = this.map.createLayer('Ground', tilesets);
    const wallsLayer = this.map.createLayer('Walls', tilesets);
    const objectsLayer = this.map.createLayer('Objects', tilesets);
    const collisionLayer = this.map.createLayer('Collision', tilesets);
    const abovePlayerLayer = this.map.createLayer('Above Player', tilesets); // NOTE: space!

    // Set depth for rendering order
    if (groundLayer) groundLayer.setDepth(DEPTH.GROUND);
    if (wallsLayer) wallsLayer.setDepth(DEPTH.WALLS);
    if (objectsLayer) objectsLayer.setDepth(DEPTH.OBJECTS);
    if (abovePlayerLayer) abovePlayerLayer.setDepth(DEPTH.ABOVE_PLAYER);

    // Collision layer: invisible, tile 108 = solid (non-zero = collide)
    if (collisionLayer) {
      collisionLayer.setVisible(false);
      // Any non-zero tile collides
      collisionLayer.setCollisionByExclusion([-1, 0]);
    }

    console.log('✓ Created 5 layers');

    // ─────────────────────────────────────────────────────────────
    // Spawn the player
    // ─────────────────────────────────────────────────────────────
    let playerX = 318;
    let playerY = 164;

    const spawns = this.map.getObjectLayer('Spawns');
    if (spawns) {
      const playerSpawn = spawns.objects.find((obj) => obj.name === 'player_spawn');
      if (playerSpawn) {
        playerX = playerSpawn.x!;
        playerY = playerSpawn.y!;
        console.log(`✓ Found player_spawn at (${playerX}, ${playerY})`);
      }
    }

    this.player = new Player(this, playerX, playerY);
    this.player.setDepth(DEPTH.ENTITIES);

    // Collide player with collision layer
    if (collisionLayer) {
      this.physics.add.collider(this.player, collisionLayer);
    }

    // ─────────────────────────────────────────────────────────────
    // Spawn NPCs from spawn points
    // ─────────────────────────────────────────────────────────────
    this.npcs = [];
    if (spawns) {
      spawns.objects.forEach((obj) => {
        const x = obj.x!;
        const y = obj.y!;
        const name = obj.name!;

        switch (name) {
          case 'receptionist':
            this.createNPC(x, y, 'receptionist', {
              speaker: 'Receptionist',
              text: 'Welcome to Bengaluru! The exit is straight ahead. You\'ll find taxis and auto-rickshaws outside.',
            });
            break;

          case 'helper':
            this.createNPC(x, y, 'helper', {
              speaker: 'Airport Helper',
              text: `You look new here. Need help finding your way? The chai stall has the best cutting chai in the airport!`,
            }, 0x22c55e);
            break;

          case 'gaurd': // NOTE: Spelled 'gaurd' in .tmj!
            this.createNPC(x, y, 'gaurd', {
              speaker: 'Security Guard',
              text: 'Keep your luggage with you at all times. The auto stand is to the right past the shops.',
            }, 0x64748b);
            break;

          case 'shopkeeper_1':
          case 'shopkeeper_2':
            this.createNPC(x, y, 'shopkeeper', {
              speaker: 'Shopkeeper',
              text: 'Need anything for the road? We have water, snacks, phone chargers. Bangalore traffic is no joke — stock up!',
            }, 0xf59e0b);
            break;

          case 'zone_exit':
            // Exit zone: 3×3 tile area (96×96 pixels)
            const exitZone = this.add.zone(x, y, TILE_SIZE * 3, TILE_SIZE * 3);
            this.physics.add.existing(exitZone, true);
            this.physics.add.overlap(this.player, exitZone, () => {
              console.log('Player reached exit zone');
              // TODO: Transition to PG scene
              // this.cameras.main.fadeOut(500);
              // this.cameras.main.once('camerafadeoutcomplete', () => {
              //   this.scene.start(SCENE_KEYS.PG);
              // });
            });
            break;
        }
      });
      console.log(`✓ Created ${this.npcs.length} NPCs`);
    }

    // ─────────────────────────────────────────────────────────────
    // Camera setup
    // ─────────────────────────────────────────────────────────────
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(CAMERA_DEADZONE_X, CAMERA_DEADZONE_Y);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Physics world bounds
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody && playerBody.setBounce) {
      playerBody.setBounce(0);
      playerBody.setCollideWorldBounds(true);
    }

    console.log(`✓ Map: ${this.map.width}×${this.map.height} tiles (${this.map.widthInPixels}×${this.map.heightInPixels} px)`);
  }

  update(): void {
    this.player.update();

    // Depth sort: lower Y = rendered later (on top)
    this.player.setDepth(DEPTH.ENTITIES + this.player.y / this.map.heightInPixels);

    // NPC depth sorting
    this.npcs.forEach(npc => {
      npc.setDepth(DEPTH.ENTITIES + npc.y / this.map.heightInPixels);
    });
  }

  /**
   * Create an NPC at a spawn point
   */
  private createNPC(
    x: number,
    y: number,
    id: string,
    dialogue: { speaker: string; text: string },
    tint?: number
  ): void {
    const npc = this.add.sprite(x, y, 'npc_placeholder');
    npc.setDepth(DEPTH.ENTITIES);
    if (tint) npc.setTint(tint);
    npc.setData('npcId', id);
    npc.setData('dialogue', dialogue);
    this.npcs.push(npc);
  }
}
