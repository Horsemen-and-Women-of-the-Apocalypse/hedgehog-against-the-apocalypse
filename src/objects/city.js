import { TILE_SIZE_PX } from "../constants";

const SIZE_OF_SQUARE_FREE_OF_BUILDINGS = 5;
const INITIAL_BUILDING_PERCENTAGE = 0.21;
const BUILDING_GROWTH_PERCENTAGE = 0.0001;

export default class City {

    /**
     * @param {*} mapSize 
     */
    constructor(mapSize, scene) {
        this.scene = scene;
        this.mapSize = mapSize;
        this.layer = this.scene.add.layer();
        this.layer.setDepth(1);
        this.testSprite = this.scene.add.sprite(0, 0, 'building');
        this.testSprite.setOrigin(0, 0);
        this.scene.physics.world.enable(this.testSprite);
        this.testSprite.body.setImmovable(true);
        this.layer.add(this.testSprite);
    }

    resetGrid() {
        // Create a grid of size mapSize
        this.grid = [];
        this.nbBuildings = 0;
        let centerX = Math.floor(this.mapSize[0] / 2);
        let centerY = Math.floor(this.mapSize[1] / 2);

        for (let i = 0; i < this.mapSize[0]; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.mapSize[1]; j++) {
                // By default, the grid is empty
                // Except for the initial buildings
                // And if it is close to the center
                this.grid[i][j] = 0;
                if (Math.abs(i - centerX) < SIZE_OF_SQUARE_FREE_OF_BUILDINGS &&
                    Math.abs(j - centerY) < SIZE_OF_SQUARE_FREE_OF_BUILDINGS) {
                    continue;
                }

                if (Math.random() < INITIAL_BUILDING_PERCENTAGE) this.placeBuilding(i, j);
            }
        }

    }

    placeBuilding(x, y) {
        const sprite = this.scene.add.sprite(x * TILE_SIZE_PX, y * TILE_SIZE_PX, 'building');
        sprite.setOrigin(0, 0);
        this.scene.physics.world.enable(sprite);
        sprite.body.setImmovable(true);
        this.grid[x][y] = sprite;
        this.layer.add(sprite);
        this.nbBuildings += 1;
    }

    theCityIsGrowing(hedgehog) {
        // Add a new building to the city next to an existing building
        // 1. Find all the empty cells next to a building

        for (let i = 0; i < this.mapSize[0]; i++) {
            for (let j = 0; j < this.mapSize[1]; j++) {
                if (this.grid[i][j] !== 0) {
                    const adjacentBuildings = this.getAdjacentBuildings(i, j);
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
        if (x > 0 && this.grid[x - 1][y] === 0) adjacentBuildings.push({ x: x - 1, y: y });
        if (x < this.mapSize[0] - 1 && this.grid[x + 1][y] === 0) adjacentBuildings.push({ x: x + 1, y: y });
        if (y > 0 && this.grid[x][y - 1] === 0) adjacentBuildings.push({ x: x, y: y - 1 });
        if (y < this.mapSize[1] - 1 && this.grid[x][y + 1] === 0) adjacentBuildings.push({ x: x, y: y + 1 });
        return adjacentBuildings;
    }

    isHedgehogInBuilding(hedgehog, x, y) {
        return hedgehog.getPosition().x > x - 1 &&
            hedgehog.getPosition().x < x + 1 &&
            hedgehog.getPosition().y > y - 1 &&
            hedgehog.getPosition().y < y + 1;
    }

    destroy() {
        this.layer.destroy();
    }
}