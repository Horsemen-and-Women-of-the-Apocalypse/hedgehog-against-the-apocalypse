import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import City from "../objects/city";
import { TILE_SIZE_PX, MAP_SIZE, SCROLL_SPEED } from "../constants";

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
    this.load.image('hedgehog_ani0', 'assets/sprites/animals/Hedgehog0000.png');
    this.load.image('hedgehog_ani1', 'assets/sprites/animals/Hedgehog0001.png');
    this.load.image('building', 'assets/sprites/building.png');

    this.scrollDistance = 0;
  }

  create() {
    
    // Create entities
    this.city = new City(MAP_SIZE, this);
    this.hedgehog = new Hedgehog(MAP_SIZE[0] / 2, 8, 0, this, 1, 100, 5);
    this.cameraTarget = this.add.sprite(this.hedgehog.getPosition().x * TILE_SIZE_PX, 200, "");

    // Create map
    this.resetMap();

    // Camera
    this.cameras.main.startFollow(this.cameraTarget, true, 0.05, 0.05);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBackgroundColor("#000000");
    this.cameras.main.setBounds(
      0,
      0,
      TILE_SIZE_PX * MAP_SIZE[0],
      Number.POSITIVE_INFINITY
    );

    // Physics
    this.physics.add.collider(this.hedgehog.sprite, this.city.testSprite);

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
    this.scrollDistance += SCROLL_SPEED;

    // Set target position
    const position = {
      x: this.input.activePointer.worldX,
      y: this.input.activePointer.worldY
    }

    this.hedgehog.setTargetPosition(position);

    // Update entities
    this.city.theCityIsGrowing(this.hedgehog);
    this.hedgehog.updatePosition();

    // Check end game
    // if (!this.hedgehog.isAlive) {
    // }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade'
  },
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
  game.destroy(true);
}

export { game };
