<template>
  <ul class="menu-container main-menu">
    <li class="join-header">
      Username:
    </li>
    <li>
      <input type="text" class="join-input" v-on:keyup.enter="submitName" v-model="userName" />
    </li>
    <li class="join-error">
      {{ userNameError }}
    </li>
    <li class="menu-item join-item" v-on:click="submitName">
      Join
    </li>
  </ul>
</template>

<script>

export default {
  name: 'NameEntry',

  data() {
    return {
      userName: '',
      userNameError: '',
    };
  },

  props: {
    joinRoom: { type: Function, required: true },
  },

  methods: {
    submitName() {
      this.userNameError = '';

      if (this.userName.length > 16) {
        this.userNameError = 'Username must be under 16 characters';
      }
      if (!/^[a-z0-9]+$/i.test(this.userName)) {
        this.userNameError = 'Username can only use letters and numbers';
      }
      if (!this.userName.length) {
        this.userNameError = 'Enter a username';
      }
      if (!this.userNameError) {
        this.$store.commit('setUserName', this.userName);
        this.joinRoom(this.userName);
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
