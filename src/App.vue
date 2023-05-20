<template>
  <Router/>
</template>

<script>
import Router from './components/Router.vue'

export default {
  name: 'App',
  components: {
    Router
  }
}
</script>

<style>
body, html{
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
</style>
