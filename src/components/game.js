import Phaser from "phaser";


const tilesets = {
  tiles: {
    name: "tiles",
    path: "/assets/sprites/grass.png",
    nbImagesPerRow: 1,
    imageSize: [32, 32]
  },
};

const TILESET = tilesets.tiles;


class BoardScene extends Phaser.Scene {
  MAP_SIZE = [25, 20];
  map = null

  constructor() {
    super("BoardScene");
  }
  preload() {
    // Load tileset
    this.load.spritesheet(TILESET.name, TILESET.path, {
      frameWidth: TILESET.imageSize[0],
      frameHeight: TILESET.imageSize[1]
    });
  }

  create() {
    // Add your game logic and scene setup here
    // Create map
    this.map = this.make.tilemap({
      tileWidth: TILESET.imageSize[0],
      tileHeight: TILESET.imageSize[1],
      width: this.MAP_SIZE[0],
      height: this.MAP_SIZE[1]
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: BoardScene
};

const game = new Phaser.Game(config);

// Set up resize event listener to adapt to window size changes
window.addEventListener("resize", () => {
  const { innerWidth, innerHeight } = window;
  game.scale.resize(innerWidth, innerHeight);
});

export { game };
