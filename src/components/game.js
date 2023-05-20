import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import City from "../objects/city";
import Chunk from '../objects/chunk';

import { TILE_SIZE_PX, MAP_SIZE, DIRECTIONS, SCROLL_SPEED } from "@/constants";

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
    this.load.image('grass', 'assets/sprites/grass.png');

    this.scrollDistance = 0;
  }

  create() {
    // Create entities
    this.city = new City(this);
    this.hedgehog = new Hedgehog(MAP_SIZE.width / 2, 15, 0, this);
    this.cameraTarget = this.add.sprite(this.hedgehog.getPosition().x * TILE_SIZE_PX, 500, '');

    this.chunks = [];
    for (let y = 0; y < MAP_SIZE.height; y ++) {
      this.chunks.push(new Chunk(this, y))
    }
    this.chunks[0].move(0);

    // Create map
    this.resetMap();

    // Camera
    this.cameras.main.startFollow(this.cameraTarget, true, 0.05, 0.05);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBackgroundColor("#000000");
    this.cameras.main.setBounds(
      0,
      0,
      TILE_SIZE_PX * MAP_SIZE.width,
        Number.POSITIVE_INFINITY
    );

    // Inputs

    this.movementCursors = this.input.keyboard.createCursorKeys();
  }

  resetMap() {
    // Creating an empty map
    this.map = this.make.tilemap({
      tileWidth: TILE_SIZE_PX,
      tileHeight: TILE_SIZE_PX,
      width: MAP_SIZE.width,
      height: Number.POSITIVE_INFINITY
    });

    this.city.resetGrid()
  }

  update() {
    this.scrollDistance += SCROLL_SPEED;

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

    if(!(this.scrollDistance % TILE_SIZE_PX)) {
      const step = this.scrollDistance / TILE_SIZE_PX,
            rowToScroll = step % MAP_SIZE.height;

      if (this.chunks[rowToScroll]) {
        this.chunks[rowToScroll].move();
      }

      this.city.nextRow();
    }

    this.cameraTarget.setPosition(this.hedgehog.getPosition().x * TILE_SIZE_PX, this.scrollDistance + 500)
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
