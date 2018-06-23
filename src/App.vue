<template>
  <div id="app">
    <ul class="menu-container">
      <li class="menu-item topbar-item" v-on:click="homeRoute">Party Pooper</li>
    </ul>
    <router-view :joining="joining" :toggleJoin="toggleJoin"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',

  data() {
    return {
      joining: false,
    };
  },

  methods: {
    homeRoute() {
      this.joining = false;
      this.$router.push({ path: '/' });
    },

    loginRoute() {
      this.$router.push({ path: '/login' });
    },

    toggleJoin() {
      this.joining = true;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Kalam:400,700");
@import url("https://fonts.googleapis.com/css?family=Roboto");

html {
  height: 100%;
  background: linear-gradient(20deg,#db7095,#daa360);
}

body{
  margin: 0;
  font-family: Roboto;
}

h1 {
  font-family: "Kalam";
  color: #fff;
  text-shadow: 2px 2px #0ff;
  text-align: center;
  font-size: 8vw;
  margin: 2px;
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
}
</style>
