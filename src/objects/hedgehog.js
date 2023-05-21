import Position from "./position";
import { TILE_SIZE_PX, MAP_SIZE } from "@/constants";
import Phaser from "phaser";

export default class Hedgehog {

    SPEED = 0;
    SPEED_MIN = 20;
    SPEED_MAX = 150;

    id = 0;
    children = []
    lostChildren = [];

    constructor(defaultX, defaultY, direction, scene, scale, speed, childNumber, id, parent) {
        this.parent = parent;
        this.id = id;
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
            this.children.push(new Hedgehog(defaultX, defaultY + i / 3, 0, this.scene, 0.5, 80, 0, i + 1, this));
        }
    }

    setTargetPosition(position) {
        if (!this.isAlive) {
            return;
        }

        for (let i = 0; i < this.children.length; i++) {
            if (i === 0) {
                this.children[i].setTargetPosition(this.position);
            } else {

                const distanceToMother = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.children[i].position.x, this.children[i].position.y);
                const distanceToBrother = Phaser.Math.Distance.Between(this.children[i - 1].position.x, this.children[i - 1].position.y, this.children[i].position.x, this.children[i].position.y);

                if (distanceToMother < distanceToBrother) {
                    this.children[i].setTargetPosition(this.position);
                } else {
                    this.children[i].setTargetPosition(this.children[i - 1].position);
                }
            }
        }

        for (let i = 0; i < this.lostChildren.length; i++) {
            const distanceToMother = Phaser.Math.Distance.Between(this.position.x, this.position.y, this.lostChildren[i].position.x, this.lostChildren[i].position.y);
            if (distanceToMother < 20) {

                const lostChild = this.lostChildren[i];

                lostChild.parent = this;
                lostChild.SPEED = 80;
                lostChild.setTargetPosition(this.position);
                lostChild.id = this.children.length + 1;
                lostChild.target == undefined;

                this.lostChildren.splice(i, 1);
                this.children.push(lostChild);     
            }

        }

        // Check if the cursor is not out of the map
        let targetPositionX = position.x / (TILE_SIZE_PX);
        let targetPositionY = position.y / (TILE_SIZE_PX);
        if (targetPositionX < 0) targetPositionX = 0;
        if (targetPositionY < 0) targetPositionY = 0;
        if (targetPositionX > MAP_SIZE.width) targetPositionX = MAP_SIZE.width;

        // Update the target position
        this.target.x = targetPositionX;
        this.target.y = targetPositionY;

        // Update the direction of the hedgehog
        const spriteX = this.sprite.x / TILE_SIZE_PX;
        const spriteY = this.sprite.y / TILE_SIZE_PX;
        let angle = Phaser.Math.Angle.Between(targetPositionX, targetPositionY, spriteX, spriteY);
        this.sprite.rotation = angle + 270 * (3.14 / 180);
    }

    updatePosition(isChild, isLost) {
        // Get sprite position
        for (let child of this.children) {
            child.updatePosition(true, false);
        }

        for (let lostchild of this.lostChildren) {
            lostchild.updatePosition(false, true);
        }

        if(isLost && this.target) {
            this.SPEED = 20;

            const position = {
                x: this.position.x,
                y: this.position.y + 100
            }

            this.setTargetPosition(position);
        }

        if (!this.isAlive) return;

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
            if (!this.sprite?.anims?.isPlaying) this.sprite.play('hedgehog');
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
    kill(lost) {

        this.isAlive = false;
        if(lost) {
            if (this.parent) {
                this.parent.died(this.id, lost);
            }
        } else {
            if (this.parent) {
                this.parent.died(this.id);
            }
        }
        
        this.sprite.destroy();
    }

    died(id, lost) {
        if(lost) {
            const index = this.lostChildren.findIndex(child => child.id == id);
            this.lostChildren.splice(index, 1);
        } else {
            const index = this.children.findIndex(child => child.id == id);
            this.children.splice(index, 1);
        } 
    }
}
