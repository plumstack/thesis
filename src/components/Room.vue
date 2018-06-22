<template>
  <div class="room">
    <h2>Test Room {{ $route.params.roomId }}</h2>
    <Player />
  </div>
</template>

<script>
import Player from './Player.vue';

export default {
  name: 'Room',

  components: {
    Player,
  },
};
</script>

<style scoped>
  h2 {
    font-family: "Kalam";
    color: #fff;
    text-align: center;
    font-size: 5vw;
    margin: 2px;
  }
</style>
