import { TILE_SIZE_PX } from "../constants";

const INITIAL_BUILDING_PERCENTAGE = 0.5;
const BUILDING_GROWTH_PERCENTAGE = 0.1;

export default class City {

    /**
     * @param {*} mapSize 
     */
    constructor(mapSize, scene) {
        this.scene = scene;
        this.mapSize = mapSize;
        this.layer = this.scene.add.layer();
        this.layer.setDepth(1);
    }

    resetGrid() {
        // Create a grid of size mapSize
        this.grid = [];
        for (let i = 0; i < this.mapSize[0]; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.mapSize[1]; j++) {
                // By default, the grid is empty
                // Except for the initial buildings
                if (Math.random() < INITIAL_BUILDING_PERCENTAGE) this.placeBuilding(i, j);
                else this.grid[i][j] = 0;
            }
        }

    }

    placeBuilding(x, y) {
        const sprite = this.scene.add.sprite(x * TILE_SIZE_PX, y * TILE_SIZE_PX, 'building');
        this.grid[x][y] = sprite;
        this.layer.add(sprite);
    }

    theCityIsGrowing() {
        // Add a new building to the city next to an existing building
        // 1. Find all the empty cells next to a building
        const emptyCells = [];
        for (let i = 0; i < this.mapSize[0]; i++) {
            for (let j = 0; j < this.mapSize[1]; j++) {
                if (this.grid[i][j] === 0) {
                    // Check if there is a building next to it
                    if (this.getAdjacentBuildings(i, j).length > 0) {
                        emptyCells.push([i, j]);
                    }
                }
            }
        }

        // 2. Pick a random empty cell
        const nbEmptyCells = emptyCells.length;
        const nbNewBuildings = Math.floor(nbEmptyCells * BUILDING_GROWTH_PERCENTAGE);
        for (let i = 0; i < nbNewBuildings; i++) {
            const randomIndex = Math.floor(Math.random() * nbEmptyCells);
            const [x, y] = emptyCells[randomIndex];
            this.placeBuilding(x, y);
            emptyCells.splice(randomIndex, 1);
        }
    }

    getAdjacentBuildings(x, y) {
        const adjacentBuildings = [];
        // Check all the 8 adjacent cells
        for (let i = -1; i <= 1; i++) {
            if (x + i < 0 || x + i >= this.mapSize[0]) continue;
            for (let j = -1; j <= 1; j++) {
                if (y + j < 0 || y + j >= this.mapSize[1]) continue;
                if (i === 0 && j === 0) continue;
                if (this.grid[x + i][y + j] !== 0) {
                    adjacentBuildings.push([x + i, y + j]);
                }
            }
        }
        return adjacentBuildings;
    }
}