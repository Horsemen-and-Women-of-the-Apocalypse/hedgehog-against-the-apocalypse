<template>
  <div id="game">
    <div id="controls">
      <a href="home"><button id="about">Home</button></a>
      <div id="scoreYear">
        {{ scoreDisplay.year }}
      </div>
    </div>
    <div id="board"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { config, score } from "./game";
import Phaser from "phaser";

export default {
  name: 'hata-Game',
  props: {},
  data() {
    return {
      game: null,
      scoreDisplay: {}
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

    setInterval(() => {
      this.scoreDisplay = score;
      this.$forceUpdate();
    }, 1000);
  },
  methods: {
  },
  beforeUnmount() {
    console.log("unmounting game");
    this.game.destroy(true);
  },
}
</script>

<style scoped>

#controls {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: space-between;
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

#scoreYear {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 3px solid black;
  background-color: white;
  color: black;
  text-align: center;
  cursor: pointer;
  transition: all 0.1s;
  border: 3px solid black;
  font-weight: bold;
}
</style>
