<template>
  <div id="app">
    <ul class="menu-container">
      <li class="menu-item topbar-item" v-on:click="homeRoute">Party Pooper</li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

  methods: {
    homeRoute() {
      this.$store.commit('setJoining', false);
      this.$router.push({ path: '/' });
    },

    loginRoute() {
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Kalam:400,700");
@import url("https://fonts.googleapis.com/css?family=Roboto");

html {
  height: 100%;
  background: #111
}

body{
  margin: 0;
  font-family: Roboto;
}

h1 {
  font-family: "Kalam";
  color: #fff;
  text-align: center;
  font-size: 8vw;
  margin: 2px;
  animation: shadow 2s infinite alternate;
}

@keyframes shadow {
  0% {
    text-shadow: 3px 3px #ff1493;
  }
  100% {
    text-shadow: 3px 3px #0ff;
  }
}

.menu-container {
  list-style-type: none;
  text-align: center;
  padding: 0;
  margin: 0;
  overflow: hidden;
  background: transparent;
}

.menu-item {
  display: block;
  color: #fff;
}

.topbar-item {
  float: left;
  font-size: 20px;
  padding: 8px;
  margin: 5px;
  border-radius: 5px;
}

.menu-item:hover {
  color: #db7095;
  background: #fff;
  cursor: pointer;
}
</style>
