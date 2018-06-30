<template>
  <div class="search" align="center">
    <input type="text" placeholder="Search for Songs" v-on:keyup.enter="search" v-model="searchQuery"/>
    <table  class="search-results">
      <!-- Table Headers: -->
      <tr class="table-header">
        <th>  <!-- artwork --> </th>
        <th>Track</th>
        <th>Artist</th>
        <th>Duration</th>
        <th>Album</th>
        <th>Cue</th>
      </tr>

    <!-- Table Rows -->
    <tr class="alternative_row" v-for="track in searchRes" :key="track.id">
        <td><img :src="track.album.images[2].url" class="album-image"></td>
        <td>{{ track.name }}</td>
        <td>{{ track.artists[0].name }}</td>
        <td>{{ convertAMilli(track.duration_ms) }}</td>
        <td>{{ track.album.name }}</td>
        <td>+</td>
    </tr>
    </table>
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
  props: ['searchInput', 'searchRes'],
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
    margin-left:15%;
    margin-right:15%;
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
  width: 60%;
  outline: none;
  color: #db7095;
  background: #fff;
}

::placeholder {
  color: rgba(255, 255, 255, .35);
}
</style>
