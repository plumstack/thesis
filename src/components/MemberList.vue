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
import MemberListItem from './MemberListItem.vue';

export default {
  name: 'MemberList',
  components: { MemberListItem },
  computed: mapGetters(['getUsersList', 'getUsername']),
};
</script>

<style>

</style>
