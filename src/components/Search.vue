<template>
  <div class="search" align="center">
    <input type="text" id="search-input" placeholder="Search for Songs"
    @keyup.enter="onSongSearch" v-model="searchQuery"/>
    <ul v-if="searchQuery" class="search-results">
      <li class="alternative_row" v-for="track in searchResults" :key="track.id">
        <SearchItem :track="track" @queue="onQueueSong"/>
      </li>
    </ul>
  </div>
</template>

<script>
import SearchItem from './SearchItem.vue';

export default {
  name: 'Search',
  data() {
    return {
      searchQuery: '',
    };
  },
  props: ['searchResults'],
  components: {
    SearchItem,
  },
  mounted() {
    document.getElementById('search-input').focus();
  },
  methods: {
    onSongSearch() {
      document.getElementById('search-input').blur();
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

.alternative_row:nth-child(even){
    background: rgba(255, 255, 255, .2);
}

.alternative_row:hover{
    color: #ff1493;
}

ul {
  list-style-type: none;
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
    padding: 1vh 1vw 1vh 1vw;
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
    margin-left: auto;
    margin-right: auto;
}

input[type=text]:focus {
  width: 45%;
  outline: none;
  color: #6495ed;
  background: #fff;
}

::placeholder {
  color: rgba(255, 255, 255, .35);
}
</style>
