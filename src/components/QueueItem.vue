<template>
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item">{{ track.name }}</div>
        <div class="track-item">{{ track.artists[0].name }}</div>
        <div class="track-item">{{ track.album.name }}</div>
        <div class="queue-button queue-vote up" v-on:click="upvoteClicked(track)">^</div>
        <div class="queue-button queue-vote down" v-on:click="downvoteClicked(track)">V</div>
      </div>
</template>

<script>
export default {
  name: 'QueueItem',
  props: ['queueUpvote', 'track', 'queueDownvote'],
  data() {
    return {
      hasDownvoted: false,
      hasUpvoted: false,
    };
  },
  methods: {
    downvoteClicked(track) {
      if (!this.hasDownvoted) {
        this.hasDownvoted = true;
        this.hasUpvoted = false;
        this.queueDownvote(track);
      }
    },
    upvoteClicked(track) {
      if (!this.hasUpvoted) {
        this.hasUpvoted = true;
        this.hasDownvoted = false;
        this.queueUpvote(track);
      } else console.log('you have voted!!!');
    },
  },
};
</script>

<style scoped>
queue-track-list:nth-child(even) {
  background: rgba(255, 255, 255, 0.2);
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
