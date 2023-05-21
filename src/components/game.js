import Phaser from "phaser";
import Hedgehog from "../objects/hedgehog";
import City from "../objects/city";
import Chunk from '../objects/chunk';

import { TILE_SIZE_PX, MAP_SIZE, SCROLL_SPEED } from "@/constants";

const nbWalkingSounds = 9;
const nbBuildingSounds = 21;
const nbDeathSounds = 4;

const data = {
  year: 2023,
  score: 0,
  gameOver: false,
  childRemaining: 5,
}

class BoardScene extends Phaser.Scene {
  constructor() {
    super("BoardScene");
  }
  preload() {
    // Load tileset
    this.load.image('hedgehog_ani0', 'assets/sprites/animals/Hedgehog0000.png');
    this.load.image('hedgehog_ani1', 'assets/sprites/animals/Hedgehog0001.png');

    this.load.image('concrete', 'assets/sprites/city/concrete.jpg');

    this.load.image('building_ani0', 'assets/sprites/city/Building01.png');
    this.load.image('city0', 'assets/sprites/city/city0.png');
    this.load.image('city1', 'assets/sprites/city/city1.png');
    this.load.image('city2', 'assets/sprites/city/city2.png');
    this.load.image('city3', 'assets/sprites/city/city3.png');

    this.load.image('grass', 'assets/sprites/nature/grass.jpg');
    this.load.image('flower', 'assets/sprites/nature/Flowers_Tiles.jpg');
    this.load.image('bush', 'assets/sprites/nature/Bush_Grass.jpg');

    // Load sound effects
    for (let i = 1; i < nbWalkingSounds; i++)
      this.load.audio(`walk_${i}`, [`assets/soundEffects/walk/${i}.wav`]);
    for (let i = 1; i < nbBuildingSounds; i++)
      this.load.audio(`build_${i}`, [`assets/soundEffects/build/${i}.wav`]);
    for (let i = 1; i < nbDeathSounds; i++)
      this.load.audio(`death_${i}`, [`assets/soundEffects/death/${i}.wav`]);


    this.scrollDistance = 0;
  }

  create() {
    // Reset data
    data.year = 2023;
    data.score = 0;
    data.gameOver = false;
    data.childRemaining = 5;

    this.input.setDefaultCursor("url('assets/sprites/target.png')16 16, pointer");

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
      key: 'building_0',
      frames: [
        { key: 'building_ani0', duration: 2000 },
        { key: 'city0' },
      ],
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'building_1',
      frames: [
        { key: 'building_ani0', duration: 2000 },
        { key: 'city1' },
      ],
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'building_2',
      frames: [
        { key: 'building_ani0', duration: 2000 },
        { key: 'city2' },
      ],
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'building_3',
      frames: [
        { key: 'building_ani0', duration: 2000 },
        { key: 'city3' },
      ],
      frameRate: 10,
      repeat: 0
    });

    // Create entities
    this.hedgehog = new Hedgehog(MAP_SIZE.width / 2, 15, this, 1, 100, data.childRemaining, 0);
    this.city = new City(this, this.hedgehog);
    this.cameraTarget = this.add.sprite(this.hedgehog.position.x * TILE_SIZE_PX, 500, "");

    this.chunks = [];
    for (let y = 0; y < MAP_SIZE.height; y++) {
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
    // Add vignette
    this.vignetteFx = this.cameras.main.postFX.addVignette(0.5, 0.5, 1, 0.5);

    // Physics
    this.physics.add.collider(this.hedgehog.sprite, this.city.spriteGroup);
    this.hedgehog.children.forEach((child) => {
      this.physics.add.collider(child.sprite, this.city.spriteGroup);
    });

    // Create sounds
    this.walkSounds = [];
    this.buildSounds = [];
    this.deathSounds = [];
    for (let i = 1; i < nbWalkingSounds; i++)
      this.walkSounds.push(this.sound.add(`walk_${i}`));
    for (let i = 1; i < nbBuildingSounds; i++) {
      this.buildSounds.push(this.sound.add(`build_${i}`));
      this.buildSounds[i - 1].setVolume(0.5);
      this.buildSounds[i - 1].setRate(1.5);
      this.buildSounds[i - 1].setDetune(-1000);
    }
    for (let i = 1; i < nbDeathSounds; i++)
      this.deathSounds.push(this.sound.add(`death_${i}`));
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

    if (!data.gameOver) this.hedgehog.setTargetPosition(position);

    // Update entities
    this.city.theCityIsGrowing();
    this.hedgehog.updatePosition(false);

    // Scroll map
    if (!(this.scrollDistance % TILE_SIZE_PX)) {
      const step = this.scrollDistance / TILE_SIZE_PX,
        rowToScroll = step % MAP_SIZE.height;

      if (this.chunks[rowToScroll]) {
        this.chunks[rowToScroll].move(step);
      }

      this.city.nextRow();
    }

    // Scroll camera
    this.cameraTarget.setPosition(this.hedgehog.position.x, this.scrollDistance + 500);

    // Kill hedgehog if out of map
    const animals = [this.hedgehog, ...this.hedgehog.children]
    animals.forEach((hedgehog) => {
      if (this.scrollDistance > hedgehog.position.y && hedgehog.isAlive) hedgehog.kill();
    });


    // Update data (scores, gameOver)
    if (!data.gameOver) this.updateData();
  }

  updateData() {
    const stepScore = this.scrollDistance / TILE_SIZE_PX
    const year = Math.floor(stepScore / 3) + 2023;
    data.year = year
    data.score = stepScore * 10

    // Check if game is over
    // Game over conditions:
    // - Hedgehog is dead
    // - No more childrens (´･_･`) 
    if (!this.hedgehog.isAlive) data.gameOver = true
    const aliveHedgehogChildren = this.hedgehog.children.filter((child) => child.isAlive)
    if (!aliveHedgehogChildren.length) data.gameOver = true
    data.childRemaining = aliveHedgehogChildren.length
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



export { config, data };
