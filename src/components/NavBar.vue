<template>
  <ul class="menu-container navbar">
    <li class="menu-item topbar-item home" v-on:click="homeRoute">
      <img src="../assets/home.svg">
    </li>
  </ul>
</template>

<script>

export default {
  name: 'NavBar',

  methods: {
    homeRoute() {
      this.$store.commit('setJoining', false);
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<style>
.topbar-item {
  float: left;
  height: 3.5vw;
  padding: 1vw;
  margin: 1vw;
}

.home {
  width: 3.5vw;
  background: #333;
  border-radius: 50%;
  position: relative;
}

.home > img {
  height: 2vw;
  width: 2vw;
  position: absolute;
  top: calc(50% - 1vw);
  left: calc(50% - 1vw);
}

.home:hover {
  background: #0ff;
  transition: background-color 5s ease;
}
</style>
