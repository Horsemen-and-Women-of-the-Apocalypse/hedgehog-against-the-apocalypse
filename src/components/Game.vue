<template>
  <div id="game">
    <!-- Controls, score ... -->
    <div id="controls">
      <a href="#/home"><button id="about">Home</button></a>

      <div id="childs">
        <TransitionGroup
          name="list"
          tag="ul"
        >
          <img
            class="child"
            v-for="(child, i) in childRemaining"
            :key="i"
            src="hhIcon.png"
          />
        </TransitionGroup>
      </div>
      <div id="scoreYear">
        {{ scoreYear }}
      </div>
    </div>

    <div id="soundControl">
      <!-- Volume slider -->
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        v-model="volume"
      />

      <!-- Mute button -->
      <button
        @click="soundMuted = !soundMuted"
        id="muteButton"
      >
        {{ soundMuted ? "Unmute" : "Mute" }}
      </button>
    </div>
    <!-- Game over pannel -->
    <Transition>
      <div
        id="gameOverPannel"
        v-if="gameOver"
      >
        <h3 v-if="childRemaining === 0">
          No children left.
        </h3>
        <h3 v-else>
          Game over
        </h3>
        <p>
          You went extinct in <b>
            {{ scoreYear }}
          </b>.
        </p>
        <button
          id="play"
          @click="resartGame"
        >Play again</button>
      </div>
    </Transition>
    <div id="board"></div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { config, data } from "./game";
import Phaser from "phaser";

export default {
  name: 'hata-Game',
  props: {},
  data() {
    return {
      game: null,
      gameOver: false,
      childRemaining: data.childRemaining,
      scoreYear: data.year,
      volume: 0.5,
      soundMuted: false,
    }
  },
  mounted() {
    // Init game
    this.game = new Phaser.Game(config);

    // Decrease volume
    this.game.sound.setVolume(0.2)

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
      this.scoreYear = data.year;
      this.childRemaining = data.childRemaining;
      this.gameOver = data.gameOver;
      if (data.gameOver) this.childRemaining = 0
    }, 1000);

  },
  methods: {
    resartGame() {
      this.game.destroy(true);
      this.game = new Phaser.Game(config);
      this.game.sound.mute = this.soundMuted;
      this.gameOver = false;
      data.gameOver = false;
    }
  },
  watch: {
    soundMuted() {
      this.game.sound.mute = this.soundMuted;
    },
    volume() {
      this.game.sound.setVolume(this.volume);
      this.soundMuted = false;
    }
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
  width: 99%;
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
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.504));
  font-weight: bold;
}

#scoreYear {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.504));
  background-color: white;
  color: black;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
}

#gameOverPannel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.418);
  background: rgb(52, 52, 52);
  border-radius: 10px;
  width: 500px;
  height: 300px;
  padding: 40px;
  cursor: pointer;
  color: white;
  font-size: 1.5em;
}

#childs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.child {
  height: 50px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.504))
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
  height: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
#soundControl {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  z-index: 100;
  width: 99%;
  display: flex;
  justify-content: flex-end;
}
#muteButton {
  margin: 10px;
  padding: 10px;
  width: 70px;
  border-radius: 10px;
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.504));
  background-color: white;
  color: black;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
