<template>
  <div>
    <h1>Welcome to Spotify</h1>
    <ul class="menu-container main-menu">
      <li class="menu-item main-menu-item" v-on:click="buttonClick">Be a Host</li>
      <li class="menu-item main-menu-item" v-on:click="buttonClick">Go to a Room</li>
    </ul>
  </div>
</template>

<script>
import randomString from 'randomstring';

export default {
  name: 'HelloWorld',

  methods: {
    buttonClick() {
      this.room = randomString.generate({
        length: 5,
        capitalization: 'lowercase',
        readable: true,
      });
      this.$router.push({ path: `/room/${this.room}` });
    },
  },
};
</script>

<style scoped>
  .main-menu {
    margin: auto;
    width: 35%;
  }

  .main-menu-item {
    font-size: 3vw;
    font-weight: 700;
    padding: 12px;
    margin: 10px;
    border: 2px solid #fff;
    border-radius: 15px;
  }
</style>
