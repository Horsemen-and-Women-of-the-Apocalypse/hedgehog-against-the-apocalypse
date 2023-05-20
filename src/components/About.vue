<template>
  <div id="about">
    <h2>

      Abouts
      <button>Back to Home</button>
    </h2>
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
  height: 700px;
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
</style>