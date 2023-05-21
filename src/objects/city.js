import { CITY_HEADSTART, MAP_SIZE, TILE_SIZE_PX } from '@/constants';

// const INITIAL_BUILDING_PERCENTAGE = 0.00;
const BUILDING_GROWTH_PERCENTAGE = 0.001;

export default class City {

    /**
     * @param {*} scene
     */
    constructor(scene, hedgehog) {
        this.scene = scene;
        this.hedgehog = hedgehog
        this.step = 0;
        this.sprites = [];
        this.moveSpriteIterator = 0;
        this.spriteGroup = this.scene.physics.add.group();
        this.maxSprites = MAP_SIZE.width * MAP_SIZE.height;
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

        // Add new buildings on new row
        const positions = this.generateUniqueIntegers(MAP_SIZE.width, 2);
        positions.forEach(x => {
            this.placeBuilding(x, y);
        })

        // Fill the top rows with buildings
        for (let x = 0; x < MAP_SIZE.width; x++) {
            if (Math.random() < 0.4) this.placeBuilding(x, 7);
        }
        for (let x = 0; x < MAP_SIZE.width; x++) {
            if (Math.random() < 0.2) this.placeBuilding(x, 8);
        }
    }

    placeBuilding(x, y) {
        if (this.grid[y][x] === 1) return;

        this.grid[y][x] = 1;
        const stepSaved = this.step;

        const texture = this.getTexture();

        if (this.sprites.length > this.maxSprites) {
            // Move the sprite
            // Remove from the group first to prevent collisions
            const spriteToMove = this.sprites[this.moveSpriteIterator];
            this.spriteGroup.remove(spriteToMove);
            spriteToMove.setPosition(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX);
            spriteToMove.play(texture[1]);
            this.moveSpriteIterator = (this.moveSpriteIterator + 1) % this.maxSprites;

            // Delete event listener
            spriteToMove.removeAllListeners('animationcomplete');
            // Re-add event listener
            spriteToMove.on('animationcomplete', () => {
                this.spriteGroup.add(spriteToMove);
                spriteToMove.setImmovable();

                // Check if the hedgehog is in the new building
                for (let child of this.hedgehog.children) {
                    if (this.isHedgehogInBuilding(child, x, y, stepSaved)) {
                        child.kill();
                    }
                }

                if (this.isHedgehogInBuilding(this.hedgehog, x, y, stepSaved)) {
                    this.hedgehog.kill();
                }
            })
        } else {
            const sprite = this.scene.physics.add.sprite(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX, texture[0]);
            sprite.play(texture[1]);
            sprite.setScale(32 / 256);
            sprite.setOrigin(0, 0);
            sprite.on('animationcomplete', () => {
                this.spriteGroup.add(sprite);
                sprite.setImmovable();
                // Check if the hedgehog is in the new building
                for (let child of this.hedgehog.children) {
                    if (this.isHedgehogInBuilding(child, x, y, stepSaved)) {
                        child.kill();
                    }
                }

                if (this.isHedgehogInBuilding(this.hedgehog, x, y, stepSaved)) {
                    this.hedgehog.kill();
                }
            });

            this.sprites.push(sprite);
        }

    }

    getTexture() {
        const random = Math.floor(Math.random() * 101);

        if (random > 60) {
            return ['building_1_ani1', 'building_1'];
        } else {
            return ['building_2_ani1', 'building_2'];
        }
    }

    theCityIsGrowing() {
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

                            // Play a sound Only if the building is randomly growing
                            const random = Math.floor(Math.random() * this.scene.buildSounds.length);
                            const sound = this.scene.buildSounds[random];
                            if (!sound.isPlaying) {
                                sound.play();
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

    isHedgehogInBuilding(hedgehog, x, y, step) {

        const yStep = y + step + CITY_HEADSTART;

        const hedgehogX = hedgehog.position.x / TILE_SIZE_PX
        const hedgehogY = hedgehog.position.y / TILE_SIZE_PX;

        return hedgehogX >= x && hedgehogX < x + 1 &&
            hedgehogY >= yStep && hedgehogY < yStep + 1;
    }

    destroy() {
        this.layer.destroy();
    }
}
