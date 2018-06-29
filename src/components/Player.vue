<template>
  <div class="player">
    <div class="player-info">
      <ul class="menu-container song-info">
        <li class="song-info-item song-title">{{ playerInfo.title }}</li>
        <li class="song-info-item">{{ playerInfo.artist }}</li>
      </ul>
      <img class="album-art" :src="playerInfo.albumArt" />
    </div>
    <ul class="menu-container controls">
      <li class="menu-item controls-item" v-on:click="onClickPrev()">Prev</li>
      <li class="menu-item controls-item" v-on:click="onClickPlay()">{{ playButton }}</li>
      <li class="menu-item controls-item" v-on:click="onClickNext()">Next</li>
      <li class="menu-item controls-item" v-on:click="getPlayerInfo()">GetInfo</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

const url = '/spotify/player/';
let playOrPause = true;

function playButtonChange(current) {
  if (current) return 'Pause';
  return 'Play';
}

export default {
  name: 'Player',
  data() {
    return {
      playButton: playOrPause ? 'Pause' : 'Play',
      playerInfo: {},
      search: '',
    };
  },
  props: {
    roomId: { type: String, required: true },
  },
  methods: {
    options(meth) {
      return {
        method: 'GET',
        url: `${url}${meth}`,
        params: {
          roomId: this.roomId,
        },
      };
    },
    onClickNext() {
      axios(this.options('next')).then(this.getPlayerInfo);
    },
    onClickPrev() {
      axios(this.options('prev')).then(this.getPlayerInfo);
    },
    onClickPlay() {
      axios(this.options(playOrPause ? 'pause' : 'play')).then(this.getPlayerInfo);
      playOrPause = !playOrPause;
      this.playButton = playButtonChange(playOrPause);
    },
    async getPlayerInfo() {
      const result = await axios(this.options('info'));
      this.playerInfo = result.data;
    },
  },
};
</script>

<style>
.player-info {
  margin: auto;
  width: 80%;
  margin-bottom: 30px;
}

.song-info-item {
  font-size: 1.5vw;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.song-title {
  color: #6495ed;
  font-size: 2vw;
  margin-bottom: 0;
}

.album-art {
  display: block;
  margin: auto;
  height: 15%;
  width: 15%;
}

.controls-item {
  display: inline-block;
  font-size: 1.5vw;
  padding: 5px 10px;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
}
</style>
