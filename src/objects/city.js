import {CITY_HEADSTART, MAP_SIZE, TILE_SIZE_PX} from '@/constants';

const SIZE_OF_SQUARE_FREE_OF_BUILDINGS = 5;
const INITIAL_BUILDING_PERCENTAGE = 0.01;
const BUILDING_GROWTH_PERCENTAGE = 0.001;

export default class City {

    /**
     * @param {*} scene
     */
    constructor(scene) {
        this.scene = scene;
        this.layer = this.scene.add.layer();
        this.layer.setDepth(1);
        this.step = 0;
        this.sprites = [];
        this.moveSpriteIterator = 0;
    }

    resetGrid() {
        // Create a grid of size mapSize
        this.grid = [];
        let centerX = Math.floor(MAP_SIZE.width / 2);
        let centerY = Math.floor(MAP_SIZE.height / 2);

        for (let y = 0; y < MAP_SIZE.height; y++) {
            this.grid.push([]);
            for (let x = 0; x < MAP_SIZE.width; x++) {
                // By default, the grid is empty
                // Except for the initial buildings
                // And if it is close to the center
                this.grid[y].push(0);
                if (Math.abs(x - centerX) < SIZE_OF_SQUARE_FREE_OF_BUILDINGS &&
                    Math.abs(y - centerY) < SIZE_OF_SQUARE_FREE_OF_BUILDINGS) {
                    continue;
                }

                if (Math.random() < INITIAL_BUILDING_PERCENTAGE) this.placeBuilding(x, y);
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

        this.step ++;

        this.grid.shift();
        this.grid.push(newLayer);

        const positions = this.generateUniqueIntegers(MAP_SIZE.width, 2);
        positions.forEach(x => {
            this.placeBuilding(x, y);
        })
    }

    placeBuilding(x, y) {
        const maxSprites = MAP_SIZE.width * MAP_SIZE.height;

        if (this.grid[y][x] === 1) {
            return;
        }

        this.grid[y][x] = 1;
        
        if(this.sprites.length > maxSprites) {
            this.sprites[this.moveSpriteIterator].setPosition(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX);
            this.moveSpriteIterator = (this.moveSpriteIterator + 1) % maxSprites;
        } else {
            const sprite = this.scene.add.sprite(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX, 'building');
            sprite.setOrigin(0, 0);
            this.layer.add(sprite);
            this.sprites.push(sprite);
        }
    }

    theCityIsGrowing(hedgehog) {
        // Add a new building to the city next to an existing building
        // 1. Find all the empty cells next to a building

        for (let x = 0; x < MAP_SIZE.width; x ++) {
            for (let y = 0; y < MAP_SIZE.height; y ++) {
                if (this.grid[y][x] !== 0) {
                    const adjacentBuildings = this.getAdjacentBuildings(x, y);
                    // console.log(adjacentBuildings);
                    adjacentBuildings.forEach((buildingPos) => {
                        const time_to_grow = Math.random() < BUILDING_GROWTH_PERCENTAGE;
                        if (time_to_grow) {
                            this.placeBuilding(buildingPos.x, buildingPos.y);

                            // Check if the hedgehog is in the new building
                            if (this.isHedgehogInBuilding(hedgehog, buildingPos.x, buildingPos.y)) {
                                console.log("Hedgehog is in the building");
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

    isHedgehogInBuilding(hedgehog, x, y) {
        return hedgehog.getPosition().x > x - 1 &&
            hedgehog.getPosition().x < x + 1 &&
            hedgehog.getPosition().y > y - 1 &&
            hedgehog.getPosition().y < y + 1;
    }
}