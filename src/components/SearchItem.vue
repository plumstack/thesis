<template>
  <div class="search-track" v-on:click="add(track)">
    <img :src="track.album.images[2].url">
    <div class="search-info-item song-info">
      {{ track.name }}
      <div class="song-artist">{{ track.artists[0].name }}</div>
    </div>
    <div class="queue-add-button" v-on:click="add(track)">
      <img :src="searchIcon" class="queue-add-plus">
    </div>
  </div>
</template>

<script>
const Plus = require('../assets/plus.svg');
const Check = require('../assets/check.svg');

export default {
  name: 'SearchItem',
  props: ['track', 'currentQueue'],
  data() {
    return {
      clicked: false,
    };
  },
  computed: {
    searchIcon() {
      return this.clicked || this.currentQueue.includes(this.track.album.id) ? Check : Plus;
    },
  },
  methods: {
    add(track) {
      this.clicked = true;
      this.$emit('queue', track);
    },
    onSongSearch() {
      this.$emit('songSearch', this.searchQuery);
    },
  },
};
</script>

<style scoped>
.search-track {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.search-info-item {
  flex-grow: 1;
  flex-basis: 0;
}

.song-info {
  color: #6495ed;
  font-size: 1.2em;
}

.song-artist {
  color: #fff;
  font-size: .8em;
  margin-top: .5vh;
}

.queue-add-button {
  width: 32px;
  height: 32px;
  margin-right: 3px;
  border-radius: 50%;
}

.queue-add-plus {
  fill: #fff;
  padding: 4px;
  width: 24px;
  height: 24px;
}
</style>
