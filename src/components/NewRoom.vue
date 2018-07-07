<template>
<div class='room-container'>
  <h2>Room {{ getRoomID }}</h2>
  <div align='center' v-if='!getUsername'>
    <NameEntry />
  </div>
  <div class='room' align='center' v-else>
      <Player class='content-item' />
      <MemberList />
      <SkipVoter />
    <ul class='menu-container bottom-toggle'>
      <li class='menu-item toggle-button' :class='{ active: view === "Queue"}'
        @click="changeView('Queue')">Queue</li>
      <li class='menu-item toggle-button' :class='{ active: view === "Search"}'
        @click='changeView("Search")'>Search</li>
    </ul>
    <Queue v-if='view === "Queue"'
      @queueUpvote='onQueueUpvote' @queueDownvote='onQueueDownvote'
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
    onQueueUpvote() {},
    onQueueDownvote() {},
  },
  sockets: {
    songSearchResponse(searchResults) {
      this.searchResults = JSON.parse(searchResults).tracks.items;
    },
    updateAll({ newQueue, newMemberList }) {
      this.currentQueue = newQueue;
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
    return this.$socket.emit();
  },
};
</script>
