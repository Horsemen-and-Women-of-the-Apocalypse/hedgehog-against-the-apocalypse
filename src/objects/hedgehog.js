import Position from "./position";

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
        this.sprite = scene.add.sprite(direction.x, direction.y, 'hedgehog');

        const hedgehogLayer = scene.add.layer();
        hedgehogLayer.setDepth(1);

        hedgehogLayer.add(this.sprite);
    }

    getPosition() {
        return this.position;
    }

    move(position) {
        const deltax = position.x * 5
        const deltay = position.y * 5
        if(this.sprite != undefined) {
            this.sprite.x += deltax;
            this.sprite.y += deltay;
        }
    }

    isAlive() {
        return this.isAlive;
    }
}