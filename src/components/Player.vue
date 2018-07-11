<template>
  <div class="player">
    <div v-if="currentlyPlaying" class="player-info">
      <img class="album-art" :src="currentlyPlaying.item.album.images[0].url" />
      <ul class="menu-container song-info">
        <li class="song-info-item song-title">{{ currentlyPlaying.item.name}}</li>
        <li class="song-info-item">{{ currentlyPlaying.item.artists[0].name }}</li>
      </ul>
    <div id="progress-bar" class="stripes">
      <span id="progress" class="stripes"></span>
    </div>
    </div>
    <div v-else class="require-playback">
      <h2>Please start playback on your device and refresh the page.</h2>
    </div>
    <!-- <ul class="menu-container controls" v-if="$route.query.host && currentlyPlaying">
      <li class="menu-item controls-item" @click="onClickPlay">{{ playButton }}//TODO</li>
      <li class="menu-item controls-item" @click="onClickNext">Next //TODO</li>
    </ul> -->
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
        if (document.getElementById('progress')) {
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

<style scoped>
.player {
  margin: 2vw;
}

.player-info {
  margin: auto;
  margin-bottom: 5px;
}

.album-art {
  display: block;
  margin: auto;
  height: 30vw;
  width: 30vw;
}

.song-info {
  margin-top: 1.25vh;
}

.song-title {
  color: #6495ed;
  font-size: 1.2em;
  margin-bottom: 1vh;
}

#progress-bar {
  text-align: left;
  background-color: #1a1a1a;
  height: 1.25vh;
  line-height: 1.25vh;
  padding: .3vh;
  width: 60vw;
  margin-top: 1vh;
  margin-bottom: 2vh;
  border-radius: 5vh;
  box-shadow: 0 1px 5px #000 inset, 0 1px 0 #444;
}

#progress {
  display: inline-block;
  background: #6495ed;
  background-size: 4vh 4vh;
  height: 100%;
  border-radius: 5vh;
  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
  transition: width .5s ease-in-out;
  background-image: linear-gradient(135deg, rgba(255, 255, 255, .15) 25%, transparent 25%,
                    transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%,
                    transparent 75%, transparent);
  animation: animate-stripes 5s linear infinite;
}

@keyframes animate-stripes {
    0% {background-position: 0 0;} 100% {background-position: 60px 0;}
}

.controls {
  margin-top: .5vw;
}

.controls-item {
  font-size: 1em;
  padding: 1vw 2vw;
  margin: 0 1vw;
}

.require-playback {
  margin: 10vh;
}
</style>
