import { TILE_SIZE_PX } from "../constants";

const INITIAL_BUILDING_PERCENTAGE = 0.01;
const BUILDING_GROWTH_PERCENTAGE = 0.006;

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

        // 2. Pick a random list of empty cells
        const nbEmptyCellsToFill = Math.ceil(emptyCells.length * BUILDING_GROWTH_PERCENTAGE);
        const randomEmptyCells = emptyCells.sort(() => 0.5 - Math.random());
        for (let i = 0; i < nbEmptyCellsToFill; i++) {
            const [x, y] = randomEmptyCells[i];
            // 3. Place a building
            this.placeBuilding(x, y);
            break;
        }
    }

    getAdjacentBuildings(x, y) {
        const adjacentBuildings = [];
        // Check all the 4 adjacent cells
        if (x > 0 && this.grid[x - 1][y] !== 0) adjacentBuildings.push(this.grid[x - 1][y]);
        if (x < this.mapSize[0] - 1 && this.grid[x + 1][y] !== 0) adjacentBuildings.push(this.grid[x + 1][y]);
        if (y > 0 && this.grid[x][y - 1] !== 0) adjacentBuildings.push(this.grid[x][y - 1]);
        if (y < this.mapSize[1] - 1 && this.grid[x][y + 1] !== 0) adjacentBuildings.push(this.grid[x][y + 1]);
        return adjacentBuildings;
    }
}