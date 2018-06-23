<template>
  <div class="login">
    <h1 v-on:click="loginSpot" >Login with Spotify</h1>
  </div>
</template>

<script>
import axios from 'axios';

function getLogin() {
  return {
    method: 'GET',
    url: '/auth/spot',
  };
}


export default {
  name: 'Login',
  methods: {
    loginSpot() {
      console.log('Trying to login');
      axios(getLogin());
    },
    authSpot() {
      this.$router.push({ path: '/auth/spotify' });
    },

  },
};
</script>

<style scoped>
h1 {
  font-family: 'Montserrat', sans-serif;
  align: center;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  font-size: 2vw;
  font-weight: 600;
  text-align: center;
  border: 2px solid #fff;
  border-radius: 200px;
  padding: 16px 48px 18px;
  width: 30%;
}
h1:hover {
  color: #1ed760;
  background-color: #ffffff;
}

</style>
