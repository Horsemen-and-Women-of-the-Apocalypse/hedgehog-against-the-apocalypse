<template>
    <div id="home">
        <div
            id="introduction"
            v-if="displayIntro"
        >
            <h2>
                Welcome to <b>Hedgehog against the Apocalypse</b>!
            </h2>
            <p>
                Hedgehog against the Apocalypse is a survival game where you embark on an perilous journey
                to protect and guide a courageous hedgehog against the relentless expansion of human civilization.
            </p>
            <p>
                Just <b>with your mouse pointer</b>, move your hedgehog around the expanding human civilization to find a place to
                live and
                save your children from the apocalypse.
            </p>
            <p>
                try to <b>survive as long as possible</b>!
            </p>
            <br>
            <br>
            <p>
                This game was made in 48 hours for the <a href="https://itch.io/jam/climate-jam-2023">Climate Jam 2023</a> by
                completely new game developers. So please be indulgent with us!
            </p>

            <p>Enjoy!</p>
            <button @click="introClose">Close</button>
        </div>

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
            <button @click="displayIntro = true">Introduction</button>
        </div>
    </div>
</template>

<script>
import About from "./About.vue";
import musics from '../../services/music'

export default {
    components: {
        About
    },
    name: "my-home",
    data() {
        return {
            displayAbout: false,
            displayIntro: true
        }
    },
    mounted() {
        musics.play("menu")
        if (localStorage.getItem("introClosed")) {
            this.displayIntro = false
        }
    },
    methods: {
        introClose() {
            this.displayIntro = false
            // Save in local storage
            localStorage.setItem("introClosed", true)
        }
    },
    beforeUnmount() {
        musics.stop("menu")
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

#title {
    height: 250px;
    padding-bottom: 50px;
}

button {
    width: 200px;
    height: 50px;
    margin: 10px;
    min-height: 50px;
}

#play {
    width: 400px;
    height: 100px;
    font-size: 3em;
}


#introduction {
    position: absolute;
    top: 50%;
    left: 50%;
    box-shadow: 0 0 100px rgba(0, 0, 0, 0.418);
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    width: 500px;
    padding: 40px;
    cursor: pointer;
}
</style>