import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import Position from "@/objects/position";

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

const DIRECTIONS = {
  North: new Position(0, -1),
  East: new Position(1, 0),
  South: new Position(0, 1),
  West: new Position(-1, 0),
}

class BoardScene extends Phaser.Scene {
  MAP_SIZE = [50, 50];
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
    this.load.image('hedgehog', 'assets/sprites/hedgehog.png');  
  }

  create() {

    // Create entities
    this.hedgehog = new Hedgehog(this.MAP_SIZE[0]/2, this.MAP_SIZE[1]/2, 0, this);

    // Create map
    this.resetMap();

    // Camera
    this.cameras.main.startFollow(this.hedgehog.sprite);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBackgroundColor("#000000");
    this.cameras.main.setBounds(
      0,
      0,
      TILE_SIZE_PX * this.MAP_SIZE[0],
      TILE_SIZE_PX * this.MAP_SIZE[1]
    );

    // Inputs

    this.movementCursors = this.input.keyboard.createCursorKeys();
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

    this.layers.push(this.map.createBlankLayer(`layer${0}`, tiles));
    this.layers[0].fill(0, 0, 0, this.MAP_SIZE[0], this.MAP_SIZE[1]);
    this.layers[0].setDepth(0);

    // Reset entities
    this.entities.forEach(entity => {
      entity.sprite.destroy();
      entity.idleAnimation?.destroy();
      entity.runningAnimation?.destroy();
    });
    this.entities = [];
  }

  update() {
    if(this.movementCursors) {
      if(this.movementCursors.up.isDown) {
        this.hedgehog.move(DIRECTIONS.North);
      } else if(this.movementCursors.right.isDown) {
        this.hedgehog.move(DIRECTIONS.East);
      } else if(this.movementCursors.left.isDown) {
        this.hedgehog.move(DIRECTIONS.West);
      } else if(this.movementCursors.down.isDown) {
        this.hedgehog.move(DIRECTIONS.South);
      }
    }
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
