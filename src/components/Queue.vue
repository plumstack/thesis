<template>
  <ul v-if="curQueue.length" class="queue-list">
    <li class="queue-header">
      <div class="queue-track">
        <div class="empty-image"></div>
        <div class="track-item">Track</div>
        <div class="track-item">Artist</div>
        <div class="track-item">Album</div>
        <div class="queue-vote"></div>
        <div class="queue-vote"></div>
      </div>
    </li>
    <li class="queue-track-list" v-for="track in curQueue" :key="track.id">
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item">{{ track.name }}</div>
        <div class="track-item">{{ track.artists[0].name }}</div>
        <div class="track-item">{{ track.album.name }}</div>
        <div class="queue-button queue-vote up" v-on:click="queueUpvote(track)">^</div>
        <div class="queue-button queue-vote down" v-on:click="queueDownvote(track)">V</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Queue',
  props: ['curQueue', 'queueUpvote'],
};
</script>


<style scoped>
.queue-list {
  list-style-type: none;
  width: 75%;
}

.queue-header {
  font-weight: 700;
  margin-bottom: 15px;
}

.queue-track-list:nth-child(even) {
  background: rgba(255, 255, 255, .2);
}

.queue-track {
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

.queue-vote {
  width: 32px;
  height: 32px;
}

.up {
  background: green;
}

.down {
  background: red;
}
</style>
