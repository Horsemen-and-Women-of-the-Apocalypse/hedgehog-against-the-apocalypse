<template>
  <div id="game">
    <div id="controls">
      <a href="home"><button id="about">Home</button></a>
    </div>
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
  cursor: url('./target.png') 200 200, auto;
}

#controls {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 100;
}

button {
    width: 100px;
    height: 50px;
    border-radius: 10px;
    border: none;
    margin: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.1s;
    border: 3px solid black;
    font-weight: bold;
}
</style>
