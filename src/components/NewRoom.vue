<template>
  <div class="room-container">
    <div class="room-title"><h2 >Room: {{ getRoomID }}</h2></div>
    <NameEntry v-if="!getUsername" @joinRoomClicked='onJoinRoom'/>
    <div class="room" align="center" v-else>
      <Player :currentlyPlaying="currentlyPlaying" />
      <SkipVoter v-if="currentlyPlaying" @skipVote="onSkipVote" :currentSkipVotes="currentSkipVotes" />
      <Queue v-if="view === 'Queue'" @queueVote="onQueueVote" :currentQueue="currentQueue"/>
      <Search v-if="view === 'Search'" @songSearch="onSongSearch"
      @queueSong="onQueueSong" :searchResults="searchResults" :currentQueue="currentQueue"/>
      <UserList v-if="view === 'Users'"/>
      <div class = "bar-margin"></div>
      <BottomBar @changeView="onChangeView" :view="view"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Player from './Player.vue';
import Search from './Search.vue';
import Queue from './Queue.vue';
import UserList from './UserList.vue';
import NameEntry from './NameEntry.vue';
import SkipVoter from './SkipVoter.vue';
import BottomBar from './BottomBar.vue';

export default {
  name: 'Room',
  components: {
    Player,
    Search,
    Queue,
    UserList,
    NameEntry,
    SkipVoter,
    BottomBar,
  },
  data() {
    return {
      view: 'Queue',
      searchResults: [],
      currentQueue: [],
      currentlyPlaying: null,
      currentSkipVotes: 0,
      scores: [],
    };
  },
  computed: mapGetters(['getUsername', 'getRoomID', 'getUsersList']),
  methods: {
    ...mapActions(['updateUsername', 'usernameVerify', 'leaveRoom', 'updateRoomID', 'updateUserList']),
    onChangeView(newView) {
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
      this.$socket.emit('skipVote', { roomID: this.getRoomID, userCount: this.getUsersList.length });
    },
    onJoinRoom() {
      this.$socket.emit('joinRoom', { username: this.getUsername, roomID: this.getRoomID });
    },
    songSearchResponse(searchResults) {
      this.searchResults = JSON.parse(searchResults).tracks.items;
    },
    updateAll({
      newQueue,
      newUserList,
      currentlyPlaying,
      skipVotes,
    }) {
      this.currentQueue = newQueue;
      this.currentSkipVotes = skipVotes || this.currentSkipVotes;
      this.currentlyPlaying = currentlyPlaying;
      this.updateUserList(newUserList);
      if (this.currentlyPlaying && this.currentlyPlaying.item.id !== currentlyPlaying.item.id) this.resetSkip();
    },
    updateQueue(newQueue) {
      this.currentQueue = newQueue;
    },
    getUpdatedUserList(newUserList) {
      this.updateUserList(newUserList);
    },
  },
  mounted() {
    this.$socket.on('songSearchResponse', this.songSearchResponse);
    this.$socket.on('updateAll', this.updateAll);
    this.$socket.on('updateQueue', this.updateQueue);
    this.$socket.on('updateUserList', this.getUpdateUserList);
    this.$socket.on('reconnect', () => {
      this.$socket.emit('reconnectClient', { roomID: this.getRoomID, username: this.getUsername });
    });

    if (this.$route.query.host) {
      this.updateUsername(this.$route.query.username);
      this.updateRoomID(this.$route.path.slice(-5));
      this.$socket.emit('createRoom', { username: this.getUsername, roomID: this.getRoomID });
    } else {
      this.updateRoomID(this.$route.path.slice(-5));
      this.$socket.emit('getUserList', { roomID: this.getRoomID });
    }
  },
};
</script>

<style scoped>
h2 {
  color: #ffcce7;
  font-size: 2em;
  padding: 1.2vh 3vh;
  animation: flicker 10s linear infinite;
}

@keyframes flicker {
  0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
    opacity: 1;
    text-shadow: 0 0 2em #fff, 0 0 1em #ff1493;
  }
  20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
    opacity: 0.4;
    text-shadow: none;
  }
}

.room-container {
  text-align: center;
}

.room-title {
  display: inline-block;
  text-align: center;
  margin-top: 2vh;
  margin-bottom: 1vh;
  border: 4px solid #fff;
  border-radius: 8vh;
  box-shadow: 0 0 1.5em #fff, 0 0 .8em #0ff, inset 0 0 1.5em #fff, inset 0 0 .8em #0ff;
}
</style>
