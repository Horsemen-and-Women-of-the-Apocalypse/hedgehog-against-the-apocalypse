<template>
  <div id="game">
    <div id="board"></div>
  </div>
</template>

<script>
import { config } from "./game";
import Phaser from "phaser";

export default {
  name: 'hata-Game',
  props: {},
  data() {
    return {
      game: null,
    }
  },
  mounted() {
    this.game = new Phaser.Game(config);

    // Set up resize event listener to adapt to window size changes
    window.addEventListener("resize", () => {
      const { innerWidth, innerHeight } = window;
      try {
        this.game.scale.resize(innerWidth, innerHeight);
      } catch (error) {
        console.error(error);
      }
    });
  },
  methods: {
  },
  beforeUnmount() {
    console.log("unmounting game");
    this.game.destroy(true);
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
  /* Custom cursor: */
}

#board {
  cursor: url('target.png') 200 200, auto;
}
</style>
