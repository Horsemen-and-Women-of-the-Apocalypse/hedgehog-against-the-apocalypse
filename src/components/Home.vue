<template>
    <div id="home">
        <div
            id="abouts"
            v-if="displayAbout"
            @click="displayAbout = false"
        >
            <About />
        </div>
        <div id="pannel">
            <h1>Hedgehog against the apocalypse</h1>
            <a href="#/game"><button id="play">Play</button></a>
            <button
                id="about"
                @click="displayAbout = true"
            >About</button>
        </div>
    </div>
</template>

<script>
import About from "./About.vue";

export default {
    components: {
        About
    },
    name: "my-home",
    data() {
        return {
            displayAbout: false
        }
    },
    computed: {
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