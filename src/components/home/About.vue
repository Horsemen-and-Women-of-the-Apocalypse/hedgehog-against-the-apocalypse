<template>
  <div id="about">
    <h2>
      About
      <button>Back to Home</button>
    </h2>

    <div id="designer">

      <h3>Designer</h3>

      <p>cyborgnekosica - <a href="https://www.artfol.co/CyborgNekoSica">Portfolio</a></p> 
    </div>
    <div id="developer">

      <h3>Developer</h3>

      <p>Tomansion - <a href="https://github.com/Tomansion">Github</a></p>
      <p>Nonologisme - <a href="https://gitlab.com/nonologism">Gitlab</a></p>
      <p>Fantorem - <a href="https://github.com/Fantorem">Github</a></p>
    </div>
    <div id="sound">

      <h3>Sound effects</h3>

      <p>Tomansion</p>
    </div>
    <div id="music">

      <h3>Music</h3>

      <p>Nonologisme</p>
    </div>
    <div id="phaser"><p><small>Made with Phaser : <a href="https://phaser.io/">Phaser</a></small></p></div>
  </div>
</template>

<script>
export default {
  name: "my-about",
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>
#about {
  position: absolute;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.418);
  transform: translate(-50%, -50%);
  background: white;
  width: 500px;
  padding: 40px;
  cursor: pointer;
}

h2 {
  display: flex;
  justify-content: space-between;
}

button {
  background: white;
  border-radius: 10px;
  border: black solid 2px;
  margin: 10px;
  cursor: pointer;
  transition: all 0.1s;
}

#phaser{
  padding-top: 10%;
  align-self: flex-end;
}

</style>