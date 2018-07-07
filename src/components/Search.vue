<template>
  <div class="search" align="center">
    <input type="text" placeholder="Search for Songs" v-on:keyup.enter="search" v-model="searchQuery"/>
    <ul v-if="searchQuery" class="search-list">
    <li class="search-header">
      <div class="search-track">
        <div class="empty-image"></div>
        <div class="track-item"> <!-- Track --></div>
        <div><!-- Empty div for button --></div>
      </div>
    </li>
    <li class="search-track-list" v-for="track in searchRes" :key="track.id">
      <div class="search-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="song-info-item song-title">
            {{ track.name }}
            <div class="song-info-item">{{ track.artists[0].name }}</div>
          </div>
        <div v-on:click="queue(track)" ><img src="../assets/plus.svg" class="queue-button-add"></div>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
// import dummyData from './exampleSearchData';

export default {
  name: 'Search',
  created() {
  },
  data() {
    return {
      searchResults: this.searchRes,
      searchQuery: '',
    };
  },
  props: ['searchInput', 'searchRes', 'queue'],
  methods: {
    search() {
      this.searchInput(this.searchQuery);
    },
    convertAMilli(ms) {
      const minutes = Math.floor(ms / 60000).toString();
      const seconds = ((ms % 60000) / 1000).toFixed(0).toString();
      return `${minutes} : ${(seconds < 10 ? '0' : '')} ${seconds}`;
    },
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

input[type=text] {
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid #fff;
    border-radius: 15px;
    width: 40%;
    color: #FFFFFF;
    box-sizing: border-box;
    border: 2px solid #ffffff;
    font-size: 3vw;
    font-weight: 700;
    text-align: center;
    background-position: 10px 10px;
    padding: 10px 10px 10px 10px;
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
    margin-left: auto;
    margin-right: auto;
}

input[type=text]:focus {
  width: 45%;
  outline: none;
  color: #db7095;
  background: #fff;
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
