const { Howl } = require('howler');


const musicToLoad = ["menu"]

var musics = {}

function loadMusics() {
    for (const music of musicToLoad) {
        musics[music] = newMusic(music)
        console.log("Loaded music " + music
        );
        console.log(musics[music]);

    }
}

function newMusic(music) {
    return new Howl({
        src: ["/assets/music/" + music + ".wav"],
        loop: true,
        volume: 0.5
    })
}

loadMusics()

export default {
    play(music) {
        if (musics[music]) musics[music].play()
        else console.warn("Music " + music + " not found");
        console.log(musics[music]);
    },
    stop() {
        for (const m in musics) {
            musics[m].stop();
        }
    },
    setVolume(vol) {
        let volume = vol / 100
        for (const m in musics) {
            musics[m].volume(volume);
        }
        localStorage["musicVolume"] = volume;
    },
}