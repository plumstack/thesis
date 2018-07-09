<template>
  <ul class="menu-container navbar">
    <li class="menu-item topbar-item home" @click="leaveRoom">
      <img src="../assets/home.svg">
    </li>
  </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'NavBar',
  methods: mapActions(['leaveRoom']),
};
</script>

<style>
.navbar {
  background: #333;
}

.topbar-item {
  float: left;
  height: 8vw;
  padding: 1vw;
  margin: 1vw;
}

.home {
  width: 8vw;
  background: #333;
  border-radius: 50%;
  position: relative;
}

.home > img {
  height: 7vw;
  width: 7vw;
  position: absolute;
  top: calc(50% - 3.5vw);
  left: calc(50% - 3.5vw);
}

@media screen and (min-width: 900px) {
  .navbar {
    background: transparent;
  }
  .topbar-item {
    height: 3.5vw;
  }

  .home {
    width: 3.5vw;
  }

  .home > img {
    height: 3vw;
    width: 3vw;
    top: calc(50% - 1.5vw);
    left: calc(50% - 1.5vw);
  }
}
</style>
