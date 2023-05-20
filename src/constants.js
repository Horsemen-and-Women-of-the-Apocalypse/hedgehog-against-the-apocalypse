import Position from "@/objects/position";

const TILE_SIZE_PX = 32

// [width, height]
const MAP_SIZE = {
    width: 40,
    height: 25
};

const CITY_HEADSTART = 2;

const SCROLL_SPEED = 1;

const DIRECTIONS = {
    North: new Position(0, -1),
    East: new Position(1, 0),
    South: new Position(0, 1),
    West: new Position(-1, 0),
}

export {
    TILE_SIZE_PX,
    MAP_SIZE,
    DIRECTIONS,
    SCROLL_SPEED,
    CITY_HEADSTART
}