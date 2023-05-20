import Position from "./position";
import { TILE_SIZE_PX } from "../constants";
import Phaser from "phaser";

export default class Hedgehog {

    SPEED = 0.05;

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
        this.sprite = this.scene.add.sprite(direction.x, direction.y, 'hedgehog');

        const hedgehogLayer = scene.add.layer();
        hedgehogLayer.setDepth(1);

        hedgehogLayer.add(this.sprite);
        this.move(this.position);
    }

    getPosition() {
        return this.position;
    }

    move(position) {

        if (!this.isAlive) {
            console.log("Hedgehog is dead");
            return
        }

        if (this.sprite == undefined) {
            console.log("Sprite is undefined");
            return
        }

        const deltax = position.x * this.SPEED;
        const deltay = position.y * this.SPEED;

        this.target.x += deltax;
        this.target.y += deltay;

        let angle = Phaser.Math.Angle.Between(this.target.x,this.target.y,this.position.x,this.position.y);
        this.sprite.rotation = angle + 270 * (3.14 / 180);

        this.position.x = this.target.x * 0.1 + this.position.x * 0.9;
        this.position.y = this.target.y * 0.1 + this.position.y * 0.9;

        this.sprite.x = this.position.x * TILE_SIZE_PX;
        this.sprite.y = this.position.y * TILE_SIZE_PX;
    }

    kill(){
        this.isAlive = false;
    }
}