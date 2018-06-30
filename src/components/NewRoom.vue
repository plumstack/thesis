<template>
  <div class="room" align="center">
    <h2>Room {{ roomId }}</h2>
    <div class="content">
      <Player class="content-item" :isHost="isHost"
      :roomId="roomId" :getInfoPressed="getInfoPressed" :playerInfo="playerInfo" />
    </div>
    <table class="members-table">
      <p class="username">Username: {{ username }}</p>
      <tr>
        <th>Room Members</th>
      </tr>
      <tr v-for="(member, ind) in members" :key="ind">
        <td>{{ member }}</td>
      </tr>
    </table>
    <ul class="menu-container voting-menu">
      <!-- <li class="menu-item voting-item vote-up" v-on:click="upvote">Upvote</li>  -->
      <li class="menu-item voting-item vote-down" v-on:click="skip">Skip</li>
      <li class="voting-item score">Track Score: {{ votes }}</li>
    </ul>
    <Search :searchInput="searchInput" :searchRes="searchRes" :queue="queue" />
  </div>
</template>

<script>
import Vue from 'vue';
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
      searchRes: {},
      playerInfo: {},
      vote: 0,
      votes: 0,
    };
  },
  sockets: {
    memberListUpdate(members) {
      this.members = Object.values(members);
    },
    searchResponse(results) {
      this.searchRes = JSON.parse(results).tracks.items;
    },
    infoResponse(results) {
      this.playerInfo = results;
    },
    queueUpdate(queue) {
      console.log(queue, typeof queue);
    },
  },
  methods: {
    joinRoom() {
      this.$socket.emit('joinRoom', { user: this.username, room: this.room });
    },
    createRoom() {
      this.$socket.emit('createRoom', { user: this.username, room: this.room });
      this.isHost = true;
    },
    searchInput(search) {
      this.$socket.emit('searchInput', { user: this.username, room: this.room, search });
    },
    getInfoPressed() {
      this.$socket.emit('getInfo', { room: this.room });
    },
    upvote() {
      this.$socket.emit('upvote', { room: this.room, user: this.username });
    },
    skip() {
      this.$socket.emit('skipVote', { room: this.room, user: this.username, trackid: this.playerInfo.item.id });
    },
    queue(song) {
      this.$socket.emit('queue', { room: this.room, user: this.username, song });
    },
  },
  mounted() {
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

.voting-menu {
  display: inline-block;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 15px;
}

.voting-item {
  display: inline-block;
  font-weight: 700;
  padding: 10px;
  margin: 10px 10px;
  font-size: 1.5vw;
  border-radius: 10px;
}

.vote-up {
  background: #5cd65c;
}

.vote-down {
  background: #f66;
}

.score {
  color: #000;
  background: transparent;
}

.vote-up:hover {
  color: #db7095;
}
.vote-down:hover {
  color: #daa360;
}

.members-table {
  font-size: 1.25vw;
  position: absolute;
  text-align: center;
  top: 5%;
  right: 8%;
  color: #fff;
}
</style>
