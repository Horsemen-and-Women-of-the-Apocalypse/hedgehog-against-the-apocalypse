<template>
    <component :is="currentView" />
</template>

<script>

import Home from './home/Home.vue'
import About from './home/About.vue'
import Game from './Game.vue'

const routes = {
    '/home': Home,
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
            return routes[this.currentPath.slice(1) || '/home'];
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