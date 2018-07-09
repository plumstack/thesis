<template>
  <div class="player">
    <div v-if="currentlyPlaying" class="player-info">
      <img class="album-art" :src="currentlyPlaying.item.album.images[0].url" />
      <ul class="menu-container song-info">
        <li class="song-info-item song-title">{{ currentlyPlaying.item.name}}</li>
        <li class="song-info-item">{{ currentlyPlaying.item.artists[0].name }}</li>
      </ul>
    <div id="progress-bar">
      <div id="progress"></div>
    </div>
    </div>
    <div v-else>
      <h2>Please start playback on your device and refresh the page.</h2>
    </div>
    <ul class="menu-container controls" v-if="$route.query.host" >
      <li class="menu-item controls-item" @click="onClickPlay">{{ playButton }}//TODO</li>
      <li class="menu-item controls-item" @click="onClickNext">Next //TODO</li>
      <!-- <li class="menu-item controls-item" @click="getInfoPressed">GetInfo</li> -->
    </ul>
</div>
</template>

<script>
import Tock from 'tocktimer';

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
      search: '',
      timer: '',
      duration: 0,
      baseline: 0,
    };
  },
  props: ['currentlyPlaying'],
  mounted() {
    this.timer = new Tock({
      interval: 50,
      callback: () => {
        if (this.currentlyPlaying) {
          const elapsed = this.baseline + this.timer.lap();
          const progress = document.getElementById('progress');
          const percent = (elapsed / this.duration) * 100;
          const width = percent <= 100 ? percent : 100;
          progress.style.width = `${width}%`;
        }
      },
    });
    this.timer.start();
  },

  watch: {
    currentlyPlaying(newInfo) {
      if (this.currentlyPlaying) {
        const dur = newInfo.item.duration_ms;
        const el = newInfo.progress_ms;

        this.duration = dur;
        this.baseline = el;

        this.timer.reset();
        this.timer.start();
      }
    },
  },

  methods: {
    onClickNext() {
      // TODO
    },

    onClickPlay() {
      // TODO
      playOrPause = !playOrPause;
      this.playButton = playButtonChange(playOrPause);
    },
  },
};
</script>

<style>
.player-info {
  margin: auto;
  width: 80%;
  margin-bottom: 5px;
}

.song-info-item {
  font-size: 2vw;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.song-title {
  color: #6495ed;
  font-size: 4vw;
  margin-bottom: 0;
}

.album-art {
  display: block;
  margin: auto;
  height: 60%;
  width: 60%;
}

#progress-bar {
  width: 50%;
  background: #fff;
  text-align: left;
  border-radius: 5px;
}

#progress {
  height: 10px;
  background: linear-gradient(90deg,#0ff,#6495ed);
  margin-bottom: 10px;
  border-radius: 5px;
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
