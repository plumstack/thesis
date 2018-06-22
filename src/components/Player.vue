<template>
<div class='player'>
  <button v-on:click="onClickPrev()">Prev</button>
  <button class="md-accent md-raised" v-on:click="onClickPlay()">{{playButton}}</button>
  <button v-on:click="onClickNext()">Next</button>
</div>
</template>

<script>
import axios from 'axios';

const url = 'http://localhost:8082/spotify/player/';
let playOrPause = true;
function options(meth) {
  return {
    method: 'GET',
    url: `${url}${meth}`,
  };
}

function playButtonChange(current) {
  if (current) return 'Pause';
  return 'Play';
}

export default {
  name: 'Player',
  data() {
    return { playButton: playOrPause ? 'Pause' : 'Play' };
  },
  methods: {
    onClickNext() {
      axios(options('next'));
    },
    onClickPrev() {
      axios(options('prev'));
    },
    onClickPlay() {
      axios(options(playOrPause ? 'pause' : 'play'));
      playOrPause = !playOrPause;
      this.playButton = playButtonChange(playOrPause);
    },
  },
};
</script>

<style>
button {
  width: 10%;
}

.player {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
