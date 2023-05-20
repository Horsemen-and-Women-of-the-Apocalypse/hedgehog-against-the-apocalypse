import Position from "@/objects/position";

const TILE_SIZE_PX = 32
const MAP_SIZE = [10, 10];

const DIRECTIONS = {
    North: new Position(0, -1),
    East: new Position(1, 0),
    South: new Position(0, 1),
    West: new Position(-1, 0),
}

export {
    TILE_SIZE_PX,
    MAP_SIZE,
    DIRECTIONS
}