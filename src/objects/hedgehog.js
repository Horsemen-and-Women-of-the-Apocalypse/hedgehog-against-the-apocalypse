import Position from "./position";
import { TILE_SIZE_PX } from "../constants";

export default class Hedgehog {

    /**
     * 
     * @param {*} defaultX 
     * @param {*} defaultY 
     * @param {*} direction 0 - North 1 - East 2 - South 3 - West
     * @param {*} scene
     */
    constructor(defaultX, defaultY, direction, scene) {
        this.isAlive = true;
        this.direction = direction;
        this.position = new Position(defaultX, defaultY);
        this.sprite = scene.add.sprite(direction.x, direction.y, 'hedgehog');

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

        const deltax = position.x * 0.15
        const deltay = position.y * 0.15
        this.position.x += deltax;
        this.position.y += deltay;
        if (this.sprite != undefined) {
            this.sprite.x = this.position.x * TILE_SIZE_PX;
            this.sprite.y = this.position.y * TILE_SIZE_PX;
        }
    }

    kill(){
        this.isAlive = false;
    }
}