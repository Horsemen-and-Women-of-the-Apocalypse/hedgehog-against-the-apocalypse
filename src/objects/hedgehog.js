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
        this.sprite = undefined;
    }

    getPosition() {
        return this.position;
    }

    move(position) {
        if(this.sprite != undefined) {
            this.x += position.x;
            this.y += position.y;
            this.sprite.x += position.x;
            this.sprite.y += position.y;
        }
    }

    isAlive() {
        return this.isAlive;
    }
}