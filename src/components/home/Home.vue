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
            <img
                id="title"
                src="./titleText.png"
            >
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
    background-image: url(./title.jpg);
    background-size: cover;
    background-position: center;

    display: flex;
}

#pannel {
    display: flex;
    align-items: center;
    flex-direction: column;
    /* Custom cursor: */
    height: 500px;
    width: 100%;
    padding: 20px;
}
#title{
    height: 250px;
    padding-bottom: 50px;
}

button {
    width: 200px;
    height: 50px;
    margin: 10px;
}

#play {
    width: 400px;
    height: 100px;
    font-size: 3em;
}
</style>