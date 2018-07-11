<template>
  <div class="users-table">
    <div class="users-title">Room Users:</div>
    <div v-for="user in getUsersList" :key="user">
      <UserListItem :user="user" />
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
    width: 40vw;
    text-align: left;
    font-size: 1.5em;
  }

  .users-title {
    color: #6495ed;
  }

  .current-user {
    text-align: center;
  }

</style>
