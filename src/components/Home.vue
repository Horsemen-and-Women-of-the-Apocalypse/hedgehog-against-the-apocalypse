<template>
    <div id="home">
      <div>
            <h1>Hedgehog against the apocalypse</h1>

            <a href="#/">Home</a> |
            <a href="#/about">About</a> |
            <a href="#/game">Play !</a>

            <component :is="currentView" />
      </div>
    </div>
</template>

<script>

import Home from './Home.vue'
import About from './About.vue'
import Game from './Game.vue'

const routes = {
  '/': Home,
  '/about': About,
  '/game': Game
}

export default {
    name: "my-home",
    data() {
        return {
            currentPath: window.location.hash
        }
    },
    computed: {
        currentView() {
            return routes[this.currentPath.slice(1) || '/'];
        }
    },
    mounted() {
        window.addEventListener('hashchange', () => {
            this.currentPath = window.location.hash;
		})
    }
}
</script>

<style scoped>
</style>