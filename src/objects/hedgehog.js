import Position from "./position";
import { TILE_SIZE_PX, MAP_SIZE } from "../constants";
import Phaser from "phaser";

export default class Hedgehog {

    SPEED = 0.08;

    /**
     * 
     * @param {*} defaultX 
     * @param {*} defaultY 
     * @param {*} direction 0 - North 1 - East 2 - South 3 - West
     * @param {*} scene
     */
    constructor(defaultX, defaultY, direction, scene) {
        this.scene = scene;
        this.isAlive = true;
        this.direction = direction;
        this.target = new Position(defaultX, defaultY);
        this.position = new Position(defaultX, defaultY);
        // Add the physics sprite
        this.sprite = scene.physics.add.sprite(defaultX * TILE_SIZE_PX, defaultY * TILE_SIZE_PX, 'hedgehog');
        const hedgehogLayer = scene.add.layer();
        hedgehogLayer.setDepth(1);
        hedgehogLayer.add(this.sprite);
    }

    getPosition() {
        return this.position;
    }

    setTargetPosition() {
        if (!this.isAlive) {
            console.log("Hedgehog is dead");
            return
        }

        const position = {
            x: this.scene.input.activePointer.worldX,
            y: this.scene.input.activePointer.worldY
        }

        // Check if the cursor is not out of the map
        let targetPositionX = position.x / (TILE_SIZE_PX);
        let targetPositionY = position.y / (TILE_SIZE_PX);
        if (targetPositionX < 0) targetPositionX = 0;
        if (targetPositionY < 0) targetPositionY = 0;
        if (targetPositionX > MAP_SIZE[0]) targetPositionX = MAP_SIZE[0];
        if (targetPositionY > MAP_SIZE[1]) targetPositionY = MAP_SIZE[1];

        // Update the target position
        this.target.x = targetPositionX;
        this.target.y = targetPositionY;


        // Update the direction of the hedgehog
        const spriteX = this.sprite.x / TILE_SIZE_PX;
        const spriteY = this.sprite.y / TILE_SIZE_PX;
        let angle = Phaser.Math.Angle.Between(targetPositionX, targetPositionY, spriteX, spriteY);
        this.sprite.rotation = angle + 270 * (3.14 / 180);
    }

    updatePosition() {
        // Get sprite position
        const spriteX = this.sprite.x / TILE_SIZE_PX;
        const spriteY = this.sprite.y / TILE_SIZE_PX;

        const distance = Phaser.Math.Distance.Between(spriteX, spriteY, this.target.x, this.target.y); // Tile distance
        if (distance < 0.7) {
            // stop the sprite
            this.scene.physics.moveTo(this.sprite, spriteX, spriteY, 0);
            return;
        }

        // Apply the velocity
        this.scene.physics.moveTo(
            this.sprite,
            this.target.x * TILE_SIZE_PX,
            this.target.y * TILE_SIZE_PX,
            // Insert speed here
        );

        // Update the position
        const newSpriteX = this.sprite.x;
        const newSpriteY = this.sprite.y;
        this.position.x = newSpriteX;
        this.position.y = newSpriteY;

    }
    kill() {
        this.isAlive = false;
    }
}