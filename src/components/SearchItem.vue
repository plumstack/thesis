<template>
    <div class="search-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="song-info-item song-title">
            {{ track.name }}
            <div class="song-info-item">{{ track.artists[0].name }}</div>
            </div>
        <div v-on:click="queue(track)" ><img src="../assets/plus.svg" class="queue-button-add"></div>
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
  },
};
</script>

<style scoped>
.search {
  margin: auto;
  margin-top: 20px;
  width: 100%;
  color: white;
}

.search-results{
    width: 70%;
    margin-left:0%;
    margin-right:0%;
    border-collapse: collapse;
}

.table-header{
    height: 75px;
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

.album-image {
  padding-top: 4px;
}

.cue {
    color: #0ff;
}


.queue-button-add {
  max-width: 32px;
  max-height: 32px;
  margin-right: 3px;
  border-radius: 50%;
  background: #fff;
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

.search-track {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.track-item {
  flex-grow: 1;
  flex-basis: 0;
}

.empty-image {
  width: 64px;
}

</style>
