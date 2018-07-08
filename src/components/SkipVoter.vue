<template>
<div>
  <ul class="menu-container voting-menu">
    <li class="menu-item voting-item vote-down" @click="onSkipVote">Skip</li>
    <li class="voting-item score">Skip Votes: {{ currentSkipVotes }}</li>
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

</style>
