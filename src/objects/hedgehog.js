import Position from "./position";
import { TILE_SIZE_PX, MAP_SIZE } from "../constants";
import Phaser from "phaser";

export default class Hedgehog {

    SPEED = 0;
    SPEED_MIN = 20;
    SPEED_MAX = 150;

    children = []

    /**
     * 
     * @param {*} defaultX 
     * @param {*} defaultY 
     * @param {*} direction 0 - North 1 - East 2 - South 3 - West
     * @param {*} scene
     */
    constructor(defaultX, defaultY, direction, scene, scale, speed, childNumber) {
        this.SPEED = speed;
        this.scene = scene;
        this.isAlive = true;
        this.direction = direction;
        this.target = new Position(defaultX, defaultY);
        this.position = new Position(defaultX, defaultY);

        // Add the physics sprite
        this.sprite = this.scene.physics.add.sprite(defaultX * TILE_SIZE_PX, defaultY * TILE_SIZE_PX, 'hedgehog_ani0')
        const hedgehogLayer = this.scene.add.layer();
        hedgehogLayer.setDepth(1);
        hedgehogLayer.add(this.sprite);
        this.sprite.setSize(25, 25);
        this.sprite.setScale(scale / 4);
        this.sprite.setCircle(25);

        for (let i = 0; i < childNumber; i++) {
            this.children.push(new Hedgehog(MAP_SIZE[0] / 2, 10 + i, 0, this.scene, 0.5, 80));
        }

    }

    getPosition() {
        return this.position;
    }

    setTargetPosition(position) {
        if (!this.isAlive) {
            console.log("Hedgehog is dead");
            return
        }

        for (let i = 0; i < this.children.length; i++) {
            if (i == 0) {
                this.children[i].setTargetPosition(this.position);
            } else {
                this.children[i].setTargetPosition(this.children[i - 1].position);
            }
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

    updatePosition(isChild) {
        // Get sprite position

        for (let child of this.children) {
            child.updatePosition(true);
        }

        const spriteX = this.sprite.x / TILE_SIZE_PX;
        const spriteY = this.sprite.y / TILE_SIZE_PX;

        const distance = Phaser.Math.Distance.Between(spriteX, spriteY, this.target.x, this.target.y);



        if (distance < 0.4) {

            if (isChild) {
                this.SPEED = this.SPEED_MIN;
            }

            // stop the sprite
            this.scene.physics.moveTo(this.sprite, spriteX, spriteY, 0);
            this.sprite.stop('hedgehog');
            return;
        } else {
            if (isChild) {
                if (this.SPEED + 0.7 * distance > this.SPEED_MAX) {
                    this.SPEED = this.SPEED_MAX;
                } else {
                    this.SPEED = this.SPEED + (distance > 0.4 ? 0.7 * distance : -0.7 * distance);
                }
            }
            // Play the animation if the animation is not already playing
            if (!this.sprite.anims.isPlaying) this.sprite.play('hedgehog');
        }

        // Apply the velocity
        this.scene.physics.moveTo(
            this.sprite,
            this.target.x * TILE_SIZE_PX,
            this.target.y * TILE_SIZE_PX,
            this.SPEED
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
