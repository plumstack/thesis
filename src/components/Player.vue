<template>
  <div class="player">
    <ul class="menu-container controls">
      <li class="menu-item controls-item" v-on:click="onClickPrev()">Prev</li>
      <li class="menu-item controls-item" v-on:click="onClickPlay()">{{ playButton }}</li>
      <li class="menu-item controls-item" v-on:click="onClickNext()">Next</li>
      <li class="menu-item controls-item" v-on:click="getPlayerInfo()">GetInfo</li>
    </ul>
    <div class="info">
      <img :src="playerInfo.albumArt" />
      <p v-html="playerInfo" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const url = '/spotify/player/';
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
.controls-item {
  display: inline-block;
  font-size: 1.5vw;
  padding: 5px 10px;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
}
</style>
