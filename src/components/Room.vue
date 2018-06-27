<template>
  <div class="room" align="center">
    <h2>Room {{ roomId }}</h2>
    <Player />
  <div>
  YO YO USER #: {{tempUser}}
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
import Player from './Player.vue';
// eslint-disable-next-line
import VueSocketio from 'vue-socket.io';

Vue.use(VueSocketio, 'http://localhost:8083');

const tempUserId = Math.floor((Math.random() * 10) + 1);
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
      tempUser: tempUserId,
      userVoted: 'Neutral',
    };
  },
  async created() {
    await this.joinRoom();
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
      alert(alertMsg);
    },
    weak() {
      // eslint-disable-next-line
      alert('THIS SONG IS TRASH');
      // Trigger skip from routes / player / next.js
    },
  },
  methods: {
    userVote() {
      this.$socket.emit('vote', { user: this.tempUser, room: this.room });
      this.userVoted = 'ILL';
    },
    checkData() {
      console.log('room: ', this.room, 'votes: ', this.votes, 'user: ', this.tempUser);
    },
    joinRoom() {
      console.log('Joining Room: ', this.room);
      // Add the user: username to the object once passed
      this.$socket.emit('join room', { user: this.tempUser, room: this.room });
    },
    getVotes() {
      this.$socket.emit('get count', this.room);
    },
    downVote() {
      this.$socket.emit('down', { user: this.tempUser, room: this.room });
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
</style>
