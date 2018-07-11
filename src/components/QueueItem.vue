<template>
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item song-info">{{ track.name }}
          <div class="song-artist">{{ track.artists[0].name }}</div>
        </div>
        <div class="queue-button" @click="onQueueUpvote(track)">
          <img src="../assets/queueUp.svg" class="queue-vote" :class='{ voted: getVote === 1}' />
        </div>
        <div class="queue-button" @click="onQueueDownvote(track)">
          <img src="../assets/queueDown.svg" class="queue-vote" :class='{ voted: getVote === -1}' />
        </div>
      </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

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
      const trackID = this.track.id;
      if (this.getVote !== -1) {
        this.voteOn({ trackID, vote: -1 });
        this.$emit('queueVote', track, -1);
      } else {
        this.voteOn(trackID, 1);
        this.$emit('queueVote', track, 1);
      }
    },
    async onQueueUpvote(track) {
      const trackID = this.track.id;
      if (this.getVote !== 1) {
        this.voteOn({ trackID, vote: 1 });
        this.$emit('queueVote', track, 1);
      } else {
        this.voteOn({ trackID, vote: -1 });
        this.$emit('queueVote', track, -1);
      }
    },
    ...mapActions(['voteOn', 'addToQueue']),
  },
  computed: {
    ...mapGetters(['getVotes']),
    getVote() {
      const res = this.getVotes;
      return res[this.track.id];
    },
  },
  created(trackID = this.track.id) {
    this.addToQueue(trackID);
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

.song-info {
  color: #6495ed;
  font-size: 1.2em;
}

.song-artist {
  color: #fff;
  font-size: .8em;
  margin-top: .5vh;
}

.queue-button {
  width: 32px;
  height: 32px;
  margin-right: 3px;
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
