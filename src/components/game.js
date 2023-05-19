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

// Events
const PLAYER_MOVE_EVENT_NAME = "playerMove";


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

    this.hedgehog = new Hedgehog(25, 25, 0);
    this.hedgehog.sprite = this.add.sprite(this.hedgehog.getPosition().x, this.hedgehog.getPosition().y, 'hedgehog');

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

    this.input.keyboard.on("keydown-UP", () => {
      console.log(DIRECTIONS.North);
      this.events.emit(PLAYER_MOVE_EVENT_NAME, DIRECTIONS.North);
    });
    this.input.keyboard.on("keydown-DOWN", () => {
      console.log(DIRECTIONS.South);
      this.events.emit(PLAYER_MOVE_EVENT_NAME, DIRECTIONS.South);
    });
    this.input.keyboard.on("keydown-LEFT", () => {
      console.log(DIRECTIONS.West);
      this.events.emit(PLAYER_MOVE_EVENT_NAME, DIRECTIONS.West);
    });
    this.input.keyboard.on("keydown-RIGHT", () => {
      console.log(DIRECTIONS.East);
      this.events.emit(PLAYER_MOVE_EVENT_NAME, DIRECTIONS.East);
    });
    this.events.on(PLAYER_MOVE_EVENT_NAME, (direction) => {

      console.log(this.hedgehog.position.x);
      console.log(direction.x);

      this.hedgehog.position.x += direction.x;
      this.hedgehog.position.y += direction.y;

      console.log("hedgehog moved to x :" + this.hedgehog.position.x + " y :" + this.hedgehog.position.y);
    });
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

    this.hedgehog.sprite = this.add.sprite(this.hedgehog.getPosition().x, this.hedgehog.getPosition().y, 'hedgehog');

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
  dealWithMouseDrag(pointer) {
    if (pointer.isDown) {
      this.input?.manager.setDefaultCursor("grabbing");
      this.cameras.main.scrollX -=
        (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
      this.cameras.main.scrollY -=
        (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
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
