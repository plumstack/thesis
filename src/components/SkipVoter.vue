<template>
<div>
  <ul class="menu-container voting-menu">
    <li class="menu-item controls-item" @click="onSkipVote">Skip</li>
    <li class="controls-item score">Skip Votes: {{ currentSkipVotes }}</li>
  </ul>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SkipVote',
  computed: mapGetters(['getSkipped']),
  props: {
    currentSkipVotes: Number,
  },
  methods: {
    onSkipVote() {
      this.voteToSkip();
      this.$emit('skipVote');
    },
    ...mapActions(['voteToSkip']),
  },
};
</script>

<style>
.controls-item {
  font-size: 1em;
  padding: 1vw 2vw;
}

.score {
  display: inline-block;
}
</style>
