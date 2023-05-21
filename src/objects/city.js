import { CITY_HEADSTART, MAP_SIZE, TILE_SIZE_PX } from '@/constants';
import Hedgehog from './hedgehog';

// const INITIAL_BUILDING_PERCENTAGE = 0.00;
const BUILDING_GROWTH_PERCENTAGE = 0.001;

export default class City {

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

        // Spawn hedgehog
        const random = Math.floor(Math.random() * MAP_SIZE.width);    

        if(!positions.includes(random)) {
            const spawn = Math.floor(Math.random() * 101);

            if(spawn < 10) {
                const lostChild = new Hedgehog(random + 0.5, y + 0.5 + this.step, 0, this.scene, 0.5, 0, 0, this.hedgehog.lostChildren.length + 1);
                lostChild.position.x = lostChild.sprite.x;
                lostChild.position.y = lostChild.sprite.y;

                this.scene.physics.add.collider(lostChild.sprite, this.spriteGroup);

                this.hedgehog.lostChildren.push(lostChild);       
            }
        }


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
                        setTimeout(() => {
                            child.kill();
                        }, 10);
                    }
                }

                for (let lostChild of this.hedgehog.lostChildren) {
                    if (this.isHedgehogInBuilding(lostChild, x, y, stepSaved)) {
                        lostChild.kill();
                    }
                }

                if (this.isHedgehogInBuilding(this.hedgehog, x, y, stepSaved)) {
                    this.hedgehog.kill();
                }
            })
        } else {

            const sprite = this.scene.physics.add.sprite(x * TILE_SIZE_PX, (this.step + CITY_HEADSTART + y) * TILE_SIZE_PX, texture[0]);
            sprite.play(texture[1]);
            sprite.setOrigin(0, 0);
            sprite.setScale(32 / 64);
            sprite.on('animationcomplete', () => {
                this.spriteGroup.add(sprite);
                sprite.setImmovable();
                // Check if the hedgehog is in the new building
                for (let child of this.hedgehog.children) {
                    if (this.isHedgehogInBuilding(child, x, y, stepSaved)) {
                        setTimeout(() => {
                            child.kill();
                        }, 10);
                    }
                }

                for (let lostChild of this.hedgehog.lostChildren) {
                    if (this.isHedgehogInBuilding(lostChild, x, y, stepSaved)) {
                        lostChild.kill();
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
        const textures = [
            ['building_ani0', 'building_0'],
            ['building_ani0', 'building_1'],
            ['building_ani0', 'building_2'],
            ['building_ani0', 'building_3']
        ];

        return textures[Math.floor(Math.random() * 4)];
    }

    theCityIsGrowing() {
        // Add a new building to the city next to an existing building
        // 1. Find all the empty cells next to a building

        for (let x = 0; x < MAP_SIZE.width; x++) {
            for (let y = 0; y < MAP_SIZE.height; y++) {
                if (this.grid[y][x] !== 0) {
                    const adjacentBuildings = this.getAdjacentBuildings(x, y);
                    adjacentBuildings.forEach((buildingPos) => {
                        
                        const random = Math.random();
                        const time_to_grow = random < BUILDING_GROWTH_PERCENTAGE;

                        if (time_to_grow) {
                            this.placeBuilding(buildingPos.x, buildingPos.y);
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
