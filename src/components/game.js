import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import City from "../objects/city";
import Chunk from '../objects/chunk';

import { TILE_SIZE_PX, MAP_SIZE, SCROLL_SPEED } from "@/constants";

const tilesets = {
  tiles: {
    name: "tiles",
    path: "/assets/sprites/nature/grass.jpg",
    nbImagesPerRow: 1,
    imageSize: [100, 100]
  },
};

const TILESET = tilesets.tiles;

class BoardScene extends Phaser.Scene {
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

    this.load.image('building_1_ani0', 'assets/sprites/city/Concrete_Tiles.jpg');
    this.load.image('building_1_ani1', 'assets/sprites/city/Building_1_0000.png');
    this.load.image('building_1_ani2', 'assets/sprites/city/Building_1_0001.png');
    this.load.image('grass', 'assets/sprites/nature/grass.jpg');

    this.scrollDistance = 0;
  }

  create() {
    this.anims.create({
      key: 'hedgehog',
      frames: [
          { key: 'hedgehog_ani0' },
          { key: 'hedgehog_ani1' },
      ],
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'building_1',
      frames: [
          { key: 'building_1_ani1' },
          { key: 'building_1_ani2', duration: 4000 },
      ],
      frameRate: 2,
      repeat: 0
    });

    // Create entities
    this.city = new City(this);
    this.hedgehog = new Hedgehog(MAP_SIZE.width / 2, 15, 0, this, 1, 100, 5);
    this.cameraTarget = this.add.sprite(this.hedgehog.position.x * TILE_SIZE_PX, 500, "");

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
    this.cameras.main.setBounds(0, 0, TILE_SIZE_PX * MAP_SIZE.width, Number.POSITIVE_INFINITY);

    // Physics
    this.physics.add.collider(this.hedgehog.sprite, this.city.spriteGroup);
    this.hedgehog.children.forEach((child) => {
      this.physics.add.collider(child.sprite, this.city.spriteGroup);
    });

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

    // Set target position
    const position = {
      x: this.input.activePointer.worldX,
      y: this.input.activePointer.worldY
    }

    this.hedgehog.setTargetPosition(position);

    // Update entities
    this.city.theCityIsGrowing(this.hedgehog);
    this.hedgehog.updatePosition();

    if(!(this.scrollDistance % TILE_SIZE_PX)) {
      const step = this.scrollDistance / TILE_SIZE_PX,
          rowToScroll = step % MAP_SIZE.height;

      if (this.chunks[rowToScroll]) {
        this.chunks[rowToScroll].move();
      }

      this.city.nextRow();
    }

    this.cameraTarget.setPosition(this.hedgehog.position.x, this.scrollDistance + 500)
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade'
  },
  pixelArt: true,
  fps: {
    min: 30,
    target: 60,
    forceSetTimeOut: true
  },
  scene: BoardScene
};



export { config };
