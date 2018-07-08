<template>
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item song-title">{{ track.name }}
          <div class="track-item song-info-item">{{ track.artists[0].name }}</div>
        </div>
        <div class="queue-button" @click="onQueueUpvote(track)">
          <img src="../assets/queueUp.svg" class="queue-vote" :class='{ voted: vote === 1}' />
        </div>
        <div class="queue-button" @click="onQueueDownvote(track)">
          <img src="../assets/queueDown.svg" class="queue-vote" :class='{ voted: vote === -1}' />
        </div>
      </div>
</template>

<script>
export default {
  name: 'QueueItem',
  props: ['track'],
  data() {
    return {
      vote: 0,
    };
  },
  methods: {
    onQueueDownvote(track) {
      if (this.vote !== -1) {
        this.vote = -1;
        this.$emit('queueVote', track, this.vote);
      } else {
        this.vote = 0;
        this.$emit('queueVote', track, 1);
      }
    },
    onQueueUpvote(track) {
      if (this.vote !== 1) {
        this.vote = 1;
        this.$emit('queueVote', track, this.vote);
      } else {
        this.vote = 0;
        this.$emit('queueVote', track, -1);
      }
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
</style>
