<template>
  <button v-on:click="onClickNext()">Next</button>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Player',
  methods: {
    onClickNext() {
      const options = { method: 'GET', url: 'http://localhost:8082/spotify/player/next' };
      axios(options);
    },
  },
};
</script>
