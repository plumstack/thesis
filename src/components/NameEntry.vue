<template>
  <ul class="menu-container main-menu">
    <li class="join-header main-menu-item">
      Enter a username:
    </li>
    <li class="username">
      <input type="text" id="username-input" class="text-input" v-model="username"
      placeholder="Username" @keyup.enter="submitName"/>
    </li>
    <li class="join-error">
      {{ usernameError }}
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NameEntry',
  data() {
    return {
      username: '',
      usernameError: '',
    };
  },

  mounted() {
    document.getElementById('username-input').focus();
  },

  methods: {
    async submitName() {
      this.usernameError = '';

      if (this.username.length > 12) {
        this.usernameError = 'Username must be under 12 characters';
      }
      if (!/^[a-z0-9]+$/i.test(this.username)) {
        this.usernameError = 'Username can only use letters and numbers';
      }
      if (!this.username.length) {
        this.usernameError = 'Enter a username';
      }
      if (await this.usernameVerify(this.username)) {
        this.usernameError = 'Username is taken.';
      }
      if (!this.usernameError) {
        this.updateUsername(this.username);
        this.$emit('joinRoomClicked');
      }
    },
    ...mapActions(['usernameVerify', 'updateRoomID', 'updateUsername']),
  },
  created() {
    this.updateRoomID(this.$route.path.slice(-5));
  },
};
</script>

<style scoped>
.main-menu {
  margin: auto;
  width: 100%;
}

.main-menu-item {
  width: 80%;
  font-family: "Comfortaa";
  font-size: 1.5em;
  font-weight: 700;
  padding: .5em;
  margin: .2em;
  border-radius: 15px;
}

.join-header {
  text-align: left;
}

.username {
  width: 100%;
}

.username > input {
  width: 80%;
}

.join-error {
  margin-top: .25em;
  color: #900;
}

.host-button {
  margin-top: .75em;
}

@media screen and (min-width: 900px) {
  .main-menu {
    width: 50%;
  }
}
</style>
