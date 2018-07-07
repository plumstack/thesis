<template>
  <div class="search" align="center">
    <input type="text" placeholder="Search for Songs" @keyup.enter="onSongSearch" v-model="searchQuery"/>
    <table v-if="searchQuery" class="search-results">
      <tr class="table-header">
         <th>  <!-- artwork --> </th>
        <th><!-- Track --></th>
        <th><!--Add --></th>
      </tr>

    <tr class="alternative_row" v-for="track in searchResults" :key="track.id">
        <td><img :src="track.album.images[2].url" class="album-image"></td>
        <td class="song-info-item song-title">
          {{ track.name }}
          <div class="song-info-item">{{ track.artists[0].name }}</div>
        </td>
        <td @click="onQueueSong(track)" ><img src="../assets/plus.svg" class="queue-button-add"></td>
    </tr>
    </table>
  </div>
</template>

<script>
// import dummyData from './exampleSearchData';

export default {
  name: 'Search',
  data() {
    return {
      searchQuery: '',
    };
  },
  props: ['searchResults'],
  methods: {
    onSongSearch() {
      this.$emit('songSearch', this.searchQuery);
    },
    onQueueSong(track) {
      this.$emit('queueSong', track);
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
}

::placeholder {
  color: rgba(255, 255, 255, .35);
}
</style>
