<template>
    <div class="search-track" v-on:click="add(track)">
        <img :src="track.album.images[2].url">
        <div class="search-info-item search-title">
            {{ track.name }}
            <div class="search-info-item">{{ track.artists[0].name }}</div>
            </div>
        <div v-on:click="add(track)">
          <img src="../assets/plus.svg" class="queue-button-add">
        </div>
    </div>
</template>

<script>
export default {
  name: 'SearchItem',
  props: ['track'],
  data() {
    return {
    };
  },
  methods: {
    add(track) {
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
  color: white;
}

.alternative_row:nth-child(even){
    background: rgba(255, 255, 255, .2);
}

.alternative_row:hover{
    color: #ff1493;
}

td {
    text-align: center;
    vertical-align: center;
    padding: 0px;
}

.search-info-item {
  font-size: 2vw;
  font-weight: 700;
  color: #fff;
  margin-bottom: 10px;
}

.search-title {
  color: #6495ed;
  font-size: 3vw;
  margin: 0vh .5vw 0vh .5vw;
}

.queue-button-add {
  max-width: 32px;
  max-height: 32px;
  margin-right: 3px;
  border-radius: 50%;
}

::placeholder {
  color: rgba(255, 255, 255, .35);
}

.search-list {
  list-style-type: none;
  width: 75%;
}

.search-header {
  font-weight: 700;
  margin-bottom: 15px;
}

.search-track-list:nth-child(even) {
  background: rgba(255, 255, 255, 0.2);
}


.track-item {
  flex-grow: 1;
  flex-basis: 0;
}

.empty-image {
  width: 64px;
}

</style>
