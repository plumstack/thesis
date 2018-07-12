<template>
  <div class="search">
    <input type="text" id="search-input" class="text-input song-search"
    placeholder="Search for Songs" @keyup.enter="onSongSearch" v-model="searchQuery"/>
    <ul v-if="searchResults" class="search-results">
      <li class="search-results-list" v-for="track in searchResults" :key="track.id">
        <SearchItem :track="track" :currentQueue="mapQueue" @queue="onQueueSong"/>
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
  props: ['searchResults', 'currentQueue'],
  components: {
    SearchItem,
  },
  computed: {
    mapQueue() {
      return this.currentQueue.map((track) => track.album.id);
    },
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
.search-results {
    width: 100%;
}

.search-results-list {
    background: #222;
}

.search-results-list:nth-child(odd) {
    background: #333;
}

.song-search {
  margin-bottom: 1vh;
}
</style>
