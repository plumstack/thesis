<template>
  <div class="room-container">
    <div class="room" align="center" v-if="$store.state.username">
      <h2>ROOM: <br>{{ roomId }}</h2>
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
        <td>{{ JSON.parse(member[0]) }}, Score: {{member[1]}}</td>
      </tr>
    </table>
    <ul class="menu-container voting-menu">
      <li class="menu-item voting-item vote-down" v-on:click="skip">Skip</li>
      <li class="voting-item score">Skip Votes: {{ votes }}</li>
    </ul>
    <ul class="menu-container bottom-toggle">
      <li class="menu-item toggle-button" v-bind:class="{ active: !$store.state.searching }"
        v-on:click="$store.commit('setSearching', false)">Queue</li>
      <li class="menu-item toggle-button" v-bind:class="{ active: $store.state.searching }"
        v-on:click="$store.commit('setSearching', true)">Search</li>
    </ul>
    <Queue v-if="!$store.state.searching" :curQueue="curQueue"
    :queueUpvote="queueUpvote" :queueDownvote="queueDownvote" />
    <Search v-if="$store.state.searching" :searchInput="searchInput" :searchRes="searchRes" :queue="queue" />
    </div>
    <NameEntry v-if="!$store.state.username" :joinRoom="joinRoom" />
  </div>
</template>

<script>
import Vue from 'vue';
import VueSocketio from 'vue-socket.io';

import Player from './Player.vue';
import Search from './Search.vue';
import Queue from './Queue.vue';
import NameEntry from './NameEntry.vue';

Vue.use(VueSocketio, 'http://localhost:8082');
export default {
  name: 'Room',
  props: ['roomId'],
  components: {
    Player,
    Search,
    Queue,
    NameEntry,
  },
  data() {
    return {
      room: this.roomId,
      username: this.$route.query.username || this.$store.state.username,
      connected: false,
      members: [],
      isHost: false,
      searchRes: {},
      playerInfo: {},
      vote: 0,
      votes: '0 / 1',
      curQueue: [],
      hasSkipped: false,
    };
  },
  sockets: {
    memberListUpdate(members) {
      this.members = members.members;
      const parsed = members.queue.map((track) => JSON.parse(track));
      this.curQueue = parsed;
    },
    searchResponse(results) {
      this.searchRes = JSON.parse(results).tracks.items;
    },
    infoResponse(results) {
      if (this.playerInfo.item && this.playerInfo.item.id !== results.item.id) {
        this.hasSkipped = false;
        this.votes = `0 / ${Math.floor(this.members.length)}`;
      }
      this.playerInfo = results;
    },
    queueUpdate(queue) {
      const parsed = queue.map((track) => JSON.parse(track));
      this.curQueue = parsed;
      setTimeout(this.getInfoPressed, 1000);
    },
    skip(skipStatus) {
      this.votes = `${skipStatus.skips} / ${Math.floor(this.members.length)}`;
    },
  },
  methods: {
    joinRoom(newUser) {
      const username = this.username || newUser;
      if (username) {
        this.username = username;
        this.$socket.emit('joinRoom', { user: username, room: this.room });
        this.$socket.emit('getInfo');
      }
    },
    createRoom() {
      this.$socket.emit('createRoom', { user: this.username, room: this.room });
      this.isHost = true;
      this.$socket.emit('getInfo', { room: this.room });
      this.$socket.emit('getQueue', { room: this.room });
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
      if (!this.hasSkipped) {
        this.$socket.emit('skipVote', {
          room: this.room,
          user: this.username,
          trackid: this.playerInfo.item.id,
        });
      }
      this.hasSkipped = true;
    },
    queue(song) {
      this.$store.commit('setSearching', false);
      this.$socket.emit('queue', { room: this.room, user: this.username, song });
    },
    queueUpvote(song) {
      this.$socket.emit('queueUpvote', { room: this.room, user: this.username, song });
    },
    queueDownvote(song) {
      this.$socket.emit('queueDownvote', { room: this.room, song });
    },
  },
  mounted() {
    if (this.$route.query.host) {
      this.$store.commit('setUserName', this.$route.query.username);
      return this.createRoom();
    }
    return this.joinRoom();
  },
};
</script>


<style scoped>
@import url(https://fonts.googleapis.com/css?family=Exo+2:200i);

h2 {
  /* Base font size */
  font-size: 10px;
  /* Set neon color */
  --neon-text-color: #f40;
  --neon-border-color: #08f;
  font-family: 'Exo 2', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: .8vh;
  font-size: 1.5rem;
  font-weight: 150;
  font-style: italic;
  color: rgb(255, 225, 225);
  padding: 1rem 2rem 1rem 2rem;
  border: 0.4rem solid rgb(223, 250, 255);
  border-radius: 2rem;
  animation: flicker 20s infinite alternate;
  width: 20vw;
}
h2::-moz-selection {
  background-color: var(--neon-border-color);
  color: var(--neon-text-color);
}
h2::selection {
  background-color: var(--neon-border-color);
  color: var(--neon-text-color);
}
h2:focus {
  outline: none;
}
/* Animate neon flicker */
@keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
        text-shadow:
            -0.2rem -0.2rem 1rem rgb(255, 134, 134),
            0.2rem 0.2rem 1rem rgb(255, 134, 134),
            0 0 2rem var(--neon-text-color),
            0 0 4rem var(--neon-text-color),
            0 0 6rem var(--neon-text-color),
            0 0 8rem var(--neon-text-color),
            0 0 10rem var(--neon-text-color);
        box-shadow:
            0 0 .5rem rgb(129, 205, 255),
            inset 0 0 .5rem rgb(129, 205, 255),
            0 0 2rem var(--neon-border-color),
            inset 0 0 2rem var(--neon-border-color),
            0 0 4rem var(--neon-border-color),
            inset 0 0 4rem var(--neon-border-color);
    }
    20%, 24%, 55% {
        text-shadow: none;
        box-shadow: none;
    }
}

.content {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.content-item {
  margin: 10px 10px;
}

.voting-menu {
  display: inline-block;
  border-radius: 2px;
}

.voting-item {
  display: inline-block;
  font-weight: 700;
  padding: 5px 10px 5px 10px;
  margin: 2vh 1vw 1vh 1vw;
  font-size: 3vw;
  border-radius: 10px;
}

.vote-up {
  background: #5cd65c;
}

.vote-down {
  background: #08f;
}

.score {
  color: #FFF;
  background: transparent;
}

.vote-up:hover {
  color: #db7095;
}

.vote-down:hover {
  color: #daa360;
}

.toggle-button {
  display: inline-block;
  font-size: 3vw;
  padding: 5px 10px;
  margin: 1vh 2vw .5vh 2vw;
  text-align: center;
  border-radius: 7px;
}

.toggle-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.members-table {
  font-size: 1.25vw;
  position: absolute;
  text-align: center;
  bottom: 5%;
  right: 8%;
  color: #fff;
}

.active {
  color: #08f;
  background: #fff;
}
</style>
