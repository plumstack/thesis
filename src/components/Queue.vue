<template>
  <ul v-if="curQueue.length" class="queue-list">
    <li class="queue-header">
      <div class="queue-track">
        <div class="empty-image"></div>
        <div class="track-item"> <!-- Track --></div>
        <div class="queue-vote"></div>
        <div class="queue-vote"></div>
      </div>
    </li>
    <li class="queue-track-list" v-for="track in curQueue" :key="track.id">
      <QueueItem :track="track" :queueUpvote="queueUpvote" :queueDownvote="queueDownvote"/>
    </li>
  </ul>
</template>

<script>
import QueueItem from './QueueItem.vue';

export default {
  name: 'Queue',
  props: ['curQueue', 'queueUpvote', 'queueDownvote'],
  components: {
    QueueItem,
  },
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
  margin-right: 3px;
}
</style>
