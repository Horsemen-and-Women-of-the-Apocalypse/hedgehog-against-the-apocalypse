import { CITY_HEADSTART, MAP_SIZE, TILE_SIZE_PX } from '@/constants';

// const INITIAL_BUILDING_PERCENTAGE = 0.00;
const BUILDING_GROWTH_PERCENTAGE = 0.001;

export default class City {

    /**
     * @param {*} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.step = 0;
        this.sprites = [];
        this.moveSpriteIterator = 0;
        this.spriteGroup = this.scene.physics.add.group();
    }

    resetGrid() {
        // Create a grid of size mapSize
        this.grid = [];
        // let centerX = Math.floor(MAP_SIZE.width / 2);
        // let centerY = Math.floor(MAP_SIZE.height / 2);

        for (let y = 0; y < MAP_SIZE.height; y++) {
            this.grid.push([]);
            for (let x = 0; x < MAP_SIZE.width; x++) {
                // By default, the grid is empty
                // Except for the initial buildings
                // And if it is close to the center
                this.grid[y].push(0);
                // if (Math.random() < INITIAL_BUILDING_PERCENTAGE) this.placeBuilding(x, y);
            }
        }

    }

    generateUniqueIntegers(maxValue, cardinality) {
        const generated = [Math.floor(Math.random() * maxValue)];

        while (generated.length < cardinality) {
            const rand = Math.floor(Math.random() * maxValue);

            if (!generated.includes(rand)) {
                generated.push(rand);
            }
        }

        return generated;
    }

    nextRow() {
        const newLayer = new Array(MAP_SIZE.width).fill(0),
            y = MAP_SIZE.height - 1;

        this.step++;

        this.grid.shift();
        this.grid.push(newLayer);

        const positions = this.generateUniqueIntegers(MAP_SIZE.width, 2);
        positions.forEach(x => {
            this.placeBuilding(x, y);
        })
    }

    placeBuilding(x, y) {
        const maxSprites = MAP_SIZE.width * MAP_SIZE.height / 2;

        if (this.grid[y][x] === 1) {
            return;
        }

        this.grid[y][x] = 1;

        if (this.sprites.length > maxSprites) {
            this.sprites[this.moveSpriteIterator].setPosition(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX);
            this.sprites[this.moveSpriteIterator].play('building_1');
            this.moveSpriteIterator = (this.moveSpriteIterator + 1) % maxSprites;
        } else {
            const sprite = this.scene.physics.add.sprite(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX, 'building_1_ani1')
            sprite.play('building_1');
            sprite.setScale(32 / 256);
            sprite.setImmovable();
            sprite.setOrigin(0, 0);
            sprite.on('animationcomplete', () => {
                this.spriteGroup.add(sprite);
            });

            this.sprites.push(sprite);
        }
    }

    theCityIsGrowing(hedgehog) {
        // Add a new building to the city next to an existing building
        // 1. Find all the empty cells next to a building

        for (let x = 0; x < MAP_SIZE.width; x++) {
            for (let y = 0; y < MAP_SIZE.height; y++) {
                if (this.grid[y][x] !== 0) {
                    const adjacentBuildings = this.getAdjacentBuildings(x, y);
                    // console.log(adjacentBuildings);
                    adjacentBuildings.forEach((buildingPos) => {
                        const time_to_grow = Math.random() < BUILDING_GROWTH_PERCENTAGE;
                        if (time_to_grow) {
                            this.placeBuilding(buildingPos.x, buildingPos.y);

                            // Check if the hedgehog is in the new building

                            for (let child of hedgehog.children) {
                                if (this.isHedgehogInBuilding(child, buildingPos.x, buildingPos.y)) {
                                    child.kill();
                                }
                            }

                            if (this.isHedgehogInBuilding(hedgehog, buildingPos.x, buildingPos.y)) {
                                hedgehog.kill();
                            }
                        }
                    })
                }
            }
        }
    }

    getAdjacentBuildings(x, y) {
        const adjacentBuildings = [];
        // Check all the 4 adjacent cells
        if (x > 0 && this.grid[y][x - 1] === 0) adjacentBuildings.push({ x: x - 1, y: y });
        if (x < MAP_SIZE.width - 1 && this.grid[y][x + 1] === 0) adjacentBuildings.push({ x: x + 1, y: y });
        if (y > 0 && this.grid[y - 1][x] === 0) adjacentBuildings.push({ x: x, y: y - 1 });
        if (y < MAP_SIZE.height - 1 && this.grid[y + 1][x] === 0) adjacentBuildings.push({ x: x, y: y + 1 });
        return adjacentBuildings;
    }

    isHedgehogInBuilding(hedgehog, x, y) { // Need to fix Position
        return hedgehog.position.x / TILE_SIZE_PX > x - 1 &&
            hedgehog.position.x / TILE_SIZE_PX < x + 1 &&
            hedgehog.position.y / TILE_SIZE_PX > y - 1 &&
            hedgehog.position.y / TILE_SIZE_PX < y + 1;
    }

    destroy() {
        this.layer.destroy();
    }
}
