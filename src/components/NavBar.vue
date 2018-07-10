<template>
  <ul class="menu-container navbar">
    <li class="menu-item topbar-item home" @click="leaveRoom">
      <img src="../assets/home.svg">
    </li>
    <li class="topbar-item username" v-if="getUsername">
      {{ getUsername }}
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'NavBar',
  computed: mapGetters(['getUsername']),
  methods: mapActions(['leaveRoom']),
};
</script>

<style scoped>
.navbar {
  background: #333;
}

.topbar-item {
  float: left;
  height: 5vh;
  padding: 0;
  margin: 3vw;
}

.home {
  width: 5vh;
  background: #333;
  border-radius: 50%;
  position: relative;
}

.home > img {
  height: 4vh;
  width: 4vh;
  position: absolute;
  top: calc(50% - 2vh);
  left: calc(50% - 2vh);
}

.username {
  font-family: "Comfortaa";
  float: right;
  font-size: 1.5em;
  padding: 0;
  line-height: 4vh;
  background: transparent;
}

@media screen and (min-width: 900px) {
  .navbar {
    background: transparent;
  }
  .topbar-item {
    height: 8vh;
    margin: 1vh;
  }

  .home {
    width: 8vh;
  }

  .username {
    line-height: 8vh;
    margin-right: 3vh;
  }

  .home > img {
    height: 6vh;
    width: 6vh;
    top: calc(50% - 3.5vh);
    left: calc(50% - 3vh);
  }
}
</style>
