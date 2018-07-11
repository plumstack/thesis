<template>
      <div class="queue-track">
        <img :src="track.album.images[2].url" class="album-image">
        <div class="track-item song-info">{{ track.name }}
          <div class="song-artist">{{ track.artists[0].name }}</div>
        </div>
        <div class="queue-button" @click="onQueueUpvote(track)">
          <svg viewBox="0 0 129 129" class="queue-vote" :class="{ voted: getVote === 1}">
            <g transform="matrix(1 0 0 -1 0 129)">
            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,
            4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
            </g>
          </svg>
        </div>
        <div class="queue-button" @click="onQueueDownvote(track)">
          <svg viewBox="0 0 129 129" class="queue-vote" :class="{ voted: getVote === -1}">
            <path d="m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,
            4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z"/>
          </svg>
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
      console.log('HERE');
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

.queue-vote {
  fill: #fff;
  padding: 4px;
  width: 24px;
  height: 24px;
}

.voted {
  fill: #6495ed;
}
</style>
