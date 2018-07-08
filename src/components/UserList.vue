<template>
<div>
      <table class="members-table">
      <p class="username">Username: {{ getUsername}}</p>
      <tr>
        <th>Room Members</th>
      </tr>
      <tr v-for="member in getUsersList" :key="member">
        <td>{{ member }}</td>
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

<style>

</style>
