<template>
    <component :is="currentView" />
</template>

<script>

import Home from './Home.vue'
import About from './About.vue'
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
            console.log(window.location.hash);
            this.currentPath = window.location.hash;
        })
    }
}
</script>

<style scoped>
#home {
    width: 100vw;
    height: 100vh;
    background: black;
    background-image: url("building.png");
    background-size: 50px;
    display: flex;
    align-items: center;
}

#pannel {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* Custom cursor: */
    background: green;
    height: 500px;
    width: 100%;
    padding: 20px;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.418);
}

h1 {
    color: white;
    font-size: 5rem;
    text-align: center;
}

button {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    border: none;
    margin: 10px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.1s;
}

button:hover {
    background: darkgreen;
    color: white;
}

#play {
    width: 400px;
    height: 100px;
    font-size: 3em;
}
</style>