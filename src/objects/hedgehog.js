import Position from "./position";
import { TILE_SIZE_PX, MAP_SIZE } from "../constants";

export default class Hedgehog {

    /**
     * 
     * @param {*} defaultX 
     * @param {*} defaultY 
     * @param {*} direction 0 - North 1 - East 2 - South 3 - West
     */
    constructor(defaultX, defaultY, direction, scene) {
        this.isAlive = true;
        this.direction = direction;
        this.position = new Position(defaultX, defaultY);
        this.sprite = scene.physics.add.sprite(this.position.x * TILE_SIZE_PX, this.position.y * TILE_SIZE_PX, 'hedgehog');
        this.sprite.setCircle(TILE_SIZE_PX / 2);

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

        // Check if the hedgehog is not out of the map
        if (this.position.x - 0.5 < 0) this.position.x = 0.5;
        if (this.position.y - 0.5 < 0) this.position.y = 0.5;
        if (this.position.x + 0.5 > MAP_SIZE[0]) this.position.x = MAP_SIZE[0] - 0.5;
        if (this.position.y + 0.5 > MAP_SIZE[1]) this.position.y = MAP_SIZE[1] - 0.5;

        if (this.sprite != undefined) {
            this.sprite.x = this.position.x * TILE_SIZE_PX;
            this.sprite.y = this.position.y * TILE_SIZE_PX;
        }
    }

    kill() {
        this.isAlive = false;
    }
}