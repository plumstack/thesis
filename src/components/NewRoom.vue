<template>
<div>
  <Player v-if="isHost" roomId="roomId"></Player>
  <ul><li :key="member" v-for="member in members">{{ member  }}</li></ul>
</div>
</template>

<script>
import Vue from 'vue';
// import axios from 'axios';
import VueSocketio from 'vue-socket.io';

import Player from './Player.vue';
import Search from './Search.vue';

Vue.use(VueSocketio, 'http://localhost:8082');
export default {
  name: 'Room',
  props: ['roomId'],
  components: {
    Player,
    Search,
  },
  data() {
    return {
      room: this.roomId,
      username: this.$route.query.username || this.$store.state.userName,
      connected: false,
      members: [],
      isHost: false,
    };
  },
  sockets: {
    memberListUpdate(members) {
      this.members = Object.values(members);
    },
  },
  methods: {
    joinRoom() {
      console.log('joined room');
      this.$socket.emit('joinRoom', { user: this.username, room: this.room });
    },
    createRoom() {
      this.$socket.emit('createRoom', { user: this.username, room: this.room });
      this.isHost = true;
    },
  },
  async created() {
    if (this.$route.query.host) return this.createRoom();
    return this.joinRoom();
  },
};
</script>

<style scoped>
h2 {
  font-family: 'Kalam';
  color: #fff;
  text-align: center;
  font-size: 5vw;
  margin: 2px;
}

.content {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.content-item {
  margin: 10px 50px;
}

.members-table {
  color: #fff;
}
</style>
