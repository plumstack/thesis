<template>
  <div class="scores-table">
      <table>
      <p class="current-user">You: <span class="highlight">{{ getUsername }}</span> </p>
      <tr>
        <th class="scores-title"> Scores: </th>
      </tr>
      <tr v-for="score in getScores" :key="score">
        <ScoreListItem :score="score" />
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ScoreListItem from './ScoreListItem.vue';

export default {
  name: 'ScoreList',
  components: { ScoreListItem },
  computed: mapGetters(['getScores', 'getUsername']),
};
</script>

<style scoped>
  .scores-table {
    margin: auto;
    margin-top: 1vh;
    margin-bottom: 2vh;
    width: 100%;
    color: white;
    font-size: 4vw;
  }
  .highlight {
    color: #08f;
    text-align: center;
  }
  .scores-title {
    color: #08f;
    margin-top: 1vh;
    font-size: 4vh;
  }
  .current-user {
    text-align: center;
  }

</style>
