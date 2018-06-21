<template>
  <div id="app">
    <HelloWorld msg="Hello jj"/>
    <Player />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';
import Player from './components/Player.vue';

export default {
  name: 'app',
  components: {
    HelloWorld,
    Player,
  },
};
</script>

<style>
body {
  background: blue;
}
</style>
