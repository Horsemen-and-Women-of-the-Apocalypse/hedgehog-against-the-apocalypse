import { MAP_SIZE, TILE_SIZE_PX } from "@/constants";

export default class Chunk {
  constructor(scene, y) {
    this.scene = scene;
    this.y = y;
    this.sprites = [];
    for (let x = 0; x < MAP_SIZE.width; x ++) {
      const sprite = this.scene.add.sprite(x * TILE_SIZE_PX, this.y * TILE_SIZE_PX, 'grass');
      sprite.setScale(32 / 100);
      sprite.setOrigin(0, 0);
      this.sprites.push(sprite);
    }
  }

  move() {
    this.sprites.forEach(sprite => {
      sprite.setY(sprite.y + MAP_SIZE.height * TILE_SIZE_PX)
    });
  }

  unload() {
    this.sprites.forEach(sprite => sprite.destroy());
  }
}
