<template>
  <div class="scores-table">
      <table>
      <tr>
        <th class="scores-title"> Scores: </th>
      </tr>
      <tr v-for="[username, score] in getUsersList" :key="username">
        <ScoreListItem :username="username" :score='score' />
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
  computed: mapGetters(['getUsersList', 'getUsername']),
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
