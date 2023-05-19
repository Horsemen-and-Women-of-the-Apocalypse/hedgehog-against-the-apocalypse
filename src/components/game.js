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
const TILE_SIZE_PX = 32

class BoardScene extends Phaser.Scene {
  MAP_SIZE = [25, 20];
  map = null
  layers = []
  entities = []
  
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
    this.resetMap();
  }
  resetMap() {
    // Creating an empty map
    this.map = this.make.tilemap({
      tileWidth: TILE_SIZE_PX,
      tileHeight: TILE_SIZE_PX,
      width: this.MAP_SIZE[0],
      height: this.MAP_SIZE[1]
    });

    // Load tiles and reset layers
    const tiles = this.map.addTilesetImage(
      TILESET.name,
      undefined,
      TILE_SIZE_PX,
      TILE_SIZE_PX,
      0,
      0
    );

    // Reset layers
    this.layers.forEach(layer => {
      layer.destroy();
    });

    this.layers = [];
    for (let i = 0; i < 1; i++) {
      this.layers.push(this.map.createBlankLayer(`layer${i}`, tiles));
      // Fill the layer with empty tiles
      this.layers[i].fill(0, 0, 0, this.MAP_SIZE[0], this.MAP_SIZE[1]);
      this.layers[i].setDepth(i + 1);
    }

    // Reset entities
    this.entities.forEach(entity => {
      entity.sprite.destroy();
      entity.idleAnimation?.destroy();
      entity.runningAnimation?.destroy();
    });
    this.entities = [];
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
