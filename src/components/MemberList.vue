<template>
  <div class="members-table">
      <table>
      <p class="current-user">You: <span class="highlight">{{ getUsername }}</span> </p>
      <tr>
        <th class="members-title">Room Members</th>
      </tr>
      <tr v-for="member in getUsersList" :key="member">
        <td>
          <MemberListItem :member="member" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MemberListItem from './MemberListItem.vue';

export default {
  name: 'MemberList',
  components: { MemberListItem },
  computed: mapGetters(['getUsersList', 'getUsername']),
};
</script>

<style scoped>
  .members-table {
    margin: auto;
    margin-top: .25vh;
    width: 100%;
    color: white;
    font-size: 4vw;
  }
  .highlight {
    color: #08f;
    text-align: center;
  }
  .members-title {
    color: #08f;
  }
  .current-user {
    text-align: center;
  }

</style>
