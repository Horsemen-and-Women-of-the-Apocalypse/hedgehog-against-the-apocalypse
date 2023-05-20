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
    game.events.on("ready", () => {
      console.log("Game is ready");
    });
  },
  methods: {
  },
}
</script>

<style scoped>
#game {
  width: 100%;
  height: 100%;
  /* Custom cursor: */
  cursor: url('./target.png'), auto;
}

</style>
