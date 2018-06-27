<template>
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
  YO YO USER # {{ $store.state.userName }}
  </div>
  <div>
    TOTAL VOTES: {{votes}}
  </div>
  <div>
    YOUR CURRENT VOTE: {{userVoted}}
  </div>
  <div>ILL:
  <button v-on:click = "userVote()">
    UpVote
  </button>
  </div>
  <div>WEAK:
  <button v-on:click = "downVote()">
    DownVote
  </button>
  </div>
  <button v-on:click = "checkData()">
    Check Data
  </button>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VueSocketio from 'vue-socket.io';
import Player from './Player.vue';

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
    if (!this.$store.state.userName) {
      this.$store.commit('setHost');
      const sessionInfo = await axios.get('/auth/loggedin');
      this.$store.commit('setUserName', sessionInfo.data.username);
      axios(roomOptions('create', { roomId: this.roomId, userName: sessionInfo.data.username }));
    }

    this.getMembers();

    this.joinRoom();
    this.getVotes();
  },

  components: {
    Player,
  },

  sockets: {
    connect() {
      this.connected = true;
    },
    disconnect() {
      this.connected = false;
    },
    voteUpdate(count) {
      console.log('votes updated: ', count);
      this.votes = count.vote;
    },
    newComer(newb) {
      // eslint-disable-next-line
      const alertMsg = 'USER: ' + newb + ' HAS ARRIVED!';
      // eslint-disable-next-line
      // alert(alertMsg);
    },
    weak() {
      // eslint-disable-next-line
      alert('THIS SONG IS TRASH');
      // Trigger skip from routes / player / next.js
    },
  },

  methods: {
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
      console.log('room: ', this.room, 'votes: ', this.votes, 'user: ', this.$store.state.userName);
    },
    joinRoom() {
      console.log('Joining Room: ', this.room);
      // Add the user: username to the object once passed
      this.$socket.emit('join room', { user: this.$store.state.userName, room: this.room });
    },
    getVotes() {
      this.$socket.emit('get count', this.room);
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
