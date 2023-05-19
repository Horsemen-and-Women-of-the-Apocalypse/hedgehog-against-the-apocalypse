<template>
  <div id="game">
    <div id="board"></div>
  </div>
</template>

<script>
import { game } from "./game";

export default {
  name: 'hata-Game',
  props: {},
  data() {
    return {
    }
  },
  mounted() {
    // Init game
    game.events.on("ready", () => this.setupListeners());
  },
  methods: {
    setupListeners() {
      // Setup listeners
      game.events.on("gameover", () => this.gameover());
      game.events.on("move", () => this.move());
      game.events.on("win", () => this.win());
    },
    gameover() {
      // Game over
      console.log("Game over");
    },
    move() {
      // Move
      console.log("Move");
    },
    win() {
      // Win
      console.log("Win");
    }
  }, 
  beforeUnmount() {
    // Destroy the game instance
    game.destroy(true);
  }

}
</script>

<style scoped>
#game {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#board {}
</style>
