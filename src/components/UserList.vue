<template>
  <div class="users-table">
    <div class="users-title">Scoreboard</div>
    <div v-for="[username, score] in getUsersList" :key="username">
      <UserListItem :username="username" :score="score" />
    </div>
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
  .users-table {
    display: inline-block;
    width: 45vw;
    text-align: left;
    font-size: 1.5em;
  }

  .users-title {
    color: #6495ed;
    font-size: .8em;
    margin-bottom: .5vh;
  }

  .current-user {
    text-align: center;
  }
</style>
