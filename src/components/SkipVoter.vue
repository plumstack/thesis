<template>
<div>
  <ul class="menu-container skip-menu">
    <li v-if='!getSkipped' class="menu-item controls-item" @click="onSkipVote">Skip</li>
    <li v-if='getSkipped' class="menu-item controls-item" >Skipped</li>
    <li class="controls-item score">Skip Votes: {{ currentSkipVotes }} of {{ usersLength }}</li>
  </ul>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SkipVote',
  computed: {
    ...mapGetters(['getSkipped', 'getUsersList']),
    usersLength() {
      return Math.ceil(this.getUsersList.length * 0.6);
    },
  },
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
.skip-menu {
  margin-bottom: 2.5vh;
}

.controls-item {
  font-size: 1em;
  padding: 2vw 3vw;
}

.score {
  display: inline-block;
}
</style>
