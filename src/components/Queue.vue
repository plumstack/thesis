<template>
  <ul class="queue-list">
    <li class="queue-track-list" v-for="track in currentQueue" :key="track.id">
      <QueueItem :track="track" @queueVote="onQueueVote"/>
    </li>
  </ul>
</template>

<script>
import QueueItem from './QueueItem.vue';

export default {
  name: 'Queue',
  props: ['currentQueue'],
  components: {
    QueueItem,
  },
  methods: {
    onQueueVote(track, vote) {
      this.$emit('queueVote', track, vote);
    },
  },
};
</script>


<style scoped>
.queue-list {
  width: 100%;
}

.queue-track-list {
  background: #222;
}

.queue-track-list:nth-child(odd) {
  background: #333;
}
</style>
