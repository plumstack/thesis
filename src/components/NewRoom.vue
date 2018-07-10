<template>
  <div class="room-container">
    <h2 class="room-title">ROOM {{ getRoomID }}</h2>
    <NameEntry v-if="!getUsername"/>
    <div class="room" align="center" v-else>
        <Player class="content-item" :currentlyPlaying="currentlyPlaying"/>
        <SkipVoter @skipVote="onSkipVote" :currentSkipVotes="currentSkipVotes" />
    </div>
    <Queue v-if="view === 'Queue'"
      @queueVote="onQueueVote"
      :currentQueue="currentQueue"/>
    <Search v-if="view === 'Search'"
      @songSearch="onSongSearch" @queueSong="onQueueSong"
      :searchResults="searchResults" />
    <UserList v-if="view === 'Users'"/>
    <div class = "bar-margin"></div>
    <BottomBar @changeView="onChangeView" :view="view"/>
  </div>
</template>

<script>
import Vue from 'vue';
import VueSocket from 'vue-socket.io';
import { mapGetters, mapActions } from 'vuex';

import Player from './Player.vue';
import Search from './Search.vue';
import Queue from './Queue.vue';
import UserList from './UserList.vue';
import NameEntry from './NameEntry.vue';
import SkipVoter from './SkipVoter.vue';
import BottomBar from './BottomBar.vue';

const SERVER_URL = 'http://localhost:8082';

Vue.use(VueSocket, SERVER_URL);

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
  },
  sockets: {
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
    },
    updateQueue(newQueue) {
      this.currentQueue = newQueue;
    },
    updateUserList(newUserList) {
      this.updateUserList(newUserList);
    },
  },
  created() {
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
@import url(https://fonts.googleapis.com/css?family=Exo+2:200i);

h2 {
  font-size: 2.5em;
  font-style: italic;
  font-family: 'Exo 2', sans-serif;
  font-weight: 200;
  padding: 1.5vh 2vh;
  border: 5px solid rgb(223, 250, 255);
  border-radius: 30px;
  animation: flicker 20s infinite alternate;
  --neon-text-color: #f40;
  --neon-border-color: #08f;
}

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

.room-container {
  text-align: center;
}

.room-title {
  display: inline-block;
  text-align: center;
  margin-top: 1.5vh;
  margin-bottom: .5vh;
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

.vote-up:hover {
  color: #db7095;
}

.vote-down:hover {
  color: #daa360;
}

.score {
  color: #FFF;
  background: transparent;
}

.bar-margin{
  height: 6vh;
}

</style>
