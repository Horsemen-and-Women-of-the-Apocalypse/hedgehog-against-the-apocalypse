import Position from "./position";

export default class Hedgehog {

    /**
     * 
     * @param {*} defaultX 
     * @param {*} defaultY 
     * @param {*} direction 0 - North 1 - East 2 - South 3 - West
     */
    constructor(defaultX, defaultY, direction) {
        this.isAlive = true;
        this.direction = direction;
        this.position = new Position(defaultX, defaultY);
    }

    getPosition() {
        return this.position;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    isAlive() {
        return this.isAlive;
    }
}