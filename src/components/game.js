import Phaser from "phaser";

// create Phaser.Game object assigned to global variable named game

class BoardScene extends Phaser.Scene {
  constructor() {
    super("BoardScene");
  }
}

const config = {
  type: Phaser.AUTO,
  width: "100vw",
  height: "100vh",
  scene: BoardScene
};

const game = new Phaser.Game(config);


// Set full screen


export { game };
