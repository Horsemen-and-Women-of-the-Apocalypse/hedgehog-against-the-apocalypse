import { MAP_SIZE, TILE_SIZE_PX } from "@/constants";

export default class Chunk {
  constructor(scene, y) {
    this.scene = scene;
    this.y = y;
    this.sprites = [];
    for (let x = 0; x < MAP_SIZE.width; x ++) {
      const sprite = this.scene.add.sprite(x * TILE_SIZE_PX, this.y * TILE_SIZE_PX, this.getTexture());
      sprite.setScale(32 / 100);
      sprite.setOrigin(0, 0);
      this.sprites.push(sprite);
    }
  }

  move(step) {
    this.sprites.forEach(sprite => {

      const random = Math.floor(Math.random() * 100);    

      if(random < 0.2 + step/10) {
        sprite.setTexture('concrete');
      }
      sprite.setY(sprite.y + MAP_SIZE.height * TILE_SIZE_PX)
    });
  }

  unload() {
    this.sprites.forEach(sprite => sprite.destroy());
  }

  getTexture() {
    const random = Math.floor(Math.random() * 101);    
  
    if(random > 95) {
      return 'bush';
    } else if(random > 85) {
      return 'flower';
    } else {
      return 'grass';
    }
  }
}