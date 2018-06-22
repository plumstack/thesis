<template>
  <div id="app">
    <h1>Welcome to Our App</h1>
    <button v-on:click="buttonClick">Go to a Room</button>
    <button v-on:click="loginRoute">Login</button>
    <button v-on:click="signupRoute">Sign Up</button>
    <router-view></router-view>
  </div>
</template>

<script>
import randomString from 'randomstring';

export default {
  name: 'app',

  data() {
    return {
      room: '',
    };
  },

  components: {
  },

  methods: {
    buttonClick() {
      this.room = randomString.generate({
        length: 5,
        capitalization: 'lowercase',
        readable: true,
      });
      this.$router.push({ path: `/room/${this.room}` });
    },
    loginRoute() {
      this.$router.push({ path: '/login' });
    },
    signupRoute() {
      this.$router.push({ path: '/signup' });
    }
  },
};
</script>

<style>
body {
  background: blue;
}

h1 {
  font-family: "Comic Sans MS";
  color: orange;
  text-align: center;
}
</style>
