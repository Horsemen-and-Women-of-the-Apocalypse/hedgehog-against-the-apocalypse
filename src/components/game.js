import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import City from "../objects/city";
import { TILE_SIZE_PX, MAP_SIZE, DIRECTIONS } from "../constants";

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
    this.load.image('building', 'assets/sprites/building.png');
  }

  create() {

    // Create entities
    this.city = new City(MAP_SIZE, this);
    this.hedgehog = new Hedgehog(MAP_SIZE[0] / 2, MAP_SIZE[1] / 2, 0, this);

    // Create map
    this.resetMap();

    // Camera
    this.cameras.main.startFollow(this.hedgehog.sprite);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBackgroundColor("#000000");
    this.cameras.main.setBounds(
      0,
      0,
      TILE_SIZE_PX * MAP_SIZE[0],
      TILE_SIZE_PX * MAP_SIZE[1]
    );

    // Inputs

    this.movementCursors = this.input.keyboard.createCursorKeys();
  }

  resetMap() {
    // Creating an empty map
    this.map = this.make.tilemap({
      tileWidth: TILE_SIZE_PX,
      tileHeight: TILE_SIZE_PX,
      width: MAP_SIZE[0],
      height: MAP_SIZE[1]
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

    this.groundLayer = this.map.createBlankLayer(`groundLayer`, tiles);
    // Fill the layer with grass tiles
    this.groundLayer.fill(0, 0, 0, MAP_SIZE[0], MAP_SIZE[1]);
    this.groundLayer.setDepth(0);

    this.city.resetGrid()
  }

  update() {
    // Keyboard inputs
    if (this.movementCursors) {
      if (this.movementCursors.up.isDown) {
        this.hedgehog.move(DIRECTIONS.North);
      }
      if (this.movementCursors.right.isDown) {
        this.hedgehog.move(DIRECTIONS.East);
      }
      if (this.movementCursors.left.isDown) {
        this.hedgehog.move(DIRECTIONS.West);
      }
      if (this.movementCursors.down.isDown) {
        this.hedgehog.move(DIRECTIONS.South);
      }
    }

    // Update entities
    this.city.theCityIsGrowing(this.hedgehog);

    // Check end game
    if (!this.hedgehog.isAlive) {
      // this.resetMap()
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
  try {
    game.scale.resize(innerWidth, innerHeight);
  } catch (error) {
    console.error(error);
  }
});

window.onbeforeunload = function () {
  console.log("unloading window... try to unload cached images");
  game.cache.destroy();
  game.destroy(false);
}

export { game };
