<template>
  <div class="room">
    <h1>Test Room {{ $route.params.roomId }}</h1>
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

</style>
