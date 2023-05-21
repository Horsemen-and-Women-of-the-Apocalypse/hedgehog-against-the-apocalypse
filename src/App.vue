<template>
  <Router />
</template>

<script>
import Router from './components/Router.vue'

export default {
  name: 'App',
  components: {
    Router
  }, 
}
</script>

<style>
body,
html {
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
}

button {
  background-color: #ffd170;
  color: black;
  border: none;
  border-bottom: #d69320 7px solid;
  border-radius: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.05s;
  font-weight: bold;
}

button:hover {
  background-color: #e0b352;
}

button:active {
  border-bottom: #d69320 1px solid;
  transform: translateY(6px);
}

.displayPannel {
  background-color: #ffd170;
  border-radius: 20px;
}

</style>
