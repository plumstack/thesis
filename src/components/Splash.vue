<template>
  <div>
    <h1>Welcome to Party Pooper</h1>
    <ul class="menu-container main-menu">
      <li class="menu-item main-menu-item" v-if="!$store.state.joining" v-on:click="$store.commit('setJoining', true)">
        Join a Room
      </li>
      <li class="menu-item main-menu-item" v-if="!$store.state.joining" v-on:click="hostRoom">
        <form id="loginForm" action="http://localhost:8082/auth/spotify" method="GET">
          Host a Room
        </form>
      </li>
      <li class="join-header" v-if="$store.state.joining">
        Username:
      </li>
      <li v-if="$store.state.joining">
        <input type="text" class="join-input" v-model="username" />
      </li>
      <li class="join-error" v-if="$store.state.joining">
        {{ usernameError }}
      </li>
      <li class="join-header" v-if="$store.state.joining">
        Room:
      </li>
      <li v-if="$store.state.joining">
        <input type="text" class="join-input" v-on:keyup.enter="joinRoom" v-model="joinRoomId" />
      </li>
      <li class="join-error" v-if="$store.state.joining">
        {{ roomError }}
      </li>
      <li class="menu-item join-item" v-if="$store.state.joining" v-on:click="joinRoom">
        Join
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'Splash',

  data() {
    return {
      username: '',
      joinRoomId: '',
      usernameError: '',
      roomError: '',
    };
  },

  methods: {
    hostRoom() {
      document.getElementById('loginForm').submit();
    },

    joinRoom() {
      this.roomError = '';
      this.usernameError = '';

      if (this.joinRoomId.length !== 5) {
        this.roomError = 'Room must be 5 characters';
      }
      if (this.username.length > 16) {
        this.usernameError = 'Username must be under 16 characters';
      }
      if (!/^[a-z0-9]+$/i.test(this.joinRoomId)) {
        this.roomError = 'Room only uses letters and numbers';
      }
      if (!/^[a-z0-9]+$/i.test(this.username)) {
        this.usernameError = 'Username can only use letters and numbers';
      }
      if (!this.joinRoomId) {
        this.roomError = 'Enter a room ID';
      }
      if (!this.username.length) {
        this.usernameError = 'Enter a username';
      }
      if (!this.usernameError && !this.roomError) {
        this.$store.commit('setUserName', this.username);
        this.$store.commit('setHost', false);
        this.$router.push({ path: `/room/${this.joinRoomId}` });
      }
    },
  },
};
</script>

<style scoped>
.main-menu {
  margin: auto;
  width: 40%;
}

.main-menu-item {
  font-size: 3vw;
  font-weight: 700;
  padding: 12px;
  margin: 10px;
  border: 2px solid #fff;
  border-radius: 15px;
}

.join-header {
  font-size: 2.5vw;
  color: #fff;
  text-align: left;
  margin-left: 15%;
  margin-top: 20px;
  margin-bottom: 0;
}

.join-input {
  overflow: auto;
  width: 75%;
  font-size: 3vw;
  font-weight: 700;
  color: #fff;
  padding: 5px;
  margin: 3px 10px 0px 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid #fff;
  border-radius: 15px;
}

.join-input:focus {
  outline: none;
  color: #db7095;
  background: #fff;
}

.join-item {
  font-size: 3vw;
  font-weight: 700;
  width: 20%;
  padding: 12px;
  margin: auto;
  margin-top: 15px;
  border: 2px solid #fff;
  border-radius: 15px;
}

.join-error {
  color: #900;
}
</style>
