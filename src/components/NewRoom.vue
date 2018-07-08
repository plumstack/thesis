<template>
<div class='room-container'>
  <h2>Room {{ getRoomID }}</h2>
  <div align='center' v-if='!getUsername'>
    <NameEntry />
  </div>
  <div class='room' align='center' v-else>
      <Player class='content-item' :currentlyPlaying='currentlyPlaying'/>
      <MemberList />
      <SkipVoter @skipVote='onSkipVote' :currentSkipVotes='currentSkipVotes' />
    <ul class='menu-container bottom-toggle'>
      <li class='menu-item toggle-button' :class='{ active: view === "Queue"}'
        @click="changeView('Queue')">Queue</li>
      <li class='menu-item toggle-button' :class='{ active: view === "Search"}'
        @click='changeView("Search")'>Search</li>
    </ul>
    <Queue v-if='view === "Queue"'
      @queueVote='onQueueVote'
      :currentQueue='currentQueue'/>
    <Search v-else-if='view === "Search"'
      @songSearch='onSongSearch' @queueSong='onQueueSong'
      :searchResults='searchResults' />
  </div>
</div>
</template>

<script>
import Vue from 'vue';
import VueSocket from 'vue-socket.io';
import { mapGetters, mapActions } from 'vuex';

import Player from './Player.vue';
import Search from './Search.vue';
import Queue from './Queue.vue';
import MemberList from './MemberList.vue';
import NameEntry from './NameEntry.vue';
import SkipVoter from './SkipVoter.vue';

const SERVER_URL = 'http://localhost:8082';

Vue.use(VueSocket, SERVER_URL);

export default {
  name: 'Room',
  components: {
    Player,
    Search,
    Queue,
    MemberList,
    NameEntry,
    SkipVoter,
  },
  data() {
    return {
      view: 'Queue',
      searchResults: [],
      currentQueue: [],
      currentlyPlaying: {},
      currentSkipVotes: 0,
    };
  },
  computed: mapGetters(['getUsername', 'getRoomID', 'getUsersList']),
  methods: {
    ...mapActions(['updateUsername', 'usernameVerify', 'leaveRoom', 'updateRoomID', 'updateUserlist']),
    changeView(newView) {
      this.view = newView;
    },
    onSongSearch(query) {
      this.$socket.emit('songSearch', { roomID: this.getRoomID, query });
    },
    onQueueSong(songInfo) {
      this.$socket.emit('onQueueSong', { username: this.getUsername, roomID: this.getRoomID, songInfo });
    },
    onQueueVote(songInfo, vote) {
      this.$socket.emit('queueVote', { roomID: this.getRoomID, songInfo, vote });
    },
    onSkipVote() {
      this.$socket.emit('skipVote', { roomID: this.getRoomID, memberCount: this.getUsersList.length });
    },
  },
  sockets: {
    songSearchResponse(searchResults) {
      this.searchResults = JSON.parse(searchResults).tracks.items;
    },
    updateAll({
      newQueue,
      newMemberList,
      currentlyPlaying,
      skipVotes,
    }) {
      this.currentQueue = newQueue;
      this.currentSkipVotes = skipVotes || this.currentSkipVotes;
      this.currentlyPlaying = currentlyPlaying;
      this.updateUserlist(newMemberList);
    },
    updateQueue(newQueue) {
      this.currentQueue = newQueue;
    },
  },
  created() {
    if (this.$route.query.host) {
      this.updateUsername(this.$route.query.username);
      this.updateRoomID(this.$route.path.slice(-5));
      return this.$socket.emit('createRoom', { username: this.getUsername, roomID: this.getRoomID });
    }
    this.updateRoomID(this.$route.path.slice(-5));
    return this.$socket.emit('joinRoom', { username: this.getUsername, roomID: this.getRoomID });
  },
};
</script>

<style scoped>
h2 {
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

.toggle-button {
  display: inline-block;
  font-size: 1.5vw;
  padding: 5px 10px;
  margin: 5px;
  text-align: center;
  border-radius: 5px;
}

.toggle-button:hover {
  background: rgba(255, 255, 255, 0.5);
}

.members-table {
  font-size: 1.25vw;
  position: absolute;
  text-align: center;
  top: 5%;
  right: 8%;
  color: #fff;
}

.active {
  color: #db7095;
  background: #fff;
}
</style>