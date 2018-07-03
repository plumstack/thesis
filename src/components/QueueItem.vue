<template>
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item song-title">{{ track.name }}
          <div class="track-item song-info-item">{{ track.artists[0].name }}</div>
        </div>
        <div class="queue-button" v-on:click="upvoteClicked(track)">
          <img src="../assets/queueUp.svg" class="queue-vote" @click="$event.target.classList.toggle('voted')">
        </div>
        <div class="queue-button" v-on:click="downvoteClicked(track)">
          <img src="../assets/queueDown.svg" class="queue-vote" @click="$event.target.classList.toggle('voted')">
        </div>
        <div>{{ track.clientInfo }}</div>
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
      console.log('Downvoted: ', track);
      if (!this.hasDownvoted) {
        this.hasDownvoted = true;
        this.hasUpvoted = false;
        this.queueDownvote(track);
      }
    },
    upvoteClicked(track) {
      console.log('Upvoted: ', track);
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

.queue-button {
  width: 32px;
  height: 32px;
  margin-right: 3px;
  background: #fff;
  border-radius: 50%;
}

.voted {
  width: 32px;
  height: 32px;
  margin-right: 3px;
  background: #000000;
  border-radius: 50%;
}

.queue-button:hover {
  background: rgba(255, 255, 255, .6);
}

.queue-vote {
  padding: 4px;
  width: 24px;
  height: 24px;
  opacity: 0.5;
}

.queue-voted {
  /* background: #000000; */
}

</style>
