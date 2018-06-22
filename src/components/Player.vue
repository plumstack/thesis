<template>
<div class='player'>
  <div class='controls'>
  <button v-on:click="onClickPrev()">Prev</button>
  <button class="md-accent md-raised" v-on:click="onClickPlay()">{{playButton}}</button>
  <button v-on:click="onClickNext()">Next</button>
  <button v-on:click="getPlayerInfo()">GetInfo</button>
</div>
<div class='info'>
<!-- https://i.scdn.co/image/962c51ca74944e60cccf0f39d10bee03666b0467 -->
  </div>
</div>
</template>
<script>
import axios from 'axios';

const url = 'http://192.168.0.102:8082/spotify/player/';
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
    return { playButton: playOrPause ? 'Pause' : 'Play', playerInfo: {} };
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
    async getPlayerInfo() {
      const result = await axios(options('info'));
      this.playerInfo = result.data;
    },
  },
};
</script>

<style>
button {
  width: 33%;
}

.player {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
}

.info {
  position: absolute;
  float: bottom;
}

.controls {
  float: top;
}
</style>
