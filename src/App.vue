<template>
  <div id="app">
    <Navigation />
    <Tiptapexample />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue'
import Tiptapexample from './components/Tiptapexample.vue'

export default {
  name: 'app',
  components: {
    Navigation,
    Tiptapexample
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
