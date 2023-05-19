import Phaser from "phaser";

class BoardScene extends Phaser.Scene {
  constructor() {
    super("BoardScene");
  }

  create() {
    // Add your game logic and scene setup here
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: BoardScene
};

const game = new Phaser.Game(config);

// Set up resize event listener to adapt to window size changes
window.addEventListener("resize", () => {
  const { innerWidth, innerHeight } = window;
  game.scale.resize(innerWidth, innerHeight);
});

export { game };
