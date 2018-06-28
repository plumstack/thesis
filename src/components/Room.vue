<template>
  <div>
    <div class="room" align="center">
      <h2>Room {{ roomId }}</h2>
      <div class="content">
        <Player class="content-item" :roomId="roomId"/>
        <table class="content-item members-table">
          <tr>
            <th>Room Members</th>
          </tr>
          <tr v-for="(member, ind) in members" :key="ind">
            <td>{{ member }}</td>
          </tr>
        </table>
      </div>
      <div>
        User: {{ $store.state.userName }}
      </div>
      <div>
        Host: {{ $store.state.isHost }}
      </div>
      <div>
        TOTAL VOTES: {{votes}}
      </div>
      <div>
        YOUR CURRENT VOTE: {{ userVoted }}
      </div>
      <div>
        ILL:
        <button v-on:click = "userVote()">
          UpVote
        </button>
      </div>
      <div>
        WEAK:
        <button v-on:click = "downVote()">
          DownVote
        </button>
        <button v-on:click = "checkData()">
        Check Data
      </button>
      </div>
    </div>
    <Search />
  </div>
</template>

<script>

import Vue from 'vue';
import axios from 'axios';
import VueSocketio from 'vue-socket.io';

import Player from './Player.vue';
import Search from './Search.vue';

// Injects dependencies through middleware:
Vue.use(VueSocketio, 'http://localhost:8083');

const roomUrl = '/dash/room/';
function roomOptions(meth, body) {
  return {
    method: 'POST',
    url: `${roomUrl}${meth}`,
    data: body,
  };
}

export default {
  name: 'Room',

  props: [
    'roomId',
  ],

  data() {
    return {
      room: this.roomId,
      votes: 'LOADING',
      connected: false,
      userVoted: 'Neutral',
      members: [],
    };
  },
  async created() {
    console.log('Room.Vue - creating:', this.roomId);
    await this.joinRoomVue();
    this.getMembers();
    this.getVotes();
    if (!this.$store.state.userName) {
      this.$store.commit('setHost');
      const sessionInfo = await axios.get('/auth/loggedin');
      this.$store.commit('setUserName', sessionInfo.data.username);
      axios(roomOptions('create', { roomId: this.roomId, userName: sessionInfo.data.username }));
    }
  },

  components: {
    Player,
    Search,
  },

  sockets: {
    connect() {
      console.log('Sockets: connecting');
      this.connected = true;
    },
    disconnect() {
      console.log('Sockets: disconnect:', this.tempUser);
      this.connected = false;
    },
    voteUpdate(count) {
      console.log('votes updated: ', count);
      this.votes = count.vote;
    },
    newComer(newb) {
      console.log('USER: ', newb, ' HAS ARRIVED!');
    },
    weak() {
      console.log('THIS SONG IS TRASH');
    },
  },

  methods: {
    // joinRoomVue be refactored into sockets: connect()
    // But error is happening - socket is connecting from Splash.vue
    joinRoomVue() {
      const userData = {
        user: this.$store.state.userName,
        room: this.room,
        host: this.$store.state.isHost,
      };
      console.log('Joining Room: ', userData);
      this.$socket.emit('join room', userData);
    },
    async getMembers() {
      const members = await axios(roomOptions('members', { roomId: this.roomId }));
      console.log('MEMBERS: ', members);
      this.members = members.data;
    },
    userVote() {
      this.$socket.emit('vote', { user: this.$store.state.userName, room: this.room });
      this.userVoted = 'ILL';
    },
    checkData() {
      console.log('Client Data\n room: ', this.room, 'votes: ', this.votes, 'user: ', this.$store.state.userName);
      this.$socket.emit('check data');
    },
    getVotes() {
      this.$socket.emit('get count', this.room);
    },
    joinRoom() {
      console.log('Joining Room: ', this.room);
      // Add the user: username to the object once passed
      this.$socket.emit('join room', { user: this.$store.state.userName, room: this.room });
    },
    downVote() {
      this.$socket.emit('down', { user: this.$store.state.userName, room: this.room });
      this.userVoted = 'WEAK';
    },
  },
};
</script>

<style scoped>
  h2 {
    font-family: "Kalam";
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
