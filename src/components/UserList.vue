<template>
  <div class="members-table">
      <table>
      <tr>
        <th class="members-title">Room Members</th>
      </tr>
      <tr v-for="user in getUsersList" :key="user">
        <td>
          <UserListItem :user="user" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserListItem from './UserListItem.vue';

export default {
  name: 'UserList',
  components: { UserListItem },
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
