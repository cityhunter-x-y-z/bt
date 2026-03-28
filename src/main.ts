import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { AirportScene } from './scenes/AirportScene';
import { GAME_WIDTH, GAME_HEIGHT } from './utils/constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  backgroundColor: '#0f172a',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,   // CSS handles centering
  },
  render: {
    pixelArt: true,
    antialias: false,
    antialiasGL: false,
    roundPixels: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, CharacterSelectScene, AirportScene],
};

const game = new Phaser.Game(config);

// Force crisp rendering after game creation
game.events.on('ready', () => {
  const canvas = game.canvas;
  canvas.style.imageRendering = 'pixelated';

  const gl =
    (canvas.getContext('webgl2') as WebGLRenderingContext | null) ||
    (canvas.getContext('webgl') as WebGLRenderingContext | null);

  if (gl) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  }
});
